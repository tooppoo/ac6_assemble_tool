import { join } from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#parts/': join(__dirname, 'src/'),
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
        'scripts/**/*',
      ],
      provider: 'v8',
    },
  },
})
