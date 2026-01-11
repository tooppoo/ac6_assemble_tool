import { latest as regulation } from '$lib/regulation'

import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
import { describe, expect, it } from 'vitest'

import { initializeAssembly } from '../interaction/assembly'
import { indexController } from './index-controller'
import type { IndexState } from './index-state'

const basePartsPool = {
  candidates: regulation.candidates,
  restrictedSlots: {},
}

const tryLimit = 3000

describe('indexController', () => {
  it('onAfterNavigate: migratedUrlがある場合にserialize effectを返す', () => {
    const { state } = indexController.init({ partsPool: basePartsPool, tryLimit })
    const url = new URL('https://example.com/')

    const result = indexController.onAfterNavigate(state, {
      url,
      type: 'enter',
      baseCandidates: basePartsPool.candidates,
    })

    expect(result.effects).toHaveLength(1)
    expect(result.effects[0]?.type).toBe('serializeAssembly')
    expect(result.state.serializeEnabled).toBe(true)
  })

  it('onAssemblyChanged: queuedUrlがある場合にpushState effectを含める', () => {
    const { state } = indexController.init({ partsPool: basePartsPool, tryLimit })
    const queuedUrl = new URL('https://example.com/?v=2')
    const nextState: IndexState = {
      ...state,
      serializeEnabled: true,
      queuedUrl,
    }

    const result = indexController.onAssemblyChanged(nextState)

    expect(result.state.queuedUrl).toBeNull()
    expect(result.effects.map((effect) => effect.type)).toEqual([
      'serializeAssembly',
      'pushState',
    ])
  })

  it('onPopState: assemblyを再構築しsyncLanguageFromQueryを返す', () => {
    const { state } = indexController.init({ partsPool: basePartsPool, tryLimit })
    const baseAssembly = initializeAssembly(basePartsPool.candidates)
    const query = assemblyToSearchV2(baseAssembly)
    const url = new URL(`https://example.com/?${query.toString()}`)

    const result = indexController.onPopState(state, url)

    expect(result.effects).toHaveLength(1)
    expect(result.effects[0]?.type).toBe('syncLanguageFromQuery')
    expect(result.state.assembly).toMatchObject(baseAssembly)
  })
})
