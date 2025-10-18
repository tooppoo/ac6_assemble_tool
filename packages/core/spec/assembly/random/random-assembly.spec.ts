import {
  OverTryLimitError,
  OverwriteInnerSecretValidatorError,
  RandomAssembly,
} from '#core/assembly/random/random-assembly'
import type { Validator } from '#core/assembly/random/validator/base'
import { failure, success } from '#core/assembly/random/validator/result'

import { candidates } from '@ac6_assemble_tool/parts/versions/v1.06.1'
import { afterEach, beforeEach, describe, expect, it, test, type Mock, vi } from 'bun:test'
import * as fc from 'fast-check'

describe(RandomAssembly.name, () => {
  test('should return only valid assembly', () => {
    fc.assert(fc.property(fc.array(generateValidatorWithKey()), (validators) => {
      const sut = validators.reduce<RandomAssembly>(
        (r, { key, validator }) => r.addValidator(key, validator),
        RandomAssembly.init({ limit: 10000 }),
      )
      const assembly = sut.assemble(candidates)

      return sut.validate(assembly).isSuccess
    }))
  })

  describe('with validator', () => {
    describe('when add validator', () => {
      describe('with same key', () => {
        test('return later validator for the key', () => {
          fc.assert(fc.property(generateValidator(), generateValidator(), (val1, val2) => {
            const sut = RandomAssembly.init({ limit: 10000 })
              .addValidator('key', val1)
              .addValidator('key', val2)

            expect(sut.getValidator('key')).toBe(val2)
          }))
        })
        test('count of validators should not change', () => {
          fc.assert(fc.property(generateValidator(), generateValidator(), (val1, val2) => {
            const sut1 = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              val1,
            )
            const sut2 = sut1.addValidator('key', val2)

            expect(sut1.validators.length).toBe(sut2.validators.length)
          }))
        })
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
      test('contain only later validator', () => {
        fc.assert(fc.property(generateValidator(), (validator) => {
          const sut = RandomAssembly.init().addValidator('key', validator)

          expect(sut.getValidator('unknown')).toBeNull()
        }))
      })
    })
    describe('remove validator', () => {
      describe('with used key', () => {
        test('count of validators is same before add', () => {
          fc.assert(fc.property(generateValidator(), (validator) => {
            const before = RandomAssembly.init({ limit: 10000 })
            const after = before
              .addValidator('key', validator)
              .removeValidator('key')

            expect(after.validators.length).toBe(before.validators.length)
          }))
        })
        test('could not get the removed validator', () => {
          fc.assert(fc.property(generateValidator(), (validator) => {
            const before = RandomAssembly.init({ limit: 10000 })
            const after = before
              .addValidator('key', validator)
              .removeValidator('key')

            expect(after.getValidator('key')).toBeNull()
          }))
        })
      })

      describe('with unused key', () => {
        test('should not throw error', () => {
          fc.assert(fc.property(generateValidator(), (validator) => {
            const sut = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              validator,
            )

            expect(() => sut.removeValidator('unknown-key')).not.toThrowError()
          }))
        })
        test('count of validators is same before remove', () => {
          fc.assert(fc.property(generateValidator(), (validator) => {
            const before = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              validator,
            )
            const after = before.removeValidator('unknown-key')

            expect(after.validators.length).toBe(before.validators.length)
          }))
        })
        test('could not get validator the key', () => {
          fc.assert(fc.property(generateValidator(), (validator) => {
            const before = RandomAssembly.init({ limit: 10000 }).addValidator(
              'key',
              validator,
            )
            const after = before.removeValidator('unknown-key')

            expect(after.validators.length).toBe(before.validators.length)
          }))
        })
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
        return failure([new Error(`test-${errorCount}`)])
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
          ? success(a)
          : failure([new Error(`not arms.weight <= ${border}`)]),
    })),
    fc.constant<Validator>({
      validate: (a) =>
        a.head.manufacture === 'baws'
          ? success(a)
          : failure([new Error(`not head.manufacture = baws`)]),
    }),
    fc.constant<Validator>({
      validate: (a) =>
        a.core.price > 0
          ? success(a)
          : failure([new Error('not core.price > 0')]),
    }),
  )
const generateValidatorWithKey = () =>
  fc.record({
    key: fc.string({ minLength: 0 }),
    validator: generateValidator(),
  })
