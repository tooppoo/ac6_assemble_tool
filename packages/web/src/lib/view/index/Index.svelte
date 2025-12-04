<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'
  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import NavButton from '$lib/components/layout/navbar/NavButton.svelte'
  import Navbar from '$lib/components/layout/Navbar.svelte'
  import ToolSection from '$lib/components/layout/ToolSection.svelte'
  import ErrorModal from '$lib/components/modal/ErrorModal.svelte'
  import i18n from '$lib/i18n/define'
  import { useWithEnableState } from '$lib/ssg/safety-reference'

  import {
    type Assembly,
    assemblyKeys,
    spaceByWord,
  } from '@ac6_assemble_tool/core/assembly/assembly'
  import { changeAssemblyCommand } from '@ac6_assemble_tool/core/assembly/command/change-assembly'
  import { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
  import { assemblyToSearchV2 } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
  import {
    type Candidates,
    type OrderParts,
    type Order,
    defineOrder,
  } from '@ac6_assemble_tool/parts/types/candidates'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import { logger } from '@ac6_assemble_tool/shared/logger'

  import type {
    ChangePartsEvent,
    ToggleLockEvent,
  } from './form/PartsSelectForm.svelte'
  import PartsSelectForm from './form/PartsSelectForm.svelte'
  import { initializeAssembly } from './interaction/assembly'
  import {
    buildAssemblyFromQuery,
    mergeAssemblyParams,
  } from './interaction/assembly-from-query'
  import { bootstrap } from './interaction/bootstrap'
  import type { PartsPoolRestrictions } from './interaction/derive-parts-pool'
  import { assemblyErrorMessage } from './interaction/error-message'
  import RandomAssembleButton from './random/button/RandomAssembleButton.svelte'
  import RandomAssemblyOffCanvas, {
    type AssembleRandomly,
    type ErrorOnAssembly,
  } from './random/RandomAssemblyOffCanvas.svelte'
  import ReportList from './report/ReportList.svelte'
  import ShareAssembly from './share/ShareAssembly.svelte'
  import StoreAssembly from './store/StoreAssembly.svelte'

  import { afterNavigate, pushState } from '$app/navigation'
  import { page } from '$app/state'

  const tryLimit = 3000

  // state
  interface Props {
    regulation: Regulation
    partsPool: PartsPoolRestrictions
  }
  let { regulation, partsPool }: Props = $props()

  const orders: Order = regulation.orders
  const version: string = regulation.version

  let partsPoolState = $state<PartsPoolRestrictions>(partsPool)

  let initialCandidates = $derived<Candidates>(partsPoolState.candidates)
  let candidates = $derived<Candidates>(partsPoolState.candidates)
  let changeAssembly = $derived(changeAssemblyCommand(initialCandidates))
  let lockedParts = $state<LockedParts>(LockedParts.empty)
  let randomAssembly = $state(RandomAssembly.init({ limit: tryLimit }))

  let openRandomAssembly = $state(false)
  let openShare = $state(false)
  let openAssemblyStore = $state(false)
  let errorMessage = $state<string[]>([])

  let navToPartsList = $state(`/parts-list`)

  let queuedUrl: URL | null = null

  const orderParts: OrderParts = defineOrder(orders)

  // svelte-ignore state_referenced_locally
  let assembly = $state<Assembly>(initializeAssembly(candidates))
  const serializeAssembly = useWithEnableState(() => {
    serializeAssemblyAsQuery()
    navToPartsList = `/parts-list?${page.url.search}`
    if (queuedUrl) {
      pushState(queuedUrl, {})
      queuedUrl = null
    }
  })

  let shouldSerializeAssembly = true

  afterNavigate(({ type }) => {
    logger.debug('afterNavigate: type', { type })

    if (type === 'enter') {
      // initialization on first load
      const result = bootstrap(page.url, partsPool.candidates)

      partsPoolState = result.partsPool
      initialCandidates = result.partsPool.candidates
      candidates = result.partsPool.candidates
      assembly = result.assembly

      if (result.migratedUrl) {
        logger.debug('migrated url', { bootstrapResult: result })

        if (serializeAssembly.isEnabled()) {
          serializeAssembly.run()
        } else {
          queuedUrl = result.migratedUrl
        }
      }

      logger.debug('initialized')
      serializeAssembly.enable()
    }
  })

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    assembly // watch assembly changes

    if (shouldSerializeAssembly) {
      logger.debug('assembly changed, serialize to URL')
      serializeAssembly.run()
    } else {
      shouldSerializeAssembly = true
    }
  })

  // handler
  const onChangeParts = (event: ChangePartsEvent) => {
    const result = changeAssembly(
      event.id,
      event.selected,
      assembly,
      candidates,
    )

    assembly = result.assembly
    candidates = result.remainingCandidates
  }
  const onRandom = (event: AssembleRandomly) => {
    assembly = event.assembly
  }
  const errorOnRandom = (event: ErrorOnAssembly) => {
    errorMessage = assemblyErrorMessage(event.error, $i18n)
  }

  const onLock = (event: ToggleLockEvent) => {
    lockedParts = event.value
      ? lockedParts.lock(event.id, assembly[event.id])
      : lockedParts.unlock(event.id)

    candidates = {
      ...lockedParts.filter(initialCandidates),
    }
  }

  const onPopstate = () => {
    shouldSerializeAssembly = false

    // re-create from URL state on back/forward navigation
    logger.debug('on popstate', {
      search: page.url.search,
    })
    const result = buildAssemblyFromQuery(
      page.url.searchParams,
      partsPoolState.candidates,
    )

    assembly = result.assembly
  }

  function serializeAssemblyAsQuery() {
    const url = new URL(page.url)
    const assemblyQuery = assemblyToSearchV2(assembly)

    // 既存の非アセンブリパラメータ（lng等）を保持
    mergeAssemblyParams(url.searchParams, assemblyQuery)

    logger.debug('serializeAssemblyAsQuery', {
      url: url.toString(),
    })

    pushState(url, {})
  }
</script>

<svelte:window onpopstate={onPopstate} />

<Navbar>
  <NavButton
    id="random-assemble"
    class="me-3"
    title={$i18n.t('command.random.description', { ns: 'page/index' })}
    onclick={() => (openRandomAssembly = true)}
  >
    {#snippet icon()}
      <i class="bi bi-tools"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.random.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-parts-list"
    class="me-3"
    href={navToPartsList}
    title={$i18n.t('command.partsList.description', { ns: 'page/index' })}
  >
    {#snippet icon()}
      <i class="bi bi-funnel"></i>
    {/snippet}
    <span class="d-none d-md-inline">
      {$i18n.t('command.partsList.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="reset-lock-nav"
    class="me-3 d-none d-md-block"
    title={$i18n.t('command.resetLock.description', { ns: 'page/index' })}
    onclick={() => (lockedParts = LockedParts.empty)}
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
    onclick={() => (openShare = true)}
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
    class="me-3"
    title={$i18n.t('command.store.description', { ns: 'page/index' })}
    onclick={() => (openAssemblyStore = true)}
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
    <div class="d-flex d-md-none justify-content-end">
      <RandomAssembleButton
        id="random-assembly-button-form"
        {initialCandidates}
        {candidates}
        {lockedParts}
        {randomAssembly}
        tooltipText={$i18n.t('random:command.random.label')}
        aria-label={$i18n.t('random:command.random.label')}
        class="me-3"
        onclick={({ assembly: randomAssembly }) => (assembly = randomAssembly)}
      />
      <TextButton
        id="reset-lock-form"
        title={$i18n.t('command.resetLock.description', { ns: 'page/index' })}
        tooltipText={$i18n.t('command.resetLock.description', {
          ns: 'page/index',
        })}
        onclick={() => (lockedParts = LockedParts.empty)}
      >
        <i class="bi bi-unlock"></i>
      </TextButton>
    </div>
    <hr class="w-100 d-flex d-md-none" />
    {#each assemblyKeys() as key (key)}
      <PartsSelectForm
        id={key}
        class="mb-3 mb-sm-4"
        caption={spaceByWord(key).toUpperCase()}
        tag="section"
        parts={orderParts(key, candidates[key])}
        selected={assembly[key]}
        lock={lockedParts}
        onToggleLock={onLock}
        onchange={onChangeParts}
      />
    {/each}
  </ToolSection>

  <ToolSection id="assembly-report" class="container mw-100 mx-0 my-4 w-100">
    <ReportList {assembly} />
  </ToolSection>
</article>

<RandomAssemblyOffCanvas
  id="random-assembly-canvas"
  open={openRandomAssembly}
  {initialCandidates}
  {candidates}
  {lockedParts}
  {randomAssembly}
  {assembly}
  onToggle={(e) => (openRandomAssembly = e.open)}
  {onRandom}
  onError={errorOnRandom}
  onFilter={(event) => {
    randomAssembly = event.randomAssembly
  }}
  onLockLegs={onLock}
>
  {#snippet title()}
    {$i18n.t('command.random.label', { ns: 'page/index' })}
  {/snippet}
</RandomAssemblyOffCanvas>
<ShareAssembly
  id="share-assembly"
  open={openShare}
  assembly={() => assembly}
  onToggle={(e) => (openShare = e.open)}
>
  {#snippet title()}
    {$i18n.t('share:caption')}
  {/snippet}
</ShareAssembly>
<StoreAssembly
  id="store-assembly"
  open={openAssemblyStore}
  candidates={initialCandidates}
  {assembly}
  onToggle={(e) => (openAssemblyStore = e.open)}
  onApply={(aggregation) => (assembly = aggregation.assembly)}
/>

<ErrorModal
  id="index-error-modal"
  open={errorMessage.length !== 0}
  onClose={() => (errorMessage = [])}
>
  {#snippet title()}
    ERROR
  {/snippet}
  {#snippet button()}
    OK
  {/snippet}

  {#each errorMessage as row, i (i)}
    {row}<br />
  {/each}
</ErrorModal>

<style>
  article {
    max-width: 1000px;
  }
</style>
