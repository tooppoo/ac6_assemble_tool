<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'
  import TextButton from '$lib/components/button/TextButton.svelte'
  import OffCanvas, {
    type ToggleOffCanvas,
  } from '$lib/components/off-canvas/OffCanvas.svelte'
  import i18n from '$lib/i18n/define'
  import ShareAssembly from '$lib/view/index/share/ShareAssembly.svelte'

  import type { Assembly } from '@ac6_assemble_tool/core/assembly/assembly'
  import { filterByKeywords } from '@ac6_assemble_tool/core/assembly/store/filter'
  import { IndexedDbRepository } from '@ac6_assemble_tool/core/assembly/store/repository/indexed-db/indexed-db-repository'
  import {
    createAggregation,
    type StoredAssemblyAggregation,
    type StoredAssemblyRepository,
  } from '@ac6_assemble_tool/core/assembly/store/stored-assembly'
  import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'
  import { onMount } from 'svelte'

  type Props = {
    id?: string
    open: boolean
    candidates: Candidates
    assembly: Assembly
    onToggle?: (payload: ToggleOffCanvas) => void
    onApply?: (payload: StoredAssemblyAggregation) => void
  }

  let {
    id = '',
    open,
    candidates,
    assembly,
    onToggle: onToggleProp,
    onApply: onApplyProp,
  }: Props = $props()

  let repository: StoredAssemblyRepository = $derived(
    new IndexedDbRepository(candidates),
  )

  let newName = $state('')
  let newDescription = $state('')
  let dataList = $state<StoredAssemblyMaybeDeleted[]>([])
  let keywords = $state<string[]>([])
  let showDataList = $derived(filterByKeywords(keywords, dataList))

  onMount(() => {
    initialize()
  })

  type ShareMode =
    | {
        open: true
        target: StoredAssemblyAggregation
      }
    | {
        open: false
        target: null
      }
  let shareMode = $state<ShareMode>({ open: false, target: null })

  const prefixForTextCopy = (target: StoredAssemblyAggregation) => `
${target.name}

${target.description}

-----

`

  // handler
  function onSubmitNewAssembly(event: Event) {
    event.preventDefault()

    const aggregation = createAggregation({
      name: newName,
      description: newDescription,
      assembly,
    })
    repository.storeNew(aggregation).then(async () => {
      const inserted = await repository.findById(aggregation.id, candidates)

      if (inserted) {
        dataList = dataList.concat({ ...inserted, deleted: false })
        newName = ''
        newDescription = ''
      } else {
        throw new Error('inserted item not found')
      }
    })
  }
  function onApply(target: StoredAssemblyAggregation) {
    onApplyProp?.(target)
  }
  function onDelete(target: StoredAssemblyAggregation) {
    repository.delete(target)

    dataList = dataList.map((d) => ({
      ...d,
      deleted: target.id === d.id || d.deleted,
    }))
  }
  function onRestore(target: StoredAssemblyAggregation) {
    repository.insert(target, candidates)

    dataList = dataList.map((d) => ({
      ...d,
      deleted: target.id === d.id ? false : d.deleted,
    }))
  }
  function onUpdateKeywords(target: Event) {
    const form = target.currentTarget as HTMLInputElement

    keywords = form.value.split(',').map((k) => k.trim())
  }
  function onShare(target: StoredAssemblyAggregation) {
    shareMode = { open: true, target }
  }

  // setup
  function initialize() {
    repository.all(candidates).then((xs) => {
      dataList = xs.map((x) => ({ ...x, deleted: false }))
    })
  }

  type StoredAssemblyMaybeDeleted = StoredAssemblyAggregation & {
    deleted: boolean
  }

  const handleToggle = (event: ToggleOffCanvas) => {
    onToggleProp?.(event)
  }
</script>

<OffCanvas {id} {open} onToggle={handleToggle}>
  {#snippet title()}
    {$i18n.t('assembly_store:caption')}
    <IconButton
      id="notice-for-store-assembly"
      title={$i18n.t('assembly_store:notice')}
      clickable={true}
      withTooltip={true}
      class="bi bi-info-circle"
      style="font-size: 1.125rem;"
    />
  {/snippet}
  {#snippet body()}
    <div class="mb-3">
      <form class="mb-3" onsubmit={onSubmitNewAssembly}>
        <div class="form-label">
          {$i18n.t('assembly_store:addNewData.title')}
        </div>
        <input
          type="text"
          class="form-control mb-2"
          id="new-assembly-name"
          placeholder={$i18n.t('assembly_store:addNewData.name.caption')}
          bind:value={newName}
          required
        />
        <textarea
          class="form-control mb-2"
          id="new-assembly-description"
          placeholder={$i18n.t('assembly_store:addNewData.description.caption')}
          bind:value={newDescription}
        ></textarea>
        <TextButton id="store-new-assembly" type="submit">
          {$i18n.t('assembly_store:addNewData.add.caption')}
        </TextButton>
      </form>
    </div>
    <hr class="my-4" />
    <div class="mb-3">
      <div class="mb-3">
        <div class="form-label">
          {$i18n.t('assembly_store:storedList.title')}
        </div>
        <input
          id="search-stored-assembly-by-name"
          type="text"
          class="form-control"
          placeholder={$i18n.t('assembly_store:storedList.search.caption')}
          oninput={onUpdateKeywords}
        />
      </div>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">
                {$i18n.t('assembly_store:storedList.table.col.name')}
              </th>
              <th scope="col">
                {$i18n.t('assembly_store:storedList.table.col.description')}
              </th>
              <th scope="col"> </th>
            </tr>
          </thead>
          <tbody>
            {#each showDataList as d (d.id)}
              {#if d.deleted}
                <tr>
                  <th scope="row" class="deleted">
                    <del>{d.name}</del><br />
                    {$i18n.t(
                      'assembly_store:storedList.table.state.deleted.caption',
                    )}
                  </th>
                  <td class="deleted">
                    <del>{d.description}</del>
                  </td>
                  <td>
                    <IconButton
                      id={`restore-${d.id}`}
                      title={$i18n.t(
                        'assembly_store:storedList.restore.caption',
                      )}
                      class="bi bi-recycle"
                      clickable={true}
                      onclick={() => onRestore(d)}
                    />
                  </td>
                </tr>
              {:else}
                <tr>
                  <th scope="row">{d.name}</th>
                  <td>{d.description}</td>
                  <td>
                    <IconButton
                      id={`load-${d.id}`}
                      title={$i18n.t('assembly_store:storedList.apply.caption')}
                      class="bi bi-download"
                      clickable={true}
                      onclick={() => onApply(d)}
                    />
                    <IconButton
                      id={`trash-${d.id}`}
                      title={$i18n.t(
                        'assembly_store:storedList.delete.caption',
                      )}
                      class="bi bi-trash"
                      clickable={true}
                      onclick={() => onDelete(d)}
                    />
                    <IconButton
                      id={`share-${d.id}`}
                      title={$i18n.t('assembly_store:storedList.share.caption')}
                      class="bi bi-share"
                      clickable={true}
                      onclick={() => onShare(d)}
                    />
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/snippet}
</OffCanvas>

<ShareAssembly
  id="share-stored-assembly"
  open={shareMode.open}
  assembly={() => {
    if (!shareMode.open) {
      throw new Error('canvas must be opened')
    }

    return shareMode.target.assembly
  }}
  prefix={() => {
    if (shareMode.target === null) {
      throw new Error('target must exist')
    }
    return prefixForTextCopy(shareMode.target)
  }}
  onToggle={(e) => {
    if (!e.open) {
      shareMode = { open: false, target: null }
    }
  }}
>
  {#snippet title()}
    {$i18n.t('share:command.target.caption', { what: shareMode.target?.name })}
  {/snippet}
</ShareAssembly>

<style>
  .deleted {
    color: gray;
  }
</style>
