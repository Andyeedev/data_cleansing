

export const scoreStyles = {
  card: {
    base: `
      bg-white
      border border-neutral-30
      rounded-lg
      p-5
      shadow-sm
    `,
    header: {
      base: 'mb-4',
      title: 'text-sm font-medium text-neutral-60',
    },
    score: {
      base: 'flex items-baseline gap-2',
      value: 'text-4xl font-bold text-neutral-100',
      max: 'text-lg text-neutral-60',
    },
    bar: {
      base: 'mt-4 h-2 bg-neutral-20 rounded-full overflow-hidden',
      fill: 'h-full rounded-full transition-all duration-500',
      colours: {
        low: 'bg-error-500',
        medium: 'bg-warning-500',
        high: 'bg-success-500',
      },
    },
    label: {
      base: 'mt-2 text-sm text-neutral-60',
    },
    rating: {
      base: 'mt-4 flex items-center gap-2',
      badge: 'px-3 py-1 text-sm font-medium rounded-full',
    },
  },
  ratingColours: {
    critical: 'bg-error-50 text-error-700',
    high: 'bg-error-50 text-error-700',
    medium: 'bg-warning-50 text-warning-700',
    low: 'bg-success-50 text-success-700',
    minimal: 'bg-neutral-20 text-neutral-700',
  },
};

export const getScoreCardClasses = () => {
  return scoreStyles.card.base;
};
