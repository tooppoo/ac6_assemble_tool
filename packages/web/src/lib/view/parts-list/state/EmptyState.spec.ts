import i18n from '$lib/i18n/define'

import { render, screen } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'

import EmptyState from './EmptyState.svelte'

describe('EmptyState', () => {
  describe('基本レンダリング', () => {
    it('デフォルトメッセージが表示されること', () => {
      render(EmptyState, {
        context: new Map([['i18n', i18n]]),
      })

      expect(
        screen.getByText('フィルタ条件に一致するパーツが見つかりませんでした'),
      ).toBeTruthy()
    })

    it('カスタムメッセージが表示されること', () => {
      render(EmptyState, {
        props: {
          message: 'カスタムメッセージ',
        },
        context: new Map([['i18n', i18n]]),
      })

      expect(screen.getByText('カスタムメッセージ')).toBeTruthy()
    })

    it('ヒントが表示されること', () => {
      render(EmptyState, {
        context: new Map([['i18n', i18n]]),
      })

      // ヒント部分のテキストを確認（複数要素があるのでgetAllByTextを使用）
      const hints = screen.getAllByText(/フィルタ条件を緩和してみてください/)
      expect(hints.length).toBeGreaterThan(0)

      expect(
        screen.getByText('• フィルタ条件を緩和してみてください'),
      ).toBeTruthy()
      expect(
        screen.getByText('• フィルタをクリアして最初からやり直してください'),
      ).toBeTruthy()
    })
  })
})
