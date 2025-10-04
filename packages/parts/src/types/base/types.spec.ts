import { describe, it, expect, expectTypeOf } from 'vitest'

import { head as headCategory, core as coreCategory, arms as armsCategory, two_legs as twoLegsCategory, assault_rifle } from './category'
import { head, core, arms, legs } from './classification'
import { allmind, arquebus } from './manufacture'
import type { ACParts } from './types'

describe('ACParts型', () => {
  describe('IDフィールド', () => {
    it('id フィールドを持つことができる', () => {
      // グローバルユニークIDを持つパーツオブジェクトを作成
      const part: ACParts = {
        id: 'HD001',
        name: 'テストヘッド',
        classification: head,
        manufacture: allmind,
        category: headCategory,
        price: 100000,
        weight: 500,
        en_load: 100,
      }

      expect(part.id).toBe('HD001')
      expect(part.name).toBe('テストヘッド')
    })

    it('idは文字列型である', () => {
      const part: ACParts = {
        id: 'CR001',
        name: 'テストコア',
        classification: core,
        manufacture: arquebus,
        category: coreCategory,
        price: 200000,
        weight: 1000,
        en_load: 200,
      }

      expect(typeof part.id).toBe('string')
    })

    it('異なるパーツは異なるIDを持つ', () => {
      const part1: ACParts = {
        id: 'HD001',
        name: 'ヘッドA',
        classification: head,
        manufacture: allmind,
        category: headCategory,
        price: 100000,
        weight: 500,
        en_load: 100,
      }

      const part2: ACParts = {
        id: 'HD002',
        name: 'ヘッドB',
        classification: head,
        manufacture: allmind,
        category: headCategory,
        price: 110000,
        weight: 520,
        en_load: 110,
      }

      expect(part1.id).not.toBe(part2.id)
    })

    it('カテゴリコードと連番の形式を持つ', () => {
      const testCases: Array<{ id: string; classification: string; category: string }> = [
        { id: 'HD001', classification: head, category: headCategory },
        { id: 'CR042', classification: core, category: coreCategory },
        { id: 'AR123', classification: arms, category: armsCategory },
        { id: 'LG001', classification: legs, category: twoLegsCategory },
        { id: 'WP001', classification: 'arm-unit', category: assault_rifle },
      ]

      testCases.forEach(({ id, classification, category }) => {
        const part: ACParts = {
          id,
          name: 'テストパーツ',
          classification,
          manufacture: allmind,
          category,
          price: 100000,
          weight: 500,
          en_load: 100,
        }

        // IDが{2-3文字カテゴリコード}{3-4桁連番}の形式であることを確認
        expect(part.id).toMatch(/^[A-Z]{2,3}\d{3,4}$/)
      })
    })

    it('型チェック: idフィールドは必須である', () => {
      expectTypeOf<ACParts>().toHaveProperty('id')
      expectTypeOf<ACParts['id']>().toBeString()
    })

    it('型チェック: idフィールドは読み取り専用である', () => {
      type ACPartsId = ACParts['id']
      expectTypeOf<ACPartsId>().toEqualTypeOf<string>()

      // ACParts型全体がReadonlyであることを確認
      type IsReadonly = ACParts extends Readonly<Record<string, unknown>> ? true : false
      expectTypeOf<IsReadonly>().toEqualTypeOf<true>()
    })
  })
})
