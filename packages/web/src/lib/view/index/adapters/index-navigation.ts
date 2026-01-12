import { storeAssemblyAsQuery } from '$lib/store/query/query-store'

import { logger } from '@ac6_assemble_tool/shared/logger'

import type { IndexEffect } from '../controller/index-effects'

import { pushState } from '$app/navigation'

type NavigationEffect = Extract<
  IndexEffect,
  { type: 'serializeAssembly' | 'pushState' }
>

type NavigationRunner = Readonly<{
  enable: () => void
  isEnabled: () => boolean
  apply: (effect: IndexEffect) => boolean
}>

export function createNavigationRunner(): NavigationRunner {
  let enabled = false
  const pending: NavigationEffect[] = []

  const tryApply = (effect: NavigationEffect): boolean => {
    try {
      if (effect.type === 'serializeAssembly') {
        storeAssemblyAsQuery(effect.assembly)
        return true
      }
      if (effect.type === 'pushState') {
        pushState(effect.url, {})
        return true
      }
      return false
    } catch (error) {
      logger.warn('navigation effect deferred', {
        effectType: effect.type,
        error,
      })
      return false
    }
  }

  const flush = () => {
    if (!enabled || pending.length === 0) {
      return
    }
    const queue = pending.splice(0, pending.length)
    for (const effect of queue) {
      if (!tryApply(effect)) {
        pending.push(effect)
      }
    }
  }

  return {
    enable: () => {
      enabled = true
      flush()
    },
    isEnabled: () => enabled,
    apply: (effect: IndexEffect) => {
      if (effect.type !== 'serializeAssembly' && effect.type !== 'pushState') {
        return false
      }
      if (!enabled) {
        pending.push(effect)
        return true
      }
      if (!tryApply(effect)) {
        pending.push(effect)
      }
      return true
    },
  }
}
