
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10 * 1000,
    include: ['**/*.vitest.ts'],
    coverage: {
      reporter: ['text', 'json'],
      all: true,
      include: ['**/*.vitest.ts'],
      exclude: ['*.config.*', '**/**/*.d', 'dist/**/*', 'scripts/**/*'],
      provider: 'v8',
    },
  },
})
