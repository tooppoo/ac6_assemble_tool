import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

import type { ChangePartsEvent } from '../form/PartsSelectForm.svelte'
import type {
  AssembleRandomly,
  ApplyRandomFilter,
  ErrorOnAssembly,
} from '../random/RandomAssemblyOffCanvas.svelte'
import { assemblyErrorMessage, type Translator } from '../interaction/error-message'
import { bootstrap } from '../interaction/bootstrap'
import { buildAssemblyFromQuery } from '../interaction/assembly-from-query'

import type { IndexEffect } from './index-effects'
import {
  applyRandomAssembly,
  applyStoredAssembly,
  changeParts,
  clearErrors,
  openRandomPanel,
  openSharePanel,
  openStorePanel,
  resetAllLocks,
  setErrorMessages,
  toggleLock,
  toggleRandomPanel,
  toggleSharePanel,
  toggleStorePanel,
  updateCandidatesFromAssembly,
  updateRandomFilter,
} from './index-actions'
import { createIndexState, type IndexState } from './index-state'
import type { ToggleLockPayload } from './index-actions'

export type NavigateType = 'enter' | 'link' | 'goto' | string

export type ControllerResult = {
  state: IndexState
  effects: IndexEffect[]
}

const noEffects: IndexEffect[] = []

function result(state: IndexState, effects: IndexEffect[] = noEffects): ControllerResult {
  return { state, effects }
}

export type InitParams = {
  partsPool: IndexState['partsPoolState']
  tryLimit: number
}

export type AfterNavigateParams = {
  url: URL
  type: NavigateType
  baseCandidates: Candidates
}

export const indexController = {
  init({ partsPool, tryLimit }: InitParams): ControllerResult {
    return result(createIndexState({ partsPool, tryLimit }))
  },

  onChangeParts(state: IndexState, event: ChangePartsEvent): ControllerResult {
    return result(changeParts(state, event))
  },

  onRandom(state: IndexState, event: AssembleRandomly): ControllerResult {
    return result(applyRandomAssembly(state, event))
  },

  onFilterRandom(
    state: IndexState,
    event: ApplyRandomFilter,
  ): ControllerResult {
    return result(updateRandomFilter(state, event.randomAssembly))
  },

  onToggleLock(state: IndexState, event: ToggleLockPayload): ControllerResult {
    return result(toggleLock(state, event))
  },

  onResetLocks(state: IndexState): ControllerResult {
    return result(resetAllLocks(state))
  },

  onOpenRandomPanel(state: IndexState): ControllerResult {
    return result(openRandomPanel(state))
  },

  onOpenSharePanel(state: IndexState): ControllerResult {
    return result(openSharePanel(state))
  },

  onOpenStorePanel(state: IndexState): ControllerResult {
    return result(openStorePanel(state))
  },

  onToggleRandomPanel(state: IndexState, open: boolean): ControllerResult {
    return result(toggleRandomPanel(state, open))
  },

  onToggleSharePanel(state: IndexState, open: boolean): ControllerResult {
    return result(toggleSharePanel(state, open))
  },

  onToggleStorePanel(state: IndexState, open: boolean): ControllerResult {
    return result(toggleStorePanel(state, open))
  },

  onApplyStoredAssembly(
    state: IndexState,
    assembly: IndexState['assembly'],
  ): ControllerResult {
    return result(applyStoredAssembly(state, assembly))
  },

  onError(
    state: IndexState,
    event: ErrorOnAssembly,
    translator: Translator,
  ): ControllerResult {
    const errorMessages = assemblyErrorMessage(event.error, translator)
    return result(setErrorMessages(state, errorMessages))
  },

  onCloseError(state: IndexState): ControllerResult {
    return result(clearErrors(state))
  },

  onPopState(state: IndexState, url: URL): ControllerResult {
    const buildResult = buildAssemblyFromQuery(
      url.searchParams,
      state.partsPoolState.candidates,
    )
    const candidates = updateCandidatesFromAssembly(
      buildResult.assembly,
      state.lockedParts,
      state.initialCandidates,
    )

    return result(
      {
        ...state,
        assembly: buildResult.assembly,
        candidates,
      },
      [{ type: 'syncLanguageFromQuery', url }],
    )
  },

  onAfterNavigate(
    state: IndexState,
    { url, type, baseCandidates }: AfterNavigateParams,
  ): ControllerResult {
    const serializeEnabled = true
    if (type !== 'enter' && type !== 'link' && type !== 'goto') {
      return result({
        ...state,
        serializeEnabled,
      })
    }

    const bootResult = bootstrap(url, baseCandidates)
    const candidates = updateCandidatesFromAssembly(
      bootResult.assembly,
      state.lockedParts,
      bootResult.partsPool.candidates,
    )

    const nextState: IndexState = {
      ...state,
      partsPoolState: bootResult.partsPool,
      initialCandidates: bootResult.partsPool.candidates,
      assembly: bootResult.assembly,
      candidates,
      serializeEnabled,
    }

    if (!bootResult.migratedUrl) {
      return result(nextState)
    }

    if (!nextState.serializeEnabled) {
      return result({
        ...nextState,
        queuedUrl: bootResult.migratedUrl,
      })
    }

    return result(nextState, [
      { type: 'serializeAssembly', assembly: nextState.assembly },
    ])
  },

  onAssemblyChanged(state: IndexState): ControllerResult {
    if (!state.serializeEnabled) {
      return result(state)
    }

    if (!state.queuedUrl) {
      return result(state, [
        { type: 'serializeAssembly', assembly: state.assembly },
      ])
    }

    const queuedUrl = state.queuedUrl
    return result(
      {
        ...state,
        queuedUrl: null,
      },
      [
        { type: 'serializeAssembly', assembly: state.assembly },
        { type: 'pushState', url: queuedUrl },
      ],
    )
  },
}
