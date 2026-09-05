# Generate_Release_Git_Workflow.md

# Release & Git Workflow Generator

### MAP Nexus Enterprise Architecture

---

# HOW TO RUN

## Step 1: Enter Parameters Below

Scroll down to the PARAMETERS section and fill in the values.

## Step 2: Run Sub-Prompt 1

After entering parameters, give this prompt to the AI with instruction:

> "Run Sub-Prompt 1 using the parameters defined above"

## Step 3: Review Release Folder

Review the generated release folder and documentation.

## Step 4: Run Sub-Prompt 2

After review, give this prompt to the AI with instruction:

> "Run Sub-Prompt 2 using the parameters defined above"

---

# PARAMETERS

<!-- 
## ENTER YOUR PARAMETERS BELOW (replace sample values)

 WORKSTREAM_NUMBER=05
 WORKSTREAM_NAME=Task Management
 VERSION=v5.05
 RELEASE_FOLDER=release/v5_05_task_management
 FEATURE_BRANCH=feature/workstream-05-task_management

-->

<!--
## SAMPLE PARAMETERS — Workstream 06 (Example)
 WORKSTREAM_NUMBER=06
 WORKSTREAM_NAME=Notification System
 VERSION=v6.00
 RELEASE_FOLDER=release/v6_00_notification_system
 FEATURE_BRANCH=feature/workstream-06-notification_system
 -->

---

# OBJECTIVE

Generate two reusable sub-prompts for the Release & Git workflow:

1. **Sub-Prompt 1**: Create release folder with documentation
2. **Sub-Prompt 2**: Git commit and upload

This ensures every workstream follows the same release process.

---

# WORKFLOW ORDER

```
Parameters Entered (this file)
    ↓
Sub-Prompt 1: Release Folder Creation
    ↓
User Reviews Release Documentation
    ↓
Sub-Prompt 2: Git Commit & Upload
```

---

# RULES

1. **Release BEFORE Git** — never commit before release is complete
2. **PGDMP format** — database dumps must use `pg_dump -Fc`
3. **No SQL text dumps** — binary custom format only
4. **Documentation first** — all .md files must exist before commit
5. **Review required** — user must approve before proceeding
6. **Atomic commits** — separate commits for release vs other changes
7. **Push to feature branch** — not to main/master

---

# SUB-PROMPT LOCATIONS

```
engineering/MAP_V2/01_Prompts/Utilities/Release_Git_Workflow/
├── Generate_Release_Git_Workflow.md (this file)
├── Sub_Prompt_1_Release_Folder.md
└── Sub_Prompt_2_Git_Upload.md
```

---

# VERSION CONTROL

**Version:** 1.0

**Status:** Engineering Review Prompt
