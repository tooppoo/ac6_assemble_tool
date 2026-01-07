import {
  active_homing_missile,
  bullet_orbit,
  cluster_missile,
  container_missile,
  coral_missile,
  coral_shield,
  detonating_missile,
  diffuse_laser_canon,
  dual_missile,
  gatling_cannon,
  grenade_cannon,
  laser_canon,
  laser_orbit,
  laser_turret,
  light_wave_cannon,
  missile,
  needle_missile,
  plasma_canon,
  plasma_missile,
  pulse_buckler,
  pulse_canon,
  pulse_scutum,
  pulse_shield,
  pulse_shield_launcher,
  scatter_missile,
  split_missile,
  spread_bazooka,
  stun_needle_launcher,
  vertical_missile,
} from './types/base/category'
import { backUnit, leftBackUnit } from './types/base/classification'
import {
  allmind,
  arquebus,
  arquebus_add,
  balam,
  dafeng,
  elcano,
  furlong,
  melinite,
  rad,
  rubicon_research_institute,
  schneider,
  takigawa,
  vcpl,
} from './types/base/manufacture'
import {
  coral,
  energy,
  explosive,
  kinetic,
  none,
} from './types/unit/attack_type'
import type {
  AsActiveHomingMissile,
  AsBlastShooting,
  AsBuckler,
  AsContainerMissile,
  AsCoralMissile,
  AsGatling,
  AsKineticShooting,
  AsLaserCannon,
  AsLaserDrone,
  AsMissile,
  AsOrbit,
  AsPlasmaCanon,
  AsPlasmaMissile,
  AsPulseCanon,
  AsScutum,
  AsShield,
  AsShooting,
  AsTurret,
  WithBlast,
  WithChargeBlast,
  WithEffectiveRange,
  WithIdealRange,
  WithMagazine,
  WithPAInterference,
  WithRapidFire,
  WithReload,
} from './types/unit/types'
import { defineBackUnit, defineShieldUnit } from './types/unit/types'
import {
  burst,
  charge,
  full_auto,
  homing,
  semi_auto,
  shield,
} from './types/unit/weapon_type'

export const leftBackUnits = [
  defineShieldUnit<AsShield>()({
    id: 'BU001',

    name: 'VP-61PS',
    classification: leftBackUnit,
    category: pulse_shield,
    attack_type: none,
    weapon_type: shield,
    manufacture: arquebus,
    price: 123000,

    damage_mitigation: 58,
    impact_dampening: 40,
    ig_damage_mitigation: 78,
    ig_impact_dampening: 80,
    ig_duration: 0.6,
    deploy_heat_buildup: 190,
    deployment: 180,
    cooling: 144,

    weight: 2700,
    en_load: 310,

    ai_summary:
      'アーキバス社製のパルスシールド。通常展開でダメージ軽減58、衝撃軽減40、イニシャルガードでダメージ軽減78、衝撃軽減80、持続時間0.6秒。バランス型。',
    ai_tags: ['シールド', 'パルスシールド', 'バランス型', 'アーキバス', '左背'],
  }),
  defineShieldUnit<AsShield>()({
    id: 'BU002',

    name: 'SI-24: SU-Q5',
    classification: leftBackUnit,
    category: pulse_shield,
    attack_type: none,
    weapon_type: shield,
    manufacture: takigawa,
    price: 43000,

    damage_mitigation: 45,
    impact_dampening: 25,
    ig_damage_mitigation: 65,
    ig_impact_dampening: 75,
    ig_duration: 1.0,
    deploy_heat_buildup: 160,
    deployment: 180,
    cooling: 88,

    weight: 2010,
    en_load: 220,

    ai_summary:
      'タキガワ製の軽量パルスシールド。通常展開はダメージ軽減45、衝撃軽減25と控えめだが、イニシャルガードでダメージ軽減65、衝撃軽減75、持続時間1.0秒。軽量重視。',
    ai_tags: ['シールド', 'パルスシールド', '軽量級', 'タキガワ', '左背'],
  }),
  defineShieldUnit<AsShield>()({
    id: 'BU003',

    name: 'SI-27: SU-R8',
    classification: leftBackUnit,
    category: pulse_shield,
    attack_type: none,
    weapon_type: shield,
    manufacture: takigawa,
    price: 100000,

    damage_mitigation: 63,
    impact_dampening: 48,
    ig_damage_mitigation: 67,
    ig_impact_dampening: 79,
    ig_duration: 0.2,
    deploy_heat_buildup: 140,
    deployment: 180,
    cooling: 110,

    weight: 3150,
    en_load: 323,

    ai_summary:
      'タキガワ製のパルスシールド。通常展開でダメージ軽減63、衝撃軽減48と高性能だが、イニシャルガードの持続時間は0.2秒と極めて短い。瞬間防御に特化。',
    ai_tags: ['シールド', 'パルスシールド', '通常展開重視', 'タキガワ', '左背'],
  }),
  defineShieldUnit<AsBuckler>()({
    id: 'BU004',

    name: 'VP-61PB',
    classification: leftBackUnit,
    category: pulse_buckler,
    attack_type: none,
    weapon_type: shield,
    manufacture: arquebus,
    price: 76000,

    damage_mitigation: 35,
    impact_dampening: 35,
    ig_damage_mitigation: 96,
    ig_impact_dampening: 95,
    ig_duration: 0.3,
    deploy_heat_buildup: 480,
    deployment: 180,
    cooling: 132,

    weight: 1920,
    en_load: 285,

    ai_summary:
      'アーキバス社製のパルスバックラー。通常展開の性能は控えめだが、イニシャルガードでダメージ軽減96、衝撃軽減95と最高クラスの防御性能。持続時間0.3秒。',
    ai_tags: [
      'シールド',
      'パルスバックラー',
      'アサルトアーマー特化',
      'アーキバス',
      '左背',
    ],
  }),
  defineShieldUnit<AsBuckler>()({
    id: 'BU005',

    name: 'SI-29: SU-TT/C',
    classification: leftBackUnit,
    category: pulse_buckler,
    attack_type: none,
    weapon_type: shield,
    manufacture: takigawa,
    price: 62000,

    damage_mitigation: 30,
    impact_dampening: 56,
    ig_damage_mitigation: 82,
    ig_impact_dampening: 76,
    ig_duration: 1.6,
    deploy_heat_buildup: 670,
    deployment: 180,
    cooling: 142,

    weight: 3380,
    en_load: 385,

    ai_summary:
      'タキガワ製のパルスバックラー。イニシャルガードでダメージ軽減82、衝撃軽減76、持続時間1.6秒と長時間。通常展開は控えめ。重量とEN負荷は高め。',
    ai_tags: ['シールド', 'パルスバックラー', '長時間展開', 'タキガワ', '左背'],
  }),
  defineShieldUnit<AsScutum>()({
    id: 'BU006',

    name: 'VE-61PSA',
    classification: leftBackUnit,
    category: pulse_scutum,
    attack_type: none,
    weapon_type: shield,
    manufacture: arquebus_add,
    price: 197000,

    damage_mitigation: 86,
    impact_dampening: 70,
    idle_damage_mitigation: 21,
    idle_impact_dampening: 18,
    idle_duration: 4.0,
    deploy_heat_buildup: 270,
    deployment: 180,
    cooling: 113,

    weight: 4100,
    en_load: 480,

    ai_summary:
      'アーキバス先進開発局製のパルススカタム。展開時にダメージ軽減86、衝撃軽減70。非展開待機時も軽減21/18を4.0秒維持。重量4100、EN負荷480と重め。',
    ai_tags: [
      'シールド',
      'パルススカタム',
      '常時防御',
      'アーキバス先進開発局',
      '左背',
    ],
  }),
  defineShieldUnit<AsShield>()({
    id: 'BU007',

    name: 'IB-C03W4: NGI 028',
    classification: leftBackUnit,
    category: coral_shield,
    attack_type: none,
    weapon_type: shield,
    manufacture: rubicon_research_institute,
    price: 255000,

    damage_mitigation: 55,
    impact_dampening: 42,
    ig_damage_mitigation: 68,
    ig_impact_dampening: 57,
    ig_duration: 0.8,
    deploy_heat_buildup: 450,
    deployment: 360,
    cooling: 100,

    weight: 2170,
    en_load: 800,

    ai_summary:
      '技研製のコーラルシールド。ダメージ軽減55、衝撃軽減42、イニシャルガードでダメージ軽減68、衝撃軽減57、持続時間0.8秒。EN負荷800と非常に高い。',
    ai_tags: ['シールド', 'コーラルシールド', '高EN負荷', '技研', '左背'],
  }),
] as const
export type LeftBackUnit = (typeof leftBackUnits)[number]
export const backUnits = [
  defineBackUnit<AsGatling>()({
    id: 'BU008',

    name: 'DF-GA-09 SHAO-WEI',
    classification: backUnit,
    category: gatling_cannon,
    attack_type: kinetic,
    weapon_type: full_auto,
    manufacture: dafeng,
    price: 220000,

    attack_power: 24,
    impact: 20,
    accumulative_impact: 11,
    heat_buildup: 39,

    direct_hit_adjustment: 190,
    recoil: 5,
    ideal_range: 156,
    effective_range: 289,
    rapid_fire: 14.3,
    total_rounds: 800,
    cooling: 650,
    ammunition_cost: 20,

    weight: 3960,
    en_load: 404,

    ai_summary:
      '大豊製のガトリングキャノン。攻撃力24、連射速度14.3と高速連射。理想射程156、有効射程289の近中距離武器。総弾数800、反動5と低反動。実弾属性。',
    ai_tags: ['背部武器', 'ガトリング', '高速連射', '実弾', '大豊'],
  }),
  defineBackUnit<AsBlastShooting>()({
    id: 'BU009',

    name: 'SB-033M MORLEY',
    classification: backUnit,
    category: spread_bazooka,
    attack_type: explosive,
    weapon_type: semi_auto,
    manufacture: balam,
    price: 255000,

    attack_power: 1360,
    impact: 1450,
    accumulative_impact: 860,
    blast_radius: 15,

    direct_hit_adjustment: 190,
    recoil: 70,
    effective_range: 510,
    total_rounds: 25,
    reload_time: 5.0,
    ammunition_cost: 800,

    weight: 6580,
    en_load: 465,

    ai_summary:
      'ベイラム社製の散弾バズーカ。攻撃力1360、衝撃力1450、爆発半径15。有効射程510、総弾数25、リロード5.0秒。重量6580の重量級爆発武器。',
    ai_tags: ['背部武器', 'バズーカ', '爆発', '高衝撃', 'ベイラム'],
  }),
  defineBackUnit<AsBlastShooting>()({
    id: 'BU010',

    name: 'EARSHOT',
    classification: backUnit,
    category: grenade_cannon,
    attack_type: explosive,
    weapon_type: semi_auto,
    manufacture: melinite,
    price: 255000,

    attack_power: 2098,
    impact: 1455,
    accumulative_impact: 1101,
    blast_radius: 90,

    direct_hit_adjustment: 145,
    recoil: 70,
    effective_range: 720,
    total_rounds: 16,
    reload_time: 9.3,
    ammunition_cost: 1600,

    weight: 7230,
    en_load: 386,

    ai_summary:
      'メリニット製のグレネードキャノン。攻撃力2098、爆発半径90と超広範囲。有効射程720、総弾数16、リロード9.3秒。重量7230の超重量級爆発武器。',
    ai_tags: ['背部武器', 'グレネード', '爆発', '超広範囲', 'メリニット'],
  }),
  defineBackUnit<AsBlastShooting>()({
    id: 'BU011',

    name: 'SONGBIRDS',
    classification: backUnit,
    category: grenade_cannon,
    attack_type: explosive,
    weapon_type: burst,
    manufacture: melinite,
    price: 182000,

    attack_power: 655 * 2,
    impact: 635 * 2,
    accumulative_impact: 494 * 2,
    blast_radius: 60,

    direct_hit_adjustment: 140,
    recoil: 60,
    effective_range: 625,
    total_rounds: 42,
    reload_time: 6.4,
    ammunition_cost: 600,

    weight: 5500,
    en_load: 285,

    ai_summary:
      'メリニット製のグレネードキャノン。攻撃力655×2の2連射バースト、爆発半径60。有効射程625、総弾数42、リロード6.4秒。重量5500と比較的軽量。',
    ai_tags: ['背部武器', 'グレネード', 'バースト', '爆発', 'メリニット'],
  }),
  defineBackUnit<AsKineticShooting & WithBlast & WithReload>()({
    id: 'BU012',

    name: 'VE-60SNA',
    classification: backUnit,
    category: stun_needle_launcher,
    attack_type: kinetic,
    weapon_type: semi_auto,
    manufacture: arquebus_add,
    price: 283000,

    attack_power: 1258,
    impact: 641,
    accumulative_impact: 339,
    blast_radius: 30,

    direct_hit_adjustment: 195,
    recoil: 70,
    ideal_range: 280,
    effective_range: 490,
    total_rounds: 30,
    reload_time: 5.0,
    ammunition_cost: 800,

    weight: 6150,
    en_load: 825,

    ai_summary:
      'アーキバス先進開発局製のスタンニードルランチャー。攻撃力1258、爆発半径30。理想射程280、有効射程490。EN負荷825と高め。実弾属性スタン武器。',
    ai_tags: ['背部武器', 'ニードル', 'スタン', '実弾', 'アーキバス先進開発局'],
  }),
  defineBackUnit<AsLaserCannon>()({
    id: 'BU013',

    name: 'VP-60LCS',
    classification: backUnit,
    category: laser_canon,
    attack_type: energy,
    weapon_type: charge,
    manufacture: arquebus,
    price: 147000,

    attack_power: 925,
    impact: 500,
    accumulative_impact: 180,
    heat_buildup: 320,

    charge_attack_power: 1621,
    charge_impact: 750,
    charge_accumulative_impact: 280,
    charge_heat_buildup: 1000,

    direct_hit_adjustment: 145,
    recoil: 70,
    ideal_range: 230,
    effective_range: 359,
    rapid_fire: 0.7,
    charge_en_load: 759,
    charge_time: 1.6,
    charge_ammo_consumption: 3,
    total_rounds: 57,
    cooling: 210,
    ammunition_cost: 450,

    weight: 5190,
    en_load: 683,

    ai_summary:
      'アーキバス社製のレーザーキャノン。通常攻撃力925、チャージ攻撃力1621。チャージEN負荷759、チャージ時間1.6秒。理想射程230、有効射程359。EN属性。',
    ai_tags: ['背部武器', 'レーザー', 'チャージ', 'EN属性', 'アーキバス'],
  }),
  defineBackUnit<AsLaserCannon>()({
    id: 'BU014',

    name: 'VE-60LCA',
    classification: backUnit,
    category: laser_canon,
    attack_type: energy,
    weapon_type: charge,
    manufacture: arquebus_add,
    price: 333000,

    attack_power: 633 * 3,
    impact: 199 * 3,
    accumulative_impact: 76 * 3,
    heat_buildup: 700,

    charge_attack_power: 1015 * 3,
    charge_impact: 3303 * 3,
    charge_accumulative_impact: 185 * 3,
    charge_heat_buildup: 1000,

    direct_hit_adjustment: 145,
    recoil: 70,
    ideal_range: 240,
    effective_range: 402,
    rapid_fire: 0.4,
    charge_en_load: 1440,
    charge_time: 5.0,
    charge_ammo_consumption: 6,
    total_rounds: 24,
    cooling: 155,
    ammunition_cost: 450,

    weight: 14820,
    en_load: 1200,

    ai_summary:
      'アーキバス先進開発局製の3連レーザーキャノン。通常攻撃力633×3、チャージ攻撃力1015×3。チャージEN負荷1440、チャージ時間5.0秒。重量14820と超重量級。',
    ai_tags: [
      '背部武器',
      'レーザー',
      '3連射',
      'チャージ',
      'アーキバス先進開発局',
    ],
  }),
  defineBackUnit<AsLaserCannon>()({
    id: 'BU015',

    name: 'VE-60LCB',
    classification: backUnit,
    category: laser_canon,
    attack_type: energy,
    weapon_type: charge,
    manufacture: arquebus_add,
    price: 318000,

    attack_power: 1201,
    impact: 650,
    accumulative_impact: 180,
    heat_buildup: 320,

    charge_attack_power: 2203,
    charge_impact: 1110,
    charge_accumulative_impact: 440,
    charge_heat_buildup: 1000,

    direct_hit_adjustment: 145,
    recoil: 70,
    ideal_range: 300,
    effective_range: 447,
    rapid_fire: 0.3,
    charge_en_load: 988,
    charge_time: 4.3,
    charge_ammo_consumption: 3,
    total_rounds: 32,
    cooling: 172,
    ammunition_cost: 1000,

    weight: 9270,
    en_load: 803,

    ai_summary:
      'アーキバス先進開発局製のレーザーキャノン。通常攻撃力1201、チャージ攻撃力2203。チャージEN負荷988、チャージ時間4.3秒。理想射程300、有効射程447。高火力型。',
    ai_tags: [
      '背部武器',
      'レーザー',
      'チャージ',
      '高火力',
      'アーキバス先進開発局',
    ],
  }),
  defineBackUnit<AsLaserCannon & WithChargeBlast>()({
    id: 'BU016',

    name: 'VP-60LCD',
    classification: backUnit,
    category: diffuse_laser_canon,
    attack_type: energy,
    weapon_type: charge,
    manufacture: arquebus,
    price: 215000,

    attack_power: 1308,
    impact: 648,
    accumulative_impact: 204,
    heat_buildup: 440,

    charge_attack_power: 1988,
    charge_impact: 980,
    charge_accumulative_impact: 439,
    charge_blast_radius: 45,
    charge_heat_buildup: 1000,

    direct_hit_adjustment: 145,
    recoil: 45,
    ideal_range: 180,
    effective_range: 252,
    rapid_fire: 0.6,
    charge_en_load: 902,
    charge_time: 2.0,
    charge_ammo_consumption: 3,
    total_rounds: 54,
    cooling: 232,
    ammunition_cost: 650,

    weight: 7620,
    en_load: 784,

    ai_summary:
      'アーキバス社製の拡散レーザーキャノン。通常攻撃力1308、チャージ攻撃力1988でチャージ時爆発半径45。チャージEN負荷902、チャージ時間2.0秒。近距離範囲攻撃型。',
    ai_tags: ['背部武器', 'レーザー', '拡散', 'チャージ爆発', 'アーキバス'],
  }),

  defineBackUnit<AsPlasmaCanon>()({
    id: 'BU017',

    name: 'FASAN/60E',
    classification: backUnit,
    category: plasma_canon,
    attack_type: energy,
    weapon_type: charge,
    manufacture: schneider,
    price: 217000,

    attack_power: 1560,
    impact: 840,
    accumulative_impact: 570,
    blast_radius: 30,
    heat_buildup: 465,

    charge_attack_power: 2412,
    charge_impact: 1272,
    charge_accumulative_impact: 792,
    charge_blast_radius: 60,
    charge_heat_buildup: 1000,

    direct_hit_adjustment: 125,
    recoil: 70,
    effective_range: 440,
    rapid_fire: 0.5,
    charge_en_load: 944,
    charge_time: 2.0,
    charge_ammo_consumption: 3,
    total_rounds: 39,
    cooling: 196,
    ammunition_cost: 540,

    weight: 6270,
    en_load: 882,

    ai_summary:
      'シュナイダー製のプラズマキャノン。通常攻撃力1560、チャージ攻撃力2412。爆発半径30/60。チャージEN負荷944、チャージ時間2.0秒。EN属性範囲攻撃武器。',
    ai_tags: ['背部武器', 'プラズマ', 'チャージ', '爆発', 'シュナイダー'],
  }),
  defineBackUnit<AsPulseCanon>()({
    id: 'BU018',

    name: 'KRANICH/60Z',
    classification: backUnit,
    category: pulse_canon,
    attack_type: energy,
    weapon_type: full_auto,
    manufacture: schneider,
    price: 177000,

    attack_power: 85,
    impact: 20,
    accumulative_impact: 10,
    heat_buildup: 65,

    direct_hit_adjustment: 145,
    pa_interference: 550,
    recoil: 10,
    effective_range: 490,
    rapid_fire: 10.0,
    total_rounds: 560,
    cooling: 225,
    ammunition_cost: 40,

    weight: 2100,
    en_load: 652,

    ai_summary:
      'シュナイダー製のパルスキャノン。攻撃力85、連射速度10.0と高速連射。PA干渉550と高い。有効射程490、総弾数560。重量2100と軽量。EN属性連射武器。',
    ai_tags: [
      '背部武器',
      'パルスキャノン',
      '高速連射',
      'PA干渉',
      'シュナイダー',
    ],
  }),
  defineBackUnit<
    AsShooting &
      WithBlast &
      WithPAInterference &
      WithEffectiveRange &
      WithRapidFire &
      WithMagazine
  >()({
    id: 'BU019',

    name: 'EULE/60D',
    classification: backUnit,
    category: pulse_shield_launcher,
    attack_type: energy,
    weapon_type: semi_auto,
    manufacture: schneider,
    price: 234000,

    attack_power: 455,
    impact: 640,
    accumulative_impact: 461,
    blast_radius: 15,

    direct_hit_adjustment: 155,
    pa_interference: 175,
    recoil: 4,
    effective_range: 62,
    rapid_fire: 3.4,
    magazine_rounds: 3,
    total_rounds: 45,
    reload_time: 6.0,
    ammunition_cost: 400,

    weight: 2760,
    en_load: 382,

    ai_summary:
      'シュナイダー製のパルスシールドランチャー。攻撃力455、爆発半径15、PA干渉175。3連マガジン、連射速度3.4。有効射程62と超近距離。軽量でEN負荷も低い。',
    ai_tags: [
      '背部武器',
      'シールドランチャー',
      '超近距離',
      'PA干渉',
      'シュナイダー',
    ],
  }),
  defineBackUnit<AsMissile & WithPAInterference>()({
    id: 'BU020',

    name: 'IA-C01W3: AURORA',
    classification: backUnit,
    category: light_wave_cannon,
    attack_type: energy,
    weapon_type: homing,
    manufacture: rubicon_research_institute,
    price: 340000,

    attack_power: 134 * 4,
    impact: 102 * 4,
    accumulative_impact: 102 * 4,

    direct_hit_adjustment: 175,
    pa_interference: 117,
    guidance: 240,
    effective_range: 930,
    homing_lock_time: 3.3,
    lock_count: 4,
    total_rounds: 100,
    reload_time: 5.5,
    ammunition_cost: 80,

    weight: 3330,
    en_load: 390,

    ai_summary:
      '技研製の光波砲。攻撃力134×4、PA干渉117。誘導240、ロック時間3.3秒、4ロック。有効射程930と長射程。EN属性ホーミング武器。',
    ai_tags: ['背部武器', '光波砲', 'ホーミング', 'PA干渉', '技研'],
  }),

  defineBackUnit<AsMissile>()({
    id: 'BU021',

    name: 'BML-G1/P20MLT-04',
    classification: backUnit,
    category: missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 74000,

    attack_power: 103 * 4,
    impact: 72 * 4,
    accumulative_impact: 43 * 4,

    direct_hit_adjustment: 145,
    guidance: 180,
    effective_range: 2500,
    homing_lock_time: 0.3,
    lock_count: 4,
    total_rounds: 140,
    reload_time: 4.0,
    ammunition_cost: 80,

    weight: 2120,
    en_load: 154,

    ai_summary:
      'ファーロン製の標準ミサイル。攻撃力103×4、誘導180、4ロック、ロック時間0.3秒。有効射程2500と超長射程。総弾数140。軽量でEN負荷も低い。',
    ai_tags: ['背部武器', 'ミサイル', 'ホーミング', '長射程', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU022',

    name: 'BML-G2/P03MLT-06',
    classification: backUnit,
    category: missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 111000,

    attack_power: 103 * 6,
    impact: 72 * 6,
    accumulative_impact: 43 * 6,

    direct_hit_adjustment: 145,
    guidance: 180,
    effective_range: 2500,
    homing_lock_time: 0.4,
    lock_count: 6,
    total_rounds: 228,
    reload_time: 5.0,
    ammunition_cost: 80,

    weight: 3840,
    en_load: 241,

    ai_summary:
      'ファーロン製の標準ミサイル。攻撃力103×6、誘導180、6ロック、ロック時間0.4秒。有効射程2500と超長射程。総弾数228。中型ミサイルコンテナ。',
    ai_tags: ['背部武器', 'ミサイル', 'ホーミング', '長射程', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU023',

    name: 'BML-G2/P05MLT-10',
    classification: backUnit,
    category: missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 165000,

    attack_power: 103 * 10,
    impact: 72 * 10,
    accumulative_impact: 43 * 10,

    direct_hit_adjustment: 145,
    guidance: 180,
    effective_range: 2500,
    homing_lock_time: 0.8,
    lock_count: 10,
    total_rounds: 300,
    reload_time: 6.4,
    ammunition_cost: 80,

    weight: 5220,
    en_load: 320,

    ai_summary:
      'ファーロン製の標準ミサイル。攻撃力103×10、誘導180、10ロック、ロック時間0.8秒。有効射程2500と超長射程。総弾数300。大型ミサイルコンテナ。',
    ai_tags: ['背部武器', 'ミサイル', 'ホーミング', '長射程', 'ファーロン'],
  }),

  defineBackUnit<AsMissile>()({
    id: 'BU024',

    name: 'BML-G2/P19SPL-12',
    classification: backUnit,
    category: split_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 123000,

    attack_power: 600 * 2,
    impact: 402 * 2,
    accumulative_impact: 240 * 2,

    direct_hit_adjustment: 140,
    guidance: 145,
    effective_range: 1425,
    homing_lock_time: 1.5,
    lock_count: 2,
    total_rounds: 80,
    reload_time: 6.0,
    ammunition_cost: 400,

    weight: 3580,
    en_load: 325,

    ai_summary:
      'ファーロン製の分裂ミサイル。攻撃力600×2、誘導145、2ロック、ロック時間1.5秒。有効射程1425。分裂後の広範囲攻撃が可能。',
    ai_tags: ['背部武器', 'ミサイル', '分裂', 'ホーミング', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU025',

    name: 'BML-G2/P16SPL-08',
    classification: backUnit,
    category: split_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 85000,

    attack_power: 688,
    impact: 536,
    accumulative_impact: 320,

    direct_hit_adjustment: 140,
    guidance: 145,
    effective_range: 1425,
    homing_lock_time: 1.0,
    lock_count: 1,
    total_rounds: 40,
    reload_time: 4.5,
    ammunition_cost: 500,

    weight: 2800,
    en_load: 228,

    ai_summary:
      'ファーロン製の分裂ミサイル。攻撃力688、誘導145、1ロック、ロック時間1.0秒。有効射程1425。総弾数40。軽量タイプ。',
    ai_tags: ['背部武器', 'ミサイル', '分裂', 'ホーミング', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU026',

    name: 'BML-G2/P17SPL-16',
    classification: backUnit,
    category: split_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 160000,

    attack_power: 688 * 2,
    impact: 536,
    accumulative_impact: 320 * 2,

    direct_hit_adjustment: 140,
    guidance: 145,
    effective_range: 1425,
    homing_lock_time: 2.0,
    lock_count: 2,
    total_rounds: 72,
    reload_time: 7.7,
    ammunition_cost: 500,

    weight: 5010,
    en_load: 510,

    ai_summary:
      'ファーロン製の分裂ミサイル。攻撃力688×2、誘導145、2ロック、ロック時間2.0秒。有効射程1425。総弾数72。重量級タイプ。',
    ai_tags: ['背部武器', 'ミサイル', '分裂', 'ホーミング', 'ファーロン'],
  }),

  defineBackUnit<AsMissile>()({
    id: 'BU027',

    name: 'BML-G1/P31DUO-02',
    classification: backUnit,
    category: dual_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 144000,

    attack_power: 148 * 4,
    impact: 94 * 4,
    accumulative_impact: 62 * 4,

    direct_hit_adjustment: 150,
    guidance: 145,
    effective_range: 500,
    homing_lock_time: 0.4,
    lock_count: 2,
    total_rounds: 124,
    reload_time: 3.5,
    ammunition_cost: 70,

    weight: 1900,
    en_load: 182,

    ai_summary:
      'ファーロン製のデュアルミサイル。攻撃力148×4、誘導145、2ロック、ロック時間0.4秒。有効射程500と近距離。総弾数124。軽量でEN負荷も低い。',
    ai_tags: ['背部武器', 'ミサイル', 'デュアル', '近距離', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU028',

    name: 'BML-G1/P32DUO-03',
    classification: backUnit,
    category: dual_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 180000,

    attack_power: 148 * 6,
    impact: 94 * 6,
    accumulative_impact: 62 * 6,

    direct_hit_adjustment: 150,
    guidance: 145,
    effective_range: 500,
    homing_lock_time: 0.4,
    lock_count: 3,
    total_rounds: 180,
    reload_time: 4.3,
    ammunition_cost: 70,

    weight: 3450,
    en_load: 262,

    ai_summary:
      'ファーロン製のデュアルミサイル。攻撃力148×6、誘導145、3ロック、ロック時間0.4秒。有効射程500と近距離。総弾数180。中型タイプ。',
    ai_tags: ['背部武器', 'ミサイル', 'デュアル', '近距離', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU029',

    name: 'BML-G2/P08DUO-03',
    classification: backUnit,
    category: dual_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 228000,

    attack_power: 177 * 6,
    impact: 111 * 6,
    accumulative_impact: 72 * 6,

    direct_hit_adjustment: 150,
    guidance: 145,
    effective_range: 500,
    homing_lock_time: 0.7,
    lock_count: 6,
    total_rounds: 156,
    reload_time: 5.8,
    ammunition_cost: 100,

    weight: 4020,
    en_load: 332,

    ai_summary:
      'ファーロン製のデュアルミサイル。攻撃力177×6、誘導145、6ロック、ロック時間0.7秒。有効射程500と近距離。総弾数156。大型タイプ。',
    ai_tags: ['背部武器', 'ミサイル', 'デュアル', '近距離', 'ファーロン'],
  }),

  defineBackUnit<AsMissile>()({
    id: 'BU030',

    name: 'BML-G1/P01VTC-04',
    classification: backUnit,
    category: vertical_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 85000,

    attack_power: 124 * 4,
    impact: 89 * 4,
    accumulative_impact: 55 * 4,

    direct_hit_adjustment: 150,
    guidance: 480,
    effective_range: 1000,
    homing_lock_time: 0.4,
    lock_count: 4,
    total_rounds: 108,
    reload_time: 4.8,
    ammunition_cost: 120,

    weight: 2240,
    en_load: 258,

    ai_summary:
      'ファーロン製の垂直ミサイル。攻撃力124×4、誘導480と高い。4ロック、ロック時間0.4秒。有効射程1000。遮蔽物越しの攻撃が可能。',
    ai_tags: ['背部武器', 'ミサイル', '垂直', '高誘導', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU031',

    name: 'BML-G1/P03VTC-08',
    classification: backUnit,
    category: vertical_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 112000,

    attack_power: 124 * 8,
    impact: 89 * 8,
    accumulative_impact: 55 * 8,

    direct_hit_adjustment: 150,
    guidance: 480,
    effective_range: 1000,
    homing_lock_time: 0.8,
    lock_count: 8,
    total_rounds: 224,
    reload_time: 6.0,
    ammunition_cost: 120,

    weight: 3920,
    en_load: 380,

    ai_summary:
      'ファーロン製の垂直ミサイル。攻撃力124×8、誘導480と高い。8ロック、ロック時間0.8秒。有効射程1000。中型垂直ミサイルコンテナ。',
    ai_tags: ['背部武器', 'ミサイル', '垂直', '高誘導', 'ファーロン'],
  }),
  defineBackUnit<AsMissile>()({
    id: 'BU032',

    name: 'BML-G1/P07VTC-12',
    classification: backUnit,
    category: vertical_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 188000,

    attack_power: 124 * 12,
    impact: 89 * 12,
    accumulative_impact: 55 * 12,

    direct_hit_adjustment: 150,
    guidance: 480,
    effective_range: 1000,
    homing_lock_time: 1.4,
    lock_count: 12,
    total_rounds: 360,
    reload_time: 7.5,
    ammunition_cost: 120,

    weight: 5010,
    en_load: 525,

    ai_summary:
      'ファーロン製の垂直ミサイル。攻撃力124×12、誘導480と高い。12ロック、ロック時間1.4秒。有効射程1000。大型垂直ミサイルコンテナ。',
    ai_tags: ['背部武器', 'ミサイル', '垂直', '高誘導', 'ファーロン'],
  }),

  defineBackUnit<AsActiveHomingMissile>()({
    id: 'BU033',

    name: 'BML-G3/P04ACT-01',
    classification: backUnit,
    category: active_homing_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 98000,

    attack_power: 486,
    impact: 540,
    accumulative_impact: 378,
    blast_radius: 12,

    direct_hit_adjustment: 165,
    guidance: 115,
    effective_range: 1000,
    homing_lock_time: 2,
    lock_count: 1,
    total_rounds: 45,
    reload_time: 2.4,
    ammunition_cost: 450,

    weight: 2680,
    en_load: 213,

    ai_summary:
      'ファーロン製のアクティブホーミングミサイル。攻撃力486、爆発半径12。誘導115、1ロック、ロック時間2.0秒。発射後自動追尾。総弾数45。',
    ai_tags: [
      '背部武器',
      'ミサイル',
      'アクティブホーミング',
      '爆発',
      'ファーロン',
    ],
  }),
  defineBackUnit<AsActiveHomingMissile>()({
    id: 'BU034',

    name: 'BML-G3/P05ACT-02',
    classification: backUnit,
    category: active_homing_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 145000,

    attack_power: 486 * 2,
    impact: 540 * 2,
    accumulative_impact: 376 * 2,
    blast_radius: 12,

    direct_hit_adjustment: 165,
    guidance: 115,
    effective_range: 1000,
    homing_lock_time: 2.8,
    lock_count: 2,
    total_rounds: 72,
    reload_time: 4.2,
    ammunition_cost: 450,

    weight: 4320,
    en_load: 424,

    ai_summary:
      'ファーロン製のアクティブホーミングミサイル。攻撃力486×2、爆発半径12。誘導115、2ロック、ロック時間2.8秒。発射後自動追尾。総弾数72。',
    ai_tags: [
      '背部武器',
      'ミサイル',
      'アクティブホーミング',
      '爆発',
      'ファーロン',
    ],
  }),

  defineBackUnit<AsContainerMissile>()({
    id: 'BU035',

    name: 'BML-G1/P29CNT',
    classification: backUnit,
    category: container_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: furlong,
    price: 250000,

    attack_power: 1422,
    impact: 1278,
    accumulative_impact: 828,

    direct_hit_adjustment: 140,
    guidance: 120,
    effective_range: 700,
    total_rounds: 12,
    reload_time: 12.0,
    ammunition_cost: 800,

    weight: 6370,
    en_load: 150,

    ai_summary:
      'ファーロン製のコンテナミサイル。攻撃力1422、衝撃力1278と超高威力。誘導120、有効射程700。総弾数12、リロード12.0秒。重量6370と重い。',
    ai_tags: ['背部武器', 'ミサイル', 'コンテナ', '超高威力', 'ファーロン'],
  }),

  defineBackUnit<AsMissile & WithBlast>()({
    id: 'BU036',

    name: 'WR-0999 DELIVERY BOY',
    classification: backUnit,
    category: cluster_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: rad,
    price: 298000,

    attack_power: 2133,
    impact: 2040,
    accumulative_impact: 1638,
    blast_radius: 24,

    direct_hit_adjustment: 175,
    guidance: 200,
    effective_range: 1049,
    homing_lock_time: 5.0,
    lock_count: 1,
    total_rounds: 20,
    reload_time: 9.0,
    ammunition_cost: 600,

    weight: 6890,
    en_load: 499,

    ai_summary:
      'RaD製のクラスターミサイル。攻撃力2133、衝撃力2040、爆発半径24。誘導200、1ロック、ロック時間5.0秒。総弾数20。重量6890の超重量級。',
    ai_tags: ['背部武器', 'ミサイル', 'クラスター', '超高威力', 'RaD'],
  }),

  defineBackUnit<AsMissile>()({
    id: 'BU037',

    name: 'WS-5001 SOUP',
    classification: backUnit,
    category: scatter_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: rad,
    price: 326000,

    attack_power: 78 * 10,
    impact: 77 * 10,
    accumulative_impact: 55 * 10,

    direct_hit_adjustment: 145,
    guidance: 180,
    effective_range: 2500,
    homing_lock_time: 0.5,
    lock_count: 1,
    total_rounds: 420,
    reload_time: 8.0,
    ammunition_cost: 50,

    weight: 5620,
    en_load: 680,

    ai_summary:
      'RaD製のスキャッターミサイル。攻撃力78×10、誘導180、1ロック、ロック時間0.5秒。有効射程2500。総弾数420と大量。EN負荷680と高め。',
    ai_tags: ['背部武器', 'ミサイル', 'スキャッター', '大量弾数', 'RaD'],
  }),

  defineBackUnit<AsMissile & WithBlast>()({
    id: 'BU038',

    name: '45-091 JVLN BETA',
    classification: backUnit,
    category: detonating_missile,
    attack_type: explosive,
    weapon_type: homing,
    manufacture: allmind,
    price: 210000,

    attack_power: 791,
    impact: 717,
    accumulative_impact: 563,
    blast_radius: 15,

    direct_hit_adjustment: 165,
    guidance: 360,
    effective_range: 360,
    homing_lock_time: 2.4,
    lock_count: 1,
    total_rounds: 32,
    reload_time: 3.6,
    ammunition_cost: 450,

    weight: 4250,
    en_load: 425,

    ai_summary:
      'オールマインド製の起爆ミサイル。攻撃力791、爆発半径15。誘導360と極めて高い。1ロック、ロック時間2.4秒。有効射程360と近距離。',
    ai_tags: ['背部武器', 'ミサイル', '起爆', '超高誘導', 'オールマインド'],
  }),

  defineBackUnit<AsMissile & WithIdealRange>()({
    id: 'BU039',

    name: 'EL-PW-01 TRUENO',
    classification: backUnit,
    category: needle_missile,
    attack_type: kinetic,
    weapon_type: homing,
    manufacture: elcano,
    price: 271000,

    attack_power: 415 * 2,
    impact: 385 * 2,
    accumulative_impact: 215 * 2,

    direct_hit_adjustment: 215,
    guidance: 110,
    ideal_range: 310,
    effective_range: 410,
    homing_lock_time: 4.2,
    lock_count: 1,
    total_rounds: 62,
    reload_time: 4.2,
    ammunition_cost: 300,

    weight: 3100,
    en_load: 420,

    ai_summary:
      'エルカノ製のニードルミサイル。攻撃力415×2、誘導110。理想射程310、有効射程410。1ロック、ロック時間4.2秒。実弾属性のミサイル武器。',
    ai_tags: ['背部武器', 'ミサイル', 'ニードル', '実弾', 'エルカノ'],
  }),

  defineBackUnit<AsPlasmaMissile>()({
    id: 'BU040',

    name: 'Vvc-703PM',
    classification: backUnit,
    category: plasma_missile,
    attack_type: energy,
    weapon_type: homing,
    manufacture: vcpl,
    price: 202000,

    attack_power: 760,
    impact: 384,
    accumulative_impact: 248,
    blast_radius: 26,

    direct_hit_adjustment: 125,
    guidance: 180,
    effective_range: 1500,
    homing_lock_time: 0.3,
    lock_count: 3,
    total_rounds: 120,
    reload_time: 4.0,
    ammunition_cost: 100,

    weight: 2310,
    en_load: 210,

    ai_summary:
      'VCPL製のプラズマミサイル。攻撃力760、爆発半径26。誘導180、3ロック、ロック時間0.3秒。有効射程1500。総弾数120。EN属性範囲攻撃。',
    ai_tags: ['背部武器', 'ミサイル', 'プラズマ', 'EN属性', 'VCPL'],
  }),
  defineBackUnit<AsPlasmaMissile>()({
    id: 'BU041',

    name: 'Vvc-706PM',
    classification: backUnit,
    category: plasma_missile,
    attack_type: energy,
    weapon_type: homing,
    manufacture: vcpl,
    price: 310000,

    attack_power: 760,
    impact: 384,
    accumulative_impact: 248,
    blast_radius: 26,

    direct_hit_adjustment: 125,
    guidance: 180,
    effective_range: 1500,
    homing_lock_time: 0.3,
    lock_count: 6,
    total_rounds: 210,
    reload_time: 6.0,
    ammunition_cost: 100,

    weight: 3900,
    en_load: 276,

    ai_summary:
      'VCPL製のプラズマミサイル。攻撃力760、爆発半径26。誘導180、6ロック、ロック時間0.3秒。有効射程1500。総弾数210と大量。',
    ai_tags: ['背部武器', 'ミサイル', 'プラズマ', 'EN属性', 'VCPL'],
  }),
  defineBackUnit<AsPlasmaMissile>()({
    id: 'BU042',

    name: 'Vvc-70VPM',
    classification: backUnit,
    category: plasma_missile,
    attack_type: energy,
    weapon_type: homing,
    manufacture: vcpl,
    price: 96000,

    attack_power: 760,
    impact: 384,
    accumulative_impact: 248,
    blast_radius: 26,

    direct_hit_adjustment: 125,
    guidance: 155,
    effective_range: 750,
    homing_lock_time: 0.5,
    lock_count: 5,
    total_rounds: 240,
    reload_time: 6.2,
    ammunition_cost: 150,

    weight: 3760,
    en_load: 268,

    ai_summary:
      'VCPL製のプラズマミサイル。攻撃力760、爆発半径26。誘導155、5ロック、ロック時間0.5秒。有効射程750と中距離。総弾数240。垂直発射型。',
    ai_tags: ['背部武器', 'ミサイル', 'プラズマ', '垂直', 'VCPL'],
  }),

  defineBackUnit<AsCoralMissile>()({
    id: 'BU043',

    name: 'IB-C03W3: NGI 006',
    classification: backUnit,
    category: coral_missile,
    attack_type: coral,
    weapon_type: homing,
    manufacture: rubicon_research_institute,
    price: 380000,

    attack_power: 827,
    impact: 720,
    accumulative_impact: 720,
    blast_radius: 36,

    charge_attack_power: 4078,
    charge_impact: 2496,
    charge_accumulative_impact: 2496,
    charge_blast_radius: 56,

    direct_hit_adjustment: 165,
    guidance: 110,
    effective_range: 1000,
    homing_lock_time: 4.9,
    lock_count: 1,

    charge_en_load: 932,
    charge_time: 3.5,
    charge_ammo_consumption: 1,

    total_rounds: 24,
    reload_time: 8.6,
    ammunition_cost: 650,

    weight: 4200,
    en_load: 783,

    ai_summary:
      '技研製のコーラルミサイル。通常攻撃力827、チャージ攻撃力4078。爆発半径36/56。誘導110、1ロック、ロック時間4.9秒。コーラル属性超高威力。',
    ai_tags: ['背部武器', 'ミサイル', 'コーラル', 'チャージ', '技研'],
  }),

  defineBackUnit<AsOrbit>()({
    id: 'BU044',

    name: 'BO-044 HUXLEY',
    classification: backUnit,
    category: bullet_orbit,
    attack_type: kinetic,
    weapon_type: burst,
    manufacture: balam,
    price: 305000,

    attack_power: 28 * 8,
    impact: 39 * 8,
    accumulative_impact: 15 * 8,

    direct_hit_adjustment: 175,
    ideal_range: 130,
    effective_range: 205,
    rapid_fire: 5.5,
    total_rounds: 240,
    cooling: 95,
    ammunition_cost: 50,

    weight: 2230,
    en_load: 435,

    ai_summary:
      'ベイラム社製の弾丸軌道兵器。攻撃力28×8のバースト射撃。理想射程130、有効射程205と近距離。連射速度5.5。自動追尾する弾丸軌道。実弾属性。',
    ai_tags: ['背部武器', '軌道兵器', '弾丸', 'バースト', 'ベイラム'],
  }),
  defineBackUnit<AsOrbit>()({
    id: 'BU045',

    name: '45-091 ORBT',
    classification: backUnit,
    category: laser_orbit,
    attack_type: energy,
    weapon_type: burst,
    manufacture: allmind,
    price: 280000,

    attack_power: 144 * 3,
    impact: 70 * 3,
    accumulative_impact: 39 * 3,

    direct_hit_adjustment: 135,
    ideal_range: 198,
    effective_range: 262,
    rapid_fire: 1.0,
    total_rounds: 165,
    cooling: 145,
    ammunition_cost: 100,

    weight: 2010,
    en_load: 446,

    ai_summary:
      'オールマインド製のレーザー軌道兵器。攻撃力144×3のバースト射撃。理想射程198、有効射程262。連射速度1.0。自動追尾するレーザー軌道。EN属性。',
    ai_tags: ['背部武器', '軌道兵器', 'レーザー', 'バースト', 'オールマインド'],
  }),
  defineBackUnit<AsTurret>()({
    id: 'BU046',

    name: 'VP-60LT',
    classification: backUnit,
    category: laser_turret,
    attack_type: energy,
    weapon_type: semi_auto,
    manufacture: arquebus,
    price: 194000,

    attack_power: 146 * 10,
    impact: 81 * 10,
    accumulative_impact: 39 * 10,

    direct_hit_adjustment: 135,
    ideal_range: 250,
    effective_range: 304,
    rapid_fire: 0.9,
    magazine_rounds: 3,
    total_rounds: 52,
    reload_time: 5.0,
    ammunition_cost: 500,

    weight: 2800,
    en_load: 560,

    ai_summary:
      'アーキバス社製のレーザータレット。攻撃力146×10。理想射程250、有効射程304。3連マガジン、連射速度0.9。総弾数52。EN属性の設置型武器。',
    ai_tags: ['背部武器', 'タレット', 'レーザー', '設置型', 'アーキバス'],
  }),
  defineBackUnit<AsLaserDrone>()({
    id: 'BU047',

    name: 'Vvc-700LD',
    classification: backUnit,
    category: laser_turret,
    attack_type: energy,
    weapon_type: homing,
    manufacture: vcpl,
    price: 247000,

    attack_power: 288 * 6,
    impact: 105 * 6,
    accumulative_impact: 63 * 6,

    charge_attack_power: 1370 * 2,
    charge_impact: 480 * 2,
    charge_accumulative_impact: 244 * 2,

    direct_hit_adjustment: 135,
    guidance: 360,
    effective_range: 400,
    homing_lock_time: 0.3,
    lock_count: 1,
    charge_time: 0.8,
    total_rounds: 120,
    reload_time: 10.0,
    ammunition_cost: 150,

    weight: 3800,
    en_load: 570,

    ai_summary:
      'VCPL製のレーザードローン。通常攻撃力288×6、チャージ攻撃力1370×2。誘導360、1ロック、ロック時間0.3秒。総弾数120。自律追尾型レーザー兵器。',
    ai_tags: ['背部武器', 'ドローン', 'レーザー', 'チャージ', 'VCPL'],
  }),
] as const
export type BackUnit = (typeof backUnits)[number]
