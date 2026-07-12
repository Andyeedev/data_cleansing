# MAP AI Limitations and Guardrails

| Field | Value |
|-------|-------|
| **Document** | MAP AI Limitations and Guardrails |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal |

---

## 1. Overview

This document defines activities that AI must NEVER perform autonomously within the MAP platform development and operations lifecycle. These guardrails protect production systems, security posture, architectural integrity, business interests, and team well-being.

---

## 2. Category 1: Production Control

### 2.1 Activities Prohibited from Autonomous AI Execution

| Activity | Why AI Should Not Do This | What Could Go Wrong | Human Role Required |
|----------|---------------------------|----------------------|---------------------|
| Deploy to production without human approval | Production deployments have direct business impact and require human judgment on timing, risk, and readiness | Outage during peak migration period, data corruption, cascading failures across dependent services | Release Manager approval with manual sign-off gate |
| Modify production databases | Database changes affect data integrity, referential consistency, and regulatory compliance | Data loss, schema corruption, GDPR/PCI violations, unrecoverable state | Database Administrator review and approval |
| Access production credentials | AI systems with production access expand attack surface and create audit concerns | Credential leakage, unauthorized access escalation, compliance violations | Humans access production through break-glass procedures only |
| Make rollback decisions autonomously | Rollback decisions require understanding of business context, data implications, and customer impact | Premature rollback causing data inconsistency, delayed rollback during genuine outage, rollback of partially-applied migrations | Incident Commander with human judgment on business impact |

### 2.2 Required Safeguards

- All production deployments require human approval in the deployment pipeline
- Production database access is restricted to break-glass procedures with human authorization
- AI systems operate in isolated environments with no production credential access
- Rollback decisions require human confirmation with documented risk assessment

---

## 3. Category 2: Security Decisions

### 3.1 Activities Prohibited from Autonomous AI Execution

| Activity | Why AI Should Not Do This | What Could Go Wrong | Human Role Required |
|----------|---------------------------|----------------------|---------------------|
| Approve security exceptions | Security exceptions require understanding of risk tolerance, regulatory context, and business justification | Overly permissive exceptions creating vulnerability exposure, regulatory non-compliance, audit failures | CISO or Security Officer with documented risk acceptance |
| Modify access controls | Access control changes affect authorization boundaries and require understanding of least-privilege principles | Privilege escalation, unauthorized data access, separation of duties violations | Security team review with access control policy alignment |
| Handle sensitive data | AI processing of sensitive data creates privacy risks, audit complexity, and regulatory exposure | GDPR/PCI violations, data exposure through AI model training, unauthorized data propagation | Data Protection Officer oversight with data handling protocols |
| Make compliance decisions | Compliance requirements involve legal interpretation, regulatory context, and organizational risk appetite | Regulatory penalties, certification failures, contract violations, legal liability | Compliance Officer with legal counsel consultation |

### 3.2 Required Safeguards

- Security exceptions require human sign-off with documented risk assessment
- Access control changes follow change management with security review
- AI systems operate on de-identified or synthetic data for training purposes
- Compliance decisions include legal review for regulatory interpretations

---

## 4. Category 3: Architecture Decisions

### 4.1 Activities Prohibited from Autonomous AI Execution

| Activity | Why AI Should Not Do This | What Could Go Wrong | Human Role Required |
|----------|---------------------------|----------------------|---------------------|
| Approve major architectural changes | Architectural decisions have long-term implications, affect team structure, and require organizational alignment | Technical debt accumulation, vendor lock-in, scalability limitations, team capability mismatches | Enterprise Architect with cross-team review |
| Make technology selection decisions | Technology choices affect hiring, training, ecosystem compatibility, and long-term maintenance | Incompatible technology stack, skills gap, vendor discontinuation, licensing complications | Architecture Review Board with POC validation |
| Define system boundaries | System boundary decisions affect team autonomy, deployment independence, and operational complexity | Tight coupling between services, unclear ownership, deployment bottlenecks | Domain-driven design workshops with team leads |
| Set performance requirements | Performance requirements must align with business SLAs, customer expectations, and cost constraints | Over-engineering, under-provisioning, misaligned cost-performance tradeoffs | Product Owner with business requirement validation |

### 4.2 Required Safeguards

- Major architectural changes require Architecture Review Board approval
- Technology selection includes POC validation and team capability assessment
- System boundaries are defined through collaborative domain analysis
- Performance requirements are validated against business SLAs

---

## 5. Category 4: Business Decisions

### 5.1 Activities Prohibited from Autonomous AI Execution

| Activity | Why AI Should Not Do This | What Could Go Wrong | Human Role Required |
|----------|---------------------------|----------------------|---------------------|
| Make financial commitments | Financial decisions require understanding of cash flow, budget constraints, and strategic priorities | Budget overruns, unfavorable contract terms, resource misallocation | Finance Director approval with budget alignment |
| Negotiate contracts | Contract negotiations require relationship management, legal understanding, and strategic positioning | Unfavorable terms, missed obligations, relationship damage, legal exposure | Legal Counsel with business stakeholder input |
| Make legal decisions | Legal decisions require professional judgment, regulatory knowledge, and liability understanding | Regulatory violations, contractual breaches, intellectual property infringement | Legal Counsel with professional liability coverage |
| Define business requirements | Business requirements must reflect market understanding, customer needs, and strategic direction | Misaligned product-market fit, missed customer needs, competitive disadvantage | Product Owner with customer validation |

### 5.2 Required Safeguards

- Financial commitments require finance director approval
- Contract negotiations include legal counsel review
- Legal decisions are made by qualified legal professionals
- Business requirements include customer validation and market analysis

---

## 6. Category 5: Human Resources

### 6.1 Activities Prohibited from Autonomous AI Execution

| Activity | Why AI Should Not Do This | What Could Go Wrong | Human Role Required |
|----------|---------------------------|----------------------|---------------------|
| Make hiring decisions | Hiring requires understanding of team dynamics, cultural fit, growth potential, and organizational needs | Poor cultural fit, skills mismatch, biased selection, legal liability | Hiring Manager with HR oversight and structured interview process |
| Evaluate performance | Performance evaluation requires understanding of context, growth trajectory, and individual circumstances | Unfair assessment, demotivation, legal exposure, biased outcomes | Direct Manager with HR guidance and 360-degree feedback |
| Assign team responsibilities | Team assignment requires understanding of individual strengths, career goals, and team dynamics | Skill mismatch, burnout, reduced engagement, delivery risk | Engineering Manager with team input |
| Resolve conflicts | Conflict resolution requires empathy, emotional intelligence, and cultural sensitivity | Escalated tensions, team fragmentation, legal exposure, morale damage | Engineering Manager with HR support |

### 6.2 Required Safeguards

- Hiring decisions include structured interview processes and diverse panels
- Performance evaluations include human review and calibration
- Team assignments consider individual career development goals
- Conflict resolution includes HR support and documented processes

---

## 7. Enforcement Mechanisms

### 7.1 Technical Controls

- AI systems are configured with role-based access that prevents autonomous execution of prohibited activities
- Production environments require human authentication for all access
- Security-sensitive operations require multi-factor approval workflows
- All AI actions are logged and auditable

### 7.2 Process Controls

- Change management gates require human approval for prohibited categories
- Code review processes include human verification for security and architecture changes
- Incident response procedures require human command authority
- Financial and legal decisions include documented approval chains

### 7.3 Monitoring Controls

- AI system actions are monitored for unauthorized autonomous behavior
- Access pattern anomalies trigger alerts and automatic restrictions
- Regular audits verify adherence to prohibited activity boundaries
- Incident reports are generated for any boundary violations

---

## 8. Escalation Procedures

When AI encounters a decision that falls within a prohibited category:

1. **Immediate Stop**: AI halts autonomous execution
2. **Context Preservation**: AI captures current state and decision context
3. **Human Notification**: AI alerts designated human authority
4. **Decision Handoff**: AI provides analysis and recommendations to human decision-maker
5. **Human Execution**: Human makes and executes the final decision
6. **Audit Trail**: Decision and rationale are documented for future reference

---

## 9. Regular Review

These limitations are reviewed quarterly to:
- Assess effectiveness of current guardrails
- Evaluate whether AI capabilities have matured to warrant category review
- Incorporate lessons learned from incidents and near-misses
- Align with evolving regulatory requirements

---

*Document Version: 1.0 — July 2026*
