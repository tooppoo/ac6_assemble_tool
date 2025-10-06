import { convertV1ToV2 } from '#core/assembly/serialize/convert-v1-to-v2'

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

describe('v1→v2変換', () => {
  describe('convertV1ToV2', () => {
    it('v1形式URLをv2形式に変換できる', () => {
      const v1Params = new URLSearchParams({
        rau: '0', // AU001
        lau: '1', // AU003
        rbu: '0', // BU001
        lbu: '1', // BU003
        h: '0', // HD001
        c: '0', // CR001
        a: '0', // AR001
        l: '0', // LG001
        b: '0', // BS001
        f: '0', // FCS001
        g: '0', // GN001
        e: '0', // EXP001
      })

      const result = convertV1ToV2(v1Params, mockCandidates)

      // 複数のexpectを1つにまとめて、全ての不一致を一度に確認
      expect({
        version: result.get('v'),
        rightArmUnit: result.get('rau'),
        leftArmUnit: result.get('lau'),
        rightBackUnit: result.get('rbu'),
        leftBackUnit: result.get('lbu'),
        head: result.get('h'),
        core: result.get('c'),
        arms: result.get('a'),
        legs: result.get('l'),
        booster: result.get('b'),
        fcs: result.get('f'),
        generator: result.get('g'),
        expansion: result.get('e'),
      }).toEqual({
        version: '2',
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

    it('インデックスが範囲外の場合は配列の最初の要素を使用', () => {
      const v1Params = new URLSearchParams({
        h: '999', // 範囲外
        c: '0',
        a: '0',
        l: '0',
        b: '0',
        f: '0',
        g: '0',
        e: '0',
        rau: '0',
        lau: '0',
        rbu: '0',
        lbu: '0',
      })

      const result = convertV1ToV2(v1Params, mockCandidates)

      expect(result.get('h')).toBe('HD001')
    })

    // Parameterized test: すべてのキーで欠損時のフォールバック動作を検証
    it.each([
      { key: 'rau', expectedId: 'AU001' },
      { key: 'lau', expectedId: 'AU001' },
      { key: 'rbu', expectedId: 'BU001' },
      { key: 'lbu', expectedId: 'BU001' },
      { key: 'h', expectedId: 'HD001' },
      { key: 'c', expectedId: 'CR001' },
      { key: 'a', expectedId: 'AR001' },
      { key: 'l', expectedId: 'LG001' },
      { key: 'b', expectedId: 'BS001' },
      { key: 'f', expectedId: 'FCS001' },
      { key: 'g', expectedId: 'GN001' },
      { key: 'e', expectedId: 'EXP001' },
    ] as const)(
      'パラメータ "$key" が欠けている場合は配列の最初の要素 $expectedId を使用',
      ({ key, expectedId }) => {
        // すべてのキーを含むベースパラメータを作成
        const allKeys = {
          rau: '0',
          lau: '0',
          rbu: '0',
          lbu: '0',
          h: '0',
          c: '0',
          a: '0',
          l: '0',
          b: '0',
          f: '0',
          g: '0',
          e: '0',
        }

        // テスト対象のキーを削除
        const { [key]: _, ...paramsWithoutKey } = allKeys
        const v1Params = new URLSearchParams(paramsWithoutKey)

        const result = convertV1ToV2(v1Params, mockCandidates)

        expect(result.get(key)).toBe(expectedId)
      },
    )
  })
})
