

export const dialogStyles = {
  overlay: `
    fixed inset-0
    bg-black/50
    transition-opacity
  `,
  container: `
    fixed inset-0 z-50
    overflow-y-auto
  `,
  position: {
    center: 'flex items-center justify-center p-4',
    top: 'flex items-start justify-center p-4 mt-[10vh]',
    bottom: 'flex items-end justify-center p-4',
  },
  dialog: `
    bg-white
    rounded-lg
    shadow-xl
    w-full
    transform transition-all
  `,
  sizes: {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  },
  header: {
    base: 'px-6 py-4 border-b border-neutral-30',
    title: 'text-lg font-semibold text-neutral-100',
    subtitle: 'text-sm text-neutral-60 mt-1',
    close: 'absolute top-4 right-4 text-neutral-60 hover:text-neutral-100',
  },
  body: {
    base: 'px-6 py-4',
  },
  footer: {
    base: 'px-6 py-4 border-t border-neutral-30 flex items-center justify-end gap-3',
  },
};

export const modalStyles = {
  ...dialogStyles,
  animation: {
    enter: 'transition duration-200 ease-out',
    enterFrom: 'opacity-0 scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'transition duration-100 ease-in',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-95',
  },
};

export const panelStyles = {
  container: `
    fixed inset-y-0 right-0
    w-full max-w-md
    bg-white
    shadow-xl
    transform transition-transform
  `,
  position: {
    left: 'left-0',
    right: 'right-0',
  },
  header: {
    base: 'px-6 py-4 border-b border-neutral-30 flex items-center justify-between',
    title: 'text-lg font-semibold text-neutral-100',
  },
  body: {
    base: 'px-6 py-4 overflow-y-auto flex-1',
  },
  footer: {
    base: 'px-6 py-4 border-t border-neutral-30',
  },
};

export const getDialogClasses = (
  size: keyof typeof dialogStyles.sizes = 'md'
) => {
  return `
    ${dialogStyles.dialog}
    ${dialogStyles.sizes[size]}
  `.trim();
};
