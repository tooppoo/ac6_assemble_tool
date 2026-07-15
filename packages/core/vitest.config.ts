import { join } from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#core/': join(__dirname, 'src/'),
      '#spec-helper/': join(__dirname, 'spec-helper/'),
    },
  },
  test: {
    testTimeout: 10 * 1000,
    coverage: {
      reporter: ['text', 'json'],
      include: ['src/**/*.ts'],
      exclude: [
        '*.config.*',
        '**/**/*.d',
        'spec-helper/*',
        'dist/**/*',
        'vitest-setup.ts',
      ],
      provider: 'v8',
    },
    setupFiles: ['./vitest-setup'],
  },
})
