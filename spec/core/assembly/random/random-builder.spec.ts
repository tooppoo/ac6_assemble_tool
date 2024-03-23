import {
  assertBoosterEquipped,
  randomBuild,
} from '~core/assembly/random/random-builder'
import { random } from '~core/utils/array.ts'

import { boosterNotEquipped } from '~data/booster.ts'
import { tank } from '~data/types/base/category'
import { booster, notEquipped } from '~data/types/base/classification'
import { candidates } from '~data/versions/v1.06.1.ts'

import { fc, it } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

import { genCandidates, genLockedParts } from '~spec/helper.ts'

describe(randomBuild.name, () => {
  it.prop([genCandidates()])(
    'should build correct coupling booster and legs',
    (candidates) => {
      const actual = randomBuild(candidates)

      switch (actual.legs.category) {
        case tank:
          expect(actual.booster.classification).toStrictEqual(notEquipped)
          break
        default:
          expect(actual.booster.classification).toStrictEqual(booster)
          break
      }
    },
  )
  it.prop([genCandidates()])(
    'should not contain any empty parts',
    (candidates) => {
      const actual = randomBuild(candidates)

      expect(Object.values(actual)).not.toContain(undefined)
    },
  )
  describe('with lock', () => {
    describe('when locked parts exist in candidates', () => {
      it.prop([fc.constant(candidates), genLockedParts()])(
        'should use locked parts',
        (candidates, { lockedParts }) => {
          const assembly = randomBuild(candidates, { lockedParts })

          const partsShouldBeLocked = lockedParts.lockedKeys.map(
            (k) => assembly[k],
          )

          expect(partsShouldBeLocked.toSorted()).toEqual(
            lockedParts.list.toSorted(),
          )
        },
      )
    })
    describe('when locked parts not exist in candidates', () => {
      it.prop([
        genCandidates({ minLength: 0, maxLength: 0 }),
        genLockedParts(),
      ])('should throw error', (candidates, { lockedParts }) => {
        expect(() => randomBuild(candidates, { lockedParts })).toThrowError()
      })
    })
  })
})

describe(assertBoosterEquipped.name, () => {
  describe('booster', () => {
    it.prop([genCandidates().map((c) => random(c.booster))])(
      'not throw error',
      (booster) => {
        expect(() => assertBoosterEquipped(booster)).not.toThrowError()
      },
    )
  })
  describe('booster not-equipped', () => {
    it('not throw error', () => {
      expect(() => assertBoosterEquipped(boosterNotEquipped)).toThrowError()
    })
  })
})
