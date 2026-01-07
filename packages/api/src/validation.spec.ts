import * as v from 'valibot'
import { describe, it, expect } from 'vitest'

import { RecommendRequestSchema } from './validation'

describe('RecommendRequestSchema', () => {
  describe('正常系', () => {
    it('should validate request with query only', () => {
      const input = {
        query: 'test query',
      }

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.output.query).toBe('test query')
        expect(result.output.slot).toBeUndefined()
      }
    })

    it('should validate request with query and slot', () => {
      const input = {
        query: 'test query',
        slot: 'head',
      }

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.output.query).toBe('test query')
        expect(result.output.slot).toBe('head')
      }
    })

    it('should validate all valid slot types', () => {
      const validSlots = [
        'head',
        'arms',
        'core',
        'legs',
        'booster',
        'fcs',
        'generator',
        'arm-unit',
        'back-unit',
        'expansion',
      ]

      for (const slot of validSlots) {
        const input = {
          query: 'test query',
          slot,
        }

        const result = v.safeParse(RecommendRequestSchema, input)

        expect(result.success).toBe(true)
      }
    })
  })

  describe('異常系', () => {
    it('should fail when query is empty string', () => {
      const input = {
        query: '',
      }

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.issues.length).toBeGreaterThan(0)
      }
    })

    it('should fail when query is missing', () => {
      const input = {}

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.issues.length).toBeGreaterThan(0)
      }
    })

    it('should fail when query is not a string', () => {
      const input = {
        query: 123,
      }

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.issues.length).toBeGreaterThan(0)
      }
    })

    it('should fail when slot is invalid', () => {
      const input = {
        query: 'test query',
        slot: 'invalid-slot',
      }

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.issues.length).toBeGreaterThan(0)
      }
    })

    it('should fail when slot is not a string', () => {
      const input = {
        query: 'test query',
        slot: 123,
      }

      const result = v.safeParse(RecommendRequestSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.issues.length).toBeGreaterThan(0)
      }
    })
  })
})
