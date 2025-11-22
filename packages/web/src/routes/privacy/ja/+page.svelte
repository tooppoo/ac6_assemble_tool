<script lang="ts">
  import { appUrl } from '$lib/app-url'
  import Information, { type InfoTocItem } from '$lib/view/info/Information.svelte'

  const canonical = appUrl('privacy', 'ja')

  const tocItems: readonly InfoTocItem[] = [
    {
      id: 'scope',
      title: '第1条（総則・適用）',
      paragraphs: [
        '本プライバシーポリシー（以下「本ポリシー」）は、AC6 ASSEMBLE TOOL（以下「本サービス」）における利用者情報の取り扱い方針を定めます。',
        '本サービスの利用者は、本ポリシーに同意したものとみなします。',
      ],
    },
    {
      id: 'not-collected',
      title: '第2条（収集しない情報）',
      paragraphs: [
        '氏名・住所・メールアドレスなど、個人を特定できる情報を本サービス側で収集しません.',
        'ゲームアカウント情報や課金情報を取得・保存しません。',
      ],
    },
    {
      id: 'may-collect',
      title: '第3条（取得する可能性のある情報）',
      paragraphs: [
        'ブラウザ・端末情報（User-Agent や画面サイズなど）',
        'IPアドレス（アクセス解析時に匿名化・短期保持される場合があります）',
        '利用状況データ（アクセス日時、閲覧ページ、クリック計測など。Google Analytics 等の外部解析ツール経由）',
        '言語設定や表示オプションなど、ユーザー体験向上のためのクッキー / localStorage データ',
        'エラーログ（個人を特定しない形の構造化ログのみ）',
      ],
    },
    {
      id: 'purpose',
      title: '第4条（利用目的）',
      paragraphs: [
        '本サービスの提供・改良・品質向上のため',
        '障害対応・セキュリティ確保のための監視・調査',
        '利用動向の統計分析（個人を特定しない形で実施）',
      ],
    },
    {
      id: 'third-party',
      title: '第5条（外部送信・委託）',
      paragraphs: [
        'アクセス解析に Google Analytics / Google Tag Manager を利用する場合があります。取得・利用されるデータの詳細は各サービスのプライバシーポリシーに従います。',
        'CDN / ホスティング（例: Cloudflare, Vercel, GitHub Pages 等）を利用する際、通信経路上でログが記録される場合があります。',
      ],
    },
    {
      id: 'retention',
      title: '第6条（保存期間・管理）',
      paragraphs: [
        '個人を特定しないアクセスログ・エラーログは、目的達成に必要な期間のみ保持し、定期的に削除・匿名化します。',
        'localStorage やクッキーに保存されるデータは、ユーザーがブラウザ設定で削除できます。',
      ],
    },
    {
      id: 'choice',
      title: '第7条（ユーザーの選択）',
      paragraphs: [
        'ブラウザ設定でクッキーの拒否や削除が可能です。ただし、一部機能（言語保持等）が正常に動作しない場合があります。',
        'トラッキング拒否を希望する場合は、ブラウザの Do Not Track 設定や広告ブロッカーを利用できます。',
      ],
    },
    {
      id: 'disclaimer',
      title: '第8条（免責）',
      paragraphs: [
        '外部サービスの障害・仕様変更により発生した問題について、運営者は責任を負いません。',
        'ユーザー自身の設定・端末・ネットワーク環境に起因する不具合について、運営者は責任を負いません。',
      ],
    },
    {
      id: 'changes',
      title: '第9条（ポリシーの変更）',
      paragraphs: [
        '運営者は必要に応じて本ポリシーを改定することがあります。',
        '改定後に本サービスを利用した場合、改定後の内容に同意したものとみなします。',
      ],
    },
    {
      id: 'contact',
      title: '第10条（連絡先）',
      paragraphs: [
        '運営者: philomagi（個人）',
        '連絡先: GitHub Issues または X(Twitter) 経由でご連絡ください。',
      ],
    },
    {
      id: 'date',
      title: '制定日',
      paragraphs: ['2025-11-22'],
    },
  ]

  const heroTitle = 'AC6 ASSEMBLE TOOL | プライバシーポリシー'
  const heroLead =
    '本サービスにおける利用者情報の取り扱い方針を示します。収集しない情報・利用目的・外部送信・保存期間・選択肢などをご確認ください。'

</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <meta property="og:url" content={canonical} />
  <title>AC6 ASSEMBLE TOOL | プライバシーポリシー</title>
  <meta
    property="og:title"
    content="AC6 ASSEMBLE TOOL | プライバシーポリシー"
  />
  <meta
    name="description"
    content="AC6 ASSEMBLE TOOL のプライバシーポリシー（日本語版）。収集する情報、利用目的、外部送信、保存期間、ユーザーの選択肢などを説明します。"
  />
  <meta
    property="og:description"
    content="AC6 ASSEMBLE TOOL のプライバシーポリシー（日本語版）。収集する情報、利用目的、外部送信、保存期間、ユーザーの選択肢などを説明します。"
  />
</svelte:head>

<Information
  {heroTitle}
  {heroLead}
  {tocItems}
  tocNavigationLabel="プライバシーポリシー目次"
  tocHeadingLabel="目次"
/>
