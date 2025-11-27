import { parseSlotPartsParamKey } from '$lib/view/parts-list/slot/slot-utils'

import {
  CANDIDATES_KEYS,
  type Candidates,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'

export interface PartsPoolRestrictions {
  candidates: Candidates
  restrictedSlots: Partial<Record<CandidatesKey, readonly string[]>>
}

export function applyPartsPoolRestrictions(
  params: URLSearchParams,
  base: Candidates,
): PartsPoolRestrictions {
  const next = { ...base } as Record<CandidatesKey, Candidates[CandidatesKey]>
  const restrictedSlots: Partial<Record<CandidatesKey, readonly string[]>> = {}
  let changed = false

  params.forEach((value, key) => {
    const slot = parseSlotPartsParamKey(key)
    if (!slot) {
      return
    }

    const ids = parseIds(value)
    if (ids.length === 0) {
      logger.warn('パーツプールが空のため候補一覧をそのまま利用します', {
        slot,
      })
      return
    }

    const allowedSet = new Set(ids)
    const filtered = filterCandidatesById(base[slot], allowedSet)
    if (filtered.length === 0) {
      logger.warn('パーツプール制限により候補が存在しません', {
        slot,
        requestedIds: ids,
      })
      return
    }

    next[slot] = filtered
    restrictedSlots[slot] = filtered.map((parts) => parts.id)
    changed = true
  })

  if (!changed) {
    return {
      candidates: base,
      restrictedSlots,
    }
  }

  const restrictedCandidates = CANDIDATES_KEYS.reduce(
    (acc, slot) => {
      acc[slot] = next[slot]
      return acc
    },
    {} as Record<CandidatesKey, Candidates[CandidatesKey]>,
  ) as Candidates

  return {
    candidates: restrictedCandidates,
    restrictedSlots,
  }
}
function filterCandidatesById<K extends CandidatesKey>(
  candidates: Candidates[K],
  allowedIds: ReadonlySet<string>,
): Candidates[K] {
  const filtered = candidates.filter((candidate) =>
    allowedIds.has(candidate.id),
  )

  if (filtered.length === candidates.length) {
    return candidates
  }

  return Object.freeze([...filtered]) as Candidates[K]
}

function parseIds(value: string): string[] {
  return value
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
}
