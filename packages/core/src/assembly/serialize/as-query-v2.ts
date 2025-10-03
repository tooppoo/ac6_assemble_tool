/**
 * v2形式URLシリアライザー
 *
 * 機体構成をIDベースのURLクエリパラメータに変換します。
 * v2形式は`v=2`パラメータを含み、各パーツをIDで指定します。
 */
import type { Assembly, AssemblyKey, RawAssembly } from '#core/assembly/assembly'
import { findPartByIdOrFirst } from '#core/assembly/parts-lookup'
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
  return {
    rightArmUnit:
      findPartByIdOrFirst(candidates.rightArmUnit, params.get('rau') ?? undefined)!,
    leftArmUnit:
      findPartByIdOrFirst(candidates.leftArmUnit, params.get('lau') ?? undefined)!,
    rightBackUnit:
      findPartByIdOrFirst(candidates.rightBackUnit, params.get('rbu') ?? undefined)!,
    leftBackUnit:
      findPartByIdOrFirst(candidates.leftBackUnit, params.get('lbu') ?? undefined)!,

    head: findPartByIdOrFirst(candidates.head, params.get('h') ?? undefined)!,
    core: findPartByIdOrFirst(candidates.core, params.get('c') ?? undefined)!,
    arms: findPartByIdOrFirst(candidates.arms, params.get('a') ?? undefined)!,
    legs: findPartByIdOrFirst(candidates.legs, params.get('l') ?? undefined)!,

    booster: findPartByIdOrFirst(candidates.booster, params.get('b') ?? undefined)!,
    fcs: findPartByIdOrFirst(candidates.fcs, params.get('f') ?? undefined)!,
    generator:
      findPartByIdOrFirst(candidates.generator, params.get('g') ?? undefined)!,

    expansion:
      findPartByIdOrFirst(candidates.expansion, params.get('e') ?? undefined)!,
  }
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
