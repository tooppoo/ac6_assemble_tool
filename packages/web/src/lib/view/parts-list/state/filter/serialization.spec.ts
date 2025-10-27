import { describe, expect, it } from 'vitest'

import {
  buildManufactureFilter,
  buildNameFilter,
  buildPropertyFilter,
} from './filters-application'
import {
  numericOperands,
  selectAnyOperand,
  stringOperands,
} from './filters-core'
import {
  deserializeFiltersForSlot,
  deserializeFiltersPerSlot,
  normalizeSlotKey,
  parseFilter,
  serializeFiltersForSlot,
  serializeFiltersPerSlot,
  toSlotParamKey,
  type FiltersPerSlot,
} from './serialization'

const numericOp = numericOperands()
const stringOp = stringOperands()

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

  describe('serializeFiltersForSlot', () => {
    it('複数フィルタを区切り文字で連結すること', () => {
      const filters = [
        buildPropertyFilter('weight', numericOp[0], 300),
        buildNameFilter(stringOp[0], 'zimmer'),
      ]
      expect(serializeFiltersForSlot(filters)).toBe(
        'numeric:weight:lte:300|string:name:contain:zimmer',
      )
    })

    it('空配列は空文字列を返すこと', () => {
      expect(serializeFiltersForSlot([])).toBe('')
    })
  })

  describe('deserializeFiltersForSlot', () => {
    it('区切り文字で連結されたフィルタを復元すること', async () => {
      const serialized =
        'numeric:weight:lte:300|string:name:contain:zimmer|array:manufacture:in_any:balam'
      const result = await deserializeFiltersForSlot(serialized)
      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(3)
        expect(result.value[0].serialize()).toBe('numeric:weight:lte:300')
        expect(result.value[1].serialize()).toBe('string:name:contain:zimmer')
        expect(result.value[2].serialize()).toBe(
          'array:manufacture:in_any:balam',
        )
      }
    })

    it('無効なフィルタはスキップされること', async () => {
      const serialized = 'invalid|numeric:weight:lte:300'
      const result = await deserializeFiltersForSlot(serialized)
      expect(result.type).toBe('Success')
      if (result.type === 'Success') {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].serialize()).toBe('numeric:weight:lte:300')
      }
    })
  })

  describe('serializeFiltersPerSlot', () => {
    it('フィルタが存在するスロットのみを含めること', () => {
      const filtersPerSlot: FiltersPerSlot = {
        rightArmUnit: [
          buildPropertyFilter('weight', numericOp[0], 300),
          buildNameFilter(stringOp[0], 'zimmer'),
        ],
        head: [],
        leftArmUnit: [
          buildManufactureFilter(selectAnyOperand(), ['balam']),
        ],
      }

      const serialized = serializeFiltersPerSlot(filtersPerSlot)
      expect(serialized.size).toBe(2)
      expect(serialized.get('right_arm_unit_filters')).toBe(
        'numeric:weight:lte:300|string:name:contain:zimmer',
      )
      expect(serialized.get('left_arm_unit_filters')).toBe(
        'array:manufacture:in_any:balam',
      )
      expect(serialized.has('head_filters')).toBe(false)
    })
  })

  describe('deserializeFiltersPerSlot', () => {
    it('URLSearchParamsから各スロットのフィルタを復元すること', async () => {
      const params = new URLSearchParams()
      params.set(
        'right_arm_unit_filters',
        'numeric:weight:lte:300|string:name:contain:zimmer',
      )
      params.set('head_filters', 'string:name:contain:rabbit')

      const restored = deserializeFiltersPerSlot(params)
      expect(restored.rightArmUnit?.map((f) => f.serialize())).toEqual([
        'numeric:weight:lte:300',
        'string:name:contain:zimmer',
      ])
      expect(restored.head?.map((f) => f.serialize())).toEqual([
        'string:name:contain:rabbit',
      ])
      expect(restored.leftArmUnit).toBeUndefined()
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

  describe('toSlotParamKey', () => {
    it('スロット名をスネークケースのクエリキーに変換すること', () => {
      expect(toSlotParamKey('rightArmUnit')).toBe('right_arm_unit_filters')
      expect(toSlotParamKey('leftBackUnit')).toBe('left_back_unit_filters')
    })
  })
})
