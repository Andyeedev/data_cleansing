import { shadowByComponent } from '../shadows';

export const cardStyles = {
  base: `
    bg-white
    border border-neutral-30
    rounded-lg
    transition-all duration-200
  `,
  variants: {
    default: `
      ${shadowByComponent.card.default}
      hover:${shadowByComponent.card.hover}
    `,
    interactive: `
      ${shadowByComponent.card.default}
      hover:${shadowByComponent.card.hover}
      hover:border-primary-500
      cursor-pointer
    `,
    outlined: `
      border-2 border-neutral-30
      hover:border-primary-500
    `,
    elevated: `
      ${shadowByComponent.card.hover}
    `,
  },
  padding: {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  },
  header: {
    base: 'border-b border-neutral-30 px-5 py-4',
    title: 'text-lg font-semibold text-neutral-100',
    subtitle: 'text-sm text-neutral-60',
  },
  body: {
    base: 'px-5 py-4',
  },
  footer: {
    base: 'border-t border-neutral-30 px-5 py-4',
  },
};

export const getCardClasses = (
  variant: keyof typeof cardStyles.variants = 'default',
  padding: keyof typeof cardStyles.padding = 'md'
) => {
  return `
    ${cardStyles.base}
    ${cardStyles.variants[variant]}
    ${cardStyles.padding[padding]}
  `.trim();
};

export const kpiCardStyles = {
  base: `
    bg-white
    border border-neutral-30
    rounded-lg
    p-5
    ${shadowByComponent.card.default}
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
};
