import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    svelteTesting(),
  ],
  resolve: {
    alias: {
      $lib: '/src/lib',
      '$env/static/public': '/src/test/$env-static-public.ts',
      'svelte-i18next': '/src/test/svelte-i18next-stub.ts',
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json'],
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
