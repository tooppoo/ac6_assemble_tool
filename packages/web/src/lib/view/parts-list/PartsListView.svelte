<script lang="ts">
  /**
   * PartsListView - パーツ一覧ページのメインコンポーネント
   *
   * スロット文脈、フィルタ、並び替え、お気に入りの状態を統合管理し、
   * URLパラメータ/LocalStorageと同期します。
   */

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { Result } from '@praha/byethrow'

  import FilterPanel from './FilterPanel.svelte'
  import { splitFiltersBySlot, applyFilters } from './filters'
  import SlotSelector from './SlotSelector.svelte'
  import {
    serializeToURL,
    deserializeFromURL,
    saveViewMode,
    loadViewMode,
    type ViewMode,
    type SharedState,
    type Filter,
  } from './state-serializer'

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
  let currentSlot = $state<CandidatesKey>(initialState?.slot ?? 'rightArmUnit')
  let filters = $state<Filter[]>(initialState?.filters ?? [])
  let sortKey = $state<string | null>(initialState?.sortKey ?? null)
  let sortOrder = $state<'asc' | 'desc' | null>(initialState?.sortOrder ?? null)
  let viewMode = $state<ViewMode>(loadViewMode())
  // TODO: Task 4.2で無効化されたフィルタをUIに表示する
  let invalidatedFilters = $state<Filter[]>([])

  // フィルタ済みパーツリストの計算（$derivedで自動計算）
  let filteredParts = $derived.by(() => {
    // 選択中のスロットに対応するパーツを取得
    const slotParts = regulation.candidates[currentSlot]

    // フィルタ適用（Requirement 2.2, 2.3）
    const filtered = applyFilters(slotParts, filters)

    // TODO: 並び替えロジックを実装（タスク5で実装予定）

    return filtered
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
    } catch {
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
  function handleSlotChange(event: CustomEvent<{ slot: CandidatesKey }>) {
    const newSlot = event.detail.slot

    // スロット切替時にフィルタ条件を分割
    const { valid, invalidated } = splitFiltersBySlot(filters, newSlot)

    // 有効なフィルタのみを保持
    filters = valid

    // 無効化されたフィルタを記録（将来のUI表示のため）
    invalidatedFilters = invalidated

    // スロットを更新
    currentSlot = newSlot
  }

  export function handleViewModeChange(newViewMode: ViewMode) {
    viewMode = newViewMode
  }

  export function handleFilterChange(newFilters: Filter[]) {
    filters = newFilters
  }

  export function handleClearFilters() {
    filters = []
  }

  export function handleSortChange(
    newSortKey: string | null,
    newSortOrder: 'asc' | 'desc' | null,
  ) {
    sortKey = newSortKey
    sortOrder = newSortOrder
  }
</script>

<div class="parts-list-view">
  <div class="py-1">
    <SlotSelector {currentSlot} onslotchange={handleSlotChange} />
  </div>

  <div class="py-1">
    <FilterPanel
      slot={currentSlot}
      {filters}
      {invalidatedFilters}
      onclearfilters={handleClearFilters}
      onfilterchange={handleFilterChange}
    />
  </div>

  <div class="py-1">
    表示モード: {viewMode}
  </div>

  <div class="py-1">
    パーツ数: {filteredParts.length}
  </div>

  <!-- 今後実装予定: 並び替えUI、パーツグリッド -->
  <div class="alert alert-info" role="alert">
    子コンポーネント（並び替え、パーツ一覧）はタスク5以降で実装されます。
  </div>
</div>
