# MAP Logo — Brand Spacing & Minimum Size Guide

**Document:** Brand Spacing Guide
**Version:** 2.0 (Refined)
**Date:** June 2026

---

## 1. Clear Space

The clear space is the protected area around the logo that must remain free of any other elements.

### Definition

Clear space is measured using the **convergence node diameter** as the unit.

```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────┐                           │
│   │  X  │  ← X = convergence node  │
│   └─────┘    diameter               │
│                                     │
│         ┌─────────────────┐         │
│         │    LOGO         │         │
│         │  ┌───┐          │         │
│         │  │ ● │← node    │         │
│         │  └───┘          │         │
│         └─────────────────┘         │
│                                     │
│   ← X →                 ← X →      │
│                                     │
│   ← X →                 ← X →      │
│                                     │
└─────────────────────────────────────┘
```

### Minimum Clear Space

| Logo Version | Node Size | Clear Space (1X) |
|--------------|-----------|------------------|
| Full (320×100) | 12px radius | 24px all sides |
| Icon (120×120) | 14px radius | 28px all sides |
| Vertical (160×180) | 12px radius | 24px all sides |
| App Icon (120×120) | N/A (contained) | 0px (rounded rect) |

---

## 2. Minimum Sizes

The logo must remain legible and recognisable at all supported sizes.

### Print Minimum

| Version | Minimum Width | Minimum Height |
|---------|---------------|----------------|
| Full horizontal | 30mm | 10mm |
| Vertical | 15mm | 18mm |
| Icon only | 10mm | 10mm |

### Digital Minimum

| Version | Minimum Width | Minimum Height |
|---------|---------------|----------------|
| Full horizontal | 120px | 38px |
| Vertical | 60px | 68px |
| Icon only | 24px | 24px |
| Favicon | 16px | 16px |
| App icon | 32px | 32px |

### Scalability Reference

| Target Size | Recommended Version |
|-------------|---------------------|
| 16×16 | Favicon (simplified pathways) |
| 32×32 | Favicon |
| 64×64 | Icon only |
| 128×128 | Icon only |
| 256×256 | Full or Icon |
| 512+ | Full horizontal |

---

## 3. Logo Placement

### Website Header

```
┌──────────────────────────────────────────────────────────┐
│  [LOGO]     Home   Platform   Solutions   About    [CTA] │
│  ← 24px →                                                 │
└──────────────────────────────────────────────────────────┘
```

- Logo height: 32-40px
- Left-aligned
- 24px from left edge
- Vertically centred in nav bar

### Presentation Title Slide

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                                                          │
│                    [LOGO - LARGE]                        │
│                      120px height                        │
│                                                          │
│                                                          │
│                                                          │
│                    Presentation Title                    │
│                    Subtitle Text                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- Logo centred
- 120px height for title slides
- 60px from top edge minimum

### Business Card

```
┌────────────────────────────────────┐
│                                    │
│  [LOGO - 30mm width]              │
│                                    │
│                                    │
│  Name                             │
│  Title                            │
│  email@map.com                    │
│  +44 XXX XXX XXXX                 │
│                                    │
└────────────────────────────────────┘
```

- Logo top-left
- 30mm width minimum
- 5mm from top and left edges

---

## 4. Background Rules

### Approved Backgrounds

| Background | Logo Version | Notes |
|------------|--------------|-------|
| White (#FFFFFF) | Full colour | Primary usage |
| Light (#F8FAFC) | Full colour | Acceptable |
| Dark (#111827) | Dark mode | Required |
| Black (#000000) | Inverted | Required |
| Photography | Full with overlay | Dark overlay required |
| Gradient | White text on gradient | App icon only |

### Prohibited Backgrounds

- Busy patterns without overlay
- Low-contrast combinations
- Saturated colours that compete with logo colours
- Transparent backgrounds (use solid white)

---

## 5. Typography Pairing

### Primary Font
- **Family:** Inter
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Logo Typography
| Element | Weight | Size | Letter-spacing | Colour |
|---------|--------|------|----------------|--------|
| "MAP" wordmark | 600 (semibold) | 32px | 1px | #1F2937 |
| Subtitle | 400 (regular) | 12px | 2px | #6B7280 |

### Pairing Rules
- "MAP" and subtitle must align left edge
- Subtitle starts at baseline of "MAP"
- 22px vertical gap between "MAP" baseline and subtitle baseline

---

## 6. File Naming Convention

```
logo-1-refined-[variant].svg
```

| File | Variant |
|------|---------|
| `logo-1-refined-full.svg` | Primary horizontal |
| `logo-1-refined-vertical.svg` | Vertical stacked |
| `logo-1-refined-icon.svg` | Icon only |
| `logo-1-refined-app-icon.svg` | Square app icon |
| `logo-1-refined-favicon.svg` | Browser favicon |
| `logo-1-refined-dark.svg` | Dark mode |
| `logo-1-refined-mono.svg` | Monochrome |
| `logo-1-refined-inverted.svg` | Inverted (white on black) |
| `logo-1-refined-single.svg` | Single colour (black) |

---

*End of Brand Spacing Guide*
