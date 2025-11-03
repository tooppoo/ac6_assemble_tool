#!/usr/bin/env tsx
/**
 * ビルド時パーツID検証スクリプト
 *
 * 全パーツのIDに重複がないかチェックし、重複がある場合はビルドを失敗させる
 */

import { validatePartsOnStartup } from '../../src/validation/validate-on-startup'

try {
  console.log('🔍 Validating part IDs...')
  validatePartsOnStartup()
  console.log('✅ Part ID validation passed')
  process.exit(0)
} catch (error) {
  console.error('❌ Part ID validation failed')
  if (error instanceof Error) {
    console.error(error.message)
  }
  process.exit(1)
}
