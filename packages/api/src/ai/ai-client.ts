import { Result } from "@praha/byethrow";

export interface AIClient {
  call(systemPrompt: string, userQuery: string): Promise<Result.Result<AIResponse, AIClientError>>;
}

/**
 * AI レスポンス型（Cloudflare Workers AI）
 */
export interface AIResponse {
  response: string
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
