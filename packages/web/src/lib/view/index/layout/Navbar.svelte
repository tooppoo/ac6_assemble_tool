<script lang="ts">
  import { resolve } from '$app/paths'
</script>

<nav
  class="navbar navbar-expand-lg sticky-top bg-body-tertiary border-bottom border-secondary"
>
  <div class="container-fluid">
    <a class="navbar-brand" href={resolve('/')}> Ⅵ </a>
    <div class="navbar-nav ms-auto d-flex flex-row">
      <slot></slot>
    </div>
  </div>
</nav>
