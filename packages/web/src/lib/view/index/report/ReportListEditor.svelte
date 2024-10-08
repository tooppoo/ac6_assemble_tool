<script lang="ts" context="module">
  import type {
    ReportAggregation,
    Report,
  } from '$lib/view/index/report/model/report'
  export type SaveAggregation = Readonly<{ target: ReportAggregation }>
</script>

<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'
  import i18n, { type I18Next } from '$lib/i18n/define'
  import ReportItem from '$lib/view/index/report/ReportItem.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { EmptyObject } from '@ac6_assemble_tool/core/utils/type'
  import { createEventDispatcher } from 'svelte'

  // state
  export let assembly: Assembly
  export let reportAggregation: ReportAggregation

  let editingReportAggregation: ReportAggregation
  $: editingReportAggregation = reportAggregation

  function visibleStatus(
    report: Report,
    i: I18Next,
  ): { class: string; title: string } {
    return report.show
      ? {
          title: i.t('command.report.hide', { ns: 'page/index' }),
          class: 'bi-eye',
        }
      : {
          title: i.t('command.report.show', { ns: 'page/index' }),
          class: 'bi-eye-slash',
        }
  }

  // handler
  function editReport(blockId: string, report: Report): void {
    editingReportAggregation = editingReportAggregation.updateReport(
      blockId,
      report,
    )
  }
  function showAll() {
    editingReportAggregation = editingReportAggregation.showAll()
  }

  function onSave() {
    dispatch('save', { target: editingReportAggregation })
  }
  function onReset() {
    dispatch('reset', {})
  }

  const dispatch = createEventDispatcher<{
    save: SaveAggregation
    reset: EmptyObject
    showAll: SaveAggregation
  }>()
</script>

<div class="d-flex justify-content-end">
  <IconButton
    id="show-all-report-status"
    class="bi bi-eye me-3"
    title={$i18n.t('command.report.showAll', { ns: 'page/index' })}
    clickable={true}
    on:click={showAll}
  />
  <IconButton
    id="reset-report-status"
    class="bi bi-arrow-counterclockwise me-3"
    title={$i18n.t('command.report.reset', { ns: 'page/index' })}
    clickable={true}
    on:click={onReset}
  />
  <IconButton
    id="save-report-status"
    class="bi bi-check-square-fill text-info me-3"
    title={$i18n.t('command.report.save', { ns: 'page/index' })}
    clickable={true}
    on:click={onSave}
  />
</div>
<hr />
{#each editingReportAggregation.allBlocks as block, i}
  {#if i !== 0}
    <hr />
  {/if}
  <div>
    <div class="row mb-3">
      {#each block.allReports as report}
        <div
          class="editable-report-item mb-3 col-6 col-sm-4 col-md-3"
          draggable="true"
        >
          <IconButton
            id={`toggle-visible-${report.key}`}
            class={`toggle-visible bi ${visibleStatus(report, $i18n).class}`}
            title={visibleStatus(report, $i18n).title}
            clickable={true}
            on:click={() => editReport(block.id, report.toggleShow())}
          />
          <ReportItem
            caption={$i18n.t(report.key, { ns: 'assembly' })}
            value={assembly[report.key]}
            status={report.statusFor(assembly)}
          />
        </div>
      {/each}
    </div>
  </div>
{/each}

<style scoped>
  .editable-report-item {
    border: solid 0.5px;
    /* cursor: grab; */
  }
  /* .editable-report-item:hover {
    background-color: rgba(100, 100, 100, 0.5);
  } */
</style>
