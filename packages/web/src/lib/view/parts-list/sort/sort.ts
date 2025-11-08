import {
  getArrayAttributes,
  getNumericAttributes,
} from '@ac6_assemble_tool/parts/attributes-utils'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'

export type SortKey = string
export type SortOrder = 'asc' | 'desc'

/**
 * 並び替えパラメータをパース
 */

export function parseSort(
  sortParam: string,
): { key: SortKey; order: SortOrder } | null {
  const parts = sortParam.split(':')

  if (parts.length !== 2) {
    return null
  }

  const [key, order] = parts

  if (!isSortOrder(order)) {
    return null
  }

  if (!isSortKey(key)) {
    return null
  }

  return { key, order }
}

/**
 * 選択中スロットで利用可能な並び替えキーを取得する
 */
export function getAvailableSortKeys(slot: CandidatesKey): SortKey[] {
  return [...getNumericAttributes(slot), ...getArrayAttributes(slot)]
}

/**
 * パーツ一覧を指定したキーと順序で並び替える
 */
export function sortPartsByKey(
  parts: readonly ACParts[],
  key: SortKey,
  order: SortOrder,
): ACParts[] {
  const withValue: Array<
    {
      part: ACParts
      index: number
    } & SortableValue
  > = []
  const withoutValue: Array<{ part: ACParts; index: number }> = []

  parts.forEach((part, index) => {
    const value = (part as Record<string, unknown>)[key]
    const sortable = toSortableValue(value)
    if (sortable === null) {
      withoutValue.push({ part, index })
      return
    }

    withValue.push({
      part,
      index,
      ...sortable,
    })
  })

  const direction = order === 'asc' ? 1 : -1

  withValue.sort((left, right) => {
    if (left.kind === 'number' && right.kind === 'number') {
      if (left.value === right.value) {
        return left.index - right.index
      }
      return (left.value - right.value) * direction
    }

    const leftStr = String(left.value)
    const rightStr = String(right.value)
    const compare = leftStr.localeCompare(rightStr, undefined, {
      sensitivity: 'base',
    })
    if (compare === 0) {
      return left.index - right.index
    }
    return compare * direction
  })

  const sorted = withValue.map((entry) => entry.part)
  for (const entry of withoutValue.sort((a, b) => a.index - b.index)) {
    sorted.push(entry.part)
  }

  return sorted
}

function isSortOrder(value: string): value is SortOrder {
  return value === 'asc' || value === 'desc'
}

function isSortKey(value: string): value is SortKey {
  // SortKey is now string to support dynamic attributes
  // Accept any non-empty string as a valid sort key
  // TODO: Future enhancement - validate against attributes.ts for the current slot
  return typeof value === 'string' && value.trim() !== ''
}

type SortableValue =
  | { kind: 'number'; value: number }
  | { kind: 'string'; value: string }

function toSortableValue(value: unknown): SortableValue | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { kind: 'number', value }
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0]
    if (typeof first === 'string' && first.trim() !== '') {
      return { kind: 'string', value: first }
    }
    if (typeof first === 'number' && Number.isFinite(first)) {
      return { kind: 'number', value: first }
    }
    return null
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return { kind: 'string', value }
  }

  return null
}
