import {
  CANDIDATES_KEYS,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import {
  compressToUrlSafeString,
  decompressFromUrlSafeString,
} from './filter/compression'
import { type Filter } from './filter/filters-core'
import {
  normalizeSlotKey,
  parseFilter,
  type FiltersPerSlot,
} from './filter/serialization'
import { type DeserializeError, VALID_SLOTS } from './shared'
import { toSlotParamValue } from './slot-utils'
import type { SortKey, SortOrder } from './sort'
import { parseSort } from './sort'

// Filterは filters.ts からエクスポート
export type { Filter } from './filter/filters-core'

/**
 * URL共有用の状態（スロット、フィルタ、並び替え）
 */
export interface SharedState {
  slot: CandidatesKey
  filtersPerSlot: FiltersPerSlot
  sortKey: SortKey | null
  sortOrder: SortOrder | null
}

export const MANAGED_SHARED_QUERY_KEYS = ['slot', 'filters', 'sort'] as const

/**
 * URLパラメータへのシリアライズ（共有用）
 */
export async function serializeToURL(
  state: SharedState,
): Promise<URLSearchParams> {
  const params = new URLSearchParams()

  // スロット
  params.set('slot', toSlotParamValue(state.slot))

  // フィルタ条件（全スロット)
  const compressedFilters = await serializeFiltersParam(state.filtersPerSlot)
  if (compressedFilters) {
    params.set('filters', compressedFilters)
  }

  // 並び替え
  if (state.sortKey && state.sortOrder) {
    params.set('sort', `${state.sortKey}:${state.sortOrder}`)
  }

  return params
}

type SerializedFiltersPayload = Partial<Record<CandidatesKey, string[]>>

async function serializeFiltersParam(
  filtersPerSlot: FiltersPerSlot,
): Promise<string | null> {
  const payload = buildFiltersPayload(filtersPerSlot)
  if (!payload) {
    return null
  }

  const json = JSON.stringify(payload)
  return compressToUrlSafeString(json)
}

function buildFiltersPayload(
  filtersPerSlot: FiltersPerSlot,
): SerializedFiltersPayload | null {
  const payload: SerializedFiltersPayload = {}
  let hasFilters = false

  for (const slot of CANDIDATES_KEYS) {
    const slotFilters = filtersPerSlot[slot]
    if (!slotFilters || slotFilters.length === 0) {
      continue
    }

    payload[slot] = slotFilters.map((filter) => filter.serialize())
    hasFilters = true
  }

  return hasFilters ? payload : null
}

async function deserializeFiltersParam(
  compressed: string,
): Promise<Result.Result<FiltersPerSlot, DeserializeError>> {
  const json = await decompressFromUrlSafeString(compressed)
  if (!json) {
    return Result.fail({
      type: 'invalid_format',
      message: 'Failed to decompress filters payload',
    })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(json) as unknown
  } catch (error) {
    return Result.fail({
      type: 'invalid_format',
      message:
        error instanceof Error
          ? `Failed to parse filters payload: ${error.message}`
          : 'Failed to parse filters payload',
    })
  }

  if (!isSerializedFiltersPayload(parsed)) {
    return Result.fail({
      type: 'invalid_format',
      message: 'Invalid filters payload structure',
    })
  }

  const restored: FiltersPerSlot = {}
  for (const [slotKey, serializedFilters] of Object.entries(parsed)) {
    if (!isValidSlotKey(slotKey)) {
      logger.warn('Invalid slot in filters payload, skipping', {
        slot: slotKey,
      })
      continue
    }

    const parsedFilters: Filter[] = []
    for (const serializedFilter of serializedFilters) {
      const parsedFilter = parseFilter(serializedFilter)
      if (!parsedFilter) {
        logger.warn('Invalid filter entry skipped', {
          slot: slotKey,
          filter: serializedFilter,
        })
        continue
      }
      parsedFilters.push(parsedFilter)
    }

    if (parsedFilters.length > 0) {
      restored[slotKey] = parsedFilters
    }
  }

  return Result.succeed(restored)
}

function isSerializedFiltersPayload(
  value: unknown,
): value is SerializedFiltersPayload {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return Object.entries(value as Record<string, unknown>).every(
    ([slot, serializedFilters]) =>
      typeof slot === 'string' &&
      Array.isArray(serializedFilters) &&
      serializedFilters.every(
        (entry) => typeof entry === 'string' && entry.trim().length > 0,
      ),
  )
}

function isValidSlotKey(value: string): value is CandidatesKey {
  return VALID_SLOTS.has(value as CandidatesKey)
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
    let filtersPerSlot: FiltersPerSlot = {}

    const compressedFilters = params.get('filters')
    if (compressedFilters) {
      const restored = await deserializeFiltersParam(compressedFilters)
      if (restored.type === 'Failure') {
        return Result.fail(restored.error)
      }
      filtersPerSlot = restored.value
    }

    // 並び替え
    const sortParam = params.get('sort')
    let sortKey: SortKey | null = null
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
