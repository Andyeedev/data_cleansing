# Sub_Prompt_2_Git_Upload.md

# Git Upload

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

Commit and push the release folder to GitHub.

This is **NOT** the release folder creation.

This runs AFTER Sub-Prompt 1 is approved.

---

# WORKFLOW CONTEXT

```
Parameters Entered (Generate_Release_Git_Workflow.md)
    ↓
Sub-Prompt 1: Release Folder Creation
    ↓
User Reviews Release
    ↓
Sub-Prompt 2: Git Commit & Upload ← YOU ARE HERE
```

---

# PREREQUISITES

Before executing this prompt, verify:

- [ ] Release folder exists at `{RELEASE_FOLDER}/`
- [ ] All 7 documentation files present
- [ ] Database dumps in PGDMP format
- [ ] User approved for upload

---

# REQUIRED STEPS

## Step 1: Verify Release Folder Exists

```powershell
Test-Path -LiteralPath "{RELEASE_FOLDER}"
```

If not present, STOP and notify user.

---

## Step 2: Check Git Status

```powershell
git status
```

Verify:
- On correct branch (`{FEATURE_BRANCH}`)
- No uncommitted changes blocking upload

---

## Step 3: Stage Release Folder

```powershell
git add "{RELEASE_FOLDER}/"
```

---

## Step 4: Commit Release

```powershell
git commit -m "{COMMIT_PREFIX}({WORKSTREAM_NUMBER}): {VERSION} - {WORKSTREAM_NAME} Release"
```

---

## Step 5: Push to Feature Branch

```powershell
git push origin {FEATURE_BRANCH}
```

---

## Step 6: Verify Upload

```powershell
# Verify commit
git log --oneline -5

# Verify push
git status
```

---

# COMMIT MESSAGE FORMAT

```
{COMMIT_PREFIX}({WORKSTREAM_NUMBER}): {VERSION} - {WORKSTREAM_NAME} Release
```

## Examples

```
release(05): v5.05 - Task Management Release
release(06): v6.00 - Notification System Release
release(07): v7.00 - Reporting Dashboard Release
```

---

# GIT COMMANDS REFERENCE

```bash
# Check status
git status

# Stage release folder
git add {RELEASE_FOLDER}/

# Commit with message
git commit -m "{COMMIT_PREFIX}({WORKSTREAM_NUMBER}): {VERSION} - {WORKSTREAM_NAME} Release"

# Push to feature branch
git push origin {FEATURE_BRANCH}

# Verify commit
git log --oneline -5

# Verify push
git status
```

---

# RULES

1. **Release folder must exist** — do not create release folder here
2. **PGDMP format only** — database dumps must be binary
3. **Atomic commit** — single commit for entire release
4. **Feature branch only** — never push to main/master
5. **Verify after push** — always check git status

---

# ROLLBACK PROCEDURE

If upload needs to be undone:

```bash
# Undo last commit (keep changes local)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Re-push after reset (DANGEROUS - use with caution)
git push origin {FEATURE_BRANCH} --force
```

---

# ENGINEERING REVIEW

Present all generated artefacts for review.

Stop after generation.

Await explicit user approval.

Nothing shall be promoted automatically.

---

# SUCCESS CRITERIA

- [ ] Release folder exists at `{RELEASE_FOLDER}/`
- [ ] Git status shows clean working tree
- [ ] Commit successful with correct message
- [ ] Push successful to `{FEATURE_BRANCH}`
- [ ] Git log shows commit
- [ ] Git status shows up to date

---

# VERSION CONTROL

**Version:** 1.0

**Status:** Engineering Review Prompt
