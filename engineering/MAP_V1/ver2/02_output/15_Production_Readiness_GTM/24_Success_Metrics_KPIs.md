# MAP (Migration Assurance Platform) — Success Metrics & KPIs

| Field          | Value                                      |
|----------------|--------------------------------------------|
| **Document**   | Success Metrics & Key Performance Indicators |
| **Version**    | 1.0                                        |
| **Date**       | July 2026                                  |
| **Status**     | Official                                   |
| **Classification** | Internal — Leadership Use Only          |
| **Owner**      | VP of Product / VP of Revenue              |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Document Content](#2-document-content)
3. [Dependencies](#3-dependencies)
4. [References](#4-references)
5. [KPI Framework Overview](#5-kpi-framework-overview)
6. [Business KPIs](#6-business-kpis)
7. [Product KPIs](#7-product-kpis)
8. [Technical KPIs](#8-technical-kpis)
9. [Customer KPIs](#9-customer-kpis)
10. [Operational KPIs](#10-operational-kpis)
11. [Marketing KPIs](#11-marketing-kpis)
12. [Sales KPIs](#12-sales-kpis)
13. [KPI Targets](#13-kpi-targets)
14. [Best Practices](#14-best-practices)
15. [Appendices](#15-appendices)
16. [Revision History](#16-revision-history)
17. [Approval](#17-approval)

---

## 1. Purpose

This document defines the comprehensive set of Success Metrics and Key Performance Indicators (KPIs) for the MAP (Migration Assurance Platform). It establishes measurable standards across business, product, technical, customer, operational, marketing, and sales dimensions to guide data-driven decision-making throughout the product lifecycle.

### 1.1 Objectives

- Define a single source of truth for all MAP performance metrics
- Establish clear targets, thresholds, and accountability for each KPI
- Enable consistent measurement and reporting across all departments
- Support strategic decision-making with reliable, standardised data
- Create a framework for continuous improvement and optimisation

### 1.2 Scope

This document covers all KPIs relevant to MAP across the following dimensions:

| Dimension        | Description                                            |
|------------------|--------------------------------------------------------|
| Business KPIs    | Revenue, customers, market share, and financial health  |
| Product KPIs     | Adoption, engagement, retention, and feature performance|
| Technical KPIs   | Performance, reliability, scalability, and security     |
| Customer KPIs    | Satisfaction, loyalty, advocacy, and churn              |
| Operational KPIs | Support efficiency, resolution, and process quality     |
| Marketing KPIs   | Lead generation, funnel performance, and brand metrics  |
| Sales KPIs       | Pipeline, conversion, deal metrics, and forecasting     |

### 1.3 Audience

| Role                          | Usage                            |
|-------------------------------|----------------------------------|
| CEO / COO                     | Strategic health assessment      |
| CFO                           | Financial performance tracking   |
| CRO                           | Revenue and pipeline management  |
| CTO / VP Engineering          | Technical health and SLA tracking|
| VP Product                    | Product performance and roadmap  |
| VP Customer Success           | Customer health and retention    |
| VP Marketing                  | Marketing effectiveness          |
| Department Heads              | Team-level KPI ownership         |

---

## 2. Document Content

| Section                    | Description                                                  |
|----------------------------|--------------------------------------------------------------|
| Business KPIs              | Revenue growth, market share, financial health metrics       |
| Product KPIs               | Adoption rates, engagement depth, feature usage              |
| Technical KPIs             | Performance benchmarks, reliability targets, security posture|
| Customer KPIs              | NPS, CSAT, CES, churn, and satisfaction metrics              |
| Operational KPIs           | Support response, resolution time, process efficiency        |
| Marketing KPIs             | Lead generation, funnel conversion, campaign performance     |
| Sales KPIs                 | Pipeline velocity, win rate, deal metrics                    |
| KPI Targets                | Monthly, quarterly, and annual target frameworks             |
| Best Practices             | SMART criteria, alignment, review cadence                    |

---

## 3. Dependencies

| Dependency                    | Description                                                  | Owner              |
|-------------------------------|--------------------------------------------------------------|--------------------|
| MAP Platform v1.4 Production | Stable production environment for metric collection          | VP Engineering     |
| Analytics Infrastructure     | Mixpanel, Amplitude, or equivalent for product analytics     | Product Analytics  |
| CRM System                   | Salesforce for pipeline, revenue, and customer data          | Revenue Ops       |
| Monitoring Stack             | Datadog, Grafana for technical performance metrics           | SRE Lead           |
| Support Platform             | Zendesk, Intercom for support and operational metrics        | VP Customer Success|
| Financial System             | NetSuite / QuickBooks for revenue and cost data              | Finance            |
| Survey Tools                 | Delighted, Typeform for NPS, CSAT, CES surveys              | VP Customer Success|
| Marketing Automation         | HubSpot, Marketo for lead and campaign metrics              | VP Marketing       |

---

## 4. References

| Document                        | Location / Link                                       |
|---------------------------------|-------------------------------------------------------|
| MAP Product Requirements Doc    | 01_PRD_MAP_v1.4.md                                    |
| MAP Executive Launch Dashboard  | 23_Executive_Launch_Dashboard.md                      |
| MAP GTM Strategy                | 14_GTM_Strategy.md                                    |
| MAP SLA Definitions             | 11_SLA_Definitions.md                                 |
| MAP Risk Register               | 12_Risk_Register.md                                   |
| MAP Financial Projections       | 10_Financial_Projections.md                           |
| MAP Monitoring Configuration    | Datadog / Grafana Configuration                       |
| Industry Benchmarks             | SaaS Benchmarks Report 2026                           |

---

## 5. KPI Framework Overview

### 5.1 KPI Classification Model

All MAP KPIs follow a four-tier classification model:

| Tier     | Description                    | Examples                        |
|----------|--------------------------------|---------------------------------|
| Tier 1   | North Star KPI (company-level) | MRR, ARR, Net Revenue Retention |
| Tier 2   | Strategic KPI (department-level)| NPS, DAU, Win Rate             |
| Tier 3   | Operational KPI (team-level)   | Support Response Time, Error Rate|
| Tier 4   | Tactical KPI (individual-level)| Tickets Resolved, Calls Made    |

### 5.2 KPI Ownership Model

| KPI Level   | Owner              | Review Frequency | Escalation Path          |
|-------------|--------------------|------------------|--------------------------|
| Tier 1      | CEO / Executive    | Weekly           | Board of Directors       |
| Tier 2      | VP / C-Suite       | Weekly           | CEO                      |
| Tier 3      | Director / Manager | Bi-weekly        | VP                       |
| Tier 4      | Individual Owner   | Weekly           | Manager                  |

### 5.3 RAG Threshold Framework

All KPIs use a standardised RAG (Red/Amber/Green) threshold system:

| Status | Definition                                           |
|--------|------------------------------------------------------|
| 🟢 GREEN  | At or above target — continue current trajectory    |
| 🟡 AMBER  | Within 10% of target — monitor and adjust           |
| 🔴 RED    | Below 90% of target — immediate action required     |

### 5.4 Measurement Frequency Matrix

| Frequency   | KPI Types                                          |
|-------------|----------------------------------------------------|
| Real-time   | Uptime, Error Rate, Active Users                   |
| Hourly      | API Response Time, Queue Depth                     |
| Daily       | Revenue, Signups, Support Tickets                  |
| Weekly      | NPS, DAU/WAU, Pipeline Value                       |
| Monthly     | MRR, CAC, LTV, Churn Rate                          |
| Quarterly   | Market Share, Customer Health Score, Expansion      |

---

## 6. Business KPIs

### 6.1 Revenue KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| B-01   | Monthly Recurring Revenue (MRR) | Total monthly subscription revenue          | Σ (Monthly subscription per customer)| $10,000     | $60,000     | $300,000     | 🟡     |
| B-02   | Annual Recurring Revenue (ARR)  | Annualised subscription revenue             | MRR × 12                             | $120,000    | $720,000    | $3,600,000   | 🟡     |
| B-03   | MRR Growth Rate             | Month-over-month MRR growth                    | (MRR_current - MRR_prev) / MRR_prev × 100 | 50%     | 40%         | 20%          | 🟢     |
| B-04   | Net Revenue Retention (NRR) | Revenue retained from existing customers       | (Beginning MRR + Expansion - Contraction - Churn) / Beginning MRR × 100 | 100% | 110% | 120% | 🟡 |
| B-05   | Gross Revenue Retention (GRR) | Revenue retained without expansion            | (Beginning MRR - Contraction - Churn) / Beginning MRR × 100 | 90% | 90% | 90% | 🟡 |
| B-06   | Average Revenue Per Account (ARPA) | Average monthly revenue per customer      | MRR / Total Customers                | $1,500      | $2,000      | $2,500       | 🟢     |

### 6.2 Customer KPIs (Business)

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| B-07   | Total Customers             | Cumulative number of paying customers           | Count of active subscriptions        | 50          | 250         | 1,200        | 🟡     |
| B-08   | New Customers (Monthly)     | New customers acquired in period                | Count of new subscriptions           | 30          | 50          | 60           | 🟡     |
| B-09   | Customer Churn Rate         | Percentage of customers lost in period          | (Customers lost / Beginning customers) × 100 | 5% | 3% | 2% | 🟡 |
| B-10   | Customer Expansion Rate     | Percentage of customers upgrading/expanding     | (Customers expanding / Beginning customers) × 100 | 8% | 12% | 15% | 🟡 |
| B-11   | Customer Lifetime (Average) | Average customer relationship duration (months) | 1 / Monthly Churn Rate               | 20          | 33          | 50           | 🟡     |

### 6.3 Market Share KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| B-12   | Market Share (Revenue)      | Percentage of addressable market captured       | (MAP Revenue / TAM Revenue) × 100    | 0.5%        | 1.5%        | 5.0%         | 🟡     |
| B-13   | Market Share (Users)        | Percentage of addressable users captured        | (MAP Users / TAM Users) × 100        | 0.3%        | 1.0%        | 3.0%         | 🟡     |
| B-14   | Competitive Win Rate        | Win rate against primary competitors            | (Wins / (Wins + Losses)) × 100       | 40%         | 50%         | 55%          | 🟡     |
| B-15   | Brand Awareness (Aided)     | Percentage of target market aware of MAP        | Brand survey results                 | 5%          | 15%         | 35%          | 🟡     |

### 6.4 Financial Health KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| B-16   | Customer Acquisition Cost (CAC) | Total cost to acquire one customer            | Total Sales & Marketing Spend / New Customers | $3,500 | $2,500 | $1,800 | 🟢 |
| B-17   | Customer Lifetime Value (LTV) | Total expected revenue from one customer       | ARPA × Gross Margin × Customer Lifetime | $15,000 | $50,000 | $75,000 | 🟢 |
| B-18   | LTV:CAC Ratio               | Return on customer acquisition investment       | LTV / CAC                            | 4.3:1       | 20:1        | 41.7:1       | 🟢     |
| B-19   | CAC Payback Period (Months) | Months to recover acquisition cost              | CAC / (ARPA × Gross Margin)          | 18          | 10          | 7            | 🟡     |
| B-20   | Monthly Burn Rate           | Net cash outflow per month                      | Total Expenses - Total Revenue       | $50,000     | $25,000     | -$50,000 (profit)| 🟡 |
| B-21   | Gross Margin                | Percentage of revenue after COGS                | ((Revenue - COGS) / Revenue) × 100   | 72%         | 78%         | 82%          | 🟡     |

---

## 7. Product KPIs

### 7.1 Adoption KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| P-01   | Daily Active Users (DAU)    | Unique users active in 24 hours                 | Count distinct users with activity   | 100         | 500         | 2,500        | 🟡     |
| P-02   | Weekly Active Users (WAU)   | Unique users active in 7 days                   | Count distinct users with activity   | 250         | 1,200       | 6,000        | 🟡     |
| P-03   | Monthly Active Users (MAU)  | Unique users active in 30 days                  | Count distinct users with activity   | 500         | 2,500       | 12,000       | 🟡     |
| P-04   | DAU/MAU Ratio (Stickiness) | Daily engagement relative to monthly            | DAU / MAU × 100                      | 20%         | 25%         | 30%          | 🟡     |
| P-05   | Activation Rate (Day 1)    | Percentage of signups completing onboarding     | (Activated users / Total signups) × 100 | 40%     | 50%         | 60%          | 🟡     |
| P-06   | Activation Rate (Day 7)    | Percentage of signups active after 7 days       | (Active Day 7 / Total signups) × 100 | 25%         | 35%         | 45%          | 🟡     |
| P-07   | Time to First Value (TTFV) | Time from signup to first meaningful action     | Median time (minutes)                | 30 min      | 20 min      | 10 min       | 🟡     |

### 7.2 Engagement KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| P-08   | Feature Adoption Rate       | Percentage of users using a specific feature    | (Feature users / Total users) × 100  | Varies      | Varies      | Varies       | 🟡     |
| P-09   | Session Duration (Average)  | Average time per session                        | Total session time / Total sessions  | 8 min       | 12 min      | 15 min       | 🟡     |
| P-10   | Sessions per User (Weekly)  | Average sessions per user per week              | Total sessions / Unique users        | 2.5         | 3.5         | 4.5          | 🟡     |
| P-11   | Core Feature Usage Rate     | Percentage using core migration feature         | (Core feature users / Total users) × 100 | 60%     | 70%         | 80%          | 🟡     |
| P-12   | Power User Rate             | Percentage of users with high engagement        | (Users with 5+ sessions/week / Total users) × 100 | 5% | 10% | 15% | 🟡 |
| P-13   | Feature Depth Score         | Average number of features used per user        | Total feature usages / Total users   | 3.0         | 4.5         | 6.0          | 🟡     |

### 7.3 Retention KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| P-14   | Day 7 Retention             | Percentage returning after 7 days               | (Users active Day 7 / Users active Day 0) × 100 | 45% | 55% | 65% | 🟡 |
| P-15   | Day 30 Retention            | Percentage returning after 30 days              | (Users active Day 30 / Users active Day 0) × 100 | 30% | 40% | 50% | 🟡 |
| P-16   | Day 90 Retention            | Percentage returning after 90 days              | (Users active Day 90 / Users active Day 0) × 100 | 20% | 30% | 40% | 🟡 |
| P-17   | Product Churn Rate          | Percentage stopping product usage               | (Churned users / Beginning users) × 100 | 8% | 5% | 3% | 🟡 |
| P-18   | Reactivation Rate           | Percentage of churned users returning           | (Reactivated users / Churned users) × 100 | 10% | 15% | 20% | 🟡 |
| P-19   | Renewal Rate                | Percentage of subscriptions renewed             | (Renewed subscriptions / Total renewals) × 100 | 85% | 90% | 95% | 🟡 |

### 7.4 Feature Performance KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target      | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|--------|
| P-20   | Migration Success Rate      | Percentage of migrations completing successfully | (Successful migrations / Total migrations) × 100 | 99% | 🟢 |
| P-21   | Validation Accuracy         | Percentage of validations correctly identifying issues | (Correct validations / Total validations) × 100 | 99.5% | 🟢 |
| P-22   | Report Generation Speed     | Time to generate standard reports               | Median time (seconds)                | ≤ 5s        | 🟡     |
| P-23   | Data Mapping Accuracy       | Percentage of correct field mappings             | (Correct mappings / Total mappings) × 100 | 98% | 🟢 |
| P-24   | Workflow Completion Rate    | Percentage of workflows started and completed    | (Completed workflows / Started workflows) × 100 | 90% | 🟡 |

---

## 8. Technical KPIs

### 8.1 Performance KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| T-01   | API Response Time (P50)     | Median API response time                        | Median of all API responses          | ≤ 200ms     | ≤ 150ms     | ≤ 100ms      | 🟢     |
| T-02   | API Response Time (P95)     | 95th percentile API response time               | 95th percentile of all API responses | ≤ 500ms     | ≤ 400ms     | ≤ 300ms      | 🟢     |
| T-03   | API Response Time (P99)     | 99th percentile API response time               | 99th percentile of all API responses | ≤ 1000ms    | ≤ 800ms     | ≤ 600ms      | 🟡     |
| T-04   | Dashboard Load Time         | Time for dashboard to fully render               | Median time (seconds)                | ≤ 3s        | ≤ 2s        | ≤ 1.5s       | 🟡     |
| T-05   | Migration Job Speed         | Time to process standard migration job          | Median time (seconds)                | ≤ 5s        | ≤ 3s        | ≤ 2s         | 🟡     |
| T-06   | Throughput (Requests/sec)   | Maximum sustained request rate                  | Measured under load                  | 500 rps     | 1,000 rps   | 2,000 rps    | 🟢     |

### 8.2 Reliability KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| T-07   | Uptime (Monthly)            | Percentage of time platform is operational      | (Total minutes - Downtime) / Total minutes × 100 | 99.95% | 99.95% | 99.99% | 🟢 |
| T-08   | Mean Time Between Failures (MTBF) | Average uptime between incidents          | Total uptime / Number of failures    | 720 hrs     | 1,000 hrs   | 2,000 hrs    | 🟢     |
| T-09   | Mean Time To Repair (MTTR)  | Average time to resolve incidents               | Total resolution time / Number of incidents | ≤ 60 min | ≤ 30 min | ≤ 15 min | 🟡 |
| T-10   | Error Rate (5xx)            | Percentage of server errors                     | (5xx responses / Total responses) × 100 | ≤ 0.05% | ≤ 0.02% | ≤ 0.01% | 🟢 |
| T-11   | Error Rate (All)            | Total error rate across all categories          | (Total errors / Total responses) × 100 | ≤ 2.0% | ≤ 1.5% | ≤ 1.0% | 🟢 |
| T-12   | SLA Compliance              | Percentage meeting contractual SLA              | (Requests within SLA / Total requests) × 100 | 99.9% | 99.95% | 99.99% | 🟢 |

### 8.3 Scalability KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| T-13   | CPU Utilisation             | Average CPU usage across cluster                | Average percentage                   | ≤ 60%       | ≤ 55%       | ≤ 50%        | 🟢     |
| T-14   | Memory Utilisation          | Average memory usage across cluster             | Average percentage                   | ≤ 70%       | ≤ 65%       | ≤ 60%        | 🟢     |
| T-15   | Database Connection Usage   | Percentage of DB connections in use             | (Active connections / Max connections) × 100 | ≤ 60% | ≤ 55% | ≤ 50% | 🟢 |
| T-16   | Queue Depth                 | Maximum queue depth before alerting             | Peak queue size                      | ≤ 5,000     | ≤ 3,000     | ≤ 2,000      | 🟢     |
| T-17   | Horizontal Scale-Up Time    | Time to add new instances                       | Measured in minutes                  | ≤ 10 min    | ≤ 5 min     | ≤ 3 min      | 🟡     |
| T-18   | Cache Hit Rate              | Percentage of requests served from cache        | (Cache hits / Total requests) × 100  | ≥ 85%       | ≥ 90%       | ≥ 95%        | 🟢     |

### 8.4 Security KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target      | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|--------|
| T-19   | Security Incidents          | Number of security incidents per month          | Count                                | 0           | 🟢     |
| T-20   | Vulnerability Patch Time    | Time from discovery to patch for critical vulns | Average hours                        | ≤ 24 hrs    | 🟡     |
| T-21   | Penetration Test Results    | Critical/High findings from pen tests           | Count                                | 0           | 🟡     |
| T-22   | Data Encryption Coverage    | Percentage of data encrypted at rest + transit  | Percentage                           | 100%        | 🟢     |
| T-23   | Access Control Compliance   | Percentage of resources with RBAC               | Percentage                           | 100%        | 🟢     |
| T-24   | Audit Log Completeness      | Percentage of actions logged                    | Percentage                           | 100%        | 🟢     |

---

## 9. Customer KPIs

### 9.1 Net Promoter Score (NPS)

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| C-01   | NPS Score                   | Customer likelihood to recommend                | % Promoters - % Detractors           | +20         | +40         | +60          | 🟡     |
| C-02   | NPS Promoters (%)           | Customers scoring 9-10                          | (Promoters / Total responses) × 100  | 35%         | 50%         | 65%          | 🟡     |
| C-03   | NPS Passives (%)            | Customers scoring 7-8                           | (Passives / Total responses) × 100   | 45%         | 40%         | 30%          | 🟡     |
| C-04   | NPS Detractors (%)          | Customers scoring 0-6                           | (Detractors / Total responses) × 100 | 20%         | 10%         | 5%           | 🟡     |
| C-05   | NPS Response Rate           | Percentage of customers responding to NPS       | (Responses / Total customers) × 100  | 30%         | 35%         | 40%          | 🟡     |

### 9.2 Customer Satisfaction (CSAT)

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| C-06   | CSAT Score                  | Overall customer satisfaction rating            | (Satisfied responses / Total responses) × 100 | 80% | 85% | 90% | 🟡 |
| C-07   | CSAT (Product)              | Satisfaction with product experience            | Product-specific survey score        | 78%         | 83%         | 88%          | 🟡     |
| C-08   | CSAT (Support)              | Satisfaction with support interactions          | Support-specific survey score        | 82%         | 87%         | 92%          | 🟡     |
| C-09   | CSAT (Onboarding)           | Satisfaction with onboarding experience         | Onboarding survey score              | 75%         | 82%         | 88%          | 🟡     |
| C-10   | CSAT Response Rate          | Percentage of customers responding to CSAT      | (Responses / Total customers) × 100  | 25%         | 30%         | 35%          | 🟡     |

### 9.3 Customer Effort Score (CES)

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| C-11   | CES Score                   | Ease of completing key tasks                    | Average effort rating (1-7 scale)    | 5.0         | 5.5         | 6.0          | 🟡     |
| C-12   | CES (Migration)             | Effort to complete migration                    | Migration-specific survey score      | 4.5         | 5.0         | 5.5          | 🟡     |
| C-13   | CES (Setup)                 | Effort to set up account                        | Setup-specific survey score          | 5.0         | 5.5         | 6.0          | 🟡     |
| C-14   | CES (Support)               | Effort to get support issue resolved            | Support-specific survey score        | 5.5         | 6.0         | 6.5          | 🟡     |

### 9.4 Customer Churn

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| C-15   | Customer Churn Rate         | Percentage of customers lost per month          | (Lost customers / Beginning customers) × 100 | 5% | 3% | 1.5% | 🟡 |
| C-16   | Revenue Churn Rate          | Percentage of revenue lost per month            | (Lost MRR / Beginning MRR) × 100     | 4%          | 2.5%        | 1.0%         | 🟡     |
| C-17   | Logo Churn Rate             | Percentage of logos lost per quarter            | (Lost logos / Beginning logos) × 100  | 10%         | 6%          | 3%           | 🟡     |
| C-18   | Voluntary Churn Rate       | Percentage of customers choosing to leave      | (Voluntary churn / Total churn) × 100| 60%         | 55%         | 50%          | 🟡     |
| C-19   | Involuntary Churn Rate     | Percentage lost due to payment/billing issues   | (Involuntary churn / Total churn) × 100 | 40%     | 45%         | 50%          | 🟡     |
| C-20   | Save Rate (At-Risk)         | Percentage of at-risk customers retained        | (Saved customers / At-risk customers) × 100 | 20% | 30% | 40% | 🟡 |

### 9.5 Customer Health Score

| Component              | Weight | Scoring Criteria                                   |
|------------------------|--------|----------------------------------------------------|
| Product Usage          | 30%    | DAU/MAU, feature adoption, session frequency        |
| Support Interactions   | 15%    | Ticket volume, CSAT, escalation frequency          |
| NPS/CSAT               | 20%    | Latest survey scores                               |
| Payment Health         | 15%    | Payment failures, billing disputes                 |
| Contract Status        | 10%    | Renewal date, contract value changes               |
| Engagement             | 10%    | Email opens, event attendance, community activity  |

**Health Score Calculation:**

```
Health Score = (Usage Score × 0.30) + (Support Score × 0.15) + 
               (Satisfaction Score × 0.20) + (Payment Score × 0.15) + 
               (Contract Score × 0.10) + (Engagement Score × 0.10)

Health Tiers:
  🟢 Healthy   : Score ≥ 80 — No intervention needed
  🟡 At Risk   : Score 60–79 — Proactive outreach recommended
  🔴 Critical  : Score < 60 — Immediate action required
```

---

## 10. Operational KPIs

### 10.1 Support Response KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| O-01   | First Response Time (FRT)   | Time from ticket creation to first response     | Median time                          | ≤ 4 hours   | ≤ 2 hours   | ≤ 1 hour     | 🟡     |
| O-02   | First Response Time (P1)    | FRT for Priority 1 (critical) tickets           | Median time                          | ≤ 15 min    | ≤ 10 min    | ≤ 5 min      | 🟡     |
| O-03   | First Response Time (P2)    | FRT for Priority 2 (high) tickets               | Median time                          | ≤ 1 hour    | ≤ 30 min    | ≤ 15 min     | 🟡     |
| O-04   | First Contact Resolution    | Percentage resolved on first contact            | (Resolved first contact / Total tickets) × 100 | 40% | 50% | 60% | 🟡 |
| O-05   | Support Ticket Volume       | Total tickets created per week                  | Count                                | Track trend | Track trend | Track trend  | —      |
| O-06   | Ticket Backlog              | Number of open tickets exceeding SLA            | Count                                | ≤ 5         | ≤ 3         | ≤ 1          | 🟡     |

### 10.2 Resolution Time KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| O-07   | Time to Resolution (TTR)    | Total time from ticket creation to resolution   | Median time                          | ≤ 24 hours  | ≤ 16 hours  | ≤ 8 hours    | 🟡     |
| O-08   | TTR (P1)                    | Resolution time for Priority 1 tickets          | Median time                          | ≤ 4 hours   | ≤ 2 hours   | ≤ 1 hour     | 🟡     |
| O-09   | TTR (P2)                    | Resolution time for Priority 2 tickets          | Median time                          | ≤ 8 hours   | ≤ 4 hours   | ≤ 2 hours    | 🟡     |
| O-10   | SLA Compliance (Response)   | Percentage meeting response SLA                 | (Tickets within SLA / Total tickets) × 100 | 95% | 97% | 99% | 🟡 |
| O-11   | SLA Compliance (Resolution) | Percentage meeting resolution SLA               | (Tickets within SLA / Total tickets) × 100 | 90% | 95% | 98% | 🟡 |
| O-12   | Reopen Rate                 | Percentage of resolved tickets reopened         | (Reopened tickets / Resolved tickets) × 100 | ≤ 10% | ≤ 7% | ≤ 5% | 🟡 |

### 10.3 Process Efficiency KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| O-13   | Agent Utilisation           | Percentage of time agents spend on tickets      | (Ticket time / Available time) × 100 | 75%         | 78%         | 80%          | 🟡     |
| O-14   | Tickets per Agent per Day   | Average tickets handled per agent per day       | Total tickets / Agent-days           | 15          | 18          | 20           | 🟡     |
| O-15   | Escalation Rate             | Percentage of tickets requiring escalation      | (Escalated tickets / Total tickets) × 100 | ≤ 20% | ≤ 15% | ≤ 10% | 🟡 |
| O-16   | Self-Service Resolution     | Percentage resolved via knowledge base/chatbot  | (Self-resolved / Total resolved) × 100 | 15% | 25% | 35% | 🟡 |
| O-17   | Knowledge Base Usage        | Percentage of tickets where KB article accessed | (KB accesses / Total tickets) × 100  | 30%         | 40%         | 50%          | 🟡     |
| O-18   | Documentation Completeness  | Percentage of features with complete docs       | (Documented features / Total features) × 100 | 80% | 90% | 98% | 🟡 |

---

## 11. Marketing KPIs

### 11.1 Lead Generation KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| M-01   | Website Visitors (Monthly)  | Unique visitors to MAP website                  | Count                                | 10,000      | 20,000      | 50,000       | 🟡     |
| M-02   | Organic Traffic             | Visitors from organic search                    | Count                                | 3,000       | 8,000       | 25,000       | 🟡     |
| M-03   | Paid Traffic                | Visitors from paid campaigns                    | Count                                | 5,000       | 8,000       | 12,000       | 🟡     |
| M-04   | Total Leads                 | All leads captured                              | Count                                | 500         | 1,000       | 2,500        | 🟡     |
| M-05   | Lead Capture Rate           | Percentage of visitors becoming leads           | (Leads / Visitors) × 100             | 5.0%        | 5.0%        | 5.0%         | 🟢     |
| M-06   | Content Downloads           | Total gated content downloads                   | Count                                | 200         | 500         | 1,200        | 🟡     |
| M-07   | Webinar Registrations       | Registrations for MAP webinars                  | Count                                | 100         | 250         | 500          | 🟡     |

### 11.2 Funnel Conversion KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| M-08   | MQL Volume                  | Marketing Qualified Leads generated             | Count                                | 150         | 350         | 800          | 🟡     |
| M-09   | MQL to SQL Conversion       | Percentage of MQLs becoming SQLs                | (SQLs / MQLs) × 100                  | 25%         | 30%         | 35%          | 🟡     |
| M-10   | SQL Volume                  | Sales Qualified Leads generated                 | Count                                | 38          | 105         | 280          | 🟡     |
| M-11   | SQL to Opportunity          | Percentage of SQLs becoming opportunities       | (Opps / SQLs) × 100                  | 40%         | 50%         | 60%          | 🟡     |
| M-12   | MQL to Customer             | End-to-end marketing conversion                 | (Customers / MQLs) × 100             | 2.0%        | 3.0%        | 4.0%         | 🟡     |
| M-13   | Funnel Velocity             | Average time from MQL to Closed-Won             | Average days                          | 60 days     | 45 days     | 30 days      | 🟡     |

### 11.3 Campaign Performance KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target      | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|--------|
| M-14   | Cost per Lead (CPL)         | Average cost to generate one lead               | Total spend / Total leads            | ≤ $25       | 🟡     |
| M-15   | Cost per MQL                | Average cost to generate one MQL                | Total spend / Total MQLs             | ≤ $100      | 🟡     |
| M-16   | Cost per SQL                | Average cost to generate one SQL                | Total spend / Total SQLs             | ≤ $300      | 🟡     |
| M-17   | Cost per Customer (Mktg)    | Marketing cost to acquire one customer          | Mktg spend / Mktg-sourced customers  | ≤ $2,000    | 🟡     |
| M-18   | Email Open Rate             | Percentage of marketing emails opened           | (Opens / Delivered) × 100            | ≥ 20%       | 🟡     |
| M-19   | Email Click-Through Rate    | Percentage of opened emails clicked             | (Clicks / Opens) × 100               | ≥ 3.0%      | 🟡     |
| M-20   | Social Engagement Rate      | Engagement on social media posts                | (Engagements / Impressions) × 100    | ≥ 2.0%      | 🟡     |
| M-21   | Search Ranking (Primary KW) | Google ranking for primary keywords             | Average position                      | Top 10      | 🟡     |

### 11.4 Brand & Awareness KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target      | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|--------|
| M-22   | Share of Voice              | Percentage of industry mentions                 | (MAP mentions / Total mentions) × 100| 5%          | 🟡     |
| M-23   | Brand Search Volume         | Monthly branded search queries                  | Count                                | Track trend | —      |
| M-24   | Backlink Growth             | Number of new referring domains per month       | Count                                | 20          | 🟡     |
| M-25   | PR/Media Mentions           | Number of media mentions per quarter            | Count                                | 5           | 🟡     |
| M-26   | Analyst Report Inclusions   | Inclusion in industry analyst reports           | Count                                | 1           | 🟡     |

---

## 12. Sales KPIs

### 12.1 Pipeline KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| S-01   | Pipeline Value              | Total value of open opportunities               | Sum of all open opp values           | $200,000    | $500,000    | $2,000,000   | 🟡     |
| S-02   | Pipeline Coverage           | Pipeline value relative to quota                | Pipeline Value / Monthly Quota       | 3.0x        | 3.5x        | 4.0x         | 🟡     |
| S-03   | New Pipeline Created        | Value of new opportunities opened this month    | Sum of new opp values                | $80,000     | $200,000    | $500,000     | 🟡     |
| S-04   | Pipeline Velocity           | Speed at which pipeline converts to revenue     | (# Opps × Win Rate × ACV) / Sales Cycle | Track trend | Track trend | Track trend | — |
| S-05   | Pipeline by Stage           | Distribution of pipeline across stages          | Percentage per stage                 | Varies      | Varies      | Varies       | —      |
| S-06   | Stale Pipeline Rate         | Percentage of pipeline > 60 days old            | (Stale opps / Total opps) × 100     | ≤ 25%       | ≤ 20%       | ≤ 15%        | 🟡     |

### 12.2 Win Rate KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| S-07   | Overall Win Rate            | Percentage of opportunities closed won          | (Won / (Won + Lost)) × 100           | 35%         | 42%         | 50%          | 🟡     |
| S-08   | Win Rate (SMB)              | Win rate for SMB segment                        | (Won SMB / Total SMB opps) × 100     | 40%         | 48%         | 55%          | 🟡     |
| S-09   | Win Rate (Mid-Market)       | Win rate for Mid-Market segment                 | (Won Mid-Mkt / Total Mid-Mkt opps) × 100 | 30%  | 38%         | 45%          | 🟡     |
| S-10   | Win Rate (Enterprise)       | Win rate for Enterprise segment                 | (Won Enterprise / Total Enterprise opps) × 100 | 20% | 28% | 35% | 🟡 |
| S-11   | Competitive Win Rate        | Win rate against primary competitors            | (Comp Wins / (Comp Wins + Comp Losses)) × 100 | 40% | 50% | 55% | 🟡 |
| S-12   | Inbound vs Outbound Win     | Win rate comparison by lead source              | Ratio / comparison                   | Track       | Track       | Track        | —      |

### 12.3 Deal Size KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| S-13   | Average Deal Size (ACV)     | Average annual contract value                   | Total ACV / Total deals              | $2,000      | $2,500      | $3,000       | 🟡     |
| S-14   | Average Deal Size (SMB)     | Average ACV for SMB segment                     | SMB ACV / SMB deals                  | $1,200      | $1,500      | $1,800       | 🟡     |
| S-15   | Average Deal Size (Mid-Mkt) | Average ACV for Mid-Market segment              | Mid-Mkt ACV / Mid-Mkt deals          | $3,500      | $4,500      | $5,500       | 🟡     |
| S-16   | Average Deal Size (Enterprise)| Average ACV for Enterprise segment             | Enterprise ACV / Enterprise deals    | $10,000     | $15,000     | $20,000      | 🟡     |
| S-17   | Multi-Year Deal Rate        | Percentage of deals with multi-year terms       | (Multi-year deals / Total deals) × 100 | 10%      | 15%         | 25%          | 🟡     |
| S-18   | Upsell Rate                 | Percentage of existing customers expanding      | (Expansion deals / Total customers) × 100 | 5%    | 10%         | 15%          | 🟡     |

### 12.4 Sales Cycle KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula                              | Target (M1) | Target (M3) | Target (M12) | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|-------------|--------------|--------|
| S-19   | Sales Cycle Length           | Average days from opp creation to close         | Median days                          | 45 days     | 35 days     | 25 days      | 🟡     |
| S-20   | Sales Cycle (SMB)           | Average SMB sales cycle                         | Median days                          | 20 days     | 15 days     | 12 days      | 🟡     |
| S-21   | Sales Cycle (Mid-Market)    | Average Mid-Market sales cycle                  | Median days                          | 45 days     | 35 days     | 28 days      | 🟡     |
| S-22   | Sales Cycle (Enterprise)    | Average Enterprise sales cycle                  | Median days                          | 90 days     | 75 days     | 60 days      | 🟡     |
| S-23   | Stage Duration (Avg)        | Average days per pipeline stage                 | Average per stage                    | Varies      | Varies      | Varies       | —      |
| S-24   | Demo to Close Rate          | Percentage of demos converting to closed-won    | (Closed-won / Total demos) × 100     | 15%         | 20%         | 25%          | 🟡     |

### 12.5 Activity KPIs

| KPI ID | KPI Name                    | Definition                                     | Formula / Target                     | Target      | Status |
|--------|-----------------------------|-------------------------------------------------|--------------------------------------|-------------|--------|
| S-25   | Activities per Rep per Day  | Average daily sales activities per rep          | Total activities / Rep-days          | 40          | 🟡     |
| S-26   | Calls per Rep per Day       | Average daily calls per rep                     | Total calls / Rep-days               | 25          | 🟡     |
| S-27   | Emails per Rep per Day      | Average daily emails per rep                    | Total emails / Rep-days              | 30          | 🟡     |
| S-28   | Meetings per Rep per Day    | Average daily meetings per rep                  | Total meetings / Rep-days            | 4           | 🟡     |
| S-29   | Proposal to Close Rate      | Percentage of proposals converting to deals     | (Deals / Proposals) × 100            | 35%         | 🟡     |
| S-30   | Quote Generation Speed      | Time from request to quote delivery             | Median hours                         | ≤ 24 hrs    | 🟡     |

---

## 13. KPI Targets

### 13.1 Monthly Target Framework

| KPI Category   | Month 1     | Month 2     | Month 3     | Growth Trajectory |
|----------------|-------------|-------------|-------------|-------------------|
| **Revenue**    |             |             |             |                   |
| MRR            | $10,000     | $25,000     | $60,000     | +150% → +140%     |
| New Customers  | 20          | 35          | 50          | +75% → +43%       |
| NRR            | 100%        | 105%        | 110%        | +5pp → +5pp       |
| **Adoption**   |             |             |             |                   |
| DAU            | 100         | 250         | 500         | +150% → +100%     |
| Activation Rate| 40%         | 48%         | 55%         | +8pp → +7pp       |
| DAU/MAU        | 20%         | 23%         | 26%         | +3pp → +3pp       |
| **Customer**   |             |             |             |                   |
| NPS            | +20         | +32         | +40         | +12 → +8          |
| CSAT           | 80%         | 84%         | 88%         | +4pp → +4pp       |
| Churn Rate     | 5%          | 3.5%        | 2.5%        | -1.5pp → -1pp     |
| **Technical**  |             |             |             |                   |
| Uptime         | 99.95%      | 99.95%      | 99.97%      | Flat → +0.02pp    |
| API P95        | ≤ 500ms     | ≤ 400ms     | ≤ 350ms     | Improving         |
| Error Rate     | ≤ 0.05%     | ≤ 0.03%     | ≤ 0.02%     | Improving         |
| **Sales**      |             |             |             |                   |
| Win Rate       | 35%         | 40%         | 45%         | +5pp → +5pp       |
| Pipeline Value | $200K       | $350K       | $500K       | +75% → +43%       |
| Sales Cycle    | 45 days     | 38 days     | 32 days     | -7d → -6d         |

### 13.2 Quarterly Target Framework

| KPI Category   | Q1 2026     | Q2 2026     | Q3 2026     | Q4 2026     |
|----------------|-------------|-------------|-------------|-------------|
| **Business**   |             |             |             |             |
| ARR            | $720K       | $1.2M       | $1.8M       | $2.5M       |
| Customers      | 250         | 500         | 800         | 1,200       |
| Market Share   | 1.0%        | 2.0%        | 3.5%        | 5.0%        |
| Gross Margin   | 72%         | 76%         | 80%         | 82%         |
| **Product**    |             |             |             |             |
| MAU            | 2,500       | 5,000       | 8,500       | 12,000      |
| Feature Adoption| 40%        | 55%         | 65%         | 75%         |
| Day 30 Retention| 35%        | 45%         | 52%         | 58%         |
| **Customer**   |             |             |             |             |
| NPS            | +35         | +45         | +55         | +60         |
| CSAT           | 84%         | 88%         | 90%         | 92%         |
| Churn Rate     | 3.0%        | 2.2%        | 1.8%        | 1.5%        |
| **Operational**|             |             |             |             |
| FRT            | 3 hours     | 2 hours     | 1 hour      | 45 min      |
| TTR            | 20 hours    | 14 hours    | 10 hours    | 8 hours     |
| SLA Compliance | 94%         | 96%         | 98%         | 99%         |
| **Marketing**  |             |             |             |             |
| MQLs           | 350         | 600         | 900         | 1,200       |
| CPL            | $30         | $22         | $18         | $15         |
| Brand Awareness| 10%         | 18%         | 28%         | 35%         |
| **Sales**      |             |             |             |             |
| Pipeline Value | $500K       | $900K       | $1.4M       | $2.0M       |
| Win Rate       | 40%         | 45%         | 48%         | 50%         |
| ACV            | $2,200      | $2,500      | $2,800      | $3,000      |

### 13.3 Annual Target Framework (FY 2026-2027)

| KPI                        | FY 2026-27 Target | Stretch Goal | Minimum Acceptable |
|----------------------------|--------------------|--------------|---------------------|
| **Revenue**                |                    |              |                     |
| ARR (End of Year)          | $2,500,000        | $3,500,000   | $1,800,000          |
| Total Revenue              | $1,800,000        | $2,400,000   | $1,200,000          |
| MRR (End of Year)          | $208,333          | $291,667     | $150,000            |
| **Customers**              |                    |              |                     |
| Total Customers            | 1,200             | 1,800        | 800                 |
| Enterprise Customers       | 50                | 80           | 30                  |
| **Product**                |                    |              |                     |
| MAU (End of Year)          | 12,000            | 18,000       | 8,000               |
| DAU/MAU Ratio              | 30%               | 35%          | 25%                 |
| Day 90 Retention           | 40%               | 50%          | 30%                 |
| **Customer**               |                    |              |                     |
| NPS                        | +60               | +70          | +45                 |
| Net Revenue Retention      | 120%              | 130%         | 110%                |
| Customer Churn Rate        | 1.5%              | 1.0%         | 2.5%                |
| **Financial**              |                    |              |                     |
| Gross Margin               | 82%               | 85%          | 75%                 |
| LTV:CAC Ratio              | 40:1              | 50:1         | 25:1                |
| CAC Payback (Months)       | 7                 | 5            | 10                  |
| **Operational**            |                    |              |                     |
| Uptime                     | 99.99%            | 99.999%      | 99.95%              |
| SLA Compliance             | 99.5%             | 99.9%        | 99.0%               |
| FRT                        | 45 min            | 30 min       | 1 hour              |

### 13.4 Target Escalation Matrix

| Condition                            | Action Required                                      |
|--------------------------------------|------------------------------------------------------|
| KPI at ≥ 100% of target              | Maintain current strategy, document best practices    |
| KPI at 90-99% of target              | Monitor closely, identify improvement opportunities  |
| KPI at 75-89% of target              | Develop action plan, weekly review with owner         |
| KPI at 60-74% of target              | Escalate to VP, implement corrective actions          |
| KPI below 60% of target              | Escalate to C-suite, emergency review, strategy pivot |

---

## 14. Best Practices

### 14.1 SMART KPI Criteria

Every KPI must meet SMART criteria:

| Criterion    | Definition                                              | Example                                          |
|--------------|---------------------------------------------------------|--------------------------------------------------|
| **Specific** | Clearly defined with no ambiguity                       | "Monthly Recurring Revenue" not "revenue"        |
| **Measurable**| Quantifiable with reliable data source                 | "$60,000 MRR" not "good revenue"                 |
| **Achievable**| Realistic given resources and constraints              | 50% MoM growth (not 500%)                        |
| **Relevant** | Aligned to business strategy and goals                 | NPS directly ties to retention and growth         |
| **Time-bound**| Has clear timeframe for achievement                    | "$60,000 MRR by end of Month 3"                  |

### 14.2 KPI Alignment Framework

All KPIs must cascade from company strategy:

```
COMPANY VISION
    └── STRATEGIC PILLARS (3-5)
        └── OKRs (Objectives & Key Results)
            └── KPIs (Key Performance Indicators)
                └── METRICS (Individual measurements)
                    └── ACTIVITIES (Day-to-day tasks)
```

**Alignment Requirements:**
1. Each KPI must map to at least one strategic pillar
2. No orphaned KPIs (KPIs without clear strategic purpose)
3. Cross-functional KPIs must have joint ownership
4. KPIs must not conflict with each other (e.g., speed vs. quality balance)

### 14.3 KPI Review Cadence

| Review Type      | Frequency | Participants                    | Purpose                           |
|------------------|-----------|--------------------------------|-----------------------------------|
| KPI Stand-up     | Daily     | Team Leads                     | Quick health check, blockers      |
| KPI Review       | Weekly    | Department Heads               | Trend analysis, action items      |
| KPI Deep Dive    | Bi-weekly | VP + Directors                 | Root cause analysis, strategy     |
| KPI Executive    | Monthly   | C-Suite                        | Strategic alignment, decisions    |
| KPI Board        | Quarterly | Board + C-Suite                | Governance, investment decisions  |
| KPI Audit        | Annually  | Cross-functional team          | Framework review, recalibration   |

### 14.4 Data Quality Standards

| Standard                | Requirement                                              |
|------------------------|----------------------------------------------------------|
| Accuracy               | ≥ 99.5% — data must match source of truth               |
| Completeness           | ≥ 99.0% — no missing data points in reported periods    |
| Timeliness             | Data fresh within defined refresh intervals               |
| Consistency            | Same metric definition across all reports and dashboards |
| Accessibility          | All KPIs accessible to relevant stakeholders              |
| Auditability           | All data changes logged with timestamp and source         |
| Validation             | Automated validation rules for each KPI                  |
| Documentation          | Every KPI has clear definition, formula, and owner        |

### 14.5 Common KPI Pitfalls to Avoid

| Pitfall                         | Mitigation                                            |
|---------------------------------|-------------------------------------------------------|
| Too many KPIs (measurement overload) | Limit to 3-5 KPIs per person/team                 |
| Vanity metrics (no business impact)| Only track KPIs that drive decisions                |
| Lagging indicators only          | Balance with leading indicators                       |
| Inconsistent definitions         | Maintain single KPI glossary with strict definitions  |
| Gaming/incentive misalignment    | Review KPI incentives for unintended consequences     |
| Ignoring qualitative data        | Supplement quantitative KPIs with qualitative context  |
| Setting and forgetting           | Regular review and recalibration cycles               |
| No accountability               | Every KPI must have a named owner                     |
| Comparing incomparable segments  | Segment KPIs appropriately (by plan, region, size)    |

### 14.6 KPI Documentation Template

Each KPI must be documented using this standard template:

```
KPI ID:          [Unique identifier]
KPI Name:        [Clear, specific name]
Definition:      [Precise definition with no ambiguity]
Formula:         [Exact calculation method]
Data Source:     [System/API/table where data originates]
Refresh Rate:    [How often data is updated]
Owner:           [Named individual responsible]
Department:      [Department this KPI serves]
Strategic Pillar:[Which strategic pillar this supports]
Target:          [Specific numeric target with timeframe]
RAG Thresholds:  [Green/Amber/Red definitions]
Escalation Path: [What happens when target is missed]
Related KPIs:    [Other KPIs this influences or is influenced by]
Last Reviewed:   [Date of most recent review]
Notes:           [Any additional context or caveats]
```

---

## 15. Appendices

### Appendix A: KPI Summary Matrix

| Category       | Total KPIs | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|----------------|------------|--------|--------|--------|--------|
| Business       | 21         | 4      | 8      | 6      | 3      |
| Product        | 24         | 3      | 9      | 8      | 4      |
| Technical      | 24         | 3      | 8      | 9      | 4      |
| Customer       | 20         | 3      | 8      | 6      | 3      |
| Operational    | 18         | 2      | 6      | 7      | 3      |
| Marketing      | 26         | 3      | 9      | 9      | 5      |
| Sales          | 30         | 4      | 10     | 10     | 6      |
| **Total**      | **163**    | **22** | **58** | **55** | **28** |

### Appendix B: KPI Owner Directory

| KPI Category   | Primary Owner         | Backup Owner          | Executive Sponsor  |
|----------------|----------------------|-----------------------|---------------------|
| Business       | VP Revenue           | CFO                   | CEO                 |
| Product        | VP Product           | Product Manager       | CEO                 |
| Technical      | VP Engineering       | CTO                   | CTO                 |
| Customer       | VP Customer Success  | CS Manager            | COO                 |
| Operational    | VP Customer Success  | Support Manager       | COO                 |
| Marketing      | VP Marketing         | Marketing Manager     | CRO                 |
| Sales          | CRO                  | Sales Manager         | CEO                 |

### Appendix C: Data Source Reference

| KPI Category   | Primary System       | API Endpoint          | Refresh Frequency |
|----------------|----------------------|-----------------------|-------------------|
| Business       | Stripe + Salesforce  | /api/v1/revenue       | Real-time         |
| Product        | Mixpanel             | /api/engagement       | Real-time         |
| Technical      | Datadog              | /api/metrics          | Real-time         |
| Customer       | Gainsight            | /api/health           | Hourly            |
| Operational    | Zendesk              | /api/tickets          | 15 minutes        |
| Marketing      | HubSpot              | /api/funnels          | Hourly            |
| Sales          | Salesforce           | /api/pipeline         | Real-time         |

### Appendix D: Glossary

| Term              | Definition                                                    |
|-------------------|----------------------------------------------------------------|
| ACV               | Annual Contract Value — yearly value of a customer contract   |
| ARPA              | Average Revenue Per Account — MRR / Total accounts            |
| ARR               | Annual Recurring Revenue — MRR × 12                           |
| CAC               | Customer Acquisition Cost — cost to acquire one customer      |
| CES               | Customer Effort Score — ease of completing tasks              |
| CSAT              | Customer Satisfaction Score — overall satisfaction rating      |
| DAU               | Daily Active Users — unique users in 24 hours                 |
| FRT               | First Response Time — time to first support response          |
| GRR               | Gross Revenue Retention — retention without expansion         |
| LTV               | Lifetime Value — total expected customer revenue              |
| MAU               | Monthly Active Users — unique users in 30 days               |
| MQL               | Marketing Qualified Lead — lead meeting marketing criteria    |
| MRR               | Monthly Recurring Revenue — monthly subscription revenue      |
| MTBF              | Mean Time Between Failures — average uptime duration          |
| MTTR              | Mean Time To Repair — average incident resolution time        |
| NPS               | Net Promoter Score — customer advocacy metric                 |
| NRR               | Net Revenue Retention — revenue retained including expansion  |
| OKR               | Objectives and Key Results — goal-setting framework           |
| SQL               | Sales Qualified Lead — lead meeting sales criteria            |
| TAM               | Total Addressable Market — total market opportunity           |
| TTFV              | Time To First Value — time from signup to value moment        |
| TTR               | Time To Resolution — total support resolution time            |
| WAU               | Weekly Active Users — unique users in 7 days                 |

---

## 16. Revision History

| Version | Date       | Author           | Changes                                      |
|---------|------------|------------------|----------------------------------------------|
| 0.1     | 2026-06-10 | VP Product       | Initial draft — KPI framework established    |
| 0.3     | 2026-06-15 | VP Product       | Added technical and operational KPIs         |
| 0.5     | 2026-06-20 | CRO / VP Marketing | Added sales and marketing KPIs              |
| 0.7     | 2026-06-25 | CTO              | Technical KPI validation and thresholds      |
| 0.9     | 2026-06-28 | CFO              | Financial KPI targets validated              |
| 1.0     | 2026-07-01 | VP Product       | Final version — all departments approved     |

---

## 17. Approval

| Role                | Name              | Signature    | Date       |
|---------------------|-------------------|--------------|------------|
| CEO                 | _________________ | ____________ | ____/____/____ |
| CFO                 | _________________ | ____________ | ____/____/____ |
| CTO                 | _________________ | ____________ | ____/____/____ |
| CRO                 | _________________ | ____________ | ____/____/____ |
| VP Product          | _________________ | ____________ | ____/____/____ |
| VP Engineering      | _________________ | ____________ | ____/____/____ |
| VP Customer Success | _________________ | ____________ | ____/____/____ |
| VP Marketing        | _________________ | ____________ | ____/____/____ |

---

**Document Control:**
- **Next Review Date:** August 2026
- **Classification:** Internal — Leadership Use Only
- **Distribution:** Executive Team, Department Heads
- **Retention:** Permanent (archive after 12 months)
