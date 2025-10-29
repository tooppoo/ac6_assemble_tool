export const enPartsListPage = {
  navigation: {
    handoff: {
      label: 'Send to Assembly',
      description: 'Send the filtered candidates to the assembly page with the current conditions.',
      disabledReason:
        'No candidates remain for the following slots: {{slots}}. Adjust your filters before sending.',
    },
  },
  slotSelector: {
    title: 'Slot Selection',
    toggle: {
      expand: 'Expand',
      collapse: 'Collapse',
    },
  },
  filterPanel: {
    heading: 'Filters ({{count}})',
    favoritesToggle: {
      active: 'Show all parts',
      inactive: 'Show favorites only',
      ariaLabel: 'Toggle favorite filter',
    },
    clear: 'Clear',
    toggle: {
      expand: 'Expand',
      collapse: 'Collapse',
    },
    filterTypeLabel: 'Filter type',
    filterTypes: {
      property: 'Property filter',
      name: 'Name filter',
      manufacture: 'Manufacturer filter',
      category: 'Category filter',
    },
    property: {
      label: 'Property',
      conditionLabel: 'Condition',
      valueLabel: 'Value',
      valuePlaceholder: 'Enter value',
    },
    name: {
      label: 'Name',
      placeholder: 'Enter part name',
      modeLabel: 'Search mode',
    },
    manufacture: {
      label: 'Manufacturers (multi select)',
    },
    category: {
      label: 'Categories (multi select)',
    },
    add: 'Add',
    list: {
      remove: 'Remove',
      empty: 'No filters applied',
    },
  },
  partsGrid: {
    summary: 'Showing {{count}} parts',
  },
  partsCard: {
    favorite: {
      add: 'Add to favorites',
      remove: 'Remove from favorites',
    },
    manufacture: 'Manufacturer',
    category: 'Category',
    price: 'Price',
    weight: 'Weight',
    enLoad: 'EN Load',
  },
  emptyState: {
    message: 'No parts match your current filters.',
    hintTitle: 'Hints',
    hints: [
      'Try loosening your filter conditions.',
      'Clear filters to start from the default list.',
    ],
  },
} as const
