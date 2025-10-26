import { Result } from '@praha/byethrow'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import { buildPropertyFilter, buildNameFilter, buildManufactureFilter, buildCategoryFilter } from './filter/filters-application'
import { numericOperands, stringOperands, selectAnyOperand } from './filter/filters-core'
import {
  serializeToURL,
  deserializeFromURL,
  saveViewMode,
  loadViewMode,
  saveFiltersPerSlotToLocalStorage,
  loadFiltersPerSlotFromLocalStorage,
  type SharedState,
  type FiltersPerSlot,
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
      const operands = numericOperands()
      const ltOperand = operands.find((op) => op.id === 'lt')!
      const lteOperand = operands.find((op) => op.id === 'lte')!

      const state: SharedState = {
        slot: 'arms',
        filters: [
          buildPropertyFilter('weight', ltOperand, 5000),
          buildPropertyFilter('price', lteOperand, 100000),
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(2)
      expect(filterParams).toContain('numeric:weight:lt:5000')
      expect(filterParams).toContain('numeric:price:lte:100000')
    })

    it('NameFilterをURLパラメータに変換できること', () => {
      const operands = stringOperands()
      const containOperand = operands.find((op) => op.id === 'contain')!
      const exactOperand = operands.find((op) => op.id === 'exact')!

      const state: SharedState = {
        slot: 'head',
        filters: [
          buildNameFilter(containOperand, 'ZIMMER'),
          buildNameFilter(exactOperand, 'HD-011 MELANDER'),
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(2)
      expect(filterParams).toContain('string:name:contain:ZIMMER')
      expect(filterParams).toContain('string:name:exact:HD-011 MELANDER')
    })

    it('ManufactureFilterをURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'core',
        filters: [
          buildManufactureFilter(selectAnyOperand(), ['BALAM', 'FURLONG', 'ARQUEBUS']),
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(1)
      expect(filterParams[0]).toBe('array:manufacture:in_any:BALAM,FURLONG,ARQUEBUS')
    })

    it('CategoryFilterをURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'rightArmUnit',
        filters: [
          buildCategoryFilter(selectAnyOperand(), ['RIFLE', 'HANDGUN']),
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(1)
      expect(filterParams[0]).toBe('array:category:in_any:RIFLE,HANDGUN')
    })

    it('複数の異なるフィルタ型を同時にURLパラメータに変換できること', () => {
      const numOps = numericOperands()
      const strOps = stringOperands()
      const lteOperand = numOps.find((op) => op.id === 'lte')!
      const containOperand = strOps.find((op) => op.id === 'contain')!

      const state: SharedState = {
        slot: 'head',
        filters: [
          buildPropertyFilter('weight', lteOperand, 3000),
          buildNameFilter(containOperand, 'ZIMMER'),
          buildManufactureFilter(selectAnyOperand(), ['BALAM', 'FURLONG']),
          buildCategoryFilter(selectAnyOperand(), ['MEDIUM']),
        ],
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      const filterParams = params.getAll('filter')
      expect(filterParams).toHaveLength(4)
      expect(filterParams).toContain('numeric:weight:lte:3000')
      expect(filterParams).toContain('string:name:contain:ZIMMER')
      expect(filterParams).toContain('array:manufacture:in_any:BALAM,FURLONG')
      expect(filterParams).toContain('array:category:in_any:MEDIUM')
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
        'slot=arms&filter=numeric:weight:lt:5000&filter=numeric:price:lte:100000',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        // 復元されたフィルタのプロパティを確認
        expect(result.value.filters[0].property).toBe('weight')
        expect(result.value.filters[0].value).toBe(5000)
        expect(result.value.filters[0].operand.id).toBe('lt')
        expect(result.value.filters[1].property).toBe('price')
        expect(result.value.filters[1].value).toBe(100000)
        expect(result.value.filters[1].operand.id).toBe('lte')
      }
    })

    it('URLパラメータからNameFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=string:name:contain:ZIMMER&filter=string:name:exact:HD-011 MELANDER',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        expect(result.value.filters[0].property).toBe('name')
        expect(result.value.filters[0].value).toBe('ZIMMER')
        expect(result.value.filters[0].operand.id).toBe('contain')
        expect(result.value.filters[1].property).toBe('name')
        expect(result.value.filters[1].value).toBe('HD-011 MELANDER')
        expect(result.value.filters[1].operand.id).toBe('exact')
      }
    })

    it('URLパラメータからManufactureFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=core&filter=array:manufacture:in_any:BALAM,FURLONG,ARQUEBUS',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0].property).toBe('manufacture')
        expect(result.value.filters[0].value).toEqual(['BALAM', 'FURLONG', 'ARQUEBUS'])
        expect(result.value.filters[0].operand.id).toBe('in_any')
      }
    })

    it('URLパラメータからCategoryFilterを復元できること', () => {
      const params = new URLSearchParams(
        'slot=rightArmUnit&filter=array:category:in_any:RIFLE,HANDGUN',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0].property).toBe('category')
        expect(result.value.filters[0].value).toEqual(['RIFLE', 'HANDGUN'])
        expect(result.value.filters[0].operand.id).toBe('in_any')
      }
    })

    it('URLパラメータから複数の異なるフィルタ型を復元できること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=numeric:weight:lte:3000&filter=string:name:contain:ZIMMER&filter=array:manufacture:in_any:BALAM,FURLONG&filter=array:category:in_any:MEDIUM',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(4)
        expect(result.value.filters[0].property).toBe('weight')
        expect(result.value.filters[0].value).toBe(3000)
        expect(result.value.filters[0].operand.id).toBe('lte')
        expect(result.value.filters[1].property).toBe('name')
        expect(result.value.filters[1].value).toBe('ZIMMER')
        expect(result.value.filters[1].operand.id).toBe('contain')
        expect(result.value.filters[2].property).toBe('manufacture')
        expect(result.value.filters[2].value).toEqual(['BALAM', 'FURLONG'])
        expect(result.value.filters[2].operand.id).toBe('in_any')
        expect(result.value.filters[3].property).toBe('category')
        expect(result.value.filters[3].value).toEqual(['MEDIUM'])
        expect(result.value.filters[3].operand.id).toBe('in_any')
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
        'slot=head&filter=numeric:weight:lt:5000&filter=invalid',
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

    it('無効なプロパティを持つPropertyFilterをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=numeric:weight:lt:5000&filter=numeric:invalid_property:gt:100&filter=numeric:price:lte:10000',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(2)
        expect(result.value.filters[0].property).toBe('weight')
        expect(result.value.filters[1].property).toBe('price')
      }
    })

    it('有効なPropertyFilterプロパティのみを許可すること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=numeric:weight:lt:5000&filter=numeric:price:lte:10000&filter=numeric:en_load:gt:500',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(3)
        expect(
          result.value.filters.map((f) => f.property),
        ).toEqual(['weight', 'price', 'en_load'])
      }
    })

    it('無効なNameFilterモードをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=string:name:contain:valid&filter=string:name:invalid_mode:test',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(1)
        expect(result.value.filters[0].property).toBe('name')
        expect(result.value.filters[0].operand.id).toBe('contain')
        expect(result.value.filters[0].value).toBe('valid')
      }
    })

    it('空のvaluesを持つManufactureFilterをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=array:manufacture:selectAny:',
      )

      const result = deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filters).toHaveLength(0)
      }
    })

    it('空のvaluesを持つCategoryFilterをスキップすること', () => {
      const params = new URLSearchParams(
        'slot=head&filter=array:category:selectAny:',
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

  describe('FiltersPerSlot persistence', () => {
    it('LocalStorageに保存したフィルタが関数ごと復元できること', () => {
      const filtersPerSlot: FiltersPerSlot = {
        rightArmUnit: [
          buildPropertyFilter('weight', numericOperands()[0], 1200),
          buildNameFilter(stringOperands()[0], 'HML-G2/P19 LAMIA'),
        ],
      }

      saveFiltersPerSlotToLocalStorage(filtersPerSlot)

      const loaded = loadFiltersPerSlotFromLocalStorage()

      expect(loaded).not.toBeNull()
      const restoredFilters = loaded?.rightArmUnit
      expect(restoredFilters).toBeDefined()
      expect(restoredFilters).toHaveLength(2)

      // stringify/serialize が復元されていること（JSON経由では現状失われるためREDになる）
      expect(typeof restoredFilters?.[0]?.stringify).toBe('function')
      expect(typeof restoredFilters?.[0]?.serialize).toBe('function')
    })
  })
})
