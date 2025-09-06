# 最適解: GitHub Pages軽量リダイレクトページ戦略

## 🎯 戦略概要

### 基本方針
- **GitHub Pages**: 軽量リダイレクトページのみ (ソフト404対象)
- **Cloudflare Pages**: 完全なアプリケーション (独立SEO)
- **ユーザー体験**: JavaScriptによるシームレス移行

## 🏗️ GitHub Pages実装構造

### 1. Custom Domain削除
```
GitHub Settings → Pages → Custom domain → 空にする
Result: https://tooppoo.github.io/ac6_assemble_tool/ 復活
```

### 2. 軽量リダイレクトページ構成

#### `/index.html` (メインリダイレクトページ)
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>サイト移転のお知らせ | AC6 ASSEMBLE TOOL</title>
    <meta name="description" content="AC6 ASSEMBLE TOOLは新しいURLに移転しました">
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="refresh" content="3;url=https://ac6-assemble-tool.philomagi.dev/">
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; }
        .notice { max-width: 600px; margin: 0 auto; }
        .redirect-link { color: #007acc; text-decoration: none; }
        .countdown { font-weight: bold; color: #ff6b35; }
    </style>
</head>
<body>
    <div class="notice">
        <h1>🔄 サイト移転のお知らせ</h1>
        <p><strong>AC6 ASSEMBLE TOOL</strong> は以下のURLに移転しました。</p>
        <p><a href="https://ac6-assemble-tool.philomagi.dev/" class="redirect-link">
            https://ac6-assemble-tool.philomagi.dev/
        </a></p>
        <p class="countdown" id="countdown">3秒後に自動で移転先に移動します...</p>
        <p><small>移転しない場合は、上記リンクをクリックしてください。</small></p>
    </div>

    <script>
        let seconds = 3;
        const countdownEl = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            seconds--;
            countdownEl.textContent = `${seconds}秒後に自動で移転先に移動します...`;
            
            if (seconds <= 0) {
                clearInterval(timer);
                window.location.href = 'https://ac6-assemble-tool.philomagi.dev/';
            }
        }, 1000);
    </script>
</body>
</html>
```

#### `/robots.txt`
```
User-agent: *
Disallow: /

# 新サイトのサイトマップを参照
Sitemap: https://ac6-assemble-tool.philomagi.dev/sitemap.xml
```

## 📊 SEO効果分析

### ✅ 旧URL (GitHub Pages)の期待効果
- **コンテンツ薄化**: 実質的なコンテンツなし → ソフト404候補
- **noindex, nofollow**: 検索エンジンインデックス抑制
- **Disallow: /**: robots.txtでクロール抑制
- **結果**: 数ヶ月でインデックスから除去される可能性が高い

### ✅ 新URL (Cloudflare Pages)の期待効果
- **独立サイト**: 完全に別のサイトとして評価
- **SEO最適化**: robots.txt + sitemap + canonical の恩恵を最大限享受
- **直接インデックス**: リダイレクト元の評価に依存しない

## 🔄 ユーザー体験フロー

### 通常アクセス時:
```
旧URL → リダイレクトページ表示 → 3秒待機 → 新URL自動移行
```

### 検索エンジンアクセス時:
```
旧URL → 薄いコンテンツ検出 → ソフト404判定 → インデックス除去
新URL → 完全コンテンツ → 独立評価 → 上位ランキング
```

## ⚖️ Server Redirect vs Client Redirect

### Server Redirect (301/302):
- **SEO**: 評価の引き継ぎ (同一サイトとして認識)
- **実現困難**: GitHub Pages HTTPS問題のため

### Client Redirect (JavaScript):
- **SEO**: 別サイトとして認識 (旧サイト評価に依存しない)
- **実現容易**: GitHub Pages標準機能で実装可能
- **ユーザー体験**: わずかな待機時間あり

## 🎯 この戦略が最適な理由

1. **技術的実現性**: GitHub Pages制限を回避
2. **SEO独立性**: 新サイトの独立した評価
3. **ユーザビリティ**: 移行案内 + 自動リダイレクト
4. **移行完了**: 旧URLの自然な消去

この戦略により、技術制限を逆手に取ってより良いSEO効果を実現できます。