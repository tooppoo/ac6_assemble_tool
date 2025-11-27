
import {
  type Candidates,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'

export interface PartsPoolRestrictions {
  candidates: Candidates
  restrictedSlots: Partial<Record<CandidatesKey, readonly string[]>>
}
