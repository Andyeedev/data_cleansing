# 10 — Database Architecture

**Document:** MAP MVP Database Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Entity Overview

| Domain | Core Entities | Description |
|--------|---------------|-------------|
| Identity | Tenant, User, Role | Multi-tenant identity |
| Discovery | Subscription, Resource, Dependency | Azure resource inventory |
| Validation | Migration, ValidationRun, Check, Finding | Validation execution |
| Reporting | Dashboard, Report, Metric | Reporting data |
| Governance | Policy, Rule, Approval, Compliance | Governance framework |
| Audit | AuditLog, ActivityLog | Audit trail |

---

## 2. Core Entities

### Tenant
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| Name | NVARCHAR(100) | Tenant name |
| Domain | NVARCHAR(100) | Primary domain |
| Status | ENUM | Active, Suspended, Deleted |
| CreatedAt | DATETIME2 | Creation timestamp |
| UpdatedAt | DATETIME2 | Last update timestamp |

### User
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| TenantId | GUID | FK to Tenant |
| EntraId | NVARCHAR(100) | Entra ID object ID |
| Email | NVARCHAR(255) | Email address |
| DisplayName | NVARCHAR(100) | Display name |
| Role | ENUM | Admin, Editor, Viewer |
| Status | ENUM | Active, Inactive |
| CreatedAt | DATETIME2 | Creation timestamp |

### Subscription
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| TenantId | GUID | FK to Tenant |
| AzureSubscriptionId | NVARCHAR(100) | Azure subscription ID |
| Name | NVARCHAR(200) | Subscription name |
| Status | ENUM | Connected, Disconnected |
| LastScannedAt | DATETIME2 | Last scan timestamp |

### Resource
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| SubscriptionId | GUID | FK to Subscription |
| AzureResourceId | NVARCHAR(500) | Azure resource ID |
| Name | NVARCHAR(200) | Resource name |
| Type | NVARCHAR(100) | Resource type |
| Location | NVARCHAR(50) | Azure region |
| Status | ENUM | Active, Deleted |
| Metadata | NVARCHAR(MAX) | JSON metadata |
| DiscoveredAt | DATETIME2 | Discovery timestamp |

### Migration
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| TenantId | GUID | FK to Tenant |
| Name | NVARCHAR(200) | Migration name |
| Description | NVARCHAR(MAX) | Description |
| Status | ENUM | Planning, Validating, Migrating, Completed, Failed |
| SourceSubscriptionId | GUID | FK to Subscription |
| TargetSubscriptionId | GUID | FK to Subscription |
| CreatedAt | DATETIME2 | Creation timestamp |
| UpdatedAt | DATETIME2 | Last update timestamp |

### ValidationRun
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| MigrationId | GUID | FK to Migration |
| Status | ENUM | Running, Passed, Failed, Warning |
| StartedAt | DATETIME2 | Start timestamp |
| CompletedAt | DATETIME2 | Completion timestamp |
| HealthScore | DECIMAL(5,2) | Overall health score |

### Finding
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| ValidationRunId | GUID | FK to ValidationRun |
| CheckId | GUID | FK to Check |
| Severity | ENUM | Critical, High, Medium, Low, Info |
| Status | ENUM | Open, Acknowledged, Resolved |
| Title | NVARCHAR(200) | Finding title |
| Description | NVARCHAR(MAX) | Detailed description |
| Recommendation | NVARCHAR(MAX) | Recommended action |

### Policy
| Field | Type | Description |
|-------|------|-------------|
| Id | GUID | Primary key |
| TenantId | GUID | FK to Tenant |
| Name | NVARCHAR(200) | Policy name |
| Description | NVARCHAR(MAX) | Description |
| Rules | NVARCHAR(MAX) | JSON rules |
| Status | ENUM | Active, Inactive |
| CreatedAt | DATETIME2 | Creation timestamp |

### AuditLog
| Field | Type | Description |
|-------|------|-------------|
| Id | BIGINT | Primary key (identity) |
| TenantId | GUID | FK to Tenant |
| UserId | GUID | FK to User |
| Action | NVARCHAR(100) | Action performed |
| ResourceType | NVARCHAR(100) | Resource type |
| ResourceId | NVARCHAR(100) | Resource ID |
| Details | NVARCHAR(MAX) | JSON details |
| Timestamp | DATETIME2 | Action timestamp |
| IpAddress | NVARCHAR(45) | Client IP address |

---

## 3. Relationships

```
Tenant ─┬─< User
        ├─< Subscription ─< Resource
        ├─< Migration ─< ValidationRun ─< Finding
        ├─< Policy
        └─< AuditLog
```

---

## 4. Data Lifecycle

| Stage | Duration | Action |
|-------|----------|--------|
| Active | 0–90 days | Full access, real-time queries |
| Warm | 90–365 days | Read-only, archived |
| Cold | 365+ days | Blob storage archive |
| Deleted | Immediate | Soft delete (30 days), then purge |

---

## 5. Multi-Tenancy

| Strategy | Implementation |
|----------|----------------|
| Isolation | Schema-level (TenantId column) |
| Query filtering | Automatic via Entity Framework global filters |
| Data separation | TenantId on all tables |
| Cross-tenant | Prohibited (enforced at data layer) |

---

## 6. Encryption

| Layer | Method |
|-------|--------|
| At rest | Azure SQL TDE (Transparent Data Encryption) |
| In transit | TLS 1.2+ |
| Backup | Encrypted backups |
| Secrets | Azure Key Vault |

---

## 7. Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| User | IX_User_TenantId | TenantId | Tenant queries |
| User | IX_User_EntraId | EntraId | SSO lookup |
| Resource | IX_Resource_SubscriptionId | SubscriptionId | Subscription queries |
| ValidationRun | IX_ValidationRun_MigrationId | MigrationId | Migration history |
| Finding | IX_Finding_Status | Status | Open findings |
| AuditLog | IX_AuditLog_Timestamp | Timestamp | Time-based queries |

---

*End of Database Architecture*
