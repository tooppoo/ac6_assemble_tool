import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

import { buildAssemblyFromQuery, mergeAssemblyParams } from './assembly-from-query'
import { derivePartsPool, type PartsPoolRestrictions } from './derive-parts-pool'

/**
 * ページ初期化処理の結果型
 */
export interface PageBootstrapResult {
  /** 初期化されたアセンブリ */
  assembly: Assembly
  /** 適用されたパーツプール制約 */
  partsPool: PartsPoolRestrictions
  /** マイグレーション後のURL（変更がない場合は undefined） */
  migratedUrl?: URL
}

/**
 * Index ページの初期化処理を実行する。
 *
 * URLクエリからパーツプール制約を導出し、アセンブリを構築する。
 * 必要に応じてクエリパラメータをマイグレーションする。
 *
 * @param search - URLSearchParams の文字列表現（例: "?lng=ja&r_arm=..."）
 * @param currentUrl - 現在のURL（マイグレーション時の基底URL）
 * @param basePartsPool - ベースとなるパーツプール候補
 * @returns 初期化結果（アセンブリ、パーツプール、マイグレーション後URL）
 */
export function bootstrap(
  currentUrl: URL,
  basePartsPool: Candidates,
): PageBootstrapResult {
  const search = currentUrl.search
  // 1. パーツプール制約の導出
  const derivedPool = derivePartsPool(search, basePartsPool)

  // 2. アセンブリの構築（マイグレーション含む）
  const params = new URLSearchParams(search)
  const { assembly, migratedParams } = buildAssemblyFromQuery(
    params,
    derivedPool.candidates,
  )

  // 3. マイグレーション後URLの構築（変更がある場合のみ）
  const migratedUrl = (() => {
    if (migratedParams) {
      const url = new URL(currentUrl)
      mergeAssemblyParams(url.searchParams, migratedParams)
      return url
    }
    else {
      return undefined
    }
  })()

  return {
    assembly,
    partsPool: derivedPool,
    migratedUrl,
  }
}
