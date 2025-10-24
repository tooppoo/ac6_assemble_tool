import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { render, screen } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'

import PartsGrid from './PartsGrid.svelte'

describe('PartsGrid', () => {
  const mockParts: ACParts[] = [
    {
      id: 'TEST-001',
      name: 'テストパーツ1',
      classification: 'テスト分類',
      manufacture: 'テストメーカー',
      category: 'テストカテゴリ',
      price: 100000,
      weight: 5000,
      en_load: 300,
    },
    {
      id: 'TEST-002',
      name: 'テストパーツ2',
      classification: 'テスト分類',
      manufacture: 'テストメーカー',
      category: 'テストカテゴリ',
      price: 200000,
      weight: 6000,
      en_load: 400,
    },
  ]

  describe('基本レンダリング', () => {
    it('パーツが表示されること', () => {
      render(PartsGrid, {
        props: {
          parts: mockParts,
          slot: 'rightArmUnit',
          favorites: new Set(),
        },
      })

      expect(screen.getByText('テストパーツ1')).toBeTruthy()
      expect(screen.getByText('テストパーツ2')).toBeTruthy()
    })

    it('パーツ件数が表示されること', () => {
      render(PartsGrid, {
        props: {
          parts: mockParts,
          slot: 'rightArmUnit',
          favorites: new Set(),
        },
      })

      expect(screen.getByText('全 2 件のパーツを表示中')).toBeTruthy()
    })

    it('グリッドレイアウトが適用されること', () => {
      const { container } = render(PartsGrid, {
        props: {
          parts: mockParts,
          slot: 'rightArmUnit',
          favorites: new Set(),
        },
      })

      const grid = container.querySelector('.row.g-3')
      expect(grid).toBeTruthy()
    })
  })

  describe('0件時の表示', () => {
    it('パーツが0件の場合EmptyStateが表示されること', () => {
      render(PartsGrid, {
        props: {
          parts: [],
          slot: 'rightArmUnit',
          favorites: new Set(),
        },
      })

      expect(
        screen.getByText('フィルタ条件に一致するパーツが見つかりませんでした'),
      ).toBeTruthy()
    })

    it('パーツが0件の場合パーツ件数は表示されないこと', () => {
      render(PartsGrid, {
        props: {
          parts: [],
          slot: 'rightArmUnit',
          favorites: new Set(),
        },
      })

      expect(screen.queryByText(/件のパーツを表示中/)).toBeNull()
    })
  })

  describe('お気に入り機能', () => {
    it('お気に入りパーツが正しくマークされること', () => {
      const favorites = new Set(['TEST-001'])

      render(PartsGrid, {
        props: {
          parts: mockParts,
          slot: 'rightArmUnit',
          favorites,
        },
      })

      const favoriteButtons = screen.getAllByRole('button', {
        name: /お気に入り/,
      })
      expect(favoriteButtons).toHaveLength(2)
    })

    it('お気に入りトグルイベントが発火すること', async () => {
      const handleToggle = vi.fn()

      render(PartsGrid, {
        props: {
          parts: mockParts,
          slot: 'rightArmUnit',
          favorites: new Set(),
          ontogglefavorite: handleToggle,
        },
      })

      const buttons = screen.getAllByRole('button', { name: /お気に入り/ })
      await buttons[0].click()

      expect(handleToggle).toHaveBeenCalledWith('TEST-001')
    })
  })
})
