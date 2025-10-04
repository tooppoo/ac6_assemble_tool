import { deserializeAssembly } from '#core/assembly/serialize/deserialize-assembly'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { describe, it, expect } from 'vitest'

describe('機体構成デシリアライザー統合', () => {
  const mockCandidates: Candidates = {
    rightArmUnit: [
      { id: 'AU001', name: 'Arm Unit 1' } as any,
      { id: 'AU002', name: 'Arm Unit 2' } as any,
    ],
    leftArmUnit: [
      { id: 'AU001', name: 'Arm Unit 1' } as any,
      { id: 'AU003', name: 'Left Arm Unit 3' } as any,
    ],
    rightBackUnit: [
      { id: 'BU001', name: 'Back Unit 1' } as any,
      { id: 'BU002', name: 'Back Unit 2' } as any,
    ],
    leftBackUnit: [
      { id: 'BU001', name: 'Back Unit 1' } as any,
      { id: 'BU003', name: 'Left Back Unit 3' } as any,
    ],
    head: [
      { id: 'HD001', name: 'Head 1' } as any,
      { id: 'HD002', name: 'Head 2' } as any,
    ],
    core: [
      { id: 'CR001', name: 'Core 1' } as any,
      { id: 'CR002', name: 'Core 2' } as any,
    ],
    arms: [
      { id: 'AR001', name: 'Arms 1' } as any,
      { id: 'AR002', name: 'Arms 2' } as any,
    ],
    legs: [
      { id: 'LG001', name: 'Legs 1' } as any,
      { id: 'LG002', name: 'Legs 2' } as any,
    ],
    booster: [
      { id: 'BS001', name: 'Booster 1' } as any,
      { id: 'BS002', name: 'Booster 2' } as any,
    ],
    fcs: [
      { id: 'FCS001', name: 'FCS 1' } as any,
      { id: 'FCS002', name: 'FCS 2' } as any,
    ],
    generator: [
      { id: 'GN001', name: 'Generator 1' } as any,
      { id: 'GN002', name: 'Generator 2' } as any,
    ],
    expansion: [
      { id: 'EXP001', name: 'Expansion 1' } as any,
      { id: 'EXP002', name: 'Expansion 2' } as any,
    ],
  }

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

      expect(result.rightArmUnit.id).toBe('AU001')
      expect(result.leftArmUnit.id).toBe('AU003')
      expect(result.rightBackUnit.id).toBe('BU001')
      expect(result.leftBackUnit.id).toBe('BU003')
      expect(result.head.id).toBe('HD001')
      expect(result.core.id).toBe('CR002')
      expect(result.arms.id).toBe('AR001')
      expect(result.legs.id).toBe('LG001')
      expect(result.booster.id).toBe('BS001')
      expect(result.fcs.id).toBe('FCS001')
      expect(result.generator.id).toBe('GN001')
      expect(result.expansion.id).toBe('EXP001')
    })

    it('空のURLSearchParamsの場合は各配列の最初の要素を使用', () => {
      const params = new URLSearchParams()

      const result = deserializeAssembly(params, mockCandidates)

      expect(result.head.id).toBe('HD001')
      expect(result.core.id).toBe('CR001')
      expect(result.arms.id).toBe('AR001')
      expect(result.legs.id).toBe('LG001')
    })
  })
})
