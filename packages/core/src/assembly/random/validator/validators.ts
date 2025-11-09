import { notEquipped } from '@ac6_assemble_tool/parts/types/base/classification'
import { BaseError } from '@philomagi/base-error.js'
import { Result } from '@praha/byethrow'

import type { Validator } from './base'

export const notOverEnergyOutputName = 'notOverEnergyOutput'
export const notOverEnergyOutput: Validator = {
  validate(assembly) {
    return assembly.withinEnOutput
      ? Result.succeed(assembly)
      : Result.fail([
          new ValidationError('EN output error', {
            validationName: notOverEnergyOutputName,
            adjustable: false,
          }),
        ])
  },
} as const

export const notCarrySameUnitInSameSideName = 'notCarrySameUnitInSameSide'
export const notCarrySameUnitInSameSide: Validator = {
  validate(assembly) {
    const errors = (() => {
      const rightErrors =
        assembly.rightArmUnit.classification !== notEquipped &&
        assembly.rightBackUnit.classification !== notEquipped &&
        assembly.rightArmUnit.name === assembly.rightBackUnit.name
          ? [
              new ValidationError(
                `right arm unit and right back unit is same(${assembly.rightArmUnit.name})`,
                {
                  validationName: notCarrySameUnitInSameSideName,
                  adjustable: false,
                },
              ),
            ]
          : []
      const leftErrors =
        assembly.leftArmUnit.classification !== notEquipped &&
        assembly.leftBackUnit.classification !== notEquipped &&
        assembly.leftArmUnit.name === assembly.leftBackUnit.name
          ? [
              new ValidationError(
                `left arm unit and left back unit is same(${assembly.leftArmUnit.name})`,
                {
                  validationName: notCarrySameUnitInSameSideName,
                  adjustable: false,
                },
              ),
            ]
          : []

      return [...rightErrors, ...leftErrors]
    })()

    return errors.length === 0 ? Result.succeed(assembly) : Result.fail(errors)
  },
}

export const totalCoamNotOverMaxName = 'totalCoamNotOverMax'
export const totalCoamNotOverMax = (max: number): Validator => ({
  validate(assembly) {
    return assembly.coam <= max
      ? Result.succeed(assembly)
      : Result.fail([
          new ValidationError(
            `total coam of assembly(${assembly.coam}) over max(${max})`,
            { validationName: totalCoamNotOverMaxName, adjustable: true },
          ),
        ])
  },
})

export const totalLoadNotOverMaxName = 'totalLoadNotOverMax'
export const totalLoadNotOverMax = (max: number): Validator => ({
  validate(assembly) {
    return assembly.load <= max
      ? Result.succeed(assembly)
      : Result.fail([
          new ValidationError(
            `total load of assembly(${assembly.load}) over max(${max})`,
            { validationName: totalLoadNotOverMaxName, adjustable: true },
          ),
        ])
  },
})

export const disallowLoadOverName = 'disallowLoadOver'
export const disallowLoadOver = (): Validator => ({
  validate(assembly) {
    return assembly.withinLoadLimit
      ? Result.succeed(assembly)
      : Result.fail([
          new ValidationError(
            `load limit of assembly is (${assembly.loadLimit}), but load is ${assembly.load})`,
            { validationName: disallowLoadOverName, adjustable: true },
          ),
        ])
  },
})

export const disallowArmsLoadOverName = 'disallowArmsLoadOver'
export const disallowArmsLoadOver = (): Validator => ({
  validate(assembly) {
    return assembly.withinArmsLoadLimit
      ? Result.succeed(assembly)
      : Result.fail([
          new ValidationError(
            `arms load limit of assembly is (${assembly.armsLoadLimit}), but load is ${assembly.armsLoad})`,
            { validationName: disallowArmsLoadOverName, adjustable: true },
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

export class ValidationError extends BaseError {
  constructor(
    message: string,
    private readonly option: {
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
    },
  ) {
    super(message)
  }
  get validatorName(): ValidationName {
    return this.option.validationName
  }

  /**
   * 入力を調整することで回避の可能性を上げられる場合はtrue
   * 入力を調整することで回避の可能性を上げることが難しい or できない場合はfalse
   */
  get adjustable(): boolean {
    return this.option.adjustable
  }
}
