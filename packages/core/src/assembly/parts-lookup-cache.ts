/**
 * パーツ検索用Mapキャッシュ
 *
 * Candidatesから生成したMapをメモ化し、パフォーマンスを向上させます。
 */
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { createPartIdMap } from './parts-lookup'

/**
 * Candidates配列から生成したMapのキャッシュ
 */
type CandidatesMaps = {
  readonly [K in keyof Candidates]: ReadonlyMap<string, Candidates[K][number]>
}

const mapsCache = new WeakMap<Candidates, CandidatesMaps>()

/**
 * Candidatesから各部位のMapを生成し、メモ化する
 *
 * 同じCandidatesオブジェクトに対しては、一度生成したMapを再利用します。
 *
 * @param candidates - パーツ候補リスト
 * @returns 各部位のID→パーツのMap
 *
 * @example
 * ```typescript
 * const maps = getCandidatesMaps(candidates)
 * const head = maps.head.get('HD001')
 * ```
 */
export function getCandidatesMaps(candidates: Candidates): CandidatesMaps {
  const cached = mapsCache.get(candidates)
  if (cached) {
    return cached
  }

  const maps: CandidatesMaps = {
    rightArmUnit: createPartIdMap(candidates.rightArmUnit),
    leftArmUnit: createPartIdMap(candidates.leftArmUnit),
    rightBackUnit: createPartIdMap(candidates.rightBackUnit),
    leftBackUnit: createPartIdMap(candidates.leftBackUnit),
    head: createPartIdMap(candidates.head),
    core: createPartIdMap(candidates.core),
    arms: createPartIdMap(candidates.arms),
    legs: createPartIdMap(candidates.legs),
    booster: createPartIdMap(candidates.booster),
    fcs: createPartIdMap(candidates.fcs),
    generator: createPartIdMap(candidates.generator),
    expansion: createPartIdMap(candidates.expansion),
  }

  mapsCache.set(candidates, maps)
  return maps
}
