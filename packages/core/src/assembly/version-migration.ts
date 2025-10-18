import { createAssembly } from '#core/assembly/assembly'
import { assemblyToSearchV2 } from '#core/assembly/serialize/as-query-v2'
import { convertV1ToV2 } from '#core/assembly/serialize/convert-v1-to-v2'
import { deserializeAssembly } from '#core/assembly/serialize/deserialize-assembly'
import type { StoredAssemblyDto } from '#core/assembly/store/repository/data-transfer-object'
import { logger } from '@ac6_assemble_tool/shared/logger'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import type { Transaction } from 'dexie'

/**
 * v1形式のマイグレーション処理群
 */
export const V1 = {
  /**
   * IndexedDBに保存されたv1形式のアセンブリデータをv2形式に変換
   */
  async migrateIndexedDB(
    dto: StoredAssemblyDto,
    tx: Transaction,
    candidates: Candidates,
  ): Promise<void> {
    const assembly = createAssembly(
      deserializeAssembly(new URLSearchParams(dto.assembly), candidates),
    )
    const v2Assembly = assemblyToSearchV2(assembly).toString()
    await tx.table('stored_assembly').update(dto.id, { assembly: v2Assembly })

    logger.info('Migrated assembly from v1 to v2 format', {
      assemblyId: dto.id,
      assemblyName: dto.name,
    })
  },

  /**
   * URLクエリパラメータのv1形式をv2形式に変換
   */
  migrateQuery(
    params: URLSearchParams,
    candidates: Candidates,
  ): URLSearchParams {
    logger.info('v1形式と判定されたURLを変換します', {
      v1Query: params.toString(),
    })
    return convertV1ToV2(params, candidates)
  },
} as const

/**
 * v2形式のマイグレーション処理群（NullObject）
 */
export const V2 = {
  /**
   * v2形式は既に最新なので何もしない
   */
  async migrateIndexedDB(): Promise<void> {
    // NullObject: v2形式は既に最新なので何もしない
  },

  /**
   * v2形式は既に最新なのでそのまま返す
   */
  migrateQuery(params: URLSearchParams): URLSearchParams {
    // NullObject: v2形式は既に最新なのでそのまま返す
    return params
  },
} as const

/**
 * バージョン判定とマイグレーション戦略の選択
 */
export const VersionMigration = {
  /**
   * IndexedDBに保存されたアセンブリデータのバージョンを判定し、
   * 適切なマイグレーション関数を返す
   */
  forIndexedDB(dto: StoredAssemblyDto) {
    const isV1 = !dto.assembly.includes('v=2')
    return isV1 ? V1.migrateIndexedDB : V2.migrateIndexedDB
  },

  /**
   * URLクエリパラメータのバージョンを判定し、
   * 適切なマイグレーション関数を返す
   */
  forQuery(params: URLSearchParams) {
    const isV1 = !params.has('v')
    return isV1 ? V1.migrateQuery : V2.migrateQuery
  },
} as const
