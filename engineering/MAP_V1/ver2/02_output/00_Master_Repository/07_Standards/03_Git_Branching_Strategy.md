# Git Branching Strategy

**Document:** MAP MVP Git Branching Strategy
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

MAP follows a monorepo strategy with .NET 8 backend and React 18 frontend, deployed to Azure Container Apps via CI/CD pipelines. This document defines the Git branching strategy and conventions.

---

## Branch Types

| Branch | Purpose | Lifetime | Merges Into |
|--------|---------|----------|-------------|
| `main` | Production-ready code | Permanent | — |
| `develop` | Integration branch | Permanent | `main` |
| `feature/*` | New features | Temporary | `develop` |
| `hotfix/*` | Urgent production fixes | Temporary | `main` + `develop` |
| `release/*` | Release stabilization | Temporary | `main` + `develop` |

---

## Branch Naming Conventions

```
feature/MAP-123-add-validation-checks
feature/MAP-456-ai-risk-scoring
hotfix/MAP-789-fix-auth-timeout
release/v1.0.0
release/v1.1.0
```

---

## Branch Rules

- **main:** Protected, requires PR review + CI pass + approval.
- **develop:** Protected, requires PR review + CI pass.
- **feature/*:** Branch from develop, merge back via PR.
- **hotfix/*:** Branch from main, merge to main + develop.
- **release/*:** Branch from develop, stabilize, merge to main + develop.
- **Squash merges** for feature branches to maintain clean history.
- **Merge commits** for release and hotfix branches to preserve traceability.
