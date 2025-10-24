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
  import PartsGrid from './PartsGrid.svelte'
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
  import { FavoriteStore } from './stores/favorite-store'

  // お気に入りストアのインスタンスを作成
  const favoriteStore = new FavoriteStore()

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
  let favorites = $state<Set<string>>(new Set())
  let showFavoritesOnly = $state<boolean>(false)

  // お気に入りの初期化（ブラウザ環境でのみ実行）
  $effect(() => {
    if (!browser) return
    favoriteStore.getFavorites(currentSlot).then((result) => {
      if (Result.isSuccess(result)) {
        favorites = result.value
      }
    })
  })

  // フィルタ済みパーツリストの計算（$derivedで自動計算）
  let filteredParts = $derived.by(() => {
    // 選択中のスロットに対応するパーツを取得
    const slotParts = regulation.candidates[currentSlot]

    // フィルタ適用（Requirement 2.2, 2.3）
    // 型エラーを回避するため、unknown経由でキャスト
    let filtered = applyFilters(
      slotParts as unknown as Array<Record<string, unknown>>,
      filters,
    )

    // お気に入りフィルタ適用（Task 6.2）
    if (showFavoritesOnly) {
      filtered = filtered.filter((parts: Record<string, unknown>) =>
        favorites.has(parts.id as string),
      )
    }

    // TODO: 並び替えロジックを実装（タスク5で実装予定）

    return filtered as unknown as typeof slotParts
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
    // 同じスロットが選択された場合は何もしない
    if (newSlot === currentSlot) return

    // スロット切替時にフィルタ条件を分割
    const { valid, invalidated } = splitFiltersBySlot(filters, newSlot)

    // 有効なフィルタのみを保持
    filters = valid

    // 無効化されたフィルタを記録（将来のUI表示のため）
    invalidatedFilters = invalidated

    // スロットを更新
    currentSlot = newSlot

    // 新しいスロットのお気に入りを読み込み
    if (browser) {
      favoriteStore.getFavorites(newSlot).then((result) => {
        if (Result.isSuccess(result)) {
          favorites = result.value
        }
      })
    }
  }

  async function handleToggleFavorite(partsId: string) {
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
      {invalidatedFilters}
      {showFavoritesOnly}
      onclearfilters={handleClearFilters}
      onfilterchange={handleFilterChange}
      ontogglefavorites={handleToggleFavorites}
    />
  </div>

  <div class="py-1">
    <PartsGrid
      parts={filteredParts as any}
      slot={currentSlot}
      {favorites}
      ontogglefavorite={handleToggleFavorite}
    />
  </div>
</div>
