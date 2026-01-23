<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'
  import i18n, { type I18Next } from '$lib/i18n/define'
  import { calculateReportDiff } from '$lib/view/index/report/diff/report-diff'
  import type {
    ReportAggregation,
    Report,
  } from '$lib/view/index/report/model/report'
  import ReportItem from '$lib/view/index/report/ReportItem.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'

  export type SaveAggregation = Readonly<{ target: ReportAggregation }>

  type Props = {
    assembly: Assembly
    previousAssembly?: Assembly | null
    reportAggregation: ReportAggregation
    onSave?: (payload: SaveAggregation) => void
  }

  let {
    assembly,
    previousAssembly = null,
    reportAggregation,
    onSave: onSaveProp,
  }: Props = $props()

  let editingReportAggregation = $derived(reportAggregation)

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
    onSaveProp?.({ target: editingReportAggregation })
  }
  function onReset() {
    editingReportAggregation = reportAggregation
  }
</script>

<div class="d-flex justify-content-end">
  <IconButton
    id="show-all-report-status"
    class="bi bi-eye me-3"
    title={$i18n.t('command.report.showAll', { ns: 'page/index' })}
    clickable={true}
    onclick={showAll}
  />
  <IconButton
    id="reset-report-status"
    class="bi bi-arrow-counterclockwise me-3"
    title={$i18n.t('command.report.reset', { ns: 'page/index' })}
    clickable={true}
    onclick={onReset}
  />
  <IconButton
    id="save-report-status"
    class="bi bi-check-square-fill text-info me-3"
    title={$i18n.t('command.report.save', { ns: 'page/index' })}
    clickable={true}
    onclick={onSave}
  />
</div>
<hr />
{#each editingReportAggregation.allBlocks as block, i (block.id)}
  {#if i !== 0}
    <hr />
  {/if}
  <div>
    <div class="row mb-3">
      {#each block.allReports as report (report.key)}
        <div
          class="editable-report-item mb-3 col-6 col-sm-4 col-md-3"
          draggable="true"
        >
          <IconButton
            id={`toggle-visible-${report.key}`}
            class={`toggle-visible bi ${visibleStatus(report, $i18n).class}`}
            title={visibleStatus(report, $i18n).title}
            clickable={true}
            onclick={() => editReport(block.id, report.toggleShow())}
          />
          <ReportItem
            caption={$i18n.t(report.key, { ns: 'assembly' })}
            value={assembly[report.key]}
            status={report.statusFor(assembly)}
            diffEnabled={report.isDiffTarget()}
            diff={calculateReportDiff(
              assembly[report.key],
              report.isDiffTarget() ? previousAssembly?.[report.key] : null,
            )}
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
