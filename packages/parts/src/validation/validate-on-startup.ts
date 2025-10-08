/**
 * 起動時パーツID検証
 */
import { armUnits, leftArmUnits } from '../arm-units'
import { arms } from '../arms'
import { backUnits, leftBackUnits } from '../back-units'
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
import { logger } from '../utils/logger'

import {
  DuplicatePartIdError,
  validatePartIdUniqueness,
} from './id-validator'

/**
 * 全パーツを収集
 *
 * 新しいパーツカテゴリファイルを追加した場合は、このリストにも追加する必要があります。
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
    ...leftArmUnits,
    ...backUnits,
    ...leftBackUnits,
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
    // ID重複検出時のエラーログ
    logger.error('Duplicate part ID detected', {
      duplicateId: result.duplicateId,
      conflictingParts: result.conflictingParts,
    })

    // アプリケーション起動を中断
    throw new DuplicatePartIdError(
      result.duplicateId,
      result.conflictingParts,
    )
  }

  // 検証成功時のinfoログ
  logger.info('Part ID validation passed', {
    totalParts: allParts.length,
  })
}
