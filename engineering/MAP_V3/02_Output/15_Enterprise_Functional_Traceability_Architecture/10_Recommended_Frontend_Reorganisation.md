# Recommended Frontend Reorganisation

**Date:** 14 July 2026  
**Audit:** Enterprise Functional Traceability Audit (Prompt 15)  

---

## 1. Current State

| Metric | Value |
|--------|-------|
| Top-Level Menus | 17 |
| Submenus | 103+ |
| Pages | 134 |
| Portals | 9 |
| Pages with Backend | 19 (14%) |
| Pages with Mock Data | 98 (73%) |

---

## 2. Target State

| Metric | Value |
|--------|-------|
| Top-Level Menus | 8 |
| Submenus | ~60 |
| Pages | ~70 |
| Portals | 5 |
| Pages with Backend | 70 (100%) |
| Pages with Mock Data | 0 |

---

## 3. Recommended Menu Structure

### 3.1 Current vs Recommended

| Current Menu | Submenus | Recommended | Submenus | Action |
|--------------|----------|-------------|----------|--------|
| Home | — | Home | — | Keep |
| Executive Dashboard | — | Executive | 5 | Merge with dashboards |
| Operations | 7 | Operations | 5 | Consolidate |
| Migration | 9 | Migration | 8 | Keep, add Discovery |
| Task Management | 7 | Tasks | 5 | Simplify |
| Validation | 3 | Validation | 4 | Add Rule Discovery |
| Governance | 9 | Governance | 6 | Consolidate |
| Risk | 3 | — | — | Merge into Governance |
| Reports | 12 | Reports | 8 | Merge all report portals |
| Report Centre | 7 | — | — | Merge into Reports |
| Report Scheduler | 11 | — | — | Merge into Reports |
| Report Distribution | 13 | — | — | Merge into Reports |
| Security | 15 | Security | 6 | Consolidate |
| AI Platform | 4 | — | — | Merge into Reports/Operations |
| Administration | 17 | Administration | 8 | Consolidate |
| Settings | 2 | Settings | 2 | Keep |
| Help | 2 | Help | 2 | Keep |

### 3.2 Recommended 8-Menu Structure

| # | Menu | Submenus | Backend Required |
|---|------|----------|-----------------|
| 1 | **Home** | Dashboard | /api/v1/execution/status |
| 2 | **Migration** | Projects, Discovery, Mappings, Column Mappings, Execution, History, Reports, Workspace | Multiple APIs |
| 3 | **Validation** | Rules, Rule Discovery, Results, Queue, Controls | Multiple APIs |
| 4 | **Governance** | Overview, Compliance, Controls, Exceptions, Risk, Audit, Approvals | Multiple APIs |
| 5 | **Reports** | Executive, Operational, Migration, Validation, Governance, Audit, Templates, Distribution | SQL views |
| 6 | **Operations** | Monitoring, Alerts, Schedules, Retry, Health | Multiple APIs |
| 7 | **Administration** | Users, Roles, Tenants, Settings, Feature Flags, Security, Notifications, Maintenance | Platform APIs |
| 8 | **Tasks** | Dashboard, My Tasks, Workflows, Calendar, Notifications | Platform APIs |

---

## 4. Priority Recommendations

### Priority 1: Wire Existing Frontend to Existing Backend (Quick Wins)

| # | Frontend Portal | Backend Target | Effort | Impact |
|---|----------------|---------------|--------|--------|
| 1 | Reports Portal (12 pages) | SQL views (5 views in reporting schema) | Low | 12 pages get real data |
| 2 | Governance Portal (9 pages) | New /api/v1/governance endpoints | Medium | 9 pages get real data |
| 3 | Operations > Executions | /api/v1/execution/status | Low | 1 page gets real data |
| 4 | Operations > Retry Centre | /api/v1/execution/status (retry info) | Low | 1 page gets real data |
| 5 | Security > Audit Logs | audit.audit_events table | Low | 1 page gets real data |

### Priority 2: Create Missing Backend APIs

| # | API Group | Endpoints | Frontend Pages Unlocked | Effort |
|---|-----------|-----------|------------------------|--------|
| 1 | /api/v1/governance | 6 endpoints | 9 (Governance portal) | Medium |
| 2 | /api/v1/reports | 6 endpoints (SQL views) | 12 (Reports portal) | Low |
| 3 | /api/v1/discovery | 4 endpoints | 3 (Migration pages) | Medium |
| 4 | /api/v1/audit | 3 endpoints | 3 (Security pages) | Low |
| 5 | /api/v1/controls | 3 endpoints | 2 (Governance pages) | Low |
| 6 | /api/v1/column-mappings | 3 endpoints | 2 (Migration pages) | Low |
| 7 | /api/v1/rules/discovery | 3 endpoints | 2 (Validation pages) | Low |

### Priority 3: Create Missing Frontend Pages

| # | Page | Portal | Backend Required | Effort |
|---|------|--------|-----------------|--------|
| 1 | Dataset Discovery | Migration | /api/v1/discovery | Medium |
| 2 | Column Mapping Editor | Migration | /api/v1/column-mappings | Medium |
| 3 | Rule Discovery Review | Validation | /api/v1/rules/discovery | Low |
| 4 | Control Management | Governance | /api/v1/controls | Low |
| 5 | Execution Monitoring | Operations | /api/v1/execution/status | Low |

### Priority 4: Consolidate Duplicated Pages

| # | Current | Consolidated | Pages Removed | Effort |
|---|---------|-------------|---------------|--------|
| 1 | Reports + Report Centre + Scheduler + Distribution | Single Reports portal | 41 pages → 8 | High |
| 2 | Governance + Risk | Single Governance portal | 4 pages → 0 | Low |
| 3 | AI Platform | Merge into Reports/Operations | 4 pages → 0 | Low |

### Priority 5: Remove Mock Data Pages

| # | Action | Pages Affected | Effort |
|---|--------|---------------|--------|
| 1 | Replace all mock data hooks with real API calls | 98 pages | High |
| 2 | Remove placeholder pages with no backend | ~20 pages | Medium |
| 3 | Consolidate redundant navigation entries | ~15 entries | Low |

---

## 5. Migration Roadmap

### Phase 1: Quick Wins (Weeks 1-2)

| Task | Pages | Effort |
|------|-------|--------|
| Wire Reports portal to SQL views | 12 | Low |
| Wire Operations > Executions to execution API | 1 | Low |
| Wire Security > Audit Logs to audit table | 1 | Low |
| **Total** | **14** | |

### Phase 2: Governance & Discovery (Weeks 3-6)

| Task | Pages | Effort |
|------|-------|--------|
| Create /api/v1/governance endpoints | 9 | Medium |
| Create /api/v1/discovery endpoints + frontend | 3 | Medium |
| Create /api/v1/controls endpoints + frontend | 2 | Low |
| Create /api/v1/column-mappings endpoints + frontend | 2 | Low |
| **Total** | **16** | |

### Phase 3: Consolidation (Weeks 7-10)

| Task | Pages | Effort |
|------|-------|--------|
| Merge Reports + Report Centre + Scheduler + Distribution | 41 → 8 | High |
| Merge Risk into Governance | 4 → 0 | Low |
| Merge AI into Reports/Operations | 4 → 0 | Low |
| Reduce Security from 15 to 6 pages | 15 → 6 | Medium |
| Reduce Administration from 17 to 8 pages | 17 → 8 | Medium |
| **Total** | **81 → 22** | |

### Phase 4: Mock Data Replacement (Weeks 11-14)

| Task | Pages | Effort |
|------|-------|--------|
| Replace all remaining mock data hooks | ~20 | High |
| Remove placeholder pages | ~10 | Medium |
| Final navigation cleanup | — | Low |
| **Total** | **~30** | |

### Phase 5: Polish & Testing (Weeks 15-16)

| Task | Effort |
|------|--------|
| End-to-end testing | Medium |
| Performance optimization | Low |
| Documentation update | Low |
| **Total** | |

---

## 6. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Top-Level Menus | 17 | 8 |
| Submenus | 103+ | ~60 |
| Pages | 134 | ~70 |
| Pages with Backend | 19 (14%) | 70 (100%) |
| Pages with Mock Data | 98 (73%) | 0 (0%) |
| API Endpoints | 72+ | 85+ |
| Navigation Depth | 3 levels | 2 levels |

---

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking existing aligned pages | Medium | High | Test aligned pages first |
| SQL view performance | Low | Medium | Add indexes, pagination |
| Governance API complexity | Medium | Medium | Start with read-only endpoints |
| User resistance to menu changes | High | Low | Gradual rollout, training |
| Scope creep | High | Medium | Stick to phased roadmap |

---

*This recommendation is part of the Enterprise Functional Traceability Audit (Prompt 15). All findings are based on source code analysis — no code was modified.*
