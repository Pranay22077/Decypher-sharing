"""Polling worker for replaceable background analysis jobs."""
import time
from sqlalchemy import select
from uuid import uuid4

from .database import SessionLocal
from .models import BlockchainAnchor, Case, Evidence, ProcessingJob, Report
from .services import analyze_evidence, blockchain, build_report_pdf, generate_insights, graph_service, storage


def run():
    while True:
        with SessionLocal() as db:
            job = db.scalar(select(ProcessingJob).where(ProcessingJob.status == "queued").order_by(ProcessingJob.created_at).with_for_update(skip_locked=True))
            if job:
                job.status = "running"; job.progress = 20; db.commit()
                try:
                    if job.kind == "analysis":
                        item = db.get(Evidence, job.target_id)
                        if item is None: raise ValueError("Evidence no longer exists.")
                        result = analyze_evidence(db, item, storage.get(item.object_key))
                        graph_service.sync_case(db, item.case_id)
                        generate_insights(db, item.case_id)
                        job.result = {"analysisId": result.id, "summary": result.summary}
                    elif job.kind == "blockchain":
                        item = db.get(Evidence, job.target_id)
                        if item is None: raise ValueError("Evidence no longer exists.")
                        result = blockchain.register(item, "worker")
                        db.add(BlockchainAnchor(evidence_id=item.id, evidence_hash=item.sha256, network=result.get("network", "local"), contract_address=result.get("contractAddress", ""), transaction_hash=result.get("transactionHash", ""), block_number=result.get("blockNumber", 0), registered_by="worker"))
                        job.result = result
                    elif job.kind == "report":
                        options = job.result or {}; case = db.get(Case, job.target_id)
                        if case is None: raise ValueError("Case no longer exists.")
                        report_id = f"RPT-{uuid4().hex[:12]}"; locale = options.get("locale", "en")
                        key = f"exports/{case.id}/{report_id}-{locale}.pdf"
                        storage.put(key, build_report_pdf(db, case, locale), "application/pdf")
                        db.add(Report(id=report_id,case_id=case.id,locale=locale,object_key=key,created_by=options["createdBy"]))
                        job.result = {"id":report_id,"downloadUrl":f"/api/v1/reports/{report_id}/download"}
                    else: raise ValueError("Unsupported job kind.")
                    job.status = "succeeded"; job.progress = 100
                except Exception as exc:
                    job.status = "failed"; job.error = str(exc)
                db.commit()
        time.sleep(1.5)


if __name__ == "__main__":
    run()
