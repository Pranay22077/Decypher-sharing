import { createWorker } from "tesseract.js"

interface OCRJob {
  pages: ArrayBuffer[]
  language: string
  base: string
}

const scope = self as unknown as {
  onmessage: (
    event: MessageEvent<OCRJob>,
  ) => void
  postMessage: (message: unknown) => void
}
scope.onmessage = async ({ data }) => {
  let worker: Awaited<ReturnType<typeof createWorker>> | undefined
  try {
    worker = await createWorker(data.language, 1, {
      workerPath: `${data.base}worker.min.js`,
      corePath: `${data.base}core/`,
      langPath: `${data.base}lang/`,
      workerBlobURL: false,
      logger: (message) =>
        scope.postMessage({
          type: "progress",
          message: `${message.status} ${Math.round((message.progress || 0) * 100)}%`,
        }),
      errorHandler: (error) =>
        scope.postMessage({ type: "error", message: String(error) }),
    })
    const texts: string[] = []
    for (let i = 0; i < data.pages.length; i++) {
      scope.postMessage({
        type: "progress",
        message: `OCR page ${i + 1} / ${data.pages.length}`,
      })
      const result = await worker.recognize(
        new Uint8Array(
          data.pages[i],
        ) as unknown as Parameters<typeof worker.recognize>[0],
      )
      texts.push(result.data.text.trim())
    }
    scope.postMessage({ type: "done", text: texts.join("\n\n").trim() })
  } catch (error) {
    scope.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    })
  } finally {
    await worker?.terminate()
  }
}
