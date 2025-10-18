# logger.ts を packages/shared に配置する

- ステータス: 承認済み
- 日付: 2025-10-18
- タグ: architecture, monorepo, dependency-management, logger

技術ストーリー: [Issue #848](https://github.com/tooppoo/ac6_assemble_tool/issues/848)

## 背景 / 文脈

Issue #848 において、`logger.ts` が `packages/core` と `packages/parts` に重複して配置されていることが判明した。この重複を解消するため、共通化の配置先として以下の2つの選択肢が検討された：

1. **packages/shared**: 新規パッケージとして技術的ユーティリティ専用のレイヤーを作成
2. **packages/core**: 既存パッケージに配置し、parts から依存させる

どちらの配置を選択すべきか？

## 決定ドライバ

- **MUST要件**: 依存関係の一方向性（AGENTS.md L161-L162）- 相互依存の禁止、循環依存リスクの排除
- **SHOULD要件**: 責務分離（docs/steering/structure.md）- core の責務は「AC6アセンブリ計算エンジン」
- **SHOULD要件**: 可逆性（AGENTS.md L320）- 設計決定の取り消しが可能であること
- **MAY要件**: monorepo ベストプラクティス（AGENTS.md L245-L251）- パッケージの責務境界の明確化

## 検討した選択肢

1. packages/shared に配置（採用）
2. packages/core に配置

## 決定（採択）

選択したオプション: "packages/shared に配置"。理由: MUST要件である依存関係の一方向性を完全に満たし、循環依存リスクをゼロにできる。さらに、責務分離と将来の拡張性において優位性がある。

### 実装方針

**ディレクトリ構成**:

```txt
packages/
├── shared/           # 新規作成: 技術的インフラレイヤー
│   ├── src/
│   │   └── logger.ts
│   └── package.json
├── core/             # logger.ts への依存を shared に変更
├── parts/            # logger.ts への依存を shared に変更
└── web/              # logger.ts への依存を shared に変更
```

**依存関係図**:

```txt
shared (技術的インフラ: logger, 将来的にtype guards/Result型等)
  ↑
  ├── core (ビジネスロジック: AC6アセンブリ計算エンジン)
  ├── parts (ドメインデータ: パーツ定義)
  └── web (UI: フロントエンド)
```

**パッケージ名**: `@ac6_assemble_tool/shared`

## 影響評価

- **セキュリティ**: 影響なし - logger の機能は変更なし、依存関係のみ変更
- **パフォーマンス**: 影響なし - monorepo 内部参照のため、ランタイム性能に変化なし
- **ユーザー体験**: 影響なし - 内部アーキテクチャの変更のみ
- **アクセシビリティ**: 影響なし
- **トレーサビリティ**: 改善 - logger の配置が一元化され、変更履歴の追跡が容易になる

### ポジティブな影響

- **循環依存リスクの完全排除**: shared は最下層レイヤーとして一方向依存を保証
- **責務の明確化**: core は「ビジネスロジック」、shared は「技術的インフラ」と明確に分離
- **拡張性の向上**: 将来的な共通ユーティリティ（type guards, Result型, validators等）の配置基準が明確
- **可逆性の確保**: shared → core への移動は容易（逆は困難）

### ネガティブな影響 / トレードオフ

- **パッケージ数の増加**: 3パッケージ → 4パッケージに増加（管理コスト微増）
- **初期設定コスト**: 新規パッケージの作成と、既存3パッケージ（core, parts, web）の import 文更新が必要

## 各選択肢の利点と欠点

### packages/shared に配置（採用）

**依存関係図**:

```txt
shared ← core
shared ← parts
shared ← web
```

- 良い点: 一方向依存が保証され、循環依存リスクがゼロ
- 良い点: logger の責務が「技術的インフラ」として明確化
- 良い点: 将来的な共通ユーティリティの配置基準が明確（「技術的ユーティリティ = shared」）
- 良い点: AGENTS.md の「可逆性」原則に適合（shared → core への移動が容易）
- 良い点: monorepo ベストプラクティスに準拠（レイヤー化された責務分離）
- 悪い点: 新規パッケージの作成コスト（package.json, tsconfig.json等）
- 悪い点: パッケージ数が増加（管理コスト微増）

### packages/core に配置（却下）

**依存関係図**:

```txt
core ← parts  # 新規依存が発生
core ← web    # 既存依存
```

- 良い点: 新規パッケージの作成が不要
- 良い点: パッケージ数が増加しない
- 悪い点: parts → core 依存が発生し、将来的な循環依存リスクが生じる
- 悪い点: core の責務が混在（「AC6アセンブリ計算エンジン」+ 「技術的インフラ」）
- 悪い点: 将来的な共通ユーティリティの配置基準が不明確
- 悪い点: core → shared への移動が困難（可逆性が低い）

## フォローアップ / 移行計画

PR #868 にて実装完了済み：

1. ✅ `packages/shared` パッケージの作成
2. ✅ `logger.ts` の移動と型定義の整備
3. ✅ `packages/core` の import 更新（4ファイル）
4. ✅ `packages/parts` の import 更新（1ファイル）
5. ✅ `packages/web` の import 更新（7ファイル）
6. ✅ pnpm-lock.yaml の workspace 依存関係更新
7. ✅ ビルド・テストの成功確認

## 参考リンク

- [Issue #848](https://github.com/tooppoo/ac6_assemble_tool/issues/848) - logger.ts 重複問題
- [PR #868](https://github.com/tooppoo/ac6_assemble_tool/pull/868) - 実装
- AGENTS.md L161-L162 - 依存の一方向性（MUST要件）
- AGENTS.md L320 - 可逆性（SHOULD要件）
- AGENTS.md L245-L251 - monorepo 構成（MAY要件）
- docs/steering/structure.md L26-L47 - core パッケージの責務定義
- docs/steering/structure.md L127-L131 - レイヤー間依存ルール
