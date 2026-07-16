# Database Dump — v5.0

## Target Database

```
migration_engine
```

---

## Dump Files

| File | Schema | Description |
|------|--------|-------------|
| `db/migration_engine.dump` | engine | Validation execution tables |
| `db/migration_platform.dump` | platform | User management, RBAC, workflows |
| `db/migration_audit.dump` | audit | Audit trail, security events |
| `db/migration_core.dump` | core | Tenant, project, system management |

---

## Dump Commands Used

```bash
# Engine schema
pg_dump -U postgres -d migration_engine -n engine --file=db/migration_engine.dump

# Platform schema
pg_dump -U postgres -d migration_engine -n platform --file=db/migration_platform.dump

# Audit schema
pg_dump -U postgres -d migration_engine -n audit --file=db/migration_audit.dump

# Core schema
pg_dump -U postgres -d migration_engine -n core --file=db/migration_core.dump
```

---

## Restore Commands

```bash
# Restore engine schema
psql -U postgres -d migration_engine -f db/migration_engine.dump

# Restore platform schema
psql -U postgres -d migration_engine -f db/migration_platform.dump

# Restore audit schema
psql -U postgres -d migration_engine -f db/migration_audit.dump

# Restore core schema
psql -U postgres -d migration_engine -f db/migration_core.dump
```

---

## Notes

- Dumps include schema and data
- Excludes large demo data
- Production dumps should be encrypted

---

## Version

**Version:** v5.0

**Branch:** `feature/workstream-05-task_management`
