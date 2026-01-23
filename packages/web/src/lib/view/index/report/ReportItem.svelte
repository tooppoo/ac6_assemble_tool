<script lang="ts">
  import type { ReportStatus } from '$lib/view/index/report/model/report'
  import type { ReportDiff } from '$lib/view/index/report/diff/report-diff'

  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    status?: ReportStatus
    caption: string
    value: number
    class?: string
    diff?: ReportDiff | null
  } & Omit<HTMLAttributes<HTMLElement>, 'class'>

  let {
    status = 'normal',
    caption,
    value,
    class: className = '',
    diff = null,
  }: Props = $props()

  const formatValue = (target: number) => parseFloat(target.toFixed(2))

  const textClass = (base: string, stat: ReportStatus) => {
    switch (stat) {
      case 'danger':
        return `${base} text-danger`
      case 'warning':
        return `${base} text-warning`
      case 'normal':
        return base
    }
  }

  const captionClass = $derived(textClass('fs-4', status))
  const valueClass = $derived(textClass('fs-5', status))
  const displayValue = $derived(formatValue(value))
  const showDiff = $derived(diff !== null)
  const diffClass = $derived(
    diff?.direction === 'up' ? 'text-success' : 'text-danger',
  )
  const diffSymbol = $derived(diff?.direction === 'up' ? '↑' : '↓')
  const diffValue = $derived(diff ? formatValue(diff.value) : null)
</script>

<div class={className}>
  <div class={captionClass}>{caption}</div>
  <div class={valueClass}>
    {displayValue}
    {#if showDiff}
      <div class={`small ${diffClass}`}>
        ({diffSymbol}{diffValue})
      </div >
    {/if}
  </div>
</div>
