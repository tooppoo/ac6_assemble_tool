import { createAssembly } from '#core/assembly/assembly'
import { assemblyToSearchV2 } from '#core/assembly/serialize/as-query-v2'
import { deserializeAssembly } from '#core/assembly/serialize/deserialize-assembly'
import type { StoredAssemblyDto } from '#core/assembly/store/repository/data-transfer-object'
import { logger } from '#core/utils/logger'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { Dexie, type EntityTable } from 'dexie'

export type DataBase = Dexie & {
  stored_assembly: EntityTable<StoredAssemblyDto, 'id'>
}

let db: DataBase | null = null

export const setupDataBase = (candidates: Candidates): DataBase => {
  if (db && db.isOpen()) return db

  db = new Dexie('ac6-assembly-tool') as DataBase

  db.version(1).stores({
    stored_assembly: 'id,name,createdAt,updatedAt',
  })

  db.version(2)
    .stores({
      stored_assembly: 'id,name,createdAt,updatedAt',
    })
    .upgrade(async (tx) => {
      // v1形式データをv2形式へ自動変換
      const assemblies = await tx.table('stored_assembly').toArray()

      for (const dto of assemblies) {
        const typedDto = dto as StoredAssemblyDto
        // v1形式かどうかを判定（v=2パラメータの有無）
        const isV1 = !typedDto.assembly.includes('v=2')

        if (isV1) {
          try {
            // v1形式データをデシリアライズして機体構成を復元
            const assembly = createAssembly(
              deserializeAssembly(
                new URLSearchParams(typedDto.assembly),
                candidates,
              ),
            )

            // v2形式でシリアライズ
            const v2Assembly = assemblyToSearchV2(assembly).toString()

            // v2形式で上書き
            await tx.table('stored_assembly').update(typedDto.id, {
              assembly: v2Assembly,
            })

            logger.info('Migrated assembly from v1 to v2 format', {
              assemblyId: typedDto.id,
              assemblyName: typedDto.name,
            })
          } catch (error) {
            logger.error('Failed to migrate assembly from v1 to v2', {
              assemblyId: typedDto.id,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
      }
    })

  return db
}

/**
 * テスト専用: DBインスタンスをリセット
 * 本番コードでは使用しないこと
 */
export const TEST_ONLY_resetDataBase = (): void => {
  if (process.env.NODE_ENV === 'test') {
    if (db) {
      db.close()
      db = null
    }
  }
}
