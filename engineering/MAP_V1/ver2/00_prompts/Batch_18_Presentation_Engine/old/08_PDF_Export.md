# Module 08 — PDF Export

**Purpose:** Generate PDF-ready dashboard reports
**Input:** 02_Dashboard_Data/ + dashboard_preview/
**Output:** 08_PDF_Data/

---

## PDF Report Structure

### Report 1: Executive Summary (2 pages)
- Page 1: Title + KPIs + Recommendation
- Page 2: Findings + Next Steps

### Report 2: Validation Report (4 pages)
- Page 1: Title + Control Summary
- Page 2: Control Results Table
- Page 3: Findings Detail
- Page 4: Recommendations

### Report 3: Risk Assessment (3 pages)
- Page 1: Title + Risk Score + Go/No-Go
- Page 2: Risk Matrix
- Page 3: Top Risks + Mitigations

---

## Export Format

| Format | Tool | Use |
|--------|------|-----|
| PDF | wkhtmltopdf | Reports |
| PDF | Puppeteer | Charts |
| PNG | Chart.js | Chart images |
