import io
import os
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:////tmp/decypher-test.db"
os.environ["STORAGE_PROVIDER"] = "filesystem"
os.environ["STORAGE_PATH"] = "/tmp/decypher-test-storage"

from fastapi.testclient import TestClient

from app.main import app
from app.services import sha256_stream
from app.services import build_report_pdf
from app.database import SessionLocal
from app.models import Case


def auth_headers(client: TestClient, email="investigator@decypher.example"):
    response = client.post("/api/v1/auth/login", json={"email": email, "password": "DemoAccess2026!"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_hash_is_deterministic_and_changes_with_content():
    first, _ = sha256_stream(io.BytesIO(b"same evidence"))
    second, _ = sha256_stream(io.BytesIO(b"same evidence"))
    changed, _ = sha256_stream(io.BytesIO(b"changed evidence"))
    assert first == second
    assert first != changed


def test_case_graph_and_grounded_copilot():
    Path("/tmp/decypher-test.db").unlink(missing_ok=True)
    with TestClient(app) as client:
        headers = auth_headers(client)
        case = client.get("/api/v1/cases/CASE-2026-017", headers=headers)
        assert case.status_code == 200
        graph = client.get("/api/v1/cases/CASE-2026-017/graph", headers=headers).json()
        assert graph["nodes"] and graph["edges"]
        answer = client.post("/api/v1/copilot/query", headers=headers, json={"case_id":"CASE-2026-017","question":"Why is Vikram Singh important?","locale":"en"})
        assert answer.status_code == 200
        assert "EV-2026-0007" in answer.json()["citations"]


def test_upload_hash_and_unregistered_verification():
    with TestClient(app) as client:
        headers = auth_headers(client)
        payload = b"Unique fictional evidence for API test"
        created = client.post("/api/v1/evidence", headers=headers, data={"case_id":"CASE-2026-017","description":"Test evidence document"}, files={"file":("test.txt",payload,"text/plain")})
        assert created.status_code == 201
        evidence_id = created.json()["id"]
        verified = client.post(f"/api/v1/evidence/{evidence_id}/verify", headers=headers)
        assert verified.status_code == 200
        assert verified.json()["status"] == "NOT_REGISTERED"
        modified = client.post(f"/api/v1/evidence/{evidence_id}/verify", headers=headers, files={"file":("changed.txt",b"tampered","text/plain")})
        assert modified.json()["status"] == "MODIFIED"


def test_role_protects_blockchain_registration():
    with TestClient(app) as client:
        headers = auth_headers(client)
        response = client.post("/api/v1/evidence/EV-2026-0001/register", headers=headers)
        assert response.status_code == 403


def test_analysis_and_reports_are_queued_and_qr_is_real():
    with TestClient(app) as client:
        headers = auth_headers(client)
        analysis = client.post("/api/v1/evidence/EV-2026-0001/analyze", headers=headers)
        assert analysis.status_code == 202
        state = client.get(f"/api/v1/jobs/{analysis.json()['jobId']}", headers=headers).json()
        assert state["status"] == "queued"
        report = client.post("/api/v1/cases/CASE-2026-017/reports", headers=headers, json={"locale":"en"})
        assert report.status_code == 202
        qr = client.get("/api/v1/evidence/EV-2026-0001/qr", headers=headers)
        assert qr.content.startswith(b"\x89PNG")
        with SessionLocal() as db:
            for locale in ("en", "hi"):
                pdf = build_report_pdf(db, db.get(Case, "CASE-2026-017"), locale)
                assert pdf.startswith(b"%PDF") and len(pdf) > 1000
