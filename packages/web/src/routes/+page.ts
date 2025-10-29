import { latest as regulation } from '$lib/regulation'
import {
  applyPartsPoolRestrictions,
  type PartsPoolRestrictions,
} from '$lib/view/index/parts-pool'

import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'

export type PageData = {
  regulation: Regulation
  partsPool: PartsPoolRestrictions
}
export function load({ url }: { url: URL }): PageData {
  const partsPool = applyPartsPoolRestrictions(
    url.searchParams,
    regulation.candidates,
  )

  return {
    regulation,
    partsPool,
  }
}
