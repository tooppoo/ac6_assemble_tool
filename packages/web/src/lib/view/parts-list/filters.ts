/**
 * パーツ一覧ページ用のフィルタリングロジック
 *
 * パーツ一覧ページに最適化されたシンプルなフィルタリング機能を提供します。
 * 既存のPartsFilterSet（アセンブリページ用）とは独立した実装です。
 */

import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'

/**
 * フィルタ条件の基本型（既存の数値・文字列比較）
 */
export interface PropertyFilter {
  type: 'property'
  property: string
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'ne'
  value: number | string
}

/**
 * 名前フィルタ（3つの検索モード対応）
 */
export interface NameFilter {
  type: 'name'
  mode: 'exact' | 'contains' | 'not_contains'
  value: string
}

/**
 * メーカーフィルタ（複数選択、OR条件）
 */
export interface ManufactureFilter {
  type: 'manufacture'
  values: string[]
}

/**
 * カテゴリフィルタ（複数選択、OR条件）
 */
export interface CategoryFilter {
  type: 'category'
  values: string[]
}

/**
 * フィルタ条件（ユニオン型）
 */
export type Filter =
  | PropertyFilter
  | NameFilter
  | ManufactureFilter
  | CategoryFilter

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
 * 注: 'classification' はスロット選択と重複するため除外
 */
export const FILTERABLE_PROPERTIES = [
  'price',
  'weight',
  'en_load',
  'name',
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
    // フィルタタイプによって処理を分岐
    switch (filter.type) {
      case 'property':
        // PropertyFilterの場合、プロパティが有効かチェック
        if (validProperties.has(filter.property)) {
          valid.push(filter)
        } else {
          invalidated.push(filter)
        }
        break

      case 'name':
      case 'manufacture':
      case 'category':
        // name, manufacture, category は全スロット共通なので常に有効
        valid.push(filter)
        break

      default:
        // 未知のフィルタタイプは無効として扱う
        logger.warn('Unknown filter type in splitFiltersBySlot', { filter })
        invalidated.push(filter)
        break
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
      // フィルタタイプによって処理を分岐
      switch (filter.type) {
        case 'property': {
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
        }

        case 'name': {
          const name = part.name

          // 名前属性未定義の場合は除外
          if (
            typeof name !== 'string' ||
            name === undefined ||
            name === null
          ) {
            return false
          }

          // 大文字小文字を区別しない検索
          const normalizedName = name.toLowerCase()
          const normalizedValue = filter.value.toLowerCase()

          switch (filter.mode) {
            case 'exact':
              return normalizedName === normalizedValue
            case 'contains':
              return normalizedName.includes(normalizedValue)
            case 'not_contains':
              return !normalizedName.includes(normalizedValue)
            default:
              logger.warn('Unknown name filter mode', { filter })
              return false
          }
        }

        case 'manufacture': {
          const manufacture = part.manufacture

          // メーカー属性未定義の場合は除外
          if (
            typeof manufacture !== 'string' ||
            manufacture === undefined ||
            manufacture === null
          ) {
            return false
          }

          // OR条件: いずれかのメーカーに該当すれば表示
          return filter.values.length === 0 || filter.values.includes(manufacture)
        }

        case 'category': {
          const category = part.category

          // カテゴリ属性未定義の場合は除外
          if (
            typeof category !== 'string' ||
            category === undefined ||
            category === null
          ) {
            return false
          }

          // OR条件: いずれかのカテゴリに該当すれば表示
          return filter.values.length === 0 || filter.values.includes(category)
        }

        default:
          logger.warn('Unknown filter type', { filter })
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

/**
 * パーツ配列から利用可能なメーカーのリストを取得
 */
export function extractManufacturers<T extends Record<string, unknown>>(
  parts: readonly T[],
): string[] {
  const manufacturers = new Set<string>()
  for (const part of parts) {
    const manufacture = part.manufacture
    if (typeof manufacture === 'string' && manufacture) {
      manufacturers.add(manufacture)
    }
  }
  return Array.from(manufacturers).sort()
}

/**
 * パーツ配列から利用可能なカテゴリのリストを取得
 */
export function extractCategories<T extends Record<string, unknown>>(
  parts: readonly T[],
): string[] {
  const categories = new Set<string>()
  for (const part of parts) {
    const category = part.category
    if (typeof category === 'string' && category) {
      categories.add(category)
    }
  }
  return Array.from(categories).sort()
}
