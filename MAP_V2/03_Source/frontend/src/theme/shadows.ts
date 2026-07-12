export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

export const shadowByComponent = {
  card: {
    default: shadows.sm,
    hover: shadows.md,
    active: shadows.lg,
  },
  button: {
    default: shadows.xs,
    hover: shadows.sm,
    active: shadows.xs,
  },
  input: {
    default: shadows.none,
    focus: `0 0 0 3px rgba(0, 120, 212, 0.25)`,
  },
  dropdown: {
    default: shadows.lg,
  },
  dialog: {
    default: shadows.xl,
  },
  tooltip: {
    default: shadows.md,
  },
  header: {
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  sidebar: {
    default: '1px 0 3px 0 rgba(0, 0, 0, 0.1)',
  },
} as const;

export type Shadows = typeof shadows;
export type ShadowByComponent = typeof shadowByComponent;
