import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { describe, it, expect } from 'vitest'

import {
  applyFilters,
  defineExtractor,
  extractCategories,
  extractManufacturers,
  numericOperands,
  selectAnyOperand,
  stringOperands,
  type Filter,
} from './filters-core'

const sampleParts: ACParts[] = [
  {
    id: 'p1',
    name: 'Light Arm',
    classification: 'arm-unit',
    manufacture: 'balam',
    category: 'bazooka',
    price: 1200,
    weight: 450,
    en_load: 90,
    ai_summary: 'これはテスト用のパーツ1です。',
    ai_tags: ['テスト1', 'パーツ1'],
  },
  {
    id: 'p2',
    name: 'Heavy Arm',
    classification: 'arm-unit',
    manufacture: 'allmind',
    category: 'shotgun',
    price: 3200,
    weight: 820,
    en_load: 180,
    ai_summary: 'これはテスト用のパーツ1です。',
    ai_tags: ['テスト1', 'パーツ1'],
  },
]

const createNumericFilter = (
  property: keyof ACParts,
  operandId: string,
  value: number,
): Filter => {
  const operand = numericOperands().find((op) => op.id === operandId)!
  return {
    operand,
    property,
    extractor: defineExtractor(property),
    value,
    stringify: () => '',
    serialize: () => '',
  }
}

const createStringFilter = (
  property: keyof ACParts,
  operandId: string,
  value: string,
): Filter => {
  const operand = stringOperands().find((op) => op.id === operandId)!
  return {
    operand,
    property,
    extractor: defineExtractor(property),
    value,
    stringify: () => '',
    serialize: () => '',
  }
}

describe('filters-core', () => {
  describe('applyFilters', () => {
    it('すべての条件を満たすパーツのみを返すこと', () => {
      const filters: Filter[] = [
        createNumericFilter('weight', 'lte', 500),
        createStringFilter('name', 'contain', 'Light'),
        {
          operand: selectAnyOperand(),
          property: 'manufacture',
          extractor: defineExtractor('manufacture'),
          value: ['balam'],
          stringify: () => '',
          serialize: () => '',
        },
      ]

      const result = applyFilters(sampleParts, filters)

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe('p1')
    })

    it('フィルタが空の場合は全件を返すこと', () => {
      const result = applyFilters(sampleParts, [])

      expect(result).toHaveLength(sampleParts.length)
    })
  })

  describe('numericOperands', () => {
    it.each([
      { id: 'lte', left: 5, right: 5, expected: true },
      { id: 'lte', left: 6, right: 5, expected: false },
      { id: 'gte', left: 6, right: 6, expected: true },
      { id: 'gte', left: 5, right: 6, expected: false },
      { id: 'lt', left: 4, right: 5, expected: true },
      { id: 'lt', left: 6, right: 5, expected: false },
      { id: 'gt', left: 7, right: 5, expected: true },
      { id: 'gt', left: 4, right: 5, expected: false },
      { id: 'ne', left: 4, right: 5, expected: true },
      { id: 'ne', left: 5, right: 5, expected: false },
      { id: 'eq', left: 5, right: 5, expected: true },
      { id: 'eq', left: 5, right: 6, expected: false },
    ])(
      'オペランド $id が期待値 $expected を返す',
      ({ id, left, right, expected }) => {
        const operand = numericOperands().find((op) => op.id === id)
        expect(operand?.apply(left, right)).toBe(expected)
      },
    )

    it('非数値が渡された場合はfalseを返すこと', () => {
      const operand = numericOperands()[0] // 任意のnumeric operand

      expect(operand.apply('not-number', 10)).toBe(false)
      expect(operand.apply(10, 'not-number')).toBe(false)
    })
  })

  describe('stringOperands', () => {
    it.each([
      { id: 'contain', left: 'abcdef', right: 'abc', expected: true },
      { id: 'contain', left: 'abcdef', right: 'zzz', expected: false },
      { id: 'not_contain', left: 'abcdef', right: 'zzz', expected: true },
      { id: 'not_contain', left: 'abcdef', right: 'abc', expected: false },
      { id: 'exact', left: 'abc', right: 'abc', expected: true },
      { id: 'exact', left: 'abc', right: 'def', expected: false },
    ])(
      'string operand $id が期待値 $expected を返す',
      ({ id, left, right, expected }) => {
        const operand = stringOperands().find((op) => op.id === id)
        expect(operand?.apply(left, right)).toBe(expected)
      },
    )

    it('非文字列が渡された場合はfalseを返すこと', () => {
      const operand = stringOperands()[0]

      expect(operand.apply(10, 'text')).toBe(false)
      expect(operand.apply('text', 10)).toBe(false)
    })
  })

  describe('selectAnyOperand', () => {
    it('右辺が配列でない場合はfalseを返すこと', () => {
      const operand = selectAnyOperand()

      expect(operand.apply('value', 'not-array')).toBe(false)
    })

    it('配列内に値が存在するときtrueを返すこと', () => {
      const operand = selectAnyOperand()

      expect(operand.apply('value', ['value', 'other'])).toBe(true)
    })

    it('配列内に値が存在しないときfalseを返すこと', () => {
      const operand = selectAnyOperand()

      expect(operand.apply('missing', ['value', 'other'])).toBe(false)
    })
  })

  describe('defineExtractor', () => {
    it('指定したプロパティの値を取り出せること', () => {
      const extractor = defineExtractor('price')

      expect(extractor.extract(sampleParts[0])).toBe(1200)
    })
  })

  describe('list utilities', () => {
    it('extractManufacturersは重複排除とソートを行うこと', () => {
      const manufacturers = extractManufacturers([
        { manufacture: 'balam' },
        { manufacture: 'allmind' },
        { manufacture: 'balam' },
        { manufacture: null },
      ])

      expect(manufacturers).toEqual(['allmind', 'balam'])
    })

    it('extractCategoriesは重複排除とソートを行うこと', () => {
      const categories = extractCategories([
        { category: 'shotgun' },
        { category: 'bazooka' },
        { category: 'shotgun' },
        { category: undefined },
      ])

      expect(categories).toEqual(['bazooka', 'shotgun'])
    })
  })
})
