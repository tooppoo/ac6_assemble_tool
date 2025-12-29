// Mock $app modules - must be defined before imports
vi.mock('$app/navigation', () => ({
  pushState: vi.fn(),
}))

vi.mock('$app/state', () => ({
  page: { url: new URL('http://localhost/') },
}))

// Mock i18next
vi.mock('i18next', () => ({
  default: {
    changeLanguage: vi.fn(),
  },
}))

import _i18next from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  changeLanguage,
  getCurrentLanguage,
  initializeLanguageFromQuery,
  syncLanguageFromQuery,
} from './language-store.svelte'

import { pushState } from '$app/navigation'
import { page } from '$app/state'

const mockPushState = pushState as ReturnType<typeof vi.fn>
const mockPage = page as { url: URL }
const mockI18nextChangeLanguage = _i18next.changeLanguage as ReturnType<
  typeof vi.fn
>

describe('language-store', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    // Reset page.url to default
    mockPage.url = new URL('http://localhost/')
  })

  describe('getCurrentLanguage', () => {
    it('初期状態ではデフォルト言語(ja)を返すこと', () => {
      // 初期化前の状態をテスト
      const language = getCurrentLanguage()
      expect(language).toBe('ja')
    })

    it('initializeLanguageFromQueryで設定した言語を返すこと', () => {
      const url = new URL('http://localhost/?lng=en')
      initializeLanguageFromQuery(url)

      const language = getCurrentLanguage()
      expect(language).toBe('en')
    })
  })

  describe('initializeLanguageFromQuery', () => {
    it('URLクエリパラメータから言語設定を初期化すること', () => {
      const url = new URL('http://localhost/?lng=en')

      initializeLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('en')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('en')
    })

    it('lngパラメータがない場合はデフォルト言語(ja)を使用すること', () => {
      const url = new URL('http://localhost/')

      initializeLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('ja')
    })

    it('lngパラメータが空文字の場合はデフォルト言語(ja)を使用すること', () => {
      const url = new URL('http://localhost/?lng=')

      initializeLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('ja')
    })
  })

  describe('changeLanguage', () => {
    beforeEach(() => {
      // changeLanguageの前にinitializeする
      const url = new URL('http://localhost/?lng=ja')
      initializeLanguageFromQuery(url)
      mockPage.url = url
      vi.clearAllMocks()
    })

    it('言語設定を変更すること', () => {
      changeLanguage('en')

      expect(getCurrentLanguage()).toBe('en')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('en')
    })

    it('URLクエリパラメータに言語を反映すること', () => {
      changeLanguage('en')

      expect(mockPushState).toHaveBeenCalledTimes(1)
      const [url] = mockPushState.mock.calls[0]
      expect(url.searchParams.get('lng')).toBe('en')
    })

    it('既存のクエリパラメータを保持すること', () => {
      mockPage.url = new URL('http://localhost/?lng=ja&foo=bar')

      changeLanguage('en')

      const [url] = mockPushState.mock.calls[0]
      expect(url.searchParams.get('lng')).toBe('en')
      expect(url.searchParams.get('foo')).toBe('bar')
    })

    it('同じ言語に変更しても問題なく動作すること', () => {
      changeLanguage('ja')

      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('ja')
      expect(mockPushState).toHaveBeenCalledTimes(1)
    })
  })

  describe('syncLanguageFromQuery', () => {
    beforeEach(() => {
      // 初期状態を設定
      const url = new URL('http://localhost/?lng=ja')
      initializeLanguageFromQuery(url)
      vi.clearAllMocks()
    })

    it('URLの言語設定と現在の言語が異なる場合に同期すること', () => {
      const url = new URL('http://localhost/?lng=en')

      syncLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('en')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('en')
    })

    it('URLの言語設定と現在の言語が同じ場合は何もしないこと', () => {
      const url = new URL('http://localhost/?lng=ja')

      syncLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).not.toHaveBeenCalled()
    })

    it('lngパラメータがない場合はデフォルト言語(ja)に同期すること', () => {
      // 現在の言語をenに変更
      changeLanguage('en')
      vi.clearAllMocks()

      const url = new URL('http://localhost/')

      syncLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('ja')
    })

    it('lngパラメータが空文字の場合はデフォルト言語(ja)に同期すること', () => {
      // 現在の言語をenに変更
      changeLanguage('en')
      vi.clearAllMocks()

      const url = new URL('http://localhost/?lng=')

      syncLanguageFromQuery(url)

      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('ja')
    })
  })

  describe('統合シナリオ', () => {
    it('初期化→変更→同期のフロー全体が正しく動作すること', () => {
      // 1. アプリケーション起動時の初期化
      const initialUrl = new URL('http://localhost/?lng=ja')
      initializeLanguageFromQuery(initialUrl)
      expect(getCurrentLanguage()).toBe('ja')

      // 2. ユーザーが言語を変更
      mockPage.url = initialUrl
      vi.clearAllMocks()
      changeLanguage('en')
      expect(getCurrentLanguage()).toBe('en')
      expect(mockPushState).toHaveBeenCalledTimes(1)

      // 3. ブラウザバックで戻る（popstate）
      vi.clearAllMocks()
      const backUrl = new URL('http://localhost/?lng=ja')
      syncLanguageFromQuery(backUrl)
      expect(getCurrentLanguage()).toBe('ja')
      expect(mockI18nextChangeLanguage).toHaveBeenCalledWith('ja')
    })
  })
})
