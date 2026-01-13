import { Result } from '@praha/byethrow'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { AIClientError } from '../ai-client'

import type { CloudflareAI } from './worker-ai'
import { WorkerAiClient } from './worker-ai'

describe('worker-ai', () => {
  describe('WorkerAiClient', () => {
    const mockAI = {
      run: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should call Workers AI with correct parameters', async () => {
      const systemPrompt = 'Test system prompt'
      const userQuery = 'Test user prompt'
      const expectedResponse = { response: 'AI response' }

      mockAI.run.mockResolvedValue(expectedResponse)

      const client = new WorkerAiClient(mockAI as CloudflareAI)
      const result = await client.call(systemPrompt, userQuery)

      expect(mockAI.run).toHaveBeenCalledWith(
        '@cf/meta/llama-3.1-8b-instruct-fast',
        {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
          ],
        },
      )
      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const response = Result.unwrap(result) as { response: string }
        expect(response).toEqual(expectedResponse)
      }
    })

    it('should return error when AI call fails', async () => {
      const systemPrompt = 'Test system prompt'
      const userQuery = 'Test user prompt'
      const error = new Error('API error')

      mockAI.run.mockRejectedValue(error)

      const client = new WorkerAiClient(mockAI as CloudflareAI)
      const result = await client.call(systemPrompt, userQuery)

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const err = Result.unwrapError(result) as AIClientError
        expect(err).toBeInstanceOf(AIClientError)
        expect(err.type).toBe('api_failed')
        expect(err.cause).toBe(error)
      }
    })

    it('should handle timeout error', async () => {
      const systemPrompt = 'Test system prompt'
      const userQuery = 'Test user prompt'
      const timeoutError = new Error('Timeout')
      timeoutError.name = 'TimeoutError'

      mockAI.run.mockRejectedValue(timeoutError)

      const client = new WorkerAiClient(mockAI as CloudflareAI)
      const result = await client.call(systemPrompt, userQuery)

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const err = Result.unwrapError(result) as AIClientError
        expect(err.type).toBe('timeout')
      }
    })

    it('should return error when response format is invalid', async () => {
      const systemPrompt = 'Test system prompt'
      const userQuery = 'Test user prompt'

      mockAI.run.mockResolvedValue({ invalid: 'format' })

      const client = new WorkerAiClient(mockAI as CloudflareAI)
      const result = await client.call(systemPrompt, userQuery)

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const err = Result.unwrapError(result) as AIClientError
        expect(err.type).toBe('invalid_format')
      }
    })
  })
})
