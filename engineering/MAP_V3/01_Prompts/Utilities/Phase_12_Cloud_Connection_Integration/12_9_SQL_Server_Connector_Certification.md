# Phase 12 — SQL Server Connector Certification

## Revised Implementation Plan

**Phase:** 12  
**Component:** SQLServerAdapter  
**Status:** Planning  
**Date:** 2026-08-08

---

## 1. Authentication Certification Matrix

### 1.1 Current MAP Implementation

| Authentication Type | Currently Supported | Config Fields |
|---------------------|---------------------|---------------|
| **SQL Login** (username/password) | Yes | `username`, `password` |
| Windows Integrated Security | No | Not implemented |
| Azure Active Directory | No | Not implemented |
| Managed Identity | No | Not implemented |
| Service Principal | No | Not implemented |

### 1.2 Azure SQL Supported Authentication

| Authentication Type | Azure SQL Database Support | Test Environment |
|---------------------|---------------------------|------------------|
| **SQL Login** | Yes | Azure SQL |
| **Entra Password/User** | Yes | Azure SQL |
| **Entra Service Principal** | Yes | Azure SQL |
| **Managed Identity** | Yes | Azure SQL |
| Windows Integrated Security | **No** | On-prem SQL Server only |

### 1.3 Certification Scope

| Authentication Type | Certify Against | Priority |
|---------------------|-----------------|----------|
| SQL Login | Azure SQL | High |
| Entra Password/User | Azure SQL | High |
| Entra Service Principal | Azure SQL | High |
| Managed Identity | Azure SQL | Medium |
| Windows Integrated Security | On-prem SQL Server | Low (future) |

---

## 2. Correct Implementation Order

| Step | Activity | Deliverable | Constraints |
|------|----------|-------------|-------------|
| 1 | Terraform provisions isolated Azure certification environment | RG, network, identities | Verify no secrets in state |
| 2 | Provision Azure SQL | Server + database | Admin password via secure input |
| 3 | Provision Key Vault + Entra identities | Vault, SP, MI | Terraform creates infrastructure only |
| 4 | Seed secrets OUTSIDE Terraform | Secrets in Key Vault | CLI/Portal — not Terraform |
| 5 | Create test DB + 10 tables + baseline data | Seeded test environment | - |
| 6 | Build standalone Python certification adapter | Adapter code | **NOT in app/adapters/** |
| 7 | Test SQL Login authentication | Test results | Standard username/password |
| 8 | Test Entra User authentication | Test results | Entra ID user credentials |
| 9 | Test Entra Service Principal authentication | Test results | Client ID/secret |
| 10 | Test Managed Identity authentication | Test results | **Azure-hosted test runner required** |
| 11 | Discovery / query / CRUD / validation tests | Test results | - |
| 12 | Security + failure tests | Test results | - |
| 13 | Certification report | Documented findings | - |
| 14 | **STOP — Explicit Approval** | - | **No MAP changes before approval** |
| 15 | Integrate certified functionality into MAP | MAP adapter updates | Only after approval |
| 16 | MAP integration testing | Test results | - |
| 17 | Source/target combination testing | Test results | **Only after MAP integration** |

---

## 3. Key Principles

| Principle | Description |
|-----------|-------------|
| **Isolated Environment** | Certification environment separate from MAP |
| **No MAP Modifications** | Do not modify `app/adapters/sqlserver.py` until approved |
| **Standalone Adapter** | Build in separate project, not in `app/adapters/` |
| **Key Vault** | Store secrets in Azure Key Vault, not Terraform state |
| **Approval Gate** | STOP after certification report for explicit approval |
| **No Windows Auth vs Azure SQL** | Windows Integrated not supported by Azure SQL Database |

---

## 4. Authentication Scope

### 4.1 Azure SQL Certification (In Scope)

| Authentication Type | Azure SQL Support | Certify | Priority | Notes |
|---------------------|-------------------|---------|----------|-------|
| **SQL Login** | Yes | Yes | High | Standard test |
| **Entra Password/User** | Yes | Yes | High | Entra user credentials |
| **Entra Service Principal** | Yes | Yes | High | Client ID/secret |
| **Managed Identity** | Yes | Yes | Medium | **Requires Azure-hosted test runner** |

### 4.2 Windows Integrated Authentication (Out of Scope for Azure SQL)

| Authentication Type | Azure SQL Support | Certify | Notes |
|---------------------|-------------------|---------|-------|
| Windows Integrated Security | **No** | **No** | Not supported by Azure SQL Database |

**If MAP must support Windows Integrated Authentication in future:**
- Create separate local/on-prem SQL Server certification environment
- Test against actual Windows Server + SQL Server
- Do not include in Phase 12 Azure SQL certification

---

## 5. Terraform Isolated Environment

### 5.1 Resources

| Resource | Name | Purpose |
|----------|------|---------|
| Resource Group | `rg-sql-certification` | Isolated certification |
| Azure SQL Server | `sql-certification-test` | Test target |
| Azure SQL Database | `certification_db` | Test database |
| Key Vault | `kv-sql-certification` | Secret storage |
| Entra App Registration | `map-sql-certification` | Service Principal |
| Managed Identity | `id-map-certification` | Managed Identity |

### 5.2 State Security — CRITICAL

| Practice | Status | Implementation |
|----------|--------|----------------|
| Password in Terraform state | **NEVER** | Do not store secrets in state |
| Terraform creates Key Vault secret value | **NEVER** | Terraform `azurerm_key_vault_secret` stores value in state |
| Terraform provisions Key Vault | **YES** | Terraform creates vault, not secrets |
| Secrets generated outside Terraform | **YES** | Generate secrets separately |
| Secrets inserted into Key Vault separately | **YES** | Use Azure CLI/Portal/PowerShell after Terraform |
| Terraform references Key Vault | **YES** | Use `data.azurerm_key_vault_secret` for lookups |
| Admin password input | **Secure** | `sensitive = true` variable, passed at runtime |
| **Terraform state secret exposure** | **Depends on configuration** | Verify no secrets in state after apply |

### 5.3 Correct Secret Handling

**Correct Flow:**
```
1. Terraform provisions Azure SQL (no password in state)
2. Terraform provisions Key Vault (empty)
3. Terraform provisions Entra identities
4. Generate secrets OUTSIDE Terraform
5. Insert secrets into Key Vault separately (CLI/Portal)
6. Terraform references Key Vault via data sources only
```

**Why:** `azurerm_key_vault_secret` resource stores the secret value in Terraform state, which is a security risk.

---

## 6. Standalone Certification Adapter

### 6.1 Location (NOT in app/adapters/)

```
sql-server-certification/
├── src/
│   ├── adapter.py
│   ├── config.py
│   └── authentication.py
├── tests/
│   ├── test_sql_login.py
│   ├── test_entra_password.py
│   ├── test_entra_service_principal.py
│   ├── test_managed_identity.py
│   ├── test_schema_discovery.py
│   └── test_validation.py
├── terraform/
│   └── main.tf
└── requirements.txt
```

### 6.2 Adapter Methods

```python
class SQLServerCertificationAdapter:
    """Standalone adapter - NOT in app/adapters/ until approved."""
    
    def connect_sql_login(self, host, database, username, password):
        pass
    
    def connect_entra_password(self, host, database, username, password):
        pass
    
    def connect_entra_service_principal(self, host, database, client_id, client_secret):
        pass
    
    def connect_managed_identity(self, host, database, client_id):
        pass
```

---

## 7. Test Data (10 Tables x 5 Rows)

| Table | Purpose | Relationships |
|-------|---------|---------------|
| customers | PK, text, row-count | - |
| accounts | FK, numeric balances | -customers |
| transactions | Numeric aggregation | -accounts |
| products | Reference data | - |
| orders | Parent/child, totals | -customers |
| order_items | FK, calculations | -orders, products |
| employee_records | Dates, nullable | - |
| branches | Geographic/reference | - |
| account_snapshots | Data drift | -accounts |
| customer_risk | Boolean, nullable | -customers |

---

## 8. Test Plan

### 8.1 Authentication Tests

| Test | Authentication | Expected |
|------|----------------|----------|
| SQL Login | username/password | Success |
| Entra Password | Entra user credentials | Success |
| Entra Service Principal | client_id/secret | Success |
| Managed Identity | Azure identity | Success |

### 8.2 Functional Tests

| Test | Description |
|------|-------------|
| Schema Discovery | List all 10 tables |
| Column Discovery | List all columns per table |
| Query Execution | SELECT, INSERT, UPDATE |
| Validation | Run existing validation rules |

---

## 9. Deliverables

| # | Deliverable | Phase |
|---|-------------|-------|
| 1 | Terraform certification environment | Step 1-2 |
| 2 | Key Vault + identities configured | Step 3-4 |
| 3 | Test DB + data seeded | Step 5 |
| 4 | Standalone Python adapter | Step 6 |
| 5 | Authentication test results | Step 7 |
| 6 | Functional test results | Step 8 |
| 7 | Certification report | Step 9 |

---

**End of Document**
