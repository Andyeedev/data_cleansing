# MAP Logo — Brand Guidelines

**Document:** Logo Brand Guidelines
**Version:** 1.0
**Date:** June 2026

---

## 1. Logo Overview

The MAP (Migration Assurance Platform) logo collection consists of four distinct concepts, each with six variations designed for enterprise SaaS branding.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Trust** | Clean geometric forms convey reliability |
| **Data Integrity** | Structured patterns suggest precision |
| **Governance** | Balanced compositions imply control |
| **Validation** | Convergence points mark verified outcomes |
| **Enterprise** | Professional, minimal aesthetic |
| **Digital Transformation** | Upward movement and connectivity |

---

## 2. Colour Palette

### Primary Colours

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary** | #667EEA | 102, 126, 234 | Main brand colour, primary icon elements |
| **Secondary** | #764BA2 | 118, 75, 162 | Gradient endpoints, secondary elements |
| **Accent** | #3B82F6 | 59, 130, 246 | Highlight cells, accent nodes, CTAs |

### Supporting Colours

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Text Dark** | #1F2937 | 31, 41, 55 | Primary text, wordmarks |
| **Text Medium** | #6B7280 | 107, 114, 128 | Subtitles, secondary text |
| **Dark Background** | #111827 | 17, 24, 39 | Dark mode backgrounds |
| **Light Background** | #F9FAFB | 249, 250, 251 | Page backgrounds |

### Gradient

```css
background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
```

**Usage:** Hero sections, CTA buttons, decorative backgrounds
**Note:** Never apply gradients inside logo symbols — flat vector only

---

## 3. Logo Variations

### 3.1 Full Logo
- **File:** `logo-X-full.svg`
- **Use case:** Website headers, presentations, marketing materials
- **Dimensions:** 280×80px (scalable)
- **Components:** Icon + "MAP" wordmark + subtitle

### 3.2 Icon Only
- **File:** `logo-X-icon.svg`
- **Use case:** App icons, social media profiles, favicons
- **Dimensions:** 80×80px (scalable)
- **Components:** Symbol only

### 3.3 Horizontal
- **File:** `logo-X-horizontal.svg`
- **Use case:** Email signatures, horizontal banners, navigation bars
- **Dimensions:** 320×60px (scalable)
- **Components:** Icon + "MAP" + full name (inline)

### 3.4 Favicon
- **File:** `logo-X-favicon.svg`
- **Use case:** Browser tabs, bookmarks, app shortcuts
- **Dimensions:** 32×32px (scalable)
- **Components:** Simplified symbol only

### 3.5 Dark Mode
- **File:** `logo-X-dark.svg`
- **Use case:** Dark-themed interfaces, dark backgrounds
- **Dimensions:** 280×80px (scalable)
- **Components:** Full logo adapted for dark backgrounds

### 3.6 Monochrome
- **File:** `logo-X-mono.svg`
- **Use case:** Print, single-colour applications, embossing
- **Dimensions:** 280×80px (scalable)
- **Components:** Full logo in grayscale

---

## 4. Logo Concepts

### Logo 1: Convergent Pathways
- **Symbolism:** Three data pathways converging at a validation point
- **Implied letters:** "M" shape from converging lines
- **Best for:** Emphasising data flow and governance

### Logo 2: Data Matrix Mark
- **Symbolism:** Structured grid with highlighted validation cell
- **Implied letters:** "M" from outer columns, "A" from grid structure
- **Best for:** Emphasising data structure and precision

### Logo 3: Arrow Validation
- **Symbolism:** Layered chevrons showing upward transformation
- **Implied letters:** "M" from chevron peaks, "P" from movement
- **Best for:** Emphasising progress and digital transformation

### Logo 4: Structural Node
- **Symbolism:** Connected nodes forming a validation network
- **Implied letters:** "A" from node connections, "P" from structure
- **Best for:** Emphasising connectivity and network governance

---

## 5. Usage Guidelines

### Minimum Size
- **Full logo:** 120px width minimum
- **Icon:** 24px width minimum
- **Favicon:** 16×16px minimum

### Clear Space
- Maintain padding equal to 50% of the icon height around the logo
- Example: For 80px icon, maintain 40px clear space on all sides

### Background Rules
| Background | Logo Version |
|------------|--------------|
| White/Light | Full, Horizontal, or Icon (colour) |
| Dark/Black | Dark mode version |
| Photography | Full logo with white text on dark overlay |
| Single colour | Monochrome version |

### Don'ts
- Don't stretch or distort the logo
- Don't change the colours
- Don't add effects (shadows, glows, 3D)
- Don't place on busy backgrounds without overlay
- Don't rotate the logo
- Don't rearrange icon and wordmark positions

---

## 6. File Structure

```
04_Logo_Creation/
├── logo-1-convergent-pathways/
│   ├── logo-1-full.svg
│   ├── logo-1-icon.svg
│   ├── logo-1-horizontal.svg
│   ├── logo-1-favicon.svg
│   ├── logo-1-dark.svg
│   └── logo-1-mono.svg
├── logo-2-data-matrix/
│   ├── logo-2-full.svg
│   ├── logo-2-icon.svg
│   ├── logo-2-horizontal.svg
│   ├── logo-2-favicon.svg
│   ├── logo-2-dark.svg
│   └── logo-2-mono.svg
├── logo-3-arrow-validation/
│   ├── logo-3-full.svg
│   ├── logo-3-icon.svg
│   ├── logo-3-horizontal.svg
│   ├── logo-3-favicon.svg
│   ├── logo-3-dark.svg
│   └── logo-3-mono.svg
├── logo-4-structural-node/
│   ├── logo-4-full.svg
│   ├── logo-4-icon.svg
│   ├── logo-4-horizontal.svg
│   ├── logo-4-favicon.svg
│   ├── logo-4-dark.svg
│   └── logo-4-mono.svg
├── logo-preview.html
└── Logo-Brand-Guidelines.md
```

---

## 7. Implementation

### HTML Usage
```html
<!-- Full logo -->
<object data="logo-1-convergent-pathways/logo-1-full.svg" type="image/svg+xml" width="280" height="80"></object>

<!-- Icon only -->
<object data="logo-1-convergent-pathways/logo-1-icon.svg" type="image/svg+xml" width="80" height="80"></object>

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="logo-1-convergent-pathways/logo-1-favicon.svg">
```

### CSS Background
```css
.logo {
  background-image: url('logo-1-convergent-pathways/logo-1-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
}
```

### Inline SVG
```html
<svg viewBox="0 0 80 80" width="80" height="80">
  <!-- Paste SVG contents here -->
</svg>
```

---

## 8. recommendations

### For Website
- **Header:** Logo 1 or Logo 4 horizontal version
- **Favicon:** Corresponding favicon version
- **Footer:** Monochrome version

### For Presentations
- **Title slide:** Full logo (colour)
- **Content slides:** Icon only (top-left corner)
- **Thank you slide:** Full logo with contact info

### For Print
- **Business cards:** Monochrome or full colour
- **Letterhead:** Monochrome
- **Brochures:** Full colour

---

*End of Brand Guidelines*
