import { Result } from '@praha/byethrow'
import { describe, it, expect } from 'vitest'

import type { AIPartData } from '../parts-loader'

import { buildSystemPrompt, parseAIResponse } from './ai-service'

describe('ai-service', () => {
  describe('buildPrompt', () => {
    it('should generate structured prompt with query and parts', () => {
      const parts: AIPartData[] = [
        {
          id: 'WP001',
          name: 'Test Weapon',
          summary: 'High damage weapon',
          tags: ['武器', '高火力'] as readonly string[],
        },
      ]

      const prompt = buildSystemPrompt(parts)

      expect(prompt).toContain('WP001')
      expect(prompt).toContain('Test Weapon')
      expect(prompt).toContain('High damage weapon')
      expect(prompt).toContain('武器')
      expect(prompt).toContain('高火力')
    })

    it('should include marker format instructions', () => {
      const parts: AIPartData[] = [
        {
          id: 'ID001',
          name: 'Test',
          summary: 'Test summary',
          tags: ['test'] as readonly string[],
        },
      ]

      const prompt = buildSystemPrompt(parts)

      expect(prompt).toContain('partId')
      expect(prompt).toContain('partName')
      expect(prompt).toContain('reason')
      expect(prompt).toContain('score')
      expect(prompt).toContain('---RECOMMENDATIONS---')
    })

    it('should include Japanese terminology reference', () => {
      const parts: AIPartData[] = [
        {
          id: 'ID001',
          name: 'Test',
          summary: 'Test summary',
          tags: ['test'] as readonly string[],
        },
      ]

      const prompt = buildSystemPrompt(parts)

      // 日本語用語マップが含まれていることを確認
      expect(prompt).toContain('Japanese terminology reference')
      expect(prompt).toContain('Attribute names')
    })
  })

  describe('parseAIResponse', () => {
    it('should parse valid AI response with recommendations', () => {
      const aiResponse = {
        response: `ユーザーのご要望に合うパーツを探しました。高火力で軽量という条件では、以下のパーツがおすすめです。

まず「ライフル A」は攻撃力が高く、重量も控えめなのでバランスが良いです。次に「ショットガン B」は近距離での瞬間火力に優れています。

---RECOMMENDATIONS---
partId: WP001 | partName: TestWeapon | score: 0.95 | reason: HighDamageOutput
partId: P002 | partName: ShotgunB | score: 0.85 | reason: HighCloseRangeDamage`,
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const { answer, recommendations } = Result.unwrap(result)
        expect(answer).toContain('ユーザーのご要望に合うパーツを探しました')
        expect(answer).not.toContain('---RECOMMENDATIONS---')
        expect(recommendations).toHaveLength(2)
        expect(recommendations[0].partId).toBe('WP001')
        expect(recommendations[0].partName).toBe('TestWeapon')
        expect(recommendations[0].reason).toBe('HighDamageOutput')
        expect(recommendations[0].score).toBe(0.95)
      }
    })

    it('should parse multiple recommendations', () => {
      const aiResponse = {
        response: `Here are my recommendations:

---RECOMMENDATIONS---
partId: WP001 | partName: W1 | score: 0.9 | reason: R1
partId: WP002 | partName: W2 | score: 0.8 | reason: R2
partId: WP003 | partName: W3 | score: 0.7 | reason: R3`,
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const { answer, recommendations } = Result.unwrap(result)
        expect(answer).toBe('Here are my recommendations:')
        expect(recommendations).toHaveLength(3)
        expect(recommendations[0].partId).toBe('WP001')
        expect(recommendations[1].partId).toBe('WP002')
        expect(recommendations[2].partId).toBe('WP003')
      }
    })

    it('should handle response without recommendations marker', () => {
      const aiResponse = {
        response: 'これは自然言語の回答のみです。推奨パーツはありません。',
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const { answer, recommendations } = Result.unwrap(result)
        expect(answer).toBe(
          'これは自然言語の回答のみです。推奨パーツはありません。',
        )
        expect(recommendations).toHaveLength(0)
      }
    })

    it('should handle malformed recommendation lines gracefully', () => {
      const aiResponse = {
        response: `回答テキスト

---RECOMMENDATIONS---
partId: WP001 | partName: W1 | score: 0.9 | reason: R1
invalid line without proper format
partId: WP002 | partName: W2 | score: 0.8 | reason: R2`,
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const { answer, recommendations } = Result.unwrap(result)
        expect(answer).toBe('回答テキスト')
        // 不正な行はスキップされる
        expect(recommendations).toHaveLength(2)
        expect(recommendations[0].partId).toBe('WP001')
        expect(recommendations[1].partId).toBe('WP002')
      }
    })

    it('should handle invalid score values', () => {
      const aiResponse = {
        response: `回答

---RECOMMENDATIONS---
partId: WP001 | partName: W1 | score: invalid | reason: R1
partId: WP002 | partName: W2 | score: 0.8 | reason: R2`,
      }

      const result = parseAIResponse(aiResponse)

      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const { recommendations } = Result.unwrap(result)
        // 不正なスコアの行はスキップされる
        expect(recommendations).toHaveLength(1)
        expect(recommendations[0].partId).toBe('WP002')
      }
    })

    it('should never fail - always return success with answer', () => {
      const aiResponse = {
        response: 'Any text response',
      }

      const result = parseAIResponse(aiResponse)

      // parseAIResponse は常に成功を返す（グレースフルデグラデーション）
      expect(Result.isSuccess(result)).toBe(true)
      if (Result.isSuccess(result)) {
        const { answer, recommendations } = Result.unwrap(result)
        expect(answer).toBe('Any text response')
        expect(recommendations).toHaveLength(0)
      }
    })
  })
})
