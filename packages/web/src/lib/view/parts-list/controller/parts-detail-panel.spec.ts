import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import { describe, expect, it } from 'vitest'

import {
  closePartsDetailPanel,
  openPartsDetailPanel,
  type PartsDetailPanelStatus,
} from './parts-detail-panel'

describe('controller/parts-detail-panel', () => {
  const mockParts: ACParts = {
    id: 'test-parts-id',
    name: 'Test Parts',
    classification: 'unit',
    category: 'arm_unit',
    manufacture: 'balam',
    price: 100000,
    weight: 500,
    en_load: 200,
  } as ACParts

  describe('closePartsDetailPanel', () => {
    it('パネルを閉じた状態を返すこと', () => {
      const status: PartsDetailPanelStatus = closePartsDetailPanel()

      expect(status.isOpen).toBe(false)
      expect(status.selectedParts).toBeNull()
    })

    it('毎回新しいオブジェクトを返すこと', () => {
      const status1 = closePartsDetailPanel()
      const status2 = closePartsDetailPanel()

      expect(status1).not.toBe(status2)
      expect(status1).toEqual(status2)
    })
  })

  describe('openPartsDetailPanel', () => {
    it('指定したパーツでパネルを開いた状態を返すこと', () => {
      const status: PartsDetailPanelStatus = openPartsDetailPanel(mockParts)

      expect(status.isOpen).toBe(true)
      expect(status.selectedParts).toBe(mockParts)
    })

    it('毎回新しいオブジェクトを返すこと', () => {
      const status1 = openPartsDetailPanel(mockParts)
      const status2 = openPartsDetailPanel(mockParts)

      expect(status1).not.toBe(status2)
      expect(status1).toEqual(status2)
    })

    it('異なるパーツで呼び出すと異なるパーツが設定されること', () => {
      const anotherParts: ACParts = {
        ...mockParts,
        id: 'another-parts-id',
        name: 'Another Parts',
      }

      const status1 = openPartsDetailPanel(mockParts)
      const status2 = openPartsDetailPanel(anotherParts)

      expect(status1.selectedParts).toBe(mockParts)
      expect(status2.selectedParts).toBe(anotherParts)
    })
  })
})
