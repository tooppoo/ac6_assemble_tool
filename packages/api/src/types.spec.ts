import { describe, it, expect } from 'vitest'
import type {
  SlotType,
  RecommendRequest,
  RecommendResponse,
  Recommendation,
  ErrorResponse,
} from './types'

describe('types', () => {
  describe('SlotType', () => {
    it('should include all valid slot types', () => {
      const validSlots: SlotType[] = [
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

      expect(validSlots).toHaveLength(10)
    })
  })

  describe('RecommendRequest', () => {
    it('should have query field', () => {
      const request: RecommendRequest = {
        query: 'test query',
      }

      expect(request.query).toBe('test query')
    })

    it('should have optional slot field', () => {
      const requestWithSlot: RecommendRequest = {
        query: 'test query',
        slot: 'head',
      }

      const requestWithoutSlot: RecommendRequest = {
        query: 'test query',
      }

      expect(requestWithSlot.slot).toBe('head')
      expect(requestWithoutSlot.slot).toBeUndefined()
    })
  })

  describe('Recommendation', () => {
    it('should have all required fields', () => {
      const recommendation: Recommendation = {
        partId: 'HD001',
        partName: 'AH-J-124 BASHO',
        reason: '高防御力でバランス型のため、汎用性が高い',
        score: 0.95,
      }

      expect(recommendation.partId).toBe('HD001')
      expect(recommendation.partName).toBe('AH-J-124 BASHO')
      expect(recommendation.reason).toBe('高防御力でバランス型のため、汎用性が高い')
      expect(recommendation.score).toBe(0.95)
    })
  })

  describe('RecommendResponse', () => {
    it('should have recommendations array', () => {
      const response: RecommendResponse = {
        recommendations: [
          {
            partId: 'HD001',
            partName: 'AH-J-124 BASHO',
            reason: '高防御力でバランス型のため、汎用性が高い',
            score: 0.95,
          },
        ],
      }

      expect(response.recommendations).toHaveLength(1)
      expect(response.recommendations[0].partId).toBe('HD001')
    })

    it('should allow empty recommendations array', () => {
      const response: RecommendResponse = {
        recommendations: [],
      }

      expect(response.recommendations).toHaveLength(0)
    })
  })

  describe('ErrorResponse', () => {
    it('should have error field with message', () => {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Invalid request',
        },
      }

      expect(errorResponse.error.message).toBe('Invalid request')
    })

    it('should have optional code field', () => {
      const errorWithCode: ErrorResponse = {
        error: {
          message: 'Invalid request',
          code: 'VALIDATION_ERROR',
        },
      }

      const errorWithoutCode: ErrorResponse = {
        error: {
          message: 'Invalid request',
        },
      }

      expect(errorWithCode.error.code).toBe('VALIDATION_ERROR')
      expect(errorWithoutCode.error.code).toBeUndefined()
    })
  })
})
