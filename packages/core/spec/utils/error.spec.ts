import { BaseCustomError } from '#core/utils/error'

import * as fc from 'fast-check'
import { describe, expect, test } from 'bun:test'

describe('CustomError', () => {
  test('can distinguish a error is instance of the class', () => {
    fc.assert(
      fc.property(genErrorWithConstructor(), ({ klass, error }) => {
        expect(error).toBeInstanceOf(klass)
      }),
    )
  })
  test('can distinguish a error is not instance of other custom classes', () => {
    fc.assert(
      fc.property(genErrorWithConstructor(), ({ other, error }) => {
        expect(error).not.toBeInstanceOf(other)
      }),
    )
  })
  test('is instance of built-in Error', () => {
    fc.assert(
      fc.property(genErrorWithConstructor(), ({ error }) => {
        expect(error).toBeInstanceOf(Error)
      }),
    )
  })
  test('provide constructor name as name property', () => {
    fc.assert(
      fc.property(genErrorWithConstructor(), ({ klass, error }) => {
        expect(error.name).toEqual(klass.name)
      }),
    )
  })
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
