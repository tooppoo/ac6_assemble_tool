import { describe, expect, test } from 'bun:test'
import * as fc from 'fast-check'

import { appUrl, publicPath } from './app-url'

describe('app-url', () => {
  describe(appUrl.name, () => {
    test('not contain repeated slash except for protocol', () => {
      fc.assert(
        fc.property(fc.array(fc.webPath()), (paths) => {
          const urlWithoutProtocol = appUrl(...paths).replace(/^https:\/\//, '')

          expect(urlWithoutProtocol).not.toMatch(/\/\/+/)
        }),
      )
    })
    test('start with application base path', () => {
      fc.assert(
        fc.property(fc.array(fc.webPath()), (paths) => {
          expect(appUrl(...paths)).toMatch(
            /^https:\/\/ac6-assemble-tool\.philomagi\.dev\//,
          )
        }),
      )
    })
  })

  describe(publicPath.name, () => {
    test('not contain repeated slash except for protocol', () => {
      fc.assert(
        fc.property(fc.array(fc.webPath()), (paths) => {
          expect(publicPath(...paths)).not.toMatch(/\/\/+/)
        }),
      )
    })
    test('start from root', () => {
      fc.assert(
        fc.property(fc.array(fc.webPath()), (paths) => {
          expect(publicPath(...paths)).toMatch(/^\//)
        }),
      )
    })
  })
})
