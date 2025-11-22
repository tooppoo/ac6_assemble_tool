/**
 * 構造化ログユーティリティ
 *
 * AGENTS.mdの指示に従い、JSON形式の構造化ログを出力する。
 * ログレベル: info, debug, warn, error, fatal
 * 機微情報は含めないこと。
 */

const logLevel = ['info', 'debug', 'warn', 'error', 'fatal'] as const
export type LogLevel = (typeof logLevel)[number]

export type LogContext = Record<string, unknown>

let currentLogLevel: LogLevel = 'info'

export function setLogLevel(level: string): void {
  if (logLevel.includes(level as LogLevel)) {
    currentLogLevel = level as LogLevel
  }
}

const logLevelEnum = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
} as const

/**
 * 構造化ログを出力する
 */
function log(level: LogLevel, message: string, context: LogContext = {}): void {
  const targetLogLevel = logLevelEnum[level]
  const configuredLogLevel = logLevelEnum[currentLogLevel]

  if (targetLogLevel > configuredLogLevel) {
    return
  }

  const logEntry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...context,
  }

  const logString = JSON.stringify(logEntry)

  switch (level) {
    case 'debug':
      console.debug(logString)
      break
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
