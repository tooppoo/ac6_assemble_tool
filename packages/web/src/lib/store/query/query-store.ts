import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'

import { mergeAssemblyParams } from './query-merge'

import { pushState } from '$app/navigation'
import { page } from '$app/state'

/**
 * アセンブリから完全なクエリパラメータを生成する
 *
 * アセンブリのパラメータと現在のURL（言語設定など）をマージして返す
 *
 * @param assembly - アセンブリデータ
 * @returns マージされたURLSearchParams
 */
export function buildQueryFromAssembly(assembly: Assembly): URLSearchParams {
  const assemblyParams = assemblyToSearchV2(assembly)
  const mergedParams = new URLSearchParams(page.url.searchParams)
  mergeAssemblyParams(mergedParams, assemblyParams)

  return mergedParams
}

/**
 * アセンブリをURLクエリパラメータに保存する
 *
 * @param assembly - アセンブリデータ
 */
export function storeAssemblyAsQuery(assembly: Assembly): void {
  const q = buildQueryFromAssembly(assembly)
  pushState(`${page.url.pathname}?${q.toString()}`, {})
}
