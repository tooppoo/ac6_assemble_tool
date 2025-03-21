import {
  defineCandidates,
  type Candidates,
  type Order,
} from '#parts/types/candidates'
import { apply, patches } from '#parts/versions/patches'

import { definition as v1_07_02, orders as order_v1_07_02 } from './v1.07.2'

export const version = 'v1.08.1' as const
export type VERSION = typeof version

export const definition = apply(v1_07_02, [
  // core
  patches.core.update('AC-J-120 BASHO', () => ({
    booster_efficiency_adjective: 121,
  })),

  // legs
  patches.legs.update('NACHTREIHER/42E', () => ({
    ap: 3460,
  })),
  patches.legs.update('VE-42A', () => ({
    ap: 5900,
  })),
])

export const candidates: Candidates = defineCandidates(definition)
export const orders: Order = order_v1_07_02
