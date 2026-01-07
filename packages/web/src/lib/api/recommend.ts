import type {
  RecommendRequest,
  RecommendResponse,
  ErrorResponse,
  SlotType,
} from '@ac6_assemble_tool/api'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'

/**
 * API呼び出しエラー
 */
export class RecommendAPIError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'RecommendAPIError'
  }
}

/**
 * パーツ推奨APIを呼び出す
 * @param query ユーザーの質問テキスト
 * @param slot パーツスロット（オプショナル）
 * @param apiEndpoint APIエンドポイントURL
 * @returns 推奨結果またはエラー
 */
export async function fetchRecommendations(
  query: string,
  slot: SlotType | undefined,
  apiEndpoint: string,
): Promise<Result.Result<RecommendResponse, RecommendAPIError>> {
  try {
    const requestBody: RecommendRequest = {
      query,
      ...(slot && { slot }),
    }

    logger.info('Sending recommendation request', { query, slot })

    const response = await fetch(`${apiEndpoint}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      logger.warn('API returned error', {
        status: response.status,
        error: errorData.error,
      })
      return Result.fail(
        new RecommendAPIError(errorData.error.message, errorData.error.code),
      )
    }

    const data = (await response.json()) as RecommendResponse
    logger.info('Recommendation received', {
      count: data.recommendations.length,
    })
    return Result.succeed(data)
  } catch (error) {
    logger.error('Failed to fetch recommendations', {
      error: error instanceof Error ? error.message : String(error),
    })
    return Result.fail(
      new RecommendAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
      ),
    )
  }
}
