# Version Tags — MAP V1

**Date:** 2026-07-07  

---

## Existing Tags

| Tag | Description |
|---|---|
| `v1.4` | SaaS Architecture Foundation |
| `v1.5` | Enhanced Rule Execution |
| `v1.6` | Security Hardening |
| `v1.7` | Database Adapter Expansion |
| `v1.8` | Governance & Scoring |
| `v1.9` | Observability & Intelligence |
| `v2.0` | Platform Foundation |
| `v2.1` | Multi-SaaS |
| `v2.1-multi-saas` | Multi-SaaS variant |
| `v3.0` | Single DB Connection |
| `v3.1` | SaaS Multi-Connection |

---

## New Tag

| Tag | Description | Date |
|---|---|---|
| `v1.4.1-stable` | MAP V1 Stable Release (Frozen) | 2026-07-07 |

---

## Tag Commands

### Create Annotated Tag
```bash
git tag -a v1.4.1-stable -m "MAP V1 Stable Release"
```

### List Tags
```bash
git tag -l
```

### Show Tag Details
```bash
git show v1.4.1-stable
```

### Push Tags
```bash
git push origin v1.4.1-stable
```

### Delete Tag (Local)
```bash
git tag -d v1.4.1-stable
```

### Delete Tag (Remote)
```bash
git push origin --delete v1.4.1-stable
```

---

## Version History

```
v1.4 → v1.5 → v1.6 → v1.7 → v1.8 → v1.9 → v1.4.1-stable (FROZEN)
                                     ↘ v2.0 → v2.1 → v3.0 → v3.1 → MAP V2
```

---

**Signed off:** Batch 104 — Release v1.4.1-stable
