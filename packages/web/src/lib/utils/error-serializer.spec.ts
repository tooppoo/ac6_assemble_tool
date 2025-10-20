import { describe, it, expect } from 'vitest'

import { serializeError } from './error-serializer'

describe('serializeError', () => {
  it('Errorインスタンスの場合、messageを返すこと', () => {
    const error = new Error('Something went wrong')
    const result = serializeError(error)

    expect(result).toBe('Something went wrong')
  })

  it('文字列の場合、そのまま返すこと', () => {
    const error = 'Error message'
    const result = serializeError(error)

    expect(result).toBe('Error message')
  })

  it('数値の場合、文字列に変換して返すこと', () => {
    const error = 404
    const result = serializeError(error)

    expect(result).toBe('404')
  })

  it('オブジェクトの場合、文字列に変換して返すこと', () => {
    const error = { code: 'ERR001', message: 'Error occurred' }
    const result = serializeError(error)

    expect(result).toBe('[object Object]')
  })

  it('nullの場合、"null"を返すこと', () => {
    const error = null
    const result = serializeError(error)

    expect(result).toBe('null')
  })

  it('undefinedの場合、"undefined"を返すこと', () => {
    const error = undefined
    const result = serializeError(error)

    expect(result).toBe('undefined')
  })

  it('配列の場合、文字列に変換して返すこと', () => {
    const error = ['error1', 'error2']
    const result = serializeError(error)

    expect(result).toBe('error1,error2')
  })

  it('カスタムErrorクラスの場合、messageを返すこと', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'CustomError'
      }
    }

    const error = new CustomError('Custom error occurred')
    const result = serializeError(error)

    expect(result).toBe('Custom error occurred')
  })
})
