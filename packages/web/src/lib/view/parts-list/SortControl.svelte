<script lang="ts">
  /**
   * SortControl - 並び替え設定UIコンポーネント
   *
   * 選択中スロットで有効な属性のみを提示し、昇順/降順の並び替え設定を適用します。
   */

  import type { I18NextStore } from '$lib/i18n/define'

  import type { CandidatesKey } from '@ac6_assemble_tool/parts/types/candidates'
  import { Collapse } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  import {
    translateProperty,
    type PropertyFilterKey,
  } from './state/filter/filters-application'
  import type { SortKey, SortOrder } from './state/sort'

  interface Props {
    slot: CandidatesKey
    properties: readonly PropertyFilterKey[]
    sortKey: SortKey | null
    sortOrder: SortOrder | null
    onsortchange?: (payload: { key: SortKey; order: SortOrder }) => void
    onsortclear?: () => void
  }

  const i18n = getContext<I18NextStore>('i18n')

  let {
    slot,
    properties,
    sortKey,
    sortOrder,
    onsortchange,
    onsortclear,
  }: Props = $props()

  let selectedKey = $state<SortKey | null>(sortKey ?? properties[0] ?? null)
  let selectedOrder = $state<SortOrder>(sortOrder ?? 'asc')

  const propertyFieldId = $derived(() => `sort-property-${slot}`)
  const orderFieldId = $derived(() => `sort-order-${slot}`)

  const isApplyDisabled = $derived(
    () => properties.length === 0 || selectedKey === null,
  )

  let isOpen = $state(true)

  $effect(() => {
    const fallbackKey = properties[0] ?? null

    if (sortKey !== null) {
      if (selectedKey !== sortKey) {
        selectedKey = sortKey
      }
    } else if (selectedKey === null && fallbackKey !== null) {
      selectedKey = fallbackKey
    } else if (selectedKey && !properties.includes(selectedKey)) {
      selectedKey = fallbackKey
    }

    if (sortOrder !== null) {
      selectedOrder = sortOrder
    }
  })

  function handleApply() {
    if (!selectedKey || !selectedOrder) return
    onsortchange?.({ key: selectedKey, order: selectedOrder })
  }

  function handleClear() {
    const fallbackKey = properties[0] ?? selectedKey
    if (fallbackKey) {
      selectedKey = fallbackKey
    }
    selectedOrder = 'asc'
    onsortclear?.()
  }

  function toggleCollapse() {
    isOpen = !isOpen
  }

  function translatePropertyLabel(property: PropertyFilterKey): string {
    return translateProperty(property, $i18n)
  }
</script>

<div class="card sort-control-card">
  <div
    class="card-header bg-dark text-white d-flex justify-content-between align-items-center"
  >
    <h5 class="mb-0">{$i18n.t('title', { ns: 'sort' })}</h5>
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-light"
        onclick={handleClear}
        disabled={!sortKey}
      >
        {$i18n.t('clear', { ns: 'sort' })}
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
      <div class="row g-2 align-items-end">
        <div class="col-12 col-md-6">
          <label for={propertyFieldId()} class="form-label mb-1 text-white">
            {$i18n.t('propertyLabel', { ns: 'sort' })}
          </label>
          <select
            id={propertyFieldId()}
            class="form-select"
            bind:value={selectedKey}
            disabled={properties.length === 0}
          >
            {#each properties as property (property)}
              <option value={property}>
                {translatePropertyLabel(property)}
              </option>
            {/each}
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for={orderFieldId()} class="form-label mb-1 text-white">
            {$i18n.t('orderLabel', { ns: 'sort' })}
          </label>
          <select
            id={orderFieldId()}
            class="form-select"
            bind:value={selectedOrder}
            disabled={properties.length === 0}
          >
            <option value="asc">
              {$i18n.t('order.asc', { ns: 'sort' })}
            </option>
            <option value="desc">
              {$i18n.t('order.desc', { ns: 'sort' })}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-2">
          <button
            type="button"
            class="btn btn-primary w-100"
            onclick={handleApply}
            disabled={isApplyDisabled()}
          >
            {$i18n.t('apply', { ns: 'sort' })}
          </button>
        </div>
      </div>
    </div>
  </Collapse>
</div>
