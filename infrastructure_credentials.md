# Infrastructure & Connection Guide

> **Project**: SIH26189 — Intel Graph Engine  
> **Last Updated**: 2026-09-10  
> **Purpose**: Single-source-of-truth for every database, cloud service, and connection credential that any developer or AI agent needs to build against this project's backend.

---

## Quick Reference Table

| Service | Environment | Endpoint | Status |
|---------|------------|----------|--------|
| PostgreSQL 16 | Local (Docker) | `localhost:5432` | ✅ Running |
| Neo4j 5 Community | Local (Docker) | `bolt://localhost:7687` | ✅ Running |
| MinIO (S3-compat) | Local (Docker) | `localhost:9000` | ✅ Running |
| Amazon S3 | AWS Cloud | `criminal-intel-evidence.s3.eu-north-1.amazonaws.com` | ✅ Ready |
| Amazon SQS | AWS Cloud | `https://sqs.eu-north-1.amazonaws.com/031345404404/evidence-validation-queue` | ✅ Ready |
| JWT Auth | Backend | Internal | ✅ Configured |

---

## 1. AWS Account & IAM

### Account
| Field | Value |
|-------|-------|
| Account ID | `031345404404` |
| Region | `eu-north-1` (Europe / Stockholm) |

### IAM User: `intel-graph-engine-dev`
| Field | Value |
|-------|-------|
| ARN | `arn:aws:iam::031345404404:user/intel-graph-engine-dev` |
| Access Key ID | `AKIAQOTCU5H2PGUJKLX3` |
| Secret Access Key | ⚠️ **Set in `.env` only — never commit** |
| Console Access | Enabled (without MFA) |
| Created | 2026-09-02 07:37 IST |

### Attached Policies (all directly attached, AWS managed)
| Policy | Purpose |
|--------|---------|
| `AmazonS3FullAccess` | Full read/write to all S3 buckets |
| `AmazonSQSFullAccess` | Full read/write to all SQS queues |
| `CloudWatchLogsFullAccess` | Full CloudWatch Logs access |
| `IAMUserChangePassword` | Self-service password change |

---

## 2. Amazon S3 — Evidence Storage

### Bucket Details
| Field | Value |
|-------|-------|
| Bucket Name | `criminal-intel-evidence` |
| ARN | `arn:aws:s3:::criminal-intel-evidence` |
| Region | `eu-north-1` (Europe / Stockholm) |
| Created | 2026-09-02 07:41 IST |
| Versioning | **Enabled** |
| MFA Delete | Disabled |
| Encryption | SSE-S3 (default) |
| Block Public Access | Enabled (assumed — **verify this**) |

### Object Key Structure (from Phase 1 plan)
```
criminal-intel-evidence/
├── raw/
│   └── case/{CASE_ID}/{EVIDENCE_ID}/original/{filename}
├── quarantine/
│   └── case/{CASE_ID}/{EVIDENCE_ID}/{filename}
└── exports/
```

### S3 Event Notification → SQS
| Field | Value |
|-------|-------|
| Event Type | `s3:ObjectCreated:*` |
| Destination | SQS: `evidence-validation-queue` |
| Status | ✅ Configured |

### Usage in Code (boto3)
```python
import boto3

s3 = boto3.client(
    "s3",
    region_name="eu-north-1",
    aws_access_key_id="AKIAQOTCU5H2PGUJKLX3",
    aws_secret_access_key=settings.aws_secret_access_key,  # from .env
)

# Upload evidence
s3.put_object(
    Bucket="criminal-intel-evidence",
    Key=f"raw/case/{case_id}/{evidence_id}/original/{filename}",
    Body=file_bytes,
    ContentType=content_type,
)

# Generate presigned upload URL (for frontend direct upload)
url = s3.generate_presigned_url(
    "put_object",
    Params={
        "Bucket": "criminal-intel-evidence",
        "Key": f"raw/case/{case_id}/{evidence_id}/original/{filename}",
        "ContentType": content_type,
    },
    ExpiresIn=3600,  # 1 hour
)
```

---

## 3. Amazon SQS — Evidence Validation Queue

### Queue Details
| Field | Value |
|-------|-------|
| Queue Name | `evidence-validation-queue` |
| ARN | `arn:aws:sqs:eu-north-1:031345404404:evidence-validation-queue` |
| URL | `https://sqs.eu-north-1.amazonaws.com/031345404404/evidence-validation-queue` |
| Type | **Standard** (not FIFO) |
| Encryption | SSE-SQS (Amazon SQS key) |
| Dead-Letter Queue | None configured |

### Access Policy Summary
- **Owner** (`arn:aws:iam::031345404404:root`): Full `SQS:*` access
- **S3 Service**: `SQS:SendMessage` — only from bucket `arn:aws:s3:::criminal-intel-evidence` and account `031345404404`

### Data Flow
```
File uploaded to S3 bucket
        ↓
S3 ObjectCreated event fires
        ↓
SQS receives message with S3 event payload
        ↓
Validation worker polls SQS, processes the file
        ↓
Worker updates evidence_metadata in PostgreSQL
```

### SQS Message Format (S3 Event Notification)
```json
{
  "Records": [
    {
      "eventSource": "aws:s3",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": { "name": "criminal-intel-evidence" },
        "object": {
          "key": "raw/case/CASE-00000001/EVID-000034/original/cdr_jan.csv",
          "size": 58219
        }
      }
    }
  ]
}
```

### Usage in Code (boto3)
```python
import boto3
import json

sqs = boto3.client(
    "sqs",
    region_name="eu-north-1",
    aws_access_key_id="AKIAQOTCU5H2PGUJKLX3",
    aws_secret_access_key=settings.aws_secret_access_key,  # from .env
)

QUEUE_URL = "https://sqs.eu-north-1.amazonaws.com/031345404404/evidence-validation-queue"

# Poll for messages (validation worker)
response = sqs.receive_message(
    QueueUrl=QUEUE_URL,
    MaxNumberOfMessages=10,
    WaitTimeSeconds=20,  # long polling
)

for msg in response.get("Messages", []):
    body = json.loads(msg["Body"])
    for record in body.get("Records", []):
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]
        # ... validate the uploaded file ...

    # Delete message after successful processing
    sqs.delete_message(
        QueueUrl=QUEUE_URL,
        ReceiptHandle=msg["ReceiptHandle"],
    )
```

---

## 4. PostgreSQL — Operational Metadata

### Connection Details
| Field | Value |
|-------|-------|
| Host | `localhost` (Docker: `postgres`) |
| Port | `5432` |
| Database | `intel_graph_db` |
| User | `admin` |
| Password | `ige_dev_password` |
| Image | `postgres:16-alpine` |
| Container | `ige-postgres` |

### DSN String
```
host=localhost port=5432 dbname=intel_graph_db user=admin password=ige_dev_password
```

### What's in PostgreSQL
- **17 enums** (evidence_type, custody_status, crime_category, etc.)
- **11+ tables** (users, agencies, cases, evidence_metadata, provenance_ledger, audit_log, sessions, processing_jobs, external_id_mappings, incidents, etc.)
- **35+ indexes**, 7 auto-update triggers
- Phase 1 migrations applied: `data_classification` enum, `quarantine_reason` column

### Schema File
- Fresh installs: [`infra/postgres/init.sql`](file:///d:/Downloads/intel-graph-engine/infra/postgres/init.sql)
- Migrations: `infra/postgres/migrations/002_evidence_classification.sql`, `003_phase1_dev_seed.sql`

### Access via DBeaver
- Connection type: PostgreSQL
- Host: `localhost`, Port: `5432`
- Database: `intel_graph_db`
- Username: `admin`, Password: `ige_dev_password`

---

## 5. Neo4j — Entity Graph

### Connection Details
| Field | Value |
|-------|-------|
| Bolt URI | `bolt://localhost:7687` |
| HTTP Browser | `http://localhost:7474` |
| User | `neo4j` |
| Password | `ige_dev_password` |
| Image | `neo4j:5-community` |
| Container | `ige-neo4j` |
| Plugins | GDS (Graph Data Science), APOC |

### What's in Neo4j
- **14 uniqueness constraints** (Person, Phone, Vehicle, Location, Organization, BankAccount, etc.)
- **30+ indexes** (composite, spatial Point, full-text)
- **Seed graph**: 20 persons, 10 phones, 5 vehicles, 10 locations, 3 orgs, 7 bank accounts, 20 events

### Schema Files
- Constraints: [`graph/schema/constraints.cypher`](file:///d:/Downloads/intel-graph-engine/graph/schema/constraints.cypher)
- Indexes: [`graph/schema/indexes.cypher`](file:///d:/Downloads/intel-graph-engine/graph/schema/indexes.cypher)
- Seed: [`graph/seed/load_seed_data.cypher`](file:///d:/Downloads/intel-graph-engine/graph/seed/load_seed_data.cypher)

### Usage in Code (neo4j driver)
```python
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "ige_dev_password"),
)

with driver.session() as session:
    result = session.run("MATCH (p:Person) RETURN p LIMIT 10")
```

> [!NOTE]
> Phase 1 makes **zero Neo4j writes**. Neo4j is used from Phase 5 onward for entity graph construction. All Phase 1 data goes to PostgreSQL + S3 only.

---

## 6. MinIO — Local S3-Compatible Storage

### Connection Details
| Field | Value |
|-------|-------|
| API Endpoint | `localhost:9000` |
| Console URL | `http://localhost:9001` |
| Access Key | `minioadmin` |
| Secret Key | `minioadmin123` |
| Secure (TLS) | `false` |
| Image | `minio/minio:latest` |
| Container | `ige-minio` |

### Pre-created Buckets
| Bucket | Purpose |
|--------|---------|
| `evidence` | Raw evidence files (Phase 0/1 local dev) |
| `evidence-processed` | Processed outputs |
| `exports` | Data exports |

> [!IMPORTANT]
> MinIO is the **local development stand-in** for AWS S3. The code currently uses the `minio` Python SDK. For production/AWS deployment, the storage layer should switch to `boto3` targeting the real `criminal-intel-evidence` S3 bucket. Both are S3-compatible, so the transition is straightforward.

---

## 7. JWT Authentication

### Configuration
| Field | Value |
|-------|-------|
| Algorithm | `HS256` |
| Secret Key | `change-this-to-a-real-secret` (dev only) |
| Access Token Expiry | 15 minutes |
| Refresh Token Expiry | 24 hours |

### Dev-Seeded Users (all password: `DevPassword123!`)
| Email | Role |
|-------|------|
| `investigator@intel-graph.local` | investigator |
| `analyst@intel-graph.local` | analyst |

### Auth Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/login` | POST | Issue JWT access + refresh tokens |
| `/api/v1/auth/refresh` | POST | Refresh access token |
| `/api/v1/auth/logout` | POST | Revoke refresh token |

---

## 8. Environment Variables — Complete Reference

### `.env` (local — gitignored, contains real secrets)
```env
# ── PostgreSQL ──
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=intel_graph_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=ige_dev_password

# ── Neo4j ──
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ige_dev_password

# ── MinIO (local S3) ──
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_ENDPOINT=localhost:9000

# ── AWS ──
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=AKIAQOTCU5H2PGUJKLX3
AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_KEY_HERE>

# ── AWS S3 ──
AWS_S3_BUCKET=criminal-intel-evidence

# ── AWS SQS ──
AWS_SQS_QUEUE_URL=https://sqs.eu-north-1.amazonaws.com/031345404404/evidence-validation-queue
AWS_SQS_QUEUE_ARN=arn:aws:sqs:eu-north-1:031345404404:evidence-validation-queue

# ── JWT ──
JWT_SECRET_KEY=change-this-to-a-real-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_HOURS=24
```

---

## 9. Architecture Diagram

```mermaid
graph TD
    subgraph "Local (Docker Compose)"
        PG["PostgreSQL 16<br/>localhost:5432<br/>Metadata, audit, ledger"]
        NEO["Neo4j 5<br/>bolt://localhost:7687<br/>Entity graph"]
        MINIO["MinIO<br/>localhost:9000<br/>Local S3 dev"]
    end

    subgraph "AWS Cloud (eu-north-1)"
        S3["S3: criminal-intel-evidence<br/>Versioned, SSE-S3<br/>Raw evidence storage"]
        SQS["SQS: evidence-validation-queue<br/>Standard, SSE-SQS<br/>Processing trigger"]
    end

    subgraph "Backend (FastAPI)"
        API["FastAPI :8000<br/>Auth, Evidence, Ingestion"]
    end

    API -->|metadata writes| PG
    API -->|graph queries Phase 5+| NEO
    API -->|local dev files| MINIO
    API -->|presigned URLs / boto3| S3
    API -->|poll messages| SQS

    S3 -->|ObjectCreated event| SQS
    SQS -->|trigger| API

    style S3 fill:#f90,color:#000
    style SQS fill:#f90,color:#000
    style PG fill:#336791,color:#fff
    style NEO fill:#018bff,color:#fff
    style MINIO fill:#c72e49,color:#fff
```

---

## 10. How to Get Started (for a new team member)

### Step 1: Clone & set up environment
```bash
git clone <repo-url>
cd intel-graph-engine
cp .env.example .env
# Edit .env → fill in AWS_SECRET_ACCESS_KEY
```

### Step 2: Start local services
```bash
docker compose up -d
docker compose ps   # wait for all health checks to pass
```

### Step 3: Install Python deps
```bash
pip install -r requirements.txt
```

### Step 4: Load seed data
```bash
python scripts/load_seed_data.py
```

### Step 5: Run the backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Step 6: Verify everything
```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"investigator@intel-graph.local","password":"DevPassword123!"}'

# Run tests
pytest
```

### Step 7: Verify AWS connectivity
```bash
# Test S3 access
python -c "
import boto3, os
s3 = boto3.client('s3', region_name='eu-north-1',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
print(s3.list_objects_v2(Bucket='criminal-intel-evidence', MaxKeys=5))
"

# Test SQS access
python -c "
import boto3, os
sqs = boto3.client('sqs', region_name='eu-north-1',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
attrs = sqs.get_queue_attributes(
    QueueUrl='https://sqs.eu-north-1.amazonaws.com/031345404404/evidence-validation-queue',
    AttributeNames=['All'])
print(attrs)
"
```

---

> [!CAUTION]
> **Never commit `.env` to git.** It contains real AWS credentials. The `.gitignore` already excludes it. Only `.env.example` (with placeholders) is committed.

> [!WARNING]
> The IAM user `intel-graph-engine-dev` has `FullAccess` policies for S3 and SQS. This is fine for development but should be scoped down to least-privilege for production.

> [!IMPORTANT]
> **Missing: AWS Secret Access Key** — The IAM Access Key ID is `AKIAQOTCU5H2PGUJKLX3`, but the Secret Access Key must be obtained from whoever created the key (AWS only shows it once). Set it in `.env` as `AWS_SECRET_ACCESS_KEY=...`.
