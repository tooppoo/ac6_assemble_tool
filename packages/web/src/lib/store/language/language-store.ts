import _i18next from 'i18next'

import { pushState } from '$app/navigation'
import { page } from '$app/state'

const LANGUAGE_QUERY_KEY = 'lng'
const DEFAULT_LANGUAGE = 'ja'

// 現在の言語設定を保持する $state
// LanguageForm で bind:value を使うため、$state が必要
// リアクティビティの循環は、URL更新時に untrack を使って回避する
let currentLanguage = $state(DEFAULT_LANGUAGE)

/**
 * 現在の言語設定を取得する
 */
export function getCurrentLanguage(): string {
  return currentLanguage
}

/**
 * URLクエリパラメータから言語設定を初期化する
 *
 * アプリケーション起動時（afterNavigate type='enter'）に呼び出す
 *
 * @param url - 現在のURL
 */
export function initializeLanguageFromQuery(url: URL): void {
  const lng = url.searchParams.get(LANGUAGE_QUERY_KEY) || DEFAULT_LANGUAGE

  currentLanguage = lng
  _i18next.changeLanguage(lng)
}

/**
 * 言語設定を変更し、URLクエリパラメータに反映する
 *
 * LanguageFormなどのUIコンポーネントから呼び出す
 *
 * @param lng - 新しい言語コード（'ja' | 'en'）
 */
export function changeLanguage(lng: string): void {
  currentLanguage = lng
  _i18next.changeLanguage(lng)

  // URLクエリパラメータに反映
  const url = new URL(page.url)
  url.searchParams.set(LANGUAGE_QUERY_KEY, lng)
  pushState(url, {})
}

/**
 * URLクエリパラメータから言語設定を同期する
 *
 * ブラウザバック/フォワード（popstate）時に呼び出す
 *
 * @param url - 現在のURL
 */
export function syncLanguageFromQuery(url: URL): void {
  const lng = url.searchParams.get(LANGUAGE_QUERY_KEY) || DEFAULT_LANGUAGE

  if (lng !== currentLanguage) {
    currentLanguage = lng
    _i18next.changeLanguage(lng)
  }
}
