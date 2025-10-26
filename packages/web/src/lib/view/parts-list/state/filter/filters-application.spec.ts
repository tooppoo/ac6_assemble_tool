import type { I18Next } from '$lib/i18n/define'

import { describe, it, expect, vi } from 'vitest'

import {
  buildCategoryFilter,
  buildManufactureFilter,
  buildNameFilter,
  buildPropertyFilter,
  isPropertyFilterKey,
  translateOperand,
} from './filters-application'
import {
  numericOperands,
  selectAnyOperand,
  stringOperands,
  type FilterOperand,
} from './filters-core'

const createI18nMock = () => {
  const dictionaries: Record<string, Record<string, string>> = {
    assembly: { price: '価格', weight: '重量' },
    manufacture: { balam: 'ベイラム' },
    category: { bazooka: 'バズーカ' },
    'filter/operand': { lte: '≤', contain: 'を含む' },
  }

  const t = vi.fn((key: string, options?: { ns?: string }) => {
    const ns = options?.ns ?? 'translation'
    return dictionaries[ns]?.[key] ?? `${ns}:${key}`
  })

  return { t } as unknown as I18Next
}

describe('filters-application', () => {
  describe('isPropertyFilterKey', () => {
    it('許可されたキーのみtrueを返すこと', () => {
      expect(isPropertyFilterKey('price')).toBe(true)
      expect(isPropertyFilterKey('name')).toBe(false)
    })
  })

  describe('buildPropertyFilter', () => {
    it('stringify/serializeが期待通りであること', () => {
      const i18n = createI18nMock()
      const operand = numericOperands().find((op) => op.id === 'lte')!
      const filter = buildPropertyFilter('price', operand, 1000)

      expect(filter.serialize()).toBe('numeric:price:lte:1000')
      expect(filter.stringify(i18n)).toBe('価格: ≤ 1000')
    })
  })

  describe('buildNameFilter', () => {
    it('serializeと文字列表現を返すこと', () => {
      const i18n = createI18nMock()
      const operand = stringOperands().find((op) => op.id === 'contain')!
      const filter = buildNameFilter(operand, 'Zimmer')

      expect(filter.serialize()).toBe('string:name:contain:Zimmer')
      expect(filter.stringify(i18n)).toBe('名前: "Zimmer" を含む')
    })
  })

  describe('buildManufactureFilter', () => {
    it('既知・未知メーカーを混在させても翻訳できること', () => {
      const i18n = createI18nMock()
      const operand = selectAnyOperand()
      const filter = buildManufactureFilter(operand, ['balam', 'unknown'])

      expect(filter.serialize()).toBe('array:manufacture:in_any:balam,unknown')
      expect(filter.stringify(i18n)).toBe('メーカー: ベイラム, unknown')
    })
  })

  describe('buildCategoryFilter', () => {
    it('カテゴリを翻訳して返すこと', () => {
      const i18n = createI18nMock()
      const operand = selectAnyOperand()
      const filter = buildCategoryFilter(operand, ['bazooka', 'mystery'])

      expect(filter.serialize()).toBe('array:category:in_any:bazooka,mystery')
      expect(filter.stringify(i18n)).toBe('カテゴリ: バズーカ, mystery')
    })
  })

  describe('translateOperand', () => {
    it('未知のオペランドIDはフォールバックすること', () => {
      const i18n = createI18nMock()
      const operand: FilterOperand = {
        id: 'custom',
        dataType: 'string',
        apply: () => true,
        toString: () => 'custom',
      }

      expect(translateOperand(operand, i18n)).toBe('custom')
    })
  })
})
