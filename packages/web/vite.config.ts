import { execSync } from 'child_process'
import fs from 'fs'

import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { analyzer } from 'vite-bundle-analyzer'
import { defineConfig } from 'vitest/config'

const isVitest = !!process.env.VITEST

const pkg = (() => {
  const raw = fs.readFileSync('package.json', { encoding: 'utf-8' })
  return JSON.parse(raw)
})()

const shortHash = (() => {
  try {
    if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7)
    const out = execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    return out.trim()
  } catch {
    return 'dev'
  }
})()

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(`${pkg.version}-${shortHash}`),
  },
  plugins: [
    ...(process.env.VITEST ? [] : [sveltekit()]),
    svelteTesting(),
    (() => {
      console.log(`ANALYZE_MODE=${process.env.ANALYZE_MODE}`)
      switch (process.env.ANALYZE_MODE) {
        case 'server':
          return analyzer({
            analyzerMode: 'server',
            openAnalyzer: true,
            summary: true,
          })
        case 'static':
        case 'json':
          return analyzer({
            analyzerMode: process.env.ANALYZE_MODE,
            fileName: '../../../analyze',
          })
        default:
          return null
      }
    })(),
  ],
  resolve: {
    alias: {
      $lib: '/src/lib',
      '$/*': '/',
      ...(isVitest
        ? {
            '$env/static/public': '/src/test/$env-static-public.ts',
            'svelte-i18next': '/src/test/svelte-i18next-stub.ts',
          }
        : {}),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    testTimeout: 10 * 1000,
    coverage: {
      reporter: ['text', 'json'],
      all: true,
      exclude: [
        '*rc.cjs',
        '.svelte-kit/',
        '*.config.*',
        '**/**/*.d.ts',
        'dist/**/*',
        'vitest-setup.ts',
      ],
      provider: 'v8',
    },
    setupFiles: ['./vitest-setup'],
  },
})
