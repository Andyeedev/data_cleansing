

export const alertStyles = {
  base: `
    flex items-start gap-3
    p-4
    rounded-lg
    border
  `,
  variants: {
    info: `
      bg-information-50
      border-information-200
      text-information-800
    `,
    success: `
      bg-success-50
      border-success-200
      text-success-800
    `,
    warning: `
      bg-warning-50
      border-warning-200
      text-warning-800
    `,
    error: `
      bg-error-50
      border-error-200
      text-error-800
    `,
  },
  icon: {
    base: 'flex-shrink-0 mt-0.5',
    info: 'text-information-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
  },
  content: {
    base: 'flex-1',
    title: 'font-medium mb-1',
    description: 'text-sm opacity-90',
  },
  actions: {
    base: 'flex-shrink-0',
    button: 'text-current opacity-70 hover:opacity-100 transition-opacity',
  },
};

export const badgeStyles = {
  base: `
    inline-flex items-center
    px-2.5 py-0.5
    text-xs font-medium
    rounded-full
  `,
  variants: {
    default: 'bg-neutral-20 text-neutral-100',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    error: 'bg-error-50 text-error-700',
    information: 'bg-information-50 text-information-700',
  },
  sizes: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  },
};

export const statusBadgeStyles = {
  active: 'bg-success-50 text-success-700',
  inactive: 'bg-neutral-20 text-neutral-700',
  pending: 'bg-warning-50 text-warning-700',
  error: 'bg-error-50 text-error-700',
  draft: 'bg-neutral-20 text-neutral-700',
};

export const getAlertClasses = (
  variant: keyof typeof alertStyles.variants = 'info'
) => {
  return `
    ${alertStyles.base}
    ${alertStyles.variants[variant]}
  `.trim();
};

export const getBadgeClasses = (
  variant: keyof typeof badgeStyles.variants = 'default',
  size: keyof typeof badgeStyles.sizes = 'md'
) => {
  return `
    ${badgeStyles.base}
    ${badgeStyles.variants[variant]}
    ${badgeStyles.sizes[size]}
  `.trim();
};
