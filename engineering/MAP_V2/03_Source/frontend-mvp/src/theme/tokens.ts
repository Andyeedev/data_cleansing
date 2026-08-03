export const colours = {
  primary: '#4a90d9',
  primaryHover: '#357abd',
  secondary: '#6B7280',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#2563EB',
  text: '#212529',
  textSecondary: '#6c757d',
  bg: '#ffffff',
  bgSecondary: '#f8f9fa',
  surface: '#ffffff',
  border: '#dee2e6',
  sidebar: '#1a1a2e',
  sidebarText: '#e0e0e0',
  sidebarActive: '#4a90d9',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export const typography = {
  size: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    h3: '18px',
    h2: '22px',
    h1: '28px',
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    base: 1.5,
    relaxed: 1.75,
  },
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
} as const;

export const animation = {
  duration: {
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'ease-in-out',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modalBackdrop: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
  skipLink: 700,
} as const;

export const iconSizes = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
} as const;

export const grid = {
  columns: 12,
  gutter: '16px',
  margin: '24px',
} as const;

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
} as const;
