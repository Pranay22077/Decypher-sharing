import { PNG } from "pngjs"
import { readFile } from "node:fs/promises"
import { rename } from "node:fs/promises"
import { test, expect, type Page } from "@playwright/test"

async function enter(page: Page, path = "/evidence") {
  await page.goto("/")
  await page.evaluate(() => {
    localStorage.setItem("decypher.showcase.auth", "1")
    localStorage.setItem("ui.lang", "en")
  })
  await page.goto(path)
}
async function fixture(page: Page, text: string) {
  const base64 = await page.evaluate((text) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1400
    canvas.height = 280
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 1400, 280)
    ctx.fillStyle = "black"
    ctx.font = "64px sans-serif"
    ctx.fillText(text, 60, 145)
    return canvas.toDataURL("image/png").split(",")[1]
  }, text)
  return {
    name: "private-source.png",
    mimeType: "image/png",
    buffer: Buffer.from(base64, "base64"),
  }
}

test("optional real English/Hindi OCR, adjustments, persistence and minimal QR", async ({
  page,
  browser,
}) => {
  const external: string[] = []
  page.on("request", (req) => {
    if (/tessdata|cdn.jsdelivr|projectnaptha/.test(req.url()))
      external.push(req.url())
  })
  await enter(page)
  const original = await fixture(page, "Evidence document 4827")
  await page.locator('input[type="file"]').setInputFiles(original)
  const modal = page.getByRole("dialog")
  await expect(modal).toBeVisible()
  await expect(
    modal.getByRole("button", { name: "Run OCR", exact: true }),
  ).toHaveCount(0)
  await modal.getByRole("button", { name: "Prepare document preview" }).click()
  await expect(modal.getByAltText("Adjusted document preview")).toBeVisible()
  await modal.getByRole("button", { name: "Rotate 90°" }).click()
  await modal.getByRole("button", { name: "Reset adjustments" }).click()
  await modal.getByLabel("OCR language").selectOption("eng")
  await modal.getByRole("button", { name: "Run OCR", exact: true }).click()
  await expect(modal.getByLabel("OCR output")).toHaveValue(
    /Evidence document 4827/,
    { timeout: 120_000 },
  )
  await modal
    .getByRole("button", { name: "Save evidence", exact: true })
    .click()
  await expect(modal).toHaveCount(0)
  await expect(page.getByAltText("Saved evidence image")).toBeVisible()
  await page.reload()
  await page.getByText("private-source.png", { exact: true }).first().click()
  await expect(
    page.getByText("Evidence document 4827", { exact: true }),
  ).toBeVisible()
  const href = await page
    .getByRole("link", { name: "Open hash verification" })
    .getAttribute("href")
  expect(href).toContain("demo-v1.LOCAL-")
  expect(href).not.toContain("private-source")
  const otherContext = await browser.newContext()
  const other = await otherContext.newPage()
  await other.goto(href!)
  await expect(
    other.getByText(
      "The source document is not available in this browser unless saved here separately.",
    ),
  ).toBeVisible()
  await expect(
    other.getByRole("heading", { name: "Demo identity & hash comparison" }),
  ).toBeVisible()
  await other.locator('input[type="file"]').setInputFiles(original)
  await expect(
    other.getByText(
      "Hash matches the supplied file. No blockchain verification performed.",
    ),
  ).toBeVisible()
  await other.locator('input[type="file"]').setInputFiles({
    name: "changed.png",
    mimeType: "image/png",
    buffer: Buffer.from("changed bytes"),
  })
  await expect(
    other.getByText("Hash mismatch.", { exact: false }),
  ).toBeVisible()
  await otherContext.close()
  await page.getByRole("button", { name: "Delete local document" }).click()
  await expect(
    page.getByText("private-source.png", { exact: true }),
  ).toHaveCount(0)
  await page
    .locator('input[type="file"]')
    .setInputFiles(await fixture(page, "भारत सरकार"))
  await page.getByRole("button", { name: "Prepare document preview" }).click()
  await expect(page.getByAltText("Adjusted document preview")).toBeVisible()
  await page.getByLabel("OCR language").selectOption("hin")
  await page.getByRole("button", { name: "Run OCR", exact: true }).click()
  await expect(page.getByLabel("OCR output")).toHaveValue(/भारत/, {
    timeout: 120_000,
  })
  expect(external).toEqual([])
})

test("PDF rendering, OCR cancellation, unsupported and malformed files", async ({
  page,
}) => {
  await enter(page)
  await page
    .locator('input[type="file"]')
    .setInputFiles("public/demo/nightfall-fir.pdf")
  await page.getByRole("button", { name: "Prepare document preview" }).click()
  await expect(page.getByAltText("Adjusted document preview")).toBeVisible({
    timeout: 30_000,
  })
  await page.getByRole("button", { name: "Run OCR", exact: true }).click()
  await page.getByRole("button", { name: "Cancel processing" }).click()
  await expect(
    page.getByText("Processing cancelled. Original retained."),
  ).toBeVisible()
  await expect
    .poll(
      () =>
        page.workers().filter((worker) => worker.url().includes("ocrHost"))
          .length,
    )
    .toBe(0)
  await expect(page.getByLabel("OCR output")).toHaveCount(0)
  await page.getByLabel("OCR language").selectOption("eng")
  await page.getByRole("button", { name: "Run OCR", exact: true }).click()
  await expect(page.getByLabel("OCR output")).toHaveValue(
    /FICTIONAL DEMO EVIDENCE/,
    { timeout: 120_000 },
  )
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close", exact: true })
    .click()
  await page.locator('input[type="file"]').setInputFiles({
    name: "invalid.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("not a pdf"),
  })
  await page.getByRole("button", { name: "Prepare document preview" }).click()
  await expect(page.getByRole("dialog").getByRole("alert")).toBeVisible()
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close", exact: true })
    .click()
  await page.locator('input[type="file"]').setInputFiles({
    name: "record.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("a,b\n1,2"),
  })
  await expect(
    page.getByText("This file can be stored and hashed.", { exact: false }),
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Run OCR", exact: true }),
  ).toHaveCount(0)
})

test("Hindi toggle, analysis shortcut, hardcoded screens and production asset/deep links", async ({
  page,
  request,
}) => {
  await enter(page, "/dashboard")
  await expect(
    page.getByRole("heading", { name: "Analysis Tools" }),
  ).toBeVisible()
  await page.getByRole("button", { name: "हिंदी", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "विश्लेषण उपकरण" }),
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "कमांड सेंटर" })).toBeVisible()
  await page.reload()
  await expect(page.getByRole("heading", { name: "कमांड सेंटर" })).toBeVisible()
  await page
    .getByRole("button", { name: "दस्तावेज़ स्कैनर और OCR", exact: true })
    .click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("button", { name: "बंद करें", exact: true }).click()
  for (const path of [
    "/cases",
    "/graph",
    "/timeline",
    "/financial",
    "/reports",
    "/login",
  ]) {
    await page.goto(path)
    await expect(page.locator("#root")).not.toBeEmpty()
  }
  for (const file of [
    "worker.min.js",
    "pdf.worker.mjs",
    "core/tesseract-core-simd-lstm.wasm",
    "lang/eng.traineddata.gz",
    "lang/hin.traineddata.gz",
  ]) {
    const response = await request.get(`/document-assets/${file}`)
    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).not.toContain("text/html")
  }
  await page.goto("/verify/demo-v1.invalid")
  await expect(page.getByRole("alert")).toContainText("अमान्य")
})

test("camera permission errors remain actionable without physical-camera access", async ({
  page,
}) => {
  await enter(page)
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
      value: async () => {
        throw new DOMException("Denied", "NotAllowedError")
      },
    })
  })
  await page.reload()
  await page.getByRole("button", { name: "Scan Document", exact: true }).click()
  await page.getByRole("button", { name: "Start camera", exact: true }).click()
  await expect(page.getByRole("alert")).toContainText("Camera access failed")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
})

test("simulated camera stops on capture, retake and close", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["camera"])
  await page.addInitScript(() => {
    const request = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    )
    ;(window as unknown as { demoStreams: MediaStream[] }).demoStreams = []
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      const stream = await request(constraints)
      ;(window as unknown as { demoStreams: MediaStream[] }).demoStreams.push(
        stream,
      )
      return stream
    }
  })
  await enter(page)
  await page.getByRole("button", { name: "Scan Document", exact: true }).click()
  await page.getByRole("button", { name: "Start camera", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Capture", exact: true }),
  ).toBeEnabled()
  await page.getByRole("button", { name: "Capture", exact: true }).click()
  await expect(page.getByAltText("Captured document")).toBeVisible()
  const scanDownload = page.waitForEvent("download")
  await page.getByRole("button", { name: "Save image", exact: true }).click()
  const capturedPng = PNG.sync.read(
    await readFile((await (await scanDownload).path())!),
  )
  expect(capturedPng.width).toBeGreaterThan(0)
  expect(capturedPng.height).toBeGreaterThan(0)
  await page.getByRole("button", { name: "Zoom in", exact: true }).click()
  await expect(page.getByText("125%", { exact: true })).toBeVisible()

  expect(
    await page.evaluate(() =>
      (window as unknown as { demoStreams: MediaStream[] }).demoStreams.every(
        (stream) =>
          stream.getTracks().every((track) => track.readyState === "ended"),
      ),
    ),
  ).toBe(true)
  await page.getByRole("button", { name: "Retake", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Capture", exact: true }),
  ).toBeEnabled()
  await page.getByRole("button", { name: "Close", exact: true }).click()
  expect(
    await page.evaluate(() =>
      (window as unknown as { demoStreams: MediaStream[] }).demoStreams.every(
        (stream) =>
          stream.getTracks().every((track) => track.readyState === "ended"),
      ),
    ),
  ).toBe(true)
})

test("OCR worker loading errors preserve originals and never fabricate text", async ({
  page,
}) => {
  await rename(
    "dist/document-assets/worker.min.js",
    "dist/document-assets/worker.min.js.unavailable",
  )
  try {
    await enter(page)
    await page
      .locator('input[type="file"]')
      .setInputFiles(await fixture(page, "Unprocessed original"))
    await page.getByRole("button", { name: "Prepare document preview" }).click()
    await expect(page.getByAltText("Adjusted document preview")).toBeVisible()
    await page.getByRole("button", { name: "Run OCR", exact: true }).click()
    await expect(page.getByRole("dialog").getByRole("alert")).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.getByLabel("OCR output")).toHaveCount(0)
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Close", exact: true })
      .click()
    await expect(
      page.getByRole("button", { name: "Download original", exact: true }),
    ).toBeVisible()
  } finally {
    await rename(
      "dist/document-assets/worker.min.js.unavailable",
      "dist/document-assets/worker.min.js",
    )
  }
})

test("mobile derivative adjustments preserve original hashes and clear obsolete OCR", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await enter(page)
  const original = await fixture(page, "Original frame 4827")
  await page.locator('input[type="file"]').setInputFiles(original)
  await page.getByRole("button", { name: "Prepare document preview" }).click()
  const image = page.getByAltText("Adjusted document preview")
  await expect(image).toBeVisible()
  await page.getByLabel("OCR language").selectOption("eng")
  await page.getByRole("button", { name: "Run OCR", exact: true }).click()
  await expect(page.getByLabel("OCR output")).toHaveValue(
    /Original frame 4827/,
    { timeout: 120_000 },
  )
  await page.getByRole("button", { name: "Rotate 90°" }).click()
  await expect
    .poll(() =>
      image.evaluate((img) => (img as HTMLImageElement).naturalHeight),
    )
    .toBe(1400)
  const slider = page.getByRole("slider", { name: /Resize/ })
  await slider.focus()
  await slider.press("Home")
  for (let i = 0; i < 25; i++) await slider.press("ArrowRight")
  await expect
    .poll(() =>
      image.evaluate((img) => (img as HTMLImageElement).naturalHeight),
    )
    .toBe(700)
  await page.getByRole("button", { name: "Save adjustments" }).click()
  await expect(
    page.getByText("Adjusted images saved separately.", { exact: false }),
  ).toBeVisible()
  await expect(page.getByLabel("OCR output")).toHaveCount(0)
  await page.getByRole("dialog").evaluate((el) => el.scrollTo({ top: 0 }))
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true)
  await page.screenshot({
    path: test.info().outputPath("mobile-workbench.png"),
  })
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close", exact: true })
    .click()
  const url = await page
    .getByRole("link", { name: "Open hash verification" })
    .getAttribute("href")
  await page.goto(url!)
  await page.locator('input[type="file"]').setInputFiles(original)
  await expect(
    page.getByText(
      "Hash matches the supplied file. No blockchain verification performed.",
    ),
  ).toBeVisible()
})

test("save evidence downloads displayed image, zooms without editing and reopens saved scan", async ({
  page,
}) => {
  await enter(page)
  const original = await fixture(page, "Saved scan 7312")
  await page.locator('input[type="file"]').setInputFiles(original)
  const modal = page.getByRole("dialog")
  await modal.getByRole("button", { name: "Prepare document preview" }).click()
  const image = modal.getByAltText("Adjusted document preview")
  await expect(image).toBeVisible()
  const fittedWidth = await image.evaluate(
    (img) => img.getBoundingClientRect().width,
  )
  await modal.getByRole("button", { name: "Zoom in", exact: true }).click()
  await expect
    .poll(() => image.evaluate((img) => img.getBoundingClientRect().width))
    .toBeGreaterThan(fittedWidth)
  await modal.getByRole("button", { name: "Fit", exact: true }).click()
  await expect
    .poll(() => image.evaluate((img) => img.getBoundingClientRect().width))
    .toBe(fittedWidth)
  const downloadPromise = page.waitForEvent("download")
  await modal.getByRole("button", { name: "Save image", exact: true }).click()
  const download = await downloadPromise
  const png = PNG.sync.read(await readFile((await download.path())!))
  expect([png.width, png.height]).toEqual([1400, 280])
  await modal.getByRole("button", { name: "Rotate 90°" }).click()
  await expect
    .poll(() =>
      image.evaluate((img) => (img as HTMLImageElement).naturalHeight),
    )
    .toBe(1400)
  await modal
    .getByRole("button", { name: "Save evidence", exact: true })
    .click()
  await expect(modal).toHaveCount(0)
  await expect(page.getByAltText("Saved evidence image")).toBeVisible()
  await page.reload()
  await page.getByText(original.name, { exact: true }).first().click()
  const saved = page.getByAltText("Saved evidence image")
  await expect(saved).toBeVisible()
  await expect
    .poll(() =>
      saved.evaluate((img) => (img as HTMLImageElement).naturalHeight),
    )
    .toBe(1400)
  const originalDownload = page.waitForEvent("download")
  await page
    .getByRole("button", { name: "Download original", exact: true })
    .click()
  expect(await readFile((await (await originalDownload).path())!)).toEqual(
    original.buffer,
  )
  await page.getByRole("button", { name: "Zoom in", exact: true }).click()
  await expect(page.getByText("125%", { exact: true })).toBeVisible()
  for (let i = 0; i < 7; i++)
    await page.getByRole("button", { name: "Zoom in", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Zoom in", exact: true }),
  ).toBeDisabled()
  await page
    .getByRole("button", { name: "Preview / adjust / Run OCR", exact: true })
    .click()
  await expect(modal.getByAltText("Adjusted document preview")).toBeVisible()
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = () => {
      throw new Error("Simulated save failure")
    }
  })
  await modal
    .getByRole("button", { name: "Save evidence", exact: true })
    .click()
  await expect(modal.getByRole("alert")).toHaveText("Simulated save failure")
  await expect(modal).toBeVisible()
})

test("institutional shell defaults light, uses theme flag art and orders Evidence after Cases", async ({
  page,
}) => {
  await page.goto("/")
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.reload()
  await expect(page.locator("html")).toHaveClass(/light/)
  await expect(
    page.getByText("Government of India", { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText("Ministry of Home Affairs", { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: /Where criminal intelligence/ }),
  ).toBeVisible()
  await page.screenshot({
    path: test.info().outputPath("institutional-home-light.png"),
    fullPage: false,
  })
  const heroBackground = page.locator(".institutional-flag-bg").first()
  await expect
    .poll(() =>
      heroBackground.evaluate((el) => getComputedStyle(el).backgroundImage),
    )
    .toContain("bg.png")
  await page.getByTitle("Switch to dark mode").click()
  await expect(page.locator("html")).not.toHaveClass(/light/)
  await expect
    .poll(() =>
      heroBackground.evaluate((el) => getComputedStyle(el).backgroundImage),
    )
    .toContain("tiranga-dark.jpg")
  await page.getByRole("button", { name: "Authorized Login" }).click()
  await expect(page.locator(".institutional-flag-bg")).toBeVisible()
  await page.screenshot({
    path: test.info().outputPath("login-dark.png"),
    fullPage: false,
  })
  await expect
    .poll(() =>
      page
        .locator(".institutional-flag-bg")
        .evaluate((el) => getComputedStyle(el).backgroundImage),
    )
    .toContain("tiranga-dark.jpg")
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator("main")).toBeVisible()
  await page.evaluate(() => localStorage.setItem("decypher.showcase.auth", "1"))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/dashboard")
  const labels = await page.locator("nav").getByRole("button").allTextContents()
  const cases = labels.findIndex((label) => label.trim() === "Cases")
  const evidence = labels.findIndex((label) => label.trim() === "Evidence")
  const graph = labels.findIndex(
    (label) => label.trim() === "Investigation Graph",
  )
  expect(evidence).toBe(cases + 1)
  expect(graph).toBe(evidence + 1)
})
