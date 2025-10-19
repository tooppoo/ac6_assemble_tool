import type { Assembly } from '#core/assembly/assembly'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { BaseCustomError } from '@ac6_assemble_tool/shared/error'

import {
  defaultRandomBuildOption,
  randomBuild,
  type RandomBuildOption,
} from './random-builder'
import type { Validator } from './validator/base'
import { success, type ValidationResult } from './validator/result'
import {
  notCarrySameUnitInSameSide,
  notOverEnergyOutput,
} from './validator/validators'

export class RandomAssembly {
  static init(
    config: RandomAssemblyConfig = defaultAssemblyConfig,
  ): RandomAssembly {
    return new RandomAssembly(
      {
        [genInnerSecretKey(`notOverEnergyOutput`)]: notOverEnergyOutput,
        [genInnerSecretKey(`notCarrySameUnitInSameSide`)]:
          notCarrySameUnitInSameSide,
      },
      config,
    )
  }

  private tryCount: number = 0
  private errors: Error[] = []

  private constructor(
    private readonly _validators: Record<string, Validator>,
    private readonly config: RandomAssemblyConfig,
  ) {}

  addValidator(key: string, validator: Validator): RandomAssembly {
    if (isInnerSecretKey(key)) {
      throw new OverwriteInnerSecretValidatorError(key)
    }
    return new RandomAssembly(
      { ...this._validators, [key]: validator },
      this.config,
    )
  }
  removeValidator(key: string): RandomAssembly {
    if (isInnerSecretKey(key)) {
      throw new OverwriteInnerSecretValidatorError(key)
    }
    if (this.getValidator(key) === null) {
      return this
    }

    const validators = Object.entries(this._validators).reduce(
      (acc, [k, v]) => (k === key ? acc : { ...acc, [k]: v }),
      {},
    )

    return new RandomAssembly(validators, this.config)
  }
  getValidator(key: string): Validator | null {
    return this._validators[key] || null
  }
  get validators(): Validator[] {
    return Object.values(this._validators)
  }

  assemble(
    candidates: Candidates,
    option: RandomBuildOption = defaultRandomBuildOption,
  ): Assembly {
    this.tryCount += 1

    const opt = { ...defaultRandomBuildOption, ...option }

    try {
      return this.validate(randomBuild(candidates, opt)).fold(
        (errors) => {
          this.errors = [...this.errors, ...errors]

          if (this.tryCount >= this.config.limit) {
            throw new OverTryLimitError(
              { limit: this.config.limit, errors: this.errors },
              `over limit of try(${this.config.limit})`,
            )
          }

          return this.assemble(candidates, option)
        },
        (a) => a,
      )
    } finally {
      this.reset()
    }
  }

  validate(assembly: Assembly): ValidationResult {
    return Object.values(this._validators).reduce(
      (r, v) => r.concat(v.validate(assembly)),
      success(assembly),
    )
  }

  private reset() {
    this.tryCount = 0
    this.errors = []
  }
}

export class OverTryLimitError extends BaseCustomError<{
  limit: number
  errors: Error[]
}> {
  get limit(): number {
    return this.customArgument.limit
  }
  get errors(): readonly Error[] {
    return this.customArgument.errors
  }
}
export class OverwriteInnerSecretValidatorError extends BaseCustomError<string> {
  get key(): string {
    return this.customArgument
  }
}

const innerSecretKey = '__inner__' as const
function genInnerSecretKey(key: string) {
  return `${innerSecretKey}${key}` as const
}
function isInnerSecretKey(key: string): boolean {
  return key.startsWith(innerSecretKey)
}

type RandomAssemblyConfig = Readonly<{
  limit: number
}>
const defaultAssemblyConfig: RandomAssemblyConfig = {
  limit: 1000,
}
