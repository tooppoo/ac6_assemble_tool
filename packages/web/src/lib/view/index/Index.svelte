<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'
  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import CollapseText from '$lib/components/layout/CollapseText.svelte'
  import NavButton from '$lib/components/layout/navbar/NavButton.svelte'
  import Navbar from '$lib/components/layout/Navbar.svelte'
  import ToolSection from '$lib/components/layout/ToolSection.svelte'
  import ErrorModal from '$lib/components/modal/ErrorModal.svelte'
  import i18n from '$lib/i18n/define'
  import { buildQueryFromAssembly } from '$lib/store/query/query-store'

  import {
    assemblyKeys,
    spaceByWord,
  } from '@ac6_assemble_tool/core/assembly/assembly'
  import {
    type OrderParts,
    type Order,
    defineOrder,
  } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { logger } from '@ac6_assemble_tool/shared/logger'

  import { applyI18nEffect } from './adapters/index-i18n'
  import { createNavigationRunner } from './adapters/index-navigation'
  import {
    indexController as defaultIndexController,
    type ControllerResult,
  } from './controller/index-controller'
  import type { IndexEffect } from './controller/index-effects'
  import type { IndexState } from './controller/index-state'
  import PartsSelectForm from './form/PartsSelectForm.svelte'
  import RandomAssembleButton from './random/button/RandomAssembleButton.svelte'
  import RandomAssemblyOffCanvas from './random/RandomAssemblyOffCanvas.svelte'
  import ReportList from './report/ReportList.svelte'
  import ShareAssembly from './share/ShareAssembly.svelte'
  import StoreAssembly from './store/StoreAssembly.svelte'
  import type {
    ApplyRandomFilter,
    AssembleRandomly,
    ChangePartsEvent,
    ErrorOnAssembly,
    ToggleLockEvent,
  } from './types/index-events'
  import type { PartsPoolRestrictions } from './usecase/derive-parts-pool'

  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import { objectsIsSameValue } from '$lib/utils/compare'

  const tryLimit = 3000

  // state
  interface Props {
    regulation: Regulation
    partsPool: PartsPoolRestrictions
    indexController?: typeof defaultIndexController
  }
  let {
    regulation,
    partsPool,
    indexController = defaultIndexController,
  }: Props = $props()

  const orders: Order = $derived(regulation.orders)
  const version: string = $derived(regulation.version)

  let indexState: IndexState = $state(
    indexController.init({ partsPool, tryLimit }).state,
  )

  const orderParts: OrderParts = $derived(defineOrder(orders))

  const navigationRunner = createNavigationRunner()
  const runEffects = (effects: IndexEffect[]) => {
    for (const effect of effects) {
      if (navigationRunner.apply(effect)) continue
      if (applyI18nEffect(effect)) continue
    }
  }
  const commit = (result: ControllerResult) => {
    if (!objectsIsSameValue(result.state, indexState)){
      indexState = result.state
    }
    runEffects(result.effects)
  }
  const commitAndSync = (result: ControllerResult) => {
    commit(result)
    commit(indexController.onAssemblyChanged(result.state))
  }

  afterNavigate(({ type }) => {
    logger.debug('afterNavigate: type', { type })
    navigationRunner.enable()
    const result = indexController.onAfterNavigate(indexState, {
      url: page.url,
      type,
      baseCandidates: partsPool.candidates,
    })
    commit(result)
    if (type === 'enter' || type === 'link' || type === 'goto') {
      const hasSerialize = result.effects.some(
        (effect) => effect.type === 'serializeAssembly',
      )
      if (!hasSerialize) {
        commit(indexController.onAssemblyChanged(result.state))
      }
    }
  })

  // handler
  const onChangeParts = (event: ChangePartsEvent) => {
    logger.debug('on change parts', { event })
    commitAndSync(indexController.onChangeParts(indexState, event))
  }
  const onRandom = (event: AssembleRandomly) => {
    logger.debug('on random', { event })
    commitAndSync(indexController.onRandom(indexState, event))
  }
  const errorOnRandom = (event: ErrorOnAssembly) => {
    logger.debug('error on random', { event })
    commit(indexController.onError(indexState, event, $i18n))
  }

  const onLock = (event: ToggleLockEvent) => {
    logger.debug('on lock', { event })
    commit(indexController.onToggleLock(indexState, event))
  }

  const onPopstate = () => {
    // re-create from URL state on back/forward navigation
    logger.debug('on popstate', {
      search: page.url.search,
    })
    commit(indexController.onPopState(indexState, page.url))
  }
</script>

<svelte:window onpopstate={onPopstate} />

<Navbar>
  <RandomAssembleButton
    id="random-assembly-button-form"
    initialCandidates={indexState.initialCandidates}
    candidates={indexState.candidates}
    lockedParts={indexState.lockedParts}
    randomAssembly={indexState.randomAssembly}
    tooltipText={$i18n.t('random:command.random.label')}
    aria-label={$i18n.t('random:command.random.label')}
    class="me-3"
    onclick={(event) => onRandom(event)}
  />
  <NavButton
    id="reset-lock-form"
    class="me-3"
    title={$i18n.t('command.resetLock.description', { ns: 'page/index' })}
    onclick={() => commit(indexController.onResetLocks(indexState))}
  >
    {#snippet icon()}
      <i class="bi bi-unlock"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.resetLock.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="random-assemble"
    class="me-3"
    title={$i18n.t('command.random.description', { ns: 'page/index' })}
    onclick={() => commit(indexController.onOpenRandomPanel(indexState))}
  >
    {#snippet icon()}
      <i class="bi bi-tools"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.random.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="reset-lock-nav"
    class="me-3 d-none d-md-block"
    title={$i18n.t('command.resetLock.description', { ns: 'page/index' })}
    onclick={() => commit(indexController.onResetLocks(indexState))}
  >
    {#snippet icon()}
      <i class="bi bi-unlock"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.resetLock.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-share"
    class="me-3"
    title={$i18n.t('command.share.description', { ns: 'page/index' })}
    onclick={() => commit(indexController.onOpenSharePanel(indexState))}
  >
    {#snippet icon()}
      <i class="bi bi-share"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.share.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-assembly-store"
    title={$i18n.t('command.store.description', { ns: 'page/index' })}
    onclick={() => commit(indexController.onOpenStorePanel(indexState))}
  >
    {#snippet icon()}
      <i class="bi bi-database"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.store.label', { ns: 'page/index' })}
    </span>
  </NavButton>
</Navbar>

<header class="text-center mt-5">
  <h1>
    ARMORED CORE Ⅵ<br class="d-block d-md-none" />
    ASSEMBLY TOOL
  </h1>
  <h2>
    for Regulation {version}
  </h2>
  <div>
    <LanguageForm />
  </div>
</header>

<article class="container text-center px-3">
  <ToolSection id="candidates-form" class="my-4 w-100">
    {#each assemblyKeys() as key (key)}
      <PartsSelectForm
        id={key}
        class="mb-3 mb-sm-4"
        caption={spaceByWord(key).toUpperCase()}
        tag="section"
        parts={orderParts(key, indexState.candidates[key])}
        selected={indexState.assembly[key]}
        lock={indexState.lockedParts}
        onToggleLock={onLock}
        onchange={onChangeParts}
      />
    {/each}
  </ToolSection>

  <ToolSection id="assembly-report" class="container mw-100 mx-0 my-4 w-100">
    <ReportList
      assembly={indexState.assembly}
      previousAssembly={indexState.previousAssembly}
    />
  </ToolSection>

  <CollapseText
    summary={$i18n.t('page/index:aboutSection.summary')}
    class="my-4 text-start"
  >
    <p>{$i18n.t('page/index:aboutSection.body.p1')}</p>
    <p>{$i18n.t('page/index:aboutSection.body.p2')}</p>
    <p>{$i18n.t('page/index:aboutSection.body.p3')}</p>
  </CollapseText>
</article>

<RandomAssemblyOffCanvas
  id="random-assembly-canvas"
  open={indexState.offcanvasStatus.openRandomAssembly}
  initialCandidates={indexState.initialCandidates}
  candidates={indexState.candidates}
  lockedParts={indexState.lockedParts}
  randomAssembly={indexState.randomAssembly}
  assembly={indexState.assembly}
  onToggle={(e) =>
    commit(indexController.onToggleRandomPanel(indexState, e.open))}
  {onRandom}
  onError={errorOnRandom}
  onFilter={(event: ApplyRandomFilter) =>
    commit(indexController.onFilterRandom(indexState, event))}
  onLockLegs={onLock}
>
  {#snippet title()}
    {$i18n.t('command.random.label', { ns: 'page/index' })}
  {/snippet}
</RandomAssemblyOffCanvas>
<ShareAssembly
  id="share-assembly"
  open={indexState.offcanvasStatus.openShare}
  assembly={() => indexState.assembly}
  onToggle={(e) =>
    commit(indexController.onToggleSharePanel(indexState, e.open))}
>
  {#snippet title()}
    {$i18n.t('share:caption')}
  {/snippet}
</ShareAssembly>
<StoreAssembly
  id="store-assembly"
  open={indexState.offcanvasStatus.openAssemblyStore}
  candidates={indexState.initialCandidates}
  assembly={indexState.assembly}
  onToggle={(e) =>
    commit(indexController.onToggleStorePanel(indexState, e.open))}
  onApply={(aggregation) =>
    commitAndSync(
      indexController.onApplyStoredAssembly(indexState, aggregation.assembly),
    )}
/>

<ErrorModal
  id="index-error-modal"
  open={indexState.errorMessages.length !== 0}
  onClose={() => commit(indexController.onCloseError(indexState))}
>
  {#snippet title()}
    ERROR
  {/snippet}
  {#snippet button()}
    OK
  {/snippet}

  {#each indexState.errorMessages as row, i (i)}
    {row}<br />
  {/each}
</ErrorModal>

<style>
  article {
    max-width: 1000px;
  }
</style>
