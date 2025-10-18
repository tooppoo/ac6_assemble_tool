import { type AssemblyKey } from '#core/assembly/assembly'
import { searchToAssemblyV2 } from '#core/assembly/serialize/as-query-v2'

import type { ArmUnit, LeftArmUnit } from '@ac6_assemble_tool/parts/arm-units'
import type { Arms } from '@ac6_assemble_tool/parts/arms'
import type {
  BackUnit,
  LeftBackUnit,
} from '@ac6_assemble_tool/parts/back-units'
import type { Booster } from '@ac6_assemble_tool/parts/booster'
import type { Core } from '@ac6_assemble_tool/parts/cores'
import type { Expansion } from '@ac6_assemble_tool/parts/expansions'
import type { FCS } from '@ac6_assemble_tool/parts/fces'
import type { Generator } from '@ac6_assemble_tool/parts/generators'
import type { Head } from '@ac6_assemble_tool/parts/heads'
import type { Legs } from '@ac6_assemble_tool/parts/legs'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import fc from 'fast-check'
import { describe, it, expect } from 'bun:test'

// 共通テストデータ - describe外で定義
const mockCandidates: Candidates = {
  rightArmUnit: [
    { id: 'AU001', name: 'Arm Unit 1' } as Partial<ArmUnit> as ArmUnit,
    { id: 'AU002', name: 'Arm Unit 2' } as Partial<ArmUnit> as ArmUnit,
  ],
  leftArmUnit: [
    { id: 'AU001', name: 'Arm Unit 1' } as Partial<ArmUnit> as ArmUnit,
    {
      id: 'AU003',
      name: 'Left Arm Unit 3',
    } as Partial<LeftArmUnit> as LeftArmUnit,
  ],
  rightBackUnit: [
    { id: 'BU001', name: 'Back Unit 1' } as Partial<BackUnit> as BackUnit,
    { id: 'BU002', name: 'Back Unit 2' } as Partial<BackUnit> as BackUnit,
  ],
  leftBackUnit: [
    { id: 'BU001', name: 'Back Unit 1' } as Partial<BackUnit> as BackUnit,
    {
      id: 'BU003',
      name: 'Left Back Unit 3',
    } as Partial<LeftBackUnit> as LeftBackUnit,
  ],
  head: [
    { id: 'HD001', name: 'Head 1' } as Partial<Head> as Head,
    { id: 'HD002', name: 'Head 2' } as Partial<Head> as Head,
  ],
  core: [
    { id: 'CR001', name: 'Core 1' } as Partial<Core> as Core,
    { id: 'CR002', name: 'Core 2' } as Partial<Core> as Core,
  ],
  arms: [
    { id: 'AR001', name: 'Arms 1' } as Partial<Arms> as Arms,
    { id: 'AR002', name: 'Arms 2' } as Partial<Arms> as Arms,
  ],
  legs: [
    { id: 'LG001', name: 'Legs 1' } as Partial<Legs> as Legs,
    { id: 'LG002', name: 'Legs 2' } as Partial<Legs> as Legs,
  ],
  booster: [
    { id: 'BS001', name: 'Booster 1' } as Partial<Booster> as Booster,
    { id: 'BS002', name: 'Booster 2' } as Partial<Booster> as Booster,
  ],
  fcs: [
    { id: 'FCS001', name: 'FCS 1' } as Partial<FCS> as FCS,
    { id: 'FCS002', name: 'FCS 2' } as Partial<FCS> as FCS,
  ],
  generator: [
    { id: 'GN001', name: 'Generator 1' } as Partial<Generator> as Generator,
    { id: 'GN002', name: 'Generator 2' } as Partial<Generator> as Generator,
  ],
  expansion: [
    { id: 'EXP001', name: 'Expansion 1' } as Partial<Expansion> as Expansion,
    { id: 'EXP002', name: 'Expansion 2' } as Partial<Expansion> as Expansion,
  ],
}

describe('v2形式URLデシリアライザー', () => {
  describe('searchToAssemblyV2', () => {
    it('v2形式URLから機体構成を復元できる', () => {
      const params = new URLSearchParams({
        v: '2',
        rau: 'AU001',
        lau: 'AU003',
        rbu: 'BU001',
        lbu: 'BU003',
        h: 'HD001',
        c: 'CR001',
        a: 'AR001',
        l: 'LG001',
        b: 'BS001',
        f: 'FCS001',
        g: 'GN001',
        e: 'EXP001',
      })

      const result = searchToAssemblyV2(params, mockCandidates)

      // 複数のexpectを1つにまとめて、全ての不一致を一度に確認
      expect({
        rightArmUnit: result.rightArmUnit.id,
        leftArmUnit: result.leftArmUnit.id,
        rightBackUnit: result.rightBackUnit.id,
        leftBackUnit: result.leftBackUnit.id,
        head: result.head.id,
        core: result.core.id,
        arms: result.arms.id,
        legs: result.legs.id,
        booster: result.booster.id,
        fcs: result.fcs.id,
        generator: result.generator.id,
        expansion: result.expansion.id,
      }).toEqual({
        rightArmUnit: 'AU001',
        leftArmUnit: 'AU003',
        rightBackUnit: 'BU001',
        leftBackUnit: 'BU003',
        head: 'HD001',
        core: 'CR001',
        arms: 'AR001',
        legs: 'LG001',
        booster: 'BS001',
        fcs: 'FCS001',
        generator: 'GN001',
        expansion: 'EXP001',
      })
    })

    it('存在しないIDの場合は配列の最初の要素をフォールバックとして使用', () => {
      const params = new URLSearchParams({
        v: '2',
        h: 'HD999', // 存在しないID
        c: 'CR001',
        a: 'AR001',
        l: 'LG001',
        b: 'BS001',
        f: 'FCS001',
        g: 'GN001',
        e: 'EXP001',
        rau: 'AU001',
        lau: 'AU001',
        rbu: 'BU001',
        lbu: 'BU001',
      })

      const result = searchToAssemblyV2(params, mockCandidates)

      expect(result.head.id).toBe('HD001')
    })

    it('パラメータが欠けている場合は配列の最初の要素を使用', () => {
      const params = new URLSearchParams({
        v: '2',
        // headパラメータなし
        c: 'CR001',
        a: 'AR001',
        l: 'LG001',
        b: 'BS001',
        f: 'FCS001',
        g: 'GN001',
        e: 'EXP001',
        rau: 'AU001',
        lau: 'AU001',
        rbu: 'BU001',
        lbu: 'BU001',
      })

      const result = searchToAssemblyV2(params, mockCandidates)

      expect(result.head.id).toBe('HD001')
    })

    // Property-based test: 複数の存在しないIDが全てフォールバックする
    it('任意の組み合わせで存在しないIDを指定した場合、全てフォールバック（配列の最初の要素）になる', () => {
      const slotToPrefix: Record<AssemblyKey, string> = {
        rightArmUnit: 'AU',
        leftArmUnit: 'AU',
        rightBackUnit: 'BU',
        leftBackUnit: 'BU',
        head: 'HD',
        core: 'CR',
        arms: 'AR',
        legs: 'LG',
        booster: 'BS',
        fcs: 'FCS',
        generator: 'GN',
        expansion: 'EXP',
      }

      const slotToParamKey: Record<AssemblyKey, string> = {
        rightArmUnit: 'rau',
        leftArmUnit: 'lau',
        rightBackUnit: 'rbu',
        leftBackUnit: 'lbu',
        head: 'h',
        core: 'c',
        arms: 'a',
        legs: 'l',
        booster: 'b',
        fcs: 'f',
        generator: 'g',
        expansion: 'e',
      }

      // ランダムなスロットの組み合わせを選択
      const genInvalidSlots = fc.uniqueArray(
        fc.constantFrom<AssemblyKey>(
          'rightArmUnit',
          'leftArmUnit',
          'rightBackUnit',
          'leftBackUnit',
          'head',
          'core',
          'arms',
          'legs',
          'booster',
          'fcs',
          'generator',
          'expansion',
        ),
        { minLength: 1, maxLength: 12 },
      )

      fc.assert(
        fc.property(genInvalidSlots, (invalidSlots) => {
          const baseParams: Record<string, string> = { v: '2' }

          // 正しいIDでベースパラメータを構築
          Object.keys(slotToParamKey).forEach((slot) => {
            const key = slotToParamKey[slot as AssemblyKey]
            baseParams[key] = mockCandidates[slot as AssemblyKey][0].id
          })

          // 選択されたスロットに存在しないIDを設定
          const invalidIds: Record<string, string> = {}
          invalidSlots.forEach((slot) => {
            const prefix = slotToPrefix[slot]
            const paramKey = slotToParamKey[slot]
            // 固定の存在しないID（範囲外）を使用
            invalidIds[paramKey] = `${prefix}999`
          })

          const params = new URLSearchParams({ ...baseParams, ...invalidIds })
          const result = searchToAssemblyV2(params, mockCandidates)

          // 存在しないIDを指定したスロットが全てフォールバック（最初の要素）になることを検証
          invalidSlots.forEach((slot) => {
            const expected = mockCandidates[slot][0].id
            const actual = result[slot].id
            expect(actual).toBe(expected)
          })
        }),
        { numRuns: 100 },
      )
    })
  })
})
