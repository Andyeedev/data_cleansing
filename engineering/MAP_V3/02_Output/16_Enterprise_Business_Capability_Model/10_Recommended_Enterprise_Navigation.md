# Recommended Enterprise Navigation

**Date:** 14 July 2026  
**Audit:** Enterprise Business Capability Model (Prompt 16)  
**Scope:** MAP Nexus Enterprise Platform — Navigation Architecture  

---

## 1. Purpose

This document defines the recommended enterprise navigation hierarchy for MAP Nexus based on the Business Capability Model. It replaces the current ad-hoc navigation with a capability-driven structure.

---

## 2. Current Navigation Problems

| Problem | Evidence |
|---------|----------|
| Too many top-level menus | 17 top-level menus (target: 8) |
| Deep nesting | Some menus 3 levels deep |
| Feature-driven, not business-driven | Menus organized by features, not business capabilities |
| Inconsistent grouping | Similar capabilities scattered across different menus |
| Mock data menus | 8 frontend-only pages with no backend |

---

## 3. Navigation Design Principles

| Principle | Description |
|-----------|-------------|
| Business Capability Driven | Navigation mirrors business capability domains |
| Max 2 Levels Deep | Top menu → submenu, no deeper |
| 8 Top-Level Maximum | Reduces cognitive load and navigation complexity |
| Logical Grouping | Related capabilities grouped under single domain |
| Role-Based Visibility | Different menus visible based on user role |

---

## 4. Recommended Navigation Model

### 4.1 Primary Navigation (8 Top-Level Menus)

```text
MAP Nexus
├── 1. Home
│   └── Dashboard
├── 2. Migration
│   ├── Projects
│   ├── Connections
│   ├── Discovery
│   ├── Mappings
│   ├── Column Mappings
│   ├── Execution
│   ├── History
│   ├── Reports
│   └── Workspace
├── 3. Validation
│   ├── Rules
│   ├── Rule Discovery
│   ├── Controls
│   ├── Results
│   └── Queue
├── 4. Governance
│   ├── Overview
│   ├── Compliance
│   ├── Controls
│   ├── Exceptions
│   ├── Risk
│   ├── Audit
│   └── Approvals
├── 5. Reports
│   ├── Executive
│   ├── Operational
│   ├── Migration
│   ├── Validation
│   ├── Governance
│   ├── Audit
│   ├── Templates
│   └── Distribution
├── 6. Operations
│   ├── Monitoring
│   ├── Alerts
│   ├── Schedules
│   ├── Retry
│   └── Health
├── 7. Administration
│   ├── Users
│   ├── Roles
│   ├── Tenants
│   ├── Settings
│   ├── Feature Flags
│   ├── Security
│   ├── Notifications
│   └── Maintenance
└── 8. Tasks
    ├── Dashboard
    ├── My Tasks
    ├── Workflows
    ├── Calendar
    └── Notifications
```

### 4.2 Menu-to-Capability Mapping

| Menu | Domain | Capabilities Served |
|------|--------|---------------------|
| Home | Platform | Dashboard |
| Migration | Migration Management | Project, Connection, Discovery, Dataset Mapping, Column Mapping |
| Validation | Validation Management | Rule Discovery, Control Discovery, Execution, Checkpointing, Retry |
| Governance | Governance & Compliance | Governance Decisions, Risk Scoring, Release Gates, Approvals |
| Reports | Reporting & Analytics | Executive, Operational, Governance, Technical, Dashboard, Export |
| Operations | Platform Services | Workflow, Monitoring, Alerts, Health |
| Administration | Administration | Users, Roles, Tenants, Settings, Feature Flags, Security, Audit |
| Tasks | Platform Services | Tasks, Workflows, Calendar, Notifications |

---

## 5. Navigation Metrics

| Metric | Current | Target | Change |
|--------|---------|--------|--------|
| Top-Level Menus | 17 | 8 | -53% |
| Submenus | 103+ | ~60 | -42% |
| Pages | 134 | ~70 | -48% |
| Max Depth | 3 levels | 2 levels | -33% |

---

## 6. Role-Based Menu Visibility

### 6.1 Migration Engineer

```text
Visible: Home, Migration, Validation, Reports, Operations, Tasks
Hidden: Administration (partial), Governance (read-only)
```

### 6.2 Compliance Officer

```text
Visible: Home, Governance, Reports, Tasks
Hidden: Migration, Validation, Administration
```

### 6.3 Programme Manager

```text
Visible: Home, Migration, Validation, Governance, Reports, Tasks
Hidden: Administration, Operations (partial)
```

### 6.4 Administrator

```text
Visible: All menus
Special: Administration full access
```

### 6.5 Executive

```text
Visible: Home, Reports (Executive only)
Hidden: All operational menus
```

---

## 7. Implementation Priority

| Phase | Menu | Dependencies | Effort |
|-------|------|--------------|--------|
| 1 | Home | Dashboard API | LOW |
| 2 | Migration | 5 backend APIs | HIGH |
| 3 | Validation | 3 backend APIs | MEDIUM |
| 4 | Governance | 4 backend APIs | MEDIUM |
| 5 | Reports | 6 SQL views + API | HIGH |
| 6 | Operations | Monitoring, Health | LOW |
| 7 | Administration | Existing APIs | LOW |
| 8 | Tasks | Existing APIs | LOW |

---

## 8. Migration Path

### 8.1 Current to Target

| Current Menu | Target Menu | Action |
|--------------|-------------|--------|
| Home | Home | Keep |
| Migration | Migration | Consolidate |
| Validation | Validation | Consolidate |
| Governance | Governance | Consolidate |
| Reports | Reports | Consolidate |
| Operations | Operations | Consolidate |
| Administration | Administration | Consolidate |
| Tasks | Tasks | Consolidate |
| Executive Dashboard | Home → Dashboard | Merge |
| Analytics | Reports | Merge |
| Intelligence | Reports | Merge |
| Data Migration | Migration | Merge |
| Schema Management | Migration | Merge |
| Connection Management | Migration | Merge |
| Rule Engine | Validation | Merge |
| Control Framework | Governance | Merge |
| Audit Trail | Administration → Security | Merge |

### 8.2 Removed Menus

| Menu | Reason |
|------|--------|
| Executive Dashboard | Merged into Home |
| Analytics | Merged into Reports |
| Intelligence | Merged into Reports |
| Schema Management | Merged into Migration |
| Connection Management | Merged into Migration |
| Rule Engine | Merged into Validation |
| Control Framework | Merged into Governance |
| Audit Trail | Merged into Administration |

---

*This navigation model is part of the Enterprise Business Capability Model (Prompt 16).*