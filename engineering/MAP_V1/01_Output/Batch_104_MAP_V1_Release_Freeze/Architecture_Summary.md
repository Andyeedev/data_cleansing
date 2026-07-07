# Architecture Summary — MAP V1

**Version:** v1.4.1-stable  
**Date:** 2026-07-07  

---

## System Overview

MAP V1 (Migration Assurance Platform) is a Python-based validation engine that verifies data integrity across database migrations.

---

## Core Components

### Execution Engine
- Project-scoped batch execution
- Mapping-driven rule resolution
- Recovery mode support

### Rule Engine
| Rule | Name |
|---|---|
| C01 | Row Count Comparison |
| C02 | Sum Comparison |
| C03 | Referential Integrity |
| C04 | Column Count Match |
| C05 | Column Null Comparison |
| C06 | Data Type Match |
| C07 | Duplicate Detection |
| C08 | Data Drift Detection |
| C09 | Referential Coverage |
| C010 | Schema Drift |

### Database Adapters
- PostgreSQL (primary)
- MySQL
- SQL Server
- Oracle
- Snowflake
- BigQuery
- Databricks (OData)

### Security Layer
- Fernet symmetric encryption for credentials
- JWT token authentication
- Password hashing (bcrypt)

### Governance
- Decision engine
- Risk scoring
- Audit export

### API Layer
- FastAPI REST interface
- Swagger/OpenAPI documentation
- Tenant middleware

---

## Data Flow

```
Config → Execution Engine → Rule Resolution → DB Adapters → Validation → Governance → Audit Export
```

---

## Technology Stack

| Component | Technology |
|---|---|
| Language | Python 3.x |
| Web Framework | FastAPI |
| Database | PostgreSQL 17 |
| Encryption | Fernet (cryptography) |
| Auth | JWT (PyJWT) |
| ORM/Driver | psycopg2, mysql-connector, pyodbc, oracledb |
| Container | Docker |

---

**Signed off:** Batch 104 — Release v1.4.1-stable
