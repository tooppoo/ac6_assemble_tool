# @ac6_assemble_tool/web

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
