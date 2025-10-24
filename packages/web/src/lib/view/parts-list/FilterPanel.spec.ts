/**
 * FilterPanel コンポーネントのテスト
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import FilterPanel from './FilterPanel.svelte'
import type { Filter } from './filters'

describe('FilterPanel', () => {
  describe('基本レンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
        },
      })

      expect(screen.getByRole('heading', { name: /フィルタ.*0.*件/i })).toBeInTheDocument()
    })

    it('フィルタが空の場合、フィルタ数0を表示すること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
        },
      })

      expect(screen.getByText(/0.*件/i)).toBeInTheDocument()
    })

    it('フィルタが設定されている場合、フィルタ数を表示すること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
        { property: 'price', operator: 'lte', value: 100000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      expect(screen.getByText(/2.*件/i)).toBeInTheDocument()
    })
  })

  describe('フィルタクリア機能', () => {
    it('クリアボタンが表示されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      expect(screen.getByRole('button', { name: /クリア/i })).toBeInTheDocument()
    })

    it('クリアボタンをクリックすると、onclearfiltersコールバックが呼ばれること', async () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
      ]

      let callbackFired = false

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
          onclearfilters: () => {
            callbackFired = true
          },
        },
      })

      const clearButton = screen.getByRole('button', { name: /クリア/i })
      await fireEvent.click(clearButton)

      expect(callbackFired).toBe(true)
    })

    it('フィルタが空の場合、クリアボタンが無効化されること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
        },
      })

      const clearButton = screen.getByRole('button', { name: /クリア/i })
      expect(clearButton).toBeDisabled()
    })
  })

  describe('フィルタ条件の表示', () => {
    it('設定されたフィルタ条件が表示されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
        { property: 'price', operator: 'gte', value: 50000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      // フィルタアイテム内で検証
      const filterItems = screen.getAllByRole('generic', { name: '' }).filter(
        el => el.className.includes('filter-item')
      )

      // weight フィルタを検証
      expect(screen.getByText(/weight/i)).toBeInTheDocument()
      // price フィルタを検証
      expect(screen.getByText(/price/i)).toBeInTheDocument()
      // 両方のフィルタが表示されている
      expect(filterItems).toHaveLength(2)
    })

    it('演算子が正しく表示されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
        { property: 'price', operator: 'gte', value: 50000 },
        { property: 'en_load', operator: 'eq', value: 1000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      expect(screen.getByText(/≤/)).toBeInTheDocument()
      expect(screen.getByText(/≥/)).toBeInTheDocument()
      expect(screen.getByText(/=/)).toBeInTheDocument()
    })
  })

  describe('無効化されたフィルタの表示', () => {
    it('無効化されたフィルタが警告として表示されること', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
      ]
      const invalidatedFilters: Filter[] = [
        { property: 'some_invalid_prop', operator: 'gte', value: 100 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
          invalidatedFilters,
        },
      })

      expect(screen.getByText(/無効/i)).toBeInTheDocument()
      expect(screen.getByText(/some_invalid_prop/i)).toBeInTheDocument()
    })

    it('無効化されたフィルタがない場合、警告が表示されないこと', () => {
      const filters: Filter[] = [
        { property: 'weight', operator: 'lte', value: 5000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
          invalidatedFilters: [],
        },
      })

      expect(screen.queryByText(/無効/i)).not.toBeInTheDocument()
    })
  })
})
