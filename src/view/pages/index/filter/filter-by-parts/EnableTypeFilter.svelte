<script lang="ts">
  import type {ReadonlyPartsFilterState} from "~core/assembly/filter/filter-set.ts";
  import {logger} from "~core/utils/logger.ts";

  import i18n from "~view/i18n/define.ts";
  import type {ChangeFilter} from "~view/pages/index/filter/filter-by-parts/event.ts";

  import {createEventDispatcher} from "svelte";
  import type {ChangeEventHandler} from "svelte/elements";

  export let state: ReadonlyPartsFilterState

  const onChecked = (target: ReadonlyPartsFilterState): ChangeEventHandler<HTMLInputElement> => (e) => {
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
  >
  <label class="form-check-label" for={state.filter.name}>
    {$i18n.t(`filter:${state.filter.name}`)}
  </label>
</div>