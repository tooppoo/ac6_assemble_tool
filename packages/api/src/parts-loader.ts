import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.09.1'

import type { SlotType } from './types'

/**
 * SlotType から Classification への変換マッピング
 */
const SLOT_TO_CLASSIFICATION: Record<SlotType, string> = {
  head: 'head',
  arms: 'arms',
  core: 'core',
  legs: 'legs',
  booster: 'booster',
  fcs: 'fcs',
  generator: 'generator',
  'arm-unit': 'arm-unit',
  'back-unit': 'back-unit',
  expansion: 'expansion',
}

/**
 * 全パーツデータをロードする
 * @returns 全パーツの配列
 */
function loadAllParts(): ACParts[] {
  return [
    ...candidates.head,
    ...candidates.arms,
    ...candidates.core,
    ...candidates.legs,
    ...candidates.booster,
    ...candidates.fcs,
    ...candidates.generator,
    ...candidates.rightArmUnit,
    ...candidates.leftArmUnit,
    ...candidates.rightBackUnit,
    ...candidates.leftBackUnit,
    ...candidates.expansion,
  ]
}

/**
 * パーツをスロットでフィルタリングする
 * @param parts パーツ配列
 * @param slot スロット指定（オプショナル）
 * @returns フィルタリングされたパーツ配列
 */
export function filterBySlot(
  parts: ACParts[],
  slot: SlotType | undefined,
): ACParts[] {
  if (!slot) {
    return parts
  }

  const classification = SLOT_TO_CLASSIFICATION[slot]
  return parts.filter((p) => p.classification === classification)
}

/**
 * パーツデータをロードする
 * @param slot スロット指定（オプショナル）
 * @returns ロードされたパーツ配列
 */
export function loadParts(slot?: SlotType): ACParts[] {
  const allParts = loadAllParts()
  return filterBySlot(allParts, slot)
}

/**
 * AI推論用のデータ構造
 */
export interface AIPartData {
  id: string
  name: string
  summary: string
  tags: readonly string[]
}

/**
 * パーツからAI推論用のデータを抽出する
 * @param parts パーツ配列
 * @returns AI推論用データ配列
 */
export function extractAIData(parts: ACParts[]): AIPartData[] {
  return parts.map((p) => ({
    id: p.id,
    name: p.name,
    summary: p.ai_summary,
    tags: p.ai_tags,
  }))
}
