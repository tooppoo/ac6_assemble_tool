import {
  type CandidatesKey,
  CANDIDATES_KEYS,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

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
 * スロットごとに有効なフィルタプロパティのマップ
 * 現時点では全スロット共通（将来のスロット固有属性追加に備えて用意）
 */
const SLOT_SPECIFIC_PROPERTIES: Record<CandidatesKey, ReadonlySet<string>> = {
  rightArmUnit: VALID_FILTER_PROPERTIES,
  leftArmUnit: VALID_FILTER_PROPERTIES,
  rightBackUnit: VALID_FILTER_PROPERTIES,
  leftBackUnit: VALID_FILTER_PROPERTIES,
  head: VALID_FILTER_PROPERTIES,
  core: VALID_FILTER_PROPERTIES,
  arms: VALID_FILTER_PROPERTIES,
  legs: VALID_FILTER_PROPERTIES,
  booster: VALID_FILTER_PROPERTIES,
  fcs: VALID_FILTER_PROPERTIES,
  generator: VALID_FILTER_PROPERTIES,
  expansion: VALID_FILTER_PROPERTIES,
}

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
 * フィルタパラメータをパース
 */
function parseFilter(filterParam: string): Filter | null {
  const parts = filterParam.split(':')

  if (parts.length !== 3) {
    return null
  }

  const [property, operator, valueStr] = parts

  // propertyの検証: 無効なプロパティはスキップ
  if (!VALID_FILTER_PROPERTIES.has(property)) {
    return null
  }

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

/**
 * スロット切替時のフィルタ条件分割結果
 */
export interface FilterSplitResult {
  valid: Filter[]
  invalidated: Filter[]
}

/**
 * スロット切替時にフィルタ条件を有効なものと無効なものに分割
 * 現時点では全属性が共通なので、全て有効として返す
 * 将来のスロット固有属性追加時に、この関数を拡張する
 */
export function splitFiltersBySlot(
  filters: Filter[],
  slot: CandidatesKey,
): FilterSplitResult {
  const validProperties = SLOT_SPECIFIC_PROPERTIES[slot]

  const valid: Filter[] = []
  const invalidated: Filter[] = []

  for (const filter of filters) {
    if (validProperties.has(filter.property)) {
      valid.push(filter)
    } else {
      invalidated.push(filter)
    }
  }

  return { valid, invalidated }
}

/**
 * パーツにフィルタを適用する
 *
 * @param parts パーツ配列
 * @param filters フィルタ条件配列（AND条件で適用される）
 * @returns フィルタ済みパーツ配列
 *
 * 各フィルタ条件をAND条件で適用します。
 * 属性未定義のパーツは条件を満たさないものとして除外されます。
 */
export function applyFilters<T extends Record<string, any>>(
  parts: readonly T[],
  filters: Filter[],
): T[] {
  // フィルタがない場合はそのまま返す
  if (filters.length === 0) {
    return [...parts]
  }

  return parts.filter((part) => {
    // 全てのフィルタ条件を満たす必要がある（AND条件）
    return filters.every((filter) => {
      const value = part[filter.property]

      // 属性未定義の場合は除外（Requirement 2.3）
      if (value === undefined || value === null) {
        return false
      }

      // フィルタ条件を適用
      switch (filter.operator) {
        case 'lt':
          return value < filter.value
        case 'lte':
          return value <= filter.value
        case 'gt':
          return value > filter.value
        case 'gte':
          return value >= filter.value
        case 'eq':
          return value === filter.value
        case 'ne':
          return value !== filter.value
        default:
          logger.warn('Unknown filter operator', { filter })
          return false
      }
    })
  })
}
