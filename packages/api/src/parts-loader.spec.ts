import { describe, it, expect } from 'vitest'

import { loadParts, filterBySlot, extractAIData } from './parts-loader'

describe('parts-loader', () => {
  describe('loadParts', () => {
    it('should load all parts when slot is not specified', () => {
      const parts = loadParts()

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.id)).toBe(true)
      expect(parts.every((p) => p.name)).toBe(true)
      expect(parts.every((p) => p.ai_summary)).toBe(true)
      expect(parts.every((p) => p.ai_tags)).toBe(true)
    })

    it('should load only head parts when slot is "head"', () => {
      const parts = loadParts('head')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'head')).toBe(true)
    })

    it('should load only arms parts when slot is "arms"', () => {
      const parts = loadParts('arms')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'arms')).toBe(true)
    })

    it('should load only core parts when slot is "core"', () => {
      const parts = loadParts('core')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'core')).toBe(true)
    })

    it('should load only legs parts when slot is "legs"', () => {
      const parts = loadParts('legs')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'legs')).toBe(true)
    })

    it('should load only booster parts when slot is "booster"', () => {
      const parts = loadParts('booster')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'booster')).toBe(true)
    })

    it('should load only fcs parts when slot is "fcs"', () => {
      const parts = loadParts('fcs')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'fcs')).toBe(true)
    })

    it('should load only generator parts when slot is "generator"', () => {
      const parts = loadParts('generator')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'generator')).toBe(true)
    })

    it('should load only arm-unit parts when slot is "arm-unit"', () => {
      const parts = loadParts('arm-unit')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'arm-unit')).toBe(true)
    })

    it('should load only back-unit parts when slot is "back-unit"', () => {
      const parts = loadParts('back-unit')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'back-unit')).toBe(true)
    })

    it('should load only expansion parts when slot is "expansion"', () => {
      const parts = loadParts('expansion')

      expect(parts.length).toBeGreaterThan(0)
      expect(parts.every((p) => p.classification === 'expansion')).toBe(true)
    })
  })

  describe('filterBySlot', () => {
    it('should filter parts by classification', () => {
      const allParts = loadParts()
      const headParts = filterBySlot(allParts, 'head')

      expect(headParts.length).toBeGreaterThan(0)
      expect(headParts.every((p) => p.classification === 'head')).toBe(true)
      expect(headParts.length).toBeLessThan(allParts.length)
    })

    it('should return all parts when slot is undefined', () => {
      const allParts = loadParts()
      const filtered = filterBySlot(allParts, undefined)

      expect(filtered.length).toBe(allParts.length)
    })
  })

  describe('extractAIData', () => {
    it('should extract AI-relevant fields from parts', () => {
      const parts = loadParts('head')
      const aiData = extractAIData(parts)

      expect(aiData.length).toBe(parts.length)
      expect(aiData.every((d) => d.id)).toBe(true)
      expect(aiData.every((d) => d.name)).toBe(true)
      expect(aiData.every((d) => d.summary)).toBe(true)
      expect(aiData.every((d) => d.tags)).toBe(true)
    })

    it('should map ai_summary to summary field', () => {
      const parts = loadParts('head')
      const aiData = extractAIData(parts)

      expect(aiData[0].summary).toBe(parts[0].ai_summary)
    })

    it('should map ai_tags to tags field', () => {
      const parts = loadParts('head')
      const aiData = extractAIData(parts)

      expect(aiData[0].tags).toBe(parts[0].ai_tags)
    })
  })
})
