import type { Assembly } from '#core/assembly/assembly'

import { describe, expect, it } from 'vitest'

import { failure, success } from './result'

describe('validator/result', () => {
  const assemble = { id: 'dummy' } as never as Assembly
  const e = (n: number) => new Error(`error-${n}`)

  describe.each([
    {
      a: success(assemble),
      b: success(assemble),
      expectedIsSuccess: true,
      expectedAssembly: assemble,
      expectedErrors: null,
    },
    {
      a: success(assemble),
      b: failure([e(2)]),
      expectedIsSuccess: false,
      expectedAssembly: null,
      expectedErrors: [e(2)],
    },
    {
      a: failure([e(1)]),
      b: success(assemble),
      expectedIsSuccess: false,
      expectedAssembly: null,
      expectedErrors: [e(1)],
    },
    {
      a: failure([e(1)]),
      b: failure([e(2)]),
      expectedIsSuccess: false,
      expectedAssembly: null,
      expectedErrors: [e(1), e(2)],
    },
  ])(
    '$a concat $b',
    ({ a, b, expectedIsSuccess, expectedAssembly, expectedErrors }) => {
      it(`should return success=${expectedIsSuccess}`, () => {
        const result = a.concat(b)
        expect(result.isSuccess).toBe(expectedIsSuccess)

        if (expectedIsSuccess) {
          result.fold(
            () => {
              throw new Error('Expected success but got failure')
            },
            (assembly) => {
              expect(assembly).toBe(expectedAssembly)
            },
          )
        } else {
          result.fold(
            (errors) => {
              expect(errors).toEqual(expectedErrors)
            },
            () => {
              throw new Error('Expected failure but got success')
            },
          )
        }
      })
    },
  )
})
