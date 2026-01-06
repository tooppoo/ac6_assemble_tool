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

    ai_summary: 'BAWS社製の中量級腕部パーツ。近接特化158と高い近接適性。反動制御66、腕部積載10520と標準的。重量10480とバランス良く、EN負荷210と軽め。',
    ai_tags: ['腕部', '近接特化', '中量級', 'バランス型', '低EN負荷', 'BAWS'],
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

    ai_summary: 'BAWS社製の軽量型腕部パーツ。AP1000と低耐久、近接特化112。反動制御45、射撃適性45と低め。重量8480と軽量で、EN負荷210と低い。',
    ai_tags: ['腕部', '軽量級', '低AP', '低性能', '低EN負荷', 'BAWS'],
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

    ai_summary: 'ベイラム社製の重量級腕部パーツ。腕部積載15100、反動制御128と高い。射撃適性100、近接特化108とバランス型。重量13650、EN負荷265と標準的。',
    ai_tags: ['腕部', '重量級', '高積載', '高反動制御', 'バランス型', 'ベイラム'],
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

    ai_summary: 'ベイラム社製の射撃特化型腕部パーツ。射撃適性135と高く、反動制御102。腕部積載12000、重量12000と軽量化。EN負荷232と低め。',
    ai_tags: ['腕部', '射撃特化', '中量級', '高射撃適性', '低EN負荷', 'ベイラム'],
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

    ai_summary: '大豊社製の超重量級腕部パーツ。腕部積載19500と最高クラス、反動制御155と高い。高い防御力とバランスの取れた適性。重量20020と超重量級。',
    ai_tags: ['腕部', '超重量級', '最高積載', '高反動制御', '高防御', '大豊'],
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

    ai_summary: '大豊社製の最重量級腕部パーツ。AP3070と最高クラス、対運動防御305と極めて高い。反動制御145、腕部積載17200。重量26740と最重量級。',
    ai_tags: ['腕部', '最重量級', '最高AP', '最高対運動防御', '高反動制御', '大豊'],
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

    ai_summary: 'アーキバス社製の中量級腕部パーツ。対エネルギー防御252と高く、バランスの取れた適性。反動制御116、腕部積載14520。重量14020、EN負荷278。',
    ai_tags: ['腕部', '中量級', '対エネルギー特化', 'バランス型', '標準性能', 'アーキバス'],
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

    ai_summary: 'アーキバス社製の射撃特化型腕部パーツ。射撃適性133と高く、反動制御105。AP1620と低め。重量10990と軽量、EN負荷248と低め。',
    ai_tags: ['腕部', '射撃特化', '軽量級', '高射撃適性', '低AP', 'アーキバス'],
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

    ai_summary: 'シュナイダー社製の射撃特化型腕部パーツ。射撃適性160と極めて高く、反動制御87。腕部積載12730。重量11420、EN負荷290と標準的。',
    ai_tags: ['腕部', '射撃特化', '中量級', '最高射撃適性', '標準性能', 'シュナイダー'],
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

    ai_summary: 'シュナイダー社製の軽量型腕部パーツ。反動制御134と高く、対エネルギー防御246。重量9700と軽量だが、EN負荷328と高め。AP1590と低耐久。',
    ai_tags: ['腕部', '軽量級', '高反動制御', '対エネルギー特化', '高EN負荷', 'シュナイダー'],
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

    ai_summary: 'アーキバス先進開発局の超重量級腕部パーツ。腕部積載21300と最高クラス、反動制御170と極めて高い。AP2860、高い防御力。重量22210、EN負荷380と高め。',
    ai_tags: ['腕部', '超重量級', '最高積載', '最高反動制御', '高防御', 'アーキバス先進開発局'],
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

    ai_summary: 'RaD製の汎用型腕部パーツ。バランスの取れた性能、反動制御110、腕部積載13300。重量11300、EN負荷216と軽め。価格0の初期装備。',
    ai_tags: ['腕部', '中量級', 'バランス型', '汎用', '低EN負荷', 'RAD'],
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

    ai_summary: 'RaD製の反動制御特化型腕部パーツ。反動制御232と最高クラス。射撃適性26、近接特化43と低め。腕部積載15800。重量14150、EN負荷220と低め。',
    ai_tags: ['腕部', '反動制御特化', '中量級', '最高反動制御', '低適性', 'RAD'],
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

    ai_summary: 'RaD製の超重量級腕部パーツ。AP2600、高い防御力、腕部積載18700。反動制御140、バランスの取れた適性。重量20940、EN負荷324。',
    ai_tags: ['腕部', '超重量級', '高AP', '高防御', '高積載', 'RAD'],
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

    ai_summary: 'エルカノ社製の射撃特化型腕部パーツ。射撃適性122と高く、反動制御111。腕部積載13540、バランスの取れた性能。重量11220と軽量、EN負荷270。',
    ai_tags: ['腕部', '射撃特化', '軽量級', '高射撃適性', 'バランス型', 'エルカノ'],
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

    ai_summary: 'エルカノ社製の射撃特化型軽量腕部パーツ。射撃適性140と極めて高く、全防御205と均等。重量9810と最軽量級、EN負荷315。AP1750と低耐久。',
    ai_tags: ['腕部', '射撃特化', '最軽量級', '最高射撃適性', '均等防御', 'エルカノ'],
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

    ai_summary: 'オールマインド社製の重量級腕部パーツ。反動制御142、腕部積載15550。対エネルギー防御260と高く、バランスの取れた性能。重量16960、EN負荷358。',
    ai_tags: ['腕部', '重量級', '高反動制御', '対エネルギー特化', 'バランス型', 'オールマインド'],
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

    ai_summary: '技研製の中量級腕部パーツ。対エネルギー防御263と高く、バランスの取れた適性。反動制御108、腕部積載12680。重量12700、EN負荷312。',
    ai_tags: ['腕部', '中量級', '対エネルギー特化', 'バランス型', '標準性能', '技研'],
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

    ai_summary: '技研製の中量級腕部パーツ。射撃適性123と高く、反動制御125。腕部積載14000、対エネルギー防御248。重量14160、EN負荷300と標準的。',
    ai_tags: ['腕部', '射撃特化', '中量級', '高射撃適性', '対エネルギー特化', '技研'],
  }),
] as const
export type Arms = (typeof arms)[number]
