# Database Dump — v5.09 (PMA Assurance — Phase 5A)

## Summary

**Phase 5A made ZERO database schema changes.** No tables, columns, indexes, foreign keys, or constraints were added, altered, or dropped. `core.discovered_datasets` and `core.discovered_columns` were **not** revived.

Despite the zero schema change, this release follows the release convention of `v5_05`/`v5_07`/`v5_08` and produces fresh database snapshots — **stored as secure external backups, never in Git.**

---

## Permanent Policy — Database Dumps Are NEVER Committed to Git

| # | Policy |
|---|--------|
| 1 | Git contains **application source and release documentation only**. |
| 2 | **Database dumps are NEVER committed to Git** — never staged, never pushed, never tagged. |
| 3 | **Secure external database backups contain database-state truth.** Dumps live outside the repository on controlled storage. |
| 4 | Release documentation (this file) records **which database baseline corresponds to the v5.09 application checkpoint**. |
| 5 | No credentials, passwords, encryption keys, or sensitive database contents are exposed in Git or in this documentation. |

---

## v5.09 PRE-PMA Baseline (The Baseline for the v5.09 Application Checkpoint)

The **PRE-PMA baseline** is the approved database baseline for the v5.09 application checkpoint: a clean engine state with **715 `engine.migration_batch_registry` rows and zero PMA rows**, with all migration-state counts preserved.

| File | Database | Origin | Format | Size | TOC Entries |
|------|----------|--------|--------|------|-------------|
| `migration_engine_pre_pma_v5_09.dump` | migration_engine | Verified throwaway clone (PMA batch row removed inside the clone only) | PostgreSQL Custom (PGDMP) | 1,214,159 bytes | 781 |
| `migration_source_pre_pma_v5_09.dump` | migration_source | Direct dump of untouched live database | PostgreSQL Custom (PGDMP) | 31,892 bytes | 92 |
| `migration_target_pre_pma_v5_09.dump` | migration_target | Direct dump of untouched live database | PostgreSQL Custom (PGDMP) | 6,081 bytes | 18 |

- Generated: 2026-10-04 with `pg_dump (PostgreSQL) 17.4` (matches server 17.4 on x86_64-windows)
- All three archives validated with `pg_restore --list` (exit 0)
- Engine baseline verified from the archive itself: `engine.migration_batch_registry` extract = **715 data rows, 0 occurrences** of PMA batch `85c96a46-831e-4c97-b584-50fb8db8f06a` (`PMA-SourceDB - 2026-10-03 12:18`)
- Live development databases were **not modified** during baseline creation; the temporary clone `pre_pma_work_engine` was dropped after verification

### Storage Location (Outside Git)

These files exist in the local release working folder `release/v5_09_pma_assurance/db/` but are **excluded from Git version control** (untracked; never staged or committed). Their authoritative copies are maintained as secure external backups of database state.

### Preserved Migration-State Counts (In Baseline)

| Table | Count |
|-------|-------|
| `core.dataset_mappings` | 33 |
| `core.column_mappings` | 106 |
| `core.rule_dataset_mapping` | 320 |
| `core.dataset_columns` | 312 |
| `core.discovered_datasets` | 8 |
| `core.discovered_columns` | 16 |

---

## Post-PMA Evidence Dumps (Outside Git)

The pre-baseline (post-PMA) snapshots are preserved **outside Git** as evidence — they contain the single PMA registry row and are **not** the v5.09 baseline:

- Location: `backups_post_pma_v5_09_evidence/` (sibling of the repository root, outside the Git working tree)
- Files: `migration_engine_post_pma_v5_09.dump`, `migration_source_post_pma_v5_09.dump`, `migration_target_post_pma_v5_09.dump`

---

## Baseline ↔ Checkpoint Correspondence

- **v5.09 application checkpoint** (source + this documentation in Git) ↔ **PRE-PMA baseline files above** (clean state: 715 registry rows, 0 PMA rows, migration counts 33/106/320/312/8/16).
- Post-PMA evidence dumps correspond to the live smoke run and are reference-only; they are never restored as a baseline and never enter Git.

---

## Dump Commands (As Executed)

```bash
# Environment from .env: ENGINE_DB_HOST=localhost ENGINE_DB_PORT=5432 ENGINE_DB_USER=postgres
# (credentials passed via PGPASSWORD, never on the command line)

# Engine: dumped from verified throwaway clone (PMA row removed inside clone only)
pg_dump -h localhost -p 5432 -U postgres -d pre_pma_work_engine -Fc --file=release/v5_09_pma_assurance/db/migration_engine_pre_pma_v5_09.dump

# Source/target: direct dumps of untouched live databases
pg_dump -h localhost -p 5432 -U postgres -d migration_source -Fc --file=release/v5_09_pma_assurance/db/migration_source_pre_pma_v5_09.dump

pg_dump -h localhost -p 5432 -U postgres -d migration_target -Fc --file=release/v5_09_pma_assurance/db/migration_target_pre_pma_v5_09.dump
```

---

## Restore Commands

```bash
# Restore engine database
pg_restore -U postgres -d migration_engine db/migration_engine_pre_pma_v5_09.dump

# Restore source database
pg_restore -U postgres -d migration_source db/migration_source_pre_pma_v5_09.dump

# Restore target database
pg_restore -U postgres -d migration_target db/migration_target_pre_pma_v5_09.dump
```

---

## Database Schema Summary

### migration_engine — unchanged (115 tables)

| Schema | Tables | Purpose |
|--------|--------|---------|
| `core` | 27 | Tenant, project, system, mapping management |
| `engine` | 47 | Validation execution, governance, control dependencies |
| `engine_v14` | 10 | Legacy v1.4 schema |
| `platform` | 23 | User management, RBAC, workflows |
| `audit` | 5 | Audit trail, security events |
| `reporting` | 3 | Dimension tables, views |

*(Counts per v5.08 baseline — Phase 5A changed none of them; no DDL was executed by this workstream.)*

### What Phase 5A Wrote

| Write | Table | Type | Schema Change |
|-------|-------|------|---------------|
| PMA batch registration | `engine.migration_batch_registry` | INSERT (existing columns) + UPDATE status/end_time | **No** |

All other Phase 5A database activity is **read-only** (system registry lookup, credential resolution, `information_schema` discovery reads, health-check SELECT 1).

---

## Zero-Mapping Persistence Evidence (Live Smoke, 2026-10-03)

Counts measured before and after a full live PMA assessment — all deltas **0**:

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| `core.dataset_mappings` | 33 | 33 | **0** |
| `core.column_mappings` | 106 | 106 | **0** |
| `core.rule_dataset_mapping` | 320 | 320 | **0** |
| `core.dataset_columns` | 312 | 312 | **0** |
| `core.discovered_datasets` | 8 | 8 | **0** |
| `core.discovered_columns` | 16 | 16 | **0** |

---

## Schema Statistics

| Metric | Count | Change in 5A |
|--------|-------|--------------|
| Total tables | 115 | **+0** |
| Total views | 19 | +0 |
| Foreign keys | 91 | +0 |
| Indexes | 220 | +0 |

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`
