/**
 * パーツ一覧ページ用のフィルタリングロジック
 *
 * パーツ一覧ページに最適化されたシンプルなフィルタリング機能を提供します。
 * 既存のPartsFilterSet（アセンブリページ用）とは独立した実装です。
 */

import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'

/**
 * フィルタ条件
 */
export interface Filter {
  property: string
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'ne'
  value: number | string
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
 * 数値型のフィルタプロパティ一覧
 */
const NUMERIC_FILTER_PROPERTIES: ReadonlySet<string> = new Set([
  'price',
  'weight',
  'en_load',
])

/**
 * プロパティの表示名マップ（日本語）
 */
export const PROPERTY_LABELS: Record<string, string> = {
  price: '価格',
  weight: '重量',
  en_load: 'EN負荷',
  name: '名前',
  classification: '分類',
  manufacture: 'メーカー',
  category: 'カテゴリ',
}

/**
 * フィルタ可能なプロパティのリスト（UI表示用）
 */
export const FILTERABLE_PROPERTIES = [
  'price',
  'weight',
  'en_load',
  'name',
  'classification',
  'manufacture',
  'category',
] as const

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
export function applyFilters<T extends Record<string, unknown>>(
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

/**
 * フィルタプロパティが有効かどうかを検証
 */
export function isValidFilterProperty(property: string): boolean {
  return VALID_FILTER_PROPERTIES.has(property)
}

/**
 * プロパティが数値型かどうかを判定
 */
export function isNumericProperty(property: string): boolean {
  return NUMERIC_FILTER_PROPERTIES.has(property)
}
