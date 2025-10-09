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
  }),
] as const
export type FCS = (typeof fcses)[number]
