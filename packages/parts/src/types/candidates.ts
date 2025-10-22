import type * as ArmUnits from '#parts/arm-units'
import type { Arms } from '#parts/arms'
import type * as BackUnits from '#parts/back-units'
import type { Booster } from '#parts/booster'
import type { Core } from '#parts/cores'
import type * as Expansion from '#parts/expansions'
import type { FCS } from '#parts/fces'
import type { Generator } from '#parts/generators'
import type { Head } from '#parts/heads'
import type { Legs } from '#parts/legs'
import {
  armNotEquipped,
  backNotEquipped,
  expansionNotEquipped,
  type ArmNotEquipped,
  type BackNotEquipped,
  type BoosterNotEquipped,
  type ExpansionNotEquipped,
} from '#parts/not-equipped'
import { tank } from '#parts/types/base/category'
import {
  type Classification,
  notEquipped,
} from '#parts/types/base/classification'

export type CandidatesKey = keyof Candidates
export type Candidates = Readonly<{
  rightArmUnit: ReadonlyArray<ArmUnits.ArmUnit | ArmNotEquipped>
  leftArmUnit: ReadonlyArray<
    ArmUnits.LeftArmUnit | ArmUnits.ArmUnit | ArmNotEquipped
  >
  rightBackUnit: ReadonlyArray<
    BackUnits.BackUnit | ArmUnits.ArmUnit | BackNotEquipped
  >
  leftBackUnit: ReadonlyArray<
    | BackUnits.LeftBackUnit
    | BackUnits.BackUnit
    | ArmUnits.LeftArmUnit
    | ArmUnits.ArmUnit
    | BackNotEquipped
  >

  head: readonly Head[]
  core: readonly Core[]
  arms: readonly Arms[]
  legs: readonly Legs[]

  booster: readonly (Booster | BoosterNotEquipped)[]
  fcs: readonly FCS[]
  generator: readonly Generator[]

  expansion: ReadonlyArray<Expansion.Expansion | ExpansionNotEquipped>
}>

/**
 * CandidatesKeyの全ての有効な値
 * webパッケージなど外部から参照する場合はこの定数を使用すること
 */
export const CANDIDATES_KEYS = [
  'rightArmUnit',
  'leftArmUnit',
  'rightBackUnit',
  'leftBackUnit',
  'head',
  'core',
  'arms',
  'legs',
  'booster',
  'fcs',
  'generator',
  'expansion',
] as const satisfies readonly CandidatesKey[]

export function onlyTank(xs: readonly Legs[]): Legs[] {
  return xs.filter((x) => x.category === tank)
}
export function notTank(xs: readonly Legs[]): Legs[] {
  return xs.filter((x) => x.category !== tank)
}
export function excludeNotEquipped<
  T extends { classification: Classification },
>(xs: readonly T[]): T[] {
  return xs.filter((x) => x.classification !== notEquipped)
}

export type CandidatesDefinition = Readonly<{
  armUnits: ReadonlyArray<ArmUnits.ArmUnit>
  onlyLeftArmUnits: ReadonlyArray<ArmUnits.LeftArmUnit>
  backUnits: ReadonlyArray<BackUnits.BackUnit | ArmUnits.ArmUnit>
  onlyLeftBackUnits: ReadonlyArray<BackUnits.LeftBackUnit>

  head: readonly Head[]
  core: readonly Core[]
  arms: readonly Arms[]
  legs: readonly Legs[]

  booster: readonly (Booster | BoosterNotEquipped)[]
  fcs: readonly FCS[]
  generator: readonly Generator[]

  expansion: ReadonlyArray<Expansion.Expansion | ExpansionNotEquipped>
}>
export function defineCandidates(def: CandidatesDefinition): Candidates {
  return {
    ...def,

    rightArmUnit: [...def.armUnits, armNotEquipped],
    leftArmUnit: [...def.onlyLeftArmUnits, ...def.armUnits, armNotEquipped],
    rightBackUnit: [...def.backUnits, ...def.armUnits, backNotEquipped],
    leftBackUnit: [
      ...def.onlyLeftBackUnits,
      ...def.backUnits,
      ...def.onlyLeftArmUnits,
      ...def.armUnits,
      backNotEquipped,
    ],

    expansion: [...def.expansion, expansionNotEquipped],
  }
}

/**
 * UI上でのパーツの表示順序
 */
export type Order = Record<keyof Candidates, readonly string[]>
export type OrderParts = <K extends keyof Candidates>(
  key: K,
  parts: Candidates[K],
) => Candidates[K]
export function defineOrder(order: Order): OrderParts {
  return <K extends keyof Candidates>(
    key: K,
    parts: Candidates[K],
  ): Candidates[K] => {
    type NamePartsMap = Record<string, Candidates[K][number]>
    const namePartsMap = parts.reduce(
      (acc: NamePartsMap, p: Candidates[K][number]): NamePartsMap => ({
        ...acc,
        [p.name]: p,
      }),
      {} as NamePartsMap,
    )

    return order[key].reduce(
      (acc: Candidates[K], name): Candidates[K] => {
        const item = namePartsMap[name]

        return (item ? [...acc, item] : acc) as Candidates[K]
      },
      [] as Candidates[K],
    )
  }
}
