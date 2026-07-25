# 07_Master_Traceability_Model.md

# Master Traceability Model

### MAP Nexus Enterprise Architecture

---

## Purpose

This document defines the traceability relationships between architecture layers in the MAP Nexus repository. All relationships are derived exclusively from Phase A evidence. No relationships are inferred.

---

## Traceability Chain

The repository traces architecture through the following chain:

```
Business Capabilities → Business Processes → Applications → Services → APIs → Database → Implementation → Deployment → Security → Operations
```

---

## Matrices

### Matrix 1: Business Capabilities to Business Processes

| Business Capability | Business Process | Source Document |
|---------------------|------------------|-----------------|
| Migration Management | Source Code Loading | 16_Capability_Model; 17_Process/02_Catalogue |
| Migration Management | Validation Execution | 16_Capability_Model; 17_Process/02_Catalogue |
| Migration Management | Mapping Resolution | 16_Capability_Model; 17_Process/02_Catalogue |
| Governance & Compliance | Governance Decision | 16_Capability_Model; 17_Process/02_Catalogue |
| Governance & Compliance | Compliance Audit | 16_Capability_Model; 17_Process/02_Catalogue |
| Reporting & Analytics | Report Generation | 16_Capability_Model; 17_Process/02_Catalogue |
| Reporting & Analytics | Dashboard Viewing | 16_Capability_Model; 17_Process/02_Catalogue |
| Platform Services | User Management | 16_Capability_Model; 17_Process/02_Catalogue |
| Platform Services | Workflow Management | 16_Capability_Model; 17_Process/02_Catalogue |
| Platform Services | Notification Management | 16_Capability_Model; 17_Process/02_Catalogue |

**Evidence:** 16_Enterprise_Business_Capability_Model.md defines 34 capabilities. 17_Enterprise_Business_Process_Model/02_End_to_End_Business_Process_Catalogue.md defines 29 processes. Capability-to-process mapping is documented in 17_Enterprise_Business_Process_Model/05_Capability_to_Process_Traceability.md.

---

### Matrix 2: Business Processes to Applications

| Business Process | Application Component | Source Document |
|------------------|----------------------|-----------------|
| Source Code Loading | Load Architecture (001) | 17_Process; 001_Load_Architecture |
| Validation Execution | Engine Schema + Backend Services | 17_Process; 03_Backend_Architecture |
| Mapping Resolution | Engine Schema + Backend Services | 17_Process; 03_Backend_Architecture |
| Governance Decision | Platform Schema + Backend Services | 17_Process; 03_Backend_Architecture |
| Report Generation | Reporting Schema + Reporting Framework | 17_Process; 07_Reporting_Architecture |
| User Management | Platform Schema + Portal | 17_Process; 02_Portal_Architecture |
| Workflow Management | Platform Schema + Backend Services | 17_Process; 03_Backend_Architecture |

**Evidence:** 03_Backend_Architecture.md defines four business domains (Operations, Governance, Insights, Platform). 14_Enterprise_Application_Architecture documents application structure.

---

### Matrix 3: Applications to Services

| Application Component | Backend Service Domain | Source Document |
|----------------------|----------------------|-----------------|
| Operations Domain | Validation Services | 03_Backend:84-146 |
| Governance Domain | Governance Services | 03_Backend:84-146 |
| Insights Domain | Analytics Services | 03_Backend:84-146 |
| Platform Domain | Platform Services | 03_Backend:84-146 |

**Evidence:** 03_Backend_Architecture.md defines four business domains. 19_Enterprise_Solution_Architecture/05_Service_Architecture.md defines service decomposition. 19_Enterprise_Solution_Architecture/07_Backend_Architecture.md documents backend module organization.

---

### Matrix 4: Services to APIs

| Service Domain | API Routers | Source Document |
|----------------|-------------|-----------------|
| Operations | /api/v1/migration, /api/v1/validation, /api/v1/datasets, /api/v1/systems, /api/v1/projects | 19_Sol/06:23-38 |
| Governance | (absent from router listing) | 04_API:139-192; 19_Sol/06:23-38 |
| Insights | (absent from router listing) | 04_API:139-192; 19_Sol/06:23-38 |
| Platform | /api/v1/users, /api/v1/auth, /api/v1/workflows, /api/v1/notifications, /api/v1/tasks, /api/v1/reports, /api/v1/analytics, /api/v1/copilot, /api/v1/admin, /api/v1/security, /api/v1/audit, /api/v1/health | 19_Sol/06:23-38 |

**Evidence:** 04_API_Architecture.md defines four API domains with endpoints. 19_Enterprise_Solution_Architecture/06_API_Architecture.md documents 12 FastAPI routers. Note: Governance and Insights domain endpoints from 04_API are absent from the 19_Sol/06 router listing (Duplicate #33).

---

### Matrix 5: APIs to Database

| API Router | Database Schema | Database Tables | Source Document |
|------------|----------------|-----------------|-----------------|
| /api/v1/migration | core | projects, systems, datasets, mappings, source_columns, target_columns, column_mappings, mapping_rules | 18_DataModel/02 |
| /api/v1/validation | engine | migration_validation_batch, control_execution, control_results, control_definitions, control_execution_summary, rule_registry, scoring_rules, governance_decisions, governance_config, batch_metrics, mapping_resolutions, validation_checkpoints, quality_scores, quality_thresholds, exception_log | 18_DataModel/02 |
| /api/v1/users | platform | users, roles, permissions, user_roles, role_permissions | 18_DataModel/02 |
| /api/v1/auth | platform | users, login_history | 18_DataModel/02 |
| /api/v1/workflows | platform | workflow_definitions, workflow_instances, workflow_steps, workflow_transitions, workflow_templates | 18_DataModel/02 |
| /api/v1/notifications | platform | notifications, notification_preferences | 18_DataModel/02 |
| /api/v1/tasks | platform | tasks, task_comments, task_dependencies | 18_DataModel/02 |
| /api/v1/reports | reporting | report_definitions, report_schedules, report_distributions | 18_DataModel/02 |
| /api/v1/analytics | reporting | dim_date, dim_system, dim_severity, dim_status | 18_DataModel/02 |
| /api/v1/audit | audit | audit_events, security_events, login_history, api_logs, configuration_history | 18_DataModel/02 |
| /api/v1/admin | platform | system_settings, feature_flags, governance_config | 18_DataModel/02 |

**Evidence:** 18_Enterprise_Information_Data_Model/02_Database_Schema_Inventory.md documents 5 active schemas and 62 tables. 05_Database_Architecture.md defines 5-schema model. Contradictions exist on schema count (5 vs 6) and table count (24 vs 62 vs 69) — see Phase A Contradiction Register #8-10.

---

### Matrix 6: Database to Implementation

| Database Component | Implementation Component | Source Document |
|-------------------|-------------------------|-----------------|
| core schema | Backend data access layer | 20_Impl/07_Database_Implementation |
| engine schema | Backend data access layer | 20_Impl/07_Database_Implementation |
| reporting schema | Backend data access layer | 20_Impl/07_Database_Implementation |
| platform schema | Backend data access layer | 20_Impl/07_Database_Implementation |
| audit schema | Backend data access layer | 20_Impl/07_Database_Implementation |
| PostgreSQL 15/17 | Docker Compose container | 20_Impl/04_Deployment_Implementation |

**Evidence:** 20_Enterprise_Implementation_Architecture/07_Database_Implementation.md documents database implementation. 18_Enterprise_Information_Data_Model/06_Database_Relationships.md documents 28 foreign keys. 18_Enterprise_Information_Data_Model/10_Database_Statistics.md documents 71 indexes. Contradictions exist on PostgreSQL version (15 vs 17) — see Phase A Contradiction Register #1.

---

### Matrix 7: Implementation to Deployment

| Implementation Component | Deployment Target | Source Document |
|-------------------------|-------------------|-----------------|
| Backend (FastAPI) | Container App (port 8000) | 20_Impl/04; 19_Sol/12 |
| Database (PostgreSQL) | Container App (port 5432) | 20_Impl/04; 19_Sol/12 |
| Frontend (React) | Static hosting / CDN | 20_Impl/09 |
| CI/CD Pipeline | GitHub Actions | 20_Impl/13 |
| Secrets | Azure Key Vault / .env | 20_Impl/04; 19_Sol/12 |

**Evidence:** 20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md documents Docker multi-stage build, Docker Compose, container layout. 19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md documents deployment architecture. 09_Deployment_Architecture.md provides conceptual deployment.

---

### Matrix 8: Deployment to Security

| Deployment Component | Security Control | Source Document |
|---------------------|------------------|-----------------|
| Container App | JWT Authentication (HS256) | 08_Security; 19_Sol/11; 20_Impl/11 |
| Container App | RBAC (resource:action format) | 08_Security; 19_Sol/11; 20_Impl/11 |
| Container App | CORS Configuration | 19_Sol/11; 20_Impl/11 |
| Container App | Rate Limiting (slowapi) | 19_Sol/11; 20_Impl/11 |
| Container App | Audit Logging Middleware | 08_Security; 19_Sol/11; 20_Impl/11 |
| Database | Encryption at Rest | 05_Database; 08_Security |
| Secrets | Azure Key Vault / .env | 08_Security; 09_Deploy; 19_Sol/11; 20_Impl/11 |

**Evidence:** 08_Security_Architecture.md defines security controls. 19_Enterprise_Solution_Architecture/11_Security_Architecture.md specifies implementation details. 20_Enterprise_Implementation_Architecture/11_Security_Implementation.md documents implementation. Duplicate groups exist for JWT, RBAC, audit, secrets — see Phase A Duplicate Register #1-15.

---

### Matrix 9: Security to Operations

| Security Component | Operational Process | Source Document |
|-------------------|---------------------|-----------------|
| JWT Authentication | Login Monitoring | 08_Security; 18_DataModel/08 |
| RBAC | Access Audit Logging | 08_Security; 18_DataModel/08 |
| Audit Logging | Audit Event Retention | 08_Security; 18_DataModel/08 |
| Secrets Management | Key Rotation | 08_Security; 09_Deploy |
| Backup Strategy | Disaster Recovery | 09_Deploy; 08_Security |
| Data Retention | Archive Management | 05_Database; 18_DataModel/08 |

**Evidence:** 18_Enterprise_Information_Data_Model/08_Audit_and_History_Model.md documents audit trail. 09_Deployment_Architecture.md documents backup and disaster recovery. 08_Security_Architecture.md documents security operations.

---

## Hierarchical Mappings

### Repository Layer Hierarchy

```
L1 Core Architecture (00-13)
├── 00_Master_Roadmap
├── 001_Load_Architecture
├── 02_Portal_Architecture
├── 03_Backend_Architecture
├── 04_API_Architecture
├── 05_Database_Architecture
├── 06_AI_Architecture
├── 07_Reporting_Architecture
├── 08_Security_Architecture
├── 09_Deployment_Architecture
├── 10_Implementation_Roadmap
├── 11_Development_Standards
├── 12_Platform_Integration_Architecture
└── 13_Architecture_Compliance_Audit

L2 Enterprise Application Architecture (14)
└── 14_Enterprise_Application_Architecture/
    ├── 01_Product_Architecture
    ├── 002_Load_Source_Code
    ├── 003_Analyse_Backend
    ├── 004_Analyse_Frontend
    ├── 005_Analyse_Database
    ├── 006_Analyse_AI_Framework
    ├── 007_Generate_Enterprise_Application_Architecture
    ├── 008_Validate_Enterprise_Application_Architecture
    ├── 009_Generate_Enterprise_Architecture_Reports
    └── 010_Promote_Enterprise_Application_Architecture

L3 Enterprise Functional Traceability (15)
└── 15_Enterprise_Functional_Traceability_Architecture

L4 Enterprise Business Capability Model (16)
└── 16_Enterprise_Business_Capability_Model

L5 Enterprise Business Process Model (17)
└── 17_Enterprise_Business_Process_Model/
    ├── 01_Executive_Summary
    ├── 02_End_to_End_Business_Process_Catalogue
    ├── 03_Business_Process_Decomposition
    ├── 04_BPM_Process_Flows
    ├── 05_Capability_to_Process_Traceability
    ├── 06_RACI_Matrices
    ├── 07_Process_Maturity_Assessment
    ├── 08_Automation_Assessment
    ├── 09_Process_Gap_Analysis
    └── 10_Enterprise_Process_Improvement_Roadmap

L6 Enterprise Information Data Model (18)
└── 18_Enterprise_Information_Data_Model/
    ├── 01_Executive_Summary
    ├── 02_Database_Schema_Inventory
    ├── 03_Table_Catalogue
    ├── 04_Logical_Data_Model
    ├── 05_Master_and_Reference_Data
    ├── 06_Database_Relationships
    ├── 07_Data_Flow
    ├── 08_Audit_and_History_Model
    ├── 09_Configuration_Model
    └── 10_Database_Statistics

L7 Enterprise Solution Architecture (19)
└── 19_Enterprise_Solution_Architecture/
    ├── 01_Executive_Summary
    ├── 02_Solution_Architecture_Overview
    ├── 03_Application_Architecture
    ├── 04_Component_Architecture
    ├── 05_Service_Architecture
    ├── 06_API_Architecture
    ├── 07_Backend_Architecture
    ├── 08_Frontend_Architecture
    ├── 09_Runtime_Architecture
    ├── 10_Integration_Architecture
    ├── 11_Security_Architecture
    ├── 12_Deployment_Architecture
    ├── 13_Technology_Architecture
    ├── 14_Directory_Architecture
    ├── 15_Dependencies_Architecture
    ├── 16_Configuration_Architecture
    ├── 17_Logging_Monitoring_Architecture
    └── 18_Architecture_Decision_Summary

L8 Enterprise Implementation Architecture (20)
└── 20_Enterprise_Implementation_Architecture/
    ├── 01_Executive_Summary
    ├── 02_Runtime_Implementation
    ├── 03_Build_Architecture
    ├── 04_Deployment_Implementation
    ├── 05_Infrastructure_Implementation
    ├── 06_Configuration_Implementation
    ├── 07_Database_Implementation
    ├── 08_Backend_Implementation
    ├── 09_Frontend_Implementation
    ├── 10_Execution_Implementation
    ├── 11_Security_Implementation
    ├── 12_Logging_Audit_Implementation
    ├── 13_CICD_Implementation
    ├── 14_Directory_Implementation
    ├── 15_Implementation_Dependency_Graph
    ├── 16_Implementation_Statistics
    └── 17_Implementation_Decision_Record
```

---

**Version:** 1.0

**Status:** Phase B Definition — All relationships derived from Phase A evidence only.
