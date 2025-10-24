import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { render, screen } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'

import PartsCardTestWrapper from './PartsCard.test-wrapper.svelte'

describe('PartsCard', () => {
  const mockParts: ACParts = {
    id: 'TEST-001',
    name: 'テストパーツ',
    classification: 'head',
    manufacture: 'BAWS',
    category: 'head',
    price: 100000,
    weight: 5000,
    en_load: 300,
  }

  describe('基本レンダリング', () => {
    it('パーツ情報が正しく表示されること', () => {
      render(PartsCardTestWrapper, { props: { parts: mockParts } })

      expect(screen.getByText('テストパーツ')).toBeTruthy()
      // i18nモックはキーをそのまま返すので、分類とカテゴリに"head"が表示される
      const headTexts = screen.getAllByText('head')
      expect(headTexts.length).toBe(2) // 分類とカテゴリの両方
      expect(screen.getByText('BAWS')).toBeTruthy()
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
  })
})
