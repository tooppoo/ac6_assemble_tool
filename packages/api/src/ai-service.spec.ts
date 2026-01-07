import { Result } from '@praha/byethrow'
import { describe, it, expect } from 'vitest'

import { buildPrompt, parseAIResponse } from './ai-service'
import type { AIPartData } from './parts-loader'
import type { Recommendation } from './types'

describe('ai-service', () => {
  describe('buildPrompt', () => {
    it('should generate structured prompt with query and parts', () => {
      const query = '高火力の武器が欲しい'
      const parts: AIPartData[] = [
        {
          id: 'WP001',
          name: 'Test Weapon',
          summary: 'High damage weapon',
          tags: ['武器', '高火力'] as readonly string[],
        },
      ]

      const prompt = buildPrompt(query, parts)

      expect(prompt).toContain(query)
      expect(prompt).toContain('WP001')
      expect(prompt).toContain('Test Weapon')
      expect(prompt).toContain('High damage weapon')
      expect(prompt).toContain('武器')
      expect(prompt).toContain('高火力')
    })

    it('should include JSON format instructions', () => {
      const query = 'test'
      const parts: AIPartData[] = [
        {
          id: 'ID001',
          name: 'Test',
          summary: 'Test summary',
          tags: ['test'] as readonly string[],
        },
      ]

      const prompt = buildPrompt(query, parts)

      expect(prompt).toContain('partId')
      expect(prompt).toContain('partName')
      expect(prompt).toContain('reason')
      expect(prompt).toContain('score')
      expect(prompt).toContain('recommendations')
    })

    it('should generate valid JSON structure in prompt', () => {
      const query = 'test'
      const parts: AIPartData[] = [
        {
          id: 'ID001',
          name: 'Test',
          summary: 'Test summary',
          tags: ['test'] as readonly string[],
        },
      ]

      const prompt = buildPrompt(query, parts)

      // プロンプト内にJSONの例が含まれていることを確認
      expect(prompt).toMatch(/\{[\s\S]*"recommendations"[\s\S]*\}/)
    })
  })

  describe('parseAIResponse', () => {
    it('should parse valid AI response with recommendations', () => {
      const aiResponse = {
        response: JSON.stringify({
          recommendations: [
            {
              partId: 'WP001',
              partName: 'Test Weapon',
              reason: 'High damage output',
              score: 0.95,
            },
          ],
        }),
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const recommendations = Result.unwrap(result) as Recommendation[]
        expect(recommendations).toHaveLength(1)
        expect(recommendations[0].partId).toBe('WP001')
        expect(recommendations[0].partName).toBe('Test Weapon')
        expect(recommendations[0].reason).toBe('High damage output')
        expect(recommendations[0].score).toBe(0.95)
      }
    })

    it('should parse multiple recommendations', () => {
      const aiResponse = {
        response: JSON.stringify({
          recommendations: [
            { partId: 'WP001', partName: 'W1', reason: 'R1', score: 0.9 },
            { partId: 'WP002', partName: 'W2', reason: 'R2', score: 0.8 },
            { partId: 'WP003', partName: 'W3', reason: 'R3', score: 0.7 },
          ],
        }),
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const recommendations = Result.unwrap(result) as Recommendation[]
        expect(recommendations).toHaveLength(3)
      }
    })

    it('should return error when response is invalid JSON', () => {
      const aiResponse = {
        response: 'invalid json',
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isFailure(result)).toBe(true)
    })

    it('should return error when recommendations field is missing', () => {
      const aiResponse = {
        response: JSON.stringify({
          data: [],
        }),
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isFailure(result)).toBe(true)
    })

    it('should return error when recommendations is not an array', () => {
      const aiResponse = {
        response: JSON.stringify({
          recommendations: 'not an array',
        }),
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isFailure(result)).toBe(true)
    })

    it('should handle AI response with extra text before JSON', () => {
      const aiResponse = {
        response: `Here are my recommendations:

${JSON.stringify({
  recommendations: [
    { partId: 'WP001', partName: 'W1', reason: 'R1', score: 0.9 },
  ],
})}`,
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const recommendations = Result.unwrap(result) as Recommendation[]
        expect(recommendations).toHaveLength(1)
      }
    })
  })
})
