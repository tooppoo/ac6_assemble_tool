import type { ReportDiff } from "../model/report"

export function calculateReportDiff(
  currentValue: number,
  previousValue: number | null,
): ReportDiff | null {
  if (previousValue === null || previousValue === undefined) return null

  const delta = currentValue - previousValue
  if (delta === 0) return null

  return {
    value: Math.abs(delta),
    direction: delta > 0 ? 'up' : 'down',
  }
}
