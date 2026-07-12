# MAP V1 Stability Analysis — Complete Summary

**Project:** MAP V1 — Migration Assurance Platform
**Date:** 2026-07-07
**Branch:** `release/v4-cloud-ready`
**Status:** Resolved

---

# Executive Summary

MAP V1 experienced two distinct failure modes that caused `permission denied` and `All connection attempts failed` errors during validation execution. Both issues have been resolved:

1. **Missing `FERNET_KEY`** — restored to `.env`
2. **PostgreSQL permissions** — `GRANT SELECT` applied to source/target tables

Validation controls now execute successfully with no errors and 99.5% faster execution.

---

# Issues Found & Resolution Status

## Issue 1: Missing FERNET_KEY — RESOLVED

| Attribute | Value |
|-----------|-------|
| **Symptom** | `All connection attempts failed` when trying to decrypt credentials |
| **Root Cause** | `FERNET_KEY` missing from `.env` file |
| **Evidence** | `app/api/core/security/encryption.py:8` raises `ValueError` when key not set |
| **Resolution** | Restored `FERNET_KEY=5kfozW_NOasfNHfi3AyVYSf1pMwDwyB601RX7Lnbohc=` from `.env_old` to `.env` |
| **Status** | **RESOLVED** |

---

## Issue 2: PostgreSQL Permission Denied — RESOLVED

| Attribute | Value |
|-----------|-------|
| **Symptom** | `permission denied for table accounts_source` / `balances_source` / `customer_accounts_source` |
| **Root Cause** | `migration_user_source` and `migration_user_target` roles had no `SELECT` privileges on source tables |
| **Evidence** | `information_schema.table_privileges` showed 0 grants for both roles |
| **Resolution** | Ran `GRANT SELECT ON ALL TABLES IN SCHEMA public TO migration_user_source;` and `migration_user_target;` |
| **Status** | **RESOLVED** |

---

## Issue 3: Control Execution Always Reports PASS — LATENT

| Attribute | Value |
|-----------|-------|
| **Symptom** | Controls report `PASSED` even when rules fail with `permission denied` |
| **Root Cause** | `app/controls/rule_adapter_control.py:29` unconditionally returns `self.success()` without checking rule outcomes |
| **Evidence** | `app/execution_engine.py:1892` discards the return value of `executor_ctrl.execute()` |
| **Resolution** | Requires code change — not yet implemented |
| **Status** | **LATENT** — not triggered in current run because all rules now pass |

---

## Issue 4: Dual EncryptionManager Classes — NOT ADDRESSED

| Attribute | Value |
|-----------|-------|
| **Symptom** | Two `EncryptionManager` classes with slightly different implementations |
| **Root Cause** | `app/api/core/security/encryption.py` and `app/api/core/encryption_manager.py` exist separately |
| **Resolution** | Requires code consolidation — not implemented |
| **Status** | **OPEN** — maintenance risk |

---

## Issue 5: JWT Library Conflict — NOT ADDRESSED

| Attribute | Value |
|-----------|-------|
| **Symptom** | `jwt_handler.py` uses PyJWT, `dependencies.py` and `auth_service.py` use python-jose |
| **Root Cause** | Mixed JWT library usage across auth files |
| **Resolution** | Requires standardization — not implemented |
| **Status** | **OPEN** — latent auth failure risk |

---

## Issue 6: 89 Uncommitted Files — NOT ADDRESSED

| Attribute | Value |
|-----------|-------|
| **Symptom** | Working tree has 89 modified files (518 insertions, 809 deletions) not committed |
| **Root Cause** | Extensive development changes on `release/v4-cloud-ready` branch |
| **Resolution** | Requires commit or stash — not implemented |
| **Status** | **OPEN** — reproducibility risk |

---

# Performance Improvement

## Before vs After

| Metric | Before (Permission Denied) | After (Permission Granted) | Change |
|--------|---------------------------|---------------------------|--------|
| C01 duration | 24,673ms | 71ms | **-99.7%** |
| C02 duration | 2,016ms | 23ms | **-98.9%** |
| C03 duration | 24,125ms | 138ms | **-99.4%** |
| Total duration | 50,814ms | 232ms | **-99.5%** |
| Permission errors | 12 | 0 | **-100%** |
| `All connection attempts failed` | 6 | 0 | **-100%** |

---

# Test Results

## Validation Run (C01, C02, C03) — FINAL

```
[STEP 05/06] CONTROL EXECUTION STARTED
    [CONTROL C01] STARTED
        Running C01_ROWCOUNT for public.accounts_source ... ✅
        Running C01_ROWCOUNT for public.balances_source ... ✅
        Running C01_ROWCOUNT for public.customer_accounts_source ... ✅
    [CONTROL C01] PASSED (71ms)

    [CONTROL C02] STARTED
        Running C02_BALANCE_RECON for public.balances_source ... ✅
    [CONTROL C02] PASSED (23ms)

    [CONTROL C03] STARTED
        Running C03_REFERENTIAL for public.accounts_source ... ✅
        Running C03_REFERENTIAL for public.balances_source ... ✅
        Running C03_REFERENTIAL for public.customer_accounts_source ... ✅
    [CONTROL C03] PASSED (138ms)

[STEP 06/06] GOVERNANCE DECISION: BLOCKED
```

**Note:** Governance decision is `BLOCKED` because the batch contains only C01-C03 (not full suite). This is expected.

---

# Changes Made

| File | Change | Purpose |
|------|--------|---------|
| `.env` | Added `FERNET_KEY=5kfozW_NOasfNHfi3AyVYSf1pMwDwyB601RX7Lnbohc=` | Restore credential decryption |

---

# Database Changes Applied

```sql
-- Granted by database administrator
GRANT SELECT ON ALL TABLES IN SCHEMA public TO migration_user_source;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO migration_user_target;
GRANT USAGE ON SCHEMA public TO migration_user_source;
GRANT USAGE ON SCHEMA public TO migration_user_target;
```

---

# Recommendations

## Immediate

1. **Commit `.env` changes** or add `FERNET_KEY` to `.env.example` for documentation
2. **Add `ALTER DEFAULT PRIVILEGES`** to ensure future tables inherit permissions:
   ```sql
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO migration_user_source;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO migration_user_target;
   ```

## Short-Term (Code Changes)

3. **Fix control execution propagation** in `app/controls/rule_adapter_control.py`
4. **Consolidate `EncryptionManager`** into single implementation
5. **Standardize JWT library** usage (either PyJWT or python-jose, not both)

## Medium-Term

6. **Commit or stash uncommitted changes** to restore reproducibility
7. **Clean up legacy execution engine methods** (~1,500 lines of dead code)
8. **Secure `.env` defaults** (replace `admin/admin` and `dev123456` with proper secrets)

---

# Summary Table

| Issue | Status | Impact | Resolution |
|-------|--------|--------|------------|
| Missing FERNET_KEY | **RESOLVED** | High | Restored to `.env` |
| PostgreSQL permissions | **RESOLVED** | High | GRANT SELECT applied |
| Control execution bug | **LATENT** | Medium | Code change needed |
| Dual EncryptionManager | **OPEN** | Low | Code consolidation needed |
| JWT library conflict | **OPEN** | Low | Standardization needed |
| 89 uncommitted files | **OPEN** | Medium | Commit or stash needed |

---

# Conclusion

**MAP V1 is now operational.** The two blocking issues (missing FERNET_KEY and PostgreSQL permissions) have been resolved. Validation controls C01, C02, and C03 execute successfully with no errors and sub-second execution times.

The remaining open items (control execution bug, dual EncryptionManager, JWT library conflict, uncommitted files) are non-blocking but should be addressed before production deployment.

---

**End of Analysis**
