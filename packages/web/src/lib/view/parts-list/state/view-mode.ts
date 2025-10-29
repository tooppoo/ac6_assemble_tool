import { logger } from '@ac6_assemble_tool/shared/logger'

/**
 * LocalStorageに保存する表示モードのキー
 */
const VIEW_MODE_KEY = 'ac6-parts-list-view-mode'

/**
 * 表示モード（grid/list）
 */
export type ViewMode = 'grid' | 'list'

/**
 * LocalStorageへの表示モード保存（プライベート設定）
 */
export function saveViewMode(viewMode: ViewMode): void {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(VIEW_MODE_KEY, viewMode)
  } catch (error) {
    logger.error('Failed to save view mode', {
      viewMode,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
/**
 * LocalStorageからの表示モード読み込み
 */
export function loadViewMode(): ViewMode {
  if (typeof localStorage === 'undefined') {
    return 'grid'
  }

  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY)

    if (saved === 'grid' || saved === 'list') {
      return saved
    }

    return 'grid' // デフォルト
  } catch (error) {
    logger.error('Failed to load view mode', {
      error: error instanceof Error ? error.message : String(error),
    })

    return 'grid' // デフォルト
  }
}
