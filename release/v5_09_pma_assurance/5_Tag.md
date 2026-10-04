# Git Tag Instructions — v5.09 (PMA Assurance — Phase 5A)

> **STATUS: NOT YET EXECUTED.** Do not run these commands until the Git checkpoint is approved.

## Current Branch

```
feature/workstream-08-pma_assurance
```

(To be created from the current working branch — see `7_GIT_Upload.md`.)

---

## Tag Release

### Step 1 — Verify Branch

```bash
git branch
```

Ensure current branch is:

```
feature/workstream-08-pma_assurance
```

---

### Step 2 — Create Tag

```bash
git tag -a v5.09-pma_assurance_5a -m "v5.09: PMA Assurance Phase 5A - PMA Foundation (orchestrator, context, single-system discovery, working set, batch identity)"
```

---

### Step 3 — Push Tag

```bash
git push origin v5.09-pma_assurance_5a
```

---

## Tag Naming Convention

| Pattern | Example | Use Case |
|---------|---------|----------|
| `v<version>` | `v5.08` | Major release |
| `v<version>-<feature>` | `v5.09-pma_assurance_5a` | Feature release (this checkpoint) |

---

## List Tags

```bash
git tag -l
```

Current tags (as of 2026-10-03, before this checkpoint):

```
MAP_V1_v4.1
MAP_V2
MAP_V2_FINAL_BASELINE
v1.4
v1.5
v1.6
v1.7
v1.8
v1.9
v2.0
v2.1
v2.1-multi-saas
v3.0
v3.1
v3.1-phase1
v5.07
v5.08
```

Pending (created only after approval):

```
v5.09-pma_assurance_5a
```

---

## Version

**Version:** v5.09

**Branch:** `feature/workstream-08-pma_assurance`

**Tag:** `v5.09-pma_assurance_5a`
