import { describe, it, expectTypeOf, assertType } from 'vitest'

import type {
  SlotType,
  RecommendRequest,
  RecommendResponse,
  Recommendation,
  ErrorResponse,
} from './types'

describe('types', () => {
  describe('SlotType', () => {
    it('should be a union of valid slot types', () => {
      expectTypeOf<SlotType>().toEqualTypeOf<
        | 'head'
        | 'arms'
        | 'core'
        | 'legs'
        | 'booster'
        | 'fcs'
        | 'generator'
        | 'arm-unit'
        | 'back-unit'
        | 'expansion'
      >()
    })

    it('should accept valid slot values', () => {
      // 型レベルでの代入可能性チェック
      assertType<SlotType>('head')
      assertType<SlotType>('arms')
      assertType<SlotType>('core')
      assertType<SlotType>('legs')
      assertType<SlotType>('booster')
      assertType<SlotType>('fcs')
      assertType<SlotType>('generator')
      assertType<SlotType>('arm-unit')
      assertType<SlotType>('back-unit')
      assertType<SlotType>('expansion')
    })
  })

  describe('RecommendRequest', () => {
    it('should have required query field of type string', () => {
      expectTypeOf<RecommendRequest>().toHaveProperty('query').toBeString()
    })

    it('should have optional slot field of type SlotType', () => {
      expectTypeOf<RecommendRequest>()
        .toHaveProperty('slot')
        .toEqualTypeOf<SlotType | undefined>()
    })

    it('should accept valid request objects', () => {
      assertType<RecommendRequest>({ query: 'test' })
      assertType<RecommendRequest>({ query: 'test', slot: 'head' })
      assertType<RecommendRequest>({ query: 'test', slot: undefined })
    })
  })

  describe('Recommendation', () => {
    it('should have required string fields', () => {
      expectTypeOf<Recommendation>().toHaveProperty('partId').toBeString()
      expectTypeOf<Recommendation>().toHaveProperty('partName').toBeString()
      expectTypeOf<Recommendation>().toHaveProperty('reason').toBeString()
    })

    it('should have required score field of type number', () => {
      expectTypeOf<Recommendation>().toHaveProperty('score').toBeNumber()
    })

    it('should accept valid recommendation objects', () => {
      assertType<Recommendation>({
        partId: 'HD001',
        partName: 'AH-J-124 BASHO',
        reason: '高防御力',
        score: 0.95,
      })
    })
  })

  describe('RecommendResponse', () => {
    it('should have required answer field of type string', () => {
      expectTypeOf<RecommendResponse>().toHaveProperty('answer').toBeString()
    })

    it('should have required recommendations field of type Recommendation array', () => {
      expectTypeOf<RecommendResponse>()
        .toHaveProperty('recommendations')
        .toEqualTypeOf<Recommendation[]>()
    })

    it('should accept valid response objects', () => {
      assertType<RecommendResponse>({
        answer: 'test answer',
        recommendations: [],
      })

      assertType<RecommendResponse>({
        answer: 'test answer',
        recommendations: [
          {
            partId: 'HD001',
            partName: 'AH-J-124 BASHO',
            reason: '高防御力',
            score: 0.95,
          },
        ],
      })
    })
  })

  describe('ErrorResponse', () => {
    it('should have required error field with message', () => {
      expectTypeOf<ErrorResponse>()
        .toHaveProperty('error')
        .toHaveProperty('message')
        .toBeString()
    })

    it('should have optional code field', () => {
      expectTypeOf<ErrorResponse>()
        .toHaveProperty('error')
        .toHaveProperty('code')
        .toEqualTypeOf<string | undefined>()
    })

    it('should accept valid error objects', () => {
      assertType<ErrorResponse>({
        error: { message: 'Invalid request' },
      })

      assertType<ErrorResponse>({
        error: { message: 'Invalid request', code: 'VALIDATION_ERROR' },
      })
    })
  })
})
