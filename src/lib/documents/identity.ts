export interface DemoIdentity {
  id: string
  hash: string
}
const ID =
  /^LOCAL-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const HASH = /^[0-9a-f]{64}$/
export function identityToken(identity: DemoIdentity): string {
  if (!ID.test(identity.id) || !HASH.test(identity.hash))
    throw new Error("Invalid demo identity.")
  return `demo-v1.${identity.id}.${identity.hash}`
}
export function parseIdentity(token: string): DemoIdentity | null {
  const parts = token.split(".")
  return parts.length === 3 &&
    parts[0] === "demo-v1" &&
    ID.test(parts[1]) &&
    HASH.test(parts[2])
    ? { id: parts[1], hash: parts[2] }
    : null
}
export function verificationUrl(
  identity: DemoIdentity,
  origin = window.location.origin,
): string {
  return new URL(`/verify/${identityToken(identity)}`, origin).href
}
export async function qrImage(identity: DemoIdentity): Promise<string> {
  const { toDataURL } = await import("qrcode")
  return toDataURL(verificationUrl(identity), {
    errorCorrectionLevel: "M",
    margin: 4,
    width: 384,
  })
}
