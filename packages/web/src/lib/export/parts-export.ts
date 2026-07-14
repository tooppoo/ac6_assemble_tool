import Papa from 'papaparse'

import type { Category } from '@ac6_assemble_tool/parts/types/base/category'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import {
  CANDIDATES_KEYS,
  excludeNotEquipped,
} from '@ac6_assemble_tool/parts/types/candidates'
import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'

export function flattenRegulation(regulation: Regulation): ACParts[] {
  const uniqueParts = new Map<string, ACParts>()

  for (const key of CANDIDATES_KEYS) {
    const candidates = regulation.candidates[key] as readonly ACParts[]
    const equipped = excludeNotEquipped(candidates)

    for (const part of equipped) {
      uniqueParts.set(part.id, part)
    }
  }

  return [...uniqueParts.values()]
}

export function groupByCategory(
  parts: readonly ACParts[],
): Map<Category, ACParts[]> {
  const grouped = new Map<Category, ACParts[]>()

  for (const part of parts) {
    const list = grouped.get(part.category) ?? []
    list.push(part)
    grouped.set(part.category, list)
  }

  return grouped
}

export type ExportMeta = Readonly<{
  regulation: string
  filter: readonly string[]
}>

export function toJson(
  parts: readonly ACParts[],
  meta: ExportMeta,
): string {
  return JSON.stringify(
    {
      regulation: meta.regulation,
      filter: meta.filter,
      data: parts,
    },
    null,
    2,
  )
}

function flattenCsvValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(';')
  }
  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function flattenPartForCsv(part: ACParts): Record<string, string> {
  return Object.fromEntries(
    Object.entries(part).map(([key, value]) => [
      key,
      flattenCsvValue(value),
    ]),
  )
}

export function toCsv(parts: readonly ACParts[]): string {
  if (parts.length === 0) {
    return ''
  }

  const rows = parts.map(flattenPartForCsv)
  return Papa.unparse(rows)
}
