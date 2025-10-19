import type { Assembly } from '#core/assembly/assembly'

import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import { BaseCustomError } from '@ac6_assemble_tool/shared/error'

import type { Validator } from './base'
import { failure, success, type ValidationResult } from './result'

export const notOverEnergyOutputName = 'notOverEnergyOutput'
export const notOverEnergyOutput: Validator = {
  validate(assembly: Assembly): ValidationResult {
    return assembly.withinEnOutput
      ? success(assembly)
      : failure([
          new ValidationError(
            {
              validationName: notOverEnergyOutputName,
              adjustable: false,
            },
            'EN output error',
          ),
        ])
  },
} as const

export const notCarrySameUnitInSameSideName = 'notCarrySameUnitInSameSide'
export const notCarrySameUnitInSameSide: Validator = {
  validate(assembly: Assembly): ValidationResult {
    const errors = (() => {
      const rightErrors =
        assembly.rightArmUnit.classification !== notEquipped &&
        assembly.rightBackUnit.classification !== notEquipped &&
        assembly.rightArmUnit.name === assembly.rightBackUnit.name
          ? [
              new ValidationError(
                {
                  validationName: notCarrySameUnitInSameSideName,
                  adjustable: false,
                },
                `right arm unit and right back unit is same(${assembly.rightArmUnit.name})`,
              ),
            ]
          : []
      const leftErrors =
        assembly.leftArmUnit.classification !== notEquipped &&
        assembly.leftBackUnit.classification !== notEquipped &&
        assembly.leftArmUnit.name === assembly.leftBackUnit.name
          ? [
              new ValidationError(
                {
                  validationName: notCarrySameUnitInSameSideName,
                  adjustable: false,
                },
                `left arm unit and left back unit is same(${assembly.leftArmUnit.name})`,
              ),
            ]
          : []

      return [...rightErrors, ...leftErrors]
    })()

    return errors.length === 0 ? success(assembly) : failure(errors)
  },
}

export const totalCoamNotOverMaxName = 'totalCoamNotOverMax'
export const totalCoamNotOverMax = (max: number): Validator => ({
  validate(assembly: Assembly): ValidationResult {
    return assembly.coam <= max
      ? success(assembly)
      : failure([
          new ValidationError(
            { validationName: totalCoamNotOverMaxName, adjustable: true },
            `total coam of assembly(${assembly.coam}) over max(${max})`,
          ),
        ])
  },
})

export const totalLoadNotOverMaxName = 'totalLoadNotOverMax'
export const totalLoadNotOverMax = (max: number): Validator => ({
  validate(assembly: Assembly): ValidationResult {
    return assembly.load <= max
      ? success(assembly)
      : failure([
          new ValidationError(
            { validationName: totalLoadNotOverMaxName, adjustable: true },
            `total load of assembly(${assembly.load}) over max(${max})`,
          ),
        ])
  },
})

export const disallowLoadOverName = 'disallowLoadOver'
export const disallowLoadOver = (): Validator => ({
  validate(assembly: Assembly): ValidationResult {
    return assembly.withinLoadLimit
      ? success(assembly)
      : failure([
          new ValidationError(
            { validationName: disallowLoadOverName, adjustable: true },
            `load limit of assembly is (${assembly.loadLimit}), but load is ${assembly.load})`,
          ),
        ])
  },
})

export const disallowArmsLoadOverName = 'disallowArmsLoadOver'
export const disallowArmsLoadOver = (): Validator => ({
  validate(assembly: Assembly): ValidationResult {
    return assembly.withinArmsLoadLimit
      ? success(assembly)
      : failure([
          new ValidationError(
            { validationName: disallowArmsLoadOverName, adjustable: true },
            `arms load limit of assembly is (${assembly.armsLoadLimit}), but load is ${assembly.armsLoad})`,
          ),
        ])
  },
})

export type ValidationName =
  | typeof notOverEnergyOutputName
  | typeof notCarrySameUnitInSameSideName
  | typeof totalCoamNotOverMaxName
  | typeof totalLoadNotOverMaxName
  | typeof disallowLoadOverName
  | typeof disallowArmsLoadOverName

export class ValidationError extends BaseCustomError<{
  /**
   * バリデータの名前
   */
  validationName: ValidationName
  /**
   * 違反した状態をユーザーの調整で解消することを許すならtrue
   * 違反した状態をユーザーの調整で解消することを許さないならfalse
   *
   * ユーザーでの調整を許す場合、違反しても処理を止めずユーザーに通知するに留めること
   * ユーザーでの調整を許さない場合、違反した時点でエラーあるいは処理失敗とすること
   */
  adjustable: boolean
}> {
  get validatorName(): ValidationName {
    return this.customArgument.validationName
  }

  /**
   * 入力を調整することで回避の可能性を上げられる場合はtrue
   * 入力を調整することで回避の可能性を上げることが難しい or できない場合はfalse
   */
  get adjustable(): boolean {
    return this.customArgument.adjustable
  }
}
