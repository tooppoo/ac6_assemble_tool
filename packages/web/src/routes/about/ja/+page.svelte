<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import { aboutSections } from '$lib/i18n/locales/ja/pages/about/content.ja'
  import Information from '$lib/view/info/Information.svelte'

  const heroTitle = 'AC6 ASSEMBLE TOOL /about'
  const heroLead =
    '本ページでは、AC6 ASSEMBLE TOOL の役割、提供価値、利用方法、今後の展望をまとめています。アセンブリページとパーツ探索ページを往復しながらビルドを検討できる最新の体験と、その背景にある設計思想を確認できます。'
</script>

<svelte:head>
  <link rel="canonical" href={appUrl('about', 'ja')} />
  <meta property="og:url" content={appUrl('about', 'ja')} />
  <title>AC6 ASSEMBLE TOOL | About (日本語)</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL | About (日本語)" />
  <meta
    name="description"
    content="AC6 ASSEMBLE TOOL の概要、開発背景、主要機能、今後のロードマップなどを紹介する日本語版 about ページ。"
  />
  <meta
    property="og:description"
    content="AC6 ASSEMBLE TOOL の概要、開発背景、主要機能、今後のロードマップなどを紹介する日本語版 about ページ。"
  />
</svelte:head>

<Information
  {heroTitle}
  {heroLead}
  tocNavigationLabel="ページ内ナビゲーション"
  tocHeadingLabel="セクション一覧"
  tocItems={aboutSections}
  testId="about-page"
/>
