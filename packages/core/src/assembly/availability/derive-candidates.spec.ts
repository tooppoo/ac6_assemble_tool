
import { createAssembly } from '#core/assembly/assembly'
import { LockedParts } from '#core/assembly/random/lock'

import type { Booster } from '@ac6_assemble_tool/parts/booster'
import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import { candidates as initialCandidates } from '@ac6_assemble_tool/parts/versions/v1.09.1'
import { describe, expect, it } from 'vitest'

import { deriveAvailableCandidates } from './derive-candidates'

const equippedBooster = initialCandidates.booster.find(
  (b): b is Booster => b.classification !== notEquipped,
)!;

const sampleAssembly = createAssembly({
  rightArmUnit: initialCandidates.rightArmUnit[0]!,
  leftArmUnit: initialCandidates.leftArmUnit[0]!,
  rightBackUnit: initialCandidates.rightBackUnit[0]!,
  leftBackUnit: initialCandidates.leftBackUnit[0]!,
  head: initialCandidates.head[0]!,
  core: initialCandidates.core[0]!,
  arms: initialCandidates.arms[0]!,
  legs: initialCandidates.legs.find((l) => l.category !== 'tank')!,
  booster: equippedBooster,
  fcs: initialCandidates.fcs[0]!,
  generator: initialCandidates.generator[0]!,
  expansion: initialCandidates.expansion[0]!,
})

describe('deriveAvailableCandidates', () => {
  it('タンク脚選択時はブースターをNotEquippedに固定し脚候補はタンクのみ', () => {
    const tankAssembly = createAssembly({
      ...sampleAssembly,
      legs: initialCandidates.legs.find((l) => l.category === 'tank')!,
      booster: boosterNotEquipped,
    })

    const candidates = deriveAvailableCandidates({
      assembly: tankAssembly,
      lockedParts: LockedParts.empty,
      initialCandidates,
    })

    expect(candidates.booster).toHaveLength(1)
    expect(candidates.booster[0]?.classification).toBe(notEquipped)
    expect(
      candidates.legs.some((l) => l.category === 'tank'),
    ).toBe(true)
  })

  it('ブースターNotEquippedがロックされている場合、脚候補はタンクのみ', () => {
    const locked = LockedParts.empty.lock('booster', boosterNotEquipped)

    const candidates = deriveAvailableCandidates({
      assembly: sampleAssembly,
      lockedParts: locked,
      initialCandidates,
    })

    expect(candidates.legs.every((l) => l.category === 'tank')).toBe(true)
  })

  it('ブースターNotEquippedが非ロックの場合、脚候補は全脚', () => {
  const boosterFree = createAssembly({
    ...sampleAssembly,
    legs: initialCandidates.legs.find((l) => l.category === 'tank')!,
    booster: boosterNotEquipped,
  })

  const candidates = deriveAvailableCandidates({
    assembly: boosterFree,
    lockedParts: LockedParts.empty,
      initialCandidates,
    })

    expect(candidates.legs.length).toBe(initialCandidates.legs.length)
  })

  it('候補が0件なら例外を投げる', () => {
    const emptyLegs = {
      ...initialCandidates,
      legs: [],
    } as typeof initialCandidates

    expect(() =>
      deriveAvailableCandidates({
        assembly: sampleAssembly,
        lockedParts: LockedParts.empty,
        initialCandidates: emptyLegs,
      }),
    ).toThrowError('候補が0件')
  })
})
