import type { AssemblyKey, RawAssembly } from '#core/assembly/assembly'

import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import {
  notEquipped,
} from '@ac6_assemble_tool/parts/types/base/classification'

type LockedPartsMap = {
  [P in AssemblyKey]?: RawAssembly[P]
}

export class LockedParts {
  static get empty(): LockedParts {
    return LockedParts.create({})
  }

  constructor(private readonly map: LockedPartsMap) {}

  get<K extends AssemblyKey>(
    target: K,
    fallback: () => NonNullable<LockedPartsMap[K]>,
  ): NonNullable<LockedPartsMap[K]> {
    return this.map[target] || fallback()
  }
  peek<K extends AssemblyKey>(target: K): LockedPartsMap[K] | undefined {
    return this.map[target]
  }

  lock<K extends AssemblyKey>(target: K, item: RawAssembly[K]): LockedParts {
    const nextMap = { ...this.map, [target]: item }
    const normalized = LockedParts.normalize(nextMap, target)

    return LockedParts.create(normalized)
  }
  unlock<K extends AssemblyKey>(target: K): LockedParts {
    const copyMap = { ...this.map }
    delete copyMap[target]

    return LockedParts.create(copyMap)
  }
  isLocking(key: AssemblyKey): boolean {
    return !!this.map[key]
  }

  get lockedKeys(): Array<keyof RawAssembly> {
    return Object.keys(this.map) as Array<keyof RawAssembly>
  }
  get list(): Array<RawAssembly[keyof RawAssembly]> {
    return Object.values(this.map)
  }

  private static create(map: LockedPartsMap) {
    return new LockedParts(map)
  }

  private static normalize(
    map: LockedPartsMap,
    lastChanged: AssemblyKey,
  ): LockedPartsMap {
    if (!map.booster || !map.legs) return map

    const compatible = LockedParts.isCompatible(map.booster, map.legs)
    if (compatible) return map

    const copy = { ...map }
    const toDelete = lastChanged === 'booster' ? 'legs' : 'booster'
    delete copy[toDelete]

    return copy
  }

  private static isCompatible(
    boosterPart: NonNullable<LockedPartsMap['booster']>,
    legsPart: NonNullable<LockedPartsMap['legs']>,
  ): boolean {
    const boosterIsNotEquipped = boosterPart.classification === notEquipped
    const legsIsTank = legsPart.category === tank

    return (boosterIsNotEquipped && legsIsTank) || (!boosterIsNotEquipped && !legsIsTank)
  }

}
