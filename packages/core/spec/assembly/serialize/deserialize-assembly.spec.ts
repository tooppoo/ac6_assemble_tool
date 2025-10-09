import { deserializeAssembly } from '#core/assembly/serialize/deserialize-assembly'

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

describe('機体構成デシリアライザー統合', () => {
  describe('deserializeAssembly', () => {
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

      const result = deserializeAssembly(params, mockCandidates)

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

    it('v1形式URLを自動的にv2形式に変換して機体構成を復元できる', () => {
      const v1Params = new URLSearchParams({
        rau: '0', // AU001
        lau: '1', // AU003
        rbu: '0', // BU001
        lbu: '1', // BU003
        h: '0', // HD001
        c: '1', // CR002
        a: '0', // AR001
        l: '0', // LG001
        b: '0', // BS001
        f: '0', // FCS001
        g: '0', // GN001
        e: '0', // EXP001
      })

      const result = deserializeAssembly(v1Params, mockCandidates)

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
        core: 'CR002',
        arms: 'AR001',
        legs: 'LG001',
        booster: 'BS001',
        fcs: 'FCS001',
        generator: 'GN001',
        expansion: 'EXP001',
      })
    })

    it('空のURLSearchParamsの場合は各配列の最初の要素を使用', () => {
      const params = new URLSearchParams()

      const result = deserializeAssembly(params, mockCandidates)

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
        leftArmUnit: 'AU001',
        rightBackUnit: 'BU001',
        leftBackUnit: 'BU001',
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

    // Parameterized test: すべてのキーで動作を検証
    it.each([
      { key: 'rau', paramKey: 'rau', id: 'AU002', field: 'rightArmUnit' },
      { key: 'lau', paramKey: 'lau', id: 'AU003', field: 'leftArmUnit' },
      { key: 'rbu', paramKey: 'rbu', id: 'BU002', field: 'rightBackUnit' },
      { key: 'lbu', paramKey: 'lbu', id: 'BU003', field: 'leftBackUnit' },
      { key: 'h', paramKey: 'h', id: 'HD002', field: 'head' },
      { key: 'c', paramKey: 'c', id: 'CR002', field: 'core' },
      { key: 'a', paramKey: 'a', id: 'AR002', field: 'arms' },
      { key: 'l', paramKey: 'l', id: 'LG002', field: 'legs' },
      { key: 'b', paramKey: 'b', id: 'BS002', field: 'booster' },
      { key: 'f', paramKey: 'f', id: 'FCS002', field: 'fcs' },
      { key: 'g', paramKey: 'g', id: 'GN002', field: 'generator' },
      { key: 'e', paramKey: 'e', id: 'EXP002', field: 'expansion' },
    ] as const)(
      'v2形式: キー "$key" で指定したパーツ $id が $field に設定される',
      ({ paramKey, id, field }) => {
        const params = new URLSearchParams({
          v: '2',
          [paramKey]: id,
        })

        const result = deserializeAssembly(params, mockCandidates)

        expect(result[field].id).toBe(id)
      },
    )
  })
})
