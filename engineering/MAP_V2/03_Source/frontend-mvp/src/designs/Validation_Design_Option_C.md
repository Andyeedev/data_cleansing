# Validation Design — Option C: Report-Style with Printable Summary

## Concept
A report-style validation view focused on printable, shareable validation summaries. Emphasizes clarity and document-quality output for compliance and stakeholder reporting.

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Validation Report                    [Print] [Export PDF]     │
│  Project: my-migration | Date: 2026-08-03 | Status: PASSED    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Executive Summary ──────────────────────────────────────┐ │
│  │  Overall Status: ✅ PASSED                               │ │
│  │  Total Controls: 156 | Passed: 131 | Failed: 5          │ │
│  │  Pass Rate: 83.9% | Risk Level: MEDIUM                   │ │
│  │  Duration: 12m 34s | Completed: 2026-08-03 14:32 UTC    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Control Results ───────────────────────────────────────┐ │
│  │  Category        │ Passed │ Failed │ Rate    │ Status │ │
│  │  ────────────────┼────────┼────────┼─────────┼────────│ │
│  │  Data Integrity  │ 45     │ 0      │ 100%    │ ✅     │ │
│  │  Schema Match    │ 32     │ 1      │ 96.9%   │ ✅     │ │
│  │  Referential     │ 28     │ 2      │ 93.3%   │ ⚠     │ │
│  │  Data Types      │ 18     │ 0      │ 100%    │ ✅     │ │
│  │  Business Rules  │ 8      │ 2      │ 80.0%   │ ❌     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Failed Controls Detail ────────────────────────────────┐ │
│  │  Control ID │ Description        │ Error                │ │
│  │  ───────────┼────────────────────┼──────────────────────│ │
│  │  RC-042     │ FK constraint      │ orphaned rows: 3   │ │
│  │  RC-043     │ NOT NULL violation │ 2 rows null        │ │
│  │  BR-011     │ Business rule      │ status mismatch    │ │
│  │  BR-012     │ Business rule      │ amount exceeds limit│ │
│  │  SC-007     │ Schema mismatch    │ column type change │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Recommendations ───────────────────────────────────────┐ │
│  │  1. Fix orphaned rows in orders table (RC-042)          │ │
│  │  2. Resolve null values in customer.email (RC-043)      │ │
│  │  3. Update business rule BR-011 for new status values   │ │
│  │  4. Review amount validation threshold (BR-012)         │ │
│  │  5. Align column types before migration (SC-007)        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Prepared by: Migration Engine | Reviewed by: —                 │
│  Generated: 2026-08-03 14:32 UTC | Report ID: VR-20260803-001 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Behaviors

- **Report header** — Project name, date, overall status badge
- **Executive summary** — High-level pass/fail with key metrics
- **Control results table** — Grouped by category with pass/fail counts and rates
- **Failed controls detail** — Expandable section showing specific failures
- **Recommendations** — Auto-generated action items based on failures
- **Print button** — Opens print dialog with print-optimized styles
- **Export PDF** — Generates PDF report for sharing
- **Report metadata** — Shows who generated it, when, and report ID
- **Review workflow** — "Reviewed by" field for sign-off

## Visual Design

- Report layout: `max-width: 800px`, centered, print-friendly
- Executive summary: `bg-green-50` border for passed, `bg-red-50` for failed
- Control results: `table` with `border-collapse`, clean rows
- Failed detail: expandable `details/summary` elements
- Recommendations: `list-decimal` styled list with `bg-yellow-50` background
- Print styles: `@media print` hides buttons, uses black/white only
- Uses `StatusBadge` with `success`/`warning`/`error` variants
- Uses `MetricCard` for summary statistics in executive summary

## Props Interface

```tsx
interface ValidationReportProps {
  reportId: string;
  projectId: string;
}
```

## New Components Needed

- `ReportHeader.tsx` — Report title, metadata, and action buttons
- `ExecutiveSummary.tsx` — High-level pass/fail with key metrics
- `ControlResultsTable.tsx` — Grouped control results by category
- `FailedControlDetail.tsx` — Expandable detail for failed controls
- `RecommendationsList.tsx` — Auto-generated action items
- `PrintButton.tsx` — Print/export action buttons

## API Endpoints

```
GET  /api/v1/validation/reports/{report_id}   — get validation report
GET  /api/v1/validation/reports/{report_id}/pdf — generate PDF
GET  /api/v1/validation/reports/{report_id}/print — print-optimized view
POST /api/v1/validation/reports/{report_id}/review — submit review
```

## Pros
- Print-ready and shareable
- Professional document quality
- Executive summary suitable for stakeholders
- Recommendations provide actionable next steps
- Review workflow supports sign-off process
- Print-optimized styles for paper output
- Report IDs enable traceability and audit

## Cons
- Not suitable for real-time monitoring
- Report generation may be slow for large datasets
- Less interactive than dashboard views
- No live updates or streaming
- PDF generation requires backend processing
- May feel static compared to live dashboards

## When to Use
- Compliance and audit reporting
- Stakeholder presentations
- Sign-off and review workflows
- When documentation is required for governance
- Post-migration validation summaries
- When shareable reports are more important than live monitoring