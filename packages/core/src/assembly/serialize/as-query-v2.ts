/**
 * v2形式URLシリアライザー
 *
 * 機体構成をIDベースのURLクエリパラメータに変換します。
 * v2形式は`v=2`パラメータを含み、各パーツをIDで指定します。
 */
import type { Assembly, RawAssembly } from '#core/assembly/assembly'
import {
  createPartIdMap,
  findPartByIdFromMap,
} from '#core/assembly/parts-lookup'
import { logger } from '#core/utils/logger'

import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

/**
 * 機体構成をv2形式URLクエリパラメータに変換
 *
 * @param assembly - 機体構成
 * @returns v2形式URLSearchParams（例: v=2&h=HD001&c=CR002...）
 *
 * @example
 * ```typescript
 * const assembly = createAssembly({ ... })
 * const params = assemblyToSearchV2(assembly)
 * console.log(params.toString())
 * // => "v=2&h=HD001&c=CR001&..."
 * ```
 */
export function assemblyToSearchV2(assembly: Assembly): URLSearchParams {
  const query: AssemblyQueryV2 = {
    v: '2',
    rau: assembly.rightArmUnit.id,
    lau: assembly.leftArmUnit.id,
    rbu: assembly.rightBackUnit.id,
    lbu: assembly.leftBackUnit.id,

    h: assembly.head.id,
    c: assembly.core.id,
    a: assembly.arms.id,
    l: assembly.legs.id,

    b: assembly.booster.id,
    f: assembly.fcs.id,
    g: assembly.generator.id,

    e: assembly.expansion.id,
  }

  return Object.entries(query).reduce((search, [key, value]) => {
    search.set(key, value)
    return search
  }, new URLSearchParams())
}

/**
 * v2形式URLクエリパラメータから機体構成を復元
 *
 * @param params - v2形式URLSearchParams（v=2を含む）
 * @param candidates - パーツ候補リスト
 * @returns 復元された機体構成
 *
 * @example
 * ```typescript
 * const params = new URLSearchParams('v=2&h=HD001&c=CR001&...')
 * const assembly = searchToAssemblyV2(params, candidates)
 * ```
 */
export function searchToAssemblyV2(
  params: URLSearchParams,
  candidates: Candidates,
): RawAssembly {
  // パフォーマンス向上のため、各候補配列からID→パーツのMapを作成
  const rightArmUnitMap = createPartIdMap(candidates.rightArmUnit)
  const leftArmUnitMap = createPartIdMap(candidates.leftArmUnit)
  const rightBackUnitMap = createPartIdMap(candidates.rightBackUnit)
  const leftBackUnitMap = createPartIdMap(candidates.leftBackUnit)
  const headMap = createPartIdMap(candidates.head)
  const coreMap = createPartIdMap(candidates.core)
  const armsMap = createPartIdMap(candidates.arms)
  const legsMap = createPartIdMap(candidates.legs)
  const boosterMap = createPartIdMap(candidates.booster)
  const fcsMap = createPartIdMap(candidates.fcs)
  const generatorMap = createPartIdMap(candidates.generator)
  const expansionMap = createPartIdMap(candidates.expansion)

  const findWithFallback = <T extends { id: string; name: string }>(
    map: ReadonlyMap<string, T>,
    fallback: T,
    id: string | null,
  ): T => {
    if (!id) return fallback
    const found = findPartByIdFromMap(map, id)
    if (!found) {
      logger.warn('Part ID not found, using fallback', {
        requestedId: id,
        fallbackId: fallback.id,
        fallbackName: fallback.name,
      })
      return fallback
    }
    return found
  }

  const legs = findWithFallback(legsMap, candidates.legs[0], params.get('l'))

  // タンク脚部の場合、ブースターは常にNotEquippedでなければならない
  const booster =
    legs.category === tank
      ? boosterNotEquipped
      : findWithFallback(boosterMap, candidates.booster[0], params.get('b'))

  return {
    rightArmUnit: findWithFallback(
      rightArmUnitMap,
      candidates.rightArmUnit[0],
      params.get('rau'),
    ),
    leftArmUnit: findWithFallback(
      leftArmUnitMap,
      candidates.leftArmUnit[0],
      params.get('lau'),
    ),
    rightBackUnit: findWithFallback(
      rightBackUnitMap,
      candidates.rightBackUnit[0],
      params.get('rbu'),
    ),
    leftBackUnit: findWithFallback(
      leftBackUnitMap,
      candidates.leftBackUnit[0],
      params.get('lbu'),
    ),

    head: findWithFallback(headMap, candidates.head[0], params.get('h')),
    core: findWithFallback(coreMap, candidates.core[0], params.get('c')),
    arms: findWithFallback(armsMap, candidates.arms[0], params.get('a')),
    legs,

    booster,
    fcs: findWithFallback(fcsMap, candidates.fcs[0], params.get('f')),
    generator: findWithFallback(
      generatorMap,
      candidates.generator[0],
      params.get('g'),
    ),

    expansion: findWithFallback(
      expansionMap,
      candidates.expansion[0],
      params.get('e'),
    ),
  } as RawAssembly
}

/**
 * v2形式クエリパラメータ型
 */
type AssemblyQueryV2 = Readonly<
  Record<
    /** VERSION */
    | 'v'
    /** RIGHT ARM UNIT */
    | 'rau'
    /** LEFT ARM UNIT */
    | 'lau'
    /** RIGHT BACK UNIT */
    | 'rbu'
    /** LEFT BACK UNIT */
    | 'lbu'

    /** HEAD */
    | 'h'
    /** CORE */
    | 'c'
    /** ARMS */
    | 'a'
    /** LEGS */
    | 'l'

    /** BOOSTER */
    | 'b'
    /** FCS */
    | 'f'
    /** GENERATOR */
    | 'g'

    /** EXPANSION */
    | 'e',
    string
  >
>
