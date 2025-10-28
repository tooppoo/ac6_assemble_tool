import { logger } from '@ac6_assemble_tool/shared/logger'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export async function compressToUrlSafeString(input: string): Promise<string> {
  if (!hasCompressionSupport()) {
    logger.warn(
      'CompressionStream API is not available, using uncompressed payload',
    )
    return encodeWithoutCompression(input)
  }

  try {
    const compressedStream = new Blob([input])
      .stream()
      .pipeThrough(new CompressionStream('gzip'))
    const compressedBuffer = await new Response(compressedStream).arrayBuffer()
    return toBase64Url(new Uint8Array(compressedBuffer))
  } catch (error) {
    logger.warn(
      'Failed to compress payload, falling back to uncompressed encoding',
      {
        error: error instanceof Error ? error.message : String(error),
      },
    )
    return encodeWithoutCompression(input)
  }
}

export async function decompressFromUrlSafeString(
  compressed: string,
): Promise<string | null> {
  const binaryBuffer = fromBase64Url(compressed)
  if (!binaryBuffer) {
    return null
  }
  const binary = new Uint8Array(binaryBuffer)

  if (hasCompressionSupport()) {
    try {
      const readable = new Blob([binaryBuffer]).stream()
      const decompressedStream = readable.pipeThrough(
        new DecompressionStream('gzip'),
      )
      const decompressedBuffer = await new Response(
        decompressedStream,
      ).arrayBuffer()
      return textDecoder.decode(decompressedBuffer)
    } catch (error) {
      logger.warn(
        'Failed to decompress payload as gzip, attempting plain decode',
        {
          error: error instanceof Error ? error.message : String(error),
        },
      )
    }
  } else {
    logger.warn(
      'DecompressionStream API is not available, attempting plain decode',
    )
  }

  return tryDecodePlain(binary)
}

function hasCompressionSupport(): boolean {
  return (
    typeof CompressionStream !== 'undefined' &&
    typeof DecompressionStream !== 'undefined'
  )
}

function encodeWithoutCompression(input: string): string {
  return toBase64Url(textEncoder.encode(input))
}

function tryDecodePlain(bytes: Uint8Array): string | null {
  try {
    return textDecoder.decode(bytes)
  } catch (error) {
    logger.error('Failed to decode payload', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '')
}

function fromBase64Url(value: string): ArrayBuffer | null {
  if (!value) {
    return null
  }

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = (4 - (base64.length % 4)) % 4
  const padded = base64.padEnd(base64.length + padding, '=')

  try {
    const binary = atob(padded)
    const arrayBuffer = new ArrayBuffer(binary.length)
    const bytes = new Uint8Array(arrayBuffer)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return arrayBuffer
  } catch {
    return null
  }
}
