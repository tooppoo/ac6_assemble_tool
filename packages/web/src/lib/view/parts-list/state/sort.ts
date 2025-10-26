/**
 * 並び替えパラメータをパース
 */

export function parseSort(
  sortParam: string
): { key: string; order: SortOrder}  | null {
  const parts = sortParam.split(':')

  if (parts.length !== 2) {
    return null
  }

  const [key, order] = parts

  if (order !== 'asc' && order !== 'desc') {
    return null
  }

  return { key, order }
}/**
 * 並び替え順序
 */

export type SortOrder = 'asc' | 'desc'

