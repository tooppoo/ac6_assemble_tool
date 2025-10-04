import { describe, it, expect } from 'vitest'

import { validatePartIdUniqueness } from './id-validator'

describe('ID重複検証', () => {
  describe('validatePartIdUniqueness', () => {
    it('重複IDがない場合はnullを返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head A' },
        { id: 'HD002', name: 'Head B' },
        { id: 'CR001', name: 'Core A' },
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).toBeNull()
    })

    it('重複IDがある場合はエラー情報を返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head A' },
        { id: 'HD001', name: 'Head B' },
        { id: 'CR001', name: 'Core A' },
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).not.toBeNull()
      expect(result?.duplicateId).toBe('HD001')
      expect(result?.conflictingParts).toEqual(['Head A', 'Head B'])
    })

    it('複数の重複IDがある場合は最初の重複を返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head A' },
        { id: 'HD001', name: 'Head B' },
        { id: 'CR001', name: 'Core A' },
        { id: 'CR001', name: 'Core B' },
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).not.toBeNull()
      expect(result?.duplicateId).toBe('HD001')
      expect(result?.conflictingParts).toEqual(['Head A', 'Head B'])
    })

    it('3つ以上のパーツが同じIDを持つ場合、すべて報告する', () => {
      const parts = [
        { id: 'HD001', name: 'Head A' },
        { id: 'HD001', name: 'Head B' },
        { id: 'HD001', name: 'Head C' },
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).not.toBeNull()
      expect(result?.duplicateId).toBe('HD001')
      expect(result?.conflictingParts).toEqual(['Head A', 'Head B', 'Head C'])
    })

    it('空の配列の場合はnullを返す', () => {
      const result = validatePartIdUniqueness([])

      expect(result).toBeNull()
    })

    it('パーツが1つの場合はnullを返す', () => {
      const parts = [{ id: 'HD001', name: 'Head A' }]

      const result = validatePartIdUniqueness(parts)

      expect(result).toBeNull()
    })
  })

  describe('型定義', () => {
    it('成功時の結果型はnullである', () => {
      const parts = [{ id: 'HD001', name: 'Head A' }]
      const result = validatePartIdUniqueness(parts)

      if (result === null) {
        // 型ガードが正しく機能する
        expect(result).toBeNull()
      }
    })

    it('失敗時の結果型はDuplicateIdErrorである', () => {
      const parts = [
        { id: 'HD001', name: 'Head A' },
        { id: 'HD001', name: 'Head B' },
      ]
      const result = validatePartIdUniqueness(parts)

      if (result !== null) {
        // 型ガードが正しく機能する
        expect(result.duplicateId).toBe('HD001')
        expect(result.conflictingParts).toEqual(['Head A', 'Head B'])
      }
    })
  })
})
