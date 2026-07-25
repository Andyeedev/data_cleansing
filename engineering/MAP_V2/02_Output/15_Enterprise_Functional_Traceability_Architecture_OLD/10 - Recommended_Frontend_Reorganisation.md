# Recommended Frontend Reorganisation

## Aligning the Frontend Presentation Layer with the Python Engine

---

## 1. Executive Summary

The frontend has evolved as a platform-first application with 17 top-level menus, 103+ submenus, and 9 portals. Only 2 of 14 Python engine capabilities have full API coverage. Approximately 30% of frontend pages have backend backing while ~70% rely on mock data or are platform-only placeholders. This document recommends realigning the frontend to serve as a thin presentation layer over the Python engine, which remains the primary business system.

---

## 2. Current State Analysis

### 2.1 Frontend Inventory

| Metric | Count |
|---|---|
| Top-level menus | 17 |
| Submenus | 103+ |
| Portals | 9 |
| Pages with backend backing | ~30% |
| Pages with mock data | ~70% |

### 2.2 Engine Capability Coverage

| Engine Capability | API Exists | Full Coverage |
|---|---|---|
| Migration Execution | Yes | Yes |
| Rule Engine | Yes | Yes |
| Dataset Discovery | No | No |
| Column Mapping | No | No |
| Control Discovery | No | No |
| Governance Decisions | No | No |
| Reporting (SQL views) | Partial | No |
| Audit Logging | No | No |
| Scheduling | No | No |
| Retry Management | No | No |
| Alert Management | No | No |
| User/Role Management | Platform | Platform |
| Tenant Management | Platform | Platform |
| Feature Flags | Platform | Platform |

### 2.3 Key Gaps

- Frontend pages exist for capabilities that have no corresponding API endpoints
- Mock data hooks are used where real engine data should be displayed
- Multiple portals duplicate the same underlying data (e.g., Reports portal and Report Centre)
- Navigation structure reflects platform features rather than business workflows

---

## 3. Target State Architecture

### 3.1 Principles

1. **Engine is the source of truth** - All business data originates from the Python engine
2. **Frontend is a thin presentation layer** - No business logic in the frontend
3. **Every page traces to a capability** - No orphan pages or mock-only screens
4. **Single responsibility per portal** - Each portal serves one business domain
5. **API-first development** - Backend APIs are built before frontend pages

### 3.2 Target Structure

```
Frontend (React/Next.js)
  └── Portal Router
        ├── Home Portal ─────────── /api/v1/execution/status
        ├── Migration Portal ────── /api/v1/discovery, /api/v1/column-mappings, /api/v1/execution
        ├── Validation Portal ───── /api/v1/rules, /api/v1/rules/discovery
        ├── Governance Portal ───── /api/v1/governance, /api/v1/controls
        ├── Reports Portal ──────── SQL views (read-only)
        ├── Operations Portal ───── /api/v1/execution/status, /api/v1/schedules, /api/v1/alerts
        ├── Administration Portal ─ Platform APIs (users, roles, tenants)
        └── Tasks Portal ────────── Platform APIs (workflows, tasks)
```

---

## 4. Recommendations

### Priority 1: Wire Existing Frontend to Existing Backend (Quick Wins)

These changes connect existing frontend pages to real engine data with minimal development effort.

| # | Frontend Page | Backend Target | Effort |
|---|---|---|---|
| 1 | Reports Portal > All report pages | SQL views (`v_migration_control_summary`, `v_migration_executive_summary`, `v_validation_rule_summary`, `v_governance_decision_log`, `v_audit_trail_summary`) | Low |
| 2 | Governance Portal > Overview | Create `/api/v1/governance/overview` reading from engine schema | Medium |
| 3 | Operations > Executions | Wire to `/api/v1/execution/status/{batch_id}` | Low |
| 4 | Operations > Retry Centre | Wire to execution retry status endpoint | Low |
| 5 | Security > Audit Logs | Wire to `audit.audit_events` table via new endpoint | Low |

**SQL Views Available for Wiring:**

```sql
-- Reports Portal
v_migration_control_summary          -- Migration control totals by status
v_migration_executive_summary        -- Executive-level migration summary
v_validation_rule_summary            -- Rule execution summary by type
v_governance_decision_log            -- Governance decisions with timestamps
v_audit_trail_summary                -- Audit event counts by category
v_column_mapping_summary             -- Column mapping coverage statistics
v_dataset_discovery_summary          -- Discovery scan results by status
v_error_summary_by_table             -- Error distribution across tables
```

**Estimated Impact:** ~15 pages wired to real data within 2 weeks.

---

### Priority 2: Create Missing Backend APIs

These APIs must be built before their corresponding frontend pages can be developed.

| # | API Endpoint | Purpose | Schema Tables | Effort |
|---|---|---|---|---|
| 1 | `GET /api/v1/discovery` | List dataset discovery scans | `migration.dataset_discovery` | Medium |
| 2 | `GET /api/v1/discovery/{scan_id}` | Get scan details | `migration.dataset_discovery` | Low |
| 3 | `POST /api/v1/discovery/scan` | Trigger new scan | `migration.dataset_discovery` | Medium |
| 4 | `GET /api/v1/column-mappings` | List column mappings | `migration.column_mappings` | Medium |
| 5 | `PUT /api/v1/column-mappings/{mapping_id}` | Update mapping | `migration.column_mappings` | Low |
| 6 | `POST /api/v1/column-mappings/bulk` | Bulk create mappings | `migration.column_mappings` | Medium |
| 7 | `GET /api/v1/controls` | List controls | `governance.control_master` | Medium |
| 8 | `POST /api/v1/controls` | Create control | `governance.control_master` | Low |
| 9 | `GET /api/v1/rules/discovery` | List discovered rules | `validation.rule_discovery` | Medium |
| 10 | `POST /api/v1/rules/discovery/{id}/approve` | Approve discovered rule | `validation.rule_discovery` | Low |
| 11 | `GET /api/v1/governance` | List governance decisions | `governance.decision_log` | Medium |
| 12 | `POST /api/v1/governance` | Log governance decision | `governance.decision_log` | Low |
| 13 | `GET /api/v1/reports/{report_type}` | Generate report | SQL views | Medium |
| 14 | `GET /api/v1/reports/templates` | List report templates | `reporting.report_templates` | Low |

**Estimated Impact:** Enables development of 5 new frontend pages and 30+ data-bound views.

---

### Priority 3: Create Missing Frontend Pages

New pages that trace to engine capabilities not yet represented in the frontend.

| # | Page | Portal | Backend API | Effort |
|---|---|---|---|---|
| 1 | Dataset Discovery | Migration | `GET /api/v1/discovery` | Medium |
| 2 | Column Mapping Editor | Migration | `GET/PUT /api/v1/column-mappings` | High |
| 3 | Rule Discovery Review | Validation | `GET /api/v1/rules/discovery` | Medium |
| 4 | Control Management | Governance | `GET/POST /api/v1/controls` | Medium |
| 5 | Execution Monitoring Dashboard | Operations | `GET /api/v1/execution/status` | High |

**Page Specifications:**

#### Dataset Discovery (Migration Portal)
- List of discovery scans with status indicators
- Drill-down to scan results showing source/target schema comparison
- Trigger new scan action
- Filter by project, status, date range

#### Column Mapping Editor (Migration Portal)
- Table-based editor for source-to-target column mappings
- Bulk import/export capability
- Validation indicators for mapping completeness
- Integration with rule engine for auto-mapped columns

#### Rule Discovery Review (Validation Portal)
- List of rules discovered during migration execution
- Approve/reject/modify workflow
- Link to affected tables and columns
- Severity and category classification

#### Control Management (Governance Portal)
- CRUD interface for governance controls
- Compliance status indicators
- Link to audit trail for control execution history
- Exception management workflow

#### Execution Monitoring Dashboard (Operations Portal)
- Real-time execution status with progress indicators
- Error rate and throughput metrics
- Retry status and queue depth
- Alert integration for threshold breaches

---

### Priority 4: Consolidate Duplicated Pages

Merge redundant portals and pages to reduce navigation complexity.

| # | Current State | Target State | Pages Eliminated |
|---|---|---|---|
| 1 | Reports Portal (12 pages) + Report Centre (7 pages) | Single Reports Portal | 12 pages |
| 2 | Report Scheduler (11 pages) | Merge into Reports Portal | 11 pages |
| 3 | Report Distribution (13 pages) | Merge into Reports Portal | 13 pages |
| 4 | Duplicate navigation entries across portals | Consolidated under parent menus | ~15 entries |

**Consolidated Reports Portal Structure:**

```
Reports
  ├── Executive Summary
  ├── Operational Reports
  ├── Migration Reports
  ├── Validation Reports
  ├── Governance Reports
  ├── Audit Reports
  ├── Templates
  ├── Distribution
  └── Scheduling
```

**Estimated Impact:** 36 pages reduced to 9 pages. 19 navigation entries eliminated.

---

### Priority 5: Remove Mock Data Pages

Systematically replace mock data with real API calls and remove placeholder pages.

| # | Action | Scope | Effort |
|---|---|---|---|
| 1 | Replace mock data hooks with real API calls | All pages using `useMockData`, `useSimulatedData`, or hardcoded data | High |
| 2 | Remove placeholder pages | Pages with no backend and no clear business capability | Low |
| 3 | Consolidate redundant navigation entries | Menus with overlapping functionality | Low |

**Mock Data Audit Checklist:**

- [ ] Identify all `useMockData` / `useSimulatedData` hooks in codebase
- [ ] Map each mock hook to a real API endpoint
- [ ] Create API client functions for each endpoint
- [ ] Replace mock hooks with API client calls
- [ ] Remove mock data files and type definitions
- [ ] Verify all pages display real data

---

## 5. Menu Structure Recommendation

### 5.1 Current vs Recommended

| Current | Count | Recommended | Count | Reduction |
|---|---|---|---|---|
| Top-level menus | 17 | Top-level menus | 8 | 53% |
| Submenus | 103+ | Submenus | ~60 | 42% |
| Portals | 9 | Portals | 8 | 11% |

### 5.2 Recommended Menu Structure

| Menu | Submenus | Backend Required |
|---|---|---|
| **Home** | Dashboard | `/api/v1/execution/status` |
| **Migration** | Projects, Discovery, Mappings, Column Mappings, Execution, History | Multiple APIs (`/api/v1/discovery`, `/api/v1/column-mappings`, `/api/v1/execution`) |
| **Validation** | Rules, Rule Discovery, Results, Queue | Multiple APIs (`/api/v1/rules`, `/api/v1/rules/discovery`) |
| **Governance** | Overview, Controls, Compliance, Exceptions, Risk, Audit, Approvals | Multiple APIs (`/api/v1/governance`, `/api/v1/controls`) |
| **Reports** | Executive, Operational, Migration, Validation, Governance, Audit, Templates, Distribution | SQL views (read-only) |
| **Operations** | Monitoring, Alerts, Schedules, Retry | Multiple APIs (`/api/v1/execution/status`, `/api/v1/schedules`, `/api/v1/alerts`) |
| **Administration** | Users, Roles, Tenants, Settings, Feature Flags | Platform APIs |
| **Tasks** | Dashboard, My Tasks, Workflows, Calendar, Notifications | Platform APIs |

### 5.3 Navigation Hierarchy

```
Home
  └── Dashboard

Migration
  ├── Projects
  ├── Discovery
  ├── Mappings
  ├── Column Mappings
  ├── Execution
  └── History

Validation
  ├── Rules
  ├── Rule Discovery
  ├── Results
  └── Queue

Governance
  ├── Overview
  ├── Controls
  ├── Compliance
  ├── Exceptions
  ├── Risk
  ├── Audit
  └── Approvals

Reports
  ├── Executive
  ├── Operational
  ├── Migration
  ├── Validation
  ├── Governance
  ├── Audit
  ├── Templates
  └── Distribution

Operations
  ├── Monitoring
  ├── Alerts
  ├── Schedules
  └── Retry

Administration
  ├── Users
  ├── Roles
  ├── Tenants
  ├── Settings
  └── Feature Flags

Tasks
  ├── Dashboard
  ├── My Tasks
  ├── Workflows
  ├── Calendar
  └── Notifications
```

---

## 6. Migration Roadmap

### Phase 1: Foundation (Weeks 1-3)

**Objective:** Wire existing pages to real data and establish API patterns.

| Task | Owner | Effort | Deliverable |
|---|---|---|---|
| Create `/api/v1/reports` endpoints wiring to SQL views | Backend | 1 week | Reports API |
| Wire Reports Portal pages to new API | Frontend | 1 week | Real data in reports |
| Create `/api/v1/execution/status` endpoint | Backend | 3 days | Execution status API |
| Wire Operations > Executions page | Frontend | 2 days | Real execution data |
| Create `/api/v1/audit/events` endpoint | Backend | 3 days | Audit API |
| Wire Security > Audit Logs page | Frontend | 2 days | Real audit data |
| Wire Governance > Overview page | Frontend | 3 days | Governance overview |

**Exit Criteria:** 15+ pages displaying real engine data. API patterns established.

---

### Phase 2: Core APIs (Weeks 4-7)

**Objective:** Build missing backend APIs for core engine capabilities.

| Task | Owner | Effort | Deliverable |
|---|---|---|---|
| Create `/api/v1/discovery` CRUD endpoints | Backend | 1 week | Discovery API |
| Create `/api/v1/column-mappings` CRUD endpoints | Backend | 1 week | Column mappings API |
| Create `/api/v1/controls` CRUD endpoints | Backend | 1 week | Controls API |
| Create `/api/v1/rules/discovery` endpoints | Backend | 1 week | Rule discovery API |
| Create `/api/v1/governance` endpoints | Backend | 1 week | Governance API |
| Create `/api/v1/schedules` endpoints | Backend | 3 days | Scheduling API |
| Create `/api/v1/alerts` endpoints | Backend | 3 days | Alerts API |
| API integration tests | QA | 1 week | Test coverage |

**Exit Criteria:** 14 API endpoints fully implemented and tested.

---

### Phase 3: New Pages (Weeks 8-11)

**Objective:** Build missing frontend pages backed by new APIs.

| Task | Owner | Effort | Deliverable |
|---|---|---|---|
| Build Dataset Discovery page | Frontend | 1 week | Discovery UI |
| Build Column Mapping Editor | Frontend | 2 weeks | Mapping editor UI |
| Build Rule Discovery Review page | Frontend | 1 week | Rule discovery UI |
| Build Control Management page | Frontend | 1 week | Controls UI |
| Build Execution Monitoring Dashboard | Frontend | 2 weeks | Monitoring UI |
| E2E testing for new pages | QA | 1 week | Test coverage |

**Exit Criteria:** 5 new pages fully functional with real data.

---

### Phase 4: Consolidation (Weeks 12-14)

**Objective:** Merge duplicated portals and remove mock data.

| Task | Owner | Effort | Deliverable |
|---|---|---|---|
| Merge Report Centre into Reports Portal | Frontend | 1 week | Consolidated reports |
| Merge Report Scheduler into Reports Portal | Frontend | 1 week | Consolidated scheduling |
| Merge Report Distribution into Reports Portal | Frontend | 1 week | Consolidated distribution |
| Remove all mock data hooks | Frontend | 1 week | No mock data |
| Remove placeholder pages | Frontend | 2 days | Clean page inventory |
| Update navigation structure | Frontend | 2 days | 8-menu navigation |

**Exit Criteria:** Single Reports Portal. No mock data. 8 top-level menus.

---

### Phase 5: Polish & Hardening (Weeks 15-16)

**Objective:** Final validation, performance optimization, and documentation.

| Task | Owner | Effort | Deliverable |
|---|---|---|---|
| Full regression testing | QA | 1 week | Test report |
| Performance audit | Frontend | 3 days | Performance baseline |
| Accessibility audit | Frontend | 2 days | WCAG compliance |
| API documentation | Backend | 2 days | OpenAPI specs |
| Frontend architecture docs | Frontend | 2 days | Architecture guide |
| Update MAP_V2 traceability matrices | Architecture | 1 day | Updated documentation |

**Exit Criteria:** All pages traced to engine capabilities. Full test coverage. Documentation complete.

---

## 7. Timeline Summary

```
Week  1-3  ████░░░░░░░░░░░░░░░░ Phase 1: Foundation
Week  4-7  ░░░░████████░░░░░░░░ Phase 2: Core APIs
Week  8-11 ░░░░░░░░░░░░████████ Phase 3: New Pages
Week 12-14 ░░░░░░░░░░░░░░░░████ Phase 4: Consolidation
Week 15-16 ░░░░░░░░░░░░░░░░░░██ Phase 5: Polish
```

**Total Duration:** 16 weeks (4 months)

---

## 8. Success Metrics

| Metric | Current | Target |
|---|---|---|
| Frontend pages with real backend | ~30% | 100% |
| Mock data hooks | ~70% of pages | 0% |
| Top-level menus | 17 | 8 |
| Submenus | 103+ | ~60 |
| Engine capabilities with full API | 2/14 | 14/14 |
| Pages per portal (avg) | 11.4 | 7.5 |

---

## 9. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Engine schema changes during API development | High | Medium | Lock schema before Phase 2. Use view abstractions. |
| Frontend team unfamiliar with engine internals | Medium | High | Pair programming sessions. Engine team provides API contracts. |
| Mock data removal breaks pages before real API ready | High | Medium | Wire real API first, then remove mock. Never remove before wiring. |
| Consolidation introduces navigation regressions | Medium | Low | A/B test navigation changes. Maintain feature flags for rollback. |
| SQL views have performance issues at scale | Medium | Medium | Index optimization in Phase 1. Load testing before Phase 4. |

---

## 10. Appendix: API Contract Summary

### 10.1 Discovery API

```yaml
GET /api/v1/discovery:
  summary: List discovery scans
  parameters:
    - name: project_id
      type: string
    - name: status
      enum: [pending, running, completed, failed]
    - name: limit
      type: integer
      default: 50
  response:
    type: array
    items: DiscoveryScan

GET /api/v1/discovery/{scan_id}:
  summary: Get scan details
  response: DiscoveryScan

POST /api/v1/discovery/scan:
  summary: Trigger new scan
  request: ScanRequest
  response: DiscoveryScan
```

### 10.2 Column Mappings API

```yaml
GET /api/v1/column-mappings:
  summary: List column mappings
  parameters:
    - name: project_id
      type: string
    - name: table_name
      type: string
  response:
    type: array
    items: ColumnMapping

PUT /api/v1/column-mappings/{mapping_id}:
  summary: Update mapping
  request: ColumnMappingUpdate
  response: ColumnMapping

POST /api/v1/column-mappings/bulk:
  summary: Bulk create mappings
  request: BulkMappingRequest
  response: BulkMappingResponse
```

### 10.3 Controls API

```yaml
GET /api/v1/controls:
  summary: List controls
  parameters:
    - name: category
      type: string
    - name: status
      enum: [active, inactive, pending]
  response:
    type: array
    items: Control

POST /api/v1/controls:
  summary: Create control
  request: ControlCreate
  response: Control
```

### 10.4 Rule Discovery API

```yaml
GET /api/v1/rules/discovery:
  summary: List discovered rules
  parameters:
    - name: status
      enum: [pending, approved, rejected]
  response:
    type: array
    items: DiscoveredRule

POST /api/v1/rules/discovery/{id}/approve:
  summary: Approve discovered rule
  request: RuleApproval
  response: Rule
```

### 10.5 Governance API

```yaml
GET /api/v1/governance:
  summary: List governance decisions
  parameters:
    - name: type
      type: string
    - name: date_from
      type: string
      format: date
  response:
    type: array
    items: GovernanceDecision

POST /api/v1/governance:
  summary: Log governance decision
  request: GovernanceDecisionCreate
  response: GovernanceDecision
```

---

*Document version: 1.0*
*Last updated: 2026-07-14*
*Author: Architecture Team*
