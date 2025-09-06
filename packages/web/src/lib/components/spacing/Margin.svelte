<script lang="ts">
  export let space: number

  const klass = [$$props.class || '', `mt-${space}`, 'margin'].join(' ')
</script>

<div class={klass}></div>

<style>
  .margin {
    height: 1px;
  }
</style>
