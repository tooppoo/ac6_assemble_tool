/* eslint-disable @typescript-eslint/no-explicit-any */
import type { i18n as I18nInstance } from 'i18next'
import type { Readable } from 'svelte/store'

type I18nStore = Readable<{ t: (key: string, ...args: any[]) => string }>

export function createI18nStore(i18n: I18nInstance): I18nStore {
  return {
    subscribe(run) {
      const value = {
        t: i18n.t.bind(i18n) as (k: string, ...a: any[]) => string,
      }
      run(value)
      return () => {}
    },
  }
}
