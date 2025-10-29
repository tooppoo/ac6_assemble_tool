import { latest as regulation } from '$lib/regulation'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { sum } from '@ac6_assemble_tool/shared/array'
import { roundUpByRealPart } from '@ac6_assemble_tool/shared/number'
import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'

import CoamRangeSlider from './CoamRangeSlider.test-wrapper.svelte'

describe('CoamRangeSlider', () => {
  const candidates = regulation.candidates

  it('候補の価格合計から最大値と初期値を計算する', () => {
    const { container } = render(CoamRangeSlider, {
      props: { candidates },
    })
    const expectedMax = computeCoamMax(candidates)

    const rangeInput = container.querySelector<HTMLInputElement>('#coam-range')
    const numberInput = container.querySelector<HTMLInputElement>(
      '#coam-current-max-value-form',
    )

    expect(rangeInput).not.toBeNull()
    expect(numberInput).not.toBeNull()

    expect(Number(rangeInput!.max)).toBe(expectedMax)
    expect(Number(rangeInput!.value)).toBe(expectedMax)
    expect(Number(numberInput!.max)).toBe(expectedMax)
    expect(Number(numberInput!.value)).toBe(expectedMax)
  })

  it('スライダー操作でchangeイベントを発火する', async () => {
    const changeSpy = vi.fn<(detail: { value: number }) => void>()
    const { container } = render(CoamRangeSlider, {
      props: { candidates, onChange: changeSpy },
    })

    const expectedMax = computeCoamMax(candidates)
    const rangeInput = container.querySelector<HTMLInputElement>('#coam-range')
    const numberInput = container.querySelector<HTMLInputElement>(
      '#coam-current-max-value-form',
    )

    expect(rangeInput).not.toBeNull()
    expect(numberInput).not.toBeNull()

    const newValue = Math.max(0, expectedMax - 5000)
    const snappedValue = newValue - (newValue % 1000)

    rangeInput!.value = String(snappedValue)
    await fireEvent.change(rangeInput!)

    expect(changeSpy).toHaveBeenCalledWith({ value: snappedValue })
    expect(Number(numberInput!.value)).toBe(snappedValue)
  })
})

function computeCoamMax(candidates: Candidates): number {
  type WithPrice = Readonly<{ price: number }>
  const sortDesc = <T extends WithPrice>(xs: readonly T[]) =>
    Array.from(xs).sort((a, b) => b.price - a.price)

  const total = sum(
    [
      sortDesc(candidates.rightArmUnit)[0],
      sortDesc(candidates.leftArmUnit)[0],
      sortDesc(candidates.rightBackUnit)[0],
      sortDesc(candidates.leftBackUnit)[0],
      sortDesc(candidates.head)[0],
      sortDesc(candidates.core)[0],
      sortDesc(candidates.arms)[0],
      sortDesc(candidates.legs)[0],
      sortDesc(candidates.booster)[0],
      sortDesc(candidates.fcs)[0],
      sortDesc(candidates.generator)[0],
    ].map((part) => part.price),
  )

  return roundUpByRealPart(1)(total)
}
