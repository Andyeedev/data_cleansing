# Versioning Strategy — MAP V1

**Date:** 2026-07-08  

---

## Overview

MAP V1 follows a structured versioning scheme to communicate release maturity and maintenance status.

---

## Version Format

```
MAP_V1_v<major>.<minor>
```

| Component | Description |
|---|---|
| `MAP_V1` | Product line identifier |
| `v<major>` | Major release number |
| `.<minor>` | Minor release number |

---

## Version History

| Version | Name | Status |
|---|---|---|
| 1.5 | Enhanced Rule Execution | Superseded |
| 1.6 | Security Hardening | Superseded |
| 1.7 | Database Adapter Expansion | Superseded |
| 1.8 | Governance & Scoring | Superseded |
| 1.9 | Observability & Intelligence | Superseded |
| 2.0 | Platform Foundation | Superseded |
| 3.0 | Single DB Connection | Superseded |
| 3.1 | SaaS Multi-Connection | Superseded |
| **4.1** | **Official Stable Release** | **Current (LTM)** |

---

## Release Types

| Type | Tag Format | Description |
|---|---|---|
| Development | `v<major>.<minor>-development` | Active development |
| Release Candidate | `MAP_V1_v<major>.<minor>-rc<n>` | Pre-release testing |
| Stable | `MAP_V1_v<major>.<minor>` | Production release |
| Patch | `MAP_V1_v<major>.<minor>.<patch>` | Critical fixes |

---

## Branch Naming

| Branch | Purpose |
|---|---|
| `release/v<version>` | Engineering branch |
| `MAP_V1_v<version>_Stable` | Official stable branch |
| `v<version>-development` | Development branch |

---

## Current Release

| Item | Value |
|---|---|
| Version | 4.1 |
| Branch | `MAP_V1_v4.1_Stable` |
| Tag | `MAP_V1_v4.1` |
| Status | Long Term Maintenance |

---

**Signed off:** Batch 104 — MAP V1 Version 4.1
