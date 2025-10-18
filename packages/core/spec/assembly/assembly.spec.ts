import {
  type Assembly,
  type AssemblyKey,
  assemblyKeys,
  createAssembly,
  type RawAssembly,
  spaceByWord,
} from '#core/assembly/assembly'

import { armUnits, leftArmUnits } from '@ac6_assemble_tool/parts/arm-units'
import { arms } from '@ac6_assemble_tool/parts/arms'
import { backUnits, leftBackUnits } from '@ac6_assemble_tool/parts/back-units'
import { boosters } from '@ac6_assemble_tool/parts/booster'
import { cores } from '@ac6_assemble_tool/parts/cores'
import { expansions } from '@ac6_assemble_tool/parts/expansions'
import { fcses } from '@ac6_assemble_tool/parts/fces'
import { generators } from '@ac6_assemble_tool/parts/generators'
import { heads } from '@ac6_assemble_tool/parts/heads'
import { legs } from '@ac6_assemble_tool/parts/legs'
import { boosterNotEquipped } from '@ac6_assemble_tool/parts/not-equipped'
import { beforeEach, describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

import { genAssembly } from '#spec-helper/property-generator'

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
    test('must be larger than minimum', () => {
      fc.assert(
        fc.property(
          genAssembly().filter(
            (a) =>
              a.withinEnOutput && a.withinLoadLimit && a.withinArmsLoadLimit,
          ),
          (assembly) => {
            expect(assembly.ap).toBeGreaterThanOrEqual(6400 - 700)
          },
        ),
      )
    })

    describe('diff examples', () => {
      const testCases = [
        { diff: {}, expected: 11500 },
        { diff: { head: heads[1] }, expected: 11250 },
        { diff: { core: cores[1] }, expected: 10320 },
        { diff: { arms: arms[1] }, expected: 10070 },
        { diff: { legs: legs[1] }, expected: 9260 },
      ]

      testCases.forEach(({ diff, expected }) => {
        test(`diff ${JSON.stringify(diff)} should be ${expected}`, () => {
          expect(merge(sut, diff).ap).toBe(expected)
        })
      })
    })
  })

  describe('defense', () => {
    const testCases = [
      {
        diff: {},
        expectedKinetic: 1196,
        expectedEnergy: 1083,
        expectedExplosive: 1275,
      },
      {
        diff: {
          head: heads[1],
        },
        expectedKinetic: 1186,
        expectedEnergy: 1073,
        expectedExplosive: 1265,
      },
      {
        diff: {
          core: cores[1],
        },
        expectedKinetic: 1166,
        expectedEnergy: 1053,
        expectedExplosive: 1235,
      },
      {
        diff: {
          arms: arms[1],
        },
        expectedKinetic: 1168,
        expectedEnergy: 1082,
        expectedExplosive: 1265,
      },
      {
        diff: {
          legs: legs[1],
        },
        expectedKinetic: 1185,
        expectedEnergy: 1073,
        expectedExplosive: 1265,
      },
    ]

    testCases.forEach(
      ({ diff, expectedKinetic, expectedEnergy, expectedExplosive }) => {
        describe(`diff is ${JSON.stringify(diff)}`, () => {
          test(`anti kinetic defense should be ${expectedKinetic}`, () => {
            expect(merge(sut, diff).antiKineticDefense).toBe(expectedKinetic)
          })
          test(`anti energy defense should be ${expectedEnergy}`, () => {
            expect(merge(sut, diff).antiEnergyDefense).toBe(expectedEnergy)
          })
          test(`anti explosive defense should be ${expectedExplosive}`, () => {
            expect(merge(sut, diff).antiExplosiveDefense).toBe(
              expectedExplosive,
            )
          })
        })
      },
    )
  })

  describe('weight', () => {
    test('total weight must be larger than minimum', () => {
      fc.assert(
        fc.property(
          genAssembly().filter(
            (a) =>
              a.withinEnOutput && a.withinLoadLimit && a.withinArmsLoadLimit,
          ),
          (assembly) => {
            expect(assembly.weight).toBeGreaterThanOrEqual(34900)
          },
        ),
      )
    })
    test('total load must be larger than minimum', () => {
      fc.assert(
        fc.property(
          genAssembly().filter(
            (a) =>
              a.withinEnOutput && a.withinLoadLimit && a.withinArmsLoadLimit,
          ),
          (assembly) => {
            expect(assembly.load).toBeGreaterThanOrEqual(23700)
          },
        ),
      )
    })

    const testCases = [
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
    ]

    testCases.forEach(({ diff, expectedWeight, expectedLoad, within }) => {
      describe(`diff is ${JSON.stringify(diff)}`, () => {
        beforeEach(() => {
          sut = merge(sut, diff)
        })
        test(`weight should be ${expectedWeight}`, () => {
          expect(sut.weight).toBe(expectedWeight)
        })
        test(`load should be ${expectedLoad}`, () => {
          expect(sut.load).toBe(expectedLoad)
        })
        test(`within energy output is ${within}`, () => {
          expect(sut.withinLoadLimit).toBe(within)
        })
      })
    })

    describe('arms', () => {
      const armsTestCases = [
        {
          diff: {},
          expectedArmsLoad: 8390,
          expectedArmsLoadLimit: 10520,
          within: true,
        },
        {
          diff: { rightArmUnit: armUnits[1] },
          expectedArmsLoad: 8330,
          expectedArmsLoadLimit: 10520,
          within: true,
        },
        {
          diff: { leftArmUnit: leftArmUnits[1] },
          expectedArmsLoad: 8000,
          expectedArmsLoadLimit: 10520,
          within: true,
        },
        {
          diff: { rightArmUnit: armUnits[10], leftArmUnit: leftArmUnits[2] },
          expectedArmsLoad: 10890,
          expectedArmsLoadLimit: 10520,
          within: false,
        },
        {
          diff: {
            rightArmUnit: armUnits[10],
            leftArmUnit: leftArmUnits[2],
            arms: arms[2],
          },
          expectedArmsLoad: 10890,
          expectedArmsLoadLimit: 15100,
          within: true,
        },
      ]

      armsTestCases.forEach(
        ({ diff, expectedArmsLoad, expectedArmsLoadLimit, within }) => {
          describe(`diff is ${JSON.stringify(diff)}`, () => {
            beforeEach(() => {
              sut = merge(sut, diff)
            })
            test(`arms weight should be ${expectedArmsLoad}`, () => {
              expect(sut.armsLoad).toBe(expectedArmsLoad)
            })
            test(`arms load should be ${expectedArmsLoadLimit}`, () => {
              expect(sut.armsLoadLimit).toBe(expectedArmsLoadLimit)
            })
            test(`within energy output is ${within}`, () => {
              expect(sut.withinArmsLoadLimit).toBe(within)
            })
          })
        },
      )
    })
  })

  describe('energy', () => {
    const energyTestCases = [
      {
        core: cores[0],
        generator: generators[0],
        expectedEnLoad: 2466,
        expectedOutput: 2158,
        expectedEnSupply: 100,
        expectedEnRechargeDelay: 1.38,
        withinEnOutput: false,
      },
      {
        core: cores[0],
        generator: generators[1],
        expectedEnLoad: 2466,
        expectedOutput: 2490,
        expectedEnSupply: 1600,
        expectedEnRechargeDelay: 1.06,
        withinEnOutput: true,
      },
      {
        core: cores[2],
        generator: generators[0],
        expectedEnLoad: 2470,
        expectedOutput: 2729,
        expectedEnSupply: 2579,
        expectedEnRechargeDelay: 1.34,
        withinEnOutput: true,
      },
      {
        core: cores[3],
        generator: generators[0],
        expectedEnLoad: 2488,
        expectedOutput: 2652,
        expectedEnSupply: 2183,
        expectedEnRechargeDelay: 1.26,
        withinEnOutput: true,
      },
      {
        core: cores[3],
        generator: generators[8],
        expectedEnLoad: 2488,
        expectedOutput: 4518,
        expectedEnSupply: 10014,
        expectedEnRechargeDelay: 1.36,
        withinEnOutput: true,
      },
      {
        core: cores[6],
        generator: generators[7],
        expectedEnLoad: 2496,
        expectedOutput: 3339,
        expectedEnSupply: 5012,
        expectedEnRechargeDelay: 1.0,
        withinEnOutput: true,
      },
    ]

    energyTestCases.forEach(
      ({
        core,
        generator,
        expectedEnLoad,
        expectedOutput,
        expectedEnSupply,
        expectedEnRechargeDelay,
        withinEnOutput,
      }) => {
        describe(`when core is ${core.name}, generator is ${generator.name}`, () => {
          beforeEach(() => {
            sut = merge(sut, { core, generator })
          })

          test(`energy load should be ${expectedOutput}`, () => {
            expect(sut.enLoad).toBe(expectedEnLoad)
          })
          test(`energy output should be ${expectedOutput}`, () => {
            expect(sut.enOutput).toBe(expectedOutput)
          })
          test(`within energy output should be ${withinEnOutput}`, () => {
            expect(sut.withinEnOutput).toBe(withinEnOutput)
          })
          test(`energy supply efficiency should be ${expectedEnSupply}`, () => {
            expect(sut.enSupplyEfficiency).toBe(expectedEnSupply)
          })
          test(`energy recharge delay should be ${expectedEnRechargeDelay}`, () => {
            expect(sut.enRechargeDelay).toBe(expectedEnRechargeDelay)
          })
        })
      },
    )
  })

  describe('booster', () => {
    describe('qb energy load', () => {
      const qbTestCases = [
        {
          diff: {},
          expected: 445,
        },
        {
          diff: { core: cores[2] },
          expected: 561,
        },
        {
          diff: { booster: boosters[1] },
          expected: 388,
        },
        {
          diff: { core: cores[2], booster: boosters[1] },
          expected: 489,
        },
        {
          diff: { booster: boosterNotEquipped, legs: legs[22] },
          expected: 656,
        },
      ]

      qbTestCases.forEach(({ diff, expected }) => {
        describe(`diff = ${JSON.stringify(diff)}`, () => {
          beforeEach(() => {
            sut = merge(sut, diff)
          })
          test(`should be ${expected}`, () => {
            expect(sut.qbEnConsumption).toBe(expected)
          })
        })
      })
    })
  })

  describe('coam', () => {
    const coamTestCases = [
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
    ]

    coamTestCases.forEach(({ diff, expected }) => {
      describe(`diff is ${JSON.stringify(diff)}`, () => {
        test(`total coam should be ${expected}`, () => {
          expect(merge(sut, diff).coam).toBe(expected)
        })
      })
    })
  })

  describe('attitude stability', () => {
    const stabilityTestCases = [
      {
        diff: {},
        expected: 1670,
      },
      {
        diff: {
          head: heads[1],
        },
        expected: 1602,
      },
      {
        diff: {
          core: cores[1],
        },
        expected: 1597,
      },
      {
        diff: {
          legs: legs[1],
        },
        expected: 1504,
      },
    ]

    stabilityTestCases.forEach(({ diff, expected }) => {
      describe(`diff is ${JSON.stringify(diff)}`, () => {
        test(`attitude stability should be ${expected}`, () => {
          expect(merge(sut, diff).attitudeStability).toBe(expected)
        })
      })
    })
  })

  describe('keys', () => {
    describe('space by word', () => {
      const keyTestCases: {
        key: AssemblyKey
        expected: string
      }[] = [
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
      ]

      keyTestCases.forEach(({ key, expected }) => {
        describe(`when key is ${key}`, () => {
          test(`should return ${expected}`, () => {
            expect(spaceByWord(key)).toEqual(expected)
          })
        })
      })
    })
  })

  describe('keys', () => {
    test('should be static array', () => {
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
