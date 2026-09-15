# Decypher showcase document intake

## Scope and boundaries

Work only in this showcase checkout. Preserve hardcoded data, existing authentication, styling, cases, graphs, dashboards and reports. Add document scanning, browser-local evidence intake, optional OCR and QR generation. Add one Dashboard Analysis Tools shortcut. Repair incomplete Hindi UI translation coverage without changing data or behavior. Do not add a backend, cloud integration, AI analysis, custody records or blockchain operations. Do not commit, push or publish without explicit authorization.

## Entry points and interaction

Place Scan Document next to Upload Evidence in the Evidence Library, with responsive wrapping. Add Document Scanner & OCR to the existing Dashboard Analysis Tools grid; it opens the same intake flow. Keep case upload controls pointing to evidence intake.

Uploading or capturing saves and hashes the original; OCR never starts automatically. Show a document preview, optional manual crop, quarter-turn rotation and resizing, followed by an explicit Run OCR action with English, Hindi or both selected. Image adjustments produce derivatives. Render PDF pages to images for preview, adjustments and OCR while preserving the source PDF. Show processing progress, cancellation, retry and actionable errors. Unsupported evidence formats can be saved but cannot run document OCR.

Camera capture uses a modal with preview, capture, retake and save. Camera tracks stop on capture, close, navigation, unmount and errors, including streams that resolve after cancellation. Camera access requires HTTPS or localhost and browser permission. Do not claim physical-camera validation without performing it.

## Persistence and processing

Use a separate IndexedDB store for new demo evidence, original blobs, derivatives, metadata and OCR results; never mutate hardcoded evidence. Use unique demo IDs and SHA-256 computed from original bytes. Provide downloads and deletion. Explain that browser storage is not server upload, can be cleared and is isolated to the browser origin. Handle quota and unavailable-storage failures explicitly, without reporting unsuccessful writes as saved.

Use compatible pinned Tesseract.js and PDF.js dependencies. Ship required OCR worker, WASM, English/Hindi language assets and PDF worker with the production app, respecting its asset base. Load processing tools on demand. Process one page at a time, with a 20 MB document limit and a 10-page PDF limit, bounded rendered dimensions and an explicit timeout. Reject oversized jobs rather than silently processing only part. Cancellation terminates workers/render tasks and prevents stale results from being saved. OCR errors do not remove already-saved originals. Empty recognition output is reported as no readable text, not substituted text.

## QR and verification

Generate real downloadable QR images containing an origin-relative verification link with only a versioned demo ID and original SHA-256. Do not include filenames, case information, document text or private contents. Validate QR payloads and distinguish embedded hash claims from file comparisons. The verification page offers a supplied-file hash comparison, reports match/mismatch/errors truthfully and states that a hash match is not document authenticity or blockchain verification. On another browser/device, the QR does not make the source document available. Existing showcase/backend verification remains supported separately.

## Hindi

Use the existing LocaleContext and persisted language preference. Connect missing visible UI labels and controls to explicit English/Hindi messages; keep identifiers, hashes, filenames, original document content and OCR output unchanged. Preserve layouts and behavior. Use Hindi labels for new intake, adjustment, OCR, QR, progress and error controls. Test language switching and persistence.

## Deployment and validation

Actual live URL, provider and production environment remain unconfirmed. The checkout has Figma deployment scripts and historical Vercel configuration; neither proves the current live host. Do not publish. Verify production assets locally and adjust only narrowly necessary hosting configuration once the actual host is established. Check verification SPA deep links on that host when accessible.

Validate real English/Hindi OCR and PDF rendering, original-byte preservation, derivative handling, IndexedDB reload persistence/deletion, SHA-256, independent QR decoding, cancellation and storage/processing errors. Run TypeScript checks, relevant tests and production build. Smoke-test existing hardcoded screens and authentication without changing their data. Distinguish local production testing from deployed checks and simulated camera lifecycle tests from physical-camera testing.
