/* eslint-disable @typescript-eslint/no-explicit-any */
// Temporary augmentation to relax Svelte 5 children typing with Sveltestrap 7.x
// Remove when upstream types include `children` in props or svelte2tsx interop changes.

declare module '@sveltestrap/sveltestrap/dist/Tooltip/Tooltip' {
  interface TooltipProps {
    children?: any
  }
}

declare module '@sveltestrap/sveltestrap/dist/Modal/Modal' {
  interface ModalProps {
    children?: any
  }
}
declare module '@sveltestrap/sveltestrap/dist/ModalHeader/ModalHeader' {
  interface ModalHeaderProps {
    children?: any
  }
}
declare module '@sveltestrap/sveltestrap/dist/ModalBody/ModalBody' {
  interface ModalBodyProps {
    children?: any
  }
}
declare module '@sveltestrap/sveltestrap/dist/ModalFooter/ModalFooter' {
  interface ModalFooterProps {
    children?: any
  }
}

declare module '@sveltestrap/sveltestrap/dist/Dropdown/Dropdown' {
  interface DropdownProps {
    children?: any
  }
}
declare module '@sveltestrap/sveltestrap/dist/DropdownToggle/DropdownToggle' {
  interface DropdownToggleProps {
    children?: any
  }
}
declare module '@sveltestrap/sveltestrap/dist/DropdownMenu/DropdownMenu' {
  interface DropdownMenuProps {
    children?: any
  }
}
declare module '@sveltestrap/sveltestrap/dist/DropdownItem/DropdownItem' {
  interface DropdownItemProps {
    children?: any
  }
}
