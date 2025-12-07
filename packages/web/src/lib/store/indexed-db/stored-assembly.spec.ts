import { createAssembly } from '@ac6_assemble_tool/core/assembly/assembly'
import type {
  ClearableStoredAssemblyRepository,
  StoredAssemblyRepository,
} from '@ac6_assemble_tool/core/assembly/store/stored-assembly'
import { genAssembly } from '@ac6_assemble_tool/core/spec-helper/property-generator'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { it } from '@fast-check/vitest'
import { ulid } from 'ulid'
import { describe, expect } from 'vitest'

import { IndexedDbRepository } from './indexed-db-repository'

describe('repository', () => {
  describe.each([
    {
      label: IndexedDbRepository.name,
      repository: new IndexedDbRepository(candidates),
    },
  ])(
    'with $label',
    ({
      repository,
    }: {
      repository: StoredAssemblyRepository & ClearableStoredAssemblyRepository
    }) => {
      it.prop([genAssembly(), genAssembly(), genAssembly()])(
        'walk through scenario',
        async (a1, a2, a3) => {
          await repository.clear()

          const [id1, id2, id3] = [ulid(10000), ulid(20000), ulid(30000)]

          await expect(repository.all(candidates)).resolves.toHaveLength(0)

          await repository.storeNew({
            id: id1,
            name: 'test-1-name',
            description: 'test-1-desc',
            assembly: a1,
          })

          await expect(repository.all(candidates)).resolves.toHaveLength(1)

          await repository.storeNew({
            id: id2,
            name: 'test-2-name',
            description: 'test-2-desc',
            assembly: a2,
          })
          await repository.storeNew({
            id: id3,
            name: 'test-3-name',
            description: 'test-3-desc',
            assembly: a3,
          })

          const find1 = await repository.findById(id3, candidates)
          expect(find1).not.toBeNull()

          const records1 = await repository.all(candidates)
          expect(records1).toHaveLength(3)

          // マージしたアセンブリを作成
          // タンク脚部の場合はboosterを強制的にNotEquippedにする
          const mergedParts = {
            ...a2,
            arms: a1.arms,
            rightArmUnit: a3.rightArmUnit,
          }

          const updatedAssembly = createAssembly(mergedParts)

          await repository.update({
            id: id2,
            name: 'test-2-new-name',
            description: 'test-2-new-desc',
            assembly: updatedAssembly,
            createdAt: records1[1].createdAt,
          })

          const records2 = await repository.all(candidates)

          expect(records1).toHaveLength(3)
          expect(records2[0]).toStrictEqual(records1[0])
          expect(records2[1]).not.toStrictEqual(records1[1])
          expect(records2[1]).toMatchObject({
            id: id2,
            name: 'test-2-new-name',
            description: 'test-2-new-desc',
            assembly: updatedAssembly,
            createdAt: records1[1].createdAt,
          })
          expect(records2[2]).toStrictEqual(records1[2])

          await repository.delete(records2[2])

          const find2 = await repository.findById(id3, candidates)
          expect(find2).toBeNull()

          const records3 = await repository.all(candidates)

          expect(records3).toHaveLength(2)
          expect(records3[0]).toStrictEqual(records2[0])
          expect(records3[1]).toStrictEqual(records2[1])
          expect(records3[2]).toBeUndefined()

          await repository.insert(records2[2], candidates)

          const records4 = await repository.all(candidates)
          expect(records4).toStrictEqual(records2)
        },
      )
    },
  )
})
