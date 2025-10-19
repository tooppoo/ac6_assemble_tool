import { createAssembly, type RawAssembly } from '#core/assembly/assembly'

import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { ulid } from 'ulid'
import { describe, it, expect, beforeEach } from 'vitest'

import { setupDataBase, TEST_ONLY_resetDataBase } from './indexed-db'
import { IndexedDbRepository } from './indexed-db-repository'

describe('IndexedDBストレージフロー統合テスト', () => {
  const repository = new IndexedDbRepository(candidates)

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
      } as RawAssembly)

      // 保存
      await repository.storeNew({
        id: testId,
        name: 'Test Assembly v2',
        description: 'v2形式テスト',
        assembly,
      })

      // 読み込み
      const loaded = await repository.findById(testId, candidates)

      // 複数のexpectを1つにまとめて、全ての不一致を一度に確認
      expect({
        exists: loaded !== null,
        name: loaded?.name,
        description: loaded?.description,
        rightArmUnit: loaded?.assembly.rightArmUnit.id,
        leftArmUnit: loaded?.assembly.leftArmUnit.id,
        rightBackUnit: loaded?.assembly.rightBackUnit.id,
        leftBackUnit: loaded?.assembly.leftBackUnit.id,
        head: loaded?.assembly.head.id,
        core: loaded?.assembly.core.id,
        arms: loaded?.assembly.arms.id,
        legs: loaded?.assembly.legs.id,
        booster: loaded?.assembly.booster.id,
        fcs: loaded?.assembly.fcs.id,
        generator: loaded?.assembly.generator.id,
        expansion: loaded?.assembly.expansion.id,
      }).toEqual({
        exists: true,
        name: 'Test Assembly v2',
        description: 'v2形式テスト',
        rightArmUnit: assembly.rightArmUnit.id,
        leftArmUnit: assembly.leftArmUnit.id,
        rightBackUnit: assembly.rightBackUnit.id,
        leftBackUnit: assembly.leftBackUnit.id,
        head: assembly.head.id,
        core: assembly.core.id,
        arms: assembly.arms.id,
        legs: assembly.legs.id,
        booster: assembly.booster.id,
        fcs: assembly.fcs.id,
        generator: assembly.generator.id,
        expansion: assembly.expansion.id,
      })
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
      } as RawAssembly)

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
      } as RawAssembly)

      await repository.storeNew({
        id: id1,
        name: 'Assembly 1',
        description: 'First',
        assembly: assembly1,
      })
      await repository.storeNew({
        id: id2,
        name: 'Assembly 2',
        description: 'Second',
        assembly: assembly2,
      })
      await repository.storeNew({
        id: id3,
        name: 'Assembly 3',
        description: 'Third',
        assembly: assembly1,
      })

      const all = await repository.all(candidates)

      expect({
        count: all.length,
        name1: all[0]?.name,
        name2: all[1]?.name,
        name3: all[2]?.name,
      }).toEqual({
        count: 3,
        name1: 'Assembly 1',
        name2: 'Assembly 2',
        name3: 'Assembly 3',
      })
    }, 15000)
  })

  describe('v1形式データの自動変換', () => {
    it('v1形式データを直接挿入し、読み込み時に自動変換される', async () => {
      const testId = ulid()
      const db = setupDataBase(candidates)

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

      // v1形式のインデックスから正しいパーツIDが取得されている
      expect({
        exists: loaded !== null,
        name: loaded?.name,
        head: loaded?.assembly.head.id,
        core: loaded?.assembly.core.id,
        arms: loaded?.assembly.arms.id,
        legs: loaded?.assembly.legs.id,
        rightArmUnit: loaded?.assembly.rightArmUnit.id,
      }).toEqual({
        exists: true,
        name: 'v1 Format Assembly',
        head: candidates.head[5].id,
        core: candidates.core[3].id,
        arms: candidates.arms[7].id,
        legs: candidates.legs[4].id,
        rightArmUnit: candidates.rightArmUnit[3].id,
      })
    }, 15000)

    it('v1形式データを読み込み後、更新するとv2形式で保存される', async () => {
      const testId = ulid()
      const db = setupDataBase(candidates)

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
      await repository.update({
        ...loaded!,
        name: 'Updated Assembly',
      })

      // 再度読み込み
      const reloaded = await repository.findById(testId, candidates)

      // データがv2形式になっていることを確認
      const rawData = await db.stored_assembly.get(testId)

      expect({
        name: reloaded?.name,
        hasV2Param: rawData?.assembly.includes('v=2'),
        hasIdFormat: rawData?.assembly.match(/h=[A-Z]+\d+/) !== null,
      }).toEqual({
        name: 'Updated Assembly',
        hasV2Param: true,
        hasIdFormat: true,
      })
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
      } as RawAssembly)

      await repository.storeNew({
        id: testId,
        name: 'To Be Deleted',
        description: '',
        assembly,
      })

      const before = await repository.findById(testId, candidates)
      expect(before).not.toBeNull()

      await repository.delete(before!)

      const after = await repository.findById(testId, candidates)
      expect(after).toBeNull()
    }, 15000)
  })

  describe('v1形式データのDBバージョンアップグレード時自動移行', () => {
    it('DBバージョン1からバージョン2へのアップグレード時にv1形式データが自動変換される', async () => {
      // 既存のDBを完全に削除
      await repository.clear()
      const { Dexie } = await import('dexie')
      await Dexie.delete('ac6-assembly-tool')

      // DBバージョン1のスキーマでデータを作成
      const dbV1 = new Dexie('ac6-assembly-tool')
      dbV1.version(1).stores({
        stored_assembly: 'id,name,createdAt,updatedAt',
      })

      // v1形式データを直接挿入
      const v1Data = {
        id: ulid(10000),
        name: 'V1 Assembly',
        description: 'v1形式テストデータ',
        assembly: 'h=0&c=1&a=2&l=3&rau=4&lau=5&rbu=6&lbu=7&b=8&f=9&g=10&e=11',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      await dbV1.table('stored_assembly').add(v1Data)
      dbV1.close()

      // バージョン2のDBを開く（アップグレードが自動実行される）
      const dbV2 = setupDataBase(candidates)

      // データを取得してv2形式に変換されていることを確認
      const stored = await dbV2.stored_assembly.get(v1Data.id)

      expect({
        exists: stored !== undefined,
        hasV2Param: stored?.assembly.includes('v=2'),
        name: stored?.name,
      }).toEqual({
        exists: true,
        hasV2Param: true,
        name: 'V1 Assembly',
      })

      // クリーンアップ
      await Dexie.delete('ac6-assembly-tool')
      TEST_ONLY_resetDataBase()
    }, 15000)

    it('v2形式データはそのまま保持される', async () => {
      // 既にv2形式のデータを保存
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

      await repository.storeNew({
        id: testId,
        name: 'V2 Assembly',
        description: 'v2形式テストデータ',
        assembly,
      })

      // DBを再度開いてもv2形式のまま
      const db = setupDataBase(candidates)
      const stored = await db.stored_assembly.get(testId)
      expect(stored?.assembly).toContain('v=2')

      // クリーンアップはafterEachで行われる
    }, 15000)
  })
})
