/**
 * URL形式バージョン検出モジュール
 *
 * URLクエリパラメータからv1形式かv2形式かを判定します。
 */

/**
 * URL形式のバージョン
 */
export type UrlVersion = 'v1' | 'v2' | 'unknown'

/**
 * URLクエリパラメータから形式バージョンを検出
 *
 * @param params - URLSearchParams
 * @returns 'v1' | 'v2' | 'unknown'
 *
 * @example
 * ```typescript
 * // v1形式（vパラメータなし）
 * const paramsV1 = new URLSearchParams('h=0&c=1&a=2')
 * detectUrlVersion(paramsV1) // => 'v1'
 *
 * // v2形式（v=2パラメータあり）
 * const paramsV2 = new URLSearchParams('v=2&h=HD001&c=CR001')
 * detectUrlVersion(paramsV2) // => 'v2'
 * ```
 */
export function detectUrlVersion(params: URLSearchParams): UrlVersion {
  const versionParam = params.get('v')

  if (versionParam === null) {
    // vパラメータが存在しない場合はv1形式
    return 'v1'
  }

  if (versionParam === '2') {
    return 'v2'
  }

  // vパラメータが存在するが2以外の値の場合はunknown
  return 'unknown'
}
