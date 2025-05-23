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
const backUnitsPatches = [
  patches.onlyLeftBackUnits.update('VP-61PS', () => ({
    ig_damage_mitigation: 72,
  })),
  patches.onlyLeftBackUnits.update('SI-27: SU-R8', () => ({
    ig_duration: 0.3,
    en_load: 258,
  })),
  patches.backUnits.update('VE-60SNA', () => ({
    attack_power: 1398,
    // 弾速(mask)
  })),
  patches.backUnits.update('VE-60LCB', () => ({
    rapid_fire: 0.4,
  })),
  patches.backUnits.update('BML-G1/P20MLT-04', () => ({
    reload_time: 3.8,
    weight: 1770,
  })),
  patches.backUnits.update('BML-G2/P03MLT-06', () => ({
    reload_time: 4.0,
  })),
  patches.backUnits.update('BML-G1/P31DUO-02', () => ({
    reload_time: 3.1,
  })),
  patches.backUnits.update('Vvc-703PM', () => ({
    reload_time: 4.2,
  })),
]
const headUpdatePatches = [
  patches.head.update('NACHTREIHER/44E', () => ({
    weight: 2120,
  })),
  patches.head.update('EL-TH-10 FIRMEZA', () => ({
    ap: 750,
    attitude_stability: 431,
  })),
  patches.head.update('EL-PH-00 ALBA', () => ({
    attitude_stability: 485,
  })),
]
const legsUpdatePatches = [
  patches.legs.update('2C-3000 WRECKER', () => ({
    anti_kinetic_defense: 371,
    anti_energy_defense: 337,
    anti_explosive_defense: 393,
  })),
  patches.legs.update('IA-C01L: EPHEMERA', () => ({
    jump_distance: 164,
    weight: 14560,
  })),
  patches.legs.update('IB-C03L: HAL 826', () => ({
    ap: 4320,
    weight: 20190,
    en_load: 345,
  })),
  patches.legs.update('RC-2000 SPRING CHICKEN', () => ({
    attitude_stability: 841,
    load_limit: 73360,
  })),
  patches.legs.update('LG-033M VERRILL', () => ({
    ap: 5650,
    anti_energy_defense: 372,
    anti_explosive_defense: 396,
    // ホバリング速度(mask)
  })),
  patches.legs.update('LAMMERGEIER/42F', () => ({
    anti_kinetic_defense: 285,
    anti_energy_defense: 340,
    anti_explosive_defense: 280,
  })),
  patches.legs.update('EL-TL-11 FORTALEZA', () => ({
    attitude_stability: 842,
    qb_en_consumption: 680,
    ab_thrust: 9001,
    weight: 23650,
  })),
]

export const definition = apply(v1_08_01, [
  ...armUnitsPatches,
  ...backUnitsPatches,
  ...headUpdatePatches,
  ...legsUpdatePatches,
])

export const candidates: Candidates = defineCandidates(definition)
export const orders: Order = order_v1_08_01
