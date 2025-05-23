import {
  defineCandidates,
  type Candidates,
  type Order,
} from '#parts/types/candidates'
import { apply, patches } from '#parts/versions/patches'

import { definition as v1_08_01, orders as order_v1_08_01 } from './v1.08.1'

export const version = 'v1.09.1' as const
export type VERSION = typeof version

// https://www.armoredcore.net/article/250523_1.html
const armUnitsPatches = [
  patches.armUnits.update('MG-014 LUDLOW', () => ({
    recoil: 3,
    weight: 2350,
    // 弾速(mask)
  })),
  patches.armUnits.update('MA-E-210 ETSUJIN', () => ({
    attack_power: 45 * 4,
    direct_hit_adjustment: 20 * 4,
  })),
  patches.armUnits.update('44-141 JVLN ALPHA', () => ({
    reload_time: 4.1,
    // 弾速(mask)
  })),
  patches.armUnits.update('DIZZY', () => ({
    reload_time: 5.6,
  })),
  patches.armUnits.update('VE-66LRA', () => ({
    heat_buildup: 190,
  })),
  patches.armUnits.update('IB-C03W1: WLT 011', () => ({
    cooling: 190,
    // 弾速(mask)
    // カタログスペック上の攻撃力・衝撃力・衝撃残留は変化なし
  })),
  patches.armUnits.update('WS-5000 APERITIF', () => ({
    reload_time: 6.0,
  })),
]

export const definition = apply(v1_08_01, [...armUnitsPatches])

export const candidates: Candidates = defineCandidates(definition)
export const orders: Order = order_v1_08_01
