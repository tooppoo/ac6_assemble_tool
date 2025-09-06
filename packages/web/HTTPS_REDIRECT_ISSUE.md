# 緊急: HTTPS リダイレクト問題の解決が必要

## 問題の詳細

curl結果から判明した重大な問題:
```
location: http://ac6-assemble-tool.philomagi.dev/
```

GitHub Pagesからのリダイレクトが **HTTP** にリダイレクトしているため、以下の問題が発生しています:

1. **SEO的な問題**: GoogleはHTTPSサイトを優先してインデックス
2. **セキュリティ警告**: ブラウザでセキュリティ警告が表示される可能性
3. **インデックス遅延**: HTTPからHTTPSへの再リダイレクトでクローラーが混乱

## 調査結果

**GitHub Pages の「Enforce HTTPS」が非活性の理由**：
- デフォルトドメイン（tooppoo.github.io）使用時は手動設定不可
- UIに「Required for your site because you are using the default domain」と表示
- この状態でHTTPリダイレクトのlocationヘッダーがHTTPになる問題が発生

## 解決策（優先順位順）

### 🔴 最優先: GitHub Pages Custom Domain設定を削除
1. GitHub リポジトリの Settings → Pages
2. **Custom domain欄を空にする**
3. Save をクリック
4. これによりGitHub Pagesからのリダイレクトが完全に停止され、Cloudflare Pagesのみが動作

### 🟢 推奨解決策: CNAMEファイル + GitHub Pages Custom Domain再設定

**目標**: ユーザー体験を保持しつつHTTPS リダイレクトを実現

#### 手順:
1. **CNAMEファイル作成** (完了)
   - リポジトリルートに`CNAME`ファイルを作成
   - 内容: `ac6-assemble-tool.philomagi.dev`

2. **GitHub Pages設定復元**
   - Settings → Pages → Custom domain に `ac6-assemble-tool.philomagi.dev` を再入力
   - **「Enforce HTTPS」が自動で有効化されることを確認**

3. **期待結果**
   ```bash
   curl -I https://tooppoo.github.io/ac6_assemble_tool/
   # location: https://ac6-assemble-tool.philomagi.dev/ (HTTPS!)
   ```

### 🟡 代替案2: Cloudflare Page Rules設定
1. Cloudflare Dashboard → Page Rules → Create Page Rule
2. URL: `http://ac6-assemble-tool.philomagi.dev/*`
3. Setting: Always Use HTTPS
4. Save and Deploy

## 📋 Custom Domain削除後の状況

### 現在の問題
Custom domainを削除したが、まだリダイレクトが発生している：
```bash
curl -I https://tooppoo.github.io/ac6_assemble_tool/
# 結果: location: http://ac6-assemble-tool.philomagi.dev/
# age: 3004, x-cache: HIT (キャッシュされたレスポンス)
```

### 🔧 追加の解決手順

#### 1. GitHub Actions 強制再デプロイ
1. GitHub リポジトリ → Actions タブ
2. 最新の "pages build and deployment" を選択
3. **"Re-run all jobs"** をクリックして強制再デプロイ

#### 2. 設定の再確認
GitHub Settings → Pages で：
- Source設定が正しいか確認
- Custom domain欄が**完全に空**になっているか再確認

#### 3. キャッシュクリア待機
- GitHub/FastlyCDNキャッシュの更新まで**最大24時間**
- `age`ヘッダーで経過時間を確認可能

### 確認手順

**目標**: リダイレクトが完全に停止すること
```bash
curl -I https://tooppoo.github.io/ac6_assemble_tool/
```

**期待結果**:
```
HTTP/2 200 
# または 404 (GitHub Pagesサイトが存在しない場合)
# リダイレクト(301/302)は発生しない
```

## 影響

この問題が解決されると:
- Googleクローラーが正しくHTTPSサイトを発見
- インデックス登録が大幅に改善される可能性
- SEOスコアの向上が期待される