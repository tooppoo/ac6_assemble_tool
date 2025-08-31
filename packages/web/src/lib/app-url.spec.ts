import { appUrl, publicPath } from '$lib/app-url'

import { it as fcit, fc } from '@fast-check/vitest'
import { describe, expect } from 'vitest'

describe('app-url', () => {
  describe(appUrl.name, () => {
    fcit.prop([fc.array(fc.webPath())])(
      'not contain repeated slash except for protocol',
      (paths) => {
        const urlWithoutProtocol = appUrl(...paths).replace(/^https:\/\//, '')

        expect(urlWithoutProtocol).not.toMatch(/\/\/+/)
      },
    )
    fcit.prop([fc.array(fc.webPath())])(
      'start with application base path',
      (paths) => {
        expect(appUrl(...paths)).toMatch(
          /^https:\/\/ac6-assemble-tool\.philomagi\.dev\//,
        )
      },
    )
  })

  describe(publicPath.name, () => {
    fcit.prop([fc.array(fc.webPath())])(
      'not contain repeated slash except for protocol',
      (paths) => {
        expect(publicPath(...paths)).not.toMatch(/\/\/+/)
      },
    )
    fcit.prop([fc.array(fc.webPath())])('start from root', (paths) => {
      expect(publicPath(...paths)).toMatch(/^\//)
    })
  })
})
