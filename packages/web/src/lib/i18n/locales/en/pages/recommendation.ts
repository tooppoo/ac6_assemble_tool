export const enRecommendationPage = {
  description:
    'Search and recommend parts using AI with natural language. Enter your question to get optimal part suggestions.',
  descriptionNote:
    '(This is β version)',
  slotFilter: {
    label: 'Parts Slot',
    all: 'All',
  },
  queryInput: {
    label: 'Question',
    placeholder: 'e.g., Show me high-firepower lightweight weapons',
  },
  submit: 'Search Recommended Parts',
  result: {
    title: 'Recommendation Results',
    loading: 'AI is searching for recommended parts...',
    empty: 'No search performed yet. Enter a question and search.',
    error: 'Error',
  },
  validation: {
    emptyQuery: 'Please enter a question',
  },
} as const
