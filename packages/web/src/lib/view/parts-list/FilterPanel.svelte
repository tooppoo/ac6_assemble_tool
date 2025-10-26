<script lang="ts">
  /**
   * FilterPanel - フィルタ設定UIコンポーネント
   *
   * スロット対応の属性フィルタUIを提供し、フィルタ条件の変更イベントを発火します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { Collapse } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  import {
    buildCategoryFilter,
    buildManufactureFilter,
    buildNameFilter,
    buildPropertyFilter,
    translateCategory,
    translateManufacturer,
    translateOperand,
    translateProperty,
    type PropertyFilterKey,
  } from './state/filter/filters-application'
  import {
    numericOperands,
    selectAnyOperand,
    stringOperands,
    type Filter,
    extractManufacturers,
    extractCategories,
  } from './state/filter/filters-core'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')
  // Props
  interface Props {
    slot: CandidatesKey
    filters: Filter[]
    availableParts: readonly Record<string, unknown>[]
    showFavoritesOnly?: boolean
    onclearfilters?: () => void
    onfilterchange?: (filters: Filter[]) => void
    ontogglefavorites?: () => void
  }

  let {
    filters,
    availableParts,
    showFavoritesOnly = false,
    onclearfilters,
    onfilterchange,
    ontogglefavorites,
  }: Props = $props()

  // フィルタ追加フォームの状態
  type FilterType = 'property' | 'name' | 'manufacture' | 'category'
  let selectedFilterType = $state<FilterType>('property')

  const availableFilters = {
    property: numericOperands(),
    name: stringOperands(),
    manufacture: selectAnyOperand(),
    category: selectAnyOperand(),
  }

  // PropertyFilter用の状態
  let selectedProperty = $state<PropertyFilterKey>('price')
  let propertyOperandId = $state(availableFilters.property[0].id)
  let propertyInputValue = $state('')

  // NameFilter用の状態
  let nameOperandId = $state(availableFilters.name[0].id)
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

        const property = selectedProperty
        const value = parseInt(valueStr, 10)

        // IDから対応するoperandを見つける
        const operand = availableFilters.property.find(
          (op) => op.id === propertyOperandId,
        )
        if (!operand) return

        newFilter = buildPropertyFilter(property, operand, value)
        propertyInputValue = ''
        break
      }

      case 'name': {
        const valueStr = String(nameInputValue).trim()
        if (valueStr === '') return

        // IDから対応するoperandを見つける
        const operand = availableFilters.name.find(
          (op) => op.id === nameOperandId,
        )
        if (!operand) return

        newFilter = buildNameFilter(operand, valueStr)
        nameInputValue = ''
        break
      }

      case 'manufacture': {
        if (selectedManufacturers.length === 0) return

        newFilter = buildManufactureFilter(availableFilters.manufacture, [
          ...selectedManufacturers,
        ])
        selectedManufacturers = []
        break
      }

      case 'category': {
        if (selectedCategories.length === 0) return

        newFilter = buildCategoryFilter(availableFilters.category, [
          ...selectedCategories,
        ])
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
      <!-- フィルタ追加フォーム -->
      <div class="filter-add-form bg-secondary bg-opacity-25 p-3 rounded mb-3">
        <!-- フィルタタイプ選択 -->
        <div class="row g-2 mb-2">
          <div class="col-12">
            <label for="filter-type" class="form-label mb-1 text-white"
              >フィルタ種類</label
            >
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
              <label for="filter-property" class="form-label mb-1 text-white"
                >属性</label
              >
              <select
                id="filter-property"
                class="form-select"
                bind:value={selectedProperty}
              >
                <option value="price"
                  >{translateProperty('price', $i18n)}</option
                >
                <option value="weight"
                  >{translateProperty('weight', $i18n)}</option
                >
                <option value="en_load"
                  >{translateProperty('en_load', $i18n)}</option
                >
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label for="filter-operator" class="form-label mb-1 text-white"
                >条件</label
              >
              <select
                id="filter-operator"
                class="form-select"
                bind:value={propertyOperandId}
              >
                {#each availableFilters.property as operand (operand.id)}
                  <option value={operand.id}>
                    {translateOperand(operand, $i18n)}
                  </option>
                {/each}
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label for="filter-value" class="form-label mb-1 text-white"
                >値</label
              >
              <input
                id="filter-value"
                type="number"
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
            <div class="col-12 col-md-6">
              <label for="name-value" class="form-label mb-1 text-white"
                >名前</label
              >
              <input
                id="name-value"
                type="text"
                class="form-control"
                bind:value={nameInputValue}
                placeholder="パーツ名を入力"
              />
            </div>

            <div class="col-12 col-md-4">
              <label for="name-mode" class="form-label mb-1 text-white"
                >検索モード</label
              >
              <select
                id="name-mode"
                class="form-select"
                bind:value={nameOperandId}
              >
                {#each availableFilters.name as operand (operand.id)}
                  <option value={operand.id}>
                    {translateOperand(operand, $i18n)}
                  </option>
                {/each}
              </select>
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
              <p class="form-label mb-1 text-white">メーカー（複数選択可）</p>
              <div
                class="manufacture-checkboxes p-2 bg-dark bg-opacity-50 rounded"
                style="max-height: 200px; overflow-y: auto;"
              >
                {#each availableManufacturers as manufacturer (manufacturer)}
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="manu-{manufacturer}"
                      value={manufacturer}
                      bind:group={selectedManufacturers}
                    />
                    <label
                      class="form-check-label text-white"
                      for="manu-{manufacturer}"
                    >
                      {translateManufacturer(manufacturer, $i18n)}
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
              <p class="form-label mb-1 text-white">カテゴリ（複数選択可）</p>
              <div
                class="category-checkboxes p-2 bg-dark bg-opacity-50 rounded"
                style="max-height: 200px; overflow-y: auto;"
              >
                {#each availableCategories as category (category)}
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="cat-{category}"
                      value={category}
                      bind:group={selectedCategories}
                    />
                    <label
                      class="form-check-label text-white"
                      for="cat-{category}"
                    >
                      {translateCategory(category, $i18n)}
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
          {#each filters as filter, index (filter.stringify($i18n) + index)}
            <div
              class="list-group-item filter-list-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span class="fs-5">{filter.stringify($i18n)}</span>
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
