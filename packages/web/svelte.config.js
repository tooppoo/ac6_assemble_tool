import { execSync } from 'child_process'
import fs from 'fs'

import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
/**
 * 本当はimportで済ませたいが、以下の理由からfs.readFileSyncによる回避で対応
 * - import attributeをつけないとビルド時にエラーで落ちる
 * - import attributeをつけるとeslintがParsing Errorで落ちる
 *     - @babel/plugin-syntax-import-attributes の適用も試みたが効果なし？
 *
 * 2024/10/1 時点で import attributes はStage3の段階
 * https://github.com/tc39/proposal-import-attributes
 * ESLintはStage4に上がったら対応する方針
 * https://github.com/eslint/eslint/discussions/15305#discussioncomment-1634740
 * Nodeはv20.10からImport Attributeに対応している
 * https://v8.dev/features/import-attributes
 *
 * 根本的にはESLint側のサポートを待つしか無さそう
 */
// import pkg from './package.json' with { type: 'json' }
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

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    version: {
      // Expose version like "1.22.0-<short-hash>" to $app/environment.version
      name: `${pkg.version}-${shortHash}`,
    },
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
    }),
    paths: {
      base: '/ac6_assemble_tool',
    },
    alias: {
      '$/*': './*',
    },
  },
}

export default config
