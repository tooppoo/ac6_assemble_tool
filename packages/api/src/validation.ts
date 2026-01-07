import * as v from 'valibot'

import type { RecommendRequest } from './types'

/**
 * RecommendRequest のバリデーションスキーマ
 */
export const RecommendRequestSchema = v.object({
  query: v.pipe(v.string(), v.minLength(1)),
  slot: v.optional(
    v.union([
      v.literal('head'),
      v.literal('arms'),
      v.literal('core'),
      v.literal('legs'),
      v.literal('booster'),
      v.literal('fcs'),
      v.literal('generator'),
      v.literal('arm-unit'),
      v.literal('back-unit'),
      v.literal('expansion'),
    ]),
  ),
})

/**
 * RecommendRequestSchema から推論される型
 */
export type RecommendRequestInput = v.InferOutput<typeof RecommendRequestSchema>

// 型の整合性チェック（コンパイル時検証）
// @ts-expect-error - Type compatibility check

const _typeCheck: RecommendRequest = {} as RecommendRequestInput
// @ts-expect-error - Type compatibility check

const _typeCheck2: RecommendRequestInput = {} as RecommendRequest
