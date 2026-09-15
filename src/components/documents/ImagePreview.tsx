import { useEffect, useRef, useState } from "react"
import { useLocale } from "../../context/LocaleContext"

export default function ImagePreview({
  blob,
  alt,
}: {
  blob: Blob
  alt: string
}) {
  const { locale } = useLocale()
  const l = (en: string, hi: string) => (locale === "hi" ? hi : en)
  const viewport = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState("")
  const [width, setWidth] = useState(0)
  const [size, setSize] = useState({ width: 1, height: 1 })
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  useEffect(() => {
    const node = viewport.current!
    const observer = new ResizeObserver(() => setWidth(node.clientWidth))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const fit = Math.min(1, width / size.width, 480 / size.height)
  return (
    <section className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="btn-premium-outline btn-sm"
          disabled={zoom >= 3}
          onClick={() => setZoom((v) => Math.min(3, v + 0.25))}
        >
          {l("Zoom in", "ज़ूम बढ़ाएँ")}
        </button>
        <button
          className="btn-premium-outline btn-sm"
          disabled={zoom <= 1}
          onClick={() => setZoom((v) => Math.max(1, v - 0.25))}
        >
          {l("Zoom out", "ज़ूम घटाएँ")}
        </button>
        <button
          className="btn-premium-outline btn-sm"
          onClick={() => {
            setZoom(1)
            viewport.current?.scrollTo(0, 0)
          }}
        >
          {l("Fit", "फ़िट करें")}
        </button>
        <span className="text-xs" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
      </div>
      <div
        ref={viewport}
        className="overflow-auto max-h-[480px] min-h-40 border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]"
        tabIndex={0}
        aria-label={l("Image viewing area", "छवि देखने का क्षेत्र")}
      >
        <div
          style={{
            width: Math.max(width, size.width * fit * zoom),
            minHeight: size.height * fit * zoom,
          }}
        >
          {url && (
            <img
              src={url}
              alt={alt}
              onLoad={(e) =>
                setSize({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                })
              }
              style={{
                width: size.width * fit * zoom,
                height: size.height * fit * zoom,
                maxWidth: "none",
              }}
              className="mx-auto"
            />
          )}
        </div>
      </div>
    </section>
  )
}
