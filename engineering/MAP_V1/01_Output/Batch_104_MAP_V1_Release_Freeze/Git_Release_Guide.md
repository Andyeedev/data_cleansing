# Git Release Guide — MAP V1

**Version:** 4.1  
**Date:** 2026-07-08  

---

## Release Branch

```
MAP_V1_v4.1_Stable
```

This is the official stable branch for MAP V1 Version 4.1.

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
git commit -m "MAP V1 Version 4.1

Official Stable Release

- Repository stabilised
- Security hardened
- Docker enabled
- Credential encryption completed
- PostgreSQL permissions verified
- Executive reporting completed
- Documentation completed
- Production release prepared"
```

### 4. Create Stable Branch

```bash
git branch MAP_V1_v4.1_Stable
```

### 5. Create Tag

```bash
git tag -a MAP_V1_v4.1 -m "MAP V1 Version 4.1 — Official Stable Release"
```

### 6. Push to Remote

```bash
git push origin MAP_V1_v4.1_Stable
git push origin MAP_V1_v4.1
```

---

## Tag Naming Convention

```
MAP_V1_<release>
```

Examples:
- `MAP_V1_v4.1`
- `MAP_V1_v4.2`

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `release/v4-cloud-ready` | Previous engineering branch |
| `MAP_V1_v4.1_Stable` | Official stable release |
| `v2.0-development` | MAP V2 development |
| `master` | Main branch |

---

## Verification

After push, verify:

```bash
# Verify remote tag
git ls-remote --tags origin MAP_V1_v4.1

# Verify branch
git ls-remote --heads origin MAP_V1_v4.1_Stable
```

---

**Signed off:** Batch 104 — MAP V1 Version 4.1
