# Phase 12 — Connection Adapter Integration Strategy

## Revised Governing Strategy

**Phase:** 12  
**Status:** Revised — Awaiting Approval  
**Date:** 2026-08-08  
**Master Scope:** `12_0_Scope_Document.md`

---

## 1. Core Principle

**Phase 12 is a connection adapter integration exercise, not a new validation architecture.**

| Principle | Description |
|-----------|-------------|
| **Reuse** | Use existing PostgresAdapter for Azure PostgreSQL |
| **Reuse** | Use existing SQLServerAdapter for Azure SQL |
| **Reuse** | Use existing connection → discovery → mapping patterns |
| **No new validation rules** | Existing rules work against any connected DB |
| **No new UI patterns** | Reuse Migration/Validation page patterns |
| **Infrastructure only** | Azure resources + scripts, no MAP architecture changes |

---

## 2. Adapter Certification Approach

### 2.1 SQL Server Connector Certification (First)

**Objective:** Verify SQLServerAdapter works with Azure SQL without modifications.

**Steps:**
1. **Code Review** — Inspect `SQLServerAdapter.connect()` for Azure compatibility
2. **Connection Test** — Attempt connection to `azure-sql-map-test.database.windows.net`
3. **Query Test** — Execute `SELECT 1` and schema queries
4. **Discovery Test** — Run dataset discovery against Azure SQL
5. **Document Findings** — Record any required changes

**Success Criteria:**
- ✅ Connection succeeds without adapter changes
- ✅ Schema queries return correct metadata
- ✅ Discovery service identifies tables/columns

---

### 2.2 PostgreSQL Connector Certification (Second)

**Objective:** Verify PostgresAdapter works with Azure PostgreSQL without modifications.

**Steps:**
1. **Code Review** — Inspect `PostgresAdapter.connect()` for Azure compatibility
2. **Connection Test** — Attempt connection to `postgres-flexible-map-test.postgres.database.azure.com`
3. **SSL Verification** — Confirm SSL mode works
4. **Query Test** — Execute `SELECT 1` and schema queries
5. **Discovery Test** — Run dataset discovery against PostgreSQL
6. **Document Findings** — Record any required changes

**Success Criteria:**
- ✅ Connection succeeds without adapter changes
- ✅ SSL handshake completes
- ✅ Schema queries return correct metadata
- ✅ Discovery service identifies tables/columns

---

## 3. Existing Patterns to Reuse

### 3.1 Migration Patterns

| Page | Route | Pattern |
|------|-------|---------|
| Migration → Connections | `/migration/connections` | System registration form |
| Migration → Mappings | `/migration/mappings` | Dataset mapping UI |
| Migration → Discovery | `/migration/discovery` | Schema discovery flow |
| Migration → Execution | `/migration/execution` | Validation execution |

### 3.2 Validation Patterns

| Page | Route | Pattern |
|------|-------|---------|
| Validation → Overview | `/validation` | Dashboard cards |
| Validation → History | `/validation/history` | Batch history table |
| Validation → Results | `/validation/results` | Results with tabs |
| Validation → Rules | `/validation/rules` | Rule registry table |
| Validation → Discovery | `/validation/rule-discovery` | Two-tree SplitPane |

---

## 4. Azure Resources (Planned)

| Resource | Name | Planned Purpose | Status |
|----------|------|-----------------|--------|
| Resource Group | `rg-map-test-dev` | Container | Planned |
| PostgreSQL Server | `postgres-flexible-map-test` | Source DB | Planned |
| Azure SQL Server | `azure-sql-map-test` | Target DB Server | Planned |
| SQL Database | `map_test_db` | Target DB | Planned |

---

## 5. Test Data Strategy

### 5.1 Tables (10 tables × 5 rows)

| Table | Purpose | Relationships |
|-------|---------|---------------|
| customers | PK, text, row-count | - |
| accounts | FK, numeric balances | → customers |
| transactions | Numeric aggregation | → accounts |
| products | Reference data | - |
| orders | Parent/child, totals | → customers |
| order_items | FK, calculations | → orders, products |
| employee_records | Dates, nullable | - |
| branches | Geographic/reference | - |
| account_snapshots | Data drift | → accounts |
| customer_risk | Boolean, nullable | → customers |

### 5.2 Migration Scenarios (10 scenarios)

| # | Scenario | Detection Level |
|---|----------|-----------------|
| 1 | Exact match | Baseline |
| 2 | Row-count mismatch | MAP validation |
| 3 | Missing target row | MAP validation |
| 4 | Duplicate primary key | Database-level |
| 5 | Numeric balance mismatch | MAP validation |
| 6 | Null-value difference | MAP validation |
| 7 | Data-type difference | Schema discovery |
| 8 | Referential-integrity difference | MAP validation |
| 9 | Column-count/schema difference | Schema discovery |
| 10 | Data drift | MAP validation |

---

## 6. Automation Scripts (Planned)

| Method | File | Status |
|--------|------|--------|
| Python | `scripts/setup_databases.py` | Planned |
| Shell | `scripts/shell/setup.sh` | Planned |
| PowerShell | `scripts/powershell/setup.ps1` | Planned |
| Batch | `scripts/batch/setup.cmd` | Planned |
| Terminal | `scripts/terminal/commands.txt` | Planned |

---

## 7. Governance Gates

| Gate | Status |
|------|--------|
| Master scope (`12_0_Scope_Document.md`) | ✅ Approved |
| This strategy document | ⏳ Awaiting Approval |
| SQL Server Connector Certification | ⏳ Pending |
| PostgreSQL Connector Certification | ⏳ Pending |
| Test data seeding | ⏳ Pending |
| Validation testing | ⏳ Pending |
| Closure report | ⏳ Pending |

---

## 8. Success Criteria

| Criterion | Target |
|-----------|--------|
| SQLServerAdapter connects to Azure SQL | Without code changes |
| PostgresAdapter connects to Azure PostgreSQL | Without code changes |
| Schema discovery works on both | Identifies all 10 tables |
| Validation executes against both | Results match baseline |
| Test data resets reliably | Reset scripts work |
| No duplicate architecture created | All reuse existing patterns |

---

**End of Strategy Document**
