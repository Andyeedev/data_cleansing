

export const trendStyles = {
  card: {
    base: `
      bg-white
      border border-neutral-30
      rounded-lg
      p-4
      shadow-sm
    `,
    header: {
      base: 'flex items-center justify-between mb-2',
      title: 'text-sm font-medium text-neutral-60',
      icon: 'w-5 h-5 text-neutral-60',
    },
    value: {
      base: 'text-2xl font-bold text-neutral-100',
    },
    change: {
      positive: 'text-sm text-success-500',
      negative: 'text-sm text-error-500',
      neutral: 'text-sm text-neutral-60',
    },
    period: {
      base: 'text-xs text-neutral-60 mt-1',
    },
    chart: {
      base: 'mt-4 h-20',
    },
  },
};

export const getTrendCardClasses = () => {
  return trendStyles.card.base;
};
