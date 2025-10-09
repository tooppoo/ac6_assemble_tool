import { arms as armsCategory } from './types/base/category'
import { arms as armsClass } from './types/base/classification'
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
import { defineArms } from './types/frame/types'

export const arms = [
  defineArms({
    id: 'AR001',

    name: 'AA-J-123 BASHO',
    classification: armsClass,
    category: armsCategory,
    manufacture: baws,
    price: 81000,

    ap: 2430,

    anti_kinetic_defense: 208,
    anti_energy_defense: 191,
    anti_explosive_defense: 225,

    arms_load_limit: 10520,
    recoil_control: 66,
    firearm_specialization: 53,
    melee_specialization: 158,

    weight: 10480,
    en_load: 210,
  }),
  defineArms({
    id: 'AR002',

    name: 'AA-J-123/RC JAILBREAK',
    classification: armsClass,
    category: armsCategory,
    manufacture: baws,
    price: 0,

    ap: 1000,

    anti_kinetic_defense: 180,
    anti_energy_defense: 190,
    anti_explosive_defense: 215,

    arms_load_limit: 10520,
    recoil_control: 45,
    firearm_specialization: 45,
    melee_specialization: 112,

    weight: 8480,
    en_load: 210,
  }),
  defineArms({
    id: 'AR003',

    name: 'AR-011 MELANDER',
    classification: armsClass,
    category: armsCategory,
    manufacture: balam,
    price: 95000,

    ap: 2260,

    anti_kinetic_defense: 247,
    anti_energy_defense: 217,
    anti_explosive_defense: 234,

    arms_load_limit: 15100,
    recoil_control: 128,
    firearm_specialization: 100,
    melee_specialization: 108,

    weight: 13650,
    en_load: 265,
  }),
  defineArms({
    id: 'AR004',

    name: 'AR-012 MELANDER C3',
    classification: armsClass,
    category: armsCategory,
    manufacture: balam,
    price: 0,

    ap: 2010,

    anti_kinetic_defense: 239,
    anti_energy_defense: 212,
    anti_explosive_defense: 233,

    arms_load_limit: 12000,
    recoil_control: 102,
    firearm_specialization: 135,
    melee_specialization: 102,

    weight: 12000,
    en_load: 232,
  }),
  defineArms({
    id: 'AR005',

    name: 'DF-AR-08 TIAN-QIANG',
    classification: armsClass,
    category: armsCategory,
    manufacture: dafeng,
    price: 200000,

    ap: 2480,

    anti_kinetic_defense: 260,
    anti_energy_defense: 250,
    anti_explosive_defense: 251,

    arms_load_limit: 19500,
    recoil_control: 155,
    firearm_specialization: 92,
    melee_specialization: 94,

    weight: 20020,
    en_load: 295,
  }),
  defineArms({
    id: 'AR006',

    name: 'DF-AR-09 TIAN-LAO',
    classification: armsClass,
    category: armsCategory,
    manufacture: dafeng,
    price: 310000,

    ap: 3070,

    anti_kinetic_defense: 305,
    anti_energy_defense: 251,
    anti_explosive_defense: 277,

    arms_load_limit: 17200,
    recoil_control: 145,
    firearm_specialization: 95,
    melee_specialization: 68,

    weight: 26740,
    en_load: 266,
  }),
  defineArms({
    id: 'AR007',

    name: 'VP-46S',
    classification: armsClass,
    category: armsCategory,
    manufacture: arquebus,
    price: 177000,

    ap: 2240,

    anti_kinetic_defense: 231,
    anti_energy_defense: 252,
    anti_explosive_defense: 218,

    arms_load_limit: 14520,
    recoil_control: 116,
    firearm_specialization: 102,
    melee_specialization: 116,

    weight: 14020,
    en_load: 278,
  }),
  defineArms({
    id: 'AR008',

    name: 'VP-46D',
    classification: armsClass,
    category: armsCategory,
    manufacture: arquebus,
    price: 258000,

    ap: 1620,

    anti_kinetic_defense: 196,
    anti_energy_defense: 230,
    anti_explosive_defense: 190,

    arms_load_limit: 11800,
    recoil_control: 105,
    firearm_specialization: 133,
    melee_specialization: 117,

    weight: 10990,
    en_load: 248,
  }),
  defineArms({
    id: 'AR009',

    name: 'NACHTREIHER/46E',
    classification: armsClass,
    category: armsCategory,
    manufacture: schneider,
    price: 138000,

    ap: 1860,

    anti_kinetic_defense: 204,
    anti_energy_defense: 213,
    anti_explosive_defense: 195,

    arms_load_limit: 12730,
    recoil_control: 87,
    firearm_specialization: 160,
    melee_specialization: 95,

    weight: 11420,
    en_load: 290,
  }),
  defineArms({
    id: 'AR010',

    name: 'LAMMERGEIER/46F',
    classification: armsClass,
    category: armsCategory,
    manufacture: schneider,
    price: 195000,

    ap: 1590,

    anti_kinetic_defense: 189,
    anti_energy_defense: 246,
    anti_explosive_defense: 180,

    arms_load_limit: 11970,
    recoil_control: 134,
    firearm_specialization: 87,
    melee_specialization: 115,

    weight: 9700,
    en_load: 328,
  }),
  defineArms({
    id: 'AR011',

    name: 'VE-46A',
    classification: armsClass,
    category: armsCategory,
    manufacture: arquebus_add,
    price: 286000,

    ap: 2860,

    anti_kinetic_defense: 262,
    anti_energy_defense: 270,
    anti_explosive_defense: 257,

    arms_load_limit: 21300,
    recoil_control: 170,
    firearm_specialization: 80,
    melee_specialization: 98,

    weight: 22210,
    en_load: 380,
  }),
  defineArms({
    id: 'AR012',

    name: 'AC-2000 TOOL ARM',
    classification: armsClass,
    category: armsCategory,
    manufacture: rad,
    price: 0,

    ap: 1990,

    anti_kinetic_defense: 207,
    anti_energy_defense: 204,
    anti_explosive_defense: 209,

    arms_load_limit: 13300,
    recoil_control: 110,
    firearm_specialization: 96,
    melee_specialization: 100,

    weight: 11300,
    en_load: 216,
  }),
  defineArms({
    id: 'AR013',

    name: 'AC-3000 WRECKER',
    classification: armsClass,
    category: armsCategory,
    manufacture: rad,
    price: 79000,

    ap: 2030,

    anti_kinetic_defense: 232,
    anti_energy_defense: 170,
    anti_explosive_defense: 237,

    arms_load_limit: 15800,
    recoil_control: 232,
    firearm_specialization: 26,
    melee_specialization: 43,

    weight: 14150,
    en_load: 220,
  }),
  defineArms({
    id: 'AR014',

    name: 'AS-5000 SALAD',
    classification: armsClass,
    category: armsCategory,
    manufacture: rad,
    price: 249000,

    ap: 2600,

    anti_kinetic_defense: 258,
    anti_energy_defense: 271,
    anti_explosive_defense: 255,

    arms_load_limit: 18700,
    recoil_control: 140,
    firearm_specialization: 88,
    melee_specialization: 109,

    weight: 20940,
    en_load: 324,
  }),
  defineArms({
    id: 'AR015',

    name: 'EL-TA-10 FIRMEZA',
    classification: armsClass,
    category: armsCategory,
    manufacture: elcano,
    price: 227000,

    ap: 1900,

    anti_kinetic_defense: 210,
    anti_energy_defense: 214,
    anti_explosive_defense: 187,

    arms_load_limit: 13540,
    recoil_control: 111,
    firearm_specialization: 122,
    melee_specialization: 110,

    weight: 11220,
    en_load: 270,
  }),
  defineArms({
    id: 'AR016',

    name: 'EL-PA-00 ALBA',
    classification: armsClass,
    category: armsCategory,
    manufacture: elcano,
    price: 266000,

    ap: 1750,

    anti_kinetic_defense: 205,
    anti_energy_defense: 205,
    anti_explosive_defense: 205,

    arms_load_limit: 11350,
    recoil_control: 101,
    firearm_specialization: 140,
    melee_specialization: 85,

    weight: 9810,
    en_load: 315,
  }),
  defineArms({
    id: 'AR017',

    name: '04-101 MIND ALPHA',
    classification: armsClass,
    category: armsCategory,
    manufacture: allmind,
    price: 272000,

    ap: 2300,

    anti_kinetic_defense: 245,
    anti_energy_defense: 260,
    anti_explosive_defense: 246,

    arms_load_limit: 15550,
    recoil_control: 142,
    firearm_specialization: 103,
    melee_specialization: 79,

    weight: 16960,
    en_load: 358,
  }),
  defineArms({
    id: 'AR018',

    name: 'IA-C01A: EPHEMERA',
    classification: armsClass,
    category: armsCategory,
    manufacture: rubicon_research_institute,
    price: 296000,

    ap: 2380,

    anti_kinetic_defense: 219,
    anti_energy_defense: 263,
    anti_explosive_defense: 256,

    arms_load_limit: 12680,
    recoil_control: 108,
    firearm_specialization: 104,
    melee_specialization: 106,

    weight: 12700,
    en_load: 312,
  }),
  defineArms({
    id: 'AR019',

    name: 'IB-C03A: HAL 826',
    classification: armsClass,
    category: armsCategory,
    manufacture: rubicon_research_institute,
    price: 322000,

    ap: 2210,

    anti_kinetic_defense: 225,
    anti_energy_defense: 248,
    anti_explosive_defense: 236,

    arms_load_limit: 14000,
    recoil_control: 125,
    firearm_specialization: 123,
    melee_specialization: 104,

    weight: 14160,
    en_load: 300,
  }),
] as const
export type Arms = (typeof arms)[number]
