import { Result } from '@praha/byethrow'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  buildCategoryFilter,
  buildManufactureFilter,
  buildNameFilter,
  buildPropertyFilter,
} from './filter/filters-application'
import {
  numericOperands,
  selectAnyOperand,
  stringOperands,
} from './filter/filters-core'
import {
  deserializeFromURL,
  serializeToURL,
  type SharedState,
} from './state-serializer'
import {
  compressToUrlSafeString,
  decompressFromUrlSafeString,
} from './filter/compression'

describe('StateSerializer', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('serializeToURL', () => {
    it('スロット選択状態をURLパラメータに変換できること', async () => {
      const state: SharedState = {
        slot: 'head',
        filtersPerSlot: {},
        sortKey: null,
        sortOrder: null,
      }

      const params = await serializeToURL(state)

      expect(params.get('slot')).toBe('head')
      expect(params.has('filters')).toBe(false)
    })

    it('filtersPerSlotを圧縮してfiltersパラメータに格納すること', async () => {
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

      const params = await serializeToURL(state)
      const compressed = params.get('filters')
      expect(compressed).not.toBeNull()

      const json = await decompressFromUrlSafeString(compressed!)
      expect(json).not.toBeNull()
      const payload = JSON.parse(json!) as Record<string, string[]>

      expect(payload.arms).toEqual([
        'numeric:weight:lt:5000',
        'string:name:contain:ZIMMER',
      ])
      expect(payload.rightArmUnit).toEqual([
        'numeric:price:lte:100000',
        'array:manufacture:in_any:BALAM,FURLONG',
        'array:category:in_any:MEDIUM',
      ])
      expect(payload.head).toBeUndefined()
    })

    it('filtersが空の場合はfiltersパラメータを含めないこと', async () => {
      const state: SharedState = {
        slot: 'arms',
        filtersPerSlot: {
          arms: [],
        },
        sortKey: null,
        sortOrder: null,
      }

      const params = await serializeToURL(state)
      expect(params.has('filters')).toBe(false)
    })

    it('並び替え設定をURLパラメータに変換できること', async () => {
      const state: SharedState = {
        slot: 'legs',
        filtersPerSlot: {},
        sortKey: 'weight',
        sortOrder: 'asc',
      }

      const params = await serializeToURL(state)
      expect(params.get('sort')).toBe('weight:asc')
    })

    it('並び替えがnullの場合、sortパラメータを含めないこと', async () => {
      const state: SharedState = {
        slot: 'core',
        filtersPerSlot: {},
        sortKey: null,
        sortOrder: null,
      }

      const params = await serializeToURL(state)
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

    it('圧縮filtersパラメータからフィルタを復元できること', async () => {
      const payload = {
        arms: [
          'numeric:weight:lt:5000',
          'string:name:contain:ZIMMER',
        ],
        rightArmUnit: [
          'numeric:price:lte:100000',
          'array:manufacture:in_any:BALAM,FURLONG',
        ],
      }
      const compressed = await compressToUrlSafeString(JSON.stringify(payload))
      const params = new URLSearchParams(`slot=arms&filters=${compressed}`)

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.slot).toBe('arms')
        expect(
          result.value.filtersPerSlot.arms?.map((f) => f.serialize()),
        ).toEqual(payload.arms)
        expect(
          result.value.filtersPerSlot.rightArmUnit?.map((f) => f.serialize()),
        ).toEqual(payload.rightArmUnit)
      }
    })

    it('filtersパラメータが不正なBase64の場合、エラーを返すこと', async () => {
      const params = new URLSearchParams('slot=head&filters=%%%INVALID%%%')

      const result = await deserializeFromURL(params)

      expect(Result.isFailure(result)).toBe(true)
      if (result.type === 'Failure') {
        expect(result.error.type).toBe('invalid_format')
      }
    })

    it('filtersパラメータが不正なJSONの場合、エラーを返すこと', async () => {
      const compressed = await compressToUrlSafeString('"not-an-object"')
      const params = new URLSearchParams(`slot=head&filters=${compressed}`)

      const result = await deserializeFromURL(params)

      expect(Result.isFailure(result)).toBe(true)
      if (result.type === 'Failure') {
        expect(result.error.type).toBe('invalid_format')
      }
    })

    it('filtersパラメータの無効なフィルタはスキップすること', async () => {
      const payload = {
        head: ['invalid', 'numeric:weight:lte:3000'],
      }
      const compressed = await compressToUrlSafeString(JSON.stringify(payload))
      const params = new URLSearchParams(`slot=head&filters=${compressed}`)

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        const restored = result.value.filtersPerSlot.head ?? []
        expect(restored.map((f) => f.serialize())).toEqual([
          'numeric:weight:lte:3000',
        ])
      }
    })

    it('filtersパラメータに未知のスロットが含まれる場合はスキップすること', async () => {
      const payload = {
        unknownSlot: ['numeric:weight:lte:3000'],
        head: ['string:name:contain:ZIMMER'],
      } as Record<string, string[]>
      const compressed = await compressToUrlSafeString(JSON.stringify(payload))
      const params = new URLSearchParams(`slot=head&filters=${compressed}`)

      const result = await deserializeFromURL(params)

      expect(Result.isSuccess(result)).toBe(true)
      if (result.type === 'Success') {
        expect(result.value.filtersPerSlot.head?.map((f) => f.serialize())).toEqual([
          'string:name:contain:ZIMMER',
        ])
        expect(result.value.filtersPerSlot.rightArmUnit).toBeUndefined()
      }
    })

    it('URLパラメータから並び替え設定を復元できること', async () => {
      const payload = {}
      const compressed = await compressToUrlSafeString(JSON.stringify(payload))
      const params = new URLSearchParams(`slot=legs&filters=${compressed}&sort=weight:asc`)

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
