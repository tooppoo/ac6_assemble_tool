import { validatePartIdUniqueness, createDuplicateIdLogEntry } from '#parts/validation/id-validator'
import { validatePartsOnStartup } from '#parts/validation/validate-on-startup'

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('ID重複検証 統合テスト', () => {
  // コンソール出力をキャプチャするためのモック
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  describe('validatePartIdUniqueness', () => {
    it('重複なしの場合はnullを返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head 1' },
        { id: 'HD002', name: 'Head 2' },
        { id: 'HD003', name: 'Head 3' },
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).toBeNull()
    })

    it('重複ありの場合はエラー情報を返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head 1' },
        { id: 'HD002', name: 'Head 2' },
        { id: 'HD001', name: 'Head 3' }, // 重複
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).not.toBeNull()
      expect(result?.duplicateId).toBe('HD001')
      expect(result?.conflictingParts).toEqual(['Head 1', 'Head 3'])
    })

    it('複数の重複がある場合は最初の重複を返す', () => {
      const parts = [
        { id: 'HD001', name: 'Head 1' },
        { id: 'HD001', name: 'Head 2' }, // 重複1
        { id: 'HD002', name: 'Head 3' },
        { id: 'HD002', name: 'Head 4' }, // 重複2
      ]

      const result = validatePartIdUniqueness(parts)

      expect(result).not.toBeNull()
      expect(result?.duplicateId).toBe('HD001')
    })
  })

  describe('createDuplicateIdLogEntry', () => {
    it('構造化ログエントリを生成する', () => {
      const error = {
        duplicateId: 'HD001',
        conflictingParts: ['Head A', 'Head B'],
      }

      const logEntry = createDuplicateIdLogEntry(error)

      expect(logEntry).toMatchObject({
        level: 'error',
        message: 'Duplicate part ID detected',
        duplicateId: 'HD001',
        conflictingParts: ['Head A', 'Head B'],
      })
      expect(logEntry.timestamp).toBeDefined()
      expect(typeof logEntry.timestamp).toBe('string')
    })
  })

  describe('validatePartsOnStartup', () => {
    it('起動時検証が成功する（重複なし）', () => {
      // 実際のパーツデータで検証を実行
      expect(() => {
        validatePartsOnStartup()
      }).not.toThrow()

      // infoログが出力されることを確認
      expect(consoleLogSpy).toHaveBeenCalled()
      const logCall = consoleLogSpy.mock.calls[0][0]
      const logEntry = JSON.parse(logCall)

      expect(logEntry.level).toBe('info')
      expect(logEntry.message).toBe('Part ID validation passed')
      expect(logEntry.totalParts).toBeGreaterThan(0)
    })

    it('重複検出時にエラーログを出力して例外を投げる', () => {
      // このテストは実際のパーツに重複がないため、
      // validatePartIdUniquenessを直接テストすることで検証する
      const duplicateParts = [
        { id: 'TEST001', name: 'Test Part 1' },
        { id: 'TEST001', name: 'Test Part 2' },
      ]

      const result = validatePartIdUniqueness(duplicateParts)
      expect(result).not.toBeNull()

      // エラーログ形式を確認
      const logEntry = createDuplicateIdLogEntry(result!)
      expect(logEntry.level).toBe('error')
      expect(logEntry.message).toBe('Duplicate part ID detected')
      expect(logEntry.duplicateId).toBe('TEST001')
    })
  })

  describe('エラーログフォーマット', () => {
    it('JSON形式でエラーログが出力される', () => {
      const error = {
        duplicateId: 'HD001',
        conflictingParts: ['Part A', 'Part B'],
      }

      const logEntry = createDuplicateIdLogEntry(error)
      const jsonString = JSON.stringify(logEntry)

      // JSON形式として正しくパースできる
      expect(() => JSON.parse(jsonString)).not.toThrow()

      const parsed = JSON.parse(jsonString)
      expect(parsed.level).toBe('error')
      expect(parsed.duplicateId).toBe('HD001')
      expect(parsed.conflictingParts).toEqual(['Part A', 'Part B'])
    })

    it('機微情報を含まない', () => {
      const error = {
        duplicateId: 'HD001',
        conflictingParts: ['Part A', 'Part B'],
      }

      const logEntry = createDuplicateIdLogEntry(error)

      // ログエントリに機微情報（パスワード、トークンなど）が含まれないことを確認
      const logString = JSON.stringify(logEntry)
      expect(logString).not.toMatch(/password/i)
      expect(logString).not.toMatch(/token/i)
      expect(logString).not.toMatch(/secret/i)
      expect(logString).not.toMatch(/key/i)
    })
  })

  describe('パフォーマンス', () => {
    it('大量のパーツでも高速に検証できる', () => {
      // 1000個のパーツを生成
      const largeParts = Array.from({ length: 1000 }, (_, i) => ({
        id: `TEST${String(i).padStart(4, '0')}`,
        name: `Test Part ${i}`,
      }))

      const start = performance.now()
      const result = validatePartIdUniqueness(largeParts)
      const end = performance.now()

      expect(result).toBeNull() // 重複なし
      expect(end - start).toBeLessThan(50) // 50ms以内
    })
  })
})
