import { it, fc } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

import { roundUpByRealPart } from '@ac6_assemble_tool/shared/number'

describe(roundUpByRealPart.name, () => {
  const genNumAndDigit = (digit: { min?: number; max?: number } = { min: 1 }) =>
    fc
      .record({ num: fc.integer(), digit: fc.integer(digit) })
      .filter(({ num, digit }) => digit < `${Math.abs(num)}`.length)

  it.prop([genNumAndDigit()])(
    'length should be same or plus 1',
    ({ num, digit }) => {
      const rounded = roundUpByRealPart(digit)(num)
      const len = (x: number) => `${x}`.length

      // 位上がりのケース
      expect([len(num), len(num) + 1]).contain(len(rounded))
    },
  )
  it.prop([genNumAndDigit()])(
    'all digits other than top should be 0',
    ({ num, digit }) => {
      const rounded = roundUpByRealPart(digit)(num)
      const other = `${rounded}`.slice(digit + 1).split('')

      expect(other.every((d) => d === '0')).toBe(true)
    },
  )
  describe('digit < 1', () => {
    it.prop([genNumAndDigit({ max: 0 })])(
      'behave as like digit is 1',
      ({ num, digit }) => {
        expect(roundUpByRealPart(digit)(num)).toEqual(roundUpByRealPart(1)(num))
      },
    )
  })

  describe.each([
    { num: 111010, digit: 1, expected: 200000 },
    { num: 111010, digit: 2, expected: 120000 },
    { num: 111010, digit: 3, expected: 112000 },
    { num: 111010, digit: 4, expected: 111100 },
    { num: 111010, digit: 5, expected: 111010 },
    { num: 111010, digit: 6, expected: 111010 },
    { num: 111010, digit: 7, expected: 111010 },
    { num: 991001, digit: 1, expected: 1000000 },
    { num: 991001, digit: 2, expected: 1000000 },
    { num: 991001, digit: 3, expected: 992000 },
  ])('roundUpByRealPart($num)($digit)', ({ num, digit, expected }) => {
    it(`should round to ${expected}`, () => {
      expect(roundUpByRealPart(digit)(num)).toBe(expected)
    })
  })
})
