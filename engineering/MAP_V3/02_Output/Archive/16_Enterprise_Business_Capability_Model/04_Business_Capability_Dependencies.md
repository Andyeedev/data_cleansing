# Business Capability Dependencies

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  

---

## 1. Core Dependency Chain (Validation Pipeline)

```text
1.1 Project Management
    ↓
1.2 Connection Management
    ↓
1.3 Dataset Discovery
    ↓
1.4 Dataset Mapping
    ↓
1.5 Column Mapping
    ↓
2.1 Rule Discovery
    ↓
2.2 Control Discovery
    ↓
2.3 Validation Execution
    ↓
3.1 Governance Decisions
    ↓
4.1 Executive Reporting
```

---

## 2. Governance Dependency Chain

```text
2.3 Validation Execution
    ↓
3.2 Risk Scoring
    ↓
3.1 Governance Decisions
    ↓
3.3 Release Gates
    ↓
3.4 Approvals
    ↓
6.7 Audit Trail
```

---

## 3. Platform Dependency Chain

```text
5.6 Authentication
    ↓
6.1 User Management
    ↓
6.2 Role & Permission Management
    ↓
5.2 Task Management
    ↓
5.1 Workflow Management
    ↓
5.3 Notification Services
```

---

## 4. Reporting Dependency Chain

```text
2.3 Validation Execution
    ↓
4.2 Operational Reporting
    ↓
4.1 Executive Reporting
    ↓
4.5 Dashboard Services
    ↓
4.6 Export Services
```

---

## 5. Complete Dependency Matrix

| Capability | Depends On |
|-----------|-----------|
| Project Management | None |
| Connection Management | None |
| Dataset Discovery | Connection Management |
| Dataset Mapping | Dataset Discovery |
| Column Mapping | Dataset Mapping |
| Rule Discovery | Column Mapping |
| Control Discovery | Rule Discovery |
| Validation Execution | Control Discovery, Connection Management, Dataset Mapping, Rule Discovery |
| Checkpointing | Validation Execution |
| Retry Engine | Validation Execution, Checkpointing |
| Governance Decisions | Validation Execution |
| Risk Scoring | Validation Execution |
| Release Gates | Governance Decisions, Risk Scoring |
| Approvals | Governance Decisions |
| Executive Reporting | Validation Execution, Governance Decisions |
| Operational Reporting | Validation Execution |
| Governance Reporting | Governance Decisions, Audit Trail |
| Technical Reporting | Validation Execution |
| Dashboard Services | Validation Execution, Reporting |
| Export Services | Reporting |
| Workflow Management | Authentication |
| Task Management | Authentication, Workflow Management |
| Notification Services | Authentication |
| Calendar Services | Authentication |
| AI / MAP Copilot | All (reads via APIs) |
| Authentication | None |
| User Management | Authentication, Role Management |
| Role & Permission Management | Authentication |
| Tenant Management | None |
| System Settings | None |
| Feature Flags | None |
| Security Management | Authentication |
| Audit Trail | Authentication |
| Maintenance & Health | None |

---

## 6. Root Capabilities (No Dependencies)

| # | Capability | Domain |
|---|-----------|--------|
| 1 | Project Management | Migration Management |
| 2 | Connection Management | Migration Management |
| 3 | Authentication | Platform Services |
| 4 | Tenant Management | Administration |
| 5 | System Settings | Administration |
| 6 | Feature Flags | Administration |
| 7 | Maintenance & Health | Administration |

---

## 7. Leaf Capabilities (No Dependents)

| # | Capability | Domain |
|---|-----------|--------|
| 1 | Retry Engine | Validation Management |
| 2 | Executive Reporting | Reporting & Analytics |
| 3 | Export Services | Reporting & Analytics |
| 4 | AI / MAP Copilot | Platform Services |
| 5 | Audit Trail | Administration |

---

*This dependency model is part of the Enterprise Business Capability Model (Prompt 16).*
