import {
  type AssemblyKey,
  assemblyKeys,
  type RawAssembly,
} from '#core/assembly/assembly'
import type {
  FilterApplyContext,
  WholeFilter,
} from '#core/assembly/filter/base'
import { PartsFilterSet } from '#core/assembly/filter/filter-set'
import { LockedParts } from '#core/assembly/random/lock'
import { randomBuild } from '#core/assembly/random/random-builder'
import { random } from '#core/utils/array'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import fc from 'fast-check'
import { type Arbitrary, type ArrayConstraints } from 'fast-check'

export const genAssembly = (candidates: Candidates | null = null) =>
  (candidates ? fc.constant(candidates) : genCandidates()).map(randomBuild)
export const genAssemblyKeys = (
  cons: ArrayConstraints = {},
): fc.Arbitrary<AssemblyKey[]> =>
  fc.uniqueArray(fc.constantFrom(...assemblyKeys()), cons)

type AssemblyKeyConstraint =
  | { only: AssemblyKey[]; without?: undefined }
  | { only?: undefined; without: AssemblyKey[] }
  | { only?: undefined; without?: undefined }
export const genAssemblyKey = ({
  only,
  without,
}: AssemblyKeyConstraint = {}): fc.Arbitrary<AssemblyKey> =>
  genAssemblyKeys({ minLength: 1 })
    .map(random)
    .filter((k) => {
      if (only) return only.some((v) => v === k)
      if (without) return without.every((v) => v !== k)

      return true
    })

export const genLockedParts = () =>
  genAssemblyPartWithKeyPairs().map((pairs) => ({
    pairs,
    lockedParts: pairs.reduce(
      (lc, { key, part }) => lc.lock(key, part),
      LockedParts.empty,
    ),
  }))
const genAssemblyPartWithKeyPairs = () =>
  genAssembly()
    .chain((assembly) =>
      fc.record({
        assembly: fc.constant(assembly as RawAssembly),
        keys: fc.uniqueArray(fc.constantFrom(...assemblyKeys()), {
          minLength: 0,
          maxLength: assemblyKeys().length,
        }),
      }),
    )
    .map(({ assembly, keys }) =>
      keys.map((key) => ({
        key,
        part: assembly[key],
      })),
    )

export const genCandidates = (() => {
  const toArray =
    (constraints: ArrayConstraints) =>
    <T>(xs: readonly T[]): Arbitrary<T[]> =>
      fc.uniqueArray(fc.constantFrom(...xs), constraints)

  return (constraints: ArrayConstraints = { minLength: 1 }) => {
    const toArr = toArray(constraints)

    return fc.record<Candidates>({
      rightArmUnit: toArr(candidates.rightArmUnit),
      leftArmUnit: toArr(candidates.leftArmUnit),
      rightBackUnit: toArr(candidates.rightBackUnit),
      leftBackUnit: toArr(candidates.leftBackUnit),

      head: toArr(candidates.head),
      core: toArr(candidates.core),
      arms: toArr(candidates.arms),
      legs: toArr(candidates.legs),

      booster: toArr(candidates.booster),
      fcs: toArr(candidates.fcs),
      generator: toArr(candidates.generator),

      expansion: toArr(candidates.expansion),
    })
  }
})()

export const genFilterApplyContext = () =>
  genAssembly().map(
    (assembly): FilterApplyContext => ({
      assembly,
      wholeFilter: assemblyKeys().reduce(
        (acc, k) => ({
          ...acc,
          [k]: PartsFilterSet.empty,
        }),
        {} as WholeFilter,
      ),
    }),
  )

const genPartIdForSlot = (slot: AssemblyKey, opt: { idMin: number, idMax: number }) => fc.integer({ min: opt.idMin, max: opt.idMax })
  .map((v) => v.toString().padStart(3, '0'))
  .map((id) => {
    switch (slot) {
      case 'core':
        return `CR${id}`
      case 'head':
        return `HD${id}`
      // 省略
      default:
        throw new Error(`Unsupported slot: ${slot}`)
    }
  })
const genAssemblyKeyAndPartIdPair = (opt: { idMin: number, idMax: number }) => genAssemblyKeys().chain((slots) => fc.tuple(
  ...slots.map((slot) => fc.tuple(
    fc.constant(slot),
    genPartIdForSlot(slot, opt),
  ))
))
