import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'

import { VALID_SLOTS } from './shared'

const SLOT_PARTS_PARAM_SUFFIX = '_parts' as const

export function toSlotParamValue(slot: CandidatesKey): string {
  return camelToSnake(slot)
}

export function toSlotPartsParamKey(slot: CandidatesKey): string {
  return `${toSlotParamValue(slot)}${SLOT_PARTS_PARAM_SUFFIX}`
}

export function parseSlotPartsParamKey(paramKey: string): CandidatesKey | null {
  if (!paramKey.endsWith(SLOT_PARTS_PARAM_SUFFIX)) {
    return null
  }

  const base = paramKey.slice(0, -SLOT_PARTS_PARAM_SUFFIX.length)
  return normalizeSlotKey(base)
}

export function normalizeSlotKey(value: string): CandidatesKey | null {
  if (!value) {
    return null
  }

  if (VALID_SLOTS.has(value as CandidatesKey)) {
    return value as CandidatesKey
  }

  const camel = snakeToCamel(value)
  if (VALID_SLOTS.has(camel as CandidatesKey)) {
    return camel as CandidatesKey
  }

  return null
}

export const SLOT_PARTS_SUFFIX = SLOT_PARTS_PARAM_SUFFIX

function camelToSnake(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function snakeToCamel(value: string): string {
  return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
}
