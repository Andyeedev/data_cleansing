# Release, Commit & Database Backup — Automated Execution Prompt

## Metadata

| Field | Value |
|---|---|
| **Prompt ID** | UTIL-001 |
| **Prompt Name** | Release, Commit & Database Backup (Automated) |
| **Category** | Utilities — Operational Process |
| **Version** | 3.0 |
| **Mode** | 3-mode automated execution with pause gates |
| **Architecture Ref** | `05_Database_Architecture.md`, `11_Development_Standards.md`, `12_Platform_Integration_Architecture.md` |

---

## Naming Convention (CRITICAL)

**One identifier links everything.** The VERSION string is used everywhere — folder, tag, dumps, docs.

| Item | Uses VERSION | Example |
|---|---|---|
| Git tag | Yes | `v5.0` |
| Release folder | Yes | `release/v5.0/` |
| DB dump filenames | Yes | `migration_engine_v5.0.dump` |
| Release docs | Yes | `Release Notes — v5.0` |
| Commit message | Yes | `Release v5.0: ...` |

**Rule:** Use dots in VERSION (`v5.0`), never underscores (`v5_0`).

**Traceability:**
```
Git tag: v5.0
    ↓ matches
Release folder: release/v5.0/
    ↓ contains
DB dumps: migration_engine_v5.0.dump
    ↓ documented in
Release docs: 1_Release_notes.md (references v5.0)
    ↓ traceable via
7_GIT_Upload.md (lists exact git commands and commit hash)
```

---

## Branching Model

```
main (production — released code only)
└── MAP_V2_Development (integration — clean base)
    └── feature/workstream-XX-name (work happens here)
        ↓ merge when workstream complete
    MAP_V2_Development
        ↓ merge when ready for production
    main + tag + release docs
```

| Branch | Purpose | Protected |
|---|---|---|
| `main` | Production releases only | Yes — never commit directly |
| `MAP_V2_Development` | Integration branch, stable base | Yes — only merges from feature branches |
| `feature/*` | Active workstreams | No — commits happen here |

---

## Three Invocation Modes

### Mode 1: `START_WORK`

Creates a feature branch from `MAP_V2_Development`.

```
START_WORK — {WORKSTREAM_NAME}, e.g. START_WORK — workstream-05-administration
```

### Mode 2: `FINISH_WORK`

Merges feature branch → `MAP_V2_Development`, optionally creates release.

```
FINISH_WORK — {WORKSTREAM_NAME}, e.g. FINISH_WORK — workstream-05-administration
```

### Mode 3: `RELEASE`

Merges `MAP_V2_Development` → `main`, creates DB dumps, release docs, tags.

```
RELEASE v{VERSION} — {DESCRIPTION}, e.g. RELEASE v5.0 — workflow engine and admin panel
```

---

## Parameters

| Parameter | Required | Modes | Default | Example |
|---|---|---|---|---|
| `MODE` | Yes | All | — | `START_WORK`, `FINISH_WORK`, `RELEASE` |
| `VERSION` | Yes (RELEASE) | RELEASE | — | `v5.0` |
| `DESCRIPTION` | Yes | All | — | `workflow engine and admin panel` |
| `WORKSTREAM_NAME` | Yes | START/FINISH | — | `workstream-05-administration` |
| `CREATE_RELEASE` | No | FINISH | `no` | `yes` / `no` |
| `RELEASE_VERSION` | If create=yes | FINISH | — | `v5.0` |
| `RUN_DB_DUMPS` | No | RELEASE | `yes` | `yes` / `no` |
| `RUN_GIT_OPS` | No | All | `yes` | `yes` / `no` |
| `PG_HOST` | No | RELEASE | `127.0.0.1` | `127.0.0.1` |
| `PG_PORT` | No | RELEASE | `5432` | `5432` |
| `PG_USER` | No | RELEASE | `postgres` | `postgres` |
| `GIT_REMOTE` | No | All | `origin` | `origin` |
| `NEXT_RELEASE_VERSION` | No | RELEASE | auto-increment | `v5.1` |

---

## Sample Invocations

<!-- 
MODE 1: START_WORK — Create a feature branch to begin work
============================================================
START_WORK — workstream-05-administration

START_WORK — workstream-05-database

START_WORK — workstream-05-frontend

START_WORK — workstream-05-workflow

START_WORK — workstream-06-administration

START_WORK — workstream-07-ai-provider
-->

<!-- 
MODE 2: FINISH_WORK — Merge completed feature branch back to MAP_V2_Development
================================================================================
FINISH_WORK — workstream-05-administration

FINISH_WORK — workstream-05-database

FINISH_WORK — workstream-05-frontend
-->

<!-- 
MODE 3: RELEASE — Full release with DB dumps, docs, tag, merge to main
======================================================================
Minimal (uses all defaults):
RELEASE v5.0 — workflow engine and admin panel

With overrides (skip DB dumps):
RELEASE v5.0 — workflow engine and admin panel, skip DB dumps

With overrides (custom PG host):
RELEASE v5.0 — workflow engine and admin panel, pg host=localhost, port=5433

With overrides (custom remote):
RELEASE v5.0 — workflow engine and admin panel, remote=upstream

Full custom:
RELEASE v5.0 — workflow engine and admin panel, skip DB dumps, no git, remote=upstream, next=v5.1
-->

---

## MODE 1: START_WORK

### Purpose
Create a feature branch from `MAP_V2_Development` to begin work on a workstream.

### Invocation
```
START_WORK — workstream-05-administration
```

### Execution Steps

#### S1.1 — Validate Current Branch

```bash
git branch --show-current
```

**Verify:** Current branch is `MAP_V2_Development`.
If not, **stop and report**. Feature branches must be created from `MAP_V2_Development`.

#### S1.2 — Check Working Tree is Clean

```bash
git status --short
```

**Verify:** No uncommitted changes.
If dirty, **stop and report**. `MAP_V2_Development` must be clean before creating feature branches.

#### S1.3 — Pull Latest

```bash
git pull {GIT_REMOTE} MAP_V2_Development
```

#### S1.4 — Create Feature Branch

```bash
git checkout -b feature/{WORKSTREAM_NAME}
```

**Branch naming convention:**
```
feature/workstream-{NUMBER}-{component}
```

Examples:
- `feature/workstream-05-administration`
- `feature/workstream-05-database`
- `feature/workstream-06-frontend`
- `feature/workstream-07-ai-provider`

#### S1.5 — Push Feature Branch Upstream

```bash
git push -u {GIT_REMOTE} feature/{WORKSTREAM_NAME}
```

#### S1.6 — Confirmation

```
FEATURE BRANCH CREATED

Branch: feature/{WORKSTREAM_NAME}
Base: MAP_V2_Development ({COMMIT_HASH})
Remote: {GIT_REMOTE}/feature/{WORKSTREAM_NAME}

You can now work on this branch. When complete, invoke:
FINISH_WORK — {WORKSTREAM_NAME}
```

---

## MODE 2: FINISH_WORK

### Purpose
Merge a completed feature branch back into `MAP_V2_Development`.

### Invocation
```
FINISH_WORK — workstream-05-administration
```

### Execution Steps

#### S2.1 — Validate Feature Branch Exists

```bash
git branch --show-current
```

**Verify:** Current branch is `feature/{WORKSTREAM_NAME}`.
If not, checkout:
```bash
git checkout feature/{WORKSTREAM_NAME}
```

#### S2.2 — Check for Uncommitted Work

```bash
git status --short
```

**If dirty:** Ask user:
> "You have uncommitted changes on feature/{WORKSTREAM_NAME}. Commit them first? (yes/no)"

If yes, stage and commit (see S2.3).

#### S2.3 — Final Feature Commit (if needed)

```bash
git add .
git commit -m "Complete {WORKSTREAM_NAME}: {DESCRIPTION}"
```

#### S2.4 — Push Feature Branch

```bash
git push {GIT_REMOTE} feature/{WORKSTREAM_NAME}
```

#### S2.5 — Switch to Integration Branch

```bash
git checkout MAP_V2_Development
git pull {GIT_REMOTE} MAP_V2_Development
```

#### S2.6 — Merge Feature Branch

```bash
git merge --no-ff feature/{WORKSTREAM_NAME} -m "Merge feature/{WORKSTREAM_NAME} into MAP_V2_Development"
```

**Verify:** Merge succeeded without conflicts.
If conflicts, **stop and report**. User must resolve manually.

#### S2.7 — Push Integration Branch

```bash
git push {GIT_REMOTE} MAP_V2_Development
```

#### S2.8 — Delete Feature Branch (local)

```bash
git branch -d feature/{WORKSTREAM_NAME}
```

#### S2.9 — Delete Feature Branch (remote)

```bash
git push {GIT_REMOTE} --delete feature/{WORKSTREAM_NAME}
```

#### S2.10 — Ask for Release

> "Feature {WORKSTREAM_NAME} merged into MAP_V2_Development. Create a release now? (yes/no)"

If yes → proceed to MODE 3 (RELEASE) with `CREATE_RELEASE=yes`.
If no → done.

#### S2.11 — Confirmation

```
FEATURE COMPLETE

Merged: feature/{WORKSTREAM_NAME} → MAP_V2_Development
Commit: {MERGE_COMMIT_HASH}
Feature branch deleted (local + remote)

Next steps:
- Continue working on MAP_V2_Development
- Create more feature branches
- Or invoke RELEASE v{VERSION} — {DESCRIPTION}
```

---

## MODE 3: RELEASE

### Purpose
Merge `MAP_V2_Development` → `main`, create DB dumps, release docs, tag, and create next release branch.

### Invocation
```
RELEASE v5.0 — workflow engine and admin panel
```

### Execution Steps

#### S3.1 — Parse Parameters

Extract:
- `VERSION` — release version (e.g., `v5.0`)
- `DESCRIPTION` — release summary
- `RUN_DB_DUMPS` — default `yes`
- `RUN_GIT_OPS` — default `yes`
- `PG_HOST`, `PG_PORT`, `PG_USER` — defaults
- `GIT_REMOTE` — default `origin`
- `NEXT_RELEASE_VERSION` — auto-increment from VERSION

If VERSION missing, **ask user**.

#### S3.2 — Pre-Flight: Integration Branch

```bash
git checkout MAP_V2_Development
git status --short
git log --oneline {GIT_REMOTE}/main..MAP_V2_Development
```

**Verify:**
- Current branch is `MAP_V2_Development`
- There are commits ahead of `main` (otherwise nothing to release)

If no commits ahead, **stop and report**. Nothing to release.

#### S3.3 — Pre-Flight: PostgreSQL

```bash
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "SELECT version();"
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "\l"
```

**Verify:** PostgreSQL reachable, databases exist.

If unreachable and `RUN_DB_DUMPS=yes`, **stop and report**.
If unreachable and `RUN_DB_DUMPS=no`, continue with git-only release.

#### S3.4 — Create Release Folder

```bash
mkdir -p release/{VERSION}/backups
```

**Folder structure:**
```
release/{VERSION}/
├── 1_Release_notes.md
├── 2_Architecture.md
├── 3_Roadmap.md
├── 4_Tags.md
├── 6_Database_dump.md
├── 7_GIT_Upload.md
└── backups/
```

#### S3.5 — Database Backup (if RUN_DB_DUMPS=yes)

**Pause gate:**
> "Ready to dump 3 databases for {VERSION}. Proceed?"

If yes:

```bash
pg_dump -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_engine -F c -f release/{VERSION}/backups/migration_engine_{VERSION}.dump
pg_dump -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_source -F c -f release/{VERSION}/backups/migration_source_{VERSION}.dump
pg_dump -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_target -F c -f release/{VERSION}/backups/migration_target_{VERSION}.dump
```

**Verify:**
```bash
ls -lh release/{VERSION}/backups/*.dump
pg_restore --list release/{VERSION}/backups/migration_engine_{VERSION}.dump | head -20
```

Report dump sizes.

#### S3.6 — Generate Release Documentation

##### `1_Release_notes.md`

```markdown
# Release Notes — {VERSION}

## Release Date
{TODAY}

## Summary
{DESCRIPTION}

## Changes Since Last Release
{OUTPUT OF: git log --oneline {GIT_REMOTE}/main..MAP_V2_Development}

## Architecture
- Database: migration_engine (5 schemas: core, engine, reporting, platform, audit)
- Backend: app/ (FastAPI, Python)
- Frontend: MAP_V2/03_Source/frontend/ (React, TypeScript)
- API prefix: /api/v1/

## Database Backups
- migration_engine_{VERSION}.dump
- migration_source_{VERSION}.dump
- migration_target_{VERSION}.dump
```

##### `2_Architecture.md`

Pull from:
- `app/api/main.py` — registered routers
- `05_Database_Architecture.md` — schema list
- `11_Development_Standards.md` — conventions

##### `3_Roadmap.md`

Pull from `git log --oneline` for recent history and next milestones.

##### `4_Tags.md`

```bash
git tag -l
git branch --show-current
git log --oneline -1
```

##### `6_Database_dump.md`

```markdown
# Database Dump — {VERSION}

## Commands Used
pg_dump -U postgres -h 127.0.0.1 -d migration_engine -F c -f migration_engine_{VERSION}.dump
pg_dump -U postgres -h 127.0.0.1 -d migration_source -F c -f migration_source_{VERSION}.dump
pg_dump -U postgres -h 127.0.0.1 -d migration_target -F c -f migration_target_{VERSION}.dump

## File Sizes
{OUTPUT OF: ls -lh release/{VERSION}/backups/*.dump}

## Restore
pg_restore -U postgres -h 127.0.0.1 -d migration_engine release/{VERSION}/backups/migration_engine_{VERSION}.dump
```

##### `7_GIT_Upload.md`

```markdown
# Git Upload — {VERSION}

## Commands Executed
git checkout MAP_V2_Development
git merge --no-ff feature/{WORKSTREAM} -m "..."
git push origin MAP_V2_Development
git tag -a {VERSION} -m "Release {VERSION} - {DESCRIPTION}"
git push origin {VERSION}

## Commit Hash
{CURRENT_COMMIT}

## Tag
{VERSION}
```

#### S3.7 — Stage & Commit Release Docs

```bash
git add release/{VERSION}/
git commit -m "Release {VERSION}: release documentation and DB backups"
```

#### S3.8 — Merge to Main (if RUN_GIT_OPS=yes)

**Pause gate:**
> "Ready to merge MAP_V2_Development → main for {VERSION}. Proceed?"

If yes:

```bash
git checkout main
git pull {GIT_REMOTE} main
git merge --no-ff MAP_V2_Development -m "Release {VERSION}: {DESCRIPTION}"
```

**Verify:** Merge succeeded.

#### S3.9 — Tag on Main

```bash
git tag -a {VERSION} -m "Release {VERSION} - {DESCRIPTION}"
```

#### S3.10 — Push Main + Tag

```bash
git push {GIT_REMOTE} main
git push {GIT_REMOTE} {VERSION}
```

#### S3.11 — Return to Integration Branch

```bash
git checkout MAP_V2_Development
```

#### S3.12 — Create Next Development Branch (if NEXT_RELEASE_VERSION provided)

```bash
git checkout -b release/{NEXT_RELEASE_VERSION}
git push -u {GIT_REMOTE} release/{NEXT_RELEASE_VERSION}
git checkout MAP_V2_Development
```

**Or** continue working directly on `MAP_V2_Development` for the next feature cycle.

#### S3.13 — Post-Release Verification

```bash
git tag -l "{VERSION}"
git log --oneline -5 main
ls -lh release/{VERSION}/backups/*.dump
```

**Traceability check:**
```bash
# Verify tag exists
git tag -l "{VERSION}"

# Verify release folder exists and matches tag
ls -d release/{VERSION}/

# Verify DB dumps match version
ls release/{VERSION}/backups/*_{VERSION}.dump

# Verify docs reference correct version
grep "{VERSION}" release/{VERSION}/1_Release_notes.md
```

**All must match:**
| Check | Expected | Pass/Fail |
|---|---|---|
| Git tag | `{VERSION}` | |
| Release folder | `release/{VERSION}/` | |
| DB dump filenames | `*_{VERSION}.dump` | |
| Docs reference | `{VERSION}` | |

#### S3.14 — Final Summary

```
RELEASE COMPLETE — {VERSION}

═══════════════════════════════════════════════════
TRACEABILITY — Everything links to: {VERSION}
═══════════════════════════════════════════════════

Git Tag:        {VERSION}
Commit:         {COMMIT_HASH}
Release Folder: release/{VERSION}/

═══════════════════════════════════════════════════
RELEASE CONTENTS
═══════════════════════════════════════════════════

release/{VERSION}/
├── 1_Release_notes.md        (references {VERSION})
├── 2_Architecture.md
├── 3_Roadmap.md
├── 4_Tags.md                 (lists {VERSION})
├── 6_Database_dump.md        (lists {VERSION} dumps)
├── 7_GIT_Upload.md           (lists exact git commands)
└── backups/
    ├── migration_engine_{VERSION}.dump   ({SIZE})
    ├── migration_source_{VERSION}.dump   ({SIZE})
    └── migration_target_{VERSION}.dump   ({SIZE})

═══════════════════════════════════════════════════
BRANCH STATUS
═══════════════════════════════════════════════════

main:                   {MAIN_COMMIT} (tagged {VERSION})
MAP_V2_Development:     {DEV_COMMIT} (clean)
feature/{WORKSTREAM}:   deleted (merged)

═══════════════════════════════════════════════════
TRACKING
═══════════════════════════════════════════════════

To trace this release:
  git show {VERSION}                    → shows tag details
  cat release/{VERSION}/7_GIT_Upload.md → shows all git commands
  ls release/{VERSION}/backups/         → shows DB dumps

⚠️ Next steps:
  - Verify CI/CD pipeline passes
  - Store dump files > 100MB externally
  - Start next cycle: START_WORK — {NEXT_WORKSTREAM}
```

---

## Error Handling

| Error | Mode | Action |
|---|---|---|
| Not on MAP_V2_Development | START | Stop. Report. Must create features from integration branch. |
| Dirty working tree | START | Stop. Report. Clean or commit first. |
| Merge conflicts | FINISH | Stop. Report. User resolves manually. |
| PostgreSQL unreachable | RELEASE | Stop if DB_DUMPS=yes. Continue git-only if no. |
| pg_dump fails | RELEASE | Report error. Continue with git steps if possible. |
| Git push fails | RELEASE | Report error. Suggest `--set-upstream`. |
| Tag already exists | RELEASE | Ask: delete/recreate or use next version? |
| Nothing ahead of main | RELEASE | Stop. Report. Nothing to release. |

---

## Restore Procedure

If rollback needed after release:

```bash
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "DROP DATABASE IF EXISTS migration_engine;"
psql -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -c "CREATE DATABASE migration_engine;"
pg_restore -U {PG_USER} -h {PG_HOST} -p {PG_PORT} -d migration_engine release/{VERSION}/backups/migration_engine_{VERSION}.dump
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
| 2.0 | 2026-07-12 | MAP Nexus | Single-mode automated execution |
| 3.0 | 2026-07-12 | MAP Nexus | 3-mode branching workflow (START_WORK, FINISH_WORK, RELEASE) |
| 3.1 | 2026-07-12 | MAP Nexus | Enforced naming convention: folder = tag = dump filename, traceability checks |
