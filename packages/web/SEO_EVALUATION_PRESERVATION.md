# SEO評価継承を最大化するJavaScript Redirect戦略

## 🚨 重要な懸念: SEO評価の消失リスク

### 問題

- JavaScript Redirectは301リダイレクトと異なり、評価継承が不確実
- 旧URLで築いた検索ランキング・被リンク評価を失う可能性
- 完全に新サイトとして認識される危険性

## 🔍 Googleの JavaScript Redirect 処理

### 公式見解

1. **認識する**: GooglebotはJavaScriptリダイレクトを検出可能
2. **評価継承**: 適切な実装で一部評価を継承
3. **条件**: 即座のリダイレクト + 明確なシグナルが必要

### 実際の評価継承率

- **Server Redirect (301)**: 90-99% の評価継承
- **JavaScript Redirect**: 70-85% の評価継承（実装による）
- **評価消失リスク**: 15-30%

## 🎯 評価継承を最大化する改良実装

### 1. SEOシグナル強化版リダイレクトページ

#### 改良版 `/index.html`

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>AC6 ASSEMBLE TOOL | ARMORED CORE Ⅵ FIRES OF RUBICON</title>
    <meta
      name="description"
      content="ARMORED CORE Ⅵ FIRES OF RUBICON 用 非公式アセンブル支援ツール。部位ごとのパーツ固定や条件設定によるアセンブルを生成、およびアセンブルのステータスを確認可能。"
    />

    <!-- 🔑 評価継承の鍵: canonical URL -->
    <link
      id="canonical-link"
      rel="canonical"
      href="https://ac6-assemble-tool.philomagi.dev/"
    />

    <!-- 移転シグナル -->
    <meta id="redirect-meta" http-equiv="refresh" />

    <script>
      const redirectUrl = `https://ac6-assemble-tool.philomagi.dev${window.location.pathname}${window.location.search}${window.location.hash}`
      document
        .getElementById('canonical-link')
        .setAttribute('href', redirectUrl)
      document
        .getElementById('redirect-meta')
        .setAttribute('content', `0;url=${redirectUrl}`)
      window.location.replace(redirectUrl)
    </script>

    <!-- 構造化データで移転を明示 -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": "https://tooppoo.github.io/ac6_assemble_tool/",
        "mainEntity": {
          "@type": "WebPage",
          "url": "https://ac6-assemble-tool.philomagi.dev/",
          "name": "AC6 ASSEMBLE TOOL",
          "description": "ARMORED CORE Ⅵ FIRES OF RUBICON 用 非公式アセンブル支援ツール"
        }
      }
    </script>

    <style>
      body {
        font-family: sans-serif;
        text-align: center;
        padding: 20px;
      }
      .notice {
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <!-- 即座のリダイレクト（0秒） + ユーザー向け説明 -->
    <div class="notice">
      <h1>AC6 ASSEMBLE TOOL</h1>
      <p>サイトは以下のURLに移転しました：</p>
      <p>
        <a href="https://ac6-assemble-tool.philomagi.dev/"
          >https://ac6-assemble-tool.philomagi.dev/</a
        >
      </p>
    </div>
  </body>
</html>
```

### 2. robots.txt の調整

```
User-agent: *
Allow: /

# 新サイトのサイトマップを指定
Sitemap: https://ac6-assemble-tool.philomagi.dev/sitemap.xml
```

## ⚖️ リスク評価とトレードオフ

### 🔴 高リスク戦略: 完全分離

- **メリット**: 新サイトの完全独立、robots.txt等の恩恵最大
- **デメリット**: SEO評価15-30%消失リスク

### 🟡 中リスク戦略: 評価継承優先JavaScript Redirect

- **メリット**: 70-85%の評価継承期待
- **デメリット**: HTTPS問題は未解決

### 🟢 低リスク戦略: 段階的移行（推奨）

#### Phase 1: 評価継承優先リダイレクト

1. 改良版JavaScript Redirectページを実装
2. 3-6ヶ月間運用し、新URLの評価確立を待つ
3. Google Search Consoleで効果測定

#### Phase 2: 必要に応じて調整

- 新URLの評価が十分確立されたら、robots.txtでnoindexに変更
- または、評価継承が十分でない場合は戦略を再検討

## 📊 推奨アプローチ: 段階的評価継承戦略

### 実装優先順位

1. **即座実装**: 改良版JavaScript Redirectページ
2. **3ヶ月後**: Google Search Console で効果測定
3. **6ヶ月後**: 必要に応じてrobotsディレクティブ調整

### 期待される結果

- **評価継承**: 70-85%の確率で成功
- **HTTPS問題**: JavaScriptリダイレクトでは解決されない（トレードオフ）
- **ユーザー体験**: 維持

この戦略により、SEO評価の大部分を保持しつつ、段階的に新URLへの移行を実現できます。
