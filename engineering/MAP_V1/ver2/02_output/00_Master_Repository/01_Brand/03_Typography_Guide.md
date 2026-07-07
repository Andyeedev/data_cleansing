# MAP Typography Guide

**Document:** Typography System
**Version:** 1.0
**Date:** June 2026

---

## 1. Font Selection

### Primary Font: Inter

- **Family:** Inter
- **Source:** Google Fonts
- **Weights:** 300, 400, 500, 600, 700
- **License:** Open Font License

### Secondary Font: Segoe UI Variable

- **Family:** Segoe UI Variable
- **Source:** Microsoft
- **Weights:** Light, Regular, Semibold, Bold
- **Use Case:** Microsoft ecosystem compatibility

### Monospace Font: JetBrains Mono

- **Family:** JetBrains Mono
- **Source:** Google Fonts
- **Weights:** 400, 500, 700
- **Use Case:** Code blocks, technical content

### Fallback Stack

```css
font-family: 'Inter', 'Segoe UI Variable', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

---

## 2. Heading Hierarchy

| Level | Size | Weight | Line-height | Letter-spacing | Colour | Usage |
|-------|------|--------|-------------|----------------|--------|-------|
| H1 | 36px | 700 | 1.2 | -0.5px | #1F2937 | Page titles |
| H2 | 30px | 700 | 1.25 | -0.25px | #1F2937 | Section headers |
| H3 | 24px | 600 | 1.3 | 0 | #1F2937 | Subsection headers |
| H4 | 20px | 600 | 1.35 | 0 | #1F2937 | Card titles |
| H5 | 16px | 600 | 1.4 | 0 | #1F2937 | Widget titles |
| H6 | 14px | 600 | 1.4 | 0.5px | #1F2937 | Labels |

---

## 3. Body Text

| Style | Size | Weight | Line-height | Colour | Usage |
|-------|------|--------|-------------|--------|-------|
| Body Large | 18px | 400 | 1.6 | #374151 | Introductions |
| Body | 16px | 400 | 1.5 | #374151 | Standard text |
| Body Small | 14px | 400 | 1.5 | #4B5563 | Secondary text |
| Caption | 12px | 400 | 1.4 | #6B7280 | Labels, captions |

---

## 4. Special Elements

### Buttons

| Element | Size | Weight | Letter-spacing | Transform |
|---------|------|--------|----------------|-----------|
| Button Large | 16px | 600 | 0.5px | none |
| Button Medium | 14px | 600 | 0.5px | none |
| Button Small | 12px | 600 | 0.5px | none |

### Navigation

| Element | Size | Weight | Letter-spacing |
|---------|------|--------|----------------|
| Nav Link | 14px | 500 | 0.25px |
| Nav Active | 14px | 600 | 0.25px |
| Mobile Nav | 16px | 500 | 0 |

### Code

```css
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
font-size: 14px;
line-height: 1.6;
background: #F3F4F6;
padding: 2px 6px;
border-radius: 4px;
```

---

## 5. Spacing

### Line Spacing

| Context | Line-height |
|---------|-------------|
| Headings | 1.2–1.4 |
| Body text | 1.5–1.6 |
| Lists | 1.5 |
| Code | 1.6 |

### Paragraph Spacing

- Margin bottom: 16px (standard)
- Margin bottom: 24px (before headings)

### Letter Spacing

| Context | Spacing |
|---------|---------|
| Headings (large) | -0.5px to -0.25px |
| Headings (small) | 0 to 0.5px |
| Body | 0 |
| Buttons | 0.5px |
| Captions | 0.25px |
| Uppercase labels | 1px |

---

## 6. Responsive Typography

| Breakpoint | H1 | H2 | H3 | Body |
|------------|----|----|----|----|
| Desktop (≥1024px) | 36px | 30px | 24px | 16px |
| Tablet (≥768px) | 30px | 24px | 20px | 16px |
| Mobile (<768px) | 24px | 20px | 18px | 14px |

---

## 7. Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

*End of Typography Guide*
