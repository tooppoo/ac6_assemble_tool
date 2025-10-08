import type { StoredAssemblyDto } from '#core/assembly/store/repository/data-transfer-object'
import { VersionMigration } from '#core/assembly/version-migration'
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

        try {
          const migrate = VersionMigration.forIndexedDB(typedDto)
          await migrate(typedDto, tx, candidates)
        } catch (error) {
          logger.error('Failed to migrate assembly from v1 to v2', {
            assemblyId: typedDto.id,
            error: error instanceof Error ? error.message : String(error),
          })
          // トランザクションをアボートさせるためにエラーを再スローします
          throw error
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
