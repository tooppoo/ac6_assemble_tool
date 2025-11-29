import {
  createAssembly,
  type Assembly,
} from '@ac6_assemble_tool/core/assembly/assembly'
import {
  searchToAssemblyV2,
  ASSEMBLY_QUERY_V2_KEYS,
} from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
import { VersionMigration } from '@ac6_assemble_tool/core/assembly/version-migration'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

type BuildAssemblyResult = {
  assembly: Assembly
  migratedParams?: URLSearchParams
}

/**
 * URLSearchParams からアセンブリを構築し、必要に応じてクエリをマイグレーションする。
 * 副作用を持たず、呼び出し側でURL更新を判断できるよう migratedParams を返す。
 */
export const buildAssemblyFromQuery = (
  params: URLSearchParams,
  candidates: Candidates,
): BuildAssemblyResult => {
  const migrate = VersionMigration.forQuery(params)
  const convertedParams = migrate(params, candidates)

  const assembly = createAssembly(
    searchToAssemblyV2(convertedParams, candidates),
  )

  const changed = convertedParams !== params

  return {
    assembly,
    migratedParams: changed ? convertedParams : undefined,
  }
}

/**
 * アセンブリ関連パラメータのみを差し替え、非アセンブリ系のクエリは保持する。
 */
export const mergeAssemblyParams = (
  currentParams: URLSearchParams,
  assemblyParams: URLSearchParams,
): void => {
  ASSEMBLY_QUERY_V2_KEYS.forEach((key) => currentParams.delete(key))

  assemblyParams.forEach((value, key) => {
    currentParams.set(key, value)
  })
}
