import type { AssemblyKey } from '@ac6_assemble_tool/core/assembly/assembly'
import type { PartsFilterSet } from '@ac6_assemble_tool/core/assembly/filter/filter-set'
import {
  excludeNotEquipped,
  onlyPropertyIncludedInList,
  UsableItemNotFoundError,
} from '@ac6_assemble_tool/core/assembly/filter/filters'
import {
  genAssemblyKey,
  genAssemblyKeys,
  genCandidates,
  genFilterApplyContext,
} from '@ac6_assemble_tool/core/spec-helper/property-generator'
import { random } from '@ac6_assemble_tool/core/utils/array'
import { booster, tank } from '@ac6_assemble_tool/parts/types/base/category'
import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import type { Unit } from '@ac6_assemble_tool/parts/units'
import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import * as fc from 'fast-check'
import { beforeEach, describe, expect, test } from 'bun:test'

import {
  anyFilterContain,
  anyFilterEnabled,
  assemblyWithHeadParts,
  changePartsFilter,
  enableFilterOnAllParts,
  type FilterState,
  initialFilterState,
  setupFilter,
  toggleFilter,
} from './filter'

describe('filter interaction', () => {
  describe('toggle', () => {
    test('filter for each key is assumed', () => {
      fc.assert(fc.property(
        genAssemblyKeys({ minLength: 1 }),
        genAssemblyKeys(),
        genAssemblyKeys(),
        genInitialFilterState(),
        (k1, k2, k3, state) => {
          // const keys = [...k1, ...k2, ...k3]
          const keys = k1.concat(k2).concat(k3)
          keys.forEach((key, i) => {
            state = toggleFilter(key, state)

            expect(state.map[key], `${key} ${i}`).not.toBeUndefined()
          })
        }
      ))
    })
    test('filter for specified key is used as current filter', () => {
      fc.assert(fc.property(genAssemblyKey(), genInitialFilterState(), (key, initialState) => {
        const state = toggleFilter(key, initialState)

        expect(state.current.filter).toBe(state.map[key])
      }))
    })
    test('specified key is used as current id', () => {
      fc.assert(fc.property(genAssemblyKey(), genInitialFilterState(), (key, initialState) => {
        const state = toggleFilter(key, initialState)

        expect(state.current.id).toEqual(key)
      }))
    })
  })

  test('setup assembly', () => {
    fc.assert(fc.property(genCandidates(), (candidates) => {
      const sut = assemblyWithHeadParts(candidates)

      switch (sut.legs.category) {
        case tank:
          expect(sut.booster.category).toEqual(notEquipped)
          break
        default:
          expect(sut.booster.category).toEqual(booster)
          break
      }
    }))
  })

  test('open status should be reversed from before toggle', () => {
    fc.assert(fc.property(fc.boolean(), genAssemblyKey(), genCandidates(), (open, key, candidates) => {
      const state = {
        ...initialFilterState(candidates),
        open,
      }

      expect(toggleFilter(key, state).open).toBe(!open)
    }))
  })
  test('after change parts filter, current filter should be changed', () => {
    fc.assert(fc.property(
      fc.boolean(),
      genAssemblyKey({
        only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
      }),
      genInitialFilterState(),
      (enabledOldState, key, initialState) => {
        const state = toggleFilter(key, initialState)
        const filterState = {
          ...random(state.current.filter.list),
          enabled: enabledOldState,
        }

        const updated = changePartsFilter({ target: filterState, state })

        expect(updated.current.filter).to.deep.equals(
          updated.map[key],
          'current == map[key]',
        )
      }
    ))
  })
  test('return same state when', () => {
    fc.assert(fc.property(
      genAssemblyKey({
        only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
      }),
      genInitialFilterState(),
      (key, state) => {
        const updated = changePartsFilter({
          target: random(state.map[key].list),
          state,
        })

        expect(updated).toBe(state)
      }
    ))
  })

  test('any filter enabled', () => {
    fc.assert(fc.property(
      genAssemblyKey({
        only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
      }),
      genInitialFilterState(),
      (key, initialState) => {
        const state = toggleFilter(key, initialState)
        const pfs: PartsFilterSet = state.map[key]

        state.map[key] = state.map[key].enable(random(pfs.list).filter.name)

        expect(anyFilterEnabled(key, state)).toBe(true)
      }
    ))
  })

  test('filterable parts should contain any filter', () => {
    fc.assert(fc.property(
      genAssemblyKey({
        only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
      }),
      genInitialFilterState(),
      (key, state) => {
        expect(anyFilterContain(key, state)).toBe(true)
      }
    ))
  })

  describe('enable a filter for all parts', () => {
    describe(excludeNotEquipped.name, () => {
      let state: FilterState
      const filterName = excludeNotEquipped.name
      beforeEach(() => {
        const init = initialFilterState(candidates)

        state = enableFilterOnAllParts(filterName, init)
      })

      it('should enable the filter on unit parts', () => {
        expect(
          [
            // unit
            state.map.rightArmUnit,
            state.map.leftArmUnit,
            state.map.rightBackUnit,
            state.map.leftBackUnit,
            // frame
            state.map.head,
            state.map.core,
            state.map.arms,
            state.map.legs,
            // inner
            state.map.booster,
            state.map.fcs,
            state.map.generator,
            // expansion
            state.map.expansion,
          ].map((p) => p.isEnabled(filterName)),
        ).toEqual([
          // unit
          true,
          true,
          true,
          true,
          // frame
          false,
          false,
          false,
          false,
          // inner
          false,
          false,
          false,
          // expansion
          true,
        ])
      })
    })
  })

  describe(setupFilter.name, () => {
    describe('when manufacture filter enabled', () => {
      const filterName = onlyPropertyIncludedInList('manufacture').name

      describe('when any item not left at a property', () => {
        describe('when the property allows not-equipped', () => {
          test('not-equipped only left as candidates', () => {
            fc.assert(fc.property(
              genAssemblyKey({
                only: [
                  'rightArmUnit',
                  'leftArmUnit',
                  'rightBackUnit',
                  'leftBackUnit',
                ],
              }),
              genCandidates(),
              genFilterApplyContext(),
              (key: AssemblyKey, candidates, context) => {
                const candidatesForTest = { ...candidates, [key]: [] }
                const filter = setupFilter(key, candidatesForTest).enable(
                  filterName,
                )

                const actual = filter.apply(candidatesForTest, context)

                expect(actual[key].map((p) => p.classification)).toEqual([
                  notEquipped,
                ])
              }
            ))
          })
        })
        describe('when the property not allows not-equipped', () => {
          test('throw error', () => {
            fc.assert(fc.property(
              genAssemblyKey({
                without: [
                  'rightArmUnit',
                  'leftArmUnit',
                  'rightBackUnit',
                  'leftBackUnit',
                  'expansion',
                ],
              }),
              genCandidates(),
              genFilterApplyContext(),
              (key, candidates, context) => {
                const candidatesForTest = { ...candidates, [key]: [] }
                const filter = setupFilter(key, candidatesForTest).enable(
                  filterName,
                )

                expect(() => filter.apply(candidatesForTest, context)).toThrowError(
                  UsableItemNotFoundError,
                )
              }
            ))
          })
        })
        describe('when expansion specified', () => {
          test('the filter not be set up for expansion', () => {
            fc.assert(fc.property(genCandidates(), (candidates) => {
              const filter = setupFilter('expansion', candidates)
              const sut = filter.enable(filterName)

              expect(sut.isEnabled(filterName)).toEqual(false)
            }))
          })
        })
      })
    })

    describe('when attack_type filter enabled', () => {
      const filterName = onlyPropertyIncludedInList<'attack_type', Unit>(
        'attack_type',
      ).name

      describe('when any item not left at a property', () => {
        test('not-equipped only left as candidates', () => {
          fc.assert(
            fc.property(
              genAssemblyKey({
                only: [
                  'rightArmUnit',
                  'leftArmUnit',
                  'rightBackUnit',
                  'leftBackUnit',
                ],
              }),
              genCandidates(),
              genFilterApplyContext(),
              (key: AssemblyKey, candidates, context) => {
                const candidatesForTest = { ...candidates, [key]: [] }
                const filter = setupFilter(key, candidatesForTest).enable(
                  filterName,
                )

                const actual = filter.apply(candidatesForTest, context)

                expect(actual[key].map((p) => p.classification)).toEqual([
                  notEquipped,
                ])
              },
            ),
          )
        })
      })
    })
  })
})

const genInitialFilterState = () => genCandidates().map(initialFilterState)
