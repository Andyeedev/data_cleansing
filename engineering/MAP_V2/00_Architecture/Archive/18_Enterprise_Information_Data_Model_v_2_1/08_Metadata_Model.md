# Metadata Model

**Document ID:** 18-08  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document defines the metadata architecture for the MAP Nexus platform.

---

## 2. Technical Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe database structure and schema |
| **Tables** | information_schema.tables, information_schema.columns |
| **Fields** | table_name, column_name, data_type, is_nullable, ordinal_position |
| **Owner** | Database Administrator |
| **Consumers** | Discovery Engine, Migration Engineers |
| **Update Frequency** | On schema change |
| **Evidence** | app.discovery.auto_rule_discovery queries information_schema |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | Centralised technical metadata catalogue |
| **Tables** | metadata.technical_catalogue (Target State) |
| **Fields** | schema_name, table_name, column_name, data_type, constraints, relationships |
| **Owner** | Database Administrator |
| **Consumers** | All Services |
| **Update Frequency** | Real-time |
| **Enhancement** | Automated catalogue with impact analysis |

---

## 3. Business Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe business meaning of data |
| **Tables** | Not implemented |
| **Fields** | Not implemented |
| **Owner** | Data Steward |
| **Consumers** | All Users |
| **Update Frequency** | On business change |
| **Evidence** | Target State Capability — Not Currently Implemented |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | Business glossary and definitions |
| **Tables** | metadata.business_glossary (Target State) |
| **Fields** | object_name, definition, owner, classification, sensitivity |
| **Owner** | Data Steward |
| **Consumers** | All Users |
| **Update Frequency** | On business change |
| **Enhancement** | Business glossary with ownership |

---

## 4. Operational Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe operational characteristics |
| **Tables** | Not implemented |
| **Fields** | Not implemented |
| **Owner** | Operations Manager |
| **Consumers** | Operations Team |
| **Update Frequency** | Real-time |
| **Evidence** | Target State Capability — Not Currently Implemented |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | SLA tracking, quality metrics, usage statistics |
| **Tables** | metadata.operational_metrics (Target State) |
| **Fields** | sla, quality_score, usage_count, performance_metrics |
| **Owner** | Operations Manager |
| **Consumers** | Operations Team |
| **Update Frequency** | Real-time |
| **Enhancement** | Real-time operational monitoring |

---

## 5. Execution Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe execution characteristics |
| **Tables** | engine.migration_validation_batch, engine.migration_control_execution |
| **Fields** | started_at, completed_at, status, duration, row_count |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Programme Manager |
| **Update Frequency** | Per execution |
| **Evidence** | engine.migration_validation_batch tracks execution metadata |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | Enhanced execution analytics |
| **Tables** | Enhanced engine tables |
| **Fields** | performance_metrics, resource_usage, parallelism |
| **Owner** | Migration Lead |
| **Consumers** | Migration Engineers, Programme Manager |
| **Update Frequency** | Real-time |
| **Enhancement** | Performance analytics and optimisation |

---

## 6. Governance Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe governance characteristics |
| **Tables** | engine.migration_governance_status, engine.migration_risk_scores |
| **Fields** | decision, rationale, risk_score, compliance_status |
| **Owner** | Governance Officer |
| **Consumers** | Governance Officers, Programme Manager |
| **Update Frequency** | Per decision |
| **Evidence** | engine.migration_governance_status, engine.migration_risk_scores |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | Enhanced governance analytics |
| **Tables** | Enhanced governance tables |
| **Fields** | compliance_metrics, audit_trail, policy_adherence |
| **Owner** | Governance Officer |
| **Consumers** | Governance Officers, Programme Manager |
| **Update Frequency** | Real-time |
| **Enhancement** | Automated compliance monitoring |

---

## 7. Reference Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe reference data characteristics |
| **Tables** | reporting.dim_date, reporting.dim_severity, reporting.dim_status |
| **Fields** | dimension values, descriptions |
| **Owner** | Administrator |
| **Consumers** | Reporting, Dashboards |
| **Update Frequency** | On reference data change |
| **Evidence** | reporting.dim_* tables |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | Enhanced reference data management |
| **Tables** | Enhanced dimension tables |
| **Fields** | metadata_enrichment, hierarchy, relationships |
| **Owner** | Administrator |
| **Consumers** | Reporting, Dashboards |
| **Update Frequency** | Real-time |
| **Enhancement** | Hierarchical reference data |

---

## 8. Lineage Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe data lineage characteristics |
| **Tables** | Not implemented |
| **Fields** | Not implemented |
| **Owner** | Data Steward |
| **Consumers** | All Services |
| **Update Frequency** | On data change |
| **Evidence** | Target State Capability — Not Currently Implemented |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | End-to-end data lineage tracking |
| **Tables** | metadata.lineage (Target State) |
| **Fields** | source, target, transformation, dependencies, impact |
| **Owner** | Data Steward |
| **Consumers** | All Services |
| **Update Frequency** | Real-time |
| **Enhancement** | Automated lineage capture |

---

## 9. Configuration Metadata

### Current State

| Field | Value |
|-------|-------|
| **Purpose** | Describe configuration characteristics |
| **Tables** | platform.system_settings, platform.feature_flags, engine.governance_config |
| **Fields** | setting_key, setting_value, feature_name, enabled |
| **Owner** | Administrator |
| **Consumers** | All Services |
| **Update Frequency** | On configuration change |
| **Evidence** | platform.system_settings, platform.feature_flags |

### Target State

| Field | Value |
|-------|-------|
| **Purpose** | Environment-specific configuration |
| **Tables** | Enhanced configuration tables |
| **Fields** | environment, version, rollback_support |
| **Owner** | Administrator |
| **Consumers** | All Services |
| **Update Frequency** | On configuration change |
| **Enhancement** | Environment-specific configuration |

---

## 10. Metadata Summary

| Category | Current State | Target State | Gaps |
|----------|---------------|--------------|------|
| Technical | Partial (information_schema) | Centralised catalogue | High |
| Business | Not implemented | Business glossary | High |
| Operational | Not implemented | Operational metrics | High |
| Execution | Yes (engine tables) | Enhanced analytics | Medium |
| Governance | Yes (engine tables) | Enhanced governance | Medium |
| Reference | Yes (dim tables) | Hierarchical | Medium |
| Lineage | Not implemented | End-to-end lineage | High |
| Configuration | Yes (platform tables) | Environment-specific | Low |

---

## 11. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This metadata model is part of the Enterprise Information & Data Model (Prompt 18 v2.1). All findings are based on source code analysis — no code was modified.*
