# 05_Master_and_Reference_Data.md

## Overview

This document identifies master data, reference data, lookup tables, configuration tables, and enumerations currently implemented in the MAP Nexus database.

---

## Master Data

Master data represents core business entities that are shared across the platform.

| Table | Schema | Purpose | Uniqueness |
|-------|--------|---------|------------|
| `tenants` | core | Multi-tenant organizations | `tenant_name` (unique per tenant) |
| `users` | platform | User accounts | `email` (globally unique) |
| `roles` | platform | System and custom roles | `name` (unique per tenant) |
| `permissions` | platform | Permission definitions | `name` (globally unique) |

### Usage

- **tenants**: Referenced by all tenant-scoped tables for multi-tenant isolation
- **users**: Referenced by all user-facing tables (tasks, notifications, workflows)
- **roles**: Referenced by `user_roles` and `role_permissions` for RBAC
- **permissions**: Referenced by `role_permissions` for fine-grained access control

---

## Reference Data

Reference data provides controlled vocabulary for status codes, severity levels, and categories.

### Reporting Dimensions

| Table | Schema | Purpose | Records |
|-------|--------|---------|---------|
| `dim_date` | reporting | Date dimension for time-based reporting | Date range |
| `dim_severity` | reporting | Severity level reference | 4 (CRITICAL, HIGH, MEDIUM, LOW) |
| `dim_status` | reporting | Status category reference | Multiple |

### dim_severity Values

| severity_code | severity_weight | severity_rank |
|---------------|-----------------|---------------|
| CRITICAL | 5 | 1 |
| HIGH | 3 | 2 |
| MEDIUM | 2 | 3 |
| LOW | 1 | 4 |

**Evidence:** `engine_backup.sql:1785-1790`

### dim_status Values

| status_code | status_category |
|-------------|-----------------|
| PASS | Success |
| FAIL | Failure |
| ERROR | Error |

**Evidence:** `engine_backup.sql:1821-1825`

---

## Lookup Tables

Lookup tables provide controlled vocabulary for system configuration.

### Validation Controls

| Table | Schema | Purpose | Records |
|-------|--------|---------|---------|
| `control_registry` | engine | Validation control definitions | 3 (C01-C03) |

**Control Registry Values:**

| control_id | control_name | severity_level |
|------------|--------------|----------------|
| C01 | Source-to-Target Record Completeness | HIGH |
| C02 | Financial Value Integrity & Reconciliation | CRITICAL |
| C03 | Referential Integrity & Relationship Preservation | HIGH |

**Evidence:** `sql/schema/01_engine_schema.sql:54-67`

### Validation Rules

| Table | Schema | Purpose | Records |
|-------|--------|---------|---------|
| `rule_registry` | engine | Validation rule definitions | Multiple |

**Rule Registry Values:**

| rule_id | control_id | rule_name |
|---------|------------|-----------|
| C01_ROWCOUNT | C01 | Row Count Match Validation |
| C02_BALANCE_RECON | C02 | Financial Aggregate Reconciliation |
| C03_REFERENTIAL | C03 | Foreign Key Relationship Preservation |

**Evidence:** `sql/schema/01_engine_schema.sql:69-95`

---

## Configuration Tables

Configuration tables store system settings and feature toggles.

### Platform Settings

| Table | Schema | Purpose | Structure |
|-------|--------|---------|-----------|
| `system_settings` | platform | Platform configuration key-value pairs | Category + Key → Value |

**Default Settings:**

| Category | Key | Value | Description |
|----------|-----|-------|-------------|
| general | platform_name | "MAP Nexus" | Platform display name |
| general | platform_version | "2.0.0" | Platform version |
| general | support_email | "support@mapnexus.com" | Support contact |
| general | max_upload_size_mb | 50 | Maximum file upload size |
| authentication | max_login_attempts | 5 | Max failed logins before lockout |
| authentication | lockout_duration_minutes | 30 | Account lockout duration |
| authentication | session_timeout_minutes | 60 | Session timeout |
| authentication | password_min_length | 8 | Minimum password length |
| authentication | require_email_verification | true | Email verification required |
| authentication | mfa_enabled | false | MFA enabled |
| notifications | email_enabled | true | Email notifications |
| notifications | in_app_enabled | true | In-app notifications |
| notifications | digest_enabled | false | Notification digest |
| integrations | slack_enabled | false | Slack integration |
| integrations | teams_enabled | false | Teams integration |

**Evidence:** `seed_platform_data.sql:106-121`

### Feature Flags

| Table | Schema | Purpose | Structure |
|-------|--------|---------|-----------|
| `feature_flags` | platform | Feature toggle definitions | Key → Enabled + Rollout % |

**Default Feature Flags:**

| name | key | enabled | rollout_percentage |
|------|-----|---------|-------------------|
| Workflow Engine | workflow_engine | TRUE | 100 |
| Task Management | task_management | TRUE | 100 |
| Calendar | calendar | TRUE | 100 |
| AI Copilot | ai_copilot | FALSE | 0 |
| Advanced Reporting | advanced_reporting | FALSE | 0 |
| Multi-tenant | multi_tenant | FALSE | 0 |

**Evidence:** `seed_platform_data.sql:127-133`

### Governance Configuration

| Table | Schema | Purpose | Structure |
|-------|--------|---------|-----------|
| `governance_config` | engine | Governance intelligence parameters | Row-based configuration |

**Default Governance Config:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| client_name | 'GLOBAL' | Client scope |
| environment | 'ALL' | Environment scope |
| rolling_window_size | 5 | Number of batches for rolling stats |
| anomaly_std_threshold | 2.0 | Standard deviation threshold |
| repeat_failure_threshold | 3 | Repeat failure count threshold |
| anomaly_block_threshold | 70 | Score threshold for auto-block |
| volatility_multiplier | 1.5 | Volatility adjustment factor |

**Evidence:** `engine_backup.sql:927-937`

---

## Enumerations

Enumerations are enforced via CHECK constraints in the database.

### Tenant Status

| Value | Source |
|-------|--------|
| `ACTIVE` | Default |
| `INACTIVE` | Manual |

**Evidence:** `engine_backup.sql:749`

### Project Type

| Value | Source |
|-------|--------|
| `MIGRATION` | Primary use case |
| `DATA_QUALITY` | Alternative use case |

**Evidence:** `engine_backup.sql:701`

### System Role

| Value | Source |
|-------|--------|
| `SOURCE` | Source database |
| `TARGET` | Target database |
| `ANALYTICS` | Analytics database |

**Evidence:** `engine_backup.sql:736`

### Database Type

| Value | Source |
|-------|--------|
| `POSTGRES` | PostgreSQL |
| `ORACLE` | Oracle Database |
| `SQLSERVER` | Microsoft SQL Server |
| `MYSQL` | MySQL |
| `SNOWFLAKE` | Snowflake |
| `DATABRICKS` | Databricks |

**Evidence:** `engine_backup.sql:735`

### User Status

| Value | Source |
|-------|--------|
| `active` | Active user |
| `inactive` | Inactive user |
| `suspended` | Suspended user |
| `pending` | Awaiting activation |
| `locked` | Locked due to failed attempts |

**Evidence:** `create_platform_schema.sql:22-23`

### Role Type

| Value | Source |
|-------|--------|
| `system` | System-defined role |
| `custom` | Custom role |
| `template` | Role template |

**Evidence:** `create_platform_schema.sql:79-80`

### Workflow Type

| Value | Source |
|-------|--------|
| `approval` | Approval workflow |
| `notification` | Notification workflow |
| `task` | Task workflow |
| `migration` | Migration workflow |
| `governance` | Governance workflow |
| `custom` | Custom workflow |

**Evidence:** `create_platform_schema.sql:143-144`

### Workflow Status

| Value | Source |
|-------|--------|
| `active` | Active workflow |
| `inactive` | Inactive workflow |
| `draft` | Draft workflow |
| `archived` | Archived workflow |

**Evidence:** `create_platform_schema.sql:145-146`

### Approval Status

| Value | Source |
|-------|--------|
| `pending` | Awaiting approval |
| `in_progress` | In progress |
| `approved` | Approved |
| `rejected` | Rejected |
| `cancelled` | Cancelled |

**Evidence:** `create_platform_schema.sql:239-240`

### Task Status

| Value | Source |
|-------|--------|
| `todo` | Not started |
| `in_progress` | In progress |
| `review` | Under review |
| `done` | Completed |
| `blocked` | Blocked |
| `cancelled` | Cancelled |

**Evidence:** `create_platform_schema.sql:278-279`

### Task Priority

| Value | Source |
|-------|--------|
| `critical` | Critical priority |
| `high` | High priority |
| `medium` | Medium priority |
| `low` | Low priority |

**Evidence:** `create_platform_schema.sql:280-281`

### Notification Severity

| Value | Source |
|-------|--------|
| `info` | Informational |
| `success` | Success |
| `warning` | Warning |
| `error` | Error |

**Evidence:** `create_platform_schema.sql:336-337`

### Security Event Types

| Value | Source |
|-------|--------|
| `login_success` | Successful login |
| `login_failure` | Failed login |
| `logout` | User logout |
| `password_change` | Password changed |
| `password_reset_request` | Password reset requested |
| `password_reset_complete` | Password reset completed |
| `mfa_enable` | MFA enabled |
| `mfa_disable` | MFA disabled |
| `mfa_challenge_success` | MFA challenge passed |
| `mfa_challenge_failure` | MFA challenge failed |
| `account_locked` | Account locked |
| `account_unlocked` | Account unlocked |
| `account_deactivated` | Account deactivated |
| `role_assigned` | Role assigned |
| `role_removed` | Role removed |
| `permission_granted` | Permission granted |
| `permission_revoked` | Permission revoked |
| `session_created` | Session created |
| `session_expired` | Session expired |
| `session_revoked` | Session revoked |
| `token_refreshed` | Token refreshed |
| `token_revoked` | Token revoked |
| `unauthorized_access_attempt` | Unauthorized access attempt |
| `rate_limit_exceeded` | Rate limit exceeded |
| `suspicious_activity` | Suspicious activity detected |
| `brute_force_detected` | Brute force detected |

**Evidence:** `create_audit_schema.sql:51-62`

---

**Version:** 2.1

**Status:** Current State Documentation
