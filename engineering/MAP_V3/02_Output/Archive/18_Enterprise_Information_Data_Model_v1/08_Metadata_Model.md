# Metadata Model

**Document ID:** 18-08  
**Version:** 1.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the metadata architecture for the MAP Nexus platform. It categorises metadata into technical, business, operational, execution, governance, reference, and configuration types.

---

## 2. Metadata Categories

### 2.1 Technical Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe database structure and schema |
| **Tables** | information_schema.tables, information_schema.columns |
| **Fields** | table_name, column_name, data_type, is_nullable, ordinal_position |
| **Owner** | Database Administrator |
| **Consumers** | Discovery Engine, Migration Engineers |
| **Update Frequency** | On schema change |
| **Evidence** | app.discovery.auto_rule_discovery queries information_schema |

**Current Implementation:** Queries information_schema directly; no metadata catalogue

**Target State:** Centralised metadata catalogue with technical metadata

---

### 2.2 Business Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe business meaning of data |
| **Tables** | Not implemented |
| **Fields** | Not implemented |
| **Owner** | Data Steward |
| **Consumers** | All Users |
| **Update Frequency** | On business change |
| **Evidence** | Not implemented |

**Current Implementation:** Not implemented

**Target State:** Business glossary with definitions, owners, and relationships

---

### 2.3 Operational Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe operational characteristics |
| **Tables** | Not implemented |
| **Fields** | Not implemented |
| **Owner** | Operations Manager |
| **Consumers** | Operations Team |
| **Update Frequency** | Real-time |
| **Evidence** | Not implemented |

**Current Implementation:** Not implemented

**Target State:** SLA tracking, quality metrics, usage statistics

---

### 2.4 Execution Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe execution characteristics |
| **Tables** | engine.migration_validation_batch, engine.migration_control_execution |
| **Fields** | started_at, completed_at, status, duration, row_count |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Programme Manager |
| **Update Frequency** | Per execution |
| **Evidence** | engine.migration_validation_batch tracks execution metadata |

---

### 2.5 Governance Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe governance characteristics |
| **Tables** | engine.migration_governance_status, engine.migration_risk_scores |
| **Fields** | decision, rationale, risk_score, compliance_status |
| **Owner** | Governance Officer |
| **Consumers** | Governance Officers, Programme Manager |
| **Update Frequency** | Per decision |
| **Evidence** | engine.migration_governance_status, engine.migration_risk_scores |

---

### 2.6 Reference Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe reference data characteristics |
| **Tables** | reporting.dim_date, reporting.dim_severity, reporting.dim_status |
| **Fields** | dimension values, descriptions |
| **Owner** | Administrator |
| **Consumers** | Reporting, Dashboards |
| **Update Frequency** | On reference data change |
| **Evidence** | reporting.dim_* tables |

---

### 2.7 Configuration Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Describe configuration characteristics |
| **Tables** | platform.system_settings, platform.feature_flags, engine.governance_config |
| **Fields** | setting_key, setting_value, feature_name, enabled |
| **Owner** | Administrator |
| **Consumers** | All Services |
| **Update Frequency** | On configuration change |
| **Evidence** | platform.system_settings, platform.feature_flags |

---

## 3. Metadata Summary

| Category | Implemented | Tables | Gaps |
|----------|-------------|--------|------|
| Technical | Partial | information_schema | No catalogue |
| Business | No | None | Complete gap |
| Operational | No | None | Complete gap |
| Execution | Yes | engine tables | Limited |
| Governance | Yes | engine tables | Limited |
| Reference | Yes | reporting.dim_* | Limited |
| Configuration | Yes | platform tables | Complete |

---

## 4. Metadata Gaps

| # | Gap | Category | Impact | Recommendation |
|---|-----|----------|--------|----------------|
| 1 | No business metadata | Business | High | Create business glossary |
| 2 | No operational metadata | Operational | High | Create operational catalogue |
| 3 | No metadata catalogue | Technical | High | Create metadata catalogue |
| 4 | No lineage metadata | Technical | High | Create lineage catalogue |
| 5 | Limited execution metadata | Execution | Medium | Extend execution metadata |
| 6 | Limited governance metadata | Governance | Medium | Extend governance metadata |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This metadata model is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*