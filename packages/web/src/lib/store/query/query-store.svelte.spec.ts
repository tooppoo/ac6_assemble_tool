import { genAssembly } from '@ac6_assemble_tool/core/spec-helper/property-generator'
import { it as fcit } from '@fast-check/vitest'
import { beforeEach, describe, expect, vi } from 'vitest'

// Mock $app modules - must be defined before imports
let mockBrowser = true

vi.mock('$app/navigation', () => ({
  pushState: vi.fn(),
}))

vi.mock('$app/state', () => ({
  page: { url: new URL('http://localhost/') },
}))

vi.mock('$app/environment', () => ({
  get browser() {
    return mockBrowser
  },
}))

import { buildQueryFromAssembly, storeAssemblyAsQuery } from './query-store.svelte'

import { pushState } from '$app/navigation'
import { page } from '$app/state'

const mockPushState = pushState as ReturnType<typeof vi.fn>
const mockPage = page as { url: URL }

describe('query-store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPage.url = new URL('http://localhost/')
    mockBrowser = true
  })

  describe('buildQueryFromAssembly', () => {
    describe('ブラウザ環境', () => {
      fcit.prop([genAssembly()])(
        'アセンブリから完全なクエリパラメータを生成すること',
        (assembly) => {
          const params = buildQueryFromAssembly(assembly)

          expect(params).toBeInstanceOf(URLSearchParams)
          // アセンブリパラメータが含まれていることを確認
          expect(params.toString()).toBeTruthy()
        },
      )

      fcit.prop([genAssembly()])(
        '現在のURLクエリパラメータをマージすること',
        (assembly) => {
          mockPage.url = new URL('http://localhost/?lng=ja&foo=bar')

          const params = buildQueryFromAssembly(assembly)

          // 既存のパラメータが保持されている
          expect(params.get('lng')).toBe('ja')
          expect(params.get('foo')).toBe('bar')
        },
      )

      fcit.prop([genAssembly()])(
        '言語クエリパラメータが保持されること',
        (assembly) => {
          mockPage.url = new URL('http://localhost/?lng=en')

          const params = buildQueryFromAssembly(assembly)

          expect(params.get('lng')).toBe('en')
        },
      )

      fcit.prop([genAssembly()])(
        '複数のクエリパラメータが保持されること',
        (assembly) => {
          mockPage.url = new URL(
            'http://localhost/?lng=ja&debug=true&version=1.0',
          )

          const params = buildQueryFromAssembly(assembly)

          expect(params.get('lng')).toBe('ja')
          expect(params.get('debug')).toBe('true')
          expect(params.get('version')).toBe('1.0')
        },
      )
    })

    describe('SSR環境', () => {
      beforeEach(() => {
        mockBrowser = false
      })

      fcit.prop([genAssembly()])(
        'SSR時でもエラーなくクエリパラメータを生成すること',
        (assembly) => {
          const params = buildQueryFromAssembly(assembly)

          expect(params).toBeInstanceOf(URLSearchParams)
          // アセンブリパラメータが含まれていることを確認
          expect(params.toString()).toBeTruthy()
        },
      )

      fcit.prop([genAssembly()])(
        'SSR時は空のベースパラメータを使用すること',
        (assembly) => {
          mockPage.url = new URL('http://localhost/?lng=ja&foo=bar')

          const params = buildQueryFromAssembly(assembly)

          // SSR時はpage.urlにアクセスしないため、既存パラメータは含まれない
          expect(params.get('lng')).toBeNull()
          expect(params.get('foo')).toBeNull()
          // アセンブリパラメータのみが含まれる
          expect(params.toString()).toBeTruthy()
        },
      )
    })
  })

  describe('storeAssemblyAsQuery', () => {
    beforeEach(() => {
      mockBrowser = true
      mockPage.url = new URL('http://localhost/')
      vi.clearAllMocks()
    })

    fcit.prop([genAssembly()])(
      'アセンブリをURLクエリパラメータに保存すること',
      (assembly) => {
        vi.clearAllMocks()

        storeAssemblyAsQuery(assembly)

        expect(mockPushState).toHaveBeenCalledTimes(1)
        const [url, state] = mockPushState.mock.calls[0]
        expect(url).toMatch(/^\/?/)
        expect(state).toEqual({})
      },
    )

    fcit.prop([genAssembly()])('現在のパス名を保持すること', (assembly) => {
      // 各テスト内で元のURLを保存
      const originalUrl = mockPage.url
      mockPage.url = new URL('http://localhost/parts-list')

      try {
        storeAssemblyAsQuery(assembly)

        const [url] = mockPushState.mock.calls[0]
        expect(url).toMatch(/^\/parts-list\?/)
      } finally {
        // 元のURLに戻す
        mockPage.url = originalUrl
      }
    })

    fcit.prop([genAssembly()])(
      '既存のクエリパラメータをマージすること',
      (assembly) => {
        const originalUrl = mockPage.url
        mockPage.url = new URL('http://localhost/?lng=ja')

        try {
          storeAssemblyAsQuery(assembly)

          const [url] = mockPushState.mock.calls[0]
          // lngパラメータが含まれていることを確認
          expect(url).toContain('lng=ja')
        } finally {
          mockPage.url = originalUrl
        }
      },
    )

    fcit.prop([genAssembly()])(
      '複数のクエリパラメータを正しく処理すること',
      (assembly) => {
        const originalUrl = mockPage.url
        mockPage.url = new URL('http://localhost/?lng=en&debug=true')

        try {
          storeAssemblyAsQuery(assembly)

          const [url] = mockPushState.mock.calls[0]
          expect(url).toContain('lng=en')
          expect(url).toContain('debug=true')
        } finally {
          mockPage.url = originalUrl
        }
      },
    )

    fcit.prop([genAssembly()])(
      '空のクエリパラメータでも正しく動作すること',
      (assembly) => {
        vi.clearAllMocks()

        storeAssemblyAsQuery(assembly)

        expect(mockPushState).toHaveBeenCalledTimes(1)
        const [url] = mockPushState.mock.calls[0]
        expect(url).toMatch(/^\/?/)
      },
    )
  })

  describe('統合シナリオ', () => {
    beforeEach(() => {
      mockBrowser = true
      mockPage.url = new URL('http://localhost/')
      vi.clearAllMocks()
    })

    fcit.prop([genAssembly()])(
      'buildQueryFromAssemblyとstoreAssemblyAsQueryが連携して動作すること',
      (assembly) => {
        const originalUrl = mockPage.url
        mockPage.url = new URL('http://localhost/?lng=ja')
        vi.clearAllMocks()

        try {
          // 1. クエリを生成
          const params = buildQueryFromAssembly(assembly)
          expect(params.get('lng')).toBe('ja')

          // 2. URLに保存
          storeAssemblyAsQuery(assembly)
          expect(mockPushState).toHaveBeenCalledTimes(1)

          const [url] = mockPushState.mock.calls[0]
          expect(url).toContain('lng=ja')
        } finally {
          mockPage.url = originalUrl
        }
      },
    )

    fcit.prop([genAssembly()])(
      '言語切り替えとアセンブリ保存が同時に行われること',
      (assembly) => {
        const originalUrl = mockPage.url

        try {
          // 初期状態: 日本語
          mockPage.url = new URL('http://localhost/?lng=ja')

          storeAssemblyAsQuery(assembly)

          const [url1] = mockPushState.mock.calls[0]
          expect(url1).toContain('lng=ja')

          // 言語を英語に変更
          mockPage.url = new URL('http://localhost/?lng=en')
          vi.clearAllMocks()

          storeAssemblyAsQuery(assembly)

          const [url2] = mockPushState.mock.calls[0]
          expect(url2).toContain('lng=en')
        } finally {
          mockPage.url = originalUrl
          vi.clearAllMocks()
        }
      },
    )
  })
})
