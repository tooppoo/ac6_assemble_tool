import type { I18Next } from '$lib/i18n/define'
import { jaAssembly } from '$lib/i18n/locales/ja/assembly'
import { jaCategory } from '$lib/i18n/locales/ja/category'
import { jaFilterOperand } from '$lib/i18n/locales/ja/filter/operand'
import { jaManufactures } from '$lib/i18n/locales/ja/manufactures'

import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

import {
  defineExtractor,
  type Filter,
  type FilterOperand,
} from './filters-core'

export const PROPERTY_FILTER_KEYS = ['price', 'weight', 'en_load'] as const
// PropertyFilterKey is now string to support dynamic attributes
// PROPERTY_FILTER_KEYS remains for backward compatibility checking
export type PropertyFilterKey = string

const PROPERTY_FILTER_KEY_SET: ReadonlySet<PropertyFilterKey> = new Set(
  PROPERTY_FILTER_KEYS,
)

export function isPropertyFilterKey(value: string): value is PropertyFilterKey {
  return PROPERTY_FILTER_KEY_SET.has(value as PropertyFilterKey)
}

/**
 * Filterのアプリケーションレイヤ
 * Filterのコアロジックを使って、アプリケーション用に特化した関数を構築する
 */

// property filter builder
export function buildPropertyFilter(
  property: PropertyFilterKey,
  operand: FilterOperand<'numeric'>,
  value: number,
): Filter {
  return {
    operand,
    extractor: defineExtractor(property),
    property,
    value,
    stringify(i18n: I18Next) {
      return [
        translateProperty(property, i18n) + ':',
        translateOperand(this.operand, i18n),
        value.toString(),
      ].join(' ')
    },
    serialize() {
      return `${this.operand.dataType}:${property}:${this.operand.id}:${this.value}`
    },
  }
}
export function translateProperty(
  property: PropertyFilterKey,
  i18n: I18Next,
): string {
  if (isAssemblyTranslationKey(property)) {
    return i18n.t(property, { ns: 'assembly' })
  }
  else {
    // プロパティ名と変換キーの不一致を調整
    // 将来的に、どちらかに寄せるかも
    const camelCaseKey = toCamelCase(property)

    if (isAssemblyTranslationKey(camelCaseKey)) {
      return i18n.t(camelCaseKey, { ns: 'assembly' })
    }
    else {
      return property
    }
  }
}

// name filter builder
export function buildNameFilter(
  operand: FilterOperand<'string'>,
  value: string,
): Filter {
  return {
    operand,
    property: 'name',
    extractor: defineExtractor('name'),
    value,
    stringify(i18n: I18Next) {
      return `名前: "${this.value}" ${translateOperand(this.operand, i18n)}`
    },
    serialize() {
      return `${this.operand.dataType}:${this.property}:${this.operand.id}:${this.value}`
    },
  }
}

// manufacture
export function buildManufactureFilter(
  operand: FilterOperand<'array'>,
  value: readonly string[],
): Filter {
  return {
    operand,
    property: 'manufacture',
    extractor: defineExtractor('manufacture'),
    value,
    stringify(i18n: I18Next) {
      return `メーカー: ${value.map((v) => translateManufacturer(v, i18n)).join(', ')}`
    },
    serialize() {
      return `${this.operand.dataType}:${this.property}:${this.operand.id}:${value.join(',')}`
    },
  }
}
export function translateManufacturer(
  manufacturer: string,
  i18n: I18Next,
): string {
  if (!isManufactureTranslationKey(manufacturer)) {
    return manufacturer
  }
  return i18n.t(manufacturer, { ns: 'manufacture' })
}

// category
export function buildCategoryFilter(
  operand: FilterOperand<'array'>,
  value: readonly string[],
): Filter {
  return {
    operand,
    property: 'category' as keyof ACParts,
    extractor: defineExtractor('category'),
    value,
    stringify(i18n: I18Next) {
      return `カテゴリ: ${value.map((v) => translateCategory(v, i18n)).join(', ')}`
    },
    serialize() {
      return `${this.operand.dataType}:${this.property}:${this.operand.id}:${value.join(',')}`
    },
  }
}
export function translateCategory(category: string, i18n: I18Next): string {
  if (!isCategoryTranslationKey(category)) {
    return category
  }
  return i18n.t(category, { ns: 'category' })
}

// util
export function translateOperand(
  operand: FilterOperand,
  i18n: I18Next,
): string {
  if (!isOperandTranslationKey(operand.id)) {
    return operand.id
  }
  return i18n.t(operand.id, { ns: 'filter/operand' })
}

type ManufactureTranslationKey = keyof typeof jaManufactures
const manufactureTranslationKeys = new Set<ManufactureTranslationKey>(
  Object.keys(jaManufactures) as ManufactureTranslationKey[],
)
function isManufactureTranslationKey(
  value: string,
): value is ManufactureTranslationKey {
  return manufactureTranslationKeys.has(value as ManufactureTranslationKey)
}

type CategoryTranslationKey = keyof typeof jaCategory
const categoryTranslationKeys = new Set<CategoryTranslationKey>(
  Object.keys(jaCategory) as CategoryTranslationKey[],
)
function isCategoryTranslationKey(
  value: string,
): value is CategoryTranslationKey {
  return categoryTranslationKeys.has(value as CategoryTranslationKey)
}

type FilterOperandTranslationKey = keyof typeof jaFilterOperand
const operandTranslationKeys = new Set<FilterOperandTranslationKey>(
  Object.keys(jaFilterOperand) as FilterOperandTranslationKey[],
)
function isOperandTranslationKey(
  value: string,
): value is FilterOperandTranslationKey {
  return operandTranslationKeys.has(value as FilterOperandTranslationKey)
}

type FilterAssemlyTranslationKey = keyof typeof jaAssembly
const assemblyTranslationKey = new Set<FilterAssemlyTranslationKey>(
  Object.keys(jaAssembly) as FilterAssemlyTranslationKey[],
)
function isAssemblyTranslationKey(
  value: string,
): value is FilterAssemlyTranslationKey {
  return assemblyTranslationKey.has(value as FilterAssemlyTranslationKey)
}

function toCamelCase(value: string): string {
  return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
}
