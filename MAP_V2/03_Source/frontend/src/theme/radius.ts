export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

export const radiusByComponent = {
  button: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  input: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  card: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  },
  badge: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '9999px',
  },
  avatar: {
    sm: '0.25rem',
    md: '9999px',
    lg: '9999px',
  },
  dialog: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
  },
} as const;

export type Radius = typeof radius;
export type RadiusByComponent = typeof radiusByComponent;
