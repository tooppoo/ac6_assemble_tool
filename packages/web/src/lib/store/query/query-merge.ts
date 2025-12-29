import { ASSEMBLY_QUERY_V2_KEYS } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'

/**
 * アセンブリ関連パラメータのみを差し替え、非アセンブリ系のクエリは保持する。
 */
export function mergeAssemblyParams(
  currentParams: URLSearchParams,
  assemblyParams: URLSearchParams,
): void {
  ASSEMBLY_QUERY_V2_KEYS.forEach((key) => currentParams.delete(key))

  assemblyParams.forEach((value, key) => {
    currentParams.set(key, value)
  })
}
