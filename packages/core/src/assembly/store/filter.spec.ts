
import { it } from '@fast-check/vitest'
import fc from 'fast-check'
import { describe, expect } from 'vitest'

import { filterByKeywords } from './filter'
import type { StoredAssemblyAggregation } from './stored-assembly'

import { genAssembly } from '#spec-helper/property-generator'

describe('filter for stored assembly', () => {
  describe(filterByKeywords.name, () => {
    describe('empty keywords', () => {
      it.prop([fc.array(genStoredAssembly())])(
        'return all assemblies',
        (list) => {
          expect(filterByKeywords([], list)).toEqual(list)
        },
      )
    })
    describe('some keywords', () => {
      describe('name matched', () => {
        it.prop([
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
        ])('return all assemblies', (keywords, list) => {
          const filtered = filterByKeywords(keywords, list)

          filtered.forEach((x) => {
            expect(x.name + x.description).toEqual(
              expect.stringMatching(/(TEST|FIZZ|BUZZ)/),
            )
          })
        })

        it.prop([genKeywords(), fc.array(genStoredAssembly())])(
          'length of filtered <= original list',
          (keywords, list) => {
            expect(filterByKeywords(keywords, list).length).toBeLessThanOrEqual(
              list.length,
            )
          },
        )
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
