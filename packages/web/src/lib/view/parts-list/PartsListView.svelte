<script lang="ts">
  /**
   * PartsListView - パーツ一覧ページのメインコンポーネント
   *
   * スロット文脈、フィルタ、並び替え、お気に入りの状態を統合管理し、
   * URLパラメータ/LocalStorageと同期します。
   */

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { Result } from '@praha/byethrow'

  import FilterPanel from './FilterPanel.svelte'
  import PartsGrid from './PartsGrid.svelte'
  import SlotSelector from './SlotSelector.svelte'
  import { applyFilters } from './state/filter/filters-core'
  import {
    createDefaultFiltersPerSlot,
    type FiltersPerSlot,
  } from './state/filter/serialization'
  import {
    deserializeFromURL,
    serializeToURL,
    type SharedState,
    type Filter,
  } from './state/state-serializer'
  import { saveViewMode, loadViewMode, type ViewMode } from './state/view-mode'
  import { FavoriteStore } from './stores/favorite-store'

  import { browser } from '$app/environment'
  import { replaceState } from '$app/navigation'

  let favoriteStore: FavoriteStore | null = null

  if (browser) {
    favoriteStore = new FavoriteStore()
  }

  // Props
  interface Props {
    regulation: Regulation
    initialSearchParams?: URLSearchParams
  }

  let { regulation, initialSearchParams }: Props = $props()

  const defaultSlot: CandidatesKey = 'rightArmUnit'

  // スロットごとの独立フィルタ管理（Requirement 2.5）
  let filtersPerSlot = $state<FiltersPerSlot>(createDefaultFiltersPerSlot())

  function updateFiltersForSlot(
    slot: CandidatesKey,
    slotFilters: readonly Filter[],
  ) {
    filtersPerSlot = {
      ...filtersPerSlot,
      [slot]: [...slotFilters],
    }
  }

  updateFiltersForSlot(defaultSlot, [])

  // 状態管理（Svelte 5 runes）
  let currentSlot = $state<CandidatesKey>(defaultSlot)
  // filtersは現在のスロットのフィルタ状態を反映
  let filters = $state<Filter[]>([])
  let sortKey = $state<string | null>(null)
  let sortOrder = $state<'asc' | 'desc' | null>(null)
  let viewMode = $state<ViewMode>(loadViewMode())
  let favorites = $state<Set<string>>(new Set())
  let showFavoritesOnly = $state<boolean>(false)

  if (browser && initialSearchParams) {
    void (async () => {
      const result = await deserializeFromURL(initialSearchParams)
      if (Result.isSuccess(result)) {
        const defaults = createDefaultFiltersPerSlot()
        const merged: FiltersPerSlot = {
          ...defaults,
          ...result.value.filtersPerSlot,
        }
        filtersPerSlot = merged
        currentSlot = result.value.slot
        const restoredFilters = merged[result.value.slot] ?? []
        filters = [...restoredFilters]
        updateFiltersForSlot(result.value.slot, filters)
        sortKey = result.value.sortKey
        sortOrder = result.value.sortOrder
      }
    })()
  }

  // お気に入りの初期化（ブラウザ環境でのみ実行）
  $effect(() => {
    if (!browser || !favoriteStore) return
    favoriteStore.getFavorites(currentSlot).then((result) => {
      if (Result.isSuccess(result)) {
        favorites = result.value
      }
    })
  })

  // フィルタ済みパーツリストの計算（$derivedで自動計算）
  let filteredParts = $derived.by<readonly ACParts[]>(() => {
    // 選択中のスロットに対応するパーツを取得
    const slotParts: readonly ACParts[] = regulation.candidates[currentSlot]

    // フィルタ適用（Requirement 2.2, 2.3）
    let filtered = applyFilters(slotParts, filters)

    // お気に入りフィルタ適用（Task 6.2）
    if (showFavoritesOnly) {
      filtered = filtered.filter((parts) => favorites.has(parts.id))
    }

    // TODO: 並び替えロジックを実装（タスク5で実装予定）

    return filtered
  })

  // URL パラメータへの同期（状態変更時に自動実行）
  // URL共有時は全スロットのフィルタ状態を圧縮してシリアライズする
  $effect(() => {
    if (!browser) return

    const filtersSnapshot = Object.entries(filtersPerSlot).reduce(
      (acc, [slot, slotFilters]) => {
        if (slotFilters) {
          acc[slot as CandidatesKey] = [...slotFilters]
        }
        return acc
      },
      {} as FiltersPerSlot,
    )

    const state: SharedState = {
      slot: currentSlot,
      filtersPerSlot: filtersSnapshot,
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
    // 同じスロットが選択された場合は何もしない
    if (newSlot === currentSlot) return

    // スロットごとの独立フィルタ管理（Requirement 2.5）
    // 現在のスロットのフィルタを保存（Requirement 2.5.1）
    updateFiltersForSlot(currentSlot, filters)

    // 新しいスロットのフィルタを復元（Requirement 2.5.2, 2.5.3）
    const nextFilters = filtersPerSlot[newSlot] ?? []

    // スロットを更新
    currentSlot = newSlot
    filters = [...nextFilters]
    updateFiltersForSlot(newSlot, filters)

    // 新しいスロットのお気に入りを読み込み
    if (browser && favoriteStore) {
      favoriteStore.getFavorites(newSlot).then((result) => {
        if (Result.isSuccess(result)) {
          favorites = result.value
        }
      })
    }
  }

  async function handleToggleFavorite(partsId: string) {
    if (!favoriteStore) return
    const isFavorite = favorites.has(partsId)

    if (isFavorite) {
      const result = await favoriteStore.removeFavorite(currentSlot, partsId)
      if (Result.isSuccess(result)) {
        favorites = new Set([...favorites].filter((id) => id !== partsId))
      }
    } else {
      const result = await favoriteStore.addFavorite(currentSlot, partsId)
      if (Result.isSuccess(result)) {
        favorites = new Set([...favorites, partsId])
      }
    }
  }

  export function handleViewModeChange(newViewMode: ViewMode) {
    viewMode = newViewMode
  }

  export function handleFilterChange(newFilters: Filter[]) {
    filters = [...newFilters]
    // フィルタ変更時に現在のスロットのフィルタ状態を更新（Requirement 2.5.1）
    updateFiltersForSlot(currentSlot, filters)
  }

  export function handleClearFilters() {
    filters = []
    // フィルタクリア時も現在のスロットのフィルタ状態を更新（Requirement 2.5.1）
    updateFiltersForSlot(currentSlot, filters)
  }

  export function handleSortChange(
    newSortKey: string | null,
    newSortOrder: 'asc' | 'desc' | null,
  ) {
    sortKey = newSortKey
    sortOrder = newSortOrder
  }

  export function handleToggleFavorites() {
    showFavoritesOnly = !showFavoritesOnly
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
      availableParts={regulation.candidates[currentSlot]}
      {showFavoritesOnly}
      onclearfilters={handleClearFilters}
      onfilterchange={handleFilterChange}
      ontogglefavorites={handleToggleFavorites}
    />
  </div>

  <div class="py-1">
    <PartsGrid
      parts={filteredParts}
      slot={currentSlot}
      {favorites}
      ontogglefavorite={handleToggleFavorite}
    />
  </div>
</div>
