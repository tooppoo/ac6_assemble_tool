/**
 * パーツID検索モジュール
 *
 * IDベースでパーツを検索し、引当を行う機能を提供します。
 */

import { logger } from '@ac6_assemble_tool/shared/logger'

/**
 * パーツ配列からID→パーツのMapを作成
 *
 * @param parts - パーツ配列
 * @returns ID→パーツのMap
 *
 * @example
 * ```typescript
 * const parts = [
 *   { id: 'HD001', name: 'Head A' },
 *   { id: 'HD002', name: 'Head B' },
 * ]
 * const map = createPartIdMap(parts)
 * // => Map { 'HD001' => { id: 'HD001', name: 'Head A' }, ... }
 * ```
 */
export function createPartIdMap<T extends { id: string }>(
  parts: ReadonlyArray<T>,
): ReadonlyMap<string, T> {
  return new Map(parts.map((part) => [part.id, part]))
}

/**
 * パーツIDでパーツを検索し、見つからない場合はフォールバックを返す（Mapから検索、O(1)）
 *
 * @param partMap - ID→パーツのMap
 * @param id - 検索するパーツID
 * @param fallback - 見つからない場合に返すフォールバック値
 * @returns 見つかったパーツまたはフォールバック値
 *
 * @example
 * ```typescript
 * const parts = [
 *   { id: 'HD001', name: 'Head A' },
 *   { id: 'HD002', name: 'Head B' },
 * ]
 * const map = createPartIdMap(parts)
 * const defaultPart = { id: 'HD000', name: 'Default Head' }
 * const result = findPartByIdOrFallbackFromMap(map, 'HD999', defaultPart)
 * // => { id: 'HD000', name: 'Default Head' }
 * ```
 */
export function findPartByIdOrFallbackFromMap<
  T extends { id: string; name: string },
>(partMap: ReadonlyMap<string, T>, id: string, fallback: T): T {
  const found = partMap.get(id)

  if (!found) {
    logger.warn('Part ID not found, using fallback', {
      requestedId: id,
      fallbackId: fallback.id,
      fallbackName: fallback.name,
    })
  }

  return found ?? fallback
}

/**
 * パーツIDでパーツを検索し、見つからない場合は配列の最初の要素を返す
 *
 * @param parts - 検索対象のパーツ配列
 * @param id - 検索するパーツID
 * @returns 見つかったパーツまたは配列の最初の要素
 *
 * @example
 * ```typescript
 * const parts = [
 *   { id: 'HD001', name: 'Head A' },
 *   { id: 'HD002', name: 'Head B' },
 * ]
 * const result = findPartByIdOrFirst(parts, 'HD999')
 * // => { id: 'HD001', name: 'Head A' }
 * ```
 */
export function findPartByIdOrFirst<T extends { id: string; name: string }>(
  parts: ReadonlyArray<T>,
  id: string | undefined,
): T | undefined {
  if (!id) {
    return parts[0]
  }

  const found = parts.find((part) => part.id === id)

  if (!found && parts[0]) {
    logger.warn('Part ID not found, using first part', {
      requestedId: id,
      fallbackId: parts[0].id,
      fallbackName: parts[0].name,
    })
  }

  return found ?? parts[0]
}
