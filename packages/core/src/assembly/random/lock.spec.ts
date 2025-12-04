import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { random } from '@ac6_assemble_tool/shared/array'
import { it, fc, test } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

import { deriveAvailableCandidates } from '../availability/derive-candidates'

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
    const tankLeg = candidates.legs.find((l) => l.category === tank)!
    const notTankLeg = candidates.legs.find((l) => l.category !== tank)!
    const equippedBooster = candidates.booster.find(
      (b) => b.classification !== notEquipped,
    )!

    it('keeps compatible legs lock when booster is not equipped', () => {
      const withLeg = LockedParts.empty.lock('legs', tankLeg)
      const result = withLeg.lock('booster', boosterNotEquipped)

      expect(result.isLocking('legs')).toBe(true)
      expect(result.get('legs', () => notTankLeg)).toEqual(tankLeg)
    })

    it('drops incompatible legs lock when booster is not equipped', () => {
      const withLeg = LockedParts.empty.lock('legs', notTankLeg)
      const result = withLeg.lock('booster', boosterNotEquipped)

      expect(result.isLocking('legs')).toBe(false)
    })

    it('keeps compatible legs lock when booster is equipped', () => {
      const withLeg = LockedParts.empty.lock('legs', notTankLeg)
      const result = withLeg.lock('booster', equippedBooster)

      expect(result.isLocking('legs')).toBe(true)
      expect(result.get('legs', () => tankLeg)).toEqual(notTankLeg)
    })

    it('drops incompatible legs lock when booster is equipped', () => {
      const withLeg = LockedParts.empty.lock('legs', tankLeg)
      const result = withLeg.lock('booster', equippedBooster)

      expect(result.isLocking('legs')).toBe(false)
    })

    describe('with not-equipped', () => {
      it.prop([
        genLockedParts(),
        genCandidates().filter((c) => c.legs.some((l) => l.category === tank)),
      ])(
        'restrict legs to tank and booster to not-equipped',
        ({ lockedParts }, candidates) => {
          const filtered = deriveAvailableCandidates({
            assembly: null,
            lockedParts: lockedParts.lock('booster', boosterNotEquipped),
            initialCandidates: candidates,
          })

          expect(filtered).toMatchObject({
            ...candidates,
            legs: candidates.legs.filter((l) => l.category === tank),
            booster: [boosterNotEquipped],
          })
        },
      )
    })
    describe('with equipped', () => {
      it.prop([
        genLockedParts(),
        genCandidates().filter((c) => c.legs.some((l) => l.category !== tank)),
      ])(
        'allow non-tank legs and equipped boosters only',
        ({ lockedParts }, candidates) => {
          const equipped = random(
            candidates.booster.filter((b) => b.classification !== notEquipped),
          )
          const filtered = deriveAvailableCandidates({
            assembly: null,
            lockedParts: lockedParts.lock('booster', equipped),
            initialCandidates: candidates,
          })

          expect(filtered).toMatchObject({
            ...candidates,
            legs: candidates.legs.filter((l) => l.category !== tank),
            booster: candidates.booster.filter(
              (b) => b.classification !== notEquipped,
            ),
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

    const tankLeg = candidates.legs.find((l) => l.category === 'tank')!
    const notTankLeg = candidates.legs.find((l) => l.category !== 'tank')!
    const equippedBooster = candidates.booster.find(
      (b) => b.classification !== notEquipped,
    )!

    it('drops incompatible booster lock when locking tank legs', () => {
      const withBooster = LockedParts.empty.lock('booster', equippedBooster)
      const result = withBooster.lock('legs', tankLeg)

      expect(result.isLocking('booster')).toBe(false)
    })

    it('keeps compatible booster lock when locking tank legs', () => {
      const withBooster = LockedParts.empty.lock('booster', boosterNotEquipped)
      const result = withBooster.lock('legs', tankLeg)

      expect(result.isLocking('booster')).toBe(true)
      expect(result.get('booster', () => equippedBooster)).toEqual(
        boosterNotEquipped,
      )
    })

    it('keeps compatible booster lock when locking non-tank legs', () => {
      const withBooster = LockedParts.empty.lock('booster', equippedBooster)
      const result = withBooster.lock('legs', notTankLeg)

      expect(result.isLocking('booster')).toBe(true)
      expect(result.get('booster', () => boosterNotEquipped)).toEqual(
        equippedBooster,
      )
    })

    describe('with tank', () => {
      it.prop([
        fc.constant({ lockedParts: LockedParts.empty }),
        genLeg().filter((l) => l.category === 'tank'),
        genCandidates().filter((c) => c.legs.some((l) => l.category === tank)),
      ])('booster must be equipped', (_ctx, legs, candidates) => {
        const filtered = deriveAvailableCandidates({
          assembly: { legs },
          lockedParts: LockedParts.empty.lock('legs', legs),
          initialCandidates: candidates,
        })

        expect(filtered).toMatchObject({
          ...candidates,
          booster: [boosterNotEquipped],
        })
      })
    })
    describe('with not tank', () => {
      it.prop([
        fc.constant({ lockedParts: LockedParts.empty }),
        genLeg().filter((l) => l.category !== 'tank'),
        genCandidates().filter(
          (c) =>
            c.legs.some((l) => l.category !== 'tank') &&
            c.booster.some((b) => b.classification !== notEquipped),
        ),
      ])('booster should not be equipped', (_ctx, legs, candidates) => {
        const filtered = deriveAvailableCandidates({
          assembly: { legs },
          lockedParts: LockedParts.empty.lock('legs', legs),
          initialCandidates: candidates,
        })

        expect(filtered).toMatchObject({
          ...candidates,
          booster: candidates.booster.filter(
            (b) => b.classification !== notEquipped,
          ),
        })
      })
    })
  })
})
