import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import {
  type CandidatesKey,
  CANDIDATES_KEYS,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'
import * as LZString from 'lz-string'

import { buildCategoryFilter, buildManufactureFilter, buildNameFilter, buildPropertyFilter } from './filters-application'
import { numericOperands, selectAnyOperand, stringOperands, type Filter } from './filters-core'

/**
 * 表示モード（grid/list）
 */
export type ViewMode = 'grid' | 'list'

// Filterは filters.ts からエクスポート
export type { Filter } from './filters-core'

/**
 * 並び替え順序
 */
export type SortOrder = 'asc' | 'desc'

/**
 * スロットごとのフィルタ状態
 * 各スロットが独立したフィルタ配列を持つ
 */
export type FiltersPerSlot = {
  [K in CandidatesKey]?: Filter[]
}

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
 * LocalStorageに保存するスロットごとのフィルタ状態のキー
 */
const FILTERS_PER_SLOT_KEY = 'ac6-parts-list-filters-per-slot'

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
    params.append('filter', filter.serialize())
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

  // Format: dataType:propertyName:operator:value
  if (parts.length !== 4) {
    return null
  }

  const dataType = parts[0]

  switch (dataType) {
    case 'numeric': {
      const [, property, operator, valueStr] = parts

      // propertyの検証: 無効なプロパティはスキップ
      if (!isValidFilterProperty(property)) {
        return null
      }

      // operatorの検証
      const validOperators = ['lt', 'lte', 'gt', 'gte', 'eq', 'ne']
      if (!validOperators.includes(operator)) {
        return null
      }
      const operand = numericOperands().find((op) => op.id === operator)
      if (!operand) {
        return null
      }

      // valueの検証
      const numValue = Number(valueStr)
      if (isNaN(numValue)) {
        return null
      }

      return buildPropertyFilter(
        property as keyof ACParts,
        operand,
        numValue,
      )
    }

    case 'string': {
      const [, , operator, value] = parts

      // operatorの検証
      const validOperators = ['exact', 'contain', 'not_contain']
      if (!validOperators.includes(operator)) {
        return null
      }
      const operand = stringOperands().find((op) => op.id === operator)
      if (!operand) {
        return null
      }

      if (!value || value.trim() === '') {
        return null
      }

      return buildNameFilter(
        operand,
        value,
      )
    }

    case 'array': {
      // Format1: array:manufacture:operand:value1,value2,value3
      // Format2: array:category:operand:value1,value2,value3

      const [, property, , valuesStr] = parts

      // valuesの検証
      if (!valuesStr || valuesStr.trim() === '') {
        return null
      }
      const values = valuesStr.split(',').filter((v) => v.trim() !== '')
      if (values.length === 0) {
        return null
      }

      switch (property) {
        case 'manufacture': {
          return buildManufactureFilter(selectAnyOperand(), values)
        }
        case 'category': {
          return buildCategoryFilter(selectAnyOperand(), values)
        }
        default:
          // 未知のフィルタタイプ、またはレガシー形式
          logger.warn('Unknown or legacy filter type', { filterParam })
          return null
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

/**
 * スロットごとのフィルタ状態をURLパラメータにシリアライズ
 * フィルタが設定されているスロットのみを含める（URL長を削減）
 * LZ-string圧縮を使用してURLサイズを削減
 */
export function serializeFiltersPerSlotToURL(filtersPerSlot: FiltersPerSlot): string {
  // 空のフィルタを持つスロットを除外
  const nonEmptyFilters: FiltersPerSlot = {}
  for (const [slot, filters] of Object.entries(filtersPerSlot)) {
    if (filters && filters.length > 0) {
      nonEmptyFilters[slot as CandidatesKey] = filters
    }
  }

  // フィルタが1つもない場合は空文字列を返す
  if (Object.keys(nonEmptyFilters).length === 0) {
    return ''
  }

  // JSON → 圧縮 → URLパラメータ
  const json = JSON.stringify(nonEmptyFilters)
  const compressed = LZString.compressToEncodedURIComponent(json)
  return compressed
}

/**
 * URLパラメータからスロットごとのフィルタ状態を復元
 */
export function deserializeFiltersPerSlotFromURL(
  compressedFilters: string,
): Result.Result<FiltersPerSlot, DeserializeError> {
  if (!compressedFilters) {
    // フィルタパラメータがない場合は空のオブジェクトを返す
    return Result.succeed({})
  }

  try {
    const json = LZString.decompressFromEncodedURIComponent(compressedFilters)
    if (!json) {
      return Result.fail({
        type: 'invalid_format',
        message: 'Failed to decompress filters',
      })
    }

    const parsed = JSON.parse(json)

    // 基本的な型チェック
    if (typeof parsed !== 'object' || parsed === null) {
      return Result.fail({
        type: 'invalid_format',
        message: 'Parsed filters is not an object',
      })
    }

    // 各スロットのフィルタを検証（簡易版）
    const validated: FiltersPerSlot = {}
    for (const [slot, filters] of Object.entries(parsed)) {
      // スロット名の検証
      if (!VALID_SLOTS.has(slot as CandidatesKey)) {
        logger.warn('Invalid slot in filters per slot, skipping', { slot })
        continue
      }

      // filtersが配列かチェック
      if (!Array.isArray(filters)) {
        logger.warn('Filters for slot is not an array, skipping', { slot })
        continue
      }

      validated[slot as CandidatesKey] = filters as Filter[]
    }

    return Result.succeed(validated)
  } catch (error) {
    logger.error('Failed to deserialize filters per slot from URL', {
      error: error instanceof Error ? error.message : String(error),
    })

    return Result.fail({
      type: 'invalid_format',
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * スロットごとのフィルタ状態をLocalStorageに保存
 */
export function saveFiltersPerSlotToLocalStorage(filtersPerSlot: FiltersPerSlot): void {
  try {
    localStorage.setItem(FILTERS_PER_SLOT_KEY, JSON.stringify(filtersPerSlot))
  } catch (error) {
    logger.error('Failed to save filters per slot to localStorage', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * LocalStorageからスロットごとのフィルタ状態を復元
 */
export function loadFiltersPerSlotFromLocalStorage(): FiltersPerSlot | null {
  try {
    const saved = localStorage.getItem(FILTERS_PER_SLOT_KEY)
    if (!saved) return null

    const parsed = JSON.parse(saved)

    // 基本的な型チェック
    if (typeof parsed !== 'object' || parsed === null) {
      logger.warn('Invalid filters per slot in localStorage')
      return null
    }

    return parsed as FiltersPerSlot
  } catch (error) {
    logger.error('Failed to load filters per slot from localStorage', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * すべてのスロットに対して空のフィルタ配列を持つデフォルトの FiltersPerSlot を作成
 */
export function createDefaultFiltersPerSlot(): FiltersPerSlot {
  const defaults: FiltersPerSlot = {}
  for (const slot of CANDIDATES_KEYS) {
    defaults[slot] = []
  }
  return defaults
}

/**
 * 有効なフィルタプロパティ一覧
 * 全パーツ共通の基本プロパティのみを許可
 */
const VALID_FILTER_PROPERTIES: ReadonlySet<string> = new Set([
  'price',
  'weight',
  'en_load',
  'name',
  'classification',
  'manufacture',
  'category',
])
/**
 * フィルタプロパティが有効かどうかを検証
 */
function isValidFilterProperty(property: string): boolean {
  return VALID_FILTER_PROPERTIES.has(property)
}