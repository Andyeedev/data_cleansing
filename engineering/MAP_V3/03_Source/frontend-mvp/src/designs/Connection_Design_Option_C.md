# Connection Design — Option C: Standalone Diagnostic Page

## Concept
A dedicated full-page diagnostic view with advanced connection testing, visual health checks, and detailed connection profiling. Goes beyond simple pass/fail.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Connection Diagnostics     [← Back]           │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─ System Info ──────────────────────────────┐ │
│  │ System:  my-postgres-prod                  │ │
│  │ Type:    PostgreSQL 15.2                   │ │
│  │ Host:    db.example.com:5432               │ │
│  │ Role:    Source                            │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Health Check ─────────────────────────────┐ │
│  │  ● Network Reachability    PASS (12ms)     │ │
│  │  ● Authentication          PASS            │ │
│  │  ● SSL Certificate         PASS (valid)    │ │
│  │  ● Database Version        PASS (15.2)     │ │
│  │  ● Connection Pool         PASS (3/10)     │ │
│  │  ● Query Execution         PASS (2ms)      │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Connection Profile ───────────────────────┐ │
│  │  Max Connections:     100 / 100            │ │
│  │  Active Connections:  3                    │ │
│  │  Idle Connections:    7                    │ │
│  │  Avg Query Time:      42ms                 │ │
│  │  Uptime:              99.97%               │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Recent Tests ─────────────────────────────┐ │
│  │  [table with 20 most recent test results]  │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  [Run Full Diagnostic]  [Export Report]         │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **Full page** — Dedicated route `/systems/{id}/connection-diagnostics`
- **Multi-step health check** — Runs network, auth, SSL, version, pool, and query checks sequentially
- **Visual pass/fail per check** — Green check/red X for each sub-test
- **Connection profiling** — Shows pool stats, query performance, uptime
- **Test history table** — Paginated table of last 20 test results
- **Export report** — Button to export diagnostics as PDF/JSON
- **Back navigation** — Returns to previous page

## Visual Design

- Uses `PageContainer` and `PageHeader` components
- Health checks: `grid grid-cols-2 gap-4` with `StatusBadge` per check
- Connection profile: `grid grid-cols-2 gap-4` with metric cards
- Test history: `DataTable` component with sortable columns
- Follows existing Tailwind utility class conventions
- Uses existing `MetricCard`, `StatusBadge`, `ProgressBar`, `DataTable` components

## Props Interface

```tsx
interface ConnectionDiagnosticsPageProps {
  systemId: string;
}
```

## API Endpoints Needed

```
GET /api/v1/systems/{id}/diagnostics     — full diagnostic report
GET /api/v1/systems/{id}/test-history     — paginated test history
POST /api/v1/systems/{id}/run-diagnostics — trigger full diagnostic
GET /api/v1/systems/{id}/export-diagnostics — export as PDF/JSON
```

## Pros
- Most comprehensive diagnostic view
- Suitable for production troubleshooting
- Exportable reports for compliance
- Connection profiling helps capacity planning
- Professional, admin-grade interface

## Cons
- Most complex to implement
- Requires new backend API endpoints
- Overkill for simple connection verification
- Full page — not embeddable in forms
- Longer development time

## When to Use
- Production environment diagnostics
- Troubleshooting complex connection issues
- Compliance/audit reporting
- Capacity planning and monitoring
- Admin dashboard views