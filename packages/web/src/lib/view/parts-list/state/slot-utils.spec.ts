import { CANDIDATES_KEYS } from '@ac6_assemble_tool/parts/types/candidates'
import { describe, expect, it } from 'vitest'

import {
  normalizeSlotKey,
  parseSlotPartsParamKey,
  toSlotParamValue,
  toSlotPartsParamKey,
} from './slot-utils'

describe('slot-utils', () => {
  it('キャメルケースのスロット名をスネークケースに変換する', () => {
    expect(toSlotParamValue('rightArmUnit')).toBe('right_arm_unit')
    expect(toSlotParamValue('leftBackUnit')).toBe('left_back_unit')
  })

  it('スロット名にパラメータ用サフィックスを付与する', () => {
    const key = CANDIDATES_KEYS[0]
    expect(toSlotPartsParamKey(key)).toBe('right_arm_unit_parts')
  })

  it('パラメータキーからスロット名を復元する', () => {
    expect(parseSlotPartsParamKey('head_parts')).toBe('head')
    expect(parseSlotPartsParamKey('right_arm_unit_parts')).toBe('rightArmUnit')
  })

  it('サフィックスが無いパラメータキーは無視する', () => {
    expect(parseSlotPartsParamKey('head')).toBeNull()
    expect(parseSlotPartsParamKey('head_part')).toBeNull()
  })

  it('スロットキーの正規化時にスネーク／キャメルの双方を許可する', () => {
    expect(normalizeSlotKey('left_arm_unit')).toBe('leftArmUnit')
    expect(normalizeSlotKey('leftArmUnit')).toBe('leftArmUnit')
  })

  it('未知のスロットキーは正規化に失敗する', () => {
    expect(normalizeSlotKey('')).toBeNull()
    expect(normalizeSlotKey('unknown_slot')).toBeNull()
  })
})
