import type { NotEquipped } from '#parts/types/base/category'
import { notEquipped } from '#parts/types/base/category'
import type { NotEquipped as NotEquippedClass } from '#parts/types/base/classification'
import { notEquipped as notEquippedClass } from '#parts/types/base/classification'
import type { NoneManufacture } from '#parts/types/base/manufacture'
import { noneManufacture } from '#parts/types/base/manufacture'
import type { ACParts, WithEnLoad } from '#parts/types/base/types'

const defineNotEquipped = (
  id: string,
): ACParts<NotEquippedClass, NoneManufacture, NotEquipped> & WithEnLoad =>
  ({
    id,
    name: '(Not Equipped)',
    classification: notEquippedClass,
    manufacture: noneManufacture,
    category: notEquipped,
    price: 0,
    weight: 0,
    en_load: 0,
    ai_summary: 'パーツが装備されていない状態',
    ai_tags: ['未装備', 'なし'],
  }) as const

export const boosterNotEquipped = defineNotEquipped('NE001')
export type BoosterNotEquipped = typeof boosterNotEquipped

export const expansionNotEquipped = defineNotEquipped('NE002')
export type ExpansionNotEquipped = typeof expansionNotEquipped

export const armNotEquipped = defineNotEquipped('NE003')
export type ArmNotEquipped = typeof armNotEquipped

export const backNotEquipped = defineNotEquipped('NE004')
export type BackNotEquipped = typeof backNotEquipped
