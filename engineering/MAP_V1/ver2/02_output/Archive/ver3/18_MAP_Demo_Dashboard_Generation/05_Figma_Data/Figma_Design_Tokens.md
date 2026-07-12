# Batch 18 — Figma Design Tokens

**Purpose:** Figma-compatible design tokens and component specs

---

## Design Tokens

```json
{
  "colours": {
    "primary": "#0078D4",
    "secondary": "#003B75",
    "success": "#107C10",
    "warning": "#FFB900",
    "critical": "#D13438",
    "info": "#5C2D91",
    "background": "#F8F9FB",
    "border": "#E5E7EB"
  },
  "typography": {
    "font": "Segoe UI, Arial, sans-serif",
    "heading_lg": { "size": 18, "weight": 700 },
    "heading_md": { "size": 14, "weight": 700 },
    "heading_sm": { "size": 13, "weight": 600 },
    "body": { "size": 13, "weight": 400 },
    "caption": { "size": 11, "weight": 400 },
    "label": { "size": 11, "weight": 600 }
  },
  "spacing": { "xs": 4, "sm": 8, "md": 12, "lg": 16, "xl": 20, "xxl": 24 },
  "borderRadius": { "sm": 4, "md": 8, "lg": 10 }
}
```

---

## Component Specs

| Component | Width | Height | Border |
|-----------|-------|--------|--------|
| KPI Card | 160-200px | ~80px | 1px #E5E7EB |
| Data Table | 100% | auto | 1px #F3F4F6 |
| Status Badge | auto | auto | 4px radius |
| Chart Container | 100% | 280px | none |
| Sidebar | 240px | 100% | none |
| Top Bar | 100% | 64px | 1px #E5E7EB |
