/**
 * Result型: エラーハンドリングのための型
 * ユーザーが解決可能なエラーはResult型で返す（例外ではなく）
 */
export type Result<T, E> = Ok<T> | Err<E>

export type Ok<T> = Readonly<{
	ok: true
	value: T
}>

export type Err<E> = Readonly<{
	ok: false
	error: E
}>

export function ok<T>(value: T): Ok<T> {
	return { ok: true, value }
}

export function err<E>(error: E): Err<E> {
	return { ok: false, error }
}
