# MAP Pilot Readiness Checklist

| Field | Value |
|---|---|
| **Document Title** | MAP (Migration Assurance Platform) Pilot Readiness Checklist |
| **Document ID** | MAP-PILOT-CHECK-003 |
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
| 0.2 | June 2026 | MAP Strategy & Operations | Added infrastructure and support sections |
| 0.3 | June 2026 | MAP Strategy & Operations | Incorporated stakeholder feedback |
| 1.0 | July 2026 | MAP Strategy & Operations | Official release |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Definitions and Abbreviations](#3-definitions-and-abbreviations)
4. [References](#4-references)
5. [Readiness Overview](#5-readiness-overview)
6. [Technical Readiness](#6-technical-readiness)
7. [Product Readiness](#7-product-readiness)
8. [Documentation Readiness](#8-documentation-readiness)
9. [Infrastructure Readiness](#9-infrastructure-readiness)
10. [Support Readiness](#10-support-readiness)
11. [Training Readiness](#11-training-readiness)
12. [Security Readiness](#12-security-readiness)
13. [Go-Live Readiness](#13-go-live-readiness)
14. [Readiness Assessment Process](#14-readiness-assessment-process)
15. [Readiness Sign-Off](#15-readiness-sign-off)
16. [Dependencies](#16-dependencies)
17. [Approval](#17-approval)

---

## 1. Purpose

This document provides a comprehensive readiness checklist for the MAP (Migration Assurance Platform) pilot deployment. It serves as the definitive guide for ensuring all prerequisites are met before a pilot customer is onboarded. The checklist covers eight critical readiness dimensions: Technical, Product, Documentation, Infrastructure, Support, Training, Security, and Go-Live.

The purpose of this checklist is to:

- Ensure all readiness requirements are identified and tracked
- Provide a standardised assessment process for pilot readiness
- Reduce the risk of pilot failure due to unpreparedness
- Establish clear ownership and accountability for readiness items
- Create a repeatable process for future pilot deployments
- Provide a go/no-go decision framework for pilot launch

This checklist should be completed for each pilot customer before the pilot kickoff meeting. All items must be marked as complete or have an approved exception before the pilot can proceed.

---

## 2. Scope

This document covers:

- Technical readiness assessment (infrastructure, security, integration)
- Product readiness assessment (features, stability, performance)
- Documentation readiness assessment (guides, runbooks, training materials)
- Infrastructure readiness assessment (Azure resources, networking, monitoring)
- Support readiness assessment (SLAs, escalation, coverage)
- Training readiness assessment (materials, schedule, access)
- Security readiness assessment (compliance, access control, audit)
- Go-live readiness assessment (validation, communication, rollback)
- Readiness assessment process and sign-off procedures

This document does not cover:

- Pilot strategy and timeline (covered in Document 01: Pilot Strategy)
- Customer selection criteria (covered in Document 02: Customer Selection)
- Post-pilot engagement planning
- Commercial or contract terms

---

## 3. Definitions and Abbreviations

| Term | Definition |
|---|---|
| MAP | Migration Assurance Platform |
| SLA | Service Level Agreement |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| UAT | User Acceptance Testing |
| E2E | End-to-End |
| IaC | Infrastructure as Code |
| SSO | Single Sign-On |
| RBAC | Role-Based Access Control |
| MFA | Multi-Factor Authentication |
| NDA | Non-Disclosure Agreement |
| CSM | Customer Success Manager |
| SE | Solutions Engineer |
| DevOps | Development Operations |
| P1/P2/P3 | Priority levels (P1 = Critical, P2 = High, P3 = Medium) |
| RAG | Red/Amber/Green status indicator |
| WBS | Work Breakdown Structure |

---

## 4. References

| Reference | Description |
|---|---|
| MAP Product Requirements Document (PRD) | Defines MAP product features and capabilities |
| MAP Technical Architecture Document | Describes the technical architecture and infrastructure |
| MAP Security & Compliance Framework | Outlines security controls and compliance requirements |
| MAP Pilot Strategy (Document 01) | Defines pilot objectives, timeline, and success criteria |
| MAP Customer Selection Guide (Document 02) | Defines customer selection criteria |
| MAP Integration Architecture | Describes API and integration patterns |
| MAP Support Runbook | Defines support processes and procedures |
| MAP Deployment Guide | Step-by-step deployment instructions |
| Azure Well-Architected Framework | Microsoft Azure best practices |

---

## 5. Readiness Overview

### 5.1 Readiness Dimensions

| Dimension | Description | Critical Items | Total Items |
|---|---|---|---|
| **Technical Readiness** | Infrastructure, security, integration, and platform technical requirements | 15 | 35 |
| **Product Readiness** | Feature completeness, stability, and performance requirements | 12 | 28 |
| **Documentation Readiness** | User guides, runbooks, training materials, and knowledge base | 10 | 25 |
| **Infrastructure Readiness** | Azure resources, networking, monitoring, and operations | 14 | 32 |
| **Support Readiness** | SLAs, escalation procedures, coverage, and tooling | 11 | 24 |
| **Training Readiness** | Training materials, schedule, access, and certification | 8 | 18 |
| **Security Readiness** | Compliance, access control, audit, and incident response | 13 | 30 |
| **Go-Live Readiness** | Validation, communication, rollback, and launch activities | 12 | 28 |
| **Total** | | **95** | **220** |

### 5.2 Readiness Status Definitions

| Status | Definition | Action Required |
|---|---|---|
| **Complete** | Item is fully ready; no further action needed | None |
| **In Progress** | Item is being worked on; on track for completion | Monitor progress |
| **At Risk** | Item is behind schedule or has blockers | Escalate and resolve |
| **Not Started** | Item has not been started | Begin immediately |
| **Exception** | Item has been reviewed and exception approved | Document exception and proceed |
| **N/A** | Item is not applicable to this pilot | Document rationale |

### 5.3 Readiness Thresholds

| Threshold | Criteria | Go/No-Go Decision |
|---|---|---|
| **Green** | ≥ 95% of critical items complete; ≥ 85% of all items complete | **Go** – Proceed with pilot |
| **Amber** | ≥ 80% of critical items complete; ≥ 70% of all items complete | **Conditional Go** – Proceed with mitigation plan |
| **Red** | < 80% of critical items complete or < 70% of all items complete | **No-Go** – Delay pilot until threshold met |

---

## 6. Technical Readiness

### 6.1 Infrastructure Technical Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-01 | Azure subscription provisioned | Customer Azure subscription is active and available | DevOps | ☐ | |
| T-02 | Resource groups created | Required Azure resource groups are created | DevOps | ☐ | |
| T-03 | Virtual machines provisioned | Required VMs for MAP are provisioned and configured | DevOps | ☐ | |
| T-04 | Storage accounts configured | Azure storage accounts are configured and accessible | DevOps | ☐ | |
| T-05 | Database provisioned | Azure SQL/Cosmos DB is provisioned and configured | DevOps | ☐ | |
| T-06 | App Service configured | Azure App Service is configured for MAP web application | DevOps | ☐ | |
| T-07 | Azure Functions deployed | Required Azure Functions are deployed and operational | DevOps | ☐ | |
| T-08 | Azure Key Vault configured | Key Vault is configured for secrets management | DevOps | ☐ | |
| T-09 | Azure Monitor configured | Monitoring and alerting are configured | DevOps | ☐ | |
| T-10 | Azure Log Analytics configured | Log Analytics workspace is configured | DevOps | ☐ | |

### 6.2 Security Technical Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-11 | Network Security Groups configured | NSGs are configured with appropriate rules | Security | ☐ | |
| T-12 | Azure Firewall configured | Firewall rules are configured for MAP traffic | Security | ☐ | |
| T-13 | SSL/TLS certificates configured | SSL/TLS certificates are installed and valid | Security | ☐ | |
| T-14 | Azure AD integration configured | Azure AD integration is configured for authentication | Security | ☐ | |
| T-15 | MFA configured | Multi-factor authentication is configured | Security | ☐ | |

### 6.3 Integration Technical Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-16 | Azure Resource Graph API connected | MAP can query Azure Resource Graph | SE | ☐ | |
| T-17 | Azure Activity Log connected | MAP can ingest Azure Activity Logs | SE | ☐ | |
| T-18 | Azure Policy API connected | MAP can query Azure Policy | SE | ☐ | |
| T-19 | Azure Cost Management API connected | MAP can query cost data | SE | ☐ | |
| T-20 | Azure Monitor API connected | MAP can query monitoring data | SE | ☐ | |
| T-21 | Customer data source connected | Customer-specific data sources are connected | SE | ☐ | |
| T-22 | Webhook endpoints configured | Webhook endpoints are configured and tested | SE | ☐ | |
| T-23 | API rate limits configured | API rate limits are configured appropriately | DevOps | ☐ | |
| T-24 | Integration testing complete | All integrations have been tested end-to-end | SE | ☐ | |
| T-25 | Error handling validated | Integration error handling is validated | SE | ☐ | |

### 6.4 Platform Technical Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-26 | Application deployed | MAP application is deployed and operational | DevOps | ☐ | |
| T-27 | Configuration validated | Application configuration is validated | DevOps | ☐ | |
| T-28 | Health checks passing | All health checks are passing | DevOps | ☐ | |
| T-29 | Logging configured | Application logging is configured and operational | DevOps | ☐ | |
| T-30 | Backup configured | Data backup is configured and tested | DevOps | ☐ | |
| T-31 | DR configured | Disaster recovery is configured (if required) | DevOps | ☐ | |
| T-32 | Performance baseline established | Performance baseline is documented | DevOps | ☐ | |
| T-33 | Scalability validated | Scalability has been validated | DevOps | ☐ | |
| T-34 | Version control verified | Application version is correct for pilot | DevOps | ☐ | |
| T-35 | Rollback procedure documented | Rollback procedure is documented and tested | DevOps | ☐ | |

### 6.5 Technical Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| Infrastructure | 10 | ___ | ___ | ___ | ___ | ___% |
| Security | 5 | ___ | ___ | ___ | ___ | ___% |
| Integration | 10 | ___ | ___ | ___ | ___ | ___% |
| Platform | 10 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **35** | ___ | ___ | ___ | ___ | ___% |

---

## 7. Product Readiness

### 7.1 Feature Completeness

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| P-01 | Core migration validation features | All core migration validation features are operational | Product | ☐ | |
| P-02 | Azure resource discovery | Azure resource discovery feature is operational | Product | ☐ | |
| P-03 | Migration scenario analysis | Migration scenario analysis feature is operational | Product | ☐ | |
| P-04 | Risk assessment engine | Risk assessment engine is operational | Product | ☐ | |
| P-05 | Compliance validation | Compliance validation feature is operational | Product | ☐ | |
| P-06 | Cost estimation | Cost estimation feature is operational | Product | ☐ | |
| P-07 | Reporting and dashboards | Reporting and dashboard features are operational | Product | ☐ | |
| P-08 | Data export capabilities | Data export features are operational | Product | ☐ | |
| P-09 | User management | User management features are operational | Product | ☐ | |
| P-10 | Audit logging | Audit logging feature is operational | Product | ☐ | |

### 7.2 Platform Stability

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| P-11 | Zero critical bugs | No critical bugs in the pilot feature set | QA | ☐ | |
| P-12 | Zero high-severity bugs | No high-severity bugs in the pilot feature set | QA | ☐ | |
| P-13 | Known issues documented | All known issues are documented with workarounds | QA | ☐ | |
| P-14 | Regression testing complete | Regression testing has been completed | QA | ☐ | |
| P-15 | Integration testing complete | Integration testing has been completed | QA | ☐ | |
| P-16 | User acceptance testing complete | UAT has been completed with positive results | QA | ☐ | |
| P-17 | Performance testing complete | Performance testing has been completed | QA | ☐ | |
| P-18 | Security testing complete | Security testing has been completed | QA | ☐ | |

### 7.3 Performance Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| P-19 | Response time SLA met | Page load times ≤ 3 seconds | DevOps | ☐ | |
| P-20 | API response time SLA met | API response times ≤ 500ms (95th percentile) | DevOps | ☐ | |
| P-21 | Concurrent user capacity | Supports ≥ 50 concurrent users | DevOps | ☐ | |
| P-22 | Data processing capacity | Handles ≥ 100,000 resources | DevOps | ☐ | |
| P-23 | Uptime SLA met | Platform uptime ≥ 99.5% | DevOps | ☐ | |
| P-24 | Error rate within threshold | Error rate ≤ 0.1% | DevOps | ☐ | |
| P-25 | Memory usage within threshold | Memory usage ≤ 80% under normal load | DevOps | ☐ | |
| P-26 | CPU usage within threshold | CPU usage ≤ 70% under normal load | DevOps | ☐ | |
| P-27 | Storage usage within threshold | Storage usage ≤ 70% capacity | DevOps | ☐ | |
| P-28 | Network throughput within threshold | Network throughput meets requirements | DevOps | ☐ | |

### 7.4 Product Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| Feature Completeness | 10 | ___ | ___ | ___ | ___ | ___% |
| Platform Stability | 8 | ___ | ___ | ___ | ___ | ___% |
| Performance | 10 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **28** | ___ | ___ | ___ | ___ | ___% |

---

## 8. Documentation Readiness

### 8.1 User Documentation

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| D-01 | User Guide | Comprehensive user guide is complete and reviewed | Documentation | ☐ | |
| D-02 | Quick Start Guide | Quick start guide is complete and reviewed | Documentation | ☐ | |
| D-03 | Feature Documentation | Individual feature documentation is complete | Documentation | ☐ | |
| D-04 | FAQ Document | Frequently asked questions document is complete | Documentation | ☐ | |
| D-05 | Glossary | Glossary of terms is complete | Documentation | ☐ | |

### 8.2 Technical Documentation

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| D-06 | Deployment Guide | Step-by-step deployment guide is complete | Documentation | ☐ | |
| D-07 | Configuration Guide | Configuration guide is complete | Documentation | ☐ | |
| D-08 | Integration Guide | Integration guide is complete | Documentation | ☐ | |
| D-09 | API Documentation | API documentation is complete and accurate | Documentation | ☐ | |
| D-10 | Troubleshooting Guide | Troubleshooting guide is complete | Documentation | ☐ | |

### 8.3 Operations Documentation

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| D-11 | Operations Runbook | Operations runbook is complete and tested | DevOps | ☐ | |
| D-12 | Monitoring Runbook | Monitoring runbook is complete | DevOps | ☐ | |
| D-13 | Incident Response Runbook | Incident response runbook is complete | DevOps | ☐ | |
| D-14 | Backup/Restore Runbook | Backup and restore runbook is complete | DevOps | ☐ | |
| D-15 | Scaling Runbook | Scaling runbook is complete (if applicable) | DevOps | ☐ | |

### 8.4 Support Documentation

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| D-16 | Support Runbook | Support runbook is complete | Support | ☐ | |
| D-17 | Escalation Matrix | Escalation matrix is documented | Support | ☐ | |
| D-18 | Known Issues Register | Known issues register is maintained | Support | ☐ | |
| D-19 | Workaround Documentation | Workarounds for known issues are documented | Support | ☐ | |
| D-20 | Contact Directory | Support contact directory is complete | Support | ☐ | |

### 8.5 Knowledge Base

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| D-21 | Knowledge Base Articles | Core knowledge base articles are published | Documentation | ☐ | |
| D-22 | Best Practices Guide | Best practices guide is complete | Documentation | ☐ | |
| D-23 | Migration Patterns Guide | Migration patterns guide is complete | Documentation | ☐ | |
| D-24 | Compliance Guide | Compliance guide is complete | Documentation | ☐ | |
| D-25 | Release Notes | Release notes for pilot version are complete | Documentation | ☐ | |

### 8.6 Documentation Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| User Documentation | 5 | ___ | ___ | ___ | ___ | ___% |
| Technical Documentation | 5 | ___ | ___ | ___ | ___ | ___% |
| Operations Documentation | 5 | ___ | ___ | ___ | ___ | ___% |
| Support Documentation | 5 | ___ | ___ | ___ | ___ | ___% |
| Knowledge Base | 5 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **25** | ___ | ___ | ___ | ___ | ___% |

---

## 9. Infrastructure Readiness

### 9.1 Azure Resource Provisioning

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| I-01 | Azure subscription active | Azure subscription is active and in good standing | DevOps | ☐ | |
| I-02 | Resource groups created | Required resource groups are created | DevOps | ☐ | |
| I-03 | Naming conventions applied | Azure naming conventions are applied | DevOps | ☐ | |
| I-04 | Tagging strategy applied | Azure tagging strategy is applied | DevOps | ☐ | |
| I-05 | Cost alerts configured | Azure cost alerts are configured | DevOps | ☐ | |
| I-06 | Budget limits set | Azure budget limits are set | DevOps | ☐ | |

### 9.2 Compute Resources

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| I-07 | VMs provisioned | Required VMs are provisioned | DevOps | ☐ | |
| I-08 | VMs configured | VMs are configured per specifications | DevOps | ☐ | |
| I-09 | VMs tested | VMs are tested and operational | DevOps | ☐ | |
| I-10 | Auto-scaling configured | Auto-scaling rules are configured (if applicable) | DevOps | ☐ | |
| I-11 | VM backup configured | VM backup is configured | DevOps | ☐ | |

### 9.3 Networking

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| I-12 | Virtual network configured | Azure VNet is configured | DevOps | ☐ | |
| I-13 | Subnets configured | Required subnets are configured | DevOps | ☐ | |
| I-14 | NSG rules configured | Network Security Group rules are configured | DevOps | ☐ | |
| I-15 | DNS configured | DNS is configured for MAP services | DevOps | ☐ | |
| I-16 | Load balancer configured | Load balancer is configured (if applicable) | DevOps | ☐ | |
| I-17 | ExpressRoute/VPN configured | ExpressRoute or VPN is configured (if applicable) | DevOps | ☐ | |
| I-18 | Network connectivity tested | Network connectivity is tested end-to-end | DevOps | ☐ | |

### 9.4 Storage and Data

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| I-19 | Storage accounts created | Azure storage accounts are created | DevOps | ☐ | |
| I-20 | Storage configured | Storage is configured per specifications | DevOps | ☐ | |
| I-21 | Database provisioned | Azure SQL/Cosmos DB is provisioned | DevOps | ☐ | |
| I-22 | Database configured | Database is configured and optimised | DevOps | ☐ | |
| I-23 | Database backup configured | Database backup is configured | DevOps | ☐ | |
| I-24 | Database connectivity tested | Database connectivity is tested | DevOps | ☐ | |

### 9.5 Monitoring and Operations

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| I-25 | Azure Monitor configured | Azure Monitor is configured | DevOps | ☐ | |
| I-26 | Log Analytics configured | Log Analytics workspace is configured | DevOps | ☐ | |
| I-27 | Alerts configured | Alert rules are configured | DevOps | ☐ | |
| I-28 | Dashboards configured | Monitoring dashboards are configured | DevOps | ☐ | |
| I-29 | Backup monitoring configured | Backup monitoring is configured | DevOps | ☐ | |
| I-30 | Cost monitoring configured | Cost monitoring is configured | DevOps | ☐ | |
| I-31 | Performance monitoring configured | Performance monitoring is configured | DevOps | ☐ | |
| I-32 | Health monitoring configured | Health monitoring is configured | DevOps | ☐ | |

### 9.6 Infrastructure Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| Azure Resources | 6 | ___ | ___ | ___ | ___ | ___% |
| Compute | 5 | ___ | ___ | ___ | ___ | ___% |
| Networking | 7 | ___ | ___ | ___ | ___ | ___% |
| Storage and Data | 6 | ___ | ___ | ___ | ___ | ___% |
| Monitoring | 8 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **32** | ___ | ___ | ___ | ___ | ___% |

---

## 10. Support Readiness

### 10.1 Support SLA Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| S-01 | SLA document finalised | Support SLA document is finalised and agreed | Support | ☐ | |
| S-02 | Response time targets defined | P1/P2/P3 response time targets are defined | Support | ☐ | |
| S-03 | Resolution time targets defined | P1/P2/P3 resolution time targets are defined | Support | ☐ | |
| S-04 | SLA monitoring configured | SLA monitoring is configured | Support | ☐ | |
| S-05 | SLA reporting configured | SLA reporting is configured | Support | ☐ | |

### 10.2 Escalation Procedures

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| S-06 | Escalation matrix documented | Escalation matrix is documented | Support | ☐ | |
| S-07 | Escalation contacts verified | All escalation contacts are verified | Support | ☐ | |
| S-08 | Escalation procedures tested | Escalation procedures are tested | Support | ☐ | |
| S-09 | Escalation tooling configured | Escalation tooling is configured | Support | ☐ | |
| S-10 | After-hours procedures documented | After-hours support procedures are documented | Support | ☐ | |

### 10.3 Support Coverage

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| S-11 | Support hours defined | Support hours are defined and communicated | Support | ☐ | |
| S-12 | Support team assigned | Support team members are assigned | Support | ☐ | |
| S-13 | Support training complete | Support team training is complete | Support | ☐ | |
| S-14 | Support tooling configured | Support tooling (ticketing, chat) is configured | Support | ☐ | |
| S-15 | Support knowledge base complete | Support knowledge base is complete | Support | ☐ | |
| S-16 | Support runbook complete | Support runbook is complete | Support | ☐ | |

### 10.4 Support Tooling

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| S-17 | Ticketing system configured | Ticketing system is configured for pilot | Support | ☐ | |
| S-18 | Chat/messaging configured | Chat/messaging tooling is configured | Support | ☐ | |
| S-19 | Remote access configured | Remote access tooling is configured | Support | ☐ | |
| S-20 | Screen sharing configured | Screen sharing tooling is configured | Support | ☐ | |
| S-21 | Knowledge base tooling configured | Knowledge base tooling is configured | Support | ☐ | |
| S-22 | Monitoring access configured | Support team has access to monitoring dashboards | Support | ☐ | |
| S-23 | Log access configured | Support team has access to application logs | Support | ☐ | |
| S-24 | Database access configured | Support team has access to database (read-only) | Support | ☐ | |

### 10.5 Support Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| SLA Requirements | 5 | ___ | ___ | ___ | ___ | ___% |
| Escalation Procedures | 5 | ___ | ___ | ___ | ___ | ___% |
| Support Coverage | 6 | ___ | ___ | ___ | ___ | ___% |
| Support Tooling | 8 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **24** | ___ | ___ | ___ | ___ | ___% |

---

## 11. Training Readiness

### 11.1 Training Materials

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-01 | User training curriculum | User training curriculum is defined | Training | ☐ | |
| T-02 | Admin training curriculum | Admin training curriculum is defined | Training | ☐ | |
| T-03 | Technical training curriculum | Technical training curriculum is defined | Training | ☐ | |
| T-04 | Training presentations | Training presentations are complete | Training | ☐ | |
| T-05 | Training exercises | Training exercises are complete | Training | ☐ | |
| T-06 | Training assessments | Training assessments are complete | Training | ☐ | |
| T-07 | Training videos | Training videos are recorded (if applicable) | Training | ☐ | |
| T-08 | Training handouts | Training handouts are complete | Training | ☐ | |

### 11.2 Training Schedule

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-09 | Training schedule defined | Training schedule is defined and agreed with customer | CSM | ☐ | |
| T-10 | Training sessions booked | Training sessions are booked | CSM | ☐ | |
| T-11 | Training environment ready | Training environment is ready | DevOps | ☐ | |
| T-12 | Training materials distributed | Training materials are distributed to participants | CSM | ☐ | |

### 11.3 Training Access

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-13 | Training environment provisioned | Training environment is provisioned | DevOps | ☐ | |
| T-14 | Training data loaded | Training data is loaded | SE | ☐ | |
| T-15 | Training accounts created | Training accounts are created | DevOps | ☐ | |
| T-16 | Training access verified | Training access is verified | SE | ☐ | |

### 11.4 Training Certification

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| T-17 | Certification criteria defined | Certification criteria are defined | Training | ☐ | |
| T-18 | Certification process documented | Certification process is documented | Training | ☐ | |

### 11.5 Training Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| Training Materials | 8 | ___ | ___ | ___ | ___ | ___% |
| Training Schedule | 4 | ___ | ___ | ___ | ___ | ___% |
| Training Access | 4 | ___ | ___ | ___ | ___ | ___% |
| Training Certification | 2 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **18** | ___ | ___ | ___ | ___ | ___% |

---

## 12. Security Readiness

### 12.1 Compliance Requirements

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| SEC-01 | Security review completed | Security architecture review is completed | Security | ☐ | |
| SEC-02 | Penetration testing completed | Penetration testing is completed (if required) | Security | ☐ | |
| SEC-03 | Vulnerability assessment completed | Vulnerability assessment is completed | Security | ☐ | |
| SEC-04 | Compliance checklist completed | Compliance checklist (FCA, GDPR, etc.) is completed | Security | ☐ | |
| SEC-05 | Data protection impact completed | Data Protection Impact Assessment is completed | Security | ☐ | |
| SEC-06 | Security sign-off obtained | Security team sign-off is obtained | Security | ☐ | |

### 12.2 Access Control

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| SEC-07 | SSO configured | Single Sign-On is configured | Security | ☐ | |
| SEC-08 | MFA enabled | Multi-Factor Authentication is enabled | Security | ☐ | |
| SEC-09 | RBAC configured | Role-Based Access Control is configured | Security | ☐ | |
| SEC-10 | Service accounts configured | Service accounts are configured | Security | ☐ | |
| SEC-11 | API keys managed | API keys are managed via Key Vault | Security | ☐ | |
| SEC-12 | Access reviews scheduled | Access reviews are scheduled | Security | ☐ | |

### 12.3 Data Security

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| SEC-13 | Encryption at rest configured | Data encryption at rest is configured | Security | ☐ | |
| SEC-14 | Encryption in transit configured | Data encryption in transit is configured | Security | ☐ | |
| SEC-15 | Key management configured | Key management is configured | Security | ☐ | |
| SEC-16 | Data classification applied | Data classification is applied | Security | ☐ | |
| SEC-17 | Data residency confirmed | Data residency requirements are met | Security | ☐ | |
| SEC-18 | Data retention configured | Data retention policies are configured | Security | ☐ | |

### 12.4 Audit and Monitoring

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| SEC-19 | Audit logging configured | Audit logging is configured | Security | ☐ | |
| SEC-20 | Security monitoring configured | Security monitoring is configured | Security | ☐ | |
| SEC-21 | Alert rules configured | Security alert rules are configured | Security | ☐ | |
| SEC-22 | Incident response plan documented | Incident response plan is documented | Security | ☐ | |
| SEC-23 | Incident response tested | Incident response procedures are tested | Security | ☐ | |
| SEC-24 | Security training complete | Security training for team is complete | Security | ☐ | |

### 12.5 Network Security

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| SEC-25 | Firewall rules configured | Firewall rules are configured | Security | ☐ | |
| SEC-26 | WAF configured | Web Application Firewall is configured | Security | ☐ | |
| SEC-27 | DDoS protection enabled | DDoS protection is enabled | Security | ☐ | |
| SEC-28 | Network segmentation configured | Network segmentation is configured | Security | ☐ | |
| SEC-29 | Private endpoints configured | Private endpoints are configured (if applicable) | Security | ☐ | |
| SEC-30 | Network traffic monitoring configured | Network traffic monitoring is configured | Security | ☐ | |

### 12.6 Security Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| Compliance | 6 | ___ | ___ | ___ | ___ | ___% |
| Access Control | 6 | ___ | ___ | ___ | ___ | ___% |
| Data Security | 6 | ___ | ___ | ___ | ___ | ___% |
| Audit and Monitoring | 6 | ___ | ___ | ___ | ___ | ___% |
| Network Security | 6 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **30** | ___ | ___ | ___ | ___ | ___% |

---

## 13. Go-Live Readiness

### 13.1 Pre-Launch Validation

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| GL-01 | End-to-end testing complete | E2E testing is complete and passed | QA | ☐ | |
| GL-02 | User acceptance testing complete | UAT is complete and signed off | CSM | ☐ | |
| GL-03 | Performance testing complete | Performance testing is complete and passed | DevOps | ☐ | |
| GL-04 | Security testing complete | Security testing is complete and passed | Security | ☐ | |
| GL-05 | Integration testing complete | Integration testing is complete and passed | SE | ☐ | |
| GL-06 | Data validation complete | Data validation is complete and passed | SE | ☐ | |
| GL-07 | Rollback procedure tested | Rollback procedure is tested | DevOps | ☐ | |

### 13.2 Communication Plan

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| GL-08 | Customer communication plan | Customer communication plan is documented | CSM | ☐ | |
| GL-09 | Internal communication plan | Internal communication plan is documented | CSM | ☐ | |
| GL-10 | Stakeholder notification | Key stakeholders are notified | CSM | ☐ | |
| GL-11 | Launch announcement | Launch announcement is prepared | CSM | ☐ | |
| GL-12 | Status page configured | Status page is configured (if applicable) | DevOps | ☐ | |

### 13.3 Launch Activities

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| GL-13 | Go-live checklist completed | Go-live checklist is completed | CSM | ☐ | |
| GL-14 | Launch team briefed | Launch team is briefed on launch plan | CSM | ☐ | |
| GL-15 | Support team on standby | Support team is on standby for launch | Support | ☐ | |
| GL-16 | Monitoring active | Monitoring is active and alerts configured | DevOps | ☐ | |
| GL-17 | Launch meeting scheduled | Launch meeting is scheduled | CSM | ☐ | |
| GL-18 | Post-launch review scheduled | Post-launch review is scheduled | CSM | ☐ | |

### 13.4 Rollback and Recovery

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| GL-19 | Rollback plan documented | Rollback plan is documented | DevOps | ☐ | |
| GL-20 | Rollback triggers defined | Rollback triggers are defined | DevOps | ☐ | |
| GL-21 | Rollback contacts verified | Rollback contacts are verified | DevOps | ☐ | |
| GL-22 | Rollback procedure tested | Rollback procedure is tested | DevOps | ☐ | |
| GL-23 | Recovery procedure documented | Recovery procedure is documented | DevOps | ☐ | |
| GL-24 | Recovery procedure tested | Recovery procedure is tested | DevOps | ☐ | |

### 13.5 Post-Launch Monitoring

| # | Item | Description | Owner | Status | Notes |
|---|---|---|---|---|---|
| GL-25 | Post-launch monitoring active | Post-launch monitoring is active | DevOps | ☐ | |
| GL-26 | Issue triage process defined | Issue triage process is defined | Support | ☐ | |
| GL-27 | Post-launch review completed | Post-launch review is completed | CSM | ☐ | |
| GL-28 | Lessons learned captured | Lessons learned are captured | CSM | ☐ | |

### 13.6 Go-Live Readiness Summary

| Category | Total Items | Complete | In Progress | At Risk | Not Started | % Complete |
|---|---|---|---|---|---|---|
| Pre-Launch Validation | 7 | ___ | ___ | ___ | ___ | ___% |
| Communication Plan | 5 | ___ | ___ | ___ | ___ | ___% |
| Launch Activities | 6 | ___ | ___ | ___ | ___ | ___% |
| Rollback and Recovery | 6 | ___ | ___ | ___ | ___ | ___% |
| Post-Launch Monitoring | 4 | ___ | ___ | ___ | ___ | ___% |
| **Total** | **28** | ___ | ___ | ___ | ___ | ___% |

---

## 14. Readiness Assessment Process

### 14.1 Assessment Timeline

| Week | Activity | Owner | Deliverable |
|---|---|---|---|
| **Week -4** | Begin readiness assessment | CSM | Assessment kick-off |
| **Week -4 to -3** | Complete Technical and Product readiness | DevOps, QA | Technical readiness report |
| **Week -3 to -2** | Complete Documentation and Infrastructure readiness | Documentation, DevOps | Documentation and infrastructure readiness reports |
| **Week -2 to -1** | Complete Support, Training, and Security readiness | Support, Training, Security | Support, training, and security readiness reports |
| **Week -1** | Complete Go-Live readiness and final assessment | CSM | Go-live readiness report |
| **Week -1** | Readiness review meeting | All stakeholders | Go/No-Go decision |
| **Week 0** | Pilot kickoff | CSM | Pilot launch |

### 14.2 Assessment Methodology

| Step | Activity | Owner | Duration |
|---|---|---|---|
| 1 | Assign readiness items to owners | CSM | 1 day |
| 2 | Owners complete readiness items | Owners | Ongoing |
| 3 | Owners update status in readiness tracker | Owners | Daily |
| 4 | CSM reviews progress weekly | CSM | Weekly |
| 5 | Identify and escalate blockers | CSM | As needed |
| 6 | Conduct readiness review meeting | CSM | 1 hour |
| 7 | Document readiness decision | CSM | Same day |
| 8 | Obtain sign-off from stakeholders | CSM | Within 2 days |

### 14.3 Readiness Tracker

The readiness tracker should be maintained in a shared location (e.g., Confluence, SharePoint, or project management tool) with the following fields:

| Field | Description |
|---|---|
| **Item ID** | Unique identifier for the readiness item |
| **Category** | Readiness dimension (Technical, Product, etc.) |
| **Description** | Description of the readiness item |
| **Owner** | Person responsible for completing the item |
| **Status** | Current status (Complete, In Progress, At Risk, Not Started, Exception, N/A) |
| **Due Date** | Target completion date |
| **Completion Date** | Actual completion date |
| **Notes** | Additional notes or context |
| **Dependencies** | Dependencies on other items |
| **Blockers** | Current blockers preventing completion |

### 14.4 Escalation Process

| Condition | Action | Owner | Timeline |
|---|---|---|---|
| Item is 1 day past due | Follow up with owner | CSM | Same day |
| Item is 3 days past due | Escalate to owner's manager | CSM | Same day |
| Item is 1 week past due | Escalate to leadership | CSM | Within 1 day |
| Critical item at risk | Immediate escalation | CSM | Immediately |
| Multiple items at risk | Readiness review meeting | CSM | Within 2 days |

---

## 15. Readiness Sign-Off

### 15.1 Sign-Off Requirements

| Category | Required Approver | Sign-Off Criteria |
|---|---|---|
| **Technical Readiness** | DevOps Lead | ≥ 95% of critical items complete |
| **Product Readiness** | Product Manager | All critical features operational; no critical bugs |
| **Documentation Readiness** | Documentation Lead | All required documentation complete |
| **Infrastructure Readiness** | DevOps Lead | All infrastructure provisioned and operational |
| **Support Readiness** | Support Lead | Support team trained and ready |
| **Training Readiness** | Training Lead | Training materials complete and schedule agreed |
| **Security Readiness** | Security Lead | Security review passed; no critical vulnerabilities |
| **Go-Live Readiness** | CSM | All go-live activities complete |

### 15.2 Sign-Off Form

| Readiness Category | Status | Approver | Signature | Date |
|---|---|---|---|---|
| Technical Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Product Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Documentation Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Infrastructure Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Support Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Training Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Security Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |
| Go-Live Readiness | ☐ Pass ☐ Fail | _________________ | _________________ | ___/___/2026 |

### 15.3 Go/No-Go Decision

| Decision | Criteria | Action |
|---|---|---|
| **Go** | All readiness categories pass; ≥ 95% of critical items complete; ≥ 85% of all items complete | Proceed with pilot kickoff |
| **Conditional Go** | Most readiness categories pass; ≥ 80% of critical items complete; mitigation plan in place | Proceed with conditions and mitigation |
| **No-Go** | Critical readiness categories fail; < 80% of critical items complete; significant blockers | Delay pilot; address gaps before proceeding |

### 15.4 Exception Process

| Step | Action | Owner | Timeline |
|---|---|---|---|
| 1 | Identify readiness item that cannot be completed on time | Owner | As needed |
| 2 | Document exception rationale and impact | Owner | Same day |
| 3 | Propose mitigation plan | Owner | Same day |
| 4 | Submit exception request to CSM | Owner | Same day |
| 5 | CSM reviews and approves/escalates | CSM | Within 1 day |
| 6 | If escalated, leadership reviews and decides | Leadership | Within 2 days |
| 7 | Document approved exception | CSM | Same day |
| 8 | Track mitigation plan execution | CSM | Ongoing |

---

## 16. Dependencies

| Dependency | Description | Impact if Delayed | Mitigation |
|---|---|---|---|
| Customer environment access | Access to customer Azure environment required | Blocks technical and infrastructure readiness | Begin access provisioning early; have escalation path |
| Azure resource provisioning | Azure resources must be provisioned | Blocks deployment and testing | Pre-provision common resources; have Azure support |
| Documentation completion | All documentation must be complete | Impairs training and support quality | Begin documentation early; parallel development |
| Security review completion | Security review must be passed | Blocks deployment | Engage security team early; pre-schedule review |
| Support team availability | Support team must be trained and available | Impacts pilot support quality | Begin support training early; have backup resources |
| Training material completion | Training materials must be complete | Impairs customer onboarding | Begin training material development early |
| Customer stakeholder availability | Customer stakeholders must be available | Delays UAT and sign-off | Set expectations early; have escalation path |
| Integration partner availability | Integration partners must be available (if applicable) | Delays integration testing | Engage partners early; have backup plans |

---

## 17. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Chief Product Officer | _________________ | _________________ | ___/___/2026 |
| VP of Engineering | _________________ | _________________ | ___/___/2026 |
| Director of Customer Success | _________________ | _________________ | ___/___/2026 |
| Head of Security | _________________ | _________________ | ___/___/2026 |
| Head of Support | _________________ | _________________ | ___/___/2026 |

---

*End of Document – MAP-PILOT-CHECK-003 v1.0*
