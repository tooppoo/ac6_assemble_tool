/**
 * FilterPanel コンポーネントのテスト
 */

import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'

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

      expect(
        screen.getByRole('heading', { name: /フィルタ.*0.*件/i }),
      ).toBeInTheDocument()
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
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
        { type: 'property', property: 'price', operator: 'lte', value: 100000 },
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
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      expect(
        screen.getByRole('button', { name: /クリア/i }),
      ).toBeInTheDocument()
    })

    it('クリアボタンをクリックすると、onclearfiltersコールバックが呼ばれること', async () => {
      const filters: Filter[] = [
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
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
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
        { type: 'property', property: 'price', operator: 'gte', value: 50000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      // 値が表示されていることを確認（これらは一意）
      expect(screen.getByText('5000')).toBeInTheDocument()
      expect(screen.getByText('50000')).toBeInTheDocument()

      // フィルタ一覧にweightとpriceが含まれていることを確認（複数マッチするためgetAllByTextを使用）
      const weightTexts = screen.getAllByText(/重量/i)
      expect(weightTexts.length).toBeGreaterThanOrEqual(1)

      const priceTexts = screen.getAllByText(/価格/i)
      expect(priceTexts.length).toBeGreaterThanOrEqual(1)
    })

    it('演算子が正しく表示されること', () => {
      const filters: Filter[] = [
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
        { type: 'property', property: 'price', operator: 'gte', value: 50000 },
        { type: 'property', property: 'en_load', operator: 'eq', value: 1000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      // 演算子が表示されていることを確認（複数マッチする可能性があるためgetAllByTextを使用）
      const lteOperators = screen.getAllByText(/≤/)
      expect(lteOperators.length).toBeGreaterThanOrEqual(1)

      const gteOperators = screen.getAllByText(/≥/)
      expect(gteOperators.length).toBeGreaterThanOrEqual(1)

      const eqOperators = screen.getAllByText(/=/)
      expect(eqOperators.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('無効化されたフィルタの表示', () => {
    it('無効化されたフィルタが警告として表示されること', () => {
      const filters: Filter[] = [
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
      ]
      const invalidatedFilters: Filter[] = [
        { type: 'property', property: 'some_invalid_prop', operator: 'gte', value: 100 },
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
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
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

  describe('フィルタ追加UI', () => {
    it('フィルタ追加フォームが表示されること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
        },
      })

      // プロパティ選択
      expect(screen.getByLabelText(/属性/i)).toBeInTheDocument()
      // 演算子選択
      expect(screen.getByLabelText(/条件/i)).toBeInTheDocument()
      // 値入力
      expect(screen.getByLabelText(/値/i)).toBeInTheDocument()
      // 追加ボタン
      expect(screen.getByRole('button', { name: /追加/i })).toBeInTheDocument()
    })

    it('フィルタ追加時にonfilterchangeコールバックが呼ばれること', async () => {
      let updatedFilters: Filter[] = []

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
          onfilterchange: (filters: Filter[]) => {
            updatedFilters = filters
          },
        },
      })

      // プロパティを選択
      const propertySelect = screen.getByLabelText(/属性/i)
      await fireEvent.change(propertySelect, { target: { value: 'weight' } })

      // 演算子を選択
      const operatorSelect = screen.getByLabelText(/条件/i)
      await fireEvent.change(operatorSelect, { target: { value: 'lte' } })

      // 値を入力
      const valueInput = screen.getByLabelText(/値/i)
      await fireEvent.input(valueInput, { target: { value: '5000' } })

      // 追加ボタンをクリック
      const addButton = screen.getByRole('button', { name: /追加/i })
      await fireEvent.click(addButton)

      // コールバックが呼ばれ、正しいフィルタが追加されることを確認
      expect(updatedFilters).toHaveLength(1)
      expect(updatedFilters[0]).toEqual({
        type: 'property',
        property: 'weight',
        operator: 'lte',
        value: 5000,
      })
    })

    it('値が入力されていない場合、追加ボタンが無効化されること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
        },
      })

      const addButton = screen.getByRole('button', { name: /追加/i })
      expect(addButton).toBeDisabled()
    })

    it('数値プロパティの場合、値が数値に変換されること', async () => {
      let updatedFilters: Filter[] = []

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
          onfilterchange: (filters: Filter[]) => {
            updatedFilters = filters
          },
        },
      })

      // 数値プロパティ（weight）を選択
      const propertySelect = screen.getByLabelText(/属性/i)
      await fireEvent.change(propertySelect, { target: { value: 'weight' } })

      const operatorSelect = screen.getByLabelText(/条件/i)
      await fireEvent.change(operatorSelect, { target: { value: 'lte' } })

      const valueInput = screen.getByLabelText(/値/i)
      await fireEvent.input(valueInput, { target: { value: '5000' } })

      const addButton = screen.getByRole('button', { name: /追加/i })
      await fireEvent.click(addButton)

      // 値が数値型として保存されることを確認
      expect(updatedFilters[0]).toHaveProperty('type', 'property')
      if (updatedFilters[0].type === 'property') {
        expect(updatedFilters[0].value).toBe(5000)
        expect(typeof updatedFilters[0].value).toBe('number')
      }
    })
  })

  describe('個別フィルタの削除', () => {
    it('各フィルタに削除ボタンが表示されること', () => {
      const filters: Filter[] = [
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
        { type: 'property', property: 'price', operator: 'gte', value: 50000 },
      ]

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
        },
      })

      // 削除ボタンが2つ表示されることを確認
      const deleteButtons = screen.getAllByRole('button', { name: /削除/i })
      expect(deleteButtons.length).toBe(2)
    })

    it('削除ボタンをクリックすると、該当フィルタが削除されること', async () => {
      const filters: Filter[] = [
        { type: 'property', property: 'weight', operator: 'lte', value: 5000 },
        { type: 'property', property: 'price', operator: 'gte', value: 50000 },
      ]

      let updatedFilters: Filter[] = filters

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters,
          onfilterchange: (filters: Filter[]) => {
            updatedFilters = filters
          },
        },
      })

      // 最初の削除ボタンをクリック
      const deleteButtons = screen.getAllByRole('button', { name: /削除/i })
      await fireEvent.click(deleteButtons[0])

      // 1つ目のフィルタが削除され、2つ目のフィルタのみ残ることを確認
      expect(updatedFilters).toHaveLength(1)
      expect(updatedFilters[0]).toEqual({
        type: 'property',
        property: 'price',
        operator: 'gte',
        value: 50000,
      })
    })
  })

  describe('お気に入りフィルタトグル', () => {
    it('お気に入りフィルタトグルボタンが表示されること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
        },
      })

      // お気に入りボタンが表示されることを確認
      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      expect(favoriteButton).toBeInTheDocument()
    })

    it('デフォルトではお気に入りフィルタがオフであること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
          showFavoritesOnly: false,
        },
      })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      // ☆（白星）が表示されることを確認
      expect(favoriteButton.textContent).toContain('☆')
    })

    it('お気に入りフィルタがオンの場合、ボタンがハイライト表示されること', () => {
      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
          showFavoritesOnly: true,
        },
      })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      // ★（黒星）が表示されることを確認
      expect(favoriteButton.textContent).toContain('★')
      // btn-warningクラスが適用されることを確認
      expect(favoriteButton.classList.contains('btn-warning')).toBe(true)
    })

    it('お気に入りフィルタボタンをクリックすると、ontogglefavoritesコールバックが呼ばれること', async () => {
      let callbackFired = false

      render(FilterPanel, {
        props: {
          slot: 'rightArmUnit',
          filters: [],
          ontogglefavorites: () => {
            callbackFired = true
          },
        },
      })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      await fireEvent.click(favoriteButton)

      expect(callbackFired).toBe(true)
    })
  })
})
