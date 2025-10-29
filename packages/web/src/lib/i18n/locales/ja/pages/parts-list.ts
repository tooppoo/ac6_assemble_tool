export const jaPartsListPage = {
  navigation: {
    handoff: {
      label: 'アセンに渡す',
      description: '現在の条件で絞ったパーツ候補をアセンページに受け渡します',
      disabledReason:
        '次のスロットで候補が0件です: {{slots}}。フィルタ条件を調整してください。',
    },
  },
} as const
