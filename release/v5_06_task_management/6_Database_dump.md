# Database Dump — v5.06

## Database Dumps

| File | Database | Format | Description |
|------|----------|--------|-------------|
| `db/migration_engine_v5_06.dump` | migration_engine | PostgreSQL Custom (PGDMP) | Platform database (engine, platform, audit, core, reporting schemas) |
| `db/migration_source_v5_06.dump` | migration_source | PostgreSQL Custom (PGDMP) | Source database for validation |
| `db/migration_target_v5_06.dump` | migration_target | PostgreSQL Custom (PGDMP) | Target database for validation |

---

## Dump Commands Used

```bash
# Engine database (platform) - Custom format
pg_dump -U postgres -d migration_engine -Fc --file=db/migration_engine_v5_06.dump

# Source database - Custom format
pg_dump -U postgres -d migration_source -Fc --file=db/migration_source_v5_06.dump

# Target database - Custom format
pg_dump -U postgres -d migration_target -Fc --file=db/migration_target_v5_06.dump
```

---

## Restore Commands

```bash
# Restore engine database
pg_restore -U postgres -d migration_engine db/migration_engine_v5_06.dump

# Restore source database
pg_restore -U postgres -d migration_source db/migration_source_v5_06.dump

# Restore target database
pg_restore -U postgres -d migration_target db/migration_target_v5_06.dump
```

---

## Database Schema Summary

### migration_engine
- `engine` — Validation execution tables (14 tables)
- `platform` — User management, RBAC, workflows (28 tables)
- `audit` — Audit trail, security events (5 tables)
- `core` — Tenant, project, system management (7 tables)
- `reporting` — Dimension tables, views (3 tables)
- `engine_v14` — Legacy v1.4 schema (22 tables)

### migration_source
- Source tables for migration validation

### migration_target
- Target tables for migration validation

---

## Version

**Version:** v5.06

**Branch:** `feature/v5_06_baseline`
