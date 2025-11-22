<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import Navbar from '$lib/components/layout/Navbar.svelte'

  const canonical = appUrl('privacy', 'en')

  const sections = [
    {
      id: 'scope',
      title: 'Article 1 (Scope and Application)',
      items: [
        'This Privacy Policy (“Policy”) explains how AC6 ASSEMBLE TOOL (“the Service”) handles user information.',
        'By using the Service, you are deemed to agree to this Policy.',
      ],
    },
    {
      id: 'not-collected',
      title: 'Article 2 (Information NOT Collected)',
      items: [
        'We do not collect personally identifiable information such as name, address, or email.',
        'We do not obtain or store game account or payment information.',
      ],
    },
    {
      id: 'may-collect',
      title: 'Article 3 (Information That May Be Collected)',
      items: [
        'Browser / device data (e.g., User-Agent, screen size)',
        'IP address (may be anonymized and retained briefly for analytics)',
        'Usage data (timestamps, visited pages, clicks) via external analytics tools such as Google Analytics / Google Tag Manager',
        'Cookies or localStorage values for language preference or UI options',
        'Error logs (structured logs without personally identifiable data)',
      ],
    },
    {
      id: 'purpose',
      title: 'Article 4 (Purpose of Use)',
      items: [
        'To provide, improve, and maintain the Service',
        'To monitor and troubleshoot errors and ensure security',
        'To analyze usage trends in an aggregated, non-identifiable manner',
      ],
    },
    {
      id: 'third-party',
      title: 'Article 5 (Third-Party Services and Transmission)',
      items: [
        'We may use Google Analytics / Google Tag Manager. Data handling follows each provider’s privacy policy.',
        'CDN/hosting (e.g., Cloudflare, Vercel, GitHub Pages) may record logs in transit.',
      ],
    },
    {
      id: 'retention',
      title: 'Article 6 (Retention and Management)',
      items: [
        'Access and error logs without personal identifiers are kept only as long as necessary and then deleted or anonymized.',
        'Data stored in localStorage or cookies can be cleared by users via browser settings.',
      ],
    },
    {
      id: 'choice',
      title: 'Article 7 (User Choices)',
      items: [
        'You can refuse or delete cookies in browser settings, though some features (e.g., language preference) may not work properly.',
        'You may enable Do Not Track or use blockers to limit tracking.',
      ],
    },
    {
      id: 'disclaimer',
      title: 'Article 8 (Disclaimer)',
      items: [
        'The operator is not responsible for issues caused by external services or their policy/technical changes.',
        'The operator is not responsible for problems arising from users’ own settings, devices, or networks.',
      ],
    },
    {
      id: 'changes',
      title: 'Article 9 (Changes to the Policy)',
      items: [
        'The operator may update this Policy when necessary.',
        'Continued use after an update constitutes acceptance of the revised Policy.',
      ],
    },
    {
      id: 'contact',
      title: 'Article 10 (Contact)',
      items: [
        'Operator: philomagi (Individual)',
        'Contact: via GitHub Issues or X(Twitter).',
      ],
    },
    {
      id: 'date',
      title: 'Effective Date',
      items: ['2025-11-22'],
    },
  ] as const

  const heroTitle = 'AC6 ASSEMBLE TOOL | Privacy Policy'
  const heroLead =
    'How we handle user data: what we do not collect, possible data points, purposes, third-party services, retention, and your choices.'
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <meta property="og:url" content={canonical} />
  <title>AC6 ASSEMBLE TOOL | Privacy Policy</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL | Privacy Policy" />
  <meta
    name="description"
    content="Privacy Policy for AC6 ASSEMBLE TOOL (English). Details on collected data, purposes, third-party services, retention, and user choices."
  />
  <meta
    property="og:description"
    content="Privacy Policy for AC6 ASSEMBLE TOOL (English). Details on collected data, purposes, third-party services, retention, and user choices."
  />
</svelte:head>

<div class="bg-dark text-light min-vh-100">
  <Navbar />

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
        <nav
          class="position-sticky top-0 pt-lg-3"
          aria-label="Privacy policy navigation"
        >
          <div class="card bg-dark border border-secondary">
            <div class="card-body">
              <h2 class="h6 text-uppercase fw-semibold mb-3 text-light">
                Contents
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
