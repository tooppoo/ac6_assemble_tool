import { describe, expect, it } from 'vitest'

import { aboutSections } from './content.ja'

describe('aboutSections', () => {
  it('本文の総文字数が 3200 文字以上であること', () => {
    const aggregated = aboutSections.reduce((accumulator, section) => {
      return (
        accumulator +
        section.lead +
        section.body.reduce((sum, paragraph) => sum + paragraph, '')
      )
    }, '')

    const characterCount = Array.from(aggregated).length

    expect(characterCount).toBeGreaterThanOrEqual(3200)
  })
})
