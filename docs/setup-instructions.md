# Spreadsheet to Issue Action セットアップ手順

## 概要

このドキュメントでは、Google スプレッドシートから GitHub Issues を自動生成する `spreadsheet-to-issue-action` のセットアップ方法を説明します。

## 必要なSecrets設定

以下のシークレットをGitHubリポジトリに設定してください：

### Google Cloud関連（現在はダミー値設定）

```
GOOGLE_WORKLOAD_IDENTITY_PROVIDER=projects/DUMMY_PROJECT_ID/locations/global/workloadIdentityPools/DUMMY_POOL_ID/providers/DUMMY_PROVIDER_ID
GOOGLE_SERVICE_ACCOUNT=dummy-service-account@dummy-project-id-123456.iam.gserviceaccount.com
SPREADSHEET_ID=DUMMY_SPREADSHEET_ID_1234567890abcdef
```

**⚠️ 重要**: 上記はすべてダミー値です。実際の運用時には以下の手順で正しい値に置き換えてください。

## 実際の設定手順（運用時）

### 1. Google Cloud設定

1. Google Cloud プロジェクトを作成
2. Google Sheets API を有効化
3. Workload Identity Federation を設定
4. サービスアカウントを作成し、スプレッドシートへの読み取り権限を付与

### 2. GitHub Secrets設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

- `GOOGLE_WORKLOAD_IDENTITY_PROVIDER`: WIF プロバイダのリソース名
- `GOOGLE_SERVICE_ACCOUNT`: サービスアカウントのメールアドレス
- `SPREADSHEET_ID`: 対象となるGoogle スプレッドシートのID

### 3. スプレッドシートフォーマット

スプレッドシート「Issues」シートに以下の列を用意：

| A列 | B列 | C列 | D列 |
|-----|-----|-----|-----|
| タイトル | 概要 | 詳細 | 優先度 |

### 4. 動作確認

1. ワークフローを手動実行（Actions > Sync Spreadsheet to Issues > Run workflow）
2. Issues が正しく作成されることを確認
3. 30分間隔での自動実行が開始

## 設定ファイル

`.github/spreadsheet-sync-config.json` でテンプレートやラベルをカスタマイズ可能です。

## トラブルシューティング

- ワークフローが失敗する場合は、まずGoogle Cloud の認証設定を確認
- スプレッドシートの権限（サービスアカウントへの共有）を確認
- GitHub Token の権限（issues: write）を確認

## セキュリティ注意事項

- サービスアカウントには必要最小限の権限のみ付与
- スプレッドシートには機密情報を含めない
- 定期的にアクセスログを確認