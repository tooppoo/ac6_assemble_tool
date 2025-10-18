import { LockedParts } from '#core/assembly/random/lock'
import { random } from '#core/utils/array'

import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

import {
  genAssembly,
  genAssemblyKeys,
  genCandidates,
  genLockedParts,
} from '#spec-helper/property-generator'

describe(LockedParts.name, () => {
  test('list is same with lockedKeys', () => {
    fc.assert(
      fc.property(genLockedParts(), ({ lockedParts }) => {
        expect(lockedParts.list.length).toEqual(lockedParts.lockedKeys.length)
      }),
    )
  })
  test('lock state transition', () => {
    fc.assert(
      fc.property(
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
        ({ lockedParts }, { a1, a2, key }) => {
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
        },
      ),
    )
  })

  describe('when lock booster', () => {
    const genBooster = () =>
      fc.oneof(
        fc
          .integer({ min: 0, max: candidates.booster.length - 1 })
          .map((i) => candidates.booster[i]),
      )

    test('not lock legs', () => {
      fc.assert(
        fc.property(
          genLockedParts(),
          fc.oneof(fc.constant(boosterNotEquipped), genBooster()),
          ({ lockedParts }, booster) => {
            expect(lockedParts.lock('booster', booster).isLocking('legs')).toBe(
              false,
            )
          },
        ),
      )
    })

    describe('with not-equipped', () => {
      test('filter only tank legs', () => {
        fc.assert(
          fc.property(
            genLockedParts(),
            genCandidates(),
            ({ lockedParts }, candidates) => {
              const filtered = lockedParts
                .lock('booster', boosterNotEquipped)
                .filter(candidates)

              expect(filtered).toMatchObject({
                ...candidates,
                legs: candidates.legs.filter((l) => l.category === tank),
              })
            },
          ),
        )
      })
    })
    describe('with equipped', () => {
      test('filter only two, four or reverse joint legs', () => {
        fc.assert(
          fc.property(
            genLockedParts(),
            genCandidates(),
            ({ lockedParts }, candidates) => {
              const filtered = lockedParts
                .lock('booster', random(candidates.booster))
                .filter(candidates)

              expect(filtered).toMatchObject({
                ...candidates,
                legs: candidates.legs.filter((l) => l.category !== tank),
              })
            },
          ),
        )
      })
    })
  })

  describe('when lock legs', () => {
    const genLeg = () =>
      fc.oneof(
        fc
          .integer({ min: 0, max: candidates.legs.length - 1 })
          .map((i) => candidates.legs[i]),
      )

    test('not lock booster', () => {
      fc.assert(
        fc.property(genLockedParts(), genLeg(), ({ lockedParts }, legs) => {
          expect(lockedParts.lock('legs', legs).isLocking('booster')).toBe(
            false,
          )
        }),
      )
    })

    describe('with tank', () => {
      test('booster should not be equipped', () => {
        fc.assert(
          fc.property(
            genLockedParts(),
            genLeg().filter((l) => l.category === 'tank'),
            genCandidates(),
            ({ lockedParts }, legs, candidates) => {
              const filtered = lockedParts.lock('legs', legs).filter(candidates)

              expect(filtered).toMatchObject({
                ...candidates,
                booster: [boosterNotEquipped],
              })
            },
          ),
        )
      })
    })
    describe('with not tank', () => {
      test('booster should not be equipped', () => {
        fc.assert(
          fc.property(
            genLockedParts(),
            genLeg().filter((l) => l.category !== 'tank'),
            genCandidates(),
            ({ lockedParts }, legs, candidates) => {
              const filtered = lockedParts.lock('legs', legs).filter(candidates)

              expect(filtered).toMatchObject({
                ...candidates,
                booster: candidates.booster.filter(
                  (b) => b.classification !== notEquipped,
                ),
              })
            },
          ),
        )
      })
    })
  })
})
