# ADR: Svelte v4 から v5 への移行

- Status: accepted
- Date: 2025-09-04
- Issue: #566

## Context

- Vite と周辺ツールを最新に保つ上で、Svelte v4 がボトルネックになっている。
  - `@sveltejs/vite-plugin-svelte@^6`、`svelte-check@^4`、`eslint-plugin-svelte@^3` などが Svelte 5 を前提とする。
  - Renovate により `svelte@4 → 5` のみを上げた PR (#789) は存在するが、周辺依存やソース修正が未反映のため、ビルド/実行/型チェックで問題が残るリスクが高い。

## Decision

- 段階移行戦略を採用する。
  1) 依存更新（SvelteKit 2.x、vite-plugin、svelte-check、prettier-plugin-svelte、eslint-plugin-svelte、Cloudflare adapter など）
  2) 最小修正でのビルド緑化（`on:` → `onclick`、`createEventDispatcher` → コールバック props、子 props の `$bindable` 化 など）
  3) 推奨API（Runes: `$state/$derived/$effect/$bindable`）の段階導入
  4) Cloudflare Pages + D1（adapter-cloudflare）で SSR/CSR/HMR 動作確認
  5) svelte-check v4 と ESLint(Flat) の全通過・テスト更新

- 変更は小さな PR に分割し、全て Issue #566 にリンクする。

## Consequences

- 一時的にレガシー構文は残しつつ、重要経路から順次置換する。
- イベント/バインド/型の変更が広範囲に及ぶため、回帰テスト・アクセシビリティ検証を強化する。

## Considered Options

1) 一括置換（Runes まで一度に）
   - Pros: 完了までが短い
   - Cons: 変更差分が巨大になり、レビュー/回帰リスクが高い（却下）

2) 段階移行（採用）
   - Pros: リスク分散・レビュー容易・トレーサブル
   - Cons: PR 数が増える

## Migration Steps (Summary)

- 依存
  - `svelte@^5.38`
  - `@sveltejs/kit@^2`
  - `@sveltejs/vite-plugin-svelte@^6`
  - `svelte-check@^4`（TS>=5）
  - `prettier-plugin-svelte@^3.4`
  - `eslint-plugin-svelte@^3`（Flat Config）
  - `@testing-library/svelte@^5`
  - `@sveltejs/adapter-cloudflare` 最新

- コード変更
  - DOM: `on:click` → `onclick`（修飾子は v5 流に）
  - コンポーネント: `createEventDispatcher` → コールバック props（`event.detail` → 関数引数）
  - 子 props 双方向: `$bindable()` に変更、親の `bind:` は継続可
  - リアクティビティ: `$:` は当面可、段階的に `$state/$derived/$effect` へ

- 品質
  - `svelte-check`/ESLint 通過、テスト更新（property-based 優先）
  - Lighthouse/Web Vitals で劣化確認、Cloudflare Pages + Wrangler で動作検証

