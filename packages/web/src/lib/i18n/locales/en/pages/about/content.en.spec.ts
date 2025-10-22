import { describe, expect, it } from 'vitest'

import { aboutSections } from './content.en'

describe('aboutSections (en)', () => {
  it('本文が 800 語以上であること', () => {
    const aggregated = aboutSections.reduce((text, section) => {
      return `${text} ${section.lead} ${section.body.join(' ')}`
    }, '')

    const wordCount = aggregated
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0).length

    expect(wordCount).toBeGreaterThanOrEqual(800)
  })
})
