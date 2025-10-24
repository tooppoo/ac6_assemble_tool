import { Result } from '@praha/byethrow'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  serializeToURL,
  deserializeFromURL,
  saveViewMode,
  loadViewMode,
  splitFiltersBySlot,
  applyFilters,
  type SharedState,
  type Filter,
} from './state-serializer'

describe('StateSerializer', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    // LocalStorageをクリア
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('serializeToURL', () => {
    it('スロット選択状態をURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'head',
        filters: [],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      expect(params.get('slot')).toBe('head')
    })

    it('フィルタ条件をURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'arms',
        filters: [
          { property: 'weight', operator: 'lt', value: 5000 },
          { property: 'price', operator: 'lte', value: 100000 },
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(2)
      expect(filterParams).toContain('weight:lt:5000')
      expect(filterParams).toContain('price:lte:100000')
    })

    it('並び替え設定をURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'legs',
        filters: [],
        sortKey: 'weight',
        sortOrder: 'asc',
      }

      const params = serializeToURL(state)

      expect(params.get('sort')).toBe('weight:asc')
    })

    it('並び替えがnullの場合、sortパラメータを含めないこと', () => {
      const state: SharedState = {
        slot: 'core',
        filters: [],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      expect(params.has('sort')).toBe(false)
    })
  })

  describe('deserializeFromURL', () => {
    it('URLパラメータからスロット選択状態を復元できること', () => {
      const params = new URLSearchParams('slot=head')

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('head')
      }
    })

    it('URLパラメータからフィルタ条件を復元できること', () => {
      const params = new URLSearchParams(
        'slot=arms&filter=weight:lt:5000&filter=price:lte:100000',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        expect(result.value.filters[0]).toEqual({
          property: 'weight',
          operator: 'lt',
          value: 5000,
        })
        expect(result.value.filters[1]).toEqual({
          property: 'price',
          operator: 'lte',
          value: 100000,
        })
      }
    })

    it('URLパラメータから並び替え設定を復元できること', () => {
      const params = new URLSearchParams('slot=legs&sort=weight:asc')

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.sortKey).toBe('weight')
        expect(result.value.sortOrder).toBe('asc')
      }
    })

    it('スロットパラメータが不正な場合、エラーを返すこと', () => {
      const params = new URLSearchParams('slot=invalid')

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(false)
      if (result.type === 'Failure') {
        expect(result.error.type).toBe('invalid_slot')
      }
    })

    it('スロットパラメータが存在しない場合、デフォルト値(rightArmUnit)を使用すること', () => {
      const params = new URLSearchParams('')

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('rightArmUnit')
      }
    })

    it('フィルタパラメータが不正な形式の場合、該当フィルタをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=weight:lt:5000&filter=invalid',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0].property).toBe('weight')
      }
    })

    it('並び替えパラメータが不正な形式の場合、並び替えをnullにすること', () => {
      const params = new URLSearchParams('slot=head&sort=invalid')

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.sortKey).toBe(null)
        expect(result.value.sortOrder).toBe(null)
      }
    })

    it('無効なプロパティを持つフィルタをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=weight:lt:5000&filter=invalid_property:gt:100&filter=price:lte:10000',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        expect(result.value.filters[0].property).toBe('weight')
        expect(result.value.filters[1].property).toBe('price')
      }
    })

    it('有効なプロパティのみを許可すること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=weight:lt:5000&filter=price:lte:10000&filter=en_load:gt:500&filter=name:eq:test',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(4)
        expect(
          result.value.filters.map((f: { property: string }) => f.property),
        ).toEqual(['weight', 'price', 'en_load', 'name'])
      }
    })
  })

  describe('saveViewMode', () => {
    it('表示モードをLocalStorageに保存できること', () => {
      saveViewMode('list')

      const saved = localStorage.getItem('ac6-parts-list-view-mode')
      expect(saved).toBe('list')
    })

    it('表示モードを上書き保存できること', () => {
      saveViewMode('grid')
      saveViewMode('list')

      const saved = localStorage.getItem('ac6-parts-list-view-mode')
      expect(saved).toBe('list')
    })
  })

  describe('loadViewMode', () => {
    it('LocalStorageから表示モードを読み込めること', () => {
      localStorage.setItem('ac6-parts-list-view-mode', 'list')

      const viewMode = loadViewMode()

      expect(viewMode).toBe('list')
    })

    it('LocalStorageに表示モードが存在しない場合、デフォルト(grid)を返すこと', () => {
      const viewMode = loadViewMode()

      expect(viewMode).toBe('grid')
    })

    it('LocalStorageの値が不正な場合、デフォルト(grid)を返すこと', () => {
      localStorage.setItem('ac6-parts-list-view-mode', 'invalid')

      const viewMode = loadViewMode()

      expect(viewMode).toBe('grid')
    })
  })

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

      // rightArmUnit -> head
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
      const filters: Filter[] = [{ property: 'weight', operator: 'lte', value: 2000 }]

      const result = applyFilters(testParts, filters)

      // weight <= 2000のパーツのみ
      expect(result).toHaveLength(3)
      expect(result.map((p) => p.id)).toEqual(['p1', 'p2', 'p4'])
    })

    it('単一フィルタ（gte）が正しく適用されること', () => {
      const filters: Filter[] = [{ property: 'price', operator: 'gte', value: 75000 }]

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
      const filters: Filter[] = [{ property: 'en_load', operator: 'gte', value: 100 }]

      const result = applyFilters(testParts, filters)

      // en_load >= 100のパーツのみ（p4はen_load未定義、p5はnullなので除外）
      expect(result).toHaveLength(3)
      expect(result.map((p) => p.id)).toEqual(['p1', 'p2', 'p3'])
    })

    it('等価フィルタ（eq）が正しく適用されること', () => {
      const filters: Filter[] = [{ property: 'weight', operator: 'eq', value: 2000 }]

      const result = applyFilters(testParts, filters)

      // weight == 2000のパーツのみ
      expect(result).toHaveLength(1)
      expect(result.map((p) => p.id)).toEqual(['p2'])
    })

    it('不等価フィルタ（ne）が正しく適用されること', () => {
      const filters: Filter[] = [{ property: 'name', operator: 'ne', value: 'Part A' }]

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
      const filters: Filter[] = [{ property: 'price', operator: 'lt', value: 60000 }]

      const result = applyFilters(testParts, filters)

      // price < 60000のパーツのみ
      expect(result).toHaveLength(1)
      expect(result.map((p) => p.id)).toEqual(['p1'])
    })

    it('gt演算子が正しく機能すること', () => {
      const filters: Filter[] = [{ property: 'en_load', operator: 'gt', value: 150 }]

      const result = applyFilters(testParts, filters)

      // en_load > 150のパーツのみ
      expect(result).toHaveLength(1)
      expect(result.map((p) => p.id)).toEqual(['p3'])
    })
  })
})
