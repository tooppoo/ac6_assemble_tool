<script lang="ts">
  /**
   * パーツ一覧ページ
   *
   * スロット選択による文脈確立、フィルタリング、並び替え、お気に入り管理を提供する探索的UIページ
   */

  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import Navbar from '$lib/components/layout/Navbar.svelte'
  import PartsListView from '$lib/view/parts-list/PartsListView.svelte'

  import type { PageData } from './+page'

  import { browser } from '$app/environment'
  import { page } from '$app/state'

  // ページデータ
  interface Props {
    data: PageData
  }
  let { data }: Props = $props()

  const { regulation } = $derived(data)

  // URLSearchParamsを取得
  let searchParams = $derived(
    browser ? new URLSearchParams(page.url.search) : undefined,
  )
</script>

<svelte:head>
  <title>AC6 PARTS LIST | AC6 ASSEMBLE TOOL(UNOFFICIAL)</title>
  <meta
    name="description"
    content="AC6のパーツを一覧表示、フィルタリング、並び替えできる探索的UIページ"
  />
</svelte:head>

<Navbar />

<main class="parts-list-page py-4">
  <div class="container">
    <div class="text-center mb-3">
      <h1>
        ARMORED CORE Ⅵ<br class="d-block d-md-none" />
        PARTS LIST
      </h1>

      <h2>
        for Regulation {regulation.version}
      </h2>

      <div>
        <LanguageForm />
      </div>
    </div>

    <PartsListView {regulation} initialSearchParams={searchParams} />
  </div>
</main>
