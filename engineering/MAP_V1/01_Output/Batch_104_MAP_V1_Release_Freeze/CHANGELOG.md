# CHANGELOG — MAP V1

All notable changes to MAP V1 are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [4.1] — 2026-07-08 — Official Stable Release

### Fixed
- PostgreSQL permissions corrected for all database connections
- Credential recovery completed (FERNET_KEY, JWT secrets)
- Repository stabilised for permanent release

### Added
- Docker support enabled
- Executive reporting completed
- Full release documentation suite

### Changed
- MAP V1 enters Long Term Maintenance (LTM)
- No further feature development

### Documentation
- Release Notes completed
- CHANGELOG created
- Roadmap created
- Architecture Summary created
- Operational Recovery Guide created
- Database Backup Guide created
- Git Release Guide created
- Versioning Strategy created
- Version Tags created
- Freeze Declaration issued
- Release Metadata published

---

## [4.0] — SaaS Architecture Foundation

### Added
- Core schema (tenants, projects, system_registry, dataset_mappings)
- Project-scoped execution engine
- Mapping-driven rule resolution
- Governance intelligence integration
- Release gate enforcement
- Multi-project capability
- Full backup taken (engine/source/target DBs)

### Deprecated
- rule_parameter_metadata marked for deprecation

---

## [3.1] — SaaS Multi-Connection

### Added
- SaaS multi-connection support
- SQL Server connection enabled (execution pending)
- Rule discovery and scoring engine stabilised

---

## [3.0] — Single DB Connection (PostgreSQL)

### Added
- PostgreSQL fully functional single DB connection
- Platform prepared for SaaS multi-DB connectivity

---

## [2.0] — Platform Foundation

### Added
- Platform architecture baseline
- Multi-tenant foundation

---

## [1.9] — Observability & Intelligence

### Added
- Observability layer
- Autonomous rule intelligence
- Metadata intelligence service
- Dataset discovery service

---

## [1.8] — Governance & Scoring

### Added
- Decision engine
- Risk scoring
- Scoring engine

---

## [1.7] — Database Adapter Expansion

### Added
- MySQL adapter
- SQL Server adapter
- Oracle adapter
- Snowflake adapter
- BigQuery adapter
- Databricks (OData) adapter

---

## [1.6] — Security Hardening

### Added
- Fernet encryption for credentials
- JWT authentication
- Security audit reports

---

## [1.5] — Enhanced Rule Execution

### Added
- Enhanced rule execution pipeline
- Improved error handling

---

**Signed off:** Batch 104 — MAP V1 Version 4.1
