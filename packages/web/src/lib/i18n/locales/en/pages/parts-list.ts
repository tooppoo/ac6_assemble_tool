export const enPartsListPage = {
  navigation: {
    handoff: {
      label: 'Send to Assembly',
      description:
        'Send the filtered candidates to the assembly page with the current conditions.',
      disabledReason:
        'No candidates remain for the following slots: {{slots}}. Adjust your filters before sending.',
    },
  },
} as const
