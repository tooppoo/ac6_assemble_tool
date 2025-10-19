import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import fc from 'fast-check'
import { describe, it, expect } from 'vitest'

import { createAssembly, type RawAssembly } from '../assembly'

import { assemblyToSearchV2 } from './as-query-v2'
import { convertV1ToV2 } from './convert-v1-to-v2'
import { deserializeAssembly } from './deserialize-assembly'

import { genAssembly } from '#spec-helper/property-generator'

describe('URL共有フロー統合テスト', () => {
  describe('v2形式URL生成→共有→読み込みフロー', () => {
    it('全部位のパーツが正しく引当される', () => {
      // 機体構成を作成
      const originalAssembly = createAssembly({
        rightArmUnit: candidates.rightArmUnit[1],
        leftArmUnit: candidates.leftArmUnit[2],
        rightBackUnit: candidates.rightBackUnit[3],
        leftBackUnit: candidates.leftBackUnit[4],
        head: candidates.head[5],
        core: candidates.core[6],
        arms: candidates.arms[7],
        legs: candidates.legs[8],
        booster: candidates.booster[9],
        fcs: candidates.fcs[1],
        generator: candidates.generator[2],
        expansion: candidates.expansion[1],
      } as RawAssembly)

      // v2形式URLに変換
      const urlParams = assemblyToSearchV2(originalAssembly)

      // URLパラメータから機体構成を復元
      const restoredAssembly = createAssembly(
        deserializeAssembly(urlParams, candidates),
      )

      // 複数のexpectを1つにまとめて、全ての不一致を一度に確認
      expect({
        rightArmUnit: restoredAssembly.rightArmUnit.id,
        leftArmUnit: restoredAssembly.leftArmUnit.id,
        rightBackUnit: restoredAssembly.rightBackUnit.id,
        leftBackUnit: restoredAssembly.leftBackUnit.id,
        head: restoredAssembly.head.id,
        core: restoredAssembly.core.id,
        arms: restoredAssembly.arms.id,
        legs: restoredAssembly.legs.id,
        booster: restoredAssembly.booster.id,
        fcs: restoredAssembly.fcs.id,
        generator: restoredAssembly.generator.id,
        expansion: restoredAssembly.expansion.id,
      }).toEqual({
        rightArmUnit: originalAssembly.rightArmUnit.id,
        leftArmUnit: originalAssembly.leftArmUnit.id,
        rightBackUnit: originalAssembly.rightBackUnit.id,
        leftBackUnit: originalAssembly.leftBackUnit.id,
        head: originalAssembly.head.id,
        core: originalAssembly.core.id,
        arms: originalAssembly.arms.id,
        legs: originalAssembly.legs.id,
        booster: originalAssembly.booster.id,
        fcs: originalAssembly.fcs.id,
        generator: originalAssembly.generator.id,
        expansion: originalAssembly.expansion.id,
      })
    })

    it('URL長がブラウザ制限内に収まる', () => {
      // 全装備の機体構成を作成
      const assembly = createAssembly({
        rightArmUnit: candidates.rightArmUnit[10],
        leftArmUnit: candidates.leftArmUnit[20],
        rightBackUnit: candidates.rightBackUnit[30],
        leftBackUnit: candidates.leftBackUnit[40],
        head: candidates.head[15],
        core: candidates.core[10],
        arms: candidates.arms[12],
        legs: candidates.legs[18],
        booster: candidates.booster[8],
        fcs: candidates.fcs[5],
        generator: candidates.generator[7],
        expansion: candidates.expansion[2],
      } as RawAssembly)

      const urlParams = assemblyToSearchV2(assembly)
      const urlString = urlParams.toString()

      // ブラウザのURL長制限（2084バイト）内であることを確認
      expect(urlString.length).toBeLessThan(2084)
    })

    // Property-based test: 任意のパーツ構成でURL長制限内
    it('任意のパーツ構成でURL長がブラウザ制限（2084バイト）内に収まる', () => {
      fc.assert(
        fc.property(genAssembly(), (assembly) => {
          const urlParams = assemblyToSearchV2(assembly)
          const urlString = urlParams.toString()

          // ブラウザのURL長制限（2084バイト）内であることを確認
          expect(urlString.length).toBeLessThan(2084)
        }),
        { numRuns: 100 },
      )
    })
  })

  describe('v1形式URL読み込み→自動変換→機体構成復元フロー', () => {
    it('v1形式URLが自動的にv2形式に変換され機体構成が復元される', () => {
      // v1形式URL（インデックスベース）を作成
      const v1Params = new URLSearchParams({
        rau: '5',
        lau: '10',
        rbu: '15',
        lbu: '20',
        h: '8',
        c: '4',
        a: '6',
        l: '10',
        b: '3',
        f: '2',
        g: '5',
        e: '1',
      })

      // v1形式URLから機体構成を復元（自動変換）
      const restoredAssembly = createAssembly(
        deserializeAssembly(v1Params, candidates),
      )

      // 期待されるパーツIDを取得
      const expectedRightArmUnit = candidates.rightArmUnit[5]
      const expectedLeftArmUnit = candidates.leftArmUnit[10]
      const expectedHead = candidates.head[8]
      const expectedCore = candidates.core[4]

      // 複数のexpectを1つにまとめて、全ての不一致を一度に確認
      expect({
        rightArmUnit: restoredAssembly.rightArmUnit.id,
        leftArmUnit: restoredAssembly.leftArmUnit.id,
        head: restoredAssembly.head.id,
        core: restoredAssembly.core.id,
      }).toEqual({
        rightArmUnit: expectedRightArmUnit.id,
        leftArmUnit: expectedLeftArmUnit.id,
        head: expectedHead.id,
        core: expectedCore.id,
      })
    })

    it('v1→v2変換後のURLがv2形式になる', () => {
      const v1Params = new URLSearchParams({
        h: '0',
        c: '1',
        a: '2',
        l: '3',
        b: '4',
        f: '5',
        g: '6',
        e: '0',
        rau: '0',
        lau: '0',
        rbu: '0',
        lbu: '0',
      })

      const v2Params = convertV1ToV2(v1Params, candidates)

      // v2形式の各パラメータを確認
      expect({
        version: v2Params.get('v'),
        headIdFormat: v2Params.get('h')?.match(/^[A-Z]+\d+$/) !== null,
        coreIdFormat: v2Params.get('c')?.match(/^[A-Z]+\d+$/) !== null,
      }).toEqual({
        version: '2',
        headIdFormat: true,
        coreIdFormat: true,
      })
    })
  })

  describe('エッジケース', () => {
    it('存在しないIDの場合は配列の最初の要素にフォールバック', () => {
      const invalidParams = new URLSearchParams({
        v: '2',
        h: 'INVALID_ID',
        c: 'CR001',
        a: 'AR001',
        l: 'LG001',
        b: 'BS001',
        f: 'FCS001',
        g: 'GN001',
        e: 'EXP001',
        rau: 'AU001',
        lau: 'AU001',
        rbu: 'BU001',
        lbu: 'BU001',
      })

      const restoredAssembly = createAssembly(
        deserializeAssembly(invalidParams, candidates),
      )

      // 存在しないIDと正常なIDの結果を確認
      expect({
        head: restoredAssembly.head.id,
        core: restoredAssembly.core.id,
      }).toEqual({
        head: candidates.head[0].id,
        core: 'CR001',
      })
    })

    it('パラメータが欠けている場合は配列の最初の要素を使用', () => {
      const incompleteParams = new URLSearchParams({
        v: '2',
        // headパラメータなし
        c: 'CR002',
        a: 'AR001',
        l: 'LG001',
        b: 'BS001',
        f: 'FCS001',
        g: 'GN001',
        e: 'EXP001',
        rau: 'AU001',
        lau: 'AU001',
        rbu: 'BU001',
        lbu: 'BU001',
      })

      const restoredAssembly = createAssembly(
        deserializeAssembly(incompleteParams, candidates),
      )

      expect({
        head: restoredAssembly.head.id,
        core: restoredAssembly.core.id,
      }).toEqual({
        head: candidates.head[0].id,
        core: 'CR002',
      })
    })
  })
})
