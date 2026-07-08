# Database Backup Guide — MAP V1

**Version:** v1.4.1-stable  
**Date:** 2026-07-07  

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
pg_dump -U postgres -d migration_engine -F c -f migration_engine_v1_4_1.dump
pg_dump -U postgres -d migration_source -F c -f migration_source_v1_4_1.dump
pg_dump -U postgres -d migration_target -F c -f migration_target_v1_4_1.dump
```

### Create Backup (SQL Format)

```bash
pg_dump -U postgres -d migration_engine -f migration_engine_v1_4_1.sql
```

### List Backup Contents

```bash
pg_restore -l migration_engine_v1_4_1.dump
```

---

## Restore Procedure

### Restore from Custom Format

```bash
pg_restore -U postgres -d <target_database> migration_engine_v1_4_1.dump
```

### Restore from SQL Format

```bash
psql -U postgres -d <target_database> -f migration_engine_v1_4_1.sql
```

---

## Backup Verification

| Check | Command |
|---|---|
| File exists | `ls -la *.dump` |
| File readable | `pg_restore -l <file>` |
| TOC entries | `pg_restore -l <file> | wc -l` |

---

## Backup Location (Release v1.4.1)

```
engineering/MAP_V1/01_Output/Batch_104_MAP_V1_Release_Freeze/Supporting_Evidence/
├── migration_engine_v1_4_1.dump
├── migration_source_v1_4_1.dump
└── migration_target_v1_4_1.dump
```

---

## Previous Backups

```
release/v1_4/dbs_backups/
├── engine_v1_4.dump
├── source_v1_4.dump
└── target_v1_4.dump
```

---

## Schedule Recommendations

| Environment | Frequency |
|---|---|
| Production | Daily |
| Staging | Weekly |
| Development | Before major changes |

---

**Signed off:** Batch 104 — Release v1.4.1-stable
