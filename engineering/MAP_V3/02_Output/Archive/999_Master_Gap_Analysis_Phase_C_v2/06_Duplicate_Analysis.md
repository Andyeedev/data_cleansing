# 06_Duplicate_Analysis.md

# Duplicate Analysis

### MAP Nexus Enterprise Architecture — Phase C Gap Analysis

---

## Duplicate Summary

| Domain | Duplicate Groups | Unique-Only Topics | Source |
|--------|-----------------|-------------------|--------|
| Security Architecture | 15 | 5 | Phase A Duplicate Register #1-#15 |
| Deployment Architecture | 12 | 2 | Phase A Duplicate Register #16-#27 |
| Backend Architecture | 4 | 2 | Phase A Duplicate Register #28-#31 |
| API Architecture | 7 | 3 | Phase A Duplicate Register #32-#38 |
| Database Architecture | 13 | 0 | Phase A Duplicate Register #39-#51 |
| Cross-Domain | 6 | 0 | Phase A Duplicate Register #52-#58 |
| **Total** | **57** | **12** | |

---

## Security Architecture Duplicates

| # | Topic | Documents | Overlap Extent |
|---|-------|-----------|----------------|
| 1 | JWT Authentication | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage |
| 2 | JWT Token Payload | 19_Sol/11, 20_Impl/11 | Near-identical |
| 3 | JWT Token Dependencies | 19_Sol/11, 20_Impl/11 | Identical |
| 4 | RBAC Permission Format | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage |
| 5 | RBAC Database Tables | 19_Sol/11, 20_Impl/11 | Identical |
| 6 | Fernet Encryption | 19_Sol/11, 20_Impl/11 | Near-identical |
| 7 | Audit Logging Middleware | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage |
| 8 | Tenant Isolation | 19_Sol/11, 20_Impl/11 | Near-identical |
| 9 | CORS Configuration | 19_Sol/11, 20_Impl/11 | Identical |
| 10 | Rate Limiting | 19_Sol/11, 20_Impl/11 | Identical |
| 11 | Password Hashing | 19_Sol/11, 20_Impl/11 | Identical |
| 12 | Custom AUDIT Log Level | 19_Sol/11, 20_Impl/11 | Identical |
| 13 | Governance Audit Events | 19_Sol/11, 20_Impl/11 | Near-identical |
| 14 | Secrets Management - Env | 08_Security, 19_Sol/11, 20_Impl/11, 09_Deploy | Quadruple coverage |
| 15 | Secrets Management - .env | 19_Sol/11, 20_Impl/11 | Identical |

---

## Deployment Architecture Duplicates

| # | Topic | Documents | Overlap Extent |
|---|-------|-----------|----------------|
| 16 | Dockerfile Multi-Stage | 19_Sol/12, 20_Impl/04 | Near-identical |
| 17 | Docker Compose Config | 19_Sol/12, 20_Impl/04 | Near-identical |
| 18 | Container Layout | 19_Sol/12, 20_Impl/04 | Identical |
| 19 | Backend .env | 19_Sol/12, 20_Impl/04 | Overlapping |
| 20 | CI/CD Pipeline | 09_Deploy, 19_Sol/12, 20_Impl/04 | Triple coverage |
| 21 | Azure Deployment | 09_Deploy, 19_Sol/12 | Partial overlap |
| 22 | Azure Key Vault | 08_Security, 09_Deploy | Duplicate |
| 23 | .env Files | 19_Sol/12, 20_Impl/04 | Overlapping |
| 24 | Startup Process | 19_Sol/07, 19_Sol/12 | Overlapping |
| 25 | Backup Strategy | 09_Deploy, 05_Database | Overlapping |
| 26 | Disaster Recovery | 08_Security, 09_Deploy | Overlapping |
| 27 | Scalability | 09_Deploy, 03_Backend | Overlapping |

---

## Backend Architecture Duplicates

| # | Topic | Documents | Overlap Extent |
|---|-------|-----------|----------------|
| 28 | Backend Domain Organisation | 03_Backend, 19_Sol/07 | Partial overlap |
| 29 | Execution Flow | 19_Sol/07, 18_DataModel/07 | Overlapping |
| 30 | Validation Rules | 19_Sol/07, 18_DataModel/05 | Partial overlap |
| 31 | Service Communication | 03_Backend, 04_API, 19_Sol/06 | Overlapping |

---

## API Architecture Duplicates

| # | Topic | Documents | Overlap Extent |
|---|-------|-----------|----------------|
| 32 | API Structure | 04_API, 19_Sol/06 | Overlapping |
| 33 | API Domains vs Routers | 04_API, 19_Sol/06 | Partial overlap |
| 34 | Authentication Providers | 04_API, 08_Security | Overlapping |
| 35 | Authorisation Roles | 04_API, 08_Security | Overlapping |
| 36 | API Security | 04_API, 08_Security | Overlapping |
| 37 | Audit - API Call Records | 04_API, 08_Security, 19_Sol/06 | Triple coverage |
| 38 | Health Check Endpoints | 19_Sol/06, 19_Sol/12 | Identical |

---

## Database Architecture Duplicates

| # | Topic | Documents | Overlap Extent |
|---|-------|-----------|----------------|
| 39 | Schema Organisation | 05_Database, 18_DataModel/01, 18_DataModel/02 | Triple coverage |
| 40 | Core Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage |
| 41 | Engine Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage |
| 42 | Reporting Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/04 | Triple coverage |
| 43 | Platform Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage |
| 44 | Audit Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/08 | Quadruple coverage |
| 45 | Database Security | 05_Database, 08_Security | Overlapping |
| 46 | Multi-Tenant Strategy | 05_Database, 18_DataModel/01 | Overlapping |
| 47 | Data Retention | 05_Database, 18_DataModel/08 | Overlapping |
| 48 | Data Integrity | 05_Database, 18_DataModel/06, 18_DataModel/10 | Triple coverage |
| 49 | Performance Strategy | 05_Database, 18_DataModel/10 | Overlapping |
| 50 | Data Lifecycle | 05_Database, 18_DataModel/07 | Overlapping |
| 51 | Lookup/Reference Data | 05_Database, 18_DataModel/05 | Overlapping |

---

## Cross-Domain Duplicates

| # | Topic | Documents | Overlap Extent |
|---|-------|-----------|----------------|
| 52 | RBAC Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 19_Sol/11, 20_Impl/11 | Quintuple coverage |
| 53 | Audit Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/08 | Quadruple coverage |
| 54 | Execution Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/07 | Quadruple coverage |
| 55 | Workflow Tables | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage |
| 56 | Task Tables | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage |
| 57 | Notification Tables | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage |
| 58 | Configuration Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/09 | Quadruple coverage |

---

**Version:** 1.0

**Status:** Phase C — Duplicate analysis from Phase A Register
