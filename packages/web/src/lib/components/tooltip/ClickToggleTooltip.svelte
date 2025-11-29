<script lang="ts">
  // Clickで表示/非表示が切り替わるTooltip

  import { Tooltip } from '@sveltestrap/sveltestrap'
  import { onDestroy, type Snippet } from 'svelte'

  interface Props {
    target: HTMLElement | string
    /** tooltipの表示/非表示状態切り替え時間 */
    timeout?: number
    children?: Snippet
  }
  let { target, timeout = 3000, children }: Props = $props()

  /** Tooltipコンポーネント内部のON/OFF状態 */
  let tooltipState: boolean = $state(false)
  let tooltipTimer: ReturnType<typeof setTimeout> | undefined =
    $state(undefined)

  const targetEl: HTMLElement | null = $derived(
    typeof target === 'string' ? document.getElementById(target) : target,
  )

  // handler
  $effect(() => {
    targetEl?.addEventListener('click', handleClickTargetElement)

    return () => {
      targetEl?.removeEventListener('click', handleClickTargetElement)
      clearTimeout(tooltipTimer)
    }
  })

  function handleClickTargetElement() {
    tooltipState = true

    tooltipTimer = setTimeout(() => {
      tooltipState = false
    }, timeout)
  }
</script>

{#if targetEl !== null && tooltipState}
  <Tooltip target={targetEl} bind:isOpen={tooltipState}>
    {@render children?.()}
  </Tooltip>
{/if}
