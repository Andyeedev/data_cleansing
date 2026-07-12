# Batch 18 — PowerPoint Data Export

**Purpose:** Slide deck data for executive presentations
**Format:** Slide-by-slide content specifications
**Source:** 02_Dashboard_Data/ + dashboard_preview/ views

---

## Slide Deck: MAP Nexus™ Migration Status Report

### Slide 1 — Title
- **Title:** MAP Nexus™ Migration Status Report
- **Subtitle:** Customer Core Banking Migration — Scenario 3 MIXTURE
- **Date:** 3 July 2026
- **Author:** Edward Odewale

### Slide 2 — Executive Summary
- **Title:** Executive Summary
- **Content:**
  - Migration Status: **BLOCKED**
  - Readiness: **62%**
  - Validation Score: **58.3%**
  - Critical Findings: **6**
  - Recommendation: **NO-GO** until critical findings resolved

### Slide 3 — Migration Overview
- **Title:** Migration Overview
- **Content:**
  - Source: T24 Transact (55,011 records)
  - Target: Finacle (39,205 records)
  - 5 entities mapped
  - 3 datasets validated

### Slide 4 — Validation Results
- **Title:** Validation Centre
- **Content:**
  - 10 controls executed
  - 3 Passed, 2 Attention Required, 4 Critical Issue, 1 Disabled
  - Chart: Validation Distribution (donut)

### Slide 5 — Data Quality
- **Title:** Data Quality Assessment
- **Content:**
  - Overall Score: **80%**
  - Best: Completeness (95%)
  - Worst: Validity (58%)
  - Trend: Improving (45% → 80% over 6 weeks)
  - Chart: Quality Radar + Trend Line

### Slide 6 — Risk Assessment
- **Title:** Risk Assessment
- **Content:**
  - Overall Risk: **High** (58.3/100)
  - Go/No-Go: **NO-GO**
  - Top 3 risks: Schema drift, Balance discrepancies, Permission delays
  - Chart: Risk Matrix

### Slide 7 — Critical Findings
- **Title:** Critical Findings
- **Content:**
  - FND-001: Schema drift (Critical)
  - FND-003: Balance mismatch (Critical)
  - FND-002: Schema drift (High)
  - FND-004: Duplicate records (Medium)
  - FND-005: Orphaned records (Medium)

### Slide 8 — Migration Progress
- **Title:** Migration Progress
- **Content:**
  - Overall: **50%** (169 days elapsed, 181 remaining)
  - Completed: Planning & Design, Schema Mapping
  - In Progress: ETL Development (85%), Validation & Testing (45%)
  - Not Started: Pilot, Full Migration, Post-Migration Review

### Slide 9 — Next Steps
- **Title:** Next Steps
- **Content:**
  1. Resolve 6 critical findings
  2. Escalate permission provisioning
  3. Align column types (AMOUNT, STATUS)
  4. Reconcile 342 precision differences
  5. Re-evaluate go/no-go decision

### Slide 10 — Appendix
- **Title:** Appendix — Detailed Data
- **Content:**
  - Entity mapping table
  - Control results table
  - Platform health metrics

---

## PowerPoint Specifications

- **Template:** 16:9 widescreen
- **Font:** Segoe UI
- **Colours:** Module 00 palette
- **Charts:** Chart.js exports (PNG) or static images
- **Layout:** Clean, minimal, data-focused
