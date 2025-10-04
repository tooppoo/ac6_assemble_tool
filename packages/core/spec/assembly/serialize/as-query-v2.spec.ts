import { createAssembly } from '#core/assembly/assembly'
import { assemblyToSearchV2 } from '#core/assembly/serialize/as-query-v2'

import { describe, it, expect } from 'vitest'

describe('v2形式URLシリアライザー', () => {
  describe('assemblyToSearchV2', () => {
    it('v=2パラメータを含む', () => {
      const assembly = createAssembly({
        rightArmUnit: { id: 'AU001', name: 'Test Arm Unit' } as any,
        leftArmUnit: { id: 'AU002', name: 'Test Left Arm' } as any,
        rightBackUnit: { id: 'BU001', name: 'Test Back Unit' } as any,
        leftBackUnit: { id: 'BU002', name: 'Test Left Back' } as any,
        head: { id: 'HD001', name: 'Test Head' } as any,
        core: { id: 'CR001', name: 'Test Core' } as any,
        arms: { id: 'AR001', name: 'Test Arms' } as any,
        legs: { id: 'LG001', name: 'Test Legs' } as any,
        booster: { id: 'BS001', name: 'Test Booster' } as any,
        fcs: { id: 'FCS001', name: 'Test FCS' } as any,
        generator: { id: 'GN001', name: 'Test Generator' } as any,
        expansion: { id: 'EXP001', name: 'Test Expansion' } as any,
      })

      const result = assemblyToSearchV2(assembly)

      expect(result.get('v')).toBe('2')
    })

    it('各部位のパーツIDをクエリパラメータに含む', () => {
      const assembly = createAssembly({
        rightArmUnit: { id: 'AU001', name: 'Test' } as any,
        leftArmUnit: { id: 'AU002', name: 'Test' } as any,
        rightBackUnit: { id: 'BU001', name: 'Test' } as any,
        leftBackUnit: { id: 'BU002', name: 'Test' } as any,
        head: { id: 'HD001', name: 'Test' } as any,
        core: { id: 'CR001', name: 'Test' } as any,
        arms: { id: 'AR001', name: 'Test' } as any,
        legs: { id: 'LG001', name: 'Test' } as any,
        booster: { id: 'BS001', name: 'Test' } as any,
        fcs: { id: 'FCS001', name: 'Test' } as any,
        generator: { id: 'GN001', name: 'Test' } as any,
        expansion: { id: 'EXP001', name: 'Test' } as any,
      })

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
        rightArmUnit: { id: 'AU001', name: 'Test' } as any,
        leftArmUnit: { id: 'AU001', name: 'Test' } as any,
        rightBackUnit: { id: 'BU001', name: 'Test' } as any,
        leftBackUnit: { id: 'BU001', name: 'Test' } as any,
        head: { id: 'HD001', name: 'Test' } as any,
        core: { id: 'CR001', name: 'Test' } as any,
        arms: { id: 'AR001', name: 'Test' } as any,
        legs: { id: 'LG001', name: 'Test' } as any,
        booster: { id: 'BS001', name: 'Test' } as any,
        fcs: { id: 'FCS001', name: 'Test' } as any,
        generator: { id: 'GN001', name: 'Test' } as any,
        expansion: { id: 'EXP001', name: 'Test' } as any,
      })

      const result = assemblyToSearchV2(assembly)
      const urlString = result.toString()

      expect(urlString).toContain('v=2')
      expect(urlString).toContain('h=HD001')
      expect(urlString).toContain('c=CR001')
    })
  })
})
