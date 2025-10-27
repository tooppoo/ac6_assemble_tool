import '@testing-library/svelte/vitest'
import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import {
  CompressionStream as NodeCompressionStream,
  DecompressionStream as NodeDecompressionStream,
} from 'node:stream/web'

import '@ac6_assemble_tool/spec/lib/vitest-extend'

// i18n初期化
import './src/lib/i18n/define'

if (typeof globalThis.CompressionStream === 'undefined') {
  Object.assign(globalThis as typeof globalThis & {
    CompressionStream: typeof NodeCompressionStream
    DecompressionStream: typeof NodeDecompressionStream
  }, {
    CompressionStream: NodeCompressionStream,
    DecompressionStream: NodeDecompressionStream,
  })
}
