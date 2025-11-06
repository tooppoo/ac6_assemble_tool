import { describe, expect, it } from 'vitest'

import { armUnits } from '../../src/arm-units'

import { excludeAttributes } from './exclude-attributes'

describe('excludeAttributes', () => {
  it('属性のうち、全パーツに存在しないものはoptional: trueとして抽出される', () => {
    const result = excludeAttributes(armUnits)

    const optionalAttributes = result
      .filter((attr) => attr.optional)
      .map((attr) => attr.attributeName)

    expect(optionalAttributes).toContain('cooling')
    expect(optionalAttributes).toContain('charge_attack_power')
    expect(optionalAttributes).not.toContain('attack_type')
    expect(optionalAttributes).not.toContain('weapon_type')
    expect(optionalAttributes).not.toContain('weight')
  })

  it('属性のvalueTypeが正しく判定される', () => {
    const result = excludeAttributes(armUnits)

    const weightAttr = result.find((attr) => attr.attributeName === 'weight')
    expect(weightAttr).toBeDefined()
    expect(weightAttr!.valueType).toBe('numeric')
    expect(weightAttr!.candidates.length).toBe(0)

    const attackTypeAttr = result.find(
      (attr) => attr.attributeName === 'attack_type',
    )
    expect(attackTypeAttr).toBeDefined()
    expect(attackTypeAttr!.valueType).toBe('array')
    expect(attackTypeAttr!.candidates.length).toBeGreaterThan(0)
  })
  it('属性名でユニークになっていること', () => {
    const result = excludeAttributes(armUnits)

    const attributeNames = result.map((attr) => attr.attributeName)
    const uniqueAttributeNames = Array.from(new Set(attributeNames))

    expect(attributeNames.length).toBe(uniqueAttributeNames.length)
  })
})
