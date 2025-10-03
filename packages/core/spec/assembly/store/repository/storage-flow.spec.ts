import { describe, it, expect, beforeEach } from 'vitest'
import { createAssembly } from '#core/assembly/assembly'
import { IndexedDbRepository } from '#core/assembly/store/repository/indexed-db/indexed-db-repository'
import { setupDataBase } from '#core/assembly/store/repository/indexed-db/indexed-db'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { ulid } from 'ulid'

describe('IndexedDBストレージフロー統合テスト', () => {
  const repository = new IndexedDbRepository()

  beforeEach(async () => {
    await repository.clear()
  })

  describe('v2形式での保存→読み込みフロー', () => {
    it('機体構成をv2形式で保存し、正しく読み込める', async () => {
      const testId = ulid()
      const assembly = createAssembly({
        rightArmUnit: candidates.rightArmUnit[5],
        leftArmUnit: candidates.leftArmUnit[10],
        rightBackUnit: candidates.rightBackUnit[8],
        leftBackUnit: candidates.leftBackUnit[12],
        head: candidates.head[7],
        core: candidates.core[3],
        arms: candidates.arms[9],
        legs: candidates.legs[6],
        booster: candidates.booster[4],
        fcs: candidates.fcs[2],
        generator: candidates.generator[5],
        expansion: candidates.expansion[1],
      })

      // 保存
      await repository.storeNew(
        {
          id: testId,
          name: 'Test Assembly v2',
          description: 'v2形式テスト',
          assembly,
        },
        candidates,
      )

      // 読み込み
      const loaded = await repository.findById(testId, candidates)

      expect(loaded).not.toBeNull()
      expect(loaded?.name).toBe('Test Assembly v2')
      expect(loaded?.description).toBe('v2形式テスト')

      // 全部位が正しく復元されている
      expect(loaded?.assembly.rightArmUnit.id).toBe(assembly.rightArmUnit.id)
      expect(loaded?.assembly.leftArmUnit.id).toBe(assembly.leftArmUnit.id)
      expect(loaded?.assembly.head.id).toBe(assembly.head.id)
      expect(loaded?.assembly.core.id).toBe(assembly.core.id)
      expect(loaded?.assembly.arms.id).toBe(assembly.arms.id)
      expect(loaded?.assembly.legs.id).toBe(assembly.legs.id)
      expect(loaded?.assembly.booster.id).toBe(assembly.booster.id)
      expect(loaded?.assembly.fcs.id).toBe(assembly.fcs.id)
      expect(loaded?.assembly.generator.id).toBe(assembly.generator.id)
      expect(loaded?.assembly.expansion.id).toBe(assembly.expansion.id)
    }, 15000)

    it('複数の機体構成を保存し、全て読み込める', async () => {
      const id1 = ulid(1000)
      const id2 = ulid(2000)
      const id3 = ulid(3000)

      const assembly1 = createAssembly({
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
      })

      const assembly2 = createAssembly({
        rightArmUnit: candidates.rightArmUnit[1],
        leftArmUnit: candidates.leftArmUnit[1],
        rightBackUnit: candidates.rightBackUnit[1],
        leftBackUnit: candidates.leftBackUnit[1],
        head: candidates.head[1],
        core: candidates.core[1],
        arms: candidates.arms[1],
        legs: candidates.legs[1],
        booster: candidates.booster[1],
        fcs: candidates.fcs[1],
        generator: candidates.generator[1],
        expansion: candidates.expansion[1],
      })

      await repository.storeNew(
        { id: id1, name: 'Assembly 1', description: 'First', assembly: assembly1 },
        candidates,
      )
      await repository.storeNew(
        { id: id2, name: 'Assembly 2', description: 'Second', assembly: assembly2 },
        candidates,
      )
      await repository.storeNew(
        { id: id3, name: 'Assembly 3', description: 'Third', assembly: assembly1 },
        candidates,
      )

      const all = await repository.all(candidates)

      expect(all).toHaveLength(3)
      expect(all[0].name).toBe('Assembly 1')
      expect(all[1].name).toBe('Assembly 2')
      expect(all[2].name).toBe('Assembly 3')
    }, 15000)
  })

  describe('v1形式データの自動変換', () => {
    it('v1形式データを直接挿入し、読み込み時に自動変換される', async () => {
      const testId = ulid()
      const db = setupDataBase()

      // v1形式データを直接IndexedDBに挿入
      const v1Data = {
        id: testId,
        name: 'v1 Format Assembly',
        description: 'v1形式のデータ',
        assembly: 'h=5&c=3&a=7&l=4&b=2&f=1&g=4&e=0&rau=3&lau=5&rbu=6&lbu=8',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.stored_assembly.add(v1Data)

      // リポジトリ経由で読み込み（自動変換される）
      const loaded = await repository.findById(testId, candidates)

      expect(loaded).not.toBeNull()
      expect(loaded?.name).toBe('v1 Format Assembly')

      // v1形式のインデックスから正しいパーツIDが取得されている
      expect(loaded?.assembly.head.id).toBe(candidates.head[5].id)
      expect(loaded?.assembly.core.id).toBe(candidates.core[3].id)
      expect(loaded?.assembly.arms.id).toBe(candidates.arms[7].id)
      expect(loaded?.assembly.legs.id).toBe(candidates.legs[4].id)
      expect(loaded?.assembly.rightArmUnit.id).toBe(candidates.rightArmUnit[3].id)
    }, 15000)

    it('v1形式データを読み込み後、更新するとv2形式で保存される', async () => {
      const testId = ulid()
      const db = setupDataBase()

      // v1形式データを挿入
      const v1Data = {
        id: testId,
        name: 'v1 Assembly',
        description: 'v1形式',
        assembly: 'h=0&c=1&a=2&l=3&b=0&f=0&g=0&e=0&rau=0&lau=0&rbu=0&lbu=0',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      await db.stored_assembly.add(v1Data)

      // 読み込み
      const loaded = await repository.findById(testId, candidates)
      expect(loaded).not.toBeNull()

      // 更新
      await repository.update(
        {
          ...loaded!,
          name: 'Updated Assembly',
        },
        candidates,
      )

      // 再度読み込み
      const reloaded = await repository.findById(testId, candidates)
      expect(reloaded?.name).toBe('Updated Assembly')

      // データがv2形式になっていることを確認
      const rawData = await db.stored_assembly.get(testId)
      expect(rawData?.assembly).toContain('v=2')
      expect(rawData?.assembly).toMatch(/h=[A-Z]+\d+/)
    }, 15000)
  })

  describe('エッジケース', () => {
    it('存在しないIDで検索するとnullが返る', async () => {
      const result = await repository.findById('NONEXISTENT_ID', candidates)
      expect(result).toBeNull()
    })

    it('削除後は読み込めなくなる', async () => {
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
      })

      await repository.storeNew(
        { id: testId, name: 'To Be Deleted', description: '', assembly },
        candidates,
      )

      const before = await repository.findById(testId, candidates)
      expect(before).not.toBeNull()

      await repository.delete(before!)

      const after = await repository.findById(testId, candidates)
      expect(after).toBeNull()
    }, 15000)
  })
})
