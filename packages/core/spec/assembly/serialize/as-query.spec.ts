import {
  assemblyToSearch,
  searchToAssembly,
} from '#core/assembly/serialize/as-query'
import {
  genAssembly,
  genCandidates,
} from '@ac6_assemble_tool/core/spec-helper/property-generator'

import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

describe('query', () => {
  test('can inter-convert between assembly and query', () => {
    fc.assert(fc.property(
      genCandidates().chain((candidates) =>
        fc.record({
          candidates: fc.constant(candidates),
          assembly: genAssembly(candidates),
        }),
      ),
      ({ assembly, candidates }) => {
        expect(
          searchToAssembly(assemblyToSearch(assembly, candidates), candidates),
        ).toStrictEqual(assembly)
      }
    ))
  })
})
