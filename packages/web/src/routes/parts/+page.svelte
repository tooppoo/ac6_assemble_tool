<script lang="ts">
  import { appUrl } from '$lib/app-url'

  const title = 'AC6 PARTS LIST(UNOFFICIAL) | ARMORED CORE Ⅵ FIRES OF RUBICON'
  const description = `
ARMORED CORE Ⅵ FIRES OF RUBICON 用 非公式パーツ一覧ツール。
パーツのフィルタリングや並び替え、パーツを選択してアセンツールへの反映などをサポート。
`.trim()
</script>

<svelte:head>
  <!-- url -->
  <link rel="canonical" href={appUrl('parts')} />
  <meta property="og:url" content={appUrl('parts')} />

  <!-- title -->
  <title>{title}</title>
  <meta property="og:title" content={title} />

  <!-- description -->
  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
</svelte:head>

<div>
  <h1>TEST</h1>
</div>
