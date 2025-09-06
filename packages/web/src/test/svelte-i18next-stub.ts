/* eslint-disable @typescript-eslint/no-explicit-any */
import type { i18n as I18nInstance } from 'i18next'
import type { Readable } from 'svelte/store'

type I18nStore = Readable<{ t: (key: string, ...args: any[]) => string }>

export function createI18nStore(i18n: I18nInstance): I18nStore {
  return {
    subscribe(run) {
      const value = {
        // i18next の TFunction はオーバーロードが多いため、ラッパーで受けて透過的に委譲
        t: (k: string, ...a: any[]) =>
          (i18n.t as unknown as (...args: any[]) => string)(k, ...a),
      }
      run(value)
      return () => {}
    },
  }
}
