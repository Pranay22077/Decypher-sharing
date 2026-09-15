import { useEffect, useRef, useState } from "react"
import { translateUi } from "../../context/uiMessages"
import { useLocale } from "../../context/LocaleContext"
import { browserSha256 } from "../../lib/api"
import { parseIdentity } from "../../lib/documents/identity"
import {
  getDocument,
  MAX_BYTES,
  type DemoDocument,
} from "../../lib/documents/store"
export default function DemoVerification({
  token,
  onNavigate,
}: {
  token: string
  onNavigate: (page: string) => void
}) {
  const { locale } = useLocale()
  const l = (en: string, hi: string) => (locale === "hi" ? hi : en)
  const identity = parseIdentity(token)
  const [record, setRecord] = useState<DemoDocument>()
  const [result, setResult] = useState<"match" | "mismatch" | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const generation = useRef(0)
  useEffect(() => {
    const current = ++generation.current
    setResult(null)
    setRecord(undefined)
    setError("")
    if (identity)
      void getDocument(identity.id)
        .then((item) => {
          if (current === generation.current) setRecord(item)
        })
        .catch((cause) => {
          if (current === generation.current) setError(cause.message)
        })
    return () => {
      generation.current++
    }
  }, [token])
  const compare = async (file: File) => {
    const current = ++generation.current
    setResult(null)
    setError("")
    setBusy(true)
    try {
      if (!identity) throw new Error("Invalid QR identity.")
      if (file.size > MAX_BYTES)
        throw new Error("Evidence must be 20 MB or smaller.")
      const actual = await browserSha256(file)
      if (current === generation.current)
        setResult(actual === identity.hash ? "match" : "mismatch")
    } catch (cause) {
      if (current === generation.current)
        setError(
          cause instanceof Error
            ? translateUi(cause.message, locale)
            : "Hash comparison failed.",
        )
    } finally {
      if (current === generation.current) setBusy(false)
    }
  }
  return (
    <div className="min-h-screen holographic-bg p-6 grid place-items-center">
      <div className="[&_button]:whitespace-normal [&_button]:leading-snug [&_a]:whitespace-normal gov-panel w-full max-w-2xl p-6 space-y-5">
        <p className="font-mono text-xs text-[var(--color-primary)]">
          DECYPHER · DEMO
        </p>
        <h1 className="text-3xl">
          {l("Demo identity & hash comparison", "प्रदर्शन पहचान और हैश तुलना")}
        </h1>
        {!identity ? (
          <p role="alert">
            {l(
              "Invalid demo QR identity. No evidence was verified.",
              "अमान्य प्रदर्शन QR पहचान। किसी साक्ष्य का सत्यापन नहीं हुआ।",
            )}
          </p>
        ) : (
          <>
            <dl className="space-y-3 text-sm">
              <dt>{l("Demo ID", "प्रदर्शन ID")}</dt>
              <dd className="font-mono break-all">{identity.id}</dd>
              <dt>
                {l(
                  "SHA-256 supplied by QR (untrusted claim)",
                  "QR में दिया SHA-256 (अप्रमाणित दावा)",
                )}
              </dt>
              <dd className="font-mono break-all">{identity.hash}</dd>
            </dl>
            <p className="text-sm">
              {l(
                "This QR does not share the document. Select the original file to compare its actual bytes with the encoded hash. A match establishes byte equality only, not authenticity, ownership, chain of custody or blockchain registration.",
                "यह QR दस्तावेज़ साझा नहीं करता। मूल फ़ाइल चुनकर उसके वास्तविक बाइट्स का हैश QR के हैश से मिलाएँ। मेल केवल बाइट्स की समानता बताता है; प्रामाणिकता, स्वामित्व, अभिरक्षा या ब्लॉकचेन पंजीकरण नहीं।",
              )}
            </p>
            <p className="text-sm">
              {record
                ? l(
                    "A record exists in this browser. Its presence alone is not integrity verification.",
                    "इस ब्राउज़र में एक रिकॉर्ड मौजूद है। केवल मौजूद होना अखंडता सत्यापन नहीं है।",
                  )
                : l(
                    "The source document is not available in this browser unless saved here separately.",
                    "मूल दस्तावेज़ इस ब्राउज़र में तभी उपलब्ध होगा जब यहाँ अलग से सहेजा गया हो।",
                  )}
            </p>
            <label className="block text-sm">
              {l(
                "Choose original file for hash comparison",
                "हैश तुलना के लिए मूल फ़ाइल चुनें",
              )}
              <input
                type="file"
                className="block mt-2 max-w-full"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void compare(file)
                  e.target.value = ""
                }}
              />
            </label>
            {record && (
              <button
                className="btn-premium-outline"
                disabled={busy}
                onClick={() =>
                  void compare(
                    new File([record.original], record.name, {
                      type: record.mime,
                    }),
                  )
                }
              >
                {l(
                  "Compare locally stored original",
                  "स्थानीय मूल फ़ाइल का हैश मिलाएँ",
                )}
              </button>
            )}
            {busy && (
              <p role="status">
                {l("Calculating SHA-256…", "SHA-256 बन रहा है…")}
              </p>
            )}
            {result && (
              <p
                role="status"
                className={
                  result === "match"
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-alert-critical)]"
                }
              >
                {result === "match"
                  ? l(
                      "Hash matches the supplied file. No blockchain verification performed.",
                      "दिए गए दस्तावेज़ का हैश मेल खाता है। ब्लॉकचेन सत्यापन नहीं किया गया।",
                    )
                  : l(
                      "Hash mismatch. The file bytes differ from the QR hash claim.",
                      "हैश मेल नहीं खाता। फ़ाइल QR के हैश दावे से अलग है।",
                    )}
              </p>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="text-[var(--color-alert-critical)]">
            {error}
          </p>
        )}
        <button className="btn-premium" onClick={() => onNavigate("landing")}>
          {l("Return to Decypher", "डिसाइफर पर लौटें")}
        </button>
      </div>
    </div>
  )
}
