# Business Capability Dependencies

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Dependency Analysis  

---

## 1. Purpose

This document defines the dependency relationships between business capabilities for MAP Nexus, identifying how capabilities rely on and interact with each other.

---

## 2. Dependency Types

| Type | Definition |
|------|------------|
| Depends On | Capability requires another to function |
| Produces | Capability generates output for another |
| Consumes | Capability uses output from another |
| Triggers | Capability initiates another |
| Reads | Capability accesses data from another |
| Writes | Capability modifies data of another |
| Owns | Capability has primary responsibility |
| Supports | Capability provides auxiliary function |
| Blocks | Capability prevents another from proceeding |
| Enables | Capability allows another to function |

---

## 3. Core Dependency Chain (Validation Pipeline)

```text
Project Management
    ↓ Depends On
Connection Management
    ↓ Depends On
Dataset Discovery
    ↓ Depends On
Dataset Mapping
    ↓ Depends On
Column Mapping
    ↓ Depends On
Rule Discovery
    ↓ Depends On
Control Discovery
    ↓ Depends On
Validation Execution
    ↓ Depends On
Governance Decisions
    ↓ Depends On
Reporting & Analytics
```

---

## 4. Platform Dependency Chain

```text
Authentication
    ↓ Depends On
User Management
    ↓ Depends On
Role & Permission Management
    ↓ Depends On
Task Management
    ↓ Depends On
Workflow Management
    ↓ Depends On
Notification Services
```

---

## 5. Governance Dependency Chain

```text
Validation Execution
    ↓ Depends On
Risk Scoring
    ↓ Depends On
Governance Decisions
    ↓ Depends On
Release Gates
    ↓ Depends On
Approvals
    ↓ Depends On
Audit Trail
```

---

## 6. Detailed Capability Dependencies

### 6.1 Migration Management Domain

| Capability | Depends On | Produces | Consumes | Triggers |
|-----------|------------|----------|----------|----------|
| Project Management | — | Project registry | — | Connection Management |
| Connection Management | Project Management | Verified connections | — | Dataset Discovery |
| Dataset Discovery | Connection Management | Discovered schemas | — | Dataset Mapping |
| Dataset Mapping | Dataset Discovery | Table mappings | — | Column Mapping |
| Column Mapping | Dataset Mapping | Column mappings | — | Rule Discovery |

### 6.2 Validation Management Domain

| Capability | Depends On | Produces | Consumes | Triggers |
|-----------|------------|----------|----------|----------|
| Rule Discovery | Column Mapping | Validation rules | — | Validation Execution |
| Control Discovery | — | Active controls | — | Validation Execution |
| Validation Execution | Rule Discovery, Control Discovery | Execution results | — | Governance Decisions |
| Checkpointing | Validation Execution | Checkpoint records | — | Validation Execution |
| Retry Engine | Validation Execution | Retry results | — | Validation Execution |

### 6.3 Governance & Compliance Domain

| Capability | Depends On | Produces | Consumes | Triggers |
|-----------|------------|----------|----------|----------|
| Governance Decisions | Validation Execution | Governance decisions | — | Release Gates |
| Risk Scoring | Validation Execution | Risk scores | — | Governance Decisions |
| Release Gates | Governance Decisions | Release decisions | — | Approvals |
| Approvals | Release Gates | Approval decisions | — | Audit Trail |

### 6.4 Reporting & Analytics Domain

| Capability | Depends On | Produces | Consumes | Triggers |
|-----------|------------|----------|----------|----------|
| Executive Reporting | Validation Execution, Governance | Executive summaries | — | — |
| Operational Reporting | Validation Execution | Operational reports | — | — |
| Governance Reporting | Governance Decisions | Compliance reports | — | — |
| Technical Reporting | Validation Execution | Technical reports | — | — |
| Dashboard Services | Validation Execution, Governance | Dashboard data | — | — |
| Export Services | Reporting capabilities | Exported files | — | — |

### 6.5 Platform Services Domain

| Capability | Depends On | Produces | Consumes | Triggers |
|-----------|------------|----------|----------|----------|
| Workflow Management | — | Workflow instances | — | Task Management |
| Task Management | — | Task assignments | — | Notification Services |
| Notification Services | All capabilities | User notifications | — | — |
| Calendar Services | Tasks, Notifications | Calendar events | — | — |
| AI / MAP Copilot | All capabilities | AI responses | — | — |
| Authentication | — | JWT tokens | — | All capabilities |

### 6.6 Administration Domain

| Capability | Depends On | Produces | Consumes | Triggers |
|-----------|------------|----------|----------|----------|
| User Management | — | User accounts | — | All capabilities |
| Role & Permission Management | — | Role assignments | — | All capabilities |
| Tenant Management | — | Tenant configurations | — | All capabilities |
| System Settings | — | Updated settings | — | All capabilities |
| Feature Flags | — | Feature toggles | — | All capabilities |
| Security Management | — | Security configurations | — | All capabilities |
| Audit Trail | All capabilities | Audit events | — | — |
| Maintenance & Health | — | Health status | — | — |

---

## 7. Cross-Domain Dependencies

| From Domain | To Domain | Dependency | Type |
|-------------|-----------|------------|------|
| Migration Management | Validation Management | Column Mapping → Rule Discovery | Depends On |
| Validation Management | Governance & Compliance | Validation Execution → Governance Decisions | Depends On |
| Governance & Compliance | Reporting & Analytics | Governance Decisions → Governance Reporting | Depends On |
| All Domains | Platform Services | All → Authentication | Depends On |
| All Domains | Administration | All → User Management | Depends On |
| Platform Services | All Domains | Notification Services ← All | Consumes |

---

## 8. Dependency Statistics

| Metric | Count |
|--------|-------|
| Total Dependencies | 45 |
| Depends On | 20 |
| Produces | 15 |
| Consumes | 10 |
| Triggers | 10 |

---

*This dependency analysis is part of the Enterprise Business Capability Model (Prompt 16).*