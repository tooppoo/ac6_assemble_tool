import { Result } from '@praha/byethrow'
import type OpenAI from 'openai'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { createOpenAIClient, OpenAIClient } from './openai'

const { OpenAIMock, setCreateMock, getLatestOptions, resetOpenAIMock } =
  vi.hoisted(() => {
    // OpenAIは`new OpenAI()`で生成されるため、constructableなモックを用意し、
    // 内部に`chat.completions.create`を差し込んで呼び出し検証ができるようにする。
    let createMock = vi.fn()
    let latestOptions: unknown
    const OpenAIMock = vi.fn(function OpenAIMock(
      this: {
        chat: { completions: { create: (...args: unknown[]) => unknown } }
        options?: unknown
      },
      options: unknown,
    ) {
      latestOptions = options
      this.chat = { completions: { create: createMock } }
      this.options = options
    })

    return {
      OpenAIMock,
      setCreateMock: (next: typeof createMock) => {
        createMock = next
      },
      getLatestOptions: () => latestOptions,
      resetOpenAIMock: () => {
        createMock = vi.fn()
        latestOptions = undefined
        OpenAIMock.mockClear()
      },
    }
  })

vi.mock('openai', () => ({
  default: OpenAIMock,
}))

describe('openai', () => {
  beforeEach(() => {
    resetOpenAIMock()
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

    it('should create client with specified model', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      })
      setCreateMock(create)

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

      expect(OpenAIMock).toHaveBeenCalledWith({
        apiKey: 'key',
      })
      expect(create).toHaveBeenCalledWith({
        model: 'gpt-test',
        messages: [
          { role: 'system', content: 'system' },
          { role: 'user', content: 'user' },
        ],
      })
      expect(getLatestOptions()).toEqual({
        apiKey: 'key',
      })
    })

    it('should default model when OPENAI_API_MODEL is missing', async () => {
      const create = vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'ok' } }],
      })
      setCreateMock(create)

      const env = {
        OPENAI_API_KEY: 'key',
        OPENAI_API_MODEL: undefined,
      }

      const result = createOpenAIClient(env)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const client = Result.unwrap(result)
        await client.call('system', 'user')
      }

      expect(create).toHaveBeenCalledWith({
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: 'system' },
          { role: 'user', content: 'user' },
        ],
      })
    })

    it('should fail when OpenAI constructor throws', () => {
      OpenAIMock.mockImplementationOnce(function OpenAIMockFail() {
        throw new Error('init failed')
      })

      const result = createOpenAIClient({
        OPENAI_API_KEY: 'key',
        OPENAI_API_MODEL: 'model',
      })

      expect(Result.isFailure(result)).toBe(true)
      if (Result.isFailure(result)) {
        const error = Result.unwrapError(result)
        expect(error.message).toBe(
          'Failed to create OpenAI client: init failed',
        )
      }
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
