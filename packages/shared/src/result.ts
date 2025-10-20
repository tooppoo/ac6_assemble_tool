/**
 * Result型: エラーハンドリングのための型
 * ユーザーが解決可能なエラーはResult型で返す（例外ではなく）
 *
 * @see https://github.com/praha-inc/byethrow
 */
export { Result } from '@praha/byethrow'

/**
 * 既存コードとの互換性のためのヘルパー関数と拡張型
 */

/**
 * 成功を表す型（互換性のため`ok`プロパティを追加）
 */
export type Ok<T> = {
  readonly type: 'Success'
  readonly value: T
  readonly ok: true
}

/**
 * 失敗を表す型（互換性のため`ok`プロパティを追加）
 */
export type Err<E> = {
  readonly type: 'Failure'
  readonly error: E
  readonly ok: false
}

/**
 * 既存コードとの互換性のためのResult型
 * `ok`プロパティによる判別が可能
 */
export type Result<T, E> = Ok<T> | Err<E>

export function ok<T>(value: T): Ok<T> {
  return {
    type: 'Success' as const,
    value,
    ok: true as const,
  }
}

export function err<E>(error: E): Err<E> {
  return {
    type: 'Failure' as const,
    error,
    ok: false as const,
  }
}
