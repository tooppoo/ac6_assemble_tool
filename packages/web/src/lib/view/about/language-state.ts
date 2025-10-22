import { SvelteURLSearchParams } from 'svelte/reactivity'

export type SupportedLanguage = 'ja' | 'en'

export type LanguageLink = {
  readonly label: string
  readonly href: string
  readonly active: boolean
}

export type LanguageSyncState = {
  readonly currentSearch: string
  readonly jaQuery: string
  readonly enQuery: string
  readonly homeHref: string
  readonly languageSwitcher: readonly LanguageLink[]
}

export function withLanguage(search: string, language: SupportedLanguage): string {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const params = new SvelteURLSearchParams(raw)

  if (language === 'ja') {
    params.delete('lng')
  } else {
    params.set('lng', language)
  }

  const query = params.toString()

  return query ? `?${query}` : ''
}
