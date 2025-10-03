/**
 * 機体構成デシリアライザー統合モジュール
 *
 * v1/v2形式を自動判定し、適切にデシリアライズします。
 */
import type { RawAssembly } from '#core/assembly/assembly'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { convertV1ToV2 } from './convert-v1-to-v2'
import { detectUrlVersion } from './detect-version'
import { searchToAssemblyV2 } from './as-query-v2'

/**
 * URLクエリパラメータから機体構成を復元（v1/v2自動判定）
 *
 * @param params - URLSearchParams（v1形式またはv2形式）
 * @param candidates - パーツ候補リスト
 * @returns 復元された機体構成
 *
 * @example
 * ```typescript
 * // v2形式
 * const paramsV2 = new URLSearchParams('v=2&h=HD001&c=CR001')
 * const assembly = deserializeAssembly(paramsV2, candidates)
 *
 * // v1形式（自動的にv2に変換される）
 * const paramsV1 = new URLSearchParams('h=0&c=1')
 * const assembly = deserializeAssembly(paramsV1, candidates)
 * ```
 */
export function deserializeAssembly(
  params: URLSearchParams,
  candidates: Candidates,
): RawAssembly {
  const version = detectUrlVersion(params)

  if (version === 'v1') {
    // v1形式の場合、v2形式に変換してからデシリアライズ
    const v2Params = convertV1ToV2(params, candidates)
    return searchToAssemblyV2(v2Params, candidates)
  }

  if (version === 'v2') {
    // v2形式の場合、そのままデシリアライズ
    return searchToAssemblyV2(params, candidates)
  }

  // unknown形式の場合もv2形式として処理を試みる
  return searchToAssemblyV2(params, candidates)
}
