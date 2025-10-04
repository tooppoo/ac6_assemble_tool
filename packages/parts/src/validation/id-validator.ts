/**
 * パーツID重複検証モジュール
 */

/**
 * ID重複エラー情報
 */
export type DuplicateIdError = Readonly<{
  /** 重複しているID */
  duplicateId: string
  /** 重複しているパーツ名のリスト */
  conflictingParts: ReadonlyArray<string>
}>

/**
 * 検証結果型
 * - 重複なし: null
 * - 重複あり: DuplicateIdError
 */
export type PartIdValidationResult = DuplicateIdError | null

/**
 * パーツID重複検証インターフェース
 */
export interface PartIdValidator {
  /**
   * 全パーツIDの重複を検証
   * @param allParts - 検証対象のパーツリスト
   * @returns 重複IDが存在する場合はエラー情報、存在しない場合はnull
   */
  validateUniqueness(
    allParts: ReadonlyArray<{ id: string; name: string }>,
  ): PartIdValidationResult
}

/**
 * パーツIDの一意性を検証する純粋関数
 *
 * @param parts - 検証対象のパーツリスト
 * @returns 重複が検出された場合はエラー情報、重複がない場合はnull
 *
 * @example
 * ```typescript
 * const parts = [
 *   { id: 'HD001', name: 'Head A' },
 *   { id: 'HD002', name: 'Head B' },
 * ]
 * const result = validatePartIdUniqueness(parts)
 * if (result !== null) {
 *   console.error(`Duplicate ID: ${result.duplicateId}`)
 * }
 * ```
 */
export function validatePartIdUniqueness(
  parts: ReadonlyArray<{ id: string; name: string }>,
): PartIdValidationResult {
  // IDをキーとして、パーツ名のリストを値とするマップを作成
  const idMap = new Map<string, string[]>()

  for (const part of parts) {
    const existing = idMap.get(part.id)
    if (existing) {
      existing.push(part.name)
    } else {
      idMap.set(part.id, [part.name])
    }
  }

  // 重複しているIDを検出（値の配列長が2以上）
  for (const [id, names] of idMap.entries()) {
    if (names.length > 1) {
      return {
        duplicateId: id,
        conflictingParts: names,
      }
    }
  }

  return null
}

/**
 * 構造化ログ出力用のエラー情報を生成
 *
 * @param error - 重複IDエラー情報
 * @returns JSON形式のログオブジェクト
 */
export function createDuplicateIdLogEntry(error: DuplicateIdError): object {
  return {
    level: 'error',
    message: 'Duplicate part ID detected',
    duplicateId: error.duplicateId,
    conflictingParts: error.conflictingParts,
    timestamp: new Date().toISOString(),
  }
}
