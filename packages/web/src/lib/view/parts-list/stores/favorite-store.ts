import { serializeError } from '$lib/utils/error-serializer'

import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'
import { Dexie, type EntityTable } from 'dexie'
import { ulid } from 'ulid'

/**
 * お気に入りパーツを表すエンティティ
 */
export interface Favorite {
  id: string // ULID
  slot: CandidatesKey // スロット
  partsId: string // パーツID
  createdAt: number // 作成日時（UNIXタイムスタンプ）
}

/**
 * お気に入り管理用のIndexedDBデータベース
 */
export class FavoritesDatabase extends Dexie {
  favorites!: EntityTable<Favorite, 'id'>

  constructor() {
    super('AC6FavoritesDB')

    this.version(1).stores({
      // インデックス定義: &id (主キー), &[slot+partsId] (一意複合インデックス), createdAt
      favorites: '&id, &[slot+partsId], createdAt',
    })
  }
}

/**
 * お気に入りストアのエラー型
 */
export type FavoriteError =
  | { type: 'database_error'; message: string }
  | { type: 'not_found'; partsId: string }

/**
 * お気に入り管理ストア
 */
export class FavoriteStore {
  private db: FavoritesDatabase

  constructor() {
    this.db = new FavoritesDatabase()
  }

  private favoritesBySlot(slot: CandidatesKey) {
    return this.db.favorites
      .where('[slot+partsId]')
      .between([slot, Dexie.minKey], [slot, Dexie.maxKey])
  }

  /**
   * お気に入りを追加
   */
  async addFavorite(
    slot: CandidatesKey,
    partsId: string,
  ): Promise<Result.Result<void, FavoriteError>> {
    try {
      // 既存のお気に入りをチェック
      const existing = await this.db.favorites
        .where('[slot+partsId]')
        .equals([slot, partsId])
        .first()

      if (existing) {
        // 既に存在する場合は何もしない
        return Result.succeed(undefined)
      }

      // 新規追加
      const favorite: Favorite = {
        id: ulid(),
        slot,
        partsId,
        createdAt: Date.now(),
      }

      await this.db.favorites.add(favorite)

      logger.info('Favorite added', { slot, partsId })

      return Result.succeed(undefined)
    } catch (error) {
      logger.error('Failed to add favorite', {
        slot,
        partsId,
        error: serializeError(error),
      })

      return Result.fail({
        type: 'database_error',
        message: serializeError(error),
      })
    }
  }

  /**
   * お気に入りを削除
   */
  async removeFavorite(
    slot: CandidatesKey,
    partsId: string,
  ): Promise<Result.Result<void, FavoriteError>> {
    try {
      await this.db.favorites
        .where('[slot+partsId]')
        .equals([slot, partsId])
        .delete()

      logger.info('Favorite removed', { slot, partsId })

      return Result.succeed(undefined)
    } catch (error) {
      logger.error('Failed to remove favorite', {
        slot,
        partsId,
        error: serializeError(error),
      })

      return Result.fail({
        type: 'database_error',
        message: serializeError(error),
      })
    }
  }

  /**
   * スロット単位でお気に入りを取得
   */
  async getFavorites(
    slot: CandidatesKey,
  ): Promise<Result.Result<Set<string>, FavoriteError>> {
    try {
      const favorites = await this.favoritesBySlot(slot).toArray()

      const partsIds = new Set(favorites.map((f) => f.partsId))

      return Result.succeed(partsIds)
    } catch (error) {
      logger.error('Failed to get favorites', {
        slot,
        error: serializeError(error),
      })

      return Result.fail({
        type: 'database_error',
        message: serializeError(error),
      })
    }
  }

  /**
   * お気に入り状態をチェック
   */
  async isFavorite(
    slot: CandidatesKey,
    partsId: string,
  ): Promise<Result.Result<boolean, FavoriteError>> {
    try {
      const favorite = await this.db.favorites
        .where('[slot+partsId]')
        .equals([slot, partsId])
        .first()

      return Result.succeed(!!favorite)
    } catch (error) {
      logger.error('Failed to check favorite', {
        slot,
        partsId,
        error: serializeError(error),
      })

      return Result.fail({
        type: 'database_error',
        message: serializeError(error),
      })
    }
  }

  /**
   * 指定したスロットのお気に入りをすべて削除
   */
  async clearFavorites(
    slot: CandidatesKey,
  ): Promise<Result.Result<void, FavoriteError>> {
    try {
      await this.favoritesBySlot(slot).delete()

      logger.info('Favorites cleared', { slot })

      return Result.succeed(undefined)
    } catch (error) {
      logger.error('Failed to clear favorites', {
        slot,
        error: serializeError(error),
      })

      return Result.fail({
        type: 'database_error',
        message: serializeError(error),
      })
    }
  }

  /**
   * データベースを閉じる
   */
  async close(): Promise<void> {
    return this.db.close()
  }
}
