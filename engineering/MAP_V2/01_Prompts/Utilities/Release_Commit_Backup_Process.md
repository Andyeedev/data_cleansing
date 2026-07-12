# Release, Commit & Database Backup — Automated Execution Prompt

## Metadata

| Field | Value |
|---|---|
| **Prompt ID** | UTIL-001 |
| **Prompt Name** | Release, Commit & Database Backup (Automated) |
| **Category** | Utilities — Operational Process |
| **Version** | 2.0 |
| **Mode** | Automated execution with pause gates |
| **Applies To** | Any workstream release |
| **Architecture Ref** | `05_Database_Architecture.md`, `11_Development_Standards.md`, `12_Platform_Integration_Architecture.md` |

---

## How to Invoke

Provide these parameters when invoking:

```
Release v{VERSION} — {DESCRIPTION}, branch {BRANCH_NAME}
```

### Parameters

| Parameter | Required | Default | Example |
|---|---|---|---|
| `VERSION` | Yes | — | `v5.0` |
| `DESCRIPTION` | Yes | — | `workflow engine and admin panel` |
| `BRANCH_NAME` | Yes | — | `v5.0-workflow-engine` |
| `CREATE_NEXT_BRANCH` | No | `yes` | `yes` / `no` |
| `NEXT_BRANCH_NAME` | If next=yes | — | `v5.1-ai-integration` |
| `RUN_DB_DUMPS` | No | `yes` | `yes` / `no` |
| `RUN_GIT_OPS` | No | `yes` | `yes` / `no` |
| `PG_HOST` | No | `127.0.0.1` | `127.0.0.1` |
| `PG_PORT` | No | `5432` | `5432` |
| `PG_USER` | No | `postgres` | `postgres` |
| `GIT_REMOTE` | No | `origin` | `origin` |

### Example Invocations

**Minimal (defaults):**
> Release v5.0 — workflow engine and admin panel, branch v5.0-workflow-engine

**Custom:**
> Release v5.0 — workflow engine, branch v5.0-workflow, skip DB dumps, no next branch

**Full custom:**
> Release v5.0 — workflow engine, branch v5.0-wf, pg host=localhost, port=5433, git remote=upstream

---

## Execution Steps

**IMPORTANT:** Follow each step in order. After each step, report the result. If a step fails, stop and report the error before continuing.

---

### STEP 1 — Parse Parameters

Extract from the user's invocation:
- `VERSION` — the version string (e.g., `v5.0`)
- `DESCRIPTION` — release summary
- `BRANCH_NAME` — git branch name
- `CREATE_NEXT_BRANCH` — default `yes`
- `NEXT_BRANCH_NAME` — required if CREATE_NEXT_BRANCH = yes
- `RUN_DB_DUMPS` — default `yes`
- `RUN_GIT_OPS` — default `yes`
- `PG_HOST` — default `127.0.0.1`
- `PG_PORT` — default `5432`
- `PG_USER` — default `postgres`
- `GIT_REMOTE` — default `origin`

If any required parameter is missing, **ask the user** before proceeding.

---

### STEP 2 — Pre-Flight Checks

Run these commands and report results:

```bash
git status
git branch
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "SELECT version();"
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "\l"
```

**Verify:**
- PostgreSQL is reachable
- Databases `migration_engine`, `migration_source`, `migration_target` exist
- Git repo is in a valid state

If PostgreSQL is unreachable, **stop and report**.

---

### STEP 3 — Create Release Folder Structure

Create the release documentation folder:

```
release/v{VERSION}/
├── 1_Release_notes.md
├── 2_Architecture.md
├── 3_Roadmap.md
├── 4_Tags.md
├── 6_Database_dump.md
├── 7_GIT_Upload.md
└── backups/
```

**Actions:**
1. Create directory `release/v{VERSION}/backups/`
2. Generate each document (see Step 4)

---

### STEP 4 — Generate Release Documentation

#### 4a. `1_Release_notes.md`

Generate with:
- Version number
- Release date (today)
- Description from parameters
- Major changes list (pull from `git log --oneline` since last tag)
- Architecture summary

**Template:**
```markdown
# Release Notes — v{VERSION}

## Release Date
{TODAY}

## Summary
{DESCRIPTION}

## Changes Since Last Release
{GIT_LOG_OUTPUT}

## Architecture
- Database: migration_engine (5 schemas: core, engine, reporting, platform, audit)
- Backend: app/ (FastAPI, Python)
- Frontend: MAP_V2/03_Source/frontend/ (React, TypeScript)
- API prefix: /api/v1/
```

#### 4b. `2_Architecture.md`

Generate with:
- System overview
- 5-schema database model
- API endpoints summary
- Tech stack

**Pull current state from:**
- `app/api/main.py` — registered routers
- `05_Database_Architecture.md` — schema list
- `11_Development_Standards.md` — conventions

#### 4c. `3_Roadmap.md`

Generate with:
- Completed milestones
- Current status
- Next phase items

#### 4d. `4_Tags.md`

Generate with:
- Git tag list
- Current tag
- Branch info

**Command:**
```bash
git tag -l
git branch --show-current
```

#### 4e. `6_Database_dump.md`

Generate with:
- pg_dump commands used
- Dump filenames and sizes
- Restore instructions

#### 4f. `7_GIT_Upload.md`

Generate with:
- Git commands executed during this release
- Commit hash
- Tag name
- Branch name

---

### STEP 5 — Database Backup (if RUN_DB_DUMPS = yes)

**Pause gate:** Ask user:
> "Ready to run database backups for {VERSION}. Proceed?"

If yes:

```bash
pg_dump -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_engine -F c -f release/v{VERSION}/backups/migration_engine_{VERSION}.dump
pg_dump -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_source -F c -f release/v{VERSION}/backups/migration_source_{VERSION}.dump
pg_dump -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_target -F c -f release/v{VERSION}/backups/migration_target_{VERSION}.dump
```

**Verify:**
```bash
ls -lh release/v{VERSION}/backups/*.dump
pg_restore --list release/v{VERSION}/backups/migration_engine_{VERSION}.dump | head -20
```

Report dump file sizes and confirm non-zero.

If `RUN_DB_DUMPS = no`, skip and note "Database backups skipped per user request."

---

### STEP 6 — Stage & Commit (if RUN_GIT_OPS = yes)

**Pause gate:** Ask user:
> "Ready to commit. Commit message: 'Release {VERSION}: {DESCRIPTION}'. Proceed?"

If yes:

```bash
git add .
git status
git commit -m "Release {VERSION}: {DESCRIPTION}"
```

Report commit hash.

---

### STEP 7 — Push to Remote (if RUN_GIT_OPS = yes)

```bash
git push --set-upstream {GIT_REMOTE} {BRANCH_NAME}
git push
```

If push fails (e.g., upstream not set), report the error and suggest fix.

---

### STEP 8 — Tag Release (if RUN_GIT_OPS = yes)

```bash
git tag -a {VERSION} -m "Release {VERSION} - {DESCRIPTION}"
git push {GIT_REMOTE} {VERSION}
```

Report tag confirmation.

---

### STEP 9 — Create Next Branch (if CREATE_NEXT_BRANCH = yes)

```bash
git checkout -b {NEXT_BRANCH_NAME}
git push -u {GIT_REMOTE} {NEXT_BRANCH_NAME}
```

Report new branch confirmation.

---

### STEP 10 — Update Release Documentation

After all operations complete, update the generated docs with actual results:

- `1_Release_notes.md` — add commit hash, tag
- `4_Tags.md` — add new tag
- `6_Database_dump.md` — add actual dump file sizes
- `7_GIT_Upload.md` — add exact commands run and their output

---

### STEP 11 — Post-Release Verification

Run verification checks:

```bash
git tag -l "{VERSION}"
git log --oneline -5
ls -lh release/v{VERSION}/backups/*.dump
```

Report results.

---

### STEP 12 — Final Summary

Report to user:

```
RELEASE COMPLETE — v{VERSION}

✅ Documents created:
   - release/v{VERSION}/1_Release_notes.md
   - release/v{VERSION}/2_Architecture.md
   - release/v{VERSION}/3_Roadmap.md
   - release/v{VERSION}/4_Tags.md
   - release/v{VERSION}/6_Database_dump.md
   - release/v{VERSION}/7_GIT_Upload.md

✅ Database backups:
   - migration_engine_{VERSION}.dump ({SIZE})
   - migration_source_{VERSION}.dump ({SIZE})
   - migration_target_{VERSION}.dump ({SIZE})

✅ Git:
   - Commit: {COMMIT_HASH}
   - Tag: {VERSION}
   - Branch: {BRANCH_NAME}
   - Next branch: {NEXT_BRANCH_NAME}

⚠️ Notes:
   - Dump files > 100MB should be stored externally
   - Verify CI/CD pipeline passes on {GIT_REMOTE}
```

---

## Error Handling

| Error | Action |
|---|---|
| PostgreSQL unreachable | Stop. Report. Do not proceed with DB dumps. |
| pg_dump fails | Report error. Continue with git steps if possible. |
| Git commit fails | Report error. Do not proceed with push/tag. |
| Git push fails | Report error. Suggest `git push --set-upstream` or remote check. |
| Tag already exists | Ask user: delete and recreate, or use next version? |
| Branch already exists | Ask user: use existing branch or create new name? |

---

## Restore Procedure

If rollback is needed after release:

```bash
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "DROP DATABASE IF EXISTS migration_engine;"
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "CREATE DATABASE migration_engine;"
pg_restore -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_engine release/v{VERSION}/backups/migration_engine_{VERSION}.dump
```

---

## Architecture References

| Document | Relevance |
|---|---|
| `05_Database_Architecture.md` | 5-schema model (core, engine, reporting, platform, audit) |
| `11_Development_Standards.md` | Backend root is `app/`, API prefix `/api/v1/` |
| `12_Platform_Integration_Architecture.md` | Schema ownership and platform layers |

---

## Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-12 | MAP Nexus | Manual checklist version |
| 2.0 | 2026-07-12 | MAP Nexus | Automated execution with pause gates |
