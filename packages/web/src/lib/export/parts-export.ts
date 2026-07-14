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
