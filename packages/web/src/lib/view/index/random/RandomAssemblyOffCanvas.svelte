<script lang="ts" context="module">
  import type { ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'

  export type AssembleRandomly = Readonly<{
    assembly: Assembly
  }>
  export type ErrorOnAssembly = Readonly<{
    error: Error
  }>
  export type ApplyRandomFilter = Readonly<{
    randomAssembly: RandomAssembly
  }>
</script>

<script lang="ts">
  import Switch from '$lib/components/form/Switch.svelte'
  import OffCanvas from '$lib/components/off-canvas/OffCanvas.svelte'
  import Margin from '$lib/components/spacing/Margin.svelte'
  import i18n from '$lib/i18n/define'
  import { logger } from '@ac6_assemble_tool/shared/logger'
  import RandomAssembleButton from '$lib/view/index/random/button/RandomAssembleButton.svelte'

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
  import { createEventDispatcher } from 'svelte'

  import CoamRangeSlider from './range/CoamRangeSlider.svelte'
  import LoadRangeSlider, {
    type ToggleLock,
  } from './range/LoadRangeSlider.svelte'

  export let open: boolean
  export let lockedParts: LockedParts
  export let initialCandidates: Candidates
  export let candidates: Candidates
  export let randomAssembly: RandomAssembly
  export let assembly: Assembly

  // handler
  const onRandom = ({ detail: assembly }: CustomEvent<Assembly>) => {
    dispatch('random', { assembly })
  }
  const onApply = (param: ApplyRandomFilter) => {
    dispatch('filter', param)

    logger.debug({ param })
  }

  // setup
  const dispatch = createEventDispatcher<{
    toggle: ToggleOffCanvas
    random: AssembleRandomly
    error: ErrorOnAssembly
    filter: ApplyRandomFilter
    'lock-legs': ToggleLock
  }>()
</script>

<OffCanvas
  id={$$props.id || ''}
  {open}
  on:toggle={(e) => dispatch('toggle', e.detail)}
>
  <svelte:fragment slot="title">
    <slot name="title" />
  </svelte:fragment>
  <svelte:fragment slot="body">
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
        on:click={onRandom}
      >
        {$i18n.t('random:command.random.label')}
      </RandomAssembleButton>
    </div>

    <hr class="w-100 my-4 d-none d-md-block" />

    <div id="disallow-over-load">
      <Switch
        id={`${$$props.id}-disallow-over-load`}
        on:enabled={() =>
          onApply({
            randomAssembly: randomAssembly.addValidator(
              'disallow-over-load',
              disallowLoadOver(),
            ),
          })}
        on:disabled={() =>
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
        id={`${$$props.id}-disallow-arms-over-load`}
        on:enabled={() =>
          onApply({
            randomAssembly: randomAssembly.addValidator(
              'disallow-arms-over-load',
              disallowArmsLoadOver(),
            ),
          })}
        on:disabled={() =>
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
      on:toggle-lock={(ev) => dispatch('lock-legs', ev.detail)}
    />
  </svelte:fragment>
</OffCanvas>
