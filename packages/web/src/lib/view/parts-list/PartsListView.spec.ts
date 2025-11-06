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

import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/svelte'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import PartsListView from './PartsListView.svelte'
import PartsListViewTestWrapper from './PartsListView.test-wrapper.svelte'
import {
  compressToUrlSafeString,
  decompressFromUrlSafeString,
} from './state/filter/compression'
import * as partsPoolSerializer from './state/parts-pool-serializer'
import { sortPartsByKey } from './state/sort'
import * as stateSerializer from './state/state-serializer'

import * as navigation from '$app/navigation'

const replaceStateSpy = vi.spyOn(navigation, 'replaceState')
const gotoSpy = vi.spyOn(navigation, 'goto')

function extractCardNames(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('.parts-card .card-title'),
  ).map((el) => el.textContent?.trim() ?? '')
}

type RightArmUnitCandidate = (typeof regulation.candidates.rightArmUnit)[number]

function hasAttackPowerProperty(
  candidates: RightArmUnitCandidate,
): candidates is RightArmUnitCandidate & { readonly attack_power: number } {
  const attackPower = (candidates as { attack_power?: unknown }).attack_power
  return typeof attackPower === 'number'
}

describe('PartsListView コンポーネント', () => {
  // LocalStorageをクリア
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    replaceStateSpy.mockReset()
    replaceStateSpy.mockImplementation(() => undefined)
    gotoSpy.mockReset()
    gotoSpy.mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    replaceStateSpy.mockReset()
    replaceStateSpy.mockImplementation(() => undefined)
    gotoSpy.mockReset()
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
    it('URLパラメータから初期スロットを復元すること', async () => {
      // URLSearchParams をモック
      const searchParams = new URLSearchParams('slot=legs')

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
          initialSearchParams: searchParams,
        },
      })

      await waitFor(() => {
        const legsButton = screen.getByText(/^LEGS$|^脚部$/i)
        expect(legsButton.classList.contains('btn-primary')).toBe(true)
      })
    })

    it('全スロットのフィルタがURLクエリに保存されること', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      await waitFor(() => expect(replaceStateSpy).toHaveBeenCalled())
      replaceStateSpy.mockClear()

      let valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value: '3200' } })
      let addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)

      await waitFor(() => expect(replaceStateSpy).toHaveBeenCalled())
      replaceStateSpy.mockClear()

      const headButton = screen.getByText(/^HEAD$|^頭部$/)
      await headButton.click()

      valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value: '1500' } })
      addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)

      await waitFor(() => expect(replaceStateSpy).toHaveBeenCalled())

      const lastCall = replaceStateSpy.mock.calls.at(-1)
      expect(lastCall).toBeTruthy()
      const [url] = lastCall ?? []
      expect(typeof url).toBe('string')

      const params = new URL(url as string, 'https://example.test').searchParams
      expect(params.get('slot')).toBe('head')

      const filtersParam = params.get('filters')
      expect(filtersParam).not.toBeNull()

      const json = await decompressFromUrlSafeString(filtersParam!)
      expect(json).not.toBeNull()
      const payload = JSON.parse(json!) as Record<string, string[]>

      expect(payload.rightArmUnit).toEqual(['numeric:price:lte:3200'])
      expect(payload.head).toEqual(['numeric:price:lte:1500'])
    })

    it('lngパラメータを保持したままURLを更新すること', async () => {
      window.history.replaceState({}, '', '/parts-list?lng=en')

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      await waitFor(() => expect(replaceStateSpy).toHaveBeenCalled())

      const lastCall = replaceStateSpy.mock.calls.at(-1)
      expect(lastCall).toBeTruthy()
      const [url] = lastCall ?? []
      expect(typeof url).toBe('string')

      const params = new URL(url as string, 'https://example.test').searchParams
      expect(params.get('lng')).toBe('en')

      window.history.replaceState({}, '', '/parts-list')
    })
  })

  describe('LocalStorage 非依存', () => {
    it('LocalStorageにフィルタ状態を保存しないこと', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value: '3200' } })
      const addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)

      expect(localStorage.getItem('ac6-parts-list-filters-per-slot')).toBeNull()
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
      const payload = {
        rightArmUnit: ['numeric:weight:lte:5000', 'numeric:price:lte:100000'],
      }
      const compressed = await compressToUrlSafeString(JSON.stringify(payload))
      const searchParams = new URLSearchParams(
        `slot=rightArmUnit&filters=${compressed}`,
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
    function extractPrices(): number[] {
      const grid = document.querySelector('.parts-grid-container')
      if (!grid) return []
      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>('.parts-card'),
      )
      return cards.map((card) => {
        const value = card
          .querySelectorAll<HTMLElement>('.mt-auto strong')
          .item(0)
        const text = value?.textContent ?? '0'
        return Number(text.replaceAll(',', ''))
      })
    }

    it('選択中のスロットに対応するパーツのみを表示すること', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const expectedNames = regulation.candidates.rightArmUnit.map(
        (part) => part.name,
      )
      await waitFor(() => expect(extractCardNames()).toEqual(expectedNames))
    })

    it('数値型フィルタが適用されたパーツを表示すること', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const propertySelect = screen.getByLabelText('属性') as HTMLSelectElement

      await waitFor(() =>
        expect(
          Array.from(propertySelect.options).map((opt) => opt.value),
        ).toContain('attack_power'),
      )

      await fireEvent.change(propertySelect, {
        target: { value: 'attack_power' },
      })

      const valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value: '250' } })
      const addButton = screen.getByRole('button', { name: '追加' })

      const expectedNames = regulation.candidates.rightArmUnit
        .filter(hasAttackPowerProperty)
        .filter((part) => part.attack_power <= 250)
        .map((part) => part.name)
      await fireEvent.click(addButton)

      await waitFor(() => expect(extractCardNames()).toEqual(expectedNames))
      expect(screen.getByText('攻撃力: ≤ 250')).toBeInTheDocument()
    })

    it('並び替え設定が適用されたパーツが表示されること', async () => {
      const slotParts = regulation.candidates.rightArmUnit
      const initialExpected = slotParts.map((part) => part.price)
      const sortedByPriceAsc = [...slotParts]
        .sort((a, b) => a.price - b.price)
        .map((part) => part.price)
      const sortedByPriceDesc = [...slotParts]
        .sort((a, b) => b.price - a.price)
        .map((part) => part.price)

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const applyButton = screen.getByRole('button', { name: '適用' })
      const propertySelect = screen.getByLabelText(
        '並び替え対象',
      ) as HTMLSelectElement
      const orderSelect = screen.getByLabelText('並び順')

      await waitFor(() => expect(extractPrices()).toEqual(initialExpected))

      await fireEvent.change(propertySelect, { target: { value: 'price' } })
      expect(applyButton).not.toBeDisabled()
      await fireEvent.click(applyButton)

      await waitFor(() => expect(extractPrices()).toEqual(sortedByPriceAsc))

      await fireEvent.change(orderSelect, { target: { value: 'desc' } })
      const orderSelectAfterChange = screen.getByLabelText(
        '並び順',
      ) as HTMLSelectElement
      expect(orderSelectAfterChange.value).toBe('desc')
      await fireEvent.click(applyButton)

      await waitFor(() => expect(extractPrices()).toEqual(sortedByPriceDesc))
    })

    it('並び替えをクリアすると初期状態に戻ること', async () => {
      const slotParts = regulation.candidates.rightArmUnit
      const initialExpected = slotParts.map((part) => part.price)
      const sortedByPriceAsc = [...slotParts]
        .sort((a, b) => a.price - b.price)
        .map((part) => part.price)

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const applyButton = screen.getByRole('button', { name: '適用' })
      const propertySelect = screen.getByLabelText(
        '並び替え対象',
      ) as HTMLSelectElement
      await fireEvent.change(propertySelect, { target: { value: 'price' } })
      await fireEvent.click(applyButton)
      const sortCard = document.querySelector('.sort-control-card')
      expect(sortCard).not.toBeNull()
      const clearButton = within(sortCard as HTMLElement).getByRole('button', {
        name: 'クリア',
      })
      await waitFor(() => expect(extractPrices()).toEqual(sortedByPriceAsc))
      await fireEvent.click(clearButton)

      await waitFor(() => expect(extractPrices()).toEqual(initialExpected))

      const orderSelect = screen.getByLabelText('並び順') as HTMLSelectElement
      expect(orderSelect.value).toBe('asc')
    })

    it('配列型属性の並び替えが適用されること', async () => {
      const slotParts = regulation.candidates.rightArmUnit
      const expectedAsc = sortPartsByKey(slotParts, 'attack_type', 'asc').map(
        (part) => part.name,
      )
      const expectedDesc = sortPartsByKey(slotParts, 'attack_type', 'desc').map(
        (part) => part.name,
      )

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const applyButton = screen.getByRole('button', { name: '適用' })
      const propertySelect = screen.getByLabelText(
        '並び替え対象',
      ) as HTMLSelectElement
      const orderSelect = screen.getByLabelText('並び順')

      await fireEvent.change(propertySelect, {
        target: { value: 'attack_type' },
      })
      await fireEvent.click(applyButton)

      await waitFor(() => expect(extractCardNames()).toEqual(expectedAsc))

      await fireEvent.change(orderSelect, { target: { value: 'desc' } })
      await fireEvent.click(applyButton)

      await waitFor(() => expect(extractCardNames()).toEqual(expectedDesc))
    })

    it('optional属性の並び替えでは値が無いパーツが末尾に配置されること', async () => {
      const slotParts = regulation.candidates.rightArmUnit
      const expectedAsc = sortPartsByKey(
        slotParts,
        'charge_attack_power',
        'asc',
      ).map((part) => part.name)

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const applyButton = screen.getByRole('button', { name: '適用' })
      const propertySelect = screen.getByLabelText(
        '並び替え対象',
      ) as HTMLSelectElement

      await fireEvent.change(propertySelect, {
        target: { value: 'charge_attack_power' },
      })
      await fireEvent.click(applyButton)

      await waitFor(() => expect(extractCardNames()).toEqual(expectedAsc))
    })
  })

  describe('フィルタとソートの統合動作', () => {
    it('スロット変更時に属性候補が更新されること', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const propertySelect = screen.getByLabelText('属性') as HTMLSelectElement

      await waitFor(() =>
        expect(
          Array.from(propertySelect.options).map((opt) => opt.value),
        ).toContain('attack_power'),
      )

      const headButton = screen.getByText(/^HEAD$|^頭部$/)
      await headButton.click()

      await waitFor(() => {
        const values = Array.from(propertySelect.options).map(
          (opt) => opt.value,
        )
        expect(values).not.toContain('attack_power')
        expect(values).toContain('scan_distance')
      })
    })

    it('配列型フィルタとソートを組み合わせて適用できること', async () => {
      const filtered = regulation.candidates.rightArmUnit.filter(
        (part) => part.manufacture === 'balam',
      )
      const expectedNames = sortPartsByKey(
        filtered,
        'attack_power',
        'desc',
      ).map((part) => part.name)

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const filterTypeSelect = screen.getByLabelText('フィルタ種類')
      await fireEvent.change(filterTypeSelect, {
        target: { value: 'manufacture' },
      })
      const manufacturerCheckbox = await screen.findByLabelText('ベイラム')
      await fireEvent.click(manufacturerCheckbox)
      const addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)

      const applyButton = screen.getByRole('button', { name: '適用' })
      const propertySelect = screen.getByLabelText(
        '並び替え対象',
      ) as HTMLSelectElement
      const orderSelect = screen.getByLabelText('並び順')

      await fireEvent.change(propertySelect, {
        target: { value: 'attack_power' },
      })
      await fireEvent.change(orderSelect, { target: { value: 'desc' } })
      await fireEvent.click(applyButton)

      await waitFor(() => expect(extractCardNames()).toEqual(expectedNames))
    })

    it('フィルタ結果が0件の場合に空状態メッセージを表示すること', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const propertySelect = screen.getByLabelText('属性') as HTMLSelectElement
      await fireEvent.change(propertySelect, {
        target: { value: 'attack_power' },
      })

      const valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value: '-1' } })
      const addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)

      await waitFor(() =>
        expect(
          screen.getByText(
            'フィルタ条件に一致するパーツが見つかりませんでした',
          ),
        ).toBeInTheDocument(),
      )
      expect(document.querySelectorAll('.parts-card').length).toBe(0)
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

  describe('スロットごとのフィルタ状態管理', () => {
    async function addPriceFilter(value: string) {
      const valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value } })
      const addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)
      await waitFor(() =>
        expect(screen.getByText(/フィルタ\s*\(1件\)/)).toBeInTheDocument(),
      )
    }

    it('スロット切替時にスロットごとのフィルタ状態を保持すること', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      await addPriceFilter('4500')

      const headButton = screen.getByText(/^HEAD$|^頭部$/)
      await fireEvent.click(headButton)
      await waitFor(() =>
        expect(screen.getByText(/フィルタ\s*\(0件\)/)).toBeInTheDocument(),
      )

      const rightArmButton = screen.getByText(/RIGHT ARM UNIT|右腕武器/i)
      await fireEvent.click(rightArmButton)
      await waitFor(() =>
        expect(screen.getByText(/フィルタ\s*\(1件\)/)).toBeInTheDocument(),
      )
    })
  })

  describe('アセンブリページへの遷移', () => {
    it('現在の条件と母集団制限をURLに含めてアセンページに遷移する', async () => {
      window.history.replaceState({}, '', '/parts-list?lng=en')

      gotoSpy.mockResolvedValue(undefined)

      const serializeToURLSpy = vi
        .spyOn(stateSerializer, 'serializeToURL')
        .mockResolvedValue(new URLSearchParams('slot=arms&sort=weight:asc'))
      const serializePartsPoolSpy = vi
        .spyOn(partsPoolSerializer, 'serializeFilteredPartsPool')
        .mockReturnValue(new URLSearchParams('arms_parts=TEST-001,TEST-002'))

      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const handoffButton = screen.getByRole('button', {
        name: /アセンに渡す/, // 日本語ラベル
      })

      await fireEvent.click(handoffButton)

      expect(serializeToURLSpy).toHaveBeenCalled()
      expect(serializePartsPoolSpy).toHaveBeenCalled()
      expect(gotoSpy).toHaveBeenCalled()

      const target = gotoSpy.mock.calls[0][0] as string
      expect(target.startsWith('/?')).toBe(true)

      const params = new URLSearchParams(target.split('?')[1])
      expect(params.get('slot')).toBe('arms')
      expect(params.get('sort')).toBe('weight:asc')
      expect(params.get('lng')).toBe('en')
      expect(params.get('arms_parts')).toBe('TEST-001,TEST-002')

      serializeToURLSpy.mockRestore()
      serializePartsPoolSpy.mockRestore()
    })

    it('候補が0件のスロットがある場合はボタンを無効化し理由を表示する', async () => {
      render(PartsListViewTestWrapper, {
        props: {
          regulation,
        },
      })

      const valueInput = screen.getByLabelText('値')
      await fireEvent.input(valueInput, { target: { value: '-1' } })
      const addButton = screen.getByRole('button', { name: '追加' })
      await fireEvent.click(addButton)

      const handoffButton = await screen.findByRole('button', {
        name: /アセンに渡す/,
      })

      await waitFor(() => expect(handoffButton).toBeDisabled())

      expect(screen.getByText(/候補が0件です: 右腕武器/)).toBeInTheDocument()

      await fireEvent.click(handoffButton)
      expect(gotoSpy).not.toHaveBeenCalled()
    })
  })
})
