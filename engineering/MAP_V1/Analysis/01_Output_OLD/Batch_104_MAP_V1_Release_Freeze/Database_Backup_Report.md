# Database Backup Report

**Batch:** 104 — MAP V1 Release Freeze Preparation  
**Date:** 2026-07-07  
**Version:** v1.4.1-stable  
**PostgreSQL Version:** 17.4  

---

## Summary

All three database backups created, validated, and stored in the release evidence directory.

---

## Backup Details

| Database | Dump File | Size | TOC Entries | Status |
|---|---|---|---|---|
| `migration_engine` | `migration_engine_v1_4_1.dump` | 0.61 MB | 408 | Verified |
| `migration_source` | `migration_source_v1_4_1.dump` | 0.005 MB | 18 | Verified |
| `migration_target` | `migration_target_v1_4_1.dump` | 0.006 MB | 23 | Verified |

---

## Backup Location

```
engineering/MAP_V1/01_Output/Batch_104_MAP_V1_Release_Freeze/Supporting_Evidence/
├── migration_engine_v1_4_1.dump
├── migration_source_v1_4_1.dump
└── migration_target_v1_4_1.dump
```

---

## Validation

| Check | Result |
|---|---|
| Backup created | PASS |
| Backup readable (`pg_restore -l`) | PASS |
| Custom format (`-F c`) | PASS |
| gzip compression | PASS |

---

## Backup Command Used

```bash
pg_dump -U postgres -d <database_name> -F c -f <output_path>
```

---

## Restore Command (Reference)

```bash
pg_restore -U postgres -d <target_database> <dump_file>
```

---

## Notes

- All backups use PostgreSQL custom format (`-F c`) for flexible restore options
- Source and target databases are minimal (18 and 23 TOC entries respectively)
- Engine database contains full platform schema (408 TOC entries)

**Signed off:** Batch 104 — Phase 2 Complete
