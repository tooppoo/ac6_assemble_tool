import { logger } from '@ac6_assemble_tool/shared/logger'

import {
  type Assembly,
  type AssemblyKey,
  createAssembly,
} from '@ac6_assemble_tool/core/assembly/assembly'
import {
  type FilterApplyContext,
  type WholeFilter,
} from '@ac6_assemble_tool/core/assembly/filter/base'
import {
  PartsFilterSet,
  type ReadonlyPartsFilterState,
} from '@ac6_assemble_tool/core/assembly/filter/filter-set'
import {
  assumeConstraintLegsAndBooster,
  errorWhenEmpty,
  excludeNotEquipped,
  notUseHanger,
  onlyPropertyIncludedInList,
} from '@ac6_assemble_tool/core/assembly/filter/filters'
import { boosterMustBeEquipped } from '@ac6_assemble_tool/parts/booster'
import {
  armNotEquipped,
  boosterNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import { manufactures } from '@ac6_assemble_tool/parts/types/base/manufacture'
import { type Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { attackType } from '@ac6_assemble_tool/parts/types/unit/attack_type'
import type { Unit } from '@ac6_assemble_tool/parts/units'

export interface FilterState {
  open: boolean
  map: WholeFilter
  current: CurrentFilter
}
export interface CurrentFilter {
  id: AssemblyKey | null
  name: string
  filter: PartsFilterSet
}

export const initialFilterState = (
  initialCandidates: Candidates,
): FilterState => {
  const setup = (key: AssemblyKey) => setupFilter(key, initialCandidates)

  return {
    open: false,
    map: {
      rightArmUnit: setup('rightArmUnit'),
      leftArmUnit: setup('leftArmUnit'),
      rightBackUnit: setup('rightBackUnit'),
      leftBackUnit: setup('leftBackUnit'),
      head: setup('head'),
      core: setup('core'),
      arms: setup('arms'),
      legs: setup('legs'),
      booster: setup('booster'),
      fcs: setup('fcs'),
      generator: setup('generator'),
      expansion: setup('expansion'),
    },
    current: {
      id: null,
      name: '',
      filter: PartsFilterSet.empty,
    },
  }
}

export function applyFilter(
  candidates: Candidates,
  state: FilterState,
  context: FilterApplyContext,
): Candidates {
  return Object.values(state.map).reduce(
    (c, f) => f.apply(c, context),
    candidates,
  )
}

export function assemblyWithHeadParts(candidates: Candidates): Assembly {
  // filterによって選択状態の武器が除外される可能性があるので
  // filter適用後の候補から先頭を機械的に適用
  const base = {
    rightArmUnit: candidates.rightArmUnit[0],
    leftArmUnit: candidates.leftArmUnit[0],
    rightBackUnit: candidates.rightBackUnit[0],
    leftBackUnit: candidates.leftBackUnit[0],
    head: candidates.head[0],
    core: candidates.core[0],
    arms: candidates.arms[0],
    fcs: candidates.fcs[0],
    generator: candidates.generator[0],
    expansion: candidates.expansion[0],
  }
  const legs = candidates.legs[0]

  logger.debug(assemblyWithHeadParts.name, candidates, { ...base, legs })

  if (legs.category === tank) {
    return createAssembly({
      ...base,
      legs,
      booster: boosterNotEquipped,
    })
  } else {
    const booster = candidates.booster[0]
    boosterMustBeEquipped(booster)

    return createAssembly({
      ...base,
      legs,
      booster,
    })
  }
}

export function toggleFilter(
  key: AssemblyKey,
  state: FilterState,
): FilterState {
  const filter = state.map[key]

  return {
    open: !state.open,
    map: {
      ...state.map,
      [key]: filter,
    },
    current: {
      id: key,
      name: key.replaceAll(/([A-Z])/g, ' $1'),
      filter,
    },
  }
}

export function changePartsFilter({
  target,
  state,
}: {
  target: ReadonlyPartsFilterState
  state: FilterState
}): FilterState {
  logger.debug('changePartsFilter begin', { target, state })

  if (!state.current.id) return state

  const updated = state.current.filter.update(target)

  state.current.filter = updated
  state.map[state.current.id] = updated

  logger.debug('changePartsFilter end', {
    changed: target,
    state,
  })

  return state
}

export function enableFilterOnAllParts(
  filterName: string,
  state: FilterState,
): FilterState {
  logger.debug('enableFilterOnAllParts', { filterName, state })

  return {
    ...state,
    map: Object.entries(state.map).reduce(
      (acc, [setKey, set]) => ({ ...acc, [setKey]: set.enable(filterName) }),
      state.map,
    ),
  }
}

export function anyFilterEnabled(
  key: AssemblyKey,
  state: FilterState,
): boolean {
  return getFilter(key, state).containEnabled
}
export function anyFilterContain(
  key: AssemblyKey,
  state: FilterState,
): boolean {
  return getFilter(key, state).list.length > 0
}

export function setupFilter(
  key: AssemblyKey,
  initialCandidates: Candidates,
): PartsFilterSet {
  const base = (() => {
    const b = PartsFilterSet.empty.add(
      assumeConstraintLegsAndBooster.build(initialCandidates),
      {
        enabled: true,
        private: true,
      },
    )

    switch (key) {
      case 'expansion':
        return b
      case 'rightArmUnit':
      case 'leftArmUnit':
      case 'rightBackUnit':
      case 'leftBackUnit':
        return b
          .add(
            onlyPropertyIncludedInList('manufacture').build({
              key,
              selected: manufactures,
              whole: manufactures,
              onEmpty: ({ candidates }) => ({
                ...candidates,
                [key]: [armNotEquipped],
              }),
            }),
          )
          .add(
            onlyPropertyIncludedInList<'attack_type', Unit>(
              'attack_type',
            ).build({
              key,
              selected: attackType,
              whole: attackType,
              onEmpty: ({ candidates }) => ({
                ...candidates,
                [key]: [armNotEquipped],
              }),
            }),
          )
      default:
        return b.add(
          onlyPropertyIncludedInList('manufacture').build({
            key,
            selected: manufactures,
            whole: manufactures,
            onEmpty: errorWhenEmpty(
              key,
              'any item not found after manufacture filter',
            ),
          }),
        )
    }
  })()

  switch (key) {
    case 'rightArmUnit':
    case 'leftArmUnit':
    case 'expansion':
      return base.add(
        excludeNotEquipped.build({
          key,
          onEmpty: errorWhenEmpty(
            key,
            'only non-equipped item exist in candidates',
          ),
        }),
      )
    case 'rightBackUnit':
    case 'leftBackUnit':
      return base
        .add(
          excludeNotEquipped.build({
            key,
            onEmpty: errorWhenEmpty(
              key,
              'only non-equipped item exist in candidates',
            ),
          }),
        )
        .add(notUseHanger.build(key))
    default:
      return base
  }
}

function getFilter(key: AssemblyKey, state: FilterState): PartsFilterSet {
  return state.map[key]
}
