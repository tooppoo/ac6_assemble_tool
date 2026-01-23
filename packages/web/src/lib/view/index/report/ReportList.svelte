<script lang="ts">
  import { defaultReportAggregation } from '$lib/view/index/report/model/report'
  import ReportListEditor, {
    type SaveAggregation,
  } from '$lib/view/index/report/ReportListEditor.svelte'
  import ReportListViewer from '$lib/view/index/report/ReportListViewer.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'

  type Props = {
    assembly: Assembly
    previousAssembly?: Assembly | null
  }

  let { assembly, previousAssembly = null }: Props = $props()

  let reportAggregation = $state(defaultReportAggregation())
  let editing = $state(false)

  // handler
  function startEdit() {
    editing = true
  }
  function onSave(detail: SaveAggregation) {
    reportAggregation = detail.target
    editing = false
  }
</script>

{#if editing}
  <ReportListEditor {assembly} {previousAssembly} {reportAggregation} {onSave} />
{:else}
  <ReportListViewer
    {assembly}
    {previousAssembly}
    {reportAggregation}
    onEdit={startEdit}
  />
{/if}
