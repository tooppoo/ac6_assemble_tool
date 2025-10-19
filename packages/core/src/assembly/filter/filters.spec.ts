import {
  armNotEquipped,
  backNotEquipped,
  boosterNotEquipped,
  expansionNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { armUnit } from '@ac6_assemble_tool/parts/types/base/classification'
import { manufactures } from '@ac6_assemble_tool/parts/types/base/manufacture'
import { fc, it } from '@fast-check/vitest'
import { uniq } from 'lodash-es'
import sinon from 'sinon'
import { describe, expect } from 'vitest'

import {
  assumeConstraintLegsAndBooster,
  excludeNotEquipped,
  notUseHanger,
  onlyPropertyIncludedInList,
} from './filters'

import {
  genAssemblyKey,
  genCandidates,
  genFilterApplyContext,
} from '#spec-helper/property-generator'

describe(excludeNotEquipped.name, () => {
  it.prop([genCandidates(), genAssemblyKey(), genFilterApplyContext()])(
    'not contain not-equipped unit at specified key',
    (candidates, key, context) => {
      const applied = excludeNotEquipped
        .build({
          key,
          onEmpty: () => ({ ...candidates, [key]: [] }),
        })
        .apply(candidates, context)
      const actual = applied[key]

      expect(actual).not.toContain(armNotEquipped)
      expect(actual).not.toContain(backNotEquipped)
      expect(actual).not.toContain(expansionNotEquipped)
    },
  )
  it.prop([genCandidates(), genAssemblyKey(), genFilterApplyContext()])(
    'not change other candidates',
    (candidates, key, context) => {
      const applied = excludeNotEquipped
        .build({
          key,
          onEmpty: () => ({ ...candidates, [key]: [] }),
        })
        .apply(candidates, context)

      expect(applied).toMatchObject({
        head: candidates.head,
        core: candidates.core,
        arms: candidates.arms,
        legs: candidates.legs,

        booster: candidates.booster,
        fcs: candidates.fcs,
        generator: candidates.generator,
      })
    },
  )
  it.prop([genCandidates(), genAssemblyKey(), genFilterApplyContext()])(
    'when no items exist on candidates after filter, onEmpty handle it',
    (candidates, key, context) => {
      const withEmpty = { ...candidates, [key]: [] }
      const filter = excludeNotEquipped.build({
        key,
        onEmpty: () => {
          throw new Error('on empty')
        },
      })

      expect(() => filter.apply(withEmpty, context)).toThrowError(
        new Error('on empty'),
      )
    },
  )
})

describe(notUseHanger.name, () => {
  it.prop([
    genCandidates(),
    fc.constantFrom(...(['rightBackUnit', 'leftBackUnit'] as const)),
    genFilterApplyContext(),
  ])('remove arm unit from back unit', (candidates, key, context) => {
    const applied = notUseHanger.build(key).apply(candidates, context)

    expect(applied[key].map((p) => p.classification)).not.toContain(armUnit)
  })
  it.prop([
    genCandidates(),
    genAssemblyKey({ without: ['rightBackUnit', 'leftBackUnit'] }),
    genFilterApplyContext(),
  ])('not change parts other than back unit', (candidates, key, context) => {
    const applied = notUseHanger.build(key).apply(candidates, context)

    expect(applied[key]).toEqual(candidates[key])
  })
})

describe(assumeConstraintLegsAndBooster.name, () => {
  describe('when legs is tank', () => {
    it.prop([
      genCandidates(),
      genFilterApplyContext().filter(
        ({ assembly }) => assembly.legs.category === tank,
      ),
    ])(
      'should allow only not-equipped as candidates of booster',
      (candidates, context) => {
        const applied = assumeConstraintLegsAndBooster
          .build(candidates)
          .apply(candidates, context)

        expect(applied.booster).toEqual([boosterNotEquipped])
      },
    )
  })
  describe('when legs is not tank', () => {
    it.prop([
      genCandidates(),
      genFilterApplyContext().filter(
        ({ assembly }) => assembly.legs.category !== tank,
      ),
    ])('should allow only actual booster', (candidates, context) => {
      const applied = assumeConstraintLegsAndBooster
        .build(candidates)
        .apply(candidates, context)

      expect(applied.booster).to.deep.equals(
        candidates.booster,
        'booster candidates should not be changed',
      )
      expect(applied.booster).not.to.contains(
        boosterNotEquipped,
        'booster candidates should not contain not-equipped',
      )
    })
  })
  describe('when any filter for booster is enabled', () => {
    it.prop([genCandidates(), genFilterApplyContext()])(
      'should allow only actual booster',
      (candidates, context) => {
        const boosterStub = sinon.stub(
          context.wholeFilter.booster,
          'containEnabled',
        )
        boosterStub.value(true)

        const applied = assumeConstraintLegsAndBooster
          .build(candidates)
          .apply(candidates, context)

        expect(applied.legs.map((l) => l.category)).not.toEqual(
          expect.arrayContaining([tank]),
        )
        boosterStub.restore()
      },
    )
  })
})

describe(onlyPropertyIncludedInList('manufacture').name, () => {
  it.prop([
    genAssemblyKey(),
    genManufactures(),
    genCandidates(),
    genFilterApplyContext(),
  ])(
    'select only item provided by specified manufactures',
    (key, selected, candidates, context) => {
      const filter = onlyPropertyIncludedInList('manufacture').build({
        key,
        selected,
        whole: manufactures,
        onEmpty: ({ key, candidates }) => ({ ...candidates, [key]: [] }),
      })

      const filtered = filter.apply(candidates, context)

      // 実際の結果が選択された値のサブセットであること
      expect(selected).toEqual(
        expect.arrayContaining(uniq(filtered[key].map((p) => p.manufacture))),
      )
    },
  )

  describe('any item not found after apply filter', () => {
    it.prop([genAssemblyKey(), genCandidates(), genFilterApplyContext()])(
      'onEmpty called and used the result',
      (key, candidates, context) => {
        const filter = onlyPropertyIncludedInList('manufacture').build({
          key,
          selected: [],
          whole: manufactures,
          onEmpty: () => candidates,
        })

        expect(filter.apply(candidates, context)).toBe(candidates)
      },
    )
  })

  function genManufactures() {
    return fc.array(fc.constantFrom(...manufactures))
  }
})
