<script lang="ts">
  import Switch from '$lib/components/form/Switch.svelte'
  import OffCanvas, { type ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'
  import Margin from '$lib/components/spacing/Margin.svelte'
  import i18n from '$lib/i18n/define'
  import RandomAssembleButton, { type ClickEvent } from '$lib/view/index/random/button/RandomAssembleButton.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import type { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import type { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
  import {
    disallowArmsLoadOver,
    disallowLoadOver,
    totalCoamNotOverMax,
    totalLoadNotOverMax,
  } from '@ac6_assemble_tool/core/assembly/random/validator/validators'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { logger } from '@ac6_assemble_tool/shared/logger'

  import CoamRangeSlider from './range/CoamRangeSlider.svelte'
  import LoadRangeSlider, {
    type ToggleLock,
  } from './range/LoadRangeSlider.svelte'
  import type { Snippet } from 'svelte'

  export type AssembleRandomly = Readonly<{
    assembly: Assembly
  }>
  export type ErrorOnAssembly = Readonly<{
    error: Error
  }>
  export type ApplyRandomFilter = Readonly<{
    randomAssembly: RandomAssembly
  }>

  interface Props {
    id: string
    open: boolean
    lockedParts: LockedParts
    initialCandidates: Candidates
    candidates: Candidates
    randomAssembly: RandomAssembly
    assembly: Assembly
    onRandom?: (event: AssembleRandomly) => void
    onFilter?: (event: ApplyRandomFilter) => void
    onToggle?: (event: ToggleOffCanvas) => void
    onLockLegs?: (event: ToggleLock) => void
    onError?: (event: ErrorOnAssembly) => void
    title?: Snippet
  }
  let {
    id,
    open,
    lockedParts,
    initialCandidates,
    candidates,
    randomAssembly,
    assembly,
    onRandom: handleRandom,
    onFilter,
    onToggle,
    onLockLegs,
    onError,
    title: titleSnippet,
  }: Props = $props()

  // handler
  const onRandom = ({ assembly }: ClickEvent) => {
    handleRandom?.({ assembly })
  }
  const onApply = (param: ApplyRandomFilter) => {
    onFilter?.(param)

    logger.debug('onApply:RandomAssemblyOffCanvas', { param })
  }
</script>

<OffCanvas
  id={id}
  {open}
  onToggle={(e) => onToggle?.(e)}
>
  {#snippet title()}
    {@render titleSnippet?.()}
  {/snippet}
  {#snippet body()}
    <div
      id="random-assembly"
      class="d-none d-md-flex justify-content-bgein align-items-center mb-3"
    >
      <RandomAssembleButton
        id="random-assembly-button-offcanvas"
        {initialCandidates}
        {candidates}
        {lockedParts}
        {randomAssembly}
        class="w-100"
        onclick={onRandom}
        onerror={(e) => onError?.(e)}
      >
        {$i18n.t('random:command.random.label')}
      </RandomAssembleButton>
    </div>

    <hr class="w-100 my-4 d-none d-md-block" />

    <div id="disallow-over-load">
      <Switch
        id={`${id}-disallow-over-load`}
        onEnabled={() =>
          onApply({
            randomAssembly: randomAssembly.addValidator(
              'disallow-over-load',
              disallowLoadOver(),
            ),
          })}
        onDisabled={() =>
          onApply({
            randomAssembly:
              randomAssembly.removeValidator('disallow-over-load'),
          })}
      >
        {$i18n.t('random:command.disallow_over_load.label')}
      </Switch>
    </div>
    <Margin space={3} />
    <div id="disallow-arms-over-load">
      <Switch
        id={`${id}-disallow-arms-over-load`}
        onEnabled={() =>
          onApply({
            randomAssembly: randomAssembly.addValidator(
              'disallow-arms-over-load',
              disallowArmsLoadOver(),
            ),
          })}
        onDisabled={() =>
          onApply({
            randomAssembly: randomAssembly.removeValidator(
              'disallow-arms-over-load',
            ),
          })}
      >
        {$i18n.t('random:command.disallow_arms_over_load.label')}
      </Switch>
    </div>
    <Margin space={3} />
    <CoamRangeSlider
      class="my-3 w-100"
      {candidates}
      on:change={(ev) =>
        onApply({
          randomAssembly: randomAssembly.addValidator(
            'total-coam-limit',
            totalCoamNotOverMax(ev.detail.value),
          ),
        })}
    />
    <Margin space={3} />
    <LoadRangeSlider
      class="my-3 w-100"
      {candidates}
      {assembly}
      lock={lockedParts}
      on:change={(ev) =>
        onApply({
          randomAssembly: randomAssembly.addValidator(
            'total-load-limit',
            totalLoadNotOverMax(ev.detail.value),
          ),
        })}
      on:toggle-lock={(ev) => onLockLegs?.(ev.detail)}
    />
  {/snippet}
</OffCanvas>
