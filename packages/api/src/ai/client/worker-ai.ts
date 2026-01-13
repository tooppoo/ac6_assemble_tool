import { Result } from '@praha/byethrow'

import { type AIClient, AIClientError, type AIResponse } from '../ai-client'

/**
 * Workers AI レスポンス型
 */
export interface WorkersAIResponse {
  response: string
}

/**
 * Cloudflare Workers AI インターフェース
 */
export interface CloudflareAI {
  run(model: string, params: unknown): Promise<unknown>
}

export class WorkerAiClient implements AIClient {
  constructor(private readonly ai: CloudflareAI) {}

  async call(
    systemPrompt: string,
    userQuery: string,
  ): Promise<Result.Result<AIResponse, AIClientError>> {
    try {
      const response = await this.ai.run(
        '@cf/meta/llama-3.1-8b-instruct-fast',
        {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
          ],
        },
      )

      // レスポンス形式の検証
      if (
        typeof response !== 'object' ||
        response === null ||
        !('response' in response) ||
        typeof (response as { response: string }).response !== 'string'
      ) {
        return Result.fail(
          new AIClientError(
            'Invalid response format from Workers AI',
            'invalid_format',
          ),
        )
      }

      return Result.succeed(response as WorkersAIResponse)
    } catch (error) {
      // タイムアウトエラーのハンドリング
      if (error instanceof Error && error.name === 'TimeoutError') {
        return Result.fail(
          new AIClientError('Workers AI request timed out', 'timeout', error),
        )
      }

      // その他のエラー
      return Result.fail(
        new AIClientError('Failed to call Workers AI', 'api_failed', error),
      )
    }
  }
}
