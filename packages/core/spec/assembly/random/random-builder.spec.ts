import { randomBuild } from '#core/assembly/random/random-builder'

import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import {
  booster,
  notEquipped,
} from '@ac6_assemble_tool/parts/types/base/classification'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

import { genCandidates, genLockedParts } from '#spec-helper/property-generator'

describe(randomBuild.name, () => {
  test('should build correct coupling booster and legs', () => {
    fc.assert(
      fc.property(genCandidates(), (candidates) => {
        const actual = randomBuild(candidates)

        switch (actual.legs.category) {
          case tank:
            expect(actual.booster.classification).toStrictEqual(notEquipped)
            break
          default:
            expect(actual.booster.classification).toStrictEqual(booster)
            break
        }
      }),
    )
  })
  test('should not contain any empty parts', () => {
    fc.assert(
      fc.property(genCandidates(), (candidates) => {
        const actual = randomBuild(candidates)

        expect(Object.values(actual)).not.toContain(undefined)
      }),
    )
  })
  describe('with lock', () => {
    describe('when locked parts exist in candidates', () => {
      test('should use locked parts', () => {
        fc.assert(
          fc.property(
            fc.constant(candidates),
            genLockedParts(),
            (candidates, { lockedParts }) => {
              const assembly = randomBuild(candidates, { lockedParts })

              const partsShouldBeLocked = lockedParts.lockedKeys.map(
                (k) => assembly[k],
              )

              expect(partsShouldBeLocked.toSorted()).toEqual(
                lockedParts.list.toSorted(),
              )
            },
          ),
        )
      })
    })
    describe('when locked parts not exist in candidates', () => {
      test('should throw error', () => {
        fc.assert(
          fc.property(
            genCandidates({ minLength: 0, maxLength: 0 }),
            genLockedParts(),
            (candidates, { lockedParts }) => {
              expect(() =>
                randomBuild(candidates, { lockedParts }),
              ).toThrowError()
            },
          ),
        )
      })
    })
  })
})
