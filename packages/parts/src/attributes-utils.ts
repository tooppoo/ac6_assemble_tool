import {
  armAttributes,
  armUnitAttributes,
  backUnitAttributes,
  boosterAttributes,
  coreAttributes,
  expansionAttributes,
  fcsAttributes,
  generatorAttributes,
  headAttributes,
  legAttributes,
} from './attributes'
import type { CandidatesKey } from './types/candidates'

/**
 * 属性定義
 */
export interface AttributeDefinition {
  readonly attributeName: string
  readonly valueType: 'numeric' | 'array' | 'literal'
  readonly candidates: readonly string[]
  readonly optional: boolean
}

/**
 * スロットタイプと属性定義のマッピング
 */
const SLOT_ATTRIBUTE_MAP: Record<
  CandidatesKey,
  readonly AttributeDefinition[]
> = {
  rightArmUnit: armUnitAttributes,
  leftArmUnit: armUnitAttributes,
  rightBackUnit: backUnitAttributes,
  leftBackUnit: backUnitAttributes,
  head: headAttributes,
  core: coreAttributes,
  arms: armAttributes,
  legs: legAttributes,
  booster: boosterAttributes,
  fcs: fcsAttributes,
  generator: generatorAttributes,
  expansion: expansionAttributes,
}

/**
 * フォールバック属性（共通属性のみ）
 */
const FALLBACK_ATTRIBUTES: readonly AttributeDefinition[] = [
  {
    attributeName: 'price',
    valueType: 'numeric',
    candidates: [],
    optional: false,
  },
  {
    attributeName: 'weight',
    valueType: 'numeric',
    candidates: [],
    optional: false,
  },
  {
    attributeName: 'en_load',
    valueType: 'numeric',
    candidates: [],
    optional: false,
  },
]

/**
 * 指定スロットの全属性定義を取得
 * - literal 型属性は除外される
 * - attributes.ts の定義順を維持
 *
 * @param slot - 対象スロット（例: 'rightArmUnit', 'head'）
 * @returns 属性定義の配列（attributes.ts の定義順）
 */
export function getAttributesForSlot(
  slot: CandidatesKey,
): readonly AttributeDefinition[] {
  const attributes = SLOT_ATTRIBUTE_MAP[slot]

  if (!attributes) {
    return FALLBACK_ATTRIBUTES
  }

  // literal 型属性を除外
  return attributes.filter((attr) => attr.valueType !== 'literal')
}

/**
 * 指定スロットの数値型属性名を取得
 * - valueType が 'numeric' の属性のみ
 * - literal 型属性は除外される
 *
 * @param slot - 対象スロット
 * @returns 数値型属性名の配列
 */
export function getNumericAttributes(slot: CandidatesKey): readonly string[] {
  const attributes = getAttributesForSlot(slot)

  return attributes
    .filter((attr) => attr.valueType === 'numeric')
    .map((attr) => attr.attributeName)
}

/**
 * 指定スロットの配列型属性名を取得
 * - valueType が 'array' の属性のみ
 * - literal 型属性は除外される
 *
 * @param slot - 対象スロット
 * @returns 配列型属性名の配列
 */
export function getArrayAttributes(slot: CandidatesKey): readonly string[] {
  const attributes = getAttributesForSlot(slot)

  return attributes
    .filter((attr) => attr.valueType === 'array')
    .map((attr) => attr.attributeName)
}

/**
 * 指定属性がオプショナルかチェック
 *
 * @param slot - 対象スロット
 * @param attributeName - 属性名
 * @returns オプショナルの場合 true、属性が存在しない場合は false
 */
export function isAttributeOptional(
  slot: CandidatesKey,
  attributeName: string,
): boolean {
  const attributes = getAttributesForSlot(slot)
  const attr = attributes.find((a) => a.attributeName === attributeName)

  return attr?.optional ?? false
}

/**
 * 指定属性の候補値を取得
 * - 配列型属性の場合、candidates フィールドを返す
 * - 数値型属性の場合、空配列を返す
 * - 属性が存在しない場合、空配列を返す
 *
 * @param slot - 対象スロット
 * @param attributeName - 属性名
 * @returns 候補値の配列
 */
export function getCandidatesForAttribute(
  slot: CandidatesKey,
  attributeName: string,
): readonly string[] {
  const attributes = getAttributesForSlot(slot)
  const attr = attributes.find((a) => a.attributeName === attributeName)

  return attr?.candidates ?? []
}
