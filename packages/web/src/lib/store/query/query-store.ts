import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'

import { mergeAssemblyParams } from './query-merge'

import { pushState } from '$app/navigation'
import { page } from '$app/state'

export function storeAssemblyAsQuery(assembly: Assembly): void {
  const appQuery = assemblyToSearchV2(assembly)

  const q = new URLSearchParams(page.url.searchParams)
  mergeAssemblyParams(q, new URLSearchParams(appQuery))

  pushState(`${page.url.pathname}?${q.toString()}`, {})
}
