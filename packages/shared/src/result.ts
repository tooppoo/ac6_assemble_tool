/**
 * Result型: エラーハンドリングのための型
 * ユーザーが解決可能なエラーはResult型で返す（例外ではなく）
 *
 * @see https://github.com/praha-inc/byethrow
 */
import { Result as ByethrowResult } from '@praha/byethrow'

// byethrowのResultを直接re-export
export const Result = ByethrowResult

// 型定義: byethrowのSuccessとFailureの共用型
export type Result<T, E> =
  | { readonly type: 'Success'; readonly value: T }
  | { readonly type: 'Failure'; readonly error: E }
