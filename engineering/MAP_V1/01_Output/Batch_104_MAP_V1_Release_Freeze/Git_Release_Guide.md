# Git Release Guide — MAP V1

**Version:** v1.4.1-stable  
**Date:** 2026-07-07  

---

## Release Branch

```
release/v4-cloud-ready
```

This is the primary release branch for MAP V1.

---

## Release Process

### 1. Review Changes

```bash
git status
git diff --stat
```

### 2. Stage Changes

```bash
git add .
```

### 3. Commit Release

```bash
git commit -m "Release v1.4.1-stable

- Repository stabilised
- Credential recovery completed
- PostgreSQL permissions corrected
- Release documentation completed
- MAP V1 frozen"
```

### 4. Create Tag

```bash
git tag -a v1.4.1-stable -m "MAP V1 Stable Release"
```

### 5. Push to Remote

```bash
git push origin release/v4-cloud-ready
git push origin v1.4.1-stable
```

---

## Tag Naming Convention

```
v<major>.<minor>.<patch>-<qualifier>
```

Examples:
- `v1.4.1-stable`
- `v1.4.2-security-fix`
- `v1.5.0-beta`

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `release/v4-cloud-ready` | MAP V1 release branch |
| `v2.0-development` | MAP V2 development |
| `master` | Main branch |

---

## Verification

After push, verify:

```bash
# Verify remote tag
git ls-remote --tags origin v1.4.1-stable

# Verify branch
git ls-remote --heads origin release/v4-cloud-ready
```

---

**Signed off:** Batch 104 — Release v1.4.1-stable
