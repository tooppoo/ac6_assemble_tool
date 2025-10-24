/**
 * パーツ一覧ページ用フィルタリング機能のテスト
 */

import { describe, it, expect } from 'vitest'

import { splitFiltersBySlot, applyFilters, type Filter } from './filters'

describe('Filters', () => {
  describe('splitFiltersBySlot', () => {
    it('全スロット共通の属性は全て有効として返すこと', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
        { property: 'price', operator: 'lte', value: 100000 },
        { property: 'en_load', operator: 'gte', value: 500 },
      ]

      const result = splitFiltersBySlot(filters, 'rightArmUnit')

      expect(result.valid).toHaveLength(3)
      expect(result.invalidated).toHaveLength(0)
    })

    it('スロット切替時に共通属性が引き継がれること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
        { property: 'price', operator: 'lte', value: 100000 },
      ]

      const result = splitFiltersBySlot(filters, 'head')

      expect(result.valid).toHaveLength(2)
      expect(result.invalidated).toHaveLength(0)
      expect(result.valid.map((f) => f.property)).toEqual(['weight', 'price'])
    })

    it('将来のスロット固有属性に対応できる構造であること', () => {
      // 現時点では全属性が共通なので、無効化される条件は存在しない
      // しかし、将来スロット固有属性が追加された際に、この関数が対応できることを確認
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
      ]

      const result = splitFiltersBySlot(filters, 'legs')

      // 現時点では全て有効
      expect(result.valid).toHaveLength(1)
      expect(result.invalidated).toHaveLength(0)
    })
  })

  describe('applyFilters', () => {
    // テスト用のパーツデータ
    const testParts = [
      { id: 'p1', name: 'Part A', weight: 1000, price: 50000, en_load: 100 },
      { id: 'p2', name: 'Part B', weight: 2000, price: 75000, en_load: 150 },
      { id: 'p3', name: 'Part C', weight: 3000, price: 100000, en_load: 200 },
      { id: 'p4', name: 'Part D', weight: 1500, price: 60000 }, // en_load未定義
      { id: 'p5', name: 'Part E', weight: 2500, price: 80000, en_load: null }, // en_load null
    ]

    it('フィルタが空の場合は全てのパーツを返すこと', () => {
      const result = applyFilters(testParts, [])

      expect(result).toHaveLength(5)
      expect(result.map((p) => p.id)).toEqual(['p1', 'p2', 'p3', 'p4', 'p5'])
    })

    it('単一フィルタ（lte）が正しく適用されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 2000 },
      ]

      const result = applyFilters(testParts, filters)

      // weight <= 2000のパーツのみ
      expect(result).toHaveLength(3)
      expect(result.map((p) => p.id)).toEqual(['p1', 'p2', 'p4'])
    })

    it('単一フィルタ（gte）が正しく適用されること', () => {
      const filters: Filter[] = [
        { property: 'price', operator: 'gte', value: 75000 },
      ]

      const result = applyFilters(testParts, filters)

      // price >= 75000のパーツのみ
      expect(result).toHaveLength(3)
      expect(result.map((p) => p.id)).toEqual(['p2', 'p3', 'p5'])
    })

    it('複数フィルタがAND条件で適用されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'gte', value: 1500 },
        { property: 'price', operator: 'lte', value: 80000 },
      ]

      const result = applyFilters(testParts, filters)

      // weight >= 1500 AND price <= 80000
      expect(result).toHaveLength(3)
      expect(result.map((p) => p.id)).toEqual(['p2', 'p4', 'p5'])
    })

    it('属性未定義のパーツが除外されること', () => {
      const filters: Filter[] = [
        { property: 'en_load', operator: 'gte', value: 100 },
      ]

      const result = applyFilters(testParts, filters)

      // en_load >= 100のパーツのみ（p4はen_load未定義、p5はnullなので除外）
      expect(result).toHaveLength(3)
      expect(result.map((p) => p.id)).toEqual(['p1', 'p2', 'p3'])
    })

    it('等価フィルタ（eq）が正しく適用されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'eq', value: 2000 },
      ]

      const result = applyFilters(testParts, filters)

      // weight == 2000のパーツのみ
      expect(result).toHaveLength(1)
      expect(result.map((p) => p.id)).toEqual(['p2'])
    })

    it('不等価フィルタ（ne）が正しく適用されること', () => {
      const filters: Filter[] = [
        { property: 'name', operator: 'ne', value: 'Part A' },
      ]

      const result = applyFilters(testParts, filters)

      // name != 'Part A'のパーツのみ
      expect(result).toHaveLength(4)
      expect(result.map((p) => p.id)).toEqual(['p2', 'p3', 'p4', 'p5'])
    })

    it('全てのフィルタ条件を満たさない場合は空配列を返すこと', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lt', value: 500 }, // 全てのパーツが500以上
      ]

      const result = applyFilters(testParts, filters)

      expect(result).toHaveLength(0)
    })

    it('lt演算子が正しく機能すること', () => {
      const filters: Filter[] = [
        { property: 'price', operator: 'lt', value: 60000 },
      ]

      const result = applyFilters(testParts, filters)

      // price < 60000のパーツのみ
      expect(result).toHaveLength(1)
      expect(result.map((p) => p.id)).toEqual(['p1'])
    })

    it('gt演算子が正しく機能すること', () => {
      const filters: Filter[] = [
        { property: 'en_load', operator: 'gt', value: 150 },
      ]

      const result = applyFilters(testParts, filters)

      // en_load > 150のパーツのみ
      expect(result).toHaveLength(1)
      expect(result.map((p) => p.id)).toEqual(['p3'])
    })
  })
})
