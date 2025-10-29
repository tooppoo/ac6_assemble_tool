export const jaPageIndex = {
  command: {
    random: {
      label: 'ランダム設定',
      description: 'ランダムアセンの<br/>条件を設定する',
    },
    resetLock: {
      label: '全ロック解除',
      description: 'ロックを全て解除する',
    },
    partsList: {
      label: 'パーツ探索',
      description: 'フィルタUIを開く',
    },
    share: {
      label: '共有',
      description: "$t(share:command.target.caption, {'what': '現在のアセン'})",
      text: {
        label: 'コピー',
        description: '現在のアセンブルをコピー',
      },
    },
    report: {
      edit: 'ステータス表示を編集する',
      save: 'ステータス表示を保存する',
      reset: '元に戻す',
      showAll: '全て表示する',
      show: '表示する',
      hide: '表示しない',
    },
    store: {
      label: 'アセン保存',
      description: 'アセンデータを<br/>保存・適用する',
    },
    about: {
      label: 'ツール概要',
      description: 'About ページを開く',
    },
  },
  report: {
    bug: '不具合を報告する',
    request: '改修を依頼する',
  },
  language: {
    label: '言語',
  },
}
