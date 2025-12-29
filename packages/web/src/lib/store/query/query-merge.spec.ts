
import { assemblyToSearchV2 } from "@ac6_assemble_tool/core/assembly/serialize/as-query-v2"
import { genAssembly } from "@ac6_assemble_tool/core/spec-helper/property-generator"
import { it as fcit } from '@fast-check/vitest'
import { describe, expect } from "vitest"

import { mergeAssemblyParams } from "./query-merge"

describe('query-merge', () => {
  describe(mergeAssemblyParams, () => {
    fcit.prop([genAssembly()])('アセンブリ系パラメータのみをマージし、他のクエリを保持する', (assembly) => {
      const assemblyParams = assemblyToSearchV2(assembly)
      const current = new URLSearchParams('lng=ja&foo=bar')

      mergeAssemblyParams(current, assemblyParams)

      expect(current.get('lng')).toBe('ja')
      expect(current.get('foo')).toBe('bar')
      assemblyParams.forEach((value, key) => {
        expect(current.get(key)).toBe(value)
      })

    })
  })
})
