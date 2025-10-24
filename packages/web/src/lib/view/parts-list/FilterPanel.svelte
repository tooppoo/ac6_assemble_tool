<script lang="ts">
  /**
   * FilterPanel - フィルタ設定UIコンポーネント
   *
   * スロット対応の属性フィルタUIを提供し、フィルタ条件の変更イベントを発火します。
   */

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Filter } from './filters'
  import {
    FILTERABLE_PROPERTIES,
    PROPERTY_LABELS,
    isNumericProperty,
  } from './filters'
  import { Alert, Collapse } from '@sveltestrap/sveltestrap'

  // Props
  interface Props {
    slot: CandidatesKey
    filters: Filter[]
    invalidatedFilters?: Filter[]
    onclearfilters?: () => void
    onfilterchange?: (filters: Filter[]) => void
  }

  let {
    filters,
    invalidatedFilters = [],
    onclearfilters,
    onfilterchange,
  }: Props = $props()

  // フィルタ追加フォームの状態
  let selectedProperty = $state('price')
  let selectedOperator = $state<Filter['operator']>('lte')
  let inputValue = $state('')

  // 折りたたみ状態
  let isOpen = $state(true)

  // 演算子の表示マップ
  const operatorLabels: Record<Filter['operator'], string> = {
    lt: '<',
    lte: '≤',
    gt: '>',
    gte: '≥',
    eq: '=',
    ne: '≠',
  }

  // 追加ボタンの有効/無効判定（inputValueが数値に変換される可能性があるため、String()でキャスト）
  const isAddButtonDisabled = $derived(String(inputValue).trim() === '')

  // フィルタクリアハンドラ
  function handleClearFilters() {
    onclearfilters?.()
  }

  // フィルタ追加ハンドラ
  function handleAddFilter() {
    const valueStr = String(inputValue).trim()
    if (valueStr === '') return

    const newFilter: Filter = {
      property: selectedProperty,
      operator: selectedOperator,
      value: isNumericProperty(selectedProperty)
        ? parseFloat(valueStr)
        : valueStr,
    }

    // 既存のフィルタに新しいフィルタを追加
    const updatedFilters = [...filters, newFilter]
    onfilterchange?.(updatedFilters)

    // フォームをリセット
    inputValue = ''
  }

  // 個別フィルタ削除ハンドラ
  function handleRemoveFilter(index: number) {
    const updatedFilters = filters.filter((_, i) => i !== index)
    onfilterchange?.(updatedFilters)
  }

  function toggleCollapse() {
    isOpen = !isOpen
  }
</script>

<div class="card filter-panel-card">
  <div
    class="card-header bg-dark text-white d-flex justify-content-between align-items-center"
  >
    <h5 class="mb-0">フィルタ ({filters.length}件)</h5>
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-light"
        disabled={filters.length === 0}
        onclick={handleClearFilters}
      >
        クリア
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-light"
        onclick={toggleCollapse}
        aria-label={isOpen ? '折りたたむ' : '展開'}
      >
        {isOpen ? '▲' : '▼'}
      </button>
    </div>
  </div>

  <Collapse {isOpen}>
    <div class="card-body">
      {#if invalidatedFilters.length > 0}
        <Alert color="warning" class="mb-3">
          <div>
            <strong>無効化された条件:</strong>
            {#each invalidatedFilters as filter, i}
              {filter.property}
              {operatorLabels[filter.operator]}
              {filter.value}{i < invalidatedFilters.length - 1 ? ', ' : ''}
            {/each}
          </div>
        </Alert>
      {/if}

      <!-- フィルタ追加フォーム -->
      <div class="filter-add-form bg-secondary bg-opacity-25 p-3 rounded mb-3">
        <div class="row g-2">
          <div class="col-12 col-md-4">
            <label for="filter-property" class="form-label mb-1 text-white"
              >属性</label
            >
            <select
              id="filter-property"
              class="form-select"
              bind:value={selectedProperty}
            >
              {#each FILTERABLE_PROPERTIES as property}
                <option value={property}>{PROPERTY_LABELS[property]}</option>
              {/each}
            </select>
          </div>

          <div class="col-12 col-md-3">
            <label for="filter-operator" class="form-label mb-1 text-white"
              >条件</label
            >
            <select
              id="filter-operator"
              class="form-select"
              bind:value={selectedOperator}
            >
              <option value="lte">≤ 以下</option>
              <option value="gte">≥ 以上</option>
              <option value="lt">{'<'} 未満</option>
              <option value="gt">{'>'} 超過</option>
              <option value="eq">= 等しい</option>
              <option value="ne">≠ 等しくない</option>
            </select>
          </div>

          <div class="col-12 col-md-3">
            <label for="filter-value" class="form-label mb-1 text-white"
              >値</label
            >
            <input
              id="filter-value"
              type={isNumericProperty(selectedProperty) ? 'number' : 'text'}
              class="form-control"
              bind:value={inputValue}
              placeholder="値を入力"
            />
          </div>

          <div class="col-12 col-md-2 d-flex align-items-end">
            <button
              type="button"
              class="btn btn-primary w-100"
              disabled={isAddButtonDisabled}
              onclick={handleAddFilter}
            >
              追加
            </button>
          </div>
        </div>
      </div>

      <!-- 現在のフィルタ一覧 -->
      {#if filters.length > 0}
        <div class="list-group">
          {#each filters as filter, index}
            <div
              class="list-group-item filter-list-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span class="fs-5 me-2"
                  >{PROPERTY_LABELS[filter.property] || filter.property}</span
                >
                <span class="me-1 fs-5">{operatorLabels[filter.operator]}</span>
                <strong class="fs-5">{filter.value}</strong>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                onclick={() => handleRemoveFilter(index)}
                aria-label="削除"
              >
                ×
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-muted mb-0">フィルタが設定されていません</p>
      {/if}
    </div>
  </Collapse>
</div>
