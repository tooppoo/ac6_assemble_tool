import {
  CANDIDATES_KEYS,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import { VALID_SLOTS, type DeserializeError } from '../shared'

import {
  compressToUrlSafeString,
  decompressFromUrlSafeString,
} from './compression'
import {
  buildPropertyFilter,
  buildNameFilter,
  buildManufactureFilter,
  buildCategoryFilter,
  isPropertyFilterKey,
} from './filters-application'
import {
  type Filter,
  numericOperands,
  selectAnyOperand,
  stringOperands,
} from './filters-core'

/**
 * LocalStorageに保存するスロットごとのフィルタ状態のキー
 */
const FILTERS_PER_SLOT_KEY = 'ac6-parts-list-filters-per-slot'

/**
 * フィルタパラメータをパース
 */
export function parseFilter(filterParam: string): Filter | null {
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
      if (!isPropertyFilterKey(property)) {
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

      return buildPropertyFilter(property, operand, numValue)
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

      return buildNameFilter(operand, value)
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
 * スロットごとのフィルタ状態をURLパラメータにシリアライズ
 * フィルタが設定されているスロットのみを含める（URL長を削減）
 * CompressionStream(Gzip)圧縮を使用してURLサイズを削減
 */
export async function serializeFiltersPerSlotToURL(
  filtersPerSlot: FiltersPerSlot,
): Promise<string> {
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
  try {
    return await compressToUrlSafeString(json)
  } catch (error) {
    logger.error('Failed to compress filters per slot for URL', {
      error: error instanceof Error ? error.message : String(error),
    })
    return ''
  }
}

/**
 * URLパラメータからスロットごとのフィルタ状態を復元
 */
export async function deserializeFiltersPerSlotFromURL(
  compressedFilters: string,
): Promise<Result.Result<FiltersPerSlot, DeserializeError>> {
  if (!compressedFilters) {
    // フィルタパラメータがない場合は空のオブジェクトを返す
    return Result.succeed({})
  }

  try {
    const json = await decompressFromUrlSafeString(compressedFilters)
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
export function saveFiltersPerSlotToLocalStorage(
  filtersPerSlot: FiltersPerSlot,
): void {
  try {
    const serializable = Object.entries(filtersPerSlot).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value.map((f) => f.serialize()),
      }),
      {} as Record<string, string[]>,
    )

    localStorage.setItem(FILTERS_PER_SLOT_KEY, JSON.stringify(serializable))
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

    const parsed = JSON.parse(saved) as Record<string, string[]>
    // 基本的な型チェック
    if (typeof parsed !== 'object' || parsed === null) {
      logger.warn('Invalid filters per slot in localStorage')
      return null
    }

    return Object.entries(parsed).reduce((acc, [slot, serializedFilters]) => {
      // スロット名の検証
      if (!VALID_SLOTS.has(slot as CandidatesKey)) {
        logger.warn(
          'Invalid slot in filters per slot from localStorage, skipping',
          { slot },
        )
        return acc
      }

      // serializedFiltersが配列かチェック
      if (!Array.isArray(serializedFilters)) {
        logger.warn(
          'Filters for slot from localStorage is not an array, skipping',
          { slot },
        )
        return acc
      }
      const filters: Filter[] = []
      for (const serializedFilter of serializedFilters) {
        const parsedFilter = parseFilter(serializedFilter)
        if (parsedFilter) {
          filters.push(parsedFilter)
        }
      }

      return {
        ...acc,
        [slot as CandidatesKey]: filters,
      }
    }, {} as FiltersPerSlot)
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
 * スロットごとのフィルタ状態
 * 各スロットが独立したフィルタ配列を持つ
 */

export type FiltersPerSlot = {
  [K in CandidatesKey]?: Filter[]
}
