<script lang="ts">
  import TextButton from '$lib/components/button/TextButton.svelte'
  import LanguageForm from '$lib/components/language/LanguageForm.svelte'
  import ErrorModal from '$lib/components/modal/ErrorModal.svelte'
  import Margin from '$lib/components/spacing/Margin.svelte'
  import i18n from '$lib/i18n/define'
  import { useWithEnableState } from '$lib/ssg/safety-reference'
  import { appVersion } from '$lib/utils/app-version'
  import { logger } from '$lib/utils/logger'

  import {
    type Assembly,
    type AssemblyKey,
    assemblyKeys,
    spaceByWord,
    createAssembly,
  } from '@ac6_assemble_tool/core/assembly/assembly'
  import { UsableItemNotFoundError } from '@ac6_assemble_tool/core/assembly/filter/filters'
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
  import { onMount } from 'svelte'

  import FilterByPartsOffCanvas from './filter/FilterByPartsOffCanvas.svelte'
  import FilterForWholeOffCanvas from './filter/FilterForWholeOffCanvas.svelte'
  import type {
    ChangePartsEvent,
    ToggleLockEvent,
  } from './form/PartsSelectForm.svelte'
  import PartsSelectForm from './form/PartsSelectForm.svelte'
  import {
    assemblyErrorMessage,
    filterApplyErrorMessage,
  } from './interaction/error-message'
  import {
    applyFilter,
    assemblyWithHeadParts,
    changePartsFilter,
    type FilterState,
    initialFilterState,
    toggleFilter,
  } from './interaction/filter'
  import { initializeAssembly } from './interaction/initialize'
  import NavButton from './layout/navbar/NavButton.svelte'
  import Navbar from './layout/Navbar.svelte'
  import ToolSection from './layout/ToolSection.svelte'
  import RandomAssembleButton from './random/button/RandomAssembleButton.svelte'
  import RandomAssemblyOffCanvas, {
    type AssembleRandomly,
    type ErrorOnAssembly,
  } from './random/RandomAssemblyOffCanvas.svelte'
  import ReportList from './report/ReportList.svelte'
  import ShareAssembly from './share/ShareAssembly.svelte'
  import StoreAssembly from './store/StoreAssembly.svelte'

  import {
    PUBLIC_REPORT_BUG_URL,
    PUBLIC_REPORT_REQUEST_URL,
  } from '$env/static/public'

  const reportRequestLinkAttributes = {
    href: PUBLIC_REPORT_REQUEST_URL,
    target: '_blank',
    rel: 'external noopener noreferrer',
  } as const

  const reportBugLinkAttributes = {
    href: PUBLIC_REPORT_BUG_URL,
    target: '_blank',
    rel: 'external noopener noreferrer',
  } as const

  const tryLimit = 3000

  // state
  export let regulation: Regulation

  const orders: Order = regulation.orders
  const version: string = regulation.version

  let candidates: Candidates = regulation.candidates
  let initialCandidates: Candidates = regulation.candidates
  let lockedParts: LockedParts = LockedParts.empty
  let filter: FilterState = initialFilterState(initialCandidates)
  let randomAssembly = RandomAssembly.init({ limit: tryLimit })

  let openRandomAssembly: boolean = false
  let openWholeFilter: boolean = false
  let openShare: boolean = false
  let openAssemblyStore: boolean = false
  let errorMessage: string[] = []
  let browserBacking: boolean = false

  let orderParts: OrderParts = defineOrder(orders)

  let assembly: Assembly = initializeAssembly(candidates)
  let serializeAssembly = useWithEnableState(serializeAssemblyAsQuery)

  onMount(() => {
    initialize()

    serializeAssembly.enable()
  })

  $: {
    if (initialCandidates && filter && assembly && lockedParts) {
      try {
        logger.debug('update candidates', filter, lockedParts)

        updateCandidates()
      } catch (e) {
        logger.error(e)

        errorMessage = filterApplyErrorMessage(
          e instanceof UsableItemNotFoundError ? e : new Error(`${e}`),
          $i18n,
        )
      }
    }
  }
  $: {
    if (assembly && initialCandidates && !browserBacking) {
      logger.debug('replace state', assemblyToSearchV2(assembly).toString())

      serializeAssembly.run()
    }

    browserBacking = false
  }

  // handler
  const onChangeParts = ({ detail }: CustomEvent<ChangePartsEvent>) => {
    // @ts-expect-error TS2590
    assembly[detail.id] = detail.selected
    assembly = assembly
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

  const openFilter = (ev: CustomEvent<{ id: AssemblyKey }>) => {
    filter = toggleFilter(ev.detail.id, filter)
  }

  const updateCandidates = () => {
    candidates = lockedParts.filter(
      applyFilter(initialCandidates, filter, {
        assembly,
        wholeFilter: filter.map,
      }),
    )
  }

  function buildAssemblyFromQuery() {
    if (typeof window === 'undefined') {
      // SSR時はデフォルトアセンブリを使用
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
      // SSR時は何もしない
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
    buildAssemblyFromQuery()
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
    id="open-whole-filter"
    class="me-3"
    title={$i18n.t('command.filterForWhole.description', { ns: 'page/index' })}
    on:click={() => (openWholeFilter = true)}
  >
    <i slot="icon" class="bi bi-filter-square"></i>
    <span class="d-none d-md-inline">
      {$i18n.t('command.filterForWhole.label', { ns: 'page/index' })}
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
    title={$i18n.t('command.store.description', { ns: 'page/index' })}
    on:click={() => (openAssemblyStore = true)}
  >
    <i slot="icon" class="bi bi-database"></i>
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
        {filter}
        on:toggle-lock={onLock}
        on:toggle-filter={openFilter}
        on:change={onChangeParts}
      />
    {/each}
  </ToolSection>

  <ToolSection id="assembly-report" class="container mw-100 mx-0 my-4 w-100">
    <ReportList {assembly} />
  </ToolSection>

  <ToolSection
    id="development-report"
    class="container mw-100 mx-0 my-4 w-100 text-center d-flex flex-column align-items-center"
  >
    <a class="d-block ms-1" {...reportRequestLinkAttributes}>
      {$i18n.t('report.request', { ns: 'page/index' })}
      <i class="bi bi-send"></i>
    </a>

    <Margin space={2} />

    <a class="d-block ms-1" {...reportBugLinkAttributes}>
      {$i18n.t('report.bug', { ns: 'page/index' })}
      <i class="bi bi-send"></i>
    </a>

    <hr class="w-100" />

    <a
      class="d-block ms-1"
      href="https://github.com/tooppoo/ac6_assemble_tool/releases"
      target="_blank"
      rel="external noopener noreferrer"
    >
      Release Notes
      <i class="bi bi-journal-text"></i>
    </a>
  </ToolSection>
</article>

<hr class="my-3" />

<footer class="text-center mb-3">
  <div>
    Created by
    <a
      id="link-to-linktr"
      href="https://linktr.ee/Philomagi"
      rel="external noopener noreferrer"
    >
      >Philomagi</a
    >
  </div>
  <div>
    Source code is managed at
    <a
      id="link-to-src"
      href="https://github.com/tooppoo/ac6_assemble_tool/"
      rel="external noopener noreferrer">Github</a
    >
  </div>
  <div>
    App Version v{appVersion}
  </div>
</footer>

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

<FilterByPartsOffCanvas
  id="filter-by-parts"
  open={filter.open}
  current={filter.current}
  on:toggle={(ev) => (filter.open = ev.detail.open)}
  on:change-filter={({ detail }) => {
    filter = changePartsFilter({ target: detail.target, state: filter })
    updateCandidates()
    assembly = assemblyWithHeadParts(candidates)
  }}
/>
<FilterForWholeOffCanvas
  id="filter-for-whole"
  open={openWholeFilter}
  {initialCandidates}
  {candidates}
  {assembly}
  {lockedParts}
  {filter}
  {randomAssembly}
  on:toggle={(ev) => (openWholeFilter = ev.detail.open)}
  on:apply={({ detail }) => {
    if (detail.candidates) candidates = detail.candidates
    if (detail.assembly) assembly = detail.assembly
    if (detail.filter) filter = detail.filter
  }}
/>
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
