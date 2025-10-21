import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { fc, it } from '@fast-check/vitest'
import { Result } from '@praha/byethrow'
import { afterEach, beforeEach, describe, expect, type Mock, vi } from 'vitest'

import {
  OverTryLimitError,
  OverwriteInnerSecretValidatorError,
  RandomAssembly,
} from './random-assembly'
import type { Validator } from './validator/base'

describe(RandomAssembly.name, () => {
  it.prop([fc.array(generateValidatorWithKey())])(
    '[flaky test] should return only valid assembly',
    (validators) => {
      const sut = validators.reduce<RandomAssembly>(
        (r, { key, validator }) => r.addValidator(key, validator),
        RandomAssembly.init({ limit: 10000 }),
      )
      const assembly = sut.assemble(candidates)

      expect(Result.isSuccess(sut.validate(assembly))).toBe(true)
    },
  )

  describe('with validator', () => {
    describe('when add validator', () => {
      describe('with same key', () => {
        it.prop([generateValidator(), generateValidator()])(
          'return later validator for the key',
          (val1, val2) => {
            const sut = RandomAssembly.init({ limit: 10000 })
              .addValidator('key', val1)
              .addValidator('key', val2)

            expect(sut.getValidator('key')).toBe(val2)
          },
        )
        it.prop([generateValidator(), generateValidator()])(
          'count of validators should not change',
          (val1, val2) => {
            const sut1 = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              val1,
            )
            const sut2 = sut1.addValidator('key', val2)

            expect(sut1.validators.length).toBe(sut2.validators.length)
          },
        )
      })

      describe('with inner key', () => {
        const testValidator: Validator = {
          validate: () => {
            throw new Error('this should not be called')
          },
        }
        const sut = RandomAssembly.init()
        const key = '__inner__test'

        it('should throw error', () => {
          expect(() => sut.addValidator(key, testValidator)).toThrowError(
            OverwriteInnerSecretValidatorError,
          )
        })
        it('enable check what key occur error', () => {
          try {
            sut.addValidator(key, testValidator)

            expect.fail('should throw error')
          } catch (e) {
            if (e instanceof OverwriteInnerSecretValidatorError) {
              expect(e.key).toEqual(key)
            } else {
              expect.fail(`unexpected error ${e} thrown`)
            }
          }
        })
      })
    })
    describe('when get validator via unknown key', () => {
      it.prop([generateValidator()])(
        'contain only later validator',
        (validator) => {
          const sut = RandomAssembly.init().addValidator('key', validator)

          expect(sut.getValidator('unknown')).toBeNull()
        },
      )
    })
    describe('remove validator', () => {
      describe('with used key', () => {
        it.prop([generateValidator()])(
          'count of validators is same before add',
          (validator) => {
            const before = RandomAssembly.init({ limit: 10000 })
            const after = before
              .addValidator('key', validator)
              .removeValidator('key')

            expect(after.validators.length).toBe(before.validators.length)
          },
        )
        it.prop([generateValidator()])(
          'could not get the removed validator',
          (validator) => {
            const before = RandomAssembly.init({ limit: 10000 })
            const after = before
              .addValidator('key', validator)
              .removeValidator('key')

            expect(after.getValidator('key')).toBeNull()
          },
        )
      })

      describe('with unused key', () => {
        it.prop([generateValidator()])(
          'should not throw error',
          (validator) => {
            const sut = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              validator,
            )

            expect(() => sut.removeValidator('unknown-key')).not.toThrowError()
          },
        )
        it.prop([generateValidator()])(
          'count of validators is same before remove',
          (validator) => {
            const before = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              validator,
            )
            const after = before.removeValidator('unknown-key')

            expect(after.validators.length).toBe(before.validators.length)
          },
        )
        it.prop([generateValidator()])(
          'could not get validator the key',
          (validator) => {
            const before = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              validator,
            )
            const after = before.removeValidator('unknown-key')

            expect(after.validators.length).toBe(before.validators.length)
          },
        )
      })

      describe('with inner key', () => {
        const sut = RandomAssembly.init()
        const key = '__inner__test'

        it('should throw error', () => {
          expect(() => sut.removeValidator(key)).toThrowError(
            OverwriteInnerSecretValidatorError,
          )
        })
        it('enable check what key occur error', () => {
          try {
            sut.removeValidator(key)

            expect.fail('should throw error')
          } catch (e) {
            if (e instanceof OverwriteInnerSecretValidatorError) {
              expect(e.key).toEqual(key)
            } else {
              expect.fail(`unexpected error ${e} thrown`)
            }
          }
        })
      })
    })
  })

  describe('when over limit of try', () => {
    let mockValidate: Mock
    let validator: Validator
    const limit = 5

    beforeEach(() => {
      let errorCount = 0

      mockValidate = vi.fn().mockImplementation(() => {
        errorCount += 1
        return Result.fail([new Error(`test-${errorCount}`)])
      })
      validator = {
        validate: mockValidate,
      }
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw error', () => {
      const sut = RandomAssembly.init({ limit }).addValidator('test', validator)

      expect(() => sut.assemble(candidates)).toThrowError(OverTryLimitError)
      expect(mockValidate).toHaveBeenCalledTimes(limit)
    })
    it('should provide error reasons via error object', () => {
      const sut = RandomAssembly.init({ limit }).addValidator('test', validator)

      try {
        sut.assemble(candidates)
        expect.fail('should throw error')
      } catch (error) {
        if (error instanceof OverTryLimitError) {
          expect(error.errors.toSorted()).toEqual(
            expect.arrayContaining(
              [
                new Error('test-1'),
                new Error('test-2'),
                new Error('test-3'),
                new Error('test-4'),
                new Error('test-5'),
              ].toSorted(),
            ),
          )
        } else {
          expect.fail('should throw OverTryLimitError')
        }
      }
    })
    it('enable check how many tried', () => {
      const sut = RandomAssembly.init({ limit }).addValidator('test', validator)

      try {
        sut.assemble(candidates)
        expect.fail('should throw error')
      } catch (e) {
        if (e instanceof OverTryLimitError) {
          expect(e.limit).toEqual(limit)
        } else {
          expect.fail(`unexpected error ${e} thrown`)
        }
      }
    })
    it('can reuse same object after limit', () => {
      const sut = RandomAssembly.init({ limit }).addValidator('test', validator)

      expect(() => sut.assemble(candidates)).toThrowError(OverTryLimitError)
      expect(() => sut.assemble(candidates)).toThrowError(OverTryLimitError)

      expect(mockValidate).toHaveBeenCalledTimes(limit * 2)
    })
  })
})

const generateValidator = () =>
  fc.oneof(
    fc.integer({ min: 8480, max: 26740 }).map<Validator>((border) => ({
      validate: (a) =>
        a.arms.weight <= border
          ? Result.succeed(a)
          : Result.fail([new Error(`not arms.weight <= ${border}`)]),
    })),
    fc.constant<Validator>({
      validate: (a) =>
        a.head.manufacture === 'baws'
          ? Result.succeed(a)
          : Result.fail([new Error(`not head.manufacture = baws`)]),
    }),
    fc.constant<Validator>({
      validate: (a) =>
        a.core.price > 0
          ? Result.succeed(a)
          : Result.fail([new Error('not core.price > 0')]),
    }),
  )
const generateValidatorWithKey = () =>
  fc.record({
    key: fc.string({ minLength: 0 }),
    validator: generateValidator(),
  })
