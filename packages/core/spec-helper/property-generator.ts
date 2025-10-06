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

/**
 * パーツID検索テスト用のジェネレータ
 */

// 正しいフォーマットのパーツIDを生成 (例: HD001, CR042, FCS001)
export const genPartId = () =>
  fc
    .record({
      prefix: fc.constantFrom('HD', 'CR', 'AR', 'LG', 'BS', 'FCS', 'GN', 'EXP', 'AU', 'BU'),
      number: fc.integer({ min: 1, max: 999 }),
    })
    .map(({ prefix, number }) => `${prefix}${String(number).padStart(3, '0')}`)

export const genPart = () =>
  fc.record({
    id: genPartId(),
    name: fc.string({ minLength: 1, maxLength: 20 }),
  })

export const genParts = (constraints: ArrayConstraints = {}) =>
  fc.array(genPart(), { minLength: 1, maxLength: 20, ...constraints })

// パーツ配列と、その配列に確実に存在するパーツを生成
export const genPartWithId = () =>
  genParts().chain((parts) =>
    fc.record({
      parts: fc.constant(parts),
      targetPart: fc.constantFrom(...parts),
    }),
  )

// パーツ配列と検索ID（存在するかは不明）を生成
export const genPartsAndSearchId = () =>
  fc.record({
    parts: genParts(),
    searchId: genPartId(),
  })

// パーツ配列、検索ID、フォールバックを生成
export const genPartsWithFallback = () =>
  fc.record({
    parts: genParts({ minLength: 0 }),
    searchId: genPartId(),
    fallback: genPart(),
  })
