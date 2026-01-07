import { describe, it, expectTypeOf, assertType } from 'vitest'

import { head as headCategory, core as coreCategory } from './category'
import { head, core } from './classification'
import { allmind, arquebus } from './manufacture'
import type { ACParts } from './types'

describe('ACParts型', () => {
  describe('型構造のテスト', () => {
    it('必須フィールドを持つ', () => {
      expectTypeOf<ACParts>().toHaveProperty('id').toBeString()
      expectTypeOf<ACParts>().toHaveProperty('name').toBeString()
      expectTypeOf<ACParts>().toHaveProperty('classification')
      expectTypeOf<ACParts>().toHaveProperty('manufacture')
      expectTypeOf<ACParts>().toHaveProperty('category').toBeString()
      expectTypeOf<ACParts>().toHaveProperty('price').toBeNumber()
      expectTypeOf<ACParts>().toHaveProperty('weight').toBeNumber()
      expectTypeOf<ACParts>().toHaveProperty('en_load').toBeNumber()
      expectTypeOf<ACParts>().toHaveProperty('ai_summary').toBeString()
      expectTypeOf<ACParts>().toHaveProperty('ai_tags')
    })

    it('ai_tagsはreadonly string配列である', () => {
      expectTypeOf<ACParts['ai_tags']>().toEqualTypeOf<readonly string[]>()
    })

    it('Readonly型である', () => {
      // ACParts型全体がReadonlyであることを確認
      type IsReadonly =
        ACParts extends Readonly<Record<string, unknown>> ? true : false
      expectTypeOf<IsReadonly>().toEqualTypeOf<true>()
    })

    it('有効なACPartsオブジェクトを受け入れる', () => {
      assertType<ACParts>({
        id: 'HD001',
        name: 'テストヘッド',
        classification: head,
        manufacture: allmind,
        category: headCategory,
        price: 100000,
        weight: 500,
        en_load: 100,
        ai_summary: 'これはテスト用のヘッドパーツです。',
        ai_tags: ['軽量', '高性能'],
      })

      assertType<ACParts>({
        id: 'CR001',
        name: 'テストコア',
        classification: core,
        manufacture: arquebus,
        category: coreCategory,
        price: 200000,
        weight: 1000,
        en_load: 200,
        ai_summary: 'これはテスト用のコアパーツです。',
        ai_tags: ['重装甲'],
      })
    })
  })
})
