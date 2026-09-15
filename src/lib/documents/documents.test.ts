import "fake-indexeddb/auto"
import { describe, expect, it, vi, afterEach } from "vitest"
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  saveDocument,
} from "./store"
import {
  identityToken,
  parseIdentity,
  qrImage,
  verificationUrl,
} from "./identity"
import { acquireCamera } from "./camera"
import { browserSha256 } from "../api"
import { translateUi } from "../../context/uiMessages"
import { PNG } from "pngjs"
import jsQR from "jsqr"

afterEach(() => vi.unstubAllGlobals())
describe("browser document intake", () => {
  it("preserves original bytes and unique IDs across reloads and derivative writes", async () => {
    const file = new File(["abc"], "sensitive-case.txt", { type: "text/plain" })
    const first = await createDocument(file)
    const second = await createDocument(file)
    expect(first.hash).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    )
    expect(first.id).not.toBe(second.id)
    await saveDocument({
      ...first,
      pages: [new Blob(["edited scan"])],
      text: "real OCR output",
    })
    const loaded = await getDocument(first.id)
    expect(await loaded!.original.text()).toBe("abc")
    expect(loaded!.text).toBe("real OCR output")
    expect(
      await browserSha256(new File([loaded!.original], loaded!.name)),
    ).toBe(first.hash)
    expect((await listDocuments()).map((record) => record.id)).toContain(
      second.id,
    )
    await deleteDocument(first.id)
    expect(await getDocument(first.id)).toBeUndefined()
    await deleteDocument(second.id)
  })
  it("rejects empty and oversized originals without persisting them", async () => {
    await expect(createDocument(new File([], "empty.pdf"))).rejects.toThrow(
      "empty",
    )
    await expect(
      createDocument(
        new File([new Uint8Array(20 * 1024 * 1024 + 1)], "large.pdf"),
      ),
    ).rejects.toThrow("20 MB")
    expect(await listDocuments()).toEqual([])
  })
  it("reports storage unavailability instead of reporting a saved file", async () => {
    vi.stubGlobal("indexedDB", undefined)
    await expect(
      createDocument(new File(["document"], "source.txt")),
    ).rejects.toThrow("storage is unavailable")
  })
})
describe("demo QR", () => {
  const identity = {
    id: "LOCAL-12345678-1234-4321-8123-123456789abc",
    hash: "a".repeat(64),
  }
  it("independently decodes the generated PNG into a minimal, versioned verification URL", async () => {
    vi.stubGlobal("window", { location: { origin: "https://demo.example" } })
    const data = await qrImage(identity)
    const png = PNG.sync.read(Buffer.from(data.split(",")[1], "base64"))
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
    expect(decoded!.data).toBe(
      verificationUrl(identity, "https://demo.example"),
    )
    expect(
      parseIdentity(new URL(decoded!.data).pathname.split("/").pop()!),
    ).toEqual(identity)
    expect(decoded!.data).not.toMatch(/sensitive|case|document|text=/i)
  })
  it("rejects malformed IDs, extra fields, hashes and unsupported payload versions", () => {
    expect(parseIdentity(identityToken(identity))).toEqual(identity)
    expect(parseIdentity(`demo-v2.${identity.id}.${identity.hash}`)).toBeNull()
    expect(
      parseIdentity(`demo-v1.${identity.id}.${identity.hash}.private`),
    ).toBeNull()
    expect(parseIdentity("demo-v1.fake.short")).toBeNull()
    expect(() => identityToken({ ...identity, hash: "invalid" })).toThrow()
  })
})
describe("camera cancellation", () => {
  it("stops a camera granted after cancellation", async () => {
    const controller = new AbortController()
    const stop = vi.fn()
    let allow: (stream: MediaStream) => void = () => { throw new Error("No camera request was made."); }
    const pending = acquireCamera(
      controller.signal,
      () =>
        new Promise((resolve) => {
          allow = resolve
        }),
    )
    controller.abort()
    allow({ getTracks: () => [{ stop }] } as unknown as MediaStream)
    await expect(pending).rejects.toMatchObject({ name: "AbortError" })
    expect(stop).toHaveBeenCalledOnce()
  })
  it("does not request permission after cancellation", async () => {
    const controller = new AbortController()
    controller.abort()
    const request = vi.fn()
    await expect(
      acquireCamera(controller.signal, request),
    ).rejects.toMatchObject({ name: "AbortError" })
    expect(request).not.toHaveBeenCalled()
  })
})
describe("Hindi interface labels", () => {
  it("translates missing screen labels while preserving English, filenames, IDs and OCR content", () => {
    expect(translateUi("Analysis Tools", "hi")).toBe("विश्लेषण उपकरण")
    expect(translateUi("Evidence Library", "hi")).toBe("साक्ष्य पुस्तकालय")
    expect(translateUi("  Upload Evidence  ", "hi")).toBe("  साक्ष्य अपलोड करें  ")
    expect(translateUi("Evidence Library", "en")).toBe("Evidence Library")
    for (const value of [
      "EV-2026-0001",
      "private-document.pdf",
      "An original document sentence.",
    ])
      expect(translateUi(value, "hi")).toBe(value)
  })
})
