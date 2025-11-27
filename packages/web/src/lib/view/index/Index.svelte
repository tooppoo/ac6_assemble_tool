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
  import { onMount } from 'svelte'

  import type {
    ChangePartsEvent,
    ToggleLockEvent,
  } from './form/PartsSelectForm.svelte'
  import PartsSelectForm from './form/PartsSelectForm.svelte'
  import {
    buildAssemblyFromQuery,
    mergeAssemblyParams,
  } from './interaction/assembly-from-query'
  import {
    derivePartsPool,
    type PartsPoolRestrictions,
  } from './interaction/derive-parts-pool'
  import { assemblyErrorMessage } from './interaction/error-message'
  import { initializeAssembly } from './interaction/initialize'
  import RandomAssembleButton from './random/button/RandomAssembleButton.svelte'
  import RandomAssemblyOffCanvas, {
    type AssembleRandomly,
    type ErrorOnAssembly,
  } from './random/RandomAssemblyOffCanvas.svelte'
  import ReportList from './report/ReportList.svelte'
  import ShareAssembly from './share/ShareAssembly.svelte'
  import StoreAssembly from './store/StoreAssembly.svelte'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'

  const tryLimit = 3000

  // state
  export let regulation: Regulation
  export let partsPool: PartsPoolRestrictions

  const orders: Order = regulation.orders
  const version: string = regulation.version

  let partsPoolState: PartsPoolRestrictions = partsPool

  let initialCandidates: Candidates = partsPoolState.candidates
  let candidates: Candidates = partsPoolState.candidates
  // changeAssemblyはinitialCandidatesの変更に追従するようリアクティブに定義
  $: changeAssembly = changeAssemblyCommand(initialCandidates)
  let lockedParts: LockedParts = LockedParts.empty
  let randomAssembly = RandomAssembly.init({ limit: tryLimit })

  let openRandomAssembly: boolean = false
  let openShare: boolean = false
  let openAssemblyStore: boolean = false
  let errorMessage: string[] = []

  let orderParts: OrderParts = defineOrder(orders)

  let assembly: Assembly = initializeAssembly(candidates)
  let serializeAssembly = useWithEnableState(() => {
    serializeAssemblyAsQuery()
  })

  onMount(() => {
    const search = page.url.search
    const derivedPool = derivePartsPool(search, partsPool.candidates)
    applyPartsPoolState(derivedPool)

    const { assembly: builtAssembly, migratedParams } = buildAssemblyFromQuery(
      new URLSearchParams(search),
      derivedPool.candidates,
    )
    assembly = builtAssembly

    if (migratedParams) {
      const url = new URL(window.location.href)
      mergeAssemblyParams(url.searchParams, migratedParams)
      void goto(url, {
        replaceState: true,
        keepFocus: true,
        noScroll: true,
        invalidateAll: true,
        state: {
          initialized: true,
        },
      })
    }

    logger.debug('initialized', assembly)
    serializeAssembly.enable()
  })

  $: if (initialCandidates) {
    logger.debug('update candidates', { lockedParts })

    updateCandidates()
  }
  $: {
    if (assembly && initialCandidates) {
      if (serializeAssembly.isEnabled()) {
        logger.debug('replace state', {
          query: assemblyToSearchV2(assembly).toString(),
        })

        serializeAssembly.run()
      }
    }
  }

  // handler
  function applyPartsPoolState(pool: PartsPoolRestrictions) {
    partsPoolState = pool
    initialCandidates = pool.candidates
    candidates = pool.candidates
    lockedParts = LockedParts.empty
    randomAssembly = RandomAssembly.init({ limit: tryLimit })
  }

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
  }

  const updateCandidates = () => {
    const filtered = lockedParts.filter(initialCandidates)
    candidates = {
      ...filtered,
    }
  }

  function serializeAssemblyAsQuery() {
    if (typeof window === 'undefined') {
      // SSR時はデフォルトアセンブリを使用
      return
    }

    const url = new URL(location.href)
    const assemblyQuery = assemblyToSearchV2(assembly)

    // 既存の非アセンブリパラメータ（lng等）を保持
    mergeAssemblyParams(url.searchParams, assemblyQuery)

    goto(url, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
      invalidateAll: true,
      state: {
        initialized: true,
      },
    })
  }

  const navigateToPartsList = () => {
    if (typeof window === 'undefined') {
      return
    }

    const search = window.location.search
    const target = `/parts-list${search}`

    void goto(target, { keepFocus: true }).catch((error) => {
      logger.error('パーツ一覧ページへの遷移に失敗しました', {
        error: error instanceof Error ? error.message : String(error),
      })
    })
  }
</script>

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
    title={$i18n.t('command.partsList.description', { ns: 'page/index' })}
    onclick={navigateToPartsList}
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
