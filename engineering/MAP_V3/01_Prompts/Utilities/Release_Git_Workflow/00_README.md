# Release & Git Workflow — Instructions

## Overview

This workflow generates release documentation and uploads to Git.

It consists of 3 files:

| File | Purpose |
|------|---------|
| `Generate_Release_Git_Workflow.md` | Entry point — parameters go here |
| `Sub_Prompt_1_Release_Folder.md` | Creates release folder with docs |
| `Sub_Prompt_2_Git_Upload.md` | Commits and pushes to GitHub |

---

## How To Run

### Step 1: Open Main Prompt

Open `Generate_Release_Git_Workflow.md`

### Step 2: Enter Parameters

Fill in the PARAMETERS section:

```markdown
 WORKSTREAM_NUMBER=05
 WORKSTREAM_NAME=Task Management
 VERSION=v5.05
 RELEASE_FOLDER=release/v5_05_task_management
 FEATURE_BRANCH=feature/workstream-05-task_management
```

### Step 3: Run Sub-Prompt 1

Copy this prompt to the AI:

```
Run Sub_Prompt_1_Release_Folder.md using the parameters defined in Generate_Release_Git_Workflow.md
```

### Step 4: Review Release Folder

Check that all files were created:
- `release/v5_05_task_management/`
- `release/v5_05_task_management/db/` (3 .dump files)
- 7 documentation files

### Step 5: Run Sub-Prompt 2

Copy this prompt to the AI:

```
Run Sub_Prompt_2_Git_Upload.md using the parameters defined in Generate_Release_Git_Workflow.md
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────┐
│  1. Enter Parameters                    │
│     Generate_Release_Git_Workflow.md    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. Run Sub-Prompt 1                    │
│     Sub_Prompt_1_Release_Folder.md      │
│                                         │
│     Creates:                            │
│     - release/v{X}_{name}/              │
│     - 7 documentation files             │
│     - 3 database dumps (PGDMP)         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. Review Release Folder               │
│     User approves before continuing     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. Run Sub-Prompt 2                    │
│     Sub_Prompt_2_Git_Upload.md          │
│                                         │
│     Runs:                               │
│     - git add release/v{X}_{name}/      │
│     - git commit                        │
│     - git push origin feature/...       │
└─────────────────────────────────────────┘
```

---

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `WORKSTREAM_NUMBER` | Workstream number | 05 |
| `WORKSTREAM_NAME` | Workstream name | Task Management |
| `VERSION` | Version string | v5.05 |
| `RELEASE_FOLDER` | Release folder path | release/v5_05_task_management |
| `FEATURE_BRANCH` | Git branch name | feature/workstream-05-task_management |

---

## Folder Structure After Completion

```
release/v5_05_task_management/
├── db/
│   ├── migration_engine_v5_05.dump
│   ├── migration_source_v5_05.dump
│   └── migration_target_v5_05.dump
├── 1_Readme.md
├── 2_Architecture.md
├── 3_Release_Note.md
├── 4_Roadmap.md
├── 5_Tag.md
├── 6_Database_dump.md
└── 7_GIT_Upload.md
```

---

## Rules

1. **Release BEFORE Git** — never commit before release is complete
2. **PGDMP format only** — database dumps must use `pg_dump -Fc`
3. **All 7 documents required** — no missing files
4. **Review required** — user must approve before Sub-Prompt 2
5. **Feature branch only** — never push to main/master

---

## Troubleshooting

### "Release folder not found"
Run Sub-Prompt 1 first.

### "Database dump failed"
Check PostgreSQL connection and credentials.

### "Git push rejected"
Check you're on the correct feature branch.

### "Permission denied"
Check Git credentials and repository access.

---

**Version:** 1.0
