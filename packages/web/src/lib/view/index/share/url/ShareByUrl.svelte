<script lang="ts">
  import ClickToggleTooltip from '$lib/components/tooltip/ClickToggleTooltip.svelte'
  import i18n from '$lib/i18n/define'

  export let id: string

  let targetButton: HTMLElement

  function onClick() {
    navigator.clipboard.writeText(location.href)
  }
</script>

<div
  {id}
  class="d-flex justify-content-begin align-items-center {$$props.class}"
>
  <div class="share-label me-3">
    {$i18n.t('share:command.url.caption')}
  </div>
  <div class="share-button">
    <button
      id="{id}-share-assembly-as-link"
      class="btn btn-dark border-secondary"
      aria-label={$i18n.t('share:command.url.ariaLabel')}
      bind:this={targetButton}
      on:click={onClick}
    >
      <i class="bi bi-link"></i>
    </button>
    <ClickToggleTooltip target={targetButton}>copied!</ClickToggleTooltip>
  </div>
</div>
