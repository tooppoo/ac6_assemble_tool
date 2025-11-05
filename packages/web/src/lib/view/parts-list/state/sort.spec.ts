import { getNumericAttributes } from '@ac6_assemble_tool/parts/attributes-utils'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
import { describe, it, expect } from 'vitest'

import {
  getAvailableSortKeys,
  parseSort,
  sortPartsByKey,
  type SortKey,
} from './sort'

type ExtendedPart = ACParts & Record<string, unknown>

function createPart(
  overrides: Record<string, unknown>,
  index: number,
): ExtendedPart {
  return {
    id: `TEST-${index}`,
    name: `テストパーツ${index}`,
    classification: 'head',
    manufacture: 'baws',
    category: 'head',
    price: 1000 + index,
    weight: 2000 + index,
    en_load: 300 + index,
    ...overrides,
  } as ExtendedPart
}

describe('parseSort', () => {
  it('有効なsortパラメータ（昇順）をパースできること', () => {
    const result = parseSort('price:asc')

    expect(result).toEqual({ key: 'price', order: 'asc' })
  })

  it('有効なsortパラメータ（降順）をパースできること', () => {
    const result = parseSort('weight:desc')

    expect(result).toEqual({ key: 'weight', order: 'desc' })
  })

  it('区切り文字がない場合はnullを返すこと', () => {
    const result = parseSort('invalid-format')

    expect(result).toBeNull()
  })

  it('順序がasc/desc以外の場合はnullを返すこと', () => {
    const result = parseSort('price:ascending')

    expect(result).toBeNull()
  })

  it('要素数が2つ以外の場合はnullを返すこと', () => {
    const result = parseSort('price:asc:extra')

    expect(result).toBeNull()
  })

  it('空のキーの場合はnullを返すこと', () => {
    const result = parseSort(':asc')

    expect(result).toBeNull()
  })

  it('動的属性を持つソートパラメータを正しく復元できること', () => {
    const result = parseSort('stability:asc')

    expect(result).not.toBeNull()
    expect(result?.key).toBe('stability')
    expect(result?.order).toBe('asc')
  })
})

describe('getAvailableSortKeys', () => {
  it('attributes.ts で定義された数値属性を返すこと', () => {
    const slot: CandidatesKey = 'head'

    const result = getAvailableSortKeys(slot)

    expect(result).toEqual<SortKey[]>([...getNumericAttributes(slot)])
  })

  it('動的な数値属性を含むスロットではその属性を返すこと', () => {
    const slot: CandidatesKey = 'rightArmUnit'

    const result = getAvailableSortKeys(slot)

    expect(result).toContain('attack_power')
  })
})

describe('sortPartsByKey', () => {
  const parts: ExtendedPart[] = [
    createPart({ price: 4000, weight: 1500 }, 1),
    createPart({ price: 2000, weight: 1200 }, 2),
    createPart({ price: 2000, weight: 1800 }, 3),
    createPart({ price: Number.NaN, weight: 1600 }, 4),
  ]

  it('昇順で並び替えること', () => {
    const sorted = sortPartsByKey(parts, 'price', 'asc')

    expect(sorted.map((part) => part.id)).toEqual([
      'TEST-2',
      'TEST-3',
      'TEST-1',
      'TEST-4',
    ])
  })

  it('降順で並び替えること', () => {
    const sorted = sortPartsByKey(parts, 'price', 'desc')

    expect(sorted.map((part) => part.id)).toEqual([
      'TEST-1',
      'TEST-2',
      'TEST-3',
      'TEST-4',
    ])
  })

  it('値が同じ場合は元の順序を維持すること', () => {
    const sorted = sortPartsByKey(parts, 'weight', 'asc')

    expect(sorted.map((part) => part.id)).toEqual([
      'TEST-2',
      'TEST-1',
      'TEST-4',
      'TEST-3',
    ])
  })
})
