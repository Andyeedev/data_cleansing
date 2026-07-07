# MAP Platform — Go-Live Checklist

| Field       | Detail                                                                 |
|-------------|------------------------------------------------------------------------|
| **Document** | 27_Go_Live_Checklist                                                   |
| **Title**    | MAP Production Go-Live Checklist                                       |
| **Version**  | 1.0                                                                    |
| **Date**     | July 2026                                                              |
| **Status**   | Official                                                               |
| **Owner**    | MAP Engineering & Platform Operations                                  |
| **Scope**    | End-to-end go-live readiness for Migration Assurance Platform (MAP)    |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Document Structure](#2-document-structure)
3. [Pre-Go-Live Readiness](#3-pre-go-live-readiness)
   - 3.1 Infrastructure Readiness
   - 3.2 Application Readiness
   - 3.3 Data Readiness
   - 3.4 Security Readiness
   - 3.5 Support Readiness
4. [Go-Live Day Execution](#4-go-live-day-execution)
   - 4.1 Deployment Execution
   - 4.2 Validation Execution
   - 4.3 Monitoring Activation
   - 4.4 Communication Execution
5. [Post-Go-Live Stabilisation](#5-post-go-live-stabilisation)
   - 5.1 Intensive Monitoring
   - 5.2 Support Activation
   - 5.3 Feedback Collection
   - 5.4 Early Optimisation
6. [Rollback Plan](#6-rollback-plan)
   - 6.1 Rollback Triggers
   - 6.2 Rollback Procedure
   - 6.3 Communication During Rollback
7. [Sign-Off Authority Matrix](#7-sign-off-authority-matrix)
8. [Best Practices & Lessons Learned](#8-best-practices--lessons-learned)
9. [Dependencies](#9-dependencies)
10. [References](#10-references)
11. [Revision History](#11-revision-history)
12. [Approval](#12-approval)

---

## 1. Purpose

This document provides a comprehensive, step-by-step checklist for launching the MAP (Migration Assurance Platform) into production. It ensures that every technical, operational, security, and business criterion is validated before, during, and after the go-live event. The checklist serves as the single source of truth for all launch participants, enabling coordinated execution, rapid issue resolution, and clean rollback if necessary.

**Key Objectives:**

- Eliminate ambiguity by defining exact tasks, owners, and completion criteria
- Ensure zero data loss and zero critical defects at launch
- Provide a structured communication framework for all stakeholders
- Enable confident rollback decision-making within defined time windows
- Establish post-launch monitoring and stabilisation baselines

**Intended Audience:**

- Platform Engineering team
- Infrastructure & DevOps team
- Security & Compliance team
- Product Management
- Customer Support & Success
- Executive Leadership (sign-off)

---

## 2. Document Structure

Each section follows the standardised checklist format:

| Column        | Description                                              |
|---------------|----------------------------------------------------------|
| **Task ID**   | Unique identifier for tracking                          |
| **Category**  | Functional area (Infra, App, Data, Security, Support)    |
| **Task**      | Specific action required                                |
| **Owner**     | Individual or team responsible                          |
| **Due**       | When the task must be completed (relative to go-live)    |
| **Status**    | Not Started / In Progress / Complete / Blocked           |
| **Evidence**  | Artifact proving completion                              |

**Status Tracking Convention:**

- `[ ]` Not Started
- `[-]` In Progress
- `[x]` Complete
- `[!]` Blocked / Requires Escalation

---

## 3. Pre-Go-Live Readiness

Pre-go-live activities must be completed **no later than T-2 business days** before the scheduled go-live date. All items must reach status `[x]` Complete before the Go/No-Go decision meeting.

### 3.1 Infrastructure Readiness

| Task ID | Task | Owner | Due | Status | Evidence |
|---------|------|-------|-----|--------|----------|
| INF-001 | Production Kubernetes cluster provisioned and sized per capacity plan | Infra Lead | T-7 | [ ] | Cluster spec document |
| INF-002 | Database cluster (primary + replica) provisioned with correct storage/IOPS | DBA | T-7 | [ ] | DB connection string |
| INF-003 | Redis/ElastiCache cluster provisioned and connected | Infra Lead | T-7 | [ ] | Cache hit/miss baseline |
| INF-004 | CDN configured with MAP domain and SSL certificates | DevOps | T-7 | [ ] | DNS propagation check |
| INF-005 | Load balancer configured with health checks and SSL termination | DevOps | T-7 | [ ] | LB health check log |
| INF-006 | Auto-scaling policies configured and tested with load | DevOps | T-5 | [ ] | Load test report |
| INF-007 | Backup schedules configured (DB, config, secrets) | DBA | T-5 | [ ] | Backup verification log |
| INF-008 | Disaster recovery runbook tested | Infra Lead | T-5 | [ ] | DR test results |
| INF-009 | Network security groups / firewall rules configured | Security | T-5 | [ ] | Firewall rule audit |
| INF-010 | Monitoring stack (Prometheus/Grafana/Datadog) deployed and configured | SRE | T-5 | [ ] | Dashboard screenshots |
| INF-011 | Log aggregation (ELK/Loki) deployed and ingesting | SRE | T-5 | [ ] | Log ingestion test |
| INF-012 | Alerting rules configured (CPU, memory, error rates, latency) | SRE | T-4 | [ ] | Alert test fire |
| INF-013 | DNS records pointing to production load balancer | DevOps | T-2 | [ ] | DNS lookup verification |
| INF-014 | SSL/TLS certificates valid and not expiring within 90 days | Security | T-2 | [ ] | Certificate audit |
| INF-015 | Infrastructure cost baseline documented | FinOps | T-2 | [ ] | Cost projection sheet |

**Infrastructure Readiness Gate Criteria:**

All items INF-001 through INF-015 must be `[x]` Complete. Zero items may be `[!]` Blocked.

### 3.2 Application Readiness

| Task ID | Task | Owner | Due | Status | Evidence |
|---------|------|-------|-----|--------|----------|
| APP-001 | Application containers built from release branch with correct tags | DevOps | T-3 | [ ] | Image digest comparison |
| APP-002 | All unit tests passing (100% critical path, >95% overall) | QA Lead | T-5 | [ ] | Test report export |
| APP-003 | Integration test suite passing against production-like environment | QA Lead | T-4 | [ ] | Integration test report |
| APP-004 | End-to-end test suite passing for all critical user journeys | QA Lead | T-4 | [ ] | E2E test report |
| APP-005 | Performance test completed — response times within SLA | QA Lead | T-5 | [ ] | Performance report |
| APP-006 | Load test completed — handles 2x projected peak traffic | QA Lead | T-5 | [ ] | Load test report |
| APP-007 | Security scan completed — zero critical/high vulnerabilities | Security | T-4 | [ ] | Security scan report |
| APP-008 | Dependency audit completed — all dependencies up to date | Dev Lead | T-4 | [ ] | Dependency audit |
| APP-009 | Environment variables configured for production | DevOps | T-3 | [ ] | Env config diff |
| APP-010 | Feature flags configured for staged rollout | Product | T-3 | [ ] | Feature flag matrix |
| APP-011 | Database migrations tested and ready to execute | DBA | T-3 | [ ] | Migration dry-run log |
| APP-012 | API versioning validated — no breaking changes | Dev Lead | T-3 | [ ] | API compatibility report |
| APP-013 | Error handling and retry logic validated | Dev Lead | T-3 | [ ] | Error handling test log |
| APP-014 | Graceful degradation paths tested | QA Lead | T-3 | [ ] | Degradation test report |
| APP-015 | Application health check endpoints configured | DevOps | T-3 | [ ] | Health check response |
| APP-016 | Startup and shutdown procedures validated | DevOps | T-3 | [ ] | Lifecycle test log |
| APP-017 | Configuration drift check — prod matches staging | DevOps | T-2 | [ ] | Config diff report |
| APP-018 | Release notes prepared and reviewed | Product | T-2 | [ ] | Release notes v1.0 |
| APP-019 | Changelog generated from commit history | Dev Lead | T-2 | [ ] | Generated changelog |
| APP-020 | Version tagging applied to source repository | Dev Lead | T-2 | [ ] | Git tag verification |

### 3.3 Data Readiness

| Task ID | Task | Owner | Due | Status | Evidence |
|---------|------|-------|-----|--------|----------|
| DAT-001 | Production database schema created and validated | DBA | T-5 | [ ] | Schema diff report |
| DAT-002 | Seed data loaded (reference data, lookup tables) | DBA | T-5 | [ ] | Seed data verification |
| DAT-003 | Data migration scripts tested with production-like data volume | DBA | T-4 | [ ] | Migration test report |
| DAT-004 | Data validation queries prepared and tested | DBA | T-4 | [ ] | Validation query results |
| DAT-005 | Backup and restore procedure tested end-to-end | DBA | T-4 | [ ] | Restore test log |
| DAT-006 | Data retention policies configured | DBA | T-3 | [ ] | Retention config doc |
| DAT-007 | Data encryption at rest enabled | Security | T-3 | [ ] | Encryption verification |
| DAT-008 | Data encryption in transit enabled (TLS 1.2+) | Security | T-3 | [ ] | TLS certificate check |
| DAT-009 | PII/PHI data classification applied | Compliance | T-3 | [ ] | Classification report |
| DAT-010 | Data access audit logging enabled | Security | T-3 | [ ] | Audit log verification |
| DAT-011 | Cross-region replication configured (if applicable) | DBA | T-3 | [ ] | Replication lag check |
| DAT-012 | Data purge scripts prepared for rollback scenario | DBA | T-2 | [ ] | Purge script test |
| DAT-013 | Initial data quality baseline captured | Data Eng | T-2 | [ ] | Data quality report |

### 3.4 Security Readiness

| Task ID | Task | Owner | Due | Status | Evidence |
|---------|------|-------|-----|--------|----------|
| SEC-001 | Penetration test completed — all critical findings remediated | Security | T-7 | [ ] | Pentest report |
| SEC-002 | OWASP Top 10 scan completed — zero findings | Security | T-7 | [ ] | OWASP scan report |
| SEC-003 | Authentication and authorization flows validated | Security | T-5 | [ ] | Auth test report |
| SEC-004 | API rate limiting configured and tested | Security | T-5 | [ ] | Rate limit test log |
| SEC-005 | CORS policy configured correctly | Security | T-5 | [ ] | CORS config audit |
| SEC-006 | Secrets management (Vault/AWS Secrets Manager) configured | Security | T-4 | [ ] | Secrets access test |
| SEC-007 | Service accounts and RBAC configured | Security | T-4 | [ ] | RBAC config audit |
| SEC-008 | DDoS protection configured (WAF rules, CDN protection) | Security | T-4 | [ ] | WAF rule test |
| SEC-009 | Security incident response plan reviewed | Security | T-3 | [ ] | IR plan sign-off |
| SEC-010 | Compliance checklist completed (SOC 2, GDPR, PCI if applicable) | Compliance | T-3 | [ ] | Compliance checklist |
| SEC-011 | Vulnerability disclosure policy published | Security | T-2 | [ ] | Policy URL verification |
| SEC-012 | Security baseline documented for ongoing audits | Security | T-2 | [ ] | Security baseline doc |

### 3.5 Support Readiness

| Task ID | Task | Owner | Due | Status | Evidence |
|---------|------|-------|-----|--------|----------|
| SUP-001 | Support team trained on MAP platform features | Support Lead | T-5 | [ ] | Training completion log |
| SUP-002 | Support runbooks created for common issues | Support Lead | T-5 | [ ] | Runbook index |
| SUP-003 | Escalation matrix defined and documented | Support Lead | T-5 | [ ] | Escalation matrix |
| SUP-004 | Ticketing system configured with MAP categories | Support Lead | T-4 | [ ] | Category config |
| SUP-005 | Knowledge base articles created | Support Lead | T-4 | [ ] | KB article count |
| SUP-006 | On-call rotation scheduled for launch week | Support Lead | T-3 | [ ] | On-call calendar |
| SUP-007 | Support SLA defined and documented | Support Lead | T-3 | [ ] | SLA document |
| SUP-008 | Communication templates prepared (status page, email) | Comms Lead | T-3 | [ ] | Template library |
| SUP-009 | Status page configured and tested | DevOps | T-3 | [ ] | Status page URL |
| SUP-010 | War room / bridge line established | Launch Manager | T-2 | [ ] | Bridge line details |
| SUP-011 | Customer success team briefed on launch timeline | CS Lead | T-2 | [ ] | Briefing confirmation |
| SUP-012 | Internal FAQ document distributed | Comms Lead | T-2 | [ ] | FAQ distribution log |

---

## 4. Go-Live Day Execution

Go-live day activities are sequenced in strict order. Each phase requires a completion gate before proceeding to the next.

### 4.1 Deployment Execution

| Task ID | Task | Owner | Time | Status | Evidence |
|---------|------|-------|------|--------|----------|
| GO-001 | Final Go/No-Go meeting conducted | Launch Manager | T+0 | [ ] | Go/No-Go decision record |
| GO-002 | All stakeholders notified of launch commencement | Launch Manager | T+0 | [ ] | Notification log |
| GO-003 | Production maintenance window announced | DevOps | T+0 | [ ] | Maintenance notice |
| GO-004 | Database migrations executed | DBA | T+0 | [ ] | Migration execution log |
| GO-005 | Database migration verified | DBA | T+0 | [ ] | Verification query results |
| GO-006 | Application deployment initiated (canary/blue-green) | DevOps | T+0 | [ ] | Deployment log |
| GO-007 | Canary deployment validated (10% traffic) | QA Lead | T+0 | [ ] | Canary metrics |
| GO-008 | Canary deployment expanded (50% traffic) | DevOps | T+0 | [ ] | Traffic split confirmation |
| GO-009 | Full deployment completed (100% traffic) | DevOps | T+0 | [ ] | Deployment completion log |
| GO-010 | Deployment verification — all pods running | DevOps | T+0 | [ ] | Pod status check |
| GO-011 | Deployment verification — no crash loops | SRE | T+0 | [ ] | Pod restart count |
| GO-012 | Deployment verification — memory/CPU stable | SRE | T+0 | [ ] | Resource metrics |

### 4.2 Validation Execution

| Task ID | Task | Owner | Time | Status | Evidence |
|---------|------|-------|------|--------|----------|
| VAL-001 | Health check endpoints responding | SRE | T+0 | [ ] | Health check response |
| VAL-002 | Authentication flow validated | QA Lead | T+0 | [ ] | Auth flow test |
| VAL-003 | Core migration workflow end-to-end test | QA Lead | T+0 | [ ] | E2E test results |
| VAL-004 | Data validation — source/target reconciliation | DBA | T+0 | [ ] | Reconciliation report |
| VAL-005 | API response times within SLA | SRE | T+0 | [ ] | Latency metrics |
| VAL-006 | Error rate within threshold (<0.1%) | SRE | T+0 | [ ] | Error rate dashboard |
| VAL-007 | Logging output verified — logs appearing correctly | SRE | T+0 | [ ] | Log sampling check |
| VAL-008 | Alerting verified — test alerts received | SRE | T+0 | [ ] | Alert delivery confirmation |
| VAL-009 | Integration points validated (third-party APIs) | QA Lead | T+0 | [ ] | Integration test results |
| VAL-010 | User acceptance sign-off received | Product | T+0 | [ ] | UAT sign-off document |

### 4.3 Monitoring Activation

| Task ID | Task | Owner | Time | Status | Evidence |
|---------|------|-------|------|--------|----------|
| MON-001 | Production monitoring dashboards activated | SRE | T+0 | [ ] | Dashboard screenshots |
| MON-002 | Real-time error tracking activated | SRE | T+0 | [ ] | Error tracker setup |
| MON-003 | Performance monitoring baseline captured | SRE | T+0 | [ ] | Baseline metrics |
| MON-004 | Business metrics monitoring activated | Data Eng | T+0 | [ ] | Business dashboard |
| MON-005 | Cost monitoring activated | FinOps | T+0 | [ ] | Cost dashboard |
| MON-006 | Security monitoring activated (SIEM) | Security | T+0 | [ ] | SIEM alert test |
| MON-007 | SLA monitoring configured | SRE | T+0 | [ ] | SLA dashboard |

### 4.4 Communication Execution

| Task ID | Task | Owner | Time | Status | Evidence |
|---------|------|-------|------|--------|----------|
| COM-001 | Internal launch announcement sent | Comms Lead | T+0 | [ ] | Announcement log |
| COM-002 | External launch announcement published | Marketing | T+0 | [ ] | Publication confirmation |
| COM-003 | Status page updated to "Operational" | Support Lead | T+0 | [ ] | Status page snapshot |
| COM-004 | Customer notification sent (if migration from legacy) | CS Lead | T+0 | [ ] | Email delivery log |
| COM-005 | Partner notification sent | Partnerships | T+0 | [ ] | Partner email log |
| COM-006 | Executive summary sent to leadership | Launch Manager | T+0 | [ ] | Email confirmation |

---

## 5. Post-Go-Live Stabilisation

Post-go-live covers **T+0 to T+14 days**. The first 72 hours require dedicated war room staffing.

### 5.1 Intensive Monitoring

| Task ID | Task | Owner | Frequency | Status | Evidence |
|---------|------|-------|-----------|--------|----------|
| PGL-001 | System health review | SRE | Every 2 hours (first 72h) | [ ] | Health review log |
| PGL-002 | Error rate review | SRE | Every 2 hours (first 72h) | [ ] | Error trend chart |
| PGL-003 | Performance metrics review | SRE | Every 4 hours (first 72h) | [ ] | Performance trend |
| PGL-004 | User activity review | Product | Daily (first 7 days) | [ ] | Activity dashboard |
| PGL-005 | Data quality review | DBA | Daily (first 7 days) | [ ] | Data quality report |
| PGL-006 | Security event review | Security | Daily (first 7 days) | [ ] | Security event log |
| PGL-007 | Cost review | FinOps | Daily (first 7 days) | [ ] | Cost actuals vs plan |
| PGL-008 | Customer feedback review | CS Lead | Daily (first 14 days) | [ ] | Feedback summary |
| PGL-009 | Capacity review | SRE | Every 48 hours (first 14 days) | [ ] | Capacity report |
| PGL-010 | SLA compliance review | SRE | Daily (first 14 days) | [ ] | SLA compliance report |

### 5.2 Support Activation

| Task ID | Task | Owner | Timeframe | Status | Evidence |
|---------|------|-------|-----------|--------|----------|
| PSA-001 | War room active (first 72 hours) | Launch Manager | T+0 to T+3 | [ ] | War room attendance |
| PSA-002 | On-call rotation active | Support Lead | T+0 to T+14 | [ ] | On-call roster |
| PSA-003 | Escalation paths tested | Support Lead | T+0 | [ ] | Escalation test log |
| PSA-004 | Customer support queue monitored | Support Lead | T+0 to T+14 | [ ] | Queue metrics |
| PSA-005 | Critical issue response SLA tracked | Support Lead | T+0 to T+14 | [ ] | Response time report |
| PSA-006 | Daily standup with all workstream leads | Launch Manager | T+0 to T+7 | [ ] | Standup notes |

### 5.3 Feedback Collection

| Task ID | Task | Owner | Timeframe | Status | Evidence |
|---------|------|-------|-----------|--------|----------|
| FB-001 | User feedback survey deployed | Product | T+3 | [ ] | Survey link |
| FB-002 | Support ticket trend analysis | Support Lead | T+7 | [ ] | Ticket analysis |
| FB-003 | Net Promoter Score baseline captured | CS Lead | T+7 | [ ] | NPS baseline |
| FB-004 | Internal team retrospective conducted | Launch Manager | T+7 | [ ] | Retro notes |
| FB-005 | Customer success feedback compiled | CS Lead | T+14 | [ ] | CS feedback report |
| FB-006 | Sales feedback on market reception | Sales Lead | T+14 | [ ] | Sales feedback |

### 5.4 Early Optimisation

| Task ID | Task | Owner | Timeframe | Status | Evidence |
|---------|------|-------|-----------|--------|----------|
| OPT-001 | Performance bottlenecks identified and triaged | SRE | T+3 to T+7 | [ ] | Bottleneck report |
| OPT-002 | Quick-win UX improvements identified | Product | T+7 | [ ] | UX improvement list |
| OPT-003 | Cost optimisation opportunities identified | FinOps | T+7 | [ ] | Cost optimisation plan |
| OPT-004 | Security hardening items backlog created | Security | T+7 | [ ] | Security backlog |
| OPT-005 | Technical debt items catalogued | Dev Lead | T+14 | [ ] | Tech debt register |

---

## 6. Rollback Plan

### 6.1 Rollback Triggers

The following conditions require immediate rollback consideration:

| Trigger ID | Condition | Severity | Response Time | Decision Authority |
|------------|-----------|----------|---------------|-------------------|
| RB-T01 | Error rate exceeds 5% for >15 minutes | Critical | Immediate | Launch Manager + CTO |
| RB-T02 | Data loss or corruption detected | Critical | Immediate | Launch Manager + DBA Lead |
| RB-T03 | Core functionality unavailable (migration workflow) | Critical | <30 min | Launch Manager + CTO |
| RB-T04 | Security breach detected | Critical | Immediate | Launch Manager + CISO |
| RB-T05 | Response times exceed 10x baseline for >30 min | High | <30 min | Launch Manager + SRE |
| RB-T06 | More than 3 critical bugs reported in first 24 hours | High | <1 hour | Launch Manager |
| RB-T07 | Customer-facing data inconsistency detected | High | <1 hour | Launch Manager + DBA |
| RB-T08 | Infrastructure failure (cluster, database) | Critical | Immediate | Launch Manager + Infra |
| RB-T09 | Dependency failure (third-party API) — duration >2 hours | Medium | <2 hours | Launch Manager + Dev |
| RB-T10 | Rollback requested by executive leadership | Critical | Immediate | CTO / CEO |

### 6.2 Rollback Procedure

| Step | Action | Owner | Time Estimate | Status |
|------|--------|-------|---------------|--------|
| RBP-01 | Rollback decision confirmed and documented | Launch Manager | 5 min | [ ] |
| RBP-02 | All stakeholders notified of rollback | Launch Manager | 5 min | [ ] |
| RBP-03 | Traffic redirected to previous version (canary/blue-green switch) | DevOps | 5 min | [ ] |
| RBP-04 | Database rollback script executed (if schema changes made) | DBA | 15 min | [ ] |
| RBP-05 | Database rollback verified | DBA | 10 min | [ ] |
| RBP-06 | Previous version health checks validated | SRE | 5 min | [ ] |
| RBP-07 | End-to-end smoke tests executed on rolled-back version | QA Lead | 15 min | [ ] |
| RBP-08 | Rollback success confirmed | Launch Manager | 5 min | [ ] |
| RBP-09 | Status page updated to reflect rollback | Support Lead | 5 min | [ ] |
| RBP-10 | Customer communication sent | Comms Lead | 10 min | [ ] |
| RBP-11 | Root cause investigation initiated | Dev Lead | 30 min | [ ] |
| RBP-12 | Post-mortem scheduled (within 48 hours) | Launch Manager | 5 min | [ ] |
| **Total estimated rollback time** | | | **~120 min** | |

### 6.3 Communication During Rollback

| Audience | Message | Channel | Owner | Timing |
|----------|---------|---------|-------|--------|
| Engineering Team | Rollback initiated — root cause investigation underway | Slack #map-launch | Launch Manager | Immediate |
| Executive Leadership | Rollback status summary with ETA | Email + SMS | Launch Manager | Within 15 min |
| Customer Support | Rollback status — customer-facing script provided | Slack #map-support | Support Lead | Within 15 min |
| Customers | Service disruption notice with expected resolution time | Status page + Email | Comms Lead | Within 30 min |
| Partners | Partner notification of service status | Email | Partnerships | Within 30 min |
| All Employees | Internal status update | Company Slack | Comms Lead | Within 30 min |

---

## 7. Sign-Off Authority Matrix

### 7.1 Technical Sign-Off

| Sign-Off Item | Authority | Delegate | Criteria |
|---------------|-----------|----------|----------|
| Infrastructure Readiness | VP Engineering | Infra Lead | All INF tasks complete |
| Application Readiness | Dev Lead | Senior Dev | All APP tasks complete |
| Data Readiness | DBA Lead | Senior DBA | All DAT tasks complete |
| Security Readiness | CISO | Security Lead | All SEC tasks complete |
| Performance Requirements | SRE Lead | Senior SRE | SLA thresholds met |
| Deployment Readiness | DevOps Lead | Senior DevOps | All deployment steps verified |

### 7.2 Business Sign-Off

| Sign-Off Item | Authority | Delegate | Criteria |
|---------------|-----------|----------|----------|
| Feature Completeness | Product Director | Senior PM | All launch features delivered |
| User Experience | UX Director | UX Lead | UX review passed |
| Go-to-Market Readiness | VP Marketing | Marketing Director | Launch materials ready |
| Customer Readiness | VP Customer Success | CS Director | Support team trained |
| Launch Communications | VP Communications | Comms Manager | Comms plan approved |

### 7.3 Legal & Compliance Sign-Off

| Sign-Off Item | Authority | Delegate | Criteria |
|---------------|-----------|----------|----------|
| Regulatory Compliance | General Counsel | Legal Counsel | Compliance checklist passed |
| Data Privacy | Data Protection Officer | Privacy Counsel | GDPR/CCPA review passed |
| Terms of Service | General Counsel | Legal Counsel | ToS published and linked |
| License Compliance | Legal Counsel | — | All dependencies licensed properly |

### 7.4 Executive Sign-Off

| Sign-Off Item | Authority | Criteria |
|---------------|-----------|----------|
| Go-Live Authorisation | CTO | All technical, business, and legal sign-offs received |
| Business Case Validation | CEO | Revenue and growth projections validated |
| Risk Acceptance | CTO + CEO | Residual risk within acceptable limits |
| Budget Approval | CFO | Cost projections within approved budget |

---

## 8. Best Practices & Lessons Learned

### 8.1 Comprehensive Preparation

- Complete **all** pre-go-live checklists before the Go/No-Go meeting
- Require explicit evidence for every completed task — no verbal confirmations
- Maintain a "parking lot" for non-blocking items that can be addressed post-launch
- Run a full dress rehearsal in a production-mirror environment at T-3
- Document all assumptions and exceptions with explicit approval

### 8.2 Tested & Verified

- Every rollback procedure must be tested at least once before go-live day
- Database rollback scripts must be tested with production-like data volumes
- Load tests must simulate 2x projected peak traffic
- Security scans must be completed with zero critical/high findings
- Integration tests must cover all third-party dependencies

### 8.3 Coordinated Execution

- Establish a single command centre (war room) for launch day
- Assign a dedicated Launch Manager with authority to make real-time decisions
- Use a shared checklist tracker visible to all participants
- Maintain 5-minute check-in cadence during active deployment
- Pre-approve all communication templates for common scenarios

### 8.4 Rollback Confidence

- Keep the previous version fully deployable until T+7 days post-launch
- Maintain database backward compatibility for at least one release cycle
- Test rollback procedure as rigorously as the forward deployment
- Set hard rollback triggers (not subjective assessments)
- Ensure rollback communications are ready before go-live

### 8.5 Post-Launch Discipline

- Maintain elevated monitoring for minimum 14 days after launch
- Conduct daily standups for first 7 days, then twice weekly for next 7 days
- Track and resolve all launch-day issues within 48 hours
- Conduct formal retrospective at T+7 and T+14
- Update this checklist with lessons learned from each launch

---

## 9. Dependencies

| Dependency | Description | Impact if Unresolved |
|------------|-------------|---------------------|
| Infrastructure provisioning | Cloud accounts, quotas, and billing must be active | Blocks all infrastructure tasks |
| SSL certificates | Must be issued and valid before DNS cutover | Blocks HTTPS traffic |
| DNS authority | Must have control over MAP domain DNS | Blocks traffic routing |
| Third-party API keys | All integration credentials must be valid | Blocks integration testing |
| Security approvals | Pen test and compliance reviews must be complete | Blocks production deployment |
| Support training | All support staff must complete MAP training | Blocks support readiness |
| Customer data | Migration data must be available and validated | Blocks data readiness |
| Executive approval | Go-live must be formally authorised | Blocks deployment |

---

## 10. References

| Document | Description | Location |
|----------|-------------|----------|
| MAP Architecture Document | System architecture and design | docs/architecture/ |
| MAP Deployment Runbook | Step-by-step deployment procedures | docs/deployment/ |
| MAP Security Assessment | Penetration test and security review | docs/security/ |
| MAP Performance Test Results | Load and performance test reports | docs/performance/ |
| MAP Support Runbooks | Troubleshooting and escalation guides | docs/support/ |
| MAP Communication Plan | Stakeholder communication templates | docs/comms/ |
| MAP Disaster Recovery Plan | DR procedures and RTO/RPO targets | docs/dr/ |

---

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | July 2026 | MAP Engineering | Initial draft — pre-go-live checklist |
| 0.2 | July 2026 | MAP Engineering | Added go-live day and post-go-live sections |
| 0.3 | July 2026 | MAP Engineering | Added rollback plan and sign-off matrix |
| 0.4 | July 2026 | MAP Operations | Added best practices and lessons learned |
| 1.0 | July 2026 | MAP Engineering | Official release — complete checklist |

---

## 12. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| VP Engineering | _________________ | _________________ | ____/____/2026 |
| CTO | _________________ | _________________ | ____/____/2026 |
| Product Director | _________________ | _________________ | ____/____/2026 |
| CISO | _________________ | _________________ | ____/____/2026 |
| General Counsel | _________________ | _________________ | ____/____/2026 |
| CEO | _________________ | _________________ | ____/____/2026 |

---

*End of Document — 27_Go_Live_Checklist.md*
