import type { AboutSection } from '$lib/view/about/types'

export const aboutSections: readonly AboutSection[] = [
  {
    id: 'overview',
    title: 'What Is AC6 ASSEMBLE TOOL?',
    lead:
      'AC6 ASSEMBLE TOOL is an unofficial companion web application for ARMORED CORE VI FIRES OF RUBICON. It consolidates the game’s extensive parts catalogue and helps pilots reach the builds they imagine through a platform that emphasizes simplicity and repeatable results.',
    body: [
      'The project focuses on making build exploration effortless. Instead of complex dashboards or heavy simulations, the interface keeps interactions clean and responsive so that users can sketch an idea, lock a few essential components, and immediately see a playable assembly on any device, including smartphones.',
      'Everything happens within a single page. Parts selection, status updates, and result sharing are handled client-side, so checking multiple ideas never requires a context switch or reload. There is no hidden theme detection or automatic goal setting: pilots retain full control by combining filters and locks that reflect the concept they want to pursue. Sharable query parameters make it easy to pass along the exact same build to friends, teams, or tournament partners.',
    ],
  },
  {
    id: 'background',
    title: 'Why the Tool Exists',
    lead:
      'In the ARMORED CORE series, inspiration often strikes outside the game. AC6 ASSEMBLE TOOL aims to make it possible to experiment with loadouts anywhere and at any time, without waiting to boot a console or sit in front of a PC.',
    body: [
      'Every major regulation update forces pilots to rebuild their understanding of parts performance. Historically that knowledge lived in spreadsheets and forum posts, which meant information went stale quickly and recreating the same steps was hard. By storing parts data inside the repository and when necessary refreshing it with visible history, the tool keeps changes transparent and easy to follow.',
      'The development approach prioritizes reproducibility. All calculations are based on public information and community-driven testing; in accordance with FromSoftware’s terms of use, no game data is extracted through reverse engineering. The earliest use cases revolved around “manufacturer-only” runs, attribute-specific restrictions, and pure random assemblies, and those playful constraints continue to guide the project. At the same time, campaign efficiency and role-play centric builds benefit from the same structure.',
    ],
  },
  {
    id: 'features',
    title: 'Key Features and Play Styles',
    lead:
      'The current feature set was shaped by observing how pilots iterate on their machines: lock core ideas, explore alternatives, validate status numbers, and share results.',
    body: [
      'Random assembly generation is primarily designed for challenge runs. Whether you limit yourself to a single manufacturer, an elemental affinity, or simply want the thrill of a surprise loadout, you can anchor the parts that matter and let the remaining slots roll. Many users also treat it as a spark for discovery, picking out the best outcomes to refine manually.',
      'Filtering currently supports manufacturer and damage attribute options. Fine-grained controls such as weight ranges or keyword search are still on the roadmap, so for now the recommendation is to combine locks, filters, and manual adjustments to steer a concept. Future updates will add detailed sorting and richer filter presets to shorten the path from idea to final build.',
    ],
  },
  {
    id: 'data-governance',
    title: 'Keeping Regulations in Sync',
    lead:
      'Trust in a build planner depends on how quickly it reflects balance updates. AC6 ASSEMBLE TOOL follows the latest regulation and documents each refresh so that users know exactly which values drive their assemblies.',
    body: [
      'Whenever a regulation changes, the site publishes the update date and the major adjustments. New or modified parts are highlighted through release notes and social channels so pilots can adjust without digging through multiple sources.',
      'At the moment the tool shows the combined status of your full assembly as soon as parts are selected. Detailed per-part inspection is still under development, together with comparison views that will let you switch between regulations and examine how individual components differ across versions.',
    ],
  },
  {
    id: 'experience',
    title: 'User Experience and Accessibility',
    lead:
      'The interface is built to guide first-time visitors while staying fast for veterans who iterate repeatedly. Dense information is laid out along a natural reading flow, reducing the need for constant scrolling or context shifts.',
    body: [
      'Core actions are grouped by use-case order: define constraints, inspect candidates, save or share. Modal triggers live together on the navigation bar, minimizing visual noise while keeping advanced tools close at hand. Usage metrics—stripped of any personal identifiers—highlight confusing steps so that improvements are always informed by real interaction patterns.',
      'Accessibility checks cover contrast, typography, and keyboard navigation. ARIA attributes are gradually being refined, and the initial build already prepares the infrastructure needed to add more languages through SvelteKit’s context-backed i18n system.',
    ],
  },
  {
    id: 'security',
    title: 'Security and Privacy Approach',
    lead:
      'Even in a hobby project, privacy matters. AC6 ASSEMBLE TOOL is deliberately designed without long-term personal data storage.',
    body: [
      'All inputs stay in the browser; the application reads static data and never sends assemblies to a server. Sharing relies exclusively on query parameters, so players keep full control over what they disclose. Dependencies are pinned and go through a checklist before upgrades land, limiting the risk posed by vulnerable packages.',
      'Diagnostic logs use structured JSON but omit personally identifiable information such as IP addresses. Only the maintainer has access to the logs, and external links are wrapped with safe defaults like `rel="noopener noreferrer"` to guard against clickjacking vectors.',
    ],
  },
  {
    id: 'community',
    title: 'Community Feedback Channels',
    lead:
      'The tool grows alongside its users. Feedback loops are intentionally simple so anyone can report issues or pitch ideas.',
    body: [
      'Bug reports and feature requests share a dedicated in-app entry point that leads to separate forms. Submissions are triaged on a planning board with visible priority and scope, and answers that benefit everyone are published as FAQs to reduce repeated questions.',
      'The GitHub repository uses issue and pull-request templates to streamline contributions. Clear contributing guidelines describe coding conventions, review expectations, and how to demonstrate build scenarios when proposing changes. This ensures that additions—whether from the maintainer or the community—arrive with the same level of care.',
    ],
  },
  {
    id: 'future',
    title: 'Roadmap Highlights',
    lead:
      'The immediate focus is on better discovery tools, followed by richer collaboration features that help squads plan together.',
    body: [
      'Near-term milestones include a dedicated parts index with detailed filtering and sorting controls, plus optional tabbed comparisons that keep multiple assemblies within reach. These additions will make it easier to answer questions like “which generators fit this concept?” without leaving the page.',
      'Further ahead, visual aids that map part synergies and tactical indicators are under evaluation. The long-term vision explores exposing the domain logic through an API so that community-made tools can integrate with the same dataset. Each stage of the roadmap is validated with user surveys and anonymized usage patterns to confirm that the direction still matches what pilots need.',
    ],
  },
] as const
