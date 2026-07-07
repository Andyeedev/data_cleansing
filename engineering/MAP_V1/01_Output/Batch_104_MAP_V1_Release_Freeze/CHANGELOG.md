# CHANGELOG — MAP V1

All notable changes to MAP V1 are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [v1.4.1-stable] — 2026-07-07

### Fixed
- PostgreSQL permissions corrected for all database connections
- Credential recovery completed (FERNET_KEY, JWT secrets)
- Repository stabilised for permanent release

### Changed
- MAP V1 enters maintenance mode
- No further feature development

### Documentation
- Release notes completed
- Operational recovery guide created
- Database backup guide created
- Git release guide created
- Freeze declaration issued

---

## [v1.4] — SaaS Architecture Foundation

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

## [v1.5] – Enhanced Rule Execution

### Added
- Enhanced rule execution pipeline
- Improved error handling

---

## [v1.6] – Security Hardening

### Added
- Fernet encryption for credentials
- JWT authentication
- Security audit reports

---

## [v1.7] – Database Adapter Expansion

### Added
- MySQL adapter
- SQL Server adapter
- Oracle adapter
- Snowflake adapter
- BigQuery adapter
- Databricks (OData) adapter

---

## [v1.8] – Governance & Scoring

### Added
- Decision engine
- Risk scoring
- Scoring engine

---

## [v1.9] – Observability & Intelligence

### Added
- Observability layer
- Autonomous rule intelligence
- Metadata intelligence service
- Dataset discovery service

---

## [v2.0] – Platform Foundation

### Added
- Platform architecture baseline
- Multi-tenant foundation

---

## [v3.0] – Single DB Connection (PostgreSQL)

### Added
- PostgreSQL fully functional single DB connection
- Platform prepared for SaaS multi-DB connectivity

---

## [v3.1] – SaaS Multi-Connection

### Added
- SaaS multi-connection support
- SQL Server connection enabled (execution pending)
- Rule discovery and scoring engine stabilised

---

**Signed off:** Batch 104 — Release v1.4.1-stable
