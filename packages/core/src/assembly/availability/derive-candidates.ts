import type { Assembly } from '#core/assembly/assembly'
import type { LockedParts } from '#core/assembly/random/lock'

import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import {
  type Candidates,
  excludeNotEquipped,
  notTank,
  onlyTank,
} from '@ac6_assemble_tool/parts/types/candidates'

const ERROR_EMPTY = '候補が0件です'

// Readonlyプロパティをミュータブルにしつつ、配列は可変配列へ戻すユーティリティ
type Mutable<T> = {
  -readonly [K in keyof T]: MutableArray<T[K]>
}
// readonly 配列なら中身の配列を可変に、それ以外は素通し
type MutableArray<T> = T extends readonly (infer U)[] ? U[] : T

type ConstraintContext = {
  // legs / booster の現在選択状態。未指定ならロック状態のみで制約を判定する。
  assembly?: Partial<Pick<Assembly, 'legs' | 'booster'>> | null
  lockedParts: LockedParts
  initialCandidates: Candidates
}

export function deriveAvailableCandidates({
  assembly,
  lockedParts,
  initialCandidates,
}: ConstraintContext): Candidates {
  const base: Mutable<Candidates> = {
    rightArmUnit: [...initialCandidates.rightArmUnit],
    leftArmUnit: [...initialCandidates.leftArmUnit],
    rightBackUnit: [...initialCandidates.rightBackUnit],
    leftBackUnit: [...initialCandidates.leftBackUnit],
    head: [...initialCandidates.head],
    core: [...initialCandidates.core],
    arms: [...initialCandidates.arms],
    legs: [...initialCandidates.legs],
    booster: [...initialCandidates.booster],
    fcs: [...initialCandidates.fcs],
    generator: [...initialCandidates.generator],
    expansion: [...initialCandidates.expansion],
  }

  const legsContext = lockedParts.peek('legs') ?? assembly?.legs
  const boosterContext = lockedParts.peek('booster') ?? assembly?.booster

  const legsIsTank = legsContext?.category === tank
  const legsLockedTank =
    lockedParts.isLocking('legs') && legsContext?.category === tank
  const boosterLockedNotEquipped =
    lockedParts.isLocking('booster') &&
    boosterContext?.classification === notEquipped

  if (boosterLockedNotEquipped) {
    base.legs = onlyTank(base.legs)
    base.booster = [boosterNotEquipped]
  } else if (legsIsTank || legsLockedTank) {
    base.booster = [boosterNotEquipped]
  } else if (
    boosterContext?.classification !== undefined &&
    boosterContext.classification !== notEquipped
  ) {
    base.legs = notTank(base.legs)
    base.booster = excludeNotEquipped(base.booster)
  } else {
    base.booster = excludeNotEquipped(base.booster)
  }

  assertNonEmpty(base)
  return base
}

function assertNonEmpty(candidates: Candidates) {
  ;(Object.keys(candidates) as Array<keyof Candidates>).forEach((key) => {
    if (candidates[key]?.length === 0) {
      throw new Error(`${ERROR_EMPTY}: ${String(key)}`)
    }
  })
}
