# Batch 18 — Figma Data Export

**Purpose:** Design tokens and component specifications for Figma import
**Format:** JSON tokens + component specs
**Source:** 02_Dashboard_Data/ + Module 00 Master Configuration

---

## Design Tokens

### Colours
```json
{
  "primary": "#0078D4",
  "secondary": "#003B75",
  "success": "#107C10",
  "warning": "#FFB900",
  "critical": "#D13438",
  "info": "#5C2D91",
  "background": "#F8F9FB",
  "border": "#E5E7EB",
  "text_primary": "#0B2447",
  "text_secondary": "#6B7280",
  "text_muted": "#9CA3AF"
}
```

### Typography
```json
{
  "font_family": "Segoe UI, Arial, sans-serif",
  "heading_lg": { "size": "18px", "weight": "700", "color": "#0B2447" },
  "heading_md": { "size": "14px", "weight": "700", "color": "#0B2447" },
  "heading_sm": { "size": "13px", "weight": "600", "color": "#374151" },
  "body": { "size": "13px", "weight": "400", "color": "#374151" },
  "caption": { "size": "11px", "weight": "400", "color": "#6B7280" },
  "label": { "size": "11px", "weight": "600", "color": "#6B7280", "text_transform": "uppercase", "letter_spacing": "0.5px" }
}
```

### Spacing
```json
{
  "xs": "4px",
  "sm": "8px",
  "md": "12px",
  "lg": "16px",
  "xl": "20px",
  "xxl": "24px",
  "xxxl": "32px"
}
```

### Border Radius
```json
{
  "sm": "4px",
  "md": "8px",
  "lg": "10px",
  "xl": "12px"
}
```

### Shadows
```json
{
  "card": "0 1px 3px rgba(0,0,0,0.04)",
  "card_hover": "0 4px 12px rgba(0,120,212,0.12)"
}
```

---

## Component Specifications

### KPI Card
- **Width:** 160-200px (auto-fit grid)
- **Height:** ~80px
- **Border:** 1px solid #E5E7EB
- **Border-left:** 4px solid (varies by status)
- **Border-radius:** 10px
- **Padding:** 16px
- **Status colours:** success=#107C10, error=#D13438, warning=#FFB900, info=#5C2D91

### Data Table
- **Header:** background #F8F9FB, text #6B7280, font-size 11px, uppercase
- **Row:** padding 10px 12px, border-bottom 1px solid #F3F4F6
- **Row hover:** background #F8F9FB

### Status Badge
- **Padding:** 3px 8px
- **Border-radius:** 4px
- **Font-size:** 11px, weight 600
- **Success:** background #E6F4E6, color #107C10
- **Error:** background #FDECEA, color #D13438
- **Warning:** background #FFF4CE, color #8B6914
- **Info:** background #E8E0F0, color #5C2D91

### Chart Container
- **Width:** 100%
- **Height:** 280px
- **Chart.js:** v4.4.7

### Sidebar
- **Width:** 240px
- **Background:** #0B2447
- **Nav-item:** padding 10px 20px, font-size 13px
- **Active:** background rgba(0,120,212,0.15), border-left 3px solid #0078D4

### Top Bar
- **Height:** 64px
- **Background:** #fff
- **Border-bottom:** 1px solid #E5E7EB

---

## Figma Import Notes

1. Create a new Figma file with "MAP Nexus Dashboard" title
2. Import design tokens as Figma variables
3. Create component library with KPI Card, Data Table, Status Badge, Chart Container
4. Use auto-layout for KPI grid and card grid
5. Apply Module 00 colour palette throughout
