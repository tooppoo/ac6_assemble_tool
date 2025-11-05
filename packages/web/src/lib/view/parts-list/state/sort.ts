import { getNumericAttributes } from '@ac6_assemble_tool/parts/attributes-utils'
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
  // 配列型属性のソート対応は Task 3.2 で追加予定。現状は数値型属性のみ返却する。
  return [...getNumericAttributes(slot)]
}

/**
 * パーツ一覧を指定したキーと順序で並び替える
 */
export function sortPartsByKey(
  parts: readonly ACParts[],
  key: SortKey,
  order: SortOrder,
): ACParts[] {
  const withValue: Array<{ part: ACParts; value: number; index: number }> = []
  const withoutValue: Array<{ part: ACParts; index: number }> = []

  parts.forEach((part, index) => {
    const value = (part as Record<string, unknown>)[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      withValue.push({ part, value, index })
    } else {
      withoutValue.push({ part, index })
    }
  })

  const direction = order === 'asc' ? 1 : -1

  withValue.sort((left, right) => {
    if (left.value === right.value) {
      return left.index - right.index
    }
    return (left.value - right.value) * direction
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
