# 03_Duplicate_Group_Register.md

# Duplicate Group Register

### MAP Nexus Enterprise Architecture — Consolidation Phase B

---

## Purpose

This register converts the Phase A Duplicate Register into consolidated duplicate groups. Each group clusters related overlapping topics into a single entity. No recommendations are made about which document should become authoritative.

---

## Duplicate Groups

### Security Architecture

| Group ID | Topic | Documents Involved | Severity | Duplicate Type |
|----------|-------|---------------------|----------|----------------|
| DG-001 | JWT Authentication — Algorithm & Config | ARCH-008-01 (08_Security_Architecture.md), ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Critical | Design |
| DG-002 | JWT Token Payload Structure | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Design |
| DG-003 | JWT Token Dependencies | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Design |
| DG-004 | RBAC Permission Format & Decorators | ARCH-008-01 (08_Security_Architecture.md), ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Critical | Design |
| DG-005 | RBAC Database Tables | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Inventory |
| DG-006 | Fernet Encryption — 4 Implementations | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Implementation |
| DG-007 | Audit Logging Middleware | ARCH-008-01 (08_Security_Architecture.md), ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Critical | Design |
| DG-008 | Tenant Isolation Middleware | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Medium | Design |
| DG-009 | CORS Configuration | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Configuration |
| DG-010 | Rate Limiting | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Configuration |
| DG-011 | Password Hashing (bcrypt) | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Implementation |
| DG-012 | Custom AUDIT Log Level | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | High | Configuration |
| DG-013 | Governance Audit Events | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Medium | Design |
| DG-014 | Secrets Management — Env Variables | ARCH-008-01 (08_Security_Architecture.md), ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md), ARCH-009-01 (09_Deployment_Architecture.md) | Critical | Configuration |
| DG-015 | Secrets Management — .env Loading | ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Medium | Implementation |

### Deployment Architecture

| Group ID | Topic | Documents Involved | Severity | Duplicate Type |
|----------|-------|---------------------|----------|----------------|
| DG-016 | Dockerfile Multi-Stage Build | ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md), ARCH-020-04 (20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md) | High | Design |
| DG-017 | Docker Compose Services & Config | ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md), ARCH-020-04 (20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md) | High | Design |
| DG-018 | Container Layout Table | ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md), ARCH-020-04 (20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md) | High | Inventory |
| DG-019 | Backend Environment Variables (.env) | ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md), ARCH-020-04 (20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md) | Medium | Configuration |
| DG-020 | CI/CD Pipeline | ARCH-009-01 (09_Deployment_Architecture.md), ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md), ARCH-020-04 (20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md) | Critical | Design |
| DG-021 | Azure Deployment Resources | ARCH-009-01 (09_Deployment_Architecture.md), ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md) | High | Design |
| DG-022 | Secrets — Azure Key Vault | ARCH-008-01 (08_Security_Architecture.md), ARCH-009-01 (09_Deployment_Architecture.md) | High | Reference |
| DG-023 | Secrets — .env Files | ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md), ARCH-020-04 (20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md) | Medium | Configuration |
| DG-024 | Startup Process / Entry Point | ARCH-019-07 (19_Enterprise_Solution_Architecture/07_Backend_Architecture.md), ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md) | Medium | Design |
| DG-025 | Backup Strategy | ARCH-009-01 (09_Deployment_Architecture.md), ARCH-005-01 (05_Database_Architecture.md) | Medium | Summary |
| DG-026 | Disaster Recovery | ARCH-008-01 (08_Security_Architecture.md), ARCH-009-01 (09_Deployment_Architecture.md) | Medium | Summary |
| DG-027 | Scalability | ARCH-009-01 (09_Deployment_Architecture.md), ARCH-003-01 (03_Backend_Architecture.md) | Medium | Summary |

### Backend Architecture

| Group ID | Topic | Documents Involved | Severity | Duplicate Type |
|----------|-------|---------------------|----------|----------------|
| DG-028 | Backend Domain Organisation | ARCH-003-01 (03_Backend_Architecture.md), ARCH-019-07 (19_Enterprise_Solution_Architecture/07_Backend_Architecture.md) | Medium | Design |
| DG-029 | Execution Flow — 6-Step Pipeline | ARCH-019-07 (19_Enterprise_Solution_Architecture/07_Backend_Architecture.md), ARCH-018-07 (18_Enterprise_Information_Data_Model/07_Data_Flow.md) | Medium | Design |
| DG-030 | Validation Rules (C01-C010) | ARCH-019-07 (19_Enterprise_Solution_Architecture/07_Backend_Architecture.md), ARCH-018-05 (18_Enterprise_Information_Data_Model/05_Master_and_Reference_Data.md) | Medium | Reference |
| DG-031 | Service Communication (REST) | ARCH-003-01 (03_Backend_Architecture.md), ARCH-004-01 (04_API_Architecture.md), ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md) | Low | Summary |

### API Architecture

| Group ID | Topic | Documents Involved | Severity | Duplicate Type |
|----------|-------|---------------------|----------|----------------|
| DG-032 | API Structure — FastAPI | ARCH-004-01 (04_API_Architecture.md), ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md) | High | Design |
| DG-033 | API Domains vs Routers | ARCH-004-01 (04_API_Architecture.md), ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md) | Medium | Inventory |
| DG-034 | Authentication Providers | ARCH-004-01 (04_API_Architecture.md), ARCH-008-01 (08_Security_Architecture.md) | Medium | Reference |
| DG-035 | Authorisation Roles | ARCH-004-01 (04_API_Architecture.md), ARCH-008-01 (08_Security_Architecture.md) | Medium | Inventory |
| DG-036 | API Security Measures | ARCH-004-01 (04_API_Architecture.md), ARCH-008-01 (08_Security_Architecture.md) | Medium | Summary |
| DG-037 | Audit — API Call Records | ARCH-004-01 (04_API_Architecture.md), ARCH-008-01 (08_Security_Architecture.md), ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md) | Medium | Design |
| DG-038 | Health Check Endpoints | ARCH-019-06 (19_Enterprise_Solution_Architecture/06_API_Architecture.md), ARCH-019-12 (19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md) | Medium | Reference |

### Database Architecture

| Group ID | Topic | Documents Involved | Severity | Duplicate Type |
|----------|-------|---------------------|----------|----------------|
| DG-039 | Schema Organisation (5 schemas) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md) | Critical | Inventory |
| DG-040 | Core Schema Entities | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md) | Critical | Inventory |
| DG-041 | Engine Schema Entities | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md) | Critical | Inventory |
| DG-042 | Reporting Schema Entities | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-04 (18_Enterprise_Information_Data_Model/04_Logical_Data_Model.md) | Critical | Inventory |
| DG-043 | Platform Schema Entities | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md) | Critical | Inventory |
| DG-044 | Audit Schema Entities | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md), ARCH-018-08 (18_Enterprise_Information_Data_Model/08_Audit_and_History_Model.md) | Critical | Inventory |
| DG-045 | Database Security | ARCH-005-01 (05_Database_Architecture.md), ARCH-008-01 (08_Security_Architecture.md) | High | Summary |
| DG-046 | Multi-Tenant Strategy | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-01 (18_Enterprise_Information_Data_Model/01_Executive_Summary.md) | High | Design |
| DG-047 | Data Retention | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-08 (18_Enterprise_Information_Data_Model/08_Audit_and_History_Model.md) | High | Summary |
| DG-048 | Data Integrity / Constraints | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-06 (18_Enterprise_Information_Data_Model/06_Database_Relationships.md), ARCH-018-10 (18_Enterprise_Information_Data_Model/10_Database_Statistics.md) | High | Inventory |
| DG-049 | Performance Strategy (Indexes) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-10 (18_Enterprise_Information_Data_Model/10_Database_Statistics.md) | Medium | Summary |
| DG-050 | Data Lifecycle | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-07 (18_Enterprise_Information_Data_Model/07_Data_Flow.md) | Medium | Summary |
| DG-051 | Lookup/Reference Data | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-05 (18_Enterprise_Information_Data_Model/05_Master_and_Reference_Data.md) | Medium | Inventory |

### Cross-Domain Overlaps

| Group ID | Topic | Documents Involved | Severity | Duplicate Type |
|----------|-------|---------------------|----------|----------------|
| DG-052 | RBAC Tables (users, roles, permissions, user_roles, role_permissions) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md), ARCH-019-11 (19_Enterprise_Solution_Architecture/11_Security_Architecture.md), ARCH-020-11 (20_Enterprise_Implementation_Architecture/11_Security_Implementation.md) | Critical | Inventory |
| DG-053 | Audit Tables (audit_events, security_events, login_history, api_logs, configuration_history) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md), ARCH-018-08 (18_Enterprise_Information_Data_Model/08_Audit_and_History_Model.md) | Critical | Inventory |
| DG-054 | Execution Tables (migration_validation_batch, control_execution, etc.) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md), ARCH-018-07 (18_Enterprise_Information_Data_Model/07_Data_Flow.md) | Critical | Inventory |
| DG-055 | Workflow Tables (workflow_definitions, workflow_instances, etc.) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md) | High | Inventory |
| DG-056 | Task Tables (tasks, task_comments, task_dependencies) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md) | High | Inventory |
| DG-057 | Notification Tables (notifications, notification_preferences) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md) | Medium | Inventory |
| DG-058 | Configuration Tables (system_settings, feature_flags, governance_config) | ARCH-005-01 (05_Database_Architecture.md), ARCH-018-02 (18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md), ARCH-018-03 (18_Enterprise_Information_Data_Model/03_Table_Catalogue.md), ARCH-018-09 (18_Enterprise_Information_Data_Model/09_Configuration_Model.md) | Critical | Inventory |

---

## Summary

| Category | Groups | Critical | High | Medium | Low |
|----------|--------|----------|------|--------|-----|
| Security Architecture | 15 | 3 | 7 | 5 | 0 |
| Deployment Architecture | 12 | 1 | 4 | 7 | 0 |
| Backend Architecture | 4 | 0 | 0 | 3 | 1 |
| API Architecture | 7 | 0 | 1 | 6 | 0 |
| Database Architecture | 13 | 6 | 4 | 3 | 0 |
| Cross-Domain | 7 | 4 | 2 | 1 | 0 |
| **Total** | **58** | **14** | **18** | **25** | **1** |

| Duplicate Type | Count |
|----------------|-------|
| Inventory | 20 |
| Design | 16 |
| Configuration | 6 |
| Summary | 8 |
| Implementation | 4 |
| Reference | 3 |
| **Total** | **58** (some groups contain multiple types) |

---

**Version:** 1.0

**Status:** Phase B — Duplicate Grouping
