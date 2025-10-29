<script lang="ts">
  /**
   * PartsListView - パーツ一覧ページのメインコンポーネント
   *
   * スロット文脈、フィルタ、並び替え、お気に入りの状態を統合管理し、
   * URLパラメータ/LocalStorageと同期します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import {
    CANDIDATES_KEYS,
    type CandidatesKey,
  } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import { Result } from '@praha/byethrow'
  import { getContext } from 'svelte'

  import FilterPanel from './FilterPanel.svelte'
  import PartsGrid from './PartsGrid.svelte'
  import SlotSelector from './SlotSelector.svelte'
  import SortControl from './SortControl.svelte'
  import { applyFilters } from './state/filter/filters-core'
  import {
    createDefaultFiltersPerSlot,
    type FiltersPerSlot,
  } from './state/filter/serialization'
  import { serializeFilteredPartsPool } from './state/parts-pool-serializer'
  import { SLOT_PARTS_SUFFIX } from './state/slot-utils'
  import {
    getAvailableSortKeys,
    sortPartsByKey,
    type SortKey,
    type SortOrder,
  } from './state/sort'
  import {
    deserializeFromURL,
    serializeToURL,
    type SharedState,
    type Filter,
  } from './state/state-serializer'
  import { saveViewMode, loadViewMode, type ViewMode } from './state/view-mode'
  import { FavoriteStore } from './stores/favorite-store'

  import { browser } from '$app/environment'
  import { goto, replaceState } from '$app/navigation'

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

  const i18n = getContext<I18NextStore>('i18n')

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
  let sortKey = $state<SortKey | null>(null)
  let sortOrder = $state<SortOrder | null>(null)
  let viewMode = $state<ViewMode>(loadViewMode())
  let favorites = $state<Set<string>>(new Set())
  let showFavoritesOnly = $state<boolean>(false)

  const emptyCandidateSlots = $derived.by<CandidatesKey[]>(() => {
    return CANDIDATES_KEYS.filter((slot) => {
      const base = regulation.candidates[slot]
      const slotFilters = filtersPerSlot[slot] ?? []

      if (!slotFilters || slotFilters.length === 0) {
        return base.length === 0
      }

      try {
        const filtered = applyFilters(base, slotFilters)
        return filtered.length === 0
      } catch (error) {
        logger.error('候補件数の再計算に失敗しました', {
          slot,
          error: error instanceof Error ? error.message : String(error),
        })
        return true
      }
    })
  })

  const isHandoffDisabled = $derived.by<boolean>(
    () => emptyCandidateSlots.length > 0,
  )

  const handoffDisabledReason = $derived.by<string | null>(() => {
    if (!isHandoffDisabled) {
      return null
    }

    const slotLabels = emptyCandidateSlots
      .map((slot) => $i18n.t(`assembly:${slot}`))
      .join('、')

    return $i18n.t('navigation.handoff.disabledReason', {
      ns: 'page/parts-list',
      slots: slotLabels,
    })
  })

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
        const availableKeys = getAvailableSortKeys(
          regulation.candidates[result.value.slot],
        )
        if (
          result.value.sortKey &&
          result.value.sortOrder &&
          availableKeys.includes(result.value.sortKey)
        ) {
          sortKey = result.value.sortKey
          sortOrder = result.value.sortOrder
        } else {
          sortKey = null
          sortOrder = null
        }
      }
    })()
  }

  // お気に入りの初期化（ブラウザ環境でのみ実行）
  $effect(() => {
    if (!browser || !favoriteStore) return
    favoriteStore.getFavorites(currentSlot).then((result) => {
      Result.inspect((fav) => {
        favorites = fav
      })(result)
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

    if (sortKey && sortOrder) {
      filtered = sortPartsByKey(filtered, sortKey, sortOrder)
    }

    return filtered
  })

  const availableSortKeys = $derived.by<SortKey[]>(() =>
    getAvailableSortKeys(regulation.candidates[currentSlot]),
  )

  // URL パラメータへの同期（状態変更時に自動実行）
  // URL共有時は全スロットのフィルタ状態を圧縮してシリアライズする
  $effect(() => {
    if (!browser) return

    const filtersSnapshot = createFiltersSnapshot()

    const state: SharedState = {
      slot: currentSlot,
      filtersPerSlot: filtersSnapshot,
      sortKey,
      sortOrder,
    }

    void (async () => {
      try {
        const params = await serializeToURL(state)
        const newUrl = `${window.location.pathname}?${params.toString()}`
        try {
          replaceState(newUrl, {})
        } catch {
          logger.debug('Failed to replace state - likely in test environment')
          // テスト環境ではルーターが初期化されていないため、エラーをキャッチ
          // 本番環境では正常に動作する
        }
      } catch (error) {
        logger.error('Failed to serialize parts list state to URL', {
          error,
        })
      }
    })()
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

    if (sortKey && !availableSortKeys.includes(sortKey)) {
      sortKey = null
      sortOrder = null
    }

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

  function handleSortApply(payload: { key: SortKey; order: SortOrder }) {
    sortKey = payload.key
    sortOrder = payload.order
  }

  function handleSortClear() {
    sortKey = null
    sortOrder = null
  }

  export function handleToggleFavorites() {
    showFavoritesOnly = !showFavoritesOnly
  }

  function createFiltersSnapshot(): FiltersPerSlot {
    return Object.entries(filtersPerSlot).reduce((acc, [slot, slotFilters]) => {
      if (slotFilters) {
        acc[slot as CandidatesKey] = [...slotFilters]
      }
      return acc
    }, {} as FiltersPerSlot)
  }

  async function handleNavigateToAssembly() {
    if (!browser) return

    const filtersSnapshot = createFiltersSnapshot()

    const state: SharedState = {
      slot: currentSlot,
      filtersPerSlot: filtersSnapshot,
      sortKey,
      sortOrder,
    }

    try {
      const sharedParams = await serializeToURL(state)
      const restrictedParams = serializeFilteredPartsPool({
        candidates: regulation.candidates,
        filtersPerSlot: filtersSnapshot,
      })

      const currentParams = new URLSearchParams(window.location.search)
      currentParams.forEach((value, key) => {
        if (key.endsWith(SLOT_PARTS_SUFFIX)) {
          return
        }

        if (!sharedParams.has(key)) {
          sharedParams.append(key, value)
        }
      })

      restrictedParams.forEach((value, key) => {
        sharedParams.set(key, value)
      })

      const query = sharedParams.toString()
      await goto(`/${query ? `?${query}` : ''}`)
    } catch (error) {
      logger.error('アセンブリページ遷移用のURL生成に失敗しました', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
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
    <SortControl
      slot={currentSlot}
      properties={availableSortKeys}
      {sortKey}
      {sortOrder}
      onsortchange={handleSortApply}
      onsortclear={handleSortClear}
    />
  </div>

  <div class="py-1 d-flex flex-column align-items-end gap-2">
    {#if handoffDisabledReason}
      <p class="text-danger small mb-0 text-center">
        {handoffDisabledReason}
      </p>
    {/if}
    <button
      class="btn btn-primary"
      type="button"
      title={isHandoffDisabled && handoffDisabledReason
        ? handoffDisabledReason
        : $i18n.t('navigation.handoff.description', {
            ns: 'page/parts-list',
          })}
      disabled={isHandoffDisabled}
      onclick={handleNavigateToAssembly}
    >
      {$i18n.t('navigation.handoff.label', { ns: 'page/parts-list' })}
    </button>
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
