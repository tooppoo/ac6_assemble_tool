<script lang="ts">
  import Navbar from '$lib/view/index/layout/Navbar.svelte'

  import { aboutSections } from './content'

  const tocItems = aboutSections.map((section) => ({
    id: section.id,
    title: section.title,
  }))
</script>

<div class="bg-dark text-light min-vh-100">
  <Navbar>
    <a class="nav-link text-light" href="/" data-testid="nav-home-link">
      ホームに戻る
    </a>
  </Navbar>

  <main class="container py-5" data-testid="about-page">
    <header class="mb-5">
      <h1 class="display-5 fw-bold mb-3">
        AC6 ASSEMBLE TOOL /about
      </h1>
      <p class="lead text-secondary">
        本ページでは、AC6 ASSEMBLE TOOL の設計思想、提供価値、品質保証、今後の展望を包括的に紹介します。初めて訪れる方にも既存の利用者にも同じ情報量を提示し、プロジェクト全体を俯瞰したうえで安心して使い続けられるようにすることが目的です。
      </p>
    </header>

    <div class="row">
      <aside class="col-lg-3 mb-4">
        <nav
          class="position-sticky top-0 pt-lg-3"
          aria-label="ページ内ナビゲーション"
        >
          <div class="card bg-secondary-subtle border-0">
            <div class="card-body">
              <h2 class="h6 text-uppercase fw-semibold mb-3">
                セクション一覧
              </h2>
              <ul class="list-unstyled m-0">
                {#each tocItems as item}
                  <li class="mb-2">
                    <a
                      class="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                      href={`#${item.id}`}
                    >
                      {item.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </nav>
      </aside>

      <div class="col-lg-9">
        {#each aboutSections as section (section.id)}
          <section id={section.id} class="mb-5">
            <div class="mb-3">
              <span class="badge text-bg-primary text-uppercase">
                {section.id}
              </span>
            </div>
            <h2 class="h3 fw-bold mb-3">{section.title}</h2>
            <p class="text-secondary border-start border-3 border-primary ps-3">
              {section.lead}
            </p>

            {#each section.body as paragraph, index (index)}
              <p class="mt-3 lh-lg">
                {paragraph}
              </p>
            {/each}
          </section>
        {/each}
      </div>
    </div>
  </main>
</div>
