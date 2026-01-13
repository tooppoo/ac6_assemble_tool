import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import { createOpenAIClient } from './client/openai'
import { WorkerAiClient } from './client/worker-ai'

export interface AIClient {
  call(
    systemPrompt: string,
    userQuery: string,
  ): Promise<Result.Result<AIResponse, AIClientError>>
}

/**
 * AIクライアント共通レスポンス型
 */
export interface AIResponse {
  response: string
}

export function getAIClient(env: Cloudflare.Env): AIClient {
  switch (env.AI_CLIENT) {
    case 'openai':
      logger.debug('Using OpenAI client for AI interactions')
      return Result.unwrap(
        Result.pipe(
          createOpenAIClient(env),
          Result.orElse((error) => {
            logger.warn(
              'Failed to create OpenAI client, so using WorkerAiClient as fallback',
              { error: error.message },
            )

            return Result.succeed(new WorkerAiClient(env.AI))
          }),
        ),
      )
    case 'worker-ai':
    default:
      logger.debug('Using WorkerAiClient for AI interactions')
      return new WorkerAiClient(env.AI)
  }
}

/**
 * AI クライアントエラー
 */
export class AIClientError extends Error {
  constructor(
    message: string,
    public readonly type: 'api_failed' | 'timeout' | 'invalid_format',
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AIClientError'
  }
}
