/**
 * Result型: エラーハンドリングのための型
 * ユーザーが解決可能なエラーはResult型で返す（例外ではなく）
 *
 * @see https://github.com/praha-inc/byethrow
 */
import { Result as ByethrowResult } from '@praha/byethrow'

// 値として使える名前空間（Result.succeed, Result.failなど）
export const Result = ByethrowResult

// 型定義: byethrowのSuccessとFailureの共用型
// 注意: byethrowの`Result`は名前空間なので型として使えない
// そのため独自に型エイリアスを定義している
export type Result<T, E> =
  | { readonly type: 'Success'; readonly value: T }
  | { readonly type: 'Failure'; readonly error: E }

// 型としての別名エクスポート（より明示的な使用のため）
export type { Result as ResultType }
