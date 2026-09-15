import { useEffect, useRef, useState } from "react"
import { useLocale } from "../../context/LocaleContext"
import {
  adjustImage,
  initialAdjustments,
  recognizePages,
  renderPages,
  type Adjustments,
} from "../../lib/documents/processing"
import {
  documentKind,
  downloadBlob,
  saveDocument,
  type DemoDocument,
} from "../../lib/documents/store"

import { translateUi } from "../../context/uiMessages"
import useModal from "./useModal"
import ImagePreview from "./ImagePreview"

export default function DocumentWorkbench({
  record,
  onSaved,
  onClose,
}: {
  record: DemoDocument
  onSaved: (record: DemoDocument) => void
  onClose: () => void
}) {
  const modalRef = useModal(onClose)
  const { locale } = useLocale()
  const l = (en: string, hi: string) => (locale === "hi" ? hi : en)
  const [pages, setPages] = useState<Blob[]>(record.pages || [])
  const [page, setPage] = useState(0)
  const [values, setValues] = useState<Adjustments>(initialAdjustments)
  const [preview, setPreview] = useState<Blob>()
  const [dirty, setDirty] = useState(false)
  const [language, setLanguage] = useState("eng+hin")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [text, setText] = useState(record.text ?? "")
  const controller = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  const previewGeneration = useRef(0)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      controller.current?.abort()
    }
  }, [])
  const job = async (action: (signal: AbortSignal) => Promise<void>) => {
    if (controller.current) return
    const c = new AbortController()
    controller.current = c
    setBusy(true)
    setError("")
    const timer = setTimeout(
      () =>
        c.abort(
          new Error(
            "Processing timed out. Try fewer pages or a smaller document.",
          ),
        ),
      180_000,
    )
    let cancel = () => {}
    const cancelled = new Promise<never>((_, reject) => {
      cancel = () =>
        reject(new DOMException("Processing cancelled.", "AbortError"))
      c.signal.addEventListener("abort", cancel, { once: true })
    })
    try {
      await Promise.race([action(c.signal), cancelled])
    } catch (cause) {
      if (mounted.current) {
        if (c.signal.aborted)
          setMessage(
            c.signal.reason instanceof Error &&
              c.signal.reason.name !== "AbortError"
              ? translateUi(c.signal.reason.message, locale)
              : l(
                  "Processing cancelled. Original retained.",
                  "प्रक्रिया रद्द हुई। मूल फ़ाइल सुरक्षित है।",
                ),
          )
        else
          setError(
            cause instanceof Error
              ? translateUi(cause.message, locale)
              : l("Document processing failed.", "दस्तावेज़ प्रक्रिया विफल हुई।"),
          )
      }
    } finally {
      clearTimeout(timer)
      c.signal.removeEventListener("abort", cancel)
      controller.current = null
      if (mounted.current) setBusy(false)
    }
  }
  useEffect(() => {
    if (!pages[page]) return
    const generation = ++previewGeneration.current
    setPreview(undefined)
    const timer = setTimeout(() => {
      void adjustImage(pages[page], values)
        .then((blob) => {
          if (mounted.current && generation === previewGeneration.current)
            setPreview(blob)
        })
        .catch((cause) => {
          if (mounted.current && generation === previewGeneration.current)
            setError(translateUi(cause.message, locale))
        })
    }, 100)
    return () => {
      clearTimeout(timer)
      previewGeneration.current++
    }
  }, [pages, page, values])
  const progress = (s: string) => {
    if (mounted.current)
      setMessage(
        locale === "hi"
          ? s
              .replace("Rendering page", "पृष्ठ तैयार हो रहा है")
              .replace("OCR page", "OCR पृष्ठ")
              .replace("recognizing text", "पाठ पढ़ा जा रहा है")
              .replace("loading tesseract core", "OCR इंजन लोड हो रहा है")
              .replace("initializing tesseract", "OCR इंजन शुरू हो रहा है")
              .replace("loading language traineddata", "भाषा डेटा लोड हो रहा है")
              .replace("initializing api", "OCR तैयार हो रहा है")
              .replace("loading tesseract", "OCR लोड हो रहा है")
          : s,
      )
  }
  const prepare = () =>
    void job(async (signal) => {
      const rendered = await renderPages(record, signal, progress)
      signal.throwIfAborted()
      if (mounted.current) {
        setDirty(true)
        setText("")
        setPages(rendered)
        setPage(0)
        setValues(initialAdjustments)
        setMessage(
          l(
            "Preview ready. Adjust if needed, then select Run OCR.",
            "पूर्वावलोकन तैयार है। आवश्यकता अनुसार सुधारें, फिर OCR चलाएँ चुनें।",
          ),
        )
      }
    })
  const derivativePages = () =>
    pages.map((blob, index) => (index === page ? preview! : blob))
  const saveEdits = () =>
    void job(async (signal) => {
      signal.throwIfAborted()
      const updated = {
        ...record,
        pages: derivativePages(),
        text: undefined,
        language: undefined,
      }
      await saveDocument(updated)
      if (mounted.current && !signal.aborted) {
        setPages(updated.pages)
        setValues(initialAdjustments)
        setText("")
        setDirty(false)
        onSaved(updated)
        setMessage(
          l(
            "Adjusted images saved separately. OCR must be run again after edits.",
            "सुधारी गई छवियाँ अलग सहेजी गईं। बदलाव के बाद OCR फिर चलाएँ।",
          ),
        )
      }
    })
  const ocr = () =>
    void job(async (signal) => {
      const inputs = derivativePages()
      const result = await recognizePages(inputs, language, signal, progress)
      signal.throwIfAborted()
      const updated = { ...record, pages: inputs, text: result, language }
      await saveDocument(updated)
      if (mounted.current && !signal.aborted) {
        setPages(inputs)
        setValues(initialAdjustments)
        setText(result)
        setDirty(false)
        onSaved(updated)
        setMessage(
          result
            ? l(
                "OCR complete. Review the extracted text for errors.",
                "OCR पूरा हुआ। निकाले गए पाठ में त्रुटियाँ जाँचें।",
              )
            : l(
                "No readable text found. Try a clearer image or another language.",
                "पढ़ने योग्य पाठ नहीं मिला। स्पष्ट छवि या दूसरी भाषा आज़माएँ।",
              ),
        )
      }
    })
  const edit = (next: Adjustments | ((v: Adjustments) => Adjustments)) => {
    setDirty(true)
    setText("")
    setValues(next)
  }
  const saveEvidence = () =>
    void job(async (signal) => {
      signal.throwIfAborted()
      const updated: DemoDocument = {
        ...record,
        ...(preview ? { pages: derivativePages() } : {}),
        ...(dirty ? { text: undefined, language: undefined } : {}),
      }
      await saveDocument(updated)
      if (mounted.current && !signal.aborted) {
        onSaved(updated)
        onClose()
      }
    })
  const field = (
    key: keyof Adjustments,
    en: string,
    hi: string,
    min: number,
    max: number,
  ) => (
    <label className="block text-xs" key={key}>
      {l(en, hi)}: {values[key]}
      {key !== "rotation" ? "%" : "°"}
      <input
        className="w-full"
        type="range"
        min={min}
        max={max}
        value={values[key]}
        disabled={busy}
        onChange={(e) => edit((v) => ({ ...v, [key]: Number(e.target.value) }))}
      />
    </label>
  )
  return (
    <div
      ref={modalRef}
      className="[&_button]:whitespace-normal [&_button]:leading-snug [&_a]:whitespace-normal fixed inset-0 z-[1000] bg-black/60 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-workbench-title"
    >
      <div
        style={{
          background:
            "linear-gradient(var(--color-surface), var(--color-surface)), var(--color-base-bg)",
        }}
        className="gov-panel p-5 max-w-4xl mx-auto space-y-4"
      >
        <div className="flex flex-wrap justify-between items-start gap-3">
          <h2 id="document-workbench-title" className="text-xl">
            {l("Document preview & OCR", "दस्तावेज़ पूर्वावलोकन और OCR")}
          </h2>
          <div className="flex flex-wrap items-start gap-2">
            <button
              className="btn-premium btn-sm"
              disabled={busy || (pages.length > 0 && !preview)}
              onClick={saveEvidence}
            >
              {l("Save evidence", "साक्ष्य सहेजें")}
            </button>
            <button
              autoFocus
              className="btn-premium-outline btn-sm"
              onClick={onClose}
            >
              {l("Close", "बंद करें")}
            </button>
          </div>
        </div>
        <p className="text-sm break-all">{record.name}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {l(
            "Original bytes remain unchanged. Crop, rotate and resize create derivative images. Uploading does not run OCR.",
            "मूल फ़ाइल अपरिवर्तित रहती है। काटने, घुमाने और आकार बदलने से अलग छवियाँ बनती हैं। अपलोड पर OCR अपने आप नहीं चलता।",
          )}
        </p>
        {documentKind(record) === "other" ? (
          <p>
            {l(
              "This file can be stored and hashed. OCR supports PNG, JPEG, WebP, BMP and PDF.",
              "यह फ़ाइल सहेजी और हैश की जा सकती है। OCR के लिए PNG, JPEG, WebP, BMP और PDF समर्थित हैं।",
            )}
          </p>
        ) : !pages.length ? (
          <button className="btn-premium" disabled={busy} onClick={prepare}>
            {l("Prepare document preview", "दस्तावेज़ पूर्वावलोकन तैयार करें")}
          </button>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-5">
              <div className="min-w-0">
                {preview ? (
                  <ImagePreview
                    blob={preview}
                    alt={l(
                      "Adjusted document preview",
                      "सुधारे गए दस्तावेज़ का पूर्वावलोकन",
                    )}
                  />
                ) : (
                  <p>{l("Preparing preview…", "पूर्वावलोकन बन रहा है…")}</p>
                )}
                <button
                  className="btn-premium-outline btn-sm mt-3"
                  disabled={!preview || busy}
                  onClick={() =>
                    preview &&
                    downloadBlob(preview, `${record.name}.page-${page + 1}.png`)
                  }
                >
                  {l("Save image", "छवि सहेजें")}
                </button>
              </div>
              <fieldset disabled={busy} className="min-w-0 space-y-3">
                <label className="block text-xs">
                  {l("Page", "पृष्ठ")}
                  <select
                    className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] rounded-sm p-2 w-full"
                    value={page}
                    disabled={!preview}
                    onChange={(e) => {
                      if (preview) setPages(derivativePages())
                      setPage(Number(e.target.value))
                      setValues(initialAdjustments)
                    }}
                  >
                    {pages.map((_, i) => (
                      <option key={i} value={i}>
                        {i + 1} / {pages.length}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="btn-premium-outline btn-sm"
                  onClick={() =>
                    edit((v) => ({
                      ...v,
                      rotation: (v.rotation + 90) % 360,
                    }))
                  }
                >
                  {l("Rotate 90°", "90° घुमाएँ")}
                </button>
                {field("left", "Crop left", "बाएँ से काटें", 0, 45)}
                {field("right", "Crop right", "दाएँ से काटें", 0, 45)}
                {field("top", "Crop top", "ऊपर से काटें", 0, 45)}
                {field("bottom", "Crop bottom", "नीचे से काटें", 0, 45)}
                {field("scale", "Resize", "आकार बदलें", 25, 100)}
                <button
                  className="btn-premium-outline btn-sm"
                  onClick={() => edit(initialAdjustments)}
                >
                  {l("Reset adjustments", "सुधार रीसेट करें")}
                </button>
                <button
                  className="btn-premium-outline btn-sm"
                  disabled={!preview || busy}
                  onClick={saveEdits}
                >
                  {l("Save adjustments", "सुधार सहेजें")}
                </button>
              </fieldset>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="text-sm">
                {l("OCR language", "OCR भाषा")}{" "}
                <select
                  className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] rounded-sm p-2"
                  value={language}
                  disabled={busy}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="eng">English</option>
                  <option value="hin">हिंदी</option>
                  <option value="eng+hin">English + हिंदी</option>
                </select>
              </label>
              <button
                className="btn-premium"
                disabled={busy || !preview}
                onClick={ocr}
              >
                {l("Run OCR", "OCR चलाएँ")}
              </button>
              <button
                className="btn-premium-outline"
                disabled={busy}
                onClick={prepare}
              >
                {l("Restore original preview", "मूल पूर्वावलोकन वापस लाएँ")}
              </button>
            </div>
          </>
        )}
        {busy && (
          <button
            className="btn-premium-outline"
            onClick={() => controller.current?.abort()}
          >
            {l("Cancel processing", "प्रक्रिया रद्द करें")}
          </button>
        )}
        <p role="status" className="text-sm" aria-live="polite">
          {message}
        </p>
        {error && (
          <p role="alert" className="text-[var(--color-alert-critical)]">
            {error}
          </p>
        )}
        {text && (
          <section>
            <h3 className="font-bold mb-2">
              {l(
                "Extracted text (review required)",
                "निकाला गया पाठ (समीक्षा आवश्यक)",
              )}
            </h3>
            <textarea
              className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] rounded-sm p-2 w-full min-h-48"
              readOnly
              value={text}
              aria-label={l("OCR output", "OCR परिणाम")}
            />
            <button
              className="btn-premium-outline btn-sm"
              onClick={() =>
                downloadBlob(
                  new Blob([text], { type: "text/plain;charset=utf-8" }),
                  `${record.name}.ocr.txt`,
                )
              }
            >
              {l("Download OCR text", "OCR पाठ डाउनलोड करें")}
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
