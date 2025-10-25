<script lang="ts">
  /**
   * FilterPanel - フィルタ設定UIコンポーネント
   *
   * スロット対応の属性フィルタUIを提供し、フィルタ条件の変更イベントを発火します。
   */

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { Alert, Collapse } from '@sveltestrap/sveltestrap'

  import type { Filter, PropertyFilter, NameFilter, ManufactureFilter, CategoryFilter } from './filters'
  import {
    PROPERTY_LABELS,
    isNumericProperty,
    extractManufacturers,
    extractCategories,
  } from './filters'

  // Props
  interface Props {
    slot: CandidatesKey
    filters: Filter[]
    availableParts: readonly Record<string, unknown>[]
    invalidatedFilters?: Filter[]
    showFavoritesOnly?: boolean
    onclearfilters?: () => void
    onfilterchange?: (filters: Filter[]) => void
    ontogglefavorites?: () => void
  }

  let {
    filters,
    availableParts,
    invalidatedFilters = [],
    showFavoritesOnly = false,
    onclearfilters,
    onfilterchange,
    ontogglefavorites,
  }: Props = $props()

  // フィルタ追加フォームの状態
  type FilterType = 'property' | 'name' | 'manufacture' | 'category'
  let selectedFilterType = $state<FilterType>('property')

  // PropertyFilter用の状態
  let selectedProperty = $state('price')
  let selectedOperator = $state<PropertyFilter['operator']>('lte')
  let propertyInputValue = $state('')

  // NameFilter用の状態
  let nameSearchMode = $state<NameFilter['mode']>('contains')
  let nameInputValue = $state('')

  // ManufactureFilter用の状態
  let selectedManufacturers = $state<string[]>([])

  // CategoryFilter用の状態
  let selectedCategories = $state<string[]>([])

  // 折りたたみ状態
  let isOpen = $state(true)

  // 利用可能なメーカーとカテゴリを計算
  const availableManufacturers = $derived(extractManufacturers(availableParts))
  const availableCategories = $derived(extractCategories(availableParts))

  // 演算子の表示マップ
  const operatorLabels: Record<PropertyFilter['operator'], string> = {
    lt: '<',
    lte: '≤',
    gt: '>',
    gte: '≥',
    eq: '=',
    ne: '≠',
  }

  // 追加ボタンの有効/無効判定
  const isAddButtonDisabled = $derived(() => {
    switch (selectedFilterType) {
      case 'property':
        return String(propertyInputValue).trim() === ''
      case 'name':
        return String(nameInputValue).trim() === ''
      case 'manufacture':
        return selectedManufacturers.length === 0
      case 'category':
        return selectedCategories.length === 0
      default:
        return true
    }
  })

  // フィルタクリアハンドラ
  function handleClearFilters() {
    onclearfilters?.()
  }

  // フィルタ追加ハンドラ
  function handleAddFilter() {
    let newFilter: Filter | null = null

    switch (selectedFilterType) {
      case 'property': {
        const valueStr = String(propertyInputValue).trim()
        if (valueStr === '') return

        newFilter = {
          type: 'property',
          property: selectedProperty,
          operator: selectedOperator,
          value: isNumericProperty(selectedProperty)
            ? parseFloat(valueStr)
            : valueStr,
        }
        propertyInputValue = ''
        break
      }

      case 'name': {
        const valueStr = String(nameInputValue).trim()
        if (valueStr === '') return

        newFilter = {
          type: 'name',
          mode: nameSearchMode,
          value: valueStr,
        }
        nameInputValue = ''
        break
      }

      case 'manufacture': {
        if (selectedManufacturers.length === 0) return

        newFilter = {
          type: 'manufacture',
          values: [...selectedManufacturers],
        }
        selectedManufacturers = []
        break
      }

      case 'category': {
        if (selectedCategories.length === 0) return

        newFilter = {
          type: 'category',
          values: [...selectedCategories],
        }
        selectedCategories = []
        break
      }
    }

    if (newFilter) {
      const updatedFilters = [...filters, newFilter]
      onfilterchange?.(updatedFilters)
    }
  }

  // 個別フィルタ削除ハンドラ
  function handleRemoveFilter(index: number) {
    const updatedFilters = filters.filter((_, i) => i !== index)
    onfilterchange?.(updatedFilters)
  }

  function toggleCollapse() {
    isOpen = !isOpen
  }

  function handleToggleFavorites() {
    ontogglefavorites?.()
  }

  /** {@link Filter} からeach用のkeyを生成する*/
  function fKey(f: Filter, index: number): string {
    switch (f.type) {
      case 'property':
        return `${f.type}-${f.property}-${f.operator}-${f.value}-${index}`
      case 'name':
        return `${f.type}-${f.mode}-${f.value}-${index}`
      case 'manufacture':
        return `${f.type}-${f.values.join(',')}-${index}`
      case 'category':
        return `${f.type}-${f.values.join(',')}-${index}`
      default:
        return `unknown-${index}`
    }
  }

  /** フィルタの表示文字列を生成 */
  function filterToString(f: Filter): string {
    switch (f.type) {
      case 'property':
        return `${PROPERTY_LABELS[f.property] || f.property} ${operatorLabels[f.operator]} ${f.value}`
      case 'name': {
        const modeLabels = {
          exact: '完全一致',
          contains: '含む',
          not_contains: '含まない',
        }
        return `名前: ${modeLabels[f.mode]} "${f.value}"`
      }
      case 'manufacture':
        return `メーカー: ${f.values.join(', ')}`
      case 'category':
        return `カテゴリ: ${f.values.join(', ')}`
      default:
        return '不明なフィルタ'
    }
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
        class="btn btn-sm {showFavoritesOnly
          ? 'btn-warning'
          : 'btn-outline-light'}"
        onclick={handleToggleFavorites}
        aria-label="お気に入りのみ表示"
        title="お気に入りのみ表示"
      >
        {showFavoritesOnly ? '★' : '☆'}
      </button>
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
            {#each invalidatedFilters as filter, i (fKey(filter, i))}
              {filterToString(filter)}{i < invalidatedFilters.length - 1 ? ', ' : ''}
            {/each}
          </div>
        </Alert>
      {/if}

      <!-- フィルタ追加フォーム -->
      <div class="filter-add-form bg-secondary bg-opacity-25 p-3 rounded mb-3">
        <!-- フィルタタイプ選択 -->
        <div class="row g-2 mb-2">
          <div class="col-12">
            <label for="filter-type" class="form-label mb-1 text-white">フィルタ種類</label>
            <select
              id="filter-type"
              class="form-select"
              bind:value={selectedFilterType}
            >
              <option value="property">属性値検索</option>
              <option value="name">名前検索</option>
              <option value="manufacture">メーカー検索</option>
              <option value="category">カテゴリ検索</option>
            </select>
          </div>
        </div>

        <!-- PropertyFilter用UI -->
        {#if selectedFilterType === 'property'}
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label for="filter-property" class="form-label mb-1 text-white">属性</label>
              <select
                id="filter-property"
                class="form-select"
                bind:value={selectedProperty}
              >
                <option value="price">{PROPERTY_LABELS.price}</option>
                <option value="weight">{PROPERTY_LABELS.weight}</option>
                <option value="en_load">{PROPERTY_LABELS.en_load}</option>
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label for="filter-operator" class="form-label mb-1 text-white">条件</label>
              <select
                id="filter-operator"
                class="form-select"
                bind:value={selectedOperator}
              >
                <option value="lte">≤ 以下</option>
                <option value="gte">≥ 以上</option>
                <option value="lt">&lt; 未満</option>
                <option value="gt">&gt; 超過</option>
                <option value="eq">= 等しい</option>
                <option value="ne">≠ 等しくない</option>
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label for="filter-value" class="form-label mb-1 text-white">値</label>
              <input
                id="filter-value"
                type={isNumericProperty(selectedProperty) ? 'number' : 'text'}
                class="form-control"
                bind:value={propertyInputValue}
                placeholder="値を入力"
              />
            </div>

            <div class="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                class="btn btn-primary w-100"
                disabled={isAddButtonDisabled()}
                onclick={handleAddFilter}
              >
                追加
              </button>
            </div>
          </div>
        {/if}

        <!-- NameFilter用UI -->
        {#if selectedFilterType === 'name'}
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label for="name-mode" class="form-label mb-1 text-white">検索モード</label>
              <select
                id="name-mode"
                class="form-select"
                bind:value={nameSearchMode}
              >
                <option value="contains">含む（デフォルト）</option>
                <option value="exact">完全一致</option>
                <option value="not_contains">含まない</option>
              </select>
            </div>

            <div class="col-12 col-md-6">
              <label for="name-value" class="form-label mb-1 text-white">名前</label>
              <input
                id="name-value"
                type="text"
                class="form-control"
                bind:value={nameInputValue}
                placeholder="パーツ名を入力"
              />
            </div>

            <div class="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                class="btn btn-primary w-100"
                disabled={isAddButtonDisabled()}
                onclick={handleAddFilter}
              >
                追加
              </button>
            </div>
          </div>
        {/if}

        <!-- ManufactureFilter用UI -->
        {#if selectedFilterType === 'manufacture'}
          <div class="row g-2">
            <div class="col-12 col-md-10">
              <label class="form-label mb-1 text-white">メーカー（複数選択可）</label>
              <div class="manufacture-checkboxes p-2 bg-dark bg-opacity-50 rounded" style="max-height: 200px; overflow-y: auto;">
                {#each availableManufacturers as manufacturer (manufacturer)}
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="manu-{manufacturer}"
                      value={manufacturer}
                      bind:group={selectedManufacturers}
                    />
                    <label class="form-check-label text-white" for="manu-{manufacturer}">
                      {manufacturer}
                    </label>
                  </div>
                {/each}
              </div>
            </div>

            <div class="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                class="btn btn-primary w-100"
                disabled={isAddButtonDisabled()}
                onclick={handleAddFilter}
              >
                追加
              </button>
            </div>
          </div>
        {/if}

        <!-- CategoryFilter用UI -->
        {#if selectedFilterType === 'category'}
          <div class="row g-2">
            <div class="col-12 col-md-10">
              <label class="form-label mb-1 text-white">カテゴリ（複数選択可）</label>
              <div class="category-checkboxes p-2 bg-dark bg-opacity-50 rounded" style="max-height: 200px; overflow-y: auto;">
                {#each availableCategories as category (category)}
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="cat-{category}"
                      value={category}
                      bind:group={selectedCategories}
                    />
                    <label class="form-check-label text-white" for="cat-{category}">
                      {category}
                    </label>
                  </div>
                {/each}
              </div>
            </div>

            <div class="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                class="btn btn-primary w-100"
                disabled={isAddButtonDisabled()}
                onclick={handleAddFilter}
              >
                追加
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- 現在のフィルタ一覧 -->
      {#if filters.length > 0}
        <div class="list-group">
          {#each filters as filter, index (fKey(filter, index))}
            <div
              class="list-group-item filter-list-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span class="fs-5">{filterToString(filter)}</span>
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
