# パーツリストページへのパーツデータexport機能の導入

- ステータス: 承認済み
- 日付: 2026-07-14
- タグ: parts-list, export, csv, json, zip

## 背景 / 文脈

パーツリストページ（`parts-list`）では、レギュレーションに含まれる全パーツデータや、フィルタ・ソートを適用した絞り込み結果を画面上で閲覧できる。しかし、これらのデータを画面外に持ち出す手段（ファイルへのexport）が存在しない。パーツデータをスプレッドシート等で独自に加工・分析したいというニーズに応えるため、export機能を追加する。

## 決定ドライバ

- **データの網羅性**: パーツ全項目（カテゴリ固有の詳細ステータス含む）をexportできること
- **粒度の選択肢**: 全体・特定分類・現在の表示（フィルタ適用後）のいずれかを選んでexportできること
- **形式の選択肢**: JSON / CSV を選択できること
- **既存パターンとの整合性**: 本アプリはSvelteKit + クライアント完結型の構成であり、既存のshare機能等もクライアントサイドで完結している
- **再現性**: JSON出力にはレギュレーションバージョンや適用フィルタ条件を含め、後から「何のデータか」を追跡できること

## 検討した選択肢

1. クライアントサイド生成（jszip + papaparse でブラウザ内完結）
2. サーバーサイドAPI経由（`+server.ts` でzip/CSV生成しレスポンス）
3. クライアントサイド生成 + Web Worker（zip生成をWorkerに逃がす）

## 決定（採択）

選択したオプション: "1. クライアントサイド生成"。理由: パーツデータ（regulation）もフィルタ後のデータ（`filteredParts`）も既にブラウザ側にロード済みであり、サーバーへ送って再取得する必要がない。既存のshare機能等もクライアント完結型であり、アプリ全体の構成と整合する。パーツ総数は数百〜千件程度でzip生成のコストも小さく、Worker化によるUIブロッキング対策は現時点では不要（YAGNI）。

- 2026-07-14: ファイル分割粒度をカテゴリ単位から分類（classification）単位に変更（レビュー後のフィードバックによる）

### 機能概要

Export対象は以下の3種類から選択する:

- **全体**: レギュレーションの全パーツを分類単位（`ACParts.classification`フィールド基準）でファイル分割し、zipでダウンロード
- **特定分類**: 分類を1つ選択し、単体ファイルでダウンロード
- **表示中（filtered）**: 現在画面に表示されているパーツ（フィルタ・ソート適用後の`filteredParts`）を単体ファイルでダウンロード

形式（JSON / CSV）はいずれの対象にも適用される。

### ファイル名

いずれの場合もレギュレーションバージョンをファイル名に含める。

- 全体: `ac6-parts-all-<version>.zip`（zip内エントリは`<classification>-<version>.json|csv`）
- 特定分類: `ac6-parts-<classification>-<version>.json|csv`
- 表示中: `ac6-parts-filtered-<version>.json|csv`

### JSON出力の構造

```json
{
  "regulation": "v1.09.1",
  "filter": [],
  "data": []
}
```

- `regulation`: exportしたレギュレーションのバージョン
- `filter`: 適用中のフィルタ条件（表示中exportの時のみ中身が入る。全体・特定分類exportでは空配列）
- `data`: `ACParts[]`（カテゴリ固有の詳細ステータスを含む全フィールド）

zip内の各分類JSONファイルも同様の構造を持つ（`filter`は空配列）。

CSVにはメタデータ格納先がないため、パーツデータのみを出力する（全フィールドをフラット化した表形式）。

### コンポーネント構成

```
packages/web/src/lib/export/
  parts-export.ts        # シリアライズ・グルーピング・zip生成のコアロジック（Svelte非依存）
  parts-export.test.ts

packages/web/src/lib/view/parts-list/export/
  ExportDialog.svelte    # 対象・形式選択ダイアログ
```

`parts-export.ts`が提供する主な関数:

- `flattenRegulation(regulation): ACParts[]`
- `groupByClassification(parts: ACParts[]): Map<Classification, ACParts[]>`
- `toJson(parts: ACParts[], meta: { regulation: string; filter: FilterCondition[] }): string`
- `toCsv(parts: ACParts[]): string`
- `buildZip(groupedParts, format, meta): Promise<Blob>`
- `downloadBlob(blob: Blob, filename: string): void`

`ExportDialog.svelte`は`PartsListView.svelte`から`filteredParts`を受け取り、ツールバーに追加するExportボタンから起動する。

### エラーハンドリング

- 表示中exportでフィルタ結果が空の場合は実行ボタンをdisabledにし、その旨を表示する
- 特定分類exportで分類未選択の場合は実行ボタンをdisabledにする
- zip/Blob生成の失敗はダイアログ内にエラーメッセージを表示するに留め、リトライ機構は設けない（YAGNI）

## 影響評価

- セキュリティ: 影響なし。すべてクライアント内で完結し、外部送信は発生しない
- パフォーマンス: パーツ数百〜千件規模のzip/CSV生成はブラウザ内で軽量に完了する見込み。将来パーツ数が大幅に増えUIブロッキングが問題になった場合はWeb Worker化を検討する
- ユーザー体験: パーツデータを外部ツールで加工・分析したいユーザーのニーズに応える。ダイアログ操作は1画面で完結しシンプル
- アクセシビリティ: ダイアログ内のフォーム要素（ラジオボタン、セレクト）に適切なラベル・フォーカス制御を行う
- トレーサビリティ: JSON出力にレギュレーションバージョンとフィルタ条件を含めることで、export結果がどの条件下のデータかを後から追跡可能にする

### ポジティブな影響

- パーツデータの外部活用（分析・共有）が可能になる
- JSON出力のメタデータにより、export結果の再現性・追跡性が確保される
- コアロジックをSvelte非依存にすることで単体テストが容易になる

### ネガティブな影響 / トレードオフ

- 新規依存として`jszip`・`papaparse`を追加する必要があり、バンドルサイズが若干増加する
- 将来パーツ数が大幅に増加した場合、zip生成がメインスレッドをブロックする可能性がある（その場合はWeb Worker化で対応）

## 各選択肢の利点と欠点

### 1. クライアントサイド生成（jszip + papaparse）

- 良い点: 既にブラウザにあるデータをそのまま使え、サーバーラウンドトリップが不要
- 良い点: 既存のshare機能等と同様のクライアント完結パターンに沿う
- 良い点: 実装がシンプルで依存も最小限
- 悪い点: 新規ライブラリ（jszip, papaparse）の追加が必要

### 2. サーバーサイドAPI経由

- 良い点: クライアントの処理負荷をサーバーに逃がせる
- 悪い点: 既にクライアントにあるデータを再度サーバーへ送信/取得する必要があり、無駄が多い
- 悪い点: 静的ホスティング中心の既存アーキテクチャと整合しない

### 3. クライアントサイド生成 + Web Worker

- 良い点: zip生成中もUIがブロックされない
- 悪い点: 現状のパーツ数規模ではオーバーエンジニアリング
- 悪い点: Worker導入によるビルド・デバッグの複雑化

## フォローアップ / 移行計画

1. 依存追加: `jszip`, `papaparse`, `@types/papaparse`（tech-architectのdependency追加チェックリストに従う）
2. `parts-export.ts`のコアロジック実装 + 単体テスト
3. `ExportDialog.svelte`実装
4. `PartsListView.svelte`へExportボタン統合
5. 動作確認（全体/特定分類/表示中 × JSON/CSV の全組み合わせ）

## 参考リンク

- なし
