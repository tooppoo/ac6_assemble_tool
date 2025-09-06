<script lang="ts">
  import Switch from '$lib/components/form/Switch.svelte'
  import ClickToggleTooltip from '$lib/components/tooltip/ClickToggleTooltip.svelte'
  import i18n from '$lib/i18n/define'
  import {
    stringifyAssembly,
    stringifyStatus,
  } from '$lib/view/index/interaction/share'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'

  export let id: string
  export let assembly: () => Assembly
  export let prefix: () => string

  let copyAsText: () => void = defaultCopyAsText
  let targetButton: HTMLButtonElement

  // handler
  function onCopy() {
    copyAsText()
  }

  // functions
  function copyAsTextWithStatus() {
    const text = `${stringifyAssembly(assembly())}
    
${stringifyStatus(assembly(), $i18n)}`

    navigator.clipboard.writeText(prefix() + text)
  }

  function defaultCopyAsText() {
    navigator.clipboard.writeText(prefix() + stringifyAssembly(assembly()))
  }
</script>

<div
  {id}
  class="d-flex justify-content-begin align-items-center {$$props.class}"
>
  <div class="share-label me-3">
    {$i18n.t('share:command.text.caption')}
    <Switch
      id={`${id}-share-by-text-switch`}
      on:enabled={() => (copyAsText = copyAsTextWithStatus)}
      on:disabled={() => (copyAsText = defaultCopyAsText)}
    >
      {$i18n.t('share:command.text.withStatus')}
    </Switch>
  </div>
  <div class="share-button">
    <button
      id="{id}-share-assembly-as-text"
      class="btn btn-dark border-secondary"
      bind:this={targetButton}
      on:click={onCopy}
    >
      <i class="bi bi-clipboard"></i>
    </button>
    <ClickToggleTooltip target={targetButton}>copied!</ClickToggleTooltip>
  </div>
</div>
