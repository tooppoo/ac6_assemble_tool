import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { getAIClient } from './ai-client'
import { WorkerAiClient } from './client/worker-ai'

const { createOpenAIClientMock } = vi.hoisted(() => {
  return {
    createOpenAIClientMock: vi.fn(),
  }
})

vi.mock('./client/openai', () => ({
  createOpenAIClient: createOpenAIClientMock,
}))

describe('ai-client', () => {
  beforeEach(() => {
    createOpenAIClientMock.mockReset()
  })

  describe('getAIClient', () => {
    it('should return OpenAI client when createOpenAIClient succeeds', () => {
      const fakeClient = { call: vi.fn() }
      createOpenAIClientMock.mockReturnValue(Result.succeed(fakeClient))

      const env = {
        AI_CLIENT: 'openai',
        AI: { run: vi.fn() },
      } as unknown as Cloudflare.Env

      const client = getAIClient(env)

      expect(createOpenAIClientMock).toHaveBeenCalledWith(env)
      expect(client).toBe(fakeClient)
    })

    it('should fallback to WorkerAiClient when createOpenAIClient fails', () => {
      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {})
      createOpenAIClientMock.mockReturnValue(
        Result.fail(new Error('init failed')),
      )

      const env = {
        AI_CLIENT: 'openai',
        AI: { run: vi.fn() },
      } as unknown as Cloudflare.Env

      const client = getAIClient(env)

      expect(client).toBeInstanceOf(WorkerAiClient)
      expect(warnSpy).toHaveBeenCalledWith(
        'Failed to create OpenAI client, so using WorkerAiClient as fallback',
        { error: 'init failed' },
      )
      warnSpy.mockRestore()
    })

    it('should return WorkerAiClient when AI_CLIENT is worker-ai', () => {
      const env = {
        AI_CLIENT: 'worker-ai',
        AI: { run: vi.fn() },
      } as unknown as Cloudflare.Env

      const client = getAIClient(env)

      expect(client).toBeInstanceOf(WorkerAiClient)
    })

    it('should return WorkerAiClient when AI_CLIENT is unknown', () => {
      const env = {
        AI_CLIENT: 'unknown',
        AI: { run: vi.fn() },
      } as unknown as Cloudflare.Env

      const client = getAIClient(env)

      expect(client).toBeInstanceOf(WorkerAiClient)
    })
  })
})
