# Release Notes — MAP V1 v1.4.1-stable

**Release Date:** 2026-07-07  
**Release Type:** Stable / Maintenance Mode  
**Branch:** `release/v4-cloud-ready`  

---

## Overview

MAP V1 v1.4.1-stable is the final production-quality release of the Migration Assurance Platform version 1. This release stabilises the codebase, completes credential recovery, corrects PostgreSQL permissions, and formally transitions MAP V1 into long-term maintenance mode.

All future product development continues exclusively within MAP V2.

---

## Key Changes

- Repository stabilised for permanent release
- Credential recovery completed (FERNET_KEY, JWT secrets)
- PostgreSQL permissions corrected for all database connections
- Release documentation completed across all domains
- Database backups verified for engine, source, and target databases
- Security validation passed — no secrets committed
- Repository validated — no broken references, no missing modules

---

## What's Included

| Component | Status |
|---|---|
| Execution Engine | Stable |
| API Layer (FastAPI) | Stable |
| Database Adapters | Stable (PostgreSQL, MySQL, SQL Server, Oracle, Snowflake, BigQuery, Databricks) |
| Rule Engine (C01–C010) | Stable |
| Governance Intelligence | Stable |
| Audit Export | Stable |
| Security (Fernet encryption, JWT) | Stable |
| Dashboard Queries | Stable |

---

## Known Limitations

- No further feature development (maintenance mode only)
- Source/target database schemas are minimal — used for validation testing only

---

## Upgrade Path

This is the terminal release for MAP V1. No further upgrades are planned.  
All new development transitions to MAP V2.

---

## Support

Future support limited to:
- Security fixes
- Critical bug fixes
- Compliance updates

**Signed off:** Batch 104 — Release v1.4.1-stable
