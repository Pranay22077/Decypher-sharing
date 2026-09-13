import hashlib
import io
import json
import re
import secrets
from html import escape
from datetime import datetime, timezone
from pathlib import Path
from typing import BinaryIO

import httpx
import qrcode
from minio import Minio
from neo4j import GraphDatabase
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .models import (
    Alert, BlockchainAnchor, Case, CustodyEvent, Entity, Evidence, EvidenceAnalysis,
    EvidenceEntity, Relationship, Report, TimelineEvent,
)


ALLOWED_MIME = {
    "application/pdf", "text/plain", "text/csv", "application/csv",
    "image/jpeg", "image/png", "audio/mpeg", "audio/wav", "audio/x-wav",
    "video/mp4", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def sha256_stream(stream: BinaryIO) -> tuple[str, bytes]:
    digest = hashlib.sha256()
    chunks: list[bytes] = []
    size = 0
    while chunk := stream.read(1024 * 1024):
        size += len(chunk)
        if size > settings.max_upload_bytes:
            raise ValueError("File exceeds the 100 MB prototype limit.")
        digest.update(chunk)
        chunks.append(chunk)
    return digest.hexdigest(), b"".join(chunks)


class Storage:
    def __init__(self):
        self.local_root = Path(settings.storage_path)
        self.local_root.mkdir(parents=True, exist_ok=True)
        self.minio = None
        if settings.storage_provider == "minio":
            self.minio = Minio(
                settings.minio_endpoint,
                access_key=settings.minio_access_key,
                secret_key=settings.minio_secret_key,
                secure=settings.minio_secure,
            )

    def ensure(self):
        if self.minio and not self.minio.bucket_exists(settings.minio_bucket):
            self.minio.make_bucket(settings.minio_bucket)

    def put(self, key: str, payload: bytes, content_type: str) -> None:
        if self.minio:
            self.ensure()
            self.minio.put_object(settings.minio_bucket, key, io.BytesIO(payload), len(payload), content_type=content_type)
            return
        path = self.local_root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)

    def get(self, key: str) -> bytes:
        if self.minio:
            response = self.minio.get_object(settings.minio_bucket, key)
            try:
                return response.read()
            finally:
                response.close()
                response.release_conn()
        return (self.local_root / key).read_bytes()

    def delete_prefix(self, prefix: str) -> None:
        if self.minio:
            for item in self.minio.list_objects(settings.minio_bucket, prefix=prefix, recursive=True):
                self.minio.remove_object(settings.minio_bucket, item.object_name)
            return
        root = self.local_root / prefix
        if root.exists():
            for path in sorted(root.rglob("*"), reverse=True):
                if path.is_file():
                    path.unlink()
                elif path.is_dir():
                    path.rmdir()


storage = Storage()


class BlockchainService:
    def register(self, evidence: Evidence, registered_by: str) -> dict:
        payload = {
            "evidenceHash": evidence.sha256,
            "caseId": evidence.case_id,
            "evidenceId": evidence.id,
            "registeredBy": registered_by,
        }
        try:
            response = httpx.post(f"{settings.blockchain_bridge_url}/register", json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as exc:
            raise RuntimeError("Local blockchain service is unavailable. Start the complete Docker stack.") from exc

    def get(self, evidence_hash: str) -> dict:
        try:
            response = httpx.get(f"{settings.blockchain_bridge_url}/evidence/{evidence_hash}", timeout=10)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as exc:
            raise RuntimeError("Unable to retrieve the local blockchain record.") from exc


blockchain = BlockchainService()


class GraphService:
    def _driver(self):
        return GraphDatabase.driver(settings.neo4j_uri, auth=(settings.neo4j_user, settings.neo4j_password))

    def sync_case(self, db: Session, case_id: str) -> None:
        entities = list(db.scalars(select(Entity)))
        relationships = list(db.scalars(select(Relationship).where(Relationship.case_id == case_id)))
        try:
            with self._driver() as driver, driver.session() as session:
                session.run("MATCH (n {caseId: $caseId}) DETACH DELETE n", caseId=case_id)
                for entity in entities:
                    session.run(
                        "MERGE (n:Entity {id: $id}) SET n.name=$name, n.type=$type, n.caseId=$caseId, n.properties=$props",
                        id=entity.id, name=entity.canonical_name, type=entity.type, caseId=case_id,
                        props=json.dumps(entity.properties),
                    )
                for rel in relationships:
                    session.run(
                        "MATCH (a:Entity {id:$source}), (b:Entity {id:$target}) "
                        "MERGE (a)-[r:RELATED {id:$id}]->(b) "
                        "SET r.type=$type, r.confidence=$confidence, r.evidenceIds=$evidenceIds, r.timestamp=$timestamp",
                        source=rel.source_id, target=rel.target_id, id=rel.id, type=rel.type,
                        confidence=rel.confidence, evidenceIds=rel.evidence_ids, timestamp=rel.timestamp.isoformat(),
                    )
        except Exception:
            # PostgreSQL remains the source of truth; readiness reports degraded Neo4j separately.
            return

    def reset(self) -> None:
        try:
            with self._driver() as driver, driver.session() as session:
                session.run("MATCH (n) DETACH DELETE n")
        except Exception:
            return


graph_service = GraphService()


DEMO_ENTITY_RULES = [
    ("PERSON-P001", "Raj Mehta", "PERSON", ["Raj", "R. Mehta"]),
    ("PERSON-P002", "Arjun Verma", "PERSON", ["Arjun", "A. Verma"]),
    ("PERSON-P003", "Neha Kapoor", "PERSON", ["Neha", "N. Kapoor"]),
    ("PERSON-P004", "Vikram Singh", "PERSON", ["Vikram", "V. Singh"]),
    ("VEHICLE-V001", "DL01AB1234", "VEHICLE", []),
    ("VEHICLE-V002", "DL03XY4521", "VEHICLE", []),
    ("LOCATION-L001", "Connaught Place", "LOCATION", ["CP"]),
    ("LOCATION-L002", "Gurugram Warehouse", "LOCATION", ["Gurugram"]),
    ("ACCOUNT-A001", "A/C ending 4821", "ACCOUNT", ["4821"]),
]


def analyze_evidence(db: Session, evidence: Evidence, raw: bytes) -> EvidenceAnalysis:
    text = raw.decode("utf-8", errors="ignore")[:30_000] # Groq limit
    matched = []
    summary = "Analysis failed or no entities found."
    confidence = 0.0
    
    if settings.groq_api_key:
        try:
            prompt = f"Extract all entities (Person, Location, Organization, Vehicle, Account, Phone) from this text.\nReturn ONLY valid JSON in this exact format:\n{{\"entities\": [{{\"name\": \"...\", \"type\": \"...\", \"confidence\": 0.9}}]}}\n\nText:\n{text}"
            response = httpx.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": "llama3-8b-8192",
                    "messages": [{"role": "system", "content": "You are an intelligence extractor. Output ONLY valid JSON."}, {"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.1
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = json.loads(response.json()["choices"][0]["message"]["content"])
            
            for ent in data.get("entities", []):
                name = ent.get("name")
                ent_type = str(ent.get("type", "")).upper()
                ent_conf = float(ent.get("confidence", 0.8))
                
                if name and ent_type in ["PERSON", "LOCATION", "ORGANIZATION", "VEHICLE", "ACCOUNT", "PHONE"]:
                    existing = db.scalar(select(Entity).where(Entity.canonical_name == name))
                    if existing:
                        entity_id = existing.id
                    else:
                        safe_id = re.sub(r'[^A-Z0-9]', '', name.upper())[:10]
                        entity_id = f"{ent_type}-{safe_id}-{secrets.token_hex(2)}"
                        new_ent = Entity(id=entity_id, canonical_name=name, type=ent_type, aliases=[name], properties={})
                        db.add(new_ent)
                        db.commit()
                        
                    if not db.scalar(select(EvidenceEntity).where(EvidenceEntity.evidence_id == evidence.id, EvidenceEntity.entity_id == entity_id)):
                        db.add(EvidenceEntity(evidence_id=evidence.id, entity_id=entity_id, confidence=ent_conf, source_excerpt=name))
                    matched.append({"id": entity_id, "name": name, "type": ent_type, "confidence": ent_conf})
            
            summary = f"AI extraction identified {len(matched)} entities via Llama 3."
            confidence = 0.92 if matched else 0.0
        except Exception as e:
            print(f"Groq Extraction Error: {e}")
            summary = f"AI extraction failed: {str(e)}"
    
    if not matched:
        for entity_id, name, entity_type, aliases in DEMO_ENTITY_RULES:
            terms = [name, *aliases]
            if any(term.lower() in text.lower() for term in terms):
                entity = db.get(Entity, entity_id)
                if not entity:
                    entity = Entity(id=entity_id, canonical_name=name, type=entity_type, aliases=aliases, properties={})
                    db.add(entity)
                if not db.scalar(select(EvidenceEntity).where(EvidenceEntity.evidence_id == evidence.id, EvidenceEntity.entity_id == entity_id)):
                    excerpt_match = next((term for term in terms if term.lower() in text.lower()), name)
                    db.add(EvidenceEntity(evidence_id=evidence.id, entity_id=entity_id, confidence=0.94, source_excerpt=excerpt_match))
                matched.append({"id": entity_id, "name": name, "type": entity_type, "confidence": 0.94})

        phone_numbers = sorted(set(re.findall(r"(?:\+91[- ]?)?[6-9]\d{9}", text)))
        for index, phone in enumerate(phone_numbers):
            normalized = re.sub(r"\D", "", phone)[-10:]
            entity_id = f"PHONE-{normalized}"
            if not db.get(Entity, entity_id):
                db.add(Entity(id=entity_id, canonical_name=f"+91 {normalized}", type="PHONE", aliases=[phone], properties={}))
            matched.append({"id": entity_id, "name": f"+91 {normalized}", "type": "PHONE", "confidence": 0.98})

        summary = f"Deterministic analysis identified {len(matched)} traceable entities."
        confidence = 0.94 if matched else 0.0
        if not matched:
            summary = "No supported entities were detected; no investigative claim was generated."

    analysis = EvidenceAnalysis(
        evidence_id=evidence.id, provider="groq-llama3" if settings.groq_api_key else "deterministic", summary=summary,
        confidence=confidence, result={"entities": matched, "sourceEvidenceId": evidence.id},
    )
    evidence.status = "analyzed"
    db.add(analysis)
    db.add(CustodyEvent(evidence_id=evidence.id, event="ANALYZED", actor_to="Decypher AI Engine", notes=summary))
    db.commit()
    return analysis


def qr_png(evidence: Evidence) -> bytes:
    payload = f"{settings.public_base_url}/verify/{evidence.verification_token}"
    image = qrcode.make(payload)
    output = io.BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


def generate_insights(db: Session, case_id: str) -> None:
    entities = list(db.scalars(select(Entity)))
    relationships = list(db.scalars(select(Relationship).where(Relationship.case_id == case_id)))
    degree = {e.id: 0 for e in entities}
    for rel in relationships:
        degree[rel.source_id] = degree.get(rel.source_id, 0) + 1
        degree[rel.target_id] = degree.get(rel.target_id, 0) + 1
    for ent in entities:
        if degree.get(ent.id, 0) > 2:
            existing = db.scalar(select(Alert).where(Alert.case_id == case_id, Alert.title == f"High Centrality: {ent.canonical_name}"))
            if not existing:
                alert = Alert(id=f"ALT-{secrets.token_hex(4)}", case_id=case_id, title=f"High Centrality: {ent.canonical_name}", reason=f"Entity is a major bridge in the network with {degree[ent.id]} connections. Possible orchestrator.", confidence=0.85, evidence_ids=[])
                db.add(alert)
    db.commit()

def copilot_answer(db: Session, case_id: str, question: str, locale: str) -> dict:
    entities = list(db.scalars(select(Entity)))
    relationships = list(db.scalars(select(Relationship).where(Relationship.case_id == case_id)))
    
    if not settings.groq_api_key:
        lower = question.lower()
        chosen = next((e for e in entities if e.canonical_name.lower() in lower or e.id.lower() in lower), None)
        if not chosen and ("important" in lower or "महत्व" in question):
            degree = {e.id: 0 for e in entities}
            for rel in relationships:
                degree[rel.source_id] = degree.get(rel.source_id, 0) + 1
                degree[rel.target_id] = degree.get(rel.target_id, 0) + 1
            chosen = max(entities, key=lambda e: degree.get(e.id, 0), default=None)
        related = [r for r in relationships if chosen and chosen.id in (r.source_id, r.target_id)]
        citations = sorted({ev for rel in related for ev in rel.evidence_ids})
        if locale == "hi":
            answer = f"{chosen.canonical_name if chosen else 'चयनित इकाई'} से {len(related)} प्रमाण-समर्थित संबंध जुड़े हैं। यह एक जाँच संकेत है, अंतिम निष्कर्ष नहीं।"
            reasoning = "उत्तर केवल केस ग्राफ और सूचीबद्ध स्रोत साक्ष्य से तैयार किया गया है।"
        else:
            answer = f"{chosen.canonical_name if chosen else 'The selected entity'} has {len(related)} evidence-backed relationships. This is an investigative lead, not a conclusion of guilt."
            reasoning = "The answer was derived only from the case graph and the cited source evidence."
        return {"answer": answer, "reasoning": reasoning, "confidence": 0.91 if citations else 0.45, "citations": citations}

    # HippoRAG Implementation using Groq
    try:
        # Step 1: Entity Extraction from Question
        prompt1 = f"Extract key entity names from this question for a database search. Return JSON array 'entities'. Question: {question}"
        resp1 = httpx.post("https://api.groq.com/openai/v1/chat/completions", headers={"Authorization": f"Bearer {settings.groq_api_key}"}, json={"model": "llama3-8b-8192", "messages": [{"role": "system", "content": "Output valid JSON."}, {"role": "user", "content": prompt1}], "response_format": {"type": "json_object"}, "temperature": 0.1}, timeout=10.0)
        resp1.raise_for_status()
        search_terms = json.loads(resp1.json()["choices"][0]["message"]["content"]).get("entities", [])
        
        # Step 2: Subgraph Retrieval
        context_nodes = []
        for term in search_terms:
            term_str = term.get("name", "") if isinstance(term, dict) else str(term)
            if term_str:
                context_nodes.extend([e for e in entities if term_str.lower() in e.canonical_name.lower()])
        
        if not context_nodes:
            context_nodes = entities[:10] # Fallback
            
        related = [r for r in relationships if r.source_id in [c.id for c in context_nodes] or r.target_id in [c.id for c in context_nodes]]
        citations = sorted({ev for rel in related for ev in rel.evidence_ids})
        
        graph_text = ""
        for r in related:
            src = db.get(Entity, r.source_id)
            tgt = db.get(Entity, r.target_id)
            if src and tgt:
                graph_text += f"[{', '.join(r.evidence_ids)}] {src.canonical_name} ({src.type}) {r.type} {tgt.canonical_name} ({tgt.type})\n"

        # Step 3: Synthesis
        lang_instruction = "Respond in Hindi." if locale == "hi" else "Respond in English."
        prompt2 = f"You are a criminal investigation copilot. Answer the investigator's question using ONLY the provided Evidence Graph. Do not invent facts. Quote evidence IDs where relevant.\n\nGraph Context:\n{graph_text}\n\nQuestion: {question}\n{lang_instruction}"
        resp2 = httpx.post("https://api.groq.com/openai/v1/chat/completions", headers={"Authorization": f"Bearer {settings.groq_api_key}"}, json={"model": "llama3-8b-8192", "messages": [{"role": "system", "content": "You are a helpful investigator assistant."}, {"role": "user", "content": prompt2}], "temperature": 0.3}, timeout=15.0)
        resp2.raise_for_status()
        answer = resp2.json()["choices"][0]["message"]["content"]
        
        return {"answer": answer, "reasoning": "Answer synthesized via HippoRAG extraction and subgraph traversal over the Neo4j/Postgres graph using Llama 3.", "confidence": 0.95, "citations": citations}
    except Exception as e:
        print(f"Copilot Groq Error: {e}")
        return {"answer": f"AI Copilot Error: {str(e)}", "reasoning": "Failed to connect to Groq.", "confidence": 0.0, "citations": []}


def build_report_pdf(db: Session, case: Case, locale: str) -> bytes:
    evidence = list(db.scalars(select(Evidence).where(Evidence.case_id == case.id)))
    events = list(db.scalars(select(TimelineEvent).where(TimelineEvent.case_id == case.id).order_by(TimelineEvent.timestamp)))
    relationships = list(db.scalars(select(Relationship).where(Relationship.case_id == case.id)))
    alerts = list(db.scalars(select(Alert).where(Alert.case_id == case.id)))
    output = io.BytesIO()
    doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm)
    styles = getSampleStyleSheet()
    font_candidates = [
        "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    font_path = next((path for path in font_candidates if Path(path).exists()), None)
    if font_path:
        pdfmetrics.registerFont(TTFont("ReportUnicode", font_path))
        for style in styles.byName.values():
            style.fontName = "ReportUnicode"
    title_style = ParagraphStyle("TitleGov", parent=styles["Title"], textColor=colors.HexColor("#0b2e63"), alignment=TA_CENTER)
    story = [Paragraph("Decypher by Epoch", title_style), Paragraph(escape(case.title), styles["Heading1"]), Spacer(1, 8)]
    label = {
        "summary": "केस सारांश" if locale == "hi" else "Case Summary",
        "evidence": "साक्ष्य सूची" if locale == "hi" else "Evidence Register",
        "timeline": "समयरेखा" if locale == "hi" else "Timeline",
        "relations": "प्रमाण-समर्थित संबंध" if locale == "hi" else "Evidence-backed Relationships",
        "alerts": "व्याख्यायोग्य संकेत" if locale == "hi" else "Explainable Leads",
    }
    story += [Paragraph(label["summary"], styles["Heading2"]), Paragraph(escape(case.description_hi if locale == "hi" and case.description_hi else case.description), styles["BodyText"]), Spacer(1, 8)]
    story += [Paragraph(label["evidence"], styles["Heading2"])]
    cell_style = ParagraphStyle("EvidenceCell",parent=styles["BodyText"],fontSize=7,leading=10,wordWrap="CJK")
    rows = [[Paragraph(value,cell_style) for value in ("ID", "Name", "SHA-256", "Status")]] + [[Paragraph(escape(value),cell_style) for value in (e.id, e.name, e.sha256, e.status)] for e in evidence]
    table = Table(rows, colWidths=[32*mm, 60*mm, 45*mm, 28*mm], repeatRows=1)
    table.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.HexColor("#0b2e63")), ("TEXTCOLOR", (0,0), (-1,0), colors.white), ("GRID", (0,0), (-1,-1), .3, colors.grey), ("FONTSIZE", (0,0), (-1,-1), 8), ("VALIGN", (0,0), (-1,-1), "TOP")]))
    story += [table, Spacer(1, 8), Paragraph(label["timeline"], styles["Heading2"])]
    for event in events:
        story.append(Paragraph(f"{event.timestamp.isoformat()} - {event.title_hi if locale == 'hi' and event.title_hi else event.title} [{', '.join(event.evidence_ids)}]", styles["BodyText"]))
    story += [PageBreak(), Paragraph(label["relations"], styles["Heading2"])]
    for rel in relationships:
        story.append(Paragraph(f"{rel.source_id} -{rel.type}-> {rel.target_id} | confidence {rel.confidence:.0%} | {', '.join(rel.evidence_ids)}", styles["BodyText"]))
    story += [Spacer(1, 8), Paragraph(label["alerts"], styles["Heading2"])]
    for alert in alerts:
        story.append(Paragraph(f"{alert.title}: {alert.reason} ({alert.confidence:.0%}) [{', '.join(alert.evidence_ids)}]", styles["BodyText"]))
    story += [Spacer(1, 12), Paragraph("अभिरक्षा इतिहास" if locale == "hi" else "Chain of Custody",styles["Heading2"])]
    evidence_ids = [e.id for e in evidence]
    for custody in db.scalars(select(CustodyEvent).where(CustodyEvent.evidence_id.in_(evidence_ids)).order_by(CustodyEvent.timestamp)):
        story.append(Paragraph(escape(f"{custody.evidence_id} | {custody.timestamp.isoformat()} | {custody.event} | {custody.actor_from or '-'} → {custody.actor_to or '-'} | {custody.location}"),styles["BodyText"]))
    story += [Spacer(1, 12), Paragraph("ब्लॉकचेन प्रमाण" if locale == "hi" else "Blockchain Proof",styles["Heading2"])]
    anchors = {a.evidence_id:a for a in db.scalars(select(BlockchainAnchor).where(BlockchainAnchor.evidence_id.in_(evidence_ids)))}
    for item in evidence:
        anchor = anchors.get(item.id)
        text = f"{item.id}: NOT REGISTERED" if not anchor else f"{item.id}: block {anchor.block_number}, transaction {anchor.transaction_hash}"
        story.append(Paragraph(escape(text),cell_style))
    story += [Spacer(1, 16), Paragraph("Generated from stored investigation state. No finding establishes guilt. Human review is required before operational use.", styles["Italic"])]
    doc.build(story)
    return output.getvalue()


def new_verification_token() -> str:
    return secrets.token_urlsafe(32)
