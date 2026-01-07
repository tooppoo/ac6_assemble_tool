import { allAttributes } from '@ac6_assemble_tool/shared/i18n/terminology'
import { logger } from '@ac6_assemble_tool/shared/logger'
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
    public readonly type:
      | 'parse_failed'
      | 'invalid_format'
      | 'api_failed'
      | 'timeout',
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

function reverseKeyValue<T extends Record<string, string>>(
  obj: T,
): Record<string, string> {
  const reversed: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    reversed[value] = key
  }
  return reversed
}

/**
 * 構造化プロンプトを生成する
 * @param query ユーザークエリ
 * @param parts パーツデータ
 * @returns 構造化プロンプト
 */
export function buildPrompt(query: string, parts: AIPartData[]): string {
  const partsJson = parts.map((p) => ({
    ...p,
    tags: Array.from(p.tags),
  }))

  // 属性名の日本語対応表を生成
  const attributesJson = JSON.stringify(reverseKeyValue(allAttributes), null, 2)

  return `You are a parts recommendation assistant for AC6 Assemble Tool.

User query: "${query}"

## Available parts

\`\`\`json
${JSON.stringify(partsJson, null, 2)}
\`\`\`

## Japanese terminology reference

### Attribute names
\`\`\`json
${attributesJson}
\`\`\`

## Instructions

1. Analyze the user's request and recommend 3-5 suitable parts
2. Use the Japanese terminology reference above to understand technical terms in the query
3. Respond in Japanese with a natural, friendly explanation
4. **IMPORTANT**: When mentioning parts in your natural language response, always use the part **name** (not ID)
5. At the end of your response, list recommended parts in this format:

---RECOMMENDATIONS---
partId: [ID] | partName: [名前] | score: [0.0-1.0] | reason: [理由]
partId: [ID] | partName: [名前] | score: [0.0-1.0] | reason: [理由]

## Example

ユーザーのご要望に合うパーツを探しました。高火力で軽量という条件では、以下のパーツがおすすめです。

まず「ライフル A」は攻撃力が高く、重量も控えめなのでバランスが良いです。次に「ショットガン B」は近距離での瞬間火力に優れています。

---RECOMMENDATIONS---
partId: WR-001 | partName: ライフル A | score: 0.95 | reason: 高火力かつ軽量で機動性を保てる
partId: WR-002 | partName: ショットガン B | score: 0.85 | reason: 近距離での火力が高い`
}

/**
 * 構造化されたレスポンスから推奨パーツを抽出する
 * @param text AIのレスポンステキスト
 * @returns 推奨パーツの配列
 */
function extractRecommendations(text: string): Recommendation[] {
  const recommendations: Recommendation[] = []

  // ---RECOMMENDATIONS--- 以降のセクションを探す
  const marker = '---RECOMMENDATIONS---'
  const markerIndex = text.indexOf(marker)

  if (markerIndex === -1) {
    logger.warn('Recommendations marker not found in AI response')
    return recommendations
  }

  const recommendationsSection = text.substring(markerIndex + marker.length)
  const lines = recommendationsSection.split('\n').map((line) => line.trim())

  for (const line of lines) {
    if (!line || line.startsWith('---')) continue

    // パターン: partId: xxx | partName: xxx | score: 0.xx | reason: xxx
    const match = line.match(
      /partId:\s*([^|]+)\s*\|\s*partName:\s*([^|]+)\s*\|\s*score:\s*([\d.]+)\s*\|\s*reason:\s*(.+)/,
    )

    if (match) {
      const [, partId, partName, scoreStr, reason] = match
      const score = parseFloat(scoreStr)

      if (!isNaN(score) && score >= 0 && score <= 1) {
        recommendations.push({
          partId: partId.trim(),
          partName: partName.trim(),
          score,
          reason: reason.trim(),
        })
      }
    }
  }

  return recommendations
}

/**
 * AI レスポンスをパースして推奨結果を抽出する
 * @param aiResponse AI レスポンス
 * @returns 自然言語回答と推奨結果
 */
export function parseAIResponse(
  aiResponse: AIResponse,
): Result.Result<
  { answer: string; recommendations: Recommendation[] },
  AIServiceError
> {
  try {
    logger.debug('Parsing AI response', {
      responseLength: aiResponse.response?.length,
      fullResponse: aiResponse.response,
    })

    const fullText = aiResponse.response

    // 推奨パーツを抽出（失敗しても続行）
    const recommendations = extractRecommendations(fullText)
    logger.info('Extracted recommendations', {
      count: recommendations.length,
      recommendations,
    })

    // 自然言語の回答部分を抽出（---RECOMMENDATIONS---より前）
    const marker = '---RECOMMENDATIONS---'
    const markerIndex = fullText.indexOf(marker)
    const answer =
      markerIndex !== -1
        ? fullText.substring(0, markerIndex).trim()
        : fullText.trim()

    logger.info('Successfully parsed AI response', {
      answerLength: answer.length,
      recommendationCount: recommendations.length,
    })

    return Result.succeed({
      answer,
      recommendations,
    })
  } catch (error) {
    logger.error('Failed to parse AI response', {
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    })
    return Result.fail(
      new AIServiceError('Failed to parse AI response', 'parse_failed', error),
    )
  }
}
