import { latest as regulation } from '$lib/regulation'

import { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { sum } from '@ac6_assemble_tool/shared/array'
import { roundUpByRealPart } from '@ac6_assemble_tool/shared/number'
import { fireEvent, render } from '@testing-library/svelte'
import { tick } from 'svelte'
import { describe, expect, it, vi } from 'vitest'

import { initializeAssembly } from '../../interaction/initialize'

import LoadRangeSlider from './LoadRangeSlider.test-wrapper.svelte'

describe('LoadRangeSlider', () => {
  const candidates = regulation.candidates

  it('候補の重量合計から最小値・最大値・初期値を計算する', () => {
    const { container } = render(LoadRangeSlider, {
      props: createProps(candidates),
    })
    const { max, min } = computeLoadBounds(candidates)

    const rangeInput = container.querySelector<HTMLInputElement>('#load-range')
    const numberInput = container.querySelector<HTMLInputElement>(
      '#load-current-max-value-form',
    )

    expect(rangeInput).not.toBeNull()
    expect(numberInput).not.toBeNull()

    expect(Number(rangeInput!.max)).toBe(max)
    expect(Number(rangeInput!.min)).toBe(min)
    expect(Number(rangeInput!.value)).toBe(max)

    expect(Number(numberInput!.max)).toBe(max)
    expect(Number(numberInput!.min)).toBe(min)
    expect(Number(numberInput!.value)).toBe(max)
  })

  it('スライダー操作でchangeイベントを発火する', async () => {
    const changeSpy = vi.fn<(detail: { value: number }) => void>()
    const { container } = render(LoadRangeSlider, {
      props: createProps(candidates, { onChange: changeSpy }),
    })

    const { min } = computeLoadBounds(candidates)
    const rangeInput = container.querySelector<HTMLInputElement>('#load-range')
    const numberInput = container.querySelector<HTMLInputElement>(
      '#load-current-max-value-form',
    )

    expect(rangeInput).not.toBeNull()
    expect(numberInput).not.toBeNull()

    const rawValue = min + 200
    const snappedValue = rawValue - (rawValue % 10)

    rangeInput!.value = String(snappedValue)
    await fireEvent.change(rangeInput!)

    expect(changeSpy).toHaveBeenCalledWith({ value: snappedValue })
    expect(Number(numberInput!.value)).toBe(snappedValue)
  })

  it('脚部ロックメニューの操作でtoggle-lockイベントを発火する', async () => {
    const toggleSpy = vi.fn<(detail: { id: string; value: boolean }) => void>()
    const { getByRole, findByText } = render(LoadRangeSlider, {
      props: createProps(candidates, { onToggleLock: toggleSpy }),
    })

    const toggleButton = getByRole('button', { name: '積載上限' })
    await fireEvent.click(toggleButton)
    await tick()

    const lockMenuItem = await findByText('脚部を固定')
    await fireEvent.click(lockMenuItem)

    expect(toggleSpy).toHaveBeenCalledWith({ id: 'legs', value: true })
  })

  it('脚部積載上限を適用すると現在値がアセンブリの制限値に更新される', async () => {
    const assembly = initializeAssembly(candidates)
    const changeSpy = vi.fn<(detail: { value: number }) => void>()
    const { container, getByRole, findByText } = render(LoadRangeSlider, {
      props: createProps(candidates, { assembly, onChange: changeSpy }),
    })

    const toggleButton = getByRole('button', { name: '積載上限' })
    await fireEvent.click(toggleButton)
    await tick()

    const applyItem = await findByText('現在の脚部積載上限を適用')
    await fireEvent.click(applyItem)
    await tick()

    const numberInput = container.querySelector<HTMLInputElement>(
      '#load-current-max-value-form',
    )

    expect(changeSpy).toHaveBeenCalledWith({ value: assembly.loadLimit })
    expect(Number(numberInput!.value)).toBe(assembly.loadLimit)
  })
})

function createProps(
  candidates: Candidates,
  overrides: Partial<{
    assembly: ReturnType<typeof initializeAssembly>
    onChange: (detail: { value: number }) => void
    onToggleLock: (detail: { id: string; value: boolean }) => void
  }> = {},
) {
  return {
    candidates,
    assembly: overrides.assembly ?? initializeAssembly(candidates),
    lock: LockedParts.empty,
    ...overrides,
  }
}

function computeLoadBounds(candidates: Candidates): {
  max: number
  min: number
} {
  type WithWeight = Readonly<{ weight: number }>
  const sortDesc = <T extends WithWeight>(xs: readonly T[]) =>
    Array.from(xs).sort((a, b) => b.weight - a.weight)
  const sortAsc = <T extends WithWeight>(xs: readonly T[]) =>
    Array.from(xs).sort((a, b) => a.weight - b.weight)

  const totals = (
    sorted: <T extends WithWeight>(xs: readonly T[]) => readonly T[],
  ) =>
    sum(
      [
        sorted(candidates.rightArmUnit)[0],
        sorted(candidates.leftArmUnit)[0],
        sorted(candidates.rightBackUnit)[0],
        sorted(candidates.leftBackUnit)[0],
        sorted(candidates.head)[0],
        sorted(candidates.core)[0],
        sorted(candidates.arms)[0],
        sorted(candidates.booster)[0],
        sorted(candidates.fcs)[0],
        sorted(candidates.generator)[0],
      ].map((part) => part.weight),
    )

  const headRoomMax = totals(sortDesc)
  const headRoomMin = totals(sortAsc)

  return {
    max: roundUpByRealPart(2)(headRoomMax),
    min: headRoomMin,
  }
}
