/**
 * FilterPanel コンポーネントのテスト
 */

import i18n from '$lib/i18n/define'

import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'

import FilterPanel from './FilterPanel.svelte'
import { buildPropertyFilter } from './state/filter/filters-application'
import { numericOperands, type Filter } from './state/filter/filters-core'

type FilterPanelProps = {
  slot: CandidatesKey
  filters: Filter[]
  availableParts: readonly ACParts[]
  showFavoritesOnly?: boolean
  onclearfilters?: () => void
  onfilterchange?: (filters: Filter[]) => void
  ontogglefavorites?: () => void
}

const defaultAvailableParts: readonly ACParts[] = [
  {
    id: 'sample-part',
    name: 'Sample Part',
    classification: 'arm-unit',
    manufacture: 'balam',
    category: 'bazooka',
    price: 1000,
    weight: 500,
    en_load: 120,
  },
]

const numericOperandMap = new Map(
  numericOperands().map((operand) => [operand.id, operand]),
)

const getNumericOperand = (id: string) => {
  const operand = numericOperandMap.get(id)
  if (!operand) {
    throw new Error(`Unknown operand id: ${id}`)
  }
  return operand
}

const createPropertyFilter = (
  property: keyof ACParts,
  operandId: string,
  value: number,
): Filter => buildPropertyFilter(property, getNumericOperand(operandId), value)

const renderFilterPanel = (props?: Partial<FilterPanelProps>) => {
  const mergedProps: FilterPanelProps = {
    slot: props?.slot ?? 'rightArmUnit',
    filters: props?.filters ?? [],
    availableParts: props?.availableParts ?? defaultAvailableParts,
    showFavoritesOnly: props?.showFavoritesOnly ?? false,
    onclearfilters: props?.onclearfilters,
    onfilterchange: props?.onfilterchange,
    ontogglefavorites: props?.ontogglefavorites,
  }

  return render(FilterPanel, {
    props: mergedProps,
    context: new Map([['i18n', i18n]]),
  })
}

describe('FilterPanel', () => {
  describe('基本レンダリング', () => {
    it('コンポーネントが正しくレンダリングされること', () => {
      renderFilterPanel()

      expect(
        screen.getByRole('heading', { name: /フィルタ.*0.*件/i }),
      ).toBeInTheDocument()
    })

    it('フィルタが空の場合、フィルタ数0を表示すること', () => {
      renderFilterPanel()

      expect(screen.getByText(/0.*件/i)).toBeInTheDocument()
    })

    it('フィルタが設定されている場合、フィルタ数を表示すること', () => {
      const filters: Filter[] = [
        createPropertyFilter('weight', 'lte', 5000),
        createPropertyFilter('price', 'lte', 100000),
      ]

      renderFilterPanel({ filters })

      expect(screen.getByText(/2.*件/i)).toBeInTheDocument()
    })
  })

  describe('フィルタクリア機能', () => {
    it('クリアボタンが表示されること', () => {
      const filters: Filter[] = [createPropertyFilter('weight', 'lte', 5000)]

      renderFilterPanel({ filters })

      expect(
        screen.getByRole('button', { name: /クリア/i }),
      ).toBeInTheDocument()
    })

    it('クリアボタンをクリックすると、onclearfiltersコールバックが呼ばれること', async () => {
      const filters: Filter[] = [createPropertyFilter('weight', 'lte', 5000)]

      let callbackFired = false

      renderFilterPanel({
        filters,
        onclearfilters: () => {
          callbackFired = true
        },
      })

      const clearButton = screen.getByRole('button', { name: /クリア/i })
      await fireEvent.click(clearButton)

      expect(callbackFired).toBe(true)
    })

    it('フィルタが空の場合、クリアボタンが無効化されること', () => {
      renderFilterPanel()

      const clearButton = screen.getByRole('button', { name: /クリア/i })
      expect(clearButton).toBeDisabled()
    })
  })

  describe('フィルタ条件の表示', () => {
    it('設定されたフィルタ条件が表示されること', () => {
      const filters: Filter[] = [
        createPropertyFilter('weight', 'lte', 5000),
        createPropertyFilter('price', 'gte', 50000),
      ]

      renderFilterPanel({ filters })

      // フィルタ条件全体が表示されていることを確認
      expect(screen.getByText(/総重量: ≤ 5000/)).toBeInTheDocument()
      expect(screen.getByText(/価格: ≧ 50000/)).toBeInTheDocument()
    })

    it('演算子が正しく表示されること', () => {
      const filters: Filter[] = [
        createPropertyFilter('weight', 'lte', 5000),
        createPropertyFilter('price', 'gte', 50000),
        createPropertyFilter('en_load', 'eq', 1000),
      ]

      renderFilterPanel({ filters })

      // 演算子が表示されていることを確認（複数マッチする可能性があるためgetAllByTextを使用）
      const lteOperators = screen.getAllByText(/≤/)
      expect(lteOperators.length).toBeGreaterThanOrEqual(1)

      const gteOperators = screen.getAllByText(/≧/)
      expect(gteOperators.length).toBeGreaterThanOrEqual(1)

      const eqOperators = screen.getAllByText(/=/)
      expect(eqOperators.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('フィルタ一覧の状態表示', () => {
    it('フィルタが設定されていない場合はメッセージを表示すること', () => {
      renderFilterPanel({ filters: [] })

      expect(
        screen.getByText('フィルタが設定されていません'),
      ).toBeInTheDocument()
    })

    it('フィルタがある場合はメッセージを表示しないこと', () => {
      const filters: Filter[] = [createPropertyFilter('weight', 'lte', 5000)]

      renderFilterPanel({ filters })

      expect(
        screen.queryByText('フィルタが設定されていません'),
      ).not.toBeInTheDocument()
    })
  })

  describe('フィルタ追加UI', () => {
    it('フィルタ追加フォームが表示されること', () => {
      renderFilterPanel()

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

      renderFilterPanel({
        filters: [],
        onfilterchange: (filters: Filter[]) => {
          updatedFilters = filters
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
      expect(updatedFilters[0]?.property).toBe('weight')
      expect(updatedFilters[0]?.value).toBe(5000)
      expect(updatedFilters[0]?.operand.id).toBe('lte')
    })

    it('値が入力されていない場合、追加ボタンが無効化されること', () => {
      renderFilterPanel()

      const addButton = screen.getByRole('button', { name: /追加/i })
      expect(addButton).toBeDisabled()
    })

    it('数値プロパティの場合、値が数値に変換されること', async () => {
      let updatedFilters: Filter[] = []

      renderFilterPanel({
        filters: [],
        onfilterchange: (filters: Filter[]) => {
          updatedFilters = filters
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
      expect(updatedFilters[0]?.value).toBe(5000)
      expect(typeof updatedFilters[0]?.value).toBe('number')
    })
  })

  describe('個別フィルタの削除', () => {
    it('各フィルタに削除ボタンが表示されること', () => {
      const filters: Filter[] = [
        createPropertyFilter('weight', 'lte', 5000),
        createPropertyFilter('price', 'gte', 50000),
      ]

      renderFilterPanel({ filters })

      // 削除ボタンが2つ表示されることを確認
      const deleteButtons = screen.getAllByRole('button', { name: /削除/i })
      expect(deleteButtons.length).toBe(2)
    })

    it('削除ボタンをクリックすると、該当フィルタが削除されること', async () => {
      const filters: Filter[] = [
        createPropertyFilter('weight', 'lte', 5000),
        createPropertyFilter('price', 'gte', 50000),
      ]

      let updatedFilters: Filter[] = filters

      renderFilterPanel({
        filters,
        onfilterchange: (nextFilters: Filter[]) => {
          updatedFilters = nextFilters
        },
      })

      // 最初の削除ボタンをクリック
      const deleteButtons = screen.getAllByRole('button', { name: /削除/i })
      await fireEvent.click(deleteButtons[0])

      // 1つ目のフィルタが削除され、2つ目のフィルタのみ残ることを確認
      expect(updatedFilters).toHaveLength(1)
      expect(updatedFilters[0]?.property).toBe('price')
      expect(updatedFilters[0]?.value).toBe(50000)
    })
  })

  describe('お気に入りフィルタトグル', () => {
    it('お気に入りフィルタトグルボタンが表示されること', () => {
      renderFilterPanel()

      // お気に入りボタンが表示されることを確認
      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      expect(favoriteButton).toBeInTheDocument()
    })

    it('デフォルトではお気に入りフィルタがオフであること', () => {
      renderFilterPanel({ showFavoritesOnly: false })

      const favoriteButton = screen.getByRole('button', {
        name: /お気に入りのみ表示/i,
      })
      // ☆（白星）が表示されることを確認
      expect(favoriteButton.textContent).toContain('☆')
    })

    it('お気に入りフィルタがオンの場合、ボタンがハイライト表示されること', () => {
      renderFilterPanel({ showFavoritesOnly: true })

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

      renderFilterPanel({
        ontogglefavorites: () => {
          callbackFired = true
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
