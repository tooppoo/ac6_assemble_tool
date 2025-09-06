# Google Search Console でのインデックス登録手順

## 1. サイトマップの再送信

1. Google Search Console (https://search.google.com/search-console) にログイン
2. プロパティを選択: `ac6-assemble-tool.philomagi.dev`
3. 左メニューから「サイトマップ」を選択
4. 新しいサイトマップを追加: `sitemap.xml` を入力
5. 「送信」ボタンをクリック

## 2. URL検査ツールでのインデックス登録リクエスト

### メインページのインデックス登録:

1. 左メニューから「URL検査」を選択
2. 以下のURLを入力して検査:
   - `https://ac6-assemble-tool.philomagi.dev/`
3. 「インデックス登録をリクエスト」をクリック

## 3. 追加の改善項目

### 3.1 メタデータの最適化

- ページタイトルとメタディスクリプションの確認
- Open Graphタグの追加検討

### 3.2 内部リンク構造の確認

- サイト内の全ページが適切にリンクされているか
- ナビゲーションの改善

### 3.3 コンテンツの充実

- 定期的なコンテンツ更新
- ユニークで価値のある情報の提供

## 4. インデックス状況の監視

- 1-2週間後にGoogle Search Consoleでインデックス状況を確認
- 「カバレッジ」レポートでエラーをチェック
- 「パフォーマンス」レポートで検索流入を確認

## 5. robots.txtの変更について

robots.txtを以下のように修正済み:

```
User-agent: *
Allow: /
Sitemap: https://ac6-assemble-tool.philomagi.dev/sitemap.xml
```

この変更により、Googleクローラーがサイトマップを自動発見できるようになります。
