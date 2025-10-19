
import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { random } from '@ac6_assemble_tool/shared/array'
import { it, fc, test } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

import { LockedParts } from './lock'

import {
  genAssembly,
  genAssemblyKeys,
  genCandidates,
  genLockedParts,
} from '#spec-helper/property-generator'

describe(LockedParts.name, () => {
  it.prop([genLockedParts()])(
    'list is same with lockedKeys',
    ({ lockedParts }) => {
      expect(lockedParts.list.length).toEqual(lockedParts.lockedKeys.length)
    },
  )
  test.prop([
    genLockedParts(),
    genAssembly()
      .chain((a1) =>
        fc.record({
          a1: fc.constant(a1),
          a2: genAssembly(),
          key: genAssemblyKeys({ minLength: 1 }).map(random),
        }),
      )
      .filter(({ a1, a2, key }) => a1[key].name !== a2[key].name),
  ])('lock state transition', ({ lockedParts }, { a1, a2, key }) => {
    const stat1 = lockedParts.lock(key, a1[key])
    expect(stat1.isLocking(key)).toBe(true)
    expect(stat1.lockedKeys).toContain(key)
    expect(stat1.get(key, () => a2[key])).toEqual(a1[key])

    const stat2 = lockedParts.unlock(key)
    expect(stat2.isLocking(key)).toBe(false)
    expect(stat2.lockedKeys).not.toContain(key)
    expect(stat2.get(key, () => a1[key])).toEqual(a1[key])

    const stat3 = lockedParts.lock(key, a2[key])
    expect(stat3.isLocking(key)).toBe(true)
    expect(stat3.lockedKeys).toContain(key)
    expect(stat3.get(key, () => a1[key])).toEqual(a2[key])

    const stat4 = lockedParts.lock(key, a1[key])
    expect(stat4.isLocking(key)).toBe(true)
    expect(stat4.lockedKeys).toContain(key)
    expect(stat4.get(key, () => a2[key])).toEqual(a1[key])
  })

  describe('when lock booster', () => {
    const genBooster = () =>
      fc.oneof(
        fc
          .integer({ min: 0, max: candidates.booster.length - 1 })
          .map((i) => candidates.booster[i]),
      )

    it.prop([
      genLockedParts(),
      fc.oneof(fc.constant(boosterNotEquipped), genBooster()),
    ])('not lock legs', ({ lockedParts }, booster) => {
      expect(lockedParts.lock('booster', booster).isLocking('legs')).toBe(false)
    })

    describe('with not-equipped', () => {
      it.prop([genLockedParts(), genCandidates()])(
        'filter only tank legs',
        ({ lockedParts }, candidates) => {
          const filtered = lockedParts
            .lock('booster', boosterNotEquipped)
            .filter(candidates)

          expect(filtered).toMatchObject({
            ...candidates,
            legs: candidates.legs.filter((l) => l.category === tank),
          })
        },
      )
    })
    describe('with equipped', () => {
      it.prop([genLockedParts(), genCandidates()])(
        'filter only two, four or reverse joint legs',
        ({ lockedParts }, candidates) => {
          const filtered = lockedParts
            .lock('booster', random(candidates.booster))
            .filter(candidates)

          expect(filtered).toMatchObject({
            ...candidates,
            legs: candidates.legs.filter((l) => l.category !== tank),
          })
        },
      )
    })
  })

  describe('when lock legs', () => {
    const genLeg = () =>
      fc.oneof(
        fc
          .integer({ min: 0, max: candidates.legs.length - 1 })
          .map((i) => candidates.legs[i]),
      )

    it.prop([genLockedParts(), genLeg()])(
      'not lock booster',
      ({ lockedParts }, legs) => {
        expect(lockedParts.lock('legs', legs).isLocking('booster')).toBe(false)
      },
    )

    describe('with tank', () => {
      it.prop([
        genLockedParts(),
        genLeg().filter((l) => l.category === 'tank'),
        genCandidates(),
      ])(
        'booster should not be equipped',
        ({ lockedParts }, legs, candidates) => {
          const filtered = lockedParts.lock('legs', legs).filter(candidates)

          expect(filtered).toMatchObject({
            ...candidates,
            booster: [boosterNotEquipped],
          })
        },
      )
    })
    describe('with not tank', () => {
      it.prop([
        genLockedParts(),
        genLeg().filter((l) => l.category !== 'tank'),
        genCandidates(),
      ])(
        'booster should not be equipped',
        ({ lockedParts }, legs, candidates) => {
          const filtered = lockedParts.lock('legs', legs).filter(candidates)

          expect(filtered).toMatchObject({
            ...candidates,
            booster: candidates.booster.filter(
              (b) => b.classification !== notEquipped,
            ),
          })
        },
      )
    })
  })
})
