#!/usr/bin/env bun
/**
 * Migrate tests from @fast-check/vitest to bun:test with fast-check
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const files = await glob('packages/**/*.spec.ts', {
  ignore: ['**/node_modules/**'],
})

console.log(`Found ${files.length} test files`)

for (const file of files) {
  const content = readFileSync(file, 'utf-8')

  // Skip if not using @fast-check/vitest
  if (!content.includes('@fast-check/vitest')) {
    continue
  }

  console.log(`Migrating ${file}`)

  let newContent = content

  // Replace imports
  newContent = newContent.replace(
    /import\s+{([^}]+)}\s+from\s+['"]@fast-check\/vitest['"]/g,
    (_, imports) => {
      const hasIt = imports.includes('it')
      const hasFc = imports.includes('fc')

      let result = ''
      if (hasFc) {
        result += "import * as fc from 'fast-check'\n"
      }
      return result
    },
  )

  // Replace vitest imports
  newContent = newContent.replace(
    /from\s+['"]vitest['"]/g,
    "from 'bun:test'",
  )

  // Add bun:test import if not already present
  if (!newContent.includes("from 'bun:test'")) {
    const vitestMatch = newContent.match(/import\s+{([^}]+)}\s+from\s+['"]bun:test['"]/)
    if (!vitestMatch) {
      // Find first import
      const firstImportMatch = newContent.match(/^import\s+/m)
      if (firstImportMatch) {
        const insertPos = firstImportMatch.index!
        newContent =
          newContent.slice(0, insertPos) +
          "import { describe, expect, test } from 'bun:test'\n" +
          newContent.slice(insertPos)
      }
    }
  }

  // Replace it.prop() with test() + fc.assert()
  newContent = newContent.replace(
    /(fcit|it)\.prop\(\[([^\]]+)\]\)\(\s*['"]([^'"]+)['"],\s*(\([^)]+\))\s*=>\s*{([^}]+)}\s*\)/gs,
    (match, itName, arbs, testName, params, body) => {
      return `test('${testName}', () => {
    fc.assert(
      fc.property(${arbs}, ${params} => {${body}}),
    )
  })`
    },
  )

  // Replace describe.each() with forEach pattern
  newContent = newContent.replace(
    /describe\.each\(\[([^\]]+)\]\)\(([^,]+),\s*\(([^)]+)\)\s*=>\s*{([^}]+)}\s*\)/gs,
    (match, testCases, descName, params, body) => {
      return `describe(${descName}, () => {
    const testCases = [${testCases}]

    testCases.forEach((${params}) => {${body}})
  })`
    },
  )

  // Replace 'it' with 'test' for regular tests
  newContent = newContent.replace(/\bit\(/g, 'test(')
  newContent = newContent.replace(/\bfcit\(/g, 'test(')

  // Fix expect().contain() to expect().toContain()
  newContent = newContent.replace(/expect\(([^)]+)\)\.contain\(/g, 'expect($1).toContain(')

  // Fix expect().between() - this needs custom implementation
  newContent = newContent.replace(
    /expect\(([^)]+)\)\.between\(\{\s*begin:\s*([^,]+),\s*end:\s*([^}]+)\s*\}\)/g,
    'expect($1).toBeGreaterThanOrEqual($2) && expect($1).toBeLessThanOrEqual($3)',
  )

  writeFileSync(file, newContent, 'utf-8')
  console.log(`✓ Migrated ${file}`)
}

console.log(`\n✓ Migration complete!`)
