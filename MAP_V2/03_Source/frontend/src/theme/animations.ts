export const animations = {
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '1000ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceInOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  transition: {
    all: 'all 200ms ease-in-out',
    colors: 'color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out',
    opacity: 'opacity 200ms ease-in-out',
    shadow: 'box-shadow 200ms ease-in-out',
    transform: 'transform 200ms ease-in-out',
  },
  keyframes: {
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    fadeOut: {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
    slideInFromTop: {
      from: { transform: 'translateY(-100%)' },
      to: { transform: 'translateY(0)' },
    },
    slideInFromBottom: {
      from: { transform: 'translateY(100%)' },
      to: { transform: 'translateY(0)' },
    },
    slideInFromLeft: {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    slideInFromRight: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-25%)' },
    },
    ping: {
      '75%, 100%': { transform: 'scale(2)', opacity: '0' },
    },
  },
  animation: {
    fadeIn: 'fadeIn 200ms ease-in-out',
    fadeOut: 'fadeOut 200ms ease-in-out',
    slideInFromTop: 'slideInFromTop 300ms ease-out',
    slideInFromBottom: 'slideInFromBottom 300ms ease-out',
    slideInFromLeft: 'slideInFromLeft 300ms ease-out',
    slideInFromRight: 'slideInFromRight 300ms ease-out',
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s ease-in-out infinite',
    bounce: 'bounce 1s ease-in-out infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  },
} as const;

export type Animations = typeof animations;
