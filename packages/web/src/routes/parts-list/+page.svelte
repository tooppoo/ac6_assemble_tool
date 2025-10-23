<script lang="ts">
  /**
   * パーツ一覧ページ
   *
   * スロット選択による文脈確立、フィルタリング、並び替え、お気に入り管理を提供する探索的UIページ
   */

  import type { PageData } from './+page'
  import PartsListView from '$lib/view/parts-list/PartsListView.svelte'
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
  <title>パーツ一覧 - AC6 Assemble Tool</title>
  <meta name="description" content="AC6のパーツを一覧表示、フィルタリング、並び替えできる探索的UIページ" />
</svelte:head>

<main class="parts-list-page">
  <div class="container">
    <h1>パーツ一覧</h1>

    <p class="text-muted">
      パッチバージョン: {regulation.version}
    </p>

    <PartsListView {regulation} initialSearchParams={searchParams} />
  </div>
</main>

<style>
  .parts-list-page {
    padding: 2rem 0;
  }

  h1 {
    margin-bottom: 1rem;
  }

  .text-muted {
    margin-bottom: 2rem;
  }
</style>
