import {
  CANDIDATES_KEYS,
  type Candidates,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'

import { applyFilters, type Filter } from './filter/filters-core'
import { type FiltersPerSlot } from './filter/serialization'
import { toSlotPartsParamKey } from './slot-utils'

export interface SerializePartsPoolParamsInput {
  candidates: Candidates
  filtersPerSlot: FiltersPerSlot
}

export function serializeFilteredPartsPool(
  input: SerializePartsPoolParamsInput,
): URLSearchParams {
  const params = new URLSearchParams()

  for (const slot of CANDIDATES_KEYS) {
    const context = buildSlotContext(slot, input)
    const filteredIds = filterSlotParts(context)

    if (!filteredIds || filteredIds.length === 0) {
      continue
    }

    if (filteredIds.length === context.base.length) {
      continue
    }

    params.set(toSlotPartsParamKey(slot), filteredIds.join(','))
  }

  return params
}

interface SlotFilterContext {
  slot: CandidatesKey
  base: Candidates[CandidatesKey]
  filters: readonly Filter[]
}

function buildSlotContext(
  slot: CandidatesKey,
  input: SerializePartsPoolParamsInput,
): SlotFilterContext {
  const base = input.candidates[slot]
  const filters = input.filtersPerSlot[slot] ?? []

  return {
    slot,
    base,
    filters,
  }
}

function filterSlotParts(context: SlotFilterContext): readonly string[] | null {
  const { slot, base, filters } = context

  if (!filters || filters.length === 0) {
    return base.map((parts) => parts.id)
  }

  try {
    const filtered = applyFilters(base, filters)
    return filtered.map((parts) => parts.id)
  } catch (error) {
    logger.error('パーツプールシリアライズ用のフィルタ処理に失敗しました', {
      slot,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
