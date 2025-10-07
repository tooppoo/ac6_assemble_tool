/**
 * パーツID生成スクリプト
 *
 * 新規パーツ追加時に、次のユニークIDを生成するためのユーティリティ
 */

/**
 * カテゴリコードマッピング
 * カテゴリ名から2-3文字のカテゴリコードへのマッピング
 */
const CATEGORY_CODE_MAP: Record<string, string> = {
  head: 'HD',
  core: 'CR',
  arms: 'AR',
  legs: 'LG',
  booster: 'BS',
  fcs: 'FCS',
  generator: 'GN',
  expansion: 'EXP',
  'arm-unit': 'AU',
  'back-unit': 'BU',
}

/**
 * カテゴリ名をカテゴリコードに変換
 *
 * @param category - パーツカテゴリ名（例: 'head', 'core'）
 * @returns カテゴリコード（例: 'HD', 'CR'）
 * @throws 未知のカテゴリの場合はエラー
 */
export function categoryToCode(category: string): string {
  const code = CATEGORY_CODE_MAP[category]
  if (!code) {
    throw new Error(`Unknown category: ${category}`)
  }
  return code
}

/**
 * 既存IDリストから次のユニークIDを生成
 *
 * @param category - パーツカテゴリ名
 * @param existingIds - 既存のパーツIDリスト
 * @returns 次のユニークID（例: 'HD001', 'CR042'）
 */
export function generateNextId(
  category: string,
  existingIds: string[],
): string {
  const code = categoryToCode(category)

  // 該当カテゴリのIDのみを抽出し、連番部分を取得
  const categoryIds = existingIds
    .filter((id) => id.startsWith(code))
    .map((id) => {
      const match = id.match(/^[A-Z]{2,3}(\d{3,4})$/)
      return match ? parseInt(match[1], 10) : null
    })
    .filter((num): num is number => num !== null)

  // 最大連番を取得（既存IDがない場合は0）
  const maxNumber = categoryIds.length > 0 ? Math.max(...categoryIds) : 0

  // 次の連番を計算
  const nextNumber = maxNumber + 1

  // 3桁でゼロパディング（1000以上の場合は4桁）
  const paddedNumber =
    nextNumber < 1000 ? String(nextNumber).padStart(3, '0') : String(nextNumber)

  return `${code}${paddedNumber}`
}

/**
 * CLIエントリーポイント
 *
 * 使用例:
 * ```bash
 * pnpm generate-part-id -- --category=head
 * pnpm generate-part-id -- --category=core --existing="CR001,CR002,CR003"
 * ```
 */
export function main() {
  const args = process.argv.slice(2)
  let category: string | null = null
  let existing: string[] = []

  // コマンドライン引数を解析
  for (const arg of args) {
    if (arg.startsWith('--category=')) {
      category = arg.split('=')[1]
    } else if (arg.startsWith('--existing=')) {
      existing = arg.split('=')[1].split(',').filter(Boolean)
    }
  }

  if (!category) {
    console.error('Error: --category is required')
    console.error(
      'Usage: pnpm generate-part-id -- --category=<category> [--existing=<id1,id2,...>]',
    )
    process.exit(1)
  }

  try {
    const nextId = generateNextId(category, existing)
    console.log(nextId)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    }
    process.exit(1)
  }
}
