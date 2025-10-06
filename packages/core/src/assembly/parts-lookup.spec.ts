import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

import {
  createPartIdMap,
  findPartById,
  findPartByIdFromMap,
  findPartByIdOrFallback,
  findPartByIdOrFirst,
} from './parts-lookup'
import {
  genPartWithId,
  genPartsAndSearchId,
  genPartsWithFallback,
  genParts,
} from '../../spec-helper/property-generator'

// 共通テストデータ - describe外で定義
const testParts = [
  { id: 'HD001', name: 'Head A', classification: 'head' },
  { id: 'HD002', name: 'Head B', classification: 'head' },
  { id: 'HD003', name: 'Head C', classification: 'head' },
] as const

const testCores = [
  { id: 'CR001', name: 'Core A', classification: 'core', ap: 1000 },
  { id: 'CR002', name: 'Core B', classification: 'core', ap: 1200 },
] as const

describe('パーツID検索', () => {
  describe('findPartById', () => {
    // Parameterized test: 複数のIDで同じテストロジックを実行
    it.each([
      { id: 'HD001', expectedName: 'Head A' },
      { id: 'HD002', expectedName: 'Head B' },
      { id: 'HD003', expectedName: 'Head C' },
    ])('ID $id でパーツを検索して $expectedName を返す', ({ id, expectedName }) => {
      const result = findPartById(testParts, id)

      expect({
        defined: result !== undefined,
        id: result?.id,
        name: result?.name,
      }).toEqual({
        defined: true,
        id,
        name: expectedName,
      })
    })

    // Parameterized test: 見つからないケース
    it.each([
      'HD999',
      'HD000',
      'INVALID',
      '',
    ])('存在しないID "%s" の場合はundefinedを返す', (invalidId) => {
      const result = findPartById(testParts, invalidId)
      expect(result).toBeUndefined()
    })

    it('空の配列の場合はundefinedを返す', () => {
      const result = findPartById([], 'HD001')
      expect(result).toBeUndefined()
    })
  })

  describe('createPartIdMap', () => {
    it('パーツ配列からID→パーツのMapを作成', () => {
      const map = createPartIdMap(testParts)

      expect({
        size: map.size,
        hasHD001: map.has('HD001'),
        hasHD002: map.has('HD002'),
        hasHD003: map.has('HD003'),
        hd001Name: map.get('HD001')?.name,
        hd002Name: map.get('HD002')?.name,
      }).toEqual({
        size: 3,
        hasHD001: true,
        hasHD002: true,
        hasHD003: true,
        hd001Name: 'Head A',
        hd002Name: 'Head B',
      })
    })
  })

  describe('findPartByIdFromMap', () => {
    // Parameterized test: 複数のIDでMap検索をテスト
    it.each([
      { id: 'HD001', expectedName: 'Head A' },
      { id: 'HD002', expectedName: 'Head B' },
      { id: 'HD003', expectedName: 'Head C' },
    ])('MapからID $id で検索して $expectedName を返す', ({ id, expectedName }) => {
      const map = createPartIdMap(testParts)
      const result = findPartByIdFromMap(map, id)

      expect({
        defined: result !== undefined,
        id: result?.id,
        name: result?.name,
      }).toEqual({
        defined: true,
        id,
        name: expectedName,
      })
    })

    it('IDが見つからない場合はundefinedを返す', () => {
      const map = createPartIdMap(testParts)
      const result = findPartByIdFromMap(map, 'HD999')
      expect(result).toBeUndefined()
    })
  })

  describe('findPartByIdOrFallback', () => {
    const fallback = { id: 'HD000', name: 'Default Head' }

    // Parameterized test: 見つかるケース
    it.each([
      { id: 'HD001', expectedName: 'Head A' },
      { id: 'HD002', expectedName: 'Head B' },
      { id: 'HD003', expectedName: 'Head C' },
    ])('ID $id が見つかった場合は $expectedName を返す', ({ id, expectedName }) => {
      const result = findPartByIdOrFallback(testParts, id, fallback)

      expect({
        id: result.id,
        name: result.name,
      }).toEqual({
        id,
        name: expectedName,
      })
    })

    // Parameterized test: 見つからないケース
    it.each([
      'HD999',
      'INVALID',
      'HD000',
    ])('ID "%s" が見つからない場合はフォールバックを返す', (invalidId) => {
      const result = findPartByIdOrFallback(testParts, invalidId, fallback)

      expect({
        id: result.id,
        name: result.name,
      }).toEqual({
        id: 'HD000',
        name: 'Default Head',
      })
    })
  })

  describe('findPartByIdOrFirst', () => {
    // Parameterized test: 見つかるケース
    it.each([
      { id: 'HD001', expectedName: 'Head A' },
      { id: 'HD002', expectedName: 'Head B' },
      { id: 'HD003', expectedName: 'Head C' },
    ])('ID $id が見つかった場合は $expectedName を返す', ({ id, expectedName }) => {
      const result = findPartByIdOrFirst(testParts, id)

      expect({
        defined: result !== undefined,
        id: result?.id,
        name: result?.name,
      }).toEqual({
        defined: true,
        id,
        name: expectedName,
      })
    })

    // Parameterized test: 見つからないケースと undefined ケース
    it.each([
      { id: 'HD999', description: 'IDが見つからない' },
      { id: undefined, description: 'IDがundefined' },
    ])('$description 場合は配列の最初の要素を返す', ({ id }) => {
      const result = findPartByIdOrFirst(testParts, id)

      expect({
        defined: result !== undefined,
        id: result?.id,
        name: result?.name,
      }).toEqual({
        defined: true,
        id: 'HD001',
        name: 'Head A',
      })
    })

    it('空の配列の場合はundefinedを返す', () => {
      const result = findPartByIdOrFirst([], 'HD001')
      expect(result).toBeUndefined()
    })
  })

  describe('異なる型のパーツでも動作する', () => {
    // Parameterized test: 異なる型のパーツ
    it.each([
      { id: 'CR001', expectedName: 'Core A', expectedAp: 1000 },
      { id: 'CR002', expectedName: 'Core B', expectedAp: 1200 },
    ])(
      'ID $id の追加プロパティを持つパーツでも検索できる',
      ({ id, expectedName, expectedAp }) => {
        const result = findPartById(testCores, id)

        expect({
          defined: result !== undefined,
          id: result?.id,
          name: result?.name,
          ap: result?.ap,
        }).toEqual({
          defined: true,
          id,
          name: expectedName,
          ap: expectedAp,
        })
      },
    )
  })

  describe('Property-based tests', () => {
    it('任意のパーツ配列で、存在するIDは必ず見つかる', () => {
      fc.assert(
        fc.property(genPartWithId(), ({ parts, targetPart }) => {
          const result = findPartById(parts, targetPart.id)

          expect(result).toBeDefined()
          expect(result?.id).toBe(targetPart.id)
          expect(result?.name).toBe(targetPart.name)
        }),
        { numRuns: 100 },
      )
    })

    it('任意のパーツ配列とMapで、同じIDは同じ結果を返す', () => {
      fc.assert(
        fc.property(genPartsAndSearchId(), ({ parts, searchId }) => {
          const arrayResult = findPartById(parts, searchId)
          const map = createPartIdMap(parts)
          const mapResult = findPartByIdFromMap(map, searchId)

          expect(arrayResult?.id).toBe(mapResult?.id)
          expect(arrayResult?.name).toBe(mapResult?.name)
        }),
        { numRuns: 100 },
      )
    })

    it('任意のパーツ配列で、findPartByIdOrFirstは必ず値を返す（空配列以外）', () => {
      fc.assert(
        fc.property(genPartsAndSearchId(), ({ parts, searchId }) => {
          const result = findPartByIdOrFirst(parts, searchId)

          expect(result).toBeDefined()

          if (parts.some((p) => p.id === searchId)) {
            expect(result?.id).toBe(searchId)
          } else {
            expect(result?.id).toBe(parts[0].id)
          }
        }),
        { numRuns: 100 },
      )
    })

    it('任意のパーツ配列とフォールバックで、findPartByIdOrFallbackは必ず値を返す', () => {
      fc.assert(
        fc.property(genPartsWithFallback(), ({ parts, searchId, fallback }) => {
          const result = findPartByIdOrFallback(parts, searchId, fallback)

          expect(result).toBeDefined()

          if (parts.some((p) => p.id === searchId)) {
            expect(result.id).toBe(searchId)
          } else {
            expect(result.id).toBe(fallback.id)
            expect(result.name).toBe(fallback.name)
          }
        }),
        { numRuns: 100 },
      )
    })

    it('任意のパーツ配列で、createPartIdMapは全てのパーツをMapに含む', () => {
      fc.assert(
        fc.property(genParts(), (parts) => {
          const map = createPartIdMap(parts)

          expect(map.size).toBe(parts.length)

          for (const part of parts) {
            expect(map.has(part.id)).toBe(true)
            expect(map.get(part.id)?.name).toBe(part.name)
          }
        }),
        { numRuns: 100 },
      )
    })
  })
})
