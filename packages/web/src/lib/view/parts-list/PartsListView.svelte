<script lang="ts">
  /**
   * PartsListView - パーツ一覧ページのメインコンポーネント
   *
   * スロット文脈、フィルタ、並び替え、お気に入りの状態を統合管理し、
   * URLパラメータ/LocalStorageと同期します。
   */

  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import {
    serializeToURL,
    deserializeFromURL,
    saveViewMode,
    loadViewMode,
    type ViewMode,
    type SharedState,
    type Filter,
  } from './state-serializer'
  import { Result } from '@praha/byethrow'
  import { browser } from '$app/environment'
  import { replaceState } from '$app/navigation'

  // Props
  interface Props {
    regulation: Regulation
    initialSearchParams?: URLSearchParams
  }

  let { regulation, initialSearchParams }: Props = $props()

  // 初期状態の復元
  let initialState: SharedState | null = null

  if (browser && initialSearchParams) {
    const result = deserializeFromURL(initialSearchParams)
    if (Result.isSuccess(result)) {
      initialState = result.value
    }
  }

  // 状態管理（Svelte 5 runes）
  let currentSlot = $state<CandidatesKey>(initialState?.slot ?? 'head')
  let filters = $state<Filter[]>(initialState?.filters ?? [])
  let sortKey = $state<string | null>(initialState?.sortKey ?? null)
  let sortOrder = $state<'asc' | 'desc' | null>(initialState?.sortOrder ?? null)
  let viewMode = $state<ViewMode>(loadViewMode())

  // フィルタ済みパーツリストの計算（$derivedで自動計算）
  let filteredParts = $derived.by(() => {
    // 選択中のスロットに対応するパーツを取得
    const slotParts = regulation.candidates[currentSlot]

    // TODO: フィルタ適用ロジックを実装（タスク4で実装予定）
    // TODO: 並び替えロジックを実装（タスク5で実装予定）

    return slotParts
  })

  // URL パラメータへの同期（状態変更時に自動実行）
  $effect(() => {
    if (!browser) return

    const state: SharedState = {
      slot: currentSlot,
      filters,
      sortKey,
      sortOrder,
    }

    const params = serializeToURL(state)

    // URLを更新（ページリロードなし）
    const newUrl = `${window.location.pathname}?${params.toString()}`
    try {
      replaceState(newUrl, {})
    } catch (error) {
      // テスト環境ではルーターが初期化されていないため、エラーをキャッチ
      // 本番環境では正常に動作する
    }
  })

  // LocalStorage への同期（表示モード変更時に自動実行）
  $effect(() => {
    if (!browser) return
    saveViewMode(viewMode)
  })

  // イベントハンドラ
  export function handleSlotChange(event: CustomEvent<{ slot: CandidatesKey }>) {
    currentSlot = event.detail.slot
  }

  export function handleViewModeChange(newViewMode: ViewMode) {
    viewMode = newViewMode
  }

  export function handleFilterChange(newFilters: Filter[]) {
    filters = newFilters
  }

  export function handleSortChange(newSortKey: string | null, newSortOrder: 'asc' | 'desc' | null) {
    sortKey = newSortKey
    sortOrder = newSortOrder
  }
</script>

<div class="parts-list-view">
  <h2>パーツ一覧</h2>

  <p class="text-muted">
    現在のスロット: {currentSlot}
  </p>

  <p class="text-muted">
    表示モード: {viewMode}
  </p>

  <p class="text-muted">
    パーツ数: {filteredParts.length}
  </p>

  <!-- 今後実装予定: スロット選択UI、フィルタパネル、並び替えUI、パーツグリッド -->
  <div class="alert alert-info" role="alert">
    子コンポーネント（スロット選択、フィルタ、並び替え、パーツ一覧）はタスク3以降で実装されます。
  </div>
</div>

<style>
  .parts-list-view {
    padding: 1rem;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .text-muted {
    margin-bottom: 0.5rem;
  }

  .alert {
    margin-top: 1rem;
  }
</style>
