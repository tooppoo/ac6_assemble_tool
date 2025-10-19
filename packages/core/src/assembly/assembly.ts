import { sum } from '@ac6_assemble_tool/shared/array'

import type * as ArmUnits from '@ac6_assemble_tool/parts/arm-units'
import type { Arms } from '@ac6_assemble_tool/parts/arms'
import type * as BackUnits from '@ac6_assemble_tool/parts/back-units'
import type * as Boosters from '@ac6_assemble_tool/parts/booster'
import type { Core } from '@ac6_assemble_tool/parts/cores'
import type * as Expansion from '@ac6_assemble_tool/parts/expansions'
import type { FCS } from '@ac6_assemble_tool/parts/fces'
import type { Generator } from '@ac6_assemble_tool/parts/generators'
import type { Head } from '@ac6_assemble_tool/parts/heads'
import type { LegsNotTank, LegsTank } from '@ac6_assemble_tool/parts/legs'
import type {
  ArmNotEquipped,
  BackNotEquipped,
  BoosterNotEquipped,
  ExpansionNotEquipped,
} from '@ac6_assemble_tool/parts/not-equipped'
import { tank } from '@ac6_assemble_tool/parts/types/base/category'

export function spaceByWord(key: AssemblyKey): string {
  return key.replaceAll(/([A-Z])/g, ' $1')
}

export function assemblyKeys(): AssemblyKey[] {
  return [
    'rightArmUnit',
    'leftArmUnit',
    'rightBackUnit',
    'leftBackUnit',
    'head',
    'core',
    'arms',
    'legs',
    'booster',
    'fcs',
    'generator',
    'expansion',
  ]
}

export type Assembly = RawAssembly & AssemblyProperty
export type AssemblyProperty = {
  readonly ap: number
  /** 耐弾防御 */
  readonly antiKineticDefense: number
  /** 耐EN防御 */
  readonly antiEnergyDefense: number
  /** 耐爆防御 */
  readonly antiExplosiveDefense: number
  /** 姿勢安定性能 */
  readonly attitudeStability: number

  /** 総重量 */
  readonly weight: number
  /** 総積載量 */
  readonly load: number
  /** 積載上限 */
  readonly loadLimit: number

  /** 腕部積載量 */
  readonly armsLoad: number
  /** 腕部積載上限 */
  readonly armsLoadLimit: number
  /** 近接武器適正 */
  readonly melesSpecialization: number
  /** 近接武器適正 */
  readonly melesRatio: number

  /** EN負荷 */
  readonly enLoad: number
  /** EN出力 */
  readonly enOutput: number
  /** EN容量 */
  readonly enCapacity: number
  /** EN余剰 */
  readonly enSurplus: number
  /** EN供給効率 */
  readonly enSupplyEfficiency: number
  /** EN補充遅延 */
  readonly enRechargeDelay: number
  /** EN復元遅延 */
  readonly enRecoveryDelay: number
  /** 復元時補充EN */
  readonly postRecoveryEnSupply: number
  /** EN射撃武器適正 */
  readonly enFirearmSpec: number
  /** EN射撃武器倍率 */
  readonly enFirearmRatio: number

  /** QB消費EN */
  readonly qbEnConsumption: number

  /** 総COAM */
  readonly coam: number

  /**
   * @return {boolean} 積載量が積載上限以内の場合にtrue
   */
  readonly withinLoadLimit: boolean
  /**
   * @return {boolean} 腕部積載量が腕部積載上限以内の場合にtrue
   */
  readonly withinArmsLoadLimit: boolean
  /**
   * @return {boolean} EN出力がEN負荷以上の場合にtrue
   */
  readonly withinEnOutput: boolean
}

export function createAssembly(base: RawAssembly): Assembly {
  return {
    ...base,
    get ap(): number {
      return sum([this.head, this.core, this.arms, this.legs].map((p) => p.ap))
    },
    get antiKineticDefense(): number {
      return sum(extractFrames(this).map((p) => p.anti_kinetic_defense))
    },
    get antiEnergyDefense(): number {
      return sum(extractFrames(this).map((p) => p.anti_energy_defense))
    },
    get antiExplosiveDefense(): number {
      return sum(extractFrames(this).map((p) => p.anti_explosive_defense))
    },
    get weight(): number {
      return sum(
        [
          this.rightArmUnit,
          this.leftArmUnit,
          this.rightBackUnit,
          this.leftBackUnit,
          this.head,
          this.core,
          this.arms,
          this.legs,
          this.booster,
          this.fcs,
          this.generator,
        ].map((p) => p.weight),
      )
    },
    get load(): number {
      return this.weight - this.legs.weight
    },
    get loadLimit(): number {
      return this.legs.load_limit
    },
    get armsLoad(): number {
      return sum([this.rightArmUnit, this.leftArmUnit].map((p) => p.weight))
    },
    get armsLoadLimit(): number {
      return this.arms.arms_load_limit
    },
    get melesSpecialization(): number {
      return this.arms.melee_specialization
    },
    get melesRatio(): number {
      return Math.floor((this.melesSpecialization + 100) / 2)
    },
    get enLoad(): number {
      return sum(
        [
          this.rightArmUnit,
          this.rightBackUnit,
          this.leftArmUnit,
          this.leftBackUnit,
          this.head,
          this.core,
          this.arms,
          this.legs,
          this.booster,
          this.fcs,
        ].map((p) => p.en_load),
      )
    },
    get enCapacity(): number {
      return this.generator.en_capacity
    },
    get enSurplus(): number {
      return this.enOutput - this.enLoad
    },
    get enOutput(): number {
      return Math.floor(
        this.generator.en_output *
          (this.core.generator_output_adjective * 0.01),
      )
    },
    get enSupplyEfficiency(): number {
      if (this.enSurplus >= 1800) {
        return Math.floor(9000 + ((this.enSurplus - 1800) * 75) / 17)
      } else if (this.enSurplus >= 0) {
        return Math.floor(1500 + (this.enSurplus * 25) / 6)
      } else {
        return 100
      }
    },
    get enRechargeDelay(): number {
      const base =
        1000 /
        ((this.generator.en_recharge / 100) *
          this.core.generator_supply_adjective)

      // 小数点第四位で四捨五入した後、小数点第三位で切り捨て？
      // 単に第三位で切り捨てるとMELANDER C3 + VP-20Dで
      // 第三位で切り上げ or 四捨五入するとNACHTREIHER + VP-20Cで
      // 計算が一致しなくなる
      return Math.floor(Math.round(base * 1000) / 10) / 100
    },
    get enRecoveryDelay(): number {
      const base =
        1000 /
        (this.generator.supply_recovery *
          (this.core.generator_supply_adjective * 0.01))

      return Math.floor(base * 100) * 0.01
    },
    get postRecoveryEnSupply(): number {
      return this.generator.post_recovery_en_supply
    },
    get enFirearmSpec(): number {
      return this.generator.energy_firearm_spec
    },
    get enFirearmRatio(): number {
      return Math.floor((this.enFirearmSpec + 100) / 2)
    },
    get qbEnConsumption(): number {
      const qbEnConsumption = isTank(this)
        ? this.legs.qb_en_consumption
        : this.booster.qb_en_consumption

      return Math.floor(
        qbEnConsumption * (200 - this.core.booster_efficiency_adjective) * 0.01,
      )
    },
    get coam(): number {
      return sum(
        [
          this.rightArmUnit,
          this.rightBackUnit,
          this.leftArmUnit,
          this.leftBackUnit,
          this.head,
          this.core,
          this.arms,
          this.legs,
          this.booster,
          this.fcs,
          this.generator,
        ].map((p) => p.price),
      )
    },
    get attitudeStability(): number {
      return sum(
        [this.head, this.core, this.legs].map((p) => p.attitude_stability),
      )
    },
    get withinLoadLimit(): boolean {
      return this.load <= this.loadLimit
    },
    get withinArmsLoadLimit(): boolean {
      return this.armsLoad <= this.armsLoadLimit
    },
    get withinEnOutput(): boolean {
      return this.enSurplus >= 0
    },
  }
}

export type RawAssembly = AssemblyNotTank | AssemblyWithTank
export type AssemblyKey = keyof RawAssembly

function isTank(
  assembly: Assembly | RawAssembly,
): assembly is AssemblyWithTank {
  return assembly.legs.category === tank
}

type AssemblyNotTank = BaseAssembly & {
  legs: LegsNotTank
  booster: Boosters.Booster
}
type AssemblyWithTank = BaseAssembly & {
  legs: LegsTank
  booster: BoosterNotEquipped
}
type BaseAssembly = {
  rightArmUnit: ArmUnits.ArmUnit | ArmNotEquipped
  leftArmUnit: ArmUnits.ArmUnit | ArmUnits.LeftArmUnit | ArmNotEquipped
  rightBackUnit: ArmUnits.ArmUnit | BackUnits.BackUnit | BackNotEquipped
  leftBackUnit:
    | ArmUnits.ArmUnit
    | ArmUnits.LeftArmUnit
    | BackUnits.BackUnit
    | BackUnits.LeftBackUnit
    | BackNotEquipped

  head: Head
  core: Core
  arms: Arms

  fcs: FCS
  generator: Generator
  expansion: Expansion.Expansion | ExpansionNotEquipped
}

function extractFrames(assembly: Assembly) {
  return [assembly.head, assembly.core, assembly.arms, assembly.legs]
}
