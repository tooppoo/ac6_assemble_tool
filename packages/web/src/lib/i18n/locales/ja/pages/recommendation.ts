export const jaRecommendationPage = {
  description:
    'AIを使って自然言語でパーツを検索・オススメします。質問を入力すると、最適なパーツを提案します。',
  slotFilter: {
    label: 'パーツスロット',
    all: 'すべて',
  },
  queryInput: {
    label: '質問',
    placeholder: '例: 高火力で軽量な武器を教えて',
  },
  submit: '推奨パーツを検索',
  result: {
    title: '検索結果',
    loading: 'AIが推奨パーツを検索中...',
    empty: 'まだ検索されていません。質問を入力して検索してください。',
    error: 'エラー',
  },
  validation: {
    emptyQuery: '質問を入力してください',
  },
} as const