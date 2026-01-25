import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'

export interface PartsDetailPanelStatus {
  isOpen: boolean
  selectedParts: ACParts | null
}

export function closePartsDetailPanel(): PartsDetailPanelStatus {
  return { isOpen: false, selectedParts: null }
}

export function openPartsDetailPanel(parts: ACParts): PartsDetailPanelStatus {
  return { isOpen: true, selectedParts: parts }
}
