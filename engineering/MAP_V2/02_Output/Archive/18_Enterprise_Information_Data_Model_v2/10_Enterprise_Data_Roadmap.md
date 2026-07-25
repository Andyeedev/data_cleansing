# Enterprise Data Roadmap

**Document ID:** 18-10  
**Version:** 2.0  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides a phased improvement roadmap for the MAP Nexus information architecture. It prioritises improvements based on impact, effort, and strategic alignment.

---

## 2. Current Maturity Assessment

| Dimension | Level | Description |
|-----------|-------|-------------|
| Schema Design | 3 Defined | 6 schemas with clear separation |
| Master Data | 3 Defined | Core master entities exist |
| Reference Data | 2 Repeatable | Some reference data |
| Metadata | 2 Repeatable | Limited technical metadata |
| Lineage | 1 Initial | No formal lineage tracking |
| Governance | 2 Repeatable | Basic audit trail |
| Quality | 2 Repeatable | Basic validation |
| Security | 3 Defined | RBAC, encryption, audit |

**Average Maturity:** 2.4

---

## 3. Strengths, Weaknesses, Gaps

### 3.1 Strengths

| # | Strength | Evidence |
|---|----------|----------|
| 1 | Well-defined schema separation | 6 schemas with clear domain boundaries |
| 2 | Strong master data foundation | core.tenants, platform.users, platform.roles |
| 3 | Comprehensive audit trail | audit schema with 5 tables |
| 4 | Multi-tenant architecture | tenant_id in JWT, core.tenants |

### 3.2 Weaknesses

| # | Weakness | Evidence |
|---|----------|----------|
| 1 | No formal data lineage | No lineage tables or tracking |
| 2 | Limited metadata catalogue | Only information_schema queries |
| 3 | No data quality framework | No quality rules or monitoring |
| 4 | Schema fragmentation | engine_v14 parallel schema, OLD tables |

### 3.3 Gaps

| # | Gap | Category | Impact |
|---|-----|----------|--------|
| 1 | No business metadata | Metadata | High |
| 2 | No lineage metadata | Lineage | High |
| 3 | No data ownership model | Governance | High |
| 4 | No data classification | Governance | Medium |
| 5 | No retention policies | Governance | Medium |
| 6 | No quality framework | Quality | Medium |

### 3.4 Technical Debt

| # | Debt | Evidence | Priority |
|---|------|----------|----------|
| 1 | OLD tables in engine schema | engine.*_OLD tables | Medium |
| 2 | engine_v14 parallel schema | engine_v14 schema | Medium |
| 3 | No ORM layer | Raw SQL only | Low |
| 4 | No migration framework | No Alembic | Low |

---

## 4. Roadmap

### 4.1 Phase 1: Quick Wins (0-3 Months)

| # | Initiative | Effort | Impact | Dependencies |
|---|------------|--------|--------|--------------|
| 1 | Create metadata catalogue tables | 5-7 days | High | None |
| 2 | Create lineage metadata tables | 5-7 days | High | None |
| 3 | Create business glossary tables | 3-5 days | High | None |
| 4 | Implement data classification | 3-5 days | Medium | None |
| 5 | Document existing schemas | 3-5 days | Medium | None |

**Total Effort:** 20-30 person-days

**Success Criteria:**
- Metadata catalogue tables created
- Lineage tables created
- Business glossary tables created
- Schema documentation complete

---

### 4.2 Phase 2: Metadata (3-6 Months)

| # | Initiative | Effort | Impact | Dependencies |
|---|------------|--------|--------|--------------|
| 1 | Populate technical metadata | 8-10 days | High | Phase 1 |
| 2 | Populate business metadata | 8-10 days | High | Phase 1 |
| 3 | Implement lineage tracking | 10-12 days | High | Phase 1 |
| 4 | Create metadata API | 8-10 days | Medium | Phase 1 |
| 5 | Implement metadata UI | 8-10 days | Medium | Phase 1 |

**Total Effort:** 40-50 person-days

**Success Criteria:**
- Technical metadata populated
- Business metadata populated
- Lineage tracking operational
- Metadata API available

---

### 4.3 Phase 3: Governance (6-12 Months)

| # | Initiative | Effort | Impact | Dependencies |
|---|------------|--------|--------|--------------|
| 1 | Implement data ownership | 8-10 days | High | Phase 2 |
| 2 | Implement retention policies | 8-10 days | High | Phase 2 |
| 3 | Implement quality framework | 10-12 days | Medium | Phase 2 |
| 4 | Create governance dashboard | 8-10 days | Medium | Phase 2 |
| 5 | Implement compliance monitoring | 8-10 days | Medium | Phase 2 |

**Total Effort:** 40-50 person-days

**Success Criteria:**
- Data ownership assigned
- Retention policies active
- Quality framework operational
- Governance dashboard available

---

### 4.4 Phase 4: Enterprise Data Platform (12-18 Months)

| # | Initiative | Effort | Impact | Dependencies |
|---|------------|--------|--------|--------------|
| 1 | Consolidate schemas | 10-12 days | High | Phase 3 |
| 2 | Implement data catalog | 10-12 days | High | Phase 3 |
| 3 | Implement data quality rules | 8-10 days | Medium | Phase 3 |
| 4 | Create enterprise data platform | 10-12 days | Medium | Phase 3 |
| 5 | Implement AI/ML metadata | 8-10 days | Medium | Phase 3 |

**Total Effort:** 40-50 person-days

**Success Criteria:**
- Schemas consolidated
- Data catalog operational
- Quality rules active
- Enterprise platform available

---

## 5. Prioritisation

### 5.1 High Priority

| # | Initiative | Phase | Effort | Impact |
|---|------------|-------|--------|--------|
| 1 | Metadata catalogue | 1 | 5-7 days | High |
| 2 | Lineage tracking | 1 | 5-7 days | High |
| 3 | Business glossary | 1 | 3-5 days | High |
| 4 | Data ownership | 3 | 8-10 days | High |
| 5 | Schema consolidation | 4 | 10-12 days | High |

### 5.2 Medium Priority

| # | Initiative | Phase | Effort | Impact |
|---|------------|-------|--------|--------|
| 1 | Data classification | 1 | 3-5 days | Medium |
| 2 | Metadata API | 2 | 8-10 days | Medium |
| 3 | Quality framework | 3 | 10-12 days | Medium |
| 4 | Governance dashboard | 3 | 8-10 days | Medium |
| 5 | Data catalog | 4 | 10-12 days | Medium |

### 5.3 Low Priority

| # | Initiative | Phase | Effort | Impact |
|---|------------|-------|--------|--------|
| 1 | ORM implementation | 4 | 20-30 days | Low |
| 2 | Migration framework | 4 | 10-15 days | Low |
| 3 | AI/ML metadata | 4 | 8-10 days | Low |

---

## 6. Resource Requirements

| Phase | Duration | Backend | Frontend | DBA | Total |
|-------|----------|---------|----------|-----|-------|
| Phase 1 | 0-3 months | 1 FTE | 0.5 FTE | 0.5 FTE | 2 FTE |
| Phase 2 | 3-6 months | 2 FTE | 1 FTE | 0.5 FTE | 3.5 FTE |
| Phase 3 | 6-12 months | 2 FTE | 1 FTE | 0.5 FTE | 3.5 FTE |
| Phase 4 | 12-18 months | 2 FTE | 1 FTE | 1 FTE | 4 FTE |

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Schema fragmentation | High | Medium | Consolidate in Phase 4 |
| Metadata quality | Medium | High | Validation rules |
| Adoption resistance | Medium | Medium | Training and documentation |
| Performance impact | Low | Medium | Indexing and partitioning |

---

## 8. Success Metrics

| Metric | Baseline | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|----------|---------|---------|---------|---------|
| Metadata Maturity | 2 | 2.5 | 3 | 3.5 | 4 |
| Lineage Maturity | 1 | 2 | 3 | 3.5 | 4 |
| Governance Maturity | 2 | 2.5 | 3 | 3.5 | 4 |
| Quality Maturity | 2 | 2 | 2.5 | 3 | 3.5 |
| Overall Maturity | 2.4 | 2.5 | 3 | 3.5 | 4 |

---

## 9. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This enterprise data roadmap is part of the Enterprise Information & Data Model (Prompt 18). All findings are based on source code analysis — no code was modified.*
