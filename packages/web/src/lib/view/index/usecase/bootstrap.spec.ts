import { latest as regulation } from '$lib/regulation'

import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { bootstrap } from './bootstrap'
import { initializeAssembly } from './initialize-assembly'

describe('bootstrap', () => {
  const candidates = regulation.candidates
  let baseUrl: URL

  beforeEach(() => {
    baseUrl = new URL('https://example.com/')
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('正常系：URLクエリからアセンブリを正しく初期化', () => {
    it('有効なクエリパラメータから正しくアセンブリを構築できる', () => {
      const baseAssembly = initializeAssembly(candidates)
      const search = `?${assemblyToSearchV2(baseAssembly).toString()}`
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      expect(result.assembly).toMatchObject(baseAssembly)
      expect(result.partsPool.candidates).toBe(candidates)
      expect(result.migratedUrl).toBeUndefined()
    })

    it('v2形式のクエリはマイグレーション不要', () => {
      const baseAssembly = initializeAssembly(candidates)
      const v2Query = assemblyToSearchV2(baseAssembly)
      const search = `?lng=ja&${v2Query.toString()}`
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      expect(result.migratedUrl).toBeUndefined()
    })
  })

  describe('正常系：パーツプール制約を適用', () => {
    it('*_parts パラメータで候補を制約できる', () => {
      const allowedHeads = candidates.head.slice(0, 2)
      const ids = allowedHeads.map((p) => p.id).join(',')
      // スロット制約のみのクエリ（アセンブリパラメータなし）
      const search = `?head_parts=${ids}`
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      // スロット制約が適用される
      expect(result.partsPool.candidates.head).toHaveLength(2)
      expect(result.partsPool.restrictedSlots.head).toEqual(
        allowedHeads.map((p) => p.id),
      )
      expect(result.partsPool.candidates.head.map((p) => p.id)).toEqual(
        allowedHeads.map((p) => p.id),
      )
      // アセンブリパラメータがないためv1マイグレーションが発生する
      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')
    })

    it('複数スロットに制約を適用できる', () => {
      const allowedHeads = candidates.head.slice(0, 2)
      const allowedArms = candidates.arms.slice(0, 3)
      // スロット制約のみのクエリ
      const search = `?head_parts=${allowedHeads.map((p) => p.id).join(',')}&arms_parts=${allowedArms.map((p) => p.id).join(',')}`
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      // 複数スロットの制約が適用される
      expect(result.partsPool.candidates.head).toHaveLength(2)
      expect(result.partsPool.candidates.arms).toHaveLength(3)
      expect(result.partsPool.restrictedSlots.head).toBeDefined()
      expect(result.partsPool.restrictedSlots.arms).toBeDefined()
      // アセンブリパラメータがないためv1マイグレーションが発生する
      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')
    })
  })

  describe('正常系：v1パラメータをv2にマイグレーション', () => {
    it('v1形式のクエリをv2形式に変換する', () => {
      // v1形式: パラメータ名に'v'がない
      const baseAssembly = initializeAssembly(candidates)
      const v2Query = assemblyToSearchV2(baseAssembly)
      // v1形式を模擬するため'v=2'を削除
      v2Query.delete('v')
      const search = `?${v2Query.toString()}`
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      // マイグレーションが発生していることを確認
      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')
    })

    it('マイグレーション後のURLに非アセンブリパラメータが保持される', () => {
      const baseAssembly = initializeAssembly(candidates)
      const v2Query = assemblyToSearchV2(baseAssembly)
      v2Query.delete('v')
      const search = `?lng=ja&foo=bar&${v2Query.toString()}`
      const url = new URL(`https://example.com/${search}`)

      const result = bootstrap(url, candidates)

      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('lng')).toBe('ja')
      expect(result.migratedUrl?.searchParams.get('foo')).toBe('bar')
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')
    })

    it('マイグレーション後のURLのパスとホストが保持される', () => {
      const baseAssembly = initializeAssembly(candidates)
      const v2Query = assemblyToSearchV2(baseAssembly)
      v2Query.delete('v')
      const search = `?${v2Query.toString()}`
      const url = new URL(`https://example.com/test/path${search}`)

      const result = bootstrap(url, candidates)

      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.hostname).toBe('example.com')
      expect(result.migratedUrl?.pathname).toBe('/test/path')
    })
  })

  describe('エッジケース：空のクエリ', () => {
    it('空のクエリでもデフォルトアセンブリが返される', () => {
      const result = bootstrap(baseUrl, candidates)

      expect(result.assembly).toBeDefined()
      expect(result.partsPool.candidates).toBe(candidates)
      // v1マイグレーションが発生するため migratedUrl が設定される
      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')
    })

    it('?のみのクエリでもデフォルトアセンブリが返される', () => {
      baseUrl.search = '?'
      const result = bootstrap(baseUrl, candidates)

      expect(result.assembly).toBeDefined()
      expect(result.partsPool.candidates).toBe(candidates)
      // v1マイグレーションが発生するため migratedUrl が設定される
      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')
    })
  })

  describe('エッジケース：不正なパラメータ', () => {
    it('存在しないパーツIDでもエラーにならない', () => {
      const search = '?head=INVALID_ID&arms=INVALID_ID2'
      baseUrl.search = search

      expect(() => bootstrap(baseUrl, candidates)).not.toThrow()

      const result = bootstrap(baseUrl, candidates)
      expect(result.assembly).toBeDefined()
    })

    it('不正なスロット制約パラメータは無視される', () => {
      const search = '?invalid_slot_parts=ID1,ID2'
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      expect(result.partsPool.candidates).toBe(candidates)
      expect(result.partsPool.restrictedSlots).toEqual({})
    })

    it('存在しないパーツIDでの制約は無視され全候補が使われる', () => {
      const search = '?head_parts=INVALID_ID1,INVALID_ID2'
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      // 制約が適用されず、元の候補がそのまま使われる
      expect(result.partsPool.candidates).toBe(candidates)
      expect(result.partsPool.restrictedSlots.head).toBeUndefined()
    })

    it('空のIDリストでの制約は無視される', () => {
      const search = '?head_parts=  ,  , '
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      expect(result.partsPool.candidates).toBe(candidates)
      expect(result.partsPool.restrictedSlots.head).toBeUndefined()
    })
  })

  describe('統合テスト：制約とマイグレーションの組み合わせ', () => {
    it('パーツプール制約とv1マイグレーションを同時に適用できる', () => {
      const allowedHeads = candidates.head.slice(0, 2)
      const baseAssembly = initializeAssembly(candidates)
      const v2Query = assemblyToSearchV2(baseAssembly)
      v2Query.delete('v') // v1形式に
      const search = `?head_parts=${allowedHeads.map((p) => p.id).join(',')}&${v2Query.toString()}`
      baseUrl.search = search

      const result = bootstrap(baseUrl, candidates)

      // 制約が適用されている
      expect(result.partsPool.candidates.head).toHaveLength(2)
      expect(result.partsPool.restrictedSlots.head).toBeDefined()

      // マイグレーションも発生している
      expect(result.migratedUrl).toBeDefined()
      expect(result.migratedUrl?.searchParams.get('v')).toBe('2')

      expect(result.migratedUrl?.searchParams.get('head_parts')).toBe(
        `${allowedHeads.map((p) => p.id).join(',')}`,
      )
    })
  })
})
