# Batch 18 Presentation Engine — Overview

**Purpose:** Generate presentation-ready outputs from dashboard data
**Source:** 02_Dashboard_Data/ (authoritative JSON)
**Output:** Figma, PowerPoint, Canva, Executive, and Social media assets

---

## Module Structure

| Module | Name | Status |
|--------|------|--------|
| 00 | Master Configuration | Complete (source of truth) |
| 01 | Demonstration Execution Engine | Pending |
| 02 | UI Refinement | Complete (dashboard_preview/) |
| 03 | Executive Dashboard Export | Pending |
| 04 | Screenshot Content | Pending |
| 05 | Figma Design Tokens | Pending |
| 06 | PowerPoint Slide Deck | Pending |
| 07 | Canva Social Assets | Pending |
| 08 | PDF Export | Pending |
| 09 | React Component Specs | Pending |
| 10 | Enterprise Proposal/RFP Pack | Pending |

---

## Data Flow

```
02_Dashboard_Data/*.json
        ↓
   Module 00 (Master Config)
        ↓
   Modules 01-10 (Generation)
        ↓
   Presentation Outputs
```

---

## Module 00 — Master Configuration

Single source of truth for:
- Colour palette (exact hex values)
- Typography (Segoe UI)
- Dashboard names
- Terminology
- Infrastructure sanitisation rules
