import { latest as regulation } from '$lib/regulation'
import type { PartsPoolRestrictions } from '$lib/view/index/interaction/derive-parts-pool'

import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'

export type PageData = {
  regulation: Regulation
  partsPool: PartsPoolRestrictions
}
export function load(): PageData {
  const partsPool: PartsPoolRestrictions = {
    candidates: regulation.candidates,
    restrictedSlots: {},
  }

  return {
    regulation,
    partsPool,
  }
}
