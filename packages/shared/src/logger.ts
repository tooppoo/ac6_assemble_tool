/**
 * 構造化ログユーティリティ
 *
 * AGENTS.mdの指示に従い、JSON形式の構造化ログを出力する。
 * ログレベル: info, debug, warn, error, fatal
 * 機微情報は含めないこと。
 */

export type LogLevel = 'info' | 'debug' | 'warn' | 'error' | 'fatal'

export type LogContext = Record<string, unknown>

/**
 * 構造化ログを出力する
 */
function log(level: LogLevel, message: string, context: LogContext = {}): void {
  const logEntry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...context,
  }

  const logString = JSON.stringify(logEntry)

  switch (level) {
    case 'debug':
    case 'info':
      console.info(logString)
      break
    case 'warn':
      console.warn(logString)
      break
    case 'error':
    case 'fatal':
      console.error(logString)
      break
  }
}

/**
 * 構造化ログAPI
 */
export const logger = {
  /**
   * info: システムの正常動作における重要な出来事
   */
  info: (message: string, context?: LogContext) => {
    log('info', message, context)
  },

  /**
   * debug: 開発者が特定機能やパスの実行経路を追跡するために有用な情報
   */
  debug: (message: string, context?: LogContext) => {
    log('debug', message, context)
  },

  /**
   * warn: システム上期待された動作ではないが、処理は実行可能なもの
   */
  warn: (message: string, context?: LogContext) => {
    log('warn', message, context)
  },

  /**
   * error: システム上期待された動作でなく、処理を中断させなくてはならないもの
   */
  error: (message: string, context?: LogContext) => {
    log('error', message, context)
  },

  /**
   * fatal: システム上期待された動作ではなく、システム全体の動作を止めるもの
   */
  fatal: (message: string, context?: LogContext) => {
    log('fatal', message, context)
  },
} as const
