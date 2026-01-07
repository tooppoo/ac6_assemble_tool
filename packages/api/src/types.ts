/**
 * パーツスロットの種類
 */
export type SlotType =
  | 'head'
  | 'arms'
  | 'core'
  | 'legs'
  | 'booster'
  | 'fcs'
  | 'generator'
  | 'arm-unit'
  | 'back-unit'
  | 'expansion'

/**
 * パーツ推奨リクエスト
 */
export interface RecommendRequest {
  /**
   * ユーザーの自然言語クエリ（必須、空文字列不可）
   */
  query: string

  /**
   * パーツスロット指定（オプショナル）
   */
  slot?: SlotType
}

/**
 * パーツ推奨結果
 */
export interface Recommendation {
  /**
   * パーツID
   */
  partId: string

  /**
   * パーツ名
   */
  partName: string

  /**
   * 推奨理由（日本語）
   */
  reason: string

  /**
   * 適合度スコア（0.0-1.0）
   */
  score: number
}

/**
 * パーツ推奨レスポンス
 */
export interface RecommendResponse {
  /**
   * 推奨パーツリスト（最大5件、スコア降順）
   */
  recommendations: Recommendation[]
}

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  error: {
    /**
     * エラーメッセージ
     */
    message: string

    /**
     * エラーコード（オプショナル）
     */
    code?: string
  }
}
