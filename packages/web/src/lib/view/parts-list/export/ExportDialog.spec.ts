import * as partsExport from '$lib/export/parts-export'
import { latest as regulation } from '$lib/regulation'

import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'

import type { Filter } from '../filter/filters-core'

import ExportDialogTestWrapper from './ExportDialog.test-wrapper.svelte'

vi.mock('$lib/export/parts-export', async (importOriginal) => {
  const actual = await importOriginal<typeof partsExport>()
  return {
    ...actual,
    downloadBlob: vi.fn(),
  }
})

const noFilters: readonly Filter[] = []

function readBlobAsText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(blob)
  })
}

describe('ExportDialog', () => {
  it('デフォルトで「表示中」が選択され、カテゴリ選択は表示されない', () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    const filteredRadio = screen.getByLabelText(
      '表示中のパーツ',
    ) as HTMLInputElement
    expect(filteredRadio.checked).toBe(true)
    expect(screen.queryByLabelText('カテゴリ')).not.toBeInTheDocument()
  })

  it('「特定カテゴリ」選択時はカテゴリ未選択だと実行ボタンが無効', async () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    await fireEvent.click(screen.getByLabelText('特定カテゴリ'))

    expect(screen.getByLabelText('カテゴリ')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ダウンロード' })).toBeDisabled()
  })

  it('表示中のパーツが空の場合は実行ボタンが無効', () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [],
        filters: noFilters,
      },
    })

    expect(screen.getByRole('button', { name: 'ダウンロード' })).toBeDisabled()
    expect(screen.getByText('表示中のパーツがありません')).toBeInTheDocument()
  })

  it('実行ボタンで表示中パーツのJSONダウンロードがトリガーされる', async () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'ダウンロード' }))

    expect(partsExport.downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      `ac6-parts-filtered-${regulation.version}.json`,
    )
  })

  it('お気に入りフィルタ有効時はJSON exportのfilterメタデータに反映される', async () => {
    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
        showFavoritesOnly: true,
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'ダウンロード' }))

    const calls = vi.mocked(partsExport.downloadBlob).mock.calls
    const [blob] = calls[calls.length - 1]
    const json = JSON.parse(await readBlobAsText(blob as Blob))
    expect(json.filter).toContain('favorites-only')
  })

  it('エクスポートに失敗した場合はダイアログ内にエラーメッセージを表示する', async () => {
    vi.mocked(partsExport.downloadBlob).mockImplementationOnce(() => {
      throw new Error('boom')
    })

    render(ExportDialogTestWrapper, {
      props: {
        open: true,
        onClose: vi.fn(),
        regulation,
        filteredParts: [regulation.candidates.head[0]],
        filters: noFilters,
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'ダウンロード' }))

    expect(
      await screen.findByText('エクスポートに失敗しました'),
    ).toBeInTheDocument()
  })
})
