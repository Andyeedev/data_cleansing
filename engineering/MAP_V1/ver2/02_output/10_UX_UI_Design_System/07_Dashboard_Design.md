# MAP MVP Dashboard Design

| Field | Value |
|-------|-------|
| **Document** | MAP MVP Dashboard Design |
| **Version** | 1.0 |
| **Date** | June 2026 |
| **Status** | Official |

---

## Overview

This document defines the visual design, component specifications, data sources, and interaction patterns for all 6 dashboards in the MAP platform. Each dashboard follows a consistent grid system, colour palette, and widget architecture.

**Design Principles:**
- KPIs are always visible above the fold
- Charts use a consistent colour palette (see Section 2)
- All dashboards are filterable by date range and context
- Empty states include helpful guidance
- Loading states use skeleton screens
- Error states include retry actions

---

## 1. Colour Palette

### KPI Colours

| KPI State | Colour | Hex | Usage |
|-----------|--------|-----|-------|
| Positive/Trending Up | Green | `#107C10` | Success rates, positive deltas |
| Negative/Trending Down | Red | `#D13438` | Error rates, negative deltas |
| Neutral/Flat | Grey | `#605E5C` | No change, flat trends |
| Warning/Caution | Yellow | `#FFB900` | Warnings, moderate values |
| Informational | Blue | `#0078D4` | Default, informational |
| Critical | Dark Red | `#A4262C` | Critical severity |

### Chart Colours (ordered by priority)

| Position | Colour | Hex | Usage |
|----------|--------|-----|-------|
| Primary | Blue | `#0078D4` | First series, primary metric |
| Secondary | Teal | `#038387` | Second series |
| Tertiary | Purple | `#8764B8` | Third series |
| Quaternary | Magenta | `#C239B3` | Fourth series |
| Quinary | Orange | `#CA5010` | Fifth series |
| Senary | Yellow | `#FFB900` | Sixth series |
| Background | Light Grey | `#F3F2F1` | Chart backgrounds |
| Grid | Medium Grey | `#EDEBE9` | Grid lines |

### Severity Colours

| Severity | Colour | Hex |
|----------|--------|-----|
| Critical | Dark Red | `#A4262C` |
| High | Red | `#D13438` |
| Medium | Orange | `#CA5010` |
| Low | Yellow | `#FFB900` |
| Info | Blue | `#0078D4` |

### Status Colours

| Status | Colour | Hex |
|--------|--------|-----|
| Active/Running | Green | `#107C10` |
| Pending | Yellow | `#FFB900` |
| Warning | Orange | `#CA5010` |
| Failed/Error | Red | `#D13438` |
| Completed | Blue | `#0078D4` |
| Inactive/Disabled | Grey | `#605E5C` |

---

## 2. Typography

| Element | Font | Size | Weight | Colour |
|---------|------|------|--------|--------|
| KPI Number | Segoe UI | 32px | Semibold (600) | `#323130` |
| KPI Label | Segoe UI | 12px | Regular (400) | `#605E5C` |
| KPI Delta | Segoe UI | 12px | Semibold (600) | Context-dependent |
| Chart Title | Segoe UI | 14px | Semibold (600) | `#323130` |
| Chart Label | Segoe UI | 11px | Regular (400) | `#605E5C` |
| Table Header | Segoe UI | 12px | Semibold (600) | `#323130` |
| Table Cell | Segoe UI | 13px | Regular (400) | `#323130` |
| Filter Label | Segoe UI | 12px | Regular (400) | `#605E5C` |
| Section Title | Segoe UI | 16px | Semibold (600) | `#323130` |

---

## 3. KPI Card Design

### Standard KPI Card

```
┌─────────────────────────────────┐
│                                 │
│  47                             │  ← KPI Number (32px, Semibold)
│  Total Migrations               │  ← KPI Label (12px, Regular)
│  ▲ 8 this week                  │  ← Delta (Green if positive)
│  ┌─────────────────────────┐    │
│  │ ~~~/\~~~/\~~/~~~        │    │  ← Sparkline (16px height)
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Dimensions:** 240px × 160px (desktop), 100% width (mobile)

**States:**
- Default: `#FFFFFF` background, `#EDEBE9` border
- Hover: `#F3F2F1` background, shadow elevation
- Loading: Skeleton shimmer animation

**Sparkline:**
- Height: 16px
- Stroke: 2px, colour matches trend direction
- Fill: 10% opacity of stroke colour
- Points: Minimum 7 data points
- No axes, no labels

### KPI Card Variants

**With Icon:**
```
┌─────────────────────────────────┐
│  📊  47                         │  ← Optional icon (20px)
│  Total Migrations               │
│  ▲ 8 this week                  │
│  [sparkline]                    │
└─────────────────────────────────┘
```

**Compact (for mobile):**
```
┌─────────────────────────────────┐
│  47  ▲ 8    Total Migrations    │  ← Single line
└─────────────────────────────────┘
```

---

## 4. Widget Specifications

### Grid System

- **Desktop:** 12-column grid, 24px gutter, 16px margin
- **Tablet:** 8-column grid, 16px gutter, 16px margin
- **Mobile:** 4-column grid, 12px gutter, 12px margin

### Widget Sizes

| Size | Columns | Rows | Usage |
|------|---------|------|-------|
| Small | 3 | 2 | KPI cards |
| Medium | 6 | 4 | Single charts |
| Large | 12 | 4 | Tables, full-width charts |
| Half | 6 | 4 | Two charts side-by-side |

---

## 5. Dashboard 1: Executive Dashboard (SCR-001)

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Date Range: Last 30 days ▾]  [Subscription: All ▾]  [Export ▾]   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ KPI 1    │ │ KPI 2    │ │ KPI 3    │ │ KPI 4    │               │
│  │ Total    │ │ Success  │ │ Active   │ │ Compli-  │               │
│  │ Migr.    │ │ Rate     │ │ Findings │ │ ance     │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Migration Timeline         │ │  Findings by Severity          │  │
│  │  (Line Chart)               │ │  (Donut Chart)                 │  │
│  │  8 cols × 4 rows            │ │  4 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Cost Savings               │ │  Resource Distribution         │  │
│  │  (Bar Chart)                │ │  (Horizontal Bar)              │  │
│  │  6 cols × 4 rows            │ │  6 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Recent Migrations                                               ││
│  │  12 cols × 4 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Specifications

| KPI | Metric | Format | Delta | Data Source |
|-----|--------|--------|-------|-------------|
| Total Migrations | COUNT(projects) WHERE status IN ('Active','Completed') | Integer | vs. last week | Projects API |
| Success Rate | COUNT(completed) / COUNT(total) × 100 | Percentage (1 decimal) | vs. last month | Projects API |
| Active Findings | COUNT(findings) WHERE status = 'Open' AND severity IN ('Critical','High') | Integer | vs. last week | Findings API |
| Compliance Score | SUM(compliant_resources) / SUM(total_resources) × 100 | Percentage (1 decimal) | vs. last month | Compliance API |

### Chart 1: Migration Timeline (Line)

| Property | Value |
|----------|-------|
| **Type** | Line chart |
| **Data** | Monthly migration count (start date) |
| **X-Axis** | Months (Jan — Dec, current year) |
| **Y-Axis** | Number of migrations (auto-scale, min 0) |
| **Lines** | 1 (Total Migrations) |
| **Colour** | `#0078D4` (Blue) |
| **Fill** | 10% opacity below line |
| **Dots** | Show on hover only |
| **Grid** | Horizontal only, `#EDEBE9` |
| **Tooltip** | "Month: X migrations" |
| **Empty State** | "No migration data for this period" |

### Chart 2: Findings by Severity (Donut)

| Property | Value |
|----------|-------|
| **Type** | Donut chart |
| **Data** | Findings count by severity |
| **Segments** | Critical, High, Medium, Low |
| **Colours** | `#A4262C`, `#D13438`, `#CA5010`, `#FFB900` |
| **Centre Text** | Total count |
| **Inner Radius** | 60% of outer |
| **Hover** | Segment expands 5%, tooltip shows count + % |
| **Legend** | Below chart, horizontal |
| **Empty State** | "No findings recorded" |

### Chart 3: Cost Savings (Bar)

| Property | Value |
|----------|-------|
| **Type** | Vertical bar chart |
| **Data** | Quarterly cost savings (projected vs. actual) |
| **X-Axis** | Quarters (Q1 — Q4) |
| **Y-Axis** | Savings in USD (formatted as $Xk) |
| **Bars** | 2 per quarter (projected: `#0078D4`, actual: `#038387`) |
| **Bar Width** | 60% of category width |
| **Bar Gap** | 20% within category |
| **Category Gap** | 40% |
| **Grid** | Horizontal only |
| **Tooltip** | "Q1 Projected: $Xk, Actual: $Yk" |
| **Empty State** | "No cost data available" |

### Chart 4: Resource Distribution (Horizontal Bar)

| Property | Value |
|----------|-------|
| **Type** | Horizontal bar chart |
| **Data** | Resource count by type |
| **Y-Axis** | Resource types (VMs, DBs, Storage, Web Apps, AKS, etc.) |
| **X-Axis** | Count (auto-scale) |
| **Bar Colour** | `#0078D4` |
| **Bar Height** | 24px |
| **Bar Gap** | 8px |
| **Label** | Count at end of bar |
| **Sort** | Descending by count |
| **Empty State** | "No resources discovered" |

### Table: Recent Migrations

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Name | 25% | Text, truncate at 30 chars | Yes |
| Subscription | 20% | Text, tooltip on hover | Yes |
| Status | 15% | Badge (Active/Completed/Pending) | Yes |
| Progress | 15% | Percentage with progress bar | Yes |
| Owner | 10% | Avatar + Name | No |
| Date | 15% | Relative (2d ago) or absolute | Yes |

**Pagination:** 5 rows per page, "View All →" link
**Row Click:** Navigate to Project Detail (SCR-003)
**Empty State:** "No migrations yet. Create your first project to get started."

### Filter Behaviour

| Filter | Options | Default | Behaviour |
|--------|---------|---------|-----------|
| Date Range | Last 7 days, 30 days, 90 days, Custom | Last 30 days | All widgets refresh |
| Subscription | All, [list of connected subs] | All | Scoped data |
| Status | All, Active, Completed | All | Table filter |

---

## 6. Dashboard 2: Project Dashboard

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Project: [▼ ERP Phase 1]  [Date Range ▾]  [Refresh] [Export ▾]    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Project  │ │ Progress │ │ Open     │ │ Days     │               │
│  │ Health   │ │ %        │ │ Issues   │ │ Remaining│               │
│  │ ● Good   │ │ 78%      │ │ 12       │ │ 23       │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Progress Timeline          │ │  Burndown Chart                │  │
│  │  (Gantt-like Bar)           │ │  (Line Chart)                  │  │
│  │  8 cols × 4 rows            │ │  4 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Active Migrations                                               ││
│  │  12 cols × 4 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Team Assignments                                                ││
│  │  12 cols × 3 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Specifications

| KPI | Metric | Format | Indicator | Data Source |
|-----|--------|--------|-----------|-------------|
| Project Health | Composite score (findings, compliance, timeline) | Status badge (Good/Fair/Poor) | Colour-coded | Project API |
| Progress % | Completed resources / total resources × 100 | Percentage | Progress bar | Project API |
| Open Issues | COUNT(findings) WHERE status = 'Open' | Integer | ▲/▼ vs. last week | Findings API |
| Days Remaining | End date - today | Integer | Warning if < 7 days | Project API |

### Chart 1: Progress Timeline (Gantt-like)

| Property | Value |
|----------|-------|
| **Type** | Horizontal stacked bar (Gantt-like) |
| **Data** | Project phases with start/end dates |
| **Y-Axis** | Phase names (Discovery, Validation, Migration, Verification) |
| **X-Axis** | Timeline (dates) |
| **Bars** | Colour per phase: Completed (`#107C10`), In Progress (`#0078D4`), Pending (`#EDEBE9`) |
| **Today Line** | Vertical dashed line at today's date |
| **Bar Height** | 32px |
| **Bar Gap** | 12px |
| **Tooltip** | "Phase: Start — End, Progress: X%" |
| **Empty State** | "No phases defined for this project" |

### Chart 2: Burndown Chart (Line)

| Property | Value |
|----------|-------|
| **Type** | Line chart |
| **Data** | Remaining work over time |
| **X-Axis** | Dates (project duration) |
| **Y-Axis** | Remaining issues (auto-scale) |
| **Lines** | 2: Ideal (`#605E5C`, dashed), Actual (`#0078D4`, solid) |
| **Fill** | None |
| **Today Line** | Vertical dashed line |
| **Tooltip** | "Date: X remaining issues" |
| **Empty State** | "No burndown data available" |

### Table: Active Migrations

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Resource | 25% | Type icon + Name | Yes |
| Type | 15% | Text | Yes |
| Status | 15% | Badge | Yes |
| Progress | 15% | Progress bar | Yes |
| Owner | 15% | Avatar + Name | Yes |
| Last Updated | 15% | Relative time | Yes |

**Pagination:** 10 rows per page
**Row Click:** Navigate to Resource Detail (SCR-008)

### Table: Team Assignments

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Member | 30% | Avatar + Name + Email | No |
| Role | 20% | Text | Yes |
| Assigned Resources | 25% | Count + mini progress bar | Yes |
| Last Active | 25% | Relative time | Yes |

---

## 7. Dashboard 3: Migration Dashboard

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Migration: [▼ ERP Phase 1]  [Phase: All ▾]  [Export ▾]            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Migration│ │ Resources│ │ Valid.   │ │ Overall  │               │
│  │ Status   │ │ Migrated │ │ Score    │ │ Quality  │               │
│  │ ● Active │ │ 78/124   │ │ 94%      │ │ 92%      │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Migration Progress         │ │  Resource Type Distribution    │  │
│  │  (Stacked Bar by Phase)     │ │  (Pie Chart)                   │  │
│  │  8 cols × 4 rows            │ │  4 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Migration Phases                                                ││
│  │  12 cols × 4 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Resource List                                                   ││
│  │  12 cols × 5 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Specifications

| KPI | Metric | Format | Indicator | Data Source |
|-----|--------|--------|-----------|-------------|
| Migration Status | Current phase | Status badge | Colour-coded | Migration API |
| Resources Migrated | Migrated / Total | Fraction + percentage | Progress bar | Migration API |
| Validation Score | Passed checks / total checks × 100 | Percentage | ▲/▼ vs. last run | Validation API |
| Overall Quality | Composite (findings, compliance, performance) | Percentage | Colour-coded | Composite |

### Chart 1: Migration Progress (Stacked Bar)

| Property | Value |
|----------|-------|
| **Type** | Stacked horizontal bar |
| **Data** | Resources per migration phase |
| **Y-Axis** | Phase names |
| **X-Axis** | Resource count |
| **Segments** | Completed (`#107C10`), In Progress (`#0078D4`), Pending (`#EDEBE9`), Failed (`#D13438`) |
| **Bar Height** | 40px |
| **Labels** | Count inside segment (if space) |
| **Tooltip** | "Phase: X completed, Y in progress, Z pending" |
| **Empty State** | "No migration phases defined" |

### Chart 2: Resource Type Distribution (Pie)

| Property | Value |
|----------|-------|
| **Type** | Pie chart |
| **Data** | Resource count by type |
| **Segments** | VMs, SQL DBs, App Services, Storage, AKS, Other |
| **Colours** | `#0078D4`, `#038387`, `#8764B8`, `#C239B3`, `#CA5010`, `#605E5C` |
| **Centre** | Total count |
| **Hover** | Segment expands, tooltip shows count + % |
| **Legend** | Below chart |
| **Empty State** | "No resources in this migration" |

### Table: Migration Phases

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Phase | 20% | Text | Yes |
| Status | 15% | Badge | Yes |
| Resources | 20% | Count + progress bar | Yes |
| Duration | 15% | Days (elapsed / estimated) | Yes |
| Start Date | 15% | Date | Yes |
| End Date | 15% | Date | Yes |

### Table: Resource List

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Name | 25% | Type icon + Name | Yes |
| Type | 15% | Text | Yes |
| Phase | 15% | Badge | Yes |
| Status | 15% | Badge | Yes |
| Validation | 15% | Score + icon | Yes |
| Last Checked | 15% | Relative time | Yes |

---

## 8. Dashboard 4: Validation Dashboard

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Validation  [Project: All ▾]  [Date Range ▾]  [Export ▾]           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Total    │ │ Pass     │ │ Critical │ │ Average  │               │
│  │ Checks   │ │ Rate     │ │ Findings │ │ Duration │               │
│  │ 1,247    │ │ 94.2%    │ │ 12       │ │ 3m 42s   │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Check Results              │ │  Validation Trend              │  │
│  │  (Stacked Bar)              │ │  (Line Chart)                  │  │
│  │  8 cols × 4 rows            │ │  4 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Recent Runs                                                     ││
│  │  12 cols × 4 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Top Findings                                                    ││
│  │  12 cols × 4 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Specifications

| KPI | Metric | Format | Indicator | Data Source |
|-----|--------|--------|-----------|-------------|
| Total Checks | COUNT(validation_checks) in period | Integer | ▲/▼ vs. period | Validation API |
| Pass Rate | Passed / Total × 100 | Percentage (1 decimal) | ▲/▼ vs. period | Validation API |
| Critical Findings | COUNT(findings) WHERE severity = 'Critical' | Integer | ▲/▼ vs. period | Findings API |
| Average Duration | AVG(run_duration) | Time (mm:ss) | ▼ is better | Validation API |

### Chart 1: Check Results (Stacked Bar)

| Property | Value |
|----------|-------|
| **Type** | Stacked vertical bar |
| **Data** | Check results by category |
| **X-Axis** | Rule categories (Security, Compliance, Performance, Cost) |
| **Y-Axis** | Check count |
| **Segments** | Passed (`#107C10`), Warning (`#FFB900`), Failed (`#D13438`), Skipped (`#605E5C`) |
| **Bar Width** | 60% of category |
| **Labels** | Count inside segment (if space) |
| **Tooltip** | "Category: X passed, Y warnings, Z failed" |
| **Empty State** | "No validation checks run in this period" |

### Chart 2: Validation Trend (Line)

| Property | Value |
|----------|-------|
| **Type** | Line chart |
| **Data** | Pass rate over time |
| **X-Axis** | Dates |
| **Y-Axis** | Pass rate % (0-100) |
| **Lines** | 1: Pass Rate (`#0078D4`) |
| **Dots** | Show on hover |
| **Target Line** | Horizontal dashed at 95% (`#107C10`) |
| **Tooltip** | "Date: X% pass rate" |
| **Empty State** | "No validation data for this period" |

### Table: Recent Runs

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Run ID | 15% | Link | Yes |
| Project | 20% | Text | Yes |
| Status | 15% | Badge | Yes |
| Checks | 15% | Passed/Total | Yes |
| Findings | 15% | Count + severity breakdown | Yes |
| Duration | 10% | Time | Yes |
| Date | 10% | Relative | Yes |

### Table: Top Findings

| Column | Width | Format | Sortable |
|--------|-------|--------|----------|
| Finding | 25% | Title + ID | Yes |
| Severity | 15% | Badge | Yes |
| Rule | 20% | Text | Yes |
| Resources | 15% | Count | Yes |
| Status | 15% | Badge | Yes |
| Age | 10% | Days | Yes |

---

## 9. Dashboard 5: Operational Dashboard

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Operations  [Service: All ▾]  [Time Range: 24h ▾]  [Refresh]      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ API      │ │ Error    │ │ Active   │ │ Queue    │               │
│  │ Response │ │ Rate     │ │ Users    │ │ Depth    │               │
│  │ 142ms    │ │ 0.3%     │ │ 23       │ │ 4        │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Response Time              │ │  Error Rate                    │  │
│  │  (Line Chart)               │ │  (Bar Chart)                   │  │
│  │  8 cols × 4 rows            │ │  4 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Usage Over Time (Area Chart)                                    ││
│  │  12 cols × 4 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Service Status             │ │  Recent Logs                   │  │
│  │  6 cols × 4 rows            │ │  6 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Specifications

| KPI | Metric | Format | Threshold | Data Source |
|-----|--------|--------|-----------|-------------|
| API Response Time | P95 response time | Milliseconds | <200ms green, 200-500ms yellow, >500ms red | Monitoring API |
| Error Rate | Errors / total requests × 100 | Percentage (2 decimal) | <1% green, 1-5% yellow, >5% red | Monitoring API |
| Active Users | COUNT(active sessions) | Integer | — | Auth API |
| Queue Depth | Pending validation jobs | Integer | <10 green, 10-50 yellow, >50 red | Queue API |

### Chart 1: Response Time (Line)

| Property | Value |
|----------|-------|
| **Type** | Line chart |
| **Data** | P50, P95, P99 response times |
| **X-Axis** | Time (hours) |
| **Y-Axis** | Response time (ms) |
| **Lines** | 3: P50 (`#107C10`), P95 (`#FFB900`), P99 (`#D13438`) |
| **Target Line** | Horizontal at 200ms (`#0078D4`, dashed) |
| **Tooltip** | "Time: P50 Xms, P95 Yms, P99 Zms" |
| **Empty State** | "No response time data for this period" |

### Chart 2: Error Rate (Bar)

| Property | Value |
|----------|-------|
| **Type** | Vertical bar chart |
| **Data** | Error count by type |
| **X-Axis** | Error types (4xx, 5xx, Timeout, Other) |
| **Y-Axis** | Count |
| **Bar Colour** | `#D13438` |
| **Threshold Line** | Horizontal at 5% of total requests |
| **Tooltip** | "Type: X errors" |
| **Empty State** | "No errors recorded" |

### Chart 3: Usage Over Time (Area)

| Property | Value |
|----------|-------|
| **Type** | Area chart |
| **Data** | API requests per hour |
| **X-Axis** | Time (hours) |
| **Y-Axis** | Request count |
| **Fill** | 20% opacity `#0078D4` |
| **Line** | 2px `#0078D4` |
| **Tooltip** | "Hour: X requests" |
| **Empty State** | "No usage data for this period" |

### Table: Service Status

| Column | Width | Format |
|--------|-------|--------|
| Service | 30% | Name + icon |
| Status | 20% | Badge (Healthy/Degraded/Down) |
| Uptime | 20% | Percentage (30 days) |
| Latency | 15% | Milliseconds |
| Last Check | 15% | Relative time |

### Table: Recent Logs

| Column | Width | Format |
|--------|-------|--------|
| Timestamp | 20% | Time (HH:mm:ss) |
| Level | 15% | Badge (Info/Warn/Error) |
| Service | 20% | Text |
| Message | 35% | Text, truncate at 60 chars |
| Actions | 10% | View button |

**Row Click:** Expand to show full log entry
**Filter:** Level dropdown (All, Info, Warn, Error)

---

## 10. Dashboard 6: System Dashboard

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  System Health  [Region: All ▾]  [Auto-refresh: 30s ▾]  [Refresh]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ CPU      │ │ Memory   │ │ Storage  │ │ Active   │               │
│  │ Usage    │ │ Usage    │ │ Usage    │ │ Conns    │               │
│  │ 42%      │ │ 67%      │ │ 234 GB   │ │ 1,247    │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │                             │ │                                │  │
│  │  Resource Utilisation       │ │  Cost Trend                    │  │
│  │  (Multi-line Chart)         │ │  (Bar Chart)                   │  │
│  │  8 cols × 4 rows            │ │  4 cols × 4 rows               │  │
│  │                             │ │                                │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Service Health                                                  ││
│  │  12 cols × 3 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  Alerts                                                          ││
│  │  12 cols × 3 rows                                                ││
│  │                                                                  ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### KPI Specifications

| KPI | Metric | Format | Threshold | Data Source |
|-----|--------|--------|-----------|-------------|
| CPU Usage | Average across nodes | Percentage | <60% green, 60-80% yellow, >80% red | Infrastructure API |
| Memory Usage | Used / Total × 100 | Percentage | <70% green, 70-85% yellow, >85% red | Infrastructure API |
| Storage | Used space | GB/TB | <80% green, 80-90% yellow, >90% red | Infrastructure API |
| Active Connections | Current connections | Integer | — | Infrastructure API |

### Chart 1: Resource Utilisation (Multi-line)

| Property | Value |
|----------|-------|
| **Type** | Multi-line chart |
| **Data** | CPU, Memory, Storage utilisation over time |
| **X-Axis** | Time (hours) |
| **Y-Axis** | Utilisation % (0-100) |
| **Lines** | 3: CPU (`#0078D4`), Memory (`#038387`), Storage (`#8764B8`) |
| **Thresholds** | Horizontal lines at 60%, 80% (`#D13438`, dashed) |
| **Tooltip** | "Time: CPU X%, Memory Y%, Storage Z%" |
| **Empty State** | "No utilisation data for this period" |

### Chart 2: Cost Trend (Bar)

| Property | Value |
|----------|-------|
| **Type** | Vertical bar chart |
| **Data** | Daily cost over time |
| **X-Axis** | Dates |
| **Y-Axis** | Cost (USD) |
| **Bars** | Single colour (`#0078D4`) |
| **Budget Line** | Horizontal dashed at daily budget (`#D13438`) |
| **Tooltip** | "Date: $X.XX" |
| **Empty State** | "No cost data available" |

### Table: Service Health

| Column | Width | Format |
|--------|-------|--------|
| Service | 25% | Name + icon |
| Status | 15% | Badge (Healthy/Degraded/Down) |
| CPU | 15% | Percentage + gauge |
| Memory | 15% | Percentage + gauge |
| Uptime | 15% | Percentage (30 days) |
| Region | 15% | Text |

### Table: Alerts

| Column | Width | Format |
|--------|-------|--------|
| Severity | 15% | Badge + icon |
| Service | 20% | Text |
| Message | 40% | Text, truncate at 60 chars |
| Time | 15% | Relative time |
| Actions | 10% | Acknowledge / Dismiss |

**Row Click:** Expand to show full alert details
**Auto-refresh:** Configurable (10s, 30s, 60s, Off)

---

## 11. Responsive Behaviour

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Desktop | ≥1200px | Full 12-column grid, all widgets visible |
| Tablet | 768px — 1199px | 8-column grid, KPIs 2×2, charts stack |
| Mobile | <768px | 4-column grid, KPIs single column, charts full-width |

### Mobile-Specific Adaptations

**KPI Cards:**
- Desktop: 4 across (3 cols each)
- Tablet: 2 across (6 cols each)
- Mobile: Single column (full width)

**Charts:**
- Desktop: Side by side (6+6 cols or 8+4 cols)
- Tablet: Stacked (full width each)
- Mobile: Stacked, reduced height, simplified labels

**Tables:**
- Desktop: Full table
- Tablet: Condensed columns
- Mobile: Card layout per row, swipe to reveal actions

**Filters:**
- Desktop: Inline horizontal
- Tablet: Collapsible filter bar
- Mobile: Full-screen filter drawer

---

## 12. Empty States

Each dashboard includes empty state designs for when data is unavailable.

### General Empty State

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    [Illustration: Empty State]                        │
│                                                                      │
│                    No data available yet                              │
│                                                                      │
│                    Connect a subscription to start                   │
│                    seeing data on this dashboard.                    │
│                                                                      │
│                    [Connect Subscription]                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Dashboard-Specific Empty States

| Dashboard | Empty State Message | Action |
|-----------|---------------------|--------|
| Executive | "No migrations yet. Create your first project to get started." | Create Project |
| Project | "No projects found. Start by creating a migration project." | Create Project |
| Migration | "No migration data. Run a migration to see progress here." | Start Migration |
| Validation | "No validations run yet. Execute your first validation." | Execute Validation |
| Operational | "Operational data will appear once services are active." | Check Status |
| System | "System health data is being collected. Check back in a few minutes." | Refresh |

---

## 13. Loading States

### Skeleton Screens

All dashboards use skeleton screens during data loading.

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ ████     │ │ ████     │ │ ████     │ │ ████     │               │
│  │ ████████ │ │ ████████ │ │ ████████ │ │ ████████ │               │
│  │ ~~        │ │ ~~        │ │ ~~        │ │ ~~        │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                      │
│  ┌─────────────────────────────┐ ┌────────────────────────────────┐  │
│  │ ██████████████████████████ │ │ ████████████████████           │  │
│  │ ██████████████████████████ │ │ ████████████████████           │  │
│  │ ██████████████████████████ │ │ ████████████████████           │  │
│  │ ██████████████████████████ │ │ ████████████████████           │  │
│  └─────────────────────────────┘ └────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Animation:** Shimmer effect (gradient animation, 1.5s ease-in-out infinite)
**Duration:** Shows for minimum 300ms, then transitions to content
**Error:** If loading fails, show error state with retry button

---

## 14. Error States

### Network Error

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    [Illustration: Error]                              │
│                                                                      │
│                    Unable to load dashboard                          │
│                                                                      │
│                    We're having trouble connecting to                │
│                    the server. Please check your                     │
│                    connection and try again.                         │
│                                                                      │
│                    [Retry]  [Check Status]                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Permission Error

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    [Illustration: Lock]                               │
│                                                                      │
│                    Access Denied                                      │
│                                                                      │
│                    You don't have permission to view                 │
│                    this dashboard. Contact your                      │
│                    administrator for access.                         │
│                                                                      │
│                    [Request Access]  [Go to Dashboard]               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 15. Export Specifications

### PDF Export

- **Layout:** A4 landscape
- **Header:** Dashboard title, date range, generated date
- **Footer:** Page numbers, MAP branding
- **Charts:** Rendered as images (PNG)
- **Tables:** Full data with pagination

### Excel Export

- **Sheets:** One per widget
- **Format:** Formatted tables with headers
- **Charts:** Embedded chart images
- **Metadata:** Dashboard title, filters, export date

### CSV Export

- **Scope:** Tables only
- **Format:** Comma-separated, UTF-8
- **Headers:** Column names as first row

---

## 16. Data Refresh Intervals

| Dashboard | Auto-Refresh | Manual Refresh | Data Latency |
|-----------|--------------|----------------|--------------|
| Executive | 60 seconds | Yes | Real-time |
| Project | 120 seconds | Yes | Near real-time |
| Migration | 300 seconds | Yes | 5-minute |
| Validation | 60 seconds | Yes | Real-time |
| Operational | 30 seconds | Yes | Real-time |
| System | 30 seconds | Yes | Real-time |

---

## 17. Accessibility Compliance

All dashboards meet WCAG 2.1 AA standards:

| Requirement | Implementation |
|-------------|----------------|
| Colour contrast | Minimum 4.5:1 for text, 3:1 for large text |
| Keyboard navigation | All interactive elements focusable |
| Screen reader | ARIA labels, live regions for updates |
| Text alternatives | Charts have summary text descriptions |
| Focus indicators | Visible focus ring on all interactive elements |
| Motion | Respect prefers-reduced-motion |
| Colour independence | Colour never sole indicator (icons + labels) |
