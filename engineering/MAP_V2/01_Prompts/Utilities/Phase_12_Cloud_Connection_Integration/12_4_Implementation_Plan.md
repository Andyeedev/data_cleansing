# Phase 12 — Implementation Plan

## Detailed Implementation Steps

**Phase:** 12  
**Status:** Planning  
**Date:** 2026-08-08

---

## 0. Pre-Implementation Review (MANDATORY)

**Before any implementation, review these existing MAP patterns:**

### Existing Migration Patterns (Reuse, Don't Duplicate)
| Page | Route | Pattern to Reuse |
|------|-------|------------------|
| Migration → Connections | `/migration/connections` | System registration form |
| Migration → Mappings | `/migration/mappings` | Dataset mapping UI |
| Migration → Discovery | `/migration/discovery` | Schema discovery flow |
| Migration → Execution | `/migration/execution` | Validation execution |

### Existing Validation Patterns (Reuse, Don't Duplicate)
| Page | Route | Pattern to Reuse |
|------|-------|------------------|
| Validation → Overview | `/validation` | Dashboard cards |
| Validation → History | `/validation/history` | Batch history table |
| Validation → Results | `/validation/results` | Results with tabs |
| Validation → Rules | `/validation/rules` | Rule registry table |
| Validation → Discovery | `/validation/rule-discovery` | Two-tree SplitPane |

**Phase 12 MUST reuse these patterns. Do not create duplicate functionality.**

---

## 1. Architectural Principle

**Phase 12 is primarily an infrastructure/connection integration exercise, NOT a new validation architecture.**

| Principle | Description |
|-----------|-------------|
| **Reuse** | Use existing PostgresAdapter for Azure PostgreSQL |
| **Reuse** | Use existing SQLServerAdapter for Azure SQL |
| **Reuse** | Use existing connection → discovery → mapping patterns |
| **No new validation rules** | Existing rules work against any connected DB |
| **No new UI patterns** | Reuse Migration/Validation page patterns |
| **Infrastructure only** | Azure resources + scripts, no MAP architecture changes |

---

## 1. Implementation Order

```
Step 0: Review existing patterns (above)
Step 1: Create Azure infrastructure (Terraform/CLI) — NEW INFRASTRUCTURE, not MAP change
Step 2: Configure networking and security
Step 3: Create test data SQL scripts
Step 4: Seed baseline data
Step 5: Register connections in MAP (using existing UI/API)
Step 6: Test connectivity
Step 7: Test schema discovery
Step 8: Test validation execution
Step 9: Create scenario scripts
Step 10: Create reset/destroy scripts
Step 11: Document results
```

---

## 2. Infrastructure (Terraform — New Component)

**Terraform is NEW infrastructure, NOT a MAP application change.**

**Note:** The following Terraform/CLI examples are illustrative only. Final implementation decisions (resource names, tiers, regions) will be made during implementation planning.

| Component | Type | Purpose |
|-----------|------|---------|
| `terraform/main.tf` | New file | Azure resource definitions |
| `terraform/variables.tf` | New file | Input variables |
| `terraform/outputs.tf` | New file | Output values |
| `scripts/provision.sh` | New file | CLI provisioning (backup) |
| `scripts/destroy.sh` | New file | CLI destruction |

**No MAP application code changes required for infrastructure.**

---

### Step 2: Test Data

**Directory Structure:**
```
azure-test-data/
├── baseline/
│   ├── 01_create_tables.sql
│   └── 02_insert_data.sql
├── scenarios/
│   ├── 01_exact_match.sql
│   ├── 02_rowcount_mismatch.sql
│   ├── 03_missing_target_row.sql
│   ├── 04_duplicate_key.sql
│   ├── 05_numeric_mismatch.sql
│   ├── 06_null_difference.sql
│   ├── 07_datatype_difference.sql
│   ├── 08_referential_integrity.sql
│   ├── 09_schema_difference.sql
│   └── 10_data_drift.sql
└── reset/
    └── reset_to_baseline.sql
```

---

### Step 3: MAP Registration

**Via API:**
```bash
# Register Client 1 - Source
POST /api/v1/systems
{
  "system_name": "Client1-Project001-AzurePostgreSQL-Source",
  "system_role": "SOURCE",
  "database_type": "POSTGRES",
  "project_id": "project-001",
  "connection_config": {
    "host": "postgres-flexible.postgres.database.azure.com",
    "port": 5432,
    "database": "map_test_db"
  }
}
```

**Or via UI:**
1. Go to Migration → Connections
2. Click "Add System"
3. Select Type: PostgreSQL
4. Enter Azure connection details
5. Set Role: Source

---

### Step 4: Connectivity Test

| Test | Command/Action | Expected Result |
|------|----------------|-----------------|
| TCP | `telnet postgres-flexible.postgres.database.azure.com 5432` | Connected |
| Auth | MAP "Test Connection" button | Success |
| Schema | MAP Discovery | 10 tables found |
| Validation | Run validation | Results returned |

---

### Step 5: Validation Test

| Scenario | Test | Expected |
|----------|------|----------|
| Exact match | Compare source/target | All pass |
| Row count mismatch | Delete 1 row from target | Validation fails |
| Data drift | Update balance value | Validation flags difference |

---

## 3. Timeline

| Step | Duration | Cumulative |
|------|----------|------------|
| 1. Infrastructure | 2 hours | 2 hours |
| 2. Test data | 3 hours | 5 hours |
| 3. Registration | 1 hour | 6 hours |
| 4. Testing | 2 hours | 8 hours |
| 5. Scenarios | 3 hours | 11 hours |
| 6. Scripts | 2 hours | 13 hours |
| 7. Documentation | 1 hour | 14 hours |

**Total: ~2 days**

---

## 4. Risks

| Risk | Mitigation |
|------|------------|
| Azure cost | Use dev/test tiers, destroy when done |
| Network issues | Configure firewall correctly |
| Credential leak | Use env vars, never commit |
| Data corruption | Use separate test database |

---

## 5. Deliverables

| # | Deliverable | Type |
|---|-------------|------|
| 1 | Terraform configuration | .tf files |
| 2 | SQL baseline scripts | .sql files |
| 3 | SQL scenario scripts | .sql files |
| 4 | Lifecycle scripts | .sh files |
| 5 | Test results | Markdown |
| 6 | `12_8_Closure_Report.md` | Markdown |
| 7 | `12_9_Connection_Test_Report.md` | Markdown |
| 8 | `12_10_Azure_Destroy_Recreate_Runbook.md` | Markdown |

---

**End of Document**
