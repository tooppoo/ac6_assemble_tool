import { createAssembly, type RawAssembly } from '#core/assembly/assembly'
import { IndexedDbRepository } from '#core/assembly/store/repository/indexed-db/indexed-db-repository'

import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { ulid } from 'ulid'
import { describe, it, expect, beforeEach } from 'vitest'

describe('IndexedDB v2形式対応', () => {
  const repository = new IndexedDbRepository(candidates)

  beforeEach(async () => {
    await repository.clear()
  })

  it('v2形式で機体構成を保存・読み込みできる', async () => {
    const testId = ulid()
    const assembly = createAssembly({
      rightArmUnit: candidates.rightArmUnit[0],
      leftArmUnit: candidates.leftArmUnit[0],
      rightBackUnit: candidates.rightBackUnit[0],
      leftBackUnit: candidates.leftBackUnit[0],
      head: candidates.head[0],
      core: candidates.core[0],
      arms: candidates.arms[0],
      legs: candidates.legs[0],
      booster: candidates.booster[0],
      fcs: candidates.fcs[0],
      generator: candidates.generator[0],
      expansion: candidates.expansion[0],
    } as RawAssembly)

    await repository.storeNew(
      {
        id: testId,
        name: 'Test v2',
        description: 'Test v2 format',
        assembly,
      },
      candidates,
    )

    const result = await repository.findById(testId, candidates)

    expect(result).not.toBeNull()
    expect(result?.id).toBe(testId)
    expect(result?.name).toBe('Test v2')
    expect(result?.assembly.head.id).toBe(assembly.head.id)
    expect(result?.assembly.core.id).toBe(assembly.core.id)
  }, 15000)
})
