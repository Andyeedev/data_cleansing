# Database Dump — v5.07

## Database Dumps

| File | Database | Format | Description |
|------|----------|--------|-------------|
| `db/migration_engine_v5_07.dump` | migration_engine | PostgreSQL Custom (PGDMP) | Platform database (engine, platform, audit, core, reporting schemas) |
| `db/migration_source_v5_07.dump` | migration_source | PostgreSQL Custom (PGDMP) | Source database for validation |
| `db/migration_target_v5_07.dump` | migration_target | PostgreSQL Custom (PGDMP) | Target database for validation |

---

## Dump Commands

```bash
# Engine database (platform) - Custom format
pg_dump -U postgres -d migration_engine -Fc --file=release/v5_07_task_management/db/migration_engine_v5_07.dump

# Source database - Custom format
pg_dump -U postgres -d migration_source -Fc --file=release/v5_07_task_management/db/migration_source_v5_07.dump

# Target database - Custom format
pg_dump -U postgres -d migration_target -Fc --file=release/v5_07_task_management/db/migration_target_v5_07.dump
```

---

## Restore Commands

```bash
# Restore engine database
pg_restore -U postgres -d migration_engine db/migration_engine_v5_07.dump

# Restore source database
pg_restore -U postgres -d migration_source db/migration_source_v5_07.dump

# Restore target database
pg_restore -U postgres -d migration_target db/migration_target_v5_07.dump
```

---

## Database Schema Summary

### migration_engine (115 tables)

| Schema | Tables | Views | Purpose |
|--------|--------|-------|---------|
| `core` | 27 | — | Tenant, project, system, mapping management |
| `engine` | 47 | — | Validation execution, governance, control dependencies |
| `engine_v14` | 10 | — | Legacy v1.4 schema |
| `platform` | 23 | — | User management, RBAC, workflows |
| `audit` | 5 | — | Audit trail, security events |
| `reporting` | 3 | 19 | Dimension tables, views |

### Key Tables (engine schema)

| Table | Purpose |
|-------|---------|
| `migration_batch_registry` | Batch execution records |
| `migration_control_execution` | Per-control execution results |
| `control_dependencies` | Control execution order |
| `rule_dataset_mapping` | Rule-to-dataset bindings |
| `fix_options` | Fix option records |

### migration_source
Source tables for migration validation (SQL Server, PostgreSQL, etc.)

### migration_target
Target tables for migration validation (PostgreSQL)

---

## Schema Statistics

| Metric | Count |
|--------|-------|
| Total tables | 115 |
| Total views | 19 |
| Foreign keys | 91 |
| Indexes | 220 |

---

## Version

**Version:** v5.07

**Branch:** `feature/workstream-07-task_management`
