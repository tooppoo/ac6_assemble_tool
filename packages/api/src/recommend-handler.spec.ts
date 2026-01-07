import { describe, it, expect, vi } from 'vitest'
import { Result } from '@praha/byethrow'
import { handleRecommendRequest } from './recommend-handler'
import type { CloudflareAI } from './ai-client'
import type { RecommendRequest } from './types'

describe('recommend-handler', () => {
  describe('handleRecommendRequest', () => {
    it('should handle valid request and return recommendations', async () => {
      const mockAI: CloudflareAI = {
        run: vi.fn().mockResolvedValue({
          response: JSON.stringify({
            recommendations: [
              { partId: 'HD001', partName: 'Test Head', reason: 'Test reason', score: 0.9 },
            ],
          }),
        }),
      }

      const request: RecommendRequest = {
        query: '高火力の武器',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as any
        expect(response.recommendations).toHaveLength(1)
        expect(response.recommendations[0].partId).toBe('HD001')
      }
    })

    it('should handle request with slot filter', async () => {
      const mockAI: CloudflareAI = {
        run: vi.fn().mockResolvedValue({
          response: JSON.stringify({
            recommendations: [
              { partId: 'HD001', partName: 'Test Head', reason: 'Test reason', score: 0.9 },
            ],
          }),
        }),
      }

      const request: RecommendRequest = {
        query: '軽量なパーツ',
        slot: 'head',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as any
        expect(response.recommendations).toBeDefined()
      }
    })

    it('should return error when AI client fails', async () => {
      const mockAI: CloudflareAI = {
        run: vi.fn().mockRejectedValue(new Error('AI Error')),
      }

      const request: RecommendRequest = {
        query: 'test query',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isFailure(result)).toBe(true)
    })

    it('should return error when AI response parsing fails', async () => {
      const mockAI: CloudflareAI = {
        run: vi.fn().mockResolvedValue({
          response: 'invalid json',
        }),
      }

      const request: RecommendRequest = {
        query: 'test query',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isFailure(result)).toBe(true)
    })

    it('should return empty recommendations when no parts match', async () => {
      const mockAI: CloudflareAI = {
        run: vi.fn().mockResolvedValue({
          response: JSON.stringify({
            recommendations: [],
          }),
        }),
      }

      const request: RecommendRequest = {
        query: 'non-existent part',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as any
        expect(response.recommendations).toHaveLength(0)
      }
    })
  })
})
