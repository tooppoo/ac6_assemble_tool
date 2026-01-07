import { Result } from '@praha/byethrow'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { CloudflareAI } from './ai-client'
import { callWorkersAI, AIClientError } from './ai-client'

describe('ai-client', () => {
  describe('callWorkersAI', () => {
    const mockAI = {
      run: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should call Workers AI with correct parameters', async () => {
      const prompt = 'Test prompt'
      const expectedResponse = { response: 'AI response' }

      mockAI.run.mockResolvedValue(expectedResponse)

      const result = await callWorkersAI(mockAI as CloudflareAI, prompt, prompt)

      expect(mockAI.run).toHaveBeenCalledWith(
        '@cf/meta/llama-3.1-8b-instruct-fast',
        {
          prompt,
        },
      )
      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as { response: string }
        expect(response).toEqual(expectedResponse)
      }
    })

    it('should return error when AI call fails', async () => {
      const prompt = 'Test prompt'
      const error = new Error('API error')

      mockAI.run.mockRejectedValue(error)

      const result = await callWorkersAI(mockAI as CloudflareAI, prompt, prompt)

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const err = Result.unwrapError(result) as AIClientError
        expect(err).toBeInstanceOf(AIClientError)
        expect(err.type).toBe('api_failed')
        expect(err.cause).toBe(error)
      }
    })

    it('should handle timeout error', async () => {
      const prompt = 'Test prompt'
      const timeoutError = new Error('Timeout')
      timeoutError.name = 'TimeoutError'

      mockAI.run.mockRejectedValue(timeoutError)

      const result = await callWorkersAI(mockAI as CloudflareAI, prompt, prompt)

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const err = Result.unwrapError(result) as AIClientError
        expect(err.type).toBe('timeout')
      }
    })

    it('should return error when response format is invalid', async () => {
      const prompt = 'Test prompt'
      mockAI.run.mockResolvedValue({ invalid: 'format' })

      const result = await callWorkersAI(mockAI as CloudflareAI, prompt, prompt)

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const err = Result.unwrapError(result) as AIClientError
        expect(err.type).toBe('invalid_format')
      }
    })
  })
})
