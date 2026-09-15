import { useEffect, useRef, useState } from "react"
import { useLocale } from "../../context/LocaleContext"
import { acquireCamera, stopCamera } from "../../lib/documents/camera"
import { canvasBlob } from "../../lib/documents/processing"

import useModal from "./useModal"
import ImagePreview from "./ImagePreview"
import { downloadBlob } from "../../lib/documents/store"

export default function Scanner({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void
  onClose: () => void
}) {
  const modalRef = useModal(onClose)
  const { locale } = useLocale()
  const l = (en: string, hi: string) => (locale === "hi" ? hi : en)
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const controller = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  const [error, setError] = useState("")
  const [ready, setReady] = useState(false)
  const [image, setImage] = useState<Blob>()
  const [starting, setStarting] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const shutdown = () => {
    controller.current?.abort()
    stopCamera(stream.current)
    stream.current = null
    if (video.current) video.current.srcObject = null
  }
  useEffect(() => {
    mounted.current = true
    const hide = () => {
      if (document.visibilityState === "hidden") {
        shutdown()
        setReady(false)
        setStarting(false)
      }
    }
    document.addEventListener("visibilitychange", hide)
    return () => {
      mounted.current = false
      shutdown()
      document.removeEventListener("visibilitychange", hide)
    }
  }, [])
  const start = async () => {
    shutdown()
    setImage(undefined)
    setReady(false)
    setError("")
    setStarting(true)
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError(
        l(
          "Camera requires HTTPS or localhost and a supported browser. You can upload an image instead.",
          "कैमरे के लिए HTTPS या localhost और समर्थित ब्राउज़र चाहिए। आप छवि अपलोड कर सकते हैं।",
        ),
      )
      setStarting(false)
      return
    }
    const c = new AbortController()
    controller.current = c
    try {
      const next = await acquireCamera(c.signal)
      if (!mounted.current) {
        stopCamera(next)
        return
      }
      stream.current = next
      if (video.current) {
        video.current.srcObject = next
        await video.current.play()
        c.signal.throwIfAborted()
        setReady(true)
      }
    } catch (cause) {
      if (mounted.current && !c.signal.aborted) {
        shutdown()
        setError(
          l(
            "Camera access failed. Allow camera permission or upload a file instead.",
            "कैमरा नहीं खुला। कैमरे की अनुमति दें या फ़ाइल अपलोड करें।",
          ) + (cause instanceof Error ? ` (${cause.name})` : ""),
        )
      }
    } finally {
      if (mounted.current) setStarting(false)
    }
  }
  const capture = async () => {
    if (!video.current?.videoWidth || !ready || capturing) return
    setCapturing(true)
    try {
      const canvas = document.createElement("canvas")
      const scale = Math.min(
        1,
        2000 / Math.max(video.current.videoWidth, video.current.videoHeight),
      )
      canvas.width = Math.round(video.current.videoWidth * scale)
      canvas.height = Math.round(video.current.videoHeight * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Capture unavailable")
      ctx.drawImage(video.current, 0, 0, canvas.width, canvas.height)
      const blob = await canvasBlob(canvas)
      shutdown()
      if (mounted.current) {
        setReady(false)
        setImage(blob)
      }
    } catch {
      shutdown()
      if (mounted.current)
        setError(l("Capture failed. Try again.", "छवि नहीं बनी। फिर कोशिश करें।"))
    } finally {
      if (mounted.current) setCapturing(false)
    }
  }
  return (
    <div
      ref={modalRef}
      className="[&_button]:whitespace-normal [&_button]:leading-snug [&_a]:whitespace-normal fixed inset-0 z-[1000] bg-black/60 overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-title"
    >
      <div
        style={{
          background:
            "linear-gradient(var(--color-surface), var(--color-surface)), var(--color-base-bg)",
        }}
        className="gov-panel max-w-3xl mx-auto p-5 space-y-4"
      >
        <div className="flex justify-between">
          <h2 id="scanner-title" className="text-xl">
            {l("Scan Document", "दस्तावेज़ स्कैन करें")}
          </h2>
          <button
            autoFocus
            className="btn-premium-outline btn-sm"
            onClick={() => {
              shutdown()
              onClose()
            }}
          >
            {l("Close", "बंद करें")}
          </button>
        </div>
        <p className="text-xs">
          {l(
            "Capture a document, then crop, rotate or resize and optionally run OCR. No file is sent to a server.",
            "दस्तावेज़ की तस्वीर लें, फिर काटें, घुमाएँ या आकार बदलें और चाहें तो OCR चलाएँ। फ़ाइल सर्वर पर नहीं भेजी जाती।",
          )}
        </p>
        {image ? (
          <ImagePreview
            blob={image}
            alt={l("Captured document", "दस्तावेज़ की तस्वीर")}
          />
        ) : (
          <video
            className="w-full max-h-[480px] bg-black"
            ref={video}
            muted
            playsInline
            aria-label={l("Camera preview", "कैमरा पूर्वावलोकन")}
          />
        )}
        {error && (
          <p role="alert" className="text-[var(--color-alert-critical)]">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {image ? (
            <>
              <button
                className="btn-premium-outline"
                onClick={() => void start()}
              >
                {l("Retake", "फिर तस्वीर लें")}
              </button>
              <button
                className="btn-premium-outline"
                onClick={() => downloadBlob(image, "scan.png")}
              >
                {l("Save image", "छवि सहेजें")}
              </button>
              <button
                className="btn-premium"
                onClick={() => {
                  shutdown()
                  onCapture(
                    new File(
                      [image],
                      `scan-${new Date().toISOString().replace(/[:.]/g, "-")}.png`,
                      { type: "image/png" },
                    ),
                  )
                }}
              >
                {l("Save scan & open preview", "स्कैन सहेजें और पूर्वावलोकन खोलें")}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-premium-outline"
                disabled={starting || ready}
                onClick={() => void start()}
              >
                {starting
                  ? l(
                      "Waiting for camera permission…",
                      "कैमरे की अनुमति की प्रतीक्षा…",
                    )
                  : l("Start camera", "कैमरा शुरू करें")}
              </button>
              <button
                className="btn-premium"
                disabled={!ready || capturing}
                onClick={() => void capture()}
              >
                {l("Capture", "तस्वीर लें")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
