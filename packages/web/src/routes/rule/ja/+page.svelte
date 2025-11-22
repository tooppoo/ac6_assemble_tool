<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import Navbar from '$lib/components/layout/Navbar.svelte'

  const canonical = appUrl('rule', 'ja')

  const sections = [
    {
      id: 'application',
      title: '第1条（適用）',
      items: [
        '本規約は、ユーザーによる本サービスの利用に関わる一切に適用されます。',
        '本サービスに関して、運営者が本規約のほかに定めた追加規定・注意事項が存在する場合、それらも本規約の一部を構成します。',
      ],
    },
    {
      id: 'service',
      title: '第2条（本サービスの内容）',
      items: [
        '本サービスは、ARMORED CORE Ⅵ FIRES OF RUBICON の非公式アセンブル支援ツールとして、パーツ情報の閲覧・検索・組み合わせ生成などを提供する Web アプリケーションです。',
        '本サービスは FromSoftware 株式会社およびバンダイナムコエンターテインメントとは一切関係ありません。非公式のファンメイドツールです。',
      ],
    },
    {
      id: 'prohibit',
      title: '第3条（禁止事項）',
      items: [
        '法令または公序良俗に違反する行為',
        '本サービスの運営を妨害する行為',
        '不正アクセス、クラッキング、データの改ざん等を試みる行為',
        'サーバーやネットワークに過度の負荷を与える行為',
        '本サービスを商用目的で再利用・再配布する行為',
        '本サービスのデータやコードを不正に取得・改変する行為',
        'その他、運営者が不適切と判断する行為',
      ],
    },
    {
      id: 'ipr',
      title: '第4条（知的財産権）',
      items: [
        '本サービスに掲載されるパーツ情報、画像、テキスト、プログラムなどの著作権・知的財産権は、それぞれの権利者に帰属します。',
        'AC6 に関連する名称・データ等の著作権は、FromSoftware 株式会社およびバンダイナムコエンターテインメントに帰属します。',
        'ユーザーは、本サービスのコンテンツを権利者の許可なく複写、転載、再配布することはできません。',
      ],
    },
    {
      id: 'change',
      title: '第5条（サービスの変更・停止）',
      items: [
        '運営者は、ユーザーへの事前告知なしに、本サービスの内容変更・一時停止・終了を行うことがあります。',
        '本サービスの変更・停止・終了によりユーザーが損害を受けた場合でも、運営者は一切の責任を負いません。',
      ],
    },
    {
      id: 'disclaimer',
      title: '第6条（免責事項）',
      items: [
        '本サービスは「現状のまま」提供され、動作の正確性・完全性・最新性を保証しません。',
        '本サービスの利用により発生したいかなる損害についても、運営者は一切の責任を負いません。',
        '本サービスの計算結果・表示情報・生成アセンブルは、公式ゲーム仕様を完全に再現するものではありません。',
        '外部サービス（Cloudflare / GitHub / Google など）の障害や設定に起因する問題について、運営者は責任を負いません。',
      ],
    },
    {
      id: 'privacy',
      title: '第7条（個人情報の扱い）',
      items: [
        '本サービスは、ユーザーの個人情報を収集しません。',
        'アクセス解析等のために Google Analytics・Google Tag Manager 等の外部サービスを使用する場合があります。',
        'これら外部サービスが収集するデータについては、それぞれの提供者のプライバシーポリシーが適用されます。',
      ],
    },
    {
      id: 'revision',
      title: '第8条（規約の変更）',
      items: [
        '運営者は、必要に応じて本規約を変更することがあります。',
        '規約変更後にユーザーが本サービスを利用した場合、変更後の規約に同意したものとみなされます。',
      ],
    },
    {
      id: 'law',
      title: '第9条（準拠法・管轄）',
      items: [
        '本規約は日本法に準拠します。',
        '本サービスに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を専属的合意管轄裁判所とします。',
      ],
    },
    {
      id: 'date',
      title: '制定日',
      items: ['2025-11-22', '運営者: philomagi（個人）'],
    },
  ] as const

  const heroTitle = 'AC6 ASSEMBLE TOOL | 利用規約'
  const heroLead =
    '本サービスの利用条件、禁止事項、知的財産権、免責事項などをまとめています。ご利用前に必ずお読みください。'

  const languageSwitcher = [
    { label: '日本語', href: '/rule/ja', active: true },
    { label: 'English', href: '/rule/en', active: false },
  ] as const
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <meta property="og:url" content={canonical} />
  <title>AC6 ASSEMBLE TOOL | 利用規約</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL | 利用規約" />
  <meta
    name="description"
    content="AC6 ASSEMBLE TOOL の利用規約（日本語版）。本サービスの内容、禁止事項、知的財産権、免責事項、個人情報の扱いなどを定めています。"
  />
  <meta
    property="og:description"
    content="AC6 ASSEMBLE TOOL の利用規約（日本語版）。本サービスの内容、禁止事項、知的財産権、免責事項、個人情報の扱いなどを定めています。"
  />
</svelte:head>

<div class="bg-dark text-light min-vh-100">
  <Navbar>
    <a class="nav-link text-light" href="/" data-testid="nav-home-link">
      ホームに戻る
    </a>
    {#each languageSwitcher as locale (locale.href)}
      <a
        class={`nav-link ms-3 ${locale.active ? 'fw-bold text-primary' : 'text-light'}`}
        href={locale.href}
        aria-current={locale.active ? 'page' : undefined}
      >
        {locale.label}
      </a>
    {/each}
  </Navbar>

  <main class="container py-5 fs-5">
    <header class="mb-5">
      <h1 class="display-5 fw-bold mb-3">
        {heroTitle}
      </h1>
      <p class="lead text-light fs-4">
        {heroLead}
      </p>
    </header>

    <div class="row">
      <aside class="col-lg-3 mb-4">
        <nav class="position-sticky top-0 pt-lg-3" aria-label="利用規約 目次">
          <div class="card bg-dark border border-secondary">
            <div class="card-body">
              <h2 class="h6 text-uppercase fw-semibold mb-3 text-light">
                目次
              </h2>
              <ul class="m-0 ps-4 text-light">
                {#each sections as section (section.id)}
                  <li class="mb-2">
                    <a
                      class="link-light link-underline-opacity-25 link-underline-opacity-75-hover"
                      href={`#${section.id}`}
                    >
                      {section.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </nav>
      </aside>

      <div class="col-lg-9">
        {#each sections as section (section.id)}
          <section id={section.id} class="mb-5">
            <div class="mb-3">
              <span class="badge text-bg-primary text-uppercase">
                {section.id}
              </span>
            </div>
            <h2 class="h3 fw-bold mb-3">{section.title}</h2>
            <ol class="mt-3 lh-lg">
              {#each section.items as item, idx (idx)}
                <li class="mb-2">{item}</li>
              {/each}
            </ol>
          </section>
        {/each}
      </div>
    </div>
  </main>
</div>
