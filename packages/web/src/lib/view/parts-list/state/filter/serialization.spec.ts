import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildCategoryFilter,
  buildManufactureFilter,
  buildNameFilter,
  buildPropertyFilter,
} from './filters-application'
import type { Filter } from './filters-core'
import {
  numericOperands,
  selectAnyOperand,
  stringOperands,
} from './filters-core'
import {
  deserializeFiltersPerSlotFromURL,
  loadFiltersPerSlotFromLocalStorage,
  parseFilter,
  saveFiltersPerSlotToLocalStorage,
  serializeFiltersPerSlotToURL,
  type FiltersPerSlot,
} from './serialization'

const numericOp = numericOperands()
const stringOp = stringOperands()

describe('filter serialization utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

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
      ['無効なプロパティ', 'numeric:unknown:eq:5'],
      ['無効な演算子', 'numeric:weight:unknown:5'],
      ['数値変換失敗', 'numeric:weight:eq:abc'],
      ['空文字列値', 'string:name:contain:'],
      ['無効な配列プロパティ', 'array:unknown:in_any:foo'],
      ['空の配列値', 'array:manufacture:in_any:'],
    ])('parseFilterがnullを返す: %s', (_, input) => {
      expect(parseFilter(input)).toBeNull()
    })
  })

  describe('serializeFiltersPerSlotToURL', () => {
    it('空フィルタは空文字列になること', () => {
      const serialized = serializeFiltersPerSlotToURL({})
      expect(serialized).toBe('')
    })

    it('非空フィルタは圧縮文字列を返すこと', async () => {
      const filtersPerSlot: FiltersPerSlot = {
        rightArmUnit: [
          buildPropertyFilter('weight', numericOp[0], 300),
          buildNameFilter(stringOp[0], 'zimmer'),
        ],
      }

      const serialized = serializeFiltersPerSlotToURL(filtersPerSlot)
      expect(serialized).not.toBe('')

      const restored = deserializeFiltersPerSlotFromURL(serialized)
      expect(restored.type).toBe('Success')
      if (restored.type === 'Success') {
        expect(restored.value.rightArmUnit).toHaveLength(2)
      }
    })
  })

  describe('deserializeFiltersPerSlotFromURL', () => {
    it('空文字列は空オブジェクトを返すこと', () => {
      const result = deserializeFiltersPerSlotFromURL('')
      expect(result.type).toBe('Success')
      expect(
        result.type === 'Success' && Object.keys(result.value),
      ).toHaveLength(0)
    })

    it('不正なJSONの場合は失敗を返すこと', () => {
      const result = deserializeFiltersPerSlotFromURL('!!invalid!!')
      expect(result.type).toBe('Failure')
    })

    it('不正スロットやデータ型はスキップされること', async () => {
      const lz = await import('lz-string')
      const compressed = lz.compressToEncodedURIComponent(
        JSON.stringify({
          rightArmUnit: [],
          invalidSlot: [],
          leftArmUnit: 'not-array',
        }),
      )
      const result = deserializeFiltersPerSlotFromURL(compressed)
      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value.rightArmUnit).toEqual([])
        expect(result.value.leftArmUnit).toBeUndefined()
      }
    })
  })

  describe('LocalStorage persistence', () => {
    const mockFilters: Filter[] = [
      buildPropertyFilter('weight', numericOp[0], 300),
      buildNameFilter(stringOp[0], 'zimmer'),
      buildManufactureFilter(selectAnyOperand(), ['balam']),
      buildCategoryFilter(selectAnyOperand(), ['bazooka']),
    ]

    it('保存したフィルタが復元できること', () => {
      const filtersPerSlot: FiltersPerSlot = {
        rightArmUnit: mockFilters,
      }

      saveFiltersPerSlotToLocalStorage(filtersPerSlot)
      const loaded = loadFiltersPerSlotFromLocalStorage()
      expect(loaded?.rightArmUnit).toHaveLength(4)
      loaded?.rightArmUnit?.forEach((filter) => {
        expect(typeof filter.stringify).toBe('function')
        expect(typeof filter.serialize).toBe('function')
      })
    })

    it('スロット名が不正な場合はスキップされること', () => {
      localStorage.setItem(
        'ac6-parts-list-filters-per-slot',
        JSON.stringify({
          invalid: ['numeric:weight:lte:500'],
        }),
      )

      const loaded = loadFiltersPerSlotFromLocalStorage()
      expect(loaded).toEqual({})
    })

    it('serializedFiltersが配列でない場合はスキップされること', () => {
      localStorage.setItem(
        'ac6-parts-list-filters-per-slot',
        JSON.stringify({
          rightArmUnit: 'not-array',
        }),
      )

      const loaded = loadFiltersPerSlotFromLocalStorage()
      expect(loaded).toEqual({})
    })

    it('parseFilterで復元できない場合は除外されること', () => {
      localStorage.setItem(
        'ac6-parts-list-filters-per-slot',
        JSON.stringify({
          rightArmUnit: ['invalid-filter'],
        }),
      )

      const loaded = loadFiltersPerSlotFromLocalStorage()
      expect(loaded).toEqual({ rightArmUnit: [] })
    })
  })
})
