import { random, sum } from '#core/utils/array'

import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

describe('utils/array', () => {
  describe(sum.name, () => {
    test('should return sum of them', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (xs) => {
          expect(sum(xs)).toStrictEqual(modelSum(xs))
        }),
      )
    })

    function modelSum(xs: number[]): number {
      let sum = 0
      xs.forEach((x) => {
        sum += x
      })

      return sum
    }
  })

  describe(random.name, () => {
    test('should select a item', () => {
      fc.assert(
        fc.property(nonEmptyArray(anyVal()), (xs) => {
          expect(random(xs)).not.toBeUndefined()
        }),
      )
    })
    test('should return item within list', () => {
      fc.assert(
        fc.property(nonEmptyArray(anyVal()), (xs) => {
          expect(xs).toContain(random(xs))
        }),
      )
    })
    test('should return each items so-so', () => {
      fc.assert(
        fc.property(fc.uniqueArray(fc.string(), { minLength: 1 }), (xs) => {
          const tryCount = 1000
          const result: { [key: string]: number } = xs.reduce(
            (acc, key) => ({
              ...acc,
              [key]: 0,
            }),
            {},
          )
          ;[...new Array(tryCount)].forEach(() => {
            result[random(xs)] += 1
          })
          const per = Math.floor(tryCount / xs.length)

          Object.values(result).forEach((count) => {
            expect(count).toBeGreaterThanOrEqual(per / 1.5)
            expect(count).toBeLessThanOrEqual(per * 1.5)
          })
        }),
      )
    })

    describe('with empty array', () => {
      test('should throw error', () => {
        expect(() => random([])).toThrowError()
      })
    })

    function nonEmptyArray<T>(arb: fc.Arbitrary<T>) {
      return fc.array(arb, { minLength: 1 })
    }
    function anyVal() {
      return fc.oneof(
        fc.integer(),
        fc.float({ noNaN: true }),
        fc.string(),
        fc.date(),
        fc.object(),
        fc.array(
          fc.oneof(
            fc.integer(),
            fc.float({ noNaN: true }),
            fc.string(),
            fc.date(),
            fc.object(),
          ),
        ),
      )
    }
  })
})
