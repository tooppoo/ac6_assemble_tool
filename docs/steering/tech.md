# Technology Stack

_Last Updated: 2025-12-12_

## Recent Changes

- **2025-12-12**: Zod → Valibot移行（軽量化とパフォーマンス向上）、lodash削除
- **2025-12-12**: Node.js 24.11.1、pnpm 10.24.0、Vitest 4.xへ更新

## Architecture Overview

モダンなJavaScript/TypeScriptエコシステムをベースとした、monorepo構成のWebアプリケーション。フロントエンド中心のアーキテクチャで、静的サイト生成とクライアントサイドレンダリングのハイブリッド構成。

## Frontend Technologies

### Core Framework

- **Svelte 5** + **SvelteKit**: メインフレームワーク
- **TypeScript**: 型安全性確保のための開発言語
- **Vite**: 高速ビルドツールとDEVサーバー

### UI Components & Styling

- **Sveltestrap**: Bootstrap 5ベースのSvelteコンポーネントライブラリ
- **Bootstrap 5**: CSSフレームワーク
- **CSS Variables**: テーマ管理とカスタマイゼーション

### State Management & Data

- **Svelte Stores**: リアクティブ状態管理
- **Dexie**: IndexedDBラッパーライブラリ（データ永続化）
- **Valibot**: スキーマバリデーション（軽量・高性能なZod代替）

### Internationalization

- **i18next** + **svelte-i18next**: 多言語対応
- **日本語・英語**: サポート言語

## Development Environment

### Package Management

- **pnpm 10.24.0**: パッケージマネージャー
- **Node.js 24.11.1**: ランタイム要求バージョン

### Monorepo Management

- **Turbo**: タスクランナーとキャッシュシステム
- **pnpm workspaces**: パッケージ間依存管理

### Code Quality

- **ESLint**: 静的解析とコード規約
- **Prettier**: コードフォーマット
- **TypeScript Compiler**: 型チェック
- **lint-staged**: コミット時の自動チェック

### Testing Framework

- **Vitest**: テストランナー
- **@testing-library/svelte**: コンポーネントテスト
- **jsdom**: ブラウザ環境シミュレーション
- **@vitest/coverage-v8**: カバレッジ測定

## Build & Deployment

### Build Process

- **SvelteKit Static Adapter**: 静的サイト生成
- **vite-bundle-analyzer**: バンドルサイズ分析
- **GitHub Actions**: CI/CDパイプライン

### Hosting & Deployment

- **Cloudflare Pages**: ホスティングプラットフォーム
- **Production URL**: <https://ac6-assemble-tool.philomagi.dev/>
- **自動デプロイ**: mainブランチプッシュ時に実行

### Environment Variables

- `PUBLIC_REPORT_BUG_URL`: バグレポートURL
- `PUBLIC_REPORT_REQUEST_URL`: 機能リクエストURL
- `PUBLIC_LOG_LEVEL`: ログレベル設定
- `PUBLIC_SITE_URL`: サイトURL

## Common Development Commands

### Start Development

```bash
pnpm install
pnpm run dev
```

### Build & Test

```bash
pnpm run build          # プロダクションビルド
pnpm run test           # テスト実行
pnpm run test:watch     # テスト監視モード
pnpm run coverage       # カバレッジ測定
```

### Check Code Quality

```bash
pnpm run lint           # ESLintチェック
pnpm run format         # Prettierフォーマット
pnpm run check-types    # TypeScript型チェック
```

### Package-specific Commands

```bash
pnpm web <command>      # webパッケージ操作
pnpm parts <command>    # partsパッケージ操作
```

## Port Configuration

- **Development Server**: デフォルト 5173 (Vite)
- **Preview Server**: デフォルト 4173 (SvelteKit)

## Performance Optimization

### Build Optimization

- **Code Splitting**: 自動的なチャンク分割
- **Tree Shaking**: 未使用コードの除去
- **Bundle Analysis**: サイズ監視とレポート

### Runtime Optimization

- **Service Worker**: (必要に応じて実装)
- **Lazy Loading**: コンポーネントの遅延読み込み
- **Caching Strategy**: 効果的なキャッシング

## Monitoring & Analytics

### Performance Monitoring

- **Lighthouse**: パフォーマンス測定
- **Core Web Vitals**: ユーザー体験指標
- **Bundle Size Tracking**: バンドルサイズ監視

### Error Tracking

- **Console Logging**: 構造化ログ出力
- **Error Boundaries**: エラーハンドリング

## Version Control & Release

### Git Strategy

- **Feature Branch**: 機能開発用ブランチ
- **Main Branch**: プロダクション反映ブランチ
- **Semantic Versioning**: バージョン管理

### Release Process

```bash
pnpm version minor      # バージョン番号更新
git push origin v1.2.3  # タグプッシュ
# GitHub UI でリリース作成
```

## Dependencies & Security

### Major Dependencies Version Policy

- **固定バージョン**: セキュリティ重視でキャレット記号不使用
- **定期更新**: Renovate による自動更新PR
- **脆弱性監視**: GitHub Security Alerts

### Key Library Versions

- **Svelte**: ~5.x
- **TypeScript**: ~5.9.x
- **Vite**: ~7.x
- **Vitest**: ~4.x
- **Valibot**: ~1.x
