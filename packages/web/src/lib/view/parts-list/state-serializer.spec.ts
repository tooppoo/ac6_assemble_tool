import { Result } from '@praha/byethrow'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  serializeToURL,
  deserializeFromURL,
  saveViewMode,
  loadViewMode,
  type SharedState,
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

    it('スロットパラメータが存在しない場合、デフォルト値(head)を使用すること', () => {
      const params = new URLSearchParams('')

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('head')
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
})
