/**
 * PartsListViewコンポーネントのテスト
 *
 * TDD RED Phase:
 * - 状態管理のテスト
 * - URLパラメータとの同期テスト
 * - LocalStorageとの同期テスト
 * - フィルタ済みパーツリストの計算テスト
 */

import { latest as regulation } from '$lib/regulation'

import { render, screen } from '@testing-library/svelte'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import PartsListView from './PartsListView.svelte'
import PartsListViewTestWrapper from './PartsListView.test-wrapper.svelte'

describe('PartsListView コンポーネント', () => {
  // LocalStorageをクリア
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('初期状態', () => {
    it('regulationデータを受け取り、レンダリングできること', () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // コンポーネントがレンダリングされることを確認（パーツ件数が表示されている）
      expect(screen.getByText(/件のパーツを表示中/i)).toBeInTheDocument()
    })

    it('デフォルトでrightArmUnitスロットが選択されていること', () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // デフォルトでrightArmUnitスロットが選択されていることを確認
      const rightArmButton = screen.getByText(/RIGHT ARM UNIT|右腕武器/i)
      expect(rightArmButton.classList.contains('btn-primary')).toBe(true)
    })

    it('デフォルトでgrid表示モードが選択されていること', () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // $effectが実行されてLocalStorageに保存される
      const viewMode = localStorage.getItem('ac6-parts-list-view-mode')
      expect(viewMode).toBe('grid')
    })
  })

  describe('スロット選択', () => {
    it('SlotSelectorコンポーネントが表示されること', () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // SlotSelectorが表示され、すべてのスロットボタンが存在することを確認
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(12)
    })

    it('スロット選択時に表示が更新されること', async () => {
      const { getByText } = render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // 初期状態（rightArmUnit）が選択されていることを確認
      const rightArmButton = getByText(/RIGHT ARM UNIT|右腕武器/i)
      expect(rightArmButton.classList.contains('btn-primary')).toBe(true)

      // headスロットをクリック
      const headButton = getByText(/^HEAD$|^頭部$/)
      await headButton.click()

      // headボタンが選択状態になることを確認
      expect(headButton.classList.contains('btn-primary')).toBe(true)
      // rightArmボタンは選択状態でなくなることを確認
      expect(rightArmButton.classList.contains('btn-outline-secondary')).toBe(
        true,
      )
    })
  })

  describe('URL パラメータとの同期', () => {
    it('URLパラメータから初期スロットを復元すること', () => {
      // URLSearchParams をモック
      const searchParams = new URLSearchParams('slot=legs')

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
          initialSearchParams: searchParams,
        },
      })

      // legsスロットが選択されていることを確認
      // 実際のテストは実装後に追加
    })

    it('スロット変更時にURLパラメータが更新されること', () => {
      // URLSearchParams の更新をテスト
      // 実際のテストは実装後に追加
    })
  })

  describe('LocalStorage との同期', () => {
    it('LocalStorageから表示モードを復元すること', () => {
      // 事前にLocalStorageに保存
      localStorage.setItem('ac6-parts-list-view-mode', 'list')

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // list表示モードが復元されることを確認
      // 実際のテストは実装後に追加
    })

    it.skip('表示モード変更時にLocalStorageが更新されること', () => {
      // TODO: Task 6（パーツ一覧表示とお気に入り機能）で実装予定
      // viewMode変更UIが実装されたら、このテストを有効化する
      const { component } = render(PartsListView, {
        props: {
          regulation,
        },
      })

      // 表示モード変更イベントをシミュレート
      if (component.handleViewModeChange) {
        component.handleViewModeChange('list')
      }

      // LocalStorageが更新されることを確認
      const saved = localStorage.getItem('ac6-parts-list-view-mode')
      expect(saved).toBe('list')
    })
  })

  describe('スロット切替時の条件引き継ぎ', () => {
    it('スロット切替時にフィルタ条件が保持されること（共通属性の場合）', async () => {
      // URLパラメータでフィルタ条件を設定
      const searchParams = new URLSearchParams(
        'slot=rightArmUnit&filter=weight:lte:5000&filter=price:lte:100000',
      )

      const { getByText } = render(PartsListViewTestWrapper, {
        props: {
          regulation,
          initialSearchParams: searchParams,
        },
      })

      // 初期状態（rightArmUnit）が選択されていることを確認
      const rightArmButton = getByText(/RIGHT ARM UNIT|右腕武器/i)
      expect(rightArmButton.classList.contains('btn-primary')).toBe(true)

      // headスロットに切り替え
      const headButton = getByText(/^HEAD$|^頭部$/)
      await headButton.click()

      // headボタンが選択状態になることを確認
      expect(headButton.classList.contains('btn-primary')).toBe(true)

      // フィルタ条件が引き継がれる（weight, priceは全スロット共通）
      // 実際のフィルタ適用結果の確認はTask 4.2で実装
    })

    it('スロット切替時に無効化された条件が記録されること', async () => {
      // 将来の拡張性のため、無効化された条件を記録する仕組みをテスト
      // 現時点では全属性が共通なので、無効化される条件は存在しない
      const { getByText } = render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // rightArmUnitからheadに切り替え
      const headButton = getByText(/^HEAD$|^頭部$/)
      await headButton.click()

      // 無効化された条件が空であることを確認
      // 実装後に確認ロジックを追加
    })

    it('スロット切替時にパーツリストが再計算されること', async () => {
      const { getByText } = render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // 初期状態のパーツ数を確認
      const initialPartsCount = regulation.candidates.rightArmUnit.length
      expect(getByText(/全 \d+ 件のパーツを表示中/)).toHaveTextContent(
        `全 ${initialPartsCount} 件のパーツを表示中`,
      )

      // headスロットに切り替え
      const headButton = getByText(/^HEAD$|^頭部$/)
      await headButton.click()

      // パーツ数が更新されることを確認
      const newPartsCount = regulation.candidates.head.length
      expect(getByText(/全 \d+ 件のパーツを表示中/)).toHaveTextContent(
        `全 ${newPartsCount} 件のパーツを表示中`,
      )
    })
  })

  describe('フィルタ済みパーツリストの計算', () => {
    it('選択中のスロットに対応するパーツのみを表示すること', () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // デフォルト（head）のパーツが表示されることを確認
      // 実際のテストは実装後に追加
    })

    it('フィルタ条件が適用されたパーツが表示されること', () => {
      // フィルタ条件を設定してパーツがフィルタリングされることを確認
      // 実際のテストは実装後に追加
    })

    it('並び替え設定が適用されたパーツが表示されること', () => {
      // 並び替え設定を適用してパーツが並び替えられることを確認
      // 実際のテストは実装後に追加
    })
  })

  describe('お気に入りフィルタ機能', () => {
    it('お気に入りフィルタトグルボタンが表示されること', () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      // お気に入りボタンが表示されることを確認
      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      expect(favoriteButton).toBeInTheDocument()
    })

    it('お気に入りフィルタトグルをクリックすると、表示が切り替わること', async () => {
      const { getByRole } = render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const favoriteButton = getByRole('button', {
        name: /お気に入りのみ表示/i,
      })

      // 初期状態では☆が表示されている
      expect(favoriteButton.textContent).toContain('☆')

      // クリック
      await favoriteButton.click()

      // ★に変わることを確認
      expect(favoriteButton.textContent).toContain('★')
    })
  })
})
