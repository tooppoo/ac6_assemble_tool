/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from '$lib/i18n/define'

import { candidates, orders } from '@ac6_assemble_tool/parts/versions/v1.07'
import { cleanup, render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

let Index: any

describe.skip(`top page`, () => {
  beforeEach(async () => {
    const mod = await import('./+page.svelte')
    Index = mod.default
    render(Index, {
      props: {
        data: {
          regulation: {
            version: 'vx.y.z',
            candidates,
            orders,
          },
        },
      },
      context: new Map([['i18n', i18n]]),
    })
  })
  afterEach(() => {
    cleanup()
  })

  it('should contain game title in header', async () => {
    const header = screen.getByRole('heading', { level: 1 })

    expect(header.textContent).toContain('ARMORED CORE Ⅵ')
  })
  it('should contain select-form for each part', async () => {
    const selectBoxes = screen.getAllByRole('combobox')

    const expected = [
      'select-rightArmUnit',
      'select-leftArmUnit',
      'select-rightBackUnit',
      'select-leftBackUnit',
      'select-head',
      'select-core',
      'select-arms',
      'select-legs',
      'select-booster',
      'select-fcs',
      'select-generator',
      'select-expansion',
    ]

    expect(selectBoxes.map((e) => e.id)).toEqual(
      expect.arrayContaining(expected),
    )
  })
})
