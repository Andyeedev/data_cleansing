# Git Tag Instructions

## Current Branch

```
feature/workstream-07-task_management
```

---

## Tag Release

### Step 1 — Verify Branch

```bash
git branch
```

Ensure current branch is:

```
feature/workstream-07-task_management
```

---

### Step 2 — Create Tag

```bash
git tag -a v5.07 -m "v5.07: Validation Engine - MAP Pipeline Complete"
```

---

### Step 3 — Push Tag

```bash
git push origin v5.07
```

---

## Tag Naming Convention

| Pattern | Example | Use Case |
|---------|---------|----------|
| `v<version>` | `v5.07` | Major release |
| `v<version>-<feature>` | `v5.07-validation` | Feature release |

---

## List Tags

```bash
git tag -l
```

Current tags:

```
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
v5.05
v5.06
```

---

## Version

**Version:** v5.07

**Branch:** `feature/workstream-07-task_management`
