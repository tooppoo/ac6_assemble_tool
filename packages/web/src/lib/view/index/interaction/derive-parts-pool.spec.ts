import { latest as regulation } from '$lib/regulation'

import { logger } from '@ac6_assemble_tool/shared/logger'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { derivePartsPool } from './derive-parts-pool'

describe('derive-parts-pool', () => {
  const baseCandidates = regulation.candidates

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('クエリが空なら候補を変更しない', () => {
    const result = derivePartsPool('', baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(result.restrictedSlots).toEqual({})
  })

  it('未知のキーは無視する', () => {
    const result = derivePartsPool('unknown_parts=foo', baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(result.restrictedSlots).toEqual({})
  })

  it('有効なIDを指定すると候補を絞る', () => {
    const allowed = baseCandidates.rightArmUnit.slice(0, 2)
    const ids = allowed.map((p) => p.id).join(',')
    const query = `${toSlotParamKey('rightArmUnit')}=${ids}`

    const result = derivePartsPool(query, baseCandidates)

    expect(result.candidates).not.toBe(baseCandidates)
    expect(result.candidates.rightArmUnit.map((p) => p.id)).toEqual(
      allowed.map((p) => p.id),
    )
    expect(result.restrictedSlots.rightArmUnit).toEqual(
      allowed.map((p) => p.id),
    )
  })

  it('IDが空の場合は警告し候補を維持する', () => {
    const warnSpy = vi.spyOn(logger, 'warn')
    const query = `${toSlotParamKey('head')}= , ,`

    const result = derivePartsPool(query, baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(warnSpy).toHaveBeenCalledWith(
      'パーツプールが空のため候補一覧をそのまま利用します',
      expect.objectContaining({ slot: 'head' }),
    )
  })

  it('存在しないIDのみの場合は警告し候補を維持する', () => {
    const warnSpy = vi.spyOn(logger, 'warn')
    const query = `${toSlotParamKey('core')}=unknown-id`

    const result = derivePartsPool(query, baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(warnSpy).toHaveBeenCalledWith(
      'パーツプール制限により候補が存在しません',
      expect.objectContaining({ slot: 'core', requestedIds: ['unknown-id'] }),
    )
  })
})

function toSlotParamKey(key: keyof typeof regulation.candidates): string {
  return `${key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()}_parts`
}
