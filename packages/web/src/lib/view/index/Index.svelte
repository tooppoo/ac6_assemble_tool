<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'
  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import CollapseText from '$lib/components/layout/CollapseText.svelte'
  import NavButton from '$lib/components/layout/navbar/NavButton.svelte'
  import Navbar from '$lib/components/layout/Navbar.svelte'
  import ToolSection from '$lib/components/layout/ToolSection.svelte'
  import ErrorModal from '$lib/components/modal/ErrorModal.svelte'
  import i18n from '$lib/i18n/define'
  import { useWithEnableState } from '$lib/ssg/safety-reference'
  import { syncLanguageFromQuery } from '$lib/store/language/language-store.svelte'
  import {
    buildQueryFromAssembly,
    storeAssemblyAsQuery,
  } from '$lib/store/query/query-store'

  import {
    type Assembly,
    assemblyKeys,
    spaceByWord,
  } from '@ac6_assemble_tool/core/assembly/assembly'
  import { deriveAvailableCandidates } from '@ac6_assemble_tool/core/assembly/availability/derive-candidates'
  import { changeAssemblyCommand } from '@ac6_assemble_tool/core/assembly/command/change-assembly'
  import { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
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
  import { buildAssemblyFromQuery } from './interaction/assembly-from-query'
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
  import { closeOffcanvas, openAssemblyStore, openRandomAssembly, openShare, type OffcanvasStatus } from './interaction/offcanvas'

  const tryLimit = 3000

  // state
  interface Props {
    regulation: Regulation
    partsPool: PartsPoolRestrictions
  }
  let { regulation, partsPool }: Props = $props()

  const orders: Order = $derived(regulation.orders)
  const version: string = $derived(regulation.version)

  let partsPoolState = $derived(partsPool)

  let initialCandidates = $derived<Candidates>(partsPoolState.candidates)
  let candidates = $derived<Candidates>(partsPoolState.candidates)
  let changeAssembly = $derived(changeAssemblyCommand(initialCandidates))
  let lockedParts = $state<LockedParts>(LockedParts.empty)
  let randomAssembly = $state(RandomAssembly.init({ limit: tryLimit }))

  let offcanvasStatus: OffcanvasStatus = $state(closeOffcanvas())
  let errorMessage = $state<string[]>([])

  let assembly = $state<Assembly>(initializeAssembly(candidates))
  // アセンブリと現在のURLクエリ（言語設定など）をマージしてパーツ一覧へのリンクを生成
  let navToPartsList = $derived(
    `/parts-list?${buildQueryFromAssembly(assembly).toString()}`,
  )

  let queuedUrl: URL | null = null

  const orderParts: OrderParts = $derived(defineOrder(orders))

  const serializeAssembly = useWithEnableState(() => {
    logger.debug('serialize assembly')

    storeAssemblyAsQuery(assembly)

    if (queuedUrl) {
      pushState(queuedUrl, {})
      queuedUrl = null
    }
  })

  afterNavigate(({ type }) => {
    logger.debug('afterNavigate: type', { type })

    serializeAssembly.enable()

    // popstateは別途onPopstateハンドラで処理されるため、ここでは扱わない
    if (type === 'enter' || type === 'link' || type === 'goto') {
      // initialization on first load or navigation from other pages
      const result = bootstrap(page.url, partsPool.candidates)

      partsPoolState = result.partsPool
      initialCandidates = result.partsPool.candidates
      assembly = result.assembly
      candidates = deriveAvailableCandidates({
        assembly,
        lockedParts,
        initialCandidates,
      })

      if (result.migratedUrl) {
        logger.debug('migrated url', { bootstrapResult: result })

        if (serializeAssembly.isEnabled()) {
          serializeAssembly.run()
        } else {
          queuedUrl = result.migratedUrl
        }
      }
    }
  })

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    assembly // watch assembly changes

    logger.debug('assembly changed')
    serializeAssembly.run()
  })

  // handler
  const onChangeParts = (event: ChangePartsEvent) => {
    logger.debug('on change parts', { event })

    const { assembly: nextAssembly, remainingCandidates } = changeAssembly(
      event.id,
      event.selected,
      assembly,
      candidates,
    )

    assembly = nextAssembly
    candidates = deriveAvailableCandidates({
      assembly,
      lockedParts,
      initialCandidates: remainingCandidates,
    })
  }
  const onRandom = (event: AssembleRandomly) => {
    logger.debug('on random', { event })

    assembly = event.assembly
    candidates = deriveAvailableCandidates({
      assembly,
      lockedParts,
      initialCandidates,
    })
  }
  const errorOnRandom = (event: ErrorOnAssembly) => {
    logger.debug('error on random', { event })

    errorMessage = assemblyErrorMessage(event.error, $i18n)
  }

  const onLock = (event: ToggleLockEvent) => {
    logger.debug('on lock', { event })

    lockedParts = event.value
      ? lockedParts.lock(event.id, assembly[event.id])
      : lockedParts.unlock(event.id)

    candidates = deriveAvailableCandidates({
      assembly,
      lockedParts,
      initialCandidates,
    })
  }

  const onPopstate = () => {
    // re-create from URL state on back/forward navigation
    logger.debug('on popstate', {
      search: page.url.search,
    })

    // 言語設定を同期
    syncLanguageFromQuery(page.url)

    // アセンブリを再構築
    const result = buildAssemblyFromQuery(
      page.url.searchParams,
      partsPoolState.candidates,
    )

    assembly = result.assembly
    candidates = deriveAvailableCandidates({
      assembly,
      lockedParts,
      initialCandidates,
    })
  }
</script>

<svelte:window onpopstate={onPopstate} />

<Navbar>
  <NavButton
    id="random-assemble"
    class="me-3"
    title={$i18n.t('command.random.description', { ns: 'page/index' })}
    onclick={() => (offcanvasStatus = openRandomAssembly())}
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
    onclick={() => (offcanvasStatus = openShare())}
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
    onclick={() => (offcanvasStatus = openAssemblyStore())}
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
  open={offcanvasStatus.openRandomAssembly}
  {initialCandidates}
  {candidates}
  {lockedParts}
  {randomAssembly}
  {assembly}
  onToggle={(e) => (offcanvasStatus = e.open ? openRandomAssembly() : closeOffcanvas())}
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
  open={offcanvasStatus.openShare}
  assembly={() => assembly}
  onToggle={(e) => (offcanvasStatus = e.open ? openShare() : closeOffcanvas())}
>
  {#snippet title()}
    {$i18n.t('share:caption')}
  {/snippet}
</ShareAssembly>
<StoreAssembly
  id="store-assembly"
  open={offcanvasStatus.openAssemblyStore}
  candidates={initialCandidates}
  {assembly}
  onToggle={(e) => (offcanvasStatus = e.open ? openAssemblyStore() : closeOffcanvas())}
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
