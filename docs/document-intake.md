# Showcase document intake

Open Evidence Library and choose **Upload Evidence** or **Scan Document**. The Dashboard's **Document Scanner & OCR** analysis shortcut opens the same scanner. Camera access requires HTTPS/localhost and browser permission; uploading an image is an alternative.

New files are saved only in this browser's IndexedDB, independently of the hardcoded showcase records. They are not sent to a server. Clearing site data, changing browser profiles or changing deployment origins removes access to that browser's files. Download originals and results if you need to keep them elsewhere.

After capture, **Save image** downloads the captured PNG to your device; **Save scan & open preview** stores it in this browser. After upload/capture, select **Prepare document preview**. Crop, rotate or resize a page, then **Save adjustments** or explicitly **Run OCR** in English, Hindi or both. OCR never runs automatically. Its text comes from the submitted file and needs human review. Editing a saved derivative clears obsolete OCR. Originals keep their original bytes and SHA-256; captured PNGs are the originals for camera scans. Use **Save evidence** next to **Close** at the top to save the current preview and return to the selected evidence record. Valid OCR is retained when the image is unchanged; editing clears it. **Save image** in the editor downloads the displayed derivative PNG. **Zoom in**, **Zoom out** and **Fit** change only the viewing size, with scrolling for enlarged images; they do not resize the file, alter its hash or run OCR. Clicking a saved image record displays its latest saved image immediately. Unsupported file formats can be saved but cannot run document OCR.

Limits: 20 MB per original, at most 10 PDF pages, at most 2000 pixels per rendered image edge, original image decode limit of 40 megapixels and a three-minute processing timeout. PDF rendering and OCR process pages sequentially. Cancellation, timeout and OCR failure retain the stored original. Storage failures are reported and are not shown as successful saves.

The selected local record offers original/derivative/OCR downloads, deletion and a downloadable QR. QR content is a link containing only a versioned random demo ID and original SHA-256. It contains no filename, case ID, document text or file bytes. Another device cannot retrieve the document from it. QR verification compares a user-supplied file against the embedded hash claim; a match proves byte equality only, not authenticity, ownership, custody or blockchain registration.

## Build and deployment

Install with the checked-in pnpm lockfile. `npm run dev` and `npm run build` generate `public/document-assets` from pinned dependencies. The generated folder is intentionally ignored by Git and copied into `dist` by Vite. It includes OCR worker/core/WASM/language files plus PDF worker, font, character-map and decoder assets. Do not omit these generated files when hosting `dist`. Workers and language assets load from the app's configured asset base; no OCR CDN is required.

The deployed demo must build in showcase mode: leave `VITE_APP_MODE` unset or set it to `showcase`. `full` retains the existing backend-dependent experience and does not enable the new local scanner flow. Vercel hosting uses the checked-in `vercel.json`: real files are served first and all remaining application routes fall back to `index.html`. This supports direct `/graph`, `/evidence` and `/verify/:token` links. Camera use also depends on the host's HTTPS and iframe camera permissions.

The supplied deployment reference establishes Vercel as the host. No live deployment, physical-camera validation, commit, push or publication has been performed in this workspace.

## Validation

- `npm run typecheck`
- `npm test` — original-byte hashing/persistence/deletion, storage errors, independent PNG QR decoding, payload rejection, late camera permission cancellation, Hindi labels.
- `npm run test:e2e` — builds showcase mode on dedicated localhost port 8451, then tests real English/Hindi/image/PDF OCR, optional processing, cancellation, local persistence, cross-browser QR comparison, asset/deep-link loading, Hindi switching, existing screens, simulated camera lifecycle, missing-worker errors and mobile derivative adjustments.

Install Playwright Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an available Chrome test executable. Tests use isolated profiles and simulated media devices, not a physical camera. The missing-worker test temporarily renames a local `dist` asset and restores it in `finally`.
