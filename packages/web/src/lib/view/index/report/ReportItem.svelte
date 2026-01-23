<script lang="ts">

  import type { HTMLAttributes } from 'svelte/elements'
  import type { ReportDiff } from './model/report'

  type Props = {
    caption: string
    value: number
    diff: ReportDiff | null
    class?: string
  } & Omit<HTMLAttributes<HTMLElement>, 'class'>

  let { caption, value, class: className = '', diff = null }: Props = $props()

  const formatValue = (target: number) => parseFloat(target.toFixed(2))

  const textClass = (base: string) => {
    return base
  }

  const captionClass = $derived(textClass('fs-4'))
  const valueClass = $derived(textClass('fs-5'))
  const displayValue = $derived(formatValue(value))
  const showDiff = $derived(diff !== null)
  const diffClass = $derived.by(() => {
    if (!diff) return ''

    return diff.positive ? 'text-success' : 'text-danger'
  })
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
      </div>
    {/if}
  </div>
</div>
