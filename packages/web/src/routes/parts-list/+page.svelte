<script lang="ts">
  /**
   * パーツ一覧ページ
   *
   * スロット選択による文脈確立、フィルタリング、並び替え、お気に入り管理を提供する探索的UIページ
   */

  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import PartsListView from '$lib/view/parts-list/PartsListView.svelte'

  import type { PageData } from './+page'

  import { browser } from '$app/environment'

  // ページデータ
  export let data: PageData

  const { regulation } = data

  // URLSearchParamsを取得
  let searchParams: URLSearchParams | undefined = undefined
  if (browser) {
    searchParams = new URLSearchParams(window.location.search)
  }
</script>

<svelte:head>
  <title>AC6 PARTS LIST | AC6 ASSEMBLE TOOL(UNOFFICIAL)</title>
  <meta
    name="description"
    content="AC6のパーツを一覧表示、フィルタリング、並び替えできる探索的UIページ"
  />
</svelte:head>

<main class="parts-list-page py-4">
  <div class="container">
    <h1 class="py-2 d-flex justify-content-center">
      ARMORED CORE Ⅵ PARTS LIST
    </h1>

    <h2 class="py-2 d-flex justify-content-center">
      Regulation for {regulation.version}
    </h2>

    <div class="d-flex justify-content-center mb-4">
      <LanguageForm onUpdate={null} />
    </div>

    <PartsListView {regulation} initialSearchParams={searchParams} />
  </div>
</main>
