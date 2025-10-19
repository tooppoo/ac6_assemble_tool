import { ok, err, type Result } from '$lib/utils/result'

import {
  type CandidatesKey,
  CANDIDATES_KEYS,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'

/**
 * 表示モード（grid/list）
 */
export type ViewMode = 'grid' | 'list'

/**
 * フィルタ条件
 */
export interface Filter {
  property: string
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'ne'
  value: number | string
}

/**
 * 並び替え順序
 */
export type SortOrder = 'asc' | 'desc'

/**
 * URL共有用の状態（スロット、フィルタ、並び替え）
 */
export interface SharedState {
  slot: CandidatesKey
  filters: Filter[]
  sortKey: string | null
  sortOrder: SortOrder | null
}

/**
 * デシリアライズエラー
 */
export type DeserializeError =
  | { type: 'invalid_format'; message: string }
  | { type: 'invalid_slot'; slot: string }
  | { type: 'invalid_filter'; filter: string }

/**
 * LocalStorageに保存する表示モードのキー
 */
const VIEW_MODE_KEY = 'ac6-parts-list-view-mode'

/**
 * 有効なスロット一覧
 */
const VALID_SLOTS: ReadonlySet<CandidatesKey> = new Set(CANDIDATES_KEYS)

/**
 * URLパラメータへのシリアライズ（共有用）
 */
export function serializeToURL(state: SharedState): URLSearchParams {
  const params = new URLSearchParams()

  // スロット
  params.set('slot', state.slot)

  // フィルタ条件
  for (const filter of state.filters) {
    params.append(
      'filter',
      `${filter.property}:${filter.operator}:${filter.value}`,
    )
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
export function deserializeFromURL(
  params: URLSearchParams,
): Result<SharedState, DeserializeError> {
  try {
    // スロット
    const slotParam = params.get('slot')
    let slot: CandidatesKey = 'head' // デフォルト

    if (slotParam) {
      if (!VALID_SLOTS.has(slotParam as CandidatesKey)) {
        return err({ type: 'invalid_slot', slot: slotParam })
      }
      slot = slotParam as CandidatesKey
    }

    // フィルタ条件
    const filterParams = params.getAll('filter')
    const filters: Filter[] = []

    for (const filterParam of filterParams) {
      const parsed = parseFilter(filterParam)
      if (parsed) {
        filters.push(parsed)
      } else {
        logger.warn('Invalid filter parameter skipped', {
          filter: filterParam,
        })
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

    return ok({ slot, filters, sortKey, sortOrder })
  } catch (error) {
    logger.error('Failed to deserialize state from URL', {
      error: error instanceof Error ? error.message : String(error),
    })

    return err({
      type: 'invalid_format',
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * LocalStorageへの表示モード保存（プライベート設定）
 */
export function saveViewMode(viewMode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_MODE_KEY, viewMode)
  } catch (error) {
    logger.error('Failed to save view mode', {
      viewMode,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * LocalStorageからの表示モード読み込み
 */
export function loadViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY)

    if (saved === 'grid' || saved === 'list') {
      return saved
    }

    return 'grid' // デフォルト
  } catch (error) {
    logger.error('Failed to load view mode', {
      error: error instanceof Error ? error.message : String(error),
    })

    return 'grid' // デフォルト
  }
}

/**
 * フィルタパラメータをパース
 */
function parseFilter(filterParam: string): Filter | null {
  const parts = filterParam.split(':')

  if (parts.length !== 3) {
    return null
  }

  const [property, operator, valueStr] = parts

  // operatorの検証
  const validOperators: Filter['operator'][] = [
    'lt',
    'lte',
    'gt',
    'gte',
    'eq',
    'ne',
  ]
  if (!validOperators.includes(operator as Filter['operator'])) {
    return null
  }

  // 数値変換を試みる
  const numValue = Number(valueStr)
  const value = Number.isNaN(numValue) ? valueStr : numValue

  return {
    property,
    operator: operator as Filter['operator'],
    value,
  }
}

/**
 * 並び替えパラメータをパース
 */
function parseSort(
  sortParam: string,
): { key: string; order: SortOrder } | null {
  const parts = sortParam.split(':')

  if (parts.length !== 2) {
    return null
  }

  const [key, order] = parts

  if (order !== 'asc' && order !== 'desc') {
    return null
  }

  return { key, order }
}
