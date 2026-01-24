<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'
  import i18n from '$lib/i18n/define'
  import type { ReadonlyReportAggregation } from '$lib/view/index/report/model/report'
  import ReportItem from '$lib/view/index/report/ReportItem.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { EmptyObject } from '@ac6_assemble_tool/core/utils/type'

  type Props = {
    assembly: Assembly
    previousAssembly?: Assembly | null
    reportAggregation: ReadonlyReportAggregation
    onEdit?: (payload: EmptyObject) => void
  }

  let {
    assembly,
    previousAssembly = null,
    reportAggregation,
    onEdit: onEditProp,
  }: Props = $props()

  function onEdit() {
    onEditProp?.({})
  }
</script>

<div class="d-flex justify-content-end">
  <IconButton
    id="edit-report"
    class="bi bi-pencil-square fs-2 me-3"
    title={$i18n.t('command.report.edit', { ns: 'page/index' })}
    clickable={true}
    onclick={onEdit}
  />
</div>
<hr />
{#each reportAggregation.blocks as block, i (block.id)}
  {#if i !== 0}
    <hr />
  {/if}
  <div>
    <div class="row mb-3">
      {#if block.containProblemFor(assembly)}
        <div class="alert alert-warning w-75 mx-auto mb-2" role="alert">
          {$i18n.t(`page/index:report.block.${block.problemCaptionKey}`)}
        </div>
      {/if}
      {#each block.reports as report (report.key)}
        <ReportItem
          caption={$i18n.t(report.key, { ns: 'assembly' })}
          class="mb-3 col-6 col-sm-4 col-md-3"
          value={assembly[report.key]}
          diff={report.diff(
            assembly[report.key],
            previousAssembly?.[report.key] ?? null,
          )}
        />
      {/each}
    </div>
  </div>
{/each}
