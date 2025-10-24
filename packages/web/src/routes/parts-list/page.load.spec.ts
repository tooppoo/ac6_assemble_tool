/**
 * パーツ一覧ページのルートテスト
 *
 * TDD RED Phase:
 * - ページデータのロードをテスト
 * - URLパラメータからの状態復元をテスト
 * - パーツデータのロードをテスト
 */

import { describe, it, expect } from 'vitest'
import { load } from './+page'

describe('パーツ一覧ページのルート (+page.ts)', () => {
  describe('load関数', () => {
    it('regulationデータを含むPageDataを返すこと', () => {
      const result = load()

      expect(result).toHaveProperty('regulation')
      expect(result.regulation).toBeDefined()
      expect(result.regulation).toHaveProperty('version')
    })

    it('regulationに有効なバージョンが含まれること', () => {
      const result = load()

      // バージョンが存在し、文字列であること
      expect(typeof result.regulation.version).toBe('string')
      expect(result.regulation.version.length).toBeGreaterThan(0)
    })

    it('regulationにcandidatesが含まれること', () => {
      const result = load()

      expect(result.regulation).toHaveProperty('candidates')
      expect(result.regulation.candidates).toBeDefined()

      // 必須スロットが存在すること
      expect(result.regulation.candidates).toHaveProperty('head')
      expect(result.regulation.candidates).toHaveProperty('core')
      expect(result.regulation.candidates).toHaveProperty('arms')
      expect(result.regulation.candidates).toHaveProperty('legs')
    })

    it('各スロットのcandidatesが配列であること', () => {
      const result = load()

      expect(Array.isArray(result.regulation.candidates.head)).toBe(true)
      expect(Array.isArray(result.regulation.candidates.core)).toBe(true)
      expect(Array.isArray(result.regulation.candidates.arms)).toBe(true)
      expect(Array.isArray(result.regulation.candidates.legs)).toBe(true)
    })

    it('各スロットのcandidatesに少なくとも1つのパーツが含まれること', () => {
      const result = load()

      expect(result.regulation.candidates.head.length).toBeGreaterThan(0)
      expect(result.regulation.candidates.core.length).toBeGreaterThan(0)
      expect(result.regulation.candidates.arms.length).toBeGreaterThan(0)
      expect(result.regulation.candidates.legs.length).toBeGreaterThan(0)
    })

    it('パーツに必須プロパティ(id, name)が含まれること', () => {
      const result = load()

      const firstHead = result.regulation.candidates.head[0]
      expect(firstHead).toHaveProperty('id')
      expect(firstHead).toHaveProperty('name')
      expect(typeof firstHead.id).toBe('string')
      expect(typeof firstHead.name).toBe('string')
    })
  })
})
