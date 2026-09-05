# 08_Audit_and_History_Model.md

## Overview

This document describes the implemented audit and history tracking mechanisms in the MAP Nexus platform.

---

## Audit Tables

### audit.audit_events

**Purpose:** General audit events for all system activities.

**Characteristics:**
- Append-only (immutable)
- UUID primary keys
- JSONB metadata for extensibility
- Indexed on timestamp, user_id, action, resource_type, resource_id

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | Event time |
| `user_id` | UUID | Actor |
| `user_email` | VARCHAR(255) | Actor email |
| `user_name` | VARCHAR(200) | Actor name |
| `session_id` | VARCHAR(255) | Session identifier |
| `action` | VARCHAR(100) | Action performed |
| `resource_type` | VARCHAR(100) | Resource type |
| `resource_id` | UUID | Resource identifier |
| `resource_name` | VARCHAR(200) | Resource name |
| `old_value` | JSONB | Previous state |
| `new_value` | JSONB | New state |
| `ip_address` | INET | Client IP |
| `user_agent` | TEXT | Client user agent |
| `request_id` | VARCHAR(255) | Request correlation ID |
| `status` | VARCHAR(20) | 'success', 'failure', 'error' |
| `error_message` | TEXT | Error details |
| `metadata` | JSONB | Additional metadata |

**Evidence:** `create_audit_schema.sql:13-34`

---

### audit.security_events

**Purpose:** Security-specific events (login, role changes, permission changes).

**Characteristics:**
- Append-only (immutable)
- 28 event types via CHECK constraint
- Risk scoring support
- Severity classification

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | Event time |
| `event_type` | VARCHAR(100) | Security event type |
| `user_id` | UUID | Actor |
| `user_email` | VARCHAR(255) | Actor email |
| `severity` | VARCHAR(20) | 'info', 'warning', 'critical' |
| `ip_address` | INET | Client IP |
| `user_agent` | TEXT | Client user agent |
| `request_id` | VARCHAR(255) | Request correlation ID |
| `details` | JSONB | Event details |
| `risk_score` | NUMERIC(5,2) | Risk assessment |
| `blocked` | BOOLEAN | Whether action was blocked |

**Event Types:**
- Authentication: `login_success`, `login_failure`, `logout`
- Password: `password_change`, `password_reset_request`, `password_reset_complete`
- MFA: `mfa_enable`, `mfa_disable`, `mfa_challenge_success`, `mfa_challenge_failure`
- Account: `account_locked`, `account_unlocked`, `account_deactivated`
- Authorization: `role_assigned`, `role_removed`, `permission_granted`, `permission_revoked`
- Session: `session_created`, `session_expired`, `session_revoked`
- Token: `token_refreshed`, `token_revoked`
- Security: `unauthorized_access_attempt`, `rate_limit_exceeded`, `suspicious_activity`, `brute_force_detected`

**Evidence:** `create_audit_schema.sql:47-74`

---

### audit.login_history

**Purpose:** User login attempt tracking.

**Characteristics:**
- Append-only (immutable)
- Geo-location support
- Session duration tracking

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `user_id` | UUID | User |
| `user_email` | VARCHAR(255) | User email |
| `status` | VARCHAR(20) | 'success', 'failure', 'locked', 'blocked' |
| `ip_address` | INET | Client IP |
| `user_agent` | TEXT | Client user agent |
| `geo_location` | JSONB | Geographic location |
| `failure_reason` | TEXT | Failure reason |
| `login_at` | TIMESTAMP WITH TIME ZONE | Login time |
| `session_duration_minutes` | INTEGER | Session duration |

**Evidence:** `create_audit_schema.sql:85-98`

---

### audit.api_logs

**Purpose:** API request/response logging.

**Characteristics:**
- Append-only (immutable)
- Full HTTP lifecycle capture
- Performance tracking (response_time_ms)

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | Request time |
| `request_id` | VARCHAR(255) | Request correlation ID |
| `method` | VARCHAR(10) | HTTP method |
| `path` | VARCHAR(500) | Request path |
| `query_params` | JSONB | Query parameters |
| `request_headers` | JSONB | Request headers |
| `request_body` | JSONB | Request body |
| `response_status` | INTEGER | HTTP status code |
| `response_body` | JSONB | Response body |
| `response_time_ms` | INTEGER | Response time |
| `user_id` | UUID | Authenticated user |
| `user_email` | VARCHAR(255) | User email |
| `ip_address` | INET | Client IP |
| `user_agent` | TEXT | Client user agent |
| `content_length` | INTEGER | Response size |
| `error_message` | TEXT | Error details |

**Evidence:** `create_audit_schema.sql:108-127`

---

### audit.configuration_history

**Purpose:** Configuration change tracking.

**Characteristics:**
- Append-only (immutable)
- Before/after value comparison
- Change reason tracking

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `timestamp` | TIMESTAMP WITH TIME ZONE | Change time |
| `user_id` | UUID | Actor |
| `user_email` | VARCHAR(255) | Actor email |
| `setting_category` | VARCHAR(100) | Setting category |
| `setting_key` | VARCHAR(200) | Setting key |
| `old_value` | JSONB | Previous value |
| `new_value` | JSONB | New value |
| `change_reason` | TEXT | Change reason |
| `ip_address` | INET | Client IP |

**Evidence:** `create_audit_schema.sql:139-151`

---

## History Tables

### platform.workflow_history

**Purpose:** Workflow audit trail.

**Characteristics:**
- Append-only
- Tracks all workflow actions
- Links to both definition and instance

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `workflow_definition_id` | UUID | FK → workflow_definitions |
| `workflow_instance_id` | UUID | FK → workflow_instances |
| `action` | VARCHAR(50) | Action performed |
| `performed_by` | UUID | FK → users |
| `details` | JSONB | Action details |
| `created_at` | TIMESTAMP WITH TIME ZONE | Action time |

**Evidence:** `workstream_05_compliance_fixes.sql:9-17`

---

## Execution Logs

### engine.migration_control_execution

**Purpose:** Individual control execution results.

**Characteristics:**
- Per-batch, per-control records
- Performance tracking (execution_time_seconds)
- Severity classification

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL | PK |
| `batch_id` | UUID | FK → migration_validation_batch |
| `control_id` | VARCHAR(20) | Control identifier |
| `rule_id` | VARCHAR(50) | Rule identifier |
| `entity_name` | VARCHAR(100) | Entity being validated |
| `execution_status` | VARCHAR(20) | 'PASS', 'FAIL', 'ERROR' |
| `delta_value` | NUMERIC | Difference between source/target |
| `execution_time_seconds` | NUMERIC | Execution duration |
| `created_at` | TIMESTAMP | Execution time |
| `severity_level` | VARCHAR(20) | 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW' |
| `mapping_id` | UUID | FK → dataset_mappings |

**Evidence:** `engine_backup.sql:1174-1186`

---

### engine.migration_control_exceptions

**Purpose:** Detailed exception records.

**Characteristics:**
- Root cause analysis support
- Failure scope classification

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL | PK |
| `batch_id` | UUID | FK → migration_validation_batch |
| `control_id` | VARCHAR(20) | Control identifier |
| `rule_id` | VARCHAR(50) | Rule identifier |
| `entity_name` | VARCHAR(100) | Entity being validated |
| `source_value` | TEXT | Source value |
| `target_value` | TEXT | Target value |
| `delta_value` | NUMERIC | Difference |
| `created_at` | TIMESTAMP | Exception time |
| `cause` | TEXT | Root cause |
| `failure_scope` | VARCHAR(20) | 'TABLE', 'COLUMN', 'ROW' |

**Evidence:** `engine_backup.sql:1131-1143`

---

### engine.migration_exception_register

**Purpose:** Exception register with primary key values for drill-down.

**Characteristics:**
- Primary key value tracking
- Variance calculation

| Column | Type | Notes |
|--------|------|-------|
| `exception_id` | UUID | PK |
| `batch_id` | UUID | FK → migration_validation_batch |
| `control_id` | VARCHAR(10) | Control identifier |
| `rule_id` | VARCHAR(20) | Rule identifier |
| `entity_name` | VARCHAR(100) | Entity being validated |
| `primary_key_value` | TEXT | PK of failing record |
| `source_value` | TEXT | Source value |
| `target_value` | TEXT | Target value |
| `variance_value` | NUMERIC | Variance |
| `created_timestamp` | TIMESTAMP | Exception time |

**Evidence:** `engine_backup.sql:1275-1286`

---

### engine.rule_anomaly_history

**Purpose:** Historical anomaly records.

**Characteristics:**
- Anomaly type classification
- Score tracking over time

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL | PK |
| `dataset_name` | VARCHAR(255) | Dataset name |
| `rule_code` | VARCHAR(20) | Rule code |
| `anomaly_score` | NUMERIC | Anomaly score |
| `anomaly_type` | VARCHAR(50) | Anomaly classification |
| `created_at` | TIMESTAMP | Record time |

**Evidence:** `engine_backup.sql:1370-1377`

---

### engine.rule_execution_statistics

**Purpose:** Rule execution performance tracking.

**Characteristics:**
- Performance metrics
- Row count tracking

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL | PK |
| `batch_id` | UUID | FK → migration_validation_batch |
| `rule_code` | VARCHAR(20) | Rule code |
| `dataset_name` | VARCHAR(255) | Dataset name |
| `execution_time_ms` | INTEGER | Execution time |
| `rows_checked` | BIGINT | Rows checked |
| `rows_failed` | BIGINT | Rows failed |
| `created_at` | TIMESTAMP | Record time |

**Evidence:** `engine_backup.sql:1408-1417`

---

## Retention

**Current Implementation:**
- No explicit retention policies implemented
- All audit and history tables are append-only
- No automated purge mechanisms
- Retention is managed externally (database backups, manual cleanup)

**Not Implemented:**
- Automated data retention
- Archive to cold storage
- Compliance-driven retention policies

---

## Audit Middleware

### Implementation

**File:** `app/api/core/middleware/audit_middleware.py`

**Behavior:**
- Logs every API request to `audit.api_logs`
- Captures request/response details
- Correlates with user session
- Records performance metrics

**Evidence:** `app/api/core/middleware/audit_middleware.py`

---

**Version:** 2.1

**Status:** Current State Documentation
