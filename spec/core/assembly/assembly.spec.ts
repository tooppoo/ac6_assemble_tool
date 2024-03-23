import {
  type Assembly,
  type AssemblyKey,
  assemblyKeys,
  createAssembly,
  type RawAssembly,
  spaceByWord,
} from '~core/assembly/assembly.ts'

import { armUnits, leftArmUnits } from '~data/arm-units.ts'
import { arms } from '~data/arms.ts'
import { backUnits, leftBackUnits } from '~data/back-units'
import { boosters } from '~data/booster.ts'
import { cores } from '~data/cores.ts'
import { expansions } from '~data/expansions.ts'
import { fcses } from '~data/fces.ts'
import { generators } from '~data/generators.ts'
import { heads } from '~data/heads'
import { legs } from '~data/legs.ts'

import { it as fcit } from '@fast-check/vitest'
import { beforeEach, describe, expect, it, test } from 'vitest'

import { genAssembly } from '~spec/helper.ts'

describe('assembly', () => {
  let sut: Assembly

  const merge = (base: Assembly, diff: Partial<RawAssembly>): Assembly =>
    createAssembly({
      ...base,
      ...diff,
    } as never)

  beforeEach(() => {
    sut = createAssembly({
      rightArmUnit: armUnits[0],
      leftArmUnit: leftArmUnits[0],
      rightBackUnit: backUnits[0],
      leftBackUnit: leftBackUnits[0],
      head: heads[0],
      core: cores[0],
      arms: arms[0],
      legs: legs[0],
      booster: boosters[0],
      fcs: fcses[0],
      generator: generators[0],
      expansion: expansions[0],
    })
  })

  describe('ap', () => {
    fcit.prop([genAssembly()])('must be larger than minimum', (assembly) => {
      expect(assembly.ap).greaterThanOrEqual(6400 - 700)
    })

    describe.each([
      { diff: {}, expected: 11500 },
      { diff: { head: heads[1] }, expected: 11250 },
      { diff: { core: cores[1] }, expected: 10320 },
      { diff: { arms: arms[1] }, expected: 10070 },
      { diff: { legs: legs[1] }, expected: 9260 },
    ])('diff is %s', ({ diff, expected }) => {
      it(`should be ${expected}`, () => {
        expect(merge(sut, diff).ap).toBe(expected)
      })
    })
  })

  describe('weight', () => {
    fcit.prop([genAssembly()])(
      'total weight must be larger than minimum',
      (assembly) => {
        expect(assembly.weight).greaterThanOrEqual(34900)
      },
    )
    fcit.prop([genAssembly()])(
      'total load must be larger than minimum',
      (assembly) => {
        expect(assembly.load).greaterThanOrEqual(23700)
      },
    )

    describe.each([
      { diff: {}, expectedWeight: 71270, expectedLoad: 51550, within: true },
      {
        diff: { rightArmUnit: armUnits[1] },
        expectedWeight: 71210,
        expectedLoad: 51490,
        within: true,
      },
      {
        diff: { leftArmUnit: leftArmUnits[1] },
        expectedWeight: 70880,
        expectedLoad: 51160,
        within: true,
      },
      {
        diff: { rightBackUnit: backUnits[1] },
        expectedWeight: 73890,
        expectedLoad: 54170,
        within: true,
      },
      {
        diff: { leftBackUnit: backUnits[6] },
        expectedWeight: 83390,
        expectedLoad: 63670,
        within: false,
      },
      {
        diff: { head: heads[1] },
        expectedWeight: 70920,
        expectedLoad: 51200,
        within: true,
      },
      {
        diff: { core: cores[1] },
        expectedWeight: 67520,
        expectedLoad: 47800,
        within: true,
      },
      {
        diff: { arms: arms[1] },
        expectedWeight: 69270,
        expectedLoad: 49550,
        within: true,
      },
      {
        diff: { legs: legs[6] },
        expectedWeight: 65580,
        expectedLoad: 51550,
        within: false,
      },
      {
        diff: { booster: boosters[1] },
        expectedWeight: 70750,
        expectedLoad: 51030,
        within: true,
      },
      {
        diff: { fcs: fcses[1] },
        expectedWeight: 71290,
        expectedLoad: 51570,
        within: true,
      },
      {
        diff: { generator: generators[1] },
        expectedWeight: 72930,
        expectedLoad: 53210,
        within: true,
      },
    ])('diff is %s', ({ diff, expectedWeight, expectedLoad, within }) => {
      beforeEach(() => {
        sut = merge(sut, diff)
      })
      it(`weight should be ${expectedWeight}`, () => {
        expect(sut.weight).toBe(expectedWeight)
      })
      it(`load should be ${expectedLoad}`, () => {
        expect(sut.load).toBe(expectedLoad)
      })
      it(`within energy output is ${within}`, () => {
        expect(sut.withinLoadLimit).toBe(within)
      })
    })
  })

  describe('energy', () => {
    describe.each([
      {
        core: cores[0],
        generator: generators[0],
        expectedEnLoad: 2466,
        expectedOutput: 2158,
        within: false,
      },
      {
        core: cores[0],
        generator: generators[1],
        expectedEnLoad: 2466,
        expectedOutput: 2490,
        within: true,
      },
      {
        core: cores[3],
        generator: generators[0],
        expectedEnLoad: 2488,
        expectedOutput: 2652,
        within: true,
      },
    ])(
      'when core is %s, generator is %s',
      ({ core, generator, expectedEnLoad, expectedOutput, within }) => {
        beforeEach(() => {
          sut = merge(sut, { core, generator })
        })

        it(`energy load should be ${expectedOutput}`, () => {
          expect(sut.enLoad).toBe(expectedEnLoad)
        })
        it(`energy output should be ${expectedOutput}`, () => {
          expect(sut.enOutput).toBe(expectedOutput)
        })
        it(`within energy output is ${within}`, () => {
          expect(sut.withinEnOutput).toBe(within)
        })
      },
    )
  })

  describe('coam', () => {
    describe.each([
      {
        diff: {},
        expected: 1135000,
      },
      {
        diff: { rightArmUnit: armUnits[1] },
        expected: 1135000 - 105000 + 65000,
      },
      {
        diff: { rightBackUnit: backUnits[1] },
        expected: 1135000 - 220000 + 255000,
      },
      {
        diff: { leftArmUnit: leftArmUnits[1] },
        expected: 1135000 - 185000 + 215000,
      },
      {
        diff: { leftBackUnit: leftBackUnits[1] },
        expected: 1135000 - 123000 + 43000,
      },
      {
        diff: { head: heads[2] },
        expected: 1135000 - 61000 + 75000,
      },
      {
        diff: { core: cores[2] },
        expected: 1135000 - 166000 + 195000,
      },
      {
        diff: { arms: arms[2] },
        expected: 1135000 - 81000 + 95000,
      },
      {
        diff: { legs: legs[2] },
        expected: 1135000 - 141000 + 175000,
      },
      {
        diff: { booster: boosters[2] },
        expected: 1135000 - 53000 + 72000,
      },
      {
        diff: { fcs: fcses[1] },
        expected: 1135000 + 67000,
      },
      {
        diff: { generator: generators[1] },
        expected: 1135000 + 240000,
      },
    ])('diff is %s', ({ diff, expected }) => {
      test(`total coam should be ${expected}`, () => {
        expect(merge(sut, diff).coam).toBe(expected)
      })
    })
  })

  describe('keys', () => {
    describe('space by word', () => {
      describe.each([
        { key: 'rightArmUnit', expected: 'right Arm Unit' },
        { key: 'leftArmUnit', expected: 'left Arm Unit' },
        { key: 'rightBackUnit', expected: 'right Back Unit' },
        { key: 'leftBackUnit', expected: 'left Back Unit' },
        { key: 'head', expected: 'head' },
        { key: 'core', expected: 'core' },
        { key: 'arms', expected: 'arms' },
        { key: 'legs', expected: 'legs' },
        { key: 'booster', expected: 'booster' },
        { key: 'fcs', expected: 'fcs' },
        { key: 'generator', expected: 'generator' },
        { key: 'expansion', expected: 'expansion' },
      ] as {
        key: AssemblyKey
        expected: string
      }[])('when key is $key', ({ key, expected }) => {
        it(`should return ${expected}`, () => {
          expect(spaceByWord(key)).toEqual(expected)
        })
      })
    })
  })

  describe('keys', () => {
    it('should be static array', () => {
      const expected: AssemblyKey[] = [
        'rightArmUnit',
        'leftArmUnit',
        'rightBackUnit',
        'leftBackUnit',
        'head',
        'core',
        'arms',
        'legs',
        'booster',
        'fcs',
        'generator',
        'expansion',
      ]

      expect(assemblyKeys()).toEqual(expected)
    })
  })
})
