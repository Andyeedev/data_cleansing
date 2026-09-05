# Phase 14 — Work Breakdown Structure

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Draft — pending approval
**Related:** `14_0_Scope_Document.md`

---

## 1. Governance Tasks (pre-implementation)

| ID | Task | Depends on | Output |
|----|------|-----------|--------|
| 14.G1 | Produce scope document | — | `14_0_Scope_Document.md` |
| 14.G2 | Produce work breakdown structure | 14.G1 | `14_1_Work_Breakdown_Structure.md` |
| 14.G3 | Assess existing implementation | 14.G1 | `14_2_Assessment.md` |
| 14.G4 | Produce implementation plan | 14.G3 | `14_3_Implementation_Plan.md` |
| 14.G5 | Produce minimum-change proposal | 14.G3 | `14_4_Minimum_Change_Proposal.md` |
| 14.G6 | Obtain approval | 14.G4, 14.G5 | `14_5_Approval_Record.md` |

> No code may start before 14.G6 (Approval Gate, `MAP_Development_Rule_Gates.md` §2).

---

## 2. Implementation Tasks

| ID | Task | Depends on | Maps to scope |
|----|------|-----------|---------------|
| 14.1 | Create archive/audit schema (4 tables) in `core` | 14.G6 | DDL (`sql/schema/08_discovery_clear_archive.sql`) |
| 14.2 | Extend `DiscoveryRepository.clear_all` → archive-then-hard-delete + write audit header (Discovery) | 14.1 | Backend `clear-all` (discovery) |
| 14.3 | Extend Mapping `clear-all` → same archive + audit pattern (Mappings) | 14.1 | Backend `clear-all` (mappings) |
| 14.4 | Add `restore` endpoint + repository (re-insert archive, skip conflicts, mark RESTORED) | 14.2 | Backend restore |
| 14.5 | Add `clear-history` endpoint + repository (list ops, filter by tenant/client) | 14.2 | Backend history |
| 14.6 | Frontend: wire new clear response + correct modal wording (Discovery + Mappings pages) | 14.2, 14.3 | Frontend clear flow |
| 14.7 | Frontend: admin reporting & recovery console page under `/administration` (list + Restore, admin-only, reuse shared components) | 14.4, 14.5 | Admin console |
| 14.8 | Verification: build, typecheck, API, frontend render, DB checks | 14.1–14.7 | Test summary (Testing Gate) |
| 14.9 | Documentation update + closure report | 14.8 | `Phase_14_Closure_Report.md` |

---

## 3. Reuse Matrix (per Mandatory Implementation Gates)

| New need | Reuse from | Duplicate? |
|----------|-----------|-----------|
| Admin console page | Existing `/administration` route group + `PageHeader`, `DataTable`, `StatusBadge`, `Modal`/`ConfirmDialog`, `TenantFilter` | No |
| Clear-all (mappings) | Existing `POST /mappings/clear-all` + `DiscoveryRepository` pattern | No (extend) |
| Audit actor context | `get_current_user_with_tenant` dependency | No |
| Restore / history | New endpoints, but reuse `DiscoveryRepository` + `useDiscovery` hook patterns | No |

---

## 4. Effort & Risk Summary

| Area | Effort | Risk | Mitigation |
|------|-------|------|------------|
| Schema (4 tables) | Low | Low | Apply via existing `sql/schema` migration convention |
| Archive-then-delete transaction | Medium | Medium | Single DB transaction; verify cascade order |
| Restore conflict handling | Medium | Medium | `ON CONFLICT DO NOTHING`; report skipped count |
| Admin console UI | Medium | Low | Reuse shared components; follow `/administration` layout |
| Regression to discovery/mapping flows | Medium | Medium | Run discovery + mapping tests after change |

---

## 5. Exit Criteria (per Phase Gate)

- [ ] All governance docs approved (14.G6)
- [ ] Each implementation task traceable to `14_0` scope and `14_3` plan
- [ ] No duplicate services/routes/components
- [ ] Testing Gate summary provided before approval request
- [ ] Documentation updated
