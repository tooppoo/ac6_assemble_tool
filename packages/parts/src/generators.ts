import { generator as generatorCategory } from './types/base/category'
import { generator as generatorClass } from './types/base/classification'
import {
  arquebus,
  arquebus_add,
  baws,
  dafeng,
  rubicon_research_institute,
} from './types/base/manufacture'
import { defineGenerator } from './types/inner/generator'

export const generators = [
  defineGenerator({
    id: 'GN001',

    name: 'AG-J-098 JOSO',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: baws,
    price: 0,

    en_capacity: 2300,
    en_recharge: 769,
    supply_recovery: 500,
    post_recovery_en_supply: 400,
    energy_firearm_spec: 72,

    weight: 3420,
    en_output: 2600,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN002',

    name: 'AG-E-013 YABA',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: baws,
    price: 240000,

    en_capacity: 2850,
    en_recharge: 1000,
    supply_recovery: 555,
    post_recovery_en_supply: 1000,
    energy_firearm_spec: 95,

    weight: 5080,
    en_output: 3000,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN003',

    name: 'AG-T-005 HOKUSHI',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: baws,
    price: 312000,

    en_capacity: 3160,
    en_recharge: 952,
    supply_recovery: 370,
    post_recovery_en_supply: 850,
    energy_firearm_spec: 90,

    weight: 7080,
    en_output: 3810,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN004',

    name: 'DF-GN-02 LING-TAI',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: dafeng,
    price: 90000,

    en_capacity: 2000,
    en_recharge: 2000,
    supply_recovery: 833,
    post_recovery_en_supply: 280,
    energy_firearm_spec: 61,

    weight: 3860,
    en_output: 2340,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN005',

    name: 'DF-GN-06 MING-TANG',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: dafeng,
    price: 170000,

    en_capacity: 2900,
    en_recharge: 1250,
    supply_recovery: 666,
    post_recovery_en_supply: 440,
    energy_firearm_spec: 76,

    weight: 6320,
    en_output: 3160,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN006',

    name: 'DF-GN-08 SAN-TAI',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: dafeng,
    price: 300000,

    en_capacity: 4420,
    en_recharge: 1176,
    supply_recovery: 625,
    post_recovery_en_supply: 810,
    energy_firearm_spec: 88,

    weight: 10060,
    en_output: 3210,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN007',

    name: 'VP-20S',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: arquebus,
    price: 126000,

    en_capacity: 2500,
    en_recharge: 833,
    supply_recovery: 434,
    post_recovery_en_supply: 1200,
    energy_firearm_spec: 94,

    weight: 3800,
    en_output: 3200,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN008',

    name: 'VP-20C',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: arquebus,
    price: 229000,

    en_capacity: 2720,
    en_recharge: 909,
    supply_recovery: 454,
    post_recovery_en_supply: 1100,
    energy_firearm_spec: 100,

    weight: 5320,
    en_output: 3670,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN009',

    name: 'VP-20D',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: arquebus,
    price: 416000,

    en_capacity: 3590,
    en_recharge: 714,
    supply_recovery: 384,
    post_recovery_en_supply: 1400,
    energy_firearm_spec: 104,

    weight: 11030,
    en_output: 4430,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN010',

    name: 'VE-20A',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: arquebus_add,
    price: 206000,

    en_capacity: 2460,
    en_recharge: 740,
    supply_recovery: 416,
    post_recovery_en_supply: 600,
    energy_firearm_spec: 116,

    weight: 3590,
    en_output: 3120,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN011',

    name: 'VE-20B',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: arquebus_add,
    price: 324000,

    en_capacity: 3300,
    en_recharge: 763,
    supply_recovery: 392,
    post_recovery_en_supply: 800,
    energy_firearm_spec: 150,

    weight: 5860,
    en_output: 2890,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN012',

    name: 'VE-20C',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: arquebus_add,
    price: 405000,

    en_capacity: 3690,
    en_recharge: 555,
    supply_recovery: 377,
    post_recovery_en_supply: 720,
    energy_firearm_spec: 128,

    weight: 10130,
    en_output: 4090,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN013',

    name: 'IA-C01G: AORTA',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: rubicon_research_institute,
    price: 460000,

    en_capacity: 3000,
    en_recharge: 238,
    supply_recovery: 333,
    post_recovery_en_supply: 2000,
    energy_firearm_spec: 105,

    weight: 4330,
    en_output: 3500,
    en_load: 0,
  }),
  defineGenerator({
    id: 'GN014',

    name: 'IB-C03G: NGI 000',
    classification: generatorClass,
    category: generatorCategory,
    manufacture: rubicon_research_institute,
    price: 510000,

    en_capacity: 4400,
    en_recharge: 250,
    supply_recovery: 312,
    post_recovery_en_supply: 3300,
    energy_firearm_spec: 110,

    weight: 8950,
    en_output: 4340,
    en_load: 0,
  }),
] as const
export type Generator = (typeof generators)[number]
