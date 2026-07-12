import { radiusByComponent } from '../radius';
import { typography } from '../typography';

export const buttonStyles = {
  base: `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  sizes: {
    sm: `
      px-3 py-1.5 text-sm
      ${typography.button.sm.fontSize}
      rounded-${radiusByComponent.button.sm}
    `,
    md: `
      px-4 py-2 text-sm
      ${typography.button.md.fontSize}
      rounded-${radiusByComponent.button.md}
    `,
    lg: `
      px-6 py-3 text-base
      ${typography.button.lg.fontSize}
      rounded-${radiusByComponent.button.lg}
    `,
  },
  variants: {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-600
      active:bg-primary-700
      focus:ring-primary-500
    `,
    secondary: `
      bg-white text-primary-500
      border border-primary-500
      hover:bg-primary-50
      active:bg-primary-100
      focus:ring-primary-500
    `,
    ghost: `
      bg-transparent text-primary-500
      hover:bg-primary-50
      active:bg-primary-100
      focus:ring-primary-500
    `,
    danger: `
      bg-error-500 text-white
      hover:bg-error-600
      active:bg-error-700
      focus:ring-error-500
    `,
    success: `
      bg-success-500 text-white
      hover:bg-success-600
      active:bg-success-700
      focus:ring-success-500
    `,
    warning: `
      bg-warning-500 text-white
      hover:bg-warning-600
      active:bg-warning-700
      focus:ring-warning-500
    `,
  },
  icon: {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  },
};

export const getButtonClasses = (
  variant: keyof typeof buttonStyles.variants = 'primary',
  size: keyof typeof buttonStyles.sizes = 'md',
  fullWidth = false
) => {
  return `
    ${buttonStyles.base}
    ${buttonStyles.sizes[size]}
    ${buttonStyles.variants[variant]}
    ${fullWidth ? 'w-full' : ''}
  `.trim();
};
