const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

/**
 * フィルタシリアライゼーションで利用するURL安全なBase64エンコード済み圧縮文字列を生成
 */
export async function compressToUrlSafeString(input: string): Promise<string> {
  assertCompressionSupport()

  const stream = new CompressionStream('gzip')
  const writer = stream.writable.getWriter()
  await writer.write(textEncoder.encode(input))
  await writer.close()

  const compressed = await readableStreamToUint8Array(stream.readable)
  return toBase64Url(compressed)
}

/**
 * URL安全なBase64文字列を伸長して元の文字列に復元
 */
export async function decompressFromUrlSafeString(
  compressed: string,
): Promise<string | null> {
  assertCompressionSupport()

  const binary = fromBase64Url(compressed)
  if (!binary) {
    return null
  }

  const stream = new DecompressionStream('gzip')
  const writer = stream.writable.getWriter()
  await writer.write(binary)
  await writer.close()

  const decompressed = await readableStreamToUint8Array(stream.readable)
  return textDecoder.decode(decompressed)
}

function assertCompressionSupport(): void {
  if (
    typeof CompressionStream === 'undefined' ||
    typeof DecompressionStream === 'undefined'
  ) {
    throw new Error('CompressionStream API is not available in this runtime')
  }
}

async function readableStreamToUint8Array(
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> {
  const buffer = await new Response(stream).arrayBuffer()
  return new Uint8Array(buffer)
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '')
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!value) {
    return null
  }

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = (4 - (base64.length % 4)) % 4
  const padded = base64.padEnd(base64.length + padding, '=')

  try {
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  } catch {
    return null
  }
}
