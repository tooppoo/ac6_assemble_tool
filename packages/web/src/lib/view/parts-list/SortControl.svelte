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

  const fallbackKey = $derived(properties[0] ?? null)
  const noneValue = '__none__'

  let selectedKey: SortKey | typeof noneValue = $derived.by<
    SortKey | typeof noneValue
  >((): SortKey | typeof noneValue => {
    if (sortKey === null) {
      return noneValue
    }
    if (fallbackKey !== null && !properties.includes(sortKey)) {
      return fallbackKey
    }

    return sortKey
  })
  let selectedOrder = $derived<SortOrder>(sortOrder ?? 'asc')

  const propertyFieldId = $derived(`sort-property-${slot}`)
  const orderFieldId = $derived(`sort-order-${slot}`)

  const selectedKeyOrNull = $derived(
    selectedKey === noneValue ? null : selectedKey,
  )

  const hasPendingChanges = $derived.by(() => {
    const key = selectedKeyOrNull
    if (key === null) {
      return false
    }

    const appliedKey = sortKey
    const appliedOrder = sortOrder

    if (appliedKey === null && appliedOrder === null) {
      return true
    }

    if (appliedKey === null || appliedOrder === null) {
      return true
    }

    return key !== appliedKey || selectedOrder !== appliedOrder
  })

  const isApplyDisabled = $derived(
    properties.length === 0 || selectedKeyOrNull === null || !hasPendingChanges,
  )

  const appliedSummary = $derived.by<string | null>(() => {
    if (!sortKey || !sortOrder) {
      return null
    }
    const property = translateProperty(sortKey, $i18n)
    const order = $i18n.t(`order.${sortOrder}`, { ns: 'sort' })
    return $i18n.t('summary', {
      ns: 'sort',
      property,
      order,
    })
  })

  const statusInfo = $derived.by(() => {
    if (hasPendingChanges) {
      return {
        variant: 'pending' as const,
        text: $i18n.t('status.pending', { ns: 'sort' }),
      }
    }
    if (appliedSummary) {
      return {
        variant: 'applied' as const,
        text: `${$i18n.t('status.applied', { ns: 'sort' })}: ${appliedSummary}`,
      }
    }
    return {
      variant: 'none' as const,
      text: $i18n.t('status.none', { ns: 'sort' }),
    }
  })

  let isOpen = $state(true)

  function handleApply() {
    if (selectedKey === noneValue || !selectedOrder) return
    onsortchange?.({
      key: selectedKey as SortKey,
      order: selectedOrder,
    })
  }
  function handleClear() {
    selectedKey = noneValue
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
    <div class="d-flex flex-column gap-1">
      <h5 class="mb-0">{$i18n.t('title', { ns: 'sort' })}</h5>
      <div class="status-indicator">
        <span class={`status-chip ${statusInfo.variant}`}>
          {statusInfo.text}
        </span>
      </div>
    </div>
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
          <label for={propertyFieldId} class="form-label mb-1 text-white">
            {$i18n.t('propertyLabel', { ns: 'sort' })}
          </label>
          <select
            id={propertyFieldId}
            class="form-select"
            bind:value={selectedKey}
            disabled={properties.length === 0}
          >
            <option value={noneValue} disabled>
              {properties.length === 0
                ? '-'
                : $i18n.t('propertyLabel', { ns: 'sort' })}
            </option>
            {#each properties as property (property)}
              <option value={property}>
                {translatePropertyLabel(property)}
              </option>
            {/each}
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for={orderFieldId} class="form-label mb-1 text-white">
            {$i18n.t('orderLabel', { ns: 'sort' })}
          </label>
          <select
            id={orderFieldId}
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
            disabled={isApplyDisabled}
          >
            {$i18n.t('apply', { ns: 'sort' })}
          </button>
        </div>
      </div>
    </div>
  </Collapse>
</div>

<style>
  .status-indicator {
    font-size: 0.75rem;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.15rem 0.65rem;
    border-radius: 999px;
    border: 1px solid var(--bs-border-color);
    color: var(--bs-secondary-color);
    background-color: var(--bs-body-bg);
  }

  .status-chip.pending {
    border-color: var(--bs-warning-border-subtle, rgba(255, 193, 7, 0.4));
    color: var(--bs-warning-text-emphasis, #664d03);
    background-color: var(--bs-warning-bg-subtle, rgba(255, 193, 7, 0.15));
  }

  .status-chip.applied {
    border-color: var(--bs-secondary-border-subtle, rgba(108, 117, 125, 0.4));
    color: var(--bs-secondary-text-emphasis, #2c3034);
    background-color: var(--bs-secondary-bg-subtle, rgba(108, 117, 125, 0.12));
  }
</style>
