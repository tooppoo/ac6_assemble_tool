import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as v from 'valibot'
import { Result } from '@praha/byethrow'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { RecommendRequestSchema } from './validation'
import { handleRecommendRequest } from './recommend-handler'
import type { ErrorResponse } from './types'

/**
 * Cloudflare Workers の環境型
 */
interface Env {
  AI: any
}

const app = new Hono<{ Bindings: Env }>()

// CORS設定
app.use('*', cors())

/**
 * POST /api/recommend
 * パーツ推奨エンドポイント
 */
app.post('/api/recommend', async (c) => {
  try {
    // リクエストボディの取得とバリデーション
    const body = await c.req.json()
    logger.info('Received recommend request', { query: body.query, slot: body.slot })

    const parseResult = v.safeParse(RecommendRequestSchema, body)

    if (!parseResult.success) {
      logger.warn('Validation failed', { issues: parseResult.issues })
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Invalid request format',
          code: 'VALIDATION_ERROR',
        },
      }
      return c.json(errorResponse, 400)
    }

    // AI推論の実行
    const request = parseResult.output
    const result = await handleRecommendRequest(c.env.AI, request)

    if (Result.isFailure(result)) {
      const error = Result.unwrapError(result)
      logger.error('AI recommendation failed', {
        error: error.message,
        type: error.type,
      })
      const errorResponse: ErrorResponse = {
        error: {
          message: error.message,
          code: error.type.toUpperCase(),
        },
      }
      return c.json(errorResponse, 500)
    }

    // 成功レスポンス
    const response = Result.unwrap(result)
    logger.info('Recommendation succeeded', {
      recommendationCount: response.recommendations.length,
    })
    return c.json(response, 200)
  } catch (error) {
    // 予期しないエラー
    logger.fatal('Unexpected error in recommend endpoint', {
      error: error instanceof Error ? error.message : String(error),
    })
    const errorResponse: ErrorResponse = {
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    }
    return c.json(errorResponse, 500)
  }
})

/**
 * GET /api/health
 * ヘルスチェックエンドポイント
 */
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

export default app
