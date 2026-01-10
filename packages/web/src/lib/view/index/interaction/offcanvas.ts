
export interface OffcanvasStatus {
  openRandomAssembly: boolean
  openShare: boolean
  openAssemblyStore: boolean
}

export function closeOffcanvas(): OffcanvasStatus {
  return {
    openRandomAssembly: false,
    openShare: false,
    openAssemblyStore: false,
  }
}

export function openRandomAssembly(): OffcanvasStatus {
  return {
    openRandomAssembly: true,
    openShare: false,
    openAssemblyStore: false,
  }
}
export function openShare(): OffcanvasStatus {
  return {
    openRandomAssembly: false,
    openShare: true,
    openAssemblyStore: false,
  }
}
export function openAssemblyStore(): OffcanvasStatus {
  return {
    openRandomAssembly: false,
    openShare: false,
    openAssemblyStore: true,
  }
}
