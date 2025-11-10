import { type Assembly, createAssembly } from '#core/assembly/assembly'
import { changeAssemblyCommand } from '#core/assembly/command/change-assembly'

import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.07'
import { beforeEach, describe, expect, it } from 'vitest'

describe('changeAssembly', () => {
  const change = changeAssemblyCommand(candidates)
  const defaultBooster = pickEquippable(candidates.booster)
  let baseAssembly: Assembly
  let baseCandidates: Candidates

  beforeEach(() => {
    baseAssembly = createAssemblyFromCandidates(candidates)
    baseCandidates = candidates
  })

  it('タンク脚部を選択した場合はブースターを未装備にする', () => {
    const tankLeg = candidates.legs.find((leg) => leg.category === tank)
    if (!tankLeg) {
      throw new Error('タンク脚部の候補が見つかりません')
    }

    const result = change('legs', tankLeg, baseAssembly, baseCandidates)

    expect(result.assembly.legs).toBe(tankLeg)
    expect(result.assembly.booster).toBe(boosterNotEquipped)
  })

  it('タンク脚部を選択した場合はブースター候補を未装備のみにする', () => {
    const tankLeg = candidates.legs.find((leg) => leg.category === tank)
    if (!tankLeg) {
      throw new Error('タンク脚部の候補が見つかりません')
    }

    const result = change('legs', tankLeg, baseAssembly, baseCandidates)

    expect(result.assembly.legs).toBe(tankLeg)
    expect(result.remainingCandidates.booster).toEqual([boosterNotEquipped])
  })

  it('タンク以外の脚部を選択した場合は既存ブースターを維持し、候補一覧を戻す', () => {
    const nonTankLeg = candidates.legs.find((leg) => leg.category !== tank)
    if (!nonTankLeg) {
      throw new Error('非タンク脚部の候補が見つかりません')
    }

    const result = change('legs', nonTankLeg, baseAssembly, {
      ...baseCandidates,
      booster: [boosterNotEquipped],
    })

    expect(result.assembly.legs).toBe(nonTankLeg)
    expect(result.assembly.booster).toBe(baseAssembly.booster)
    expect(result.remainingCandidates.booster).toEqual(candidates.booster)
  })

  it('タンク状態からタンク以外に戻す場合はデフォルトブースターを自動装備する', () => {
    const tankLeg = candidates.legs.find((leg) => leg.category === tank)!
    const tankAssembly = createAssembly({
      ...baseAssembly,
      legs: tankLeg,
      booster: boosterNotEquipped,
    })

    const nonTankLeg = candidates.legs.find((leg) => leg.category !== tank)!
    const result = change('legs', nonTankLeg, tankAssembly, {
      ...baseCandidates,
      booster: [boosterNotEquipped],
    })

    expect(result.assembly.legs).toBe(nonTankLeg)
    expect(result.assembly.booster).toBe(defaultBooster)
    expect(result.remainingCandidates.booster).toEqual(candidates.booster)
  })

  it('タンク状態で脚部以外を変更してもブースター候補は未装備のみのまま', () => {
    const tankLeg = candidates.legs.find((leg) => leg.category === tank)!
    const head = candidates.head[1]
    const tankAssembly = createAssembly({
      ...baseAssembly,
      legs: tankLeg,
      booster: boosterNotEquipped,
    })
    const tankCandidates: Candidates = {
      ...baseCandidates,
      booster: [boosterNotEquipped],
    }

    const result = change('head', head, tankAssembly, tankCandidates)

    expect(result.assembly.head).toBe(head)
    expect(result.remainingCandidates.booster).toEqual([boosterNotEquipped])
  })

  it('右手武器を装備すると同一装備を右肩候補から除外する', () => {
    const armUnit = findSharedArmUnit(
      candidates.rightArmUnit,
      candidates.rightBackUnit,
    )

    const result = change('rightArmUnit', armUnit, baseAssembly, baseCandidates)

    expect(result.assembly.rightArmUnit).toBe(armUnit)
    expect(
      result.remainingCandidates.rightBackUnit.some((p) => p.id === armUnit.id),
    ).toBe(false)
  })

  it('右肩で腕武器を装備すると同一装備を右手候補から除外する', () => {
    const armUnitOnBack = findSharedArmUnit(
      candidates.rightBackUnit,
      candidates.rightArmUnit,
    )

    const result = change(
      'rightBackUnit',
      armUnitOnBack,
      baseAssembly,
      baseCandidates,
    )

    expect(result.assembly.rightBackUnit).toBe(armUnitOnBack)
    expect(
      result.remainingCandidates.rightArmUnit.some(
        (p) => p.id === armUnitOnBack.id,
      ),
    ).toBe(false)
  })

  it('左手武器を装備すると同一装備を左肩候補から除外する', () => {
    const armUnit = findSharedArmUnit(
      candidates.leftArmUnit,
      candidates.leftBackUnit,
    )

    const result = change('leftArmUnit', armUnit, baseAssembly, baseCandidates)

    expect(result.assembly.leftArmUnit).toBe(armUnit)
    expect(
      result.remainingCandidates.leftBackUnit.some((p) => p.id === armUnit.id),
    ).toBe(false)
  })

  it('左肩で腕武器を装備すると同一装備を左手候補から除外する', () => {
    const armUnitOnBack = findSharedArmUnit(
      candidates.leftBackUnit,
      candidates.leftArmUnit,
    )

    const result = change(
      'leftBackUnit',
      armUnitOnBack,
      baseAssembly,
      baseCandidates,
    )

    expect(result.assembly.leftBackUnit).toBe(armUnitOnBack)
    expect(
      result.remainingCandidates.leftArmUnit.some(
        (p) => p.id === armUnitOnBack.id,
      ),
    ).toBe(false)
  })

  it('制約対象外のスロット変更では候補一覧を変更しない', () => {
    const fcs = candidates.fcs[0]

    const result = change('fcs', fcs, baseAssembly, baseCandidates)

    expect(result.assembly.fcs).toBe(fcs)
    expect(result.remainingCandidates).toBe(candidates)
  })
})

function createAssemblyFromCandidates(base: Candidates): Assembly {
  return createAssembly({
    rightArmUnit: pickEquippable(base.rightArmUnit),
    leftArmUnit: pickEquippable(base.leftArmUnit),
    rightBackUnit: pickEquippable(base.rightBackUnit),
    leftBackUnit: pickEquippable(base.leftBackUnit),
    head: base.head[0],
    core: base.core[0],
    arms: base.arms[0],
    legs: base.legs[0],
    booster: pickEquippable(base.booster),
    fcs: base.fcs[0],
    generator: base.generator[0],
    expansion: base.expansion[0],
  } as never)
}

function pickEquippable<T extends { classification: string }>(
  parts: readonly T[],
): T {
  const found = parts.find((part) => part.classification !== notEquipped)
  if (!found) {
    throw new Error('有効な候補が存在しません')
  }

  return found
}

function findSharedArmUnit<T extends { classification: string; id: string }>(
  source: readonly T[],
  target: readonly { id: string }[],
): T {
  const found = source.find(
    (part) =>
      part.classification !== notEquipped &&
      target.some((candidate) => candidate.id === part.id),
  )
  if (!found) {
    throw new Error('共有可能な武器が見つかりません')
  }

  return found
}
