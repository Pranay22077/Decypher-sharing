import json
from database import SessionLocal
from services import copilot_answer

db = SessionLocal()
try:
    print("Testing copilot_answer...")
    result = copilot_answer(db, "CASE-2026-017", "Who is Arjun Verma?", "en")
    print(json.dumps(result, indent=2))
finally:
    db.close()
