import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { render, screen } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'

import PartsCard from './PartsCard.svelte'

describe('PartsCard', () => {
  const mockParts: ACParts = {
    id: 'TEST-001',
    name: 'テストパーツ',
    classification: 'テスト分類',
    manufacture: 'テストメーカー',
    category: 'テストカテゴリ',
    price: 100000,
    weight: 5000,
    en_load: 300,
  }

  describe('基本レンダリング', () => {
    it('パーツ情報が正しく表示されること', () => {
      render(PartsCard, { props: { parts: mockParts } })

      expect(screen.getByText('テストパーツ')).toBeTruthy()
      expect(screen.getByText('テスト分類')).toBeTruthy()
      expect(screen.getByText('テストメーカー')).toBeTruthy()
      expect(screen.getByText('テストカテゴリ')).toBeTruthy()
      expect(screen.getByText('100,000')).toBeTruthy()
      expect(screen.getByText('5,000')).toBeTruthy()
      expect(screen.getByText('300')).toBeTruthy()
    })

    it('お気に入りボタンが表示されること', () => {
      render(PartsCard, { props: { parts: mockParts } })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入り/,
      })
      expect(favoriteButton).toBeTruthy()
    })
  })

  describe('お気に入り状態', () => {
    it('お気に入りでない場合は☆が表示されること', () => {
      render(PartsCard, { props: { parts: mockParts, isFavorite: false } })

      const button = screen.getByRole('button', {
        name: 'お気に入りに追加',
      })
      expect(button.textContent?.trim()).toBe('☆')
    })

    it('お気に入りの場合は★が表示されること', () => {
      render(PartsCard, { props: { parts: mockParts, isFavorite: true } })

      const button = screen.getByRole('button', {
        name: 'お気に入りから削除',
      })
      expect(button.textContent?.trim()).toBe('★')
    })
  })

  describe('イベント', () => {
    it('お気に入りボタンをクリックするとイベントが発火すること', async () => {
      const handleToggle = vi.fn()
      render(PartsCard, {
        props: {
          parts: mockParts,
          ontogglefavorite: handleToggle,
        },
      })

      const button = screen.getByRole('button', { name: /お気に入り/ })
      await button.click()

      expect(handleToggle).toHaveBeenCalledOnce()
    })
  })
})
