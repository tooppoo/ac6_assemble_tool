import { logger } from '@ac6_assemble_tool/shared/logger'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadViewMode, saveViewMode } from './view-mode'

describe('state/view-mode', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('saveViewMode', () => {
    it('表示モードをLocalStorageに保存できること', () => {
      saveViewMode('list')

      const saved = localStorage.getItem('ac6-parts-list-view-mode')
      expect(saved).toBe('list')
    })

    it('表示モードを上書き保存できること', () => {
      saveViewMode('grid')
      saveViewMode('list')

      const saved = localStorage.getItem('ac6-parts-list-view-mode')
      expect(saved).toBe('list')
    })

    it('LocalStorageが利用できない環境では何もしない', () => {
      vi.stubGlobal('localStorage', undefined)
      const errorSpy = vi.spyOn(logger, 'error')

      expect(() => saveViewMode('grid')).not.toThrow()
      expect(errorSpy).not.toHaveBeenCalled()
    })

    it('LocalStorageへの保存失敗時にエラーログを出力する', () => {
      const errorSpy = vi.spyOn(logger, 'error')
      const setItemSpy = vi.fn(() => {
        throw new Error('write failed')
      })
      vi.stubGlobal('localStorage', {
        get length() {
          return 0
        },
        clear: vi.fn(),
        getItem: vi.fn(),
        key: vi.fn(),
        removeItem: vi.fn(),
        setItem: setItemSpy,
      } as unknown as Storage)

      saveViewMode('list')

      expect(setItemSpy).toHaveBeenCalledWith(
        'ac6-parts-list-view-mode',
        'list',
      )
      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to save view mode',
        expect.objectContaining({
          viewMode: 'list',
          error: 'write failed',
        }),
      )
    })
  })

  describe('loadViewMode', () => {
    it('LocalStorageから表示モードを読み込めること', () => {
      localStorage.setItem('ac6-parts-list-view-mode', 'list')

      const viewMode = loadViewMode()

      expect(viewMode).toBe('list')
    })

    it('LocalStorageに表示モードが存在しない場合、デフォルト(grid)を返すこと', () => {
      const viewMode = loadViewMode()

      expect(viewMode).toBe('grid')
    })

    it('LocalStorageの値が不正な場合、デフォルト(grid)を返すこと', () => {
      localStorage.setItem('ac6-parts-list-view-mode', 'invalid')

      const viewMode = loadViewMode()

      expect(viewMode).toBe('grid')
    })

    it('LocalStorageが利用できない環境ではgridを返す', () => {
      vi.stubGlobal('localStorage', undefined)
      const errorSpy = vi.spyOn(logger, 'error')

      const viewMode = loadViewMode()

      expect(viewMode).toBe('grid')
      expect(errorSpy).not.toHaveBeenCalled()
    })

    it('LocalStorageからの読み込み失敗時にエラーログを出力しgridを返す', () => {
      const errorSpy = vi.spyOn(logger, 'error')
      const getItemSpy = vi.fn(() => {
        throw new Error('read failed')
      })
      vi.stubGlobal('localStorage', {
        get length() {
          return 0
        },
        clear: vi.fn(),
        getItem: getItemSpy,
        key: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
      } as unknown as Storage)

      const viewMode = loadViewMode()

      expect(viewMode).toBe('grid')
      expect(getItemSpy).toHaveBeenCalledWith('ac6-parts-list-view-mode')
      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to load view mode',
        expect.objectContaining({ error: 'read failed' }),
      )
    })
  })
})
