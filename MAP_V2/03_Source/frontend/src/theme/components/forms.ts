

export const formStyles = {
  label: {
    base: 'block text-sm font-medium text-neutral-100 mb-1',
    required: 'text-error-500 ml-1',
  },
  input: {
    base: `
      w-full px-3 py-2
      text-sm text-neutral-100
      bg-white
      border border-neutral-30
      rounded-md
      placeholder-neutral-50
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:bg-neutral-20 disabled:cursor-not-allowed
    `,
    error: `
      border-error-500
      focus:ring-error-500 focus:border-transparent
    `,
    success: `
      border-success-500
      focus:ring-success-500 focus:border-transparent
    `,
  },
  textarea: {
    base: `
      w-full px-3 py-2
      text-sm text-neutral-100
      bg-white
      border border-neutral-30
      rounded-md
      placeholder-neutral-50
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:bg-neutral-20 disabled:cursor-not-allowed
      resize-y min-h-[100px]
    `,
  },
  select: {
    base: `
      w-full px-3 py-2
      text-sm text-neutral-100
      bg-white
      border border-neutral-30
      rounded-md
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:bg-neutral-20 disabled:cursor-not-allowed
    `,
  },
  checkbox: {
    base: `
      h-4 w-4
      text-primary-500
      border-neutral-300
      rounded
      focus:ring-primary-500
      transition-colors duration-200
    `,
    label: 'ml-2 text-sm text-neutral-100',
  },
  radio: {
    base: `
      h-4 w-4
      text-primary-500
      border-neutral-300
      focus:ring-primary-500
      transition-colors duration-200
    `,
    label: 'ml-2 text-sm text-neutral-100',
  },
  switch: {
    base: `
      relative inline-flex h-6 w-11 items-center
      rounded-full transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    `,
    active: 'bg-primary-500',
    inactive: 'bg-neutral-40',
    toggle: `
      inline-block h-4 w-4 transform
      rounded-full bg-white
      transition-transform duration-200
    `,
  },
  helper: {
    base: 'mt-1 text-sm text-neutral-60',
    error: 'mt-1 text-sm text-error-500',
    success: 'mt-1 text-sm text-success-500',
  },
  fieldset: {
    base: 'border border-neutral-30 rounded-lg p-4',
    legend: 'text-sm font-medium text-neutral-100 px-2',
  },
};

export const getInputClasses = (
  hasError = false,
  hasSuccess = false
) => {
  let classes = formStyles.input.base;
  if (hasError) classes += ' ' + formStyles.input.error;
  if (hasSuccess) classes += ' ' + formStyles.input.success;
  return classes.trim();
};
