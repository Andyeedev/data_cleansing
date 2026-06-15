# Technical Due Diligence & Startup Program Readiness Report
**Project:** fs-migration-validation-engine (v1.9)
**Reviewer:** Gemini CLI (Principal Cloud Architect / Startup Technical Reviewer)
**Date:** Sunday, 14 June 2026

---

## EXECUTIVE SUMMARY

| Category | Score / Level | Verdict |
| :--- | :--- | :--- |
| **Cloud Readiness Score** | 45/100 | **Level 2 (MVP)** |
| **Commercial Viability Score** | 85/100 | **Strong Market Potential** |
| **Startup Program Readiness** | 65/100 | **Apply after minor improvements** |

**Final Verdict:** The application is a highly viable enterprise-grade platform solving a critical, high-value problem in financial services. Architecturally, it is well-designed for metadata-driven scaling, but operationally it is immature. The repo lacks critical deployment artifacts (Dockerfile, CI/CD, IaC) and is cluttered with legacy code.

---

## PHASE 1 – APPLICATION UNDERSTANDING

### 1. Problem Statement
Financial institutions face massive risks and regulatory scrutiny during core system migrations. Manual validation is slow, error-prone, and lacks an audit trail.

### 2. Product Type
**Enterprise Migration Governance Platform.** It is a metadata-driven validation engine that automates data reconciliation, schema checks, and risk scoring.

### 3. Likely Customers
- Tier 1–3 Banks (Retail, Corporate, Investment)
- Regulated Financial Services (Insurance, Asset Management)
- Large-scale enterprises undergoing SAP/Oracle or Cloud migrations.

### 4. Business Value
- **Risk Mitigation:** Automated detection of data drift, schema drift, and financial imbalances.
- **Regulatory Compliance:** Generates an "Exception Register" and "Audit Export" for regulators.
- **Efficiency:** Parallelized rule execution reduces migration downtime.

### 5. Product Classification
- **Enterprise platform:** Built for high-stakes, regulated environments.
- **Migration governance platform:** Focuses on the "Release Gate" and "Decision Engine".

**Evidence:** 
- `app/governance/decision_engine.py`: Records formal migration decisions.
- `app/rules/`: Specialized financial rules (C02_sum_compare, C03_referential).
- `README.md`: Explicitly targets Tier 1-3 Banks.

---

## PHASE 2 – ARCHITECTURE REVIEW

### 1. Logical Architecture
- **Control Layer:** Orchestrates the lifecycle via `ExecutionEngine`. Uses a DAG for parallel control execution.
- **Service Layer:** Handles credentials, mapping resolution, and dataset discovery.
- **Execution Layer:** `RuleExecutor` interacts with `RuleFactory` to instantiate SQL-based or logic-based rules.
- **Adapter Layer:** `PostgresAdapter`, `SnowflakeAdapter`, etc., provide database portability.

### 2. Component Interaction Flow
`main.py` -> `ExecutionEngine` -> `ConnectionResolver` -> `MappingResolver` -> `RuleExecutor` -> `RuleFactory` -> `DB Adapters`.

### 3. Runtime Execution Flow
1. Load Config (YAML).
2. Resolve DB Connections (Engine, Source, Target).
3. Discover/Map Datasets.
4. Execute Controls (Parallel DAG).
5. Calculate Scores (`ScoringEngine`).
6. Enforce Release Gate (`_enforce_release_gate`).

### 4. SWOT Analysis
- **Strengths:** 
    - Metadata-driven (scales without code changes).
    - Multi-database support (Extensible adapter pattern).
    - Built-in governance and risk scoring logic.
- **Weaknesses:** 
    - Massive code duplication (numerous `_legacy` files).
    - Inconsistent multi-tenancy (implemented in SQL but not fully in Python services).
    - High technical debt (commented-out code in core logic).

---

## PHASE 3 – CLOUD READINESS ASSESSMENT

**Current Readiness: Level 2 (MVP)**

| Attribute | Assessment |
| :--- | :--- |
| **Statelessness** | **Good.** Logic is decoupled from state (state is in Postgres). |
| **Configuration** | **Fair.** Externalized in YAML, but many paths are hardcoded to root. |
| **Secrets Management** | **Poor.** Plaintext passwords in `config.yaml`. No Vault/Secrets Manager integration. |
| **Horizontal Scalability** | **Limited.** Execution is currently a single-node process. Needs task queue (Celery/RabbitMQ). |
| **Logging/Observability** | **Good.** Custom `IndentContext` for nested logs and `audit_logger` for governance. |

---

## PHASE 4 – STARTUP PROGRAM READINESS

### 1. Microsoft Founders Hub (Score: 70/100)
- **Why Accepted:** Strong B2B Financial Services focus (Azure's core market).
- **Missing:** Azure Managed Identity integration, Bicep templates.

### 2. AWS Activate (Score: 65/100)
- **Why Accepted:** Architecture is suitable for RDS and Fargate.
- **Missing:** Terraform, AWS Secrets Manager integration.

### 3. Google for Startups (Score: 60/100)
- **Why Accepted:** Fits GKE and Cloud SQL patterns.
- **Missing:** K8s manifests, Google Cloud KMS.

**Best Fit:** **Microsoft Founders Hub.** The product positioning aligns perfectly with Azure's enterprise/banking customer base.

---

## PHASE 5 – COMMERCIAL VIABILITY

- **Industry Fit:** Financial Services (High), Pharma (Medium), Government (Medium).
- **Differentiation:** Most validation tools are general-purpose (Informatica, Great Expectations). This is specialized for **Migration Governance**.
- **Biggest Risk:** Long enterprise sales cycles and "not-invented-here" syndrome in bank IT departments.

---

## PHASE 6 – DEPLOYMENT READINESS

- **Exists:** `docker-compose.yml` (Postgres only), Bash scripts for validation.
- **Missing (CRITICAL):** 
    - `Dockerfile` for the application engine.
    - CI/CD Pipelines (GitHub Actions/GitLab).
    - Infrastructure as Code (Terraform/Bicep).
- **Verdict:** Cannot be deployed to cloud in current state without manual intervention.

---

## PHASE 7 – SECURITY REVIEW

### Critical Findings
- **Plaintext Credentials:** `config.yaml` contains database passwords in plaintext (File: `config.yaml`).
- **Missing Authentication on API:** While JWT is configured, some internal routes and services don't appear to enforce `tenant_id` scoping (File: `app/services/system_service.py`).

### High Findings
- **Legacy Code Bloat:** Presence of legacy connection and repository files creates a massive attack surface and maintenance risk (File: `app/db/connection_resolver_legacy_20260428.py`).

### Medium Findings
- **Hardcoded Paths:** Use of absolute paths or complex `parents[3]` logic for config loading (File: `app/api/core/app_config.py`).

---

## PHASE 8 – RECOMMENDATIONS & ACTIONS

### Top 10 Actions Before Applying
1. **Implement `Dockerfile`:** Create a production-grade multi-stage Dockerfile.
2. **Secrets Externalization:** Remove passwords from `config.yaml`; use Env vars or a Secrets Manager.
3. **Refactor Legacy Code:** Delete all `*_legacy.py` files and consolidate logic.
4. **CI/CD Pipeline:** Add a basic GitHub Action for linting and unit testing.
5. **Terraform/IaC:** Provide a basic script to spin up RDS/Postgres in the cloud.
6. **API Hardening:** Ensure all routes in `app/api/routes/` are JWT protected.
7. **Multi-tenancy Validation:** Enforce `project_id` and `tenant_id` at the repository level.
8. **Health Checks:** Add `/health` and `/ready` endpoints to the FastAPI app.
9. **Documentation:** Create a "Deployment Guide" in `docs/`.
10. **Testing:** Expand `tests/` to cover the `ExecutionEngine` logic, not just controls.

---

## FINAL VERDICT
**APPLY AFTER MINOR IMPROVEMENTS**

The "Engine" is powerful and the value proposition is "Series A" level. However, the repository "hygiene" and "deployment readiness" are currently "Seed" level. 48 hours of focused refactoring and adding deployment artifacts would make this a "Strong Apply".
