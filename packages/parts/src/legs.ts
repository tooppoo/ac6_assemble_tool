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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
  defineLegs<TwoLegsCategory, AsJumper>()({
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
  }),
] as const
export type TwoLegs = (typeof twoLegs)[number]

export const reverseJoints = [
  defineLegs<ReverseJointCategory, AsJumper>()({
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
  }),
  defineLegs<ReverseJointCategory, AsJumper>()({
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
  }),
  defineLegs<ReverseJointCategory, AsJumper>()({
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
  }),
] as const
export type ReverseJoint = (typeof reverseJoints)[number]

export const fourLegs = [
  defineLegs<FourLegsCategory, AsJumper>()({
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
  }),
  defineLegs<FourLegsCategory, AsJumper>()({
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
  }),
  defineLegs<FourLegsCategory, AsJumper>()({
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
  }),
] as const
export type FourLegs = (typeof fourLegs)[number]

export const tanks = [
  defineLegs<TankCategory, AsTank>()({
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
  }),
  defineLegs<TankCategory, AsTank>()({
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
  }),
  defineLegs<TankCategory, AsTank>()({
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
