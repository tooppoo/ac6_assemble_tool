import { head as headCategory } from '#parts/types/base/category'
import { head as headClass } from '#parts/types/base/classification'
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
} from '#parts/types/base/manufacture'

import { defineHead } from './types/frame/types'

export const heads = [
  defineHead({
    id: 'HD001',

    name: 'AH-J-124 BASHO',
    classification: headClass,
    category: headCategory,
    manufacture: baws,
    price: 61000,

    ap: 1250,

    anti_kinetic_defense: 191,
    anti_energy_defense: 169,
    anti_explosive_defense: 192,

    attitude_stability: 370,
    system_recovery: 84,

    scan_distance: 340,
    scan_effect_duration: 14.4,
    scan_standby_time: 10.8,

    weight: 4600,
    en_load: 95,

    ai_summary:
      'BAWS製ヘッド。AP1250、実弾防御191、爆発防御192と高め。姿勢安定370、システム復元84。スキャン距離340、効果時間14.4秒。バランス型。',
    ai_tags: ['ヘッド', 'バランス型', '高防御', 'BAWS', '中量級'],
  }),
  defineHead({
    id: 'HD002',

    name: 'AH-J-124/RC JAILBREAK',
    classification: headClass,
    category: headCategory,
    manufacture: baws,
    price: 0,

    ap: 1000,

    anti_kinetic_defense: 181,
    anti_energy_defense: 159,
    anti_explosive_defense: 182,

    attitude_stability: 302,
    system_recovery: 60,

    scan_distance: 400,
    scan_effect_duration: 6.0,
    scan_standby_time: 10.8,

    weight: 4250,
    en_load: 95,

    ai_summary:
      'BAWS製ヘッド。AP1000、防御力は標準的。姿勢安定302、システム復元60と低め。スキャン距離400と長め。重量4250とやや軽量。価格0の初期装備。',
    ai_tags: ['ヘッド', '初期装備', 'スキャン距離特化', 'BAWS', '中量級'],
  }),
  defineHead({
    id: 'HD003',

    name: 'HD-011 MELANDER',
    classification: headClass,
    category: headCategory,
    manufacture: balam,
    price: 75000,

    ap: 910,

    anti_kinetic_defense: 173,
    anti_energy_defense: 168,
    anti_explosive_defense: 170,

    attitude_stability: 430,
    system_recovery: 115,

    scan_distance: 310,
    scan_effect_duration: 4.8,
    scan_standby_time: 4.2,

    weight: 3160,
    en_load: 135,

    ai_summary:
      'ベイラム製ヘッド。AP910、防御力はバランス良く標準的。姿勢安定430、システム復元115と高い。スキャン待機時間4.2秒と短い。重量3160と軽量。',
    ai_tags: ['ヘッド', 'システム復元特化', '短待機時間', 'ベイラム', '軽量級'],
  }),
  defineHead({
    id: 'HD004',

    name: 'HD-033M VERRILL',
    classification: headClass,
    category: headCategory,
    manufacture: balam,
    price: 205000,

    ap: 1080,

    anti_kinetic_defense: 188,
    anti_energy_defense: 185,
    anti_explosive_defense: 185,

    attitude_stability: 469,
    system_recovery: 112,

    scan_distance: 510,
    scan_effect_duration: 7.8,
    scan_standby_time: 5.4,

    weight: 3830,
    en_load: 240,

    ai_summary:
      'ベイラム製ヘッド。AP1080、三属性防御が185前後と完全にバランス。姿勢安定469、システム復元112と高い。スキャン距離510と長い。高性能バランス型。',
    ai_tags: [
      'ヘッド',
      '完全バランス防御',
      'スキャン距離特化',
      'ベイラム',
      '中量級',
    ],
  }),
  defineHead({
    id: 'HD005',

    name: 'HD-012 MELANDER C3',
    classification: headClass,
    category: headCategory,
    manufacture: balam,
    price: 0,

    ap: 970,

    anti_kinetic_defense: 175,
    anti_energy_defense: 177,
    anti_explosive_defense: 169,

    attitude_stability: 436,
    system_recovery: 106,

    scan_distance: 580,
    scan_effect_duration: 12.0,
    scan_standby_time: 10.8,

    weight: 3300,
    en_load: 165,

    ai_summary:
      'ベイラム製ヘッド。AP970、防御力は標準的。姿勢安定436、システム復元106。スキャン距離580、効果時間12秒と長い。価格0の初期装備。',
    ai_tags: [
      'ヘッド',
      '初期装備',
      'スキャン効果時間特化',
      'ベイラム',
      '軽量級',
    ],
  }),
  defineHead({
    id: 'HD006',

    name: 'DF-HD-08 TIAN-QIANG',
    classification: headClass,
    category: headCategory,
    manufacture: dafeng,
    price: 58000,

    ap: 320,

    anti_kinetic_defense: 142,
    anti_energy_defense: 140,
    anti_explosive_defense: 184,

    attitude_stability: 207,
    system_recovery: 73,

    scan_distance: 250,
    scan_effect_duration: 7.0,
    scan_standby_time: 11.4,

    weight: 1230,
    en_load: 88,

    ai_summary:
      '大豊製ヘッド。AP320と極めて低く、防御力も低め。重量1230、EN負荷88と最軽量級。爆発防御184と相対的に高め。超軽量特化型。',
    ai_tags: ['ヘッド', '最軽量級', '超軽量特化', '大豊', '低EN負荷'],
  }),
  defineHead({
    id: 'HD007',

    name: 'VP-44S',
    classification: headClass,
    category: headCategory,
    manufacture: arquebus,
    price: 124000,

    ap: 850,

    anti_kinetic_defense: 170,
    anti_energy_defense: 172,
    anti_explosive_defense: 168,

    attitude_stability: 408,
    system_recovery: 117,

    scan_distance: 520,
    scan_effect_duration: 7.2,
    scan_standby_time: 5.1,

    weight: 3080,
    en_load: 148,

    ai_summary:
      'アーキバス製ヘッド。AP850、三属性防御が170前後とバランス良い。姿勢安定408、システム復元117と高い。スキャン距離520と長め。軽量バランス型。',
    ai_tags: [
      'ヘッド',
      'バランス型',
      'スキャン距離特化',
      'アーキバス',
      '軽量級',
    ],
  }),
  defineHead({
    id: 'HD008',

    name: 'VP-44D',
    classification: headClass,
    category: headCategory,
    manufacture: arquebus,
    price: 231000,

    ap: 880,

    anti_kinetic_defense: 150,
    anti_energy_defense: 183,
    anti_explosive_defense: 172,

    attitude_stability: 496,
    system_recovery: 100,

    scan_distance: 530,
    scan_effect_duration: 14.4,
    scan_standby_time: 10.2,

    weight: 3260,
    en_load: 177,

    ai_summary:
      'アーキバス製ヘッド。AP880、EN防御183と高くEN武器に強い。姿勢安定496と高い。スキャン距離530、効果時間14.4秒と長い。高性能スキャン型。',
    ai_tags: ['ヘッド', '高EN防御', 'スキャン性能特化', 'アーキバス', '軽量級'],
  }),
  defineHead({
    id: 'HD009',

    name: 'NACHTREIHER/44E',
    classification: headClass,
    category: headCategory,
    manufacture: schneider,
    price: 84000,

    ap: 590,

    anti_kinetic_defense: 153,
    anti_energy_defense: 155,
    anti_explosive_defense: 152,

    attitude_stability: 422,
    system_recovery: 92,

    scan_distance: 280,
    scan_effect_duration: 13.2,
    scan_standby_time: 9.6,

    weight: 2320,
    en_load: 210,

    ai_summary:
      'シュナイダー製ヘッド。AP590と低め、防御力も低め。重量2320と軽量。姿勢安定422、スキャン効果時間13.2秒と長い。EN負荷210と高め。軽量型。',
    ai_tags: [
      'ヘッド',
      '軽量級',
      'スキャン効果時間特化',
      'シュナイダー',
      '低防御',
    ],
  }),
  defineHead({
    id: 'HD010',

    name: 'KASUAR/44Z',
    classification: headClass,
    category: headCategory,
    manufacture: schneider,
    price: 210000,

    ap: 400,

    anti_kinetic_defense: 149,
    anti_energy_defense: 157,
    anti_explosive_defense: 151,

    attitude_stability: 498,
    system_recovery: 128,

    scan_distance: 620,
    scan_effect_duration: 5.4,
    scan_standby_time: 3.6,

    weight: 2590,
    en_load: 254,

    ai_summary:
      'シュナイダー製ヘッド。AP400と低い、防御力も低め。姿勢安定498、システム復元128と最高クラス。スキャン距離620、待機時間3.6秒と極めて短い。スキャン特化型。',
    ai_tags: [
      'ヘッド',
      '最高システム復元',
      'スキャン特化',
      'シュナイダー',
      '軽量級',
    ],
  }),
  defineHead({
    id: 'HD011',

    name: 'LAMMERGEIER/44F',
    classification: headClass,
    category: headCategory,
    manufacture: schneider,
    price: 155000,

    ap: 300,

    anti_kinetic_defense: 130,
    anti_energy_defense: 153,
    anti_explosive_defense: 130,

    attitude_stability: 255,
    system_recovery: 121,

    scan_distance: 300,
    scan_effect_duration: 6.6,
    scan_standby_time: 8.0,

    weight: 1050,
    en_load: 220,

    ai_summary:
      'シュナイダー製ヘッド。AP300と最低レベル、防御力も最低クラス。重量1050と最軽量。システム復元121と高い。EN負荷220と高め。超軽量特化型。',
    ai_tags: ['ヘッド', '最軽量級', '超軽量特化', 'シュナイダー', '最低AP'],
  }),
  defineHead({
    id: 'HD012',

    name: 'VE-44A',
    classification: headClass,
    category: headCategory,
    manufacture: arquebus_add,
    price: 275000,

    ap: 1060,

    anti_kinetic_defense: 179,
    anti_energy_defense: 188,
    anti_explosive_defense: 178,

    attitude_stability: 413,
    system_recovery: 110,

    scan_distance: 490,
    scan_effect_duration: 12.6,
    scan_standby_time: 9.9,

    weight: 3640,
    en_load: 182,

    ai_summary:
      'アーキバス先進開発局製ヘッド。AP1060、EN防御188と高くバランス良い防御力。姿勢安定413、システム復元110。スキャン距離490、効果時間12.6秒。高性能型。',
    ai_tags: [
      'ヘッド',
      '高性能型',
      '高EN防御',
      'アーキバス先進開発局',
      '中量級',
    ],
  }),
  defineHead({
    id: 'HD013',

    name: 'VE-44B',
    classification: headClass,
    category: headCategory,
    manufacture: arquebus_add,
    price: 306000,

    ap: 1040,

    anti_kinetic_defense: 167,
    anti_energy_defense: 181,
    anti_explosive_defense: 166,

    attitude_stability: 435,
    system_recovery: 154,

    scan_distance: 700,
    scan_effect_duration: 18.0,
    scan_standby_time: 4.8,

    weight: 4320,
    en_load: 265,

    ai_summary:
      'アーキバス先進開発局製ヘッド。AP1040、EN防御181と高い。姿勢安定435、システム復元154と最高クラス。スキャン距離700、効果時間18秒と極めて長い。最高性能スキャン型。',
    ai_tags: [
      'ヘッド',
      '最高スキャン性能',
      '最高システム復元',
      'アーキバス先進開発局',
      '中量級',
    ],
  }),
  defineHead({
    id: 'HD014',

    name: 'HC-2000 FINDER EYE',
    classification: headClass,
    category: headCategory,
    manufacture: rad,
    price: 0,

    ap: 660,

    anti_kinetic_defense: 157,
    anti_energy_defense: 142,
    anti_explosive_defense: 153,

    attitude_stability: 346,
    system_recovery: 102,

    scan_distance: 290,
    scan_effect_duration: 4.2,
    scan_standby_time: 3.6,

    weight: 2670,
    en_load: 125,

    ai_summary:
      'RaD製ヘッド。AP660、防御力は低め。姿勢安定346、システム復元102。スキャン待機時間3.6秒と極めて短い。重量2670、EN負荷125と軽量。価格0の初期装備。',
    ai_tags: ['ヘッド', '初期装備', '短待機時間', 'RaD', '軽量級'],
  }),
  defineHead({
    id: 'HD015',

    name: 'HC-2000/BC SHADE EYE',
    classification: headClass,
    category: headCategory,
    manufacture: rad,
    price: 147000,

    ap: 770,

    anti_kinetic_defense: 174,
    anti_energy_defense: 167,
    anti_explosive_defense: 181,

    attitude_stability: 448,
    system_recovery: 120,

    scan_distance: 450,
    scan_effect_duration: 10.8,
    scan_standby_time: 9.0,

    weight: 3090,
    en_load: 163,

    ai_summary:
      'RaD製ヘッド。AP770、防御力は標準的。姿勢安定448、システム復元120と高い。スキャン距離450、効果時間10.8秒。重量3090と軽量。バランス型。',
    ai_tags: ['ヘッド', 'バランス型', 'システム復元特化', 'RaD', '軽量級'],
  }),
  defineHead({
    id: 'HD016',

    name: 'HC-3000 WRECKER',
    classification: headClass,
    category: headCategory,
    manufacture: rad,
    price: 59000,

    ap: 1130,

    anti_kinetic_defense: 200,
    anti_energy_defense: 170,
    anti_explosive_defense: 187,

    attitude_stability: 322,
    system_recovery: 75,

    scan_distance: 270,
    scan_effect_duration: 3.0,
    scan_standby_time: 12.0,

    weight: 3800,
    en_load: 102,

    ai_summary:
      'RaD製ヘッド。AP1130と高く、実弾防御200と最高クラス。姿勢安定322、システム復元75と低め。スキャン性能は低い。EN負荷102と低い。実弾防御特化型。',
    ai_tags: ['ヘッド', '最高実弾防御', '高AP', 'RaD', '低EN負荷'],
  }),
  defineHead({
    id: 'HD017',

    name: 'HS-5000 APPETIZER',
    classification: headClass,
    category: headCategory,
    manufacture: rad,
    price: 199000,

    ap: 760,

    anti_kinetic_defense: 176,
    anti_energy_defense: 180,
    anti_explosive_defense: 176,

    attitude_stability: 376,
    system_recovery: 93,

    scan_distance: 610,
    scan_effect_duration: 6.0,
    scan_standby_time: 4.8,

    weight: 3000,
    en_load: 103,

    ai_summary:
      'RaD製ヘッド。AP760、三属性防御が176-180とバランス良い。姿勢安定376、システム復元93。スキャン距離610と長い。重量3000、EN負荷103と軽量。バランス型。',
    ai_tags: ['ヘッド', 'バランス型', 'スキャン距離特化', 'RaD', '軽量級'],
  }),
  defineHead({
    id: 'HD018',

    name: 'EL-TH-10 FIRMEZA',
    classification: headClass,
    category: headCategory,
    manufacture: elcano,
    price: 177000,

    ap: 480,

    anti_kinetic_defense: 156,
    anti_energy_defense: 158,
    anti_explosive_defense: 154,

    attitude_stability: 398,
    system_recovery: 99,

    scan_distance: 330,
    scan_effect_duration: 15.0,
    scan_standby_time: 9.6,

    weight: 2570,
    en_load: 134,

    ai_summary:
      'エルカノ製ヘッド。AP480と低め、三属性防御が154-158と完全にバランス。姿勢安定398、スキャン効果時間15秒と長い。重量2570と軽量。軽量バランス型。',
    ai_tags: [
      'ヘッド',
      '完全バランス防御',
      'スキャン効果時間特化',
      'エルカノ',
      '軽量級',
    ],
  }),
  defineHead({
    id: 'HD019',

    name: 'EL-PH-00 ALBA',
    classification: headClass,
    category: headCategory,
    manufacture: elcano,
    price: 208000,

    ap: 600,

    anti_kinetic_defense: 171,
    anti_energy_defense: 171,
    anti_explosive_defense: 171,

    attitude_stability: 414,
    system_recovery: 111,

    scan_distance: 500,
    scan_effect_duration: 3.6,
    scan_standby_time: 5.4,

    weight: 2800,
    en_load: 205,

    ai_summary:
      'エルカノ製ヘッド。AP600、三属性防御が全て171と完全にバランス。姿勢安定414、システム復元111と高い。スキャン距離500と長め。重量2800と軽量。完全バランス型。',
    ai_tags: [
      'ヘッド',
      '完全バランス防御',
      'スキャン距離特化',
      'エルカノ',
      '軽量級',
    ],
  }),
  defineHead({
    id: 'HD020',

    name: '20-081 MIND ALPHA',
    classification: headClass,
    category: headCategory,
    manufacture: allmind,
    price: 223000,

    ap: 820,

    anti_kinetic_defense: 178,
    anti_energy_defense: 186,
    anti_explosive_defense: 173,

    attitude_stability: 395,
    system_recovery: 109,

    scan_distance: 320,
    scan_effect_duration: 6.0,
    scan_standby_time: 4.8,

    weight: 3350,
    en_load: 142,

    ai_summary:
      'オールマインド製ヘッド。AP820、EN防御186と高くバランス良い防御力。姿勢安定395、システム復元109。スキャン待機時間4.8秒と短い。バランス型。',
    ai_tags: ['ヘッド', 'バランス型', '高EN防御', 'オールマインド', '中量級'],
  }),
  defineHead({
    id: 'HD021',

    name: '20-082 MIND BETA',
    classification: headClass,
    category: headCategory,
    manufacture: allmind,
    price: 261000,

    ap: 520,

    anti_kinetic_defense: 158,
    anti_energy_defense: 164,
    anti_explosive_defense: 150,

    attitude_stability: 536,
    system_recovery: 96,

    scan_distance: 540,
    scan_effect_duration: 12.0,
    scan_standby_time: 9.0,

    weight: 3480,
    en_load: 128,

    ai_summary:
      'オールマインド製ヘッド。AP520と低め、防御力も低め。姿勢安定536と最高クラス。スキャン距離540、効果時間12秒と長い。EN負荷128と低い。姿勢安定特化型。',
    ai_tags: [
      'ヘッド',
      '最高姿勢安定',
      'スキャン性能特化',
      'オールマインド',
      '低EN負荷',
    ],
  }),
  defineHead({
    id: 'HD022',

    name: 'IA-C01H: EPHEMERA',
    classification: headClass,
    category: headCategory,
    manufacture: rubicon_research_institute,
    price: 237000,

    ap: 990,

    anti_kinetic_defense: 160,
    anti_energy_defense: 189,
    anti_explosive_defense: 186,

    attitude_stability: 480,
    system_recovery: 132,

    scan_distance: 550,
    scan_effect_duration: 4.8,
    scan_standby_time: 6.0,

    weight: 4330,
    en_load: 233,

    ai_summary:
      '技研製ヘッド。AP990、EN防御189と高くバランス良い防御力。姿勢安定480、システム復元132と最高クラス。スキャン距離550と長い。高性能型。',
    ai_tags: ['ヘッド', '最高システム復元', '高EN防御', '技研', '中量級'],
  }),
  defineHead({
    id: 'HD023',

    name: 'IB-C03H: HAL 826',
    classification: headClass,
    category: headCategory,
    manufacture: rubicon_research_institute,
    price: 254000,

    ap: 930,

    anti_kinetic_defense: 169,
    anti_energy_defense: 182,
    anti_explosive_defense: 180,

    attitude_stability: 451,
    system_recovery: 125,

    scan_distance: 600,
    scan_effect_duration: 16.8,
    scan_standby_time: 11.4,

    weight: 3760,
    en_load: 215,

    ai_summary:
      '技研製ヘッド。AP930、EN防御182と高くバランス良い防御力。姿勢安定451、システム復元125と高い。スキャン距離600、効果時間16.8秒と極めて長い。高性能スキャン型。',
    ai_tags: ['ヘッド', '高性能スキャン', '高EN防御', '技研', '中量級'],
  }),
] as const
export type Head = (typeof heads)[number]
