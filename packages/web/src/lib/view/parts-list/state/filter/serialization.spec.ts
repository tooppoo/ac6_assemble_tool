import { describe, it, expect } from 'vitest'

import { buildNameFilter, buildPropertyFilter } from './filters-application'
import { numericOperands, stringOperands } from './filters-core'
import { loadFiltersPerSlotFromLocalStorage, saveFiltersPerSlotToLocalStorage, type FiltersPerSlot } from './serialization'

describe('FiltersPerSlot persistence', () => {
  it('LocalStorageに保存したフィルタが関数ごと復元できること', () => {
    const filtersPerSlot: FiltersPerSlot = {
      rightArmUnit: [
        buildPropertyFilter('weight', numericOperands()[0], 1200),
        buildNameFilter(stringOperands()[0], 'HML-G2/P19 LAMIA'),
      ],
    }

    saveFiltersPerSlotToLocalStorage(filtersPerSlot)

    const loaded = loadFiltersPerSlotFromLocalStorage()

    expect(loaded).not.toBeNull()
    const restoredFilters = loaded?.rightArmUnit
    expect(restoredFilters).toBeDefined()
    expect(restoredFilters).toHaveLength(2)

    // stringify/serialize が復元されていること（JSON経由では現状失われるためREDになる）
    expect(typeof restoredFilters?.[0]?.stringify).toBe('function')
    expect(typeof restoredFilters?.[0]?.serialize).toBe('function')
  })
})
