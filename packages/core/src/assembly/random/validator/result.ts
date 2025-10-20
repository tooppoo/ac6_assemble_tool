import type { Assembly } from '#core/assembly/assembly'
import { Result, type ResultType } from '@ac6_assemble_tool/shared/result'

/**
 * バリデーション結果を表す型
 * byethrowのResult型に`fold`と`concat`メソッドを追加したラッパー
 */
export type ValidationResult = {
  readonly result: ResultType<Assembly, Error[]>
  readonly isSuccess: boolean
  fold<T>(onFail: OnFail<T>, onSuccess: OnSuccess<T>): T
  concat(other: ValidationResult): ValidationResult
}

type OnFail<T> = (errors: Error[]) => T
type OnSuccess<T> = (assembly: Assembly) => T

export const success = (assembly: Assembly): ValidationResult => ({
  result: Result.succeed(assembly),
  isSuccess: true,
  fold<T>(_: OnFail<T>, f: OnSuccess<T>): T {
    return f(assembly)
  },
  concat(other: ValidationResult): ValidationResult {
    return other
  },
})

export const failure = (errors: Error[]): ValidationResult => ({
  result: Result.fail(errors),
  isSuccess: false,
  fold<T>(f: OnFail<T>, _: OnSuccess<T>): T {
    return f(errors)
  },
  concat(other: ValidationResult): ValidationResult {
    if (other.isSuccess) {
      return this
    }
    // 両方失敗の場合はエラーをマージ
    return failure([
      ...errors,
      ...other.fold(
        (e) => e,
        () => [],
      ),
    ])
  },
})
