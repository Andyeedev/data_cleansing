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

This document defines activities that AI must NEVER perform autonomously within the MAP platform development and operations lifecycle.

---

## 2. Category 1: Production Control

| Activity | Why AI Should Not Do This | Human Role Required |
|----------|---------------------------|---------------------|
| Deploy to production without human approval | Production deployments have direct business impact | Release Manager approval |
| Modify production databases | Database changes affect data integrity | Database Administrator review |
| Access production credentials | AI systems with production access expand attack surface | Humans access production through break-glass procedures only |
| Make rollback decisions autonomously | Rollback decisions require business context | Incident Commander with human judgment |

---

## 3. Category 2: Security Decisions

| Activity | Why AI Should Not Do This | Human Role Required |
|----------|---------------------------|---------------------|
| Approve security exceptions | Security exceptions require risk tolerance understanding | CISO or Security Officer |
| Modify access controls | Access control changes affect authorization boundaries | Security team review |
| Handle sensitive data | AI processing of sensitive data creates privacy risks | Data Protection Officer oversight |
| Make compliance decisions | Compliance requirements involve legal interpretation | Compliance Officer with legal counsel |

---

## 4. Category 3: Architecture Decisions

| Activity | Why AI Should Not Do This | Human Role Required |
|----------|---------------------------|---------------------|
| Approve major architectural changes | Architectural decisions have long-term implications | Enterprise Architect with cross-team review |
| Make technology selection decisions | Technology choices affect hiring, training, ecosystem | Architecture Review Board with POC validation |
| Define system boundaries | System boundary decisions affect team autonomy | Domain-driven design workshops with team leads |
| Set performance requirements | Performance requirements must align with business SLAs | Product Owner with business requirement validation |

---

## 5. Category 4: Business Decisions

| Activity | Why AI Should Not Do This | Human Role Required |
|----------|---------------------------|---------------------|
| Make financial commitments | Financial decisions require cash flow understanding | Finance Director approval |
| Negotiate contracts | Contract negotiations require relationship management | Legal Counsel with business stakeholder input |
| Make legal decisions | Legal decisions require professional judgment | Legal Counsel with professional liability coverage |
| Define business requirements | Business requirements must reflect market understanding | Product Owner with customer validation |

---

## 6. Category 5: Human Resources

| Activity | Why AI Should Not Do This | Human Role Required |
|----------|---------------------------|---------------------|
| Make hiring decisions | Hiring requires cultural fit understanding | Hiring Manager with HR oversight |
| Evaluate performance | Performance evaluation requires context understanding | Direct Manager with HR guidance |
| Assign team responsibilities | Team assignment requires individual strengths understanding | Engineering Manager with team input |
| Resolve conflicts | Conflict resolution requires empathy | Engineering Manager with HR support |

---

## 7. Enforcement Mechanisms

### 7.1 Technical Controls

- AI systems are configured with role-based access preventing autonomous execution of prohibited activities
- Production environments require human authentication for all access
- Security-sensitive operations require multi-factor approval workflows
- All AI actions are logged and auditable

### 7.2 Process Controls

- Change management gates require human approval for prohibited categories
- Code review processes include human verification for security and architecture changes
- Incident response procedures require human command authority
- Financial and legal decisions include documented approval chains

---

## 8. Escalation Procedures

When AI encounters a decision that falls within a prohibited category:

1. **Immediate Stop**: AI halts autonomous execution
2. **Context Preservation**: AI captures current state and decision context
3. **Human Notification**: AI alerts designated human authority
4. **Decision Handoff**: AI provides analysis and recommendations to human decision-maker
5. **Human Execution**: Human makes and executes the final decision
6. **Audit Trail**: Decision and rationale are documented for future reference
