import { core as coreCategory } from './types/base/category'
import { core as coreClass } from './types/base/classification'
import {
  allmind,
  arquebus,
  arquebus_add,
  balam,
  baws,
  dafeng,
  elcano,
  rad,
  rubicon_research_institute,
  schneider,
} from './types/base/manufacture'
import { defineCore } from './types/frame/types'

export const cores = [
  defineCore({
    id: 'CR001',

    name: 'AC-J-120 BASHO',
    classification: coreClass,
    category: coreCategory,
    manufacture: baws,
    price: 166000,

    ap: 3580,

    anti_kinetic_defense: 435,
    anti_energy_defense: 398,
    anti_explosive_defense: 460,

    attitude_stability: 476,
    booster_efficiency_adjective: 119,
    generator_output_adjective: 83,
    generator_supply_adjective: 94,

    weight: 16100,
    en_load: 300,
  }),
  defineCore({
    id: 'CR002',

    name: 'AC-J-120/RC JAILBREAK',
    classification: coreClass,
    category: coreCategory,
    manufacture: baws,
    price: 0,

    ap: 2400,

    anti_kinetic_defense: 405,
    anti_energy_defense: 368,
    anti_explosive_defense: 420,

    attitude_stability: 403,
    booster_efficiency_adjective: 119,
    generator_output_adjective: 83,
    generator_supply_adjective: 94,

    weight: 12350,
    en_load: 300,
  }),
  defineCore({
    id: 'CR003',

    name: 'BD-011 MELANDER',
    classification: coreClass,
    category: coreCategory,
    manufacture: balam,
    price: 195000,

    ap: 3230,

    anti_kinetic_defense: 438,
    anti_energy_defense: 380,
    anti_explosive_defense: 429,

    attitude_stability: 458,
    booster_efficiency_adjective: 98,
    // ゲーム上は105だが、計算上105だとどうしても一致しない
    // 実際は小数点以下が設定されていて、表示上切り上げられている？
    generator_output_adjective: 104.99,
    generator_supply_adjective: 97,

    weight: 15800,
    en_load: 304,
  }),
  defineCore({
    id: 'CR004',

    name: 'BD-012 MELANDER C3',
    classification: coreClass,
    category: coreCategory,
    manufacture: balam,
    price: 0,

    ap: 2830,

    anti_kinetic_defense: 425,
    anti_energy_defense: 377,
    anti_explosive_defense: 428,

    attitude_stability: 433,
    booster_efficiency_adjective: 103,
    generator_output_adjective: 102,
    generator_supply_adjective: 103,

    weight: 14050,
    en_load: 322,
  }),
  defineCore({
    id: 'CR005',

    name: 'DF-BD-08 TIAN-QIANG',
    classification: coreClass,
    category: coreCategory,
    manufacture: dafeng,
    price: 390000,

    ap: 4100,

    anti_kinetic_defense: 473,
    anti_energy_defense: 438,
    anti_explosive_defense: 478,

    attitude_stability: 629,
    booster_efficiency_adjective: 76,
    generator_output_adjective: 114,
    generator_supply_adjective: 90,

    weight: 20650,
    en_load: 388,
  }),
  defineCore({
    id: 'CR006',

    name: 'VP-40S',
    classification: coreClass,
    category: coreCategory,
    manufacture: arquebus,
    price: 354000,

    ap: 3160,

    anti_kinetic_defense: 427,
    anti_energy_defense: 436,
    anti_explosive_defense: 389,

    attitude_stability: 446,
    booster_efficiency_adjective: 102,
    generator_output_adjective: 106,
    generator_supply_adjective: 102,

    weight: 15030,
    en_load: 337,
  }),
  defineCore({
    id: 'CR007',

    name: 'NACHTREIHER/40E',
    classification: coreClass,
    category: coreCategory,
    manufacture: schneider,
    price: 275000,

    ap: 2630,

    anti_kinetic_defense: 349,
    anti_energy_defense: 359,
    anti_explosive_defense: 331,

    attitude_stability: 366,
    booster_efficiency_adjective: 126,
    generator_output_adjective: 91,
    generator_supply_adjective: 109,

    weight: 9820,
    en_load: 330,
  }),
  defineCore({
    id: 'CR008',

    name: 'LAMMERGEIER/40F',
    classification: coreClass,
    category: coreCategory,
    manufacture: schneider,
    price: 395000,

    ap: 2470,

    anti_kinetic_defense: 330,
    anti_energy_defense: 390,
    anti_explosive_defense: 337,

    attitude_stability: 354,
    booster_efficiency_adjective: 87,
    generator_output_adjective: 117,
    generator_supply_adjective: 110,

    weight: 9700,
    en_load: 341,
  }),
  defineCore({
    id: 'CR009',

    name: 'VE-40A',
    classification: coreClass,
    category: coreCategory,
    manufacture: arquebus_add,
    price: 570000,

    ap: 4320,

    anti_kinetic_defense: 447,
    anti_energy_defense: 495,
    anti_explosive_defense: 458,

    attitude_stability: 521,
    booster_efficiency_adjective: 81,
    generator_output_adjective: 122,
    generator_supply_adjective: 95,

    weight: 21100,
    en_load: 432,
  }),
  defineCore({
    id: 'CR010',

    name: 'CC-2000 ORBITER',
    classification: coreClass,
    category: coreCategory,
    manufacture: rad,
    price: 0,

    ap: 2780,

    anti_kinetic_defense: 393,
    anti_energy_defense: 366,
    anti_explosive_defense: 374,

    attitude_stability: 407,
    booster_efficiency_adjective: 100,
    generator_output_adjective: 103,
    generator_supply_adjective: 93,

    weight: 12650,
    en_load: 267,
  }),
  defineCore({
    id: 'CR011',

    name: 'CC-3000 WRECKER',
    classification: coreClass,
    category: coreCategory,
    manufacture: rad,
    price: 158000,

    ap: 3940,

    anti_kinetic_defense: 468,
    anti_energy_defense: 434,
    anti_explosive_defense: 461,

    attitude_stability: 532,
    booster_efficiency_adjective: 80,
    generator_output_adjective: 96,
    generator_supply_adjective: 100,

    weight: 19000,
    en_load: 310,
  }),
  defineCore({
    id: 'CR012',

    name: 'CS-5000 MAIN DISH',
    classification: coreClass,
    category: coreCategory,
    manufacture: rad,
    price: 519000,

    ap: 3890,

    anti_kinetic_defense: 476,
    anti_energy_defense: 489,
    anti_explosive_defense: 469,

    attitude_stability: 641,
    booster_efficiency_adjective: 79,
    generator_output_adjective: 97,
    generator_supply_adjective: 112,

    weight: 23600,
    en_load: 413,
  }),
  defineCore({
    id: 'CR013',

    name: 'EL-TC-10 FIRMEZA',
    classification: coreClass,
    category: coreCategory,
    manufacture: elcano,
    price: 452000,

    ap: 2500,

    anti_kinetic_defense: 384,
    anti_energy_defense: 360,
    anti_explosive_defense: 375,

    attitude_stability: 410,
    booster_efficiency_adjective: 111,
    generator_output_adjective: 104,
    generator_supply_adjective: 89,

    weight: 10890,
    en_load: 351,
  }),
  defineCore({
    id: 'CR014',

    name: 'EL-PC-00 ALBA',
    classification: coreClass,
    category: coreCategory,
    manufacture: elcano,
    price: 531000,

    ap: 2850,

    anti_kinetic_defense: 370,
    anti_energy_defense: 370,
    anti_explosive_defense: 370,

    attitude_stability: 368,
    booster_efficiency_adjective: 115,
    generator_output_adjective: 101,
    generator_supply_adjective: 105,

    weight: 12000,
    en_load: 315,
  }),
  defineCore({
    id: 'CR015',

    name: '07-061 MIND ALPHA',
    classification: coreClass,
    category: coreCategory,
    manufacture: allmind,
    price: 553000,

    ap: 3520,

    anti_kinetic_defense: 440,
    anti_energy_defense: 455,
    anti_explosive_defense: 445,

    attitude_stability: 455,
    booster_efficiency_adjective: 95,
    generator_output_adjective: 112,
    generator_supply_adjective: 104,

    weight: 16510,
    en_load: 364,
  }),
  defineCore({
    id: 'CR016',

    name: 'IA-C01C: EPHEMERA',
    classification: coreClass,
    category: coreCategory,
    manufacture: rubicon_research_institute,
    price: 590000,

    ap: 2710,

    anti_kinetic_defense: 335,
    anti_energy_defense: 382,
    anti_explosive_defense: 350,

    attitude_stability: 353,
    booster_efficiency_adjective: 101,
    generator_output_adjective: 126,
    generator_supply_adjective: 96,

    weight: 13200,
    en_load: 412,
  }),
  defineCore({
    id: 'CR017',

    name: 'IB-C03C: HAL 826',
    classification: coreClass,
    category: coreCategory,
    manufacture: rubicon_research_institute,
    price: 663000,

    ap: 3670,

    anti_kinetic_defense: 451,
    anti_energy_defense: 469,
    anti_explosive_defense: 463,

    attitude_stability: 385,
    booster_efficiency_adjective: 96,
    generator_output_adjective: 120,
    generator_supply_adjective: 108,

    weight: 18520,
    en_load: 366,
  }),
] as const
export type Core = (typeof cores)[number]
