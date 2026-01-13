import { Result } from "@praha/byethrow";
import { OpenAIClient } from "./client/openai";
import { WorkerAiClient } from "./client/worker-ai";

export interface AIClient {
  call(systemPrompt: string, userQuery: string): Promise<Result.Result<AIResponse, AIClientError>>;
}

/**
 * AI レスポンス型（Cloudflare Workers AI）
 */
export interface AIResponse {
  response: string
}

export function getAIClient(env: Cloudflare.Env): AIClient {
  switch (env.AI_CLIENT) {
    case 'openai':
      return new OpenAIClient(env);
    case 'worker-ai':
    default:
      return new WorkerAiClient(env.AI);
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
