import {
  CANDIDATES_KEYS,
  type CandidatesKey,
} from '@ac6_assemble_tool/parts/types/candidates'

/**
 * 有効なスロット一覧
 */
export const VALID_SLOTS: ReadonlySet<CandidatesKey> = new Set(CANDIDATES_KEYS)

/**
 * デシリアライズエラー
 */
export type DeserializeError =
  | { type: 'invalid_format'; message: string }
  | { type: 'invalid_slot'; slot: string }
  | { type: 'invalid_filter'; filter: string }
