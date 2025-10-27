import {
  CANDIDATES_KEYS,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import { VALID_SLOTS, type DeserializeError } from '../shared'

import { decompressFromUrlSafeString } from './compression'
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
export function serializeFiltersForSlot(filters: readonly Filter[]): string {
  return filters.map((filter) => filter.serialize()).join('|')
}

export function deserializeFiltersForSlot(
  serialized: string,
): Result.Result<Filter[], DeserializeError> {
  if (!serialized) {
    return Result.succeed([])
  }

  const items = serialized.split('|').filter((entry) => entry.trim().length > 0)
  const filters: Filter[] = []

  for (const entry of items) {
    const parsed = parseFilter(entry)
    if (!parsed) {
      logger.warn('Invalid filter entry in filters per slot, skipping', {
        filterParam: entry,
      })
      continue
    }
    filters.push(parsed)
  }

  return Result.succeed(filters)
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

export function toSlotParamKey(slot: CandidatesKey): string {
  return `${camelToSnake(slot)}_filters`
}

export function serializeFiltersPerSlot(filtersPerSlot: FiltersPerSlot): ReadonlyMap<string, string> {
  const entries: [string, string][] = []
  for (const slot of CANDIDATES_KEYS) {
    const filters = filtersPerSlot[slot]
    if (!filters || filters.length === 0) {
      continue
    }

    const serialized = serializeFiltersForSlot(filters)
    if (serialized.length > 0) {
      entries.push([toSlotParamKey(slot), serialized])
    }
  }

  return new Map(entries)
}

export function deserializeFiltersPerSlot(
  params: URLSearchParams,
): FiltersPerSlot {
  const restored: FiltersPerSlot = {}

  for (const slot of CANDIDATES_KEYS) {
    const paramKey = toSlotParamKey(slot)
    const serialized = params.get(paramKey)
    if (!serialized) continue

    const result = deserializeFiltersForSlot(serialized)
    if (Result.isSuccess(result) && result.value.length > 0) {
      restored[slot] = result.value
    }
  }

  return restored
}

export function normalizeSlotKey(value: string): CandidatesKey | null {
  if (!value) {
    return null
  }

  if (VALID_SLOTS.has(value as CandidatesKey)) {
    return value as CandidatesKey
  }

  const camel = snakeToCamel(value)
  if (VALID_SLOTS.has(camel as CandidatesKey)) {
    return camel as CandidatesKey
  }

  return null
}

function camelToSnake(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function snakeToCamel(value: string): string {
  return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
}

type SerializedFiltersPerSlot = Record<string, string[]>

export async function deserializeLegacyFiltersPerSlotFromURL(
  compressedFilters: string,
): Promise<Result.Result<FiltersPerSlot, DeserializeError>> {
  if (!compressedFilters) {
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

    const parsed = JSON.parse(json) as unknown
    if (!isSerializedFiltersRecord(parsed)) {
      return Result.fail({
        type: 'invalid_format',
        message: 'Parsed filters is not an object',
      })
    }

    const restored: FiltersPerSlot = {}
    for (const [slotKey, serializedFilters] of Object.entries(parsed)) {
      if (!VALID_SLOTS.has(slotKey as CandidatesKey)) {
        logger.warn('Invalid slot in legacy filters, skipping', { slot: slotKey })
        continue
      }

      if (!Array.isArray(serializedFilters)) {
        logger.warn('Filters for slot from legacy data is not an array, skipping', {
          slot: slotKey,
        })
        continue
      }

      const filters: Filter[] = []
      for (const serializedFilter of serializedFilters) {
        const parsedFilter = parseFilter(serializedFilter)
        if (!parsedFilter) {
          logger.warn('Invalid legacy filter entry skipped', {
            slot: slotKey,
            serializedFilter,
          })
          continue
        }
        filters.push(parsedFilter)
      }

      if (filters.length > 0) {
        restored[slotKey as CandidatesKey] = filters
      }
    }

    return Result.succeed(restored)
  } catch (error) {
    logger.error('Failed to deserialize legacy filters per slot from URL', {
      error: error instanceof Error ? error.message : String(error),
    })

    return Result.fail({
      type: 'invalid_format',
      message: error instanceof Error ? error.message : String(error),
    })
  }
}

function isSerializedFiltersRecord(value: unknown): value is SerializedFiltersPerSlot {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return Object.values(value as Record<string, unknown>).every((entry) => {
    if (!Array.isArray(entry)) {
      return false
    }
    return entry.every((filter) => typeof filter === 'string' && filter.length > 0)
  })
}
