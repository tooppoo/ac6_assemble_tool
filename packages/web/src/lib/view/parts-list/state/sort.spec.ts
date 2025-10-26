import { describe, it, expect } from 'vitest'

import { parseSort } from './sort'

describe('parseSort', () => {
  it('有効なsortパラメータ（昇順）をパースできること', () => {
    const result = parseSort('price:asc')

    expect(result).toEqual({ key: 'price', order: 'asc' })
  })

  it('有効なsortパラメータ（降順）をパースできること', () => {
    const result = parseSort('weight:desc')

    expect(result).toEqual({ key: 'weight', order: 'desc' })
  })

  it('区切り文字がない場合はnullを返すこと', () => {
    const result = parseSort('invalid-format')

    expect(result).toBeNull()
  })

  it('順序がasc/desc以外の場合はnullを返すこと', () => {
    const result = parseSort('price:ascending')

    expect(result).toBeNull()
  })

  it('要素数が2つ以外の場合はnullを返すこと', () => {
    const result = parseSort('price:asc:extra')

    expect(result).toBeNull()
  })
})
