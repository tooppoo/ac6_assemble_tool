import { filterByKeywords } from '#core/assembly/store/filter'
import type { StoredAssemblyAggregation } from '#core/assembly/store/stored-assembly'

import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

import { genAssembly } from '#spec-helper/property-generator'

describe('filter for stored assembly', () => {
  describe(filterByKeywords.name, () => {
    describe('empty keywords', () => {
      test('return all assemblies', () => {
        fc.assert(
          fc.property(fc.array(genStoredAssembly()), (list) => {
            expect(filterByKeywords([], list)).toEqual(list)
          }),
        )
      })
    })
    describe('some keywords', () => {
      describe('name matched', () => {
        test('return all assemblies', () => {
          fc.assert(
            fc.property(
              genKeywords({ contain: ['TEST', 'FIZZ', 'BUZZ'] }),
              fc.array(
                fc.oneof(
                  genStoredAssembly({
                    name: fc.constantFrom('TEST AAA', 'FIZZ BBB', 'BUZZ CCC'),
                    description: fc.string({ minLength: 1 }),
                  }),
                  genStoredAssembly({
                    name: fc.string({ minLength: 1 }),
                    description: fc.constantFrom(
                      'TEST DDD',
                      'FIZZ EEE',
                      'BUZZ FFF',
                    ),
                  }),
                  genStoredAssembly({
                    name: fc.constantFrom('TEST AAA', 'FIZZ BBB', 'BUZZ CCC'),
                    description: fc.constantFrom(
                      'TEST DDD',
                      'FIZZ EEE',
                      'BUZZ FFF',
                    ),
                  }),
                ),
              ),
              (keywords, list) => {
                const filtered = filterByKeywords(keywords, list)

                filtered.forEach((x) => {
                  expect(x.name + x.description).toEqual(
                    expect.stringMatching(/(TEST|FIZZ|BUZZ)/),
                  )
                })
              },
            ),
          )
        })

        test('length of filtered <= original list', () => {
          fc.assert(
            fc.property(
              genKeywords(),
              fc.array(genStoredAssembly()),
              (keywords, list) => {
                expect(
                  filterByKeywords(keywords, list).length,
                ).toBeLessThanOrEqual(list.length)
              },
            ),
          )
        })
      })
    })
  })
})

function genKeywords(opt: { contain?: string[] } = {}): fc.Arbitrary<string[]> {
  return fc
    .array(
      opt.contain
        ? fc.constantFrom(...opt.contain)
        : fc.string({ minLength: 1 }),
    )
    .chain((xs) => fc.array(fc.string()).map((xs2) => [...xs, ...xs2]))
}
function genStoredAssembly(
  opt: { name?: fc.Arbitrary<string>; description?: fc.Arbitrary<string> } = {},
): fc.Arbitrary<StoredAssemblyAggregation> {
  return genAssembly().chain((assembly) =>
    fc.record<StoredAssemblyAggregation>({
      id: fc.string({ minLength: 1 }),
      name: opt.name || fc.string({ minLength: 1 }),
      description: opt.description || fc.string({ minLength: 1 }),
      assembly: fc.constant(assembly),
      createdAt: fc.date(),
      updatedAt: fc.date(),
    }),
  )
}
