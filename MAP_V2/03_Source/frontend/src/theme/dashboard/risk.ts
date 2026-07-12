

export const riskStyles = {
  rating: {
    base: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
    colours: {
      critical: 'bg-error-100 text-error-800 border border-error-200',
      high: 'bg-error-50 text-error-700',
      medium: 'bg-warning-50 text-warning-700',
      low: 'bg-success-50 text-success-700',
      minimal: 'bg-neutral-20 text-neutral-700',
    },
  },
  matrix: {
    container: 'grid grid-cols-5 gap-1',
    cell: {
      base: 'aspect-square flex items-center justify-center text-xs font-medium rounded',
      critical: 'bg-error-500 text-white',
      high: 'bg-error-400 text-white',
      medium: 'bg-warning-400 text-white',
      low: 'bg-warning-200 text-warning-800',
      minimal: 'bg-success-200 text-success-800',
      empty: 'bg-neutral-100 text-neutral-60',
    },
    label: {
      base: 'text-xs text-neutral-60 text-center',
      x: 'col-span-5 text-center text-sm font-medium text-neutral-100 mt-2',
      y: 'row-span-5 text-center text-sm font-medium text-neutral-100 -rotate-90',
    },
  },
  indicator: {
    base: 'flex items-center gap-2',
    dot: 'w-3 h-3 rounded-full',
    label: 'text-sm text-neutral-100',
  },
  alert: {
    base: 'flex items-start gap-3 p-4 rounded-lg border',
    colours: {
      critical: 'bg-error-50 border-error-200',
      high: 'bg-error-50 border-error-200',
      medium: 'bg-warning-50 border-warning-200',
      low: 'bg-success-50 border-success-200',
    },
    icon: 'w-5 h-5 flex-shrink-0 mt-0.5',
    content: 'flex-1',
    title: 'font-medium',
    description: 'text-sm opacity-90 mt-1',
  },
};

export const getRiskRatingClasses = (
  level: keyof typeof riskStyles.rating.colours = 'medium'
) => {
  return `
    ${riskStyles.rating.base}
    ${riskStyles.rating.colours[level]}
  `.trim();
};
