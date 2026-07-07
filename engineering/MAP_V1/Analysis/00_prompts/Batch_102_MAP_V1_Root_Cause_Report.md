# Batch 102 — MAP V1 Root Cause Analysis Report

## MAP V1 Stability Investigation (Investigation Only)

**Project:** MAP V1 — Migration Assurance Platform
**Batch:** 102
**Version:** 1.0
**Status:** Complete
**Date:** 2026-07-07
**Branch:** `release/v4-cloud-ready`

---

# Executive Summary

MAP V1 exhibits **three distinct failure modes**, all originating from uncommitted working-tree changes on `release/v4-cloud-ready`. The codebase contains **89 modified files** with **809 deletions** and **518 insertions** against HEAD, plus extensive untracked files.

**The primary root cause is architectural**: the control execution path (`RuleAdapterControl`) unconditionally reports success regardless of underlying rule failures. This is compounded by two environment-variable-dependent security changes (`auth_service.py`, `execution_service.py`) that break authentication and database connectivity when required env vars are not configured, and a missing `FERNET_KEY` in the current `.env` file that prevents credential decryption.

**Confidence Level: High**

---

# Findings

## Finding 1: Control Execution Always Reports PASS (Architectural Defect)

**Severity:** HIGH
**Confidence:** HIGH

The active control execution chain has a structural disconnect that prevents any control from ever failing at the DAG level.

### Evidence

**File:** `app/controls/rule_adapter_control.py:29-30`
```python
executor.execute_rules()
return self.success(msg=f"Successfully executed rules for control {self.control_id}")
```

`RuleAdapterControl.execute()` unconditionally returns `self.success()` without inspecting whether `RuleExecutor.execute_rules()` had any failures.

**File:** `app/execution_engine.py:1892-1894`
```python
executor_ctrl.execute(control_id)   # return value discarded
return True                          # always True
```

`_execute_control_with_retry()` discards the return value of `executor_ctrl.execute()`, and always returns `True`.

**File:** `app/rule_executor.py:115`
```python
except Exception as _e:
    execution_status = "ERROR"
    delta = 0
    result = {"status": "ERROR", "error": str(_e)}
```

Rule exceptions are caught and logged to the database but never re-raised.

### Result

When a rule encounters `permission denied` or `All connection attempts failed`:
1. Exception is caught and logged as ERROR in `migration_control_execution`
2. `execute_rules()` completes normally
3. `RuleAdapterControl` returns SUCCESS
4. `_execute_control_with_retry` returns True
5. DAG marks control as PASSED

**This is the direct cause of the reported anomaly: `Permission denied → All connection attempts failed → CONTROL PASSED`**

### Note

A correctly-implemented version exists at `app/execution_engine.py:1327` (`_execute_control()`), which properly tracks a `control_failed` flag. However, this method is **never called** from the active path.

---

## Finding 2: Missing FERNET_KEY Prevents Credential Decryption

**Severity:** HIGH
**Confidence:** HIGH

### Evidence

**`.env` file** — does NOT contain `FERNET_KEY`.

**`.env_old` file** — contains `FERNET_KEY=5kfozW_NOasfNHfi3AyVYSf1pMwDwyB601RX7Lnbohc=`

**`.env.example` file** — does NOT document `FERNET_KEY` as required.

**File:** `app/api/core/security/encryption.py:7-10`
```python
key = os.getenv("FERNET_KEY")
if not key:
    raise ValueError("FERNET_KEY not set in environment")
self.cipher = Fernet(key)
```

**File:** `app/db/connection_resolver.py:351` — `_get_credentials()` requires `FERNET_KEY` to decrypt database credentials stored in `core.system_credentials`.

### Result

If `FERNET_KEY` is not set in the runtime environment:
- `EncryptionManager.__init__()` raises `ValueError`
- All credential decryption fails
- `ConnectionResolver._build_adapter()` cannot obtain decrypted passwords
- All source/target database connections fail with `All connection attempts failed`

The key exists only in `.env_old`, suggesting it was removed or the `.env` was regenerated without it.

---

## Finding 3: Dual EncryptionManager Classes — Inconsistent Key Handling

**Severity:** MEDIUM
**Confidence:** MEDIUM

### Evidence

**File:** `app/api/core/security/encryption.py:10`
```python
self.cipher = Fernet(key)  # key is str from os.getenv()
```

**File:** `app/api/core/encryption_manager.py:10`
```python
self.cipher = Fernet(key.encode())  # key.encode() converts str to bytes
```

Two separate `EncryptionManager` classes exist in different packages:
- `app.api.core.security.encryption` — used by `CredentialService`
- `app.api.core.encryption_manager` — used by `CredentialAdminService`

Both work because `Fernet()` accepts both `str` and `bytes`, but the inconsistency creates a maintenance trap and could break under library version changes.

---

## Finding 4: Environment-Dependent Security Changes Break Auth & Execution

**Severity:** HIGH
**Confidence:** HIGH

### Evidence

**File:** `app/services/auth_service.py` (uncommitted change)
- Replaced hardcoded `admin`/`admin` with `os.getenv("APP_ADMIN_USER")` / `os.getenv("APP_ADMIN_PASS")`
- Raises `RuntimeError` if either env var is missing

**File:** `app/services/execution_service.py` (uncommitted change)
- Replaced hardcoded DB credentials with `ENGINE_DB_*` env vars
- Raises `RuntimeError` if `ENGINE_DB_PASS` is not set

**Current `.env` values:**
```
APP_ADMIN_USER=admin
APP_ADMIN_PASS=admin
ENGINE_DB_PASS=dev123456
```

### Result

The `.env` file currently has the required values, so these changes are **not currently breaking**. However:
- These changes are **uncommitted** — they represent a divergence from the committed state
- If the `.env` file is regenerated or deployed without these vars, both authentication and execution break immediately
- The `FERNET_KEY` is still missing from `.env`, so even though auth works, database credential decryption fails

---

## Finding 5: JWT Library Conflict (Potential)

**Severity:** MEDIUM
**Confidence:** MEDIUM

### Evidence

**File:** `app/api/core/auth/jwt_handler.py`
```python
import jwt  # PyJWT library
```

**File:** `app/api/core/auth/dependencies.py`
```python
from jose import jwt  # python-jose library
```

**File:** `app/services/auth_service.py`
```python
from jose import jwt  # python-jose library
```

Token creation in `jwt_handler.py` uses PyJWT, while token decoding in `dependencies.py` and `auth_service.py` uses python-jose. These have different API surfaces. If library versions differ, tokens created by one may fail to decode by the other.

### Result

Intermittent "Invalid token" errors could occur depending on installed library versions. This is a latent defect — not currently manifesting but could surface under dependency changes.

---

## Finding 6: PostgresAdapter Thread-Safety Issue

**Severity:** MEDIUM
**Confidence:** MEDIUM

### Evidence

**File:** `app/db/adapters/postgres_adapter.py:15`
```python
_pools: Dict[str, SimpleConnectionPool] = {}  # class-level shared dict
```

The `_pools` dictionary is shared across all instances and threads but has no locking mechanism. Under concurrent access (e.g., `ThreadPoolExecutor` in `execution_engine.py`), pool creation/lookup could race, causing duplicate pools or key errors.

---

## Finding 7: 89 Uncommitted Files — Working Tree Instability

**Severity:** MEDIUM
**Confidence:** HIGH

### Evidence

`git status` shows:
- **89 modified files** (not staged)
- **809 deletions**, **518 insertions** (net: -291 lines)
- Multiple untracked directories (docs/reports/, research/, scripts/, etc.)
- 2 deleted files (docker evidence images)

Key modified files include:
- `app/execution_engine.py` — 507 lines changed
- `app/rule_executor.py` — 189 lines changed
- `app/db/adapters/postgres_adapter.py` — 38 lines changed
- `app/db/connection_resolver.py` — 66 lines changed
- `app/services/execution_service.py` — 20 lines changed
- `app/services/auth_service.py` — 14 lines changed

### Result

The working tree has extensive uncommitted changes that represent the difference between v3.1 stable baseline and current development. These changes include both safe refactorings and high-risk modifications. The uncommitted state means the repository cannot be cleanly reproduced from HEAD alone.

---

## Finding 8: Execution Engine Accumulated Legacy Code

**Severity:** LOW
**Confidence:** HIGH

### Evidence

**File:** `app/execution_engine.py` — 6+ legacy method variants:
- `_execute_control_legacy_20260501`
- `_execute_control_legacy_20260501_1`
- `_execute_control_legacy_20260501_2`
- `_execute_control_legacy_20260504_1`
- `_execute_control_legacy_20260505_4`
- `_execute_control_legacy_20260504_3`

These are dead code that bloats the file by ~1,500 lines. They hardcode `status="SUCCESS"` even when exceptions occur, which is confusing but not currently reachable.

---

## Finding 9: MappingValidator Tuple/Dict Mismatch

**Severity:** MEDIUM
**Confidence:** MEDIUM

### Evidence

**File:** `app/services/mapping_validator.py:54`
```python
mapping["source_system_id"] == source_system_id
```

`fetch_all()` from the database returns tuples, not dicts. This line will raise `TypeError` at runtime, preventing mapping validation from completing.

---

# Root Cause

## Primary Root Cause

**Architectural defect in the control execution path** — `RuleAdapterControl.execute()` unconditionally returns success, and `_execute_control_with_retry()` discards the return value. This means no rule failure (permission denied, connection error, etc.) can ever propagate to fail a control at the DAG level.

**Confidence: HIGH**

## Secondary Contributing Factors

1. **Missing `FERNET_KEY` in `.env`** — prevents credential decryption, causing all source/target database connections to fail with `All connection attempts failed`
2. **Dual `EncryptionManager` classes** — inconsistent key handling creates a maintenance trap
3. **JWT library conflict** — potential for intermittent token validation failures
4. **89 uncommitted files** — working tree state cannot be reproduced from HEAD alone
5. **Environment-dependent security changes** — auth and execution now require env vars that may not be configured in all environments

---

# Risk Assessment

| Risk Area | Level | Description |
|-----------|-------|-------------|
| **Production Risk** | HIGH | Controls always report PASS regardless of actual failures — false positives mask real issues |
| **Development Risk** | HIGH | Uncommitted changes span 89 files — any checkout/clone loses working state |
| **Data Integrity Risk** | MEDIUM | Permission denied errors are logged but not surfaced — data quality issues go undetected |
| **Security Risk** | MEDIUM | Hardcoded credentials in `.env` (`admin/admin`, `dev123456`) — development defaults in production |
| **Operational Risk** | HIGH | Missing `FERNET_KEY` breaks all credential-dependent operations |

---

# Recommended Recovery Plan

## Priority 1: Restore FERNET_KEY (Immediate)

Add the `FERNET_KEY` from `.env_old` back to `.env`:
```
FERNET_KEY=5kfozW_NOasfNHfi3AyVYSf1pMwDwyB601RX7Lnbohc=
```

This restores credential decryption and source/target database connectivity.

## Priority 2: Fix Control Execution Propagation (Critical)

Modify `app/controls/rule_adapter_control.py` to check `RuleExecutor` results and return failure when rules fail. Modify `app/execution_engine.py:_execute_control_with_retry()` to inspect the return value and propagate failures.

## Priority 3: Consolidate EncryptionManager (Important)

Remove duplicate `EncryptionManager` in `app/api/core/security/encryption.py` and ensure all credential operations use the single implementation in `app/api/core/encryption_manager.py`.

## Priority 4: Resolve JWT Library Conflict (Important)

Standardize on either PyJWT or python-jose across all auth files to prevent encode/decode incompatibilities.

## Priority 5: Commit or Stash Working Tree Changes (Operational)

Either commit the 89 modified files or stash them to restore a reproducible state from HEAD.

## Priority 6: Secure .env Defaults (Important)

Replace hardcoded `admin/admin` and `dev123456` credentials in `.env` with proper secrets. Add `FERNET_KEY` to `.env.example`.

---

# Recommended Order of Recovery

1. **Restore `FERNET_KEY` to `.env`** — unblocks all credential operations
2. **Commit or stash uncommitted changes** — restores reproducibility
3. **Fix `RuleAdapterControl` to propagate failures** — eliminates false PASS
4. **Consolidate `EncryptionManager`** — removes maintenance trap
5. **Standardize JWT library** — prevents intermittent auth failures
6. **Harden `.env` defaults** — removes security risk
7. **Clean up legacy execution engine methods** — reduces code bloat

---

# Validation

| Area | Status | Notes |
|------|--------|-------|
| Configuration integrity | PARTIAL | `.env` missing `FERNET_KEY`; `.env.example` incomplete |
| Credential integrity | DEGRADED | Cannot decrypt credentials without `FERNET_KEY` |
| Adapter integrity | INTACT | Postgres adapter changes are cosmetic (variable rename) |
| Execution engine integrity | DEFECTIVE | Controls always report PASS regardless of rule outcomes |
| Repository integrity | UNSTABLE | 89 uncommitted files; working tree diverged from HEAD |

---

# Success Criteria Met

- Root cause identified: **Yes** (architectural defect in control execution path)
- Evidence supports conclusion: **Yes** (code-level evidence from 4 parallel investigations)
- No source code modified: **Yes**
- No configuration altered: **Yes**
- No database changes made: **Yes**

---

**End of Batch 102 Investigation**
