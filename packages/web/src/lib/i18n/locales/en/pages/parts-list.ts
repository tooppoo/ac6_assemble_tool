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
      numeric: 'Numeric Filter',
      name: 'Name Filter',
      selection: 'Selection Filter',
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
    selection: {
      attributeLabel: 'Attribute',
      valuesLabel: 'Values (multi select)',
      empty: 'No selectable values available',
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
  partsDetail: {
    stats: 'Stats',
  },
  emptyState: {
    message: 'No parts match your current filters.',
    hintTitle: 'Hints',
    hints: [
      'Try loosening your filter conditions.',
      'Clear filters to start from the default list.',
    ],
  },
  aboutSection: {
    summary: 'About This App',
    body: {
      p1: 'PARTS LIST is an unofficial search and filtering tool that lets you browse every part from ARMORED CORE VI FIRES OF RUBICON wherever you are. You can flexibly combine multiple conditions—stats, part name, category, attributes—to quickly narrow down candidates, and per-column sorting helps when you want to compare by highest or lowest values.',
      p2: 'The app links with the assembly tool so you can move straight into building with only the filtered parts. It helps you trim the huge part pool and efficiently pick equipment that fits your combat style, supporting your build exploration.',
      p3: 'This tool is an unofficial fan-made project and is not affiliated with FromSoftware or Bandai Namco Entertainment. It is offered as a helper to enjoy AC6 more.',
    },
  },
} as const
