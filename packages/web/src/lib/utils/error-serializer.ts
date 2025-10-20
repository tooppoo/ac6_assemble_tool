/**
 * エラーオブジェクトを文字列に直列化する
 *
 * @param error - 直列化対象のエラー（unknown型）
 * @returns エラーメッセージ文字列
 *
 * @example
 * ```typescript
 * try {
 *   throw new Error('Something went wrong')
 * } catch (error) {
 *   const message = serializeError(error) // "Something went wrong"
 * }
 * ```
 */
export function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return String(error)
}
