# 10.5.1 — Connection Manager Completion

**Authority:** This document is the single source of truth for implementing the Connection Manager workstream.
**Target Layout:** Option C – Full Diagnostic Page
**Route:** `/migration/connections/diagnostics`
**Est. Effort:** 10-14 days

---

## INSTRUCTION — READ BEFORE PROCEEDING

> **Do not start implementing immediately.**
>
> First execute **Step 1 (Assessment)** and produce the assessment report.
> Wait for **explicit approval** before proceeding to Step 2.
>
> This keeps the approval gate in place and ensures we check the existing implementation before changing anything.

---

## Execution Steps

| Step | Name | Description | Gate |
|------|------|-------------|------|
| **1** | **Assessment** | Read all existing code, verify current state, produce assessment report | ⏸ WAIT FOR APPROVAL |
| **2** | **Backend** | Create diagnostics API, enhance test_connection, add CRUD endpoints | — |
| **3** | **Frontend Foundation** | Types, hooks, shared components | — |
| **4** | **Frontend CRUD** | System create/edit/delete, enhance existing pages | — |
| **5** | **Diagnostic Page** | Split-pane layout, tabbed detail, all tabs | — |
| **6** | **Polish** | Export, responsive, accessibility, tests | — |
| **7** | **Closure** | Verify acceptance criteria, produce closure report | ✅ GATE REVIEW |

---

## Step 1 — Assessment

### Objective
Produce a factual assessment of the current Connection Manager implementation. No code changes. Read-only exploration.

### Instructions

1. **Read all existing page files:**
   - `src/routes/SystemsPage.tsx`
   - `src/routes/SystemDetailPage.tsx`
   - `src/routes/ConnectionDiagnosticsPage.tsx`

2. **Read all existing hooks:**
   - `src/hooks/useSystems.ts`
   - `src/hooks/useHealth.ts`

3. **Read all existing types:**
   - `src/types/systems.ts`

4. **Read backend route files:**
   - `app/api/routes/system_routes.py`
   - `app/api/routes/credential_routes.py`

5. **Read backend service files:**
   - `app/services/system_service.py`

6. **Check for shared components used:**
   - `src/components/shared/ConnectionTestPanel.tsx`

7. **Read design documents:**
   - `src/designs/Connection_Layout_Option_C*`
   - `src/designs/Connection_Design_Option_C*`

### Assessment Report Template

Produce a report with these sections:

```markdown
# Connection Manager — Assessment Report

## 1. Page Inventory
For each page: file path, line count, what it implements, what's missing.

## 2. Hook Inventory
For each hook: file path, API endpoints consumed, return shape.

## 3. Type Inventory
For each type: file path, interfaces defined, interfaces missing.

## 4. Backend API Audit
For each endpoint: method, path, exists? consumed? notes.

## 5. Component Usage
Which shared components are used vs which should be used.

## 6. Broken Items
List every broken item: wrong API paths, missing imports, Tailwind classNames, etc.

## 7. Gap Analysis
What exists vs what Design Option C requires.

## 8. Effort Re-estimate
Based on actual code review, re-estimate effort per phase.

## 9. Risks & Blockers
Any risks or blockers discovered during assessment.
```

### Approval Gate

**STOP HERE.** Do not proceed to Step 2 until:
- Assessment report is produced
- Report is reviewed
- Explicit approval is given

---

## Step 2 — Backend

### Objective
Create the backend API endpoints and database schema needed by the diagnostic page.

### Tasks

| # | Task | File | Effort | Depends |
|---|------|------|--------|---------|
| 2.1 | Create `core.connection_diagnostics` table | SQL migration | 0.5d | — |
| 2.2 | Create `diagnostics_repository.py` | `app/db/repositories/` | 0.5d | 2.1 |
| 2.3 | Create `diagnostics_service.py` | `app/services/` | 1d | 2.2 |
| 2.4 | Create `diagnostics_routes.py` | `app/api/routes/` | 1d | 2.3 |
| 2.5 | Register router in `app/api/main.py` | `app/api/main.py` | 0.1d | 2.4 |
| 2.6 | Enhance `test_connection` to return latency/version | `app/services/system_service.py` | 0.5d | — |
| 2.7 | Add PUT `/systems/{id}` | `app/api/routes/system_routes.py` | 0.25d | — |
| 2.8 | Add DELETE `/systems/{id}` | `app/api/routes/system_routes.py` | 0.25d | — |
| 2.9 | Backend tests | test files | 0.5d | 2.4-2.8 |

### API Endpoints to Create

| Method | Path | Request | Response | Notes |
|--------|------|---------|----------|-------|
| `GET` | `/diagnostics/summary` | `?tenant_id=` | `{ total_systems, healthy, unhealthy, health_percent }` | Aggregate counts |
| `GET` | `/diagnostics` | `?tenant_id=&search=` | `[{ system_id, name, type, role, health_checks: [...], overall_status }]` | All systems with health |
| `POST` | `/diagnostics/{system_id}/run` | — | `DiagnosticResult` | Trigger on-demand check |
| `GET` | `/diagnostics/{system_id}` | — | `DiagnosticResult` | Get cached result |
| `GET` | `/diagnostics/{system_id}/history` | `?page=&page_size=` | `PaginatedHistory` | Test history |
| `GET` | `/diagnostics/{system_id}/schema` | — | `{ tables: [...] }` | Schema browser |

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS core.connection_diagnostics (
    diagnostic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID NOT NULL,
    check_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,  -- pass, fail, warning
    message TEXT,
    latency_ms DECIMAL(10,2),
    server_version VARCHAR(100),
    checked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_diagnostics_system_id ON core.connection_diagnostics(system_id);
CREATE INDEX idx_diagnostics_checked_at ON core.connection_diagnostics(checked_at DESC);
```

### Approval Gate
Backend complete, endpoints tested via curl/httpie, no errors.

---

## Step 3 — Frontend Foundation

### Objective
Create types, hooks, and fix broken shared components.

### Tasks

| # | Task | File | Effort | Depends |
|---|------|------|--------|---------|
| 3.1 | Expand `src/types/systems.ts` | `src/types/systems.ts` | 0.25d | — |
| 3.2 | Create `src/hooks/useDiagnostics.ts` | `src/hooks/` | 0.25d | — |
| 3.3 | Add mutation hooks to `src/hooks/useSystems.ts` | `src/hooks/useSystems.ts` | 0.25d | — |
| 3.4 | Fix `ConnectionTestPanel.tsx` | `src/components/shared/ConnectionTestPanel.tsx` | 0.25d | — |

### Types to Add

```typescript
// src/types/systems.ts — additions

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  latency_ms?: number;
}

interface ConnectionProfile {
  max_connections: number;
  active_connections: number;
  idle_connections: number;
  avg_query_time_ms: number;
  uptime_percent: number;
}

interface TestHistoryEntry {
  timestamp: string;
  status: 'success' | 'failed';
  latency_ms: number;
  server_version?: string;
  message: string;
}

interface DiagnosticResult {
  system_id: string;
  system_name: string;
  database_type: string;
  system_role: string;
  health_checks: HealthCheck[];
  connection_profile: ConnectionProfile;
  test_history: TestHistoryEntry[];
  overall_status: 'healthy' | 'unhealthy' | 'unknown';
}

interface DiagnosticSummary {
  total_systems: number;
  healthy_systems: number;
  unhealthy_systems: number;
  overall_health_percent: number;
}

interface CreateSystemRequest {
  project_id: string;
  system_name: string;
  system_role: 'SOURCE' | 'TARGET';
  database_type: string;
  connection_config: ConnectionConfig;
  credential_id?: string;
}

interface UpdateSystemRequest {
  system_name?: string;
  system_role?: string;
  database_type?: string;
  connection_config?: ConnectionConfig;
}
```

### Hooks to Create

```typescript
// src/hooks/useDiagnostics.ts

export function useDiagnosticSummary() {
  // GET /diagnostics/summary
  // Returns { data: DiagnosticSummary, loading, error, refetch }
}

export function useDiagnosticDetail(systemId: string | null) {
  // GET /diagnostics/{systemId}
  // Returns { data: DiagnosticResult, loading, error, refetch }
}

export function useRunDiagnostics() {
  // POST /diagnostics/{systemId}/run
  // Returns { runDiagnostics(id) => Promise<DiagnosticResult>, loading, error }
}
```

### Approval Gate
Types compile, hooks return correct shapes, ConnectionTestPanel renders with inline styles.

---

## Step 4 — Frontend CRUD

### Objective
Add system create/edit/delete functionality to existing pages.

### Tasks

| # | Task | File | Effort | Depends |
|---|------|------|--------|---------|
| 4.1 | Create `SystemFormModal.tsx` | `src/components/` | 1d | 3.1, 3.3 |
| 4.2 | Enhance `SystemsPage.tsx` | `src/routes/SystemsPage.tsx` | 0.5d | 4.1 |
| 4.3 | Enhance `SystemDetailPage.tsx` | `src/routes/SystemDetailPage.tsx` | 0.5d | 4.1 |
| 4.4 | Wire CRUD to backend | — | 0.5d | 4.1-4.3 |

### SystemFormModal Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| system_name | text | ✅ | e.g., "Production PostgreSQL" |
| system_role | select | ✅ | SOURCE / TARGET |
| database_type | select | ✅ | postgres / sqlserver / mysql / oracle |
| connection_config.host | text | ✅ | hostname or IP |
| connection_config.port | number | ✅ | default by type |
| connection_config.database | text | ✅ | database name |
| credential.username | text | ✅ | |
| credential.password | password | ✅ | |

### SystemsPage Enhancements

| Current | Target |
|---------|--------|
| Filter dropdowns only | Add "Create New System" button |
| No edit/delete | Add edit icon + delete icon per row |
| No link to diagnostics | Add "Diagnostics" link per row |
| No pagination | Add Pagination component |

### SystemDetailPage Enhancements

| Current | Target |
|---------|--------|
| Read-only | Add "Edit" button → opens SystemFormModal |
| No delete | Add "Delete" button → ConfirmDialog |
| LoadingSpinner/ErrorMessage | Use shared LoadingSkeleton/ErrorState |
| No credential display | Show credential info (masked password) |
| No link to diagnostics | Add "Run Full Diagnostics" button |

### Approval Gate
Create/Edit/Delete system works end-to-end via UI.

---

## Step 5 — Diagnostic Page

### Objective
Rewrite `ConnectionDiagnosticsPage.tsx` to match Design Option C.

### Tasks

| # | Task | File | Effort | Depends |
|---|------|------|--------|---------|
| 5.1 | Create `SplitPane.tsx` component | `src/components/shared/` | 0.5d | — |
| 5.2 | Build diagnostic page layout | `src/routes/ConnectionDiagnosticsPage.tsx` | 1d | 3.2, 5.1 |
| 5.3 | Build Health tab | same file | 0.5d | 5.2 |
| 5.4 | Build Profile tab | same file | 0.5d | 5.2 |
| 5.5 | Build History tab | same file | 0.5d | 5.2 |
| 5.6 | Build Schema tab | same file | 1d | 5.2 |

### SplitPane Component

```typescript
// src/components/shared/SplitPane.tsx

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;  // percentage, default 30
  minWidth?: number;          // px, default 200
  maxWidth?: number;          // px, default 50
}
```

- Draggable divider (mousedown → mousemove → mouseup)
- Persist split position to `localStorage`
- CSS: `display: flex`, left panel `flex: 0 0 {width}%`, right panel `flex: 1`
- Divider: `width: 4px`, `cursor: col-resize`, `background: var(--color-border)`

### TabBar Integration

| Tab | Content | Data Source |
|-----|---------|-------------|
| Health | Health check list with status icons, latency | `useDiagnosticDetail(id).health_checks` |
| Profile | Connection pool stats, uptime gauge | `useDiagnosticDetail(id).connection_profile` |
| History | DataTable with timestamp, status, latency, version | `useDiagnosticDetail(id).test_history` |
| Schema | Tree of tables and columns | `GET /diagnostics/{id}/schema` |

### Approval Gate
Page renders split-pane layout, all tabs functional, data loads from backend.

---

## Step 6 — Polish

### Tasks

| # | Task | Effort | Depends |
|---|------|--------|---------|
| 6.1 | Export report (JSON blob download) | 0.25d | 5.* |
| 6.2 | Responsive layout (stack on mobile) | 0.25d | 5.* |
| 6.3 | Accessibility audit (ARIA, keyboard, focus) | 0.25d | 5.* |
| 6.4 | Unit tests for new code | 0.25d | 5.* |

---

## Step 7 — Closure

### Acceptance Criteria Checklist

| # | Criterion | Verified |
|---|-----------|----------|
| 1 | System list shows all registered systems with health status preview | ☐ |
| 2 | Click system → detail panel opens with tabs | ☐ |
| 3 | Health tab shows all checks with pass/fail/latency | ☐ |
| 4 | Profile tab shows connection pool stats | ☐ |
| 5 | History tab shows timestamped test results | ☐ |
| 6 | Schema tab shows tables and columns from remote system | ☐ |
| 7 | "Run Diagnostics" triggers on-demand check and updates view | ☐ |
| 8 | Create/Edit/Delete system works end-to-end | ☐ |
| 9 | Export generates downloadable report | ☐ |
| 10 | Split pane is resizable | ☐ |
| 11 | All states handled: loading, error, empty | ☐ |
| 12 | Dark mode works correctly | ☐ |
| 13 | Keyboard accessible | ☐ |

### Closure Report Template

```markdown
# Connection Manager — Closure Report

## Verification Results
For each acceptance criterion: PASS/FAIL with evidence.

## Files Changed
List all files created/modified with brief description.

## Known Issues
Any issues intentionally deferred.

## Sign-off
- [ ] Acceptance criteria verified
- [ ] Code reviewed
- [ ] Tests pass
- [ ] Documentation updated
```

---

## Files Reference

### Backend — Create
| File | Purpose |
|------|---------|
| `app/api/routes/diagnostics_routes.py` | Diagnostics API endpoints |
| `app/services/diagnostics_service.py` | Diagnostics business logic |
| `app/db/repositories/diagnostics_repository.py` | Diagnostics data access |

### Backend — Modify
| File | Change |
|------|--------|
| `app/api/main.py` | Register diagnostics router |
| `app/api/routes/system_routes.py` | Add PUT/DELETE endpoints |
| `app/services/system_service.py` | Enhance test_connection |

### Frontend — Create
| File | Purpose |
|------|---------|
| `src/hooks/useDiagnostics.ts` | Diagnostics hooks |
| `src/components/shared/SplitPane.tsx` | Resizable split pane |
| `src/components/SystemFormModal.tsx` | Create/Edit form |

### Frontend — Modify
| File | Change |
|------|--------|
| `src/types/systems.ts` | Expand type definitions |
| `src/hooks/useSystems.ts` | Add mutation hooks |
| `src/routes/SystemsPage.tsx` | Add CRUD actions |
| `src/routes/SystemDetailPage.tsx` | Add edit/delete, use shared components |
| `src/routes/ConnectionDiagnosticsPage.tsx` | Full rewrite |
| `src/components/shared/ConnectionTestPanel.tsx` | Fix Tailwind → inline styles |
