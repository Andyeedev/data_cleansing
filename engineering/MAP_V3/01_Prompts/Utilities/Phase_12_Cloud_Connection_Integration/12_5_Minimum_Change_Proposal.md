# Phase 12 — Minimum Change Proposal

## What Needs to Change (and What Doesn't)

**Phase:** 12  
**Status:** Proposal  
**Date:** 2026-08-08

---

## 1. Expected Reusable (Subject to Verification)

| Component | Expected Reuse | Verification Needed |
|-----------|----------------|---------------------|
| **PostgresAdapter** | Expected reusable for Azure PostgreSQL | Azure connectivity/auth/SSL to be verified |
| **SQLServerAdapter** | Expected reusable for Azure SQL | Azure connectivity/auth/networking to be verified |
| **Connection Factory** | Expected reusable | Verify actual database-type routing |
| **Adapter Registry** | Expected reusable | Verify adapter selection logic |
| **System Registry Table** | Expected reusable | Verify Azure connection storage |
| **Validation Engine** | Expected reusable | Verify against Azure databases |
| **Discovery Service** | Expected reusable | Verify schema discovery on Azure |
| **Frontend UI** | Expected reusable | Verify Azure connection registration flow |

---

## 2. NEW Components Required

| Component | Type | Purpose |
|-----------|------|---------|
| Terraform/Scripts | Infrastructure | Provision Azure resources |
| SQL baseline scripts | Data | Create 10 tables × 5 rows |
| SQL scenario scripts | Data | 10 migration test scenarios |
| Reset scripts | Operations | Reset to baseline |
| Environment config | Security | Store Azure credentials |

---

## 3. Optional Changes

| Component | Change | Reason |
|-----------|--------|--------|
| Frontend dropdown | Add `azure_sql` option | Already has `azure_postgres` |
| Connection Factory | Add `azure_postgres`, `azure_sql` routing | May use existing types |

---

## 4. What We Will NOT Do (Subject to Verification)

| Action | Reason |
|--------|--------|
| Create new adapters (initially) | Existing ones expected reusable; verify first |
| Modify validation engine (initially) | Expected database-agnostic; verify first |
| Create new UI pages (initially) | Existing pages expected reusable; verify first |
| Add new database tables (initially) | Existing tables expected reusable; verify first |
| Store secrets in Git | Use environment variables or existing secret-reference mechanism |

---

## 5. Summary

| Category | Count | Note |
|----------|-------|------|
| Existing components identified for reuse | 15+ | Final reuse subject to verification |
| New components to create | 5 | Infrastructure + test data |
| Potential modifications | TBD | Following verification |

---

**End of Document**
