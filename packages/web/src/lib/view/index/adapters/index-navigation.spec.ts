import { latest as regulation } from '$lib/regulation'

import { describe, expect, it, beforeEach, vi } from 'vitest'

// Mock $app modules - must be defined before imports
vi.mock('$app/navigation', () => ({
  pushState: vi.fn(),
}))

vi.mock('$lib/store/query/query-store.svelte', () => ({
  storeAssemblyAsQuery: vi.fn(),
}))

// mockの関係上、mock後にimport
// eslint-disable-next-line import/order
import { storeAssemblyAsQuery } from '$lib/store/query/query-store.svelte'

import { initializeAssembly } from '../usecase/initialize-assembly'

import { createNavigationRunner } from './index-navigation'

import { pushState } from '$app/navigation'

const mockPushState = pushState as ReturnType<typeof vi.fn>
const mockStoreAssemblyAsQuery = storeAssemblyAsQuery as ReturnType<
  typeof vi.fn
>

describe('createNavigationRunner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enable前はnavigation effectを保留し、enable後に実行する', () => {
    const runner = createNavigationRunner()
    const url = new URL('https://example.com/?v=2')

    const handled = runner.apply({ type: 'pushState', url })

    expect(handled).toBe(true)
    expect(mockPushState).not.toHaveBeenCalled()

    runner.enable()

    expect(mockPushState).toHaveBeenCalledWith(url, {})
  })

  it('serializeAssemblyをenable後に実行できる', () => {
    const runner = createNavigationRunner()
    const assembly = initializeAssembly(regulation.candidates)

    runner.apply({ type: 'serializeAssembly', assembly })
    runner.enable()

    expect(mockStoreAssemblyAsQuery).toHaveBeenCalledWith(assembly)
  })

  it('enable後の失敗は再実行しない', () => {
    const runner = createNavigationRunner()
    const url = new URL('https://example.com/?v=2')

    mockPushState.mockImplementationOnce(() => {
      throw new Error('failed')
    })

    runner.apply({ type: 'pushState', url })
    runner.enable()
    runner.enable()

    expect(mockPushState).toHaveBeenCalledTimes(1)
  })

  it('navigation以外のeffectは処理しない', () => {
    const runner = createNavigationRunner()
    const url = new URL('https://example.com/?v=2')

    const handled = runner.apply({ type: 'syncLanguageFromQuery', url })

    expect(handled).toBe(false)
    expect(mockPushState).not.toHaveBeenCalled()
  })
})
