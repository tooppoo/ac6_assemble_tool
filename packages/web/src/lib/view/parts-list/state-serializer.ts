import {
  type CandidatesKey,
  CANDIDATES_KEYS,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import { type Filter, isValidFilterProperty } from './filters'

/**
 * 表示モード（grid/list）
 */
export type ViewMode = 'grid' | 'list'

// Filterは filters.ts からエクスポート
export type { Filter } from './filters'

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

  // フィルタ条件（新しい型に対応）
  for (const filter of state.filters) {
    let filterStr: string

    switch (filter.type) {
      case 'property':
        // Format: property:propertyName:operator:value
        filterStr = `property:${filter.property}:${filter.operator}:${filter.value}`
        break

      case 'name':
        // Format: name:mode:value
        filterStr = `name:${filter.mode}:${filter.value}`
        break

      case 'manufacture':
        // Format: manufacture:value1,value2,value3
        filterStr = `manufacture:${filter.values.join(',')}`
        break

      case 'category':
        // Format: category:value1,value2,value3
        filterStr = `category:${filter.values.join(',')}`
        break

      default:
        // TypeScriptの exhaustive check
        const _exhaustive: never = filter
        logger.warn('Unknown filter type in serializeToURL', { filter })
        continue
    }

    params.append('filter', filterStr)
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
): Result.Result<SharedState, DeserializeError> {
  try {
    // スロット
    const slotParam = params.get('slot')
    let slot: CandidatesKey = 'rightArmUnit' // デフォルト

    if (slotParam) {
      if (!VALID_SLOTS.has(slotParam as CandidatesKey)) {
        return Result.fail({ type: 'invalid_slot', slot: slotParam })
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

    return Result.succeed({ slot, filters, sortKey, sortOrder })
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
 * フィルタパラメータをパース（新しい型に対応）
 */
function parseFilter(filterParam: string): Filter | null {
  const parts = filterParam.split(':')

  if (parts.length < 2) {
    return null
  }

  const filterType = parts[0]

  switch (filterType) {
    case 'property': {
      // Format: property:propertyName:operator:value
      if (parts.length !== 4) {
        return null
      }

      const [, property, operator, valueStr] = parts

      // propertyの検証: 無効なプロパティはスキップ
      if (!isValidFilterProperty(property)) {
        return null
      }

      // operatorの検証
      const validOperators = ['lt', 'lte', 'gt', 'gte', 'eq', 'ne'] as const
      if (!validOperators.includes(operator as (typeof validOperators)[number])) {
        return null
      }

      // 数値変換を試みる
      const numValue = Number(valueStr)
      const value = Number.isNaN(numValue) ? valueStr : numValue

      return {
        type: 'property',
        property,
        operator: operator as (typeof validOperators)[number],
        value,
      }
    }

    case 'name': {
      // Format: name:mode:value
      if (parts.length !== 3) {
        return null
      }

      const [, mode, value] = parts

      // modeの検証
      const validModes = ['exact', 'contains', 'not_contains'] as const
      if (!validModes.includes(mode as (typeof validModes)[number])) {
        return null
      }

      if (!value || value.trim() === '') {
        return null
      }

      return {
        type: 'name',
        mode: mode as (typeof validModes)[number],
        value,
      }
    }

    case 'manufacture': {
      // Format: manufacture:value1,value2,value3
      if (parts.length !== 2) {
        return null
      }

      const [, valuesStr] = parts

      if (!valuesStr || valuesStr.trim() === '') {
        return null
      }

      const values = valuesStr.split(',').filter((v) => v.trim() !== '')

      if (values.length === 0) {
        return null
      }

      return {
        type: 'manufacture',
        values,
      }
    }

    case 'category': {
      // Format: category:value1,value2,value3
      if (parts.length !== 2) {
        return null
      }

      const [, valuesStr] = parts

      if (!valuesStr || valuesStr.trim() === '') {
        return null
      }

      const values = valuesStr.split(',').filter((v) => v.trim() !== '')

      if (values.length === 0) {
        return null
      }

      return {
        type: 'category',
        values,
      }
    }

    default:
      // 未知のフィルタタイプ、またはレガシー形式
      logger.warn('Unknown or legacy filter type', { filterParam })
      return null
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
