# MAP Developer Design Tokens

**Document:** Developer Implementation Guide
**Version:** 1.0
**Date:** June 2026

---

## 1. CSS Variables

```css
:root {
  /* Colours */
  --map-primary: #667EEA;
  --map-primary-hover: #5A6FD6;
  --map-secondary: #764BA2;
  --map-accent: #3B82F6;
  
  /* Neutral */
  --map-gray-50: #F9FAFB;
  --map-gray-100: #F3F4F6;
  --map-gray-200: #E5E7EB;
  --map-gray-300: #D1D5DB;
  --map-gray-400: #9CA3AF;
  --map-gray-500: #6B7280;
  --map-gray-600: #4B5563;
  --map-gray-700: #374151;
  --map-gray-800: #1F2937;
  --map-gray-900: #111827;
  
  /* Status */
  --map-success: #10B981;
  --map-success-light: #ECFDF5;
  --map-warning: #F59E0B;
  --map-warning-light: #FFFBEB;
  --map-error: #EF4444;
  --map-error-light: #FEF2F2;
  --map-info: #3B82F6;
  --map-info-light: #EFF6FF;
  
  /* Spacing */
  --map-space-1: 4px;
  --map-space-2: 8px;
  --map-space-3: 12px;
  --map-space-4: 16px;
  --map-space-5: 20px;
  --map-space-6: 24px;
  --map-space-8: 32px;
  --map-space-10: 40px;
  --map-space-12: 48px;
  --map-space-16: 64px;
  
  /* Border Radius */
  --map-radius-sm: 4px;
  --map-radius-md: 6px;
  --map-radius-lg: 8px;
  --map-radius-xl: 12px;
  --map-radius-full: 9999px;
  
  /* Shadows */
  --map-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --map-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --map-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --map-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  
  /* Typography */
  --map-font-family: 'Inter', system-ui, sans-serif;
  --map-font-mono: 'JetBrains Mono', monospace;
  
  /* Transitions */
  --map-transition-fast: 150ms ease;
  --map-transition-normal: 250ms ease;
  --map-transition-slow: 350ms ease;
}
```

---

## 2. Tailwind Config

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        map: {
          primary: '#667EEA',
          'primary-hover': '#5A6FD6',
          secondary: '#764BA2',
          accent: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          }
        }
      },
      spacing: {
        'map-1': '4px',
        'map-2': '8px',
        'map-3': '12px',
        'map-4': '16px',
        'map-5': '20px',
        'map-6': '24px',
        'map-8': '32px',
        'map-10': '40px',
        'map-12': '48px',
        'map-16': '64px',
      },
      borderRadius: {
        'map-sm': '4px',
        'map-md': '6px',
        'map-lg': '8px',
        'map-xl': '12px',
      },
      boxShadow: {
        'map-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'map-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'map-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'map-xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        map: ['Inter', 'system-ui', 'sans-serif'],
        'map-mono': ['JetBrains Mono', 'monospace'],
      },
      transitionDuration: {
        'map-fast': '150ms',
        'map-normal': '250ms',
        'map-slow': '350ms',
      }
    }
  }
}
```

---

*End of Developer Design Tokens*
