# Git Upload Instructions — v5.09 (PMA Assurance — Phase 5A)

> **STATUS: NOT YET EXECUTED.** No commit, push, branch creation, or tag has been performed.
> Run these steps only when the Git checkpoint is approved.

## Permanent Policy — What May Enter Git

| Allowed in Git | NEVER in Git |
|----------------|--------------|
| Application source code | Database dumps (`*.dump`) — never staged, never committed, never pushed |
| Release documentation (`release/v5_09_pma_assurance/*.md`) | Credentials, passwords, encryption keys |
| | Sensitive database contents |

- Git contains **application source and release documentation only**.
- **Secure external database backups contain database-state truth** (see `6_Database_dump.md`).
- The v5.09 PRE-PMA baseline files (`migration_engine_pre_pma_v5_09.dump`, `migration_source_pre_pma_v5_09.dump`, `migration_target_pre_pma_v5_09.dump`) are stored **outside Git**.
- Post-PMA evidence dumps remain outside Git under `backups_post_pma_v5_09_evidence/`.

---

## Step 1 — Check Status

```bash
git status
```

Expected documentation checkpoint state (current):

```
A  release/v5_09_pma_assurance/1_Readme.md
A  release/v5_09_pma_assurance/2_Architecture.md
A  release/v5_09_pma_assurance/3_Release_Note.md
A  release/v5_09_pma_assurance/4_Roadmap.md
A  release/v5_09_pma_assurance/5_Tag.md
A  release/v5_09_pma_assurance/6_Database_dump.md
A  release/v5_09_pma_assurance/7_GIT_Upload.md
A  release/v5_09_pma_assurance/8_Architecture_Baseline.md
```

Expected Phase 5A additions (new files only, unstaged until approved):

```
?? app/pma/
?? tests/test_pma_assessment_context.py
?? tests/test_pma_orchestrator.py
```

No pre-existing application file was modified by Phase 5A or this documentation checkpoint.

---

## Step 2 — Create New Branch

```bash
git checkout -b feature/workstream-08-pma_assurance
```

---

## Step 3 — Add Files (Source + Documentation Only)

```bash
git add app/pma tests/test_pma_assessment_context.py tests/test_pma_orchestrator.py
git add release/v5_09_pma_assurance/*.md
```

> **Never** `git add` the `db/` folder or any `*.dump` file. The `release/v5_09_pma_assurance/db/`
> directory is excluded from version control by policy.

---

## Step 4 — Pre-Commit Verification (Mandatory)

```bash
# 1) Zero database dumps staged
git diff --cached --name-only | grep -c '\.dump$'        # must print 0

# 2) Only intended files staged
git diff --cached --name-only

# 3) No secrets staged
git diff --cached | grep -iE 'password|passwd|secret|api_key|encryption_key'   # must print nothing
```

If any check fails: **STOP** — unstage the offending files and re-run.

---

## Step 5 — Commit

```bash
git commit -m "v5.09: PMA Assurance Phase 5A - PMA Foundation

- PmaAssessmentOrchestrator: single-system assessment flow (service layer, no routes)
- A1 in-process Assessment Context (no table, no column, not durable)
- Single-system selection via existing tenant/project/system ownership rules
- Connection/health gate: probe -> connect -> SELECT 1 (blocks discovery on failure)
- Single-system discovery: list_tables() -> list_columns() (no source/target pair)
- B1 in-memory working set, identity schema.table, no FK invention, no C09 heuristic
- PMA batch identity: PMA-{system_name} - {YYYY-MM-DD HH:MM} + uuid4, existing registry
- Zero migration mappings, zero column mappings, zero schema changes
- discovered_* model not revived, no PMA controls executed
- Migration Assurance unchanged (0 existing files modified)
- Tests A-J: 21/21 passed; live PostgreSQL smoke verified (mapping counts unchanged)
- Database dumps excluded from Git (policy): PRE-PMA baseline held as external backup

Total: PMA Phase 5A foundation complete."
```

---

## Step 6 — Push Branch

```bash
git push --set-upstream origin feature/workstream-08-pma_assurance
git push
```

---

## Step 7 — Tag Release

```bash
git tag -a v5.09-pma_assurance_5a -m "v5.09: PMA Assurance Phase 5A - PMA Foundation (orchestrator, context, single-system discovery, working set, batch identity)"
git push origin v5.09-pma_assurance_5a
```

---

## Step 8 — Create Next Phase Branch (Optional)

```bash
git checkout -b feature/v5_09-pma-phase5b
git push -u origin feature/v5_09-pma-phase5b
```

---

## Summary

After completion, repository will be:

- ✅ Versioned (v5.09)
- ✅ Tagged (`v5.09-pma_assurance_5a`)
- ✅ Branched (`feature/workstream-08-pma_assurance`)
- ✅ **Free of database dumps** (baseline + evidence held outside Git)
- ✅ Ready for Phase 5B (NOT IMPLEMENTED yet)

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Tag:** `v5.09-pma_assurance_5a`
