export const enPageIndex = {
  command: {
    random: {
      label: 'Random Config',
      description: 'Configure Random Assemble',
    },
    resetLock: {
      label: 'Reset Locks',
      description: 'Reset All Locks',
    },
    filterForWhole: {
      label: 'Filter',
      description: 'Set filter for whole of assembly',
    },
    share: {
      label: 'Share',
      description:
        "$t(share:command.target.caption, {'what': 'Current Assembly'})",
      text: {
        label: 'Copy',
        description: 'Copy current assembly',
      },
    },
    report: {
      edit: 'Edit status view',
      save: 'Apply status view',
      reset: 'Rollback',
      showAll: 'Show all',
      show: 'Show',
      hide: 'Hide',
    },
    store: {
      label: 'Store',
      description: 'Store Assembly and Apply',
    },
  },
  report: {
    bug: 'Report Bug',
    request: 'Request Change',
  },
  language: {
    label: 'Language',
  },
}
