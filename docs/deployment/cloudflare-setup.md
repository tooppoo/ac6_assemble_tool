# Cloudflare Pages デプロイ設定

## 前提条件

- Cloudflare アカウント
- Cloudflare Pages プロジェクト: `ac6-assemble-tool`

## デプロイフロー

### 依存更新の自動デプロイ

```txt
renovate/dependabot PR → マージ →
自動的にCloudflare Pagesへデプロイ
```

トリガー: `.github/workflows/web-auto-deploy-deps.yml`

### 機能追加/修正の手動デプロイ

```txt
changeset version PR → マージ →
手動でworkflow_dispatch実行 →
タグ作成 → Release作成 → Cloudflare Pagesへデプロイ
```

トリガー: `.github/workflows/web-create-release.yml`

実行方法:

1. GitHub Actions → `Web Create Release`
2. `Run workflow` → バージョンを入力（例: `1.2.3`）
3. `Run workflow` をクリック

## トラブルシューティング

### デプロイが失敗する

1. **API Token の権限を確認**
   - `Cloudflare Pages` の `Edit` 権限があるか確認

2. **Account ID が正しいか確認**
   - Cloudflare Dashboard で再度確認

3. **プロジェクト名が一致しているか確認**
   - ワークフローの `--project-name=ac6-assemble-tool` が正しいか確認

### ビルドが失敗する

1. **ローカルでビルドを確認**

   ```bash
   pnpm install --frozen-lockfile
   pnpm run build
   ```

2. **出力ディレクトリを確認**

   ```bash
   ls -la packages/web/dist
   ```

## 参考リンク

- [Cloudflare Pages - Direct Upload](https://developers.cloudflare.com/pages/platform/direct-upload/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions - cloudflare/wrangler-action](https://github.com/cloudflare/wrangler-action)
