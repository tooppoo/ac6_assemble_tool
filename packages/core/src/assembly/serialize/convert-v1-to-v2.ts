/**
 * v1→v2 URL変換モジュール
 *
 * v1形式（インデックスベース）のURLをv2形式（IDベース）に変換します。
 */
import type {
  Candidates,
  CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'

/**
 * v1形式URLをv2形式に変換
 *
 * @param v1Params - v1形式URLSearchParams（インデックスベース）
 * @param candidates - パーツ候補リスト
 * @returns v2形式URLSearchParams（IDベース、v=2を含む）
 *
 * @example
 * ```typescript
 * const v1Params = new URLSearchParams('h=0&c=1&a=2')
 * const v2Params = convertV1ToV2(v1Params, candidates)
 * console.log(v2Params.toString())
 * // => "v=2&h=HD001&c=CR002&a=AR003"
 * ```
 */
export function convertV1ToV2(
  v1Params: URLSearchParams,
  candidates: Candidates,
): URLSearchParams {
  const getIdByIndex = (key: CandidatesKey, paramKey: string): string => {
    const indexStr = v1Params.get(paramKey)
    const index = indexStr !== null ? parseInt(indexStr, 10) : -1
    const part = candidates[key][index] || candidates[key][0]
    return part.id
  }

  const v2Query = {
    v: '2',
    rau: getIdByIndex('rightArmUnit', 'rau'),
    lau: getIdByIndex('leftArmUnit', 'lau'),
    rbu: getIdByIndex('rightBackUnit', 'rbu'),
    lbu: getIdByIndex('leftBackUnit', 'lbu'),

    h: getIdByIndex('head', 'h'),
    c: getIdByIndex('core', 'c'),
    a: getIdByIndex('arms', 'a'),
    l: getIdByIndex('legs', 'l'),

    b: getIdByIndex('booster', 'b'),
    f: getIdByIndex('fcs', 'f'),
    g: getIdByIndex('generator', 'g'),

    e: getIdByIndex('expansion', 'e'),
  }

  return Object.entries(v2Query).reduce((search, [key, value]) => {
    search.set(key, value)
    return search
  }, new URLSearchParams())
}
