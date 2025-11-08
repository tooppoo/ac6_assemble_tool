/**
 * SlotSelectorコンポーネントのテスト
 *
 * TDD RED Phase:
 * - 12種類のスロットを表示できること
 * - 選択中のスロットが視覚的に明示されること
 * - スロットをクリックしたときにイベントが発火すること
 * - i18nでスロット名が翻訳されること
 */

import i18n from '$lib/i18n/define'

import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'

import SlotSelector from './SlotSelector.svelte'

type SlotSelectorProps = {
  currentSlot: CandidatesKey
  onslotchange?: (event: CustomEvent<{ slot: CandidatesKey }>) => void
}

const renderSlotSelector = (props?: Partial<SlotSelectorProps>) =>
  render(SlotSelector, {
    props: {
      currentSlot: props?.currentSlot ?? ('rightArmUnit' as CandidatesKey),
      onslotchange: props?.onslotchange,
    },
    context: new Map([['i18n', i18n]]),
  })

describe('SlotSelector コンポーネント', () => {
  describe('スロット表示', () => {
    it('12種類のスロットボタンが表示されること', () => {
      renderSlotSelector()

      // 12種類のスロットが存在することを確認
      // すべてのボタンが表示されていることを確認（スロット選択12個 + 折りたたみ1個 = 13個）
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(13)

      // 各スロット名が含まれていることを確認（正確なテキストマッチ）
      expect(
        screen.getByText(/^RIGHT ARM UNIT$|^右腕武器$/),
      ).toBeInTheDocument()
      expect(screen.getByText(/^LEFT ARM UNIT$|^左腕武器$/)).toBeInTheDocument()
      expect(
        screen.getByText(/^RIGHT BACK UNIT$|^右背中武器$/),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/^LEFT BACK UNIT$|^左背中武器$/),
      ).toBeInTheDocument()
      expect(screen.getByText(/^HEAD$|^頭部$/)).toBeInTheDocument()
      expect(screen.getByText(/^CORE$|^コア$/)).toBeInTheDocument()
      expect(screen.getByText(/^ARMS$|^腕部$/)).toBeInTheDocument()
      expect(screen.getByText(/^LEGS$|^脚部$/)).toBeInTheDocument()
      expect(screen.getByText(/^BOOSTER$|^ブースター$/)).toBeInTheDocument()
      expect(screen.getByText(/^FCS$/)).toBeInTheDocument()
      expect(screen.getByText(/^GENERATOR$|^ジェネレータ$/)).toBeInTheDocument()
      expect(screen.getByText(/^EXPANSION$|^コア拡張$/)).toBeInTheDocument()
    })

    it('選択中のスロットがactive状態で表示されること', () => {
      renderSlotSelector()

      // 選択中のスロット（rightArmUnit）がprimaryカラーで表示されることを確認
      const rightArmButton = screen.getByText(/RIGHT ARM UNIT|右腕武器/i)
      // Bootstrap 5のButtonコンポーネントでは btn-primary クラスが付く
      expect(rightArmButton.classList.contains('btn-primary')).toBe(true)
    })

    it('選択されていないスロットがactive状態でないこと', () => {
      renderSlotSelector()

      // 選択されていないスロット（head）がoutline-secondaryカラーで表示されることを確認
      const headButton = screen.getByText(/^HEAD$|頭部/)
      // Bootstrap 5のButtonコンポーネントでは btn-outline-secondary クラスが付く
      expect(headButton.classList.contains('btn-outline-secondary')).toBe(true)
    })
  })

  describe('スロット選択', () => {
    it('スロットをクリックしたときにonslotchangeコールバックが呼ばれること', async () => {
      let selectedSlot: CandidatesKey | null = null

      renderSlotSelector({
        onslotchange: (event: CustomEvent<{ slot: CandidatesKey }>) => {
          selectedSlot = event.detail.slot
        },
      })

      // headスロットをクリック
      const headButton = screen.getByText(/^HEAD$|頭部/)
      await fireEvent.click(headButton)

      // コールバックが呼ばれ、正しいスロットが渡されることを確認
      expect(selectedSlot).toBe('head')
    })

    it('現在選択中のスロットをクリックしてもコールバックは呼ばれること', async () => {
      let callbackCalled = false

      renderSlotSelector({
        onslotchange: () => {
          callbackCalled = true
        },
      })

      // 現在選択中のrightArmUnitスロットをクリック
      const rightArmButton = screen.getByText(/RIGHT ARM UNIT|右腕武器/i)
      await fireEvent.click(rightArmButton)

      // コールバックが呼ばれる（親で重複チェックを行うため）
      expect(callbackCalled).toBe(true)
    })
  })

  describe('モバイル対応', () => {
    it('すべてのスロットボタンにtypeがbuttonであること', () => {
      renderSlotSelector()

      // すべてのスロットボタンがbutton要素であることを確認（スロット選択12個 + 折りたたみ1個 = 13個）
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(13)

      for (const button of buttons) {
        expect(button.tagName).toBe('BUTTON')
      }
    })
  })
})
