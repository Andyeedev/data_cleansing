# Database Implementation Specification

**Document:** MAP MVP Database Implementation Specification
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

This document provides detailed implementation specifications for all MAP database tables. Each table includes full schema, primary keys, foreign keys, indexes, constraints, audit fields, soft delete strategy, seed data requirements, migration order, and performance recommendations.

---

## Database Configuration

- **Engine:** Azure SQL Managed Instance
- **Edition:** General Purpose
- **Collation:** SQL_Latin1_General_CP1_CI_AS
- **Recovery Model:** Full
- **Backup Strategy:** Automated backups with 7-day retention
- **Encryption:** Transparent Data Encryption (TDE) enabled

---

## Migration Order

Tables must be created in the following order due to foreign key dependencies:

1. Tenant
2. User
3. Subscription
4. Resource
5. ResourceDependency
6. Migration
7. MigrationResource
8. ValidationRun
9. ValidationRule
10. Finding
11. Policy
12. PolicyRule
13. Report
14. AuditLog
15. Setting

---

## Table 1: Tenant

### Purpose
Stores tenant (organization) information for multi-tenant isolation.

### Full Schema

```sql
CREATE TABLE [dbo].[Tenant] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [Name]                  NVARCHAR(100)       NOT NULL,
    [DisplayName]           NVARCHAR(200)       NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Active',
    [MaxSubscriptions]      INT                 NOT NULL DEFAULT 50,
    [MaxUsers]              INT                 NOT NULL DEFAULT 100,
    [EntraTenantId]         NVARCHAR(100)       NULL,
    [Settings]              NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Tenant] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Tenant_Name] UNIQUE NONCLUSTERED ([Name]),
    CONSTRAINT [CK_Tenant_Status] CHECK ([Status] IN ('Active', 'Inactive', 'Suspended')),
    CONSTRAINT [CK_Tenant_MaxSubscriptions] CHECK ([MaxSubscriptions] > 0 AND [MaxSubscriptions] <= 100),
    CONSTRAINT [CK_Tenant_MaxUsers] CHECK ([MaxUsers] > 0 AND [MaxUsers] <= 1000)
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Tenant | Id (Clustered) | Primary key lookup |
| UQ_Tenant_Name | Name (Non-Clustered) | Unique constraint and name lookup |
| IX_Tenant_Status | Status (Non-Clustered) | Filter by status |
| IX_Tenant_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |
| IX_Tenant_CreatedAt | CreatedAt (Non-Clustered) | Date range queries |

### Seed Data

```sql
INSERT INTO [dbo].[Tenant] ([Id], [Name], [DisplayName], [Status], [CreatedBy], [UpdatedBy])
VALUES ('00000000-0000-0000-0000-000000000001', 'Default', 'Default Tenant', 'Active', 'System', 'System');
```

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Non-clustered index on Status for filtering active tenants
- Consider partitioning by Status for large deployments

---

## Table 2: User

### Purpose
Stores user accounts and role assignments.

### Full Schema

```sql
CREATE TABLE [dbo].[User] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [EntraUserId]           NVARCHAR(100)       NOT NULL,
    [Email]                 NVARCHAR(256)       NOT NULL,
    [DisplayName]           NVARCHAR(200)       NOT NULL,
    [FirstName]             NVARCHAR(100)       NULL,
    [LastName]              NVARCHAR(100)       NULL,
    [Role]                  NVARCHAR(50)        NOT NULL DEFAULT 'Viewer',
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Active',
    [LastLoginAt]           DATETIME2(7)        NULL,
    [LastLoginIP]           NVARCHAR(45)        NULL,
    [Preferences]           NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [UQ_User_EntraUserId_Tenant] UNIQUE NONCLUSTERED ([EntraUserId], [TenantId]),
    CONSTRAINT [UQ_User_Email_Tenant] UNIQUE NONCLUSTERED ([Email], [TenantId]),
    CONSTRAINT [CK_User_Role] CHECK ([Role] IN ('Admin', 'Migrator', 'Viewer')),
    CONSTRAINT [CK_User_Status] CHECK ([Status] IN ('Active', 'Inactive', 'Pending'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_User | Id (Clustered) | Primary key lookup |
| FK_User_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| UQ_User_EntraUserId_Tenant | EntraUserId, TenantId (Non-Clustered) | Unique constraint and Entra lookup |
| UQ_User_Email_Tenant | Email, TenantId (Non-Clustered) | Unique constraint and email lookup |
| IX_User_Role | Role (Non-Clustered) | Filter by role |
| IX_User_Status | Status (Non-Clustered) | Filter by status |
| IX_User_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

```sql
INSERT INTO [dbo].[User] ([Id], [TenantId], [EntraUserId], [Email], [DisplayName], [Role], [Status], [CreatedBy], [UpdatedBy])
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'system-admin', 'admin@default.com', 'System Admin', 'Admin', 'Active', 'System', 'System');
```

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Composite unique indexes for EntraUserId and Email with TenantId
- Consider index on LastLoginAt for activity tracking queries

---

## Table 3: Subscription

### Purpose
Stores Azure subscription connections and metadata.

### Full Schema

```sql
CREATE TABLE [dbo].[Subscription] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [SubscriptionId]        NVARCHAR(100)       NOT NULL,
    [Name]                  NVARCHAR(200)       NOT NULL,
    [DisplayName]           NVARCHAR(200)       NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Validating',
    [State]                 NVARCHAR(50)        NULL,
    [ResourceCount]         INT                 NOT NULL DEFAULT 0,
    [LastScannedAt]         DATETIME2(7)        NULL,
    [LastScanStatus]        NVARCHAR(50)        NULL,
    [EncryptedCredentials]  NVARCHAR(MAX)       NULL,
    [Error]                 NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Subscription] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Subscription_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [UQ_Subscription_SubscriptionId_Tenant] UNIQUE NONCLUSTERED ([SubscriptionId], [TenantId]),
    CONSTRAINT [CK_Subscription_Status] CHECK ([Status] IN ('Validating', 'Active', 'Inactive', 'Error')),
    CONSTRAINT [CK_Subscription_ResourceCount] CHECK ([ResourceCount] >= 0)
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Subscription | Id (Clustered) | Primary key lookup |
| FK_Subscription_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| UQ_Subscription_SubscriptionId_Tenant | SubscriptionId, TenantId (Non-Clustered) | Unique constraint and Azure lookup |
| IX_Subscription_Status | Status (Non-Clustered) | Filter by status |
| IX_Subscription_LastScannedAt | LastScannedAt (Non-Clustered) | Find stale subscriptions |
| IX_Subscription_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

No seed data. Subscriptions are connected by users.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Index on LastScannedAt for finding subscriptions needing scan
- Consider partitioning by TenantId for large deployments

---

## Table 4: Resource

### Purpose
Stores discovered Azure resources and their metadata.

### Full Schema

```sql
CREATE TABLE [dbo].[Resource] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [SubscriptionId]        UNIQUEIDENTIFIER    NOT NULL,
    [AzureResourceId]       NVARCHAR(2000)      NOT NULL,
    [Name]                  NVARCHAR(200)       NOT NULL,
    [Type]                  NVARCHAR(200)       NOT NULL,
    [TypeName]              NVARCHAR(200)       NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Unknown',
    [Location]              NVARCHAR(100)       NOT NULL,
    [ResourceGroup]         NVARCHAR(200)       NULL,
    [Tags]                  NVARCHAR(MAX)       NULL,
    [Properties]            NVARCHAR(MAX)       NULL,
    [MigrationReadiness]    NVARCHAR(50)        NOT NULL DEFAULT 'Unknown',
    [ReadinessScore]        INT                 NULL,
    [ReadinessIssues]       NVARCHAR(MAX)       NULL,
    [CostEstimate]          DECIMAL(18,2)       NULL,
    [LastSyncedAt]          DATETIME2(7)        NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Resource] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Resource_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [FK_Resource_Subscription] FOREIGN KEY ([SubscriptionId]) REFERENCES [dbo].[Subscription]([Id]),
    CONSTRAINT [UQ_Resource_AzureResourceId_Tenant] UNIQUE NONCLUSTERED ([AzureResourceId], [TenantId]),
    CONSTRAINT [CK_Resource_Status] CHECK ([Status] IN ('Running', 'Stopped', 'Paused', 'Unknown', 'Error')),
    CONSTRAINT [CK_Resource_MigrationReadiness] CHECK ([MigrationReadiness] IN ('Ready', 'NotReady', 'Partial', 'Unknown')),
    CONSTRAINT [CK_Resource_ReadinessScore] CHECK ([ReadinessScore] IS NULL OR ([ReadinessScore] >= 0 AND [ReadinessScore] <= 100)),
    CONSTRAINT [CK_Resource_CostEstimate] CHECK ([CostEstimate] IS NULL OR [CostEstimate] >= 0)
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Resource | Id (Clustered) | Primary key lookup |
| FK_Resource_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| FK_Resource_Subscription | SubscriptionId (Non-Clustered) | Subscription relationship |
| UQ_Resource_AzureResourceId_Tenant | AzureResourceId, TenantId (Non-Clustered) | Unique constraint and Azure lookup |
| IX_Resource_Type | Type (Non-Clustered) | Filter by resource type |
| IX_Resource_Status | Status (Non-Clustered) | Filter by status |
| IX_Resource_Location | Location (Non-Clustered) | Filter by location |
| IX_Resource_MigrationReadiness | MigrationReadiness (Non-Clustered) | Filter by readiness |
| IX_Resource_LastSyncedAt | LastSyncedAt (Non-Clustered) | Find stale resources |
| IX_Resource_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

No seed data. Resources are discovered from Azure.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Composite indexes for common filter combinations
- Consider full-text index on Name for search
- Consider partitioning by SubscriptionId for large deployments

---

## Table 5: ResourceDependency

### Purpose
Stores relationships between Azure resources.

### Full Schema

```sql
CREATE TABLE [dbo].[ResourceDependency] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [SourceResourceId]      UNIQUEIDENTIFIER    NOT NULL,
    [TargetResourceId]      UNIQUEIDENTIFIER    NOT NULL,
    [DependencyType]        NVARCHAR(100)       NOT NULL,
    [Direction]             NVARCHAR(50)        NOT NULL DEFAULT 'Outbound',
    [Strength]              NVARCHAR(50)        NOT NULL DEFAULT 'Required',
    [Properties]            NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_ResourceDependency] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ResourceDependency_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [FK_ResourceDependency_Source] FOREIGN KEY ([SourceResourceId]) REFERENCES [dbo].[Resource]([Id]),
    CONSTRAINT [FK_ResourceDependency_Target] FOREIGN KEY ([TargetResourceId]) REFERENCES [dbo].[Resource]([Id]),
    CONSTRAINT [UQ_ResourceDependency_SourceTarget] UNIQUE NONCLUSTERED ([SourceResourceId], [TargetResourceId]),
    CONSTRAINT [CK_ResourceDependency_Direction] CHECK ([Direction] IN ('Inbound', 'Outbound', 'Bidirectional')),
    CONSTRAINT [CK_ResourceDependency_Strength] CHECK ([Strength] IN ('Required', 'Optional', 'Recommended'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_ResourceDependency | Id (Clustered) | Primary key lookup |
| FK_ResourceDependency_Source | SourceResourceId (Non-Clustered) | Source resource lookup |
| FK_ResourceDependency_Target | TargetResourceId (Non-Clustered) | Target resource lookup |
| IX_ResourceDependency_Direction | Direction (Non-Clustered) | Filter by direction |

### Seed Data

No seed data. Dependencies are discovered from Azure.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Consider graph database for complex dependency chains
- Index on SourceResourceId and TargetResourceId for relationship queries

---

## Table 6: Migration

### Purpose
Stores migration project information and state.

### Full Schema

```sql
CREATE TABLE [dbo].[Migration] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [Name]                  NVARCHAR(200)       NOT NULL,
    [Description]           NVARCHAR(2000)      NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Draft',
    [Phase]                 NVARCHAR(50)        NOT NULL DEFAULT 'Planning',
    [Progress]              INT                 NOT NULL DEFAULT 0,
    [Priority]              NVARCHAR(50)        NOT NULL DEFAULT 'Medium',
    [PlannedStartDate]      DATETIME2(7)        NULL,
    [PlannedEndDate]        DATETIME2(7)        NULL,
    [ActualStartDate]       DATETIME2(7)        NULL,
    [ActualEndDate]         DATETIME2(7)        NULL,
    [Owner]                 NVARCHAR(100)       NULL,
    [Notes]                 NVARCHAR(MAX)       NULL,
    [Metadata]              NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Migration] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Migration_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [UQ_Migration_Name_Tenant] UNIQUE NONCLUSTERED ([Name], [TenantId]),
    CONSTRAINT [CK_Migration_Status] CHECK ([Status] IN ('Draft', 'InProgress', 'Completed', 'Failed', 'Cancelled')),
    CONSTRAINT [CK_Migration_Phase] CHECK ([Phase] IN ('Planning', 'PreMigration', 'Migration', 'PostMigration', 'Complete')),
    CONSTRAINT [CK_Migration_Progress] CHECK ([Progress] >= 0 AND [Progress] <= 100),
    CONSTRAINT [CK_Migration_Priority] CHECK ([Priority] IN ('Low', 'Medium', 'High', 'Critical'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Migration | Id (Clustered) | Primary key lookup |
| FK_Migration_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| UQ_Migration_Name_Tenant | Name, TenantId (Non-Clustered) | Unique constraint |
| IX_Migration_Status | Status (Non-Clustered) | Filter by status |
| IX_Migration_Phase | Phase (Non-Clustered) | Filter by phase |
| IX_Migration_Priority | Priority (Non-Clustered) | Filter by priority |
| IX_Migration_CreatedAt | CreatedAt (Non-Clustered) | Date range queries |
| IX_Migration_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

No seed data. Migrations are created by users.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Indexes on Status and Phase for filtering
- Consider index on PlannedStartDate for scheduling queries

---

## Table 7: MigrationResource

### Purpose
Junction table linking migrations to resources.

### Full Schema

```sql
CREATE TABLE [dbo].[MigrationResource] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [MigrationId]           UNIQUEIDENTIFIER    NOT NULL,
    [ResourceId]            UNIQUEIDENTIFIER    NOT NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Pending',
    [AddedAt]               DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [RemovedAt]             DATETIME2(7)        NULL,

    CONSTRAINT [PK_MigrationResource] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_MigrationResource_Migration] FOREIGN KEY ([MigrationId]) REFERENCES [dbo].[Migration]([Id]),
    CONSTRAINT [FK_MigrationResource_Resource] FOREIGN KEY ([ResourceId]) REFERENCES [dbo].[Resource]([Id]),
    CONSTRAINT [UQ_MigrationResource_Migration_Resource] UNIQUE NONCLUSTERED ([MigrationId], [ResourceId]),
    CONSTRAINT [CK_MigrationResource_Status] CHECK ([Status] IN ('Pending', 'InProgress', 'Completed', 'Failed', 'Skipped'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_MigrationResource | Id (Clustered) | Primary key lookup |
| FK_MigrationResource_Migration | MigrationId (Non-Clustered) | Migration relationship |
| FK_MigrationResource_Resource | ResourceId (Non-Clustered) | Resource relationship |

### Seed Data

No seed data. Created when resources are added to migrations.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Composite unique index prevents duplicate resource additions

---

## Table 8: ValidationRun

### Purpose
Stores validation execution history and results.

### Full Schema

```sql
CREATE TABLE [dbo].[ValidationRun] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [MigrationId]           UNIQUEIDENTIFIER    NOT NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Queued',
    [TotalRules]            INT                 NOT NULL DEFAULT 0,
    [PassedRules]           INT                 NOT NULL DEFAULT 0,
    [FailedRules]           INT                 NOT NULL DEFAULT 0,
    [WarningRules]          INT                 NOT NULL DEFAULT 0,
    [SkippedRules]          INT                 NOT NULL DEFAULT 0,
    [StartedAt]             DATETIME2(7)        NULL,
    [CompletedAt]           DATETIME2(7)        NULL,
    [Duration]              INT                 NULL,
    [Error]                 NVARCHAR(MAX)       NULL,
    [Parameters]            NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_ValidationRun] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ValidationRun_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [FK_ValidationRun_Migration] FOREIGN KEY ([MigrationId]) REFERENCES [dbo].[Migration]([Id]),
    CONSTRAINT [CK_ValidationRun_Status] CHECK ([Status] IN ('Queued', 'Running', 'Completed', 'Failed', 'Cancelled')),
    CONSTRAINT [CK_ValidationRun_TotalRules] CHECK ([TotalRules] >= 0),
    CONSTRAINT [CK_ValidationRun_PassedRules] CHECK ([PassedRules] >= 0),
    CONSTRAINT [CK_ValidationRun_FailedRules] CHECK ([FailedRules] >= 0),
    CONSTRAINT [CK_ValidationRun_WarningRules] CHECK ([WarningRules] >= 0),
    CONSTRAINT [CK_ValidationRun_Duration] CHECK ([Duration] IS NULL OR [Duration] >= 0)
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_ValidationRun | Id (Clustered) | Primary key lookup |
| FK_ValidationRun_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| FK_ValidationRun_Migration | MigrationId (Non-Clustered) | Migration relationship |
| IX_ValidationRun_Status | Status (Non-Clustered) | Filter by status |
| IX_ValidationRun_StartedAt | StartedAt (Non-Clustered) | Date range queries |
| IX_ValidationRun_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

No seed data. Created when validations are executed.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Index on MigrationId for migration validation history
- Index on StartedAt for recent validation queries

---

## Table 9: Finding

### Purpose
Stores validation findings and recommendations.

### Full Schema

```sql
CREATE TABLE [dbo].[Finding] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [ValidationRunId]       UNIQUEIDENTIFIER    NOT NULL,
    [MigrationId]           UNIQUEIDENTIFIER    NOT NULL,
    [ResourceId]            UNIQUEIDENTIFIER    NULL,
    [Title]                 NVARCHAR(200)       NOT NULL,
    [Description]           NVARCHAR(2000)      NOT NULL,
    [Severity]              NVARCHAR(50)        NOT NULL,
    [Category]              NVARCHAR(50)        NOT NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Open',
    [RuleName]              NVARCHAR(200)       NULL,
    [RuleId]                NVARCHAR(100)       NULL,
    [Message]               NVARCHAR(MAX)       NULL,
    [Recommendation]        NVARCHAR(MAX)       NULL,
    [Remediation]           NVARCHAR(MAX)       NULL,
    [Impact]                NVARCHAR(50)        NULL,
    [Notes]                 NVARCHAR(MAX)       NULL,
    [ResolvedAt]            DATETIME2(7)        NULL,
    [ResolvedBy]            NVARCHAR(100)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Finding] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Finding_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [FK_Finding_ValidationRun] FOREIGN KEY ([ValidationRunId]) REFERENCES [dbo].[ValidationRun]([Id]),
    CONSTRAINT [FK_Finding_Migration] FOREIGN KEY ([MigrationId]) REFERENCES [dbo].[Migration]([Id]),
    CONSTRAINT [FK_Finding_Resource] FOREIGN KEY ([ResourceId]) REFERENCES [dbo].[Resource]([Id]),
    CONSTRAINT [CK_Finding_Severity] CHECK ([Severity] IN ('Critical', 'High', 'Medium', 'Low', 'Informational')),
    CONSTRAINT [CK_Finding_Category] CHECK ([Category] IN ('Security', 'Performance', 'Cost', 'Compliance', 'Availability', 'Configuration')),
    CONSTRAINT [CK_Finding_Status] CHECK ([Status] IN ('Open', 'InProgress', 'Resolved', 'Dismissed', 'Escalated')),
    CONSTRAINT [CK_Finding_Impact] CHECK ([Impact] IS NULL OR [Impact] IN ('High', 'Medium', 'Low'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Finding | Id (Clustered) | Primary key lookup |
| FK_Finding_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| FK_Finding_ValidationRun | ValidationRunId (Non-Clustered) | Validation run relationship |
| FK_Finding_Migration | MigrationId (Non-Clustered) | Migration relationship |
| FK_Finding_Resource | ResourceId (Non-Clustered) | Resource relationship |
| IX_Finding_Severity | Severity (Non-Clustered) | Filter by severity |
| IX_Finding_Category | Category (Non-Clustered) | Filter by category |
| IX_Finding_Status | Status (Non-Clustered) | Filter by status |
| IX_Finding_CreatedAt | CreatedAt (Non-Clustered) | Date range queries |
| IX_Finding_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

No seed data. Created when validations generate findings.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Indexes on Severity, Category, and Status for filtering
- Consider composite index on MigrationId + Severity for common queries

---

## Table 10: Policy

### Purpose
Stores migration policies and compliance rules.

### Full Schema

```sql
CREATE TABLE [dbo].[Policy] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [Name]                  NVARCHAR(200)       NOT NULL,
    [Description]           NVARCHAR(2000)      NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Active',
    [Category]              NVARCHAR(50)        NOT NULL,
    [IsDefault]             BIT                 NOT NULL DEFAULT 0,
    [CompliancePercentage]  DECIMAL(5,2)        NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Policy] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Policy_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [UQ_Policy_Name_Tenant] UNIQUE NONCLUSTERED ([Name], [TenantId]),
    CONSTRAINT [CK_Policy_Status] CHECK ([Status] IN ('Active', 'Inactive', 'Draft')),
    CONSTRAINT [CK_Policy_Category] CHECK ([Category] IN ('Security', 'Performance', 'Cost', 'Compliance')),
    CONSTRAINT [CK_Policy_CompliancePercentage] CHECK ([CompliancePercentage] IS NULL OR ([CompliancePercentage] >= 0 AND [CompliancePercentage] <= 100))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Policy | Id (Clustered) | Primary key lookup |
| FK_Policy_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| UQ_Policy_Name_Tenant | Name, TenantId (Non-Clustered) | Unique constraint |
| IX_Policy_Status | Status (Non-Clustered) | Filter by status |
| IX_Policy_Category | Category (Non-Clustered) | Filter by category |
| IX_Policy_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

```sql
INSERT INTO [dbo].[Policy] ([Id], [TenantId], [Name], [Description], [Status], [Category], [IsDefault], [CreatedBy], [UpdatedBy])
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Default Security Policy', 'Standard security requirements for all migrations', 'Active', 'Security', 1, 'System', 'System');
```

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Indexes on Status and Category for filtering
- Consider index on IsDefault for default policy queries

---

## Table 11: PolicyRule

### Purpose
Stores individual rules within policies.

### Full Schema

```sql
CREATE TABLE [dbo].[PolicyRule] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [PolicyId]              UNIQUEIDENTIFIER    NOT NULL,
    [Name]                  NVARCHAR(200)       NOT NULL,
    [Description]           NVARCHAR(2000)      NULL,
    [Condition]             NVARCHAR(2000)      NOT NULL,
    [Action]                NVARCHAR(100)       NOT NULL,
    [Severity]              NVARCHAR(50)        NOT NULL,
    [IsEnabled]             BIT                 NOT NULL DEFAULT 1,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_PolicyRule] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PolicyRule_Policy] FOREIGN KEY ([PolicyId]) REFERENCES [dbo].[Policy]([Id]),
    CONSTRAINT [CK_PolicyRule_Action] CHECK ([Action] IN ('FlagForReview', 'Block', 'Warn', 'Notify')),
    CONSTRAINT [CK_PolicyRule_Severity] CHECK ([Severity] IN ('Critical', 'High', 'Medium', 'Low'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_PolicyRule | Id (Clustered) | Primary key lookup |
| FK_PolicyRule_Policy | PolicyId (Non-Clustered) | Policy relationship |
| IX_PolicyRule_IsEnabled | IsEnabled (Non-Clustered) | Filter enabled rules |

### Seed Data

```sql
INSERT INTO [dbo].[PolicyRule] ([Id], [PolicyId], [Name], [Description], [Condition], [Action], [Severity], [CreatedBy], [UpdatedBy])
VALUES ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000010', 'SSL Certificate Required', 'All web apps must have SSL certificates configured', 'resource.type == ''Microsoft.Web/sites'' && !resource.sslCertificate', 'FlagForReview', 'High', 'System', 'System');
```

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Index on PolicyId for policy rule lookups
- Index on IsEnabled for filtering active rules

---

## Table 12: Report

### Purpose
Stores generated report metadata.

### Full Schema

```sql
CREATE TABLE [dbo].[Report] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NOT NULL,
    [MigrationId]           UNIQUEIDENTIFIER    NULL,
    [Name]                  NVARCHAR(200)       NOT NULL,
    [Type]                  NVARCHAR(50)        NOT NULL,
    [Format]                NVARCHAR(20)        NOT NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Generating',
    [FilePath]              NVARCHAR(2000)      NULL,
    [FileUrl]               NVARCHAR(2000)      NULL,
    [FileSize]              BIGINT              NULL,
    [Error]                 NVARCHAR(MAX)       NULL,
    [GeneratedAt]           DATETIME2(7)        NULL,
    [ExpiresAt]             DATETIME2(7)        NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,
    [IsDeleted]             BIT                 NOT NULL DEFAULT 0,
    [DeletedAt]             DATETIME2(7)        NULL,
    [DeletedBy]             NVARCHAR(100)       NULL,

    CONSTRAINT [PK_Report] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Report_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [FK_Report_Migration] FOREIGN KEY ([MigrationId]) REFERENCES [dbo].[Migration]([Id]),
    CONSTRAINT [CK_Report_Type] CHECK ([Type] IN ('MigrationSummary', 'ValidationDetail', 'Compliance', 'Executive', 'Custom')),
    CONSTRAINT [CK_Report_Format] CHECK ([Format] IN ('PDF', 'Excel', 'CSV')),
    CONSTRAINT [CK_Report_Status] CHECK ([Status] IN ('Generating', 'Completed', 'Failed', 'Expired')),
    CONSTRAINT [CK_Report_FileSize] CHECK ([FileSize] IS NULL OR [FileSize] >= 0)
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Report | Id (Clustered) | Primary key lookup |
| FK_Report_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| FK_Report_Migration | MigrationId (Non-Clustered) | Migration relationship |
| IX_Report_Type | Type (Non-Clustered) | Filter by type |
| IX_Report_Status | Status (Non-Clustered) | Filter by status |
| IX_Report_CreatedAt | CreatedAt (Non-Clustered) | Date range queries |
| IX_Report_ExpiresAt | ExpiresAt (Non-Clustered) | Cleanup expired reports |
| IX_Report_IsDeleted | IsDeleted (Non-Clustered) | Soft delete filtering |

### Seed Data

No seed data. Created when reports are generated.

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Index on ExpiresAt for cleanup job
- Consider partitioning by CreatedAt for archival

---

## Table 13: AuditLog

### Purpose
Stores complete audit trail of all user and system actions.

### Full Schema

```sql
CREATE TABLE [dbo].[AuditLog] (
    [Id]                    BIGINT              NOT NULL IDENTITY(1,1),
    [TenantId]              UNIQUEIDENTIFIER    NULL,
    [UserId]                UNIQUEIDENTIFIER    NULL,
    [UserEmail]             NVARCHAR(256)       NULL,
    [Action]                NVARCHAR(100)       NOT NULL,
    [EntityType]            NVARCHAR(100)       NOT NULL,
    [EntityId]              NVARCHAR(100)       NULL,
    [EntityName]            NVARCHAR(200)       NULL,
    [OldValue]              NVARCHAR(MAX)       NULL,
    [NewValue]              NVARCHAR(MAX)       NULL,
    [IpAddress]             NVARCHAR(45)        NULL,
    [UserAgent]             NVARCHAR(500)       NULL,
    [CorrelationId]         NVARCHAR(100)       NULL,
    [Status]                NVARCHAR(50)        NOT NULL DEFAULT 'Success',
    [ErrorMessage]          NVARCHAR(MAX)       NULL,
    [Duration]              INT                 NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_AuditLog] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_AuditLog_Action] CHECK ([Action] IN ('Create', 'Read', 'Update', 'Delete', 'Login', 'Logout', 'Export', 'Execute')),
    CONSTRAINT [CK_AuditLog_Status] CHECK ([Status] IN ('Success', 'Failure', 'Error'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_AuditLog | Id (Clustered, Identity) | Primary key lookup |
| IX_AuditLog_TenantId | TenantId (Non-Clustered) | Tenant filtering |
| IX_AuditLog_UserId | UserId (Non-Clustered) | User activity queries |
| IX_AuditLog_Action | Action (Non-Clustered) | Filter by action |
| IX_AuditLog_EntityType | EntityType (Non-Clustered) | Filter by entity type |
| IX_AuditLog_EntityId | EntityId (Non-Clustered) | Entity history lookup |
| IX_AuditLog_CreatedAt | CreatedAt (Non-Clustered) | Date range queries |
| IX_AuditLog_CorrelationId | CorrelationId (Non-Clustered) | Request tracing |

### Seed Data

No seed data. Created automatically by audit logging middleware.

### Performance Recommendations
- Clustered index on Id (identity column) for sequential inserts
- Consider partitioning by CreatedAt for archival (monthly partitions)
- Index on EntityId + EntityType for entity history queries
- Consider columnstore index for analytics queries on large volumes
- Implement table partitioning with sliding window for retention

---

## Table 14: Setting

### Purpose
Stores application and tenant configuration settings.

### Full Schema

```sql
CREATE TABLE [dbo].[Setting] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [TenantId]              UNIQUEIDENTIFIER    NULL,
    [Category]              NVARCHAR(100)       NOT NULL,
    [Key]                   NVARCHAR(200)       NOT NULL,
    [Value]                 NVARCHAR(MAX)       NOT NULL,
    [ValueType]             NVARCHAR(50)        NOT NULL DEFAULT 'String',
    [Description]           NVARCHAR(500)       NULL,
    [IsEncrypted]           BIT                 NOT NULL DEFAULT 0,
    [IsSystem]              BIT                 NOT NULL DEFAULT 0,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,

    CONSTRAINT [PK_Setting] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Setting_Tenant] FOREIGN KEY ([TenantId]) REFERENCES [dbo].[Tenant]([Id]),
    CONSTRAINT [UQ_Setting_Key_Tenant] UNIQUE NONCLUSTERED ([Key], [TenantId]),
    CONSTRAINT [CK_Setting_ValueType] CHECK ([ValueType] IN ('String', 'Int', 'Bool', 'Json'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_Setting | Id (Clustered) | Primary key lookup |
| FK_Setting_Tenant | TenantId (Non-Clustered) | Tenant relationship |
| UQ_Setting_Key_Tenant | Key, TenantId (Non-Clustered) | Unique constraint and lookup |
| IX_Setting_Category | Category (Non-Clustered) | Filter by category |
| IX_Setting_IsSystem | IsSystem (Non-Clustered) | Filter system settings |

### Seed Data

```sql
INSERT INTO [dbo].[Setting] ([Id], [TenantId], [Category], [Key], [Value], [ValueType], [Description], [IsSystem], [CreatedBy], [UpdatedBy])
VALUES
('00000000-0000-0000-0000-000000000020', NULL, 'General', 'App.Name', 'MAP', 'String', 'Application name', 1, 'System', 'System'),
('00000000-0000-0000-0000-000000000021', NULL, 'General', 'App.Version', '1.0.0', 'String', 'Application version', 1, 'System', 'System'),
('00000000-0000-0000-0000-000000000022', NULL, 'Security', 'Session.Timeout', '3600', 'Int', 'Session timeout in seconds', 1, 'System', 'System'),
('00000000-0000-0000-0000-000000000023', NULL, 'AI', 'AI.RateLimit', '20', 'Int', 'AI requests per minute', 1, 'System', 'System');
```

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Composite unique index for Key + TenantId
- Consider caching frequently accessed settings
- Index on Category for grouped settings queries

---

## Table 15: ValidationRule

### Purpose
Stores available validation rules and their configurations.

### Full Schema

```sql
CREATE TABLE [dbo].[ValidationRule] (
    [Id]                    UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    [Name]                  NVARCHAR(200)       NOT NULL,
    [Description]           NVARCHAR(2000)      NULL,
    [Category]              NVARCHAR(50)        NOT NULL,
    [Severity]              NVARCHAR(50)        NOT NULL,
    [IsEnabled]             BIT                 NOT NULL DEFAULT 1,
    [IsDefault]             BIT                 NOT NULL DEFAULT 0,
    [CheckerType]           NVARCHAR(200)       NOT NULL,
    [Parameters]            NVARCHAR(MAX)       NULL,
    [CreatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt]             DATETIME2(7)        NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy]             NVARCHAR(100)       NOT NULL,
    [UpdatedBy]             NVARCHAR(100)       NOT NULL,

    CONSTRAINT [PK_ValidationRule] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_ValidationRule_Name] UNIQUE NONCLUSTERED ([Name]),
    CONSTRAINT [CK_ValidationRule_Category] CHECK ([Category] IN ('Security', 'Performance', 'Cost', 'Compliance', 'Availability', 'Configuration')),
    CONSTRAINT [CK_ValidationRule_Severity] CHECK ([Severity] IN ('Critical', 'High', 'Medium', 'Low', 'Informational'))
);
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| PK_ValidationRule | Id (Clustered) | Primary key lookup |
| UQ_ValidationRule_Name | Name (Non-Clustered) | Unique constraint |
| IX_ValidationRule_Category | Category (Non-Clustered) | Filter by category |
| IX_ValidationRule_IsEnabled | IsEnabled (Non-Clustered) | Filter enabled rules |
| IX_ValidationRule_IsDefault | IsDefault (Non-Clustered) | Filter default rules |

### Seed Data

```sql
INSERT INTO [dbo].[ValidationRule] ([Id], [Name], [Description], [Category], [Severity], [IsDefault], [CheckerType], [CreatedBy], [UpdatedBy])
VALUES
('00000000-0000-0000-0000-000000000030', 'SSL Certificate Check', 'Verify SSL certificates are configured for web apps', 'Security', 'High', 1, 'SslCertificateChecker', 'System', 'System'),
('00000000-0000-0000-0000-000000000031', 'VM Size Validation', 'Check if VM sizes are appropriate for workload', 'Performance', 'Medium', 1, 'VmSizeChecker', 'System', 'System'),
('00000000-0000-0000-0000-000000000032', 'Cost Optimization', 'Identify cost optimization opportunities', 'Cost', 'Low', 1, 'CostOptimizerChecker', 'System', 'System');
```

### Performance Recommendations
- Clustered index on Id for primary key lookups
- Index on IsEnabled and IsDefault for filtering
- Consider caching rule configurations

---

## Soft Delete Strategy

All tables (except AuditLog) implement soft delete:

- **IsDeleted:** BIT column, default 0
- **DeletedAt:** DATETIME2(7) column, NULL when not deleted
- **DeletedBy:** NVARCHAR(100) column, NULL when not deleted

### Implementation

```sql
-- Soft delete procedure
CREATE PROCEDURE [dbo].[usp_SoftDelete]
    @TableName NVARCHAR(128),
    @Id UNIQUEIDENTIFIER,
    @DeletedBy NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @SQL NVARCHAR(MAX);
    SET @SQL = 'UPDATE ' + QUOTENAME(@TableName) +
               ' SET IsDeleted = 1, DeletedAt = SYSUTCDATETIME(), DeletedBy = @DeletedBy' +
               ' WHERE Id = @Id AND IsDeleted = 0';
    EXEC sp_executesql @SQL, N'@Id UNIQUEIDENTIFIER, @DeletedBy NVARCHAR(100)', @Id, @DeletedBy;
END
```

### Query Filtering

All queries must include `WHERE IsDeleted = 0` unless explicitly requesting deleted records.

---

## Audit Fields

All tables (except AuditLog) include audit fields:

- **CreatedAt:** DATETIME2(7), NOT NULL, DEFAULT SYSUTCDATETIME()
- **UpdatedAt:** DATETIME2(7), NOT NULL, DEFAULT SYSUTCDATETIME()
- **CreatedBy:** NVARCHAR(100), NOT NULL
- **UpdatedBy:** NVARCHAR(100), NOT NULL

### Trigger for UpdatedAt

```sql
CREATE TRIGGER [dbo].[trg_SetUpdatedAt]
ON [dbo].[Tenant]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Tenant]
    SET [UpdatedAt] = SYSUTCDATETIME()
    FROM [dbo].[Tenant] t
    INNER JOIN inserted i ON t.[Id] = i.[Id];
END
```

---

## Performance Recommendations Summary

| Area | Recommendation |
|------|----------------|
| Indexing | Use covering indexes for frequent queries |
| Partitioning | Partition large tables by TenantId or CreatedAt |
| Caching | Cache frequently accessed settings and rules |
| Connection Pooling | Use ADO.NET connection pooling |
| Query Optimization | Use execution plan analysis for slow queries |
| Statistics | Enable auto-update statistics |
| Compression | Enable page compression for large tables |
| Archival | Archive old AuditLog and Report data quarterly |
