<script lang="ts">
  import type { Assembly } from '~core/assembly/assembly'
  import type { EmptyObject } from '~core/utils/type'

  import IconButton from '~view/components/button/IconButton.svelte'
  import i18n from "~view/i18n/define.ts";
  import type { ReadonlyReportAggregation } from '~view/pages/index/report/model/report'
  import ReportItem from '~view/pages/index/report/ReportItem.svelte'

  import { createEventDispatcher } from 'svelte'

  export let assembly: Assembly
  export let reportAggregation: ReadonlyReportAggregation

  function onEdit() {
    dispatch('edit', {})
  }
  const dispatch = createEventDispatcher<{
    edit: EmptyObject
  }>()
</script>

  <div class="d-flex justify-content-end">
    <IconButton
      id="edit-report"
      class="bi bi-pencil-square fs-2 me-3"
      title={$i18n.t('command.report.edit', { ns: 'page/index' })}
      clickable={true}
      on:click={onEdit}
    />
  </div>
  <hr>
{#each reportAggregation.blocks as block, i}
  {#if (i !== 0)}
    <hr>
  {/if}
  <div>
    <div class="row mb-3">
      {#each block.reports as report}
        <ReportItem
          caption={$i18n.t(report.key, { ns: 'assembly' })}
          class="mb-3 col-6 col-sm-4 col-md-3"
          value={assembly[report.key]}
          status={report.statusFor(assembly)}
        />
      {/each}
    </div>
  </div>
{/each}
