from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from models import User

client = TestClient(app)

def override_current_user():
    db = SessionLocal()
    user = db.query(User).first()
    db.close()
    return user

app.dependency_overrides[app.dependency_overrides.get("current_user") or "current_user"] = override_current_user

# Or simply import services directly
from services import copilot_answer
db = SessionLocal()
print("Testing services.copilot_answer directly")
try:
    ans = copilot_answer(db, "CASE-2026-017", "Who is Arjun Verma?", "en")
    print(ans)
except Exception as e:
    print("Error:", e)
finally:
    db.close()
