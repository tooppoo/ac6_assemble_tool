// no-op

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
// NOTE: no SvelteKit versioning; package.json read not required here

// NOTE: SvelteKit versioning is not used; handled via Vite define

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
    }),
    // No base path for custom domain root deploy
    alias: {
      '$/*': './*',
    },
  },
}

export default config
