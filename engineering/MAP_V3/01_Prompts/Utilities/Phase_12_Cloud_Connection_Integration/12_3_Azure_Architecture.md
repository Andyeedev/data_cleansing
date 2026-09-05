# Phase 12 — Azure Architecture

## Azure Resource Design

**Phase:** 12  
**Status:** Design Complete  
**Date:** 2026-08-08

**Note:** Values marked [TBD] must be confirmed during implementation planning.

---

## 1. Azure Resource Topology

```
Subscription: [TBD]
└── Resource Group: rg-map-test-dev
    ├── Server: postgres-sql (Azure Database for PostgreSQL - Flexible Server)
    │   ├── Database: map_test_db
    │   ├── Region: [TBD]
    │   ├── Tier: Burstable B1ms (dev/test) [TBD - confirm cost]
    │   └── Port: 5432
    │
    └── Server: azure-sql (Azure SQL Database)
        ├── Database: map_test_db
        ├── Region: [TBD]
        ├── Tier: Standard S0 (dev/test) [TBD - confirm cost]
        └── Port: 1433
```

---

## 2. Client/Project Structure

### Client 1 / Project 001

| Connection | Type | Role | Azure Resource |
|------------|------|------|----------------|
| Client1-Project001-AzurePostgreSQL-Source | Azure PostgreSQL | SOURCE | postgres-flexible |
| Client1-Project001-AzureSQL-Target | Azure SQL | TARGET | azure-sql |

### Client 2 / Project 002

| Connection | Type | Role | Source | Isolation |
|------------|------|------|--------|-----------|
| Client2-Project002-PostgreSQL-Source | PostgreSQL | SOURCE | Local existing | Separate local DB |
| Client2-Project002-AzurePostgreSQL-Target | Azure PostgreSQL | TARGET | Same Azure PostgreSQL server | Separate schema/database |

**Client 2 Isolation Model:**
- Uses same Azure PostgreSQL server as Client 1
- Separate schema or database for isolation
- Source uses existing local PostgreSQL (no new resources)
- Verifies cross-cloud/local compatibility

---

## 3. Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Azure Subscription                    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Resource Group: rg-map-test-dev          │    │
│  │                                                  │    │
│  │  ┌─────────────────────┐  ┌──────────────────┐  │    │
│  │  │ PostgreSQL Flexible │  │ Azure SQL Server │  │    │
│  │  │                     │  │                  │  │    │
│  │  │ ┌─────────────────┐ │  │ ┌──────────────┐ │  │    │
│  │  │ │ map_test_db     │ │  │ │ map_test_db  │ │  │    │
│  │  │ │ (10 tables)     │ │  │ │ (10 tables)  │ │  │    │
│  │  │ └─────────────────┘ │  │ └──────────────┘ │  │    │
│  │  │                     │  │                  │  │    │
│  │  │ Firewall: Allow     │  │ Firewall: Allow  │  │    │
│  │  │ MAP dev IP only     │  │ MAP dev IP only  │  │    │
│  │  └─────────────────────┘  └──────────────────┘  │    │
│  │                                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           │
                           │ (Secure connection)
                           ▼
                ┌─────────────────────┐
                │  MAP Development    │
                │  Environment        │
                └─────────────────────┘
```

---

## 4. Security Configuration

| Setting | Value |
|---------|-------|
| Authentication | SQL Login (username/password) |
| Firewall | Allow dev IP only |
| SSL/TLS | Required |
| Secrets | Environment variables (not in Git) |

---

## 5. Credential Management

```
.env (local, not committed)
├── AZURE_POSTGRES_HOST=postgres-flexible.postgres.database.azure.com
├── AZURE_POSTGRES_USER=mapadmin
├── AZURE_POSTGRES_PASSWORD=<secret>
├── AZURE_POSTGRES_DATABASE=map_test_db
├── AZURE_SQL_HOST=azure-sql.database.windows.net
├── AZURE_SQL_USER=mapadmin
├── AZURE_SQL_PASSWORD=<secret>
├── AZURE_SQL_DATABASE=map_test_db
```

---

## 6. Test Data Schema

### 6.1 Table List

| # | Table Name | Purpose | Rows |
|---|------------|---------|------|
| 1 | customers | PK, text, row-count | 5 |
| 2 | accounts | FK, numeric balances | 5 |
| 3 | transactions | Numeric aggregation | 5 |
| 4 | products | Reference data | 5 |
| 5 | orders | Parent/child, totals | 5 |
| 6 | order_items | FK, calculations | 5 |
| 7 | employee_records | Dates, nullable | 5 |
| 8 | branches | Geographic data | 5 |
| 9 | account_snapshots | Data drift | 5 |
| 10 | customer_risk | Boolean, nullable | 5 |

### 6.2 Relationships

```
customers (1) ──< accounts (many)
accounts (1) ──< transactions (many)
accounts (1) ──< account_snapshots (many)
customers (1) ──< orders (many)
customers (1) ──< customer_risk (many)
orders (1) ──< order_items (many)
products (1) ──< order_items (many)
```

---

**End of Document**
