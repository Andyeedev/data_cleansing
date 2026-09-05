# Phase 11 Task 11.5 — Design Option 3: Visual Progress/Dashboard

## Controls Overview — Dashboard Layout

**Design:** Option 3 (Visual progress/dashboard)  
**Status:** Ready for Review  
**Date:** 2026-08-06  

---

## 1. Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Controls Overview"                             │
│ Description: "Real-time control health and risk monitoring" │
│ Actions: [Refresh] [Export]                                 │
├─────────────────────────────────────────────────────────────┤
│ MetricCards: [Total] [Compliance %] [Critical] [Last Run]   │
├─────────────────────────────────────────────────────────────┤
│ TabBar: [Overview] [Controls] [History]                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────┐ ┌─────────────────────────┐    │
│ │ Compliance Gauge        │ │ Risk Distribution       │    │
│ │                         │ │                         │    │
│ │      ┌───────┐          │ │  HIGH    ████░░  2     │    │
│ │      │  85%  │          │ │  MEDIUM  ██████  3     │    │
│ │      │ Score │          │ │  LOW     ███░░░  1     │    │
│ │      └───────┘          │ │                         │    │
│ │                         │ │                         │    │
│ │  Total: 6               │ │                         │    │
│ │  Passed: 5              │ │                         │    │
│ │  Failed: 1              │ │                         │    │
│ └─────────────────────────┘ └─────────────────────────┘    │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Active Controls                                     │    │
│ │ ┌─────┬────────────┬──────────┬──────────┬────────┐│    │
│ │ │ ID  │ Name       │ Severity │ Status   │ Score  ││    │
│ │ ├─────┼────────────┼──────────┼──────────┼────────┤│    │
│ │ │ C01 │ Data Compl │ HIGH     │ ✅ PASS  │ 100%   ││    │
│ │ │ C02 │ Schema Val │ MEDIUM   │ ✅ PASS  │ 95%    ││    │
│ │ │ C03 │ Referntl   │ HIGH     │ ❌ FAIL  │ 60%    ││    │
│ │ └─────┴────────────┴──────────┴──────────┴────────┘│    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Recent Activity                                     │    │
│ │ • C01 passed — 2 min ago                            │    │
│ │ • C02 passed — 5 min ago                            │    │
│ │ • C03 failed — 10 min ago                           │    │
│ └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 PageHeader
- **Title:** "Controls Overview"
- **Description:** "Real-time control health and risk monitoring"
- **Actions:** "Refresh" button, "Export" button

### 2.2 MetricCards Row
| Card | Value | Color |
|------|-------|-------|
| Total Controls | `data.total` | `var(--color-text)` |
| Compliance Rate | `${data.compliance_rate}%` | Dynamic (green/yellow/red) |
| Critical | `data.critical_count` | `var(--color-danger)` |
| Last Run | `data.last_run_time` | `var(--color-text-secondary)` |

### 2.3 TabBar
| Tab | Content |
|-----|---------|
| Overview | Dashboard with gauges and charts |
| Controls | List/grid of controls (links to Design 1 or 2) |
| History | Control execution history |

### 2.4 Compliance Gauge
- Circular progress indicator
- Color: Green (≥80%), Yellow (50-79%), Red (<50%)
- Center text: Percentage score
- Below: Total, Passed, Failed counts

### 2.5 Risk Distribution Chart
- Horizontal bar chart
- Categories: HIGH, MEDIUM, LOW
- Color-coded bars
- Count labels

### 2.6 Active Controls Table
| Column | Field | Width |
|--------|-------|-------|
| ID | `control_id` | 80px |
| Name | `control_name` | 200px |
| Severity | `severity_level` | 100px |
| Status | `execution_status` | 100px |
| Score | `score` | 80px |

### 2.7 Activity Feed
- List of recent control events
- Timestamp, Control ID, Event type
- Color-coded: Green (pass), Red (fail)

---

## 3. Modals

### 3.1 Control Detail Modal
- Full control details
- Execution history
- Linked rules
- Score breakdown

### 3.2 Export Modal
- Export format (CSV, PDF)
- Date range
- Filters

---

## 4. States

### 4.1 Loading State
- MetricCards: LoadingSkeleton
- Gauges: LoadingSkeleton
- Tables: LoadingSkeleton rows

### 4.2 Empty State
- No controls found
- No execution history
- EmptyState component

### 4.3 Error State
- API error
- ErrorState component with retry

---

## 5. Components to Reuse

| # | Component | Source |
|---|-----------|--------|
| 1 | `PageHeader` | `src/components/PageHeader/PageHeader.tsx` |
| 2 | `MetricCard` | `src/components/shared/MetricCard.tsx` |
| 3 | `StatusBadge` | `src/components/shared/StatusBadge.tsx` |
| 4 | `ProgressBar` | `src/components/shared/ProgressBar.tsx` |
| 5 | `TabBar` | `src/components/shared/TabBar.tsx` |
| 6 | `EmptyState` | `src/components/shared/EmptyState.tsx` |
| 7 | `ErrorState` | `src/components/shared/ErrorState.tsx` |
| 8 | `LoadingSkeleton` | `src/components/shared/LoadingSkeleton.tsx` |

### 5.1 New Components Required
| # | Component | Purpose |
|---|-----------|---------|
| 1 | `ComplianceGauge` | Circular progress indicator |
| 2 | `RiskDistributionChart` | Horizontal bar chart |
| 3 | `ActivityFeed` | Recent events list |

---

## 6. Pros & Cons

### Pros
- ✅ Executive-friendly view
- ✅ Real-time monitoring
- ✅ Visual health indicators
- ✅ Great for dashboards
- ✅ Comprehensive overview

### Cons
- ❌ More complex to implement
- ❌ May be overkill for simple management
- ❌ Requires more data aggregation
- ❌ New components required (Gauge, Chart, ActivityFeed)

---

**End of Design Option 3**
