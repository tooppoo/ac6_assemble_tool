# Cloudflareベースの最終解決策

## 🎯 目標
- ✅ 旧URLからのリダイレクト維持 (ユーザー体験保持)
- ✅ HTTP→HTTPS リダイレクト実現 (SEO改善)
- ✅ GitHub Pages DNS設定問題の回避

## 🔧 Cloudflare Redirect Rules設定

### Step 1: Redirect Rule作成
1. Cloudflare Dashboard → Rules → **Redirect Rules**
2. **Create rule** をクリック

### Step 2: Rule設定
```yaml
Rule name: GitHub Pages HTTPS Redirect Fix

When incoming requests match:
  Field: Hostname
  Operator: equals  
  Value: ac6-assemble-tool.philomagi.dev
  
  AND
  
  Field: SSL/HTTPS
  Operator: equals
  Value: Off

Then:
  Type: Dynamic
  Expression: concat("https://", http.request.uri.path)
  Status code: 301 - Permanent Redirect
```

## 🌐 DNS設定の確認・修正

### GitHub Pages用Aレコード設定
Cloudflare DNS で以下のAレコードを設定:

```
Type: A
Name: ac6-assemble-tool.philomagi.dev
Value: 185.199.108.153
TTL: Auto

Type: A  
Name: ac6-assemble-tool.philomagi.dev
Value: 185.199.109.153
TTL: Auto

Type: A
Name: ac6-assemble-tool.philomagi.dev  
Value: 185.199.110.153
TTL: Auto

Type: A
Name: ac6-assemble-tool.philomagi.dev
Value: 185.199.111.153
TTL: Auto
```

## 🔄 期待される動作フロー

### HTTP アクセス時:
```
http://ac6-assemble-tool.philomagi.dev/
↓ (Cloudflare Redirect Rule)
https://ac6-assemble-tool.philomagi.dev/ (Cloudflare Pages)
```

### 旧URL アクセス時:
```
https://tooppoo.github.io/ac6_assemble_tool/
↓ (GitHub Pages Redirect with correct DNS)
https://ac6-assemble-tool.philomagi.dev/ (Cloudflare Pages)
```

## ✅ メリット

### ユーザー体験
- ✅ 全URLからのアクセス維持
- ✅ ブックマーク・外部リンク継続利用
- ✅ HTTPSセキュリティ確保

### SEO効果  
- ✅ HTTPS優先でGoogleクローラー対応
- ✅ 正しいcanonical URL伝達
- ✅ robots.txt + sitemap との最大相乗効果

## 📊 検証方法

設定完了後（24時間以内に反映）:

```bash
# HTTP → HTTPS リダイレクト確認
curl -I http://ac6-assemble-tool.philomagi.dev/
# 期待結果: location: https://ac6-assemble-tool.philomagi.dev/

# 旧URL → 新URL HTTPSリダイレクト確認  
curl -I https://tooppoo.github.io/ac6_assemble_tool/
# 期待結果: location: https://ac6-assemble-tool.philomagi.dev/
```

この解決策により、ユーザビリティとSEO効果を同時に実現できます。