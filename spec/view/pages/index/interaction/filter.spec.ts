import {
  excludeNotEquipped,
  onlyPropertyIncludedInList,
} from '~core/assembly/filter/filters.ts'
import { random } from '~core/utils/array.ts'

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
  UsableItemNotFoundError,
} from '~view/pages/index/interaction/filter.ts'

import { booster, tank } from '~data/types/base/category.ts'
import { notEquipped } from '~data/types/base/classification.ts'
import { candidates } from '~data/versions/v1.06.1.ts'

import { fc, it } from '@fast-check/vitest'
import { beforeEach, describe, expect } from 'vitest'

import {
  genAssemblyKey,
  genAssemblyKeys,
  genCandidates,
  genFilterApplyContext,
} from '~spec/helper.ts'

describe('filter interaction', () => {
  describe('toggle', () => {
    it.prop([
      genAssemblyKeys({ minLength: 1 }),
      genAssemblyKeys(),
      genAssemblyKeys(),
      genInitialFilterState(),
    ])('filter for each key is assumed', (k1, k2, k3, state) => {
      const keys = [...k1, ...k2, ...k3]
      keys.forEach((key, i) => {
        state = toggleFilter(key, state)

        expect(state.map[key], `${key} ${i}`).not.undefined
      })
    })
    it.prop([genAssemblyKey(), genInitialFilterState()])(
      `filter for specified key is used as current filter`,
      (key, initialState) => {
        const state = toggleFilter(key, initialState)

        expect(state.current.filter).toBe(state.map[key])
      },
    )
    it.prop([genAssemblyKey(), genInitialFilterState()])(
      `specified key is used as current id`,
      (key, initialState) => {
        const state = toggleFilter(key, initialState)

        expect(state.current.id).toEqual(key)
      },
    )
  })

  it.prop([genCandidates()])('setup assembly', (candidates) => {
    const sut = assemblyWithHeadParts(candidates)

    switch (sut.legs.category) {
      case tank:
        expect(sut.booster.category).toEqual(notEquipped)
        break
      default:
        expect(sut.booster.category).toEqual(booster)
        break
    }
  })

  it.prop([fc.boolean(), genAssemblyKey(), genCandidates()])(
    `open status should be reversed from before toggle`,
    (open, key, candidates) => {
      const state = {
        ...initialFilterState(candidates),
        open,
      }

      expect(toggleFilter(key, state).open).toBe(!open)
    },
  )
  it.prop([
    fc.boolean(),
    genAssemblyKey({
      only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
    }),
    genInitialFilterState(),
  ])(
    'after change parts filter, current filter should be changed',
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
    },
  )
  it.prop([
    genAssemblyKey({
      only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
    }),
    genInitialFilterState(),
  ])('return same state when', (key, state) => {
    const updated = changePartsFilter({
      target: random(state.map[key].list),
      state,
    })

    expect(updated).toBe(state)
  })

  it.prop([
    genAssemblyKey({
      only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
    }),
    genInitialFilterState(),
  ])('any filter enabled', (key, initialState) => {
    const state = toggleFilter(key, initialState)
    state.map[key] = state.map[key].enable(
      random(state.map[key].list).filter.name,
    )

    expect(anyFilterEnabled(key, state)).toBe(true)
  })

  it.prop([
    genAssemblyKey({
      only: ['rightArmUnit', 'leftArmUnit', 'rightBackUnit', 'leftBackUnit'],
    }),
    genInitialFilterState(),
  ])('filterable parts should contain any filter', (key, state) => {
    expect(anyFilterContain(key, state)).toBe(true)
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
          it.prop([
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
          ])(
            'not-equipped only left as candidates',
            (key, candidates, context) => {
              const candidatesForTest = { ...candidates, [key]: [] }
              const filter = setupFilter(key, candidatesForTest).enable(
                filterName,
              )

              const actual = filter.apply(candidatesForTest, context)

              expect(actual[key].map((p) => p.classification)).toEqual([
                notEquipped,
              ])
            },
          )
        })
        describe('when the property not allows not-equipped', () => {
          it.prop([
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
          ])('throw error', (key, candidates, context) => {
            const candidatesForTest = { ...candidates, [key]: [] }
            const filter = setupFilter(key, candidatesForTest).enable(
              filterName,
            )

            expect(() => filter.apply(candidatesForTest, context)).toThrowError(
              UsableItemNotFoundError,
            )
          })
        })
        describe('when expansion specified', () => {
          it.prop([genCandidates()])(
            'the filter not be set up for expansion',
            (candidates) => {
              const filter = setupFilter('expansion', candidates)
              const sut = filter.enable(filterName)

              expect(sut.isEnabled(filterName)).toEqual(false)
            },
          )
        })
      })
    })
  })
})

const genInitialFilterState = () => genCandidates().map(initialFilterState)
