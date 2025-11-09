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
    createAssembly,
  } from '@ac6_assemble_tool/core/assembly/assembly'
  import { changeAssemblyCommand } from '@ac6_assemble_tool/core/assembly/command/change-assembly'
  import { LockedParts } from '@ac6_assemble_tool/core/assembly/random/lock'
  import { RandomAssembly } from '@ac6_assemble_tool/core/assembly/random/random-assembly'
  import {
    assemblyToSearchV2,
    searchToAssemblyV2,
    ASSEMBLY_QUERY_V2_KEYS,
  } from '@ac6_assemble_tool/core/assembly/serialize/as-query-v2'
  import { VersionMigration } from '@ac6_assemble_tool/core/assembly/version-migration'
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
  import { assemblyErrorMessage } from './interaction/error-message'
  import { initializeAssembly } from './interaction/initialize'
  import {
    applyPartsPoolRestrictions,
    type PartsPoolRestrictions,
  } from './parts-pool'
  import RandomAssembleButton from './random/button/RandomAssembleButton.svelte'
  import RandomAssemblyOffCanvas, {
    type AssembleRandomly,
    type ErrorOnAssembly,
  } from './random/RandomAssemblyOffCanvas.svelte'
  import ReportList from './report/ReportList.svelte'
  import ShareAssembly from './share/ShareAssembly.svelte'
  import StoreAssembly from './store/StoreAssembly.svelte'

  import { goto } from '$app/navigation'

  let aboutHref: string = '/about/ja'
  let currentSearch: string = ''

  const updateCurrentSearch = () => {
    if (typeof window === 'undefined') {
      return
    }

    currentSearch = window.location.search
  }

  $: {
    const basePath = $i18n.language === 'en' ? '/about/en' : '/about/ja'
    const suffix = currentSearch || ''
    aboutHref = `${basePath}?${suffix}`
  }

  const tryLimit = 3000

  // state
  export let regulation: Regulation
  export let partsPool: PartsPoolRestrictions

  const orders: Order = regulation.orders
  const version: string = regulation.version

  let partsPoolState: PartsPoolRestrictions = partsPool
  let previousPartsPool: PartsPoolRestrictions = partsPool

  let initialCandidates: Candidates = partsPoolState.candidates
  let candidates: Candidates = partsPoolState.candidates
  let changeAssembly = changeAssemblyCommand(initialCandidates)
  let lockedParts: LockedParts = LockedParts.empty
  let randomAssembly = RandomAssembly.init({ limit: tryLimit })

  let openRandomAssembly: boolean = false
  let openShare: boolean = false
  let openAssemblyStore: boolean = false
  let errorMessage: string[] = []
  let browserBacking: boolean = false

  let orderParts: OrderParts = defineOrder(orders)

  let assembly: Assembly = initializeAssembly(candidates)
  let serializeAssembly = useWithEnableState(() => {
    serializeAssemblyAsQuery()
    updateCurrentSearch()
  })

  $: if (partsPool !== previousPartsPool) {
    // props由来の母集団が差し替わった場合のみ再同期する
    previousPartsPool = partsPool
    applyPartsPoolState(partsPool)
  }

  onMount(() => {
    updatePartsPoolFromUrl()
    initialize()

    serializeAssembly.enable()
  })

  $: if (initialCandidates) {
    logger.debug('update candidates', { lockedParts })

    updateCandidates()
  }
  $: {
    if (assembly && initialCandidates && !browserBacking) {
      logger.debug('replace state', {
        query: assemblyToSearchV2(assembly).toString(),
      })

      serializeAssembly.run()
    }

    browserBacking = false
  }

  // handler
  function applyPartsPoolState(pool: PartsPoolRestrictions) {
    partsPoolState = pool
    initialCandidates = pool.candidates
    candidates = pool.candidates
    lockedParts = LockedParts.empty
    randomAssembly = RandomAssembly.init({ limit: tryLimit })

    if (typeof window !== 'undefined') {
      browserBacking = true
      buildAssemblyFromQuery()
    } else {
      assembly = initializeAssembly(candidates)
    }
  }

  const onChangeParts = ({ detail }: CustomEvent<ChangePartsEvent>) => {
    const result = changeAssembly(detail.id, detail.selected, assembly)

    assembly = result.assembly
    candidates = result.remainingCandidates
  }
  const onRandom = ({ detail }: CustomEvent<AssembleRandomly>) => {
    assembly = detail.assembly
  }
  const errorOnRandom = ({ detail }: CustomEvent<ErrorOnAssembly>) => {
    errorMessage = assemblyErrorMessage(detail.error, $i18n)
  }

  const onLock = ({ detail }: CustomEvent<ToggleLockEvent>) => {
    lockedParts = detail.value
      ? lockedParts.lock(detail.id, assembly[detail.id])
      : lockedParts.unlock(detail.id)
  }

  const updateCandidates = () => {
    const filtered = lockedParts.filter(initialCandidates)
    candidates = {
      ...filtered,
    }
  }

  function buildAssemblyFromQuery() {
    if (typeof window === 'undefined') {
      // SSR時はデフォルトアセンブリを使用
      assembly = createAssembly(
        searchToAssemblyV2(new URLSearchParams(), initialCandidates),
      )
      return
    }

    const url = new URL(location.href)
    const params = url.searchParams

    if (!params.toString()) {
      // クエリなしの場合はデフォルトアセンブリ
      assembly = createAssembly(searchToAssemblyV2(params, initialCandidates))
      return
    }

    // バージョン判定とマイグレーション
    const migrate = VersionMigration.forQuery(params)
    const convertedParams = migrate(params, initialCandidates)

    assembly = createAssembly(
      searchToAssemblyV2(convertedParams, initialCandidates),
    )

    // v1の場合はURLをv2形式に更新（既存の非アセンブリパラメータを保持）
    if (convertedParams !== params) {
      mergeAssemblyParams(url.searchParams, convertedParams)
      history.replaceState({}, '', url)
    }
  }
  /**
   * アセンブリ関連パラメータをマージ（既存の非アセンブリパラメータを保持）
   *
   * @param currentParams - 現在のURLSearchParams（変更される）
   * @param assemblyParams - アセンブリ関連のURLSearchParams
   */
  function mergeAssemblyParams(
    currentParams: URLSearchParams,
    assemblyParams: URLSearchParams,
  ) {
    // 既存のアセンブリ関連パラメータを削除
    ASSEMBLY_QUERY_V2_KEYS.forEach((key) => currentParams.delete(key))

    // 新しいアセンブリパラメータを追加
    assemblyParams.forEach((value, key) => {
      currentParams.set(key, value)
    })
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

    history.pushState({}, '', url)
  }

  // setup
  function initialize() {
    buildAssemblyFromQuery()

    logger.debug('initialized', assembly)
  }

  const onPopstate = () => {
    browserBacking = true
    updatePartsPoolFromUrl()
    buildAssemblyFromQuery()
  }

  function updatePartsPoolFromUrl() {
    if (typeof window === 'undefined') {
      return
    }

    const restricted = applyPartsPoolRestrictions(
      new URLSearchParams(window.location.search),
      partsPool.candidates,
    )

    if (isSameRestriction(partsPoolState, restricted)) {
      return
    }

    applyPartsPoolState(restricted)
  }

  function isSameRestriction(
    current: PartsPoolRestrictions,
    next: PartsPoolRestrictions,
  ): boolean {
    const currentSlots = current.restrictedSlots
    const nextSlots = next.restrictedSlots

    const currentKeys = Object.keys(currentSlots) as Array<
      keyof typeof currentSlots
    >
    const nextKeys = Object.keys(nextSlots) as Array<keyof typeof nextSlots>

    if (currentKeys.length !== nextKeys.length) {
      return false
    }

    return currentKeys.every((slot) => {
      const currentIds = currentSlots[slot]
      const nextIds = nextSlots[slot]

      if (!currentIds || !nextIds || currentIds.length !== nextIds.length) {
        return false
      }

      return currentIds.every((id, index) => id === nextIds[index])
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

<svelte:window on:popstate={onPopstate} />

<Navbar>
  <NavButton
    id="random-assemble"
    class="me-3"
    title={$i18n.t('command.random.description', { ns: 'page/index' })}
    on:click={() => (openRandomAssembly = true)}
  >
    <i slot="icon" class="bi bi-tools"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.random.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-parts-list"
    class="me-3"
    title={$i18n.t('command.partsList.description', { ns: 'page/index' })}
    on:click={navigateToPartsList}
  >
    <i slot="icon" class="bi bi-funnel"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.partsList.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="reset-lock-nav"
    class="me-3 d-none d-md-block"
    title={$i18n.t('command.resetLock.description', { ns: 'page/index' })}
    on:click={() => (lockedParts = LockedParts.empty)}
  >
    <i slot="icon" class="bi bi-unlock"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.resetLock.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-share"
    class="me-3"
    title={$i18n.t('command.share.description', { ns: 'page/index' })}
    on:click={() => (openShare = true)}
  >
    <i slot="icon" class="bi bi-share"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.share.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-assembly-store"
    class="me-3"
    title={$i18n.t('command.store.description', { ns: 'page/index' })}
    on:click={() => (openAssemblyStore = true)}
  >
    <i slot="icon" class="bi bi-database"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.store.label', { ns: 'page/index' })}
    </span>
  </NavButton>
  <NavButton
    id="open-about-page"
    title={$i18n.t('command.about.description', { ns: 'page/index' })}
    href={aboutHref}
    class="ms-md-2"
  >
    <i slot="icon" class="bi bi-info-circle"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.about.label', { ns: 'page/index' })}
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
    <LanguageForm onUpdate={(search) => (currentSearch = search)} />
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
        on:click={({ detail: randomAssembly }) => (assembly = randomAssembly)}
      />
      <TextButton
        id="reset-lock-form"
        title={$i18n.t('command.resetLock.description', { ns: 'page/index' })}
        tooltipText={$i18n.t('command.resetLock.description', {
          ns: 'page/index',
        })}
        on:click={() => (lockedParts = LockedParts.empty)}
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
        on:toggle-lock={onLock}
        on:change={onChangeParts}
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
  on:toggle={(e) => (openRandomAssembly = e.detail.open)}
  on:random={onRandom}
  on:error={errorOnRandom}
  on:filter={({ detail }) => {
    randomAssembly = detail.randomAssembly
  }}
  on:lock-legs={onLock}
>
  <svelte:fragment slot="title">
    {$i18n.t('command.random.label', { ns: 'page/index' })}
  </svelte:fragment>
</RandomAssemblyOffCanvas>
<ShareAssembly
  id="share-assembly"
  open={openShare}
  assembly={() => assembly}
  on:toggle={(e) => (openShare = e.detail.open)}
>
  <svelte:fragment slot="title">
    {$i18n.t('share:caption')}
  </svelte:fragment>
</ShareAssembly>
<StoreAssembly
  id="store-assembly"
  open={openAssemblyStore}
  candidates={initialCandidates}
  {assembly}
  on:toggle={(e) => (openAssemblyStore = e.detail.open)}
  on:apply={(e) => (assembly = e.detail.assembly)}
/>

<ErrorModal
  id="index-error-modal"
  open={errorMessage.length !== 0}
  on:close={() => (errorMessage = [])}
>
  <svelte:fragment slot="title">ERROR</svelte:fragment>
  <svelte:fragment slot="button">OK</svelte:fragment>

  {#each errorMessage as row, i (i)}
    {row}<br />
  {/each}
</ErrorModal>

<style>
  article {
    max-width: 1000px;
  }
</style>
