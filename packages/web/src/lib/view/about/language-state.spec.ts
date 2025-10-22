import { describe, expect, it } from 'vitest'

import { createLanguageSyncState, withLanguage } from './language-state'

describe(withLanguage.name, () => {
  it('クエリにlngが存在しないときに日本語を選択すると空文字列を返す', () => {
    expect(withLanguage('', 'ja')).toBe('')
  })

  it('日本語を選択するとlngパラメータを除去する', () => {
    expect(withLanguage('?lng=en&sort=asc', 'ja')).toBe('?sort=asc')
  })

  it('英語を選択するとlngパラメータを上書きする', () => {
    expect(withLanguage('?lng=ja&sort=asc', 'en')).toBe('?lng=en&sort=asc')
  })

  it('既存クエリを維持しつつlngパラメータを追加する', () => {
    expect(withLanguage('?sort=asc', 'en')).toBe('?sort=asc&lng=en')
  })

  it('先頭に?がない場合でも正しく処理する', () => {
    expect(withLanguage('sort=asc', 'en')).toBe('?sort=asc&lng=en')
  })
})

describe(createLanguageSyncState.name, () => {
  it('日本語がアクティブな状態でクエリ情報を同期する', () => {
    const state = createLanguageSyncState('?page=2', 'ja')

    expect(state).toEqual({
      currentSearch: '?page=2',
      jaQuery: '?page=2',
      enQuery: '?page=2&lng=en',
      homeHref: '/?page=2',
      languageSwitcher: [
        {
          label: '日本語',
          href: '/about/ja?page=2',
          active: true,
        },
        {
          label: 'English',
          href: '/about/en?page=2&lng=en',
          active: false,
        },
      ],
    })
  })

  it('英語がアクティブな状態でlngパラメータを保持する', () => {
    const state = createLanguageSyncState('?lng=en&page=2', 'en')

    expect(state).toEqual({
      currentSearch: '?lng=en&page=2',
      jaQuery: '?page=2',
      enQuery: '?lng=en&page=2',
      homeHref: '/?lng=en&page=2',
      languageSwitcher: [
        {
          label: '日本語',
          href: '/about/ja?page=2',
          active: false,
        },
        {
          label: 'English',
          href: '/about/en?lng=en&page=2',
          active: true,
        },
      ],
    })
  })
})
