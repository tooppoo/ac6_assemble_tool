<script lang="ts">
  import {
    buildExportFilename,
    buildFileBlob,
    buildZip,
    downloadBlob,
    flattenRegulation,
    groupByCategory,
    toCsv,
    toJson,
    type ExportFormat,
    type ExportTarget,
  } from '$lib/export/parts-export'
  import type { I18NextStore } from '$lib/i18n/define'

  import type { Category } from '@ac6_assemble_tool/parts/types/base/category'
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
  }

  let { open, onClose, regulation, filteredParts, filters }: Props = $props()

  const i18n = getContext<I18NextStore>('i18n')

  let target = $state<ExportTarget>('filtered')
  let selectedCategory = $state<Category | ''>('')
  let format = $state<ExportFormat>('json')
  let exportError = $state<boolean>(false)

  const availableCategories = $derived.by<Category[]>(() => {
    const all = flattenRegulation(regulation)
    return [...new Set(all.map((part) => part.category))].sort()
  })

  const isFilteredEmpty = $derived(filteredParts.length === 0)

  const isExecuteDisabled = $derived(
    (target === 'filtered' && isFilteredEmpty) ||
      (target === 'category' && selectedCategory === ''),
  )

  function handleExport(): void {
    exportError = false
    const version = regulation.version

    if (target === 'all') {
      const grouped = groupByCategory(flattenRegulation(regulation))
      buildZip(grouped, format, { regulation: version, filter: [] })
        .then((blob) => {
          downloadBlob(blob, buildExportFilename('all', format, version))
        })
        .catch(() => {
          exportError = true
        })
      return
    }

    if (target === 'category' && selectedCategory !== '') {
      try {
        const parts = flattenRegulation(regulation).filter(
          (part) => part.category === selectedCategory,
        )
        const content =
          format === 'json'
            ? toJson(parts, { regulation: version, filter: [] })
            : toCsv(parts)
        downloadBlob(
          buildFileBlob(content, format),
          buildExportFilename('category', format, version, selectedCategory),
        )
      } catch {
        exportError = true
      }
      return
    }

    if (target === 'filtered' && !isFilteredEmpty) {
      try {
        const content =
          format === 'json'
            ? toJson(filteredParts, {
                regulation: version,
                filter: filters.map((filter) => filter.serialize()),
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
    <h1 class="modal-title fs-5" id="export-dialog-label">
      {$i18n.t('page/parts-list:export.title')}
    </h1>
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
          id="export-target-category"
          value="category"
          bind:group={target}
        />
        <label class="form-check-label" for="export-target-category">
          {$i18n.t('page/parts-list:export.target.category')}
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

    {#if target === 'category'}
      <div class="mb-3">
        <label class="form-label" for="export-category-select">
          {$i18n.t('page/parts-list:export.category.label')}
        </label>
        <select
          class="form-select"
          id="export-category-select"
          bind:value={selectedCategory}
        >
          <option value=""
            >{$i18n.t('page/parts-list:export.category.placeholder')}</option
          >
          {#each availableCategories as category (category)}
            <option value={category}>{category}</option>
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

    <fieldset>
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
