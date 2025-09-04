# ADR: Svelte v4 から v5 への移行

- Status: accepted
- Date: 2025-09-04
- Issue: #566

## Context

- Vite と周辺ツールを最新に保つ上で、Svelte v4 がボトルネックになっている。
  - `@sveltejs/vite-plugin-svelte@^6`、`svelte-check@^4`、`eslint-plugin-svelte@^3` などが Svelte 5 を前提とする。
  - Renovate により `svelte@4 → 5` のみを上げた PR (#789) は存在するが、周辺依存やソース修正が未反映のため、ビルド/実行/型チェックで問題が残るリスクが高い。

## Decision

- 段階移行戦略を採用する（詳細な手順・影響スキャンは Issue #566 を参照）。
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

## Links

- 実装計画・影響スキャン・優先度: Issue #566 に集約
