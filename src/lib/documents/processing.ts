import { documentKind, type DemoDocument } from "./store"

export const MAX_PAGES = 10
export const MAX_EDGE = 2000
export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode the image.")),
      "image/png",
    ),
  )
}
export async function imageCanvas(blob: Blob): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(blob)
  try {
    if (bitmap.width * bitmap.height > 40_000_000)
      throw new Error("Image is too large. Use an image under 40 megapixels.")
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Image processing is unavailable.")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas
  } finally {
    bitmap.close()
  }
}
export interface Adjustments {
  rotation: number
  left: number
  top: number
  right: number
  bottom: number
  scale: number
}
export const initialAdjustments: Adjustments = {
  rotation: 0,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  scale: 100,
}
export async function adjustImage(
  blob: Blob,
  value: Adjustments,
): Promise<Blob> {
  if (
    ![
      value.rotation,
      value.left,
      value.top,
      value.right,
      value.bottom,
      value.scale,
    ].every(Number.isFinite) ||
    ![0, 90, 180, 270].includes(value.rotation) ||
    value.scale < 25 ||
    value.scale > 100 ||
    [value.left, value.top, value.right, value.bottom].some(
      (n) => n < 0 || n > 45,
    )
  )
    throw new Error("Invalid image adjustments.")
  const source = await imageCanvas(blob)
  const x = Math.round((source.width * value.left) / 100),
    y = Math.round((source.height * value.top) / 100)
  const w = Math.round((source.width * (100 - value.left - value.right)) / 100),
    h = Math.round((source.height * (100 - value.top - value.bottom)) / 100)
  const rotated = value.rotation % 180 !== 0
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(
    1,
    Math.round(((rotated ? h : w) * value.scale) / 100),
  )
  canvas.height = Math.max(
    1,
    Math.round(((rotated ? w : h) * value.scale) / 100),
  )
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Image processing is unavailable.")
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((value.rotation * Math.PI) / 180)
  ctx.scale(value.scale / 100, value.scale / 100)
  ctx.drawImage(source, x, y, w, h, -w / 2, -h / 2, w, h)
  return canvasBlob(canvas)
}
export async function renderPages(
  record: DemoDocument,
  signal: AbortSignal,
  progress: (text: string) => void,
): Promise<Blob[]> {
  signal.throwIfAborted()
  if (documentKind(record) === "image") {
    const blob = await canvasBlob(await imageCanvas(record.original))
    signal.throwIfAborted()
    return [blob]
  }
  if (documentKind(record) !== "pdf")
    throw new Error("OCR supports PNG, JPEG, WebP, BMP and PDF documents.")
  const pdf = await import("pdfjs-dist")
  pdf.GlobalWorkerOptions.workerSrc = new URL(
    `${import.meta.env.BASE_URL}document-assets/pdf.worker.mjs`,
    window.location.origin,
  ).href
  signal.throwIfAborted()
  const data = new Uint8Array(await record.original.arrayBuffer())
  signal.throwIfAborted()
  const pdfAssets = new URL(
    `${import.meta.env.BASE_URL}document-assets/pdf/`,
    window.location.origin,
  ).href
  const task = pdf.getDocument({
    data,
    isEvalSupported: false,
    cMapUrl: `${pdfAssets}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${pdfAssets}standard_fonts/`,
    wasmUrl: `${pdfAssets}wasm/`,
  })
  const abort = () => {
    void task.destroy()
  }
  signal.addEventListener("abort", abort, { once: true })
  try {
    const document = await task.promise
    signal.throwIfAborted()
    if (document.numPages > MAX_PAGES)
      throw new Error("PDF must contain 10 pages or fewer.")
    const pages: Blob[] = []
    for (let i = 1; i <= document.numPages; i++) {
      signal.throwIfAborted()
      progress(`Rendering page ${i} / ${document.numPages}`)
      const page = await document.getPage(i)
      const raw = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({
        scale: Math.min(2, MAX_EDGE / Math.max(raw.width, raw.height)),
      })
      const canvas = window.document.createElement("canvas")
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      if (!canvas.width || !canvas.height)
        throw new Error("PDF page has invalid dimensions.")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("PDF rendering is unavailable.")
      const render = page.render({ canvasContext: ctx, canvas, viewport })
      const cancel = () => render.cancel()
      signal.addEventListener("abort", cancel, { once: true })
      try {
        await render.promise
        signal.throwIfAborted()
        pages.push(await canvasBlob(canvas))
      } finally {
        signal.removeEventListener("abort", cancel)
        page.cleanup()
        canvas.width = canvas.height = 0
      }
    }
    return pages
  } finally {
    signal.removeEventListener("abort", abort)
    await task.destroy()
  }
}

export async function recognizePages(
  pages: Blob[],
  language: string,
  signal: AbortSignal,
  progress: (text: string) => void,
): Promise<string> {
  if (
    !pages.length ||
    pages.length > MAX_PAGES ||
    !["eng", "hin", "eng+hin"].includes(language)
  )
    throw new Error("Invalid OCR job.")
  signal.throwIfAborted()
  const bytes = await Promise.all(pages.map((page) => page.arrayBuffer()))
  signal.throwIfAborted()
  const host = new Worker(new URL("./ocrHost.worker.ts", import.meta.url), {
    type: "module",
  })
  const base = new URL(
    `${import.meta.env.BASE_URL}document-assets/`,
    window.location.origin,
  ).href
  return new Promise<string>((resolve, reject) => {
    let settled = false
    const finish = (error?: Error, text?: string) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal.removeEventListener("abort", abort)
      host.terminate()
      if (error) reject(error)
      else resolve(text || "")
    }
    const abort = () =>
      finish(new DOMException("Processing cancelled.", "AbortError"))
    const timer = setTimeout(
      () =>
        finish(
          new Error("OCR timed out. Try fewer pages or a smaller document."),
        ),
      180_000,
    )
    signal.addEventListener("abort", abort, { once: true })
    host.onerror = (event) =>
      finish(new Error(event.message || "OCR worker could not load."))
    host.onmessage = ({ data }) => {
      if (data.type === "progress") progress(data.message)
      else if (data.type === "error") finish(new Error(data.message))
      else if (data.type === "done") finish(undefined, data.text)
    }
    if (signal.aborted) {
      abort()
      return
    }
    // Terminating the owner worker also stops its nested Tesseract worker, including initialization.
    host.postMessage({ pages: bytes, language, base }, bytes)
  })
}
