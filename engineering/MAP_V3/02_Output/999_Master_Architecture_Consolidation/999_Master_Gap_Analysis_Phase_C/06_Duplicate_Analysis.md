# 06_Duplicate_Analysis.md

# Duplicate Analysis — Extended Validation

### MAP Nexus Enterprise Architecture — Phase C Gap Analysis

---

## Duplicate Summary

| Domain | Status | Evidence |
|--------|--------|----------|
| Security Architecture | VERIFIED | 15 duplicate groups (Phase A Duplicate Register (02): #1-#15) |
| Deployment Architecture | VERIFIED | 12 duplicate groups (Phase A Duplicate Register (02): #16-#27) |
| Backend Architecture | VERIFIED | 4 duplicate groups (Phase A Duplicate Register (02): #28-#31) |
| API Architecture | VERIFIED | 7 duplicate groups (Phase A Duplicate Register (02): #32-#38) |
| Database Architecture | VERIFIED | 13 duplicate groups (Phase A Duplicate Register (02): #39-#51) |
| Cross-Domain | VERIFIED | 6 duplicate groups (Phase A Duplicate Register (02): #52-#57) |
| **Total** | VERIFIED | 57 duplicate groups |

---

## Security Architecture Duplicates

| # | Topic | Documents | Overlap Type | Recommended Authoritative Location |
|---|-------|-----------|--------------|-----------------------------------|
| 1 | JWT Authentication | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage | 19_Solution/11 (most specific) |
| 2 | JWT Token Payload | 19_Sol/11, 20_Impl/11 | Near-identical | 19_Solution/11 |
| 3 | JWT Token Dependencies | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |
| 4 | RBAC Permission Format | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage | 19_Solution/11 (most specific) |
| 5 | RBAC Database Tables | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |
| 6 | Fernet Encryption | 19_Sol/11, 20_Impl/11 | Near-identical | 19_Solution/11 |
| 7 | Audit Logging Middleware | 08_Security, 19_Sol/11, 20_Impl/11 | Triple coverage | 19_Solution/11 (most specific) |
| 8 | Tenant Isolation | 19_Sol/11, 20_Impl/11 | Near-identical | 19_Solution/11 |
| 9 | CORS Configuration | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |
| 10 | Rate Limiting | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |
| 11 | Password Hashing | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |
| 12 | Custom AUDIT Log Level | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |
| 13 | Governance Audit Events | 19_Sol/11, 20_Impl/11 | Near-identical | 19_Solution/11 |
| 14 | Secrets Management - Env | 08_Security, 19_Sol/11, 20_Impl/11, 09_Deploy | Quadruple coverage | 19_Solution/11 (most specific) |
| 15 | Secrets Management - .env | 19_Sol/11, 20_Impl/11 | Identical | 19_Solution/11 |

---

## Deployment Architecture Duplicates

| # | Topic | Documents | Overlap Type | Recommended Authoritative Location |
|---|-------|-----------|--------------|-----------------------------------|
| 16 | Dockerfile Multi-Stage | 19_Sol/12, 20_Impl/04 | Near-identical | 20_Impl/04 (implementation) |
| 17 | Docker Compose Config | 19_Sol/12, 20_Impl/04 | Near-identical | 20_Impl/04 (implementation) |
| 18 | Container Layout | 19_Sol/12, 20_Impl/04 | Identical | 20_Impl/04 (implementation) |
| 19 | Backend .env | 19_Sol/12, 20_Impl/04 | Overlapping | 20_Impl/04 (implementation) |
| 20 | CI/CD Pipeline | 09_Deploy, 19_Sol/12, 20_Impl/04 | Triple coverage | 20_Impl/04 (implementation) |
| 21 | Azure Deployment | 09_Deploy, 19_Sol/12 | Partial overlap | 19_Solution/12 (solution) |
| 22 | Azure Key Vault | 08_Security, 09_Deploy | Duplicate | 08_Security (security) |
| 23 | .env Files | 19_Sol/12, 20_Impl/04 | Overlapping | 20_Impl/04 (implementation) |
| 24 | Startup Process | 19_Sol/07, 19_Sol/12 | Overlapping | 19_Solution/07 (backend) |
| 25 | Backup Strategy | 09_Deploy, 05_Database | Overlapping | 09_Deployment (deployment) |
| 26 | Disaster Recovery | 08_Security, 09_Deploy | Overlapping | 08_Security (security) |
| 27 | Scalability | 09_Deploy, 03_Backend | Overlapping | 09_Deployment (deployment) |

---

## Backend Architecture Duplicates

| # | Topic | Documents | Overlap Type | Recommended Authoritative Location |
|---|-------|-----------|--------------|-----------------------------------|
| 28 | Backend Domain Organisation | 03_Backend, 19_Sol/07 | Partial overlap | 19_Solution/07 (solution) |
| 29 | Execution Flow | 19_Sol/07, 18_DataModel/07 | Overlapping | 19_Solution/07 (code perspective) |
| 30 | Validation Rules | 19_Sol/07, 18_DataModel/05 | Partial overlap | 19_Solution/07 (code perspective) |
| 31 | Service Communication | 03_Backend, 04_API, 19_Sol/06 | Overlapping | 19_Solution/06 (API perspective) |

---

## API Architecture Duplicates

| # | Topic | Documents | Overlap Type | Recommended Authoritative Location |
|---|-------|-----------|--------------|-----------------------------------|
| 32 | API Structure | 04_API, 19_Sol/06 | Overlapping | 19_Solution/06 (implementation) |
| 33 | API Domains vs Routers | 04_API, 19_Sol/06 | Partial overlap | 19_Solution/06 (implementation) |
| 34 | Authentication Providers | 04_API, 08_Security | Overlapping | 08_Security (security) |
| 35 | Authorisation Roles | 04_API, 08_Security | Overlapping | 08_Security (security) |
| 36 | API Security | 04_API, 08_Security | Overlapping | 08_Security (security) |
| 37 | Audit - API Call Records | 04_API, 08_Security, 19_Sol/06 | Triple coverage | 19_Solution/06 (implementation) |
| 38 | Health Check Endpoints | 19_Sol/06, 19_Sol/12 | Identical | 19_Solution/06 (API) |

---

## Database Architecture Duplicates

| # | Topic | Documents | Overlap Type | Recommended Authoritative Location |
|---|-------|-----------|--------------|-----------------------------------|
| 39 | Schema Organisation | 05_Database, 18_DataModel/01, 18_DataModel/02 | Triple coverage | 18_DataModel/02 (most detailed) |
| 40 | Core Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage | 18_DataModel/03 (column-level) |
| 41 | Engine Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage | 18_DataModel/03 (column-level) |
| 42 | Reporting Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/04 | Triple coverage | 18_DataModel/04 (dimensional model) |
| 43 | Platform Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage | 18_DataModel/03 (column-level) |
| 44 | Audit Schema Entities | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/08 | Quadruple coverage | 18_DataModel/08 (detailed audit model) |
| 45 | Database Security | 05_Database, 08_Security | Overlapping | 08_Security (security) |
| 46 | Multi-Tenant Strategy | 05_Database, 18_DataModel/01 | Overlapping | 18_DataModel/01 (implementation) |
| 47 | Data Retention | 05_Database, 18_DataModel/08 | Overlapping | 18_DataModel/08 (audit/history) |
| 48 | Data Integrity | 05_Database, 18_DataModel/06, 18_DataModel/10 | Triple coverage | 18_DataModel/10 (constraint inventory) |
| 49 | Performance Strategy | 05_Database, 18_DataModel/10 | Overlapping | 18_DataModel/10 (index inventory) |
| 50 | Data Lifecycle | 05_Database, 18_DataModel/07 | Overlapping | 18_DataModel/07 (data flow) |
| 51 | Lookup/Reference Data | 05_Database, 18_DataModel/05 | Overlapping | 18_DataModel/05 (reference data) |

---

## Cross-Domain Duplicates

| # | Topic | Documents | Overlap Type | Recommended Authoritative Location |
|---|-------|-----------|--------------|-----------------------------------|
| 52 | RBAC Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 19_Sol/11, 20_Impl/11 | Quintuple coverage | 18_DataModel/03 (column-level) |
| 53 | Audit Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/08 | Quadruple coverage | 18_DataModel/08 (detailed audit model) |
| 54 | Execution Tables | 05_Database, 18_DataModel/02, 18_DataModel/03, 18_DataModel/07 | Quadruple coverage | 18_DataModel/03 (column-level) |
| 55 | Workflow Tables | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage | 18_DataModel/03 (column-level) |
| 56 | Task Tables | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage | 18_DataModel/03 (column-level) |
| 57 | Notification Tables | 05_Database, 18_DataModel/02, 18_DataModel/03 | Triple coverage | 18_DataModel/03 (column-level) |

---

**Version:** 1.0

**Status:** Phase C Extended Validation — Evidence-first duplicate analysis
