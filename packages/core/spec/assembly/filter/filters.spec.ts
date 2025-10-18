import {
  assumeConstraintLegsAndBooster,
  excludeNotEquipped,
  notUseHanger,
  onlyPropertyIncludedInList,
} from '#core/assembly/filter/filters'

import {
  armNotEquipped,
  backNotEquipped,
  boosterNotEquipped,
  expansionNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { armUnit } from '@ac6_assemble_tool/parts/types/base/classification'
import { manufactures } from '@ac6_assemble_tool/parts/types/base/manufacture'
import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'
import { uniq } from 'lodash-es'
import sinon from 'sinon'

import {
  genAssemblyKey,
  genCandidates,
  genFilterApplyContext,
} from '#spec-helper/property-generator'

describe(excludeNotEquipped.name, () => {
  test('not contain not-equipped unit at specified key', () => {
    fc.assert(
      fc.property(
        genCandidates(),
        genAssemblyKey(),
        genFilterApplyContext(),
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
      ),
    )
  })
  test('not change other candidates', () => {
    fc.assert(
      fc.property(
        genCandidates(),
        genAssemblyKey(),
        genFilterApplyContext(),
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
      ),
    )
  })
  test('when no items exist on candidates after filter, onEmpty handle it', () => {
    fc.assert(
      fc.property(
        genCandidates(),
        genAssemblyKey(),
        genFilterApplyContext(),
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
      ),
    )
  })
})

describe(notUseHanger.name, () => {
  test('remove arm unit from back unit', () => {
    fc.assert(
      fc.property(
        genCandidates(),
        fc.constantFrom(...(['rightBackUnit', 'leftBackUnit'] as const)),
        genFilterApplyContext(),
        (candidates, key, context) => {
          const applied = notUseHanger.build(key).apply(candidates, context)

          expect(applied[key].map((p) => p.classification)).not.toContain(
            armUnit,
          )
        },
      ),
    )
  })
  test('not change parts other than back unit', () => {
    fc.assert(
      fc.property(
        genCandidates(),
        genAssemblyKey({ without: ['rightBackUnit', 'leftBackUnit'] }),
        genFilterApplyContext(),
        (candidates, key, context) => {
          const applied = notUseHanger.build(key).apply(candidates, context)

          expect(applied[key]).toEqual(candidates[key])
        },
      ),
    )
  })
})

describe(assumeConstraintLegsAndBooster.name, () => {
  describe('when legs is tank', () => {
    test('should allow only not-equipped as candidates of booster', () => {
      fc.assert(
        fc.property(
          genCandidates(),
          genFilterApplyContext().filter(
            ({ assembly }) => assembly.legs.category === tank,
          ),
          (candidates, context) => {
            const applied = assumeConstraintLegsAndBooster
              .build(candidates)
              .apply(candidates, context)

            expect(applied.booster).toEqual([boosterNotEquipped])
          },
        ),
      )
    })
  })
  describe('when legs is not tank', () => {
    test('should allow only actual booster', () => {
      fc.assert(
        fc.property(
          genCandidates(),
          genFilterApplyContext().filter(
            ({ assembly }) => assembly.legs.category !== tank,
          ),
          (candidates, context) => {
            const applied = assumeConstraintLegsAndBooster
              .build(candidates)
              .apply(candidates, context)

            expect(applied.booster).toStrictEqual(candidates.booster)
            expect(applied.booster).not.toContain(boosterNotEquipped)
          },
        ),
      )
    })
  })
  describe('when any filter for booster is enabled', () => {
    test('should allow only actual booster', () => {
      fc.assert(
        fc.property(
          genCandidates(),
          genFilterApplyContext(),
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
        ),
      )
    })
  })
})

describe(onlyPropertyIncludedInList('manufacture').name, () => {
  test('select only item provided by specified manufactures', () => {
    fc.assert(
      fc.property(
        genAssemblyKey(),
        genManufactures(),
        genCandidates(),
        genFilterApplyContext(),
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
            expect.arrayContaining(
              uniq(filtered[key].map((p) => p.manufacture)),
            ),
          )
        },
      ),
    )
  })

  describe('any item not found after apply filter', () => {
    test('onEmpty called and used the result', () => {
      fc.assert(
        fc.property(
          genAssemblyKey(),
          genCandidates(),
          genFilterApplyContext(),
          (key, candidates, context) => {
            const filter = onlyPropertyIncludedInList('manufacture').build({
              key,
              selected: [],
              whole: manufactures,
              onEmpty: () => candidates,
            })

            expect(filter.apply(candidates, context)).toBe(candidates)
          },
        ),
      )
    })
  })

  function genManufactures() {
    return fc.array(fc.constantFrom(...manufactures))
  }
})
