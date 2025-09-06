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

### 🟡 代替案1: CNAMEファイルでの制御
リポジトリルートに`CNAME`ファイルを作成:
```
ac6-assemble-tool.philomagi.dev
```

### 🟡 代替案2: Cloudflare Page Rules設定
1. Cloudflare Dashboard → Page Rules → Create Page Rule
2. URL: `http://ac6-assemble-tool.philomagi.dev/*`
3. Setting: Always Use HTTPS
4. Save and Deploy

## 確認手順

修正後、以下をテスト:
```bash
curl -I https://tooppoo.github.io/ac6_assemble_tool/
```

期待する結果:
```
location: https://ac6-assemble-tool.philomagi.dev/
```

## 影響

この問題が解決されると:
- Googleクローラーが正しくHTTPSサイトを発見
- インデックス登録が大幅に改善される可能性
- SEOスコアの向上が期待される