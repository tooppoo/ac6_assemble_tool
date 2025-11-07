import { type I18Next } from '$lib/i18n/define'

import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

/**
 * Filterのコアロジック
 * アプリケーションを構築するための基盤を構築する
 */

// filter
// property is now string to support dynamic attributes
export type Filter = Readonly<
  | {
      operand: FilterOperand<'numeric'>
      property: string
      extractor: Extractor
      value: number
      stringify(i18n: I18Next): string
      serialize(): string
    }
  | {
      operand: FilterOperand<'string'>
      property: string
      extractor: Extractor
      value: string
      stringify(i18n: I18Next): string
      serialize(): string
    }
  | {
      operand: FilterOperand<'array'>
      property: string
      extractor: Extractor
      value: readonly unknown[]
      stringify(i18n: I18Next): string
      serialize(): string
    }
>

export function applyFilters(
  parts: readonly ACParts[],
  filters: readonly Filter[],
): ACParts[] {
  return parts.filter((part) => {
    for (const filter of filters) {
      const propertyValue = filter.extractor.extract(part)
      if (!filter.operand.apply(propertyValue, filter.value)) {
        // 1つでもフィルタを通過しなければ除外
        return false
      }
    }
    return true
  })
}

// operand
//// numeric
export function numericOperands(): [
  FilterOperand<'numeric'>,
  ...FilterOperand<'numeric'>[],
] {
  return [
    numericOperand('lte', (left, right) => left <= right),
    numericOperand('gte', (left, right) => left >= right),
    numericOperand('lt', (left, right) => left < right),
    numericOperand('gt', (left, right) => left > right),
    numericOperand('ne', (left, right) => left !== right),
    numericOperand('eq', (left, right) => left === right),
  ]
}
function numericOperand(
  key: string,
  expression: (left: number, right: number) => boolean,
): FilterOperand<'numeric'> {
  return new InnerFilterOperand(key, 'numeric', (left, right) => {
    if (!isNumeric(left) || !isNumeric(right)) {
      return false
    }
    return expression(left, right)
  })
}
function isNumeric(value: unknown): value is number {
  return typeof value === 'number'
}

//// string
export function stringOperands(): [
  FilterOperand<'string'>,
  ...FilterOperand<'string'>[],
] {
  return [
    stringOperand('contain', (left, right) => left.includes(right)),
    stringOperand('not_contain', (left, right) => !left.includes(right)),
    stringOperand('exact', (left, right) => left === right),
  ]
}
function stringOperand(
  key: string,
  expression: (left: string, right: string) => boolean,
): FilterOperand<'string'> {
  return new InnerFilterOperand(key, 'string', (left, right) => {
    if (!isString(left) || !isString(right)) {
      return false
    }
    return expression(left, right)
  })
}
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

//// array
export function selectAnyOperand(): FilterOperand<'array'> {
  return arrayOperand('in_any', (left, right) => right.includes(left))
}
function arrayOperand(
  key: string,
  expression: (left: unknown, right: readonly unknown[]) => boolean,
): FilterOperand<'array'> {
  return new InnerFilterOperand(key, 'array', (left, right) => {
    if (!Array.isArray(right)) {
      return false
    }
    return expression(left, right)
  })
}

type FilterOperandDataType = 'numeric' | 'string' | 'array'
// 外部には型だけ公開
export type FilterOperand<
  D extends FilterOperandDataType = FilterOperandDataType,
> = Omit<InnerFilterOperand<D>, 'expression'>

class InnerFilterOperand<D extends FilterOperandDataType> {
  constructor(
    /** オペランドの識別子 */
    public readonly id: string,
    /** オペランドが扱うデータ型 */
    public readonly dataType: D,
    /** オペランドの適用関数 */
    private readonly expression: (left: unknown, right: unknown) => boolean,
  ) {}

  /** オペランドを適用する */
  public apply(left: unknown, right: unknown): boolean {
    return this.expression(left, right)
  }

  public toString(): string {
    return `FilterOperand(${this.id}, ${this.expression.toString()})`
  }
}

// extractor
// propertyKey is now string to support dynamic attributes
export function defineExtractor(propertyKey: string): Extractor {
  return new Extractor(propertyKey)
}
class Extractor {
  constructor(
    /** 抽出対象のプロパティキー */
    public readonly propertyKey: string,
  ) {}

  extract(parts: ACParts): unknown {
    // Use index access with runtime key
    return (parts as Record<string, unknown>)[this.propertyKey]
  }
}

// list utilities
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
