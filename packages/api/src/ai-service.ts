import { Result } from '@praha/byethrow'
import type { AIPartData } from './parts-loader'
import type { Recommendation } from './types'

/**
 * AI レスポンス型（Cloudflare Workers AI）
 */
export interface AIResponse {
  response: string
}

/**
 * AI サービスエラー
 */
export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly type: 'parse_failed' | 'invalid_format' | 'api_failed' | 'timeout',
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

/**
 * 構造化プロンプトを生成する
 * @param query ユーザークエリ
 * @param parts パーツデータ
 * @returns 構造化プロンプト
 */
export function buildPrompt(query: string, parts: AIPartData[]): string {
  const partsJson = parts.map((p) => ({
    id: p.id,
    name: p.name,
    summary: p.summary,
    tags: Array.from(p.tags),
  }))

  return `You are a parts recommendation system for AC6 Assemble Tool.

User query: "${query}"

Parts candidates (JSON array):
${JSON.stringify(partsJson, null, 2)}

Task: Analyze the user query and parts data, then return top 3-5 recommended parts in JSON format:
{
  "recommendations": [
    {"partId": "HD001", "partName": "AH-J-124 BASHO", "reason": "推奨理由の説明（日本語）", "score": 0.95},
    ...
  ]
}

Rules:
- score: 0.0-1.0 (適合度)
- reason: 日本語で簡潔に説明
- partName: パーツの正式名称を含める
- Return only valid JSON without additional text`
}

/**
 * JSON文字列からJSONブロックを抽出する
 * @param text テキスト
 * @returns 抽出されたJSON文字列
 */
function extractJSON(text: string): string {
  // JSONブロックを探す（開始の{から終了の}まで）
  const jsonMatch = text.match(/\{[\s\S]*"recommendations"[\s\S]*\}/)
  if (jsonMatch) {
    return jsonMatch[0]
  }
  // マッチしない場合は元のテキストを返す
  return text
}

/**
 * AI レスポンスをパースして推奨結果を抽出する
 * @param aiResponse AI レスポンス
 * @returns 推奨結果またはエラー
 */
export function parseAIResponse(
  aiResponse: AIResponse,
): Result.Result<Recommendation[], AIServiceError> {
  try {
    // AI responseからJSON抽出
    const jsonText = extractJSON(aiResponse.response)
    const parsed = JSON.parse(jsonText)

    // バリデーション: recommendationsフィールドの存在確認
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      return Result.fail(
        new AIServiceError(
          'Invalid AI response format: recommendations field is missing or not an array',
          'invalid_format',
        ),
      )
    }

    // 推奨結果をマッピング
    const recommendations: Recommendation[] = parsed.recommendations.map((r: unknown) => {
      if (typeof r !== 'object' || r === null) {
        throw new Error('Invalid recommendation item')
      }
      const item = r as Record<string, unknown>
      return {
        partId: String(item.partId),
        partName: String(item.partName),
        reason: String(item.reason),
        score: Number(item.score),
      }
    })

    return Result.succeed(recommendations)
  } catch (error) {
    return Result.fail(
      new AIServiceError(
        'Failed to parse AI response',
        'parse_failed',
        error,
      ),
    )
  }
}
