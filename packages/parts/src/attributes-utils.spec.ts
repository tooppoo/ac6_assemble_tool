import { describe, expect, it } from 'vitest'

import type { CandidatesKey } from './types/candidates'

import {
  getArrayAttributes,
  getAttributesForSlot,
  getCandidatesForAttribute,
  getNumericAttributes,
  isAttributeOptional,
} from './attributes-utils'

describe('attributes-utils', () => {
  describe('getAttributesForSlot', () => {
    it('should return attribute definitions for rightArmUnit slot', () => {
      const attributes = getAttributesForSlot('rightArmUnit')

      expect(attributes).toBeDefined()
      expect(Array.isArray(attributes)).toBe(true)
      expect(attributes.length).toBeGreaterThan(0)
    })

    it('should return attribute definitions for head slot', () => {
      const attributes = getAttributesForSlot('head')

      expect(attributes).toBeDefined()
      expect(Array.isArray(attributes)).toBe(true)
      expect(attributes.length).toBeGreaterThan(0)
    })

    it('should exclude literal type attributes', () => {
      const attributes = getAttributesForSlot('head')
      const literalAttributes = attributes.filter(
        (attr) => attr.valueType === 'literal',
      )

      expect(literalAttributes).toHaveLength(0)
    })

    it('should maintain attributes.ts definition order', () => {
      const attributes = getAttributesForSlot('rightArmUnit')

      // armUnitAttributes の最初の属性は classification (array 型)
      // attributes.ts の定義順を維持するため、classification が最初に来るはず
      const firstAttribute = attributes[0]
      expect(firstAttribute?.attributeName).toBe('classification')
    })

    it('should include both numeric and array type attributes', () => {
      const attributes = getAttributesForSlot('rightArmUnit')

      const numericAttrs = attributes.filter(
        (attr) => attr.valueType === 'numeric',
      )
      const arrayAttrs = attributes.filter((attr) => attr.valueType === 'array')

      expect(numericAttrs.length).toBeGreaterThan(0)
      expect(arrayAttrs.length).toBeGreaterThan(0)
    })

    it('should return attributes with all required fields', () => {
      const attributes = getAttributesForSlot('rightArmUnit')
      const attr = attributes[0]

      expect(attr).toHaveProperty('attributeName')
      expect(attr).toHaveProperty('valueType')
      expect(attr).toHaveProperty('candidates')
      expect(attr).toHaveProperty('optional')

      expect(typeof attr?.attributeName).toBe('string')
      expect(['numeric', 'array']).toContain(attr?.valueType)
      expect(Array.isArray(attr?.candidates)).toBe(true)
      expect(typeof attr?.optional).toBe('boolean')
    })

    it('should work for all slot types', () => {
      const slots: CandidatesKey[] = [
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

      for (const slot of slots) {
        const attributes = getAttributesForSlot(slot)
        expect(attributes.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getNumericAttributes', () => {
    it('should return only numeric attribute names', () => {
      const numericAttrs = getNumericAttributes('rightArmUnit')

      expect(numericAttrs).toBeDefined()
      expect(Array.isArray(numericAttrs)).toBe(true)
      expect(numericAttrs.length).toBeGreaterThan(0)

      // 数値型属性の例: price, attack_power, weight, en_load
      expect(numericAttrs).toContain('price')
      expect(numericAttrs).toContain('weight')
      expect(numericAttrs).toContain('en_load')
    })

    it('should not include array type attributes', () => {
      const numericAttrs = getNumericAttributes('rightArmUnit')

      // category, manufacture は array 型なので含まれない
      expect(numericAttrs).not.toContain('category')
      expect(numericAttrs).not.toContain('manufacture')
    })

    it('should not include literal type attributes', () => {
      const numericAttrs = getNumericAttributes('head')

      // head の classification, category は literal 型なので含まれない
      expect(numericAttrs).not.toContain('classification')
    })
  })

  describe('getArrayAttributes', () => {
    it('should return only array attribute names', () => {
      const arrayAttrs = getArrayAttributes('rightArmUnit')

      expect(arrayAttrs).toBeDefined()
      expect(Array.isArray(arrayAttrs)).toBe(true)
      expect(arrayAttrs.length).toBeGreaterThan(0)

      // 配列型属性の例: category, manufacture, attack_type, weapon_type
      expect(arrayAttrs).toContain('category')
      expect(arrayAttrs).toContain('manufacture')
    })

    it('should not include numeric type attributes', () => {
      const arrayAttrs = getArrayAttributes('rightArmUnit')

      // price, weight は numeric 型なので含まれない
      expect(arrayAttrs).not.toContain('price')
      expect(arrayAttrs).not.toContain('weight')
    })

    it('should not include literal type attributes', () => {
      const arrayAttrs = getArrayAttributes('head')

      // head の classification は literal 型なので含まれない
      expect(arrayAttrs).not.toContain('classification')
      expect(Array.isArray(arrayAttrs)).toBe(true)
    })
  })

  describe('isAttributeOptional', () => {
    it('should return true for optional attributes', () => {
      // armUnitAttributes には optional: true の属性がある（例: charge_attack_power）
      const isOptional = isAttributeOptional('rightArmUnit', 'charge_attack_power')

      expect(isOptional).toBe(true)
    })

    it('should return false for required attributes', () => {
      // price, weight, en_load は optional: false
      expect(isAttributeOptional('rightArmUnit', 'price')).toBe(false)
      expect(isAttributeOptional('rightArmUnit', 'weight')).toBe(false)
      expect(isAttributeOptional('rightArmUnit', 'en_load')).toBe(false)
    })

    it('should return false for non-existent attributes', () => {
      const isOptional = isAttributeOptional(
        'rightArmUnit',
        'non_existent_attr',
      )

      expect(isOptional).toBe(false)
    })
  })

  describe('getCandidatesForAttribute', () => {
    it('should return candidates for array type attributes', () => {
      const candidates = getCandidatesForAttribute('rightArmUnit', 'category')

      expect(candidates).toBeDefined()
      expect(Array.isArray(candidates)).toBe(true)
      expect(candidates.length).toBeGreaterThan(0)

      // armUnitAttributes の category には多くのカテゴリがある
      expect(candidates).toContain('assault_rifle')
    })

    it('should return candidates for manufacture attribute', () => {
      const candidates = getCandidatesForAttribute('rightArmUnit', 'manufacture')

      expect(candidates).toBeDefined()
      expect(Array.isArray(candidates)).toBe(true)
      expect(candidates.length).toBeGreaterThan(0)

      // 製造企業の例: baws, balam, dafeng
      expect(candidates).toContain('baws')
    })

    it('should return empty array for numeric attributes', () => {
      const candidates = getCandidatesForAttribute('rightArmUnit', 'price')

      expect(candidates).toBeDefined()
      expect(Array.isArray(candidates)).toBe(true)
      expect(candidates).toHaveLength(0)
    })

    it('should return empty array for non-existent attributes', () => {
      const candidates = getCandidatesForAttribute(
        'rightArmUnit',
        'non_existent_attr',
      )

      expect(candidates).toBeDefined()
      expect(Array.isArray(candidates)).toBe(true)
      expect(candidates).toHaveLength(0)
    })

    it('should handle slots with different candidate sets', () => {
      const armCandidates = getCandidatesForAttribute('rightArmUnit', 'manufacture')
      const headCandidates = getCandidatesForAttribute('head', 'manufacture')

      expect(armCandidates).toBeDefined()
      expect(headCandidates).toBeDefined()

      // 両方とも製造企業を持つが、内容が異なる可能性がある
      expect(armCandidates.length).toBeGreaterThan(0)
      expect(headCandidates.length).toBeGreaterThan(0)
    })
  })
})
