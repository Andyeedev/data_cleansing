

export const kpiStyles = {
  card: {
    base: `
      bg-white
      border border-neutral-30
      rounded-lg
      p-5
      shadow-sm
      hover:shadow-md
      transition-shadow duration-200
    `,
    header: {
      base: 'flex items-center justify-between mb-4',
      icon: 'w-10 h-10 rounded-lg flex items-center justify-center',
      badge: 'px-2 py-1 text-xs font-medium rounded-full',
    },
    value: {
      base: 'text-3xl font-bold text-neutral-100 mb-1',
      prefix: 'text-lg text-neutral-60',
      suffix: 'text-lg text-neutral-60',
    },
    label: {
      base: 'text-sm text-neutral-60',
    },
    trend: {
      positive: 'text-sm text-success-500 flex items-center gap-1',
      negative: 'text-sm text-error-500 flex items-center gap-1',
      neutral: 'text-sm text-neutral-60',
    },
    footer: {
      base: 'mt-4 pt-4 border-t border-neutral-30',
      text: 'text-xs text-neutral-60',
    },
  },
  iconBackgrounds: {
    primary: 'bg-primary-50 text-primary-500',
    secondary: 'bg-secondary-50 text-secondary-600',
    success: 'bg-success-50 text-success-500',
    warning: 'bg-warning-50 text-warning-500',
    error: 'bg-error-50 text-error-500',
    information: 'bg-information-50 text-information-500',
  },
};

export const getKpiCardClasses = () => {
  return kpiStyles.card.base;
};
