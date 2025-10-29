import { latest as regulation } from '$lib/regulation'

import { logger } from '@ac6_assemble_tool/shared/logger'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { applyPartsPoolRestrictions } from './parts-pool'

describe('parts-pool', () => {
  const baseCandidates = regulation.candidates

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('制限パラメータが無い場合は候補を変更しない', () => {
    const params = new URLSearchParams()

    const result = applyPartsPoolRestrictions(params, baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(result.restrictedSlots).toEqual({})
  })

  it('認識できないキーは無視する', () => {
    const params = new URLSearchParams('unknown_parts=abc')

    const result = applyPartsPoolRestrictions(params, baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(result.restrictedSlots).toEqual({})
  })

  it('有効なIDを指定すると候補一覧を絞り込む', () => {
    const allowed = regulation.candidates.rightArmUnit.slice(0, 2)
    const ids = allowed.map((part) => part.id).join(',')
    const params = new URLSearchParams(
      `${toSlotParamKey('rightArmUnit')}=${ids}`,
    )

    const result = applyPartsPoolRestrictions(params, baseCandidates)

    expect(result.candidates).not.toBe(baseCandidates)
    expect(result.candidates.rightArmUnit).toHaveLength(allowed.length)
    expect(result.candidates.rightArmUnit.map((part) => part.id)).toEqual(
      allowed.map((part) => part.id),
    )
    expect(result.restrictedSlots.rightArmUnit).toEqual(
      allowed.map((part) => part.id),
    )
  })

  it('IDが空の場合は警告して無視する', () => {
    const params = new URLSearchParams(`${toSlotParamKey('head')}= , ,`)

    const warnSpy = vi.spyOn(logger, 'warn')

    const result = applyPartsPoolRestrictions(params, baseCandidates)

    expect(result.candidates).toBe(baseCandidates)
    expect(warnSpy).toHaveBeenCalledWith(
      'パーツプールが空のため候補一覧をそのまま利用します',
      expect.objectContaining({ slot: 'head' }),
    )
  })

  it('候補が存在しない制限は警告して無視する', () => {
    const params = new URLSearchParams(`${toSlotParamKey('core')}=unknown-id`)

    const warnSpy = vi.spyOn(logger, 'warn')

    const result = applyPartsPoolRestrictions(params, baseCandidates)

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
