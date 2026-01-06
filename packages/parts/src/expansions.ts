import { expansion as expansionCategory } from '#parts/types/base/category'
import { expansion as expansionClass } from '#parts/types/base/classification'
import { noneManufacture } from '#parts/types/base/manufacture'

import {
  type AsAssaultArmor,
  type AsProtect,
  defineExpansion,
} from './types/expansion/types'

export const expansions = [
  defineExpansion<AsAssaultArmor>({
    id: 'EXP001',
    name: 'ASSAULT ARMOR',
    classification: expansionClass,
    category: expansionCategory,
    manufacture: noneManufacture,

    attack_power: 1500,
    impact: 2000,
    accumulative_impact: 1380,

    blast_radius: 60,
    effective_range: 200,

    direct_hit_adjustment: 230,

    price: 0,
    weight: 0,
    en_load: 0,

    ai_summary: 'アサルトアーマー。攻撃力1500、衝撃力2000、蓄積衝撃1380。爆発半径60、有効範囲200。近距離全方位攻撃で敵を吹き飛ばす緊急回避技。',
    ai_tags: ['拡張機能', 'アサルトアーマー', '全方位攻撃', '近接緊急回避', '標準装備'],
  }),
  defineExpansion<AsProtect>({
    id: 'EXP002',
    name: 'PULSE ARMOR',
    classification: expansionClass,
    category: expansionCategory,
    manufacture: noneManufacture,

    durability: 3300,
    time_limit: 10,

    price: 0,
    weight: 0,
    en_load: 0,

    ai_summary: 'パルスアーマー。耐久値3300、持続時間10秒。全方位バリアで一定時間ダメージを軽減。衝撃も無効化する。標準的な防御拡張。',
    ai_tags: ['拡張機能', 'パルスアーマー', '全方位バリア', '防御特化', '標準装備'],
  }),
  defineExpansion<AsProtect>({
    id: 'EXP003',
    name: 'PULSE PROTECTION',
    classification: expansionClass,
    category: expansionCategory,
    manufacture: noneManufacture,

    durability: 4000,
    time_limit: 25,

    price: 0,
    weight: 0,
    en_load: 0,

    ai_summary: 'パルスプロテクション。耐久値4000、持続時間25秒。バリアの強化版で耐久値と持続時間が大幅に向上。長時間の戦闘に有利。',
    ai_tags: ['拡張機能', 'パルスプロテクション', '長時間バリア', '高耐久防御', '上位装備'],
  }),
  defineExpansion<AsProtect>({
    id: 'EXP004',
    name: 'TERMINAL ARMOR',
    classification: expansionClass,
    category: expansionCategory,
    manufacture: noneManufacture,

    durability: 20000,
    time_limit: 2,

    price: 0,
    weight: 0,
    en_load: 0,

    ai_summary: 'ターミナルアーマー。耐久値20000と極めて高く、持続時間2秒と短い。瞬間的に超高耐久バリアを展開。決定的な攻撃を防ぐ緊急防御技。',
    ai_tags: ['拡張機能', 'ターミナルアーマー', '超高耐久バリア', '緊急防御', '瞬間防御'],
  }),
] as const

export type Expansion = (typeof expansions)[number]
