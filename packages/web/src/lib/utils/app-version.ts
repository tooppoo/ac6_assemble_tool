// App version string displayed in the UI
// Injected at build-time via Vite's `define` in vite.config.ts
// Falls back to 'dev' if not defined.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __APP_VERSION__ is defined by Vite
export const appVersion: string =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'
