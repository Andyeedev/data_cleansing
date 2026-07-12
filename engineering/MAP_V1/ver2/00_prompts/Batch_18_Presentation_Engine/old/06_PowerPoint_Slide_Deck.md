# Module 06 — PowerPoint Slide Deck

**Purpose:** Generate PowerPoint-ready slide content from dashboard data
**Input:** 02_Dashboard_Data/ + dashboard_preview/
**Output:** 06_PowerPoint_Data/

---

## Slide Deck Structure

| Slide | Title | Content Source |
|-------|-------|----------------|
| 1 | Title Slide | Static |
| 2 | Executive Summary | 01_Executive_Overview.json |
| 3 | Migration Overview | 02_Migration_Overview.json |
| 4 | Validation Results | 03_Validation_Centre.json |
| 5 | Data Quality | 04_Data_Quality.json |
| 6 | Risk Assessment | 05_Risk_Assessment.json |
| 7 | Critical Findings | 07_Governance_Centre.json |
| 8 | Migration Progress | 06_Migration_Progress.json |
| 9 | Next Steps | Derived |
| 10 | Appendix | All data |

---

## Export Format

### Slide Content (JSON)
```json
{
  "slides": [
    {
      "number": 1,
      "title": "MAP Nexus™ Migration Status Report",
      "subtitle": "Customer Core Banking Migration — Scenario 3 MIXTURE",
      "layout": "title"
    }
  ]
}
```

### Chart Images (PNG)
- Export each Chart.js chart as PNG
- 1920x1080 resolution
- White background
