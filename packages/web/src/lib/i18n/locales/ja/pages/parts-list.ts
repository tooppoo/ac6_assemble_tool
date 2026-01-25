export const jaPartsListPage = {
  navigation: {
    handoff: {
      label: 'アセンに渡す',
      description: '現在の条件で絞ったパーツ候補をアセンページに受け渡します',
      disabledReason:
        '次のスロットの候補が0件です: {{slots}}。フィルタ条件を調整してください。',
    },
  },
  slotSelector: {
    title: 'スロット選択',
    toggle: {
      expand: '展開',
      collapse: '折りたたむ',
    },
  },
  filterPanel: {
    heading: 'フィルタ ({{count}}件)',
    favoritesToggle: {
      active: 'お気に入りのみ表示を解除',
      inactive: 'お気に入りのみ表示',
      ariaLabel: 'お気に入りのみ表示',
    },
    clear: 'クリア',
    toggle: {
      expand: '展開',
      collapse: '折りたたむ',
    },
    filterTypeLabel: 'フィルタ種類',
    filterTypes: {
      numeric: '数値フィルタ',
      name: '名前フィルタ',
      selection: '選択フィルタ',
    },
    property: {
      label: '属性',
      conditionLabel: '条件',
      valueLabel: '値',
      valuePlaceholder: '値を入力',
    },
    name: {
      label: '名前',
      placeholder: 'パーツ名を入力',
      modeLabel: '検索モード',
    },
    selection: {
      attributeLabel: '属性',
      valuesLabel: '値（複数選択可）',
      empty: '選択可能な値がありません',
    },
    add: '追加',
    list: {
      remove: '削除',
      empty: 'フィルタが設定されていません',
    },
  },
  partsGrid: {
    summary: '全 {{count}} 件のパーツを表示中',
  },
  partsCard: {
    favorite: {
      add: 'お気に入りに追加',
      remove: 'お気に入りから削除',
    },
    manufacture: 'メーカー',
    category: 'カテゴリ',
    price: '価格',
    weight: '重量',
    enLoad: 'EN負荷',
  },
  partsDetail: {
    stats: 'ステータス',
  },
  emptyState: {
    message: 'フィルタ条件に一致するパーツが見つかりませんでした',
    hintTitle: 'ヒント',
    hints: [
      'フィルタ条件を緩和してみてください',
      'フィルタをクリアして最初からやり直してください',
    ],
  },
  aboutSection: {
    summary: 'このアプリについて',
    body: {
      p1: 'PARTS LISTは、ARMORED CORE Ⅵ FIRES OF RUBICON に登場する全パーツを、場所を選ばず閲覧できる非公式の検索・絞り込みツールです。ステータス値、パーツ名、カテゴリ、属性など複数の条件を組み合わせて柔軟にフィルタでき、目的に合うパーツを素早く探せるよう設計しています。各項目ごとのソートにも対応しているため、特定のステータスが高い順・低い順で比較したい場合にも便利です。',
      p2: 'また、アセンツールとの連携機能により、絞り込んだパーツのみを使ってそのまま機体構築に進むことができます。膨大なパーツ群から候補を整理し、戦闘スタイルに適した装備を効率的に選び出せるため、ビルド検討の補助として活用できます。',
      p3: '本ツールは FromSoftware およびバンダイナムコエンターテインメントとは関係のないファンメイドの非公式ツールであり、AC6 のプレイをより楽しむための補助として提供されています。',
    },
  },
} as const
