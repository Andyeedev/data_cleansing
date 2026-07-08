# Database Backup Report

**Batch:** 104 — MAP V1 Release Freeze Preparation (Prompt v2.0)  
**Date:** 2026-07-08  
**Release:** MAP V1 Version 4.1  
**PostgreSQL Version:** 17.4  

---

## Summary

Fresh production backups created for all three databases using official release naming convention. All backups validated and stored in the release directory.

---

## Backup Details

| Database | Dump File | Size | TOC Entries | Status |
|---|---|---|---|---|
| `migration_engine` | `MAP_V1_v4.1_migration_engine.dump` | 0.61 MB | 408 | Verified |
| `migration_source` | `MAP_V1_v4.1_migration_source.dump` | 0.005 MB | 18 | Verified |
| `migration_target` | `MAP_V1_v4.1_migration_target.dump` | 0.006 MB | 23 | Verified |

---

## Backup Location

```
release/MAP_V1_v4.1/database/
├── MAP_V1_v4.1_migration_engine.dump
├── MAP_V1_v4.1_migration_source.dump
└── MAP_V1_v4.1_migration_target.dump
```

---

## Validation

| Check | Result |
|---|---|
| Backup created | PASS |
| Backup readable (`pg_restore -l`) | PASS |
| Custom format (`-F c`) | PASS |
| Checksum verified | PASS |

---

## Backup Command Used

```bash
pg_dump -U postgres -d <database_name> -F c -f MAP_V1_v4.1_<database_name>.dump
```

---

## Restore Command (Reference)

```bash
pg_restore -U postgres -d <target_database> <dump_file>
```

---

## Notes

- All backups use PostgreSQL custom format (`-F c`) for flexible restore options
- Fresh dumps created (not reused from previous runs)
- Source and target databases are minimal (18 and 23 TOC entries respectively)
- Engine database contains full platform schema (408 TOC entries)

**Signed off:** Batch 104 — Phase 2 Complete
