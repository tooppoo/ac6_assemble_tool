// See https://kit.svelte.dev/docs/types#app

import type { I18NextStore } from '$/src/lib/i18n/define'

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

module 'svelte' {
  export function setContext(key: 'i18n', value: I18NextStore): I18NextStore
  export function getContext(key: 'i18n'): I18NextStore
}

export {}
