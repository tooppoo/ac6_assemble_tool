import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'

import PartsCardTestWrapper from './PartsCard.test-wrapper.svelte'

describe('PartsCard', () => {
  const mockParts: ACParts = {
    id: 'TEST-001',
    name: 'テストパーツ',
    classification: 'head',
    manufacture: 'baws',
    category: 'head',
    price: 100000,
    weight: 5000,
    en_load: 300,
    ai_summary: 'これはテスト用のパーツです。',
    ai_tags: ['テスト', 'パーツ'],
  }

  describe('基本レンダリング', () => {
    it('パーツ情報が正しく表示されること', () => {
      render(PartsCardTestWrapper, { props: { parts: mockParts } })

      expect(screen.getByText('テストパーツ')).toBeTruthy()
      // 実際のi18nを使用しているので、翻訳された値を検証
      expect(screen.getByText('BAWS')).toBeTruthy() // manufacture: 'baws' -> 'BAWS'
      expect(screen.getByText('頭部')).toBeTruthy() // category: 'head' -> '頭部'
      expect(screen.getByText('100,000')).toBeTruthy()
      expect(screen.getByText('5,000')).toBeTruthy()
      expect(screen.getByText('300')).toBeTruthy()
    })

    it('お気に入りボタンが表示されること', () => {
      render(PartsCardTestWrapper, { props: { parts: mockParts } })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入り/,
      })
      expect(favoriteButton).toBeTruthy()
    })
  })

  describe('お気に入り状態', () => {
    it('お気に入りでない場合は☆が表示されること', () => {
      render(PartsCardTestWrapper, {
        props: { parts: mockParts, isFavorite: false },
      })

      const button = screen.getByRole('button', {
        name: 'お気に入りに追加',
      })
      expect(button.textContent?.trim()).toBe('☆')
    })

    it('お気に入りの場合は★が表示されること', () => {
      render(PartsCardTestWrapper, {
        props: { parts: mockParts, isFavorite: true },
      })

      const button = screen.getByRole('button', {
        name: 'お気に入りから削除',
      })
      expect(button.textContent?.trim()).toBe('★')
    })
  })

  describe('イベント', () => {
    it('お気に入りボタンをクリックするとイベントが発火すること', async () => {
      const handleToggle = vi.fn()
      render(PartsCardTestWrapper, {
        props: {
          parts: mockParts,
          ontogglefavorite: handleToggle,
        },
      })

      const button = screen.getByRole('button', { name: /お気に入り/ })
      await button.click()

      expect(handleToggle).toHaveBeenCalledOnce()
    })

    it('カードクリックでonselectが発火すること', async () => {
      const handleSelect = vi.fn()

      render(PartsCardTestWrapper, {
        props: {
          parts: mockParts,
          onselect: handleSelect,
        },
      })

      await fireEvent.click(
        screen.getByRole('button', { name: /テストパーツ/ }),
      )

      expect(handleSelect).toHaveBeenCalledOnce()
    })

    it('お気に入りボタンではonselectが発火しないこと', async () => {
      const handleSelect = vi.fn()
      const handleToggle = vi.fn()

      render(PartsCardTestWrapper, {
        props: {
          parts: mockParts,
          onselect: handleSelect,
          ontogglefavorite: handleToggle,
        },
      })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入り/,
      })

      await fireEvent.click(favoriteButton)

      expect(handleToggle).toHaveBeenCalledOnce()
      expect(handleSelect).not.toHaveBeenCalled()
    })
  })
})
