/**
 * SlotSelectorコンポーネントのテスト
 *
 * TDD RED Phase:
 * - 12種類のスロットを表示できること
 * - 選択中のスロットが視覚的に明示されること
 * - スロットをクリックしたときにイベントが発火すること
 * - i18nでスロット名が翻訳されること
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import SlotSelector from './SlotSelector.svelte'
import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'

describe('SlotSelector コンポーネント', () => {
  describe('スロット表示', () => {
    it('12種類のスロットボタンが表示されること', () => {
      render(SlotSelector, {
        props: {
          currentSlot: 'rightArmUnit' as CandidatesKey,
        },
      })

      // 12種類のスロットが存在することを確認
      // すべてのボタンが表示されていることを確認
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(12)

      // 各スロット名が含まれていることを確認（正確なテキストマッチ）
      expect(screen.getByText(/^RIGHT ARM UNIT$|^右腕武器$/)).toBeInTheDocument()
      expect(screen.getByText(/^LEFT ARM UNIT$|^左腕武器$/)).toBeInTheDocument()
      expect(screen.getByText(/^RIGHT BACK UNIT$|^右背中武器$/)).toBeInTheDocument()
      expect(screen.getByText(/^LEFT BACK UNIT$|^左背中武器$/)).toBeInTheDocument()
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
      const { container } = render(SlotSelector, {
        props: {
          currentSlot: 'rightArmUnit' as CandidatesKey,
        },
      })

      // 選択中のスロット（rightArmUnit）にactiveクラスが付いていることを確認
      const rightArmButton = screen.getByText(/RIGHT ARM UNIT|右腕武器/i)
      expect(rightArmButton.classList.contains('active')).toBe(true)
    })

    it('選択されていないスロットがactive状態でないこと', () => {
      render(SlotSelector, {
        props: {
          currentSlot: 'rightArmUnit' as CandidatesKey,
        },
      })

      // 選択されていないスロット（head）にactiveクラスが付いていないことを確認
      const headButton = screen.getByText(/^HEAD$|頭部/)
      expect(headButton.classList.contains('active')).toBe(false)
    })
  })

  describe('スロット選択', () => {
    it('スロットをクリックしたときにonslotchangeコールバックが呼ばれること', async () => {
      let selectedSlot: CandidatesKey | null = null

      render(SlotSelector, {
        props: {
          currentSlot: 'rightArmUnit' as CandidatesKey,
          onslotchange: (event: CustomEvent<{ slot: CandidatesKey }>) => {
            selectedSlot = event.detail.slot
          },
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

      render(SlotSelector, {
        props: {
          currentSlot: 'rightArmUnit' as CandidatesKey,
          onslotchange: () => {
            callbackCalled = true
          },
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
      render(SlotSelector, {
        props: {
          currentSlot: 'rightArmUnit' as CandidatesKey,
        },
      })

      // すべてのスロットボタンがbutton要素であることを確認
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(12)

      for (const button of buttons) {
        expect(button.tagName).toBe('BUTTON')
      }
    })
  })
})
