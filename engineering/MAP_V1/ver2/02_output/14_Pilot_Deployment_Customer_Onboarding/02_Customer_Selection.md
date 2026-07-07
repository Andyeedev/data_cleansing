# MAP Customer Selection Guide

| Field | Value |
|---|---|
| **Document Title** | MAP (Migration Assurance Platform) Customer Selection Guide |
| **Document ID** | MAP-PILOT-CUST-002 |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Confidential – Internal Use Only |
| **Owner** | MAP Product & Delivery Team |
| **Author** | MAP Strategy & Operations |
| **Reviewed By** | VP of Product, Director of Engineering, Head of Customer Success |
| **Approved By** | Chief Product Officer |

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | June 2026 | MAP Strategy & Operations | Initial draft |
| 0.2 | June 2026 | MAP Strategy & Operations | Added disqualification criteria |
| 0.3 | June 2026 | MAP Strategy & Operations | Incorporated stakeholder feedback |
| 1.0 | July 2026 | MAP Strategy & Operations | Official release |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Definitions and Abbreviations](#3-definitions-and-abbreviations)
4. [References](#4-references)
5. [Ideal Customer Profile](#5-ideal-customer-profile)
6. [Organisation Size Requirements](#6-organisation-size-requirements)
7. [Industry Requirements](#7-industry-requirements)
8. [Cloud Maturity Requirements](#8-cloud-maturity-requirements)
9. [Migration Maturity Requirements](#9-migration-maturity-requirements)
10. [Stakeholder Requirements](#10-stakeholder-requirements)
11. [Technical Requirements](#11-technical-requirements)
12. [Commercial Considerations](#12-commercial-considerations)
13. [Disqualification Criteria](#13-disqualification-criteria)
14. [Customer Selection Process](#14-customer-selection-process)
15. [Scoring Methodology](#15-scoring-methodology)
16. [Selection Decision Framework](#16-selection-decision-framework)
17. [Dependencies](#17-dependencies)
18. [Approval](#18-approval)

---

## 1. Purpose

This document provides the comprehensive criteria and process for selecting pilot customers for the MAP (Migration Assurance Platform) pilot program. Selecting the right pilot customers is critical to the success of the pilot program, as pilot customers directly impact:

- Quality of learning and feedback received
- Validation of MAP's core value proposition
- Speed of onboarding and time to first value
- Risk profile of the pilot engagement
- Quality of reference customers and case studies
- Overall pilot program success metrics

This guide defines the ideal customer profile, mandatory and preferred requirements across multiple dimensions, disqualification criteria, and a structured selection process with scoring methodology. It should be used by all team members involved in identifying, evaluating, and selecting pilot customers.

---

## 2. Scope

This document covers:

- Ideal customer profile for MAP pilot customers
- Organisation size requirements and preferences
- Industry requirements and preferences
- Cloud maturity requirements
- Migration maturity requirements
- Stakeholder and organisational requirements
- Technical environment requirements
- Commercial considerations
- Disqualification criteria
- Customer selection process and scoring methodology
- Selection decision framework

This document does not cover:

- Pilot strategy and timeline (covered in Document 01: Pilot Strategy)
- Technical readiness requirements (covered in Document 03: Pilot Readiness Checklist)
- Commercial pricing or contract terms
- Post-pilot customer engagement planning

---

## 3. Definitions and Abbreviations

| Term | Definition |
|---|---|
| MAP | Migration Assurance Platform |
| ICP | Ideal Customer Profile |
| TAM | Total Addressable Market |
| NPS | Net Promoter Score |
| CSM | Customer Success Manager |
| SE | Solutions Engineer |
| POC | Proof of Concept |
| ROI | Return on Investment |
| TTV | Time to Value |
| ETL | Extract, Transform, Load |
| API | Application Programming Interface |
| SSO | Single Sign-On |
| RBAC | Role-Based Access Control |
| IaC | Infrastructure as Code |
| TCO | Total Cost of Ownership |
| SLA | Service Level Agreement |

---

## 4. References

| Reference | Description |
|---|---|
| MAP Product Requirements Document (PRD) | Defines MAP product features and capabilities |
| MAP Technical Architecture Document | Describes the technical architecture and infrastructure |
| MAP Pilot Strategy (Document 01) | Defines pilot objectives, timeline, and success criteria |
| MAP Pricing & Packaging Strategy | Defines commercial model and pricing tiers |
| MAP Integration Architecture | Describes API and integration patterns |
| Financial Services Migration Product v1.4 | The migration product that MAP validates and assures |
| Azure Migration Best Practices | Microsoft Azure migration methodology and patterns |

---

## 5. Ideal Customer Profile

### 5.1 Summary

The ideal MAP pilot customer is a mid-sized financial services organisation (500–5,000 employees) that is planning or executing an Azure migration, has moderate cloud maturity, and is willing to actively collaborate throughout the pilot. The customer should have a clear business case for migration, executive sponsorship for the project, and the technical capability to provide meaningful feedback.

### 5.2 Ideal Customer Characteristics

| Characteristic | Ideal Profile | Priority |
|---|---|---|
| **Industry** | Financial Services, Insurance, Banking | Critical |
| **Organisation Size** | 500–5,000 employees | Critical |
| **Annual Revenue** | £50M–£500M | Preferred |
| **Cloud Provider** | Microsoft Azure (primary) | Critical |
| **Cloud Maturity** | Early to mid-stage adoption | Critical |
| **Migration Stage** | Planning or early execution | Critical |
| **Migration Type** | Application or infrastructure migration | Critical |
| **Technical Capability** | Moderate internal IT capability | Preferred |
| **Geographic Location** | UK/EU (data residency requirements) | Preferred |
| **Regulatory Environment** | FCA, PRA, or equivalent regulated | Preferred |

### 5.3 Customer Persona

The ideal pilot customer persona encompasses:

**Primary Contact – Head of Cloud Migration / Head of IT Transformation**
- Experienced in cloud migration projects
- Understands the challenges of migration validation
- Has authority to make tactical decisions
- Willing to provide regular feedback

**Executive Sponsor – CTO / CIO / VP of IT**
- Supports the pilot program strategically
- Can remove organisational blockers
- Committed to providing resources for the pilot
- Interested in the outcomes and value delivered

**Technical Lead – Cloud Architect / Infrastructure Lead**
- Deep technical knowledge of the customer's environment
- Can configure and manage integrations
- Provides detailed technical feedback
- Validates technical accuracy of MAP outputs

**Business Stakeholder – Business Analyst / Project Manager**
- Understands the business context of migration
- Can articulate business requirements and priorities
- Validates that MAP outputs align with business needs
- Supports user adoption and change management

---

## 6. Organisation Size Requirements

### 6.1 Size Classification

| Category | Employee Count | Annual Revenue | Pilot Suitability |
|---|---|---|---|
| **Micro** | < 50 | < £5M | Not suitable – too small for meaningful scenarios |
| **Small** | 50–499 | £5M–£50M | Marginal – may lack complexity for full validation |
| **Medium** | 500–2,500 | £50M–£250M | Ideal – sufficient complexity without excessive scale |
| **Mid-Large** | 2,500–5,000 | £250M–£500M | Good – provides diverse scenarios; requires more resources |
| **Large** | 5,000–10,000 | £500M–£1B | Possible – high value but higher complexity |
| **Enterprise** | 10,000+ | £1B+ | Not suitable for pilot – too complex and slow-moving |

### 6.2 Size-Based Requirements

| Requirement | 500–2,500 Employees | 2,500–5,000 Employees |
|---|---|---|
| **Minimum Migration Scope** | 10+ applications | 25+ applications |
| **Technical Team Size** | 3+ dedicated resources | 5+ dedicated resources |
| **Decision-Making Speed** | Rapid (days) | Moderate (weeks) |
| **Organisational Complexity** | Low to moderate | Moderate to high |
| **Resource Availability** | High | Moderate |
| **Pilot Duration** | 12 weeks | 12–16 weeks |
| **Support Requirements** | Standard | Enhanced |

### 6.3 Size-Based Scoring

| Score | Criteria |
|---|---|
| **5** | 1,000–3,000 employees; ideal complexity and resource availability |
| **4** | 500–999 employees; sufficient complexity; may need support |
| **4** | 3,001–5,000 employees; good complexity; may need more resources |
| **3** | 500–999 employees; lower complexity; adequate if migration scope is significant |
| **2** | < 500 employees or > 5,000 employees; less ideal fit |
| **1** | < 200 employees or > 8,000 employees; poor fit for pilot |

---

## 7. Industry Requirements

### 7.1 Industry Classification

| Priority | Industry | Rationale | Pilot Suitability |
|---|---|---|---|
| **P0** | Financial Services (General) | Core target market; highest alignment with MAP value proposition | Excellent |
| **P0** | Insurance | Strong use case; legacy modernisation drives migration demand | Excellent |
| **P0** | Banking | High-value migrations; regulatory compliance requirements | Excellent |
| **P1** | Wealth Management / Asset Management | Financial services adjacent; similar requirements | Very Good |
| **P1** | FinTech | Financial services innovation; cloud-native migration patterns | Very Good |
| **P2** | Healthcare | Regulated industry; data residency requirements | Good |
| **P2** | Professional Services | Moderate complexity; diverse technology landscape | Good |
| **P3** | Retail / E-Commerce | Less regulated; may have different migration patterns | Moderate |
| **P3** | Manufacturing | Less alignment with financial services focus | Moderate |

### 7.2 Industry-Specific Requirements

#### Financial Services

| Requirement | Description | Impact on Pilot |
|---|---|---|
| **FCA Compliance** | Must comply with Financial Conduct Authority regulations | MAP must demonstrate regulatory compliance capabilities |
| **PRA Requirements** | Prudential Regulation Authority requirements for system resilience | Must validate resilience and availability requirements |
| **Data Residency** | UK/EU data residency requirements | MAP deployment must be in appropriate region |
| **PCI DSS** | Payment Card Industry Data Security Standard (if applicable) | Security controls must meet PCI requirements |
| **Open Banking** | Open Banking API requirements (if applicable) | Integration capabilities may be tested |
| **Anti-Money Laundering** | AML system migration considerations | Must validate AML system migration compliance |

#### Insurance

| Requirement | Description | Impact on Pilot |
|---|---|---|
| **FCA Compliance** | Financial Conduct Authority regulation | Regulatory validation capabilities required |
| **GDPR** | Data protection requirements for customer data | Data handling must meet GDPR standards |
| **Actuarial Systems** | Complex actuarial and risk modelling systems | May test complex application migration validation |
| **Claims Processing** | Business-critical claims processing systems | Must validate business continuity during migration |
| **Policy Administration** | Core policy administration systems | High-value validation scenario |

#### Banking

| Requirement | Description | Impact on Pilot |
|---|---|---|
| **PRA Requirements** | Prudential Regulation Authority requirements | System resilience validation required |
| **Basel III** | Regulatory capital requirements | Must validate financial reporting migration |
| **Core Banking** | Core banking system migration | High-complexity, high-value validation scenario |
| **Payment Systems** | Payment processing system migration | Critical system migration validation |
| **Real-Time Reporting** | Real-time regulatory reporting requirements | Must validate reporting system migration |

### 7.3 Industry-Based Scoring

| Score | Criteria |
|---|---|
| **5** | Financial Services, Insurance, or Banking; active migration project; regulatory requirements present |
| **4** | Financial Services adjacent (Wealth Management, FinTech); active migration project |
| **3** | Regulated industry (Healthcare, Professional Services); active migration project |
| **2** | Other industries with moderate alignment; active migration project |
| **1** | Industries with low alignment or no active migration project |

---

## 8. Cloud Maturity Requirements

### 8.1 Cloud Maturity Model

| Maturity Level | Description | Characteristics | Pilot Suitability |
|---|---|---|---|
| **Level 1: Exploring** | Investigating cloud adoption | No production workloads; POC stage only | Not suitable – too early |
| **Level 2: Adopting** | Early cloud adoption | Limited production workloads; basic cloud skills | Ideal – maximum learning value |
| **Level 3: Optimising** | Expanding cloud usage | Growing cloud footprint; developing cloud practices | Ideal – good balance of need and capability |
| **Level 4: Scaling** | Cloud-first approach | Significant cloud footprint; mature practices | Good – may have less need for MAP |
| **Level 5: Innovating** | Cloud-native transformation | Cloud-native applications; advanced capabilities | Less suitable – may have less need for validation |

### 8.2 Cloud Provider Requirements

| Requirement | Priority | Rationale |
|---|---|---|
| **Microsoft Azure** | Critical | MAP is optimised for Azure migration validation |
| **AWS** | Not required | MAP may support AWS in future; not for pilot |
| **Google Cloud Platform** | Not required | MAP may support GCP in future; not for pilot |
| **On-Premises** | Required | Customer must have on-premises workloads to migrate |
| **Hybrid Cloud** | Preferred | Provides richer validation scenarios |

### 8.3 Cloud Maturity Assessment Criteria

| Assessment Area | Level 1 (Exploring) | Level 2 (Adopting) | Level 3 (Optimising) | Level 4 (Scaling) | Level 5 (Innovating) |
|---|---|---|---|---|---|
| **Workloads in Cloud** | 0% | 1–10% | 10–30% | 30–60% | 60%+ |
| **Cloud Skills** | None | Basic | Intermediate | Advanced | Expert |
| **Cloud Governance** | None | Basic policies | Defined framework | Mature framework | Optimised framework |
| **Cost Management** | None | Basic monitoring | Budgeting in place | FinOps practices | Advanced optimisation |
| **Security Posture** | Traditional | Basic cloud security | Cloud security framework | Advanced security | Zero trust |
| **Automation** | None | Basic scripting | IaC deployed | CI/CD pipelines | Full automation |

### 8.4 Cloud Maturity-Based Scoring

| Score | Criteria |
|---|---|
| **5** | Level 2 (Adopting) – early cloud adoption; high need for validation; maximum learning value |
| **4** | Level 3 (Optimising) – expanding cloud usage; good balance of need and capability |
| **3** | Level 1 (Exploring) – investigating cloud; may be too early for meaningful validation |
| **3** | Level 4 (Scaling) – significant cloud footprint; may have less need for MAP |
| **2** | Level 5 (Innovating) – cloud-native; may not need traditional migration validation |
| **1** | No cloud adoption plans; not a viable pilot candidate |

---

## 9. Migration Maturity Requirements

### 9.1 Migration Maturity Model

| Maturity Level | Description | Characteristics | Pilot Suitability |
|---|---|---|---|
| **Level 1: Not Started** | No migration activity | No migration planning or execution | Not suitable – no migration to validate |
| **Level 2: Planning** | Migration planning phase | Business case developed; no execution yet | Ideal – MAP can influence approach from start |
| **Level 3: Early Execution** | Beginning migration execution | First workloads being migrated | Ideal – MAP can validate in-flight migrations |
| **Level 4: Mid Execution** | Active migration program | Multiple workloads being migrated | Good – provides rich validation scenarios |
| **Level 5: Advanced** | Mature migration program | Most workloads migrated | Less suitable – may have less need for validation |
| **Level 6: Complete** | Migration complete | All target workloads migrated | Not suitable – nothing to migrate |

### 9.2 Migration Scope Requirements

| Requirement | Minimum | Preferred | Ideal |
|---|---|---|---|
| **Number of Applications** | 5+ | 15+ | 30+ |
| **Infrastructure Components** | 20+ servers | 50+ servers | 100+ servers |
| **Data Volume** | 1 TB+ | 10 TB+ | 50 TB+ |
| **Migration Timeline** | Within 12 months | Within 6 months | Within 3 months |
| **Migration Complexity** | Simple lift-and-shift | Re-platforming | Re-architecting |
| **Business Criticality** | Non-critical | Business important | Mission critical |

### 9.3 Migration Type Preferences

| Migration Type | Description | MAP Value | Preference |
|---|---|---|---|
| **Lift and Shift (Rehost)** | Move workloads as-is to cloud | Validates infrastructure configuration | High |
| **Re-platform** | Minor optimisation during migration | Validates platform changes | High |
| **Re-architect** | Redesign for cloud-native | Validates architectural decisions | High |
| **Repurchase** | Move to SaaS alternative | Validates SaaS transition | Medium |
| **Retire** | Decommission workloads | Validates decommissioning approach | Low |
| **Retain** | Keep on-premises | No migration to validate | N/A |

### 9.4 Migration Maturity-Based Scoring

| Score | Criteria |
|---|---|
| **5** | Level 2 (Planning) or Level 3 (Early Execution); 15+ applications; within 6 months |
| **4** | Level 3 (Early Execution) or Level 4 (Mid Execution); 10+ applications; within 12 months |
| **3** | Level 2 (Planning); 5+ applications; within 12 months |
| **2** | Level 4 (Mid Execution); limited application scope; timeline not urgent |
| **1** | Level 1 (Not Started) or Level 5+ (Advanced/Complete); no meaningful migration to validate |

---

## 10. Stakeholder Requirements

### 10.1 Executive Sponsorship

| Requirement | Priority | Rationale |
|---|---|---|
| **C-Level Sponsor (CTO/CIO)** | Critical | Ensures strategic commitment and resource allocation |
| **VP-Level Sponsor** | Acceptable | Sufficient for pilot if empowered to make decisions |
| **No Executive Sponsor** | Disqualifying | Pilot cannot succeed without executive support |
| **Sponsor Engagement** | Critical | Sponsor must be actively engaged, not just名义上的 |
| **Sponsor Availability** | Preferred | Sponsor available for key milestone meetings |

### 10.2 Technical Team Requirements

| Requirement | Minimum | Preferred | Ideal |
|---|---|---|---|
| **Dedicated Technical Lead** | 1 person | 2 people | 3+ people |
| **Cloud Architecture Skills** | Basic | Intermediate | Advanced |
| **Migration Experience** | Some | Extensive | Deep expertise |
| **Availability for Pilot** | 10 hours/week | 20 hours/week | 30+ hours/week |
| **Feedback Quality** | Basic feedback | Detailed feedback | Expert-level feedback |

### 10.3 Business Stakeholder Requirements

| Requirement | Priority | Rationale |
|---|---|---|
| **Business Project Manager** | Critical | Coordinates business-side activities |
| **Business Analyst** | Preferred | Provides business requirements and validation |
| **End-User Representatives** | Preferred | Validates business value and usability |
| **Compliance/Legal Representative** | Preferred | Validates regulatory compliance |

### 10.4 Stakeholder-Based Scoring

| Score | Criteria |
|---|---|
| **5** | C-level sponsor actively engaged; dedicated technical lead with 30+ hours/week; full stakeholder team |
| **4** | VP-level sponsor; dedicated technical lead with 20+ hours/week; most stakeholders identified |
| **3** | C-level sponsor (nominal); technical lead with 10+ hours/week; key stakeholders identified |
| **2** | VP-level sponsor (nominal); shared technical resource; some stakeholders missing |
| **1** | No clear sponsor; no dedicated technical resource; key stakeholders missing |

---

## 11. Technical Requirements

### 11.1 Infrastructure Requirements

| Requirement | Minimum | Preferred | Ideal |
|---|---|---|---|
| **Azure Subscription** | Active subscription | Dedicated pilot subscription | Pre-provisioned resources |
| **Network Connectivity** | Basic internet | ExpressRoute/VPN | Dedicated connectivity |
| **Compute Resources** | Basic VMs available | Dedicated VMs for MAP | Pre-provisioned and tested |
| **Storage** | Basic storage available | Dedicated storage accounts | Pre-provisioned and tested |
| **Identity** | Azure AD tenant | Azure AD with P1/P2 | Azure AD with advanced features |

### 11.2 Integration Requirements

| Requirement | Priority | Rationale |
|---|---|---|
| **Azure Resource Graph Access** | Critical | MAP requires visibility into Azure resources |
| **Azure Activity Log Access** | Critical | MAP requires activity data for validation |
| **Azure Policy Access** | Preferred | Enables policy compliance validation |
| **Azure Cost Management Access** | Preferred | Enables cost validation and optimisation |
| **Azure Monitor Access** | Preferred | Enables performance validation |
| **API Access** | Critical | MAP requires API access to customer environment |
| **Data Export Capability** | Preferred | Enables data analysis and reporting |

### 11.3 Data Requirements

| Requirement | Priority | Rationale |
|---|---|---|
| **Asset Inventory Data** | Critical | MAP requires asset data for validation |
| **Configuration Data** | Critical | MAP requires configuration data for validation |
| **Performance Data** | Preferred | Enables performance baseline and validation |
| **Cost Data** | Preferred | Enables cost validation and optimisation |
| **Security Data** | Preferred | Enables security posture validation |
| **Compliance Data** | Preferred | Enables compliance validation |

### 11.4 Technical Environment Assessment

Before finalising customer selection, the following technical assessment must be completed:

| Assessment Area | Questions | Pass Criteria |
|---|---|---|
| **Azure Environment** | Is Azure subscription active? Are required services available? | Subscription active; services available |
| **Network** | Is network connectivity to MAP infrastructure feasible? | Connectivity achievable within pilot timeframe |
| **Security** | Can MAP be deployed within customer security constraints? | No blocking security constraints |
| **Integration** | Can required integrations be established? | All critical integrations feasible |
| **Data** | Can required data be accessed and exported? | All critical data accessible |
| **Performance** | Can customer environment support MAP resource requirements? | Sufficient resources available |

### 11.5 Technical-Based Scoring

| Score | Criteria |
|---|---|
| **5** | Azure environment fully provisioned; all integrations pre-validated; data accessible; no security blockers |
| **4** | Azure environment available; most integrations feasible; data accessible; minor security considerations |
| **3** | Azure environment available; critical integrations feasible; data accessible with effort; security review needed |
| **2** | Azure environment needs provisioning; significant integration work; data access complex; security review required |
| **1** | No Azure environment; integration not feasible; data not accessible; security blockers |

---

## 12. Commercial Considerations

### 12.1 Pilot Pricing Model

| Factor | Consideration | Impact |
|---|---|---|
| **Pilot Discount** | 50–70% discount from standard pricing | Reduces revenue but maximises learning |
| **Pilot Duration** | 12 weeks | Fixed duration with extension option |
| **Payment Terms** | Upfront payment at pilot start | Reduces financial risk |
| **Conversion Incentive** | Preferential pricing for conversion to paid | Encourages retention |
| **Reference Commitment** | Commitment to provide reference post-pilot | Builds reference pipeline |

### 12.2 Commercial Readiness Assessment

| Assessment Area | Questions | Pass Criteria |
|---|---|---|
| **Budget Authority** | Does the customer have budget for the pilot? | Budget approved and available |
| **Decision-Making Process** | Is the decision-making process clear? | Clear decision-maker identified |
| **Procurement Timeline** | Can procurement be completed within pilot timeline? | Procurement achievable within 2 weeks |
| **Contract Flexibility** | Is the customer willing to accept pilot terms? | Pilot terms accepted |
| **Conversion Potential** | Is there realistic potential for conversion to paid? | Customer indicates intent to evaluate conversion |

### 12.3 Commercial-Based Scoring

| Score | Criteria |
|---|---|
| **5** | Budget approved; clear decision-maker; procurement within 1 week; strong conversion potential |
| **4** | Budget available; decision-maker identified; procurement within 2 weeks; good conversion potential |
| **3** | Budget being approved; decision-maker identified; procurement within 4 weeks; moderate conversion potential |
| **2** | Budget uncertain; decision-making unclear; procurement may exceed pilot timeline; low conversion potential |
| **1** | No budget; no clear decision-maker; procurement not feasible; no conversion potential |

---

## 13. Disqualification Criteria

### 13.1 Mandatory Disqualification Criteria

The following criteria will automatically disqualify a candidate from pilot consideration:

| Criterion | Rationale |
|---|---|
| **No active migration project** | MAP requires a real migration to validate |
| **No executive sponsorship** | Pilot cannot succeed without executive support |
| **No Azure environment** | MAP is optimised for Azure; other clouds not supported in pilot |
| **Unrealistic expectations** | Customer expects GA-level features and support |
| **Competitive conflict** | Customer is evaluating or using a direct competitor |
| **Non-disclosure refusal** | Customer refuses to sign NDA or pilot agreement |
| **Resource unavailability** | Customer cannot provide required resources |
| **Unethical practices** | Customer has history of unethical business practices |
| **Legal/compliance blockers** | Legal or compliance issues prevent pilot engagement |
| **Geographic restrictions** | Customer in unsupported geographic region |

### 13.2 Preferred Disqualification Criteria

The following criteria should strongly discourage pilot consideration (may be waived with executive approval):

| Criterion | Rationale |
|---|---|
| **Cloud-averse culture** | Customer has strong resistance to cloud adoption |
| **Extremely risk-averse** | Customer cannot tolerate any pilot issues |
| **Overly aggressive timeline** | Customer expects results within weeks, not months |
| **Unrealistic scope** | Customer wants to validate entire IT estate in pilot |
| **Poor communication** | Customer has history of poor communication or responsiveness |
| **Internal politics** | Significant internal political issues that may impact pilot |
| **Competing priorities** | Migration is not a top-3 priority for the organisation |
| **Technology mismatch** | Customer's technology stack is significantly misaligned with MAP |

### 13.3 Disqualification Process

| Step | Action | Owner | Timeline |
|---|---|---|---|
| 1 | Identify potential disqualifying factor | Selection Team | During evaluation |
| 2 | Verify disqualifying factor | Selection Team | Within 2 days |
| 3 | Consult with leadership if uncertain | Selection Team | Within 1 day |
| 4 | Document disqualification decision | Selection Team | Same day |
| 5 | Communicate decision to customer | CSM | Within 2 days |
| 6 | Update candidate tracking system | CSM | Same day |

---

## 14. Customer Selection Process

### 14.1 Selection Process Overview

| Phase | Activities | Duration | Owner |
|---|---|---|---|
| **Phase 1: Sourcing** | Identify potential candidates from pipeline, referrals, and market research | 2 weeks | Sales, Marketing |
| **Phase 2: Initial Screening** | Apply mandatory disqualification criteria; basic fit assessment | 1 week | Selection Team |
| **Phase 3: Deep Assessment** | Detailed evaluation against all criteria; technical assessment | 2 weeks | Selection Team, SE |
| **Phase 4: Scoring & Ranking** | Score candidates; rank and select top candidates | 1 week | Selection Team |
| **Phase 5: Final Selection** | Executive approval; customer engagement; contract negotiation | 1 week | Leadership, CSM |

### 14.2 Sourcing Channels

| Channel | Description | Expected Yield |
|---|---|---|
| **Existing Customer Pipeline** | Customers already in sales pipeline | High quality; warm leads |
| **Partner Referrals** | Referrals from technology partners | Moderate quality; needs validation |
| **Customer Referrals** | Referrals from existing customers | High quality; warm leads |
| **Market Research** | Identification through market research | Variable quality; needs validation |
| **Events/Conferences** | Leads from industry events | Variable quality; needs validation |
| **Inbound Interest** | Customers expressing interest in MAP | High intent; needs validation |

### 14.3 Initial Screening Checklist

| # | Question | Pass Criteria | Yes/No |
|---|---|---|---|
| 1 | Is there an active migration project? | Yes – migration planned or in execution | |
| 2 | Is there executive sponsorship? | Yes – C-level or VP-level sponsor identified | |
| 3 | Is there an Azure environment? | Yes – Azure subscription active | |
| 4 | Does the organisation size fit? | Yes – 500–5,000 employees | |
| 5 | Is the industry aligned? | Yes – Financial Services, Insurance, or Banking preferred | |
| 6 | Is there budget available? | Yes – budget approved or available | |
| 7 | Is the timeline realistic? | Yes – can start within 4 weeks | |
| 8 | Are there no blocking disqualifiers? | Yes – no mandatory disqualification criteria triggered | |

### 14.4 Deep Assessment Process

| Step | Activity | Owner | Duration |
|---|---|---|---|
| 1 | Schedule introductory meeting with customer | CSM | 1 day |
| 2 | Conduct discovery meeting (requirements, environment, expectations) | CSM, SE | 1–2 hours |
| 3 | Perform technical environment assessment | SE | 2–3 days |
| 4 | Assess cloud and migration maturity | SE | 1–2 days |
| 5 | Evaluate stakeholder availability and engagement | CSM | 1 day |
| 6 | Assess commercial readiness | CSM | 1 day |
| 7 | Document assessment findings | Selection Team | 1 day |
| 8 | Score candidate against all criteria | Selection Team | 1 day |

---

## 15. Scoring Methodology

### 15.1 Scoring Dimensions

| Dimension | Weight | Rationale |
|---|---|---|
| **Industry Fit** | 20% | Core to MAP's target market |
| **Organisation Size** | 15% | Impacts complexity and resource availability |
| **Cloud Maturity** | 20% | Determines need for MAP and learning value |
| **Migration Maturity** | 20% | Determines availability of validation scenarios |
| **Stakeholder Readiness** | 15% | Impacts pilot execution and feedback quality |
| **Technical Readiness** | 10% | Impacts deployment feasibility |
| **Commercial Readiness** | 10% | Impacts pilot execution and conversion potential |
| **Disqualification Risk** | Pass/Fail | Mandatory criteria must pass |

### 15.2 Scoring Scale

| Score | Rating | Description |
|---|---|---|
| **5** | Excellent | Exceeds requirements; ideal fit; maximum value |
| **4** | Good | Meets all requirements; strong fit; high value |
| **3** | Adequate | Meets most requirements; acceptable fit; moderate value |
| **2** | Below Average | Meets some requirements; marginal fit; limited value |
| **1** | Poor | Does not meet requirements; poor fit; minimal value |

### 15.3 Scoring Template

| Criterion | Weight | Score (1-5) | Weighted Score | Notes |
|---|---|---|---|---|
| Industry Fit | 20% | ___ | ___ | |
| Organisation Size | 15% | ___ | ___ | |
| Cloud Maturity | 20% | ___ | ___ | |
| Migration Maturity | 20% | ___ | ___ | |
| Stakeholder Readiness | 15% | ___ | ___ | |
| Technical Readiness | 10% | ___ | ___ | |
| Commercial Readiness | 10% | ___ | ___ | |
| **Total Weighted Score** | **100%** | | **___** | |

### 15.4 Scoring Thresholds

| Total Score | Classification | Action |
|---|---|---|
| **4.0–5.0** | **Highly Recommended** | Proceed to final selection |
| **3.5–3.9** | **Recommended** | Proceed to final selection with minor reservations |
| **3.0–3.4** | **Conditional** | Proceed only if higher-scoring candidates unavailable |
| **2.5–2.9** | **Marginal** | Not recommended; consider only with executive approval |
| **Below 2.5** | **Not Recommended** | Do not proceed |

---

## 16. Selection Decision Framework

### 16.1 Selection Committee

| Role | Responsibility | Vote |
|---|---|---|
| **Head of Customer Success** | Overall pilot customer fit | Yes |
| **VP of Engineering** | Technical feasibility | Yes |
| **Product Manager** | Product-market fit validation | Yes |
| **Sales Lead** | Commercial viability | Yes |
| **Executive Sponsor** | Final approval (tie-breaker) | Yes |

### 16.2 Decision Meeting Agenda

| # | Topic | Duration | Owner |
|---|---|---|---|
| 1 | Review candidate scores and assessments | 15 min | Selection Team |
| 2 | Discuss strengths and concerns | 15 min | Committee |
| 3 | Address questions and clarifications | 10 min | Committee |
| 4 | Vote on candidate selection | 5 min | Committee |
| 5 | Document decision and rationale | 5 min | Selection Team |

### 16.3 Decision Outcomes

| Outcome | Criteria | Next Steps |
|---|---|---|
| **Approved** | Majority vote in favour; score ≥ 3.5 | Proceed to customer engagement |
| **Conditionally Approved** | Majority vote in favour with conditions; score ≥ 3.0 | Address conditions before proceeding |
| **Deferred** | Insufficient information; score 2.5–2.9 | Gather additional information |
| **Rejected** | Majority vote against; score < 2.5 | Document rationale; communicate to customer |

### 16.4 Pilot Customer Portfolio

The pilot program aims for 3–5 customers with the following portfolio mix:

| Portfolio Element | Target | Rationale |
|---|---|---|
| **Industry Mix** | 2 Financial Services, 1 Insurance, 1 Banking | Validates across core industries |
| **Size Mix** | 2 medium (500–2,500), 2 mid-large (2,500–5,000) | Validates across size segments |
| **Migration Type Mix** | 2 lift-and-shift, 1 re-platform, 1 re-architect | Validates across migration patterns |
| **Geography Mix** | All UK-based (for pilot) | Simplifies logistics and compliance |
| **Complexity Mix** | 2 moderate, 2 complex | Balances learning value and risk |

---

## 17. Dependencies

| Dependency | Description | Impact if Delayed | Mitigation |
|---|---|---|---|
| Customer pipeline availability | Sufficient candidates in pipeline | Limits selection options | Begin sourcing early; multiple channels |
| Sales engagement | Sales team support for customer identification | Slows candidate identification | Align incentives; early engagement |
| Technical assessment capacity | SE availability for assessments | Delays deep assessment | Pre-schedule assessment windows |
| Contract/legal review | Legal review of pilot agreements | Delays contract execution | Pre-prepare standard pilot agreement |
| Executive availability | Leadership availability for decision meetings | Delays selection decisions | Pre-schedule decision meetings |
| Customer responsiveness | Customer responsiveness to assessment requests | Delays assessment completion | Set clear expectations; follow up |

---

## 18. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Chief Product Officer | _________________ | _________________ | ___/___/2026 |
| VP of Engineering | _________________ | _________________ | ___/___/2026 |
| Director of Customer Success | _________________ | _________________ | ___/___/2026 |
| Head of Sales | _________________ | _________________ | ___/___/2026 |

---

*End of Document – MAP-PILOT-CUST-002 v1.0*
