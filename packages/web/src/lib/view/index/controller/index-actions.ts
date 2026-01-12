import type { AssemblyKey } from '@ac6_assemble_tool/core/assembly/assembly'
import { deriveAvailableCandidates } from '@ac6_assemble_tool/core/assembly/availability/derive-candidates'
import { changeAssemblyCommand } from '@ac6_assemble_tool/core/assembly/command/change-assembly'
import { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

import type {
  AssembleRandomly,
  ChangePartsEvent,
} from '../types/index-events'

import type { IndexState } from './index-state'
import {
  closeOffcanvas,
  openAssemblyStore,
  openRandomAssembly,
  openShare,
} from './offcanvas'

export type ToggleLockPayload = Readonly<{ id: AssemblyKey; value: boolean }>

export function changeParts(
  state: IndexState,
  event: ChangePartsEvent,
): IndexState {
  const changeAssembly = changeAssemblyCommand(state.initialCandidates)
  const { assembly: nextAssembly, remainingCandidates } = changeAssembly(
    event.id,
    event.selected,
    state.assembly,
    state.candidates,
  )
  const candidates = deriveAvailableCandidates({
    assembly: nextAssembly,
    lockedParts: state.lockedParts,
    initialCandidates: remainingCandidates,
  })

  return {
    ...state,
    assembly: nextAssembly,
    candidates,
  }
}

export function applyRandomAssembly(
  state: IndexState,
  event: AssembleRandomly,
): IndexState {
  const candidates = deriveAvailableCandidates({
    assembly: event.assembly,
    lockedParts: state.lockedParts,
    initialCandidates: state.initialCandidates,
  })

  return {
    ...state,
    assembly: event.assembly,
    candidates,
  }
}

export function updateRandomFilter(
  state: IndexState,
  randomAssembly: IndexState['randomAssembly'],
): IndexState {
  return {
    ...state,
    randomAssembly,
  }
}

export function toggleLock(
  state: IndexState,
  event: ToggleLockPayload,
): IndexState {
  const lockedParts = event.value
    ? state.lockedParts.lock(event.id, state.assembly[event.id])
    : state.lockedParts.unlock(event.id)

  const candidates = deriveAvailableCandidates({
    assembly: state.assembly,
    lockedParts,
    initialCandidates: state.initialCandidates,
  })

  return {
    ...state,
    lockedParts,
    candidates,
  }
}

export function resetAllLocks(state: IndexState): IndexState {
  return {
    ...state,
    lockedParts: LockedParts.empty,
  }
}

export function openRandomPanel(state: IndexState): IndexState {
  return {
    ...state,
    offcanvasStatus: openRandomAssembly(),
  }
}

export function openSharePanel(state: IndexState): IndexState {
  return {
    ...state,
    offcanvasStatus: openShare(),
  }
}

export function openStorePanel(state: IndexState): IndexState {
  return {
    ...state,
    offcanvasStatus: openAssemblyStore(),
  }
}

export function toggleRandomPanel(
  state: IndexState,
  open: boolean,
): IndexState {
  return {
    ...state,
    offcanvasStatus: open ? openRandomAssembly() : closeOffcanvas(),
  }
}

export function toggleSharePanel(state: IndexState, open: boolean): IndexState {
  return {
    ...state,
    offcanvasStatus: open ? openShare() : closeOffcanvas(),
  }
}

export function toggleStorePanel(state: IndexState, open: boolean): IndexState {
  return {
    ...state,
    offcanvasStatus: open ? openAssemblyStore() : closeOffcanvas(),
  }
}

export function applyStoredAssembly(
  state: IndexState,
  assembly: IndexState['assembly'],
): IndexState {
  return {
    ...state,
    assembly,
  }
}

export function clearErrors(state: IndexState): IndexState {
  return {
    ...state,
    errorMessages: [],
  }
}

export function setErrorMessages(
  state: IndexState,
  errorMessages: string[],
): IndexState {
  return {
    ...state,
    errorMessages,
  }
}

export function updateCandidatesFromAssembly(
  assembly: IndexState['assembly'],
  lockedParts: LockedParts,
  baseCandidates: Candidates,
): Candidates {
  return deriveAvailableCandidates({
    assembly,
    lockedParts,
    initialCandidates: baseCandidates,
  })
}
