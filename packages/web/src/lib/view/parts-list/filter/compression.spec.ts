import { afterEach, describe, expect, it } from 'vitest'

import {
  compressToUrlSafeString,
  decompressFromUrlSafeString,
} from './compression'

const SAMPLE_TEXT = JSON.stringify({
  slot: 'rightArmUnit',
  filters: ['numeric:weight:lte:500'],
})

describe('compression utilities', () => {
  const originalCompression = globalThis.CompressionStream
  const originalDecompression = globalThis.DecompressionStream

  afterEach(() => {
    if (originalCompression) {
      globalThis.CompressionStream = originalCompression
    }
    if (originalDecompression) {
      globalThis.DecompressionStream = originalDecompression
    }
  })

  it('compresses and decompresses data without loss', async () => {
    const compressed = await compressToUrlSafeString(SAMPLE_TEXT)
    expect(compressed).toMatch(/^[A-Za-z0-9_-]+$/u)

    const decompressed = await decompressFromUrlSafeString(compressed)
    expect(decompressed).toBe(SAMPLE_TEXT)
  })

  it('returns null when decompressing invalid payload', async () => {
    const decompressed = await decompressFromUrlSafeString('@@')
    expect(decompressed).toBeNull()
  })

  it('falls back to uncompressed payload when CompressionStream API is unavailable', async () => {
    Reflect.deleteProperty(globalThis, 'CompressionStream')
    Reflect.deleteProperty(globalThis, 'DecompressionStream')

    const compressed = await compressToUrlSafeString(SAMPLE_TEXT)
    expect(compressed).toMatch(/^[A-Za-z0-9_-]+$/u)

    const decompressed = await decompressFromUrlSafeString(compressed)
    expect(decompressed).toBe(SAMPLE_TEXT)
  })
})
