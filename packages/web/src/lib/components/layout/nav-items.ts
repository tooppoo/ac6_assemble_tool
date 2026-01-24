export interface NavItem {
  path: string
  labelKey: string
}

export const navItems: NavItem[] = [
  { path: '/', labelKey: 'globalNav.assembly' },
  { path: '/parts-list', labelKey: 'globalNav.parts' },
  { path: '/recommendation', labelKey: 'globalNav.ai' },
]

export const isActiveNavItem = (
  itemPath: string,
  currentPath: string,
): boolean => itemPath === currentPath
