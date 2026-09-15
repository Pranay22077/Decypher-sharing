import { createRequire } from "node:module"
import { mkdir, copyFile, readdir, cp } from "node:fs/promises"
import path from "node:path"

const require = createRequire(import.meta.url)
const root = path.resolve("public/document-assets")
const tess = path.dirname(require.resolve("tesseract.js/package.json"))
const core = path.dirname(
  require.resolve("tesseract.js-core/package.json", { paths: [tess] }),
)
const pdf = path.dirname(require.resolve("pdfjs-dist/package.json"))
await mkdir(`${root}/core`, { recursive: true })
await mkdir(`${root}/lang`, { recursive: true })
await copyFile(`${tess}/dist/worker.min.js`, `${root}/worker.min.js`)
await copyFile(`${pdf}/build/pdf.worker.mjs`, `${root}/pdf.worker.mjs`)
for (const folder of ["cmaps", "standard_fonts", "wasm"])
  await cp(`${pdf}/${folder}`, `${root}/pdf/${folder}`, { recursive: true })
for (const name of await readdir(core))
  if (/\.wasm(?:\.js)?$/.test(name))
    await copyFile(path.join(core, name), `${root}/core/${name}`)
for (const language of ["eng", "hin"]) {
  const source = path.dirname(
    require.resolve(`@tesseract.js-data/${language}/package.json`),
  )
  await copyFile(
    `${source}/4.0.0/${language}.traineddata.gz`,
    `${root}/lang/${language}.traineddata.gz`,
  )
}
// Preserve notices alongside the redistributed processing assets.
for (const [name, folder] of [
  ["tesseract", tess],
  ["tesseract-core", core],
  ["pdfjs", pdf],
]) {
  for (const file of await readdir(folder))
    if (/^licen[sc]e/i.test(file))
      await copyFile(path.join(folder, file), `${root}/${name}-${file}`)
}
console.log("Local document processing assets prepared.")
