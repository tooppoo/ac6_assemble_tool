import { latest as regulation } from '$lib/regulation'

import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { describe, expect, it } from 'vitest'

import { flattenRegulation, groupByCategory, toJson } from './parts-export'

function makePart(overrides: Partial<ACParts> = {}): ACParts {
  return {
    id: 'id-1',
    name: 'Test Part',
    classification: 'head',
    manufacture: 'test-manufacture',
    category: 'head',
    price: 1000,
    weight: 100,
    en_load: 50,
    ai_summary: 'summary',
    ai_tags: ['tag1'],
    ...overrides,
  } as ACParts
}

describe(flattenRegulation.name, () => {
  it('regulation内の全パーツをidで重複なく返す', () => {
    const result = flattenRegulation(regulation)

    expect(result.length).toBeGreaterThan(0)
    const ids = result.map((part) => part.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('未装備プレースホルダーを含まない', () => {
    const result = flattenRegulation(regulation)

    expect(
      result.every((part) => part.classification !== notEquipped),
    ).toBe(true)
  })
})

describe(groupByCategory.name, () => {
  it('カテゴリごとにパーツをグルーピングする', () => {
    const parts = [
      makePart({ id: '1', category: 'head' }),
      makePart({ id: '2', category: 'core' }),
      makePart({ id: '3', category: 'head' }),
    ]

    const grouped = groupByCategory(parts)

    expect(grouped.get('head')?.map((part) => part.id)).toEqual(['1', '3'])
    expect(grouped.get('core')?.map((part) => part.id)).toEqual(['2'])
    expect(grouped.size).toBe(2)
  })

  it('空配列に対しては空のMapを返す', () => {
    expect(groupByCategory([]).size).toBe(0)
  })
})

describe(toJson.name, () => {
  it('regulationバージョン・filter条件・パーツデータを含むJSON文字列を返す', () => {
    const parts = [makePart({ id: '1' })]

    const json = toJson(parts, {
      regulation: 'v1.09.1',
      filter: ['numeric:weight:lt:4000'],
    })

    expect(JSON.parse(json)).toEqual({
      regulation: 'v1.09.1',
      filter: ['numeric:weight:lt:4000'],
      data: parts,
    })
  })

  it('filterが空配列の場合も空配列のまま出力する', () => {
    const parts = [makePart({ id: '1' })]

    const json = toJson(parts, { regulation: 'v1.09.1', filter: [] })

    expect(JSON.parse(json).filter).toEqual([])
  })
})
