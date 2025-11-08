import { describe, expect, it } from 'vitest'

import { normalizeSlotKey, parseFilter } from './serialization'

describe('filter serialization utilities', () => {
  describe('parseFilter', () => {
    it('numericフィルタをパースできること', () => {
      const filter = parseFilter('numeric:weight:lte:500')
      expect(filter?.property).toBe('weight')
      expect(filter?.serialize()).toBe('numeric:weight:lte:500')
    })

    it('文字列フィルタをパースできること', () => {
      const filter = parseFilter('string:name:contain:zimmer')
      expect(filter?.property).toBe('name')
      expect(filter?.serialize()).toBe('string:name:contain:zimmer')
    })

    it('配列フィルタ（manufacture）をパースできること', () => {
      const filter = parseFilter('array:manufacture:in_any:balam,allmind')
      expect(filter?.property).toBe('manufacture')
      expect(filter?.serialize()).toBe('array:manufacture:in_any:balam,allmind')
    })

    it('配列フィルタ（category）をパースできること', () => {
      const filter = parseFilter('array:category:in_any:bazooka,shotgun')
      expect(filter?.property).toBe('category')
      expect(filter?.serialize()).toBe('array:category:in_any:bazooka,shotgun')
    })

    it.each([
      ['空文字', ''],
      ['要素不足', 'numeric:weight:lte'],
      ['無効なデータ型', 'unknown:weight:eq:5'],
      ['空のプロパティ名', 'numeric::eq:5'],
      ['無効な演算子', 'numeric:weight:unknown:5'],
      ['数値変換失敗', 'numeric:weight:eq:abc'],
      ['空文字列値', 'string:name:contain:'],
      ['無効な配列プロパティ', 'array:unknown:in_any:foo'],
      ['空の配列値', 'array:manufacture:in_any:'],
    ])('parseFilterがnullを返す: %s', (_, input) => {
      expect(parseFilter(input)).toBeNull()
    })

    it('動的属性を持つフィルターを正しく復元できること', () => {
      // 動的属性（attack_power など）のフィルターが正しく復元される
      const filter = parseFilter('numeric:attack_power:gte:500')
      expect(filter).not.toBeNull()
      expect(filter?.property).toBe('attack_power')
      expect(filter?.value).toBe(500)
    })
  })

  describe('normalizeSlotKey', () => {
    it.each([
      ['rightArmUnit', 'rightArmUnit'],
      ['right_arm_unit', 'rightArmUnit'],
      ['left_back_unit', 'leftBackUnit'],
    ])('スロットキーを正規化できる: %s', (input, expected) => {
      expect(normalizeSlotKey(input)).toBe(expected)
    })

    it('無効なキーはnullを返すこと', () => {
      expect(normalizeSlotKey('invalid_slot')).toBeNull()
    })
  })
})
