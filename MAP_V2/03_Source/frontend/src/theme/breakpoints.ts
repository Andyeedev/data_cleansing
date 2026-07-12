export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const mediaQueries = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  'max-sm': '(max-width: 639px)',
  'max-md': '(max-width: 767px)',
  'max-lg': '(max-width: 1023px)',
  'max-xl': '(max-width: 1279px)',
  'max-2xl': '(max-width: 1535px)',
} as const;

export const responsive = {
  mobile: {
    maxWidth: '639px',
    padding: '1rem',
    fontSize: {
      heading: '1.5rem',
      subtitle: '1rem',
      body: '0.875rem',
    },
  },
  tablet: {
    minWidth: '640px',
    maxWidth: '1023px',
    padding: '1.5rem',
    fontSize: {
      heading: '1.75rem',
      subtitle: '1.125rem',
      body: '1rem',
    },
  },
  desktop: {
    minWidth: '1024px',
    padding: '2rem',
    fontSize: {
      heading: '2.25rem',
      subtitle: '1.25rem',
      body: '1rem',
    },
  },
} as const;

export type Breakpoints = typeof breakpoints;
export type MediaQueries = typeof mediaQueries;
export type Responsive = typeof responsive;
