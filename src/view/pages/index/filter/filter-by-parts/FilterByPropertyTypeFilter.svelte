<script lang="ts">
  import type {ReadonlyPartsFilterState} from "~core/assembly/filter/filter-set.ts";
  import {logger} from "~core/utils/logger.ts";

  import TextButton from "~view/components/button/TextButton.svelte";
  import i18n from "~view/i18n/define.ts";
  import type {ChangeFilter} from "~view/pages/index/filter/filter-by-parts/event.ts";
  import type {CurrentFilter} from "~view/pages/index/interaction/filter.ts";

  import {createEventDispatcher} from "svelte";
  import type {ChangeEventHandler} from "svelte/elements";

  export let current: CurrentFilter
  export let state: ReadonlyPartsFilterState

  const formId = `${current.id}-${state.filter.name}-multi-select`
  let selectBox: HTMLSelectElement

  // handle
  const onSelected = <T extends ReadonlyPartsFilterState>(target: T): ChangeEventHandler<HTMLSelectElement> => (e) => {
    logger.debug('filter-offcanvas-onSelected', { target, e })

    if (target.filter.type.id !== 'filterByProperty') return

    const options = e.currentTarget.options
    let selected: typeof target.filter.type.value = []
    for (let i = 0; i < options.length; i++) {
      const item = options.item(i)
      item && item.selected && selected.push(item.value)
    }

    const t = {
      ...target,
      filter: {
        ...target.filter,
        type: {
          ...target.filter.type,
          value: selected,
        }
      },
      enabled: selected.length > 0,
    }

    dispatch('change-filter', { target: t })
  }
  const resetSelect = (target: ReadonlyPartsFilterState) => () => {
    if (target.filter.type.id !== 'filterByProperty') return

    const result = {
      ...target,
      filter: {
        ...target.filter,
        type: {
          ...target.filter.type,
          value: target.filter.type.whole,
        }
      },
      enabled: false,
    }

    dispatch('change-filter', { target: result })
    selectBox.selectedIndex = -1 // 選択状態解除
  }

  // setup
  const dispatch = createEventDispatcher<{
    'change-filter': ChangeFilter
  }>()
</script>

<!-- guard for type hint -->
{#if state.filter.type.id === 'filterByProperty'}
<div class="d-flex align-items-center">
  <label for={formId} class="d-flex align-items-center me-2 property-filter-label">
    {$i18n.t(`filter:${state.filter.name}`)}
  </label>
  <select
    id={formId}
    class="form-select property-filter-values"
    multiple
    on:change={onSelected(state)}
    bind:this={selectBox}
  >
    {#each state.filter.type.whole as v}
      <option
        value={v}
        selected={state.enabled && state.filter.type.value.includes(v)}
      >
        {$i18n.t(`${state.filter.type.property}:${v}`)}
      </option>
    {/each}
  </select>
  <TextButton
    id={`reset-${formId}`}
    class="ms-2 property-filter-reset"
    on:click={resetSelect(state)}
  >
    RESET
  </TextButton>
</div>
{/if}

<style>
.property-filter-label {
    flex-basis: 20%;
}
.property-filter-values {
    flex-basis: 65%;
}
</style>
