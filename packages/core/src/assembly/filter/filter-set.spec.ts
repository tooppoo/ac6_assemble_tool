import { fc, it } from '@fast-check/vitest'
import sinon from 'sinon'
import { afterEach, describe, expect } from 'vitest'

import { type PartsFilter } from './base'
import { PartsFilterSet } from './filter-set'
import { enableOrNot, type FilterType } from './filter-type'

import {
  genCandidates,
  genFilterApplyContext,
} from '#spec-helper/property-generator'

describe(PartsFilterSet.name, () => {
  const sandbox = sinon.createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it.prop([genCandidates(), genFilterApplyContext()])(
    'should apply filter, and not apply removed',
    (candidates, context) => {
      const filters = [...new Array(4)].map<PartsFilter<FilterType>>(
        (_, i) => ({
          name: `${i + 1}`,
          type: enableOrNot,
          apply: (_) => _,
        }),
      )
      const stubs = filters
        .map((f) => sinon.stub(f, 'apply'))
        .map((s) => {
          s.returnsArg(0)

          return s
        })

      const sut1 = filters
        .reduce(
          (acc, f) => acc.add(f, { enabled: false }),
          PartsFilterSet.empty,
        )
        .enable('1')

      expect(sut1.apply(candidates, context)).to.deep.equals(candidates, 'sut1')
      expect(stubs.map((s) => s.callCount)).to.deep.equals([1, 0, 0, 0], 'sut1')

      const sut2 = sut1.enable('2')
      expect(sut2.apply(candidates, context)).to.deep.equals(candidates, 'sut2')
      expect(stubs.map((s) => s.callCount)).to.deep.equals([2, 1, 0, 0], 'sut2')

      const sut3 = sut2.enable('3')
      expect(sut3.apply(candidates, context)).to.deep.equals(candidates, 'sut3')
      expect(stubs.map((s) => s.callCount)).to.deep.equals([3, 2, 1, 0], 'sut3')

      const sut4 = sut3.enable('4')
      expect(sut4.apply(candidates, context)).to.deep.equals(candidates, 'sut4')
      expect(stubs.map((s) => s.callCount)).to.deep.equals([4, 3, 2, 1], 'sut4')
    },
  )

  describe('private filter', () => {
    const buildSetFromPair = (
      stat: { enabled: boolean },
      pairs: { name: string; private: boolean }[],
    ) =>
      pairs.reduce(
        (acc, p) =>
          acc.add(
            {
              name: p.name,
              type: enableOrNot,
              apply: (_) => _,
            },
            { enabled: stat.enabled, private: p.private },
          ),
        PartsFilterSet.empty,
      )

    it.prop([genNameAndPrivatePair()])(
      'list filters without private filter',
      (pairs) => {
        const set = buildSetFromPair({ enabled: true }, pairs)

        const actual = set.list.map((s) => s.filter.name)
        const expected = pairs.filter((x) => !x.private).map((x) => x.name)

        expect(actual.toSorted()).to.deep.equals(expected.toSorted())
      },
    )
    it.prop([
      genNameAndPrivatePair().filter((ps) => ps.every((p) => p.private)),
    ])('ignore enable message for private filter', (pairs) => {
      const set = buildSetFromPair({ enabled: false }, pairs)
      const updated = pairs.reduce((acc, { name }) => acc.enable(name), set)

      expect(updated).toStrictEqual(set)
    })
  })
})

const genNameAndPrivatePair = () =>
  fc
    .uniqueArray(fc.string({ minLength: 1 }))
    .chain((names) =>
      fc.record({
        names: fc.constant(names),
        privates: fc.array(fc.boolean(), {
          minLength: names.length,
          maxLength: names.length,
        }),
      }),
    )
    .map(({ names, privates }) =>
      names.map((name, i) => ({
        name,
        private: privates[i],
      })),
    )
