import type { I18Next } from '$lib/i18n/define'
import { jaFilterOperand } from '$lib/i18n/locales/ja/filter/operand'

import { getNumericAttributes } from '@ac6_assemble_tool/parts/attributes-utils'
import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'

import {
  defineExtractor,
  type Filter,
  type FilterOperand,
} from './filters-core'

export const PROPERTY_FILTER_KEYS = ['price', 'weight', 'en_load'] as const
// PropertyFilterKey is now string to support dynamic attributes
// PROPERTY_FILTER_KEYS remains for backward compatibility checking
export type PropertyFilterKey = string

export interface ArrayFilterOptions {
  /**
   * 表示名（ラベル）を直接指定する／翻訳キーとして使用する。
   * - 使用する場面: 属性名とは異なるラベルを表示したい場合、あるいは i18n リソース上の別キーを使いたい場合。
   * - 使用しない場面: 属性キーそのものを翻訳した結果をラベルにしたい場合（未指定で translateProperty の結果が利用される）。
   * - translateValue と併用する場合: ラベルと値の翻訳戦略を個別に制御したいケース（例: ラベルは固定文言にし、値はIDから名称へ変換）。
   */
  readonly displayName?: string
  /**
   * 属性値を UI 表示用に変換するための翻訳関数。
   * - 使用する場面: 製造企業やカテゴリなど、候補値に対して個別の翻訳や整形が必要な場合。
   * - 使用しない場面: 値をそのまま表示すれば十分な場合（未指定で元の値が使用される）。
   * - displayName と併用する場合: ラベルと値の翻訳キーが異なる、またはラベルは固定表示にしたいが値のみ翻訳したい場合。
   */
  readonly translateValue?: (value: string, i18n: I18Next) => string
}

const PROPERTY_FILTER_KEY_SET: ReadonlySet<PropertyFilterKey> = new Set(
  PROPERTY_FILTER_KEYS,
)

export function isPropertyFilterKey(value: string): value is PropertyFilterKey {
  return PROPERTY_FILTER_KEY_SET.has(value as PropertyFilterKey)
}

export function getNumericFilterKeys(
  slot: CandidatesKey,
): readonly PropertyFilterKey[] {
  return getNumericAttributes(slot)
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

export function buildArrayFilter(
  property: PropertyFilterKey,
  operand: FilterOperand<'array'>,
  value: readonly string[],
  displayNameOrOptions?: string | ArrayFilterOptions,
): Filter {
  const options = resolveArrayFilterOptions(displayNameOrOptions)

  return {
    operand,
    property,
    extractor: defineExtractor(property),
    value,
    stringify(i18n: I18Next) {
      const label = translateArrayFilterLabel(property, options, i18n)
      const translatedValues = value.map((item) =>
        translateArrayFilterValue(item, i18n, options),
      )
      return `${label}: ${translatedValues.join(', ')}`
    },
    serialize() {
      return `${this.operand.dataType}:${this.property}:${this.operand.id}:${value.join(',')}`
    },
  }
}

export function translateProperty(
  property: PropertyFilterKey,
  i18n: I18Next,
): string {
  const direct = translateAssemblyKey(property, i18n)
  if (direct !== null) {
    return direct
  }

  const camelCaseKey = toCamelCase(property)
  if (camelCaseKey !== property) {
    const camelTranslated = translateAssemblyKey(camelCaseKey, i18n)
    if (camelTranslated !== null) {
      return camelTranslated
    }

    return camelCaseKey
  }

  return property
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

export function resolveSelectionValueTranslator(
  property: PropertyFilterKey,
): ArrayFilterOptions['translateValue'] | undefined {
  return (value: string, i18n: I18Next) => i18n.t(`${property}:${value}`) ?? value
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

type FilterOperandTranslationKey = keyof typeof jaFilterOperand
const operandTranslationKeys = new Set<FilterOperandTranslationKey>(
  Object.keys(jaFilterOperand) as FilterOperandTranslationKey[],
)
function isOperandTranslationKey(
  value: string,
): value is FilterOperandTranslationKey {
  return operandTranslationKeys.has(value as FilterOperandTranslationKey)
}

function toCamelCase(value: string): string {
  return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
}

function resolveArrayFilterOptions(
  displayNameOrOptions?: string | ArrayFilterOptions,
): ArrayFilterOptions {
  if (typeof displayNameOrOptions === 'string') {
    return { displayName: displayNameOrOptions }
  }
  return displayNameOrOptions ?? {}
}

function translateArrayFilterLabel(
  property: PropertyFilterKey,
  options: ArrayFilterOptions,
  i18n: I18Next,
): string {
  if (!options.displayName) {
    return translateProperty(property, i18n)
  }

  const translated = i18n.t(options.displayName, {
    defaultValue: options.displayName,
  })

  if (translated === options.displayName) {
    if (options.displayName === property) {
      return translateProperty(property, i18n)
    }

    return options.displayName
  }

  return translated
}

function translateArrayFilterValue(
  value: string,
  i18n: I18Next,
  options: ArrayFilterOptions,
): string {
  if (!options.translateValue) {
    return value
  }

  return options.translateValue(value, i18n)
}

function translateAssemblyKey(key: string, i18n: I18Next): string | null {
  const namespacedKey = `assembly:${key}`
  const translated = i18n.t(namespacedKey)
  if (translated === namespacedKey || translated === key) {
    return null
  }

  return translated
}
