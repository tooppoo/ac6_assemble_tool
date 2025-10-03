import { describe, it, expect } from 'vitest'
import { findPartById } from './parts-lookup'

describe('パーツID検索', () => {
  describe('findPartById', () => {
    it('IDでパーツを検索して見つかった場合は該当パーツを返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head A', classification: 'head' },
        { id: 'HD002', name: 'Head B', classification: 'head' },
        { id: 'HD003', name: 'Head C', classification: 'head' },
      ] as const

      const result = findPartById(parts, 'HD002')

      expect(result).toBeDefined()
      expect(result?.id).toBe('HD002')
      expect(result?.name).toBe('Head B')
    })

    it('IDが見つからない場合はundefinedを返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head A', classification: 'head' },
        { id: 'HD002', name: 'Head B', classification: 'head' },
      ] as const

      const result = findPartById(parts, 'HD999')

      expect(result).toBeUndefined()
    })

    it('空の配列の場合はundefinedを返す', () => {
      const result = findPartById([], 'HD001')

      expect(result).toBeUndefined()
    })

    it('複数のパーツが同じIDを持つ場合は最初のパーツを返す', () => {
      // 通常は発生しないが、念のためテスト
      const parts = [
        { id: 'HD001', name: 'Head A', classification: 'head' },
        { id: 'HD001', name: 'Head B', classification: 'head' },
      ] as const

      const result = findPartById(parts, 'HD001')

      expect(result?.name).toBe('Head A')
    })

    it('大文字小文字を区別する', () => {
      const parts = [
        { id: 'HD001', name: 'Head A', classification: 'head' },
      ] as const

      const result = findPartById(parts, 'hd001')

      expect(result).toBeUndefined()
    })

    it('異なる型のパーツでも検索できる', () => {
      const parts = [
        { id: 'CR001', name: 'Core A', classification: 'core', ap: 1000 },
        { id: 'CR002', name: 'Core B', classification: 'core', ap: 1200 },
      ] as const

      const result = findPartById(parts, 'CR001')

      expect(result).toBeDefined()
      expect(result?.id).toBe('CR001')
      expect(result?.name).toBe('Core A')
    })
  })
})
