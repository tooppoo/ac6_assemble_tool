import { problemCaptionKeys } from "$lib/view/index/report/model/report";

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
    partsList: {
      label: 'Parts List',
      description: 'Open filter interface',
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
    about: {
      label: 'About',
      description: 'Open about page',
    },
  },
  report: {
    bug: 'Report Bug',
    request: 'Request Change',
    block: {
      [problemCaptionKeys.loadLimitOver]: 'Load limit exceeded',
      [problemCaptionKeys.armsLoadLimitOver]: 'Arms load limit exceeded',
      [problemCaptionKeys.insufficientEnOutput]: 'Insufficient EN output',
    },
  },
  language: {
    label: 'Language',
  },
  aboutSection: {
    summary: 'About This App',
    body: {
      p1: 'AC6 ASSEMBLE TOOL is an unofficial web app designed to make building assemblies for ARMORED CORE VI FIRES OF RUBICON quick and effortless. It favors a simple flow where you swap parts freely and instantly see the resulting stats, prioritizing a “assemble anywhere right away” experience over complex comparisons or heavy optimization. The interface is tuned for comfortable use on mobile so you can try builds in short breaks.',
      p2: 'While assembly focuses on intuitive manipulation, you can lean on the dedicated parts list feature when you need deeper filtering or a comprehensive overview. This helps you explore and shortlist parts efficiently for your preferred play style.',
      p3: 'This tool is an unofficial fan-made project and is not affiliated with FromSoftware or Bandai Namco Entertainment. Feel free to use it as a companion for your gameplay.',
    },
  },
}
