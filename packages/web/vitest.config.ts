import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // SvelteファイルとSvelteKitの仮想モジュール($app/*等)を解決するため、
  // Vitest側でもSvelteKitプラグインを有効化する。
  plugins: [sveltekit(), svelteTesting()],
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
    testTimeout: 20 * 1000,
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
