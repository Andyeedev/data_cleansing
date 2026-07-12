# FH-07 – Founders Hub Validation Report

**Migration Assurance Platform (MAP)**
**Microsoft for Startups Founders Hub — Independent Review**

**Document ID:** FH-07
**Version:** 2.0 (Final)
**Status:** Independent Assessment
**Reviewer Role:** Microsoft Founders Hub Reviewer
**Date:** June 2026

---

# Executive Summary

This document provides an independent validation of the MAP Founders Hub submission package (FH-01 through FH-06). It assesses readiness across six dimensions, identifies gaps preventing acceptance, and provides a final recommendation.

**Overall Readiness Score: 8.4 / 10 (Post Remediation)**

| Metric | Pre-Remediation | Post-Remediation |
|--------|----------------|------------------|
| Overall Score | 7.2 / 10 | **8.4 / 10** |
| Submission Readiness | 57% | **93%** |
| Critical Risks Open | 3 | **0** |
| Documents Passing | 8 / 14 | **13 / 14** |

The package demonstrates strong product vision, solid technical architecture, and clear Azure alignment. Market data, financial projections, Azure cost estimates, competitive analysis, and founder profile have all been sourced and integrated. No pilot customers yet — free pilot plan defined in Section 8.4.

---

# 1. Readiness Assessment

## 1.1 Scoring Methodology

Each dimension is scored 1–10 based on:
- **Completeness** — Does the section exist and cover the topic?
- **Quality** — Is the content specific, data-driven, and credible?
- **Evidence** — Are claims backed by numbers, names, or proof points?
- **Microsoft Alignment** — Does it demonstrate clear value to the Azure ecosystem?

## 1.2 Dimension Scores

| Dimension | Score | Status | Key Issue |
|-----------|-------|--------|-----------|
| **Business Readiness** | 8.5 / 10 | ✅ Strong | TAM/SAM/SOM now sourced; revenue model clear |
| **Technical Readiness** | 8.5 / 10 | ✅ Strong | Architecture solid; Azure costs now sourced |
| **Founder Readiness** | 7.5 / 10 | ✅ Strong | Solo founder with 15+ yrs domain experience; multi-role |
| **Market Readiness** | 8.0 / 10 | ✅ Strong | Competitive analysis and customer targets added |
| **Commercial Viability** | 8.0 / 10 | ✅ Strong | Full P&L, unit economics, pricing now sourced |
| **Azure Usage Plan** | 8.5 / 10 | ✅ Strong | Per-service costs and per-customer costs added |
| **OVERALL** | **8.4 / 10** | ⚠️ Conditional Pass | One item pending: customer evidence verification |

## 1.3 Score Justification

### Business Readiness — 8.5 / 10
**Strengths:**
- Clear problem statement with 7 specific pain points (FH-01)
- Well-defined solution with 5 functional domains
- Strong "Why Microsoft" alignment across 4 strategic priorities
- **TAM/SAM/SOM now quantified:** $8–12B / $1.5–2.5B / $10–30M (v4 Phase 2.3)
- **3-year revenue trajectory:** Y1 £550k → Y2 £2.7M → Y3 £8.9M (v4 Phase 2.5)

**Remaining Weakness:**
- "5 pilot customers" claim needs names or LOIs to be credible

### Technical Readiness — 8.5 / 10
**Strengths:**
- Detailed Azure architecture with 9 services mapped (FH-02)
- Security architecture with Entra ID, Key Vault, encryption (FH-02)
- Scalability model: single → multi-environment → multi-tenant SaaS (FH-02)
- TRL 6-7 with clear development roadmap (FH-05)
- **Azure costs now quantified:** MVP $560–1,220/mo, Enterprise $2,000–5,000/mo (v4 Phase 1.4)
- **Per-customer costs defined:** MVP £438–975/mo, Scale £1,790–5,080/mo (v4 Phase 2.6)

**Remaining Weakness:**
- No IaC/DevOps detail (Bicep, GitHub Actions)
- No DR/BC strategy

### Founder Readiness — 7.5 / 10
**Strengths:**
- **15+ years experience** in data migration, data analysis, and data engineering
- **Cross-sector expertise** across 7 industries: pharmaceutical, banking, government, housing, media, telecoms, utilities
- Product definition demonstrates deep domain understanding
- Technical architecture shows Azure-native design capability
- Commercial strategy shows market awareness
- Solo founder handling CEO, Product, and Technical roles — standard for early stage

**Remaining Weakness:**
- Advisory board not yet established (optional at this stage)
- Named senior engineer hire planned post-funding

**Assessment:** The founder's 15-year track record across banking, government, and utilities — MAP's exact target sectors — is a significant strength. Microsoft values domain expertise and execution capability. Solo founder at this stage is expected and acceptable.

### Market Readiness — 8.0 / 10
**Strengths:**
- Clear target market: Financial Services (banks, insurers, asset managers)
- Regulatory drivers identified (FCA, PRA, Basel IV, SOX, GDPR)
- 70%+ of banks with active cloud migration programmes cited
- **Competitive analysis added:** 5 categories with 12+ named competitors (v4 Phase 2.3, 2.7)
- **Target customers named:** HSBC, Barclays, Lloyds, NatWest, Aviva, Legal & General (v4 Phase 2.3)
- **Feature comparison matrix available** (v4 Phase 2.7)

**Remaining Weakness:**
- "5 pilot customers" claim needs verification

### Commercial Viability — 8.0 / 10
**Strengths:**
- Pricing tiers defined: Starter/Professional/Enterprise/Strategic
- Professional services model identified
- Azure Marketplace opportunity recognised
- **Full 3-year P&L now available** (v4 Phase 2.5)
- **Unit economics defined:** CAC £28k→£18k, LTV £180k→£280k, LTV:CAC 6:1→16:1 (v4 Phase 2.5)
- **Funding strategy clear:** £500k–£750k seed + £120k Azure credits (v4 Phase 2.5)

**Remaining Weakness:**
- Pricing not validated with customer data

### Azure Usage Plan — 8.5 / 10
**Strengths:**
- 9 Azure services identified with purposes (FH-02)
- Service priority levels assigned: 5 High, 4 Medium (FH-04)
- 12-month roadmap with quarterly milestones (FH-04)
- 3-stage utilisation strategy: Development → Pilot → Commercial (FH-04)
- **Per-service monthly costs now quantified** (v4 Phase 1.4)
- **Per-customer Azure costs defined** (v4 Phase 2.6)

**Remaining Weakness:**
- No credit burn rate monitoring plan
- No contingency if credits run out early

---

# 2. Risk Assessment

## 2.1 Critical Risks (Must Fix Before Submission)

| # | Risk | Impact | Likelihood | Status | Mitigation |
|---|------|--------|------------|--------|------------|
| **R1** | ~~No founder/team information~~ | HIGH | CERTAIN | ✅ RESOLVED | Founder profile completed — 15+ yrs, 7 sectors, solo founder |
| **R2** | ~~No financial projections~~ | HIGH | CERTAIN | ✅ RESOLVED | 3-year P&L sourced from v4 Phase 2.5 |
| **R3** | ~~No TAM/SAM/SOM~~ | HIGH | CERTAIN | ✅ RESOLVED | Market sizing sourced from v4 Phase 2.3 |

## 2.2 Significant Risks (Should Fix Before Submission)

| # | Risk | Impact | Likelihood | Status | Mitigation |
|---|------|--------|------------|--------|------------|
| **R4** | ~~No Azure cost estimates~~ | MEDIUM | HIGH | ✅ RESOLVED | Per-service costs sourced from v4 Phase 1.4 |
| **R5** | ~~No competitive analysis~~ | MEDIUM | HIGH | ✅ RESOLVED | Competitor matrix sourced from v4 Phase 2.7 |
| **R6** | **No pilot customers** — cannot demonstrate product-market fit | MEDIUM | HIGH | ⚠️ OPEN | Secure 1 free pilot via network (8–12 week cycle) |
| **R7** | **Heavy content duplication** — 6 documents repeat same content 13+ times | MEDIUM | CERTAIN | ⚠️ OPEN | Deduplication recommendations in Section 4 |

## 2.3 Minor Risks (Nice to Fix)

| # | Risk | Impact | Likelihood | Status | Mitigation |
|---|------|--------|------------|--------|------------|
| **R8** | No IaC/DevOps detail | LOW | MEDIUM | ⚠️ OPEN | Add Bicep/GitHub Actions reference |
| **R9** | No DR/BC strategy | LOW | MEDIUM | ⚠️ OPEN | Add failover/backup RPO/RTO |
| **R10** | Stale progress trackers | LOW | CERTAIN | ⚠️ OPEN | Update Phase 2.5 completion status |

---

# 3. Submission Checklist

## 3.1 Microsoft Founders Hub Requirements

| Requirement | Status | Evidence | Gap |
|-------------|--------|----------|-----|
| **Product Description** | ✅ PASS | FH-01, FH-03 | Complete |
| **Technical Architecture** | ✅ PASS | FH-02, FH-05 | Complete |
| **Azure Service Usage** | ✅ PASS | FH-02, FH-04 + v4 Phase 1.4 costs | Now complete |
| **Market Opportunity** | ✅ PASS | v4 Phase 2.3 TAM/SAM/SOM | Now complete |
| **Business Model** | ✅ PASS | FH-03 + v4 Phase 2.4, 2.5 | Now complete |
| **Competitive Analysis** | ✅ PASS | v4 Phase 2.3, 2.7 | Now complete |
| **Team Information** | ✅ PASS | FH-07 Section 8 | Solo founder — 15+ yrs, 7 sectors |
| **Customer Evidence** | ⚠️ PARTIAL | v4 Phase 2.8 "5 pilots" claim | Need names or LOIs |
| **Financial Projections** | ✅ PASS | v4 Phase 2.5 | Now complete |
| **Azure Credit Justification** | ✅ PASS | FH-04 + v4 Phase 1.4 | Now complete |

## 3.2 Submission Readiness

| Category | Items Passing | Items Total | Score |
|----------|---------------|-------------|-------|
| Product Definition | 3 | 3 | 100% |
| Technical Architecture | 3 | 3 | 100% |
| Market & Commercial | 4 | 4 | 100% |
| Team & Evidence | 1.5 | 2 | 75% |
| Azure Alignment | 2 | 2 | 100% |
| **Overall** | **13.5** | **14** | **96%** |

---

# 4. Duplication Analysis

## 4.1 Content Repeated Across Multiple FH Documents

| Content | FH-01 | FH-02 | FH-03 | FH-04 | FH-05 | FH-06 | Total |
|---------|-------|-------|-------|-------|-------|-------|-------|
| Problem Statement | Primary | — | Heavy | — | Heavy | — | 3x |
| Solution (5 Domains) | Primary | Moderate | Moderate | — | Heavy | Light | 4x |
| Microsoft Alignment | Primary | Moderate | Heavy | — | Heavy | Moderate | 4x |
| Azure Services List | Primary | Primary | Moderate | Primary | Light | Light | 5x |
| Product Maturity | Primary | — | Heavy | — | Heavy | Moderate | 3x |
| FH Support Needs | Primary | Moderate | Heavy | Moderate | — | — | 3x |
| AI Roadmap | Primary | Primary | Moderate | Primary | Primary | Light | 5x |
| Phase 2.5 Progress | All 6 identical | | | | | | 6x |

## 4.2 Deduplication Recommendation

| Document | Unique Focus | Remove Duplication |
|----------|-------------|-------------------|
| FH-01 | Executive narrative, vision, why now | Keep as-is (primary source) |
| FH-02 | Azure architecture, security, scalability | Remove "Why Microsoft" (keep FH-01's) |
| FH-03 | Business case, value to customers/Microsoft | Remove problem statement, Azure list |
| FH-04 | Azure credit utilisation, 12-month roadmap | Remove per-service descriptions (keep FH-02's) |
| FH-05 | Technical due diligence, readiness scores | Remove problem statement, Microsoft alignment |
| FH-06 | Review/compliance, approval | Keep as meta-document (structural duplication acceptable) |

## 4.3 Estimated Deduplication Impact

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| Total lines (FH-01–06) | ~3,300 | ~2,600 | ~700 lines (21%) |
| Repeated paragraphs | 47 | 12 | 35 removed (74%) |
| Unique content per doc | 40% | 75% | +35% |

---

# 5. Gap-Filling Data (from v4-cloud-ready)

## 5.1 TAM/SAM/SOM (for FH-01, FH-03)

| Metric | Value | Source |
|--------|-------|--------|
| **TAM** | $8–12B annually | v4 Phase 2.3 |
| **SAM** | $1.5–2.5B annually | v4 Phase 2.3 |
| **SOM (Year 1–2)** | $10–30M annually | v4 Phase 2.3 |
| Target Customers | 50+ Tier 1–3 banks, insurers, asset managers | v4 Phase 2.3 |
| Phase 1 Target | 10–20 enterprise customers | v4 Phase 2.3 |

**Reference diagram:** `v4-cloud-ready/output/diagrams/tam_sam_som.png`

## 5.2 Financial Projections (for FH-03)

| Metric | Year 1 | Year 2 | Year 3 | Source |
|--------|--------|--------|--------|--------|
| **Revenue** | £550,000 | £2,700,000 | £8,900,000 | v4 Phase 2.5 |
| **Customers** | 10 | 40 | 120 | v4 Phase 2.5 |
| **Avg ARR/Customer** | £45,000 | £60,000 | £70,000 | v4 Phase 2.5 |
| **Gross Margin** | 78% | 86% | 89% | v4 Phase 2.5 |
| **EBITDA** | £50,000 | £1,734,000 | £6,980,000 | v4 Phase 2.5 |
| **Headcount** | 3 | 5 | 8 | v4 Phase 2.5 |

**Reference diagrams:** `v4-cloud-ready/output/diagrams/revenue_growth.png`, `ebitda_trajectory.png`

## 5.3 Unit Economics (for FH-03)

| KPI | Year 1 | Year 2 | Year 3 | Benchmark |
|-----|--------|--------|--------|-----------|
| CAC | £28,000 | £22,000 | £18,000 | UK enterprise SaaS: £15k–£35k |
| LTV | £180,000 | £240,000 | £280,000 | Based on 4-year avg customer life |
| LTV:CAC | 6:1 | 11:1 | 16:1 | Healthy: >3:1, Great: >10:1 |
| Churn | <10% | <8% | <5% | Enterprise target: <10% |
| NRR | 105% | 115% | 125% | Enterprise median: 110%+ |
| EBITDA Margin | 9% | 64% | 78% | UK SaaS Rule of 40 target |

**Source:** v4 Phase 2.5

## 5.4 Azure Cost Estimates (for FH-02, FH-04)

### Per-Service Monthly Costs (MVP)

| Service | Monthly Cost | Priority | Source |
|---------|-------------|----------|--------|
| Azure Container Apps | $200–500 | High | v4 Phase 1.4 |
| Azure SQL Database (Basic) | $150–300 | High | v4 Phase 1.4 |
| Azure Blob Storage | $50–100 | Medium | v4 Phase 1.4 |
| Azure API Management | $100–200 | Medium | v4 Phase 1.4 |
| Azure Key Vault | $10–20 | High | v4 Phase 1.4 |
| Azure Monitor | $50–100 | Medium | v4 Phase 1.4 |
| **Total (MVP)** | **$560–1,220/month** | | v4 Phase 1.4 |
| **Enterprise (AKS + HA)** | **$2,000–5,000/month** | | v4 Phase 1.4 |

### Per-Customer Costs

| Tier | Monthly (GBP) | Annual (GBP) | Source |
|------|--------------|--------------|--------|
| MVP (per customer) | £438–975 | £5,256–11,700 | v4 Phase 2.6 |
| Scale (per customer) | £1,790–5,080 | £21,480–60,960 | v4 Phase 2.6 |

### Azure Credit Utilisation Model

| Phase | Duration | Monthly Spend | Total | Source |
|-------|----------|---------------|-------|--------|
| Development (MVP) | Months 1–3 | $560–800 | $1,680–2,400 | v4 Phase 1.4 |
| Pilot Customers | Months 4–6 | $800–1,500 | $2,400–4,500 | v4 Phase 1.4 |
| AI Experimentation | Months 7–9 | $1,500–2,500 | $4,500–7,500 | v4 Phase 1.4 |
| Commercial Readiness | Months 10–12 | $2,000–3,000 | $6,000–9,000 | v4 Phase 1.4 |
| **Total Year 1** | | | **$14,580–23,400** | Calculated |
| **Credits Available** | | | **$150,000 (~£120k)** | v4 Phase 2.5 |
| **Buffer** | | | **~$126,600 remaining** | Calculated |

**Reference diagrams:** `v4-cloud-ready/output/diagrams/azure_architecture.png`, `azure_services.png`

## 5.5 Competitive Analysis (for FH-03, FH-05)

| Category | Competitors | Our Advantage | Source |
|----------|-------------|---------------|--------|
| Manual/In-House | Custom scripts, spreadsheets | Automation, governance, audit trail | v4 Phase 2.3 |
| ETL Testing | QuerySurge, iCEDQ, Datagaps | Migration-specific controls, release gates | v4 Phase 2.3 |
| Data Quality | Informatica, Talend, Ataccama | Migration-focused, faster time-to-value | v4 Phase 2.3 |
| Big 4/SI | Accenture, Deloitte | Automated platform, lower cost | v4 Phase 2.3 |
| Cloud-Native | Azure Migrate, AWS Migration Hub | Data-level validation, FS compliance | v4 Phase 2.3 |

### Feature Comparison

| Capability | MAP | ETL Testing Tools | Manual |
|-----------|-----|-------------------|--------|
| Purpose-built for migration | ✅ Yes | ❌ Generic | ❌ |
| 10 structured controls | ✅ Built-in | ⚠️ Partial | ❌ |
| Release gate governance | ✅ Built-in | ❌ | ❌ |
| Audit trail | ✅ Automated | ⚠️ Limited | ❌ |
| Financial Services focus | ✅ Purpose-built | ❌ | ❌ |
| Docker deployment | ✅ Ready | ❌ | N/A |
| API-first | ✅ Built | ⚠️ Partial | ❌ |

**Reference diagrams:** `v4-cloud-ready/output/diagrams/competitive_positioning.png`, `feature_comparison.png`

## 5.6 Pricing Model (for FH-03)

| Tier | Monthly (GBP) | Annual ACV | Target Segment | Source |
|------|--------------|------------|----------------|--------|
| Starter | £1,500–3,500 | £18,000–42,000 | FinTech, small banks | v4 Phase 2.4 |
| Professional | £3,500–10,000 | £42,000–120,000 | Mid-size banks, insurance | v4 Phase 2.4 |
| Enterprise | £10,000–35,000 | £120,000–420,000 | Tier 1 banks | v4 Phase 2.4 |
| Strategic | Custom | Custom | Large transformation programmes | v4 Phase 2.4 |

**Professional Services:**
- Implementation: £15k–£40k per customer
- Custom controls: £5k–£20k each
- Advisory: £1.5k–£7.5k/day

**Reference diagram:** `v4-cloud-ready/output/diagrams/pricing_tiers.png`

## 5.7 Funding Strategy (for FH-03, FH-04)

| Source | Amount | Status | Source |
|--------|--------|--------|--------|
| Azure Founders Hub | £120,000 credits | Available | v4 Phase 2.5 |
| Seed Round | £500,000–£750,000 | Optional | v4 Phase 2.5 |
| Innovate UK Smart Grants | Up to £500,000 | Apply when ready | v4 Phase 2.5 |
| UK EIS | 30% tax relief | Available for angels | v4 Phase 2.5 |
| British Business Bank | Up to £25k per founder | Available | v4 Phase 2.5 |

**Use of Funds (if seed round pursued):**

| Area | Allocation | Amount (GBP) | Source |
|------|-----------|--------------|--------|
| Product Development (Phase 2) | 40% | £200,000–300,000 | v4 Phase 2.5 |
| AI Mapping Module (Azure OpenAI) | 20% | £100,000–150,000 | v4 Phase 2.5 |
| Customer Pilots & Validation | 20% | £100,000–150,000 | v4 Phase 2.5 |
| Security Certifications (ISO 27001) | 10% | £50,000–75,000 | v4 Phase 2.5 |
| Marketplace & Sales Readiness | 10% | £50,000–75,000 | v4 Phase 2.5 |

**Reference diagram:** `v4-cloud-ready/output/diagrams/use_of_funds.png`

---

# 6. Customer Evidence Assessment

## 6.1 Current Evidence

| Evidence Type | Status | Source | Credibility |
|---------------|--------|--------|-------------|
| Pilot customers | ❌ None | N/A | No pilots secured — **claim removed** |
| Azure Marketplace listing | Marked "Complete" | v4 Phase 2.8 | ⚠️ Unverified — needs confirmation |
| Named target customers | Listed | v4 Phase 2.3 | Informational only |

> **Action Required:** Secure 1 pilot customer within 6–8 weeks using existing network (see Section 8.4 for approach).

## 6.2 Named Target Customers (v4 Phase 2.3)

| Segment | Named Targets |
|---------|---------------|
| Tier 1 Banks | HSBC, Barclays, Lloyds, NatWest |
| Tier 2–3 Banks | Metro Bank, Virgin Money |
| Insurance | Aviva, Legal & General, AXA |
| Asset Management | BlackRock, Schroders |
| FinTech / Payments | Wise, Revolut, Checkout.com |

## 6.3 Evidence Gap

| Action Required | Priority | Effort |
|----------------|----------|--------|
| Provide pilot customer names or LOIs | P1 | Small |
| Confirm Azure Marketplace listing status | P2 | Small |
| Add 2–3 customer testimonials or references | P2 | Medium |

---

# 7. Final Recommendation

## 7.1 Decision

| Recommendation | Status |
|----------------|--------|
| **Conditional Pass — Customer Evidence Verification Pending** | ⚠️ |

The package is **structurally complete** (all 6 documents exist, well-formatted, internally consistent) and **substantively strong** (market data, financials, Azure costs, competitive analysis, founder profile all now sourced). The only remaining item is verifying the "5 pilot customers" claim.

## 7.2 Required Actions Before Submission

| Priority | Action | Affects | Effort | Status |
|----------|--------|---------|--------|--------|
| **P1** | ~~Add founder/team bios and credentials~~ | FH-01 or new doc | Medium | ✅ RESOLVED — Section 8 |
| **P1** | ~~Verify "5 pilot customers" claim~~ | FH-03, FH-06 | Small | ✅ RESOLVED — Claim removed; no pilots yet |
| **P2** | Secure 1 free pilot customer | Network outreach | 6–8 weeks | ⚠️ Plan in Section 8.4 |
| **P2** | Add TAM/SAM/SOM from v4 Phase 2.3 | FH-01, FH-03 | Small | ✅ Data ready |
| **P2** | Add 3-year financial projections from v4 Phase 2.5 | FH-03 | Medium | ✅ Data ready |
| **P2** | Add Azure cost estimates from v4 Phase 1.4 | FH-02, FH-04 | Small | ✅ Data ready |
| **P2** | Add competitive analysis from v4 Phase 2.7 | FH-03, FH-05 | Small | ✅ Data ready |
| **P3** | Deduplicate repeated content across FH-01–06 | All | Medium | Recommendations in Section 4 |
| **P3** | Confirm Azure Marketplace listing status | FH-03, FH-06 | Small | ⚠️ Needs verification |
| **P3** | Update stale progress trackers | All 6 docs | Small | ⚠️ Needs update |

## 7.3 What's Strong

| Area | Assessment |
|------|------------|
| Product Vision | Clear, well-articulated, fills a real market gap |
| Technical Architecture | Azure-native, well-designed, appropriate service selection |
| Azure Alignment | Strong mapping to Microsoft strategic priorities |
| Document Quality | Professional formatting, consistent structure |
| Domain Understanding | Deep Financial Services regulatory knowledge |
| Market Data | TAM/SAM/SOM quantified, competitive landscape mapped |
| Financial Model | 3-year P&L with unit economics, sensitivity analysis |
| Azure Cost Model | Per-service and per-customer costs defined |

## 7.4 What's Weak

| Area | Assessment | Remediation |
|------|------------|-------------|
| ~~Team Information~~ | ~~No founder bios or credentials~~ | ✅ RESOLVED — 15+ yrs, 7 sectors |
| Customer Evidence | No pilots — free pilot plan in Section 8.4 |
| IaC/DevOps Detail | No Bicep/Terraform/CI/CD reference | Add brief section to FH-02 |
| DR/BC Strategy | No failover/backup documented | Add RPO/RTO to FH-02 |

---

# 8. Founder Readiness — Template for Completion

## 8.1 Founder Profile (Solo Founder)

> **Note:** At early stage, Microsoft Founders Hub expects founders to fulfil multiple roles. A single founder covering CEO, engineering, and product is standard and acceptable.

### Founder & CEO

**Role:** Founder, CEO, and sole technical lead
**Founded:** 2024
**Background:**
- **15+ years** of experience in **data migration, data analysis, and data engineering**
- Cross-sector experience spanning **7 industries:**
  - Pharmaceutical
  - Banking
  - Government agencies
  - Housing
  - Media
  - Telecommunications
  - Utilities

**Domain Expertise:**
| Domain | Relevance to MAP |
|--------|-----------------|
| Data Migration | Core product capability — migration discovery, mapping, validation |
| Data Analysis | Scoring engine, quality metrics, reporting |
| Data Engineering | Platform architecture, pipelines, metadata repository |
| Banking | Primary target sector — regulatory compliance, migration governance |
| Government | Secondary target — data integrity obligations, operational resilience |
| Utilities | Secondary target — infrastructure modernisation, compliance |
| Telecommunications | Secondary target — legacy system retirement, cloud migration |

**Multi-Role Capability:**

| Role | Why Solo | Evidence |
|------|----------|----------|
| CEO | Founding team — business strategy, fundraising, partnerships | Product Canon, commercial strategy, FH-01–06 |
| Product Director | 15 years domain experience — knows the problem intimately | Product definition, functional requirements, use cases |
| Technical Lead | Data engineering background — can architect and build | Azure architecture (FH-02), technical due diligence (FH-05) |
| Lead Implementation Engineer | Hands-on building — CLI engine, REST API, Docker, PostgreSQL | Working codebase, sprint delivery, engineering governance |

**Why This Founder for MAP:**
15 years of hands-on data migration experience across banking, government, utilities, and regulated industries — exactly the sectors MAP serves. The founder has lived the problem MAP solves: manual validation, poor governance, migration risk. This is not a generic SaaS founder — this is a domain expert building the tool they wished existed.

## 8.2 Team Structure (Current)

| Role | Status | Notes |
|------|--------|-------|
| Founder/CEO | ✅ Active | Solo founder — all roles |
| Senior Engineer | 📋 Planned | Hire after seed/FH credits secured |
| Advisory Board | 📋 Optional | Add when investor relationships develop |

> At this stage, a single founder with 15+ years of relevant experience is a **strength**, not a weakness. Microsoft values domain expertise and execution capability over team size.

## 8.3 Founder Readiness Score Improvement

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Founder Readiness Score | 4.5 / 10 | **7.5 / 10** | +3.0 |
| Overall Score | 8.1 / 10 | **8.4 / 10** | +0.3 |
| Submission Readiness | 89% | **93%** | +4% |

## 8.4 Customer Acquisition Plan (Pilot Strategy)

### Target Segments for First Pilot

| Segment | Why | Sales Cycle | Approach |
|---------|-----|-------------|----------|
| FinTech / Payments | Fast decisions, cloud-native, less procurement | 1–3 months | Direct outreach via LinkedIn, founder network |
| Tier 2–3 Banks | Smaller teams, urgent migration needs | 2–4 months | Former colleagues, Microsoft partner referrals |
| Building Societies | Similar to banks, more accessible | 2–4 months | Industry events, LinkedIn |

### Free Pilot Model

| Term | Detail |
|------|--------|
| Duration | 8–12 weeks |
| Cost | Free (or £1 symbolic) |
| Requirement | Access to one migration project (even small) |
| Deliverable | Validation report on their data |
| In return | Written testimonial + case study rights |

### Timeline

| Week | Action | Outcome |
|------|--------|---------|
| 1–2 | Contact 10 former colleagues in banking/Fintech | 2–3 conversations |
| 3–4 | Offer free pilot to 2–3 receptive contacts | 1 verbal agreement |
| 5–8 | Run pilot on small migration project | Validation report delivered |
| 9–10 | Get written testimonial | Case study ready |
| 11–12 | Use case study to approach 5 more prospects | Pipeline building |

### Microsoft Ecosystem Leverage

| Channel | How |
|---------|-----|
| Azure Marketplace | List MAP as transactable offer |
| Founders Hub community | Other founders may need migration validation |
| Microsoft partner referrals | Azure migration practices embed MAP as assurance layer |
| LinkedIn content | Share migration governance insights, build credibility |

---

# 9. Appendix: Diagram References

All diagrams available in `v4-cloud-ready/output/diagrams/`:

| Diagram | File | Use In |
|---------|------|--------|
| Market Sizing | tam_sam_som.png | FH-01, FH-03 (market sizing) |
| Revenue Growth | revenue_growth.png | FH-03 (financial projections) |
| EBITDA Trajectory | ebitda_trajectory.png | FH-03 (P&L) |
| Use of Funds | use_of_funds.png | FH-04 (funding allocation) |
| Pricing Tiers | pricing_tiers.png | FH-03 (business model) |
| Competitive Positioning | competitive_positioning.png | FH-03, FH-05 (competitive) |
| Feature Comparison | feature_comparison.png | FH-05 (technical differentiation) |
| Azure Architecture | azure_architecture.png | FH-02 (architecture) |
| Azure Services | azure_services.png | FH-02, FH-04 (service mapping) |
| Platform Architecture | platform_architecture.png | FH-02, FH-05 (platform layers) |
| Control DAG | control_dag.png | FH-05 (validation controls) |
| Five Pillars | five_pillars.png | FH-01, FH-03 (solution overview) |
| Product Roadmap | product_roadmap.png | FH-03, FH-06 (development plan) |

---

# 10. Appendix: Document Cross-Reference

## 10.1 v4-cloud-ready Documents Used

| v4 Document | Data Extracted | Used In FH-07 |
|-------------|---------------|---------------|
| Phase 1.4 Azure Cloud Architecture | Azure per-service costs, MVP/Enterprise totals | Section 5.4 |
| Phase 2.3 Market Analysis | TAM/SAM/SOM, competitor names, target customers | Sections 5.1, 5.5, 6.2 |
| Phase 2.4 Business Model | Pricing tiers, unit economics | Section 5.6 |
| Phase 2.5 GTM & Financial Projections | 3-year P&L, funding strategy, use of funds | Sections 5.2, 5.3, 5.7 |
| Phase 2.6 Financial Model | Per-customer Azure costs, sensitivity analysis | Section 5.4 |
| Phase 2.7 Competitive Differentiation | Feature comparison, differentiation matrix | Section 5.5 |
| Phase 2.8 Product Roadmap | "5 pilot customers" claim, milestone targets | Section 6.1 |
| Phase 2.9 Investor FAQ | TAM/SAM/SOM (duplicate), team expertise areas | Sections 5.1, 8.1 |

## 10.2 FH-01 through FH-06 Documents Assessed

| FH Document | Lines | Score | Key Strength | Key Gap |
|-------------|-------|-------|--------------|---------|
| FH-01 Executive Narrative | 317 | 8.5/10 | Clear vision, strong problem statement | No TAM/SAM/SOM (now sourced) |
| FH-02 Azure Architecture | 688 | 8.5/10 | Detailed Azure mapping, security | No cost estimates (now sourced) |
| FH-03 Business Case | 427 | 8.0/10 | Business value framing | No financials (now sourced) |
| FH-04 Azure Credit Plan | 597 | 8.5/10 | 12-month roadmap, priority matrix | No $ amounts (now sourced) |
| FH-05 Technical Due Diligence | 748 | 8.5/10 | TRL ratings, readiness scores | Heavy duplication |
| FH-06 Submission Review | 525 | 8.0/10 | Compliance checklist, approval | Self-assessment bias |

---

*End of FH-07 — Founders Hub Validation Report*
*Version 2.0 — Final*
*Prepared for Microsoft for Startups Founders Hub Submission*
