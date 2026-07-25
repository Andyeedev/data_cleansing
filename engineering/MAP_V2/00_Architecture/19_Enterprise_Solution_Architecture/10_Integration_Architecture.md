# 10_Integration_Architecture.md

# Integration Architecture

### MAP Nexus Enterprise Solution Architecture

---

## Purpose

This document documents all system integrations, including protocols, producers, consumers, and evidence.

---

## Integration Inventory

| # | Integration | Protocol | Producer | Consumer |
|---|-------------|----------|----------|----------|
| 1 | PostgreSQL | TCP/SQL | Application | Database |
| 2 | JWT Authentication | HTTP/REST | Auth Service | Frontend |
| 3 | REST APIs | HTTP/REST | FastAPI | React Frontend |
| 4 | Workflow Engine | Internal | WorkflowService | API Routes |
| 5 | Reporting System | Internal | AuditExporter | CLI |
| 6 | Database Adapters | TCP/SQL | ConnectionFactory | Target DBs |

---

## 1. PostgreSQL (Primary Database)

### Purpose
Primary data store for all platform, engine, and core data.

### Protocol
- **Transport**: TCP/IP
- **Port**: 5432 (default)
- **Driver**: psycopg2

### Producer
- **Application**: All backend services write to PostgreSQL
- **Schemas**: `platform`, `engine`, `core`

### Consumer
- **Application**: All backend services read from PostgreSQL
- **Adapters**: `app/db/adapters/postgres_adapter.py`

### Connection Management
- **File**: `app/db/connection.py:5` — `get_db_connection()`
- **Factory**: `app/db/connection_factory.py:6` — `connection_factory(config)`
- **Legacy**: `app/db_connector.py` — `DBConnector`

### Schema Inventory
| Schema | Purpose | Key Tables |
|--------|---------|------------|
| `platform` | User management | users, roles, permissions, workflows, tasks, approvals, calendar, notifications, settings |
| `engine` | Execution data | control_registry, rule_registry, migration_control_execution, migration_governance_status |
| `core` | Migration metadata | system_registry, system_credentials, dataset_mappings, dataset_columns |

### Evidence
| Component | File Path |
|-----------|-----------|
| Connection module | `app/db/connection.py:5` |
| Connection factory | `app/db/connection_factory.py:6` |
| DBConnector | `app/db_connector.py` |
| Postgres adapter | `app/db/adapters/postgres_adapter.py` |
| Safe SQL | `app/db/safe_sql.py` |

---

## 2. JWT Authentication

### Purpose
Token-based authentication for API access with 2-hour expiry.

### Protocol
- **Transport**: HTTP/HTTPS
- **Format**: `Authorization: Bearer {token}`
- **Library**: python-jose

### Producer
- **Auth Service**: `app/services/auth_service.py:11` — issues tokens
- **JWT Handler**: `app/api/core/auth/jwt_handler.py:6` — `create_token()`

### Consumer
- **Frontend**: `MAP_V2/03_Source/frontend/src/api/client.ts:4` — attaches token
- **Audit Middleware**: `app/api/core/middleware/audit_middleware.py:16` — extracts user
- **RBAC**: `app/api/core/auth/rbac.py:7` — validates permissions

### Token Payload
```json
{
  "sub": "user_id",
  "user": "email",
  "tenant_id": "tenant_id",
  "exp": "datetime"
}
```

### Configuration
- **Secret Key**: `app/api/core/auth/jwt_config.py` — `SECRET_KEY`
- **Algorithm**: `app/api/core/auth/jwt_config.py` — `ALGORITHM`

### Evidence
| Component | File Path |
|-----------|-----------|
| JWT handler | `app/api/core/auth/jwt_handler.py:6` |
| JWT config | `app/api/core/auth/jwt_config.py` |
| Auth service | `app/services/auth_service.py:11` |
| Auth routes | `app/api/routes/auth_routes.py:16` |
| Frontend client | `MAP_V2/03_Source/frontend/src/api/client.ts:4` |
| Interceptors | `MAP_V2/03_Source/frontend/src/api/interceptors.ts:5` |

---

## 3. REST APIs (FastAPI)

### Purpose
HTTP API layer for frontend-backend communication.

### Protocol
- **Transport**: HTTP/HTTPS
- **Format**: JSON
- **Framework**: FastAPI

### Producer
- **FastAPI Application**: `app/api/main.py:33`
- **12 Routers**: `app/api/routes/*.py`

### Consumer
- **React Frontend**: `MAP_V2/03_Source/frontend/src/api/client.ts:1`
- **API Client**: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

### Endpoints
| Category | Count | Prefix |
|----------|-------|--------|
| Authentication | 1 | `/api/v1/auth` |
| Credentials | 4 | `/api/v1/credentials` |
| Systems | 4 | `/api/v1/systems` |
| Execution | 2 | `/api/v1/execution` |
| Users | 8 | `/api/v1/users` |
| Roles | 9 | `/api/v1/roles` |
| Workflows | 8 | `/api/v1/workflows` |
| Tasks | 8 | `/api/v1/tasks` |
| Approvals | 6 | `/api/v1/approvals` |
| Calendar | 6 | `/api/v1/calendar` |
| Notifications | 8 | `/api/v1/notifications` |
| Settings | 7 | `/api/v1/settings` |
| **Total** | **71** | |

### Evidence
| Component | File Path |
|-----------|-----------|
| FastAPI app | `app/api/main.py:33` |
| Route registration | `app/api/main.py:146-158` |
| API endpoints | `MAP_V2/03_Source/frontend/src/api/endpoints.ts:1` |
| API client | `MAP_V2/03_Source/frontend/src/api/client.ts:1` |

---

## 4. Workflow Engine

### Purpose
Internal workflow execution and instance management.

### Protocol
- **Transport**: Internal (Python)
- **Pattern**: Service layer

### Producer
- **Workflow Service**: `app/services/workflow_service.py:10`
- **Workflow Routes**: `app/api/routes/workflow_routes.py`

### Consumer
- **API Routes**: Workflow CRUD and execute endpoints
- **Frontend**: `src/hooks/useWorkflows.ts`

### Database Tables
- `platform.workflow_definitions` — workflow definitions
- `platform.workflow_instances` — execution instances

### Evidence
| Component | File Path |
|-----------|-----------|
| Workflow service | `app/services/workflow_service.py:10` |
| Workflow routes | `app/api/routes/workflow_routes.py` |
| Frontend hook | `MAP_V2/03_Source/frontend/src/hooks/useWorkflows.ts` |

---

## 5. Reporting System

### Purpose
Generate CSV audit packs for compliance.

### Protocol
- **Transport**: Internal (Python)
- **Format**: CSV files

### Producer
- **Audit Exporter**: `app/audit_export.py`
- **Audit Pack Service**: `app/services/audit_pack_service.py:4`

### Consumer
- **CLI**: `app/main.py:25` — `export_audit()`
- **API Routes**: Execution export endpoint

### Export Files
| File | Content |
|------|---------|
| `governance_{batch_id}.csv` | Governance decisions |
| `summary_{batch_id}.csv` | Batch execution summary |
| `control_details_{batch_id}.csv` | Control execution details |
| `exceptions_{batch_id}.csv` | Exception records |

### Evidence
| Component | File Path |
|-----------|-----------|
| Audit exporter | `app/audit_export.py` |
| Audit pack service | `app/services/audit_pack_service.py:4` |
| CLI export | `app/main.py:25` |

---

## 6. Database Adapters (7 Target Systems)

### Purpose
Connect to 7 different database platforms for migration validation.

### Protocol
- **Transport**: TCP/IP (database-specific)
- **Pattern**: Adapter pattern via factory

### Producer
- **Connection Factory**: `app/db/connection_factory.py:6` — creates adapters
- **Connection Resolver**: `app/db/connection_resolver.py:7` — resolves connections

### Consumer
- **Execution Engine**: `app/execution_engine.py:85` — uses adapters for queries
- **Rule Executor**: `app/rule_executor.py:14` — executes rules against adapters

### Adapter Inventory
| # | Adapter | File | Database |
|---|---------|------|----------|
| 1 | PostgresAdapter | `app/db/adapters/postgres_adapter.py` | PostgreSQL |
| 2 | MySQLAdapter | `app/db/adapters/mysql_adapter.py` | MySQL |
| 3 | SQLServerAdapter | `app/db/adapters/sqlserver_adapter.py` | SQL Server |
| 4 | SnowflakeAdapter | `app/db/adapters/snowflake_adapter.py` | Snowflake |
| 5 | BigQueryAdapter | `app/db/adapters/bigquery_adapter.py` | Google BigQuery |
| 6 | OracleAdapter | `app/db/adapters/oracle_adapter.py` | Oracle |
| 7 | DatabricksAdapter | `app/db/adapters/odatabricks_adapter.py` | Databricks |

### Factory Pattern
```python
# app/db/connection_factory.py:6
def connection_factory(config):
    db_type = config.get("type")
    if db_type == "postgres":
        return PostgresAdapter(config)
    elif db_type == "mysql":
        return MySQLAdapter(config)
    # ... etc
```

### Evidence
| Component | File Path |
|-----------|-----------|
| Connection factory | `app/db/connection_factory.py:6` |
| Base adapter | `app/db/adapters/base_adapter.py` |
| Connection resolver | `app/db/connection_resolver.py:7` |
| Execution engine | `app/execution_engine.py:85` |

---

## Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│         (525 files, 9 portals, 7 services)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST (JSON)
                       │ JWT Bearer Auth
┌──────────────────────▼──────────────────────────────────────┐
│                FastAPI Application                           │
│          (12 routers, ~71 endpoints)                        │
├─────────────────────────────────────────────────────────────┤
│  CORS │ Audit │ Timing │ Rate Limiting │ Error Handlers     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Service Layer (15 services)                     │
│  Auth │ Credential │ System │ Execution │ User │ Role       │
│  Workflow │ Task │ Approval │ Calendar │ Notification       │
│  Settings │ DatasetDiscovery │ MetadataIntelligence │ AuditPack │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            Execution Engine (6-step pipeline)                │
│  ConnectionResolver │ MappingResolver │ AutoRuleDiscovery   │
│  ControlExecutor │ RuleExecutor │ GovernanceEngine          │
└──────┬───────────────────────────────────────────┬─────────┘
       │                                           │
┌──────▼──────┐                          ┌─────────▼─────────┐
│  PostgreSQL │                          │  7 Database        │
│  (Platform) │                          │  Adapters          │
│  platform/  │                          │  ┌─────────────┐  │
│  engine/    │                          │  │ Postgres     │  │
│  core/      │                          │  │ MySQL        │  │
└─────────────┘                          │  │ SQL Server   │  │
                                         │  │ Snowflake    │  │
                                         │  │ BigQuery     │  │
                                         │  │ Oracle       │  │
                                         │  │ Databricks   │  │
                                         │  └─────────────┘  │
                                         └───────────────────┘
```

---

## Evidence Summary

| Integration | Protocol | Producer | Consumer | File Evidence |
|-------------|----------|----------|----------|---------------|
| PostgreSQL | TCP/SQL | Application | Database | `app/db/connection.py:5` |
| JWT Auth | HTTP/REST | Auth Service | Frontend | `app/api/core/auth/jwt_handler.py:6` |
| REST APIs | HTTP/REST | FastAPI | React | `app/api/main.py:33` |
| Workflow | Internal | WorkflowService | API | `app/services/workflow_service.py:10` |
| Reporting | Internal | AuditExporter | CLI | `app/audit_export.py` |
| DB Adapters | TCP/SQL | ConnectionFactory | Target DBs | `app/db/connection_factory.py:6` |

---

*Document Version: 1.0 | Evidence-Based: Yes | File References: 20+*
