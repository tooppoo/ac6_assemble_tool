# 仕様ディレクトリ (docs/specs)

このディレクトリは、機能ごとの仕様書を管理する場所です。

## ディレクトリ構造

```txt
docs/specs/
├── README.md                    # 本ファイル
├── {feature-name}/              # 機能ごとのディレクトリ
│   ├── requirements.md          # 要件定義書
│   ├── design.md                # 技術設計書
│   ├── request.md               # （任意）要求定義
│   └── scenario.md              # （任意）ユーザーシナリオ
└── ...
```

## ファイルの役割

### requirements.md

機能の要件定義書。以下を含む。

- **Introduction**: 機能の概要とビジネス価値
- **Requirements**: 要件ごとの Acceptance Criteria（WHEN/THEN/WHERE 形式）
- **非機能要件**: パフォーマンス、ユーザビリティなど
- **優先度サマリー**: MoSCoW 分類

### design.md

技術設計書。以下を含む。

- **Overview**: 目的、ユーザー、アーキテクチャコンテキスト
- **Goals / Non-Goals**: スコープの明確化
- **Architecture**: 既存アーキテクチャ分析、設計方針
- **Implementation Details**: 具体的な実装方針

**注意**: 設計書には実装コードを含めないこと。方針・構造・インターフェースの定義に留める。

### request.md（任意）

要求定義。要件化前の初期要求や背景情報を記録する。

### scenario.md（任意）

ユーザーシナリオ。具体的な利用ストーリーを記述する。

## ワークフロー

1. **要求収集**: `request.md` に初期要求を記録
2. **要件定義**: `requirements.md` を作成し、承認を得る
3. **技術設計**: `design.md` を作成し、承認を得る
4. **タスク生成**: 設計に基づいてタスクを生成
5. **実装**: 設計承認後、実装開始

## 命名規則

- ディレクトリ名: `kebab-case`（例: `parts-list-view`）
- 機能名は具体的かつ簡潔に

## 参照

- [AGENTS.md](../../AGENTS.md) - 開発ルール
- [docs/terms.md](../terms.md) - 用語集
