<script lang="ts" context="module">
  import type { ToggleOffCanvas } from '$lib/components/off-canvas/OffCanvas.svelte'
</script>

<script lang="ts">
  import IconButton from '$lib/components/button/IconButton.svelte'
  import TextButton from '$lib/components/button/TextButton.svelte'
  import OffCanvas from '$lib/components/off-canvas/OffCanvas.svelte'
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
  import { createEventDispatcher, onMount } from 'svelte'

  export let open: boolean
  export let candidates: Candidates
  export let assembly: Assembly

  const repository: StoredAssemblyRepository = new IndexedDbRepository()

  let newName: string = ''
  let newDescription: string = ''
  let dataList: StoredAssemblyMaybeDeleted[] = []
  let keywords: string[] = []
  let showDataList: StoredAssemblyMaybeDeleted[]
  $: showDataList = filterByKeywords(keywords, dataList)

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
  let shareMode: ShareMode = { open: false, target: null }

  const prefixForTextCopy = (target: StoredAssemblyAggregation) => `
${target.name}

${target.description}

-----

`

  // handler
  function onSubmitNewAssembly() {
    const aggregation = createAggregation({
      name: newName,
      description: newDescription,
      assembly,
    })
    repository.storeNew(aggregation, candidates).then(async () => {
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
    dispatch('apply', target)
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

  const dispatch = createEventDispatcher<{
    toggle: ToggleOffCanvas
    apply: StoredAssemblyAggregation
  }>()

  type StoredAssemblyMaybeDeleted = StoredAssemblyAggregation & {
    deleted: boolean
  }
</script>

<OffCanvas
  id={$$props.id || ''}
  {open}
  on:toggle={(e) => dispatch('toggle', e.detail)}
>
  <svelte:fragment slot="title">
    {$i18n.t('assembly_store:caption')}
    <IconButton
      id="notice-for-store-assembly"
      title={$i18n.t('assembly_store:notice')}
      clickable={true}
      withTooltip={true}
      class="bi bi-info-circle"
      style="font-size: 18px;"
    />
  </svelte:fragment>
  <svelte:fragment slot="body">
    <div class="mb-3">
      <form class="mb-3" on:submit|preventDefault={onSubmitNewAssembly}>
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
        />
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
          on:input={onUpdateKeywords}
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
            {#each showDataList as d}
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
                      id="restore-{d.id}"
                      title={$i18n.t(
                        'assembly_store:storedList.restore.caption',
                      )}
                      class="bi bi-recycle"
                      clickable={true}
                      on:click={() => onRestore(d)}
                    />
                  </td>
                </tr>
              {:else}
                <tr>
                  <th scope="row">{d.name}</th>
                  <td>{d.description}</td>
                  <td>
                    <IconButton
                      id="load-{d.id}"
                      title={$i18n.t('assembly_store:storedList.apply.caption')}
                      class="bi bi-download"
                      clickable={true}
                      on:click={() => onApply(d)}
                    />
                    <IconButton
                      id="trash-{d.id}"
                      title={$i18n.t(
                        'assembly_store:storedList.delete.caption',
                      )}
                      class="bi bi-trash"
                      clickable={true}
                      on:click={() => onDelete(d)}
                    />
                    <IconButton
                      id="share-{d.id}"
                      title={$i18n.t('assembly_store:storedList.share.caption')}
                      class="bi bi-share"
                      clickable={true}
                      on:click={() => onShare(d)}
                    />
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </svelte:fragment>
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
  on:toggle={(e) => {
    if (!e.detail.open) {
      shareMode = { open: false, target: null }
    }
  }}
>
  <svelte:fragment slot="title">
    {$i18n.t('share:command.target.caption', { what: shareMode.target?.name })}
  </svelte:fragment>
</ShareAssembly>

<style>
  .deleted {
    color: gray;
  }
</style>
