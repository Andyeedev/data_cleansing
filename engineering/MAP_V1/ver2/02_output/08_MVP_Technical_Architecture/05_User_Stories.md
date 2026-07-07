# 05 — User Stories

**Document:** MAP MVP User Stories
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Epic: Authentication & Access

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-001 | As an Executive Sponsor, I want to sign in with my corporate credentials so that I can access the platform securely | Entra ID SSO functional, MFA supported | P0 | 5 |
| US-002 | As a Migration Lead, I want role-based access so that I can only see relevant migrations | RBAC enforced, permissions correct | P0 | 8 |
| US-003 | As an Admin, I want to manage user permissions so that I can control access | User management UI functional | P0 | 8 |

---

## 2. Epic: Discovery

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-004 | As a Migration Lead, I want to connect Azure subscriptions so that I can scan resources | Entra ID app registration, subscription listing | P0 | 13 |
| US-005 | As a Migration Lead, I want to scan Azure resources so that I can build an inventory | Resource list with metadata, status | P0 | 13 |
| US-006 | As a Technical Architect, I want to view resource dependencies so that I can understand impact | Dependency graph displayed | P1 | 8 |
| US-007 | As an Infrastructure Engineer, I want to export resource inventory so that I can analyze offline | CSV/JSON export functional | P1 | 3 |

---

## 3. Epic: Validation

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-008 | As a Migration Lead, I want to run pre-migration validation so that I can identify issues | Validation checks executed, results displayed | P0 | 13 |
| US-009 | As a Technical Architect, I want to validate data integrity so that I can ensure no data loss | Data checks pass, integrity score | P0 | 13 |
| US-010 | As a Security Officer, I want to verify compliance so that I can ensure policy adherence | Compliance score generated, issues listed | P0 | 8 |
| US-011 | As a Migration Lead, I want to schedule validation so that it runs automatically | Scheduled validation functional | P1 | 5 |

---

## 4. Epic: Reporting

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-012 | As an Executive Sponsor, I want to view an executive dashboard so that I can see migration status | Dashboard loads < 2s, real-time data | P0 | 13 |
| US-013 | As a Programme Manager, I want to view health scores so that I can assess migration health | Health score algorithm working | P0 | 8 |
| US-014 | As an Auditor, I want to generate audit reports so that I can demonstrate compliance | Report generation functional | P1 | 8 |
| US-015 | As a Migration Lead, I want to create custom reports so that I can analyze specific data | Report builder functional | P2 | 13 |

---

## 5. Epic: Governance

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-016 | As a Security Officer, I want to define policies so that I can enforce standards | Policy engine functional | P1 | 13 |
| US-017 | As a Programme Manager, I want approval workflows so that I can control go-live | Workflow routing working | P1 | 13 |
| US-018 | As an Auditor, I want to track compliance so that I can demonstrate adherence | Compliance tracking functional | P1 | 8 |

---

## 6. Epic: AI

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-019 | As a Migration Lead, I want AI insights so that I can get recommendations | AI insights relevant and actionable | P1 | 13 |
| US-020 | As a Technical Architect, I want natural language queries so that I can explore data easily | NL queries return accurate results | P2 | 13 |

---

## 7. Epic: Administration

| ID | User Story | Acceptance Criteria | Priority | Points |
|----|------------|---------------------|----------|--------|
| US-021 | As an Admin, I want to manage tenants so that I can support multi-tenancy | Tenant isolation working | P0 | 13 |
| US-022 | As an Admin, I want to configure the system so that I can customize behavior | Settings persisted, UI functional | P0 | 8 |
| US-023 | As an Admin, I want to view audit logs so that I can track system activity | Audit trail complete, searchable | P0 | 8 |

---

## 8. Story Points Summary

| Epic | Stories | Total Points |
|------|---------|--------------|
| Authentication & Access | 3 | 21 |
| Discovery | 4 | 37 |
| Validation | 4 | 39 |
| Reporting | 4 | 42 |
| Governance | 3 | 34 |
| AI | 2 | 26 |
| Administration | 3 | 29 |
| **Total** | **23** | **228** |

---

*End of User Stories*
