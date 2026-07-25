# 02_Duplicate_Register.md

# Duplicate Register

### MAP Nexus Enterprise Architecture

---

## Scope

This register identifies all architectural content overlaps across the MAP Nexus architecture repository. It records facts only; no decisions are made about which document is authoritative.

**Documents Analysed:**

| Shorthand | Full Path |
|-----------|-----------|
| 08_Security | `00_Architecture/08_Security_Architecture.md` |
| 19_Sol/11 | `00_Architecture/19_Enterprise_Solution_Architecture/11_Security_Architecture.md` |
| 20_Impl/11 | `00_Architecture/20_Enterprise_Implementation_Architecture/11_Security_Implementation.md` |
| 09_Deploy | `00_Architecture/09_Deployment_Architecture.md` |
| 19_Sol/12 | `00_Architecture/19_Enterprise_Solution_Architecture/12_Deployment_Architecture.md` |
| 20_Impl/04 | `00_Architecture/20_Enterprise_Implementation_Architecture/04_Deployment_Implementation.md` |
| 03_Backend | `00_Architecture/03_Backend_Architecture.md` |
| 19_Sol/07 | `00_Architecture/19_Enterprise_Solution_Architecture/07_Backend_Architecture.md` |
| 04_API | `00_Architecture/04_API_Architecture.md` |
| 19_Sol/06 | `00_Architecture/19_Enterprise_Solution_Architecture/06_API_Architecture.md` |
| 05_Database | `00_Architecture/05_Database_Architecture.md` |
| 18_DataModel | `00_Architecture/18_Enterprise_Information_Data_Model/` (10 files) |

---

## Duplicates Found

### Security Architecture

| # | Topic | Appears In | Extent of Overlap | Evidence |
|---|-------|------------|-------------------|----------|
| 1 | JWT Authentication - Algorithm & Config | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage. 08 states "Token-Based Authentication" at conceptual level. 19_Sol/11 specifies HS256 algorithm, JWT_SECRET_KEY env var, 2-hour expiry, auth_service.py:45. 20_Impl/11 reproduces the identical HS256 algorithm, same env var, same 2-hour expiry, same file references. 19 and 20 are substantively identical. | 08_Security:145-154; 19_Sol/11:9-27; 20_Impl/11:9-56 |
| 2 | JWT Token Payload Structure | 19_Sol/11, 20_Impl/11 | Near-identical. Both specify same four-field payload: sub (user_id), user (email), tenant_id, exp. Both reference auth_service.py:41-46. Only difference is line 45 vs 46 for expiry. | 19_Sol/11:21; 20_Impl/11:33-44 |
| 3 | JWT Token Dependencies | 19_Sol/11, 20_Impl/11 | Identical. Both document get_current_user() and get_current_user_with_tenant() from dependencies.py. Same file references (lines 6-20 and 23-41). Same 401/403 error behaviour. | 19_Sol/11:23-26; 20_Impl/11:48-56 |
| 4 | RBAC Permission Format & Decorators | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage. 08 defines RBAC conceptually with role list. 19_Sol/11 specifies resource:action format, require_permissions() and require_role() decorators, wildcard *:* support, and SQL join query. 20_Impl/11 reproduces identical permission format, same decorators, same wildcard logic, same database tables. | 08_Security:168-190; 19_Sol/11:30-53; 20_Impl/11:75-107 |
| 5 | RBAC Database Tables | 19_Sol/11, 20_Impl/11 | Identical. Both specify same four tables: platform.user_roles, platform.roles, platform.role_permissions, platform.permissions. Both include same SQL join query. | 19_Sol/11:33; 20_Impl/11:91-96 |
| 6 | Fernet Encryption - 4 Implementations | 19_Sol/11, 20_Impl/11 | Near-identical. Both document same four Fernet implementations: (1) app/security/crypto.py, (2) app/utils/encryption_utils.py, (3) app/api/core/security/encryption.py, (4) app/api/core/encryption_manager.py. Same files and classes. 20 adds config.yaml key source. | 19_Sol/11:57-79; 20_Impl/11:134-162 |
| 7 | Audit Logging Middleware | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage. 08 describes audit conceptually. 19_Sol/11 specifies AuditLoggingMiddleware class, audit_middleware.py, logs method/path/user/status/duration, registration at main.py:53-54. 20_Impl/11 reproduces identical class, same file, same fields, same registration. | 08_Security:76-80; 19_Sol/11:84-88; 20_Impl/11:110-131 |
| 8 | Tenant Isolation Middleware | 19_Sol/11, 20_Impl/11 | Near-identical. Both document tenant_middleware in tenant_middleware.py. Both extract tenant_id from JWT. Both note status (implemented but not active vs code shown). Same file reference. | 19_Sol/11:90-94; 20_Impl/11:261-274 |
| 9 | CORS Configuration | 19_Sol/11, 20_Impl/11 | Identical. Both specify same origins (localhost:5173, localhost:3000), same methods (*), same headers (*), credentials enabled. Both reference main.py:41-47. | 19_Sol/11:96-101; 20_Impl/11:198-218 |
| 10 | Rate Limiting | 19_Sol/11, 20_Impl/11 | Identical. Both specify slowapi library, IP-based key, 5 requests/minute on login (auth_routes.py:17). Both reference registration at main.py:31-35. | 19_Sol/11:103-106; 20_Impl/11:249-257 |
| 11 | Password Hashing (bcrypt) | 19_Sol/11, 20_Impl/11 | Identical. Both specify passlib.context.CryptContext with bcrypt. Both reference auth_service.py:8. | 19_Sol/11:171-175; 20_Impl/11:59-72 |
| 12 | Custom AUDIT Log Level | 19_Sol/11, 20_Impl/11 | Identical. Both specify level 25, logger.py:8-9, exports/audit.log handler, format string. | 19_Sol/11:112-120; 20_Impl/11:172-186 |
| 13 | Governance Audit Events | 19_Sol/11, 20_Impl/11 | Near-identical. Both list BATCH_STARTED, MAPPING_RESOLVED, CONNECTION_RESOLVED, GOVERNANCE_DECISION. Same file references. | 19_Sol/11:122-127; 20_Impl/11:188-194 |
| 14 | Secrets Management - Env Variables | 08_Security, 19_Sol/11, 20_Impl/11, 09_Deploy | Quadruple coverage. 08 states Azure Key Vault preferred. 19_Sol/11 lists .env variables (JWT_SECRET_KEY, FERNET_KEY, DB creds). 20_Impl/11 reproduces same .env variables. 09_Deploy also states Azure Key Vault preferred. 19 and 20 are substantively identical. | 08_Security:328-344; 19_Sol/11:149-166; 20_Impl/11:221-247; 09_Deploy:312-326 |
| 15 | Secrets Management - .env Loading | 19_Sol/11, 20_Impl/11 | Identical. Both reference python-dotenv via load_dotenv() in config.py:10 and jwt_config.py:6-7. Same .gitignore exclusion. | 19_Sol/11:158; 20_Impl/11:225-237 |

### Deployment Architecture

| # | Topic | Appears In | Extent of Overlap | Evidence |
|---|-------|------------|-------------------|----------|
| 16 | Dockerfile Multi-Stage Build | 19_Sol/12, 20_Impl/04 | Near-identical. Both document 2-stage Docker build: Stage 1 python:3.11-slim with build-essential/libpq-dev, pip install. Stage 2 python:3.11-slim with libpq5, copies from builder, PYTHONPATH=/app, port 8000, uvicorn CMD. 20 adds pip upgrade step. | 19_Sol/12:9-25; 20_Impl/04:3-41 |
| 17 | Docker Compose Services & Config | 19_Sol/12, 20_Impl/04 | Near-identical. Both specify postgres:15 on 5432 and engine (Dockerfile) on 8000. Same env vars, same volume postgres_data, same dependency. 19 is summary table; 20 is full YAML. | 19_Sol/12:28-43; 20_Impl/04:43-76 |
| 18 | Container Layout Table | 19_Sol/12, 20_Impl/04 | Identical. Same service table: postgres=postgres:15/5432, engine=Dockerfile/8000. | 19_Sol/12:34-38; 20_Impl/04:78-83 |
| 19 | Backend Environment Variables (.env) | 19_Sol/12, 20_Impl/04 | Overlapping. 19 lists .env.example variables as Required. 20 provides actual .env with concrete values. Same variable set; 20 adds real values. | 19_Sol/12:96-109; 20_Impl/04:119-133 |
| 20 | CI/CD Pipeline | 09_Deploy, 19_Sol/12, 20_Impl/04 | Triple coverage. 09 describes conceptual CI (compile, test, static analysis, artifact) and CD (deploy, smoke test, rollback). 19 specifies GitHub Actions: lint (ruff), test (pytest), build notification. 20 references same config. 19 and 20 substantively identical. | 09_Deploy:329-364; 19_Sol/12:47-69 |
| 21 | Azure Deployment Resources | 09_Deploy, 19_Sol/12 | Partial overlap. 09 lists Azure services conceptually. 19 specifies Terraform template: Resource Group, PostgreSQL Flexible Server v15, Container App Environment, Container App. 09 is conceptual; 19 is specific. | 09_Deploy:231-252; 19_Sol/12:72-91 |
| 22 | Secrets - Azure Key Vault | 08_Security, 09_Deploy | Duplicate. Both state "Azure Key Vault is the preferred enterprise solution." | 08_Security:343; 09_Deploy:325 |
| 23 | Secrets - .env Files | 19_Sol/12, 20_Impl/04 | Overlapping. 19 provides .env.example as template. 20 provides actual .env with real values. Same variable set. | 19_Sol/12:96-109; 20_Impl/04:119-133 |
| 24 | Startup Process / Entry Point | 19_Sol/07, 19_Sol/12 | Overlapping. 19_Sol/07 documents startup: main.py, load_dotenv, load_config, FastAPI, middleware, routes, uvicorn port 8000. 19_Sol/12 documents CLI commands (run/discover/export) and API server (FastAPI/uvicorn/health). Same application, different focus. | 19_Sol/07:138-163; 19_Sol/12:128-143 |
| 25 | Backup Strategy | 09_Deploy, 05_Database | Overlapping. 09 lists PostgreSQL, Config, Artifacts, Reports, Audit Data. 05 lists point-in-time recovery, daily backups, geo-redundant storage. Shared topic, different emphasis. | 09_Deploy:409-424; 05_Database:435-449 |
| 26 | Disaster Recovery | 08_Security, 09_Deploy | Overlapping. 08 covers encrypted backups, PITR, geo-redundant storage. 09 covers application/DB/config recovery, regional failover. Shared topic, different scope. | 08_Security:401-415; 09_Deploy:427-441 |
| 27 | Scalability | 09_Deploy, 03_Backend | Overlapping. 09 describes horizontal scaling, additional instances. 03 describes stateless services, independent deployment. Same concept, different scope. | 09_Deploy:443-458; 03_Backend:326-333 |

### Backend Architecture

| # | Topic | Appears In | Extent of Overlap | Evidence |
|---|-------|------------|-------------------|----------|
| 28 | Backend Domain Organisation | 03_Backend, 19_Sol/07 | Partial overlap. 03 defines four business domains (Operations, Governance, Insights, Platform). 19_Sol/07 documents Python module organization but does not map to business domains. Different perspectives. | 03_Backend:84-146; 19_Sol/07:30-53 |
| 29 | Execution Flow - 6-Step Pipeline | 19_Sol/07, 18_DataModel/07 | Overlapping. 19_Sol/07 documents 6-step pipeline with code file references. 18_DataModel/07 describes same steps with data flow diagrams and table references. Same steps; code vs data flow perspective. | 19_Sol/07:70-101; 18_DataModel/07:65-101 |
| 30 | Validation Rules (C01-C010) | 19_Sol/07, 18_DataModel/05 | Partial overlap. 19_Sol/07 lists 10 rules with file references. 18_DataModel/05 lists same rule IDs from database rule_registry. Same IDs; code vs database perspective. | 19_Sol/07:186-198; 18_DataModel/05:84-98 |
| 31 | Service Communication (REST) | 03_Backend, 04_API, 19_Sol/06 | Overlapping. 03 states "Services communicate using REST APIs." 04 defines API architecture. 19_Sol/06 documents actual routers. Same principle; different abstraction levels. | 03_Backend:237-244; 04_API:26-33; 19_Sol/06:15-38 |

### API Architecture

| # | Topic | Appears In | Extent of Overlap | Evidence |
|---|-------|------------|-------------------|----------|
| 32 | API Structure - FastAPI | 04_API, 19_Sol/06 | Overlapping. 04 defines API architecture conceptually. 19_Sol/06 documents actual FastAPI implementation, base URL /api/v1/, 12 routers. Different abstraction levels. | 04_API:93-137; 19_Sol/06:15-38 |
| 33 | API Domains vs Routers | 04_API, 19_Sol/06 | Partial overlap. 04 defines four API domains with specific endpoints. 19_Sol/06 lists 12 routers. Several domain endpoints from 04 absent from 19 (governance, risk, audit, reports, copilot). | 04_API:139-192; 19_Sol/06:23-38 |
| 34 | Authentication Providers | 04_API, 08_Security | Overlapping. 04 lists Entra ID, B2C, OAuth 2.0, JWT, future SAML. 08 lists Entra ID, B2C, OAuth 2.0, OpenID Connect, future SAML. 08 adds OpenID Connect. | 04_API:321-336; 08_Security:119-136 |
| 35 | Authorisation Roles | 04_API, 08_Security | Overlapping. 04 lists 5 roles. 08 lists 9 roles (more comprehensive). | 04_API:339-356; 08_Security:168-190 |
| 36 | API Security Measures | 04_API, 08_Security | Overlapping. 04 lists HTTPS, JWT, role-based access, input validation, output encoding. 08 covers same with more detail (permission checks, audit logging, input sanitisation). | 04_API:437-456; 08_Security:193-211 |
| 37 | Audit - API Call Records | 04_API, 08_Security, 19_Sol/06 | Triple coverage. 04 defines audit fields conceptually. 08 defines audit framework with more fields. 19_Sol/06 documents middleware implementation. Different abstraction levels. | 04_API:359-377; 08_Security:262-284; 19_Sol/06:50-53 |
| 38 | Health Check Endpoints | 19_Sol/06, 19_Sol/12 | Identical. Both list /health, /api/v1/health, /api/v1/ready. | 19_Sol/06:107-113; 19_Sol/12:143 |

### Database Architecture

| # | Topic | Appears In | Extent of Overlap | Evidence |
|---|-------|------------|-------------------|----------|
| 39 | Schema Organisation (5 schemas) | 05_Database, 18_DataModel/01, 18_DataModel/02 | Triple coverage. 05 defines 5-schema model (core, engine, reporting, platform, audit) with high-level entity lists. 18_DataModel/01 confirms 5 active schemas plus engine_v14 legacy. 18_DataModel/02 provides detailed schema inventory with tables, views, functions. Same schemas; increasing detail. | 05_Database:173-185; 18_DataModel/01:13-22; 18_DataModel/02:1-266 |
| 40 | Core Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage. 05 lists Projects, Systems, Datasets, Mappings, etc. 18_DataModel/02 lists 8 tables with relationships. 18_DataModel/03 provides full column-level catalogue. Same entities; increasing detail. | 05_Database:189-213; 18_DataModel/02:3-47; 18_DataModel/03:1-193 |
| 41 | Engine Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage. 05 lists Batch, Controls, Rules, Governance, Scoring. 18_DataModel/02 lists 15 active tables, 4 views, 3 functions. 18_DataModel/03 provides full column-level catalogue. Same entities; increasing detail. | 05_Database:215-241; 18_DataModel/02:49-107; 18_DataModel/03:196-483 |
| 42 | Reporting Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/04 | Triple coverage. 05 lists Dimension Tables, Dashboards, Reports. 18_DataModel/02 lists 3 tables, 4 views. 18_DataModel/04 provides dimensional model with ER diagrams. Same entities; increasing detail. | 05_Database:243-260; 18_DataModel/02:147-180; 18_DataModel/04:129-152 |
| 43 | Platform Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage. 05 lists Users, Roles, Permissions, Workflows, Tasks, Notifications. 18_DataModel/02 lists 22 tables. 18_DataModel/03 provides full column-level catalogue. Same entities; increasing detail. | 05_Database:262-312; 18_DataModel/02:182-233; 18_DataModel/03:487-1091 |
| 44 | Audit Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/08 | Quadruple coverage. 05 lists Audit Events, Security Events, Login History, API Logs. 18_DataModel/02 lists 5 tables. 18_DataModel/03 provides column-level catalogue. 18_DataModel/08 provides detailed audit/history model. Same entities; increasing detail. | 05_Database:314-332; 18_DataModel/02:236-265; 18_DataModel/03:1094-1248; 18_DataModel/08:1-352 |
| 45 | Database Security | 05_Database, 08_Security | Overlapping. 05 lists encryption at rest, encrypted connections, role-based access, audit logging. 08 covers Data Security with same topics. Same concepts; different document context. | 05_Database:451-468; 08_Security:213-229 |
| 46 | Multi-Tenant Strategy | 05_Database, 18_DataModel/01 | Overlapping. 05 describes Tenant_ID in entities, future deployment options (shared DB/schema, dedicated). 18_DataModel/01 confirms multi-tenant design with tenant_id and row-level security. Same concept; 05 is design, 18 is implementation. | 05_Database:470-490; 18_DataModel/01:69-71 |
| 47 | Data Retention | 05_Database, 18_DataModel/08 | Overlapping. 05 defines retention policies (operational=configurable, audit=permanent, reports=configurable, logs=rolling). 18_DataModel/08 notes no explicit retention policies implemented. Design vs implementation gap. | 05_Database:492-512; 18_DataModel/08:319-326 |
| 48 | Data Integrity / Constraints | 05_Database, 18_DataModel/06, 18_DataModel/10 | Triple coverage. 05 lists PKs, FKs, unique, check constraints conceptually. 18_DataModel/06 provides detailed relationships (28 FKs). 18_DataModel/10 provides full constraint inventory (44 FKs, 21 checks, 6 unique). Same topic; increasing detail and count differences. | 05_Database:399-414; 18_DataModel/06:1-251; 18_DataModel/10:319-411 |
| 49 | Performance Strategy (Indexes) | 05_Database, 18_DataModel/10 | Overlapping. 05 mentions indexes, partitioning, materialized views. 18_DataModel/10 documents 71 actual indexes. 05 is design; 18 is implementation inventory. | 05_Database:417-432; 18_DataModel/10:217-315 |
| 50 | Data Lifecycle | 05_Database, 18_DataModel/07 | Overlapping. 05 defines: Source Data, Validation, Governance, Reporting, Archive. 18_DataModel/07 defines: Discovery, Mapping, Execution, Governance, Reporting, Audit, Notifications, Workflow, Tasks. Different scope and granularity. | 05_Database:370-396; 18_DataModel/07:1-303 |
| 51 | Lookup/Reference Data | 05_Database, 18_DataModel/05 | Overlapping. 05 lists validation rules, lookup tables, reference codes conceptually. 18_DataModel/05 provides detailed reference data: control_registry values, rule_registry values, dim_severity/dim_status values, system_settings defaults, feature_flags defaults, governance_config defaults. 05 is conceptual; 18 is detailed. | 05_Database:111-128; 18_DataModel/05:1-350 |

### Cross-Domain Overlaps

| # | Topic | Appears In | Extent of Overlap | Evidence |
|---|-------|------------|-------------------|----------|
| 52 | RBAC Tables (users, roles, permissions, user_roles, role_permissions) | 05_Database, 18_DataModel/02, 18_DataModel/03, 19_Sol/11, 20_Impl/11 | Quintuple coverage. 05 lists in Platform schema. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. 19_Sol/11 references for RBAC queries. 20_Impl/11 references for RBAC queries. Same tables across 5 documents. | 05_Database:262-312; 18_DataModel/02:192-198; 18_DataModel/03:528-627; 19_Sol/11:33; 20_Impl/11:91-96 |
| 53 | Audit Tables (audit_events, security_events, login_history, api_logs, configuration_history) | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/08 | Quadruple coverage. 05 lists in Audit schema. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. 18_DataModel/08 provides detailed audit model. Same tables across 4 documents. | 05_Database:314-332; 18_DataModel/02:236-265; 18_DataModel/03:1094-1248; 18_DataModel/08:1-352 |
| 54 | Execution Tables (migration_validation_batch, control_execution, etc.) | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/07 | Quadruple coverage. 05 lists in Engine schema. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. 18_DataModel/07 describes in execution flow. Same tables across 4 documents. | 05_Database:215-241; 18_DataModel/02:49-107; 18_DataModel/03:246-483; 18_DataModel/07:65-101 |
| 55 | Workflow Tables (workflow_definitions, workflow_instances, etc.) | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage. 05 lists in Platform schema. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. Same tables across 3 documents. | 05_Database:282-312; 18_DataModel/02:199-215; 18_DataModel/03:630-746 |
| 56 | Task Tables (tasks, task_comments, task_dependencies) | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage. 05 lists in Platform schema. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. Same tables across 3 documents. | 05_Database:294-298; 18_DataModel/02:206-208; 18_DataModel/03:833-914 |
| 57 | Notification Tables (notifications, notification_preferences) | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage. 05 lists in Platform schema. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. Same tables across 3 documents. | 05_Database:299-301; 18_DataModel/02:209-210; 18_DataModel/03:918-968 |
| 58 | Configuration Tables (system_settings, feature_flags, governance_config) | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/09 | Quadruple coverage. 05 lists in Platform/Engine schemas. 18_DataModel/02 lists in schema inventory. 18_DataModel/03 provides column-level detail. 18_DataModel/09 provides detailed configuration model. Same tables across 4 documents. | 05_Database:305-307; 18_DataModel/02:213-214; 18_DataModel/03:1035-1091; 18_DataModel/09:1-261 |

---

## Summary Statistics

| Domain | Duplicates Found | Unique-Only Topics |
|--------|-----------------|-------------------|
| Security Architecture | 15 | 5 (Principles, AI Security, Reporting Security, Hardening, Compliance) |
| Deployment Architecture | 12 | 2 (Environment Strategy, Monitoring) |
| Backend Architecture | 4 | 2 (Database Adapters, Dependency Graph) |
| API Architecture | 7 | 3 (Response Format, Versioning, Performance Targets, Endpoint Inventory) |
| Database Architecture | 13 | 0 |
| Cross-Domain | 6 | 0 |
| **Total** | **57 duplicates** | **12 unique-only topics** |

---

**Version:** 1.0

**Status:** Facts recorded. No recommendations made.
