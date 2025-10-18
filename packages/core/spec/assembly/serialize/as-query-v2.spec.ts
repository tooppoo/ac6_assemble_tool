import { createAssembly, type RawAssembly } from '#core/assembly/assembly'
import { assemblyToSearchV2 } from '#core/assembly/serialize/as-query-v2'

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
import { describe, it, expect } from 'bun:test'

// 共通テストデータ - describe外で定義
const testAssemblyData: RawAssembly = {
  rightArmUnit: {
    id: 'AU001',
    name: 'Test Arm Unit',
  } as Partial<ArmUnit> as ArmUnit,
  leftArmUnit: {
    id: 'AU002',
    name: 'Test Left Arm',
  } as Partial<LeftArmUnit> as LeftArmUnit,
  rightBackUnit: {
    id: 'BU001',
    name: 'Test Back Unit',
  } as Partial<BackUnit> as BackUnit,
  leftBackUnit: {
    id: 'BU002',
    name: 'Test Left Back',
  } as Partial<LeftBackUnit> as LeftBackUnit,
  head: { id: 'HD001', name: 'Test Head' } as Partial<Head> as Head,
  core: { id: 'CR001', name: 'Test Core' } as Partial<Core> as Core,
  arms: { id: 'AR001', name: 'Test Arms' } as Partial<Arms> as Arms,
  legs: { id: 'LG001', name: 'Test Legs' } as Partial<Legs> as Legs,
  booster: {
    id: 'BS001',
    name: 'Test Booster',
  } as Partial<Booster> as Booster,
  fcs: { id: 'FCS001', name: 'Test FCS' } as Partial<FCS> as FCS,
  generator: {
    id: 'GN001',
    name: 'Test Generator',
  } as Partial<Generator> as Generator,
  expansion: {
    id: 'EXP001',
    name: 'Test Expansion',
  } as Partial<Expansion> as Expansion,
} as RawAssembly

describe('v2形式URLシリアライザー', () => {
  describe('assemblyToSearchV2', () => {
    it('v=2パラメータと全てのパーツIDをクエリパラメータに含む', () => {
      const assembly = createAssembly(testAssemblyData)
      const result = assemblyToSearchV2(assembly)

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
        leftArmUnit: 'AU002',
        rightBackUnit: 'BU001',
        leftBackUnit: 'BU002',
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

    it('URL文字列を生成できる', () => {
      const assembly = createAssembly(testAssemblyData)
      const result = assemblyToSearchV2(assembly)
      const urlString = result.toString()

      // 必須パラメータが含まれることを確認
      expect({
        hasVersion: urlString.includes('v=2'),
        hasHead: urlString.includes('h=HD001'),
        hasCore: urlString.includes('c=CR001'),
        hasArms: urlString.includes('a=AR001'),
        hasLegs: urlString.includes('l=LG001'),
        hasBooster: urlString.includes('b=BS001'),
        hasFcs: urlString.includes('f=FCS001'),
        hasGenerator: urlString.includes('g=GN001'),
        hasExpansion: urlString.includes('e=EXP001'),
        hasRightArmUnit: urlString.includes('rau=AU001'),
        hasLeftArmUnit: urlString.includes('lau=AU002'),
        hasRightBackUnit: urlString.includes('rbu=BU001'),
        hasLeftBackUnit: urlString.includes('lbu=BU002'),
      }).toEqual({
        hasVersion: true,
        hasHead: true,
        hasCore: true,
        hasArms: true,
        hasLegs: true,
        hasBooster: true,
        hasFcs: true,
        hasGenerator: true,
        hasExpansion: true,
        hasRightArmUnit: true,
        hasLeftArmUnit: true,
        hasRightBackUnit: true,
        hasLeftBackUnit: true,
      })
    })
  })
})
