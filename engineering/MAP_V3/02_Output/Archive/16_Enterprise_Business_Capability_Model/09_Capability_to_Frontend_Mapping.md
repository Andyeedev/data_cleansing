# Capability to Frontend Mapping

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  

---

## 1. Current Frontend Coverage

| Status | Capabilities | Percentage |
|--------|-------------|------------|
| Fully Covered (API + Frontend) | 2 | 6% |
| Partially Covered | 8 | 24% |
| Backend Only (No Frontend) | 12 | 35% |
| Frontend Only (Mock Data) | 8 | 24% |
| Not Implemented | 4 | 12% |

---

## 2. Capability to Page Mapping

| Capability | Frontend Page | Route | Status |
|-----------|--------------|-------|--------|
| Project Management | Migration > Projects | /migration/projects | PARTIAL |
| Connection Management | Migration > Datasets | /migration/datasets | ALIGNED |
| Connection Management | Security > Credentials | /security/credentials | ALIGNED |
| Dataset Discovery | — | — | MISSING |
| Dataset Mapping | Migration > Mappings | /migration/mappings | PARTIAL |
| Column Mapping | — | — | MISSING |
| Rule Discovery | Validation > Rules | /validation/rules | PARTIAL |
| Control Discovery | — | — | MISSING |
| Validation Execution | Migration > Execution | /migration/execution | ALIGNED |
| Validation Execution | Validation > Results | /validation/results | ALIGNED |
| Checkpointing | — | — | MISSING |
| Retry Engine | — | — | MISSING |
| Governance Decisions | Governance > Overview | /governance/overview | MOCK |
| Risk Scoring | Risk > Assessment | /risk/assessment | MOCK |
| Release Gates | Governance > Compliance | /governance/compliance | MOCK |
| Approvals | Task Management > Approvals | /task-management/approvals | PARTIAL |
| Executive Reporting | Reports > Executive | /reports/executive | MOCK |
| Operational Reporting | Reports > Operational | /reports/operational | MOCK |
| Governance Reporting | Reports > Governance | /reports/governance | MOCK |
| Technical Reporting | Reports > Validation | /reports/validation | MOCK |
| Dashboard Services | Executive Dashboard | /dashboard/executive | ALIGNED |
| Export Services | — | — | MISSING |
| Workflow Management | Task Management > Workflows | /task-management/workflows | PARTIAL |
| Task Management | Task Management > Dashboard | /task-management/dashboard | PARTIAL |
| Notification Services | Task Management > Notifications | /task-management/notifications | PARTIAL |
| Calendar Services | Task Management > Calendar | /task-management/calendar | PARTIAL |
| AI / MAP Copilot | AI > Assistant | /ai/assistant | MOCK |
| Authentication | Login | /login | ALIGNED |
| User Management | Administration > Users | /administration/users | ALIGNED |
| Role Management | Administration > Roles | /administration/roles | ALIGNED |
| Tenant Management | Administration > Tenants | /administration/tenants | MOCK |
| System Settings | Settings | /settings | ALIGNED |
| Feature Flags | Administration > Feature Flags | /administration/feature-flags | MOCK |
| Security Management | Security > Overview | /security/overview | MOCK |
| Audit Trail | Security > Audit Logs | /security/audit-logs | MOCK |
| Maintenance & Health | Operations > Health | /operations/health | MOCK |

---

## 3. Gap Summary

| Gap Type | Count | Examples |
|----------|-------|---------|
| Missing (no page) | 6 | Dataset Discovery, Column Mapping, Control Discovery, Checkpointing, Retry, Export |
| Mock (page exists, no data) | 12 | Governance, Risk, Reports, AI, Security, Audit, Tenants, Feature Flags, Health |
| Partial (incomplete integration) | 8 | Projects, Mappings, Rules, Tasks, Workflows, Notifications, Calendar, Approvals |

---

*This mapping is part of the Enterprise Business Capability Model (Prompt 16).*
