import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import { FavoriteStore, FavoritesDatabase } from './favorite-store'

describe('FavoritesDatabase', () => {
  let db: FavoritesDatabase

  beforeEach(async () => {
    db = new FavoritesDatabase()
    await db.delete() // テスト前にDBをクリア
    db = new FavoritesDatabase() // 再作成
  })

  afterEach(async () => {
    await db.close()
    await db.delete()
  })

  describe('スキーマ定義', () => {
    it('favoritesテーブルが存在すること', () => {
      expect(db.favorites).toBeDefined()
    })

    it('favoritesテーブルに主キー(&id)が設定されていること', () => {
      expect(db.favorites.schema.primKey.name).toBe('id')
    })

    it('favoritesテーブルにslot, partsId, createdAtのインデックスが設定されていること', () => {
      const indexes = db.favorites.schema.indexes.map((idx) => idx.name)
      expect(indexes).toContain('slot')
      expect(indexes).toContain('partsId')
      expect(indexes).toContain('createdAt')
    })
  })
})

describe('FavoriteStore', () => {
  let store: FavoriteStore

  beforeEach(async () => {
    const db = new FavoritesDatabase()
    await db.delete()
    store = new FavoriteStore()
  })

  afterEach(async () => {
    await store.close()
  })

  describe('addFavorite', () => {
    it('お気に入りを追加できること', async () => {
      const result = await store.addFavorite('head', 'AC-HEAD-001')

      expect(result.type === 'Success').toBe(true)
    })

    it('追加したお気に入りを取得できること', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')

      const favorites = await store.getFavorites('head')
      expect(favorites.type).toBe('Success')
      if (favorites.type === 'Success') {
        expect(favorites.value.has('AC-HEAD-001')).toBe(true)
      }
    })

    it('同じスロット×パーツIDの組み合わせを重複登録できないこと', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')
      const result = await store.addFavorite('head', 'AC-HEAD-001')

      expect(result.type === 'Success').toBe(true) // 既存のものを返すだけでエラーにはしない

      const favorites = await store.getFavorites('head')
      if (favorites.type === 'Success') {
        expect(favorites.value.size).toBe(1)
      }
    })

    it('異なるスロットで同じパーツIDを登録できること', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')
      await store.addFavorite('core', 'AC-HEAD-001') // 異なるスロット

      const headFavorites = await store.getFavorites('head')
      const coreFavorites = await store.getFavorites('core')

      if (headFavorites.type === 'Success' && coreFavorites.type === 'Success') {
        expect(headFavorites.value.has('AC-HEAD-001')).toBe(true)
        expect(coreFavorites.value.has('AC-HEAD-001')).toBe(true)
      }
    })

    it('データベースエラーが発生した場合、Errorを返すこと', async () => {
      await store.close() // DBを閉じてエラーを誘発

      const result = await store.addFavorite('head', 'AC-HEAD-001')

      expect(result.type === 'Success').toBe(false)
      if (result.type === 'Failure') {
        expect(result.error.type).toBe('database_error')
      }
    })
  })

  describe('removeFavorite', () => {
    it('お気に入りを削除できること', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')

      const result = await store.removeFavorite('head', 'AC-HEAD-001')

      expect(result.type === 'Success').toBe(true)

      const favorites = await store.getFavorites('head')
      if (favorites.type === 'Success') {
        expect(favorites.value.has('AC-HEAD-001')).toBe(false)
      }
    })

    it('存在しないお気に入りを削除しても成功すること', async () => {
      const result = await store.removeFavorite('head', 'NON-EXISTENT')

      expect(result.type === 'Success').toBe(true)
    })
  })

  describe('getFavorites', () => {
    it('スロット単位でお気に入りを取得できること', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')
      await store.addFavorite('head', 'AC-HEAD-002')
      await store.addFavorite('core', 'AC-CORE-001')

      const headFavorites = await store.getFavorites('head')

      expect(headFavorites.type).toBe('Success')
      if (headFavorites.type === 'Success') {
        expect(headFavorites.value.size).toBe(2)
        expect(headFavorites.value.has('AC-HEAD-001')).toBe(true)
        expect(headFavorites.value.has('AC-HEAD-002')).toBe(true)
        expect(headFavorites.value.has('AC-CORE-001')).toBe(false)
      }
    })

    it('お気に入りが0件の場合、空のSetを返すこと', async () => {
      const favorites = await store.getFavorites('head')

      expect(favorites.type).toBe('Success')
      if (favorites.type === 'Success') {
        expect(favorites.value.size).toBe(0)
      }
    })
  })

  describe('isFavorite', () => {
    it('お気に入りに登録されているパーツはtrueを返すこと', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')

      const result = await store.isFavorite('head', 'AC-HEAD-001')

      expect(result.type === 'Success').toBe(true)
      if (result.type === 'Success') {
        expect(result.value).toBe(true)
      }
    })

    it('お気に入りに登録されていないパーツはfalseを返すこと', async () => {
      const result = await store.isFavorite('head', 'AC-HEAD-001')

      expect(result.type === 'Success').toBe(true)
      if (result.type === 'Success') {
        expect(result.value).toBe(false)
      }
    })
  })

  describe('clearFavorites', () => {
    it('指定したスロットのお気に入りをすべて削除できること', async () => {
      await store.addFavorite('head', 'AC-HEAD-001')
      await store.addFavorite('head', 'AC-HEAD-002')
      await store.addFavorite('core', 'AC-CORE-001')

      const result = await store.clearFavorites('head')

      expect(result.type === 'Success').toBe(true)

      const headFavorites = await store.getFavorites('head')
      const coreFavorites = await store.getFavorites('core')

      if (headFavorites.type === 'Success' && coreFavorites.type === 'Success') {
        expect(headFavorites.value.size).toBe(0)
        expect(coreFavorites.value.size).toBe(1) // coreは削除されない
      }
    })
  })
})
