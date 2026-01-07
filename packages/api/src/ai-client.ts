import { Result } from '@praha/byethrow'

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
  run(model: string, params: { prompt: string }): Promise<unknown>
}

/**
 * Workers AI を呼び出す
 * @param ai Cloudflare AI インスタンス
 * @param prompt プロンプト文字列
 * @returns AI レスポンスまたはエラー
 */
export async function callWorkersAI(
  ai: CloudflareAI,
  model: string,
  prompt: string,
): Promise<Result.Result<WorkersAIResponse, AIClientError>> {
  try {
    const response = await ai.run(model, {
      prompt,
    })

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
