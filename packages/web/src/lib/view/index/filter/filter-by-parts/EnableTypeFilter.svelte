<script lang="ts">
  import i18n from '$lib/i18n/define'
  import type { ChangeFilter } from '$lib/view/index/filter/filter-by-parts/event'

  import type { ReadonlyPartsFilterState } from '@ac6_assemble_tool/core/assembly/filter/filter-set'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import { createEventDispatcher } from 'svelte'
  import type { ChangeEventHandler } from 'svelte/elements'

  export let state: ReadonlyPartsFilterState

  const onChecked =
    (target: ReadonlyPartsFilterState): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      logger.debug('filter-offcanvas-onChecked', { target, e })

      dispatch('change-filter', {
        target: {
          ...target,
          enabled: !target.enabled,
        },
      })
    }

  const dispatch = createEventDispatcher<{
    'change-filter': ChangeFilter
  }>()
</script>

<div class="form-check">
  <input
    id={state.filter.name}
    class="form-check-input"
    type="checkbox"
    value=""
    checked={state.enabled}
    on:change={onChecked(state)}
  />
  <label class="form-check-label" for={state.filter.name}>
    {$i18n.t(`filter:${state.filter.name}`)}
  </label>
</div>
