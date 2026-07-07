# MVP Release Plan

**Document:** MAP MVP Release Plan
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

MAP follows a structured release cadence from Alpha through General Availability over 16 weeks. Each phase increases scope, user base, and support maturity while validating product-market fit and operational readiness.

---

## Alpha (Week 8)

**Duration:** 2 weeks (Week 8–9)

### Entry Criteria
- Core validation engine implemented and passing unit tests
- Authentication with Microsoft Entra ID functional
- Database schema deployed and migrations passing
- CI/CD pipeline operational with build, test, and deploy stages
- Container images building and deploying to dev environment

### Exit Criteria
- All critical bugs from internal testing resolved
- Core validation checks executing correctly
- API endpoints documented and tested
- Basic UI navigable for all primary workflows
- No P0 or P1 defects open

### Features Included
- Migration project creation and management
- Core validation check execution (connectivity, permissions, compatibility)
- Basic finding display and status tracking
- Microsoft Entra ID authentication
- Role-based access control (Admin, Engineer, Viewer)
- REST API with OpenAPI documentation

### User Base
- Internal MAP development team only
- 5–10 users maximum
- All users are technical and can provide detailed feedback

### Support Model
- Direct Slack channel with development team
- Daily standup feedback sessions
- GitHub Issues for bug tracking
- No SLA commitments

### Success Metrics
- 100% of core validation checks passing
- <5% test failure rate in CI
- All team members can complete primary workflows
- Zero data loss incidents

### Risks
- Limited feature set may not demonstrate full value
- AI integration not yet available for feedback
- Performance characteristics unknown at scale
- Test coverage may be insufficient for edge cases

---

## Internal Preview (Week 10)

**Duration:** 1 week (Week 10)

### Entry Criteria
- Alpha exit criteria fully met
- All P1 bugs from Alpha resolved
- AI-assisted risk scoring functional
- Integration tests passing at >80% coverage
- Load testing baseline established
- Documentation drafted for all features

### Exit Criteria
- Internal stakeholders can complete end-to-end migration validation
- Performance within acceptable thresholds under simulated load
- Security scan passes with no critical findings
- Feedback from all stakeholder groups collected and triaged
- Release notes drafted

### Features Included
- All Alpha features
- AI-powered risk assessment and scoring
- Intelligent validation check recommendations
- Natural language migration status queries
- Report generation and export (PDF, Excel)
- Dashboard with migration overview metrics

### User Base
- Internal stakeholders: Product, Engineering, QA, DevRel
- 15–25 users maximum
- Mix of technical and semi-technical users

### Support Model
- Dedicated Teams channel for feedback
- Weekly feedback review meetings
- Bug triage twice weekly
- Known issues documented in internal FAQ

### Success Metrics
- All stakeholders complete full migration validation workflow
- AI recommendations rated as "helpful" by >70% of users
- Performance p95 <500ms for API responses
- Zero security vulnerabilities in SAST/DAST scans
- Documentation completeness >90%

### Risks
- AI quality may not meet stakeholder expectations
- Performance under real user load may differ from simulated tests
- Documentation gaps may slow adoption
- Stakeholder availability may be limited

---

## Pilot (Week 11)

**Duration:** 2 weeks (Week 11–12)

### Entry Criteria
- Internal Preview exit criteria fully met
- All feedback from Internal Preview addressed or prioritized
- Pilot customer agreements signed with NDA
- Support escalation procedures documented
- Monitoring and alerting configured for pilot environments
- Data isolation between pilot customers confirmed

### Exit Criteria
- All pilot customers complete at least one full migration validation
- Customer satisfaction score >7/10
- No data loss or security incidents
- Performance meets SLA targets under real workload
- Top 10 customer feedback items addressed or roadmap planned
- Pilot retrospective completed

### Features Included
- All Internal Preview features
- Multi-project dashboard
- Team collaboration features (comments, assignments)
- Azure resource connection and discovery
- Custom validation check configuration
- Notification system (email, Teams webhook)

### User Base
- 3–5 friendly customers with existing migration projects
- 20–50 users across pilot customers
- Customers with real migration workloads, not synthetic data

### Support Model
- Dedicated Slack/Teams channel per pilot customer
- 24-hour response time for critical issues
- Weekly check-in calls with each customer
- Escalation path to engineering for complex issues
- Shared bug tracker with customer visibility

### Success Metrics
- Customer NPS >30
- All pilot customers complete migration validation cycle
- <2 hour mean time to resolution for critical issues
- AI recommendation acceptance rate >60%
- Zero data isolation breaches
- Customer willing to provide reference quote

### Risks
- Real migration complexity may surface unexpected issues
- Customer data sensitivity may limit debugging capabilities
- Time zone differences may slow support response
- Customer expectations may exceed MVP scope
- Integration with customer-specific Azure environments may require custom work

---

## Private Preview (Week 12)

**Duration:** 2 weeks (Week 12–13)

### Entry Criteria
- Pilot exit criteria fully met
- All critical and high-severity bugs from Pilot resolved
- Self-service onboarding flow implemented and tested
- Documentation published to public-facing help center
- Legal review of terms of service and privacy policy completed
- NDA template approved by legal team

### Exit Criteria
- 10–20 customers onboarded successfully
- Self-service onboarding completion rate >80%
- Documentation rated as "helpful" by >70% of users
- Support ticket volume within capacity (<20 tickets/week)
- No P0 or P1 defects from external users
- Public Preview readiness checklist 100% complete

### Features Included
- All Pilot features
- Self-service customer onboarding
- In-app guided tour and tooltips
- Knowledge base with searchable documentation
- API rate limiting and quota management
- Audit logging for compliance

### User Base
- 10–20 customers under NDA
- 50–100 users total
- Mix of company sizes and migration complexity

### Support Model
- Self-service documentation as primary support
- Email support with 48-hour SLA for standard issues
- 4-hour SLA for critical issues affecting multiple users
- Monthly office hours for Q&A and feature requests
- Dedicated support engineer assigned to Private Preview

### Success Metrics
- Self-service onboarding completion rate >80%
- Documentation coverage >95% of features
- Average support ticket resolution <24 hours
- Customer retention rate >90% through preview period
- At least 3 customer testimonials or case studies

### Risks
- Support capacity may be strained with growing user base
- Documentation gaps may increase support ticket volume
- Self-service onboarding may have usability friction
- NDA restrictions may limit marketing value of participation

---

## Public Preview (Week 14)

**Duration:** 2 weeks (Week 14–15)

### Entry Criteria
- Private Preview exit criteria fully met
- Self-service billing portal implemented (free tier)
- Public documentation and getting-started guide published
- Marketing materials prepared (landing page, blog post, social)
- Community channels established (GitHub Discussions, Discord/Slack community)
- Monitoring dashboards for public usage metrics operational

### Exit Criteria
- 100+ registered users within 2 weeks
- Self-service onboarding working for >95% of signups
- Public documentation completeness 100%
- Community engagement: >10 discussions initiated
- Performance stable under 10x pilot load
- No critical security incidents
- Ready for GA release decision

### Features Included
- All Private Preview features
- Public API documentation with interactive playground
- Community feedback submission portal
- Usage analytics dashboard for customers
- Template library for common migration scenarios
- Integration with Azure DevOps and GitHub

### User Base
- Open registration, no NDA required
- 100–500 users expected
- Global distribution across Azure regions
- Mix of trial and engaged users

### Support Model
- Community-driven support (GitHub Discussions)
- Documentation-first approach with comprehensive FAQ
- Email support with 72-hour SLA for standard issues
- 24-hour SLA for critical issues
- Weekly community office hours
- Monthly product update webinars

### Success Metrics
- 100+ registered users within 2 weeks
- 30% week-over-week active user growth
- Community-initiated discussions >10 per week
- Self-service onboarding success rate >95%
- Average time to first validation <30 minutes
- Customer satisfaction (CSAT) >4.0/5.0

### Risks
- High registration volume may overwhelm support capacity
- Diverse user base may surface unexpected usage patterns
- International users may encounter latency issues
- Free tier abuse potential
- Public visibility increases security scrutiny

---

## General Availability (Week 16)

**Duration:** Ongoing

### Entry Criteria
- Public Preview exit criteria fully met
- All P0 and P1 bugs from Public Preview resolved
- SLA terms finalized and published (99.9% uptime)
- Billing system fully operational with invoicing
- Enterprise agreement and licensing options available
- Disaster recovery tested and documented
- Security audit completed by independent third party
- Go-to-market materials finalized and approved

### Exit Criteria
- GA release successfully deployed to production
- All monitoring and alerting operational
- Support team trained and staffed for production load
- Marketing launch executed (blog, social, email, partner channels)
- First 30-day retention metrics collected
- Customer success playbook documented

### Features Included
- All Public Preview features
- Full production SLA (99.9% uptime)
- Enterprise SSO and SCIM provisioning
- Advanced RBAC with custom roles
- Data export and migration history
- Compliance certifications (SOC 2 Type II in progress)
- Premium support tier option

### User Base
- Open registration, general availability
- Target: 500+ users within first 30 days
- Enterprise customers with production workloads
- Partner channel integrations

### Support Model
- Tiered support: Standard (48h), Premium (4h), Enterprise (1h)
- Dedicated customer success manager for Enterprise accounts
- 24/7 on-call for P1 production issues
- Monthly product advisory board meetings
- Quarterly business reviews for Enterprise customers

### Success Metrics
- 500+ registered users within 30 days
- 99.9% uptime SLA met
- Revenue target: first paying customer within 60 days
- NPS >40 at 90 days post-GA
- Customer retention rate >85% at 90 days
- Average support ticket resolution <12 hours for Premium
- Zero data loss incidents

### Risks
- Production scale may reveal performance bottlenecks not seen in preview
- Enterprise requirements may exceed current feature set
- Competitive pressure from established migration tools
- Billing integration complexity may cause onboarding friction
- Support staffing may need rapid scaling based on demand
- Compliance certification timeline may impact enterprise sales

---

## Release Timeline Summary

```
Week 1–7:   Development Sprint
Week 8–9:   Alpha (Internal Testing)
Week 10:    Internal Preview (Stakeholders)
Week 11–12: Pilot (3-5 Customers)
Week 12–13: Private Preview (10-20 Customers)
Week 14–15: Public Preview (Open Registration)
Week 16+:   General Availability (Full Production)
```

## Phase Gate Reviews

| Gate | Decision Maker | Go/No-Go Criteria |
|------|----------------|-------------------|
| Alpha → Internal Preview | Engineering Lead | All exit criteria met, no P0 bugs |
| Internal Preview → Pilot | Product Manager | Stakeholder approval, performance validated |
| Pilot → Private Preview | Product + Engineering | Customer satisfaction >7/10, no data issues |
| Private Preview → Public Preview | Product + Legal + Security | NDA compliance, security audit passed |
| Public Preview → GA | Executive Sponsor | Business metrics validated, operational readiness confirmed |
