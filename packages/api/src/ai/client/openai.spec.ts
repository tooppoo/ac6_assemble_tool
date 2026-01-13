import { Result } from '@praha/byethrow'
import type OpenAI from 'openai'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { createOpenAIClient, OpenAIClient } from './openai'

const { OpenAIMock } = vi.hoisted(() => {
  return {
    OpenAIMock: vi.fn(),
  }
})

vi.mock('openai', () => ({
  default: OpenAIMock,
}))

describe('openai', () => {
  beforeEach(() => {
    OpenAIMock.mockReset()
  })

  describe('createOpenAIClient', () => {
    it('should fail when OPENAI_API_KEY is missing', () => {
      const result = createOpenAIClient({
        OPENAI_API_KEY: '',
        OPENAI_API_MODEL: 'model',
      })

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const error = Result.unwrapError(result)
        expect(error.message).toBe(
          'OPENAI_API_KEY is not set in environment variables',
        )
      }
    })

    it('should fail when OPENAI_API_ENDPOINT is missing', () => {
      const result = createOpenAIClient({
        OPENAI_API_KEY: 'key',
        OPENAI_API_MODEL: 'model',
      })

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const error = Result.unwrapError(result)
        expect(error.message).toBe(
          'OPENAI_API_ENDPOINT is not set in environment variables',
        )
      }
    })

    it('should create client with specified model', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      })
      let latestInstance: unknown
      OpenAIMock.mockImplementation((options: unknown) => {
        latestInstance = {
          chat: { completions: { create } },
          options,
        }
        return latestInstance
      })

      const env = {
        OPENAI_API_KEY: 'key',
        OPENAI_API_MODEL: 'gpt-test',
      }

      const result = createOpenAIClient(env)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const client = Result.unwrap(result)
        await client.call('system', 'user')
      }

      expect(OpenAIMock).toHaveBeenCalled()
      expect(create).toHaveBeenCalledWith({
        model: 'gpt-test',
        messages: [
          { role: 'system', content: 'system' },
          { role: 'user', content: 'user' },
        ],
      })
      expect(latestInstance).toBeDefined()
    })

    it('should default model when OPENAI_API_MODEL is missing', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      })
      OpenAIMock.mockImplementation(() => ({
        chat: { completions: { create } },
      }))

      const env = {
        OPENAI_API_KEY: 'key',
        OPENAI_API_MODEL: '',
      }

      const result = createOpenAIClient(env)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const client = Result.unwrap(result)
        await client.call('system', 'user')
      }

      expect(create).toHaveBeenCalledWith({
        model: 'gpt-5-nano-2025-08-07',
        messages: [
          { role: 'system', content: 'system' },
          { role: 'user', content: 'user' },
        ],
      })
    })
  })

  describe('OpenAIClient.call', () => {
    it('should return success when response has content', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [
          { message: { content: 'first' } },
          { message: { content: 'second' } },
        ],
      })
      const client = new OpenAIClient(
        { chat: { completions: { create } } } as unknown as OpenAI,
        'model',
      )

      const result = await client.call('system', 'user')

      expect(create).toHaveBeenCalledWith({
        model: 'model',
        messages: [
          { role: 'system', content: 'system' },
          { role: 'user', content: 'user' },
        ],
      })
      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        expect(Result.unwrap(result).response).toBe('firstsecond')
      }
    })

    it('should return invalid_format when no choices', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [],
      })
      const client = new OpenAIClient(
        { chat: { completions: { create } } } as unknown as OpenAI,
        'model',
      )

      const result = await client.call('system', 'user')

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const error = Result.unwrapError(result)
        expect(error.type).toBe('invalid_format')
        expect(error.message).toBe('No choices returned from OpenAI')
      }
    })

    it('should return invalid_format when response is empty', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [{ message: { content: '   ' } }],
      })
      const client = new OpenAIClient(
        { chat: { completions: { create } } } as unknown as OpenAI,
        'model',
      )

      const result = await client.call('system', 'user')

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const error = Result.unwrapError(result)
        expect(error.type).toBe('invalid_format')
        expect(error.message).toBe('Empty response from OpenAI')
      }
    })

    it('should return api_failed when client throws', async () => {
      const failure = new Error('boom')
      const create = vi.fn().mockRejectedValue(failure)
      const client = new OpenAIClient(
        { chat: { completions: { create } } } as unknown as OpenAI,
        'model',
      )

      const result = await client.call('system', 'user')

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const error = Result.unwrapError(result)
        expect(error.type).toBe('api_failed')
        expect(error.cause).toBe(failure)
      }
    })
  })
})
