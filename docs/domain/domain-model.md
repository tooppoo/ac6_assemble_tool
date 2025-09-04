```mermaid
flowchart TD
  subgraph UI[UI Components]
    BTN[Button]
    ICONBTN[IconButton]
    SWITCH[Switch]
    TOOLTIP[Tooltip]
    LANG[LanguageForm]
  end

  subgraph Reactivity[Reactivity]
    STATE[$state]
    DERIVED[$derived]
    EFFECT[$effect]
  end

  subgraph Events[Events & Binding]
    DOMEV[DOM events (onclick,...)]
    CBP[Callback props]
    BIND[$bindable + bind:]
  end

  UI --> DOMEV
  UI --> CBP
  UI --> BIND

  DOMEV --> EFFECT
  CBP --> STATE
  BIND --> STATE
  STATE --> DERIVED
  DERIVED --> UI

  subgraph Platform[Platform]
    SK[SvelteKit 2.x]
    VITE[Vite + vite-plugin-svelte]
    CF[Cloudflare Pages + D1]
  end

  UI --> SK --> CF
  SK --> VITE
```

