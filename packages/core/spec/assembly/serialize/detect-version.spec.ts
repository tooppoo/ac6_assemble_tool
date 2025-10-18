import { detectUrlVersion } from '#core/assembly/serialize/detect-version'

import { describe, it, expect } from 'bun:test'

describe('URL形式バージョン検出', () => {
  describe('detectUrlVersion', () => {
    it('vパラメータが存在しない場合はv1と判定', () => {
      const params = new URLSearchParams({
        h: '0',
        c: '1',
        a: '2',
        l: '3',
      })

      const result = detectUrlVersion(params)

      expect(result).toBe('v1')
    })

    it('v=2パラメータが存在する場合はv2と判定', () => {
      const params = new URLSearchParams({
        v: '2',
        h: 'HD001',
        c: 'CR001',
      })

      const result = detectUrlVersion(params)

      expect(result).toBe('v2')
    })

    it('vパラメータが2以外の値の場合はunknownと判定', () => {
      const params = new URLSearchParams({
        v: '3',
        h: 'HD001',
      })

      const result = detectUrlVersion(params)

      expect(result).toBe('unknown')
    })

    it('空のURLSearchParamsの場合はv1と判定', () => {
      const params = new URLSearchParams()

      const result = detectUrlVersion(params)

      expect(result).toBe('v1')
    })
  })
})
