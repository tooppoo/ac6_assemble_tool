import { join } from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#shared/': join(__dirname, 'src/'),
    },
  },
  test: {
    testTimeout: 10 * 1000,
    coverage: {
      reporter: ['text', 'json'],
      all: true,
      exclude: [
        '*.config.*',
        '**/**/*.d',
        'dist/**/*',
        'vitest-setup.ts',
      ],
      provider: 'v8',
    },
    setupFiles: ['./vitest-setup'],
  },
})
