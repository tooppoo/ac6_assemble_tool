<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import InfoPageLayout from '$lib/components/layout/InfoPageLayout.svelte'

  const canonical = appUrl('rule', 'en')

  const sections = [
    {
      id: 'application',
      title: 'Article 1 (Application)',
      items: [
        'These Terms apply to all matters related to the use of the Service by users.',
        'Any additional rules or notices defined by the operator constitute part of these Terms.',
      ],
    },
    {
      id: 'service',
      title: 'Article 2 (Description of the Service)',
      items: [
        'The Service is an unofficial assembly support tool for ARMORED CORE Ⅵ FIRES OF RUBICON, providing part browsing, filtering, and assembly generation.',
        'The Service is not affiliated with, endorsed by, or officially related to FromSoftware, Inc. or Bandai Namco Entertainment. It is a non-commercial fan-made project.',
      ],
    },
    {
      id: 'prohibit',
      title: 'Article 3 (Prohibited Acts)',
      items: [
        'Acts that violate laws or public order and morals',
        'Acts that interfere with the operation of the Service',
        'Unauthorized access, hacking, or attempts to alter data',
        'Placing excessive load on servers or networks',
        'Commercial redistribution or reuse of the Service',
        'Unauthorized acquisition or modification of the Service’s data or code',
        'Any other acts deemed inappropriate by the operator',
      ],
    },
    {
      id: 'ipr',
      title: 'Article 4 (Intellectual Property Rights)',
      items: [
        'Copyrights and intellectual property rights for parts data, images, text, and program code displayed in the Service belong to their respective rights holders.',
        'All AC6-related names, data, and assets belong to FromSoftware, Inc. and Bandai Namco Entertainment.',
        'Users may not reproduce, redistribute, or modify the Service’s content without permission from the rights holders.',
      ],
    },
    {
      id: 'change',
      title: 'Article 5 (Modification and Suspension of the Service)',
      items: [
        'The operator may modify, suspend, or terminate the Service without prior notice.',
        'The operator is not liable for any damages arising from such modification, suspension, or termination.',
      ],
    },
    {
      id: 'disclaimer',
      title: 'Article 6 (Disclaimer)',
      items: [
        'The Service is provided “as is” without guarantees regarding accuracy, completeness, or up-to-dateness.',
        'The operator assumes no responsibility for any damages arising from use of the Service.',
        'Calculations, displayed values, and generated assemblies may not perfectly reproduce official game specifications.',
        'The operator is not liable for issues caused by external services (Cloudflare / GitHub / Google, etc.).',
      ],
    },
    {
      id: 'privacy',
      title: 'Article 7 (Handling of Personal Information)',
      items: [
        'The Service does not collect personal information from users.',
        'External analytics tools such as Google Analytics or Google Tag Manager may be used.',
        'Data collected by these external services is governed by their respective privacy policies.',
      ],
    },
    {
      id: 'revision',
      title: 'Article 8 (Changes to the Terms)',
      items: [
        'The operator may revise these Terms as necessary.',
        'Continued use of the Service after revisions constitutes acceptance of the updated Terms.',
      ],
    },
    {
      id: 'law',
      title: 'Article 9 (Governing Law and Jurisdiction)',
      items: [
        'These Terms are governed by the laws of Japan.',
        'Disputes shall be subject to the exclusive jurisdiction of the court with authority over the operator’s location.',
      ],
    },
    {
      id: 'date',
      title: 'Effective Date',
      items: ['2025-11-22', 'Operator: philomagi (Individual)'],
    },
  ] as const

  const heroTitle = 'AC6 ASSEMBLE TOOL | Terms of Use'
  const heroLead =
    'These Terms outline the conditions of use, prohibited acts, intellectual property, and disclaimers. Please read before using the Service.'

  const tocItems = sections.map((section) => ({
    id: section.id,
    title: section.title,
  }))
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <meta property="og:url" content={canonical} />
  <title>AC6 ASSEMBLE TOOL | Terms of Use</title>
  <meta property="og:title" content="AC6 ASSEMBLE TOOL | Terms of Use" />
  <meta
    name="description"
    content="Terms of Use for AC6 ASSEMBLE TOOL (English). Outlines service description, prohibited acts, intellectual property, disclaimers, and data handling."
  />
  <meta
    property="og:description"
    content="Terms of Use for AC6 ASSEMBLE TOOL (English). Outlines service description, prohibited acts, intellectual property, disclaimers, and data handling."
  />
</svelte:head>

<InfoPageLayout
  {heroTitle}
  {heroLead}
  {tocItems}
  tocNavigationLabel="Terms navigation"
  tocHeadingLabel="Contents"
>
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
</InfoPageLayout>
