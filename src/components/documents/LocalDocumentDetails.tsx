import { useEffect, useState } from "react"
import { useLocale } from "../../context/LocaleContext"
import { qrImage, verificationUrl } from "../../lib/documents/identity"
import {
  documentKind,
  downloadBlob,
  type DemoDocument,
} from "../../lib/documents/store"
import ImagePreview from "./ImagePreview"
export default function LocalDocumentDetails({
  record,
  onEdit,
  onDelete,
}: {
  record: DemoDocument
  onEdit: () => void
  onDelete: () => void
}) {
  const { locale } = useLocale()
  const l = (en: string, hi: string) => (locale === "hi" ? hi : en)
  const [page, setPage] = useState(0)
  const image =
    record.pages?.[page] ??
    (documentKind(record) === "image" ? record.original : undefined)
  useEffect(() => setPage(0), [record.id])
  const [qr, setQr] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    let active = true
    setQr("")
    void qrImage({ id: record.id, hash: record.hash })
      .then((result) => {
        if (active) setQr(result)
      })
      .catch((cause) => {
        if (active) setError(cause.message)
      })
    return () => {
      active = false
    }
  }, [record.id, record.hash])
  return (
    <div className="[&_button]:whitespace-normal [&_button]:leading-snug [&_a]:whitespace-normal gov-panel p-5 space-y-4">
      <h3 className="font-bold">
        {l("Browser-local document", "ब्राउज़र में सहेजा दस्तावेज़")}
      </h3>
      <p className="text-xs">
        {l(
          "Stored only in this browser, not uploaded to a server. Clearing browser data removes it. No blockchain or custody record was created.",
          "केवल इस ब्राउज़र में सहेजा गया है, सर्वर पर अपलोड नहीं हुआ। ब्राउज़र डेटा मिटाने से यह हट जाएगा। कोई ब्लॉकचेन या अभिरक्षा रिकॉर्ड नहीं बना।",
        )}
      </p>
      {record.pages && record.pages.length > 1 && (
        <label>
          {l("Page", "पृष्ठ")}{" "}
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            {record.pages.map((_, i) => (
              <option key={i} value={i}>
                {i + 1} / {record.pages!.length}
              </option>
            ))}
          </select>
        </label>
      )}
      {image && (
        <ImagePreview
          key={`${record.id}-${page}`}
          blob={image}
          alt={l("Saved evidence image", "सहेजी गई साक्ष्य छवि")}
        />
      )}
      <div className="flex flex-wrap gap-2">
        <button className="btn-premium btn-sm" onClick={onEdit}>
          {l("Preview / adjust / Run OCR", "पूर्वावलोकन / सुधार / OCR चलाएँ")}
        </button>
        <button
          className="btn-premium-outline btn-sm"
          onClick={() => downloadBlob(record.original, record.name)}
        >
          {l("Download original", "मूल फ़ाइल डाउनलोड करें")}
        </button>
        {record.pages?.map((blob, i) => (
          <button
            key={i}
            className="btn-premium-outline btn-sm"
            onClick={() =>
              downloadBlob(blob, `${record.name}.page-${i + 1}.png`)
            }
          >
            {l("Download derivative page", "अलग पृष्ठ छवि डाउनलोड करें")} {i + 1}
          </button>
        ))}
        {record.text !== undefined && (
          <button
            className="btn-premium-outline btn-sm"
            onClick={() =>
              downloadBlob(
                new Blob([record.text!], { type: "text/plain;charset=utf-8" }),
                `${record.name}.ocr.txt`,
              )
            }
          >
            {l("Download OCR text", "OCR पाठ डाउनलोड करें")}
          </button>
        )}
      </div>
      {record.text !== undefined && (
        <div>
          <h4 className="font-semibold text-sm">
            {l("OCR output — review required", "OCR परिणाम — समीक्षा आवश्यक")}
          </h4>
          <pre className="whitespace-pre-wrap break-words max-h-48 overflow-auto text-xs mt-2">
            {record.text ||
              l("No readable text found.", "पढ़ने योग्य पाठ नहीं मिला।")}
          </pre>
        </div>
      )}
      {qr && (
        <>
          <img
            src={qr}
            className="w-48 h-48 bg-white mx-auto"
            alt={l("Demo identity QR code", "प्रदर्शन पहचान QR कोड")}
          />
          <a
            className="btn-premium-outline btn-sm"
            href={qr}
            download={`${record.id}.qr.png`}
          >
            {l("Download QR", "QR डाउनलोड करें")}
          </a>
          <a
            className="btn-premium-outline btn-sm"
            href={verificationUrl({ id: record.id, hash: record.hash })}
          >
            {l("Open hash verification", "हैश सत्यापन खोलें")}
          </a>
        </>
      )}
      <p className="text-xs">
        {l(
          "QR contains only a demo ID and original SHA-256 hash. It does not share the document with another device or prove authenticity.",
          "QR में केवल प्रदर्शन ID और मूल SHA-256 हैश है। यह दस्तावेज़ दूसरे उपकरण पर साझा नहीं करता और प्रामाणिकता सिद्ध नहीं करता।",
        )}
      </p>
      {error && <p role="alert">{error}</p>}
      <button className="btn-premium-outline btn-sm" onClick={onDelete}>
        {l("Delete local document", "स्थानीय दस्तावेज़ हटाएँ")}
      </button>
    </div>
  )
}
