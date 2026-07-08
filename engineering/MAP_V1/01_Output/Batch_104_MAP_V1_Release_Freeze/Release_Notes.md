# Release Notes — MAP V1 Version 4.1

**Release Date:** 2026-07-08  
**Release Type:** Production Stable — Long Term Maintenance (LTM)  
**Branch:** `MAP_V1_v4.1_Stable`  
**Tag:** `MAP_V1_v4.1`  

---

## Overview

MAP V1 Version 4.1 is the official production release of the Migration Assurance Platform version 1. This release stabilises the codebase, completes credential recovery, corrects PostgreSQL permissions, and formally transitions MAP V1 into Long Term Maintenance.

All future product development continues exclusively within MAP V2.

---

## Key Changes

- Repository stabilised for permanent release
- Credential recovery completed (FERNET_KEY, JWT secrets)
- PostgreSQL permissions corrected for all database connections
- Docker enabled for containerised deployment
- Executive reporting completed
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
| Docker Support | Enabled |

---

## Known Limitations

- No further feature development (Long Term Maintenance only)
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

**Signed off:** Batch 104 — MAP V1 Version 4.1
