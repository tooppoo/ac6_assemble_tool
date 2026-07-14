import type { Classification } from '@ac6_assemble_tool/parts/types/base/classification'
import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
import {
  CANDIDATES_KEYS,
  excludeNotEquipped,
} from '@ac6_assemble_tool/parts/types/candidates'
import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
import JSZip from 'jszip'
import Papa from 'papaparse'

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

export function groupByClassification(
  parts: readonly ACParts[],
): Map<Classification, ACParts[]> {
  const grouped = new Map<Classification, ACParts[]>()

  for (const part of parts) {
    const list = grouped.get(part.classification) ?? []
    list.push(part)
    grouped.set(part.classification, list)
  }

  return grouped
}

export type ExportMeta = Readonly<{
  regulation: string
  filter: readonly string[]
}>

export function toJson(parts: readonly ACParts[], meta: ExportMeta): string {
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
    Object.entries(part).map(([key, value]) => [key, flattenCsvValue(value)]),
  )
}

export function toCsv(parts: readonly ACParts[]): string {
  if (parts.length === 0) {
    return ''
  }

  const rows = parts.map(flattenPartForCsv)
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  return Papa.unparse(rows, { columns })
}

export type ExportFormat = 'json' | 'csv'

export async function buildZip(
  groupedParts: Map<Classification, ACParts[]>,
  format: ExportFormat,
  meta: ExportMeta,
): Promise<Blob> {
  const zip = new JSZip()

  for (const [classification, parts] of groupedParts) {
    const filename = `${classification}-${meta.regulation}.${format}`
    const content = format === 'json' ? toJson(parts, meta) : toCsv(parts)
    zip.file(filename, content)
  }

  return zip.generateAsync({ type: 'blob' })
}

export type ExportTarget = 'all' | 'classification' | 'filtered'

export function buildExportFilename(
  target: ExportTarget,
  format: ExportFormat,
  version: string,
  classification?: Classification,
): string {
  switch (target) {
    case 'all':
      return `ac6-parts-all-${version}.zip`
    case 'classification':
      return `ac6-parts-${classification}-${version}.${format}`
    case 'filtered':
      return `ac6-parts-filtered-${version}.${format}`
  }
}

export function buildFileBlob(content: string, format: ExportFormat): Blob {
  const type = format === 'json' ? 'application/json' : 'text/csv'
  return new Blob([content], { type })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
