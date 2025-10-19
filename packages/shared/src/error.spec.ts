import { fc, it } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

import { BaseCustomError } from '@ac6_assemble_tool/shared/error'

describe('CustomError', () => {
  it.prop([genErrorWithConstructor()])(
    'can distinguish a error is instance of the class',
    ({ klass, error }) => {
      expect(error).toBeInstanceOf(klass)
    },
  )
  it.prop([genErrorWithConstructor()])(
    'can distinguish a error is not instance of other custom classes',
    ({ other, error }) => {
      expect(error).not.toBeInstanceOf(other)
    },
  )
  it.prop([genErrorWithConstructor()])(
    'is instance of built-in Error',
    ({ error }) => {
      expect(error).toBeInstanceOf(Error)
    },
  )
  it.prop([genErrorWithConstructor()])(
    'provide constructor name as name property',
    ({ klass, error }) => {
      expect(error.name).toEqual(klass.name)
    },
  )
})

const genErrorWithConstructor = () =>
  fc.oneof(
    fc.record({
      klass: fc.constant(CustomErrorNum),
      other: fc.oneof(fc.constant(CustomErrorStr), fc.constant(CustomErrorObj)),
      error: fc.integer().map((v) => new CustomErrorNum(v)),
    }),
    fc.record({
      klass: fc.constant(CustomErrorStr),
      other: fc.oneof(fc.constant(CustomErrorNum), fc.constant(CustomErrorObj)),
      error: fc.string().map((v) => new CustomErrorStr(v)),
    }),
    fc.record({
      klass: fc.constant(CustomErrorObj),
      other: fc.oneof(fc.constant(CustomErrorNum), fc.constant(CustomErrorStr)),
      error: fc.object().map((v) => new CustomErrorObj(v)),
    }),
  )

class CustomErrorNum extends BaseCustomError<number> {
  toInt(): number {
    return this.customArgument
  }
}
class CustomErrorStr extends BaseCustomError<string> {
  toString(): string {
    return this.customArgument
  }
}
class CustomErrorObj extends BaseCustomError<object> {
  values(): object {
    return Object.values(this.customArgument)
  }
}
