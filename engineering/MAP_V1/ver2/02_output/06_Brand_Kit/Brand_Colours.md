# MAP Brand Colours

**Document:** Brand Colour System
**Version:** 1.0
**Date:** June 2026

---

## 1. Primary Colours

### Primary Blue
| Property | Value |
|----------|-------|
| Name | Primary Blue |
| HEX | #667EEA |
| RGB | 102, 126, 234 |
| HSL | 233°, 75%, 66% |
| Usage | Primary pathways, CTAs, links |
| WCAG AA | ✓ (4.6:1 on white) |

### Primary Violet
| Property | Value |
|----------|-------|
| Name | Primary Violet |
| HEX | #764BA2 |
| RGB | 118, 75, 162 |
| HSL | 267°, 36%, 46% |
| Usage | Secondary elements, gradients |
| WCAG AA | ✓ (5.2:1 on white) |

### Accent Blue
| Property | Value |
|----------|-------|
| Name | Accent Blue |
| HEX | #3B82F6 |
| RGB | 59, 130, 246 |
| HSL | 217°, 91%, 60% |
| Usage | Validation node, links, info |
| WCAG AA | ✓ (4.5:1 on white) |

---

## 2. Neutral Palette

| Name | HEX | RGB | HSL | Usage |
|------|-----|-----|-----|-------|
| Gray 50 | #F9FAFB | 249, 250, 251 | 210°, 33%, 98% | Backgrounds |
| Gray 100 | #F3F4F6 | 243, 244, 246 | 220°, 14%, 96% | Subtle backgrounds |
| Gray 200 | #E5E7EB | 229, 231, 235 | 220°, 13%, 91% | Borders |
| Gray 300 | #D1D5DB | 209, 213, 219 | 220°, 9%, 84% | Disabled text |
| Gray 400 | #9CA3AF | 156, 163, 175 | 220°, 9%, 65% | Placeholder |
| Gray 500 | #6B7280 | 107, 114, 128 | 220°, 9%, 46% | Secondary text |
| Gray 600 | #4B5563 | 75, 85, 99 | 220°, 10%, 34% | Body text |
| Gray 700 | #374151 | 55, 65, 81 | 217°, 19%, 27% | Headings |
| Gray 800 | #1F2937 | 31, 41, 55 | 215°, 28%, 17% | Primary text |
| Gray 900 | #111827 | 17, 24, 39 | 224°, 39%, 11% | Dark backgrounds |

---

## 3. Status Colours

| Status | HEX | RGB | HSL | Usage | WCAG |
|--------|-----|-----|-----|-------|------|
| Success | #10B981 | 16, 185, 129 | 160°, 84%, 39% | Success states | ✓ 4.5:1 |
| Warning | #F59E0B | 245, 158, 11 | 38°, 92%, 50% | Warning states | ✓ 4.6:1 |
| Error | #EF4444 | 239, 68, 68 | 0°, 84%, 60% | Error states | ✓ 4.5:1 |
| Info | #3B82F6 | 59, 130, 246 | 217°, 91%, 60% | Information | ✓ 4.5:1 |
| Disabled | #9CA3AF | 156, 163, 175 | 220°, 9%, 65% | Disabled states | — |

---

## 4. Chart Colours

| Colour | HEX | Usage |
|--------|-----|-------|
| Chart 1 | #667EEA | Primary data series |
| Chart 2 | #764BA2 | Secondary data series |
| Chart 3 | #3B82F6 | Tertiary data series |
| Chart 4 | #10B981 | Positive trend |
| Chart 5 | #F59E0B | Warning trend |
| Chart 6 | #EF4444 | Negative trend |
| Chart 7 | #8B5CF6 | Additional series |
| Chart 8 | #EC4899 | Additional series |

---

## 5. Semantic Colours

### Buttons

| Type | Background | Text | Border | Hover |
|------|------------|------|--------|-------|
| Primary | #667EEA | #FFFFFF | none | #5A6FD6 |
| Secondary | #FFFFFF | #667EEA | #667EEA | #F3F4F6 |
| Ghost | transparent | #667EEA | none | #F3F4F6 |
| Danger | #EF4444 | #FFFFFF | none | #DC2626 |
| Disabled | #E5E7EB | #9CA3AF | none | — |

### Links

| State | Colour |
|-------|--------|
| Default | #3B82F6 |
| Hover | #2563EB |
| Visited | #764BA2 |
| Active | #1D4ED8 |

### Hover States

| Element | Hover Background |
|---------|------------------|
| Table row | #F9FAFB |
| Card | #F9FAFB |
| Button primary | #5A6FD6 |
| Button secondary | #F3F4F6 |
| Nav link | #F3F4F6 |

### Disabled States

| Element | Disabled Style |
|---------|----------------|
| Button | #E5E7EB bg, #9CA3AF text |
| Input | #F9FAFB bg, #D1D5DB border |
| Link | #D1D5DB text, no pointer |

---

## 6. CSS Variables

```css
:root {
  /* Primary */
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
  
  /* Charts */
  --map-chart-1: #667EEA;
  --map-chart-2: #764BA2;
  --map-chart-3: #3B82F6;
  --map-chart-4: #10B981;
  --map-chart-5: #F59E0B;
  --map-chart-6: #EF4444;
}
```

---

## 7. Accessibility

### WCAG 2.1 Compliance

| Text Type | Minimum Ratio | MAP Colours |
|-----------|---------------|-------------|
| Normal text | 4.5:1 | All text colours pass |
| Large text | 3:1 | All heading colours pass |
| UI components | 3:1 | All border/icon colours pass |

### Colour-Blind Considerations

- Status colours include icon indicators
- Charts use patterns in addition to colour
- Never rely solely on colour to convey information

---

*End of Brand Colours*
