<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import Index from '$lib/view/index/Index.svelte'

  import { type PageData } from './+page'

  export let data: PageData

  const title =
    'AC6 ASSEMBLE TOOL(UNOFFICIAL) | ARMORED CORE Ⅵ FIRES OF RUBICON'
  const description = `
ARMORED CORE Ⅵ FIRES OF RUBICON 用 非公式アセンブル支援ツール。
部位ごとのパーツ固定や条件設定によるアセンブルを生成、およびアセンブルのステータスを確認可能。
`.trim()
</script>

<svelte:head>
  <!-- url -->
  <link rel="canonical" href={appUrl()} />
  <meta property="og:url" content={appUrl()} />

  <!-- title -->
  <title>{title}</title>
  <meta property="og:title" content={title} />

  <!-- description -->
  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
</svelte:head>

<Index regulation={data.regulation} />
