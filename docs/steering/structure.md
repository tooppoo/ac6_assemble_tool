# Project Structure

## Root Directory Organization

```txt
ac6_assemble_tool/
├── packages/           # monorepo パッケージ群
├── docs/              # プロジェクトドキュメント
├── .devcontainer/     # VS Code 開発環境設定
├── .github/           # GitHub Actions & Issue/PR テンプレート
├── .claude/           # Claude Code コマンド定義
├── .kiro/             # 仕様駆動開発管理
├── package.json       # ルートパッケージ設定
├── turbo.json         # Turbo タスク定義
├── AGENTS.md          # AI エージェント向け開発指針
├── CLAUDE.md          # Claude Code プロジェクト指示
└── README.md          # プロジェクト概要
```

### Key Root Files

- **AGENTS.md**: 必須読み込みファイル - 全AI操作での優先指針
- **CLAUDE.md**: Claude Code 統合とKiro仕様駆動開発設定
- **turbo.json**: monorepo タスク実行とキャッシュ戦略

## Packages Structure (Monorepo)

### Core Packages

#### `/packages/core/`

##### **ビジネスロジック・計算エンジン**

```txt
core/
├── src/
│   ├── assembly/          # 機体組み立てロジック
│   │   ├── assembly.ts           # メイン組み立て計算
│   │   ├── filter/               # パーツフィルタリング
│   │   ├── random/               # ランダム生成・検証
│   │   ├── serialize/            # URL/クエリパラメータ
│   │   └── store/                # データ永続化
│   └── utils/                    # ユーティリティ関数
├── spec/                         # テストファイル (実装と同じ構造)
├── spec-helper/                  # テスト支援ツール
└── dist/                         # ビルド出力
```

#### `/packages/web/`

##### **Webフロントエンド**

```txt
web/
├── src/
│   ├── lib/                      # 共通ライブラリ
│   │   ├── view/                 # ビュー固有ロジック
│   │   │   └── index/            # メインページ関連
│   │   │       ├── filter/       # フィルター機能
│   │   │       ├── interaction/  # ユーザー操作
│   │   │       └── report/       # レポート表示
│   │   ├── i18n/                 # 国際化リソース
│   │   │   └── locales/          # 言語別ファイル
│   │   ├── candidates/           # パッチバージョン別データ
│   │   └── utils/                # ユーティリティ
│   ├── routes/                   # SvelteKit ルーティング
│   └── types/                    # TypeScript 型定義
├── .svelte-kit/                  # SvelteKit ビルド
├── dist/                         # 本番ビルド出力
└── scripts/                      # ビルド・デプロイスクリプト
```

#### `/packages/parts/`

##### **パーツデータ管理**

```txt
parts/
├── src/
│   ├── types/                    # パーツ型定義
│   │   ├── base/                 # 基底型 (ACParts等)
│   │   ├── frame/                # フレーム系パーツ
│   │   ├── unit/                 # 武装系パーツ
│   │   ├── inner/                # 内装パーツ
│   │   └── expansion/            # 拡張パーツ
│   ├── versions/                 # パッチバージョン対応
│   └── [パーツ種別].ts           # パーツ実体定義
```

### Support Packages

#### `/packages/spec/`

##### **テスト仕様・共通テストライブラリ**

#### `/packages/tsconfig/`

##### **共通TypeScript設定**

#### `/packages/eslint/`

##### **共通ESLint設定**

## Code Organization Patterns

### Layer Architecture

```txt
entrypoint/     # エンドポイント・UI コンポーネント
├── routes/            # SvelteKit ルーティング
└── lib/view/          # ビューロジック

application/    # アプリケーション・ユースケース層
├── interaction/       # ユーザー操作処理
├── filter/           # データ フィルタリング
└── report/           # レポート生成

domain/         # ドメインロジック
├── assembly/         # 機体組み立てロジック
├── random/           # ランダム生成
└── serialize/        # データ変換

infrastructure/ # インフラストラクチャ
└── store/           # データ永続化
```

### レイヤー間依存ルール

- **上位→下位**: 一方向依存のみ許可
- **抽象依存**: 具象への直接依存禁止
- **分離原則**: 異レイヤーは物理的に別ディレクトリ

## File Naming Conventions

### TypeScript Files

- **PascalCase**: クラス・インターフェース定義ファイル (`Assembly.ts`)
- **camelCase**: 関数・ユーティリティファイル (`createAssembly.ts`)
- **kebab-case**: コンポーネント・ページファイル (`filter-by-parts.svelte`)

### Test Files

- **同一ディレクトリ**: テストは実装と同じディレクトリに配置
- **拡張子**: `.spec.ts` または `.test.ts`
- **例**: `assembly.ts` → `assembly.spec.ts`

### Documentation Files

- **UPPERCASE**: プロジェクト重要ファイル (`README.md`, `AGENTS.md`)
- **kebab-case**: 通常ドキュメント (`add-dependency.md`)

## Import Organization

### Import順序

1. **外部ライブラリ**: npm パッケージ
2. **内部パッケージ**: `@ac6_assemble_tool/*`
3. **相対パス**: `./`, `../`

### Path Aliases

- **`#core/`**: `packages/core/src/` へのエイリアス
- **`$lib/`**: `src/lib/` へのエイリアス (webパッケージ内)

### Example

```typescript
// 1. 外部ライブラリ
import { sum } from 'lodash-es'
import { z } from 'zod'

// 2. 内部パッケージ
import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
import { Head } from '@ac6_assemble_tool/parts/heads'

// 3. 相対パス
import { createLogger } from '../utils/logger'
import './component.css'
```

## Key Architectural Principles

### Domain-Driven Design

- **ドメインモデル中心**: Assembly, Parts等の中核概念
- **ユビキタス言語**: AC6ゲーム用語の統一
- **境界コンテキスト**: パッケージ単位での責務分離

### Type-Level Programming

- **Parse Don't Validate**: 型変換によるデータ検証
- **Brand Types**: 意味的型安全性 (`ReportKey`, `AssemblyKey`)
- **Immutable Design**: 読み取り専用型の積極利用

### Performance Optimization

- **計算の遅延評価**: `get` プロパティによる必要時計算
- **メモ化**: 重い計算結果のキャッシュ
- **Tree Shaking**: 未使用機能の自動除去

### Error Handling Strategy

- **Result型**: ユーザー解決可能エラー
- **Exception**: システムレベルエラーのみ
- **構造化ログ**: 機微情報除外の徹底

## Documentation Structure

### `/docs/`

```txt
docs/
├── adr/                  # Architecture Decision Records
├── spec/                 # 仕様書 (要求・設計・テスト)
│   ├── steering/         # Kiro ステアリングファイル
│   └── templates/        # 仕様テンプレート
├── terms.md              # プロジェクト用語集
├── naming.md             # 命名規則
└── checklist/            # 作業チェックリスト
```

### Spec-Driven Development

- **Kiro形式**: `.kiro/specs/` での仕様管理
- **3段階承認**: 要件→設計→タスク→実装
- **トレーサビリティ**: 要求から実装までの追跡可能性

## Configuration Management

### Package.json Strategy

- **Workspace管理**: pnpm workspaces での統一
- **依存固定**: セキュリティ重視でバージョン固定
- **Scripts統一**: 共通操作の標準化

### Environment Configuration

- **Local**: `.env.local` (Git除外)
- **Development**: デフォルト設定
- **Production**: Cloudflare Pages環境変数

## Build & Distribution

### Output Structure

```txt
dist/           # 本番ビルド出力
├── _app/       # アプリケーションファイル
├── assets/     # 静的アセット
└── index.html  # メインHTML
```

### Package Distribution

- **Internal**: monorepo内での相互参照
- **External**: npm publish不要 (内部利用のみ)
- **TypeScript**: 型定義の自動生成と配布
