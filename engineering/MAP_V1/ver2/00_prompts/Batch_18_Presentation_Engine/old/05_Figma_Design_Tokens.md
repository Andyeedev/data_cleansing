# Module 05 — Figma Design Tokens

**Purpose:** Generate Figma-compatible design tokens and component specs
**Input:** Module 00 Master Configuration
**Output:** 05_Figma_Data/

---

## Token Export Format

### Figma Variables (JSON)
```json
{
  "colours": {
    "primary": { "value": "#0078D4", "type": "color" },
    "secondary": { "value": "#003B75", "type": "color" },
    "success": { "value": "#107C10", "type": "color" },
    "warning": { "value": "#FFB900", "type": "color" },
    "critical": { "value": "#D13438", "type": "color" },
    "info": { "value": "#5C2D91", "type": "color" },
    "background": { "value": "#F8F9FB", "type": "color" },
    "border": { "value": "#E5E7EB", "type": "color" }
  },
  "typography": {
    "heading_lg": { "size": 18, "weight": 700 },
    "heading_md": { "size": 14, "weight": 700 },
    "heading_sm": { "size": 13, "weight": 600 },
    "body": { "size": 13, "weight": 400 },
    "caption": { "size": 11, "weight": 400 },
    "label": { "size": 11, "weight": 600 }
  },
  "spacing": {
    "xs": 4, "sm": 8, "md": 12, "lg": 16, "xl": 20, "xxl": 24, "xxxl": 32
  },
  "borderRadius": {
    "sm": 4, "md": 8, "lg": 10, "xl": 12
  }
}
```

---

## Component Specs

| Component | Width | Height | Border | Padding |
|-----------|-------|--------|--------|---------|
| KPI Card | 160-200px | ~80px | 1px #E5E7EB | 16px |
| Data Table | 100% | auto | 1px #F3F4F6 | 10px 12px |
| Status Badge | auto | auto | 4px radius | 3px 8px |
| Chart Container | 100% | 280px | none | none |
| Sidebar | 240px | 100% | none | none |
| Top Bar | 100% | 64px | 1px #E5E7EB | 16px 32px |
