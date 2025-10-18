/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup, render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

let Layout: any
// Skip: requires SvelteKit plugin which is disabled during Vitest runs
describe.skip('layout', () => {
  beforeEach(async () => {
    const mod = await import('./+layout.svelte')
    Layout = mod.default
    render(Layout)
  })
  afterEach(() => {
    cleanup()
  })

  it('should use font-monorepo', () => {
    const root = screen.getByTestId('layout-root')

    expect(root.classList.contains('font-monospace')).toBe(true)
  })
  it('should set favicon', () => {
    expect(document.head.querySelector('link[rel="icon"]')).not.toBeNull()
  })
})
