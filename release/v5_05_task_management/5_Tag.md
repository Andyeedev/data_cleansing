# Git Tag Instructions

## Current Branch

```
feature/workstream-05-task_management
```

---

## Tag Release

### Step 1 — Verify Branch

```bash
git branch
```

Ensure current branch is:

```
feature/workstream-05-task_management
```

---

### Step 2 — Create Tag

```bash
git tag -a v5.05 -m "v5.05: Workstream 05 Task Management - Enterprise Architecture Documentation"
```

---

### Step 3 — Push Tag

```bash
git push origin v5.05
```

---

## Tag Naming Convention

| Pattern | Example | Use Case |
|---------|---------|----------|
| `v<version>` | `v5.05` | Major release |
| `v<version>-<feature>` | `v5.05-task-management` | Feature release |

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
```

---

## Version

**Version:** v5.05

**Branch:** `feature/workstream-05-task_management`
