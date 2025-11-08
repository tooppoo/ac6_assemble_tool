<script lang="ts">
  /**
   * FilterPanel - フィルタ設定UIコンポーネント
   *
   * スロット対応の属性フィルタUIを提供し、フィルタ条件の変更イベントを発火します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { AttributeDefinition } from '@ac6_assemble_tool/parts/attributes-utils'
  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { Collapse } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  import {
    buildArrayFilter,
    buildNameFilter,
    buildPropertyFilter,
    resolveSelectionValueTranslator,
    translateOperand,
    translateProperty,
    type PropertyFilterKey,
  } from './filters-application'
  import {
    numericOperands,
    selectAnyOperand,
    stringOperands,
    type Filter,
  } from './filters-core'

  // i18n
  const i18n = getContext<I18NextStore>('i18n')
  // Props
  interface Props {
    slot: CandidatesKey
    filters: Filter[]
    availableAttributes: readonly AttributeDefinition[]
    showFavoritesOnly?: boolean
    onclearfilters?: () => void
    onfilterchange?: (filters: Filter[]) => void
    ontogglefavorites?: () => void
  }

  let {
    slot,
    filters,
    availableAttributes,
    showFavoritesOnly = false,
    onclearfilters,
    onfilterchange,
    ontogglefavorites,
  }: Props = $props()

  // フィルタ追加フォームの状態
  type FilterType = 'numeric' | 'name' | 'selection'
  type FilterTypeSelectValue = FilterType | PropertyFilterKey

  let selectedFilterTypeState = $state<FilterType>('numeric')

  const numericOperandList = numericOperands()
  const nameOperandList = stringOperands()
  const selectionOperand = selectAnyOperand()

  // PropertyFilter用の状態
  const numericAttributes = $derived.by(() =>
    availableAttributes.filter((attr) => attr.valueType === 'numeric'),
  )
  const arrayAttributes = $derived.by(() =>
    availableAttributes.filter((attr) => attr.valueType === 'array'),
  )

  const propertyOptions = $derived.by<readonly PropertyFilterKey[]>(() =>
    numericAttributes.map((attr) => attr.attributeName as PropertyFilterKey),
  )

  let selectedPropertyState = $state<PropertyFilterKey | null>(null)
  const selectedPropertyValue = $derived.by<PropertyFilterKey | null>(() => {
    if (propertyOptions.length === 0) {
      return null
    }
    if (
      selectedPropertyState !== null &&
      propertyOptions.includes(selectedPropertyState)
    ) {
      return selectedPropertyState
    }
    return propertyOptions[0]
  })
  let propertyOperandId = $state(numericOperandList[0].id)
  let propertyInputValue = $state('')

  // NameFilter用の状態
  let nameOperandId = $state(nameOperandList[0].id)
  let nameInputValue = $state('')

  // SelectionFilter用の状態
  const selectionAttributes = $derived.by<readonly PropertyFilterKey[]>(() =>
    arrayAttributes.map((attr) => attr.attributeName as PropertyFilterKey),
  )

  let selectedSelectionAttributeState = $state<PropertyFilterKey | null>(null)

  const selectedFilterType = $derived.by<FilterType>(() => {
    if (
      selectedFilterTypeState === 'selection' &&
      selectionAttributes.length === 0
    ) {
      return 'numeric'
    }
    return selectedFilterTypeState
  })
  const selectedSelectionAttribute = $derived.by<PropertyFilterKey | null>(
    () => {
      if (selectionAttributes.length === 0) {
        return null
      }
      if (
        selectedSelectionAttributeState !== null &&
        selectionAttributes.includes(selectedSelectionAttributeState)
      ) {
        return selectedSelectionAttributeState
      }
      return selectionAttributes[0]
    },
  )

  const filterTypeSelectValue = $derived.by<FilterTypeSelectValue>(() => {
    if (selectedFilterType === 'selection') {
      return selectedSelectionAttribute ?? 'numeric'
    }
    return selectedFilterType
  })

  const selectionCandidates = $derived.by<readonly string[]>(() => {
    if (!selectedSelectionAttribute) {
      return []
    }
    const definition = arrayAttributes.find(
      (attr) => attr.attributeName === selectedSelectionAttribute,
    )
    return definition?.candidates ?? []
  })

  let selectedSelectionValuesState = $state<string[]>([])
  const selectedSelectionValues = $derived.by<readonly string[]>(() =>
    selectedSelectionValuesState.filter((value) =>
      selectionCandidates.includes(value),
    ),
  )

  function handleSelectionAttributeChange(event: Event) {
    const target = event.currentTarget as HTMLSelectElement
    const value = target.value.trim()
    selectedSelectionAttributeState =
      value === '' ? null : (value as PropertyFilterKey)
    selectedSelectionValuesState = []
  }

  function handleFilterTypeChange(event: Event) {
    const target = event.currentTarget as HTMLSelectElement
    const value = target.value as FilterTypeSelectValue

    if (value === 'numeric' || value === 'name') {
      selectedFilterTypeState = value
      selectedSelectionAttributeState = null
      selectedSelectionValuesState = []
      return
    }

    selectedFilterTypeState = 'selection'
    selectedSelectionAttributeState = value
    selectedSelectionValuesState = []
  }

  function translateSelectionValue(value: string): string {
    const attribute = selectedSelectionAttribute
    if (!attribute) {
      return value
    }
    const translator = resolveSelectionValueTranslator(attribute)
    if (!translator) {
      return value
    }
    return translator(value, $i18n)
  }

  // 折りたたみ状態
  let isOpen = $state(true)

  const heading = $derived.by(() =>
    $i18n.t('filterPanel.heading', {
      ns: 'page/parts-list',
      count: filters.length,
    }),
  )

  const favoriteToggleLabel = $derived.by(() =>
    $i18n.t(
      showFavoritesOnly
        ? 'filterPanel.favoritesToggle.active'
        : 'filterPanel.favoritesToggle.inactive',
      { ns: 'page/parts-list' },
    ),
  )

  const favoriteToggleAria = $derived.by(() =>
    $i18n.t('filterPanel.favoritesToggle.ariaLabel', {
      ns: 'page/parts-list',
    }),
  )

  const clearLabel = $derived.by(() =>
    $i18n.t('filterPanel.clear', { ns: 'page/parts-list' }),
  )

  const collapseControlLabel = $derived.by(() =>
    $i18n.t(
      isOpen ? 'filterPanel.toggle.collapse' : 'filterPanel.toggle.expand',
      {
        ns: 'page/parts-list',
      },
    ),
  )

  const collapseContentId = $derived(`filter-panel-${slot}-body`)

  // 追加ボタンの有効/無効判定
  function isAddButtonDisabled(): boolean {
    switch (selectedFilterType) {
      case 'numeric':
        return (
          selectedPropertyValue === null ||
          String(propertyInputValue).trim() === ''
        )
      case 'name':
        return String(nameInputValue).trim() === ''
      case 'selection':
        return (
          selectedSelectionAttribute === null ||
          selectedSelectionValues.length === 0
        )
      default:
        return true
    }
  }

  // フィルタクリアハンドラ
  function handleClearFilters() {
    onclearfilters?.()
  }

  function handlePropertySelect(event: Event) {
    const target = event.currentTarget as HTMLSelectElement
    const value = target.value.trim()
    selectedPropertyState = value === '' ? null : (value as PropertyFilterKey)
  }

  // フィルタ追加ハンドラ
  function handleAddFilter() {
    let newFilter: Filter | null = null

    switch (selectedFilterType) {
      case 'numeric': {
        const valueStr = String(propertyInputValue).trim()
        if (selectedPropertyValue === null || valueStr === '') return

        const property = selectedPropertyValue
        const value = parseInt(valueStr, 10)

        // IDから対応するoperandを見つける
        const operand = numericOperandList.find(
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
        const operand = nameOperandList.find((op) => op.id === nameOperandId)
        if (!operand) return

        newFilter = buildNameFilter(operand, valueStr)
        nameInputValue = ''
        break
      }

      case 'selection': {
        const attribute = selectedSelectionAttribute
        const normalized = selectedSelectionValues
        if (!attribute || normalized.length === 0) return

        const translator = resolveSelectionValueTranslator(attribute)
        const options =
          translator !== undefined ? { translateValue: translator } : undefined
        newFilter = buildArrayFilter(
          attribute,
          selectionOperand,
          [...normalized] as readonly string[],
          options,
        )
        selectedSelectionValuesState = []
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
    <h5 class="mb-0">{heading}</h5>
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn btn-sm {showFavoritesOnly
          ? 'btn-warning'
          : 'btn-outline-light'}"
        onclick={handleToggleFavorites}
        aria-label={favoriteToggleAria}
        title={favoriteToggleLabel}
        aria-pressed={showFavoritesOnly}
      >
        {showFavoritesOnly ? '★' : '☆'}
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-light"
        disabled={filters.length === 0}
        onclick={handleClearFilters}
      >
        {clearLabel}
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-light"
        onclick={toggleCollapse}
        aria-label={collapseControlLabel}
        aria-expanded={isOpen}
        aria-controls={collapseContentId}
      >
        {isOpen ? '▲' : '▼'}
      </button>
    </div>
  </div>

  <Collapse {isOpen}>
    <div class="card-body" id={collapseContentId}>
      <!-- フィルタ追加フォーム -->
      <div class="filter-add-form bg-secondary bg-opacity-25 p-3 rounded mb-3">
        <!-- フィルタタイプ選択 -->
        <div class="row g-2 mb-2">
          <div class="col-12">
            <label for="filter-type" class="form-label mb-1 text-white"
              >{$i18n.t('filterPanel.filterTypeLabel', {
                ns: 'page/parts-list',
              })}</label
            >
            <select
              id="filter-type"
              class="form-select"
              value={filterTypeSelectValue}
              onchange={handleFilterTypeChange}
            >
              <option value="numeric">
                {$i18n.t('filterPanel.filterTypes.numeric', {
                  ns: 'page/parts-list',
                })}
              </option>
              <option value="name">
                {$i18n.t('filterPanel.filterTypes.name', {
                  ns: 'page/parts-list',
                })}
              </option>
              {#if selectionAttributes.length > 0}
                <optgroup
                  label={$i18n.t('filterPanel.filterTypes.selection', {
                    ns: 'page/parts-list',
                  })}
                >
                  {#each selectionAttributes as attribute (attribute)}
                    <option value={attribute}>
                      {translateProperty(attribute, $i18n)}
                    </option>
                  {/each}
                </optgroup>
              {/if}
            </select>
          </div>
        </div>

        <!-- PropertyFilter用UI -->
        {#if selectedFilterType === 'numeric'}
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label for="filter-property" class="form-label mb-1 text-white">
                {$i18n.t('filterPanel.property.label', {
                  ns: 'page/parts-list',
                })}
              </label>
              <select
                id="filter-property"
                class="form-select"
                disabled={propertyOptions.length === 0}
                value={selectedPropertyValue ?? ''}
                onchange={handlePropertySelect}
              >
                {#if propertyOptions.length === 0}
                  <option value="" disabled> - </option>
                {:else}
                  {#each propertyOptions as property (property)}
                    <option value={property}>
                      {translateProperty(property, $i18n)}
                    </option>
                  {/each}
                {/if}
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label for="filter-operator" class="form-label mb-1 text-white"
                >{$i18n.t('filterPanel.property.conditionLabel', {
                  ns: 'page/parts-list',
                })}</label
              >
              <select
                id="filter-operator"
                class="form-select"
                disabled={propertyOptions.length === 0}
                bind:value={propertyOperandId}
              >
                {#each numericOperandList as operand (operand.id)}
                  <option value={operand.id}>
                    {translateOperand(operand, $i18n)}
                  </option>
                {/each}
              </select>
            </div>

            <div class="col-12 col-md-3">
              <label for="filter-value" class="form-label mb-1 text-white"
                >{$i18n.t('filterPanel.property.valueLabel', {
                  ns: 'page/parts-list',
                })}</label
              >
              <input
                id="filter-value"
                type="number"
                class="form-control"
                min="0"
                step="10"
                disabled={propertyOptions.length === 0}
                bind:value={propertyInputValue}
                placeholder={$i18n.t('filterPanel.property.valuePlaceholder', {
                  ns: 'page/parts-list',
                })}
              />
            </div>

            <div class="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                class="btn btn-primary w-100"
                disabled={isAddButtonDisabled()}
                onclick={handleAddFilter}
              >
                {$i18n.t('filterPanel.add', { ns: 'page/parts-list' })}
              </button>
            </div>
          </div>
        {/if}

        <!-- NameFilter用UI -->
        {#if selectedFilterType === 'name'}
          <div class="row g-2">
            <div class="col-12 col-md-6">
              <label for="name-value" class="form-label mb-1 text-white"
                >{$i18n.t('filterPanel.name.label', {
                  ns: 'page/parts-list',
                })}</label
              >
              <input
                id="name-value"
                type="text"
                class="form-control"
                bind:value={nameInputValue}
                placeholder={$i18n.t('filterPanel.name.placeholder', {
                  ns: 'page/parts-list',
                })}
              />
            </div>

            <div class="col-12 col-md-4">
              <label for="name-mode" class="form-label mb-1 text-white"
                >{$i18n.t('filterPanel.name.modeLabel', {
                  ns: 'page/parts-list',
                })}</label
              >
              <select
                id="name-mode"
                class="form-select"
                bind:value={nameOperandId}
              >
                {#each nameOperandList as operand (operand.id)}
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
                {$i18n.t('filterPanel.add', { ns: 'page/parts-list' })}
              </button>
            </div>
          </div>
        {/if}

        <!-- SelectionFilter用UI -->
        {#if selectedFilterType === 'selection'}
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label
                for="selection-attribute"
                class="form-label mb-1 text-white"
              >
                {$i18n.t('filterPanel.selection.attributeLabel', {
                  ns: 'page/parts-list',
                })}
              </label>
              <select
                id="selection-attribute"
                class="form-select"
                disabled={selectionAttributes.length === 0}
                value={selectedSelectionAttribute ?? ''}
                onchange={handleSelectionAttributeChange}
              >
                {#if selectionAttributes.length === 0}
                  <option value="" disabled>-</option>
                {:else}
                  {#each selectionAttributes as attribute (attribute)}
                    <option value={attribute}>
                      {translateProperty(attribute, $i18n)}
                    </option>
                  {/each}
                {/if}
              </select>
            </div>

            <div class="col-12 col-md-6">
              <p class="form-label mb-1 text-white">
                {$i18n.t('filterPanel.selection.valuesLabel', {
                  ns: 'page/parts-list',
                })}
              </p>
              <div
                class="selection-checkboxes p-2 bg-dark bg-opacity-50 rounded"
                style="max-height: 200px; overflow-y: auto;"
              >
                {#if selectionCandidates.length === 0}
                  <p class="text-muted mb-0">
                    {$i18n.t('filterPanel.selection.empty', {
                      ns: 'page/parts-list',
                    })}
                  </p>
                {:else}
                  {#each selectionCandidates as candidate (candidate)}
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sel-{candidate}"
                        value={candidate}
                        bind:group={selectedSelectionValuesState}
                      />
                      <label
                        class="form-check-label text-white"
                        for="sel-{candidate}"
                      >
                        {translateSelectionValue(candidate)}
                      </label>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>

            <div class="col-12 col-md-2 d-flex align-items-end">
              <button
                type="button"
                class="btn btn-primary w-100"
                disabled={isAddButtonDisabled()}
                onclick={handleAddFilter}
              >
                {$i18n.t('filterPanel.add', { ns: 'page/parts-list' })}
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
                aria-label={$i18n.t('filterPanel.list.remove', {
                  ns: 'page/parts-list',
                })}
                title={$i18n.t('filterPanel.list.remove', {
                  ns: 'page/parts-list',
                })}
              >
                ×
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-muted mb-0">
          {$i18n.t('filterPanel.list.empty', { ns: 'page/parts-list' })}
        </p>
      {/if}
    </div>
  </Collapse>
</div>
