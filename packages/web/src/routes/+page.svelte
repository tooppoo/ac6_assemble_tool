<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import Index from '$lib/view/index/Index.svelte'

  import { type PageData } from './+page'

  export let data: PageData

  const { regulation, partsPool } = data
</script>

<svelte:head>
  <!-- url -->
  <link rel="canonical" href={appUrl()} />
  <meta property="og:url" content={appUrl()} />

  <!-- title -->
  <title>AC6 ASSEMBLE TOOL(UNOFFICIAL)</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL(UNOFFICIAL)" />

  <!-- description -->
  <meta
    name="description"
    content="ARMORED CORE Ⅵ FIRES OF RUBICON 用 非公式アセンブル支援ツール。部位ごとのパーツ固定や条件設定によるアセンブルを生成、およびアセンブルのステータスを確認可能。"
  />
  <meta
    property="og:description"
    content="ARMORED CORE Ⅵ FIRES OF RUBICON 用 非公式アセンブル支援ツール。部位ごとのパーツ固定や条件設定によるアセンブルを生成、およびアセンブルのステータスを確認可能。"
  />
</svelte:head>

<Index {regulation} {partsPool} />
