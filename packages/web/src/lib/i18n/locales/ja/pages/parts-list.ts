export const jaPartsListPage = {
  navigation: {
    handoff: {
      label: 'アセンに渡す',
      description: '現在の条件で絞ったパーツ候補をアセンページに受け渡します',
      disabledReason:
        '次のスロットで候補が0件です: {{slots}}。フィルタ条件を調整してください。',
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
      property: '属性値検索',
      name: '名前検索',
      manufacture: 'メーカー検索',
      category: 'カテゴリ検索',
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
    manufacture: {
      label: 'メーカー（複数選択可）',
    },
    category: {
      label: 'カテゴリ（複数選択可）',
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
  emptyState: {
    message: 'フィルタ条件に一致するパーツが見つかりませんでした',
    hintTitle: 'ヒント',
    hints: [
      'フィルタ条件を緩和してみてください',
      'フィルタをクリアして最初からやり直してください',
    ],
  },
} as const
