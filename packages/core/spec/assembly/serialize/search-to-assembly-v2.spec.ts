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
import { describe, it, expect } from 'vitest'

describe('v2形式URLデシリアライザー', () => {
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

      expect(result.rightArmUnit.id).toBe('AU001')
      expect(result.leftArmUnit.id).toBe('AU003')
      expect(result.rightBackUnit.id).toBe('BU001')
      expect(result.leftBackUnit.id).toBe('BU003')
      expect(result.head.id).toBe('HD001')
      expect(result.core.id).toBe('CR001')
      expect(result.arms.id).toBe('AR001')
      expect(result.legs.id).toBe('LG001')
      expect(result.booster.id).toBe('BS001')
      expect(result.fcs.id).toBe('FCS001')
      expect(result.generator.id).toBe('GN001')
      expect(result.expansion.id).toBe('EXP001')
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

      // 存在しないIDの場合、配列の最初の要素がフォールバック
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
  })
})
