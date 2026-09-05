# Sub_Prompt_1_Release_Folder.md

# Release Folder Creation

### MAP Nexus Enterprise Architecture

---

# PARAMETERS

<!-- 
## PARAMETERS ARE DEFINED IN Generate_Release_Git_Workflow.md

 Do NOT define parameters here.
 Use the parameters from the main prompt file.

 WORKSTREAM_NUMBER=  ← from main prompt
 WORKSTREAM_NAME=    ← from main prompt
 VERSION=            ← from main prompt
 RELEASE_FOLDER=     ← from main prompt
 FEATURE_BRANCH=     ← from main prompt

-->

---

# OBJECTIVE

Create a release folder containing all documentation and database dumps for a workstream release.

This is **NOT** the Git upload.

This is **NOT** the architecture promotion.

Document ONLY the release artifacts.

---

# WORKFLOW CONTEXT

This prompt runs BEFORE Sub-Prompt 2 (Git Upload).

```
Parameters Entered (Generate_Release_Git_Workflow.md)
    ↓
Sub-Prompt 1: Release Folder Creation ← YOU ARE HERE
    ↓
User Reviews Release
    ↓
Sub-Prompt 2: Git Upload
```

---

# REQUIRED STEPS

## Step 1: Verify Architecture Exists

Check that architecture documents exist:

```
engineering/MAP_V2/00_Architecture/
```

If not present, STOP and notify user.

---

## Step 2: Create Release Folder

```powershell
New-Item -ItemType Directory -Path "{RELEASE_FOLDER}" -Force
New-Item -ItemType Directory -Path "{RELEASE_FOLDER}/db" -Force
```

---

## Step 3: Generate Documentation

Create the following files:

---

### 1_Readme.md

```markdown
# {WORKSTREAM_NAME} — Release {VERSION}

## Overview

{Brief description of workstream}

## Key Changes

{List major changes}

## Release Date

{Date}

## Version

**Version:** {VERSION}

**Branch:** `{FEATURE_BRANCH}`
```

---

### 2_Architecture.md

```markdown
# Architecture — {WORKSTREAM_NAME}

## Architecture Documents

| Document | Location |
|----------|----------|
| {Doc 1} | 00_Architecture/{Path} |
| {Doc 2} | 00_Architecture/{Path} |

## Compliance Score

{Score}%

## Key Architecture Decisions

{List decisions}
```

---

### 3_Release_Note.md

```markdown
# Release Note — {VERSION}

## What's New

- {New feature 1}
- {New feature 2}

## What's Fixed

- {Bug fix 1}
- {Bug fix 2}

## What's Changed

- {Change 1}
- {Change 2}

## Breaking Changes

- {None or list}

## Migration Required

- {None or list}
```

---

### 4_Roadmap.md

```markdown
# Roadmap — {WORKSTREAM_NAME}

## Current Phase

{Phase description}

## Next Phase

{Planned work}

## Future Considerations

- {Item 1}
- {Item 2}
```

---

### 5_Tag.md

```markdown
# Release Tag — {VERSION}

## Tag Name

{VERSION}

## Tag Message

{WORKSTREAM_NAME} Release {VERSION}

## Git Command

```bash
git tag -a {VERSION} -m "{WORKSTREAM_NAME} Release {VERSION}"
git push origin {VERSION}
```
```

---

### 6_Database_dump.md

```markdown
# Database Dump — {VERSION}

## Database Dumps

| File | Database | Format | Description |
|------|----------|--------|-------------|
| `db/migration_engine_{VERSION}.dump` | migration_engine | PostgreSQL Custom (PGDMP) | Platform database |
| `db/migration_source_{VERSION}.dump` | migration_source | PostgreSQL Custom (PGDMP) | Source database |
| `db/migration_target_{VERSION}.dump` | migration_target | PostgreSQL Custom (PGDMP) | Target database |

---

## Dump Commands Used

```bash
# Engine database — Custom format
pg_dump -U postgres -d migration_engine -Fc --file=db/migration_engine_{VERSION}.dump

# Source database — Custom format
pg_dump -U postgres -d migration_source -Fc --file=db/migration_source_{VERSION}.dump

# Target database — Custom format
pg_dump -U postgres -d migration_target -Fc --file=db/migration_target_{VERSION}.dump
```

---

## Restore Commands

```bash
# Restore engine database
pg_restore -U postgres -d migration_engine db/migration_engine_{VERSION}.dump

# Restore source database
pg_restore -U postgres -d migration_source db/migration_source_{VERSION}.dump

# Restore target database
pg_restore -U postgres -d migration_target db/migration_target_{VERSION}.dump
```

---

## Database Schema Summary

### migration_engine
- `engine` — Validation execution tables
- `platform` — User management, RBAC, workflows
- `audit` — Audit trail, security events
- `core` — Tenant, project, system management
- `reporting` — Dimension tables, views

### migration_source
- Source tables for migration validation

### migration_target
- Target tables for migration validation

---

## Version

**Version:** {VERSION}

**Branch:** `{FEATURE_BRANCH}`
```

---

### 7_GIT_Upload.md

```markdown
# Git Upload — {VERSION}

## Prerequisites

- [ ] Release folder created
- [ ] All documentation files present
- [ ] Database dumps in PGDMP format
- [ ] User approved for upload

---

## Git Commands

```bash
# 1. Check status
git status

# 2. Stage release folder
git add {RELEASE_FOLDER}/

# 3. Commit release
git commit -m "release({WORKSTREAM_NUMBER}): {VERSION} - {WORKSTREAM_NAME} Release"

# 4. Push to feature branch
git push origin {FEATURE_BRANCH}
```

---

## Verification

```bash
# Verify commit
git log --oneline -5

# Verify push
git status
```

---

## Rollback (if needed)

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## Version

**Version:** {VERSION}

**Branch:** `{FEATURE_BRANCH}`
```

---

## Step 4: Generate Database Dumps

```powershell
# Engine database
$env:PGPASSWORD="********"; pg_dump -U postgres -d migration_engine -Fc --file="{RELEASE_FOLDER}/db/migration_engine_{VERSION}.dump"

# Source database
$env:PGPASSWORD="********"; pg_dump -U postgres -d migration_source -Fc --file="{RELEASE_FOLDER}/db/migration_source_{VERSION}.dump"

# Target database
$env:PGPASSWORD="********"; pg_dump -U postgres -d migration_target -Fc --file="{RELEASE_FOLDER}/db/migration_target_{VERSION}.dump"
```

---

## Step 5: Verify Folder Structure

```
{RELEASE_FOLDER}/
├── db/
│   ├── migration_engine_{VERSION}.dump
│   ├── migration_source_{VERSION}.dump
│   └── migration_target_{VERSION}.dump
├── 1_Readme.md
├── 2_Architecture.md
├── 3_Release_Note.md
├── 4_Roadmap.md
├── 5_Tag.md
├── 6_Database_dump.md
└── 7_GIT_Upload.md
```

---

# RULES

1. **PGDMP format only** — no SQL text dumps
2. **All 7 documents required** — no missing files
3. **Verify before proceeding** — check folder structure
4. **Stop for review** — user must approve before Sub-Prompt 2

---

# ENGINEERING REVIEW

Present all generated artefacts for review.

Stop after generation.

Await explicit user approval.

Nothing shall be promoted automatically.

---

# SUCCESS CRITERIA

- [ ] Release folder exists
- [ ] db/ folder exists
- [ ] 3 database dumps in PGDMP format
- [ ] All 7 documentation files present
- [ ] All parameter placeholders replaced
- [ ] User approved for Git upload

---

# VERSION CONTROL

**Version:** 1.0

**Status:** Engineering Review Prompt
