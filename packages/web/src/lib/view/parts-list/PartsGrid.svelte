<script lang="ts">
  /**
   * PartsGrid - パーツ一覧をグリッド形式で表示するコンポーネント
   *
   * フィルタ・並び替え済みのパーツをグリッド形式で表示し、
   * お気に入り機能を提供します。0件時はEmptyStateを表示します。
   */

  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'

  import EmptyState from './EmptyState.svelte'
  import PartsCard from './PartsCard.svelte'

  // Props
  interface Props {
    parts: readonly ACParts[]
    slot: CandidatesKey
    favorites: Set<string>
    ontogglefavorite?: (partsId: string) => void
  }

  let { parts, slot: _slot, favorites, ontogglefavorite }: Props = $props()

  function handleToggleFavorite(partsId: string) {
    ontogglefavorite?.(partsId)
  }
</script>

<div class="parts-grid-container">
  {#if parts.length === 0}
    <EmptyState />
  {:else}
    <div class="row g-3">
      {#each parts as part (part.id)}
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <PartsCard
            parts={part}
            isFavorite={favorites.has(part.id)}
            ontogglefavorite={() => handleToggleFavorite(part.id)}
          />
        </div>
      {/each}
    </div>

    <div class="mt-3 text-muted text-center">
      <small>
        全 {parts.length} 件のパーツを表示中
      </small>
    </div>
  {/if}
</div>

<style>
  .parts-grid-container {
    min-height: 400px;
  }
</style>
