<script lang="ts">
  import {
    buildExportFilename,
    buildFileBlob,
    buildZip,
    downloadBlob,
    flattenRegulation,
    groupByClassification,
    toCsv,
    toJson,
    type ExportFormat,
    type ExportTarget,
  } from '$lib/export/parts-export'
  import type { I18NextStore } from '$lib/i18n/define'
  import { appVersionShort } from '$lib/utils/app-version'

  import type { Classification } from '@ac6_assemble_tool/parts/types/base/classification'
  import type { ACParts } from '@ac6_assemble_tool/parts/types/base/types'
  import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'
  import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from '@sveltestrap/sveltestrap'
  import { getContext } from 'svelte'

  import type { Filter } from '../filter/filters-core'

  interface Props {
    open: boolean
    onClose: () => void
    regulation: Regulation
    filteredParts: readonly ACParts[]
    filters: readonly Filter[]
    showFavoritesOnly?: boolean
  }

  let {
    open,
    onClose,
    regulation,
    filteredParts,
    filters,
    showFavoritesOnly = false,
  }: Props = $props()

  const i18n = getContext<I18NextStore>('i18n')
  const repositoryURLforAppVersion = `https://github.com/tooppoo/ac6_assemble_tool/tree/web/v${appVersionShort}`

  let target = $state<ExportTarget>('filtered')
  let selectedClassification = $state<Classification | ''>('')
  let format = $state<ExportFormat>('json')
  let exportError = $state<boolean>(false)

  const availableClassifications = $derived.by<Classification[]>(() => {
    const all = flattenRegulation(regulation)
    return [...new Set(all.map((part) => part.classification))]
  })

  const isFilteredEmpty = $derived(filteredParts.length === 0)

  $effect(() => {
    if (!open) {
      exportError = false
    }
  })

  const isExecuteDisabled = $derived(
    (target === 'filtered' && isFilteredEmpty) ||
      (target === 'classification' && selectedClassification === ''),
  )

  function handleExport(): void {
    exportError = false
    const version = regulation.version

    if (target === 'all') {
      const grouped = groupByClassification(flattenRegulation(regulation))
      buildZip(grouped, format, { regulation: version, filter: [] })
        .then((blob) => {
          downloadBlob(blob, buildExportFilename('all', format, version))
        })
        .catch(() => {
          exportError = true
        })
      return
    }

    if (target === 'classification' && selectedClassification !== '') {
      try {
        const parts = flattenRegulation(regulation).filter(
          (part) => part.classification === selectedClassification,
        )
        const content =
          format === 'json'
            ? toJson(parts, { regulation: version, filter: [] })
            : toCsv(parts)
        downloadBlob(
          buildFileBlob(content, format),
          buildExportFilename(
            'classification',
            format,
            version,
            selectedClassification,
          ),
        )
      } catch {
        exportError = true
      }
      return
    }

    if (target === 'filtered' && !isFilteredEmpty) {
      try {
        const serializedFilters = [
          ...filters.map((filter) => filter.serialize()),
          ...(showFavoritesOnly ? ['favorites-only'] : []),
        ]
        const content =
          format === 'json'
            ? toJson(filteredParts, {
                regulation: version,
                filter: serializedFilters,
              })
            : toCsv(filteredParts)
        downloadBlob(
          buildFileBlob(content, format),
          buildExportFilename('filtered', format, version),
        )
      } catch {
        exportError = true
      }
    }
  }
</script>

<Modal
  id="export-dialog"
  backdrop="static"
  keyboard={false}
  aria-labelledby="export-dialog-label"
  isOpen={open}
>
  <ModalHeader>
    <span class="fs-5" id="export-dialog-label">
      {$i18n.t('page/parts-list:export.title')}
    </span>
    <button type="button" class="btn-close" onclick={onClose} aria-label="Close"
    ></button>
  </ModalHeader>
  <ModalBody>
    <fieldset class="mb-3">
      <legend class="fs-6"
        >{$i18n.t('page/parts-list:export.target.label')}</legend
      >
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-target"
          id="export-target-all"
          value="all"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-all">
          {$i18n.t('page/parts-list:export.target.all')}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-target"
          id="export-target-classification"
          value="classification"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-classification">
          {$i18n.t('page/parts-list:export.target.classification')}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-target"
          id="export-target-filtered"
          value="filtered"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-filtered">
          {$i18n.t('page/parts-list:export.target.filtered')}
        </label>
      </div>
    </fieldset>

    {#if target === 'classification'}
      <div class="mb-3">
        <label class="form-label" for="export-classification-select">
          {$i18n.t('page/parts-list:export.classification.label')}
        </label>
        <select
          class="form-select"
          id="export-classification-select"
          bind:value={selectedClassification}
        >
          <option value=""
            >{$i18n.t(
              'page/parts-list:export.classification.placeholder',
            )}</option
          >
          {#each availableClassifications as classification (classification)}
            <option value={classification}
              >{$i18n.t(`assembly:${classification}`)}</option
            >
          {/each}
        </select>
      </div>
    {/if}

    {#if target === 'filtered' && isFilteredEmpty}
      <p class="text-danger small" role="status" aria-live="polite">
        {$i18n.t('page/parts-list:export.emptyFiltered')}
      </p>
    {/if}

    {#if exportError}
      <p class="text-danger small" role="alert">
        {$i18n.t('page/parts-list:export.error')}
      </p>
    {/if}

    <fieldset class="mb-3">
      <legend class="fs-6"
        >{$i18n.t('page/parts-list:export.format.label')}</legend
      >
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-format"
          id="export-format-json"
          value="json"
          bind:group={format}
        />
        <label class="form-check-label" for="export-format-json">
          {$i18n.t('page/parts-list:export.format.json')}
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="export-format"
          id="export-format-csv"
          value="csv"
          bind:group={format}
        />
        <label class="form-check-label" for="export-format-csv">
          {$i18n.t('page/parts-list:export.format.csv')}
        </label>
      </div>
    </fieldset>

    <div>
      <div class="fs-6">LICENSE for exported data</div>
      <div>
        <ul>
          <li>
            For FROM SOFTWARE, Inc.: <a
              href={`${repositoryURLforAppVersion}/LICENSE_FOR_FROM_SOFTWARE`}
              target="_blank"
              rel="noopener noreferrer">LICENSE_FOR_FROM_SOFTWARE</a
            >
          </li>
          <li>
            For others: <a
              href={`${repositoryURLforAppVersion}/LICENSE`}
              target="_blank"
              rel="noopener noreferrer">LICENSE</a
            >
          </li>
        </ul>
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <button type="button" class="btn btn-secondary" onclick={onClose}>
      {$i18n.t('page/parts-list:export.cancel')}
    </button>
    <button
      type="button"
      class="btn btn-primary"
      disabled={isExecuteDisabled}
      onclick={handleExport}
    >
      {$i18n.t('page/parts-list:export.execute')}
    </button>
  </ModalFooter>
</Modal>
