# @ac6_assemble_tool/web

## 2.7.0
### Minor Changes



- [#890](https://github.com/tooppoo/ac6_assemble_tool/pull/890) [`2168f42`](https://github.com/tooppoo/ac6_assemble_tool/commit/2168f42895e60b5ac6b3ca7cec032aaf038e9988) Thanks [@tooppoo](https://github.com/tooppoo)! - 並び替えUIを実装

## 2.6.0

### Minor Changes

- [#888](https://github.com/tooppoo/ac6_assemble_tool/pull/888) [`09dc4d5`](https://github.com/tooppoo/ac6_assemble_tool/commit/09dc4d5896240d9126582b313c143f34489e0371) Thanks [@tooppoo](https://github.com/tooppoo)! - フィルタの設定状態をURLクエリとして保持

## 2.5.0

### Minor Changes

- [#883](https://github.com/tooppoo/ac6_assemble_tool/pull/883) [`54317ab`](https://github.com/tooppoo/ac6_assemble_tool/commit/54317ab6eb6eabc41dd3e6f8f083bfd93f552c8f) Thanks [@tooppoo](https://github.com/tooppoo)! - URL圧縮に標準APIを使用 + フッターを共通レイアウト化

## 2.4.0

### Minor Changes

- [#881](https://github.com/tooppoo/ac6_assemble_tool/pull/881) [`561b012`](https://github.com/tooppoo/ac6_assemble_tool/commit/561b012da3f8ee6affd3c25b367b54543584d430) Thanks [@tooppoo](https://github.com/tooppoo)! - 内部構造リファクタ

## 2.3.0

### Minor Changes

- [#879](https://github.com/tooppoo/ac6_assemble_tool/pull/879) [`528410d`](https://github.com/tooppoo/ac6_assemble_tool/commit/528410d7f6d24b763b098d3347a9c7a7dde7bb54) Thanks [@tooppoo](https://github.com/tooppoo)! - パーツ一覧表示実装

## 2.2.0

### Minor Changes

- [#877](https://github.com/tooppoo/ac6_assemble_tool/pull/877) [`ac28a59`](https://github.com/tooppoo/ac6_assemble_tool/commit/ac28a5964ae1380734bd87c043bd5347dfe7e479) Thanks [@tooppoo](https://github.com/tooppoo)! - スロット選択・フィルタ選択UIを追加

## 2.1.0

### Minor Changes

- [#875](https://github.com/tooppoo/ac6_assemble_tool/pull/875) [`4cc30dd`](https://github.com/tooppoo/ac6_assemble_tool/commit/4cc30ddd5431ad0b3e6ce81ba7ea31d602aa30a8) Thanks [@tooppoo](https://github.com/tooppoo)! - ツール概要ページを追加

## 2.0.2

### Patch Changes

- [#868](https://github.com/tooppoo/ac6_assemble_tool/pull/868) [`2e56eca`](https://github.com/tooppoo/ac6_assemble_tool/commit/2e56eca12ed43cb8fd86fcab687ea37975238c6b) Thanks [@tooppoo](https://github.com/tooppoo)!
  - 内部構造を整理
    - 共有パッケージを作って依存を整理

## 2.0.1

### Patch Changes

- [#854](https://github.com/tooppoo/ac6_assemble_tool/pull/854) [`1a860f1`](https://github.com/tooppoo/ac6_assemble_tool/commit/1a860f1bc8d7504976e5bf80224bc8757337bdb4) Thanks [@tooppoo](https://github.com/tooppoo)! - # 404.htmlとsitemap.xmlを配置

  #### WHY (なぜ)
  - SEO向上とユーザビリティ改善のため
  - 検索エンジンのクローラビリティを向上させる必要があった
  - 存在しないページへのアクセス時に適切なエラーページを表示するため

  #### WHAT (何を)
  - カスタム404エラーページ（404.html）を追加
  - XMLサイトマップ（sitemap.xml）を生成・配置
  - 静的ファイルとしてpublic/staticディレクトリに配置

  #### HOW (どのように)
  - 404.htmlページを作成し、ユーザーフレンドリーなエラーメッセージを実装
  - sitemap.xmlを自動生成する仕組みをビルドプロセスに組み込み、デプロイ時に自動的に配置されるよう設定

## 2.0.0

### Major Changes

- [#849](https://github.com/tooppoo/ac6_assemble_tool/pull/849) [`e35425d`](https://github.com/tooppoo/ac6_assemble_tool/commit/e35425d0214a148fbd2dfedf33395bab940ea948) Thanks [@tooppoo](https://github.com/tooppoo)! - # パーツ識別方式をインデックスベースからIDベースへ移行

  ## WHAT（破壊的変更の内容）
  - **URL共有形式の変更**: インデックスベース（v1: `?h=0&c=1&a=2`）からIDベース（v2: `?v=2&h=HD001&c=CR010&a=AR042`）へ変更
  - **IndexedDBストレージ形式の変更**: パーツをインデックスではなくユニークIDで保存する形式へ変更

  ## WHY（変更理由）

  パーツ追加・削除時にインデックスが変動し、既存のURL共有やストレージデータとの互換性が失われる問題を解決するため。各パーツにグローバルユニークID（例: `HD001`, `WP042`）を付与することで、パーツリスト変更時も安定した識別を実現。

  ## HOW（ユーザーの対応方法）
  - **自動移行**: v1形式のURLとIndexedDBデータは初回アクセス時に自動的にv2形式へ変換されます
  - **注意点**: v2環境で生成したURLやデータはv1環境では動作しません。チーム内でバージョンを統一してください
  - **必要な操作**: なし（自動移行のため手動操作は不要）
