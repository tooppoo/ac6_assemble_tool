import { createAssembly } from '#core/assembly/assembly'
import { assemblyToSearchV2 } from '#core/assembly/serialize/as-query-v2'
import { convertV1ToV2 } from '#core/assembly/serialize/convert-v1-to-v2'
import { deserializeAssembly } from '#core/assembly/serialize/deserialize-assembly'

import { armUnits } from '@ac6_assemble_tool/parts/arm-units'
import { arms } from '@ac6_assemble_tool/parts/arms'
import { backUnits } from '@ac6_assemble_tool/parts/back-units'
import { boosters } from '@ac6_assemble_tool/parts/booster'
import { cores } from '@ac6_assemble_tool/parts/cores'
import { expansions } from '@ac6_assemble_tool/parts/expansions'
import { fcses } from '@ac6_assemble_tool/parts/fces'
import { generators } from '@ac6_assemble_tool/parts/generators'
import { heads } from '@ac6_assemble_tool/parts/heads'
import { legs } from '@ac6_assemble_tool/parts/legs'
import {
  boosterNotEquipped,
  expansionNotEquipped,
  armNotEquipped,
  backNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { validatePartIdUniqueness } from '@ac6_assemble_tool/parts/validation/id-validator'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { describe, it, expect } from 'vitest'

describe('パフォーマンス検証', () => {
  describe('全パーツID検証', () => {
    it('起動時ID検証が100ms以内で完了する', () => {
      const allParts = [
        ...heads,
        ...cores,
        ...arms,
        ...legs,
        ...boosters,
        ...fcses,
        ...generators,
        ...expansions,
        ...armUnits,
        ...backUnits,
        boosterNotEquipped,
        expansionNotEquipped,
        armNotEquipped,
        backNotEquipped,
      ]

      const start = performance.now()

      const result = validatePartIdUniqueness(allParts)

      const end = performance.now()
      const duration = end - start

      expect(result).toBeNull() // 重複なし
      expect(duration).toBeLessThan(100)
    })
  })

  describe('v1→v2変換', () => {
    it('v1→v2変換が500ms以内で完了する', () => {
      const v1Params = new URLSearchParams({
        h: '10',
        c: '8',
        a: '12',
        l: '15',
        b: '7',
        f: '5',
        g: '9',
        e: '2',
        rau: '20',
        lau: '25',
        rbu: '30',
        lbu: '35',
      })

      const start = performance.now()

      // 100回実行して平均時間を測定
      for (let i = 0; i < 100; i++) {
        convertV1ToV2(v1Params, candidates)
      }

      const end = performance.now()
      const averageDuration = (end - start) / 100

      expect(averageDuration).toBeLessThan(5) // 平均5ms未満（100回で500ms未満）
    })

    it('v1形式からの完全な復元が500ms以内で完了する', () => {
      const v1Params = new URLSearchParams({
        h: '5',
        c: '3',
        a: '7',
        l: '10',
        b: '4',
        f: '2',
        g: '6',
        e: '1',
        rau: '15',
        lau: '20',
        rbu: '25',
        lbu: '30',
      })

      const start = performance.now()

      // 10回実行
      for (let i = 0; i < 10; i++) {
        const assembly = deserializeAssembly(v1Params, candidates)
        createAssembly(assembly)
      }

      const end = performance.now()
      const totalDuration = end - start

      expect(totalDuration).toBeLessThan(500)
    })
  })

  describe('URL長', () => {
    it('12部位全装備時のURL長が2084バイト以内', () => {
      // 最も名前が長いパーツを選択（IDも長い可能性がある）
      const assembly = createAssembly({
        rightArmUnit: candidates.rightArmUnit[30],
        leftArmUnit: candidates.leftArmUnit[40],
        rightBackUnit: candidates.rightBackUnit[20],
        leftBackUnit: candidates.leftBackUnit[25],
        head: candidates.head[15],
        core: candidates.core[10],
        arms: candidates.arms[12],
        legs: candidates.legs[18],
        booster: candidates.booster[8],
        fcs: candidates.fcs[7],
        generator: candidates.generator[10],
        expansion: candidates.expansion[2],
      })

      const urlParams = assemblyToSearchV2(assembly)
      const urlString = urlParams.toString()

      // ブラウザのURL長制限（Internet Explorerの制限値）
      expect(urlString.length).toBeLessThan(2084)

      // より厳しい基準として、1000バイト以内であることも確認
      // （現代のブラウザはもっと長いURLに対応しているが、短い方が良い）
      expect(urlString.length).toBeLessThan(1000)
    })

    it('URL長の内訳を確認', () => {
      const assembly = createAssembly({
        rightArmUnit: candidates.rightArmUnit[0],
        leftArmUnit: candidates.leftArmUnit[0],
        rightBackUnit: candidates.rightBackUnit[0],
        leftBackUnit: candidates.leftBackUnit[0],
        head: candidates.head[0],
        core: candidates.core[0],
        arms: candidates.arms[0],
        legs: candidates.legs[0],
        booster: candidates.booster[0],
        fcs: candidates.fcs[0],
        generator: candidates.generator[0],
        expansion: candidates.expansion[0],
      })

      const urlParams = assemblyToSearchV2(assembly)
      const urlString = urlParams.toString()

      // パラメータ数は13（v + 12部位）
      const paramCount = Array.from(urlParams.keys()).length
      expect(paramCount).toBe(13)

      // 各パラメータの長さを確認
      console.log('URL length:', urlString.length)
      console.log('URL:', urlString)
      for (const [key, value] of urlParams.entries()) {
        console.log(
          `  ${key}=${value} (${key.length + 1 + value.length} chars)`,
        )
      }
    })
  })

  describe('デシリアライズ性能', () => {
    it('v2形式URLのデシリアライズが高速', () => {
      const params = new URLSearchParams({
        v: '2',
        h: 'HD010',
        c: 'CR008',
        a: 'AR012',
        l: 'LG015',
        b: 'BS007',
        f: 'FCS005',
        g: 'GN009',
        e: 'EXP002',
        rau: 'AU020',
        lau: 'AU025',
        rbu: 'BU030',
        lbu: 'BU035',
      })

      const start = performance.now()

      // 100回実行
      for (let i = 0; i < 100; i++) {
        deserializeAssembly(params, candidates)
      }

      const end = performance.now()
      const averageDuration = (end - start) / 100

      // 平均1ms未満
      expect(averageDuration).toBeLessThan(1)
    })
  })
})
