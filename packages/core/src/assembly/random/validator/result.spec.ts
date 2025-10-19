import type { Assembly } from '#core/assembly/assembly'

import { describe, expect, it } from 'vitest'

import { failure, success } from './result'

describe('validator/result', () => {
  const assemble = { id: 'dummy' } as never as Assembly
  const e = (n: number) => new Error(`error-${n}`)

  describe.each([
    { a: success(assemble), b: success(assemble), expected: success(assemble) },
    { a: success(assemble), b: failure([e(2)]), expected: failure([e(2)]) },
    { a: failure([e(1)]), b: success(assemble), expected: failure([e(1)]) },
    { a: failure([e(1)]), b: failure([e(2)]), expected: failure([e(1), e(2)]) },
  ])('$a concat $b', ({ a, b, expected }) => {
    it(`should return ${expected}`, () => {
      expect(a.concat(b)).toEqual(expected)
    })
  })
})
