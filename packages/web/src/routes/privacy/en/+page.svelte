<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import Information, {
    type InfoTocItem,
  } from '$lib/view/info/Information.svelte'

  const canonical = appUrl('privacy', 'en')

  const tocItems: readonly InfoTocItem[] = [
    {
      id: 'scope',
      title: 'Article 1 (Scope and Application)',
      paragraphs: [
        'This Privacy Policy (“Policy”) explains how AC6 ASSEMBLE TOOL (“the Service”) handles user information.',
        'By using the Service, you are deemed to agree to this Policy.',
      ],
    },
    {
      id: 'not-collected',
      title: 'Article 2 (Information NOT Collected)',
      paragraphs: [
        'We do not collect personally identifiable information such as name, address, or email.',
        'We do not obtain or store game account or payment information.',
      ],
    },
    {
      id: 'may-collect',
      title: 'Article 3 (Information That May Be Collected)',
      paragraphs: [
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
      paragraphs: [
        'To provide, improve, and maintain the Service',
        'To monitor and troubleshoot errors and ensure security',
        'To analyze usage trends in an aggregated, non-identifiable manner',
      ],
    },
    {
      id: 'third-party',
      title: 'Article 5 (Third-Party Services and Transmission)',
      paragraphs: [
        'We may use Google Analytics / Google Tag Manager. Data handling follows each provider’s privacy policy.',
        'CDN/hosting (e.g., Cloudflare, Vercel, GitHub Pages) may record logs in transit.',
      ],
    },
    {
      id: 'retention',
      title: 'Article 6 (Retention and Management)',
      paragraphs: [
        'Access and error logs without personal identifiers are kept only as long as necessary and then deleted or anonymized.',
        'Data stored in localStorage or cookies can be cleared by users via browser settings.',
      ],
    },
    {
      id: 'choice',
      title: 'Article 7 (User Choices)',
      paragraphs: [
        'You can refuse or delete cookies in browser settings, though some features (e.g., language preference) may not work properly.',
        'You may enable Do Not Track or use blockers to limit tracking.',
      ],
    },
    {
      id: 'disclaimer',
      title: 'Article 8 (Disclaimer)',
      paragraphs: [
        'The operator is not responsible for issues caused by external services or their policy/technical changes.',
        'The operator is not responsible for problems arising from users’ own settings, devices, or networks.',
      ],
    },
    {
      id: 'changes',
      title: 'Article 9 (Changes to the Policy)',
      paragraphs: [
        'The operator may update this Policy when necessary.',
        'Continued use after an update constitutes acceptance of the revised Policy.',
      ],
    },
    {
      id: 'contact',
      title: 'Article 10 (Contact)',
      paragraphs: [
        'Operator: philomagi (Individual)',
        'Contact: via GitHub Issues or X(Twitter).',
      ],
    },
    {
      id: 'date',
      title: 'Effective Date',
      paragraphs: ['2025-11-22'],
    },
  ]

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

<Information
  {heroTitle}
  {heroLead}
  {tocItems}
  tocNavigationLabel="Privacy policy navigation"
  tocHeadingLabel="Contents"
/>
