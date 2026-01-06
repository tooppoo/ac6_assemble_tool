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

    ai_summary: 'BAWS製コア。AP3580、実弾防御435、爆発防御460と高め。姿勢安定476、ブースター効率119と高い。ジェネレータ出力83と低め。バランス型。',
    ai_tags: ['コア', 'ブースター効率特化', '高防御', 'BAWS', '中量級'],
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

    ai_summary: 'BAWS製コア。AP2400と低め、重量12350と軽量。姿勢安定403、ブースター効率119と高い。ジェネレータ出力83と低め。価格0の初期装備。軽量高機動型。',
    ai_tags: ['コア', '初期装備', 'ブースター効率特化', 'BAWS', '軽量級'],
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

    ai_summary: 'ベイラム製コア。AP3230、実弾防御438と高め。姿勢安定458、ジェネレータ出力105、供給97。EN負荷304と低め。バランス型。',
    ai_tags: ['コア', 'バランス型', '高実弾防御', 'ベイラム', '中量級'],
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

    ai_summary: 'ベイラム製コア。AP2830、重量14050と軽量。姿勢安定433、ブースター効率103、ジェネレータ出力102、供給103と全て標準的。価格0の初期装備。',
    ai_tags: ['コア', '初期装備', 'バランス型', 'ベイラム', '軽量級'],
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

    ai_summary: '大豊製コア。AP4100と極めて高く、実弾防御473、EN防御438、爆発防御478と最高クラス。姿勢安定629と極めて高い。重量級向け。重装甲タンク型。',
    ai_tags: ['コア', '最高AP', '最高防御', '超重量級', '大豊'],
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

    ai_summary: 'アーキバス製コア。AP3160、EN防御436と高くEN武器に強い。姿勢安定446、ブースター効率102、ジェネレータ出力106、供給102。バランス型。',
    ai_tags: ['コア', 'バランス型', '高EN防御', 'アーキバス', '中量級'],
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

    ai_summary: 'シュナイダー製コア。AP2630、防御力は低め。重量9820と最軽量級。ブースター効率126と極めて高く、EN供給109も高い。超軽量高機動型。',
    ai_tags: ['コア', '最軽量級', '最高ブースター効率', 'シュナイダー', '高機動'],
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

    ai_summary: 'シュナイダー製コア。AP2470と最低レベル、重量9700と最軽量。ジェネレータ出力117、供給110と極めて高い。EN出力特化の超軽量型。',
    ai_tags: ['コア', '最軽量級', '最高ジェネレータ出力', 'シュナイダー', 'EN特化'],
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

    ai_summary: 'アーキバス先進開発局製コア。AP4320と最高クラス、EN防御495と極めて高い。姿勢安定521、ジェネレータ出力122と最高クラス。超重量級高性能型。',
    ai_tags: ['コア', '最高AP', '最高EN防御', '超重量級', 'アーキバス先進開発局'],
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

    ai_summary: 'RaD製コア。AP2780、重量12650と軽量。ブースター効率100、ジェネレータ出力103、供給93と標準的。EN負荷267と最低クラス。価格0の初期装備。',
    ai_tags: ['コア', '初期装備', '最低EN負荷', 'RaD', '軽量級'],
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

    ai_summary: 'RaD製コア。AP3940と高く、実弾防御468、爆発防御461と高い。姿勢安定532と高い。重量19000と重め。EN負荷310と低め。重量級向けバランス型。',
    ai_tags: ['コア', '高AP', '高防御', 'RaD', '重量級'],
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

    ai_summary: 'RaD製コア。AP3890、EN防御489と極めて高い。姿勢安定641と最高クラス。EN供給112と高い。重量23600と最重量級。超重量級EN防御特化型。',
    ai_tags: ['コア', '最高姿勢安定', '最高EN防御', '超重量級', 'RaD'],
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

    ai_summary: 'エルカノ製コア。AP2500、防御力は低め。重量10890と軽量。ブースター効率111、ジェネレータ出力104と高め。軽量高機動型。',
    ai_tags: ['コア', '軽量級', 'ブースター効率特化', 'エルカノ', '高機動'],
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

    ai_summary: 'エルカノ製コア。AP2850、三属性防御が全て370と完全にバランス。重量12000と軽量。ブースター効率115、EN供給105と高い。軽量バランス型。',
    ai_tags: ['コア', '完全バランス防御', 'ブースター効率特化', 'エルカノ', '軽量級'],
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

    ai_summary: 'オールマインド製コア。AP3520、EN防御455と高くバランス良い防御力。姿勢安定455、ジェネレータ出力112、供給104と高い。高性能バランス型。',
    ai_tags: ['コア', 'バランス型', '高性能', 'オールマインド', '中量級'],
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

    ai_summary: '技研製コア。AP2710、防御力は低め。重量13200と軽量。ジェネレータ出力126と最高クラス。EN負荷412と高め。EN出力特化の軽量型。',
    ai_tags: ['コア', '最高ジェネレータ出力', 'EN特化', '技研', '軽量級'],
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

    ai_summary: '技研製コア。AP3670、EN防御469と極めて高くバランス良い防御力。ジェネレータ出力120、供給108と極めて高い。高性能EN特化型。',
    ai_tags: ['コア', '高性能', '高EN防御', 'ジェネレータ特化', '技研'],
  }),
] as const
export type Core = (typeof cores)[number]
