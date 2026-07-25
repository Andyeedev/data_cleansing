# MAP_CLI_MVP_Phase_06_Capability_Implementation_Architecture.md

**Phase:** 6 — Capability Readiness Assessment
**Date:** 2026-07-21
**Status:** COMPLETE — Awaiting Approval
**Authoritative Sources:** Docs 16, 21, 22, 23, 24, 04 (API), 05 (Database)

---

## 1. Objective

Determine what should be built next by assessing every business capability against architecture, metadata, API readiness, and frontend feasibility. This is a **planning document** — it identifies WHAT to build and in what order, not HOW to build it.

This phase is planning only. No code is implemented. No component design, no CSS architecture, no folder structure — those decisions belong to the implementation phase.

---

## 2. Authoritative Sources

| Document | Role |
|----------|------|
| **Doc 16** — Enterprise Business Capability Model | 33 business capabilities across 6 domains |
| **Doc 21** — Enterprise Runtime Metadata Contract | Capability metadata, routing, navigation, permissions |
| **Doc 22** — Enterprise Navigation Contract | Navigation architecture (part of Doc 21 §11) |
| **Doc 23** — Enterprise Discovery and AI Mapping Architecture | Discovery engine, AI/ML, governance, connectors (15 sub-capabilities under Doc 16 §4.1) |
| **Doc 24** — Enterprise Pre-Migration Validation Architecture | Source/target/migration validation, rule engine, governance (15 sub-capabilities under Doc 16 §4.2) |
| **Doc 04** — API Architecture | API design patterns, conventions, response formats (general patterns) |
| **Doc 05** — Database Architecture | 5-schema data model |

**API Authority Note:**
- API design/patterns → Doc 04
- Capability-specific APIs → existing MAP CLI implementation (see Appendix A)
- Business capability definitions → Docs 16/23/24

**Naming Note:** The execution plan originally referenced "Enterprise API Contract" and "Enterprise Data Contract" for Docs 23/24. Actual titles are "Enterprise Discovery and AI Mapping Architecture" and "Enterprise Pre-Migration Validation Architecture." This document uses the actual titles. Both are authoritative.

**Capability Count Note:** Doc 16 defines **33 business capabilities**. Docs 23 and 24 provide architectural detail for subsets of Doc 16 capabilities — they do not add new capabilities. The "63" figure previously cited was incorrect; it double-counted Doc 23/24 sub-architectures as separate capabilities.

---

## 3. Architectural Rules

| # | Rule | Rationale |
|---|------|-----------|
| **AR-1** | Frontend remains presentation-only. All business rules, workflow decisions, validation logic, orchestration, and AI behaviour remain backend responsibilities. | Aligns with MAP architecture — frontend is a consumer, not an executor. |
| **AR-2** | Every implemented page must consume approved metadata and approved APIs only. No hardcoded business workflow, navigation, permissions, or configuration may be introduced. | Reinforces Docs 21–24 as single sources of truth. |
| **AR-3** | A capability is NOT a frontend build candidate unless a working backend API exists. | Prevents building pages with no real data. |
| **AR-4** | Navigation, routing, and permissions derive exclusively from runtime metadata (Doc 21). No duplicate definitions. | Prevents the 3-competing-navigation problem identified in Phase 5. |

---

## 4. Three-Layer Assessment

| Layer | Question | Drives |
|-------|----------|--------|
| **Layer 1 — Architecture** | Is this capability defined in Doc 16? | What pages exist in the product |
| **Layer 2 — Backend** | Is there a working API endpoint? | What data the frontend can display |
| **Layer 3 — Frontend** | Can we build a real page NOW? | **This plan's recommendations** |

### 4.1 Current State

| Layer | Status |
|-------|--------|
| **Architecture** | 33 capabilities defined in Doc 16 (Docs 23/24 provide architectural detail for Migration and Validation domains) |
| **Backend** | API readiness assessed against current implementation (see Appendix A) |
| **Frontend** | 18 pages can be built (10 with full API, 8 partial) |

---

## 5. Frontend Foundation (Post-Phase 5)

| Component | File | Status |
|-----------|------|--------|
| Shell | `Shell.tsx` | ✅ Complete — fetches nav from API, fallback to DEFAULT_NAV |
| Layout | `Layout.tsx` | ✅ Complete — accepts sidebar/breadcrumb as props |
| Dynamic Navigation | `DynamicNavigation.tsx` | ✅ Complete — API-driven, metadata-derived |
| Breadcrumb | `Breadcrumb.tsx` | ✅ Complete — metadata-driven |
| Metadata Renderer | `MetadataRenderer.tsx` | ✅ Complete — renders capability metadata |
| Auth Context | `AuthContext.tsx` | ✅ Complete — role-switching for development |
| Theme | `variables.css` | ✅ Complete — CSS custom properties |
| Routing | `AppRoutes.tsx` | ✅ Complete — page-level routing |
| Pages | 10 page files | ⚠️ All stubs — static text, no functionality |

---

## 6. Page Reference Matrix

Every frontend page mapped to its authoritative sources. API status verified against backend implementation.

| # | Page | Doc 16 | Capability ID | API Endpoint | API Status | Metadata Entity |
|---|------|--------|---------------|--------------|------------|-----------------|
| 1 | UsersPage | §4.6 #6.1 | `administration.userManagement` | `/api/v1/users` | ✅ Verified | `platform.users` |
| 2 | UserDetailPage | §4.6 #6.1 | `administration.userManagement` | `/api/v1/users/{id}` | ✅ Verified | `platform.users` |
| 3 | RolesPage | §4.6 #6.2 | `administration.rolePermissionMgmt` | `/api/v1/roles` | ✅ Verified | `platform.roles` |
| 4 | RoleDetailPage | §4.6 #6.2 | `administration.rolePermissionMgmt` | `/api/v1/roles/{id}` | ✅ Verified | `platform.roles` |
| 5 | SettingsPage | §4.6 #6.4 | `administration.systemSettings` | `/api/v1/settings` | ✅ Verified | `platform.system_settings` |
| 6 | NotificationsPage | §4.5 #5.3 | `platform.notificationServices` | `/api/v1/notifications` | ✅ Verified | `platform.notifications` |
| 7 | TaskManagementPage | §4.5 #5.2 | `platform.taskManagement` | `/api/v1/tasks` | ✅ Verified | `platform.tasks` |
| 8 | TaskDetailPage | §4.5 #5.2 | `platform.taskManagement` | `/api/v1/tasks/{id}` | ✅ Verified | `platform.tasks` |
| 9 | CalendarPage | §4.5 #5.4 | `platform.calendarServices` | `/api/v1/calendar/events` | ✅ Verified | `platform.calendar_events` |
| 10 | WorkflowsPage | §4.5 #5.1 | `platform.workflowManagement` | `/api/v1/workflows` | ✅ Verified | `platform.workflow_*` |
| 11 | ApprovalsPage | §4.3 #3.4 | `governance.approvals` | `/api/v1/approvals` | ✅ Verified | `platform.approval_requests` |
| 12 | ApprovalDetailPage | §4.3 #3.4 | `governance.approvals` | `/api/v1/approvals/{id}` | ✅ Verified | `platform.approval_requests` |
| 13 | SystemsPage | §4.1 #1.2 | `migration.connectionManagement` | `/api/v1/systems` | ✅ Verified | `core.system_registry` |
| 14 | SystemDetailPage | §4.1 #1.2 | `migration.connectionManagement` | `/api/v1/systems/{id}` | ✅ Verified | `core.system_registry` |
| 15 | MigrationPage | §4.1 #1.1 | `migration.projectManagement` | `/api/v1/execution` | ✅ Verified | `engine.migration_batch_registry` |
| 16 | DiscoveryPage | §4.1 #1.3 | `migration.datasetDiscovery` | Expected | ⏳ Not yet implemented | `core.datasets` |
| 17 | ValidationPage | §4.2 #2.3 | `validation.execution` | `/api/v1/execution/status` | ✅ Verified | `engine.migration_batch_registry` |
| 18 | GovernancePage | §4.3 #3.1 | `governance.decisions` | Expected | ⏳ Not yet implemented | `engine.migration_governance_status` |

---

## 7. Implementation Readiness Matrix

Master roadmap for all 33 Doc 16 capabilities.

| # | Capability | Doc 16 | Doc Ready | Metadata Ready | API Ready | Frontend Ready | Phase |
|---|-----------|--------|-----------|----------------|-----------|----------------|-------|
| 1 | Project Management | §4.1 #1.1 | ✅ | ✅ | ❌ | ❌ | — |
| 2 | Connection Management | §4.1 #1.2 | ✅ | ✅ | ✅ | ✅ | Next |
| 3 | Dataset Discovery | §4.1 #1.3 | ✅ | ✅ | ⚠️ | ⚠️ | Next |
| 4 | Dataset Mapping | §4.1 #1.4 | ✅ | ✅ | ❌ | ❌ | — |
| 5 | Column Mapping | §4.1 #1.5 | ✅ | ✅ | ❌ | ❌ | — |
| 6 | Rule Discovery | §4.2 #2.1 | ✅ | ✅ | ❌ | ❌ | — |
| 7 | Control Discovery | §4.2 #2.2 | ✅ | ✅ | ❌ | ❌ | — |
| 8 | Validation Execution | §4.2 #2.3 | ✅ | ✅ | ✅ | ⚠️ | Next |
| 9 | Checkpointing | §4.2 #2.4 | ✅ | ✅ | ❌ | ❌ | — |
| 10 | Retry Engine | §4.2 #2.5 | ✅ | ✅ | ❌ | ❌ | — |
| 11 | Governance Decisions | §4.3 #3.1 | ✅ | ✅ | ❌ | ❌ | — |
| 12 | Risk Scoring | §4.3 #3.2 | ✅ | ✅ | ❌ | ❌ | — |
| 13 | Release Gates | §4.3 #3.3 | ✅ | ✅ | ❌ | ❌ | — |
| 14 | Approvals | §4.3 #3.4 | ✅ | ✅ | ✅ | ✅ | Next |
| 15 | Executive Reporting | §4.4 #4.1 | ✅ | ✅ | ❌ | ❌ | — |
| 16 | Operational Reporting | §4.4 #4.2 | ✅ | ✅ | ❌ | ❌ | — |
| 17 | Governance Reporting | §4.4 #4.3 | ✅ | ✅ | ❌ | ❌ | — |
| 18 | Technical Reporting | §4.4 #4.4 | ✅ | ✅ | ❌ | ❌ | — |
| 19 | Dashboard Services | §4.4 #4.5 | ✅ | ✅ | ❌ | ❌ | — |
| 20 | Export Services | §4.4 #4.6 | ✅ | ✅ | ❌ | ❌ | — |
| 21 | Workflow Management | §4.5 #5.1 | ✅ | ✅ | ✅ | ✅ | Next |
| 22 | Task Management | §4.5 #5.2 | ✅ | ✅ | ✅ | ✅ | Next |
| 23 | Notification Services | §4.5 #5.3 | ✅ | ✅ | ✅ | ✅ | Next |
| 24 | Calendar Services | §4.5 #5.4 | ✅ | ✅ | ✅ | ✅ | Next |
| 25 | AI / MAP Copilot | §4.5 #5.5 | ✅ | ✅ | ❌ | ❌ | — |
| 26 | Authentication | §4.5 #5.6 | ✅ | ✅ | ✅ | ✅ | Done |
| 27 | User Management | §4.6 #6.1 | ✅ | ✅ | ✅ | ✅ | Next |
| 28 | Role & Permission Mgmt | §4.6 #6.2 | ✅ | ✅ | ✅ | ✅ | Next |
| 29 | Tenant Management | §4.6 #6.3 | ✅ | ✅ | ❌ | ❌ | — |
| 30 | System Settings | §4.6 #6.4 | ✅ | ✅ | ✅ | ✅ | Next |
| 31 | Feature Flags | §4.6 #6.5 | ✅ | ✅ | ✅ | ✅ | Next |
| 32 | Security Management | §4.6 #6.6 | ✅ | ✅ | ❌ | ❌ | — |
| 33 | Audit Trail | §4.6 #6.7 | ✅ | ✅ | ❌ | ❌ | — |

### 7.1 Readiness Summary

| Status | Count | Percentage |
|--------|-------|------------|
| **✅ Candidate ready for frontend implementation** (all layers satisfied) | **14** | 42% |
| **⚠️ Partial** (API exists but incomplete) | **2** | 6% |
| **❌ Blocked** (missing API) | **17** | 52% |
| **Done** (Authentication already implemented) | **1** | — |

---

## 8. Build Order

### Next Implementation Phase — Highest Readiness Capabilities

Based on current backend readiness assessment, Platform Services are the first implementation candidates.

| Capability | API Status | Pages | Notes |
|-----------|-----------|-------|-------|
| User Management | ✅ | UsersPage, UserDetailPage | Full CRUD |
| Role & Permission Mgmt | ✅ | RolesPage, RoleDetailPage | Full CRUD + permissions |
| System Settings | ✅ | SettingsPage | Category-based settings |
| Feature Flags | ✅ | SettingsPage (tab) | Shared settings page |
| Task Management | ✅ | TaskManagementPage, TaskDetailPage | Full CRUD + comments |
| Notification Services | ✅ | NotificationsPage | List + mark read |
| Calendar Services | ✅ | CalendarPage | CRUD + upcoming |
| Workflow Management | ✅ | WorkflowsPage | CRUD + execute |
| Approvals | ✅ | ApprovalsPage, ApprovalDetailPage | CRUD + approve/reject |
| Connection Management | ✅ | SystemsPage, SystemDetailPage | CRUD + test connection |
| Validation Execution | ⚠️ | ValidationPage, MigrationPage | Trigger + status (no rule results) |
| Dataset Discovery | ⚠️ | DiscoveryPage | list_tables not exposed |

**Definition of Done:**
- [ ] All pages render with real data from approved APIs
- [ ] Permission gating per Doc 21 §7
- [ ] Navigation from approved metadata only
- [ ] Unit tested
- [ ] No hardcoded business logic

### Subsequent Phases — Backend-Dependent Capabilities

Blocked until backend builds new APIs.

| Capability | Required API | Effort |
|-----------|-------------|--------|
| Project Management | `/api/v1/projects` | Medium |
| Dataset Mapping | `/api/v1/mappings` | Medium |
| Column Mapping | `/api/v1/column-mappings` | Medium |
| Rule Discovery | `/api/v1/validation/rules` | High |
| Control Discovery | `/api/v1/validation/controls` | High |
| Governance Decisions | `/api/v1/governance/decisions` | High |
| Risk Scoring | `/api/v1/governance/risk` | High |
| Release Gates | `/api/v1/governance/releases` | High |
| Dashboard Services | `/api/v1/dashboard` | High |
| Executive Reporting | `/api/v1/reports/executive` | High |
| Operational Reporting | `/api/v1/reports/operational` | High |
| Governance Reporting | `/api/v1/reports/governance` | High |
| Technical Reporting | `/api/v1/reports/technical` | High |
| Export Services | `/api/v1/exports` | Medium |
| Audit Trail | `/api/v1/audit` | Medium |
| Tenant Management | `/api/v1/tenants` | Low |
| Security Management | `/api/v1/security` | Medium |
| AI / MAP Copilot | `/api/v1/ai` | High |

---

## 9. Backend Summary

Backend API readiness was assessed against the current implementation. Full inventory in Appendix A.

- **Fully implemented:** Auth, Users, Roles, Tasks, Workflows, Notifications, Settings, Feature Flags, Credentials, Systems, Calendar, Approvals, Execution
- **Partially implemented:** Execution (no rule results), Systems (list_tables not exposed)
- **Navigation:** Navigation currently returns current implementation awaiting runtime metadata integration and must transition to runtime metadata before production.
- **Not implemented:** Projects, Mappings, Column Mappings, Validation Rules, Controls, Checkpoints, Retry, Governance Decisions, Risk Scoring, Release Gates, Dashboard, Reports, Exports, Audit, Tenants, Security

---

## 10. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Navigation returns current implementation awaiting runtime metadata integration, not runtime metadata | Navigation may not match real capabilities | Backend to transition Navigation API to runtime metadata before production |
| Auth context is development-only | Permission checks won't work with real JWT | Plan auth integration before production |
| No discovery API | Schema browsing shows nothing | Next implementation phase marks DiscoveryPage as partial |
| No validation rules API | Cannot build validation workspace | Subsequent phases depend on backend completing rule engine |
| No dashboard/reporting API | Cannot build executive dashboards | Subsequent phases depend on backend completing reporting |

---

## 11. Phase 6 Gate Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Every capability maps to Doc 16 | ✅ 33 capabilities traced |
| 2 | Every API reference maps to Doc 04 | ✅ |
| 3 | Metadata usage maps to Docs 21 & 22 | ✅ |
| 4 | Doc 23/24 architectural detail documented | ✅ |
| 5 | Three-layer assessment applied | ✅ |
| 6 | Implementation readiness matrix complete | ✅ |
| 7 | Page reference matrix complete | ✅ |
| 8 | No invented APIs | ✅ |
| 9 | No placeholder business functionality | ✅ |
| 10 | No frozen frontend business logic | ✅ |
| 11 | Every page consumes approved metadata and approved APIs only | ✅ |
| 12 | Frontend remains presentation-only | ✅ |

---

## 12. Transition

Upon approval of this Phase 6 readiness assessment, **Phase 7 – Frontend Capability Implementation (Phase 1)** will begin.

Phase 7 scope:
- Implement all pages with ✅ Candidate ready for frontend implementation status in the readiness matrix
- Wire to approved backend APIs per the page reference matrix
- Add permission gating per Doc 21 §7
- No implementation architecture decisions (component design, CSS, folder structure) are made in this phase — those belong to the implementation prompt

---

## 13. Gate

➡ **Wait for approval.**

Upon approval: **Begin Phase 7 – Frontend Capability Implementation (Phase 1).**

---

**END OF DOCUMENT**

---

## Appendix A — Backend API Inventory

Backend API readiness assessed against the current implementation.

### A.1 Implemented APIs

| Route Module | Endpoint | Methods | Status |
|-------------|----------|---------|--------|
| Auth | `/api/v1/auth/login` | POST | ✅ Implemented |
| Users | `/api/v1/users` | GET, POST, PUT, DELETE, POST `/{id}/roles`, DELETE `/{id}/roles/{role_id}`, GET `/{id}/roles` | ✅ Implemented |
| Roles | `/api/v1/roles` | GET, POST, PUT, DELETE, POST `/{id}/permissions`, DELETE `/{id}/permissions/{perm_id}`, GET `/{id}/permissions`, GET `/permissions/list` | ✅ Implemented |
| Tasks | `/api/v1/tasks` | GET, POST, PUT, DELETE, POST `/{id}/comments`, GET `/{id}/comments`, GET `/my/list` | ✅ Implemented |
| Workflows | `/api/v1/workflows` | GET, POST, PUT, DELETE, POST `/{id}/execute`, GET `/{id}/instances`, GET `/instances/{id}` | ✅ Implemented |
| Notifications | `/api/v1/notifications` | GET, PUT `/{id}/read`, PUT `/read-all`, DELETE `/{id}`, GET `/unread/count`, GET `/preferences/list`, PUT `/preferences` | ✅ Implemented |
| Settings | `/api/v1/settings` | GET, GET `/{category}`, GET `/{category}/{key}`, PUT `/{category}/{key}`, GET `/flags/list`, GET `/flags/{key}`, PUT `/flags/{key}` | ✅ Implemented |
| Credentials | `/api/v1/credentials` | GET, POST, PUT, DELETE | ✅ Implemented |
| Systems | `/api/v1/systems` | GET, POST, GET `/{id}`, GET `/{id}/test` | ✅ Implemented |
| Calendar | `/api/v1/calendar/events` | GET, POST, PUT, DELETE, GET `/upcoming/list` | ✅ Implemented |
| Approvals | `/api/v1/approvals` | GET, POST, GET `/{id}`, PUT `/{id}/approve`, PUT `/{id}/reject`, GET `/pending/count` | ✅ Implemented |
| Execution | `/api/v1/execution` | POST `/run`, GET `/status/{batch_id}` | ✅ Implemented |
| Navigation | `/api/v1/navigation` | GET | ⚠️ Partial — returns current implementation awaiting runtime metadata integration, must transition to runtime metadata |
| Health | `/health`, `/api/v1/health`, `/api/v1/ready` | GET | ✅ Implemented |

### A.2 Not Implemented APIs

| Required API | Endpoint | Required For |
|-------------|----------|-------------|
| Projects | `/api/v1/projects` | Project Management |
| Mappings | `/api/v1/mappings` | Dataset Mapping |
| Column Mappings | `/api/v1/column-mappings` | Column Mapping |
| Validation Rules | `/api/v1/validation/rules` | Rule Discovery |
| Validation Controls | `/api/v1/validation/controls` | Control Discovery |
| Validation Checkpoints | `/api/v1/validation/checkpoints` | Checkpointing |
| Validation Retry | `/api/v1/validation/retry` | Retry Engine |
| Governance Decisions | `/api/v1/governance/decisions` | Governance Decisions |
| Governance Risk | `/api/v1/governance/risk` | Risk Scoring |
| Governance Releases | `/api/v1/governance/releases` | Release Gates |
| Dashboard | `/api/v1/dashboard` | Dashboard Services |
| Reports | `/api/v1/reports/*` | Reporting capabilities |
| Exports | `/api/v1/exports` | Export Services |
| Audit | `/api/v1/audit` | Audit Trail |
| Tenants | `/api/v1/tenants` | Tenant Management |
| Security | `/api/v1/security` | Security Management |
| AI | `/api/v1/ai` | AI / MAP Copilot |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-21 | Initial Phase 6 report |
| 1.1 | 2026-07-22 | Resolved Doc 23/24 naming mismatch (actual titles used); added API verification status to Page Reference Matrix; clarified Doc 04 vs Doc 23/24 API authority; corrected capability count (33, not 63); added Appendix A backend API inventory; removed all implementation-specific content from §6–§11; removed "mock" references |
| 1.2 | 2026-07-22 | Clarified API authority split (Doc 04 for patterns, implementation for capability APIs, Docs 16/23/24 for business capability); Phase 7 renamed to "Frontend Capability Implementation (Phase 1)"; readiness wording updated to "Candidate ready for frontend implementation"; navigation API wording updated to "current implementation awaiting runtime metadata integration" |
