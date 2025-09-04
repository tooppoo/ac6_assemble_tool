# 要件定義: Svelte v5 への移行

## 背景/目的

- Vite/周辺ツールの最新化に伴い Svelte v4 がブロッキング要因となっている。
- Svelte v5 での新リアクティビティ（Runes）とイベント/バインド仕様に追従し、保守性/性能/UX/アクセシビリティの向上を図る。

## 非機能要件

- 開発環境: Node >= 18, TypeScript >= 5
- 依存整合: `svelte@^5.38`, `@sveltejs/kit@^2`, `@sveltejs/vite-plugin-svelte@^6`, `svelte-check@^4`, `prettier-plugin-svelte@^3.4`, `eslint-plugin-svelte@^3`, `@testing-library/svelte@^5`, `@sveltejs/adapter-cloudflare` 最新
- 配備: Cloudflare Pages + D1、Wrangler でローカル検証可能
- 品質: `svelte-check`/ESLint 全通過、主要フローの回帰/アクセシビリティ/パフォーマンス検証

## 変更方針（概要）

- DOMイベント: `on:` 構文からプロパティ（`onclick` 等）へ移行
- コンポーネントイベント: `createEventDispatcher` 廃止 → コールバック props 採用（`event.detail` → 引数）
- 双方向バインド: 子 props を `$bindable()` で宣言、親の `bind:` は継続
- リアクティブ: `$:` を保持しつつ、段階的に `$state/$derived/$effect` を導入

## 手順（サマリ）

1) 依存更新（SvelteKit/プラグイン/検査/整形/ESLint/adapter）
2) 最小修正でビルド緑化（イベント/dispatcher/`$bindable`）
3) Runes 段階導入（重要経路から）
4) Cloudflare Pages + D1 で SSR/CSR/HMR 検証
5) svelte-check/ESLint/テストの緑化と回帰/パフォーマンス/アクセ検証

