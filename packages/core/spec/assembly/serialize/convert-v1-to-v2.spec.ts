import { convertV1ToV2 } from '#core/assembly/serialize/convert-v1-to-v2'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { describe, it, expect } from 'vitest'

describe('v1→v2変換', () => {
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

      expect(result.get('v')).toBe('2')
      expect(result.get('rau')).toBe('AU001')
      expect(result.get('lau')).toBe('AU003')
      expect(result.get('rbu')).toBe('BU001')
      expect(result.get('lbu')).toBe('BU003')
      expect(result.get('h')).toBe('HD001')
      expect(result.get('c')).toBe('CR001')
      expect(result.get('a')).toBe('AR001')
      expect(result.get('l')).toBe('LG001')
      expect(result.get('b')).toBe('BS001')
      expect(result.get('f')).toBe('FCS001')
      expect(result.get('g')).toBe('GN001')
      expect(result.get('e')).toBe('EXP001')
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

      // 範囲外のインデックスは配列の最初の要素にフォールバック
      expect(result.get('h')).toBe('HD001')
    })

    it('パラメータが欠けている場合は配列の最初の要素を使用', () => {
      const v1Params = new URLSearchParams({
        // headパラメータなし
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
  })
})
