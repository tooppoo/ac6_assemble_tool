import {
  CANDIDATES_KEYS,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import { type Filter } from './filter/filters-core'
import {
  deserializeFiltersPerSlot,
  deserializeLegacyFiltersPerSlotFromURL,
  normalizeSlotKey,
  parseFilter,
  serializeFiltersPerSlot,
  toSlotParamKey,
  type FiltersPerSlot,
} from './filter/serialization'
import { type DeserializeError } from './shared'
import type { SortOrder } from './sort'
import { parseSort } from './sort'

// Filterは filters.ts からエクスポート
export type { Filter } from './filter/filters-core'

/**
 * URL共有用の状態（スロット、フィルタ、並び替え）
 */
export interface SharedState {
  slot: CandidatesKey
  filtersPerSlot: FiltersPerSlot
  sortKey: string | null
  sortOrder: SortOrder | null
}

/**
 * URLパラメータへのシリアライズ（共有用）
 */
export function serializeToURL(state: SharedState): URLSearchParams {
  const params = new URLSearchParams()

  // スロット
  params.set('slot', camelToSnake(state.slot))

  // 既存のフィルタパラメータを一旦削除（Svelte効果内で複数回呼ばれる想定）
  for (const slot of CANDIDATES_KEYS) {
    params.delete(toSlotParamKey(slot))
  }

  // フィルタ条件（全スロット)
  const serializedFilters = serializeFiltersPerSlot(state.filtersPerSlot)
  for (const [key, value] of serializedFilters.entries()) {
    params.set(key, value)
  }

  // 並び替え
  if (state.sortKey && state.sortOrder) {
    params.set('sort', `${state.sortKey}:${state.sortOrder}`)
  }

  return params
}
/**
 * URLパラメータからのデシリアライズ
 */
export async function deserializeFromURL(
  params: URLSearchParams,
): Promise<Result.Result<SharedState, DeserializeError>> {
  try {
    // スロット
    const slotParam = params.get('slot')
    let slot: CandidatesKey = 'rightArmUnit'

    if (slotParam) {
      const normalized = normalizeSlotKey(slotParam)
      if (!normalized) {
        return Result.fail({ type: 'invalid_slot', slot: slotParam })
      }
      slot = normalized
    }

    // フィルタ条件（スロットごと）
    let filtersPerSlot = deserializeFiltersPerSlot(params)

    const legacyCompressed = params.get('filters')
    if (legacyCompressed) {
      const legacy = await deserializeLegacyFiltersPerSlotFromURL(legacyCompressed)
      if (legacy.type === 'Failure') {
        return Result.fail(legacy.error)
      }

      for (const [legacySlot, legacyFilters] of Object.entries(legacy.value)) {
        const slotKey = legacySlot as CandidatesKey
        if (!filtersPerSlot[slotKey] || filtersPerSlot[slotKey]?.length === 0) {
          filtersPerSlot = {
            ...filtersPerSlot,
            [slotKey]: legacyFilters,
          }
        }
      }
    }

    // 後方互換: filterクエリパラメータ（現在スロットのみ）
    const legacyFilterParams = params.getAll('filter')
    if (legacyFilterParams.length > 0) {
      const parsedLegacyFilters: Filter[] = []
      for (const filterParam of legacyFilterParams) {
        const parsed = parseFilter(filterParam)
        if (parsed) {
          parsedLegacyFilters.push(parsed)
        } else {
          logger.warn('Invalid filter parameter skipped', {
            filter: filterParam,
          })
        }
      }

      if (parsedLegacyFilters.length > 0) {
        const existing = filtersPerSlot[slot]
        if (!existing || existing.length === 0) {
          filtersPerSlot = {
            ...filtersPerSlot,
            [slot]: parsedLegacyFilters,
          }
        }
      }
    }

    // 並び替え
    const sortParam = params.get('sort')
    let sortKey: string | null = null
    let sortOrder: SortOrder | null = null

    if (sortParam) {
      const parsed = parseSort(sortParam)
      if (parsed) {
        sortKey = parsed.key
        sortOrder = parsed.order
      } else {
        logger.warn('Invalid sort parameter, using default', {
          sort: sortParam,
        })
      }
    }

    return Result.succeed({ slot, filtersPerSlot, sortKey, sortOrder })
  } catch (error) {
    logger.error('Failed to deserialize state from URL', {
      error: error instanceof Error ? error.message : String(error),
    })

    return Result.fail({
      type: 'invalid_format',
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

function camelToSnake(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}
