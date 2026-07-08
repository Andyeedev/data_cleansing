# Database Backup Guide — MAP V1

**Version:** 4.1  
**Date:** 2026-07-08  

---

## Overview

This guide documents the database backup and restore procedures for MAP V1.

---

## Databases

| Database | Purpose | Default Name |
|---|---|---|
| Engine | Platform metadata, credentials, execution history | `migration_engine` |
| Source | Migration source database (test data) | `migration_source` |
| Target | Migration target database (test data) | `migration_target` |

---

## Backup Procedure

### Create Backup (Custom Format)

```bash
pg_dump -U postgres -d migration_engine -F c -f MAP_V1_v4.1_migration_engine.dump
pg_dump -U postgres -d migration_source -F c -f MAP_V1_v4.1_migration_source.dump
pg_dump -U postgres -d migration_target -F c -f MAP_V1_v4.1_migration_target.dump
```

### Create Backup (SQL Format)

```bash
pg_dump -U postgres -d migration_engine -f MAP_V1_v4.1_migration_engine.sql
```

### List Backup Contents

```bash
pg_restore -l MAP_V1_v4.1_migration_engine.dump
```

---

## Restore Procedure

### Restore from Custom Format

```bash
pg_restore -U postgres -d <target_database> MAP_V1_v4.1_migration_engine.dump
```

### Restore from SQL Format

```bash
psql -U postgres -d <target_database> -f MAP_V1_v4.1_migration_engine.sql
```

---

## Backup Verification

| Check | Command |
|---|---|
| File exists | `ls -la *.dump` |
| File readable | `pg_restore -l <file>` |
| TOC entries | `pg_restore -l <file> | wc -l` |

---

## Backup Location (Version 4.1)

```
release/MAP_V1_v4.1/database/
├── MAP_V1_v4.1_migration_engine.dump
├── MAP_V1_v4.1_migration_source.dump
└── MAP_V1_v4.1_migration_target.dump
```

---

## Schedule Recommendations

| Environment | Frequency |
|---|---|
| Production | Daily |
| Staging | Weekly |
| Development | Before major changes |

---

**Signed off:** Batch 104 — MAP V1 Version 4.1
