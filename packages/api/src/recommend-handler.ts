import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

import type { CloudflareAI, WorkersAIResponse } from './ai-client'
import { callWorkersAI } from './ai-client'
import {
  buildSystemPrompt,
  parseAIResponse,
  AIServiceError,
} from './ai-service'
import { loadParts, extractAIData } from './parts-loader'
import type { RecommendRequest, RecommendResponse } from './types'

/**
 * レコメンド推論を実行してレスポンスを生成する
 * @param ai Cloudflare AI インスタンス
 * @param request リクエストデータ
 * @returns レスポンスまたはエラー
 */
export async function handleRecommendRequest(
  ai: CloudflareAI,
  request: RecommendRequest,
): Promise<Result.Result<RecommendResponse, AIServiceError>> {
  // パーツデータのロード
  const parts = loadParts(request.slot)
  const aiData = extractAIData(parts)

  // プロンプト生成
  const systemPrompt = buildSystemPrompt(aiData)
  logger.debug('Generated Prompt:', { systemPrompt })

  // Workers AI 呼び出し
  const aiResult = await callWorkersAI(ai, systemPrompt, request.query)
  if (Result.isFailure(aiResult)) {
    const aiError = Result.unwrapError(aiResult)
    return Result.fail(
      new AIServiceError(
        aiError.message,
        aiError.type as 'api_failed' | 'timeout',
        aiError.cause,
      ),
    )
  }

  // AI レスポンスのパース
  const aiResponse = Result.unwrap(aiResult)
  const parseResult = parseAIResponse(aiResponse as WorkersAIResponse)
  logger.debug('Parsed AI Response:', { aiResponse, parseResult })

  if (Result.isFailure(parseResult)) {
    return parseResult as Result.Result<never, AIServiceError>
  }

  const { answer, recommendations } = Result.unwrap(parseResult)
  return Result.succeed({ answer, recommendations })
}
