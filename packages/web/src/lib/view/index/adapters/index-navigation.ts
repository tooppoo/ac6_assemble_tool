import { pushState } from '$app/navigation'
import { storeAssemblyAsQuery } from '$lib/store/query/query-store'

import type { IndexEffect } from '../controller/index-effects'

export function applyNavigationEffect(effect: IndexEffect): boolean {
  if (effect.type === 'serializeAssembly') {
    storeAssemblyAsQuery(effect.assembly)
    return true
  }
  if (effect.type === 'pushState') {
    pushState(effect.url, {})
    return true
  }

  return false
}
