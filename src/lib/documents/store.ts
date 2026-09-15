import { browserSha256 } from "../api"

export const MAX_BYTES = 20 * 1024 * 1024
export interface DemoDocument {
  id: string
  name: string
  mime: string
  createdAt: string
  hash: string
  original: Blob
  pages?: Blob[]
  text?: string
  language?: string
}

function openStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB)
      return reject(new Error("Browser storage is unavailable."))
    let abandoned = false
    const request = indexedDB.open("decypher.demo.documents.v1", 1)
    request.onupgradeneeded = () =>
      request.result.createObjectStore("documents", { keyPath: "id" })
    request.onsuccess = () => {
      if (abandoned) {
        request.result.close()
        return
      }
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(new Error("Could not open browser storage."))
    request.onblocked = () => {
      abandoned = true
      reject(new Error("Close other Decypher tabs and retry browser storage."))
    }
  })
}

async function transaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openStore()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("documents", mode)
    const request = operation(tx.objectStore("documents"))
    tx.oncomplete = () => {
      db.close()
      resolve(request.result)
    }
    tx.onabort = tx.onerror = () => {
      db.close()
      reject(
        new Error(
          "Browser storage failed. Check available space and browser permissions.",
        ),
      )
    }
  })
}
export const listDocuments = () =>
  transaction("readonly", (store) => store.getAll()) as Promise<DemoDocument[]>
export const getDocument = (id: string) =>
  transaction("readonly", (store) =>
    store.get(id),
  ) as Promise<DemoDocument | undefined>
export const saveDocument = (record: DemoDocument) =>
  transaction("readwrite", (store) => store.put(record))
export const deleteDocument = (id: string) =>
  transaction("readwrite", (store) => store.delete(id))

export async function createDocument(file: File): Promise<DemoDocument> {
  if (!file.size) throw new Error("The selected file is empty.")
  if (file.size > MAX_BYTES)
    throw new Error("Evidence must be 20 MB or smaller.")
  const record: DemoDocument = {
    id: `LOCAL-${crypto.randomUUID()}`,
    name: file.name,
    mime: file.type,
    createdAt: new Date().toISOString(),
    hash: await browserSha256(file),
    original: file,
  }
  await saveDocument(record)
  return record
}

export function documentKind(record: DemoDocument): "image" | "pdf" | "other" {
  if (/^image\/(png|jpeg|webp|bmp)$/.test(record.mime)) return "image"
  if (record.mime === "application/pdf" || /\.pdf$/i.test(record.name))
    return "pdf"
  return "other"
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
