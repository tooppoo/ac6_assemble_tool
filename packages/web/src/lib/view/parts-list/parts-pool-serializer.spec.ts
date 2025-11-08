import { latest as regulation } from '$lib/regulation'

import { describe, expect, it } from 'vitest'

import { buildPropertyFilter } from './filter/filters-application'
import { applyFilters, numericOperands } from './filter/filters-core'
import type { FiltersPerSlot } from './filter/serialization'
import { serializeFilteredPartsPool } from './parts-pool-serializer'

const operands = numericOperands()
const ltOperand = operands.find((op) => op.id === 'lt')!
const gtOperand = operands.find((op) => op.id === 'gt')!

describe('serializeFilteredPartsPool', () => {
  it('フィルタが存在しない場合は空のURLSearchParamsを返す', () => {
    const params = serializeFilteredPartsPool({
      candidates: regulation.candidates,
      filtersPerSlot: {},
    })

    expect(Array.from(params.keys())).toHaveLength(0)
  })

  it('フィルタによって候補が減少したスロットのIDリストをシリアライズする', () => {
    const filtersPerSlot: FiltersPerSlot = {
      rightArmUnit: [buildPropertyFilter('weight', ltOperand, 4000)],
    }

    const params = serializeFilteredPartsPool({
      candidates: regulation.candidates,
      filtersPerSlot,
    })

    const key = 'right_arm_unit_parts'
    const filtered = applyFilters(
      regulation.candidates.rightArmUnit,
      filtersPerSlot.rightArmUnit!,
    )

    expect(filtered.length).toBeLessThan(
      regulation.candidates.rightArmUnit.length,
    )
    expect(params.get(key)).toBe(
      filtered.map((candidate) => candidate.id).join(','),
    )
  })

  it('フィルタ結果が空の場合はパラメータを出力しない', () => {
    const filtersPerSlot: FiltersPerSlot = {
      arms: [buildPropertyFilter('weight', ltOperand, 1)],
    }

    const params = serializeFilteredPartsPool({
      candidates: regulation.candidates,
      filtersPerSlot,
    })

    const filtered = applyFilters(
      regulation.candidates.arms,
      filtersPerSlot.arms!,
    )

    expect(filtered).toHaveLength(0)
    expect(params.has('arms_parts')).toBe(false)
  })

  it('フィルタが存在しても母集団が減少しない場合はパラメータを出力しない', () => {
    const filtersPerSlot: FiltersPerSlot = {
      legs: [buildPropertyFilter('weight', gtOperand, 0)],
    }

    const params = serializeFilteredPartsPool({
      candidates: regulation.candidates,
      filtersPerSlot,
    })

    const filtered = applyFilters(
      regulation.candidates.legs,
      filtersPerSlot.legs!,
    )

    expect(filtered.length).toBe(regulation.candidates.legs.length)
    expect(params.has('legs_parts')).toBe(false)
  })
})
