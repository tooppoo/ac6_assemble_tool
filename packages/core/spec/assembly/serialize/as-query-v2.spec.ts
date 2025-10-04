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
import { describe, it, expect } from 'vitest'

describe('v2形式URLシリアライザー', () => {
  describe('assemblyToSearchV2', () => {
    it('v=2パラメータを含む', () => {
      const assembly = createAssembly({
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
      } as RawAssembly)

      const result = assemblyToSearchV2(assembly)

      expect(result.get('v')).toBe('2')
    })

    it('各部位のパーツIDをクエリパラメータに含む', () => {
      const assembly = createAssembly({
        rightArmUnit: {
          id: 'AU001',
          name: 'Test',
        } as Partial<ArmUnit> as ArmUnit,
        leftArmUnit: {
          id: 'AU002',
          name: 'Test',
        } as Partial<LeftArmUnit> as LeftArmUnit,
        rightBackUnit: {
          id: 'BU001',
          name: 'Test',
        } as Partial<BackUnit> as BackUnit,
        leftBackUnit: {
          id: 'BU002',
          name: 'Test',
        } as Partial<LeftBackUnit> as LeftBackUnit,
        head: { id: 'HD001', name: 'Test' } as Partial<Head> as Head,
        core: { id: 'CR001', name: 'Test' } as Partial<Core> as Core,
        arms: { id: 'AR001', name: 'Test' } as Partial<Arms> as Arms,
        legs: { id: 'LG001', name: 'Test' } as Partial<Legs> as Legs,
        booster: { id: 'BS001', name: 'Test' } as Partial<Booster> as Booster,
        fcs: { id: 'FCS001', name: 'Test' } as Partial<FCS> as FCS,
        generator: {
          id: 'GN001',
          name: 'Test',
        } as Partial<Generator> as Generator,
        expansion: {
          id: 'EXP001',
          name: 'Test',
        } as Partial<Expansion> as Expansion,
      } as RawAssembly)

      const result = assemblyToSearchV2(assembly)

      expect(result.get('rau')).toBe('AU001')
      expect(result.get('lau')).toBe('AU002')
      expect(result.get('rbu')).toBe('BU001')
      expect(result.get('lbu')).toBe('BU002')
      expect(result.get('h')).toBe('HD001')
      expect(result.get('c')).toBe('CR001')
      expect(result.get('a')).toBe('AR001')
      expect(result.get('l')).toBe('LG001')
      expect(result.get('b')).toBe('BS001')
      expect(result.get('f')).toBe('FCS001')
      expect(result.get('g')).toBe('GN001')
      expect(result.get('e')).toBe('EXP001')
    })

    it('URL文字列を生成できる', () => {
      const assembly = createAssembly({
        rightArmUnit: {
          id: 'AU001',
          name: 'Test',
        } as Partial<ArmUnit> as ArmUnit,
        leftArmUnit: {
          id: 'AU001',
          name: 'Test',
        } as Partial<ArmUnit> as ArmUnit,
        rightBackUnit: {
          id: 'BU001',
          name: 'Test',
        } as Partial<BackUnit> as BackUnit,
        leftBackUnit: {
          id: 'BU001',
          name: 'Test',
        } as Partial<BackUnit> as BackUnit,
        head: { id: 'HD001', name: 'Test' } as Partial<Head> as Head,
        core: { id: 'CR001', name: 'Test' } as Partial<Core> as Core,
        arms: { id: 'AR001', name: 'Test' } as Partial<Arms> as Arms,
        legs: { id: 'LG001', name: 'Test' } as Partial<Legs> as Legs,
        booster: { id: 'BS001', name: 'Test' } as Partial<Booster> as Booster,
        fcs: { id: 'FCS001', name: 'Test' } as Partial<FCS> as FCS,
        generator: {
          id: 'GN001',
          name: 'Test',
        } as Partial<Generator> as Generator,
        expansion: {
          id: 'EXP001',
          name: 'Test',
        } as Partial<Expansion> as Expansion,
      } as RawAssembly)

      const result = assemblyToSearchV2(assembly)
      const urlString = result.toString()

      expect(urlString).toContain('v=2')
      expect(urlString).toContain('h=HD001')
      expect(urlString).toContain('c=CR001')
    })
  })
})
