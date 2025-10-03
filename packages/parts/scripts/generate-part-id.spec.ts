import { describe, it, expect } from 'vitest'
import {  generateNextId, categoryToCode } from './generate-part-id'

describe('ID生成スクリプト', () => {
  describe('categoryToCode', () => {
    it('headカテゴリはHDコードにマップされる', () => {
      expect(categoryToCode('head')).toBe('HD')
    })

    it('coreカテゴリはCRコードにマップされる', () => {
      expect(categoryToCode('core')).toBe('CR')
    })

    it('armsカテゴリはARコードにマップされる', () => {
      expect(categoryToCode('arms')).toBe('AR')
    })

    it('legsカテゴリはLGコードにマップされる', () => {
      expect(categoryToCode('legs')).toBe('LG')
    })

    it('boosterカテゴリはBSコードにマップされる', () => {
      expect(categoryToCode('booster')).toBe('BS')
    })

    it('fcsカテゴリはFCSコードにマップされる', () => {
      expect(categoryToCode('fcs')).toBe('FCS')
    })

    it('generatorカテゴリはGNコードにマップされる', () => {
      expect(categoryToCode('generator')).toBe('GN')
    })

    it('expansionカテゴリはEXPコードにマップされる', () => {
      expect(categoryToCode('expansion')).toBe('EXP')
    })

    it('arm-unitカテゴリはAUコードにマップされる', () => {
      expect(categoryToCode('arm-unit')).toBe('AU')
    })

    it('back-unitカテゴリはBUコードにマップされる', () => {
      expect(categoryToCode('back-unit')).toBe('BU')
    })

    it('未知のカテゴリはエラーをスローする', () => {
      expect(() => categoryToCode('unknown')).toThrow('Unknown category: unknown')
    })
  })

  describe('generateNextId', () => {
    it('既存IDがない場合は001から始まる', () => {
      const nextId = generateNextId('head', [])
      expect(nextId).toBe('HD001')
    })

    it('既存IDがある場合は次の連番を生成する', () => {
      const existingIds = ['HD001', 'HD002', 'HD003']
      const nextId = generateNextId('head', existingIds)
      expect(nextId).toBe('HD004')
    })

    it('連番は3桁でゼロパディングされる', () => {
      const existingIds = ['HD008']
      const nextId = generateNextId('head', existingIds)
      expect(nextId).toBe('HD009')
    })

    it('連番が100を超える場合も正しく生成される', () => {
      const existingIds = Array.from({ length: 150 }, (_, i) => `CR${String(i + 1).padStart(3, '0')}`)
      const nextId = generateNextId('core', existingIds)
      expect(nextId).toBe('CR151')
    })

    it('他のカテゴリのIDは無視される', () => {
      const existingIds = ['HD001', 'CR001', 'HD002', 'AR001']
      const nextId = generateNextId('head', existingIds)
      expect(nextId).toBe('HD003')
    })

    it('ID形式が不正な場合はスキップされる', () => {
      const existingIds = ['HD001', 'INVALID', 'HD002']
      const nextId = generateNextId('head', existingIds)
      expect(nextId).toBe('HD003')
    })

    it('生成されるIDは{カテゴリコード}{3-4桁連番}の形式である', () => {
      const nextId = generateNextId('fcs', [])
      expect(nextId).toMatch(/^FCS\d{3,4}$/)
    })
  })
})
