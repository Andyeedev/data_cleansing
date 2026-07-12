# MAP Platform — Post-Launch Optimisation Plan

| Field       | Detail                                                                 |
|-------------|------------------------------------------------------------------------|
| **Document** | 29_Post_Launch_Optimisation                                            |
| **Title**    | MAP Post-Launch Optimisation Plan                                      |
| **Version**  | 1.0                                                                    |
| **Date**     | July 2026                                                              |
| **Status**   | Official                                                               |
| **Owner**    | MAP Product & Engineering                                              |
| **Scope**    | Monitoring, optimisation, feedback loops, and growth post-launch       |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Monitoring Framework](#2-monitoring-framework)
   - 2.1 Performance Monitoring
   - 2.2 Usage Monitoring
   - 2.3 Feedback Monitoring
   - 2.4 Business Metrics Monitoring
3. [Optimisation Strategy](#3-optimisation-strategy)
   - 3.1 Performance Optimisation
   - 3.2 User Experience Optimisation
   - 3.3 Feature Optimisation
   - 3.4 Cost Optimisation
4. [Feedback Loops](#4-feedback-loops)
   - 4.1 Customer Feedback
   - 4.2 Support Feedback
   - 4.3 Sales Feedback
   - 4.4 Internal Feedback
5. [Iteration Framework](#5-iteration-framework)
   - 5.1 Agile Iteration Cycle
   - 5.2 Data-Driven Prioritisation
   - 5.3 Experimentation Framework
6. [Growth & Engagement](#6-growth--engagement)
   - 6.1 Activation Optimisation
   - 6.2 Engagement Optimisation
   - 6.3 Retention Optimisation
   - 6.4 Expansion Revenue
7. [Best Practices & Standards](#7-best-practices--standards)
8. [Dependencies](#8-dependencies)
9. [References](#9-references)
10. [Revision History](#10-revision-history)
11. [Approval](#11-approval)

---

## 1. Purpose

This document defines the systematic approach to monitoring, optimising, and iterating on the MAP (Migration Assurance Platform) after launch. It establishes continuous feedback loops, data-driven iteration cycles, and growth mechanisms that ensure the platform improves steadily and achieves product-market fit.

**Key Objectives:**

- Establish comprehensive monitoring across performance, usage, and business metrics
- Define a structured optimisation process for performance, UX, and features
- Create closed feedback loops from customers, support, sales, and internal teams
- Implement an agile iteration framework with data-driven prioritisation
- Drive activation, engagement, and retention through systematic improvements

**Optimisation Philosophy:**

1. **Continuous** — Optimisation is an ongoing discipline, not a one-time activity
2. **Measurable** — Every improvement must be measured against defined KPIs
3. **Customer-Focused** — All optimisations must trace back to customer value
4. **Data-Driven** — Decisions are based on quantitative evidence, not opinions
5. **Rapid** — Small, frequent improvements compound into significant gains

---

## 2. Monitoring Framework

### 2.1 Performance Monitoring

**System Performance Metrics:**

| Metric | Measurement | Target | Alert Threshold | Dashboard |
|--------|-------------|--------|-----------------|-----------|
| API Response Time (p50) | Average response time for median requests | <200ms | >300ms | Performance Overview |
| API Response Time (p95) | 95th percentile response time | <500ms | >750ms | Performance Overview |
| API Response Time (p99) | 99th percentile response time | <1000ms | >1500ms | Performance Overview |
| Error Rate (5xx) | Server error rate per minute | <0.1% | >0.5% | Error Dashboard |
| Error Rate (4xx) | Client error rate per minute | <2% | >5% | Error Dashboard |
| Throughput | Requests per second | >100 RPS | <50 RPS | Traffic Dashboard |
| Concurrent Connections | Active WebSocket connections | <1000 | >800 | Connection Dashboard |
| Database Query Time (p95) | Database query response time | <100ms | >200ms | DB Performance |
| Cache Hit Rate | Redis/ElastiCache hit ratio | >90% | <80% | Cache Dashboard |
| Queue Depth | Background job queue size | <100 | >500 | Queue Dashboard |

**Infrastructure Performance Metrics:**

| Metric | Measurement | Target | Alert Threshold | Dashboard |
|--------|-------------|--------|-----------------|-----------|
| CPU Utilisation | Average across cluster nodes | <60% | >80% | Infrastructure |
| Memory Utilisation | Average across cluster nodes | <70% | >85% | Infrastructure |
| Disk I/O | Read/write operations per second | Baseline ±50% | >2x baseline | Infrastructure |
| Network I/O | Inbound/outbound throughput | Baseline ±50% | >2x baseline | Infrastructure |
| Pod Restarts | Container restart count per hour | 0 | >3 | Infrastructure |
| Node Health | Healthy nodes / total nodes | 100% | <100% | Infrastructure |
| Storage Utilisation | Database disk usage | <70% | >85% | DB Performance |
| Replica Lag | Database replication lag | <1s | >5s | DB Performance |

**Monitoring Stack Configuration:**

| Component | Purpose | Retention | Alerting |
|-----------|---------|-----------|----------|
| Prometheus | Metrics collection and storage | 30 days | Alertmanager |
| Grafana | Dashboard visualisation | — | — |
| Datadog | APM and distributed tracing | 15 days | PagerDuty |
| PagerDuty | Alert routing and on-call | — | — |
| Loki | Log aggregation | 30 days | Grafana |
| Jaeger | Distributed tracing | 7 days | — |

### 2.2 Usage Monitoring

**User Engagement Metrics:**

| Metric | Definition | Target | Measurement | Frequency |
|--------|-----------|--------|-------------|-----------|
| Daily Active Users (DAU) | Unique users performing actions per day | Growing trend | Analytics | Daily |
| Weekly Active Users (WAU) | Unique users per week | Growing trend | Analytics | Weekly |
| Monthly Active Users (MAU) | Unique users per month | Growing trend | Analytics | Monthly |
| DAU/MAU Ratio | Daily/monthly engagement ratio | >20% | Calculated | Monthly |
| Session Duration | Average session length | >5 min | Analytics | Daily |
| Sessions per User | Average sessions per user per week | >3 | Analytics | Weekly |
| Feature Adoption Rate | % users using specific features | >60% for core features | Analytics | Weekly |
| Migration Completion Rate | % of migrations completed successfully | >95% | Product metrics | Daily |
| Time to Complete Migration | Average time from start to finish | Decreasing trend | Product metrics | Weekly |
| Return User Rate | % users returning within 7 days | >40% | Analytics | Weekly |

**Feature Usage Tracking:**

| Feature | Usage Metric | Target | Tracking Method |
|---------|-------------|--------|-----------------|
| Migration Workflow | Starts per day | >50 | Event tracking |
| Validation Engine | Validations per day | >100 | Event tracking |
| Reporting Dashboard | Views per day | >30 | Event tracking |
| API Integration | API calls per day | >1000 | API logs |
| Data Mapping | Maps created per day | >20 | Event tracking |
| Error Resolution | Errors resolved per day | >80% resolution rate | Product metrics |
| Collaboration | Shared projects per week | Growing trend | Event tracking |
| Export/Import | Exports per week | Growing trend | Event tracking |

### 2.3 Feedback Monitoring

**Feedback Collection Channels:**

| Channel | Method | Frequency | Owner | Volume Target |
|---------|--------|-----------|-------|---------------|
| In-app survey | NPS survey triggered post-migration | After each migration | Product | >30% response rate |
| Support tickets | Categorised by type, severity, sentiment | Real-time | Support Lead | Tracked |
| Customer success | 1:1 customer meetings | Weekly | CS Lead | >5 customer meetings/week |
| Sales feedback | Win/loss analysis | Weekly | Sales Lead | 100% of deals |
| Social media | Brand monitoring | Daily | Marketing | Tracked |
| Review sites | G2, Capterra, TrustRadius monitoring | Weekly | Marketing | >4.5 stars |
| Beta program | Beta user feedback | Per release cycle | Product | >10 active beta users |

**Feedback Taxonomy:**

| Category | Subcategory | Priority Weight | Resolution SLA |
|----------|-------------|-----------------|----------------|
| Bug Report | Critical (data loss, security) | 5x | 4 hours |
| Bug Report | Major (feature broken) | 3x | 24 hours |
| Bug Report | Minor (cosmetic, workaround exists) | 1x | 7 days |
| Feature Request | High impact (>20% users affected) | 4x | Evaluate in sprint |
| Feature Request | Medium impact (5-20% users) | 2x | Evaluate in backlog |
| Feature Request | Low impact (<5% users) | 1x | Backlog |
| UX Improvement | High friction (blocks completion) | 3x | Next sprint |
| UX Improvement | Medium friction (causes confusion) | 2x | Backlog |
| UX Improvement | Low friction (cosmetic preference) | 1x | Backlog |
| Performance | Slow response times | 4x | 48 hours |
| Performance | Timeout errors | 5x | 4 hours |

### 2.4 Business Metrics Monitoring

**Key Business Indicators:**

| Metric | Definition | Target | Measurement | Frequency |
|--------|-----------|--------|-------------|-----------|
| Monthly Recurring Revenue (MRR) | Recurring subscription revenue | Growing 15% MoM | Billing system | Monthly |
| Annual Recurring Revenue (ARR) | Annualised recurring revenue | Growing 15% MoM | Billing system | Monthly |
| Customer Acquisition Cost (CAC) | Cost to acquire one customer | Decreasing | Marketing + Sales | Monthly |
| Customer Lifetime Value (CLV) | Expected revenue per customer | Increasing | Calculated | Monthly |
| CLV:CAC Ratio | Lifetime value to acquisition cost | >3:1 | Calculated | Monthly |
| Net Revenue Retention (NRR) | Revenue retained including expansion | >110% | Billing system | Monthly |
| Gross Margin | Revenue minus COGS | >70% | Finance | Monthly |
| Churn Rate | Monthly customer churn | <5% | Billing system | Monthly |
| Expansion Revenue | Revenue from existing customers upsold | Growing | Billing system | Monthly |
| Payback Period | Months to recover CAC | <12 months | Calculated | Quarterly |

---

## 3. Optimisation Strategy

### 3.1 Performance Optimisation

**Performance Improvement Process:**

| Phase | Activities | Duration | Owner | Output |
|-------|-----------|----------|-------|--------|
| **Identify** | Review performance dashboards, identify bottlenecks | Ongoing | SRE Lead | Bottleneck list |
| **Analyse** | Root cause analysis, profiling, tracing | 2-3 days | Dev Lead | Analysis report |
| **Prioritise** | Impact assessment, effort estimation | 1 day | Product + Dev Lead | Priority ranking |
| **Implement** | Code changes, infrastructure adjustments | 1-5 days | Dev Team | Optimised code |
| **Validate** | Performance testing, A/B comparison | 1-2 days | QA Lead | Validation report |
| **Deploy** | Release to production, monitor impact | 1 day | DevOps | Deployment log |
| **Measure** | Post-deployment performance comparison | 7 days | SRE Lead | Impact report |

**Performance Optimisation Playbook:**

| Bottleneck Type | Diagnosis Method | Common Solutions | Expected Impact |
|----------------|-----------------|------------------|-----------------|
| Database slow queries | Query analysis, EXPLAIN plans | Indexing, query optimisation, read replicas | High |
| API endpoint latency | Distributed tracing, profiling | Caching, connection pooling, async processing | High |
| Memory pressure | Memory profiling, heap analysis | Object pooling, garbage collection tuning | Medium |
| CPU bottleneck | CPU profiling, flame graphs | Algorithm optimisation, parallel processing | Medium |
| Network latency | Network tracing, DNS analysis | CDN, connection keep-alive, compression | Medium |
| Cache misses | Cache hit rate analysis | Cache warming, TTL tuning, cache hierarchy | High |
| Queue backlog | Queue depth monitoring | Worker scaling, batch processing, prioritisation | Medium |

### 3.2 User Experience Optimisation

**UX Improvement Process:**

| Phase | Activities | Duration | Owner | Output |
|-------|-----------|----------|-------|--------|
| **Observe** | User behaviour analysis, session recordings | Ongoing | Product | Observation notes |
| **Diagnose** | Usability testing, funnel analysis | 3-5 days | UX Lead | Diagnosis report |
| **Hypothesise** | Define improvement hypothesis | 1 day | Product + UX | Hypothesis document |
| **Design** | Create wireframes, prototypes | 3-5 days | UX Lead | Design artifacts |
| **Test** | A/B test or usability test | 7-14 days | Product | Test results |
| **Implement** | Development and deployment | 5-10 days | Dev Team | Delivered feature |
| **Measure** | Impact measurement vs baseline | 7-14 days | Product | Impact report |

**UX Metrics Framework:**

| Metric | Definition | Target | Tracking |
|--------|-----------|--------|----------|
| Task Completion Rate | % users completing key tasks | >90% | Analytics |
| Time on Task | Average time to complete key tasks | Decreasing | Analytics |
| Error Rate | % of attempts resulting in errors | <5% | Analytics |
| System Usability Scale (SUS) | Standardised usability score | >80 | Survey |
| Customer Effort Score (CES) | Ease of completing tasks | <2 (low effort) | Survey |
| Navigation Efficiency | Clicks to complete task | Minimised | Analytics |
| Search Success Rate | % of searches finding results | >80% | Analytics |
| Help Article Usage | % of users needing help docs | <10% | Analytics |

### 3.3 Feature Optimisation

**Feature Improvement Cycle:**

| Phase | Activities | Duration | Owner | Output |
|-------|-----------|----------|-------|--------|
| **Discover** | User research, competitive analysis, data analysis | Ongoing | Product | Insight backlog |
| **Define** | Problem statement, success criteria, scope | 2 days | Product + Dev Lead | Feature spec |
| **Design** | UX design, technical design | 3-5 days | UX + Dev Lead | Design documents |
| **Build** | Development, testing | 5-15 days | Dev Team | Working feature |
| **Release** | Phased rollout, feature flags | 1-3 days | DevOps | Release log |
| **Measure** | Feature adoption, impact on KPIs | 14-30 days | Product | Feature report |
| **Iterate** | Refine based on data | Ongoing | Product | Updated spec |

**Feature Prioritisation Framework (RICE):**

| Factor | Definition | Scoring |
|--------|-----------|---------|
| **Reach** | How many users will this affect? | Users per quarter |
| **Impact** | How much will it impact each user? | 0.25 (minimal) to 3 (massive) |
| **Confidence** | How confident are we in the estimates? | 100% (high) to 50% (low) |
| **Effort** | How many person-months to build? | Person-months |

**RICE Score = (Reach × Impact × Confidence) / Effort**

| RICE Score | Priority | Action |
|------------|----------|--------|
| >100 | P1 | Build in current sprint |
| 50-100 | P2 | Build in next sprint |
| 20-50 | P3 | Schedule for upcoming quarter |
| <20 | P4 | Backlog — revisit quarterly |

### 3.4 Cost Optimisation

**Cost Monitoring Dashboard:**

| Cost Category | Metric | Target | Alert Threshold | Optimisation Lever |
|--------------|--------|--------|-----------------|-------------------|
| Compute | Kubernetes cluster cost | Within budget | >10% over | Right-sizing, spot instances |
| Database | RDS/Cloud SQL cost | Within budget | >10% over | Reserved instances, query optimisation |
| Storage | S3/GCS cost | Within budget | >15% over | Lifecycle policies, compression |
| Network | Data transfer cost | Within budget | >15% over | CDN, caching, compression |
| Third-party | SaaS subscription cost | Within budget | >5% over | Renegotiate, consolidate |
| Monitoring | Observability stack cost | Within budget | >10% over | Sampling, retention tuning |

**Cost Optimisation Playbook:**

| Opportunity | Approach | Expected Savings | Risk | Priority |
|-------------|----------|-----------------|------|----------|
| Reserved instances | Purchase 1-year RIs for base load | 30-40% | Reduced flexibility | High |
| Spot instances | Use spot for non-critical workloads | 60-80% | Potential interruption | High |
| Right-sizing | Match instance types to actual usage | 20-30% | Requires analysis | Medium |
| Storage lifecycle | Move cold data to cheaper tiers | 40-60% | Increased retrieval time | Medium |
| Cache optimisation | Improve cache hit rate | 10-20% (DB cost) | Complexity | Medium |
| Query optimisation | Reduce database load | 15-25% (DB cost) | Development effort | High |
| Network compression | Compress API responses | 20-40% (bandwidth) | CPU overhead | Low |

---

## 4. Feedback Loops

### 4.1 Customer Feedback

**Customer Feedback Channels:**

| Channel | Trigger | Collection Method | Response SLA | Owner |
|---------|---------|-------------------|-------------|-------|
| In-app NPS | After migration completion | Pop-up survey (1-10 scale) | Acknowledge within 24h | Product |
| In-app feedback | Any time | Feedback widget | Acknowledge within 24h | Product |
| Customer interviews | Monthly | Scheduled 1:1 calls | N/A | CS Lead |
| Beta program | Pre-release | Dedicated Slack channel | Within 4 hours | Product |
| Advisory board | Quarterly | Structured meeting | N/A | Product Director |
| Support tickets | Issue reported | Ticketing system | Per SLA | Support Lead |
| Churn interviews | On cancellation | Scheduled call | Within 48h | CS Lead |
| Win/loss analysis | After deal close | Structured debrief | Within 1 week | Sales Lead |

**Customer Feedback Processing Pipeline:**

| Stage | Activity | Owner | SLA | Tool |
|-------|----------|-------|-----|------|
| **Collect** | Gather feedback from all channels | Product | Ongoing | Feedback tool |
| **Categorise** | Tag by type, feature, severity | Product | Within 24h | Feedback tool |
| **Prioritise** | Score using RICE framework | Product + Dev Lead | Weekly | Backlog tool |
| **Route** | Assign to appropriate team | Product | Within 48h | Backlog tool |
| **Act** | Implement fix/improvement | Dev Team | Per priority | Sprint board |
| **Close** | Notify customer, mark complete | Product | Within 24h of release | Feedback tool |
| **Measure** | Track impact on metrics | Product | 14 days post-release | Analytics |

### 4.2 Support Feedback

**Support Feedback Analysis:**

| Metric | Measurement | Target | Action Trigger | Owner |
|--------|-------------|--------|----------------|-------|
| Ticket Volume | Total tickets per week | Decreasing trend | >20% increase | Support Lead |
| Ticket Categories | Distribution by category | Top categories decreasing | New category emerging | Support Lead |
| Resolution Time | Average time to resolve | <4 hours for P1 | >8 hours | Support Lead |
| First Contact Resolution | % resolved without escalation | >70% | <60% | Support Lead |
| Customer Satisfaction | CSAT score from support interactions | >4.5/5 | <4.0 | Support Lead |
| Escalation Rate | % of tickets escalated | <15% | >25% | Support Lead |
| Knowledge Gap Rate | % of tickets due to missing docs | <10% | >15% | Support Lead |
| Recurring Issues | Issues appearing >3 times/week | 0 recurring issues | >3 recurring issues | Support Lead |

**Support-to-Product Feedback Loop:**

| Feedback Type | Trigger | Frequency | Owner | Action |
|--------------|---------|-----------|-------|--------|
| Bug pattern | Same bug reported 3+ times | Real-time | Support Lead → Dev Lead | Hotfix priority |
| UX confusion | Multiple users confused by same UI | Weekly | Support Lead → Product | UX improvement |
| Missing feature | Feature request in ticket | Weekly | Support Lead → Product | Feature backlog |
| Documentation gap | Users asking for help with undocumented feature | Weekly | Support Lead → DevRel | Doc update |
| Performance issue | Users reporting slowness | Real-time | Support Lead → SRE | Performance investigation |
| Integration issue | Third-party integration problems | Weekly | Support Lead → Dev Lead | Integration fix |

### 4.3 Sales Feedback

**Sales Feedback Mechanisms:**

| Mechanism | Trigger | Owner | Output |
|-----------|---------|-------|--------|
| Win analysis | Deal won | Sales Lead | What features/timing contributed |
| Loss analysis | Deal lost | Sales Lead | Competitor comparison, feature gaps |
| Competitive intelligence | Ongoing | Sales Lead | Competitor feature matrix |
| Market feedback | Prospect conversations | Sales Lead | Market demand signals |
| Pricing feedback | Pricing objections | Sales Lead | Pricing optimisation data |
| Demo feedback | Post-demo survey | Sales Lead | UX and feature gaps |

**Sales-to-Product Pipeline:**

| Signal | Classification | Priority | Action | SLA |
|--------|---------------|----------|--------|-----|
| Lost deal due to missing feature | Feature gap | P2 | Feature evaluation | 1 week |
| Lost deal due to pricing | Pricing issue | P2 | Pricing review | 2 weeks |
| Lost deal due to competitor | Competitive gap | P1 | Competitive analysis | 1 week |
| Prospect requests specific feature | Market demand | P3 | Feature backlog | 2 weeks |
| Prospect praises specific feature | Strength | P4 | Marketing input | 1 week |
| Pricing objection pattern | Pricing strategy | P2 | Pricing review | 2 weeks |

### 4.4 Internal Feedback

**Internal Feedback Channels:**

| Channel | Participants | Frequency | Owner | Output |
|---------|-------------|-----------|-------|--------|
| Engineering retrospectives | Engineering team | Bi-weekly | Dev Lead | Process improvements |
| Product brainstorming | Product + Design + Eng | Monthly | Product | Feature ideas |
| All-hands demo | Entire company | Monthly | Product Director | Company alignment |
| Cross-functional sync | Product + Sales + CS + Support | Weekly | Product | Alignment check |
| Tech debt review | Engineering leads | Monthly | Dev Lead | Tech debt backlog |
| Architecture review | Senior engineers | Monthly | Dev Lead | Architecture decisions |

---

## 5. Iteration Framework

### 5.1 Agile Iteration Cycle

**Sprint Structure:**

| Phase | Duration | Activities | Output |
|-------|----------|-----------|--------|
| **Sprint Planning** | 2 hours (Day 1) | Review backlog, select sprint items, estimate | Sprint backlog |
| **Daily Standup** | 15 min (Daily) | Progress, blockers, plans | Blocker resolution |
| **Development** | 8 days | Build, test, review | Working features |
| **Sprint Review** | 1 hour (Day 9) | Demo to stakeholders, gather feedback | Stakeholder input |
| **Sprint Retrospective** | 1 hour (Day 9) | Process improvement discussion | Action items |
| **Sprint Duration** | 2 weeks | — | — |

**Sprint Cadence:**

| Sprint | Focus | Key Activities |
|--------|-------|---------------|
| Sprint 1 | Post-launch stabilisation | Bug fixes, performance, monitoring |
| Sprint 2 | Quick wins | High-priority UX improvements, low-effort fixes |
| Sprint 3 | Feature gaps | Top requested features from feedback |
| Sprint 4 | Performance | Performance optimisation, scalability |
| Sprint 5 | Growth features | Activation and engagement improvements |
| Sprint 6 | Platform maturity | Technical debt, documentation, testing |

### 5.2 Data-Driven Prioritisation

**Prioritisation Framework:**

| Factor | Weight | Scoring Method | Data Source |
|--------|--------|---------------|-------------|
| Customer Impact | 30% | Number of affected users × severity | Support tickets, analytics |
| Business Impact | 25% | Revenue impact + strategic alignment | Sales data, OKRs |
| Effort | 20% | Engineering time (person-days) | Engineering estimates |
| Urgency | 15% | Time sensitivity, deadline pressure | Market data, commitments |
| Confidence | 10% | Data quality, assumption certainty | Analytics, user research |

**Priority Scoring Matrix:**

| Score Range | Priority | Sprint Allocation | Example |
|------------|----------|-------------------|---------|
| 80-100 | P1 | 40% of sprint | Critical bug, security fix, data loss |
| 60-79 | P2 | 30% of sprint | High-impact feature, major UX improvement |
| 40-59 | P3 | 20% of sprint | Medium-impact improvement, minor feature |
| 20-39 | P4 | 10% of sprint | Low-impact improvement, nice-to-have |
| <20 | P5 | Backlog | Future consideration |

### 5.3 Experimentation Framework

**A/B Testing Process:**

| Phase | Activities | Duration | Owner | Output |
|-------|-----------|----------|-------|--------|
| **Hypothesis** | Define measurable hypothesis | 1 day | Product | Hypothesis document |
| **Design** | Design experiment, define metrics | 2 days | Product + Data | Experiment plan |
| **Implement** | Build variant, set up tracking | 5 days | Dev Team | Working experiment |
| **Run** | Execute experiment with traffic | 14 days | Product | Raw data |
| **Analyse** | Statistical analysis of results | 2 days | Data | Analysis report |
| **Decide** | Ship, iterate, or kill | 1 day | Product + Dev Lead | Decision record |

**Experiment Template:**

| Field | Description |
|-------|-------------|
| Hypothesis | "If we [change], then [metric] will [improve] by [amount]" |
| Primary Metric | The main metric we're optimising |
| Secondary Metrics | Supporting metrics to watch for side effects |
| Sample Size | Minimum sample for statistical significance |
| Duration | Expected experiment runtime |
| Control | Current experience |
| Variant | New experience being tested |
| Decision Criteria | What result leads to ship/iterate/kill |

**Experiment Prioritisation:**

| Priority | Criteria | Action |
|----------|----------|--------|
| High | High-confidence hypothesis, large potential impact, low effort | Run immediately |
| Medium | Moderate confidence, moderate impact, moderate effort | Schedule in sprint |
| Low | Low confidence or high effort, small impact | Backlog |

---

## 6. Growth & Engagement

### 6.1 Activation Optimisation

**Activation Funnel:**

| Stage | Definition | Target Conversion | Measurement | Owner |
|-------|-----------|-------------------|-------------|-------|
| **Visitor** | Landing page visit | 100% (baseline) | Analytics | Marketing |
| **Sign-up** | Account created | >5% of visitors | Analytics | Product |
| **Onboarding** | Completed onboarding flow | >80% of sign-ups | Product | Product |
| **First Migration** | First migration started | >60% of onboarding | Product | Product |
| **Migration Complete** | First migration completed | >90% of starts | Product | Product |
| **Activated** | Completed 3+ migrations | >50% of completions | Product | Product |

**Activation Optimisation Levers:**

| Lever | Approach | Expected Impact | Measurement |
|-------|----------|----------------|-------------|
| Onboarding flow | Simplify steps, add tooltips | +15-20% completion | Funnel conversion |
| Time to value | Reduce time to first migration | +10-15% activation | Time-to-first-action |
| Guided tour | Interactive walkthrough | +20-25% feature adoption | Feature usage |
| Template library | Pre-built migration templates | +10-15% completion | Migration completion |
| Progressive disclosure | Reveal complexity gradually | +5-10% engagement | Session duration |
| Welcome email sequence | Nurture new users | +10-15% return rate | Return user rate |

### 6.2 Engagement Optimisation

**Engagement Levers:**

| Lever | Approach | Expected Impact | Measurement |
|-------|----------|----------------|-------------|
| Daily digest emails | Summary of migration status | +15-20% return rate | DAU/MAU ratio |
| In-app notifications | Contextual tips and updates | +10-15% feature adoption | Feature usage |
| Dashboard widgets | Customisable home dashboard | +5-10% session duration | Session metrics |
| Keyboard shortcuts | Power user efficiency | +10-15% task speed for power users | Task completion time |
| Dark mode / themes | Personalisation | +5-10% satisfaction | CSAT score |
| API documentation | Developer experience | +20-30% API adoption | API usage |
| Community features | User forums, knowledge base | +10-15% engagement | Community activity |

**Engagement Scoring Model:**

| Action | Points | Frequency Weight | Engagement Score |
|--------|--------|-----------------|------------------|
| Login | 1 | Daily | Session frequency |
| Create migration | 5 | Per action | Activity depth |
| Complete migration | 10 | Per action | Task completion |
| Resolve error | 3 | Per action | Problem solving |
| Share project | 2 | Per action | Collaboration |
| Export report | 2 | Per action | Value extraction |
| Use API integration | 3 | Per action | Platform adoption |
| Invite team member | 5 | Per invitation | Growth |
| Provide feedback | 2 | Per submission | Engagement |
| Complete training | 3 | Per module | Education |

**Engagement Tiers:**

| Tier | Score Range | User Type | Strategy |
|------|------------|-----------|----------|
| Champion | >100 | Power user | Nurture, convert to advocate |
| Active | 50-100 | Regular user | Engage, expand usage |
| Moderate | 20-49 | Occasional user | Reactivate, deepen usage |
| At Risk | 5-19 | Infrequent user | Re-engage, remove friction |
| Dormant | <5 | Inactive user | Win-back campaign |

### 6.3 Retention Optimisation

**Retention Metrics:**

| Metric | Definition | Target | Measurement | Frequency |
|--------|-----------|--------|-------------|-----------|
| Day 1 Retention | % returning next day | >40% | Analytics | Daily |
| Day 7 Retention | % returning within 7 days | >30% | Analytics | Weekly |
| Day 30 Retention | % returning within 30 days | >20% | Analytics | Monthly |
| Day 90 Retention | % returning within 90 days | >15% | Analytics | Quarterly |
| Revenue Retention | % of revenue retained monthly | >95% | Billing | Monthly |
| Logo Retention | % of customers retained monthly | >95% | CRM | Monthly |

**Retention Improvement Strategies:**

| Strategy | Target Segment | Approach | Expected Impact | Measurement |
|----------|---------------|----------|----------------|-------------|
| Onboarding drip | New users (0-7 days) | Email sequence with tips | +10-15% Day 7 | Retention cohort |
| Re-engagement | At-risk users (Day 7-30) | Targeted email + in-app | +5-10% Day 30 | Retention cohort |
| Win-back | Dormant users (30+ days) | Email campaign with incentive | +3-5% reactivation | Reactivation rate |
| Feature education | Active users | In-app tips on new features | +5-10% engagement | Feature adoption |
| Success milestones | All users | Celebrate achievements | +10-15% satisfaction | CSAT score |
| Community building | Active users | Forums, events, content | +5-10% engagement | Community activity |

### 6.4 Expansion Revenue

**Expansion Revenue Levers:**

| Lever | Approach | Target Segment | Expected Impact | Measurement |
|-------|----------|---------------|----------------|-------------|
| Tier upgrades | Usage-based upsell prompts | Users approaching limits | +15-20% ARPU | Upgrade rate |
| Add-on features | Optional premium features | Power users | +10-15% ARPU | Add-on adoption |
| Team plans | Multi-seat pricing | Growing teams | +20-30% expansion | Team plan adoption |
| Enterprise features | Custom integrations, SLA | Large organisations | +30-50% expansion | Enterprise deals |
| Professional services | Migration consulting, training | High-touch customers | +10-20% revenue | Services revenue |
| API premium | Enhanced API limits, features | Developer customers | +10-15% expansion | API tier upgrades |

**Expansion Revenue Metrics:**

| Metric | Definition | Target | Measurement | Frequency |
|--------|-----------|--------|-------------|-----------|
| Net Revenue Retention (NRR) | Revenue from existing customers YoY | >110% | Billing | Monthly |
| Expansion Revenue % | % of new MRR from expansion | >30% | Billing | Monthly |
| Upsell Conversion | % of users upgrading tier | >10% | Billing | Monthly |
| Cross-sell Rate | % of users adopting add-ons | >5% | Billing | Monthly |
| Average Revenue Per User (ARPU) | MRR / active users | Growing trend | Billing | Monthly |
| Customer Health Score | Composite score predicting expansion | >70 for expansion-ready | Calculated | Monthly |

---

## 7. Best Practices & Standards

### 7.1 Continuous Optimisation

- Establish a dedicated optimisation sprint every 4th sprint
- Maintain an "optimisation backlog" separate from feature work
- Assign a dedicated "optimisation champion" per team
- Review performance dashboards daily — never weekly
- Conduct monthly optimisation reviews with the full team
- Celebrate and share optimisation wins across the organisation

### 7.2 Measurable Improvements

- Define clear success metrics before every optimisation
- Establish baselines before making changes
- Use A/B testing for high-impact changes
- Measure impact for at least 14 days after deployment
- Document all optimisation experiments and results
- Share results transparently with all stakeholders

### 7.3 Customer-Focused Iteration

- Start every optimisation cycle with customer feedback
- Prioritise based on customer impact, not internal preference
- Validate assumptions with real user data before investing
- Close the feedback loop — tell customers when their input drives changes
- Maintain regular customer contact through CS and support
- Track customer satisfaction alongside every metric

### 7.4 Data Quality & Governance

- Ensure all tracking is accurate and consistent
- Maintain a data dictionary for all metrics
- Validate analytics data weekly against known benchmarks
- Document all metric definitions and calculation methods
- Protect user privacy in all data collection
- Audit tracking implementation quarterly

### 7.5 Cross-Functional Alignment

- Hold weekly cross-functional syncs during optimisation cycles
- Ensure Product, Engineering, Support, and Sales are aligned on priorities
- Use shared dashboards — no team should operate in isolation
- Conduct joint retrospectives to identify cross-functional improvements
- Maintain a shared "insights" document for the entire team

---

## 8. Dependencies

| Dependency | Description | Impact if Unresolved |
|------------|-------------|---------------------|
| Analytics infrastructure | Tracking and analytics tools must be operational | Cannot measure anything |
| Customer feedback systems | Survey and feedback tools must be available | Cannot collect feedback |
| A/B testing platform | Experimentation tools must be configured | Cannot run experiments |
| Data engineering | Data pipeline must be reliable | Metrics may be inaccurate |
| Marketing automation | Email and notification tools must be operational | Cannot execute growth campaigns |
| Customer success capacity | CS team must have bandwidth for customer engagement | Feedback loops break |
| Engineering capacity | Team must have sprint capacity for optimisations | Cannot execute improvements |
| Executive sponsorship | Leadership must support optimisation investment | Resource constraints |

---

## 9. References

| Document | Description | Location |
|----------|-------------|----------|
| MAP Analytics Schema | Data model for tracking events | docs/analytics/ |
| MAP Feature Spec Template | Template for feature specifications | docs/templates/ |
| MAP Experimentation Guide | A/B testing methodology | docs/experimentation/ |
| MAP Customer Feedback Taxonomy | Feedback categorisation system | docs/feedback/ |
| MAP Metrics Dictionary | Definitions for all tracked metrics | docs/metrics/ |
| MAP Growth Playbook | Growth experiment templates | docs/growth/ |
| MAP Go-Live Checklist | Launch execution checklist (Document 27) | docs/launch/ |

---

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | July 2026 | MAP Product Team | Initial draft — monitoring framework |
| 0.2 | July 2026 | MAP Product Team | Added optimisation strategy and feedback loops |
| 0.3 | July 2026 | MAP Product Team | Added iteration framework and growth metrics |
| 0.4 | July 2026 | MAP Product Team | Added best practices and standards |
| 1.0 | July 2026 | MAP Product Team | Official release — complete optimisation plan |

---

## 11. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Director | _________________ | _________________ | ____/____/2026 |
| VP Engineering | _________________ | _________________ | ____/____/2026 |
| VP Customer Success | _________________ | _________________ | ____/____/2026 |
| VP Sales | _________________ | _________________ | ____/____/2026 |
| CTO | _________________ | _________________ | ____/____/2026 |

---

*End of Document — 29_Post_Launch_Optimisation.md*
