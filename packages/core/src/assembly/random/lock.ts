import type { AssemblyKey, RawAssembly } from '#core/assembly/assembly'

import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'
import {
  notEquipped,
} from '@ac6_assemble_tool/parts/types/base/classification'
import {
  type Candidates,
  excludeNotEquipped,
  notTank,
  onlyTank,
} from '@ac6_assemble_tool/parts/types/candidates'

type LockedPartsMap = {
  [P in AssemblyKey]?: RawAssembly[P]
}
type Filter = (c: Candidates) => Candidates

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
  filter(candidates: Candidates, assembly?: { legs: RawAssembly['legs']; booster: RawAssembly['booster'] }): Candidates {
    return LockedParts.deriveFilter(this.map, assembly)(candidates)
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

  private static deriveFilter(
    map: LockedPartsMap,
    assembly?: { legs: RawAssembly['legs']; booster: RawAssembly['booster'] },
  ): Filter {
    const boosterPart = map.booster ?? assembly?.booster
    const legsPart = map.legs ?? assembly?.legs

    const requiresTank =
      boosterPart?.classification === notEquipped || legsPart?.category === tank
    const requiresNonTank =
      boosterPart?.classification !== undefined && boosterPart.classification !== notEquipped
        ? true
        : legsPart?.category !== undefined && legsPart.category !== tank

    if (requiresTank) {
      return (c) => ({
        ...c,
        legs: onlyTank(c.legs),
        booster: [boosterNotEquipped],
      })
    }

    if (requiresNonTank) {
      return (c) => ({
        ...c,
        legs: notTank(c.legs),
        booster: excludeNotEquipped(c.booster),
      })
    }

    return (c) => c
  }
}
