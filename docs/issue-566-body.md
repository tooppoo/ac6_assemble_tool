# Svelte v5 対応（v4 → v5 移行）

## なぜ対応が必要か（Vite アップデートのブロッキング要因）

- Vite と周辺ツールを最新化するにあたり、Svelte v4 が障害となっているため。
  - `@sveltejs/vite-plugin-svelte@^6`、`svelte-check@^4`、`eslint-plugin-svelte@^3` などが Svelte 5 を前提とする。
  - Renovate の更新PR（svelte 4→5 のみ）は存在するが、周辺依存とソース側の必要変更が未反映で、ビルド/実行/型検査の失敗や挙動差のリスクがある。

## 進め方（移行手順の要約）

1. 依存の更新
   - `svelte@^5.38`, `@sveltejs/kit@^2`, `@sveltejs/vite-plugin-svelte@^6`, `svelte-check@^4`,
     `prettier-plugin-svelte@^3.4`, `eslint-plugin-svelte@^3`, `@testing-library/svelte@^5`,
     `@sveltejs/adapter-cloudflare`（Pages + D1 前提）
   - Node >= 18, TypeScript >= 5 を CI/ローカルで保証
2. 最小修正でのビルド緑化
   - DOMイベント: `on:click` → `onclick`（修飾子は v5 流に置換）
   - コンポーネントイベント: `createEventDispatcher` → コールバック props（`event.detail` 参照を「引数」へ置換）
   - 子 props 双方向: 子側で `$bindable()` を使用（親の `bind:` は継続可）
   - 既存の `$:` は当面可。警告/非推奨箇所は限定的に Runes へ置換
3. 推奨API（Runes）の段階導入
   - `$state/$derived/$effect/$bindable` を重要経路から順次導入し、保守性/性能を向上
4. テスト/静的解析/整形
   - `svelte-check v4`/ESLint(Flat+`eslint-plugin-svelte` v3)/Prettier を最新構成に
   - コンポーネントテストを更新（イベント→コールバック、`detail` 廃止）。property-based testing を優先
5. ビルド/配備確認
   - SvelteKit 2.x + adapter-cloudflare 最新で Cloudflare Pages + D1 の SSR/CSR/HMR を確認（Wrangler ローカル含む）
6. 品質検証
   - 主要フローの回帰（フォーム/IME/キーボード）とアクセシビリティ/パフォーマンス（Lighthouse/Web Vitals）を確認

## 備考

- 変更は小さなPRに分割し、すべてこのIssue（#566）にリンクします。
- 詳細方針/検討は ADR を参照（`docs/adr/20250904-svelte5-migration.md`）。

