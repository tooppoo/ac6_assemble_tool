import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
import { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
import { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

import { initializeAssembly } from '../interaction/assembly'
import { closeOffcanvas, type OffcanvasStatus } from '../interaction/offcanvas'
import type { PartsPoolRestrictions } from '../interaction/derive-parts-pool'

export type IndexState = {
  partsPoolState: PartsPoolRestrictions
  initialCandidates: Candidates
  candidates: Candidates
  lockedParts: LockedParts
  randomAssembly: RandomAssembly
  offcanvasStatus: OffcanvasStatus
  errorMessages: string[]
  assembly: Assembly
  queuedUrl: URL | null
  serializeEnabled: boolean
}

export type IndexStateInitParams = {
  partsPool: PartsPoolRestrictions
  tryLimit: number
}

export function createIndexState({
  partsPool,
  tryLimit,
}: IndexStateInitParams): IndexState {
  const candidates = partsPool.candidates
  return {
    partsPoolState: partsPool,
    initialCandidates: candidates,
    candidates,
    lockedParts: LockedParts.empty,
    randomAssembly: RandomAssembly.init({ limit: tryLimit }),
    offcanvasStatus: closeOffcanvas(),
    errorMessages: [],
    assembly: initializeAssembly(candidates),
    queuedUrl: null,
    serializeEnabled: false,
  }
}
