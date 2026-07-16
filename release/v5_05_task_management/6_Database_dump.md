# Database Dump — v5.05

## Database Dumps

| File | Database | Description |
|------|----------|-------------|
| `db/migration_engine_v5_05.dump` | migration_engine | Platform database (engine, platform, audit, core, reporting schemas) |
| `db/migration_source_v5_05.dump` | migration_source | Source database for validation |
| `db/migration_target_v5_05.dump` | migration_target | Target database for validation |

---

## Dump Commands Used

```bash
# Engine database (platform)
pg_dump -U postgres -d migration_engine --file=db/migration_engine_v5_05.dump

# Source database
pg_dump -U postgres -d migration_source --file=db/migration_source_v5_05.dump

# Target database
pg_dump -U postgres -d migration_target --file=db/migration_target_v5_05.dump
```

---

## Restore Commands

```bash
# Restore engine database
psql -U postgres -d migration_engine -f db/migration_engine_v5_05.dump

# Restore source database
psql -U postgres -d migration_source -f db/migration_source_v5_05.dump

# Restore target database
psql -U postgres -d migration_target -f db/migration_target_v5_05.dump
```

---

## Database Schema Summary

### migration_engine
- `engine` — Validation execution tables
- `platform` — User management, RBAC, workflows
- `audit` — Audit trail, security events
- `core` — Tenant, project, system management
- `reporting` — Dimension tables, views

### migration_source
- Source tables for migration validation

### migration_target
- Target tables for migration validation

---

## Version

**Version:** v5.05

**Branch:** `feature/workstream-05-task_management`
