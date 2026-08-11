# 10.5.4 — Validation Completion

**Target Layout:** Option B – Real-time Dashboard Grid
**Route:** `/validation/dashboard`
**Current Status:** Dashboard exists but calls nonexistent backend API, no real-time updates
**Est. Effort:** 10-14 days

---

## Current State

### What Exists
| Page | Route | Lines | Status |
|------|-------|-------|--------|
| ValidationPage | `/validation` (+ 4 sub-routes) | 207 | Execution trigger, same page reused for 5 routes |
| ValidationDashboardPage | `/validation/dashboard` | 292 | Dashboard grid (broken — calls nonexistent API) |
| ValidationResultsPage | `/validation/results/:batchId` | 111 | Basic status card, notes say "backend needs work" (it doesn't) |
| ExecutionHistoryPage | `/validation/history` | 212 | Paginated history table, ignores existing hook features |

### What Works
- ValidationPage: triggers execution, polls status, shows progress
- ValidationDashboardPage: KPI cards, compliance gauge, risk bars, alerts (all static)
- ExecutionHistoryPage: basic paginated list with re-run

### What's Broken
- **ValidationDashboardPage calls `GET /validation/dashboard` — DOES NOT EXIST in backend**
- ValidationResultsPage has placeholder note saying backend needs work, but **20+ backend endpoints already exist**
- ExecutionHistoryPage ignores `useExecutionHistory` hook features (filtering, sorting, search)
- 5 validation sub-routes all render identical `ValidationPage` with no differentiation

### Backend APIs — MASSIVE UNUSED INVENTORY

| Endpoint | Status | Used by Frontend? |
|----------|--------|-------------------|
| `POST /execution/run` | ✅ | YES |
| `GET /execution/status/{batch_id}` | ✅ | YES |
| `GET /execution/history` | ✅ | YES |
| `POST /execution/history/{batch_id}/re-execute` | ✅ | YES |
| `GET /execution/{batch_id}/rules` | ✅ | **NO** |
| `GET /execution/{batch_id}/results` | ✅ | **NO** |
| `GET /execution/{batch_id}/report` | ✅ | **NO** |
| `GET /execution/{batch_id}/governance` | ✅ | **NO** |
| `GET /execution/{batch_id}/risk-score` | ✅ | **NO** |
| `GET /execution/{batch_id}/compliance` | ✅ | **NO** |
| `GET /execution/{batch_id}/lifecycle` | ✅ | **NO** |
| `GET /execution/{batch_id}/audit` | ✅ | **NO** |
| `POST /execution/{batch_id}/cancel` | ✅ | **NO** |
| `POST /execution/{batch_id}/pause` | ✅ | **NO** |
| `POST /execution/{batch_id}/resume` | ✅ | **NO** |
| `POST /execution/{batch_id}/retry` | ✅ | **NO** |
| `GET /execution/history/status-breakdown` | ✅ | **NO** |
| `GET /execution/history/{batch_id}` | ✅ | **NO** |
| `GET /execution/unscored-batches` | ✅ | **NO** |
| `GET /execution/orphaned-batches` | ✅ | **NO** |
| `GET /execution/risk-scores` | ✅ | **NO** |
| `GET /execution/migration-score-summary` | ✅ | **NO** |
| `GET /validation/dashboard` | ❌ | **MISSING** (only endpoint frontend needs that doesn't exist) |

---

## Target State (Design Option B)

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│ PageHeader: Validation Dashboard    [Tenant] [🔄 Live] [Refresh] [Export] │
├──────────────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │Comply│ │Passed│ │Failed│ │High  │ │Unscrd│  ← MetricCards │
│ │ 85%  │ │ 142  │ │  18  │ │  12  │ │  5   │               │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘               │
├──────────────────────────┬───────────────────────────────────┤
│ Compliance Gauge (50%)   │ Risk Distribution (50%)           │
│ ┌──────────────────────┐ │ ┌───────────────────────────────┐ │
│ │     ╭──────╮         │ │ │ HIGH   ████████░░  12         │ │
│ │    │  85%  │         │ │ │ MEDIUM ████████████  24        │ │
│ │     ╰──────╯         │ │ │ LOW    ████████████████  36    │ │
│ │  Total: 180          │ │ └───────────────────────────────┘ │
│ │  Passed: 142         │ │                                   │
│ │  Failed: 18          │ │                                   │
│ └──────────────────────┘ │                                   │
├──────────────────────────┴───────────────────────────────────┤
│ Active Runs                                                  │
│ ┌─────────────┬────────┬──────────┬──────┬──────────┬──────┐ │
│ │Batch ID     │Status  │Progress  │Risk  │Controls  │View  │ │
│ ├─────────────┼────────┼──────────┼──────┼──────────┼──────┤ │
│ │abc-123      │RUNNING │████░░ 60%│ HIGH │ 8/10     │[View]│ │
│ │def-456      │PASS    │████████  │ LOW  │ 10/10    │[View]│ │
│ └─────────────┴────────┴──────────┴──────┴──────────┴──────┘ │
├──────────────────────────────────────────────────────────────┤
│ Recent Alerts                                                │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Batch abc-123: 2 rules failed (C03, C05)     2m ago │ │
│ │ ✅ Batch def-456: All rules passed               15m ago│ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Features Required
1. **Real-time auto-refresh** — polling every 5-10s with "Live" indicator
2. **Compliance gauge** — circular CSS gauge (already exists, refine)
3. **Risk distribution** — horizontal bar chart (already exists, refine)
4. **Active runs table** — with View drill-down links
5. **Alerts feed** — color-coded, time-stamped
6. **Export PDF/CSV** — downloadable reports
7. **Tenant filter** — multi-tenant support (already exists)
8. **Unscored batches** — table with Score action
9. **Drill-down** — click batch → `/validation/results/:batchId`

---

## Implementation Plan

### Phase 1: Backend — Dashboard Endpoint (1 day)

| Task | Effort | Details |
|------|--------|---------|
| Create `GET /validation/dashboard` endpoint | 1d | Aggregate data from existing endpoints: risk-scores, unscored-batches, history, migration-score-summary. Return `ValidationDashboard` object. |

### Phase 2: Frontend Types & Hooks (1-1.5 days)

| Task | Effort | Details |
|------|--------|---------|
| Create `src/types/validation.ts` | 0.5d | `ValidationDashboard`, `ActiveRun`, `Alert`, `ValidationRule`, `GovernanceDecision`, `RiskScore`, `ComplianceCheck` |
| Create `src/hooks/useValidation.ts` | 0.5d | `useValidationDashboard()`, `useValidationRules(batchId)`, `useValidationReport(batchId)`, `useGovernanceDecision(batchId)`, `useExecutionControl()` |
| Update `useExecutionHistory` usage | 0.5d | Wire to existing hook instead of raw fetch |

### Phase 3: Dashboard Completion (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Add auto-refresh polling | 0.5d | Poll `/validation/dashboard` every 10s, "Live" indicator |
| Add drill-down links on active runs | 0.25d | View → `/validation/results/:batchId` |
| Add unscored batches table | 0.5d | Score/View actions |
| Add Export PDF/CSV buttons | 1d | Client-side generation or backend endpoint |
| Wire to real backend endpoint | 0.5d | Replace mock with `GET /validation/dashboard` |

### Phase 4: Results Page (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Add tabbed interface to ValidationResultsPage | 0.5d | Tabs: Overview, Rules, Governance, Compliance, Risk, Audit |
| Wire to existing backend endpoints | 1d | `/rules`, `/report`, `/governance`, `/compliance`, `/risk-score`, `/audit` |
| Add execution control buttons | 0.5d | Cancel, Pause, Resume, Retry |
| Add lifecycle viewer | 0.5d | Timeline of batch events |

### Phase 5: History + Polish (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Enhance ExecutionHistoryPage | 0.5d | Add filtering, sorting, search, status breakdown |
| Add status breakdown visualization | 0.5d | Pie/bar chart from `/execution/history/status-breakdown` |
| Consistency pass | 0.5d | Use shared components (StatusBadge, ErrorState, LoadingSkeleton) |
| Tests | 0.5d | Unit + integration for all modified pages |
| Responsive design | 0.5d | Dashboard grid stacks on mobile |

---

## Files to Create/Modify

### Backend
| File | Action |
|------|--------|
| `app/api/routes/validation_report_routes.py` | MODIFY — add `GET /validation/dashboard` |

### Frontend
| File | Action |
|------|--------|
| `src/types/validation.ts` | CREATE |
| `src/hooks/useValidation.ts` | CREATE |
| `src/routes/ValidationDashboardPage.tsx` | REWRITE |
| `src/routes/ValidationResultsPage.tsx` | REWRITE |
| `src/routes/ExecutionHistoryPage.tsx` | MODIFY |
| `src/routes/ValidationPage.tsx` | MODIFY — add "View Results" link |

---

## Acceptance Criteria

- [ ] Dashboard loads without errors (backend endpoint exists)
- [ ] Auto-refresh polls every 10s with "Live" indicator
- [ ] Compliance gauge shows correct percentage
- [ ] Risk distribution shows HIGH/MEDIUM/LOW bars
- [ ] Active runs table shows batch ID, status, progress, risk, controls
- [ ] Click "View" → navigates to `/validation/results/:batchId`
- [ ] Alerts feed shows color-coded, time-stamped entries
- [ ] Export PDF/CSV generates downloadable file
- [ ] Results page shows tabbed view: Overview, Rules, Governance, etc.
- [ ] Execution control (Cancel/Pause/Resume/Retry) works
- [ ] History page has filtering, sorting, search
- [ ] All states handled: loading, error, empty
- [ ] Dark mode works
- [ ] Responsive on mobile
