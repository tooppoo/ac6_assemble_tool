import { Result } from '@praha/byethrow'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  buildPropertyFilter,
  buildNameFilter,
  buildManufactureFilter,
  buildCategoryFilter,
} from './filter/filters-application'
import {
  numericOperands,
  stringOperands,
  selectAnyOperand,
} from './filter/filters-core'
import {
  deserializeFromURL,
  serializeToURL,
  type SharedState,
} from './state-serializer'
import { compressToUrlSafeString } from './filter/compression'
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
        filtersPerSlot: {},
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      expect(params.get('slot')).toBe('head')
      expect(params.get('head_filters')).toBeNull()
    })

    it('filtersPerSlotをURLパラメータに出力すること', () => {
      const operands = numericOperands()
      const ltOperand = operands.find((op) => op.id === 'lt')!
      const lteOperand = operands.find((op) => op.id === 'lte')!
      const strOps = stringOperands()
      const containOperand = strOps.find((op) => op.id === 'contain')!

      const state: SharedState = {
        slot: 'arms',
        filtersPerSlot: {
          arms: [
            buildPropertyFilter('weight', ltOperand, 5000),
            buildNameFilter(containOperand, 'ZIMMER'),
          ],
          rightArmUnit: [
            buildPropertyFilter('price', lteOperand, 100000),
            buildManufactureFilter(selectAnyOperand(), ['BALAM', 'FURLONG']),
            buildCategoryFilter(selectAnyOperand(), ['MEDIUM']),
          ],
        },
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)
      expect(
        params.get('arms_filters'),
      ).toBe('numeric:weight:lt:5000|string:name:contain:ZIMMER')
      expect(params.get('right_arm_unit_filters')).toBe(
        'numeric:price:lte:100000|array:manufacture:in_any:BALAM,FURLONG|array:category:in_any:MEDIUM',
      )
    })

    it('並び替え設定をURLパラメータに変換できること', () => {
      const state: SharedState = {
        slot: 'legs',
        filtersPerSlot: {},
        sortKey: 'weight',
        sortOrder: 'asc',
      }

      const params = serializeToURL(state)

      expect(params.get('sort')).toBe('weight:asc')
    })

    it('並び替えがnullの場合、sortパラメータを含めないこと', () => {
      const state: SharedState = {
        slot: 'core',
        filtersPerSlot: {},
        sortKey: null,
        sortOrder: null,
      }

      const params = serializeToURL(state)

      expect(params.has('sort')).toBe(false)
    })
  })

  describe('deserializeFromURL', () => {
    it('URLパラメータからスロット選択状態を復元できること', async () => {
      const params = new URLSearchParams('slot=head')

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('head')
        expect(result.value.filtersPerSlot).toEqual({})
      }
    })

    it('スロット別フィルタパラメータから全スロット分のフィルタを復元できること', async () => {
      const params = new URLSearchParams(
        [
          'slot=head',
          'head_filters=string:name:contain:ZIMMER|numeric:weight:lte:3000',
          'right_arm_unit_filters=array:category:in_any:RIFLE|array:manufacture:in_any:BALAM',
        ].join('&'),
      )

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        const restoredHead = result.value.filtersPerSlot.head ?? []
        expect(restoredHead.map((f) => f.serialize())).toEqual([
          'string:name:contain:ZIMMER',
          'numeric:weight:lte:3000',
        ])
        const restoredRightArm = result.value.filtersPerSlot.rightArmUnit ?? []
        expect(restoredRightArm.map((f) => f.serialize())).toEqual([
          'array:category:in_any:RIFLE',
          'array:manufacture:in_any:BALAM',
        ])
      }
    })

    it('レガシーfilterパラメータを後方互換で復元すること', async () => {
      const params = new URLSearchParams(
        'slot=arms&filter=numeric:weight:lt:5000&filter=string:name:contain:ZIMMER',
      )

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        const restored = result.value.filtersPerSlot.arms ?? []
        expect(restored.map((f) => f.serialize())).toEqual([
          'numeric:weight:lt:5000',
          'string:name:contain:ZIMMER',
        ])
      }
    })

    it('レガシーfilterパラメータの不正値はスキップすること', async () => {
      const params = new URLSearchParams(
        'slot=head&filter=numeric:weight:lt:5000&filter=invalid',
      )

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        const restored = result.value.filtersPerSlot.head ?? []
        expect(restored.map((f) => f.serialize())).toEqual([
          'numeric:weight:lt:5000',
        ])
      }
    })

    it('既存filtersパラメータがある場合、レガシーパラメータは上書きしないこと', async () => {
      const params = new URLSearchParams(
        [
          'slot=head',
          'head_filters=numeric:weight:lte:1000',
          'filter=numeric:weight:lt:5000',
        ].join('&'),
      )

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        const restored = result.value.filtersPerSlot.head ?? []
        expect(restored.map((f) => f.serialize())).toEqual([
          'numeric:weight:lte:1000',
        ])
      }
    })

    it('レガシーfiltersパラメータを復元すること', async () => {
      const legacyPayload = {
        rightArmUnit: ['numeric:price:lte:3200'],
        head: ['numeric:price:lte:1500'],
      }
      const compressed = await compressToUrlSafeString(
        JSON.stringify(legacyPayload),
      )
      const params = new URLSearchParams(`slot=head&filters=${compressed}`)

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(
          result.value.filtersPerSlot.rightArmUnit?.map((f) => f.serialize()),
        ).toEqual(['numeric:price:lte:3200'])
        expect(result.value.filtersPerSlot.head?.map((f) => f.serialize())).toEqual([
          'numeric:price:lte:1500',
        ])
      }
    })

    it('URLパラメータから並び替え設定を復元できること', async () => {
      const params = new URLSearchParams('slot=legs&sort=weight:asc')

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.sortKey).toBe('weight')
        expect(result.value.sortOrder).toBe('asc')
      }
    })

    it('並び替えパラメータが不正な形式の場合、並び替えをnullにすること', async () => {
      const params = new URLSearchParams('slot=head&sort=invalid')

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.sortKey).toBeNull()
        expect(result.value.sortOrder).toBeNull()
      }
    })

    it('スロットパラメータが不正な場合、エラーを返すこと', async () => {
      const params = new URLSearchParams('slot=invalid')

      const result = await deserializeFromURL(params)

      expect(Result.isFailure(result)).toBe(true)
      if (result.type === 'Failure') {
        expect(result.error.type).toBe('invalid_slot')
      }
    })

    it('スロットパラメータが存在しない場合、デフォルト値(rightArmUnit)を使用すること', async () => {
      const params = new URLSearchParams('')

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('rightArmUnit')
      }
    })

    it('スネークケースのスロットキーを正規化できること', async () => {
      const params = new URLSearchParams('slot=right_arm_unit')

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('rightArmUnit')
      }
    })
  })
})
