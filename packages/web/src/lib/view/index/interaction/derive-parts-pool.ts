import { parseSlotPartsParamKey } from '$lib/view/parts-list/slot/slot-utils'

import type {
  Candidates,
  CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'

export interface PartsPoolRestrictions {
  candidates: Candidates
  restrictedSlots: Partial<Record<CandidatesKey, readonly string[]>>
}

/**
 * クエリ文字列からパーツプール制約を適用する純粋関数。
 * 副作用を持たず、コンポーネント側は結果を受け取って状態を更新するだけにする。
 */
export const derivePartsPool = (
  search: string,
  base: Candidates,
): PartsPoolRestrictions => {
  const params = new URLSearchParams(search)
  return applyPartsPoolRestrictions(params, base)
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

  const restrictedCandidates = Object.keys(base).reduce(
    (acc, slot) => {
      const key = slot as CandidatesKey
      acc[key] = next[key]
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
