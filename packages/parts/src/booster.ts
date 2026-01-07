import { boosterNotEquipped } from '#parts/not-equipped'
import type { BoosterNotEquipped } from '#parts/not-equipped'

import { booster as boosterCategory } from './types/base/category'
import { booster as boosterClass } from './types/base/classification'
import {
  baws,
  furlong,
  rad,
  rubicon_research_institute,
  schneider,
} from './types/base/manufacture'
import { defineBooster } from './types/inner/booster'

export const boosters = [
  defineBooster({
    id: 'BS001',

    name: 'AB-J-137 KIKAKU',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: baws,
    price: 53000,

    thrust: 5667,
    upward_thrust: 4917,
    upward_en_consumption: 656,

    qb_thrust: 19150,
    qb_jet_duration: 0.31,
    qb_en_consumption: 550,
    qb_reload_time: 0.55,
    qb_reload_ideal_weight: 75800,

    ab_thrust: 8218,
    ab_en_consumption: 320,

    melee_attack_thrust: 14019,
    melee_attack_en_consumption: 425,

    weight: 1820,
    en_load: 266,

    ai_summary:
      'BAWS製ブースター。推力5667、上昇推力4917。QB推力19150、持続時間0.31秒。AB推力8218。近接攻撃推力14019と高い。バランス型。',
    ai_tags: ['ブースター', 'バランス型', '高近接推力', 'BAWS', '中量級'],
  }),
  defineBooster({
    id: 'BS002',

    name: 'BST-G1/P10',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: furlong,
    price: 0,

    thrust: 5734,
    upward_thrust: 5084,
    upward_en_consumption: 630,

    qb_thrust: 17600,
    qb_jet_duration: 0.39,
    qb_en_consumption: 480,
    qb_reload_time: 0.6,
    qb_reload_ideal_weight: 65200,

    ab_thrust: 8735,
    ab_en_consumption: 377,

    melee_attack_thrust: 8218,
    melee_attack_en_consumption: 529,

    weight: 1300,
    en_load: 130,

    ai_summary:
      'ファーロン製ブースター。推力5734、上昇推力5084。QB推力17600、持続時間0.39秒。AB推力8735。重量1300、EN負荷130と軽量。価格0の初期装備。',
    ai_tags: ['ブースター', '初期装備', '軽量級', 'ファーロン', '低EN負荷'],
  }),
  defineBooster({
    id: 'BS003',

    name: 'BST-G2/P04',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: furlong,
    price: 72000,

    thrust: 6001,
    upward_thrust: 5400,
    upward_en_consumption: 650,

    qb_thrust: 20600,
    qb_jet_duration: 0.38,
    qb_en_consumption: 560,
    qb_reload_time: 0.56,
    qb_reload_ideal_weight: 82000,

    ab_thrust: 8501,
    ab_en_consumption: 353,

    melee_attack_thrust: 9668,
    melee_attack_en_consumption: 470,

    weight: 1710,
    en_load: 250,

    ai_summary:
      'ファーロン製ブースター。推力6001、上昇推力5400。QB推力20600、持続時間0.38秒。AB推力8501。QB適正重量82000と高め。バランス型。',
    ai_tags: ['ブースター', 'バランス型', '高QB推力', 'ファーロン', '中量級'],
  }),
  defineBooster({
    id: 'BS004',

    name: 'BST-G2/P06SPD',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: furlong,
    price: 133000,

    thrust: 6801,
    upward_thrust: 5217,
    upward_en_consumption: 672,

    qb_thrust: 18600,
    qb_jet_duration: 0.36,
    qb_en_consumption: 700,
    qb_reload_time: 0.5,
    qb_reload_ideal_weight: 76000,

    ab_thrust: 8685,
    ab_en_consumption: 381,

    melee_attack_thrust: 10652,
    melee_attack_en_consumption: 507,

    weight: 1420,
    en_load: 390,

    ai_summary:
      'ファーロン製ブースター。推力6801、上昇推力5217。QB推力18600、リロード時間0.5秒と短い。AB推力8685。重量1420と軽量。速度重視型。',
    ai_tags: ['ブースター', '高推力', '短QBリロード', 'ファーロン', '軽量級'],
  }),
  defineBooster({
    id: 'BS005',

    name: 'ALULA/21E',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: schneider,
    price: 60000,

    thrust: 6668,
    upward_thrust: 5067,
    upward_en_consumption: 760,

    qb_thrust: 21650,
    qb_jet_duration: 0.3,
    qb_en_consumption: 690,
    qb_reload_time: 0.35,
    qb_reload_ideal_weight: 62400,

    ab_thrust: 9085,
    ab_en_consumption: 435,

    melee_attack_thrust: 10868,
    melee_attack_en_consumption: 575,

    weight: 1900,
    en_load: 410,

    ai_summary:
      'シュナイダー製ブースター。推力6668、上昇推力5067。QB推力21650と高く、リロード時間0.35秒と極めて短い。AB推力9085。近接攻撃推力10868。QB特化型。',
    ai_tags: [
      'ブースター',
      '高QB推力',
      '極短QBリロード',
      'シュナイダー',
      'QB特化',
    ],
  }),
  defineBooster({
    id: 'BS006',

    name: 'FLUEGEL/21Z',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: schneider,
    price: 202000,

    thrust: 6251,
    upward_thrust: 5634,
    upward_en_consumption: 680,

    qb_thrust: 20000,
    qb_jet_duration: 0.4,
    qb_en_consumption: 600,
    qb_reload_time: 0.5,
    qb_reload_ideal_weight: 73800,

    ab_thrust: 8668,
    ab_en_consumption: 398,

    melee_attack_thrust: 12335,
    melee_attack_en_consumption: 485,

    weight: 1980,
    en_load: 282,

    ai_summary:
      'シュナイダー製ブースター。推力6251、上昇推力5634。QB推力20000、持続時間0.4秒、リロード0.5秒。AB推力8668。近接攻撃推力12335と高い。バランス型。',
    ai_tags: [
      'ブースター',
      'バランス型',
      '高近接推力',
      'シュナイダー',
      '中量級',
    ],
  }),
  defineBooster({
    id: 'BS007',

    name: 'BUERZEL/21D',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: schneider,
    price: 151000,

    thrust: 6167,
    upward_thrust: 4834,
    upward_en_consumption: 710,

    qb_thrust: 18050,
    qb_jet_duration: 0.26,
    qb_en_consumption: 676,
    qb_reload_time: 0.91,
    qb_reload_ideal_weight: 100600,

    ab_thrust: 9301,
    ab_en_consumption: 378,

    melee_attack_thrust: 10402,
    melee_attack_en_consumption: 588,

    weight: 2240,
    en_load: 480,

    ai_summary:
      'シュナイダー製ブースター。推力6167、上昇推力4834。QB推力18050、リロード時間0.91秒と長い。QB適正重量100600と超重量級向け。AB推力9301。重量級特化。',
    ai_tags: [
      'ブースター',
      '超重量級向け',
      '高QB適正重量',
      'シュナイダー',
      '重量級',
    ],
  }),
  defineBooster({
    id: 'BS008',

    name: 'BC-0600 12345',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: rad,
    price: 84000,

    thrust: 5801,
    upward_thrust: 5200,
    upward_en_consumption: 800,

    qb_thrust: 18900,
    qb_jet_duration: 0.54,
    qb_en_consumption: 520,
    qb_reload_time: 0.8,
    qb_reload_ideal_weight: 97000,

    ab_thrust: 8084,
    ab_en_consumption: 372,

    melee_attack_thrust: 8118,
    melee_attack_en_consumption: 496,

    weight: 1360,
    en_load: 180,

    ai_summary:
      'RaD製ブースター。推力5801、上昇推力5200。QB推力18900、持続時間0.54秒と長い。QB適正重量97000と重量級向け。重量1360、EN負荷180と軽量。持続力重視。',
    ai_tags: ['ブースター', '長QB持続', '重量級向け', 'RaD', '軽量級'],
  }),
  defineBooster({
    id: 'BS009',

    name: 'BC-0400 MULE',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: rad,
    price: 88000,

    thrust: 5417,
    upward_thrust: 4767,
    upward_en_consumption: 405,

    qb_thrust: 17500,
    qb_jet_duration: 0.46,
    qb_en_consumption: 670,
    qb_reload_time: 0.58,
    qb_reload_ideal_weight: 80000,

    ab_thrust: 7584,
    ab_en_consumption: 381,

    melee_attack_thrust: 7018,
    melee_attack_en_consumption: 390,

    weight: 970,
    en_load: 200,

    ai_summary:
      'RaD製ブースター。推力5417、上昇推力4767。QB推力17500、持続時間0.46秒。上昇EN消費405と低い。重量970、EN負荷200と最軽量級。省エネ軽量型。',
    ai_tags: ['ブースター', '最軽量級', '低上昇EN消費', 'RaD', '省エネ型'],
  }),
  defineBooster({
    id: 'BS010',

    name: 'BC-0200 GRIDWALKER',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: rad,
    price: 169000,

    thrust: 6401,
    upward_thrust: 6334,
    upward_en_consumption: 660,

    qb_thrust: 19000,
    qb_jet_duration: 0.33,
    qb_en_consumption: 660,
    qb_reload_time: 0.7,
    qb_reload_ideal_weight: 60900,

    ab_thrust: 8585,
    ab_en_consumption: 387,

    melee_attack_thrust: 11468,
    melee_attack_en_consumption: 520,

    weight: 2010,
    en_load: 244,

    ai_summary:
      'RaD製ブースター。推力6401、上昇推力6334と極めて高い。QB推力19000。AB推力8585。近接攻撃推力11468。EN負荷244と低め。上昇性能特化型。',
    ai_tags: ['ブースター', '最高上昇推力', '上昇特化', 'RaD', '低EN負荷'],
  }),
  defineBooster({
    id: 'BS011',

    name: 'IA-C01B: GILLS',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: rubicon_research_institute,
    price: 296000,

    thrust: 6534,
    upward_thrust: 5334,
    upward_en_consumption: 580,

    qb_thrust: 18850,
    qb_jet_duration: 0.28,
    qb_en_consumption: 620,
    qb_reload_time: 0.3,
    qb_reload_ideal_weight: 68300,

    ab_thrust: 8335,
    ab_en_consumption: 391,

    melee_attack_thrust: 6184,
    melee_attack_en_consumption: 630,

    weight: 1590,
    en_load: 400,

    ai_summary:
      '技研製ブースター。推力6534、上昇推力5334。QB推力18850、リロード時間0.3秒と極めて短い。AB推力8335。重量1590と軽量。QB回転率特化型。',
    ai_tags: ['ブースター', '極短QBリロード', 'QB回転率特化', '技研', '軽量級'],
  }),
  defineBooster({
    id: 'BS012',

    name: 'IB-C03B: NGI 001',
    classification: boosterClass,
    category: boosterCategory,
    manufacture: rubicon_research_institute,
    price: 323000,

    thrust: 6467,
    upward_thrust: 6001,
    upward_en_consumption: 750,

    qb_thrust: 22200,
    qb_jet_duration: 0.43,
    qb_en_consumption: 740,
    qb_reload_time: 0.63,
    qb_reload_ideal_weight: 90200,

    ab_thrust: 8835,
    ab_en_consumption: 405,

    melee_attack_thrust: 10535,
    melee_attack_en_consumption: 558,

    weight: 1930,
    en_load: 342,

    ai_summary:
      '技研製ブースター。推力6467、上昇推力6001。QB推力22200と最高クラス、持続時間0.43秒と長い。QB適正重量90200。AB推力8835。高性能型。',
    ai_tags: ['ブースター', '最高QB推力', '高性能型', '技研', '中量級'],
  }),
] as const
export type Booster = (typeof boosters)[number]

export function boosterMustBeEquipped(
  b: Booster | BoosterNotEquipped,
): asserts b is Booster {
  if (b.category === boosterNotEquipped.category) {
    throw new Error('booster must be equipped')
  }
}
