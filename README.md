# Decypher by Epoch

A fictional, investigator-controlled full-stack prototype. Operation Nightfall connects synthetic evidence, cryptographic identity, custody, a local blockchain registry, graph exploration and evidence-cited answers. This is not an official government service or a production forensic system.

## Local secure demonstration

Requirements: Docker Desktop running with Docker Compose, and internet access for first-time image/package downloads.

```sh
cp .env.example .env
docker compose up --build
```

Open http://localhost:8443. If another frontend occupies port 8443, stop it first. API docs: http://localhost:8000/docs. Neo4j browser: http://localhost:7474. MinIO console: http://localhost:9001.

Demo accounts use password `DemoAccess2026!`:

- `investigator@decypher.example`: cases, upload, analysis, reports
- `supervisor@decypher.example`: senior role, including registration
- `forensics@decypher.example`: evidence analysis and registration
- `admin@decypher.example`: all permissions and demo reset

Quick-fill accounts are available on the login screen. Open `/demo` for the guided sequence. Register evidence as forensics, supervisor or admin; the investigator role intentionally cannot anchor evidence.

The API uses PostgreSQL, Alembic and JWTs. Evidence is hashed before MinIO storage. Only hash/identity metadata enters `EvidenceRegistry.sol`. The ethers bridge waits for a real Hardhat receipt. Queued analysis/report jobs are processed by the worker. Graph relationships include evidence IDs, timestamps and confidence. Neo4j is a mirror; PostgreSQL remains the source of truth.

Admin reset reseeds the database/graph. It cannot erase blockchain history. For a fully fresh ephemeral blockchain, stop and recreate the Hardhat/deployment/bridge services. Never use this demo key material or passwords in production.

## Showcase mode

```sh
npm install
npm run dev
```

The default mode is `showcase`. It provides routes, browser history, synthetic media, maps, graph exploration, local SHA-256 hashing and cited story answers. Uploads are browser-only and not persisted. Blockchain actions explicitly require the local secure service; no fake transactions or block confirmations are created. The PDF download is a clearly labeled fictional FIR sample, not a generated current-state investigation report.

Set `VITE_APP_MODE=full` and `VITE_API_URL=http://localhost:8000/api/v1` when using the backend. Vercel uses `vercel.json` for SPA deep links; use showcase mode unless a reachable secure API is deliberately configured.

## Synthetic evidence

`data/demo` and `public/demo` contain the FIR PDF, CDR CSV, financial CSV, investigation note, dispatch transcript, generated CCTV still, six-second still-based MP4 and six-second synthetic radio-tone WAV. These are all fictional. The clip is not computer-vision analysis and the tone is not speech. QR codes target localhost for local judging; hosted visitors can use the verification link.

## Checks

```sh
npm test
npx tsc --noEmit
npm run build
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
PYTHONPATH=backend .venv/bin/pytest -q backend/tests
cd blockchain
npm ci
npm test
```

The current tests cover deterministic hashing/tampering, authentication, case graph/citations, evidence upload and registration role checks; contract tests cover registration, lookup, emitted event and duplicate rejection. They do not substitute for a Compose integration/E2E run.

## Prototype boundaries

- Deterministic analysis is implemented; paid AI, S3/SQS, OCR, advanced audio/video analysis and sophisticated anomaly algorithms are not complete adapters. Environment placeholders do not imply those integrations are active.
- English/Hindi locale state and several core screens/answers/reports are implemented; legacy informational and investigation screens still contain English text.
- Basic network summaries and seeded relationships are not a production intelligence model.
- Uploads enforce the size/type limit, but currently spool the accepted payload in memory after chunked hashing; production streaming requires a multipart object-storage pipeline.
- Production MFA, tenant/case-level authorization, encryption key management, incident response and forensic certification are out of scope.
- Full Docker/MinIO/Neo4j/bridge integration and desktop/mobile E2E verification must be run with Docker Desktop available.

Do not commit real AWS credentials or paid-provider keys. Revoke/rotate any previously exposed AWS access-key ID before cloud integration.
