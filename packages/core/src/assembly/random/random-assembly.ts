import type { Assembly } from '#core/assembly/assembly'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
import { BaseError } from '@philomagi/base-error.js'
import { Result } from '@praha/byethrow'

import {
  defaultRandomBuildOption,
  randomBuild,
  type RandomBuildOption,
} from './random-builder'
import type { Validator } from './validator/base'
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
      return Result.unwrap(
        Result.pipe(
          this.validate(randomBuild(candidates, opt)),
          Result.orElse((errors) => {
            this.errors = [...this.errors, ...errors]

            if (this.tryCount >= this.config.limit) {
              const error = new OverTryLimitError(
                `over limit of try(${this.config.limit})`,
                { limit: this.config.limit, errors: this.errors },
              )

              throw error
            }

            return Result.succeed(this.assemble(candidates, option))
          }),
        ),
      )
    } finally {
      this.reset()
    }
  }

  validate(assembly: Assembly): Result.Result<Assembly, Error[]> {
    const failed = Object.values(this._validators)
      .map((v) => v.validate(assembly))
      .filter(Result.isFailure)

    return failed.length === 0
      ? Result.succeed(assembly)
      : Result.fail(failed.flatMap((f) => Result.unwrapError(f)))
  }

  /**
   * リトライ回数とエラー履歴をリセットする破壊的メソッド.
   */
  private reset() {
    this.tryCount = 0
    this.errors = []
  }
}

export class OverTryLimitError extends BaseError {
  constructor(message: string, private readonly option: { limit: number; errors: Error[] }) {
    super(message)
  }
  get limit(): number {
    return this.option.limit
  }
  get errors(): readonly Error[] {
    return this.option.errors
  }
}
export class OverwriteInnerSecretValidatorError extends BaseError {
  constructor(public readonly key: string) {
    super('Attempted to overwrite an inner secret validator')
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
