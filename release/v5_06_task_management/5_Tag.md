# Git Tag Instructions

## Current Branch

```
feature/v5_06_baseline
```

---

## Tag Release

### Step 1 — Verify Branch

```bash
git branch
```

Ensure current branch is:

```
feature/v5_06_baseline
```

---

### Step 2 — Create Tag

```bash
git tag -a v5.06 -m "v5.06: Platform Baseline Documentation - Complete Technical Baseline"
```

---

### Step 3 — Push Tag

```bash
git push origin v5.06
```

---

## Tag Naming Convention

| Pattern | Example | Use Case |
|---------|---------|----------|
| `v<version>` | `v5.06` | Major release |
| `v<version>-<feature>` | `v5.06-baseline` | Feature release |

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
```

---

## Version

**Version:** v5.06

**Branch:** `feature/v5_06_baseline`
