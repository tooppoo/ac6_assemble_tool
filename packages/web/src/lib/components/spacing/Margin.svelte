<script lang="ts">
  interface Props {
    space: number
    class?: string
  }
  let { space, class: className = '' }: Props = $props()

  let klass = $derived([className, `mt-${space}`, 'margin'].join(' '))
</script>

<div class={klass}></div>

<style>
  .margin {
    height: 1px;
  }
</style>
