import { describe, expect, it } from 'vitest'

import { withLanguage } from './language-state'

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
