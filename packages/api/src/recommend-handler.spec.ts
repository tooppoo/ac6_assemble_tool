import { Result } from '@praha/byethrow'
import { describe, it, expect, vi } from 'vitest'

import { handleRecommendRequest } from './recommend-handler'
import type { RecommendRequest, RecommendResponse } from './types'
import { AIClient } from './ai/ai-client'

describe('recommend-handler', () => {
  describe('handleRecommendRequest', () => {
    it('should handle valid request and return recommendations', async () => {
      const mockAI: AIClient = {
        call: vi.fn().mockResolvedValue(Result.succeed({
          response: `高火力の武器をお探しですね。Test Headをお勧めします。

---RECOMMENDATIONS---
partId: HD001 | partName: Test Head | score: 0.9 | reason: Test reason`,
        })),
      }

      const request: RecommendRequest = {
        query: '高火力の武器',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as RecommendResponse
        expect(response.answer).toContain('高火力の武器をお探しですね')
        expect(response.recommendations).toHaveLength(1)
        expect(response.recommendations[0].partId).toBe('HD001')
        expect(response.recommendations[0].partName).toBe('Test Head')
        expect(response.recommendations[0].score).toBe(0.9)
      }
    })

    it('should handle request with slot filter', async () => {
      const mockAI: AIClient = {
        call: vi.fn().mockResolvedValue(Result.succeed({
          response: `軽量なヘッドパーツをお探しですね。Test Headをお勧めします。

---RECOMMENDATIONS---
partId: HD001 | partName: Test Head | score: 0.9 | reason: Test reason`,
        })),
      }

      const request: RecommendRequest = {
        query: '軽量なパーツ',
        slot: 'head',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as RecommendResponse
        expect(response.answer).toContain('軽量なヘッドパーツをお探しですね')
        expect(response.recommendations).toBeDefined()
        expect(response.recommendations).toHaveLength(1)
      }
    })

    it('should return error when AI client fails', async () => {
      const mockAI: AIClient = {
        call: vi.fn().mockResolvedValue(Result.fail(new Error('AI Error'))),
      }

      const request: RecommendRequest = {
        query: 'test query',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isFailure(result)).toBe(true)
    })

    it('should handle malformed AI response gracefully', async () => {
      const mockAI: AIClient = {
        call: vi.fn().mockResolvedValue(Result.succeed({
          response: 'invalid response without any markers or structure',
        })),
      }

      const request: RecommendRequest = {
        query: 'test query',
      }

      const result = await handleRecommendRequest(mockAI, request)

      // parseAIResponse always succeeds with graceful degradation
      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as RecommendResponse
        expect(response.answer).toBe(
          'invalid response without any markers or structure',
        )
        expect(response.recommendations).toHaveLength(0)
      }
    })

    it('should return empty recommendations when no parts match', async () => {
      const mockAI: AIClient = {
        call: vi.fn().mockResolvedValue(Result.succeed({
          response: `申し訳ございませんが、ご要望に合うパーツが見つかりませんでした。

---RECOMMENDATIONS---`,
        })),
      }

      const request: RecommendRequest = {
        query: 'non-existent part',
      }

      const result = await handleRecommendRequest(mockAI, request)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as RecommendResponse
        expect(response.answer).toContain('申し訳ございませんが')
        expect(response.recommendations).toHaveLength(0)
      }
    })
  })
})
