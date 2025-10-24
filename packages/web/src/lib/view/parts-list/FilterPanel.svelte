<script lang="ts">
  /**
   * FilterPanel - フィルタ設定UIコンポーネント
   *
   * スロット対応の属性フィルタUIを提供し、フィルタ条件の変更イベントを発火します。
   */

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Filter } from './filters'
  import { Alert } from '@sveltestrap/sveltestrap'

  // Props
  interface Props {
    slot: CandidatesKey
    filters: Filter[]
    invalidatedFilters?: Filter[]
    onclearfilters?: () => void
    onfilterchange?: (filters: Filter[]) => void
  }

  let { slot, filters, invalidatedFilters = [], onclearfilters, onfilterchange }: Props = $props()

  // 演算子の表示マップ
  const operatorLabels: Record<Filter['operator'], string> = {
    lt: '<',
    lte: '≤',
    gt: '>',
    gte: '≥',
    eq: '=',
    ne: '≠',
  }

  // フィルタクリアハンドラ
  function handleClearFilters() {
    onclearfilters?.()
  }
</script>

<div class="filter-panel">
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h5 class="mb-0">フィルタ ({filters.length}件)</h5>
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      disabled={filters.length === 0}
      onclick={handleClearFilters}
    >
      クリア
    </button>
  </div>

  {#if invalidatedFilters.length > 0}
    <Alert color="warning" class="py-2">
      <small>
        <strong>無効化された条件:</strong>
        {#each invalidatedFilters as filter, i}
          {filter.property}
          {operatorLabels[filter.operator]}
          {filter.value}{i < invalidatedFilters.length - 1 ? ', ' : ''}
        {/each}
      </small>
    </Alert>
  {/if}

  {#if filters.length > 0}
    <div class="filters-list">
      {#each filters as filter}
        <div class="filter-item mb-2 p-2 border rounded">
          <small>
            <strong>{filter.property}</strong>
            <span class="mx-1">{operatorLabels[filter.operator]}</span>
            <span>{filter.value}</span>
          </small>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-muted">フィルタが設定されていません</p>
  {/if}
</div>

<style>
  .filter-panel {
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 0.25rem;
  }

  .filter-item {
    background-color: white;
  }
</style>
