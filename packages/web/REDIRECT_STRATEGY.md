# 最適なリダイレクト戦略: ユーザー体験 + SEO両立

## 🎯 目標

- ✅ 旧URL利用者（ブックマーク、外部サイト）への配慮
- ✅ GoogleクローラーへのHTTPSシグナル提供
- ✅ SEOインデックス登録の改善

## 📋 実装済み

### 1. CNAMEファイル作成 ✅

```
リポジトリルート/CNAME
内容: ac6-assemble-tool.philomagi.dev
```

### 2. 次の手順: GitHub Pages Custom Domain 再設定

#### 手順:

1. GitHub リポジトリ → Settings → Pages
2. Custom domain に `ac6-assemble-tool.philomagi.dev` を入力
3. Save をクリック
4. **「Enforce HTTPS」が自動的に有効化されることを確認**

## 🔄 期待される動作フロー

### ユーザーアクセス:

```
旧URL: https://tooppoo.github.io/ac6_assemble_tool/
↓ (301 Redirect)
新URL: https://ac6-assemble-tool.philomagi.dev/
```

### Googleクローラー:

```
旧URL発見 → HTTPS リダイレクト検出 → 新URL正式認識 → インデックス更新
```

## 🎉 メリット

### ユーザー体験

- ブックマーク継続利用可能
- 外部サイトからのリンク有効
- シームレスなアクセス体験

### SEO効果

- HTTPSリダイレクトによるSEOスコア向上
- Canonical URLの正しい伝達
- robots.txt + sitemap との相乗効果

## 📊 検証方法

設定完了後の確認:

```bash
curl -I https://tooppoo.github.io/ac6_assemble_tool/
# 期待結果: location: https://ac6-assemble-tool.philomagi.dev/
```

この設定により、ユーザビリティを損なうことなくGoogle インデックス問題を解決できます。
