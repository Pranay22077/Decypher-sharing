export function stopCamera(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}
// A late permission response must not leave a camera active after the modal closes.
export async function acquireCamera(
  signal: AbortSignal,
  request = () =>
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    }),
) {
  signal.throwIfAborted()
  const stream = await request()
  if (signal.aborted) {
    stopCamera(stream)
    signal.throwIfAborted()
  }
  return stream
}
