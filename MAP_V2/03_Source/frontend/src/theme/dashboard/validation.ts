

export const validationStyles = {
  status: {
    base: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
    colours: {
      passed: 'bg-success-50 text-success-700',
      failed: 'bg-error-50 text-error-700',
      warning: 'bg-warning-50 text-warning-700',
      pending: 'bg-neutral-20 text-neutral-700',
      running: 'bg-information-50 text-information-700',
    },
  },
  indicator: {
    base: 'flex items-center gap-2',
    icon: {
      base: 'w-5 h-5',
      passed: 'text-success-500',
      failed: 'text-error-500',
      warning: 'text-warning-500',
      pending: 'text-neutral-60',
      running: 'text-information-500',
    },
    label: 'text-sm text-neutral-100',
  },
  card: {
    base: `
      bg-white
      border border-neutral-30
      rounded-lg
      p-4
      shadow-sm
    `,
    header: {
      base: 'flex items-center justify-between mb-3',
      title: 'text-sm font-medium text-neutral-100',
      status: 'text-xs',
    },
    progress: {
      base: 'flex items-center gap-3',
      bar: 'flex-1 h-2 bg-neutral-20 rounded-full overflow-hidden',
      fill: 'h-full rounded-full transition-all duration-500',
      text: 'text-sm text-neutral-60 min-w-[3rem] text-right',
    },
    stats: {
      base: 'grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-30',
      item: 'text-center',
      value: 'text-lg font-semibold text-neutral-100',
      label: 'text-xs text-neutral-60',
    },
  },
  rule: {
    base: 'flex items-start gap-3 p-3 rounded-lg border border-neutral-30',
    icon: 'w-5 h-5 flex-shrink-0 mt-0.5',
    content: 'flex-1',
    name: 'text-sm font-medium text-neutral-100',
    description: 'text-xs text-neutral-60 mt-1',
    status: 'text-xs',
  },
};

export const getValidationStatusClasses = (
  status: keyof typeof validationStyles.status.colours = 'pending'
) => {
  return `
    ${validationStyles.status.base}
    ${validationStyles.status.colours[status]}
  `.trim();
};
