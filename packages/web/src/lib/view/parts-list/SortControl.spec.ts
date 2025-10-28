import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import { describe, it, expect, vi } from 'vitest'

import SortControlTestWrapper from './SortControl.test-wrapper.svelte'

describe('SortControl', () => {
  const baseProps = {
    slot: 'head',
    properties: ['price', 'weight', 'en_load'] as const,
    sortKey: null,
    sortOrder: null,
  }

  it('並び替え属性と並び順の選択肢を表示する', () => {
    render(SortControlTestWrapper, { props: baseProps })

    const propertySelect = screen.getByLabelText('並び替え対象') as HTMLSelectElement
    const propertyOptions = Array.from(propertySelect.options).map(
      (option) => option.textContent,
    )
    expect(propertyOptions).toEqual(['価格', '総重量', 'EN負荷'])

    const orderSelect = screen.getByLabelText('並び順') as HTMLSelectElement
    const orderOptions = Array.from(orderSelect.options).map(
      (option) => option.textContent,
    )
    expect(orderOptions).toEqual(['昇順', '降順'])
  })

  it('適用ボタンでonsortchangeが呼び出される', async () => {
    const handleSortChange = vi.fn()
    render(SortControlTestWrapper, {
      props: {
        ...baseProps,
        onsortchange: handleSortChange,
      },
    })

    const propertySelect = screen.getByLabelText('並び替え対象') as HTMLSelectElement
    await fireEvent.change(propertySelect, { target: { value: 'weight' } })
    expect(propertySelect.value).toBe('weight')

    const applyButton = screen.getByRole('button', { name: '適用' })
    await fireEvent.click(applyButton)

    await waitFor(() => expect(handleSortChange).toHaveBeenCalled())
    expect(handleSortChange).toHaveBeenCalledWith({
      key: 'weight',
      order: 'asc',
    })
  })

  it('並び順を降順に変更して適用できる', async () => {
    const handleSortChange = vi.fn()
    render(SortControlTestWrapper, {
      props: {
        ...baseProps,
        onsortchange: handleSortChange,
      },
    })

    const orderSelect = screen.getByLabelText('並び順') as HTMLSelectElement
    await fireEvent.change(orderSelect, { target: { value: 'desc' } })
    expect(orderSelect.value).toBe('desc')

    const applyButton = screen.getByRole('button', { name: '適用' })
    await fireEvent.click(applyButton)

    await waitFor(() => expect(handleSortChange).toHaveBeenCalled())
    expect(handleSortChange).toHaveBeenCalledWith({
      key: 'price',
      order: 'desc',
    })
  })

  it('クリアボタンでonsortclearが呼び出される', async () => {
    const handleSortClear = vi.fn()
    render(SortControlTestWrapper, {
      props: {
        ...baseProps,
        sortKey: 'price',
        sortOrder: 'asc',
        onsortclear: handleSortClear,
      },
    })

    const clearButton = screen.getByRole('button', { name: 'クリア' })
    await fireEvent.click(clearButton)

    expect(handleSortClear).toHaveBeenCalledOnce()
  })
})
