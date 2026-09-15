import io
from datetime import datetime, timezone
from uuid import uuid4

import httpx
from fastapi import Depends, FastAPI, File, Form, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, SessionLocal, engine, get_db
from .models import (
    Alert, AuditLog, BlockchainAnchor, Case, CustodyEvent, Entity, Evidence,
    EvidenceAnalysis, EvidenceEntity, ProcessingJob, RefreshToken, Relationship,
    Report, TimelineEvent, User,
)
from .schemas import CaseCreate, CaseOut, CopilotQuery, CustodyCreate, EvidenceOut, LoginRequest, RefreshRequest, ReportRequest, TokenPair
from .security import create_token, current_user, decode_token, require_roles, verify_password
from .seed import CASE_ID, DEMO_PASSWORD, reset_demo, seed_demo
from .services import (
    ALLOWED_MIME, analyze_evidence, blockchain, build_report_pdf, copilot_answer,
    graph_service, new_verification_token, qr_png, sha256_stream, storage,
)


app = FastAPI(title=settings.app_name, version="2.0.0", description="Evidence-first investigation prototype API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:8443"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_demo(db)
        graph_service.sync_case(db, CASE_ID)


def audit(db: Session, user_id: str, action: str, target: str, metadata: dict | None = None):
    db.add(AuditLog(user_id=user_id, action=action, target=target, metadata_json=metadata or {}))


def case_payload(db: Session, case: Case) -> dict:
    payload = CaseOut.model_validate(case).model_dump()
    payload["counts"] = {
        "evidence": db.scalar(select(func.count()).select_from(Evidence).where(Evidence.case_id == case.id)) or 0,
        "entities": db.scalar(select(func.count()).select_from(Entity)) or 0,
        "alerts": db.scalar(select(func.count()).select_from(Alert).where(Alert.case_id == case.id)) or 0,
        "relationships": db.scalar(select(func.count()).select_from(Relationship).where(Relationship.case_id == case.id)) or 0,
    }
    return payload


@app.get("/health")
def health():
    return {"status": "ok", "service": "decypher-api", "version": "2.0.0"}


@app.get("/ready")
def ready(db: Session = Depends(get_db)):
    checks = {"database": False, "storage": False, "neo4j": False, "blockchain": False}
    try:
        db.execute(text("SELECT 1")); checks["database"] = True
        storage.ensure(); checks["storage"] = True
    except Exception:
        pass
    try:
        with graph_service._driver() as driver:
            driver.verify_connectivity(); checks["neo4j"] = True
    except Exception:
        pass
    try:
        checks["blockchain"] = httpx.get(f"{settings.blockchain_bridge_url}/health", timeout=2).is_success
    except Exception:
        pass
    return {"status": "ready" if all(checks.values()) else "degraded", "checks": checks}


@app.post("/api/v1/auth/login", response_model=TokenPair)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail={"code": "invalid_credentials", "message": "Email or password is incorrect."})
    access, _, _ = create_token(user)
    refresh, jti, expires = create_token(user, "refresh")
    db.add(RefreshToken(jti=jti, user_id=user.id, expires_at=expires))
    audit(db, user.id, "LOGIN", user.id)
    db.commit()
    return TokenPair(access_token=access, refresh_token=refresh, user={"id": user.id, "email": user.email, "name": user.name, "role": user.role})


@app.post("/api/v1/auth/refresh", response_model=TokenPair)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refresh_token, "refresh")
    record = db.get(RefreshToken, payload["jti"])
    user = db.get(User, payload["sub"])
    if not record or record.revoked or not user:
        raise HTTPException(status_code=401, detail={"code": "revoked_token", "message": "Refresh token is no longer valid."})
    record.revoked = True
    access, _, _ = create_token(user)
    refresh_value, jti, expires = create_token(user, "refresh")
    db.add(RefreshToken(jti=jti, user_id=user.id, expires_at=expires))
    db.commit()
    return TokenPair(access_token=access, refresh_token=refresh_value, user={"id": user.id, "email": user.email, "name": user.name, "role": user.role})


@app.post("/api/v1/auth/logout")
def logout(body: RefreshRequest, user: User = Depends(current_user), db: Session = Depends(get_db)):
    try:
        payload = decode_token(body.refresh_token, "refresh")
        record = db.get(RefreshToken, payload["jti"])
        if record: record.revoked = True
    finally:
        audit(db, user.id, "LOGOUT", user.id); db.commit()
    return {"message": "Signed out."}


@app.get("/api/v1/auth/me")
def me(user: User = Depends(current_user)):
    return {"id": user.id, "email": user.email, "name": user.name, "role": user.role}


@app.get("/api/v1/demo/accounts")
def demo_accounts():
    return {"password": DEMO_PASSWORD, "accounts": [{"email": email, "name": name, "role": role} for _, email, name, role in __import__("app.seed", fromlist=["USERS"]).USERS]}


@app.get("/api/v1/cases")
def list_cases(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return [case_payload(db, item) for item in db.scalars(select(Case).order_by(Case.updated_at.desc()))]


@app.post("/api/v1/cases", status_code=201)
def create_case(body: CaseCreate, user: User = Depends(require_roles("investigator", "senior", "admin")), db: Session = Depends(get_db)):
    index = (db.scalar(select(func.count()).select_from(Case)) or 0) + 1
    case = Case(id=f"CASE-2026-{index + 100:03d}", case_number=f"DEMO/2026/{index + 100:03d}", title=body.title, description=body.description, priority=body.priority, lead_investigator=body.lead_investigator)
    db.add(case); audit(db, user.id, "CASE_CREATED", case.id); db.commit(); db.refresh(case)
    return case_payload(db, case)


@app.get("/api/v1/cases/{case_id}")
def get_case(case_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    case = db.get(Case, case_id)
    if not case: raise HTTPException(404, detail={"code":"case_not_found","message":"Case was not found."})
    return case_payload(db, case)


@app.get("/api/v1/evidence", response_model=list[EvidenceOut])
def list_evidence(case_id: str | None = None, user: User = Depends(current_user), db: Session = Depends(get_db)):
    query = select(Evidence).order_by(Evidence.created_at.desc())
    if case_id: query = query.where(Evidence.case_id == case_id)
    return list(db.scalars(query))


@app.post("/api/v1/evidence", response_model=EvidenceOut, status_code=201)
def upload_evidence(case_id: str = Form(...), description: str = Form(""), file: UploadFile = File(...), user: User = Depends(require_roles("investigator", "senior", "forensics", "admin")), db: Session = Depends(get_db)):
    if not db.get(Case, case_id): raise HTTPException(404, detail={"code":"case_not_found","message":"Case was not found."})
    mime = file.content_type or "application/octet-stream"
    if mime not in ALLOWED_MIME: raise HTTPException(415, detail={"code":"unsupported_type","message":f"Unsupported evidence type: {mime}"})
    try: digest, payload = sha256_stream(file.file)
    except ValueError as exc: raise HTTPException(413, detail={"code":"file_too_large","message":str(exc)}) from exc
    if db.scalar(select(Evidence).where(Evidence.sha256 == digest)):
        raise HTTPException(409, detail={"code":"duplicate_evidence","message":"An identical file is already registered."})
    index = (db.scalar(select(func.count()).select_from(Evidence)) or 0) + 1
    evidence_id = f"EV-2026-{index:04d}"
    filename = (file.filename or "evidence.bin").replace("/", "_")
    key = f"raw/case/{case_id}/{evidence_id}/original/{filename}"
    storage.put(key, payload, mime)
    kind = "video" if mime.startswith("video/") else "audio" if mime.startswith("audio/") else "image" if mime.startswith("image/") else "data" if "csv" in mime else "document"
    evidence = Evidence(id=evidence_id, case_id=case_id, name=filename, description=description, type=kind, object_key=key, mime_type=mime, size=len(payload), sha256=digest, status="hashed", registered_by=user.id, verification_token=new_verification_token())
    db.add(evidence); db.add(CustodyEvent(evidence_id=evidence_id, event="COLLECTED", actor_to=user.name, location="Secure intake portal", notes="Evidence uploaded")); db.add(CustodyEvent(evidence_id=evidence_id, event="HASHED", actor_to="Decypher", notes=f"SHA-256 {digest}")); audit(db, user.id, "EVIDENCE_UPLOADED", evidence_id, {"caseId":case_id,"sha256":digest}); db.commit(); db.refresh(evidence)
    return evidence


@app.get("/api/v1/evidence/{evidence_id}")
def get_evidence(evidence_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    item = db.get(Evidence, evidence_id)
    if not item: raise HTTPException(404, detail={"code":"evidence_not_found","message":"Evidence was not found."})
    result = EvidenceOut.model_validate(item).model_dump()
    result["custody"] = [{"event":c.event,"timestamp":c.timestamp,"from":c.actor_from,"to":c.actor_to,"location":c.location,"notes":c.notes} for c in db.scalars(select(CustodyEvent).where(CustodyEvent.evidence_id == evidence_id).order_by(CustodyEvent.timestamp))]
    result["analysis"] = [{"summary":a.summary,"confidence":a.confidence,"provider":a.provider,"result":a.result} for a in db.scalars(select(EvidenceAnalysis).where(EvidenceAnalysis.evidence_id == evidence_id))]
    anchor = db.scalar(select(BlockchainAnchor).where(BlockchainAnchor.evidence_id == evidence_id))
    result["blockchain"] = anchor and {"network":anchor.network,"contractAddress":anchor.contract_address,"transactionHash":anchor.transaction_hash,"blockNumber":anchor.block_number,"registeredAt":anchor.registered_at}
    return result


@app.get("/api/v1/evidence/{evidence_id}/file")
def evidence_file(evidence_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    item = db.get(Evidence, evidence_id)
    if not item: raise HTTPException(404, detail="Evidence was not found.")
    return StreamingResponse(io.BytesIO(storage.get(item.object_key)), media_type=item.mime_type, headers={"Content-Disposition":f'inline; filename="{item.name}"'})


@app.post("/api/v1/evidence/{evidence_id}/register")
def register_evidence(evidence_id: str, user: User = Depends(require_roles("senior", "forensics", "admin")), db: Session = Depends(get_db)):
    item = db.get(Evidence, evidence_id)
    if not item: raise HTTPException(404, detail="Evidence was not found.")
    existing = db.scalar(select(BlockchainAnchor).where(BlockchainAnchor.evidence_id == evidence_id))
    if existing: return {"status":"confirmed","transactionHash":existing.transaction_hash,"blockNumber":existing.block_number,"contractAddress":existing.contract_address,"network":existing.network}
    try: proof = blockchain.register(item, user.id)
    except RuntimeError as exc: raise HTTPException(503, detail={"code":"blockchain_unavailable","message":str(exc)}) from exc
    anchor = BlockchainAnchor(evidence_id=item.id, evidence_hash=item.sha256, network=proof["network"], contract_address=proof["contractAddress"], transaction_hash=proof["transactionHash"], block_number=proof["blockNumber"], registered_by=user.id)
    item.status = "registered"; item.registered_at = datetime.now(timezone.utc)
    db.add(anchor); db.add(CustodyEvent(evidence_id=item.id,event="REGISTERED",actor_to=user.name,notes=f"Blockchain transaction {proof['transactionHash']}")); audit(db,user.id,"EVIDENCE_REGISTERED",item.id,proof); db.commit()
    return {"status":"confirmed", **proof}


@app.get("/api/v1/evidence/{evidence_id}/blockchain")
def blockchain_proof(evidence_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    anchor = db.scalar(select(BlockchainAnchor).where(BlockchainAnchor.evidence_id == evidence_id))
    if not anchor: return {"status":"not_registered","message":"No blockchain anchor exists for this evidence."}
    return {"status":"confirmed","evidenceId":anchor.evidence_id,"evidenceHash":anchor.evidence_hash,"network":anchor.network,"contractAddress":anchor.contract_address,"transactionHash":anchor.transaction_hash,"blockNumber":anchor.block_number,"registeredAt":anchor.registered_at}


@app.post("/api/v1/evidence/{evidence_id}/analyze", status_code=202)
def analyze(evidence_id: str, user: User = Depends(require_roles("investigator","senior","forensics","admin")), db: Session = Depends(get_db)):
    item = db.get(Evidence, evidence_id)
    if not item: raise HTTPException(404, detail="Evidence was not found.")
    job = ProcessingJob(id=f"JOB-{uuid4().hex[:12]}",kind="analysis",target_id=item.id,status="queued",progress=0)
    db.add(job); audit(db,user.id,"ANALYSIS_QUEUED",item.id,{"jobId":job.id}); db.commit()
    return {"jobId":job.id,"status":job.status,"result":job.result,"error":job.error}


@app.post("/api/v1/evidence/{evidence_id}/verify")
def verify_evidence(evidence_id: str, file: UploadFile | None = File(None), user: User = Depends(current_user), db: Session = Depends(get_db)):
    item = db.get(Evidence,evidence_id)
    if not item: raise HTTPException(404,detail="Evidence was not found.")
    payload = file.file if file else io.BytesIO(storage.get(item.object_key))
    current_hash,_ = sha256_stream(payload)
    anchor = db.scalar(select(BlockchainAnchor).where(BlockchainAnchor.evidence_id == evidence_id))
    hash_match = current_hash == item.sha256
    chain_match = bool(anchor and anchor.evidence_hash == item.sha256)
    state = "VERIFIED" if hash_match and chain_match else "MODIFIED" if not hash_match else "NOT_REGISTERED"
    db.add(CustodyEvent(evidence_id=item.id,event="VERIFIED" if state=="VERIFIED" else "VERIFICATION_CHECK",actor_to=user.name,notes=f"Result: {state}")); audit(db,user.id,"EVIDENCE_VERIFIED",item.id,{"result":state}); db.commit()
    return {"status":state,"currentHash":current_hash,"registeredHash":item.sha256,"hashMatch":hash_match,"blockchainMatch":chain_match}


@app.get("/api/v1/evidence/{evidence_id}/qr")
def evidence_qr(evidence_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    item = db.get(Evidence,evidence_id)
    if not item: raise HTTPException(404,detail="Evidence was not found.")
    return Response(qr_png(item),media_type="image/png",headers={"Content-Disposition":f'inline; filename="{item.id}-qr.png"'})


@app.get("/api/v1/verify/{token}")
def public_verify(token: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Evidence).where(Evidence.verification_token == token))
    if not item: raise HTTPException(404,detail={"code":"verification_not_found","message":"QR evidence identity was not found."})
    anchor = db.scalar(select(BlockchainAnchor).where(BlockchainAnchor.evidence_id == item.id))
    return {"evidenceId":item.id,"caseId":item.case_id,"name":item.name,"type":item.type,"sha256":item.sha256,"status":item.status,"blockchainRegistered":bool(anchor),"transactionHash":anchor.transaction_hash if anchor else None,"registeredAt":anchor.registered_at if anchor else None}


@app.post("/api/v1/evidence/{evidence_id}/custody")
def add_custody(evidence_id: str, body: CustodyCreate, user: User = Depends(require_roles("senior","forensics","admin")), db: Session = Depends(get_db)):
    if not db.get(Evidence,evidence_id): raise HTTPException(404,detail="Evidence was not found.")
    row = CustodyEvent(evidence_id=evidence_id,event=body.event.upper(),actor_from=body.actor_from,actor_to=body.actor_to,location=body.location,notes=body.notes)
    db.add(row); audit(db,user.id,"EVIDENCE_TRANSFERRED",evidence_id,{"event":row.event}); db.commit()
    return {"message":"Custody event recorded.","event":row.event}


@app.get("/api/v1/jobs/{job_id}")
def job(job_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    row = db.get(ProcessingJob,job_id)
    if not row: raise HTTPException(404,detail="Job was not found.")
    return {"id":row.id,"kind":row.kind,"targetId":row.target_id,"status":row.status,"progress":row.progress,"result":row.result,"error":row.error}


def graph_payload(db: Session, case_id: str):
    rels=list(db.scalars(select(Relationship).where(Relationship.case_id==case_id))); ids={i for r in rels for i in (r.source_id,r.target_id)}; entities=[e for e in db.scalars(select(Entity)) if e.id in ids]
    evidence_counts={entity.id:db.scalar(select(func.count()).select_from(EvidenceEntity).where(EvidenceEntity.entity_id==entity.id)) or len({ev for r in rels if entity.id in (r.source_id,r.target_id) for ev in r.evidence_ids}) for entity in entities}
    return {"nodes":[{"id":e.id,"label":e.canonical_name,"labelHi":e.canonical_name_hi,"type":e.type,"properties":e.properties,"evidenceCount":evidence_counts[e.id]} for e in entities],"edges":[{"id":r.id,"source":r.source_id,"target":r.target_id,"type":r.type,"confidence":r.confidence,"evidenceIds":r.evidence_ids,"timestamp":r.timestamp} for r in rels]}


@app.get("/api/v1/cases/{case_id}/graph")
def case_graph(case_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)): return graph_payload(db,case_id)


@app.get("/api/v1/cases/{case_id}/timeline")
def case_timeline(case_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)):
    return [{"id":e.id,"timestamp":e.timestamp,"type":e.type,"title":e.title,"titleHi":e.title_hi,"description":e.description,"entityIds":e.entity_ids,"evidenceIds":e.evidence_ids,"location":e.location,"confidence":e.confidence} for e in db.scalars(select(TimelineEvent).where(TimelineEvent.case_id==case_id).order_by(TimelineEvent.timestamp))]


@app.get("/api/v1/cases/{case_id}/map")
def case_map(case_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)):
    return [{"eventId":e.id,"title":e.title,"timestamp":e.timestamp,"location":e.location,"entityIds":e.entity_ids,"evidenceIds":e.evidence_ids} for e in db.scalars(select(TimelineEvent).where(TimelineEvent.case_id==case_id)) if e.location]


@app.get("/api/v1/cases/{case_id}/network")
def network(case_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)):
    graph=graph_payload(db,case_id); degree={n["id"]:0 for n in graph["nodes"]}
    for edge in graph["edges"]: degree[edge["source"]]+=1; degree[edge["target"]]+=1
    ranking=sorted(({"entityId":key,"connections":value,"classification":"Highly Connected Entity" if value>=3 else "Investigative Lead"} for key,value in degree.items()),key=lambda x:x["connections"],reverse=True)
    return {"ranking":ranking,"bridgeEntities":[x for x in ranking if x["entityId"]=="PERSON-P004"],"disclaimer":"Graph metrics identify investigative leads, not guilt."}


@app.get("/api/v1/cases/{case_id}/related")
def related(case_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)):
    return {"caseId":case_id,"relatedCases":[{"id":"CASE-X007","title":"Operation Northbridge","sharedEntities":["PERSON-P004","VEHICLE-V001"],"evidenceIds":["EV-2026-0007"]}]}


@app.post("/api/v1/copilot/query")
def copilot(body:CopilotQuery,user:User=Depends(current_user),db:Session=Depends(get_db)):
    if not db.get(Case,body.case_id): raise HTTPException(404,detail="Case was not found.")
    answer=copilot_answer(db,body.case_id,body.question,body.locale); audit(db,user.id,"COPILOT_QUERY",body.case_id,{"citations":answer["citations"]}); db.commit(); return answer


@app.get("/api/v1/cases/{case_id}/reports")
def reports(case_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)):
    return [{"id":r.id,"caseId":r.case_id,"locale":r.locale,"createdAt":r.created_at} for r in db.scalars(select(Report).where(Report.case_id==case_id).order_by(Report.created_at.desc()))]


@app.post("/api/v1/cases/{case_id}/reports",status_code=202)
def generate_report(case_id:str,body:ReportRequest,user:User=Depends(require_roles("investigator","senior","admin")),db:Session=Depends(get_db)):
    case=db.get(Case,case_id)
    if not case: raise HTTPException(404,detail="Case was not found.")
    job=ProcessingJob(id=f"JOB-{uuid4().hex[:12]}",kind="report",target_id=case_id,status="queued",progress=0,result={"locale":body.locale,"createdBy":user.id})
    db.add(job); audit(db,user.id,"REPORT_QUEUED",case_id,{"jobId":job.id}); db.commit()
    return {"jobId":job.id,"status":job.status}


@app.get("/api/v1/reports/{report_id}/download")
def download_report(report_id:str,user:User=Depends(current_user),db:Session=Depends(get_db)):
    row=db.get(Report,report_id)
    if not row: raise HTTPException(404,detail="Report was not found.")
    return StreamingResponse(io.BytesIO(storage.get(row.object_key)),media_type="application/pdf",headers={"Content-Disposition":f'attachment; filename="{row.case_id}-{row.locale}.pdf"'})


@app.post("/api/v1/admin/reset-demo")
def reset(user:User=Depends(require_roles("admin")),db:Session=Depends(get_db)):
    graph_service.reset(); reset_demo(db); audit(db,user.id,"DEMO_RESET",CASE_ID); db.commit(); return {"message":"Demo data reset.","caseId":CASE_ID}


@app.get("/api/v1/audit")
def audit_log(user:User=Depends(require_roles("senior","admin")),db:Session=Depends(get_db)):
    return [{"timestamp":r.timestamp,"userId":r.user_id,"action":r.action,"target":r.target,"metadata":r.metadata_json} for r in db.scalars(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(200))]
