import { fcs as fcsCategory } from './types/base/category'
import { fcs as fcsClass } from './types/base/classification'
import {
  arquebus_add,
  balam,
  furlong,
  rubicon_research_institute,
} from './types/base/manufacture'
import { defineFCS } from './types/inner/fcs'

export const fcses = [
  defineFCS({
    id: 'FCS001',
    name: 'FCS-G1/P01',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: furlong,
    price: 0,

    close_range_assist: 38,
    medium_range_assist: 27,
    long_range_assist: 20,
    missile_lock_correction: 79,
    multi_lock_correction: 40,

    weight: 80,
    en_load: 198,

    ai_summary:
      'ファーロン製FCS。近距離38、中距離27、遠距離20と全距離で標準的。ミサイルロック79、マルチロック40。価格0の初期装備。バランス型。',
    ai_tags: ['FCS', '初期装備', 'バランス型', 'ファーロン', '標準性能'],
  }),
  defineFCS({
    id: 'FCS002',
    name: 'FCS-G2/P05',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: furlong,
    price: 67000,

    close_range_assist: 42,
    medium_range_assist: 80,
    long_range_assist: 26,
    missile_lock_correction: 105,
    multi_lock_correction: 60,

    weight: 100,
    en_load: 232,

    ai_summary:
      'ファーロン製FCS。近距離42、中距離80と極めて高く、遠距離26。ミサイルロック105と高い。中距離戦闘特化型。',
    ai_tags: ['FCS', '中距離特化', 'ミサイル強化', 'ファーロン', '中近距離'],
  }),
  defineFCS({
    id: 'FCS003',
    name: 'FCS-G2/P10SLT',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: furlong,
    price: 96000,

    close_range_assist: 31,
    medium_range_assist: 41,
    long_range_assist: 29,
    missile_lock_correction: 128,
    multi_lock_correction: 90,

    weight: 120,
    en_load: 209,

    ai_summary:
      'ファーロン製FCS。近中遠距離アシストは控えめ。ミサイルロック128、マルチロック90と極めて高い。マルチロックミサイル特化型。',
    ai_tags: [
      'FCS',
      'マルチロック特化',
      'ミサイル強化',
      'ファーロン',
      '広範囲ロック',
    ],
  }),
  defineFCS({
    id: 'FCS004',
    name: 'FCS-G2/P12SML',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: furlong,
    price: 141000,

    close_range_assist: 28,
    medium_range_assist: 52,
    long_range_assist: 30,
    missile_lock_correction: 118,
    multi_lock_correction: 120,

    weight: 130,
    en_load: 278,

    ai_summary:
      'ファーロン製FCS。近中遠距離アシストは控えめ。マルチロック120と最高クラス、ミサイルロック118も高い。超マルチロック特化型。',
    ai_tags: [
      'FCS',
      '最高マルチロック',
      'ミサイル強化',
      'ファーロン',
      '最多同時ロック',
    ],
  }),
  defineFCS({
    id: 'FCS005',
    name: 'FC-006 ABBOT',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: balam,
    price: 135000,

    close_range_assist: 70,
    medium_range_assist: 32,
    long_range_assist: 5,
    missile_lock_correction: 74,
    multi_lock_correction: 46,

    weight: 90,
    en_load: 266,

    ai_summary:
      'ベイラム製FCS。近距離70と極めて高く、中距離32、遠距離5と極めて低い。ミサイルロック74。完全な近距離戦闘特化型。',
    ai_tags: ['FCS', '近距離特化', '接近戦', 'ベイラム', '格闘向け'],
  }),
  defineFCS({
    id: 'FCS006',
    name: 'FC-008 TALBOT',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: balam,
    price: 155000,

    close_range_assist: 63,
    medium_range_assist: 54,
    long_range_assist: 11,
    missile_lock_correction: 103,
    multi_lock_correction: 62,

    weight: 140,
    en_load: 312,

    ai_summary:
      'ベイラム製FCS。近距離63、中距離54と高く、遠距離11と低い。ミサイルロック103、マルチロック62。近中距離バランス型。',
    ai_tags: ['FCS', '近中距離型', 'ミサイル強化', 'ベイラム', '中近距離'],
  }),
  defineFCS({
    id: 'FCS007',
    name: 'VE-21A',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: arquebus_add,
    price: 228000,

    close_range_assist: 36,
    medium_range_assist: 67,
    long_range_assist: 92,
    missile_lock_correction: 65,
    multi_lock_correction: 79,

    weight: 85,
    en_load: 364,

    ai_summary:
      'アーキバス先進開発局製FCS。近距離36、中距離67、遠距離92と極めて高い。重量85と最軽量。遠距離狙撃特化型。',
    ai_tags: [
      'FCS',
      '遠距離特化',
      '狙撃向け',
      'アーキバス先進開発局',
      '最軽量',
    ],
  }),
  defineFCS({
    id: 'FCS008',
    name: 'VE-21B',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: arquebus_add,
    price: 315000,

    close_range_assist: 15,
    medium_range_assist: 76,
    long_range_assist: 80,
    missile_lock_correction: 97,
    multi_lock_correction: 70,

    weight: 160,
    en_load: 388,

    ai_summary:
      'アーキバス先進開発局製FCS。近距離15と極めて低く、中距離76、遠距離80と高い。ミサイルロック97、マルチロック70。中遠距離特化型。',
    ai_tags: [
      'FCS',
      '中遠距離特化',
      '遠距離向け',
      'アーキバス先進開発局',
      '中遠距離',
    ],
  }),
  defineFCS({
    id: 'FCS009',
    name: 'IA-C01F: OCELLUS',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: rubicon_research_institute,
    price: 367000,

    close_range_assist: 90,
    medium_range_assist: 12,
    long_range_assist: 3,
    missile_lock_correction: 85,
    multi_lock_correction: 50,

    weight: 130,
    en_load: 292,

    ai_summary:
      '技研製FCS。近距離90と最高クラス、中距離12、遠距離3と極めて低い。ミサイルロック85。超近距離格闘特化型。',
    ai_tags: ['FCS', '最高近距離', '超近接特化', '技研', '格闘専用'],
  }),
  defineFCS({
    id: 'FCS010',
    name: 'IB-C03F: WLT 001',
    classification: fcsClass,
    category: fcsCategory,
    manufacture: rubicon_research_institute,
    price: 400000,

    close_range_assist: 58,
    medium_range_assist: 77,
    long_range_assist: 54,
    missile_lock_correction: 102,
    multi_lock_correction: 66,

    weight: 150,
    en_load: 486,

    ai_summary:
      '技研製FCS。近距離58、中距離77、遠距離54と全距離で高い。ミサイルロック102、マルチロック66。EN負荷486と最高。全距離対応高性能型。',
    ai_tags: ['FCS', '全距離高性能', 'バランス型', '技研', '高EN負荷'],
  }),
] as const
export type FCS = (typeof fcses)[number]
