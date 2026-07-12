# MAP MVP Database Standards

| Field | Value |
|-------|-------|
| **Document** | MAP MVP Database Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Purpose

This document defines the database technology evaluation criteria, selection standards, and architectural guidelines for the MAP (Migration Assurance Platform). It establishes which database engines are approved for use, when each should be selected, and the conventions for schema design, access patterns, and operational practices.

## 2. Scope

Covers all persistent data stores used by MAP services, including relational databases, NoSQL stores, and caching layers. Applies to both primary application databases and supporting infrastructure databases.

## 3. Evaluation Criteria

Every candidate database is evaluated against the following dimensions:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| ACID Compliance | High | Transactional integrity for financial and migration data |
| JSON/Document Support | Medium | Semi-structured data handling for migration payloads |
| Full-text Search | Medium | Query capability for migration reports and logs |
| Cloud Portability | High | Ability to run across Azure, AWS, or GCP without rewrite |
| Cost | Medium | Licensing, operational, and infrastructure expenses |
| Enterprise Suitability | High | HA, DR, security features, vendor support, compliance |

## 4. Candidate Database Evaluations

### 4.1 PostgreSQL

| Attribute | Detail |
|-----------|--------|
| **Type** | Open-source relational (ORDBMS) |
| **Licensing** | PostgreSQL License (permissive, MIT-like) |
| **Scalability** | Vertical scaling + read replicas |
| **Cloud Portability** | Excellent (AWS RDS, Azure Database, GCP Cloud SQL) |
| **Cost** | Free (self-hosted); managed service fees on cloud |
| **Enterprise Suitability** | High |

**Strengths:**
- Full ACID compliance with MVCC concurrency
- Native JSON/JSONB columns for semi-structured data
- Built-in full-text search with ts_vector/ts_query
- Extensible with custom types, functions, and indexes (GiST, GIN, BRIN)
- Strong ecosystem: PostGIS, pg_partman, TimescaleDB

**Weaknesses:**
- No native managed service on Azure (requires third-party or self-hosted)
- Vertical scaling ceiling without sharding
- Replication lag under heavy write loads

**Best For:** Portable deployments, cost-sensitive projects, complex analytical queries, teams with PostgreSQL expertise.

### 4.2 Azure SQL

| Attribute | Detail |
|-----------|--------|
| **Type** | Managed PaaS (Azure SQL Database / Managed Instance) |
| **Licensing** | Per DTU or vCore model |
| **Scalability** | Elastic pools, serverless tier, read replicas |
| **Cloud Portability** | Azure only |
| **Cost** | Medium-High |
| **Enterprise Suitability** | Very High |

**Strengths:**
- Fully managed: automated patching, backups, HA, tuning
- Built-in TDE, Advanced Threat Protection, auditing
- Azure AD integration for identity-based access
- Geo-replication and auto-failover groups
- Deep integration with Azure ecosystem (Key Vault, Monitor, DevOps)

**Weaknesses:**
- Azure lock-in; no portable deployment model
- Higher cost than self-hosted alternatives
- Limited customization of underlying engine
- vCore pricing can escalate with scale

**Best For:** Azure-native applications, teams invested in Microsoft ecosystem, workloads requiring managed HA and compliance.

### 4.3 SQL Server

| Attribute | Detail |
|-----------|--------|
| **Type** | Traditional RDBMS (on-premise or IaaS) |
| **Licensing** | Per core or CAL (Client Access License) |
| **Scalability** | Always On Availability Groups, replication |
| **Cloud Portability** | Low (Windows-centric, licensing complexity) |
| **Cost** | High |
| **Enterprise Suitability** | High |

**Strengths:**
- Full feature set: SSRS, SSIS, SSAS, Agent
- Mature tooling (SQL Server Management Studio, Profiler)
- Always On for high availability
- Strong .NET integration

**Weaknesses:**
- High licensing costs
- Windows-centric; limited Linux story
- Heavy footprint for cloud-native architectures
- Migration friction between on-premise and cloud

**Best For:** Existing on-premise investments, .NET shops with SQL Server expertise, workloads requiring SSRS/SSIS.

### 4.4 MySQL

| Attribute | Detail |
|-----------|--------|
| **Type** | Open-source relational |
| **Licensing** | GPL (commercial licenses available via Oracle) |
| **Scalability** | Read replicas, InnoDB Cluster, NDB Cluster |
| **Cloud Portability** | Good (AWS RDS, Azure, GCP) |
| **Cost** | Free |
| **Enterprise Suitability** | Medium |

**Strengths:**
- Widely adopted; large talent pool
- Simple, fast read performance
- Good replication support
- Wide driver and ORM support

**Weaknesses:**
- Limited JSON support compared to PostgreSQL
- Weaker ACID guarantees in some configurations (MyISAM)
- GPL licensing concern for proprietary distributions
- Fewer advanced features (no materialized views, limited window functions)

**Best For:** Web applications, simple schemas, read-heavy workloads, rapid prototyping.

### 4.5 Cosmos DB

| Attribute | Detail |
|-----------|--------|
| **Type** | Multi-model, globally distributed NoSQL |
| **Licensing** | Per Request Unit (RU/s) |
| **Scalability** | Unlimited (global distribution) |
| **Cloud Portability** | Azure only |
| **Cost** | High |
| **Enterprise Suitability** | High |

**Strengths:**
- Turnkey global distribution with multi-master writes
- Multiple API models: SQL, MongoDB, Cassandra, Gremlin, Table
- SLA-backed 99.999% availability
- Automatic indexing and tunable consistency levels
- Single-digit millisecond latency at 99th percentile

**Weaknesses:**
- High cost at scale (RU consumption model)
- Azure lock-in
- No JOIN operations; denormalized data model required
- Complex cost management and tuning

**Best For:** Global distribution requirements, multi-model workloads, extreme scale (millions of RPS), applications needing guaranteed low latency.

### 4.6 SQLite

| Attribute | Detail |
|-----------|--------|
| **Type** | Embedded, serverless, zero-config |
| **Licensing** | Public domain |
| **Scalability** | Single writer (WAL mode for concurrent reads) |
| **Cloud Portability** | Excellent (single file) |
| **Cost** | Free |
| **Enterprise Suitability** | Low |

**Strengths:**
- Zero configuration; single-file database
- Excellent for testing and prototyping
- Embedded in applications (mobile, desktop, IoT)
- Strong consistency within single process

**Weaknesses:**
- No concurrent write support
- No built-in authentication or networking
- Not suitable for multi-user production systems
- Limited to single-server operations

**Best For:** Unit/integration testing, mobile applications, embedded systems, local prototyping.

### 4.7 Redis

| Attribute | Detail |
|-----------|--------|
| **Type** | In-memory data structure store |
| **Licensing** | BSD (Redis Stack uses RSAL) |
| **Scalability** | Redis Cluster, Sentinel, replication |
| **Cloud Portability** | Good (Azure Cache, ElastiCache, Memorystore) |
| **Cost** | Low-Medium |
| **Enterprise Suitability** | High (as cache layer) |

**Strengths:**
- Sub-millisecond latency for read/write operations
- Rich data structures: strings, hashes, lists, sets, sorted sets, streams
- Pub/Sub for real-time messaging
- Session storage, rate limiting, job queues
- Lua scripting for atomic operations

**Weaknesses:**
- Data loss risk on restart (persistence is optional, not guaranteed)
- Memory-bounded; limited by available RAM
- Not suitable as primary data store
- Single-threaded (cluster mode mitigates but adds complexity)

**Best For:** Caching, session management, real-time analytics, message queues, rate limiting.

## 5. Comparison Matrix

| Feature | PostgreSQL | Azure SQL | SQL Server | MySQL | Cosmos DB | SQLite | Redis |
|---------|:----------:|:---------:|:----------:|:-----:|:---------:|:------:|:-----:|
| **ACID** | ✅ | ✅ | ✅ | ✅ | Partial | ✅ | ❌ |
| **JSON Support** | ✅ (JSONB) | ✅ | ✅ | Limited | ✅ | Limited | ✅ |
| **Full-text Search** | ✅ | ✅ | ✅ | ✅ | Limited | ❌ | ❌ |
| **Cloud Portability** | Excellent | Azure | Low | Good | Azure | Excellent | Good |
| **Cost** | Free | Medium | High | Free | High | Free | Low |
| **Enterprise Suitability** | High | Very High | High | Medium | High | Low | High |
| **Managed Service** | ✅ (3rd party) | ✅ (native) | ✅ | ✅ (3rd party) | ✅ (native) | ❌ | ✅ (3rd party) |
| **Horizontal Scale** | Read replicas | Elastic pools | AG/Replicas | Replicas | Unlimited | ❌ | Cluster |
| **Encryption at Rest** | ✅ | ✅ (TDE) | ✅ (TDE) | ✅ | ✅ | ❌ | ✅ |
| **Backup/Restore** | Manual/Scripted | ✅ (auto) | ✅ (auto) | Manual/Scripted | ✅ (auto) | Manual | ✅ (RDB) |

## 6. MAP Recommendation

### Primary: Azure SQL Managed Instance

Azure SQL MI is the **recommended primary database** for MAP production workloads.

**Rationale:**
- MAP is an Azure-native SaaS platform; Azure SQL MI provides seamless integration with Azure AD (Entra ID), Key Vault, Monitor, and DevOps pipelines
- Fully managed PaaS eliminates operational overhead for patching, backups, and HA
- Built-in TDE, auditing, and Advanced Threat Protection satisfy financial services compliance requirements
- Elastic pools and serverless tier optimize cost for variable migration workloads
- Geo-replication and auto-failover groups provide enterprise-grade disaster recovery
- Native .NET 8 Entity Framework Core support with minimal configuration

### Alternative: PostgreSQL

PostgreSQL is the **approved alternative** for scenarios requiring cloud portability or cost optimization.

**Rationale:**
- Permissive licensing (no vendor lock-in) enables deployment across AWS, Azure, or GCP
- Superior JSON/JSONB handling for semi-structured migration payloads
- Stronger full-text search capabilities than Azure SQL for migration report queries
- Lower infrastructure cost for development and staging environments
- Can serve as a portable deployment option for multi-cloud customers

### Architecture Decision

| Environment | Database | Rationale |
|-------------|----------|-----------|
| Production | Azure SQL MI | Managed HA, compliance, Azure integration |
| Staging | Azure SQL MI (serverless) | Cost-optimized parity with production |
| Development | PostgreSQL or Azure SQL | Developer preference; PostgreSQL for portability testing |
| Testing | SQLite | Fast, embedded, zero-configuration |
| Caching | Redis | Session management, rate limiting, real-time data |
| Prototyping | PostgreSQL | Rapid iteration, full feature set |

## 7. Schema Design Standards

### 7.1 Naming Conventions

- **Tables:** Plural, PascalCase (`MigrationJobs`, `ValidationResults`)
- **Columns:** PascalCase (`CreatedAt`, `ErrorMessage`)
- **Primary Keys:** `{TableName}Id` or `Id` (convention over configuration)
- **Foreign Keys:** `{ReferencedTable}Id` (`TenantId`, `MigrationJobId`)
- **Indexes:** `IX_{Table}_{Columns}` (`IX_MigrationJobs_TenantId`)
- **Unique Constraints:** `UQ_{Table}_{Columns}` (`UQ_Tenants_Name`)

### 7.2 Required Columns

Every table MUST include:

| Column | Type | Description |
|--------|------|-------------|
| `Id` | `uniqueidentifier` / `BIGINT` | Primary key |
| `CreatedAt` | `datetimeoffset` | UTC creation timestamp |
| `CreatedBy` | `nvarchar(128)` | Creator identity |
| `UpdatedAt` | `datetimeoffset` | UTC last modification timestamp |
| `UpdatedBy` | `nvarchar(128)` | Last modifier identity |
| `IsDeleted` | `bit` | Soft delete flag |

### 7.3 Data Types

- Use `datetimeoffset` for all timestamps (never `datetime` or `datetime2`)
- Use `nvarchar(MAX)` for variable-length text with no known upper bound
- Use `decimal(19,4)` for financial amounts
- Use `uniqueidentifier` for distributed keys; `BIGINT` for high-throughput sequences
- Use `json` / `nvarchar(MAX)` for semi-structured payloads
- Never use `TEXT`, `NTEXT`, or `IMAGE` (deprecated types)

### 7.4 Indexing

- Index all foreign key columns
- Create composite indexes for frequently filtered column combinations
- Use filtered indexes for queries targeting a subset of rows (e.g., `WHERE IsDeleted = 0`)
- Monitor index usage via DMVs; remove unused indexes quarterly

## 8. Data Access Standards

### 8.1 Entity Framework Core

- Use EF Core as the primary ORM for .NET 8 data access
- Configure with `DbContext` using Fluent API (never data annotations for complex mappings)
- Use `AsNoTracking()` for read-only queries
- Implement `IEntityTypeConfiguration<T>` for entity mappings
- Use migrations for schema changes; never modify production databases manually

### 8.2 Query Patterns

- Parameterize all queries (EF Core handles this by default)
- Use `IQueryable<T>` for composable queries; materialize with `ToListAsync()` or `FirstOrDefaultAsync()`
- Implement pagination using `Skip()` and `Take()` with deterministic ordering
- Use raw SQL via `FromSqlRaw()` only when EF Core cannot express the query
- Log slow queries (>500ms) via application telemetry

### 8.3 Connection Management

- Use connection pooling (default in EF Core)
- Store connection strings in Azure Key Vault (never in configuration files)
- Implement retry logic with exponential backoff for transient failures
- Monitor connection pool health via Application Insights

## 9. Security Standards

### 9.1 Encryption

- **At Rest:** Enable TDE (Azure SQL MI default; manual for PostgreSQL)
- **In Transit:** Enforce TLS 1.2+ for all connections
- **Sensitive Data:** Encrypt PII columns using Always Encrypted or application-level encryption
- **Key Management:** Store encryption keys in Azure Key Vault; rotate annually

### 9.2 Access Control

- Use Azure AD (Entra ID) managed identity for database authentication
- Implement least-privilege database roles:
  - `MAP_ReadOnly` — Reporting and analytics
  - `MAP_ReadWrite` — Application CRUD operations
  - `MAP_Admin` — Schema changes and maintenance
- Never use shared service accounts
- Audit all access via Azure SQL Auditing

### 9.3 Data Classification

| Classification | Examples | Handling |
|----------------|----------|----------|
| **Public** | Migration status, public reports | Standard storage |
| **Internal** | Configuration data, logs | Access control required |
| **Confidential** | PII, financial data, credentials | Encryption + access audit |
| **Restricted** | Authentication secrets, keys | Key Vault only; no database storage |

## 10. Backup and Recovery

| Policy | Detail |
|--------|--------|
| **Automated Backups** | Azure SQL MI: 7-35 day retention; configure via policy |
| **Point-in-Time Recovery** | Up to 35 days for Azure SQL MI |
| **Geo-Redundant Backup** | Enable for production workloads |
| **Restore Testing** | Quarterly restore drills to validate RPO/RTO |
| **Schema Backup** | Store EF Core migrations in source control |
| **Data Backup** | Export critical reference data weekly |

## 11. Monitoring and Performance

- Enable Query Performance Insights (Azure SQL) or `pg_stat_statements` (PostgreSQL)
- Set alerts for: DTU/vCore utilization >80%, storage >85%, deadlocks, connection pool exhaustion
- Review slow query log weekly; optimize queries exceeding 1-second execution
- Monitor index fragmentation; rebuild indexes when fragmentation exceeds 30%
- Conduct quarterly database health reviews

---

*End of MAP MVP Database Standards*
