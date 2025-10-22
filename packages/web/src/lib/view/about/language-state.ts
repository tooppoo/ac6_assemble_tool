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

export function createLanguageSyncState(
  search: string,
  activeLanguage: SupportedLanguage,
): LanguageSyncState {
  const normalizedSearch = search
  const jaQuery = withLanguage(normalizedSearch, 'ja')
  const enQuery = withLanguage(normalizedSearch, 'en')
  const activeQuery = activeLanguage === 'ja' ? jaQuery : enQuery
  const languageSwitcher: readonly LanguageLink[] = [
    { label: '日本語', href: `/about/ja${jaQuery}`, active: activeLanguage === 'ja' },
    { label: 'English', href: `/about/en${enQuery}`, active: activeLanguage === 'en' },
  ]

  return {
    currentSearch: normalizedSearch,
    jaQuery,
    enQuery,
    homeHref: activeQuery ? `/${activeQuery}` : '/',
    languageSwitcher,
  }
}
