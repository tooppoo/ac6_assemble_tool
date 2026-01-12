import { syncLanguageFromQuery } from '$lib/store/language/language-store.svelte'

import type { IndexEffect } from '../controller/index-effects'

export function applyI18nEffect(effect: IndexEffect): boolean {
  if (effect.type === 'syncLanguageFromQuery') {
    syncLanguageFromQuery(effect.url)
    return true
  }

  return false
}
