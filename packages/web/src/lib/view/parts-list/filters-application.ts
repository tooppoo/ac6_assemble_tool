import type { I18Next } from '$lib/i18n/define'

import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

import { defineExtractor, type Filter, type FilterOperand } from './filters-core'

/**
 * Filterのアプリケーションレイヤ
 * Filterのコアロジックを使って、アプリケーション用に特化した関数を構築する
 */

// property filter builder
export function buildPropertyFilter(
  property: keyof ACParts,
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
        value.toString()
      ].join(' ')
    },
    serialize() {
      return `${this.operand.dataType}:${property}:${this.operand.id}:${this.value}`
    },
  }
}
const propertyI18nMap = {
  id: 'id',
  name: 'name',
  manufacture: 'manufacture',
  category: 'category',
  classification: 'classification',
  price: 'price',
  weight: 'weight',
  en_load: 'enLoad',
} as const
export function translateProperty(property: keyof ACParts, i18n: I18Next): string {
  return i18n.t(propertyI18nMap[property], { ns: 'assembly' })
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
export function translateManufacturer(manufacturer: string, i18n: I18Next): string {
  return i18n.t(manufacturer, { ns: 'manufacture' })
}

// category
export function buildCategoryFilter(
  operand: FilterOperand<'array'>,
  value: readonly string[],
): Filter {
  return {
    operand,
    property: ('category' as keyof ACParts),
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
  return i18n.t(category, { ns: 'category' })
}

// util
export function translateOperand(operand: FilterOperand, i18n: I18Next): string {
  return i18n.t(operand.id, { ns: 'filter/operand' })
}
