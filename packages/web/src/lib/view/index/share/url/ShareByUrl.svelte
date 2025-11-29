<script lang="ts">
  import ClickToggleTooltip from '$lib/components/tooltip/ClickToggleTooltip.svelte'
  import i18n from '$lib/i18n/define'

  import type { HTMLAttributes } from 'svelte/elements'

  type Props = {
    id: string
    class?: string
  } & Omit<HTMLAttributes<HTMLElement>, 'class' | 'id'>

  let { id, class: className = '' }: Props = $props()

  let targetButton: HTMLButtonElement | undefined = $state(undefined)

  function onClick() {
    navigator.clipboard.writeText(location.href)
  }
</script>

<div
  {id}
  class={`d-flex justify-content-begin align-items-center ${className}`.trim()}
>
  <div class="share-label me-3">
    {$i18n.t('share:command.url.caption')}
  </div>
  <div class="share-button">
    <button
      id={`${id}-share-assembly-as-link`}
      class="btn btn-dark border-secondary"
      aria-label={$i18n.t('share:command.url.ariaLabel')}
      bind:this={targetButton}
      onclick={onClick}
    >
      <i class="bi bi-link"></i>
    </button>
    <ClickToggleTooltip target={targetButton}>copied!</ClickToggleTooltip>
  </div>
</div>
