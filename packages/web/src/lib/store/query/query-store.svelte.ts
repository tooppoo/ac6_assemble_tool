import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
import { SvelteURLSearchParams } from 'svelte/reactivity'

import { mergeAssemblyParams } from './query-merge'

import { browser } from '$app/environment'
import { pushState } from '$app/navigation'
import { page } from '$app/state'

let query: string = $state('')
export function getQuery(): string {
  return query
}

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
  // SSR時はpage.urlにアクセスできないため、空のパラメータを使用
  const mergedParams = browser
    ? new SvelteURLSearchParams(page.url.searchParams)
    : new SvelteURLSearchParams()
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
  query = q.toString()
}
