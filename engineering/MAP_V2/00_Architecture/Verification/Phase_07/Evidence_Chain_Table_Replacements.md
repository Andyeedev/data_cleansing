# EVIDENCE CHAIN: Table Reference Analysis
## Phase 07 Runtime Lineage Audit - Architectural Investigation

**Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No recommendations implemented

---

## Executive Summary

**Critical Finding:** The table names `engine.systems`, `engine.controls`, `engine.audit_log`, `engine.approvals`, and `engine.exceptions` have **NEVER existed** in any commit, branch, or file in this repository's history. These are **incorrect references**, not historical names.

**Secondary Finding:** The `engine_v14` schema exists in the database as a legacy v1.4 schema, but no Python code references it. The Python code exclusively uses the `engine` schema.

**Tertiary Finding:** Three tables referenced in SQL installation files (`engine.migration_control_decisions`, `engine.migration_risk_scores`, `engine.migration_batch_lifecycle`) were **never created** in the database.

---

## 1. engine.systems

### 1.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.systems" | **Zero commits found** |
| SQL schema files containing "engine.systems" | **Zero files found** |
| CREATE TABLE statements for "engine.systems" | **None found** |
| Python code referencing "engine.systems" | Only in `dashboard_repository.py` (the incorrect reference) |

**Conclusion:** `engine.systems` is an **incorrect reference**. It was never a valid table name in this codebase.

### 1.2 What Actually Exists

| Schema | Table Name | Status | Purpose |
|--------|------------|--------|---------|
| `engine_v14` | `systems` | EXISTS in DB | Legacy v1.4 system registry (not used by Python code) |
| `core` | `system_registry` | EXISTS in DB | Current system registry (used by `connection_resolver.py`) |

### 1.3 Runtime Evidence

**Actual runtime usage** (from `app/db/connection_resolver.py:109`):
```python
SELECT system_id, system_role, database_type, connection_config, credential_id, is_active, schema_name
FROM core.system_registry WHERE project_id = %s
```

**Dashboard repository reference** (from `app/repositories/dashboard_repository.py:10`):
```python
query = "SELECT COUNT(*) FROM engine.systems"
```

**Analysis:** The execution engine uses `core.system_registry` to resolve connections. The dashboard repository incorrectly references `engine.systems`. The `engine_v14.systems` table exists but is never used by any Python code.

### 1.4 Confidence Level

**HIGH - This is an incorrect reference, not a historical name.**

---

## 2. engine.controls

### 2.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.controls" | **Zero commits found** |
| SQL schema files containing "engine.controls" | **Zero files found** |
| CREATE TABLE statements for "engine.controls" | **None found** |
| Python code referencing "engine.controls" | Only in `dashboard_repository.py` (the incorrect reference) |

**Conclusion:** `engine.controls` is an **incorrect reference**. It was never a valid table name in this codebase.

### 2.2 What Actually Exists

| Schema | Table Name | Status | Purpose |
|--------|------------|--------|---------|
| `engine` | `control_registry` | EXISTS in DB | Control definitions (used by `execution_engine.py:814`) |
| `engine_v14` | `control_executions` | EXISTS in DB | Legacy v1.4 control executions (not used by Python code) |

### 2.3 Runtime Evidence

**Actual runtime usage** (from `app/execution_engine.py:814`):
```python
SELECT control_id FROM engine.control_registry WHERE enabled_flag = TRUE ORDER BY severity_level DESC, control_id
```

**Dashboard repository reference** (from `app/repositories/dashboard_repository.py:27`):
```python
query = "SELECT COUNT(*) FROM engine.controls"
```

**Analysis:** The execution engine uses `engine.control_registry` to load enabled controls. The dashboard repository incorrectly references `engine.controls`. The `engine_v14.control_executions` table exists but is never used by any Python code.

### 2.4 Confidence Level

**HIGH - This is an incorrect reference, not a historical name.**

---

## 3. engine.audit_log

### 3.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.audit_log" | **Zero commits found** |
| SQL schema files containing "engine.audit_log" | **Zero files found** |
| CREATE TABLE statements for "engine.audit_log" | **None found** |
| Python code referencing "engine.audit_log" | In `dashboard_repository.py` and `governance_repository.py` (incorrect references) |

**Conclusion:** `engine.audit_log` is an **incorrect reference**. It was never a valid table name in this codebase.

### 3.2 What Actually Exists

| Schema | Table Name | Status | Purpose |
|--------|------------|--------|---------|
| `audit` | `audit_events` | EXISTS in DB | Platform-level audit logging (HTTP, auth, system events) |
| `audit` | `api_logs` | EXISTS in DB | HTTP request/response logging |
| `audit` | `security_events` | EXISTS in DB | Security event tracking |
| `audit` | `login_history` | EXISTS in DB | Authentication logs |
| `audit` | `configuration_history` | EXISTS in DB | Config change tracking |

### 3.3 Architectural Analysis: audit.audit_events vs engine.audit_log

**`audit.audit_events` schema** (from `create_audit_schema.sql`):
```sql
CREATE TABLE audit.audit_events (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    user_id UUID,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    status VARCHAR(20) DEFAULT 'success',
    metadata JSONB DEFAULT '{}',
    ...
);
```

**Intended `engine.audit_log` query** (from `governance_repository.py:10-28`):
```sql
SELECT id, action, entity_type, entity_id, user_email, timestamp, details
FROM engine.audit_log
WHERE 1=1
[AND entity_type = %s]
ORDER BY timestamp DESC LIMIT %s
```

**Column mapping:**
| Required | audit_events | Match |
|----------|--------------|-------|
| id | id | YES (UUID) |
| action | action | YES (VARCHAR) |
| entity_type | resource_type | SEMANTIC (different name) |
| entity_id | resource_id | SEMANTIC (different name) |
| user_email | user_email | YES (VARCHAR) |
| timestamp | timestamp | YES (TIMESTAMPTZ) |
| details | metadata | SEMANTIC (JSONB) |

### 3.4 Critical Finding: No Python Code References audit.audit_events

```
grep "audit_events" app/ → Zero results
```

The `audit.audit_events` table exists but is **never used by any Python code**. It was created as part of the MAP V2 platform architecture but has no runtime consumers.

### 3.5 Architectural Equivalence Assessment

**Are they architecturally equivalent?**

**NO.** They serve different purposes:

| Aspect | audit.audit_events | engine.audit_log (intended) |
|--------|-------------------|----------------------------|
| **Schema** | `audit` (platform-owned) | `engine` (migration-owned) |
| **Purpose** | Platform-level audit (HTTP, auth) | Business-level audit (entity changes) |
| **Ownership** | Platform team | Migration engine team |
| **Write path** | Platform middleware | Migration engine repositories |
| **Read path** | None (no Python consumers) | Dashboard/Governance repositories |

**The `engine.audit_log` table was likely intended to be created but never was.** The repositories that reference it were written against a planned schema that was never implemented.

### 3.6 Confidence Level

**HIGH - These are NOT architecturally equivalent. `engine.audit_log` is an unimplemented design.**

---

## 4. engine.approvals

### 4.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.approvals" | **Zero commits found** |
| SQL schema files containing "engine.approvals" | **Zero files found** |
| CREATE TABLE statements for "engine.approvals" | **None found** |
| Python code referencing "engine.approvals" | Only in `governance_repository.py` (the incorrect reference) |

**Conclusion:** `engine.approvals` is an **incorrect reference**. It was never a valid table name in this codebase.

### 4.2 What Actually Exists

| Schema | Table Name | Status | Purpose |
|--------|------------|--------|---------|
| `engine` | `migration_control_decisions` | **NOT IN DB** (defined in SQL but never created) | Human decisions on controls |
| `platform` | `approval_requests` | EXISTS in DB | Platform-level approval workflows |
| `platform` | `approval_step_instances` | EXISTS in DB | Approval step tracking |

### 4.3 Critical Finding: Governance Tables Never Installed

The file `app/installer/install_governance_tables.sql` defines:
```sql
CREATE TABLE engine.migration_control_decisions (...)
CREATE TABLE engine.migration_risk_scores (...)
CREATE TABLE engine.tenants (...)
```

**But these tables were NEVER created in the database.**

### 4.4 Runtime Evidence

**Governance decision engine** (from `app/governance/decision_engine.py:14`):
```python
INSERT INTO engine.migration_control_decisions (tenant_id, batch_id, control_id, entity_name, decision, decision_reason, decided_by) VALUES (...)
```

**But `decision_engine.py` is NEVER called from the execution pipeline.** No Python code imports or calls this module.

### 4.5 Confidence Level

**HIGH - `engine.approvals` is an incorrect reference to an unimplemented governance feature.**

---

## 5. engine.exceptions

### 5.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.exceptions" | **Zero commits found** |
| SQL schema files containing "engine.exceptions" | **Zero files found** |
| CREATE TABLE statements for "engine.exceptions" | **None found** |
| Python code referencing "engine.exceptions" | Only in `governance_repository.py` (the incorrect reference) |

**Conclusion:** `engine.exceptions` is an **incorrect reference**. It was never a valid table name in this codebase.

### 5.2 What Actually Exists

| Schema | Table Name | Status | Purpose |
|--------|------------|--------|---------|
| `engine` | `migration_control_exceptions` | EXISTS in DB | Control execution failures (used by `rule_executor.py:412`) |
| `engine` | `migration_exception_register` | EXISTS in DB | Exception register (has bug: missing schema prefix in `audit_export.py:9`) |

### 5.3 Runtime Evidence

**Actual runtime usage** (from `app/rule_executor.py:412`):
```python
INSERT INTO engine.migration_control_exceptions (batch_id, control_id, rule_id, entity_name, source_value, target_value, delta_value) VALUES (...)
```

**Governance repository reference** (from `app/repositories/governance_repository.py:46-58`):
```python
SELECT id, entity_type, entity_id, reason, status, requested_by, created_at
FROM engine.exceptions
WHERE status = 'OPEN'
```

### 5.4 Semantic Mismatch

| Aspect | migration_control_exceptions | engine.exceptions (intended) |
|--------|------------------------------|------------------------------|
| **Purpose** | Control execution failures | Governance exception requests |
| **Write path** | `rule_executor.py` (automatic) | Governance workflow (human-initiated) |
| **Status field** | `failure_scope` (CRITICAL/HIGH/MEDIUM/LOW) | `status` (OPEN/CLOSED) |
| **Requester** | System-generated | Human-requested |

**These are different concepts.** `migration_control_exceptions` records automatic control failures. The intended `engine.exceptions` would record human-initiated governance exception requests.

### 5.5 Confidence Level

**HIGH - `engine.exceptions` is an incorrect reference to an unimplemented governance feature.**

---

## 6. engine.migration_batch_lifecycle

### 6.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.migration_batch_lifecycle" | **Zero commits found** |
| SQL schema files containing "engine.migration_batch_lifecycle" | **Zero files found** |
| CREATE TABLE statements for "engine.migration_batch_lifecycle" | **None found** |
| Python code referencing "engine.migration_batch_lifecycle" | In `execution_control_repository.py` (SELECT + INSERT) |

**Conclusion:** `engine.migration_batch_lifecycle` is an **unimplemented table**. The code references it but it was never created.

### 6.2 Runtime Evidence

**SELECT query** (from `app/repositories/execution_control_repository.py:27-38`):
```python
SELECT id, batch_id, event_type, event_timestamp, details
FROM engine.migration_batch_lifecycle
WHERE batch_id = %s
ORDER BY event_timestamp ASC
```

**INSERT query** (from `app/repositories/execution_control_repository.py:41-46`):
```python
INSERT INTO engine.migration_batch_lifecycle (batch_id, event_type, details)
VALUES (%s, %s, %s)
```

**Called from** (from `app/services/execution_control_service.py`):
- `cancel_execution()` → `insert_lifecycle_event(batch_id, 'CANCELLED')`
- `pause_execution()` → `insert_lifecycle_event(batch_id, 'PAUSED')`
- `resume_execution()` → `insert_lifecycle_event(batch_id, 'RESUMED')`
- `retry_execution()` → `insert_lifecycle_event(batch_id, 'RETRY')`

### 6.3 Confidence Level

**HIGH - This is an unimplemented table that needs to be created.**

---

## 7. engine.migration_risk_scores

### 7.1 Historical Investigation

| Investigation | Result |
|---------------|--------|
| Git log search for "engine.migration_risk_scores" | **Zero commits found** |
| SQL schema files containing "engine.migration_risk_scores" | Found in `install_governance_tables.sql` |
| CREATE TABLE statements for "engine.migration_risk_scores" | **Defined but never executed** |
| Python code referencing "engine.migration_risk_scores" | In `validation_report_repository.py` (SELECT only) |

**Conclusion:** `engine.migration_risk_scores` is **defined in SQL but never created** in the database.

### 7.2 SQL Definition (Never Executed)

From `app/installer/install_governance_tables.sql`:
```sql
CREATE TABLE engine.migration_risk_scores (
    risk_id SERIAL PRIMARY KEY,
    tenant_id UUID,
    batch_id UUID,
    risk_score NUMERIC,
    risk_level VARCHAR(20)
);
```

### 7.3 Runtime Evidence

**SELECT query** (from `app/repositories/validation_report_repository.py:55-67`):
```python
SELECT batch_id, risk_score, risk_level, calculated_timestamp
FROM engine.migration_risk_scores
WHERE batch_id = %s
ORDER BY calculated_timestamp DESC
LIMIT 1
```

**Service fallback** (from `app/services/validation_report_service.py:64-85`):
```python
def get_risk_score(self, batch_id: str):
    risk = self.repository.get_risk_score(batch_id)
    if not risk:
        # Falls back to ScoringEngine calculation
        engine_db = get_db_connection()
        scoring_engine = ScoringEngine(engine_db, batch_id)
        score = scoring_engine.calculate_overall()
        return {"batch_id": batch_id, "risk_score": score, "risk_level": risk_level, "calculated_at": None}
```

### 7.4 Confidence Level

**HIGH - This is an unimplemented table that needs to be created.**

---

## Summary: Evidence-Based Findings

| Table Reference | Status | Evidence |
|-----------------|--------|----------|
| `engine.systems` | **INCORRECT REFERENCE** | Never existed. `engine_v14.systems` exists (legacy). `core.system_registry` is the current table. |
| `engine.controls` | **INCORRECT REFERENCE** | Never existed. `engine.control_registry` is the current table. |
| `engine.audit_log` | **INCORRECT REFERENCE** | Never existed. `audit.audit_events` exists but serves different purpose (platform vs business audit). |
| `engine.approvals` | **INCORRECT REFERENCE** | Never existed. Governance tables were never installed. |
| `engine.exceptions` | **INCORRECT REFERENCE** | Never existed. `engine.migration_control_exceptions` exists but serves different purpose. |
| `engine.migration_batch_lifecycle` | **UNIMPLEMENTED** | Code references it but table was never created. |
| `engine.migration_risk_scores` | **UNIMPLEMENTED** | Defined in SQL but never executed. |

---

## Root Cause Analysis

### Why do these incorrect references exist?

1. **Schema drift:** The repositories were likely written against a planned schema that was never implemented
2. **Missing governance implementation:** The governance tables (`migration_control_decisions`, `migration_risk_scores`) were designed but never installed
3. **Silent error handling:** The service layer catches exceptions and returns empty/zero values, masking the errors from API consumers
4. **No runtime validation:** The SQL queries are only executed when endpoints are called, not during startup or testing

### Why does `audit.audit_events` exist but is never used?

The `audit.audit_events` table is part of the MAP V2 platform architecture (created by `create_audit_schema.sql`). It's designed for platform-level audit logging (HTTP requests, user authentication, system events). However:
- No Python code writes to it
- No Python code reads from it
- It appears to be infrastructure that was set up but never integrated

### Why were governance tables never installed?

The `install_governance_tables.sql` file exists but was never executed against the database. This suggests:
- The governance feature was planned but not completed
- The repositories that reference governance tables were written against the planned schema
- The execution pipeline doesn't call the governance modules

---

## Recommendations (Evidence-Based)

### For High-Confidence Items (Incorrect References):

1. **`engine.systems`** → Fix to use `core.system_registry` (with proper COUNT query)
2. **`engine.controls`** → Fix to use `engine.control_registry` (with proper COUNT query)
3. **`engine.audit_log`** → Either:
   - Create `engine.audit_log` table (if business-level audit is needed), OR
   - Update repositories to use `audit.audit_events` (with column mapping)
4. **`engine.approvals`** → Either:
   - Install governance tables (`migration_control_decisions`), OR
   - Update repositories to use `platform.approval_requests` (with semantic mapping)
5. **`engine.exceptions`** → Either:
   - Update repositories to use `engine.migration_control_exceptions` (different semantics), OR
   - Create `engine.exceptions` table (if governance exceptions are needed)

### For Unimplemented Tables:

6. **`engine.migration_batch_lifecycle`** → Create table (defined in code but never created)
7. **`engine.migration_risk_scores`** → Execute `install_governance_tables.sql` (defined but never executed)

---

## Evidence Artifacts

**Files Generated:**
- `engineering/MAP_V2/00_Architecture/Verification/Phase_07/Evidence_Chain_Table_Replacements.md` - This document

**Database Queries Executed:**
- Table existence checks across all schemas
- Schema definition verification
- Git history search (zero results for all incorrect references)
- Runtime code analysis (execution_engine.py, rule_executor.py, decision_engine.py)

---

**Document Generated:** 2026-07-24
**Status:** EVIDENCE ONLY - No code changes recommended until architectural decisions are made
