

export const progressStyles = {
  bar: {
    base: 'w-full bg-neutral-20 rounded-full overflow-hidden',
    sizes: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4',
    },
    fill: {
      base: 'h-full rounded-full transition-all duration-500',
      primary: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
      information: 'bg-information-500',
    },
    animated: 'animate-pulse',
  },
  circular: {
    base: 'relative inline-flex items-center justify-center',
    svg: 'transform -rotate-90',
    track: 'stroke-neutral-20',
    fill: {
      primary: 'stroke-primary-500',
      success: 'stroke-success-500',
      warning: 'stroke-warning-500',
      error: 'stroke-error-500',
    },
    text: {
      base: 'absolute text-sm font-medium text-neutral-100',
    },
  },
  steps: {
    container: 'flex items-center',
    step: {
      base: 'flex items-center',
      circle: {
        base: 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
        active: 'bg-primary-500 text-white',
        completed: 'bg-success-500 text-white',
        pending: 'bg-neutral-20 text-neutral-60',
      },
      line: {
        base: 'flex-1 h-0.5 mx-2',
        active: 'bg-primary-500',
        completed: 'bg-success-500',
        pending: 'bg-neutral-20',
      },
    },
    label: {
      base: 'text-xs text-center mt-2',
      active: 'text-primary-500 font-medium',
      completed: 'text-success-500',
      pending: 'text-neutral-60',
    },
  },
};

export const getProgressBarClasses = (
  size: keyof typeof progressStyles.bar.sizes = 'md',
  _color: keyof typeof progressStyles.bar.fill = 'primary'
) => {
  return `
    ${progressStyles.bar.base}
    ${progressStyles.bar.sizes[size]}
  `.trim();
};

export const getProgressFillClasses = (
  color: keyof typeof progressStyles.bar.fill = 'primary'
) => {
  return `
    ${progressStyles.bar.fill.base}
    ${progressStyles.bar.fill[color]}
  `.trim();
};
