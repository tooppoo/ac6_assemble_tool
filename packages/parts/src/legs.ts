import {
  four_legs,
  type FourLegs as FourLegsCategory,
  reverse_joint,
  type ReverseJoint as ReverseJointCategory,
  tank,
  type Tank as TankCategory,
  two_legs,
  type TwoLegs as TwoLegsCategory,
} from './types/base/category'
import { legs as legsClass } from './types/base/classification'
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
import { type AsJumper, type AsTank, defineLegs } from './types/frame/types'

export const twoLegs = [
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG001',

    name: 'AL-J-121 BASHO',
    classification: legsClass,
    category: two_legs,
    manufacture: baws,
    price: 141000,

    ap: 4240,

    anti_kinetic_defense: 362,
    anti_energy_defense: 325,
    anti_explosive_defense: 398,

    attitude_stability: 824,
    load_limit: 62600,
    jump_distance: 132,
    jump_height: 29,

    weight: 19720,
    en_load: 300,

    ai_summary:
      'BAWS製二脚。AP4240、実弾防御362、爆発防御398と高め。姿勢安定824、積載限度62600。ジャンプ距離132、高さ29。EN負荷300と低い。バランス型。',
    ai_tags: ['二脚', 'バランス型', '高防御', 'BAWS', '中量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG002',

    name: 'AL-J-121/RC JAILBREAK',
    classification: legsClass,
    category: two_legs,
    manufacture: baws,
    price: 0,

    ap: 2000,

    anti_kinetic_defense: 351,
    anti_energy_defense: 315,
    anti_explosive_defense: 388,

    attitude_stability: 658,
    load_limit: 62600,
    jump_distance: 132,
    jump_height: 25,

    weight: 18560,
    en_load: 300,

    ai_summary:
      'BAWS製二脚。AP2000と低め、防御力は標準的。姿勢安定658、積載限度62600。ジャンプ距離132、高さ25。重量18560とやや軽量。価格0の初期装備。',
    ai_tags: ['二脚', '初期装備', 'バランス型', 'BAWS', '中量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG003',

    name: 'LG-011 MELANDER',
    classification: legsClass,
    category: two_legs,
    manufacture: balam,
    price: 175000,

    ap: 4300,

    anti_kinetic_defense: 369,
    anti_energy_defense: 340,
    anti_explosive_defense: 361,

    attitude_stability: 843,
    load_limit: 60520,
    jump_distance: 107,
    jump_height: 28,

    weight: 17960,
    en_load: 365,

    ai_summary:
      'ベイラム製二脚。AP4300、実弾防御369と高くバランス良い防御力。姿勢安定843、積載限度60520。ジャンプ距離107、高さ28。重量17960と軽量。バランス型。',
    ai_tags: ['二脚', 'バランス型', '高防御', 'ベイラム', '軽量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG004',

    name: 'LG-012 MELANDER C3',
    classification: legsClass,
    category: two_legs,
    manufacture: balam,
    price: 0,

    ap: 3980,

    anti_kinetic_defense: 363,
    anti_energy_defense: 339,
    anti_explosive_defense: 357,

    attitude_stability: 835,
    load_limit: 55440,
    jump_distance: 118,
    jump_height: 30,

    weight: 16520,
    en_load: 355,

    ai_summary:
      'ベイラム製二脚。AP3980、防御力はバランス良く標準的。姿勢安定835、積載限度55440。ジャンプ距離118、高さ30とやや高め。重量16520と軽量。価格0の初期装備。',
    ai_tags: ['二脚', '初期装備', 'バランス型', 'ベイラム', '軽量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG005',

    name: 'DF-LG-08 TIAN-QIANG',
    classification: legsClass,
    category: two_legs,
    manufacture: dafeng,
    price: 350000,

    ap: 5300,

    anti_kinetic_defense: 414,
    anti_energy_defense: 382,
    anti_explosive_defense: 395,

    attitude_stability: 925,
    load_limit: 82600,
    jump_distance: 90,
    jump_height: 20,

    weight: 26950,
    en_load: 400,

    ai_summary:
      '大豊製二脚。AP5300と極めて高く、実弾防御414と最高クラス。姿勢安定925、積載限度82600と極めて高い。ジャンプ性能は低い。重量級向け高防御型。',
    ai_tags: ['二脚', '高AP', '最高防御', '大豊', '重量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG006',

    name: 'VP-422',
    classification: legsClass,
    category: two_legs,
    manufacture: arquebus,
    price: 313000,

    ap: 4090,

    anti_kinetic_defense: 352,
    anti_energy_defense: 379,
    anti_explosive_defense: 334,

    attitude_stability: 830,
    load_limit: 58620,
    jump_distance: 112,
    jump_height: 29,

    weight: 17170,
    en_load: 387,

    ai_summary:
      'アーキバス製二脚。AP4090、EN防御379と高くEN武器に強い。姿勢安定830、積載限度58620。ジャンプ距離112、高さ29。重量17170と軽量。バランス型。',
    ai_tags: ['二脚', 'バランス型', '高EN防御', 'アーキバス', '軽量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG007',

    name: 'NACHTREIHER/42E',
    classification: legsClass,
    category: two_legs,
    manufacture: schneider,
    price: 243000,

    ap: 3500,

    anti_kinetic_defense: 295,
    anti_energy_defense: 330,
    anti_explosive_defense: 298,

    attitude_stability: 711,
    load_limit: 48650,
    jump_distance: 228,
    jump_height: 52,

    weight: 14030,
    en_load: 462,

    ai_summary:
      'シュナイダー製二脚。AP3500、防御力は低め。姿勢安定711、積載限度48650と低め。ジャンプ距離228、高さ52と極めて高い。重量14030と最軽量級。超高ジャンプ特化型。',
    ai_tags: ['二脚', '最高ジャンプ性能', '最軽量級', 'シュナイダー', '高機動'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG008',

    name: 'VE-42A',
    classification: legsClass,
    category: two_legs,
    manufacture: arquebus_add,
    price: 504000,

    ap: 6000,

    anti_kinetic_defense: 397,
    anti_energy_defense: 453,
    anti_explosive_defense: 394,

    attitude_stability: 977,
    load_limit: 85700,
    jump_distance: 56,
    jump_height: 14,

    weight: 31580,
    en_load: 465,

    ai_summary:
      'アーキバス先進開発局製二脚。AP6000と最高クラス、EN防御453と極めて高い。姿勢安定977、積載限度85700と極めて高い。ジャンプ性能は低い。超重量級高性能型。',
    ai_tags: [
      '二脚',
      '最高AP',
      '最高EN防御',
      'アーキバス先進開発局',
      '超重量級',
    ],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG009',

    name: '2C-2000 CRAWLER',
    classification: legsClass,
    category: two_legs,
    manufacture: rad,
    price: 0,

    ap: 3650,

    anti_kinetic_defense: 326,
    anti_energy_defense: 322,
    anti_explosive_defense: 337,

    attitude_stability: 799,
    load_limit: 53700,
    jump_distance: 100,
    jump_height: 27,

    weight: 16300,
    en_load: 280,

    ai_summary:
      'RaD製二脚。AP3650、防御力は標準的。姿勢安定799、積載限度53700。ジャンプ距離100、高さ27。重量16300、EN負荷280と最低クラス。価格0の初期装備。',
    ai_tags: ['二脚', '初期装備', '最低EN負荷', 'RaD', '軽量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG010',

    name: '2C-3000 WRECKER',
    classification: legsClass,
    category: two_legs,
    manufacture: rad,
    price: 139000,

    ap: 5220,

    anti_kinetic_defense: 350,
    anti_energy_defense: 312,
    anti_explosive_defense: 383,

    attitude_stability: 1003,
    load_limit: 68900,
    jump_distance: 76,
    jump_height: 17,

    weight: 23230,
    en_load: 680,

    ai_summary:
      'RaD製二脚。AP5220と高く、爆発防御383と高い。姿勢安定1003と最高クラス、積載限度68900と高い。ジャンプ性能は低い。EN負荷680と高い。重量級向けバランス型。',
    ai_tags: ['二脚', '高AP', '最高姿勢安定', 'RaD', '重量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG011',

    name: '2S-5000 DESSERT',
    classification: legsClass,
    category: two_legs,
    manufacture: rad,
    price: 439000,

    ap: 5450,

    anti_kinetic_defense: 396,
    anti_energy_defense: 408,
    anti_explosive_defense: 382,

    attitude_stability: 997,
    load_limit: 77100,
    jump_distance: 80,
    jump_height: 19,

    weight: 27180,
    en_load: 420,

    ai_summary:
      'RaD製二脚。AP5450と高く、EN防御408と極めて高い。姿勢安定997、積載限度77100と極めて高い。ジャンプ性能は低い。重量級向け高性能型。',
    ai_tags: ['二脚', '高AP', '高EN防御', 'RaD', '重量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG012',

    name: 'EL-TL-10 FIRMEZA',
    classification: legsClass,
    category: two_legs,
    manufacture: elcano,
    price: 400000,

    ap: 3600,

    anti_kinetic_defense: 328,
    anti_energy_defense: 266,
    anti_explosive_defense: 270,

    attitude_stability: 737,
    load_limit: 52100,
    jump_distance: 120,
    jump_height: 31,

    weight: 11200,
    en_load: 378,

    ai_summary:
      'エルカノ製二脚。AP3600、防御力は低め。姿勢安定737、積載限度52100。ジャンプ距離120、高さ31と高め。重量11200と最軽量級。超軽量高機動型。',
    ai_tags: ['二脚', '最軽量級', '高ジャンプ性能', 'エルカノ', '軽量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG013',

    name: 'EL-PL-00 ALBA',
    classification: legsClass,
    category: two_legs,
    manufacture: elcano,
    price: 469000,

    ap: 3850,

    anti_kinetic_defense: 316,
    anti_energy_defense: 316,
    anti_explosive_defense: 316,

    attitude_stability: 809,
    load_limit: 50100,
    jump_distance: 95,
    jump_height: 37,

    weight: 13150,
    en_load: 360,

    ai_summary:
      'エルカノ製二脚。AP3850、三属性防御が全て316と完全にバランス。姿勢安定809、積載限度50100。ジャンプ高さ37と高い。重量13150と軽量。完全バランス型。',
    ai_tags: [
      '二脚',
      '完全バランス防御',
      '高ジャンプ高さ',
      'エルカノ',
      '軽量級',
    ],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG014',

    name: '06-041 MIND ALPHA',
    classification: legsClass,
    category: two_legs,
    manufacture: allmind,
    price: 272000,

    ap: 4560,

    anti_kinetic_defense: 370,
    anti_energy_defense: 390,
    anti_explosive_defense: 356,

    attitude_stability: 894,
    load_limit: 63810,
    jump_distance: 103,
    jump_height: 25,

    weight: 20810,
    en_load: 412,

    ai_summary:
      'オールマインド製二脚。AP4560、EN防御390と高くバランス良い防御力。姿勢安定894、積載限度63810。ジャンプ距離103、高さ25。高性能バランス型。',
    ai_tags: ['二脚', 'バランス型', '高EN防御', 'オールマインド', '中量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG015',

    name: 'IA-C01L: EPHEMERA',
    classification: legsClass,
    category: two_legs,
    manufacture: rubicon_research_institute,
    price: 521000,

    ap: 3800,

    anti_kinetic_defense: 297,
    anti_energy_defense: 352,
    anti_explosive_defense: 352,

    attitude_stability: 805,
    load_limit: 55050,
    jump_distance: 109,
    jump_height: 30,

    weight: 15200,
    en_load: 398,

    ai_summary:
      '技研製二脚。AP3800、EN防御352と高くバランス良い防御力。姿勢安定805、積載限度55050。ジャンプ距離109、高さ30。重量15200と軽量。軽量バランス型。',
    ai_tags: ['二脚', 'バランス型', '高EN防御', '技研', '軽量級'],
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
    id: 'LG016',

    name: 'IB-C03L: HAL 826',
    classification: legsClass,
    category: two_legs,
    manufacture: rubicon_research_institute,
    price: 563000,

    ap: 4120,

    anti_kinetic_defense: 359,
    anti_energy_defense: 380,
    anti_explosive_defense: 351,

    attitude_stability: 906,
    load_limit: 64900,
    jump_distance: 115,
    jump_height: 31,

    weight: 20590,
    en_load: 385,

    ai_summary:
      '技研製二脚。AP4120、EN防御380と高くバランス良い防御力。姿勢安定906、積載限度64900。ジャンプ距離115、高さ31と高め。高性能バランス型。',
    ai_tags: ['二脚', 'バランス型', '高EN防御', '技研', '中量級'],
  }),
] as const
export type TwoLegs = (typeof twoLegs)[number]

export const reverseJoints = [
  defineLegs<ReverseJointCategory, AsJumper>()({
    id: 'LG017',

    name: 'KASUAR/42Z',
    classification: legsClass,
    category: reverse_joint,
    manufacture: schneider,
    price: 192000,

    ap: 3580,

    anti_kinetic_defense: 293,
    anti_energy_defense: 328,
    anti_explosive_defense: 290,

    attitude_stability: 686,
    load_limit: 47820,
    jump_distance: 386,
    jump_height: 80,

    weight: 16510,
    en_load: 388,

    ai_summary:
      'シュナイダー製逆関節。AP3580、防御力は低め。姿勢安定686、積載限度47820と低め。ジャンプ距離386、高さ80と最高クラス。重量16510と軽量。超高ジャンプ特化型。',
    ai_tags: [
      '逆関節',
      '最高ジャンプ性能',
      '超高機動',
      'シュナイダー',
      '軽量級',
    ],
  }),
  defineLegs<ReverseJointCategory, AsJumper>()({
    id: 'LG018',

    name: 'RC-2000 SPRING CHICKEN',
    classification: legsClass,
    category: reverse_joint,
    manufacture: rad,
    price: 419000,

    ap: 4410,

    anti_kinetic_defense: 406,
    anti_energy_defense: 354,
    anti_explosive_defense: 380,

    attitude_stability: 756,
    load_limit: 70360,
    jump_distance: 317,
    jump_height: 70,

    weight: 25340,
    en_load: 402,

    ai_summary:
      'RaD製逆関節。AP4410、実弾防御406と極めて高い。姿勢安定756、積載限度70360と高い。ジャンプ距離317、高さ70と極めて高い。重量25340と重め。高積載高ジャンプ型。',
    ai_tags: ['逆関節', '高ジャンプ性能', '高実弾防御', 'RaD', '重量級'],
  }),
  defineLegs<ReverseJointCategory, AsJumper>()({
    id: 'LG019',

    name: '06-042 MIND BETA',
    classification: legsClass,
    category: reverse_joint,
    manufacture: allmind,
    price: 521000,

    ap: 4020,

    anti_kinetic_defense: 340,
    anti_energy_defense: 360,
    anti_explosive_defense: 364,

    attitude_stability: 788,
    load_limit: 61600,
    jump_distance: 334,
    jump_height: 60,

    weight: 19750,
    en_load: 426,

    ai_summary:
      'オールマインド製逆関節。AP4020、EN防御360と高くバランス良い防御力。姿勢安定788、積載限度61600。ジャンプ距離334、高さ60と高い。バランス型。',
    ai_tags: [
      '逆関節',
      'バランス型',
      '高ジャンプ性能',
      'オールマインド',
      '中量級',
    ],
  }),
] as const
export type ReverseJoint = (typeof reverseJoints)[number]

export const fourLegs = [
  defineLegs<FourLegsCategory, AsJumper>()({
    id: 'LG020',

    name: 'LG-033M VERRILL',
    classification: legsClass,
    category: four_legs,
    manufacture: balam,
    price: 465000,

    ap: 5250,

    anti_kinetic_defense: 402,
    anti_energy_defense: 357,
    anti_explosive_defense: 372,

    attitude_stability: 1413,
    load_limit: 76200,
    jump_distance: 82,
    jump_height: 15,

    weight: 36200,
    en_load: 675,

    ai_summary:
      'ベイラム製四脚。AP5250と高く、実弾防御402と高い。姿勢安定1413と極めて高く、積載限度76200と高い。ジャンプ性能は低い。重量36200と超重量級。高安定重量級型。',
    ai_tags: ['四脚', '最高姿勢安定', '高防御', 'ベイラム', '超重量級'],
  }),
  defineLegs<FourLegsCategory, AsJumper>()({
    id: 'LG021',

    name: 'VP-424',
    classification: legsClass,
    category: four_legs,
    manufacture: arquebus,
    price: 313000,

    ap: 4100,

    anti_kinetic_defense: 366,
    anti_energy_defense: 384,
    anti_explosive_defense: 386,

    attitude_stability: 1366,
    load_limit: 69800,
    jump_distance: 103,
    jump_height: 18,

    weight: 31600,
    en_load: 760,

    ai_summary:
      'アーキバス製四脚。AP4100、EN防御384と高くバランス良い防御力。姿勢安定1366と極めて高く、積載限度69800と高い。ジャンプ距離103と高め。高安定バランス型。',
    ai_tags: ['四脚', '最高姿勢安定', '高EN防御', 'アーキバス', '超重量級'],
  }),
  defineLegs<FourLegsCategory, AsJumper>()({
    id: 'LG022',

    name: 'LAMMERGEIER/42F',
    classification: legsClass,
    category: four_legs,
    manufacture: schneider,
    price: 415000,

    ap: 3560,

    anti_kinetic_defense: 300,
    anti_energy_defense: 360,
    anti_explosive_defense: 295,

    attitude_stability: 1051,
    load_limit: 52460,
    jump_distance: 53,
    jump_height: 42,

    weight: 22430,
    en_load: 790,

    ai_summary:
      'シュナイダー製四脚。AP3560と低め、防御力も低め。姿勢安定1051と高く、積載限度52460。ジャンプ高さ42と極めて高い。重量22430と四脚では軽量。軽量高ジャンプ型。',
    ai_tags: [
      '四脚',
      '高姿勢安定',
      '最高ジャンプ高さ',
      'シュナイダー',
      '軽量級',
    ],
  }),
] as const
export type FourLegs = (typeof fourLegs)[number]

export const tanks = [
  defineLegs<TankCategory, AsTank>()({
    id: 'LG023',

    name: 'LG-022T BORNEMISSZA',
    classification: legsClass,
    category: tank,
    manufacture: balam,
    price: 280000,

    ap: 9240,

    anti_kinetic_defense: 440,
    anti_energy_defense: 336,
    anti_explosive_defense: 399,

    attitude_stability: 1500,
    load_limit: 100300,

    travel_speed: 150,
    high_speed_performance: 362,

    thrust: 4667,
    upward_thrust: 3667,
    upward_en_consumption: 700,

    qb_thrust: 22150,
    qb_jet_duration: 0.34,
    qb_en_consumption: 810,
    qb_reload_time: 0.8,
    qb_reload_ideal_weight: 100300,

    ab_thrust: 7768,
    ab_en_consumption: 360,

    weight: 49800,
    en_load: 455,

    ai_summary:
      'ベイラム製タンク。AP9240と最高クラス、実弾防御440、爆発防御399と極めて高い。姿勢安定1500と最高、積載限度100300と最高。移動速度150、推力4667。超重量級最高性能型。',
    ai_tags: ['タンク', '最高AP', '最高防御', 'ベイラム', '超重量級'],
  }),
  defineLegs<TankCategory, AsTank>()({
    id: 'LG024',

    name: 'VE-42B',
    classification: legsClass,
    category: tank,
    manufacture: arquebus_add,
    price: 490000,

    ap: 8600,

    anti_kinetic_defense: 379,
    anti_energy_defense: 460,
    anti_explosive_defense: 406,

    attitude_stability: 924,
    load_limit: 91000,

    travel_speed: 136,
    high_speed_performance: 316,

    thrust: 5984,
    upward_thrust: 5001,
    upward_en_consumption: 912,

    qb_thrust: 21500,
    qb_jet_duration: 0.4,
    qb_en_consumption: 880,
    qb_reload_time: 0.7,
    qb_reload_ideal_weight: 91000,

    ab_thrust: 10502,
    ab_en_consumption: 430,

    weight: 46600,
    en_load: 824,

    ai_summary:
      'アーキバス先進開発局製タンク。AP8600と高く、EN防御460と最高クラス。姿勢安定924、積載限度91000と高い。推力5984、上昇推力5001と高い。AB推力10502と極めて高い。高機動EN防御型。',
    ai_tags: [
      'タンク',
      '高AP',
      '最高EN防御',
      'アーキバス先進開発局',
      '超重量級',
    ],
  }),
  defineLegs<TankCategory, AsTank>()({
    id: 'LG025',

    name: 'EL-TL-11 FORTALEZA',
    classification: legsClass,
    category: tank,
    manufacture: elcano,
    price: 385000,

    ap: 4860,

    anti_kinetic_defense: 345,
    anti_energy_defense: 311,
    anti_explosive_defense: 314,

    attitude_stability: 822,
    load_limit: 69300,

    travel_speed: 194,
    high_speed_performance: 430,

    thrust: 5334,
    upward_thrust: 4667,
    upward_en_consumption: 780,

    qb_thrust: 25000,
    qb_jet_duration: 0.26,
    qb_en_consumption: 720,
    qb_reload_time: 0.5,
    qb_reload_ideal_weight: 69300,

    ab_thrust: 8335,
    ab_en_consumption: 408,

    weight: 24650,
    en_load: 620,

    ai_summary:
      'エルカノ製タンク。AP4860と低め、防御力も低め。姿勢安定822、積載限度69300。移動速度194、高速性能430と最高クラス。QB推力25000と最高。重量24650とタンクでは最軽量。軽量高速型。',
    ai_tags: ['タンク', '最高移動速度', '最高QB推力', 'エルカノ', '軽量級'],
  }),
] as const
export type Tank = (typeof tanks)[number]

export const legs = [
  ...twoLegs,
  ...reverseJoints,
  ...fourLegs,
  ...tanks,
] as const

export type Legs = LegsNotTank | LegsTank
export type LegsNotTank = TwoLegs | ReverseJoint | FourLegs
export type LegsTank = Tank
