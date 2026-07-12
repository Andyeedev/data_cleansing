# MAP Customer Onboarding Framework

| Field | Value |
|---|---|
| **Document Title** | MAP (Migration Assurance Platform) Customer Onboarding Framework |
| **Document ID** | MAP-PILOT-ONB-004 |
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
| 0.2 | June 2026 | MAP Strategy & Operations | Added welcome process and identity setup |
| 0.3 | June 2026 | MAP Strategy & Operations | Incorporated stakeholder feedback |
| 0.4 | June 2026 | MAP Strategy & Operations | Added 30-day timeline and best practices |
| 1.0 | July 2026 | MAP Strategy & Operations | Official release |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Definitions and Abbreviations](#3-definitions-and-abbreviations)
4. [References](#4-references)
5. [Onboarding Philosophy](#5-onboarding-philosophy)
6. [Customer Journey Map](#6-customer-journey-map)
7. [Welcome Process](#7-welcome-process)
8. [Kick-Off Meeting](#8-kick-off-meeting)
9. [Environment Preparation](#9-environment-preparation)
10. [Identity Setup](#10-identity-setup)
11. [User Provisioning](#11-user-provisioning)
12. [Configuration](#12-configuration)
13. [First Login Experience](#13-first-login-experience)
14. [Success Milestones](#14-success-milestones)
15. [Onboarding Checklist](#15-onboarding-checklist)
16. [30-Day Onboarding Timeline](#16-30-day-onboarding-timeline)
17. [Best Practices](#17-best-practices)
18. [Risk Management](#18-risk-management)
19. [Escalation Procedures](#19-escalation-procedures)
20. [Dependencies](#20-dependencies)
21. [Approval](#21-approval)

---

## 1. Purpose

This document establishes the comprehensive Customer Onboarding Framework for the MAP (Migration Assurance Platform) pilot program. It defines the end-to-end onboarding journey, processes, procedures, and best practices for successfully onboarding pilot customers onto the MAP platform.

The purpose of this framework is to:

- Define a standardised, repeatable onboarding process for all MAP pilot customers
- Establish clear milestones, timelines, and success criteria for onboarding
- Ensure a consistent and high-quality customer experience throughout onboarding
- Reduce time-to-value by streamlining environment setup, identity configuration, and user provisioning
- Provide comprehensive checklists to ensure no critical steps are missed
- Define roles, responsibilities, and escalation paths for onboarding activities
- Create a foundation for scaling onboarding beyond the pilot phase

This document serves as the single source of truth for all MAP customer onboarding activities and should be referenced by all team members involved in customer onboarding, including Customer Success, Engineering, Security, and Support teams.

---

## 2. Scope

This document covers:

- End-to-end customer onboarding journey map
- Welcome process including email, gift package, and introduction call
- Kick-off meeting structure, agenda, attendees, and outcomes
- Azure environment preparation and configuration
- Identity setup using Microsoft Entra ID, SSO, and MFA
- User provisioning including creation, role assignment, and access grants
- Platform configuration including initial setup, customisation, and integration
- First login experience including guided tour and first steps
- Success milestones at Day 1, Week 1, and Month 1
- Comprehensive onboarding checklists for each phase
- 30-day onboarding timeline
- Best practices for communication, engagement, and escalation
- Risk management and escalation procedures

This document does not cover:

- Pilot strategy and objectives (covered in Document 01: Pilot Strategy)
- Customer selection criteria (covered in Document 02: Customer Selection)
- Technical readiness requirements (covered in Document 03: Pilot Readiness Checklist)
- Post-pilot customer engagement or renewal processes
- Commercial pricing, contract terms, or billing

---

## 3. Definitions and Abbreviations

| Term | Definition |
|---|---|
| MAP | Migration Assurance Platform |
| CSM | Customer Success Manager |
| SE | Solutions Engineer |
| ESM | Engineering Support Manager |
| SSO | Single Sign-On |
| MFA | Multi-Factor Authentication |
| Entra ID | Microsoft Entra ID (formerly Azure AD) |
| RBAC | Role-Based Access Control |
| SLA | Service Level Agreement |
| UAT | User Acceptance Testing |
| RACI | Responsible, Accountable, Consulted, Informed |
| POC | Proof of Concept |
| DPA | Data Processing Agreement |
| NDA | Non-Disclosure Agreement |

---

## 4. References

| Reference | Document | Description |
|---|---|---|
| Batch 08 Architecture | `08_MVP_Technical_Architecture/` | System, API, Database, Security, AI architecture definitions including Azure infrastructure, Entra ID configuration, and RBAC model |
| Batch 10 UX Design | `10_UX_UI_Design_System/` | UX design principles, component library, navigation system, dashboard design, and onboarding UX patterns |
| Document 01 | `01_Pilot_Strategy.md` | MAP pilot strategy, objectives, and timeline |
| Document 02 | `02_Customer_Selection.md` | Customer selection criteria and scoring methodology |
| Document 03 | `03_Pilot_Readiness_Checklist.md` | Technical and organisational readiness requirements |

---

## 5. Onboarding Philosophy

### 5.1 Core Principles

MAP onboarding is built on five core principles that guide every interaction, decision, and process:

| Principle | Description |
|---|---|
| **Customer-First** | Every process, decision, and interaction is designed around the customer's needs, timeline, and success criteria. We adapt to the customer, not the other way around. |
| **Time-to-Value** | The primary objective is to get customers to their first meaningful value as quickly as possible. Every step in onboarding must directly contribute to accelerating value delivery. |
| **White-Glove Service** | Pilot customers receive premium, hands-on support throughout onboarding. Every touchpoint is an opportunity to demonstrate MAP's commitment to customer success. |
| **Structured Flexibility** | Onboarding follows a defined framework and checklist, but allows flexibility to accommodate unique customer requirements, timelines, and organisational constraints. |
| **Continuous Feedback** | Every onboarding generates learnings that improve the process. Feedback loops are embedded at every stage to capture insights and drive iterative improvement. |

### 5.2 Onboarding Goals

| Goal | Target | Measurement |
|---|---|---|
| Time to First Value | ≤ 5 business days from kick-off | Customer completes first validation run |
| Onboarding Completion | ≤ 30 calendar days from contract signing | All checklist items completed |
| Customer Satisfaction (CSAT) | ≥ 4.5 / 5.0 | Post-onboarding survey |
| First Login Rate | 100% within 48 hours of provisioning | Platform analytics |
| Support Ticket Volume | ≤ 3 during onboarding | Support system tracking |
| Escalation Rate | ≤ 1 during onboarding | Internal tracking |

### 5.3 Onboarding Tiers

| Tier | Customer Profile | Onboarding Model | Duration |
|---|---|---|---|
| **Tier 1 – Guided** | Enterprise customers with complex environments | Fully managed, white-glove onboarding with dedicated CSM and SE | 30 days |
| **Tier 2 – Assisted** | Mid-market customers with standard requirements | Semi-automated onboarding with CSM support at key milestones | 21 days |
| **Tier 3 – Self-Service** | SMB customers with simple environments | Automated onboarding with documentation and chat support | 14 days |

---

## 6. Customer Journey Map

### 6.1 End-to-End Onboarding Journey

The customer onboarding journey consists of seven distinct phases, each with defined activities, owners, and outcomes:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                        MAP CUSTOMER ONBOARDING JOURNEY MAP                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  PHASE 1          PHASE 2          PHASE 3          PHASE 4          PHASE 5          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│  │  WELCOME  │───▶│ KICK-OFF │───▶│  ENV     │───▶│ IDENTITY │───▶│  USER    │        │
│  │  PROCESS  │    │  MEETING │    │  SETUP   │    │  SETUP   │    │ PROVISION│        │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘        │
│                                                                                         │
│  PHASE 6          PHASE 7                                                             │
│  ┌──────────┐    ┌──────────┐                                                        │
│  │CONFIGURE │───▶│FIRST     │───▶ ONBOARDING COMPLETE ──▶ STEADY STATE               │
│  │          │    │LOGIN     │                                                        │
│  └──────────┘    └──────────┘                                                        │
│                                                                                         │
│  Day -7          Day 0           Day 1-3         Day 1-3         Day 2-5              │
│  Day -3          Day 0           Day 1-5         Day 2-5         Day 3-7              │
│                                      Day 5-10        Day 7-14                          │
│                                      Day 10-14       Day 14-21                         │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Journey Phase Details

| Phase | Name | Duration | Owner | Key Activities | Success Criteria |
|---|---|---|---|---|---|
| **1** | Welcome Process | Day -7 to Day -3 | CSM | Welcome email, gift package, introduction call | Customer feels welcomed and informed |
| **2** | Kick-Off Meeting | Day 0 | CSM + SE | Agenda review, stakeholder alignment, timeline confirmation | Shared understanding of goals and process |
| **3** | Environment Preparation | Day 1-3 | SE + Engineering | Azure setup, configuration, network access | Environment provisioned and accessible |
| **4** | Identity Setup | Day 1-3 | SE + Security | Entra ID, SSO, MFA configuration | Users can authenticate securely |
| **5** | User Provisioning | Day 2-5 | CSM + SE | User creation, role assignment, access grants | All users have appropriate access |
| **6** | Configuration | Day 5-14 | SE + Customer | Initial setup, customisation, integration | Platform configured to customer requirements |
| **7** | First Login | Day 7-14 | CSM | Welcome experience, guided tour, first steps | Customer completes first validation run |

### 6.3 Customer Touchpoints

| Touchpoint | Phase | Channel | Frequency | Owner |
|---|---|---|---|---|
| Welcome Email | 1 | Email | Once | CSM |
| Gift Package Delivery | 1 | Physical Mail | Once | Operations |
| Introduction Call | 1 | Video Call | Once | CSM |
| Kick-Off Meeting | 2 | Video Call | Once | CSM + SE |
| Daily Status Updates | 3-5 | Email/Slack | Daily | SE |
| Configuration Workshops | 6 | Video Call | As needed | SE |
| First Login Walkthrough | 7 | Video Call | Once | CSM |
| Weekly Check-ins | Post-Onboarding | Video Call | Weekly | CSM |

### 6.4 Customer Emotion Journey

| Phase | Expected Emotion | Risk | Mitigation |
|---|---|---|---|
| **Welcome** | Excitement, Anticipation | Overwhelm from too much information | Curated, digestible welcome package |
| **Kick-Off** | Engagement, Confidence | Misalignment on expectations | Structured agenda with clear outcomes |
| **Environment** | Patience, Slight Anxiety | Delays in provisioning | Pre-provisioned templates, SLA commitments |
| **Identity** | Security Conscious | Confusion with MFA setup | Step-by-step guides, live support |
| **Provisioning** | Eagerness | Access issues or delays | Pre-validated user lists, batch provisioning |
| **Configuration** | Investment, Ownership | Scope creep or delays | Defined scope, milestone checkpoints |
| **First Login** | Achievement, Value | First-run issues | Guided walkthrough, immediate support |

---

## 7. Welcome Process

### 7.1 Welcome Email

The welcome email is the first formal communication after contract signing and sets the tone for the entire onboarding experience.

#### 7.1.1 Welcome Email Template

| Element | Content |
|---|---|
| **Subject Line** | Welcome to MAP – Your Migration Assurance Platform Journey Begins |
| **Sender** | MAP Customer Success Team |
| **Send Time** | Within 24 hours of contract signing |
| **Tone** | Warm, professional, enthusiastic |

#### 7.1.2 Welcome Email Content Structure

| Section | Content | Purpose |
|---|---|---|
| **Personal Greeting** | "Dear [Customer Name]," | Establish personal connection |
| **Welcome Message** | Warm welcome to MAP, express excitement about partnership | Set positive tone |
| **What to Expect** | Overview of onboarding process and timeline | Set expectations |
| **Your CSM** | Introduction to assigned CSM with contact details | Establish primary contact |
| **Next Steps** | Clear action items and timeline | Drive immediate engagement |
| **Resources** | Links to documentation, support portal, community | Enable self-service |
| **Closing** | Express commitment to customer success | Reinforce partnership |

#### 7.1.3 Welcome Email Automation Rules

| Rule | Description |
|---|---|
| **Trigger** | Contract signed in CRM |
| **Delay** | ≤ 24 hours |
| **Personalisation** | Customer name, company name, CSM name, CSM email |
| **Follow-up** | CSM confirmation call within 48 hours |
| **Escalation** | If email not sent within 24 hours, escalate to CSM Manager |

### 7.2 Gift Package

The gift package reinforces the MAP brand and creates a tangible connection with the platform.

#### 7.2.1 Gift Package Contents

| Item | Description | Purpose |
|---|---|---|
| **Welcome Letter** | Personalised letter from MAP leadership | Executive commitment |
| **Branded Merchandise** | MAP-branded notebook, pen, and laptop sticker | Brand visibility |
| **Quick Start Card** | Laminated card with key URLs, support contacts, and first steps | Quick reference |
| **Sticker Sheet** | MAP-branded sticker sheet for laptop/water bottle | Brand affinity |
| **Thank You Card** | Handwritten thank you card from CSM | Personal touch |

#### 7.2.2 Gift Package Logistics

| Aspect | Detail |
|---|---|
| **Shipping Method** | tracked courier delivery |
| **Shipping Timeline** | Sent within 48 hours of contract signing |
| **Delivery Target** | Arrive before kick-off meeting |
| **Tracking** | CSM monitors delivery and confirms receipt |
| **Cost Budget** | ≤ £75 per customer |
| **International** | Additional 3-5 business days for international delivery |

### 7.3 Introduction Call

The introduction call is a 30-minute video call between the CSM and key customer stakeholders.

#### 7.3.1 Introduction Call Agenda

| Time | Activity | Owner | Purpose |
|---|---|---|---|
| 0:00-0:05 | Welcome and introductions | CSM | Establish rapport |
| 0:05-0:10 | MAP overview and value proposition | CSM | Reinforce value |
| 0:10-0:15 | Onboarding process walkthrough | CSM | Set expectations |
| 0:15-0:20 | Customer goals and success criteria | Customer | Understand needs |
| 0:20-0:25 | Questions and concerns | Both | Address issues |
| 0:25-0:30 | Next steps and scheduling | CSM | Drive momentum |

#### 7.3.2 Introduction Call Preparation

| Preparation Item | Owner | Timing |
|---|---|---|
| Review customer contract and requirements | CSM | Before call |
| Prepare personalised introduction deck | CSM | Before call |
| Schedule call within 48 hours of welcome email | CSM | After welcome email |
| Send calendar invite with agenda | CSM | Before call |
| Prepare customer-specific use cases | SE | Before call |

---

## 8. Kick-Off Meeting

### 8.1 Meeting Overview

The kick-off meeting is the formal start of the onboarding engagement and establishes shared understanding, alignment, and commitment between MAP and the customer.

| Aspect | Detail |
|---|---|
| **Duration** | 90 minutes |
| **Format** | Video call (Microsoft Teams) |
| **Attendees** | MAP team + Customer team |
| **Timing** | Day 0 of onboarding |
| **Pre-work** | Customer completes pre-kickoff questionnaire |

### 8.2 Attendees

#### 8.2.1 MAP Team

| Role | Responsibility | Attendance |
|---|---|---|
| **Customer Success Manager** | Primary customer contact, onboarding orchestration | Required |
| **Solutions Engineer** | Technical setup, configuration, integration | Required |
| **Engineering Support Manager** | Escalation point, technical oversight | Optional |
| **Product Manager** | Feedback capture, roadmap discussion | Optional |
| **Security Engineer** | Identity and access setup | As needed |

#### 8.2.2 Customer Team

| Role | Responsibility | Attendance |
|---|---|---|
| **Executive Sponsor** | Strategic alignment, escalation authority | Required (first 15 min) |
| **Project Manager** | Coordination, timeline management | Required |
| **Technical Lead** | Environment setup, integration points | Required |
| **Security Contact** | Identity, access, compliance requirements | Required |
| **End Users** | Feedback, use case validation | Optional |

### 8.3 Meeting Agenda

| Time | Section | Activity | Owner | Duration |
|---|---|---|---|---|
| 0:00-0:10 | **Opening** | Welcome, introductions, meeting objectives | CSM | 10 min |
| 0:10-0:20 | **Executive Alignment** | Strategic goals, success criteria, commitment | Executive Sponsor | 10 min |
| 0:20-0:35 | **Customer Context** | Current state, migration goals, pain points | Customer Technical Lead | 15 min |
| 0:35-0:50 | **MAP Overview** | Platform capabilities, architecture, value proposition | SE | 15 min |
| 0:50-1:05 | **Onboarding Plan** | Timeline, phases, milestones, responsibilities | CSM | 15 min |
| 1:05-1:15 | **Technical Requirements** | Environment, identity, integration, security | SE + Security | 10 min |
| 1:15-1:25 | **Risks and Dependencies** | Identification, mitigation, escalation | CSM | 10 min |
| 1:25-1:30 | **Next Steps** | Action items, ownership, deadlines | CSM | 5 min |

### 8.4 Kick-Off Meeting Outcomes

| Outcome | Description | Owner | Delivery |
|---|---|---|---|
| **Shared Vision** | Aligned understanding of goals, success criteria, and timeline | CSM | Meeting notes |
| **Technical Requirements** | Documented environment, identity, and integration requirements | SE | Requirements document |
| **Onboarding Plan** | Agreed timeline with milestones and responsibilities | CSM | Onboarding plan |
| **Risk Register** | Identified risks with mitigation strategies | CSM | Risk register |
| **Communication Plan** | Agreed cadence, channels, and escalation paths | CSM | Communication plan |
| **Action Items** | Clear next steps with owners and deadlines | CSM | Action item tracker |

### 8.5 Pre-Kickoff Questionnaire

The pre-kickoff questionnaire is sent to the customer 5 business days before the kick-off meeting to gather essential information.

| Question Category | Questions |
|---|---|
| **Organisation** | Company name, industry, size, primary contact details |
| **Technical** | Current infrastructure, cloud provider, Azure subscription details |
| **Identity** | Identity provider, domain, number of users, existing SSO |
| **Migration** | Current migration tools, pain points, goals, timeline |
| **Stakeholders** | Executive sponsor, project manager, technical lead, security contact |
| **Success** | Definition of success, key metrics, first value target |
| **Constraints** | Budget, timeline, resource, compliance constraints |

---

## 9. Environment Preparation

### 9.1 Azure Environment Setup

Environment preparation follows the architecture defined in Batch 08 Architecture and ensures a secure, isolated, and performant environment for each pilot customer.

#### 9.1.1 Azure Resource Requirements

| Resource | Specification | Purpose |
|---|---|---|
| **Azure Subscription** | Customer-provided or MAP-managed | Isolated billing and governance |
| **Resource Group** | `rg-map-[customer]-[env]` | Logical resource grouping |
| **Azure Region** | Customer-preferred or nearest | Latency optimisation |
| **Virtual Network** | `/24` subnet minimum | Network isolation |
| **Private Endpoints** | As required by architecture | Secure service access |
| **Azure Key Vault** | Premium tier | Secrets management |
| **Azure Monitor** | Full monitoring stack | Observability |
| **Log Analytics Workspace** | Customer-dedicated | Centralised logging |

#### 9.1.2 Environment Provisioning Process

| Step | Activity | Owner | Duration | Prerequisites |
|---|---|---|---|---|
| 1 | Receive Azure subscription details from customer | SE | Day 0 | Contract signed |
| 2 | Validate subscription permissions and limits | SE | Day 0 | Subscription details |
| 3 | Create resource group and baseline resources | Engineering | Day 1 | Subscription validated |
| 4 | Configure networking (VNet, subnets, NSGs) | Engineering | Day 1 | Resource group created |
| 5 | Deploy Azure Key Vault and configure secrets | Engineering | Day 1 | Networking configured |
| 6 | Deploy monitoring and logging infrastructure | Engineering | Day 2 | Key Vault configured |
| 7 | Configure private endpoints and DNS | Engineering | Day 2 | Monitoring configured |
| 8 | Validate connectivity and access | SE | Day 2 | All resources deployed |
| 9 | Document environment details and credentials | SE | Day 3 | Validation complete |
| 10 | Customer sign-off on environment | CSM | Day 3 | Documentation complete |

#### 9.1.3 Environment Naming Convention

| Component | Format | Example |
|---|---|---|
| Resource Group | `rg-map-[customer]-[env]` | `rg-map-acme-prod` |
| Virtual Network | `vnet-map-[customer]-[env]` | `vnet-map-acme-prod` |
| Subnet | `snet-map-[purpose]` | `snet-map-app` |
| Key Vault | `kv-map-[customer]-[env]` | `kv-map-acme-prod` |
| Log Analytics | `log-map-[customer]-[env]` | `log-map-acme-prod` |
| Storage Account | `stmap[customer][env]` | `stmapacmeprod` |

### 9.2 Configuration

#### 9.2.1 Platform Configuration

| Configuration Area | Items | Owner |
|---|---|---|
| **Tenant Settings** | Customer branding, domain, notification preferences | SE |
| **Migration Profiles** | Source/target system definitions, connection strings | SE + Customer |
| **Validation Rules** | Default rule sets, custom validation criteria | SE + Customer |
| **Reporting** | Dashboard configuration, report templates, export settings | CSM |
| **Alerting** | Notification channels, alert thresholds, escalation rules | SE |
| **Integration** | API keys, webhook URLs, third-party connections | SE + Customer |

#### 9.2.2 Configuration Validation

| Validation Check | Method | Owner | Criteria |
|---|---|---|---|
| Connectivity | API health check | SE | 200 OK response |
| Authentication | Token validation | SE | Valid JWT token |
| Data Access | Query test | SE | Expected results returned |
| Integration | End-to-end test | SE | Data flows correctly |
| Performance | Load test | Engineering | Within SLA thresholds |
| Security | Penetration test | Security | No critical findings |

### 9.3 Access Configuration

#### 9.3.1 Network Access

| Access Type | Configuration | Purpose |
|---|---|---|
| **VPN/ExpressRoute** | Customer-to-MAP connectivity | Secure hybrid access |
| **Public IP** | Whitelisted IPs only | External access |
| **Private Link** | Azure service access | Secure service-to-service |
| **Azure Bastion** | Jumpbox access | Secure VM management |

#### 9.3.2 Service Access

| Service | Access Method | Protocol |
|---|---|---|
| MAP Application | HTTPS | TLS 1.3 |
| MAP API | HTTPS | TLS 1.3, OAuth 2.0 |
| MAP Database | Private Endpoint | TCP, encrypted |
| MAP Storage | Private Endpoint | HTTPS |
| Monitoring | Azure Monitor | HTTPS |

---

## 10. Identity Setup

### 10.1 Microsoft Entra ID Configuration

Identity setup follows the security architecture defined in Batch 08 Architecture and implements Microsoft Entra ID as the identity provider.

#### 10.1.1 Entra ID Tenant Configuration

| Configuration Item | Setting | Purpose |
|---|---|---|
| **Tenant Type** | Customer-managed or MAP-managed | Isolation and governance |
| **Domain** | Customer's verified domain | Branded authentication |
| **Conditional Access** | Location, device, risk-based policies | Security enforcement |
| **Self-Service Password Reset** | Enabled with MFA | User self-service |
| **Password Protection** | Smart lockout, banned passwords | Account protection |
| **Guest Access** | Restricted or controlled | External collaboration |

#### 10.1.2 Entra ID App Registration

| Configuration | Value |
|---|---|
| **Application Name** | MAP – [Customer Name] |
| **Redirect URIs** | Customer-specific application URLs |
| **ID Tokens** | Enabled |
| **Access Tokens** | Enabled |
| **Implicit Flow** | Disabled (use authorization code with PKCE) |
| **API Permissions** | Microsoft Graph (User.Read, Directory.Read) |
| **Client Secret** | Generated and stored in Key Vault |

### 10.2 Single Sign-On (SSO) Configuration

#### 10.2.1 SSO Protocol Selection

| Protocol | Use Case | Configuration |
|---|---|---|
| **SAML 2.0** | Enterprise customers with ADFS/Entra ID | Metadata exchange, certificate rotation |
| **OpenID Connect** | Modern applications, mobile access | Client ID/Secret, scopes, claims |
| **WS-Federation** | Legacy applications | Metadata URL, realm configuration |

#### 10.2.2 SSO Configuration Steps

| Step | Activity | Owner | Duration |
|---|---|---|---|
| 1 | Collect customer IdP metadata | SE | 30 min |
| 2 | Configure MAP Service Provider settings | SE | 1 hour |
| 3 | Exchange metadata and certificates | SE + Customer | 1 hour |
| 4 | Configure attribute mappings | SE | 30 min |
| 5 | Test authentication flow | SE + Customer | 1 hour |
| 6 | Validate attribute transfer | SE | 30 min |
| 7 | Enable SSO in production | SE | 15 min |
| 8 | Disable password auth (optional) | SE + Customer | 15 min |

#### 10.2.3 Attribute Mapping

| Entra ID Attribute | MAP Attribute | Required | Purpose |
|---|---|---|---|
| `userPrincipalName` | `email` | Yes | User identification |
| `givenName` | `firstName` | Yes | User profile |
| `surname` | `lastName` | Yes | User profile |
| `mail` | `email` | Yes | Communication |
| `department` | `department` | No | Organisation mapping |
| `jobTitle` | `role` | No | Role assignment |
| `employeeId` | `employeeId` | No | Employee identification |

### 10.3 Multi-Factor Authentication (MFA)

#### 10.3.1 MFA Configuration

| Configuration | Setting | Purpose |
|---|---|---|
| **MFA Enforcement** | Required for all users | Security compliance |
| **Allowed Methods** | Microsoft Authenticator, SMS, Voice call | User flexibility |
| **Default Method** | Microsoft Authenticator | Best security |
| **Remember Device** | 14 days | User convenience |
| **Authentication Frequency** | Every 8 hours | Security balance |
| **Risk-Based MFA** | High-risk sign-ins require MFA | Adaptive security |

#### 10.3.2 MFA Enrollment Process

| Step | Activity | Owner | Duration |
|---|---|---|---|
| 1 | User receives MFA enrollment email | System | Automatic |
| 2 | User registers authenticator app | User | 5 min |
| 3 | User verifies registration | User | 2 min |
| 4 | User sets up backup method | User | 5 min |
| 5 | MFA enrollment confirmed | System | Automatic |

---

## 11. User Provisioning

### 11.1 User Creation

#### 11.1.1 User Creation Process

| Step | Activity | Owner | Duration | Prerequisites |
|---|---|---|---|---|
| 1 | Customer provides user list (CSV/template) | Customer | Day 2 | Kick-off complete |
| 2 | Validate user list format and completeness | SE | 30 min | User list received |
| 3 | Review user list with customer | CSM + SE | 30 min | Validation complete |
| 4 | Create users in Entra ID (batch) | SE | 1 hour | List approved |
| 5 | Assign MFA methods | System | Automatic | Users created |
| 6 | Send welcome emails with login instructions | System | Automatic | MFA configured |
| 7 | Verify user creation and access | SE | 30 min | Emails sent |
| 8 | Customer confirms user access | Customer | 1 hour | Verification complete |

#### 11.1.2 User List Template

| Field | Required | Format | Description |
|---|---|---|---|
| `firstName` | Yes | String | User's first name |
| `lastName` | Yes | String | User's last name |
| `email` | Yes | Email | Corporate email address |
| `department` | Yes | String | Department or team |
| `role` | Yes | Enum | MAP role (see 11.2) |
| `employeeId` | No | String | Employee ID for tracking |
| `manager` | No | Email | Manager's email for approvals |
| `startDate` | No | Date | Start date for delayed provisioning |

#### 11.1.3 User Creation Validation

| Validation Check | Method | Failure Action |
|---|---|---|
| Email format | Regex validation | Reject, request correction |
| Duplicate email | Entra ID lookup | Skip, notify customer |
| Domain validation | MX record check | Verify with customer |
| License availability | Subscription check | Escalate to SE |
| Role validity | Enum validation | Reject, request correction |

### 11.2 Role Assignment

#### 11.2.1 MAP Roles

| Role | Description | Permissions | Typical Users |
|---|---|---|---|
| **Platform Admin** | Full platform administration | All permissions | IT administrators |
| **Migration Manager** | Migration project management | Create, read, update, delete migrations | Migration leads |
| **Migration Engineer** | Migration execution | Execute migrations, view reports | Migration engineers |
| **Validation Engineer** | Validation rule management | Create, read, update, delete rules | QA engineers |
| **Data Analyst** | Data analysis and reporting | Read data, create reports | Analysts |
| **Viewer** | Read-only access | View dashboards and reports | Stakeholders |
| **Executive** | Executive dashboard access | View KPIs and summaries | Executives |

#### 11.2.2 Role Assignment Process

| Step | Activity | Owner |
|---|---|---|
| 1 | Map user roles to MAP roles | CSM + Customer |
| 2 | Prepare role assignment list | SE |
| 3 | Create Azure AD security groups per role | SE |
| 4 | Assign users to security groups | SE |
| 5 | Configure RBAC in MAP application | SE |
| 6 | Validate role assignments | SE + Customer |
| 7 | Document role assignments | SE |

#### 11.2.3 Role-Based Access Control Matrix

| Permission | Platform Admin | Migration Manager | Migration Engineer | Validation Engineer | Data Analyst | Viewer | Executive |
|---|---|---|---|---|---|---|---|
| Create Migration | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Execute Migration | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Migration | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Validation Rules | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Execute Validation | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Reports | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Executive Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 11.3 Access Grants

#### 11.3.1 Access Grant Types

| Grant Type | Description | Process | Approval |
|---|---|---|---|
| **Standard Access** | Pre-approved role assignments | Automated provisioning | None |
| **Elevated Access** | Temporary elevated permissions | Request → Approve → Grant | Manager + Admin |
| **Service Account** | Non-human identity access | Request → Validate → Grant | Admin |
| **API Access** | Programmatic access via API keys | Request → Scope → Grant | Admin |
| **External Access** | Guest or partner access | Request → Security Review → Grant | Security + Admin |

#### 11.3.2 Access Grant Process

| Step | Activity | Owner | SLA |
|---|---|---|---|
| 1 | User/manager submits access request | Requester | N/A |
| 2 | CSM reviews request | CSM | 4 hours |
| 3 | Manager approval (if required) | Manager | 24 hours |
| 4 | Security review (if required) | Security | 48 hours |
| 5 | Access provisioned | SE | 4 hours |
| 6 | User notified | System | Automatic |
| 7 | Access validated | SE | 4 hours |

---

## 12. Configuration

### 12.1 Initial Setup

#### 12.1.1 Configuration Workshop

The configuration workshop is a collaborative session between the SE and customer to configure MAP for the customer's specific requirements.

| Aspect | Detail |
|---|---|
| **Duration** | 2-4 hours (may be split across multiple sessions) |
| **Attendees** | SE, Customer Technical Lead, Customer Migration Team |
| **Format** | Video call with screen sharing |
| **Pre-requisite** | Environment setup complete, SSO configured |

#### 12.1.2 Configuration Workshop Agenda

| Time | Section | Activity |
|---|---|---|
| 0:00-0:15 | **Review** | Confirm environment readiness, address blockers |
| 0:15-0:45 | **Source Systems** | Configure source system connections and credentials |
| 0:45-1:15 | **Target Systems** | Configure target system connections and credentials |
| 1:15-1:30 | **Break** | — |
| 1:30-2:00 | **Migration Profiles** | Define migration profiles and templates |
| 2:00-2:30 | **Validation Rules** | Configure validation rule sets and criteria |
| 2:30-3:00 | **Reporting** | Set up dashboards, reports, and exports |
| 3:00-3:30 | **Alerting** | Configure notifications and escalation rules |
| 3:30-3:45 | **Review** | Confirm configuration, identify gaps |
| 3:45-4:00 | **Next Steps** | Action items, timeline, follow-up |

#### 12.1.3 Initial Setup Checklist

| Item | Category | Owner | Status |
|---|---|---|---|
| Customer branding applied | Tenant | SE | ☐ |
| Notification preferences configured | Tenant | SE | ☐ |
| Timezone and locale set | Tenant | SE | ☐ |
| Source system connections tested | Integration | SE | ☐ |
| Target system connections tested | Integration | SE | ☐ |
| Migration profiles created | Migration | SE + Customer | ☐ |
| Validation rules configured | Validation | SE + Customer | ☐ |
| Dashboard templates applied | Reporting | CSM | ☐ |
| Report templates configured | Reporting | CSM | ☐ |
| Alert rules configured | Alerting | SE | ☐ |
| Notification channels verified | Alerting | SE | ☐ |

### 12.2 Customisation

#### 12.2.1 Customisation Areas

| Area | Options | Owner | Timeline |
|---|---|---|---|
| **Branding** | Logo, colours, custom domain | SE | 1 day |
| **Workflows** | Custom approval workflows, gates | SE + Customer | 3-5 days |
| **Templates** | Migration templates, report templates | SE + Customer | 2-3 days |
| **Integrations** | CI/CD, ticketing, monitoring | SE + Customer | 5-10 days |
| **Dashboards** | Custom dashboard layouts and widgets | CSM + Customer | 2-3 days |
| **Notifications** | Custom notification templates and channels | SE | 1-2 days |

#### 12.2.2 Customisation Request Process

| Step | Activity | Owner | SLA |
|---|---|---|---|
| 1 | Customer submits customisation request | Customer | N/A |
| 2 | SE reviews and estimates effort | SE | 24 hours |
| 3 | CSM reviews with customer | CSM | 24 hours |
| 4 | Approval (if scope change) | CSM Manager | 48 hours |
| 5 | SE implements customisation | SE | Per estimate |
| 6 | Customer validates customisation | Customer | 48 hours |
| 7 | Customisation deployed | SE | 4 hours |

### 12.3 Integration

#### 12.3.1 Integration Points

| Integration | Type | Purpose | Complexity |
|---|---|---|---|
| **Azure DevOps** | REST API | Source/target for migrations | Medium |
| **ServiceNow** | REST API | Ticketing and change management | Medium |
| **Jira** | REST API | Issue tracking and project management | Medium |
| **Splunk** | REST API | Log aggregation and monitoring | Low |
| **PagerDuty** | REST API | Incident management and escalation | Low |
| **Slack** | Webhook | Notifications and alerts | Low |
| **Power BI** | OData | Advanced reporting and analytics | Medium |
| **Custom Systems** | REST/SOAP | Customer-specific integrations | High |

#### 12.3.2 Integration Configuration Process

| Step | Activity | Owner | Duration |
|---|---|---|---|
| 1 | Identify integration requirements | SE + Customer | 1 hour |
| 2 | Review API documentation | SE | 2 hours |
| 3 | Configure integration credentials | SE | 1 hour |
| 4 | Map data fields | SE + Customer | 2 hours |
| 5 | Configure integration settings | SE | 2 hours |
| 6 | Test integration end-to-end | SE + Customer | 2 hours |
| 7 | Validate data flow | SE | 1 hour |
| 8 | Document integration | SE | 1 hour |

---

## 13. First Login Experience

### 13.1 Welcome Experience

#### 13.1.1 First Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIRST LOGIN EXPERIENCE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User clicks login link from welcome email                    │
│           │                                                      │
│           ▼                                                      │
│  2. SSO authentication (Entra ID)                                │
│           │                                                      │
│           ▼                                                      │
│  3. MFA verification (if not enrolled)                           │
│           │                                                      │
│           ▼                                                      │
│  4. Welcome screen with personalised greeting                    │
│           │                                                      │
│           ▼                                                      │
│  5. Terms of service acceptance                                  │
│           │                                                      │
│           ▼                                                      │
│  6. Profile completion (optional fields)                         │
│           │                                                      │
│           ▼                                                      │
│  7. Guided tour (interactive walkthrough)                        │
│           │                                                      │
│           ▼                                                      │
│  8. First steps checklist                                        │
│           │                                                      │
│           ▼                                                      │
│  9. Dashboard landing page                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 13.1.2 Welcome Screen Content

| Element | Content | Purpose |
|---|---|---|
| **Greeting** | "Welcome to MAP, [First Name]!" | Personal connection |
| **Message** | "You're now part of the MAP community..." | Context setting |
| **Quick Links** | "Get Started" → Guided tour, "Explore" → Dashboard | Direct action |
| **Support** | "Need help?" → Support portal, chat, CSM contact | Safety net |
| **Progress** | "Your onboarding is X% complete" | Motivation |

### 13.2 Guided Tour

#### 13.2.1 Tour Structure

| Step | Screen | Feature | Duration | Skip Option |
|---|---|---|---|---|
| 1 | Dashboard | Overview and key metrics | 30 sec | Yes |
| 2 | Migrations | Migration project management | 30 sec | Yes |
| 3 | Validation | Validation rules and execution | 30 sec | Yes |
| 4 | Reports | Reporting and analytics | 30 sec | Yes |
| 5 | Settings | Configuration and preferences | 30 sec | Yes |
| 6 | Help | Support resources and documentation | 30 sec | Yes |

#### 13.2.2 Guided Tour Implementation

| Aspect | Detail |
|---|---|
| **Technology** | Interactive overlay using product tour library |
| **Trigger** | First login (detected via flag) |
| **Duration** | 3 minutes total |
| **Progress** | Saved, can resume from last step |
| **Completion** | Marked as complete in user profile |
| **Replay** | Available from Help menu |

### 13.3 First Steps Checklist

The first steps checklist appears after the guided tour and guides users through essential initial actions.

| Step | Action | Description | Reward |
|---|---|---|---|
| 1 | **Complete Profile** | Add phone number and avatar | Profile badge |
| 2 | **Connect First System** | Add a source or target system | Integration badge |
| 3 | **Create Migration** | Start first migration project | Migration badge |
| 4 | **Run Validation** | Execute first validation run | Validation badge |
| 5 | **View Report** | Generate first report | Reporting badge |
| 6 | **Invite Teammate** | Add a team member | Collaboration badge |

#### 13.3.1 First Steps Completion Tracking

| Metric | Target | Measurement |
|---|---|---|
| Checklist start rate | ≥ 95% | Platform analytics |
| Checklist completion rate | ≥ 80% | Platform analytics |
| Time to complete | ≤ 30 minutes | Platform analytics |
| Badge achievement rate | ≥ 70% | Platform analytics |

---

## 14. Success Milestones

### 14.1 Day 1 Milestones

| Milestone | Criteria | Verification | Owner |
|---|---|---|---|
| **Environment Ready** | Azure environment provisioned and accessible | Health check passed | SE |
| **SSO Configured** | SSO authentication working end-to-end | Test login successful | SE |
| **MFA Enrolled** | All users enrolled in MFA | MFA status verified | SE |
| **Users Provisioned** | All users created and assigned roles | User list validated | SE |
| **First Login** | At least one user completed first login | Login analytics | CSM |
| **Kick-Off Complete** | Kick-off meeting conducted and outcomes documented | Meeting notes published | CSM |

### 14.2 Week 1 Milestones

| Milestone | Criteria | Verification | Owner |
|---|---|---|---|
| **Configuration Complete** | All initial configuration items completed | Configuration checklist signed off | SE |
| **Integration Configured** | Required integrations connected and tested | Integration test passed | SE |
| **First Migration Started** | Customer initiated first migration project | Migration created in platform | CSM |
| **Validation Rules Active** | Validation rules configured and operational | Test validation executed | SE |
| **Training Complete** | Key users completed training modules | Training records updated | CSM |
| **Support Established** | Customer knows how to access support | Support portal access verified | CSM |

### 14.3 Month 1 Milestones

| Milestone | Criteria | Verification | Owner |
|---|---|---|---|
| **First Migration Complete** | Customer completed first full migration cycle | Migration status = Complete | CSM |
| **Validation Executed** | Customer ran validation on migrated data | Validation report generated | CSM |
| **Reports Generated** | Customer generated at least one report | Report delivered | CSM |
| **User Adoption** | ≥ 70% of provisioned users logged in | User analytics | CSM |
| **Feedback Received** | Customer provided onboarding feedback | Survey completed | CSM |
| **Steady State** | Customer self-sufficient in daily operations | Support ticket trend = stable | CSM |

### 14.4 Milestone Tracking Dashboard

| Phase | Milestones | Completed | On Track | At Risk | Blocked |
|---|---|---|---|---|---|
| Day 1 | 6 | 0 | 0 | 0 | 0 |
| Week 1 | 6 | 0 | 0 | 0 | 0 |
| Month 1 | 6 | 0 | 0 | 0 | 0 |
| **Total** | **18** | **0** | **0** | **0** | **0** |

---

## 15. Onboarding Checklist

### 15.1 Pre-Onboarding Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | Contract signed and countersigned | Sales | ☐ | |
| 2 | Customer onboarding kickoff email sent | CSM | ☐ | |
| 3 | CSM and SE assigned to customer | CSM Manager | ☐ | |
| 4 | Customer welcome email sent | CSM | ☐ | |
| 5 | Gift package shipped | Operations | ☐ | |
| 6 | Introduction call scheduled | CSM | ☐ | |
| 7 | Introduction call completed | CSM | ☐ | |
| 8 | Pre-kickoff questionnaire sent | CSM | ☐ | |
| 9 | Pre-kickoff questionnaire received | CSM | ☐ | |
| 10 | Kick-off meeting scheduled | CSM | ☐ | |
| 11 | Kick-off meeting materials prepared | CSM + SE | ☐ | |
| 12 | Azure subscription details received | SE | ☐ | |

### 15.2 Environment Setup Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | Azure subscription validated | SE | ☐ | |
| 2 | Resource group created | Engineering | ☐ | |
| 3 | Virtual network configured | Engineering | ☐ | |
| 4 | Subnets and NSGs configured | Engineering | ☐ | |
| 5 | Azure Key Vault created | Engineering | ☐ | |
| 6 | Key Vault secrets configured | Engineering | ☐ | |
| 7 | Log Analytics workspace created | Engineering | ☐ | |
| 8 | Azure Monitor configured | Engineering | ☐ | |
| 9 | Private endpoints configured | Engineering | ☐ | |
| 10 | DNS configuration verified | Engineering | ☐ | |
| 11 | Network connectivity tested | SE | ☐ | |
| 12 | Environment documentation created | SE | ☐ | |
| 13 | Customer environment sign-off | Customer | ☐ | |

### 15.3 Identity Setup Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | Entra ID tenant configured | SE | ☐ | |
| 2 | Customer domain verified | SE | ☐ | |
| 3 | MAP app registration created | SE | ☐ | |
| 4 | App registration permissions configured | SE | ☐ | |
| 5 | SSO protocol configured (SAML/OIDC) | SE | ☐ | |
| 6 | Metadata exchanged | SE + Customer | ☐ | |
| 7 | Attribute mappings configured | SE | ☐ | |
| 8 | SSO tested end-to-end | SE + Customer | ☐ | |
| 9 | MFA policies configured | SE | ☐ | |
| 10 | MFA enrollment completed | Users | ☐ | |
| 11 | Conditional access policies configured | SE | ☐ | |
| 12 | Password policies configured | SE | ☐ | |
| 13 | Identity setup validated | SE | ☐ | |

### 15.4 User Provisioning Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | User list received from customer | CSM | ☐ | |
| 2 | User list validated | SE | ☐ | |
| 3 | User list reviewed with customer | CSM + SE | ☐ | |
| 4 | Role assignments mapped | CSM + Customer | ☐ | |
| 5 | Security groups created | SE | ☐ | |
| 6 | Users created in Entra ID | SE | ☐ | |
| 7 | Users assigned to security groups | SE | ☐ | |
| 8 | MAP roles assigned | SE | ☐ | |
| 9 | Welcome emails sent to users | System | ☐ | |
| 10 | MFA enrollment completed by users | Users | ☐ | |
| 11 | User access validated | SE | ☐ | |
| 12 | Customer confirms user access | Customer | ☐ | |

### 15.5 Configuration Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | Configuration workshop scheduled | CSM | ☐ | |
| 2 | Configuration workshop conducted | SE + Customer | ☐ | |
| 3 | Tenant settings configured | SE | ☐ | |
| 4 | Source system connections configured | SE | ☐ | |
| 5 | Source system connections tested | SE | ☐ | |
| 6 | Target system connections configured | SE | ☐ | |
| 7 | Target system connections tested | SE | ☐ | |
| 8 | Migration profiles created | SE + Customer | ☐ | |
| 9 | Validation rules configured | SE + Customer | ☐ | |
| 10 | Dashboard templates applied | CSM | ☐ | |
| 11 | Report templates configured | CSM | ☐ | |
| 12 | Alert rules configured | SE | ☐ | |
| 13 | Notification channels verified | SE | ☐ | |
| 14 | Customisations implemented | SE | ☐ | |
| 15 | Integrations configured | SE | ☐ | |
| 16 | Integrations tested | SE + Customer | ☐ | |
| 17 | Configuration validated end-to-end | SE + Customer | ☐ | |
| 18 | Configuration documentation created | SE | ☐ | |

### 15.6 First Login Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | Welcome screen displayed | System | ☐ | |
| 2 | Terms of service accepted | User | ☐ | |
| 3 | Profile completed | User | ☐ | |
| 4 | Guided tour completed | User | ☐ | |
| 5 | First steps checklist displayed | System | ☐ | |
| 6 | First migration created | User | ☐ | |
| 7 | First validation executed | User | ☐ | |
| 8 | First report generated | User | ☐ | |
| 9 | User feedback captured | CSM | ☐ | |

### 15.7 Onboarding Completion Checklist

| # | Item | Owner | Status | Notes |
|---|---|---|---|---|
| 1 | All Day 1 milestones achieved | CSM | ☐ | |
| 2 | All Week 1 milestones achieved | CSM | ☐ | |
| 3 | All Month 1 milestones achieved | CSM | ☐ | |
| 4 | Onboarding survey completed by customer | Customer | ☐ | |
| 5 | Onboarding retrospective conducted | CSM + Team | ☐ | |
| 6 | Lessons learned documented | CSM | ☐ | |
| 7 | Customer success plan created | CSM | ☐ | |
| 8 | Handover to steady-state support | CSM | ☐ | |
| 9 | Onboarding closure email sent | CSM | ☐ | |
| 10 | Customer health score recorded | CSM | ☐ | |

---

## 16. 30-Day Onboarding Timeline

### 16.1 Timeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        30-DAY ONBOARDING TIMELINE                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  WEEK -1        WEEK 0         WEEK 1         WEEK 2         WEEK 3         WEEK 4  │
│  ┌───────┐    ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐   │
│  │PRE-   │    │KICK   │     │ENV    │     │CONFIG │     │TEST & │     │GO     │   │
│  │ONBOARD│───▶│OFF    │────▶│SETUP  │────▶│       │────▶│VALID  │────▶│LIVE   │   │
│  └───────┘    └───────┘     └───────┘     └───────┘     └───────┘     └───────┘   │
│                                                                                      │
│  Day -7       Day 0         Day 1-7       Day 8-14      Day 15-21     Day 22-30    │
│  Day -3                                                                              │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 16.2 Detailed Timeline

#### Week -1: Pre-Onboarding (Day -7 to Day -1)

| Day | Activity | Owner | Deliverable |
|---|---|---|---|
| -7 | Welcome email sent | CSM | Email delivered |
| -7 | Gift package shipped | Operations | Shipping confirmation |
| -6 | Introduction call scheduled | CSM | Calendar invite |
| -5 | Pre-kickoff questionnaire sent | CSM | Questionnaire |
| -4 | Introduction call conducted | CSM | Call notes |
| -3 | Pre-kickoff questionnaire received | Customer | Completed questionnaire |
| -3 | Kick-off meeting scheduled | CSM | Calendar invite |
| -2 | Kick-off materials prepared | CSM + SE | Presentation, agenda |
| -1 | Final preparation and review | CSM + SE | Readiness confirmed |

#### Week 0: Kick-Off (Day 0)

| Day | Activity | Owner | Deliverable |
|---|---|---|---|
| 0 | Kick-off meeting conducted | CSM + SE | Meeting notes |
| 0 | Technical requirements gathered | SE | Requirements document |
| 0 | Onboarding plan confirmed | CSM | Onboarding plan |
| 0 | Risk register initiated | CSM | Risk register |
| 0 | Communication plan agreed | CSM | Communication plan |
| 0 | Environment setup initiated | SE | Setup tickets created |

#### Week 1: Environment Setup (Day 1-7)

| Day | Activity | Owner | Deliverable |
|---|---|---|---|
| 1 | Azure resource group created | Engineering | Resource group |
| 1 | Virtual network configured | Engineering | VNet configuration |
| 1 | Key Vault created and configured | Engineering | Key Vault |
| 2 | Monitoring infrastructure deployed | Engineering | Monitor setup |
| 2 | Private endpoints configured | Engineering | Endpoint configuration |
| 2 | Entra ID tenant configured | SE | Tenant configuration |
| 3 | SSO configured and tested | SE | SSO working |
| 3 | MFA policies configured | SE | MFA working |
| 3 | Environment validated | SE | Validation report |
| 4 | User list received | CSM | User list |
| 4 | User list validated | SE | Validation complete |
| 5 | Users created in Entra ID | SE | Users provisioned |
| 5 | MFA enrollment initiated | Users | Enrollment in progress |
| 6 | User access validated | SE | Access confirmed |
| 6 | Welcome emails sent | System | Emails delivered |
| 7 | Week 1 milestone review | CSM | Status report |

#### Week 2: Configuration (Day 8-14)

| Day | Activity | Owner | Deliverable |
|---|---|---|---|
| 8 | Configuration workshop scheduled | CSM | Calendar invite |
| 9 | Configuration workshop conducted | SE + Customer | Configuration |
| 10 | Source system connections configured | SE | Connections active |
| 10 | Target system connections configured | SE | Connections active |
| 11 | Migration profiles created | SE + Customer | Profiles configured |
| 11 | Validation rules configured | SE + Customer | Rules active |
| 12 | Dashboard and reporting configured | CSM | Reports available |
| 12 | Alerting configured | SE | Alerts active |
| 13 | Integrations configured | SE | Integrations active |
| 13 | Customisations implemented | SE | Customisations live |
| 14 | Configuration validated | SE + Customer | Validation report |
| 14 | Week 2 milestone review | CSM | Status report |

#### Week 3: Testing and Validation (Day 15-21)

| Day | Activity | Owner | Deliverable |
|---|---|---|---|
| 15 | User training sessions | CSM | Training completed |
| 16 | First migration created | Customer | Migration project |
| 16 | First validation executed | Customer | Validation report |
| 17 | First report generated | Customer | Report delivered |
| 18 | Integration testing | SE + Customer | Test results |
| 19 | Performance validation | Engineering | Performance report |
| 20 | Security validation | Security | Security report |
| 20 | User feedback collected | CSM | Feedback report |
| 21 | Week 3 milestone review | CSM | Status report |

#### Week 4: Go-Live and Handover (Day 22-30)

| Day | Activity | Owner | Deliverable |
|---|---|---|---|
| 22 | Go-live readiness review | CSM + SE | Readiness report |
| 23 | Production migration started | Customer | Migration in progress |
| 24 | Production validation executed | Customer | Validation report |
| 25 | Production data verified | Customer | Data verified |
| 26 | User adoption review | CSM | Adoption report |
| 27 | Support handover | CSM + Support | Support plan |
| 28 | Onboarding survey sent | CSM | Survey |
| 29 | Onboarding retrospective | CSM + Team | Retrospective notes |
| 30 | Onboarding closure | CSM | Closure email |
| 30 | Customer success plan activated | CSM | Success plan |

### 16.3 Timeline Dependencies

| Dependency | Dependent Activity | Impact if Delayed | Mitigation |
|---|---|---|---|
| Contract signed | All onboarding activities | Cannot start onboarding | Expedite contract process |
| Azure subscription | Environment setup | Blocks all technical setup | Pre-arrange subscription |
| User list | User provisioning | Blocks user access | Send questionnaire early |
| SSO configuration | User login | Blocks first login | Prioritise SSO setup |
| Configuration workshop | Platform configuration | Delays time-to-value | Schedule early |
| Customer availability | Training, testing | Delays adoption | Confirm schedule in advance |

---

## 17. Best Practices

### 17.1 Communication Best Practices

| Practice | Description | Implementation |
|---|---|---|
| **Proactive Updates** | Send status updates before the customer asks | Daily email/Slack during active onboarding |
| **Clear Expectations** | Set clear expectations at every step | Documented in onboarding plan |
| **Single Point of Contact** | Customer always knows who to contact | CSM as primary, SE as technical |
| **Multi-Channel Communication** | Use appropriate channels for different messages | Email for formal, Slack for quick, call for complex |
| **Document Everything** | Record all decisions, agreements, and actions | Shared onboarding workspace |
| **Escalate Early** | Don't wait for issues to become blockers | Escalation matrix always available |
| **Celebrate Milestones** | Acknowledge and celebrate progress | Milestone notifications to customer |

### 17.2 Engagement Best Practices

| Practice | Description | Implementation |
|---|---|---|
| **Executive Sponsorship** | Maintain executive engagement throughout | Monthly executive check-ins |
| **Technical Champions** | Identify and empower technical champions | Champion programme recognition |
| **User Community** | Build user community and peer support | Community forum, user groups |
| **Feedback Loops** | Create regular feedback opportunities | Weekly surveys, retrospectives |
| **Quick Wins** | Focus on early, visible wins | Prioritise high-impact, low-effort items |
| **Training Investment** | Invest in comprehensive user training | Multiple formats, recorded sessions |
| **Success Stories** | Capture and share customer success stories | Case studies, testimonials |

### 17.3 Escalation Best Practices

| Practice | Description | Implementation |
|---|---|---|
| **Defined Escalation Paths** | Clear escalation matrix for all issue types | Documented and communicated |
| **SLA Commitments** | Defined response and resolution SLAs | Published and tracked |
| **Root Cause Analysis** | Investigate and address root causes, not symptoms | Post-incident reviews |
| **Proactive Risk Management** | Identify and mitigate risks before they materialise | Weekly risk reviews |
| **Transparent Communication** | Be transparent about issues and timelines | Regular status updates |
| **Continuous Improvement** | Learn from escalations to prevent recurrence | Process improvement cycles |

### 17.4 Technical Best Practices

| Practice | Description | Implementation |
|---|---|---|
| **Environment Isolation** | Ensure complete isolation between customers | Dedicated resource groups |
| **Security First** | Implement security at every layer | Zero-trust architecture |
| **Automation** | Automate repetitive onboarding tasks | Scripts, templates, tooling |
| **Validation** | Validate every configuration change | Automated testing |
| **Documentation** | Document all technical decisions and configurations | Technical runbooks |
| **Monitoring** | Monitor environment health from day one | Azure Monitor, alerts |
| **Backup and Recovery** | Ensure backup and recovery capabilities | Regular backups, tested restore |

---

## 18. Risk Management

### 18.1 Onboarding Risks

| Risk ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| **R01** | Customer delays providing Azure subscription | Medium | High | Pre-arrange subscription in pre-onboarding | CSM |
| **R02** | SSO configuration takes longer than expected | Medium | High | Have backup authentication method ready | SE |
| **R03** | Customer user list incomplete or incorrect | High | Medium | Send template early, validate before provisioning | CSM |
| **R04** | Configuration workshop delayed | Medium | Medium | Schedule workshops early, have backup dates | CSM |
| **R05** | Integration issues with customer systems | Medium | High | Pre-test integrations in staging environment | SE |
| **R06** | Customer resource constraints | Medium | High | Identify backup contacts, flexible scheduling | CSM |
| **R07** | Security review delays | Low | High | Engage security team early, pre-clear common patterns | Security |
| **R08** | Performance issues in customer environment | Low | High | Monitor from day one, have performance baseline | Engineering |
| **R09** | Customer scope creep during configuration | Medium | Medium | Define clear scope in onboarding plan, change control | CSM |
| **R10** | Low user adoption during onboarding | Medium | High | Training programme, champion engagement, quick wins | CSM |

### 18.2 Risk Review Process

| Step | Activity | Frequency | Owner |
|---|---|---|---|
| 1 | Review risk register | Weekly | CSM |
| 2 | Assess risk probability and impact | Weekly | CSM |
| 3 | Update mitigation actions | As needed | CSM |
| 4 | Escalate high-risk items | Immediate | CSM |
| 5 | Close mitigated risks | Weekly | CSM |
| 6 | Post-onboarding risk review | Once | CSM |

---

## 19. Escalation Procedures

### 19.1 Escalation Matrix

| Level | Trigger | Response Time | Escalation Path |
|---|---|---|---|
| **Level 1** | General question or minor issue | 4 hours | CSM |
| **Level 2** | Issue impacting onboarding timeline | 2 hours | CSM → SE |
| **Level 3** | Issue blocking customer access or functionality | 1 hour | CSM → SE → Engineering Support Manager |
| **Level 4** | Critical issue affecting multiple customers or security | 30 minutes | CSM → SE → ESM → VP of Engineering |
| **Level 5** | Business-critical issue requiring executive intervention | 15 minutes | CSM → SE → ESM → VP of Engineering → CPO |

### 19.2 Escalation Contacts

| Role | Name | Contact | Availability |
|---|---|---|---|
| **Customer Success Manager** | [Assigned CSM] | Email, Slack, Phone | Business hours |
| **Solutions Engineer** | [Assigned SE] | Email, Slack, Phone | Business hours |
| **Engineering Support Manager** | [ESM Name] | Email, Slack, Phone | Business hours + On-call |
| **VP of Engineering** | [VP Name] | Email, Phone | Escalation only |
| **Chief Product Officer** | [CPO Name] | Email, Phone | Executive escalation |

### 19.3 Escalation Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESCALATION PROCESS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Issue identified and logged in support system                │
│           │                                                      │
│           ▼                                                      │
│  2. CSM triages and determines severity                         │
│           │                                                      │
│           ▼                                                      │
│  3. CSM attempts resolution (Level 1)                            │
│           │                                                      │
│           ├── Resolved → Close ticket                            │
│           │                                                      │
│           ▼ Not resolved                                         │
│  4. Escalate to SE (Level 2)                                     │
│           │                                                      │
│           ├── Resolved → Close ticket                            │
│           │                                                      │
│           ▼ Not resolved                                         │
│  5. Escalate to ESM (Level 3)                                    │
│           │                                                      │
│           ├── Resolved → Close ticket                            │
│           │                                                      │
│           ▼ Not resolved                                         │
│  6. Escalate to VP Engineering (Level 4)                         │
│           │                                                      │
│           ├── Resolved → Close ticket                            │
│           │                                                      │
│           ▼ Not resolved                                         │
│  7. Escalate to CPO (Level 5)                                    │
│           │                                                      │
│           └── Resolved → Close ticket                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 20. Dependencies

### 20.1 Batch 08 Architecture Dependencies

| Dependency | Batch 08 Reference | Impact on Onboarding |
|---|---|---|
| **Azure Architecture** | `08_MVP_Technical_Architecture/07_System_Architecture.md` | Defines Azure resource requirements, networking, and deployment patterns for environment setup |
| **API Architecture** | `08_MVP_Technical_Architecture/11_API_Architecture.md` | Defines API patterns and standards for integration configuration |
| **Database Architecture** | `08_MVP_Technical_Architecture/10_Database_Architecture.md` | Defines database schema and data flow for migration configuration |
| **Security Architecture** | `08_MVP_Technical_Architecture/Security/` | Defines identity, access, and security patterns for identity setup |
| **AI Architecture** | `08_MVP_Technical_Architecture/AI/` | Defines AI model deployment for intelligent features configuration |
| **Component Architecture** | `08_MVP_Technical_Architecture/09_Component_Architecture.md` | Defines component interaction patterns for integration setup |
| **Observability Architecture** | `08_MVP_Technical_Architecture/18_Observability_Architecture.md` | Defines monitoring and alerting patterns for environment setup |
| **Environment Architecture** | `08_MVP_Technical_Architecture/03_Environment_Architecture.md` | Defines environment promotion strategy for multi-environment setups |

### 20.2 Batch 10 UX Design Dependencies

| Dependency | Batch 10 Reference | Impact on Onboarding |
|---|---|---|
| **UX Design Principles** | `10_UX_UI_Design_System/01_UX_Design_Principles.md` | Defines user experience patterns for first login and guided tour |
| **Component Library** | `10_UX_UI_Design_System/08_Component_Library.md` | Defines UI components for onboarding screens and forms |
| **Navigation System** | `10_UX_UI_Design_System/03_Navigation_System.md` | Defines navigation patterns for guided tour and first steps |
| **Dashboard Design** | `10_UX_UI_Design_System/07_Dashboard_Design.md` | Defines dashboard layouts for first login experience |
| **Forms Specification** | `10_UX_UI_Design_System/09_Forms_Specification.md` | Defines form patterns for user provisioning and configuration |
| **Screen Catalogue** | `10_UX_UI_Design_System/05_Screen_Catalogue.md` | Defines screen designs for onboarding workflows |
| **Responsive Design** | `10_UX_UI_Design_System/10_Responsive_Design.md` | Defines responsive patterns for mobile onboarding |
| **Accessibility** | `10_UX_UI_Design_System/11_Accessibility.md` | Defines accessibility requirements for onboarding screens |

### 20.3 Internal Dependencies

| Dependency | Owner | Impact |
|---|---|---|
| **Document 01: Pilot Strategy** | CSM | Defines onboarding objectives and success criteria |
| **Document 02: Customer Selection** | CSM | Defines customer profile and requirements |
| **Document 03: Pilot Readiness Checklist** | SE | Defines technical readiness requirements |
| **Customer Contract** | Sales | Defines scope, timeline, and commercial terms |
| **Customer IT Team** | Customer | Provides Azure subscription, user access, and support |
| **Customer Security Team** | Customer | Approves identity, access, and security configuration |

---

## 21. Approval

### 21.1 Document Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| **Author** | MAP Strategy & Operations | _________________ | ____/____/2026 |
| **Reviewer** | VP of Product | _________________ | ____/____/2026 |
| **Reviewer** | Director of Engineering | _________________ | ____/____/2026 |
| **Reviewer** | Head of Customer Success | _________________ | ____/____/2026 |
| **Approver** | Chief Product Officer | _________________ | ____/____/2026 |

### 21.2 Document Control

| Item | Detail |
|---|---|
| **Document ID** | MAP-PILOT-ONB-004 |
| **Version** | 1.0 |
| **Status** | Official |
| **Classification** | Confidential – Internal Use Only |
| **Storage Location** | MAP Document Repository |
| **Review Cycle** | Quarterly or upon significant process change |
| **Next Review Date** | October 2026 |

### 21.3 Distribution

| Recipient | Distribution Method | Purpose |
|---|---|---|
| MAP Product & Delivery Team | Document Repository | Reference and execution |
| MAP Customer Success Team | Document Repository | Customer onboarding |
| MAP Engineering Team | Document Repository | Environment and technical setup |
| MAP Security Team | Document Repository | Identity and access setup |
| MAP Executive Team | Email | Awareness and oversight |

---

## Appendix A: Onboarding Metrics Dashboard

### A.1 Key Performance Indicators

| KPI | Target | Measurement | Frequency |
|---|---|---|---|
| **Time to First Value** | ≤ 5 business days | Days from kick-off to first validation run | Per customer |
| **Onboarding Completion Time** | ≤ 30 calendar days | Days from contract to onboarding complete | Per customer |
| **Customer Satisfaction (CSAT)** | ≥ 4.5 / 5.0 | Post-onboarding survey score | Per customer |
| **Net Promoter Score (NPS)** | ≥ 50 | Post-onboarding NPS survey | Per customer |
| **First Login Rate** | 100% within 48 hours | % of users logging in within 48 hours | Per customer |
| **User Adoption Rate** | ≥ 70% within 30 days | % of provisioned users active within 30 days | Per customer |
| **Support Ticket Volume** | ≤ 3 during onboarding | Number of support tickets during onboarding | Per customer |
| **Escalation Rate** | ≤ 1 during onboarding | Number of escalations during onboarding | Per customer |
| **Configuration Completion** | ≥ 95% within 14 days | % of configuration items completed within 14 days | Per customer |
| **Training Completion** | ≥ 90% within 21 days | % of required training completed within 21 days | Per customer |

### A.2 Onboarding Health Score

| Component | Weight | Scoring Criteria |
|---|---|---|
| **Timeline Adherence** | 25% | On track = 100, 1-3 days late = 75, 4-7 days late = 50, >7 days late = 25 |
| **Milestone Achievement** | 25% | All achieved = 100, Most achieved = 75, Some achieved = 50, Few achieved = 25 |
| **Customer Engagement** | 20% | High = 100, Medium = 75, Low = 50, Disengaged = 25 |
| **Technical Readiness** | 15% | All ready = 100, Mostly ready = 75, Partially ready = 50, Not ready = 25 |
| **Risk Profile** | 15% | No risks = 100, Low risks = 75, Medium risks = 50, High risks = 25 |

### A.3 Health Score Interpretation

| Score Range | Status | Action |
|---|---|---|
| **90-100** | Healthy | Continue current approach |
| **75-89** | Minor Issues | Address specific concerns |
| **50-74** | At Risk | Escalate and create remediation plan |
| **25-49** | Critical | Immediate escalation and intervention |
| **0-24** | Failing | Executive intervention required |

---

## Appendix B: Templates and Resources

### B.1 Welcome Email Template

```
Subject: Welcome to MAP – Your Migration Assurance Platform Journey Begins

Dear [Customer First Name],

Welcome to MAP – the Migration Assurance Platform! We are thrilled to have [Company Name] join the MAP community.

Your dedicated Customer Success Manager is [CSM Name], who will be your primary point of contact throughout your onboarding journey and beyond. [CSM Name] can be reached at [CSM Email] or [CSM Phone].

Here's what to expect in the coming weeks:

WEEK 1: Environment Setup & Identity Configuration
- Your Azure environment will be provisioned and configured
- Single sign-on (SSO) and multi-factor authentication (MFA) will be set up
- Your team members will be provisioned with access

WEEK 2: Platform Configuration
- We'll conduct a configuration workshop to tailor MAP to your needs
- Source and target system connections will be configured
- Migration profiles and validation rules will be set up

WEEK 3: Testing & Validation
- Your team will complete training sessions
- You'll create and execute your first migration
- We'll validate everything is working correctly

WEEK 4: Go-Live & Handover
- Production migration will begin
- Support handover will be completed
- You'll be fully self-sufficient on the platform

To get started, please complete the pre-kickoff questionnaire at [Link]. This helps us prepare for your kick-off meeting on [Date].

As a welcome gift, we've sent you a MAP welcome package – keep an eye out for it in the post!

If you have any questions, please don't hesitate to reach out to [CSM Name] at [CSM Email].

We're excited to help you transform your migration assurance!

Best regards,

The MAP Team
```

### B.2 Pre-Kickoff Questionnaire Template

| Section | Questions |
|---|---|
| **Organisation** | Company name, industry, size, primary contact name, email, phone |
| **Technical Environment** | Current infrastructure, cloud provider, Azure subscription ID, Azure region |
| **Identity** | Identity provider, verified domain, estimated user count, existing SSO |
| **Migration Context** | Current migration tools, primary pain points, migration goals, timeline |
| **Stakeholders** | Executive sponsor (name, email), project manager (name, email), technical lead (name, email), security contact (name, email) |
| **Success Criteria** | Definition of success, key metrics, first value target |
| **Constraints** | Budget constraints, timeline constraints, resource constraints, compliance requirements |

### B.3 Kick-Off Meeting Agenda Template

| Time | Section | Activity | Owner |
|---|---|---|---|
| 0:00-0:10 | Opening | Welcome, introductions, meeting objectives | CSM |
| 0:10-0:20 | Executive Alignment | Strategic goals, success criteria, commitment | Executive Sponsor |
| 0:20-0:35 | Customer Context | Current state, migration goals, pain points | Customer Technical Lead |
| 0:35-0:50 | MAP Overview | Platform capabilities, architecture, value proposition | SE |
| 0:50-1:05 | Onboarding Plan | Timeline, phases, milestones, responsibilities | CSM |
| 1:05-1:15 | Technical Requirements | Environment, identity, integration, security | SE + Security |
| 1:15-1:25 | Risks and Dependencies | Identification, mitigation, escalation | CSM |
| 1:25-1:30 | Next Steps | Action items, ownership, deadlines | CSM |

### B.4 User List Template

| firstName | lastName | email | department | role | employeeId | manager | startDate |
|---|---|---|---|---|---|---|---|
| John | Smith | john.smith@acme.com | IT | Platform Admin | EMP001 | jane.doe@acme.com | 2026-07-15 |
| Jane | Doe | jane.doe@acme.com | Migration | Migration Manager | EMP002 | john.smith@acme.com | 2026-07-15 |
| Bob | Wilson | bob.wilson@acme.com | QA | Validation Engineer | EMP003 | jane.doe@acme.com | 2026-07-15 |
| Alice | Brown | alice.brown@acme.com | Analytics | Data Analyst | EMP004 | john.smith@acme.com | 2026-07-15 |

### B.5 Onboarding Survey Template

| Question | Type | Scale |
|---|---|---|
| Overall, how satisfied are you with the MAP onboarding experience? | Rating | 1-5 |
| How would you rate the clarity of the onboarding process? | Rating | 1-5 |
| How responsive was your Customer Success Manager? | Rating | 1-5 |
| How well did the onboarding meet your expectations? | Rating | 1-5 |
| How confident do you feel using MAP? | Rating | 1-5 |
| What was the most valuable part of the onboarding? | Open | Text |
| What could we improve about the onboarding process? | Open | Text |
| Would you recommend MAP to a colleague? (NPS) | Rating | 0-10 |

---

## Appendix C: Glossary of Azure Resources

| Resource | Purpose | MAP Usage |
|---|---|---|
| **Azure Resource Group** | Logical container for resources | Isolate customer environment |
| **Azure Virtual Network** | Network isolation and connectivity | Customer environment networking |
| **Azure Key Vault** | Secrets and key management | Store connection strings, credentials |
| **Azure Monitor** | Monitoring and alerting | Environment health monitoring |
| **Log Analytics Workspace** | Centralised log storage | Application and audit logs |
| **Azure Private Endpoint** | Secure service access | Private connectivity to services |
| **Azure DNS** | Domain name resolution | Custom domain resolution |
| **Azure Storage Account** | Data storage | Migration data, reports, artifacts |
| **Azure App Service** | Web application hosting | MAP application deployment |
| **Azure SQL Database** | Relational database | MAP application database |
| **Azure Cosmos DB** | NoSQL database | MAP telemetry and analytics |
| **Azure Front Door** | Global load balancing | Traffic routing and CDN |

---

*End of Document*

*Document ID: MAP-PILOT-ONB-004 | Version 1.0 | July 2026 | Official*
