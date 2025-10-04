/**
 * 起動時パーツID検証
 */
import { armUnits } from '../arm-units'
import { arms } from '../arms'
import { backUnits } from '../back-units'
import { boosters } from '../booster'
import { cores } from '../cores'
import { expansions } from '../expansions'
import { fcses } from '../fces'
import { generators } from '../generators'
import { heads } from '../heads'
import { legs } from '../legs'
import {
  boosterNotEquipped,
  expansionNotEquipped,
  armNotEquipped,
  backNotEquipped,
} from '../not-equipped'

import {
  validatePartIdUniqueness,
  createDuplicateIdLogEntry,
} from './id-validator'

/**
 * 全パーツを収集
 */
function collectAllParts(): ReadonlyArray<{ id: string; name: string }> {
  return [
    ...heads,
    ...cores,
    ...arms,
    ...legs,
    ...boosters,
    ...fcses,
    ...generators,
    ...expansions,
    ...armUnits,
    ...backUnits,
    boosterNotEquipped,
    expansionNotEquipped,
    armNotEquipped,
    backNotEquipped,
  ]
}

/**
 * 起動時にパーツIDの重複を検証
 *
 * @throws {Error} ID重複が検出された場合
 */
export function validatePartsOnStartup(): void {
  const allParts = collectAllParts()
  const result = validatePartIdUniqueness(allParts)

  if (result !== null) {
    // 構造化ログを出力
    const logEntry = createDuplicateIdLogEntry(result)
    console.error(JSON.stringify(logEntry))

    // アプリケーション起動を中断
    throw new Error(
      `Duplicate part ID detected: ${result.duplicateId} ` +
        `(conflicting parts: ${result.conflictingParts.join(', ')})`,
    )
  }

  // 検証成功時はinfoログを出力
  console.log(
    JSON.stringify({
      level: 'info',
      message: 'Part ID validation passed',
      totalParts: allParts.length,
      timestamp: new Date().toISOString(),
    }),
  )
}
