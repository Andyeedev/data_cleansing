# Customer Success Repository for MAP Pilot Deployment & Customer Onboarding

---

| Field | Detail |
|---|---|
| **Document Title** | Customer Success Repository Structure and Governance |
| **Document ID** | MAP-CSR-022 |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal / Confidential |
| **Author** | MAP Platform Engineering |
| **Owner** | Customer Success & Operations |
| **Approvers** | VP Engineering, VP Customer Success, VP Operations |

---

## Revision History

| Version | Date | Author | Change Description |
|---------|------|--------|--------------------|
| 0.1 | June 2026 | MAP Platform Engineering | Initial draft |
| 0.2 | June 2026 | Customer Success | Added access control sections |
| 0.3 | June 2026 | Knowledge Management | Added naming conventions |
| 1.0 | July 2026 | MAP Platform Engineering | Official release |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Definitions and Abbreviations](#3-definitions-and-abbreviations)
4. [Repository Structure](#4-repository-structure)
5. [Directory Details](#5-directory-details)
6. [Naming Conventions](#6-naming-conventions)
7. [Access Control](#7-access-control)
8. [Content Standards](#8-content-standards)
9. [Maintenance and Governance](#9-maintenance-and-governance)
10. [Searchability and Navigation](#10-searchability-and-navigation)
11. [Dependencies](#11-dependencies)
12. [References](#12-references)
13. [Approval Signatures](#13-approval-signatures)

---

## 1. Purpose

This document defines the structure, governance, and best practices for the MAP (Migration Assurance Platform) Customer Success Repository. The repository serves as the centralised knowledge base for all customer-facing and internal operational documentation related to pilot deployment and customer onboarding.

The repository is designed to:

- Provide a single source of truth for all customer success documentation
- Ensure consistent organisation, naming, and versioning of materials
- Enable efficient search and retrieval of relevant information
- Control access to sensitive and customer-facing content
- Support the full customer lifecycle from onboarding through renewal
- Facilitate collaboration across teams and departments
- Maintain quality and accuracy of all documentation

---

## 2. Scope

This document applies to all documentation created, maintained, or referenced by the MAP Customer Success, Engineering, Operations, and Training teams in support of pilot deployment and customer onboarding activities.

The repository includes:

- Customer-facing guides and tutorials
- Training materials and curricula
- Support documentation and knowledge base articles
- Operational runbooks and playbooks
- Reusable templates and frameworks
- Communication templates and scripts
- Success metrics and reports
- Internal operational documentation

---

## 3. Definitions and Abbreviations

| Term | Definition |
|------|-----------|
| MAP | Migration Assurance Platform |
| CS | Customer Success |
| CSM | Customer Success Manager |
| SE | Solutions Engineer |
| SA | Solutions Architect |
| TAM | Technical Account Manager |
| KB | Knowledge Base |
| SOP | Standard Operating Procedure |
| RACI | Responsible, Accountable, Consulted, Informed |
| RBAC | Role-Based Access Control |

---

## 4. Repository Structure

### 4.1 Complete Directory Tree

```
map-customer-success-repository/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── new-document.md
│   │   ├── update-document.md
│   │   └── deprecate-document.md
│   └── PULL_REQUEST_TEMPLATE/
│       └── document-review.md
├── customer-guides/
│   ├── getting-started/
│   │   ├── quick-start-guide.md
│   │   ├── environment-setup.md
│   │   ├── first-migration.md
│   │   └── validation-basics.md
│   ├── user-guides/
│   │   ├── migration-validation/
│   │   ├── data-mapping/
│   │   ├── quality-checks/
│   │   ├── reporting/
│   │   └── administration/
│   ├── administrator-guides/
│   │   ├── user-management.md
│   │   ├── security-configuration.md
│   │   ├── integration-setup.md
│   │   └── system-monitoring.md
│   ├── api-guides/
│   │   ├── api-overview.md
│   │   ├── authentication.md
│   │   ├── endpoints.md
│   │   ├── webhooks.md
│   │   └── sdk-reference.md
│   ├── release-notes/
│   │   ├── v1.0/
│   │   ├── v1.1/
│   │   └── latest/
│   └── faq/
│       ├── general-faq.md
│       ├── technical-faq.md
│       └── billing-faq.md
├── training/
│   ├── curriculum/
│   │   ├── administrator-training/
│   │   ├── end-user-training/
│   │   ├── developer-training/
│   │   └── advanced-topics/
│   ├── materials/
│   │   ├── presentations/
│   │   ├── exercises/
│   │   ├── labs/
│   │   └── assessments/
│   ├── certifications/
│   │   ├── admin-certification/
│   │   ├── user-certification/
│   │   └── developer-certification/
│   └── resources/
│       ├── glossary.md
│       ├── best-practices.md
│       └── troubleshooting.md
├── support/
│   ├── knowledge-base/
│   │   ├── articles/
│   │   ├── troubleshooting/
│   │   ├── how-to/
│   │   ├── reference/
│   │   └── known-issues/
│   ├── escalation-procedures/
│   │   ├── escalation-matrix.md
│   │   ├── p0-procedure.md
│   │   ├── p1-procedure.md
│   │   └── contact-directory.md
│   ├── sla-documentation/
│   │   ├── support-sla.md
│   │   ├── response-times.md
│   │   └── resolution-targets.md
│   └── customer-facing-support/
│       ├── support-portal-guide.md
│       ├── ticket-submission-guide.md
│       └── support-hours.md
├── runbooks/
│   ├── deployment/
│   │   ├── pilot-deployment.md
│   │   ├── production-deployment.md
│   │   ├── rollback-procedure.md
│   │   └── environment-setup.md
│   ├── incident-response/
│   │   ├── p0-response.md
│   │   ├── p1-response.md
│   │   ├── communication-templates.md
│   │   └── post-mortem-template.md
│   ├── data-migration/
│   │   ├── migration-execution.md
│   │   ├── data-validation.md
│   │   ├── error-handling.md
│   │   └── performance-tuning.md
│   └── maintenance/
│       ├── system-health-check.md
│       ├── capacity-planning.md
│       ├── security-audit.md
│       └── backup-recovery.md
├── playbooks/
│   ├── customer-success/
│   │   ├── onboarding-playbook.md
│   │   ├── adoption-playbook.md
│   │   ├── retention-playbook.md
│   │   ├── expansion-playbook.md
│   │   └── churn-prevention-playbook.md
│   ├── deployment/
│   │   ├── pilot-playbook.md
│   │   ├── enterprise-playbook.md
│   │   └── smb-playbook.md
│   ├── support/
│   │   ├── technical-support-playbook.md
│   │   ├── customer-escalation-playbook.md
│   │   └── crisis-management-playbook.md
│   └── enablement/
│       ├── partner-enablement-playbook.md
│       ├── training-enablement-playbook.md
│       └── community-enablement-playbook.md
├── templates/
│   ├── deployment/
│   │   ├── deployment-checklist.md
│   │   ├── environment-configuration.md
│   │   └── go-live-checklist.md
│   ├── onboarding/
│   │   ├── kick-off-agenda.md
│   │   ├── onboarding-plan.md
│   │   └── success-plan.md
│   ├── reporting/
│   │   ├── weekly-status-report.md
│   │   ├── monthly-business-review.md
│   │   └── executive-dashboard.md
│   ├── support/
│   │   ├── ticket-template.md
│   │   ├── incident-report.md
│   │   └── post-mortem.md
│   └── communications/
│       ├── welcome-email.md
│       ├── training-invitation.md
│       └── renewal-reminder.md
├── communications/
│   ├── email-templates/
│   │   ├── onboarding/
│   │   ├── training/
│   │   ├── support/
│   │   ├── renewal/
│   │   └── expansion/
│   ├── presentation-templates/
│   │   ├── kick-off-presentation.md
│   │   ├── business-review-presentation.md
│   │   └── executive-summary-presentation.md
│   └── scripts/
│       ├── onboarding-call-script.md
│       ├── renewal-call-script.md
│       └── escalation-call-script.md
├── success/
│   ├── metrics/
│   │   ├── kpi-framework.md
│   │   ├── measurement-methodology.md
│   │   └── benchmark-data.md
│   ├── reports/
│   │   ├── pilot-performance-reports/
│   │   ├── quarterly-business-reviews/
│   │   └── annual-reports/
│   └── case-studies/
│       ├── enterprise-case-studies/
│       ├── mid-market-case-studies/
│       └── success-stories/
├── knowledge-base/
│   ├── articles/
│   │   ├── getting-started/
│   │   ├── configuration/
│   │   ├── troubleshooting/
│   │   ├── best-practices/
│   │   └── integrations/
│   ├── video-tutorials/
│   │   ├── getting-started-videos/
│   │   ├── feature-walkthroughs/
│   │   └── advanced-topics/
│   └── community-contributions/
│       ├── customer-contributed/
│       ├── partner-contributed/
│       └── internal-contributed/
├── operations/
│   ├── internal-documentation/
│   │   ├── team-structures.md
│   │   ├── process-documentation.md
│   │   └── tool-guides.md
│   ├── vendor-documentation/
│   │   ├── cloud-providers.md
│   │   ├── monitoring-tools.md
│   │   └── integration-partners.md
│   └── compliance/
│       ├── security-policies.md
│       ├── data-handling.md
│       └── audit-procedures.md
└── archive/
    ├── deprecated/
    ├── legacy/
    └── historical/
```

---

## 5. Directory Details

### 5.1 customer-guides/

**Purpose:** Contains all documentation intended for direct customer consumption. These guides are designed to help customers understand, configure, and use the MAP platform effectively.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| getting-started/ | Quick start guides, initial setup | New customers | Per release |
| user-guides/ | Feature-specific usage guides | End users | Per feature update |
| administrator-guides/ | Admin configuration guides | IT administrators | Per release |
| api-guides/ | API documentation and references | Developers | Per API change |
| release-notes/ | Version-specific release notes | All customers | Per release |
| faq/ | Frequently asked questions | All customers | Monthly |

**Content Standards:**
- All guides must include a prerequisites section
- Step-by-step instructions must include screenshots
- Code examples must be tested and verified
- Guides must be versioned and tagged with the applicable MAP version
- Customer-facing language must be clear, concise, and free of jargon

### 5.2 training/

**Purpose:** Houses all training materials, curricula, and certification programmes for MAP customers and partners.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| curriculum/ | Structured learning paths | All learners | Quarterly |
| materials/ | Presentations, exercises, labs | Trainers, learners | Per curriculum update |
| certifications/ | Certification programmes | Admins, users, developers | Annual |
| resources/ | Glossary, best practices, troubleshooting | All learners | Monthly |

**Content Standards:**
- Training modules must have clear learning objectives
- Exercises must be reproducible in a sandbox environment
- Assessments must have defined passing criteria
- Certifications must have validity periods and renewal requirements
- Training materials must be accessible (WCAG 2.1 AA compliant)

### 5.3 support/

**Purpose:** Contains all support-related documentation, including knowledge base articles, escalation procedures, and SLA definitions.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| knowledge-base/ | Searchable articles and guides | Support team, customers | Weekly |
| escalation-procedures/ | Escalation matrices and procedures | Support team | Monthly |
| sla-documentation/ | SLA definitions and targets | Support team, customers | Quarterly |
| customer-facing-support/ | Customer support guides | Customers | Monthly |

**Content Standards:**
- KB articles must include problem, cause, and solution sections
- Troubleshooting guides must include diagnostic steps
- Escalation procedures must include contact information
- All support content must be searchable and tagged

### 5.4 runbooks/

**Purpose:** Provides detailed operational procedures for recurring tasks, incident response, and maintenance activities.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| deployment/ | Deployment procedures | Operations, Engineering | Per deployment change |
| incident-response/ | Incident handling procedures | Operations, Support | Monthly |
| data-migration/ | Migration execution procedures | Engineering | Per feature update |
| maintenance/ | System maintenance procedures | Operations | Quarterly |

**Content Standards:**
- Runbooks must include prerequisites and post-conditions
- Steps must be numbered and actionable
- Runbooks must include rollback procedures
- Critical runbooks must be tested quarterly
- Runbooks must include contact information for escalation

### 5.5 playbooks/

**Purpose:** Provides strategic and tactical guidance for customer success scenarios, including onboarding, adoption, retention, and expansion.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| customer-success/ | CS strategy playbooks | Customer Success | Quarterly |
| deployment/ | Deployment strategy playbooks | Engineering, CS | Per deployment type |
| support/ | Support strategy playbooks | Support | Quarterly |
| enablement/ | Enablement strategy playbooks | All teams | Quarterly |

**Content Standards:**
- Playbooks must include clear objectives and success criteria
- Playbooks must include decision trees and escalation paths
- Playbooks must reference relevant templates and runbooks
- Playbooks must include metrics and KPIs for measurement
- Playbooks must be reviewed and updated quarterly

### 5.6 templates/

**Purpose:** Contains reusable templates for common documents, reports, and communications used across the customer lifecycle.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| deployment/ | Deployment-related templates | Engineering, CS | Per deployment change |
| onboarding/ | Onboarding document templates | CS | Quarterly |
| reporting/ | Reporting templates | CS, Operations | Monthly |
| support/ | Support document templates | Support | Quarterly |
| communications/ | Communication templates | CS, Support | Monthly |

**Content Standards:**
- Templates must include placeholder text and instructions
- Templates must be available in editable formats
- Templates must include version information
- Templates must be linked from relevant playbooks and runbooks
- Templates must follow brand guidelines

### 5.7 communications/

**Purpose:** Stores email templates, presentation templates, and call scripts for customer interactions throughout the lifecycle.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| email-templates/ | Email templates by lifecycle stage | CS, Support | Monthly |
| presentation-templates/ | Slide deck templates | CS, Engineering | Quarterly |
| scripts/ | Call and meeting scripts | CS, Support | Quarterly |

**Content Standards:**
- Email templates must include personalization tokens
- Presentation templates must follow brand guidelines
- Scripts must include objection handling
- All communications must be reviewed by Legal and Compliance
- Templates must be A/B tested for effectiveness

### 5.8 success/

**Purpose:** Contains success metrics, performance reports, and case studies demonstrating customer value and platform effectiveness.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| metrics/ | KPI frameworks and measurement guides | CS, Operations | Quarterly |
| reports/ | Performance reports and analyses | Leadership, CS | Per cadence |
| case-studies/ | Customer success stories | Sales, Marketing, CS | Monthly |

**Content Standards:**
- Metrics must include definitions and formulas
- Reports must include executive summaries
- Case studies must include quantified results
- All success content must be approved by Customer Success leadership
- Customer permission required for external case studies

### 5.9 knowledge-base/

**Purpose:** Provides a searchable collection of articles, videos, and community contributions for self-service support and learning.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| articles/ | Written knowledge articles | All users | Weekly |
| video-tutorials/ | Video walkthroughs and tutorials | All users | Monthly |
| community-contributions/ | User-generated content | All users | As contributed |

**Content Standards:**
- Articles must be tagged and categorised
- Articles must include search-optimised titles and descriptions
- Videos must include transcripts and captions
- Community contributions must be reviewed before publication
- All content must be searchable via the support portal

### 5.10 operations/

**Purpose:** Houses internal operational documentation, vendor information, and compliance materials not intended for customer access.

**Subdirectories:**

| Directory | Contents | Audience | Update Frequency |
|-----------|----------|----------|------------------|
| internal-documentation/ | Team and process documentation | Internal only | Monthly |
| vendor-documentation/ | Third-party vendor information | Internal only | As needed |
| compliance/ | Security and compliance documentation | Internal, Compliance | Quarterly |

**Content Standards:**
- Internal documentation must be clearly marked as confidential
- Compliance documentation must be reviewed by Legal
- Vendor documentation must include contract references
- Access must be restricted to authorised personnel

---

## 6. Naming Conventions

### 6.1 File Naming

| Element | Convention | Example |
|---------|-----------|---------|
| General files | `kebab-case.md` | `quick-start-guide.md` |
| Numbered sequences | `NN-descriptive-name.md` | `01-getting-started.md` |
| Templates | `template-descriptive-name.md` | `template-deployment-checklist.md` |
| Runbooks | `runbook-descriptive-name.md` | `runbook-pilot-deployment.md` |
| Playbooks | `playbook-descriptive-name.md` | `playbook-onboarding.md` |
| Versioned files | `name-vN.md` | `api-guide-v2.md` |

### 6.2 Folder Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Folders | `kebab-case/` | `customer-guides/` |
| Category folders | `lowercase/` | `deployment/` |
| Archive folders | `descriptive/` | `deprecated/` |

### 6.3 Versioning

| Element | Convention | Example |
|---------|-----------|---------|
| Major versions | `vN` | `v2` |
| Minor versions | `vN.M` | `v2.1` |
| Release notes | `vN.M/` | `v1.2/` |
| Archive | `archive/vN/` | `archive/v1/` |

### 6.4 Document Header Standard

Every document in the repository must include the following header:

```markdown
# Document Title

| Field | Detail |
|---|---|
| **Document ID** | MAP-XXX-NNN |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Draft / Review / Official / Deprecated |
| **Author** | Author Name |
| **Owner** | Team/Role |
```

---

## 7. Access Control

### 7.1 Access Levels

| Level | Description | Typical Audience |
|-------|-------------|------------------|
| Public | Available to anyone | Prospective customers |
| Customer | Available to active customers | Customer users |
| Partner | Available to certified partners | Partner organisations |
| Internal | Available to MAP employees | All employees |
| Restricted | Available to specific teams | Engineering, Security |

### 7.2 Access Matrix

| Directory | Public | Customer | Partner | Internal | Restricted |
|-----------|--------|----------|---------|----------|------------|
| customer-guides/ | Partial | Full | Full | Full | Full |
| training/ | Partial | Full | Full | Full | Full |
| support/ | Partial | Full | Full | Full | Full |
| runbooks/ | No | No | Partial | Full | Full |
| playbooks/ | No | No | No | Full | Full |
| templates/ | No | Partial | Partial | Full | Full |
| communications/ | No | No | No | Full | Full |
| success/ | Partial | Partial | Partial | Full | Full |
| knowledge-base/ | Partial | Full | Full | Full | Full |
| operations/ | No | No | No | Full | Full |
| archive/ | No | No | Partial | Full | Full |

### 7.3 Access Control Implementation

| Mechanism | Description | Tool |
|-----------|-------------|------|
| Repository permissions | Git-level access control | GitHub/GitLab permissions |
| Branch protection | Required reviews, status checks | Repository settings |
| CODEOWNERS | Automatic review assignment | CODEOWNERS file |
| Directory-level ACLs | Fine-grained access control | Repository permissions |
| Content filtering | Customer-specific content | Dynamic content system |
| Authentication | User identity verification | SSO, MFA |

### 7.4 Customer Access Portal

| Feature | Description | Access Level |
|---------|-------------|-------------|
| Documentation browser | Browse and search documentation | Customer |
| Video library | Watch training and tutorial videos | Customer |
| Knowledge base | Search and read KB articles | Customer |
| Community forum | Participate in discussions | Customer |
| Download center | Download templates and guides | Customer |
| Support portal | Submit and track tickets | Customer |

---

## 8. Content Standards

### 8.1 Document Quality Requirements

| Requirement | Description | Enforcement |
|------------|-------------|-------------|
| Accuracy | All content must be technically accurate | Review process |
| Completeness | Content must be complete and self-contained | Checklist |
| Clarity | Content must be clear and understandable | Style guide |
| Currency | Content must be up-to-date | Review schedule |
| Consistency | Content must follow established conventions | Style guide |
| Accessibility | Content must be accessible (WCAG 2.1 AA) | Automated checks |

### 8.2 Content Types

| Type | Description | Template | Review Required |
|------|-------------|----------|-----------------|
| Guide | Step-by-step instructions | Yes | Technical review |
| Reference | API specs, configuration options | Yes | Technical review |
| Tutorial | Learning-oriented walkthroughs | Yes | Training review |
| How-to | Task-oriented instructions | Yes | Technical review |
| Concept | Background and explanation | Yes | Editorial review |
| Troubleshooting | Problem resolution guides | Yes | Support review |
| Runbook | Operational procedures | Yes | Operations review |
| Playbook | Strategic guidance | Yes | CS review |
| Template | Reusable document template | Yes | Process review |
| KB Article | Short-form problem/solution | Yes | Support review |

### 8.3 Review Process

| Step | Reviewer | Criteria | SLA |
|------|----------|----------|-----|
| 1. Self-review | Author | Completeness, accuracy | Immediate |
| 2. Peer review | Team member | Accuracy, clarity | 2 business days |
| 3. Technical review | Subject matter expert | Technical accuracy | 3 business days |
| 4. Editorial review | Content editor | Style, grammar, formatting | 2 business days |
| 5. Approval | Document owner | Final approval | 1 business day |

---

## 9. Maintenance and Governance

### 9.1 Content Lifecycle

| Phase | Description | Activities | Owner |
|-------|-------------|-----------|-------|
| Creation | New content development | Draft, review, publish | Content author |
| Active use | Content in regular use | Monitor, update, improve | Content owner |
| Maintenance | Periodic review and updates | Review, revise, republish | Content owner |
| Archival | Content no longer active | Archive, redirect, deprecate | Content owner |
| Deletion | Content removal | Delete, redirect, notify | Content owner |

### 9.2 Review Schedule

| Content Type | Review Frequency | Reviewer | Notification |
|-------------|-----------------|----------|--------------|
| Customer guides | Per release | Technical writer | 30 days before release |
| Training materials | Quarterly | Training team | 30 days before review |
| KB articles | Monthly | Support team | 14 days before review |
| Runbooks | Quarterly | Operations | 30 days before review |
| Playbooks | Quarterly | CS leadership | 30 days before review |
| Templates | Monthly | Process owner | 14 days before review |
| Communications | Monthly | CS leadership | 14 days before review |

### 9.3 Deprecation Process

| Step | Action | Responsibility | SLA |
|------|--------|---------------|-----|
| 1 | Identify content for deprecation | Content owner | As needed |
| 2 | Create deprecation notice | Content owner | 2 business days |
| 3 | Add redirect to replacement | Content owner | 2 business days |
| 4 | Update search index | Operations | 1 business day |
| 5 | Notify affected users | CS team | 1 business day |
| 6 | Move to archive | Operations | 1 business day |
| 7 | Remove from active directory | Operations | 30 days after archival |

### 9.4 Quality Metrics

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Content freshness | 90% updated within SLA | Automated check | Weekly |
| Search success rate | 80% | Search analytics | Monthly |
| Content accuracy | 95% | Feedback and review | Quarterly |
| User satisfaction | 4.0/5 | Survey | Quarterly |
| Coverage rate | 95% of features documented | Audit | Quarterly |
| Broken link rate | <1% | Automated check | Weekly |

---

## 10. Searchability and Navigation

### 10.1 Search Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Full-text search | Search across all content | Elasticsearch |
| Faceted search | Filter by type, audience, topic | Search filters |
| Auto-suggest | Predictive search suggestions | Search API |
| Recent searches | History of recent searches | User profile |
| Saved searches | Persist frequently used searches | User profile |
| Search analytics | Track search queries and results | Analytics platform |

### 10.2 Taxonomy

| Dimension | Values |
|-----------|--------|
| Content type | Guide, Reference, Tutorial, How-to, Concept, Troubleshooting, Runbook, Playbook, Template, KB Article |
| Audience | Customer, Partner, Internal, All |
| Product area | Migration, Validation, Mapping, Reporting, Administration, API, Integration |
| Skill level | Beginner, Intermediate, Advanced, Expert |
| Role | Administrator, End User, Developer, Operations, Support |
| Lifecycle stage | Onboarding, Adoption, Expansion, Renewal |

### 10.3 Navigation Structure

| Element | Description | Purpose |
|---------|-------------|---------|
| Top-level navigation | Main category tabs | Quick access to major sections |
| Sidebar navigation | Subcategory tree | Detailed navigation within section |
| Breadcrumbs | Current location trail | Context and back navigation |
| Related content | Links to related articles | Discovery of relevant content |
| Table of contents | In-page navigation | Quick access to sections |

---

## 11. Dependencies

| Dependency | Type | Impact | Mitigation |
|-----------|------|--------|------------|
| Git repository hosting | Technical | Repository storage and version control | Use established platforms |
| Search infrastructure | Technical | Content discoverability | Deploy search service |
| Content management system | Technical | Content authoring and publishing | Implement CMS |
| Review and approval workflow | Process | Content quality assurance | Define workflow |
| Training content | Content | Training materials availability | Develop in parallel |
| Technical documentation | Content | Technical accuracy | Involve engineers |
| Brand guidelines | Design | Visual consistency | Reference brand guide |

---

## 12. References

| Document | Description | Location |
|----------|-------------|----------|
| MAP Style Guide | Writing and formatting guidelines | /docs/style-guide/ |
| Brand Guidelines | Visual identity and branding | /docs/brand/ |
| Content Strategy | Content planning and governance | /docs/content-strategy/ |
| Security Policies | Data handling and access control | /docs/security/ |
| Compliance Requirements | Regulatory and audit requirements | /docs/compliance/ |
| Customer Success Playbook | CS strategy and procedures | /playbooks/customer-success/ |

---

## 13. Approval Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| VP Engineering | _________________ | ___/___/2026 | _________________ |
| VP Customer Success | _________________ | ___/___/2026 | _________________ |
| VP Operations | _________________ | ___/___/2026 | _________________ |
| Director of Knowledge Management | _________________ | ___/___/2026 | _________________ |

---

*Document ID: MAP-CSR-022 | Version 1.0 | Status: Official | Date: July 2026*
