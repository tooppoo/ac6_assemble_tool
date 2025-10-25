import { render, screen } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'

import EmptyState from './EmptyState.svelte'

describe('EmptyState', () => {
  describe('基本レンダリング', () => {
    it('デフォルトメッセージが表示されること', () => {
      render(EmptyState)

      expect(
        screen.getByText('フィルタ条件に一致するパーツが見つかりませんでした'),
      ).toBeTruthy()
      expect(
        screen.getByText(
          /フィルタ条件を変更するか、別のスロットを選択してみてください/,
        ),
      ).toBeTruthy()
    })

    it('カスタムメッセージが表示されること', () => {
      render(EmptyState, {
        props: {
          message: 'カスタムメッセージ',
          suggestion: 'カスタム提案',
        },
      })

      expect(screen.getByText('カスタムメッセージ')).toBeTruthy()
      expect(screen.getByText('カスタム提案')).toBeTruthy()
    })

    it('ヒントが表示されること', () => {
      render(EmptyState)

      // ヒント部分のテキストを確認（複数要素があるのでgetAllByTextを使用）
      const hints = screen.getAllByText(/フィルタ条件を緩和してみてください/)
      expect(hints.length).toBeGreaterThan(0)

      expect(
        screen.getByText('• フィルタ条件を緩和してみてください'),
      ).toBeTruthy()
      expect(
        screen.getByText('• 別のスロットを選択してみてください'),
      ).toBeTruthy()
      expect(
        screen.getByText('• フィルタをクリアして最初からやり直してください'),
      ).toBeTruthy()
    })
  })
})
