import type { I18Next } from '$lib/i18n/define'

import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { describe, it, expect, vi } from 'vitest'

import {
  buildArrayFilter,
  buildNameFilter,
  buildPropertyFilter,
  getNumericFilterKeys,
  isPropertyFilterKey,
  translateProperty,
  translateOperand,
  resolveSelectionValueTranslator,
} from './filters-application'
import {
  applyFilters,
  numericOperands,
  selectAnyOperand,
  stringOperands,
  type FilterOperand,
} from './filters-core'

const createI18nMock = (language: 'ja' | 'en' = 'ja') => {
  const dictionariesByLanguage: Record<
    'ja' | 'en',
    Record<string, Record<string, string>>
  > = {
    ja: {
      assembly: { price: '価格', weight: '重量', enLoad: 'EN負荷' },
      manufacture: { balam: 'ベイラム' },
      category: { bazooka: 'バズーカ' },
      'filter/operand': { lte: '≤', contain: 'を含む' },
      translation: {
        'filters.array.label': '配列フィルター',
      },
    },
    en: {
      assembly: { price: 'Price', weight: 'Weight', enLoad: 'EN Load' },
      manufacture: { balam: 'BALAM' },
      category: { bazooka: 'Bazooka' },
      'filter/operand': { lte: '<=', contain: 'contains' },
      translation: {
        'filters.array.label': 'Array Filter',
      },
    },
  }

  const dictionaries = dictionariesByLanguage[language]

  const t = vi.fn(
    (
      key: string,
      options?: {
        ns?: string
        defaultValue?: string
      },
    ) => {
      const ns = options?.ns ?? 'translation'
      const namespaceDict = dictionaries[ns]
      if (namespaceDict && key in namespaceDict) {
        return namespaceDict[key]
      }

      if (options?.defaultValue !== undefined) {
        return options.defaultValue
      }

      return `${ns}:${key}`
    },
  )

  const exists = vi.fn((key: string, options?: { ns?: string }) => {
    const ns = options?.ns ?? 'translation'
    return Boolean(dictionaries[ns]?.[key])
  })

  return {
    t,
    exists,
    language,
    resolvedLanguage: language,
  } as unknown as I18Next
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

  describe('buildArrayFilter', () => {
    it('displayName に i18n キーを指定すると翻訳を使用すること', () => {
      const i18n = createI18nMock('ja')
      const operand = selectAnyOperand()
      const filter = buildArrayFilter(
        'custom_array',
        operand,
        ['alpha', 'beta'],
        'filters.array.label',
      )

      expect(filter.serialize()).toBe('array:custom_array:in_any:alpha,beta')
      expect(filter.stringify(i18n)).toBe('配列フィルター: alpha, beta')
    })

    it('displayName を指定しない場合は translateProperty の結果を利用すること', () => {
      const i18n = createI18nMock('en')
      const operand = selectAnyOperand()
      const filter = buildArrayFilter('en_load', operand, ['200', '400'])

      expect(filter.stringify(i18n)).toBe('EN Load: 200, 400')
    })

    it('translateValue オプションで値を翻訳できること', () => {
      const i18n = createI18nMock()
      const operand = selectAnyOperand()
      const translator = resolveSelectionValueTranslator('category')
      const filter = buildArrayFilter('category', operand, ['bazooka', 'x'], {
        displayName: 'カテゴリ',
        translateValue: translator,
      })

      expect(filter.stringify(i18n)).toBe('カテゴリ: バズーカ, x')
    })

    it('メーカー値を翻訳して返すこと', () => {
      const i18n = createI18nMock()
      const operand = selectAnyOperand()
      const translator = resolveSelectionValueTranslator('manufacture')
      const filter = buildArrayFilter(
        'manufacture',
        operand,
        ['balam', 'unknown'],
        {
          displayName: 'メーカー',
          translateValue: translator,
        },
      )

      expect(filter.serialize()).toBe('array:manufacture:in_any:balam,unknown')
      expect(filter.stringify(i18n)).toBe('メーカー: ベイラム, unknown')
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

  describe('translateProperty', () => {
    it('assembly 名前空間に存在するキーは翻訳値を返すこと', () => {
      expect(translateProperty('price', createI18nMock('ja'))).toBe('価格')
      expect(translateProperty('weight', createI18nMock('en'))).toBe('Weight')
    })

    it('スネークケースのキーはキャメルケースに変換して翻訳を取得すること', () => {
      expect(translateProperty('en_load', createI18nMock('ja'))).toBe('EN負荷')
      expect(translateProperty('en_load', createI18nMock('en'))).toBe('EN Load')
    })

    it('翻訳が存在しない場合はキャメルケースへフォールバックすること', () => {
      expect(translateProperty('attack_power', createI18nMock('ja'))).toBe(
        'attackPower',
      )
    })
  })

  describe('getNumericFilterKeys', () => {
    it('attributes.ts に定義された数値属性を返すこと', () => {
      expect(getNumericFilterKeys('head')).toContain('price')
    })

    it('動的属性を含むスロットではその属性を返すこと', () => {
      expect(getNumericFilterKeys('rightArmUnit')).toContain('attack_power')
    })
  })

  describe('PropertyFilterKey - 動的属性対応', () => {
    it('任意の属性名でプロパティフィルターを構築できること', () => {
      const operand = numericOperands().find((op) => op.id === 'gte')!

      // 動的属性名（attack_power など）でフィルターを構築
      const filter = buildPropertyFilter('attack_power', operand, 500)

      expect(filter.property).toBe('attack_power')
      expect(filter.value).toBe(500)
      expect(filter.serialize()).toBe('numeric:attack_power:gte:500')
    })

    it('既存の固定属性（price, weight, en_load）も引き続き動作すること', () => {
      const operand = numericOperands().find((op) => op.id === 'eq')!

      // 既存の固定属性でフィルターを構築
      const filter = buildPropertyFilter('weight', operand, 1500)

      expect(filter.property).toBe('weight')
      expect(filter.value).toBe(1500)
      expect(filter.serialize()).toBe('numeric:weight:eq:1500')
    })

    it('isPropertyFilterKey は後方互換性のため固定キーのみtrueを返すこと', () => {
      // 固定の3属性のみtrueを返す（後方互換性）
      expect(isPropertyFilterKey('price')).toBe(true)
      expect(isPropertyFilterKey('weight')).toBe(true)
      expect(isPropertyFilterKey('en_load')).toBe(true)

      // 動的属性はfalseを返す（既存の振る舞いを維持）
      expect(isPropertyFilterKey('attack_power')).toBe(false)
      expect(isPropertyFilterKey('ap')).toBe(false)
    })
  })

  describe('フィルター適用', () => {
    type ExtendedPart = ACParts & Record<string, unknown>
    const sampleParts: readonly ExtendedPart[] = [
      {
        id: 'p1',
        name: 'Alpha',
        classification: 'arm-unit',
        manufacture: 'balam',
        category: 'bazooka',
        price: 1500,
        weight: 420,
        en_load: 110,
        attack_power: 1200,
      },
      {
        id: 'p2',
        name: 'Beta',
        classification: 'arm-unit',
        manufacture: 'allmind',
        category: 'shotgun',
        price: 2100,
        weight: 380,
        en_load: 130,
        attack_power: 800,
      },
      {
        id: 'p3',
        name: 'Gamma',
        classification: 'arm-unit',
        manufacture: 'balam',
        category: 'bazooka',
        price: 1800,
        weight: 620,
        en_load: 150,
      },
    ]

    it('数値型属性フィルターで該当パーツのみを返すこと', () => {
      const operand = numericOperands().find((op) => op.id === 'lt')!
      const filter = buildPropertyFilter('weight', operand, 500)

      const result = applyFilters(sampleParts, [filter])

      expect(result.map((part) => part.id)).toEqual(['p1', 'p2'])
    })

    it('配列型属性フィルターで候補値に含まれるパーツを返すこと', () => {
      const operand = selectAnyOperand()
      const filter = buildArrayFilter('manufacture', operand, ['balam'])

      const result = applyFilters(sampleParts, [filter])

      expect(result.map((part) => part.id)).toEqual(['p1', 'p3'])
    })

    it('optional属性でフィルターした場合に属性未保持パーツを除外すること', () => {
      const operand = numericOperands().find((op) => op.id === 'gte')!
      const filter = buildPropertyFilter('attack_power', operand, 900)

      const result = applyFilters(sampleParts, [filter])

      expect(result.map((part) => part.id)).toEqual(['p1'])
    })

    it('複数条件をAND適用して該当パーツのみを返すこと', () => {
      const weightOperand = numericOperands().find((op) => op.id === 'lte')!
      const weightFilter = buildPropertyFilter('weight', weightOperand, 500)
      const manufactureFilter = buildArrayFilter(
        'manufacture',
        selectAnyOperand(),
        ['balam'],
      )

      const result = applyFilters(sampleParts, [
        weightFilter,
        manufactureFilter,
      ])

      expect(result.map((part) => part.id)).toEqual(['p1'])
    })
  })
})
