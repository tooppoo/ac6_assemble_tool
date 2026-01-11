import { latest as regulation } from '$lib/regulation'

import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { initializeAssembly } from './initialize-assembly'
import { buildAssemblyFromQuery } from './assembly-from-query'

describe('assembly-from-query', () => {
  const candidates = regulation.candidates

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('クエリからアセンブリを復元できる', () => {
    const baseAssembly = initializeAssembly(candidates)
    const params = assemblyToSearchV2(baseAssembly)

    const { assembly, migratedParams } = buildAssemblyFromQuery(
      params,
      candidates,
    )

    expect(migratedParams).toBeUndefined()
    expect(assemblyToSearchV2(assembly).toString()).toBe(params.toString())
  })
})
