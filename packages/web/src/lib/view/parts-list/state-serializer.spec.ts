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

    it('PropertyFilter（数値・文字列属性）をURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'arms',
        filters: [
          { type: 'property', property: 'weight', operator: 'lt', value: 5000 },
          { type: 'property', property: 'price', operator: 'lte', value: 100000 },
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(2)
      expect(filterParams).toContain('property:weight:lt:5000')
      expect(filterParams).toContain('property:price:lte:100000')
    })

    it('NameFilterをURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'head',
        filters: [
          { type: 'name', mode: 'contains', value: 'ZIMMER' },
          { type: 'name', mode: 'exact', value: 'HD-011 MELANDER' },
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(2)
      expect(filterParams).toContain('name:contains:ZIMMER')
      expect(filterParams).toContain('name:exact:HD-011 MELANDER')
    })

    it('ManufactureFilterをURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'core',
        filters: [
          { type: 'manufacture', values: ['BALAM', 'FURLONG', 'ARQUEBUS'] },
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(1)
      expect(filterParams[0]).toBe('manufacture:BALAM,FURLONG,ARQUEBUS')
    })

    it('CategoryFilterをURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'rightArmUnit',
        filters: [
          { type: 'category', values: ['RIFLE', 'HANDGUN'] },
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(1)
      expect(filterParams[0]).toBe('category:RIFLE,HANDGUN')
    })

    it('複数の異なるフィルタ型を同時にURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'head',
        filters: [
          { type: 'property', property: 'weight', operator: 'lte', value: 3000 },
          { type: 'name', mode: 'contains', value: 'ZIMMER' },
          { type: 'manufacture', values: ['BALAM', 'FURLONG'] },
          { type: 'category', values: ['MEDIUM'] },
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(4)
      expect(filterParams).toContain('property:weight:lte:3000')
      expect(filterParams).toContain('name:contains:ZIMMER')
      expect(filterParams).toContain('manufacture:BALAM,FURLONG')
      expect(filterParams).toContain('category:MEDIUM')
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

    it('URLパラメータからPropertyFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=arms&filter=property:weight:lt:5000&filter=property:price:lte:100000',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        expect(result.value.filters[0]).toEqual({
          type: 'property',
          property: 'weight',
          operator: 'lt',
          value: 5000,
        })
        expect(result.value.filters[1]).toEqual({
          type: 'property',
          property: 'price',
          operator: 'lte',
          value: 100000,
        })
      }
    })

    it('URLパラメータからNameFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=name:contains:ZIMMER&filter=name:exact:HD-011 MELANDER',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        expect(result.value.filters[0]).toEqual({
          type: 'name',
          mode: 'contains',
          value: 'ZIMMER',
        })
        expect(result.value.filters[1]).toEqual({
          type: 'name',
          mode: 'exact',
          value: 'HD-011 MELANDER',
        })
      }
    })

    it('URLパラメータからManufactureFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=core&filter=manufacture:BALAM,FURLONG,ARQUEBUS',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0]).toEqual({
          type: 'manufacture',
          values: ['BALAM', 'FURLONG', 'ARQUEBUS'],
        })
      }
    })

    it('URLパラメータからCategoryFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=rightArmUnit&filter=category:RIFLE,HANDGUN',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0]).toEqual({
          type: 'category',
          values: ['RIFLE', 'HANDGUN'],
        })
      }
    })

    it('URLパラメータから複数の異なるフィルタ型を復元できること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=property:weight:lte:3000&filter=name:contains:ZIMMER&filter=manufacture:BALAM,FURLONG&filter=category:MEDIUM',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(4)
        expect(result.value.filters[0]).toEqual({
          type: 'property',
          property: 'weight',
          operator: 'lte',
          value: 3000,
        })
        expect(result.value.filters[1]).toEqual({
          type: 'name',
          mode: 'contains',
          value: 'ZIMMER',
        })
        expect(result.value.filters[2]).toEqual({
          type: 'manufacture',
          values: ['BALAM', 'FURLONG'],
        })
        expect(result.value.filters[3]).toEqual({
          type: 'category',
          values: ['MEDIUM'],
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
        'slot=head&filter=property:weight:lt:5000&filter=invalid',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        if (result.value.filters[0].type === 'property') {
          expect(result.value.filters[0].property).toBe('weight')
        }
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

    it('無効なプロパティを持つPropertyFilterをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=property:weight:lt:5000&filter=property:invalid_property:gt:100&filter=property:price:lte:10000',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        if (result.value.filters[0].type === 'property') {
          expect(result.value.filters[0].property).toBe('weight')
        }
        if (result.value.filters[1].type === 'property') {
          expect(result.value.filters[1].property).toBe('price')
        }
      }
    })

    it('有効なPropertyFilterプロパティのみを許可すること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=property:weight:lt:5000&filter=property:price:lte:10000&filter=property:en_load:gt:500&filter=property:name:eq:test',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(4)
        expect(
          result.value.filters.map((f) => f.type === 'property' ? f.property : null),
        ).toEqual(['weight', 'price', 'en_load', 'name'])
      }
    })

    it('無効なNameFilterモードをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=name:contains:valid&filter=name:invalid_mode:test',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0]).toEqual({
          type: 'name',
          mode: 'contains',
          value: 'valid',
        })
      }
    })

    it('空のvaluesを持つManufactureFilterをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=manufacture:',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(0)
      }
    })

    it('空のvaluesを持つCategoryFilterをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=category:',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(0)
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
