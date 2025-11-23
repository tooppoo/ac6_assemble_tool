<script lang="ts">
  import type { ReportStatus } from '$lib/view/index/report/model/report'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    status?: ReportStatus
    caption: string
    value: number
    class?: string
  } & Omit<HTMLAttributes<HTMLElement>, 'class'>

  let {
    status = 'normal',
    caption,
    value,
    class: className = '',
  }: Props = $props()

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
  const displayValue = $derived(parseFloat(value.toFixed(2)))
</script>

<div class={className}>
  <div class={captionClass}>{caption}</div>
  <div class={valueClass}>
    {displayValue}
  </div>
</div>
