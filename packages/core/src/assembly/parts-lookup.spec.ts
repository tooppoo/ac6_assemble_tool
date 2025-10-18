import { describe, it, expect } from 'bun:test'
import fc from 'fast-check'

import {
  createPartIdMap,
  findPartByIdOrFallbackFromMap,
  findPartByIdOrFirst,
} from './parts-lookup'

import {
  genPartsAndSearchId,
  genPartsWithFallback,
  genParts,
} from '#spec-helper/property-generator'

// 共通テストデータ - describe外で定義
const testParts = [
  { id: 'HD001', name: 'Head A', classification: 'head' },
  { id: 'HD002', name: 'Head B', classification: 'head' },
  { id: 'HD003', name: 'Head C', classification: 'head' },
] as const

describe('パーツID検索', () => {
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

  describe('findPartByIdOrFallbackFromMap', () => {
    const fallback = { id: 'HD000', name: 'Default Head' }

    // Parameterized test: 見つかるケース
    it.each([
      { id: 'HD001', expectedName: 'Head A' },
      { id: 'HD002', expectedName: 'Head B' },
      { id: 'HD003', expectedName: 'Head C' },
    ])(
      'MapからID $id が見つかった場合は $expectedName を返す',
      ({ id, expectedName }) => {
        const map = createPartIdMap(testParts)
        const result = findPartByIdOrFallbackFromMap(map, id, fallback)

        expect({
          id: result.id,
          name: result.name,
        }).toEqual({
          id,
          name: expectedName,
        })
      },
    )

    // Parameterized test: 見つからないケース
    it.each(['HD999', 'INVALID', 'HD000'])(
      'MapからID "%s" が見つからない場合はフォールバックを返す',
      (invalidId) => {
        const map = createPartIdMap(testParts)
        const result = findPartByIdOrFallbackFromMap(map, invalidId, fallback)

        expect({
          id: result.id,
          name: result.name,
        }).toEqual({
          id: 'HD000',
          name: 'Default Head',
        })
      },
    )
  })

  describe('findPartByIdOrFirst', () => {
    // Parameterized test: 見つかるケース
    it.each([
      { id: 'HD001', expectedName: 'Head A' },
      { id: 'HD002', expectedName: 'Head B' },
      { id: 'HD003', expectedName: 'Head C' },
    ])(
      'ID $id が見つかった場合は $expectedName を返す',
      ({ id, expectedName }) => {
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
      },
    )

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

  describe('Property-based tests', () => {
    it('任意のパーツ配列で、findPartByIdOrFirstは必ず値を返す（空配列以外）', () => {
      fc.assert(
        fc.property(genPartsAndSearchId(), ({ parts, searchId }) => {
          const result = findPartByIdOrFirst(parts, searchId)

          const expected = parts.find((p) => p.id === searchId) ?? parts[0]
          expect(result).toEqual(expected)
        }),
        { numRuns: 100 },
      )
    })

    it('任意のパーツ配列とフォールバックで、findPartByIdOrFallbackFromMapは必ず値を返す', () => {
      fc.assert(
        fc.property(genPartsWithFallback(), ({ parts, searchId, fallback }) => {
          const map = createPartIdMap(parts)
          const result = findPartByIdOrFallbackFromMap(map, searchId, fallback)
          const expected = parts.find((p) => p.id === searchId) ?? fallback
          expect(result).toEqual(expected)
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
            expect(map.get(part.id)).toEqual(part)
          }
        }),
        { numRuns: 100 },
      )
    })
  })
})
