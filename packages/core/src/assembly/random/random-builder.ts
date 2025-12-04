import {
  type Assembly,
  createAssembly,
  type RawAssembly,
} from '#core/assembly/assembly'

import { boosterMustBeEquipped } from '@ac6_assemble_tool/parts/booster'
import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { random } from '@ac6_assemble_tool/shared/array'

import { deriveAvailableCandidates } from '../availability/derive-candidates'

import { LockedParts } from './lock'

export type RandomBuildOption = Readonly<{
  randomizer?: () => number
  lockedParts?: LockedParts
}>

export const defaultRandomBuildOption: Required<RandomBuildOption> = {
  randomizer: () => Math.random(),
  lockedParts: LockedParts.empty,
}

export function randomBuild(
  candidates: Candidates,
  option: RandomBuildOption = defaultRandomBuildOption,
): Assembly {
  const { lockedParts, randomizer } = { ...defaultRandomBuildOption, ...option }

  /*
   * 「ロックからパーツを取得し、ロックされてなかった場合はランダム選択」という処理自体は
   *  ジェネリクスを活用することで単一の関数として共通化可能.
   *
   * 当初はその方法で実装していたが、結果として型定義の解析が非常に複雑になるらしく、
   * tscによるコンパイルで膨大なメモリが消費されるようになり、CIはおろかローカルですら
   * コンパイルが不可能になった（参考までに、16GBまでtscに割り当てても処理が完了せずOOMで中断）
   * 実例としては以下のジョブ.
   * https://github.com/tooppoo/ac6_assemble_tool/actions/runs/8343264527/job/22833141484
   *
   * 上記を回避するため、非常に冗長ながら処理を一元化せず、個別に処理を当てている.
   */

  // ブースターNotEquippedのロック有無による脚候補の絞り込みを先に評価する
  const availableForLegs = deriveAvailableCandidates({
    assembly: null,
    lockedParts,
    initialCandidates: candidates,
  })
  const legs = lockedParts.get('legs', () =>
    random(availableForLegs.legs, randomizer),
  )

  // 選択された脚を踏まえて最終候補を決定する
  const available = deriveAvailableCandidates({
    assembly: { legs },
    lockedParts,
    initialCandidates: candidates,
  })
  const base: Omit<RawAssembly, 'legs' | 'booster'> = {
    rightArmUnit: lockedParts.get('rightArmUnit', () =>
      random(available.rightArmUnit, randomizer),
    ),
    leftArmUnit: lockedParts.get('leftArmUnit', () =>
      random(available.leftArmUnit, randomizer),
    ),
    rightBackUnit: lockedParts.get('rightBackUnit', () =>
      random(available.rightBackUnit, randomizer),
    ),
    leftBackUnit: lockedParts.get('leftBackUnit', () =>
      random(available.leftBackUnit, randomizer),
    ),

    head: lockedParts.get('head', () => random(available.head, randomizer)),
    core: lockedParts.get('core', () => random(available.core, randomizer)),
    arms: lockedParts.get('arms', () => random(available.arms, randomizer)),

    fcs: lockedParts.get('fcs', () => random(available.fcs, randomizer)),
    generator: lockedParts.get('generator', () =>
      random(available.generator, randomizer),
    ),

    expansion: lockedParts.get('expansion', () =>
      random(available.expansion, randomizer),
    ),
  }

  switch (legs.category) {
    case tank:
      return createAssembly({ ...base, legs, booster: boosterNotEquipped })
    default: {
      const booster = lockedParts.get('booster', () =>
        random(available.booster, randomizer),
      )
      boosterMustBeEquipped(booster)

      return createAssembly({
        ...base,
        legs,
        booster,
      })
    }
  }
}
