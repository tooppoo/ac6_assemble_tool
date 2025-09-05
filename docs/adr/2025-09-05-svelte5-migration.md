# Svelte v5 移行の方針と判断

- Status: Accepted
- Date: 2025-09-05
- Related: #566, base branch `renovate/svelte-5.x`

## 背景 / 文脈

フロントエンド (`packages/web`) は Svelte 4 系で稼働していたが、依存の老朽化と Svelte 5 の安定化に伴い、セキュリティ更新・開発生産性・将来互換性を目的に Svelte 5 へ移行する。
Renovate が作成したベースブランチ `renovate/svelte-5.x` にて `svelte@5` への更新が行われている。

## 目標

- Svelte 5 でビルド・テスト・Lint が通る状態にする
- UX, アクセシビリティ、パフォーマンスを劣化させない
- 追跡可能性（トレーサビリティ）を保つ: 変更理由と影響を ADR に残す
- Renovate ブランチベースの PR 運用（main 直ではない）

## 採択したアプローチ

- ベース: `renovate/svelte-5.x`
- 追加更新: `@sveltejs/vite-plugin-svelte` を Svelte 5 対応版へ更新（`6.1.4`）。
  - 理由: Svelte 5 では Vite プラグインの新系統が必要であり、最新のプラグインは Svelte 5 に最適化されているため。
- 既存の Svelte コンポーネントは後方互換の範囲で最小変更（Renovate 反映済みの `IconButton.svelte`, `StoreAssembly.svelte` の更新を尊重）。
- SvelteKit は現行の 2.x を継続利用（現状要件では SSR/Adapter 構成の変更不要）。

## セキュリティの観点

- 依存の更新により既知脆弱性の軽減が期待できる。
- ビルドツールチェーンの更新（vite-plugin-svelte）に伴い、ビルド時に取り込む依存も更新されるため、CI 上での SBOM/監査（npm audit 等）の再実行を前提とする。

## パフォーマンスの観点

- ランタイムは Svelte 5 へ更新。差分の詳細計測は今後の Lighthouse と e2e 測定で確認。
- ビルド出力やツリーシェイキングは Vite プラグインの更新により改善余地あり。バンドルサイズは `vite-bundle-analyzer` で確認可能。

## ユーザー体験（UX）の観点

- UI/振る舞いは不変を目標（リファクタリングで既存挙動を変えない）。
- i18n, OffCanvas, Tooltip 等の主要操作は E2E/結合テストで後方互換を確認する。

## アクセシビリティの観点

- `IconButton` の `aria-label`, `role` を維持。Svelte 5 での DOM 属性伝播は後方互換を期待できる（レンダリング差異がないか UI テストで確認）。

## トレーサビリティ

- 本 ADR に判断・理由を集約。
- PR のベースは `renovate/svelte-5.x` とし、main には直接向けない（Renovate 運用方針に準拠）。

## 代替案と却下理由

- 代替案1: Svelte 4 を継続
  - 却下: 依存の老朽化と将来の互換性リスクが増大。
- 代替案2: SvelteKit のメジャーアップデートや Adapter 変更も同時実施
  - 却下: 変更範囲が広がりリスク/コスト増。今回は Svelte 本体と Vite プラグインに限定。

## マイグレーション影響点（要監視）

- `@sveltejs/vite-plugin-svelte` のメジャー更新に伴うプリプロセス/警告の変化
- `$$props`/`$$restProps` 経由のクラス・属性伝播（`IconButton` など）
- 外部ライブラリ互換性（`@sveltestrap/sveltestrap`, `@testing-library/svelte`, `svelte-check`）

## 検証計画（推奨）

- Lint: `npm -w packages/web run lint`
- 型/チェック: `npm -w packages/web run check-types`
- テスト: `npm -w packages/web run test`（必要に応じて `test:integration`）
- ビルド: `npm -w packages/web run build`
- パフォーマンス: `npm -w packages/web run lighthouse`（CI ワークフローの実行結果で確認）

## リリースノート

- 手動で作成せず、GitHub の自動生成を使用する。

