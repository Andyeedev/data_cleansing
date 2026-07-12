# MAP Security & Compliance Readiness

---

| Field | Value |
|---|---|
| **Document Title** | MAP (Migration Assurance Platform) Security & Compliance Readiness |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal – Confidential |
| **Owner** | CISO / VP of Engineering |
| **Review Cycle** | Quarterly |
| **Next Review** | October 2026 |

---

## Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | 2026-05-10 | Security Engineering | Initial draft |
| 0.5 | 2026-05-30 | Compliance Team | Added compliance frameworks |
| 0.9 | 2026-06-18 | CISO | Internal review and refinements |
| 1.0 | 2026-07-01 | CTO / CISO | Final approval and publication |

---

## Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Chief Technology Officer | __________ | __________ | __________ |
| Chief Information Security Officer | __________ | __________ | __________ |
| VP of Engineering | __________ | __________ | __________ |
| Head of Compliance | __________ | __________ | __________ |
| Legal Counsel | __________ | __________ | __________ |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Content](#3-content)
   - 3.1 [Security Controls](#31-security-controls)
   - 3.2 [Compliance Frameworks](#32-compliance-frameworks)
   - 3.3 [Security Testing](#33-security-testing)
   - 3.4 [Data Protection](#34-data-protection)
   - 3.5 [Identity & Access Management](#35-identity--access-management)
   - 3.6 [Audit & Logging](#36-audit--logging)
   - 3.7 [Incident Response](#37-incident-response)
   - 3.8 [Best Practices Summary](#38-best-practices-summary)
4. [Dependencies](#4-dependencies)
5. [References](#5-references)
6. [Appendices](#6-appendices)

---

## 1. Purpose

This document defines the security controls, compliance requirements, and readiness criteria for the Migration Assurance Platform (MAP) prior to production deployment. It ensures MAP meets enterprise-grade security standards and regulatory compliance obligations for financial services data processing.

### 1.1 Objectives

- Define security control requirements across technical, administrative, and physical domains
- Map MAP capabilities to compliance frameworks (SOC2, ISO 27001, GDPR, PCI DSS)
- Establish security testing standards for penetration, vulnerability, and code review
- Define data protection controls for encryption, access, and retention
- Establish identity and access management (IAM) standards
- Define audit and logging requirements for operational and compliance purposes
- Create incident response procedures for security events

### 1.2 Security Readiness Criteria

MAP shall be considered security-ready when the following criteria are met:

| Criterion | Requirement | Evidence Required |
|---|---|---|
| Security Controls | All critical controls implemented and verified | Control assessment report |
| Compliance | SOC2 Type I audit completed | Audit report |
| Security Testing | Penetration test passed with no critical findings | Pentest report |
| Data Protection | Encryption at rest and in transit verified | Configuration audit |
| IAM | MFA enforced, least privilege verified | Access review report |
| Audit Logging | All access logged and tamper-proof | Log audit report |
| Incident Response | IR plan tested with tabletop exercise | Exercise report |
| Vulnerability Management | No critical/high open vulnerabilities | Vulnerability scan report |

---

## 2. Scope

### 2.1 In Scope

- All MAP platform components (application, infrastructure, data stores)
- Customer data (financial records, migration data, PII)
- Internal systems and employee access
- Third-party integrations and API connections
- CI/CD pipeline and deployment infrastructure
- Development, staging, and production environments

### 2.2 Data Classification

| Classification | Examples | Handling Requirements |
|---|---|---|
| **Restricted** | PII, financial records, authentication credentials | Encryption, access logging, DLP |
| **Confidential** | Business logic, customer configurations, API keys | Encryption, access control |
| **Internal** | Source code, architecture docs, internal procedures | Access control, no external sharing |
| **Public** | Marketing materials, public documentation | No restrictions |

---

## 3. Content

### 3.1 Security Controls

#### 3.1.1 Technical Controls

| Control ID | Control | Implementation | Status | Evidence |
|---|---|---|---|---|
| TC-01 | Network segmentation | Azure VNet with subnets for each tier | Required | Network diagram |
| TC-02 | Firewall rules | NSG rules restricting traffic | Required | NSG configuration |
| TC-03 | Web Application Firewall | Azure WAF on Application Gateway | Required | WAF policy export |
| TC-04 | DDoS protection | Azure DDoS Protection Standard | Required | DDoS config |
| TC-05 | TLS encryption | TLS 1.2+ enforced on all endpoints | Required | SSL Labs test results |
| TC-06 | Certificate management | Azure Key Vault with auto-rotation | Required | Key Vault config |
| TC-07 | Secrets management | Azure Key Vault (no hardcoded secrets) | Required | Code scan results |
| TC-08 | Endpoint protection | Microsoft Defender for Cloud enabled | Required | Defender config |
| TC-09 | Vulnerability scanning | Automated weekly scans | Required | Scan reports |
| TC-10 | Dependency scanning | Automated dependency vulnerability checks | Required | Dependency scan results |
| TC-11 | Container security | Azure Container Registry with scanning | Required | ACR scan results |
| TC-12 | Network traffic inspection | Azure Network Watcher | Required | Traffic analytics config |

#### 3.1.2 Administrative Controls

| Control ID | Control | Implementation | Status | Evidence |
|---|---|---|---|---|
| AC-01 | Security policy | Published information security policy | Required | Policy document |
| AC-02 | Access review | Quarterly access reviews | Required | Review records |
| AC-03 | Background checks | All employees undergo background screening | Required | HR records |
| AC-04 | Security training | Annual security awareness training | Required | Training records |
| AC-05 | Vendor assessment | Third-party risk assessment process | Required | Assessment records |
| AC-06 | Change management | CAB-approved changes only | Required | Change records |
| AC-07 | Data classification | Data classified per policy | Required | Classification labels |
| AC-08 | Incident response plan | Documented and tested IR plan | Required | IR plan document |
| AC-09 | Business continuity | BCP/DR plan documented and tested | Required | BCP document |
| AC-10 | Acceptable use | Employee acceptable use policy signed | Required | Signed AUPs |

#### 3.1.3 Physical Controls

| Control ID | Control | Implementation | Status | Evidence |
|---|---|---|---|---|
| PC-01 | Data centre security | Azure data centre physical security | N/A (Azure managed) | Azure compliance docs |
| PC-02 | Office access control | Badge access for office premises | Required | Access control list |
| PC-03 | Visitor management | Visitor sign-in and escort policy | Required | Visitor logs |
| PC-04 | Clean desk policy | Sensitive materials secured | Required | Policy document |
| PC-05 | Device security | Full disk encryption, screen locks | Required | Device audit results |
| PC-06 | Media disposal | Secure destruction of storage media | Required | Destruction certificates |

---

### 3.2 Compliance Frameworks

#### 3.2.1 SOC 2 Type II

| Trust Service Criteria | Control | MAP Implementation | Status |
|---|---|---|---|
| **CC1.1** – Control Environment | Security governance structure | CISO, security committee, policies | Required |
| **CC1.2** – Board Oversight | Board-level security reporting | Quarterly security report to board | Required |
| **CC2.1** – Internal Communication | Security policies communicated | Training, handbook, intranet | Required |
| **CC3.1** – Risk Assessment | Annual risk assessment | Formal risk assessment process | Required |
| **CC3.2** – Fraud Risk | Fraud risk analysis | Anti-fraud controls documented | Required |
| **CC4.1** – Monitoring | Continuous monitoring | Automated security monitoring | Required |
| **CC5.1** – Control Activities | Technical controls implemented | Per technical controls table | Required |
| **CC6.1** – Logical Access | Access control mechanisms | IAM with MFA | Required |
| **CC6.6** – External Threats | Threat protection | WAF, DDoS, Defender | Required |
| **CC7.1** – Vulnerability Management | Regular vulnerability scanning | Weekly scans, remediation SLAs | Required |
| **CC8.1** – Change Management | Change control process | CAB process documented | Required |
| **CC9.1** – Risk Mitigation | Risk mitigation activities | Risk register maintained | Required |

#### 3.2.2 ISO 27001:2022

| Annex A Control | Control | MAP Implementation | Status |
|---|---|---|---|
| **A.5.1** – Policies for Information Security | Security policies | Published policy framework | Required |
| **A.5.7** – Threat Intelligence | Threat intelligence | Subscribe to threat feeds | Required |
| **A.6.1** – Screening | Background checks | HR screening process | Required |
| **A.6.3** – Awareness training | Security training | Annual training programme | Required |
| **A.7.1** – Physical security perimeters | Office security | Badge access, visitor logs | Required |
| **A.8.1** – User endpoint devices | Device management | MDM, encryption | Required |
| **A.8.2** – Privileged access rights | Privileged access management | PAM solution, just-in-time access | Required |
| **A.8.3** – Information access restriction | Access control | RBAC, need-to-know | Required |
| **A.8.5** – Secure authentication | Authentication | MFA, SSO | Required |
| **A.8.9** – Configuration management | Config management | Infrastructure as Code | Required |
| **A.8.10** – Information deletion | Data retention/deletion | Automated retention policies | Required |
| **A.8.11** – Data masking | Data masking | PII masking in non-prod | Required |
| **A.8.12** – Data leakage prevention | DLP | Azure DLP policies | Required |
| **A.8.16** – Monitoring activities | Security monitoring | SIEM, alerting | Required |
| **A.8.24** – Cryptography | Encryption standards | AES-256, TLS 1.2+ | Required |

#### 3.2.3 GDPR

| Article | Requirement | MAP Implementation | Status |
|---|---|---|---|
| **Art. 5** – Principles | Lawfulness, fairness, transparency | Privacy policy, consent management | Required |
| **Art. 6** – Lawful basis | Legal basis for processing | Legitimate interest / contract | Required |
| **Art. 12-14** – Transparency | Privacy notices | Published privacy policy | Required |
| **Art. 15** – Right of access | Data subject access requests | DSAR process defined | Required |
| **Art. 17** – Right to erasure | Data deletion | Automated deletion capability | Required |
| **Art. 20** – Data portability | Data export | Data export API | Required |
| **Art. 25** – Data protection by design | Privacy by design | Privacy impact assessments | Required |
| **Art. 30** – Records of processing | Processing activities | ROPA maintained | Required |
| **Art. 32** – Security of processing | Security measures | Per security controls | Required |
| **Art. 33-34** – Breach notification | Breach notification | 72-hour notification process | Required |
| **Art. 35** – DPIA | Data protection impact assessment | DPIA for high-risk processing | Required |
| **Art. 37** – DPO | Data protection officer | DPO appointed | Required |

#### 3.2.4 PCI DSS (for payment data processing)

| Requirement | Control | MAP Implementation | Status |
|---|---|---|---|
| **Req 1** – Network security | Firewalls and segmentation | VNet, NSGs, WAF | Required |
| **Req 2** – Secure configurations | Default configuration hardening | CIS benchmarks applied | Required |
| **Req 3** – Protect stored data | Data encryption at rest | AES-256 encryption | Required |
| **Req 4** – Encrypt transmissions | TLS 1.2+ for all connections | Enforced on all endpoints | Required |
| **Req 5** – Anti-malware | Endpoint protection | Defender for Endpoint | Required |
| **Req 6** – Secure systems | Secure development lifecycle | SDL process defined | Required |
| **Req 7** – Restrict access | Role-based access control | RBAC implemented | Required |
| **Req 8** – Identify users | Unique user IDs, MFA | SSO + MFA | Required |
| **Req 9** – Physical access | Physical security controls | Azure DC + office controls | Required |
| **Req 10** – Log and monitor | Audit logging | Comprehensive logging | Required |
| **Req 11** – Test security | Regular security testing | Quarterly pentests | Required |
| **Req 12** – Security policy | Information security policy | Published policies | Required |

---

### 3.3 Security Testing

#### 3.3.1 Penetration Testing

| Test Type | Frequency | Scope | Provider | Report Distribution |
|---|---|---|---|---|
| External Network Pentest | Quarterly | Public-facing infrastructure | Third-party firm | CISO, VP Eng, Board |
| Internal Network Pentest | Annually | Internal network and systems | Third-party firm | CISO, VP Eng |
| Application Pentest | Per major release | Web application, APIs | Third-party firm | CISO, Eng Lead, Dev Team |
| Red Team Exercise | Annually | Full organisation | Specialist firm | CISO, Executive Team |
| Cloud Configuration Review | Quarterly | Azure subscription | Third-party firm | CISO, Platform Eng |

#### 3.3.2 Vulnerability Management

| Activity | Frequency | Tool | SLA (Critical) | SLA (High) | SLA (Medium) |
|---|---|---|---|---|---|
| Infrastructure scan | Weekly | Defender for Cloud | 24 hours | 7 days | 30 days |
| Application scan | Weekly | OWASP ZAP / SonarQube | 24 hours | 7 days | 30 days |
| Dependency scan | Daily (CI) | Snyk / Dependabot | 24 hours | 7 days | 30 days |
| Container image scan | Per build | Trivy / ACR scanning | 24 hours | 7 days | 30 days |
| Secret scan | Per commit | GitLeaks / TruffleHog | Immediate | Immediate | Immediate |
| Infrastructure as Code scan | Per commit | Checkov / tfsec | 24 hours | 7 days | 30 days |

#### 3.3.3 Code Review Security

| Check | Tool | Enforcement | Severity Threshold |
|---|---|---|---|
| SQL Injection prevention | SonarQube | Automated | Block on Critical |
| XSS prevention | SonarQube | Automated | Block on Critical |
| Authentication bypass | Manual review | Required for auth code | Block on any finding |
| Authorisation bypass | Manual review | Required for access code | Block on any finding |
| Secrets in code | GitLeaks | Automated | Block on any finding |
| Insecure deserialization | SonarQube | Automated | Block on Critical |
| Dependency vulnerabilities | Snyk | Automated | Block on Critical/High |
| Infrastructure misconfig | Checkov | Automated | Block on Critical |
| Container vulnerabilities | Trivy | Automated | Block on Critical |
| OWASP Top 10 coverage | Combined tools | Automated + Manual | Block on any Critical |

#### 3.3.4 Security Test Results Tracking

| Finding Severity | Remediation SLA | Verification | Escalation |
|---|---|---|---|
| **Critical** | 24 hours | Re-test within 48 hours | CISO, VP Eng |
| **High** | 7 days | Re-test within 14 days | Security Lead, Eng Lead |
| **Medium** | 30 days | Re-test within 45 days | Security Lead |
| **Low** | 90 days | Next scheduled review | N/A |
| **Informational** | Best effort | N/A | N/A |

---

### 3.4 Data Protection

#### 3.4.1 Encryption Standards

| Data State | Standard | Implementation | Key Management |
|---|---|---|---|
| **At Rest** | AES-256 | Azure Storage Service Encryption, TDE for SQL | Azure Key Vault |
| **In Transit** | TLS 1.2+ | Enforced on all endpoints | Auto-rotation via Key Vault |
| **In Processing** | Confidential Computing | Azure Confidential Computing (where available) | Hardware security modules |
| **Backups** | AES-256 | Encrypted backup storage | Azure Backup Vault keys |
| **Logs** | AES-256 | Encrypted log storage | Key Vault managed keys |
| **Development** | AES-256 | Dev/staging environments encrypted | Key Vault managed keys |

#### 3.4.2 Access Control Matrix

| Data Classification | Read | Write | Delete | Export | Share |
|---|---|---|---|---|---|
| **Restricted** | CISO, Data Owner, Compliance | Data Owner only | CISO approval | VP+ approval | CISO approval |
| **Confidential** | Engineering Team, Ops | Engineering Team | Lead approval | Manager approval | Manager approval |
| **Internal** | All employees | Engineering Team | Any employee | Lead approval | Any employee |
| **Public** | Anyone | Marketing Team | Manager approval | No restriction | Anyone |

#### 3.4.3 Data Retention Policy

| Data Type | Retention Period | Deletion Method | Legal Basis | Review Frequency |
|---|---|---|---|---|
| Customer migration data | Duration of contract + 7 years | Automated purge | Legal obligation | Annual |
| Customer PII | Duration of contract + 3 years | Automated purge | Consent / Contract | Annual |
| Application logs | 90 days (hot), 1 year (cold) | Automated lifecycle | Legitimate interest | Quarterly |
| Audit logs | 7 years | Immutable storage | Legal obligation | Annual |
| Backups | 30 days | Automated expiry | Business need | Monthly |
| Support tickets | 5 years | Automated archival | Contract / Legitimate interest | Annual |
| Marketing consent | Until withdrawal | Automated deletion | Consent | Quarterly |
| Employee data | Duration of employment + 7 years | Manual + automated | Legal obligation | Annual |

#### 3.4.4 Data Loss Prevention (DLP)

| Control | Scope | Policy | Alert | Response |
|---|---|---|---|---|
| Azure DLP | Email (Exchange) | Block Restricted data in email | Block + Admin alert | Investigate |
| Azure DLP | SharePoint/OneDrive | Block Restricted data external sharing | Block + Admin alert | Investigate |
| Endpoint DLP | All endpoints | Block USB copy of Restricted data | Block + Alert | Investigate |
| Network DLP | Egress traffic | Detect data exfiltration patterns | Alert SOC | Investigate |
| Cloud DLP | Azure resources | Detect misconfigured storage | Alert SOC | Remediate |

---

### 3.5 Identity & Access Management

#### 3.5.1 Authentication

| Requirement | Implementation | Standard | Enforcement |
|---|---|---|---|
| Multi-Factor Authentication | Azure AD MFA | NIST 800-63B | All users, all systems |
| Password Policy | 14+ chars, complexity, 90-day expiry | NIST 800-63B | Enforced via Azure AD |
| SSO Integration | Azure AD SAML 2.0 / OIDC | SAML 2.0 | All applications |
| Session Management | 8-hour session, 30-min idle timeout | OAuth 2.0 | Application layer |
| API Authentication | OAuth 2.0 client credentials | RFC 6749 | All API access |
| Service Account Auth | Managed identities where possible | Azure best practice | All Azure services |
| Certificate Auth | mTLS for service-to-service | RFC 7250 | Internal services |

#### 3.5.2 Authorisation

| Model | Implementation | Scope | Review |
|---|---|---|---|
| Role-Based Access Control | Custom RBAC with Azure AD groups | All application resources | Quarterly |
| Attribute-Based Access Control | ABAC for fine-grained data access | Customer data access | Quarterly |
| Just-In-Time Access | Azure AD PIM for privileged roles | Infrastructure access | Per-request |
| Service-to-Service | OAuth 2.0 scopes | Internal APIs | Quarterly |
| API Rate Limiting | Per-key rate limits | External APIs | Monthly |

#### 3.5.3 Role Definitions

| Role | Permissions | Scope | Approval Required |
|---|---|---|---|
| Platform Admin | Full platform access | All resources | VP Engineering |
| Platform Engineer | Infrastructure management | Dev/Staging/Prod | Engineering Lead |
| Application Developer | Code deployment, config changes | Application resources | Engineering Lead |
| Security Admin | Security policy management | Security controls | CISO |
| Compliance Officer | Audit log access, compliance reporting | Compliance data | CISO |
| Operations | Monitoring, incident response | Operational tools | Operations Manager |
| Support Agent | Customer ticket management | Support tools | Operations Manager |
| Customer Admin | Customer-specific configuration | Own organisation | Customer Admin |
| Customer User | Read-only access to own data | Own organisation | Customer Admin |

#### 3.5.4 Access Lifecycle

| Process | Frequency | Owner | Evidence |
|---|---|---|---|
| New user provisioning | On hire | HR + IT | Provisioning request |
| Role change | On promotion/transfer | Manager + IT | Change request |
| User deprovisioning | On termination | HR + IT | Termination checklist |
| Privileged access review | Quarterly | CISO + IT | Review records |
| Service account review | Quarterly | Platform Eng | Review records |
| Orphaned account detection | Monthly | IT Security | Detection report |
| Dormant account removal | Quarterly | IT Security | Removal records |

---

### 3.6 Audit & Logging

#### 3.6.1 Log Categories

| Log Category | Source | Destination | Retention | Tamper Protection |
|---|---|---|---|---|
| Authentication events | Azure AD, Application | Log Analytics | 1 year | Immutable storage |
| Authorisation events | Application | Log Analytics | 1 year | Immutable storage |
| Data access events | Application, Database | Log Analytics | 7 years | Immutable storage |
| Administrative actions | Azure Portal, Application | Log Analytics | 7 years | Immutable storage |
| API access logs | API Gateway | Log Analytics | 90 days hot, 1 year cold | Read-only storage |
| Infrastructure events | Azure Activity Log | Log Analytics | 1 year | Immutable storage |
| Application errors | Application | Log Analytics | 90 days | Read-only storage |
| Security events | Defender for Cloud | Security Centre | 1 year | Immutable storage |
| Network events | NSG Flow Logs | Storage Account | 90 days | WORM storage |

#### 3.6.2 Log Content Requirements

| Field | Required | Description |
|---|---|---|
| Timestamp | Yes | UTC ISO 8601 format |
| Event Type | Yes | Authentication, Authorisation, Data Access, Admin |
| User/Service Identity | Yes | Unique identifier |
| Source IP | Yes | Client IP address |
| Resource Accessed | Yes | API endpoint, database table, file |
| Action | Yes | Read, Write, Delete, Execute |
| Result | Yes | Success, Failure, Denied |
| Correlation ID | Yes | For request tracing |
| Request ID | Yes | Unique request identifier |
| User Agent | Yes | Client application identifier |
| Data Classification | Conditional | For data access events |

#### 3.6.3 Monitoring and Alerting

| Event Pattern | Alert | Severity | Response |
|---|---|---|---|
| Multiple failed logins (>5 in 5 min) | Potential brute force | P2 | Account lockout + investigation |
| Login from unusual location | Potential compromised account | P2 | MFA re-verification |
| Privilege escalation attempt | Unauthorised access attempt | P1 | Immediate investigation |
| Bulk data export (>1000 records) | Potential data exfiltration | P1 | Investigation + block |
| API key exposed in code | Secret exposure | P1 | Immediate key rotation |
| Unauthorised admin action | Potential insider threat | P1 | Investigation + lockdown |
| Configuration change in prod | Unauthorised change | P2 | Verify change approval |
| After-hours access to Restricted data | Unusual access pattern | P3 | Log for review |

#### 3.6.4 Compliance Reporting

| Report | Frequency | Audience | Content |
|---|---|---|---|
| Access Review Report | Quarterly | CISO, Compliance | All user access, anomalies |
| Security Metrics Dashboard | Real-time | SOC, Security Lead | Events, alerts, trends |
| Compliance Status Report | Monthly | Executive Team | Framework compliance status |
| Vulnerability Report | Weekly | Security Lead, Eng Lead | Open vulnerabilities, trends |
| Audit Log Summary | Monthly | Compliance Officer | Key events, anomalies |
| Incident Report | Per incident | CISO, Executive Team | Incident details, impact |

---

### 3.7 Incident Response

#### 3.7.1 Security Incident Severity

| Severity | Definition | Examples | Response Time | Escalation |
|---|---|---|---|---|
| **S1 – Critical** | Active data breach or system compromise | Data exfiltration, ransomware, account takeover | 15 min | CISO, Legal, CEO |
| **S2 – High** | Confirmed compromise or active attack | Malware detection, unauthorised access, DDoS | 30 min | CISO, VP Eng |
| **S2 – High** | Vulnerable system exploited | CVE exploitation, privilege escalation | 30 min | CISO, VP Eng |
| **S3 – Medium** | Suspected compromise or security policy violation | Phishing attempt, policy violation, suspicious activity | 2 hours | Security Lead |
| **S4 – Low** | Minor security event | Failed login attempts, port scanning, minor policy deviation | 24 hours | SOC Analyst |

#### 3.7.2 Incident Response Phases

```
Phase 1: Preparation
  ├── Incident response team identified
  ├── Communication channels established
  ├── Tools and access prepared
  └── Playbooks documented

Phase 2: Detection & Analysis
  ├── Alert received and triaged
  ├── Severity assessed
  ├── Evidence collected and preserved
  └── Scope and impact determined

Phase 3: Containment
  ├── Short-term containment (isolate affected systems)
  ├── Evidence preservation (forensic images)
  ├── Long-term containment (temporary fixes)
  └── System restoration planning

Phase 4: Eradication
  ├── Root cause identified
  ├── Malicious artefacts removed
  ├── Vulnerabilities patched
  └── Systems hardened

Phase 5: Recovery
  ├── Systems restored from clean backups
  ├── Verification testing
  ├── Monitoring enhanced
  └── Services restored

Phase 6: Post-Incident
  ├── Post-incident review (within 5 days)
  ├── Lessons learned documented
  ├── Controls improved
  └── Reporting completed
```

#### 3.7.3 Communication Matrix

| Stakeholder | When to Notify | Notification Method | Owner |
|---|---|---|---|
| CISO | S1/S2 incidents | Phone + Email | Incident Commander |
| CEO / Executive Team | S1 incidents | Phone + Email | CISO |
| Legal Counsel | S1 incidents (potential breach) | Phone + Email | CISO |
| Affected Customers | Confirmed data breach | Email + Phone | VP Customer Success |
| Board of Directors | S1 incidents with material impact | Email + Briefing | CEO |
| Regulators | As required by regulation | Formal notification | Legal / Compliance |
| Law Enforcement | Criminal activity suspected | Formal report | Legal / CISO |
| Media | If public disclosure needed | Press statement | Communications |

#### 3.7.4 Regulatory Notification Requirements

| Regulation | Notification Deadline | Authority | Trigger |
|---|---|---|---|
| GDPR | 72 hours | Supervisory Authority | Personal data breach |
| GDPR | Without undue delay | Data subjects | High-risk breach |
| PCI DSS | Immediately | Card brands / Acquirer | Cardholder data compromise |
| SOC 2 | Per contract | Customers / Auditors | Security incident |
| State Breach Laws | Varies (30-60 days) | State AG / Individuals | PII breach |

---

### 3.8 Best Practices Summary

| Category | Best Practice | Implementation Status |
|---|---|---|
| **Defense in Depth** | Multiple layers of security controls across all domains | Required |
| **Defense in Depth** | No single point of failure in security architecture | Required |
| **Defense in Depth** | Security controls at network, application, and data layers | Required |
| **Least Privilege** | Users granted minimum necessary permissions | Required |
| **Least Privilege** | Just-in-time access for privileged operations | Required |
| **Least Privilege** | Regular access reviews and cleanup | Required |
| **Compliance** | Continuous compliance monitoring | Required |
| **Compliance** | Automated compliance evidence collection | Required |
| **Compliance** | Regular internal audits | Required |
| **Zero Trust** | Never trust, always verify | Required |
| **Zero Trust** | Verify explicitly for every request | Required |
| **Zero Trust** | Assume breach and minimise blast radius | Required |
| **Shift Left** | Security integrated into CI/CD pipeline | Required |
| **Shift Left** | Automated security testing in development | Required |
| **Shift Left** | Security training for developers | Required |

---

## 4. Dependencies

| Dependency | Type | Owner | Impact if Unavailable | Mitigation |
|---|---|---|---|---|
| Azure Security Centre | Tooling | Security | Reduced visibility into cloud security | Alternative CSPM tool |
| SIEM (Log Analytics) | Tooling | SOC | Cannot aggregate security logs | Alternative log analysis |
| Key Vault | Infrastructure | Platform Eng | Cannot manage secrets/keys | HSM backup |
| Azure AD | Identity | IT | Cannot authenticate users | Alternative IdP |
| Third-party Pentest Firm | Service | Security | Cannot conduct external tests | Alternative vendor |
| DLP Service | Tooling | Security | Cannot prevent data leakage | Manual controls |
| Threat Intelligence Feeds | Intelligence | SOC | Reduced threat visibility | Open-source alternatives |

---

## 5. References

| Reference | Description |
|---|---|
| NIST Cybersecurity Framework | Security control framework |
| NIST SP 800-53 | Security and privacy controls |
| CIS Controls v8 | Prioritised security controls |
| OWASP Top 10 | Web application security risks |
| ISO 27001:2022 | Information security management |
| SOC 2 Trust Services Criteria | Security, availability, processing integrity |
| GDPR | General Data Protection Regulation |
| PCI DSS v4.0 | Payment Card Industry Data Security Standard |
| Azure Security Best Practices | Microsoft Azure security guidance |
| MAP Architecture Document | Internal architecture reference |
| MAP Data Classification Policy | Internal data handling policy |

---

## 6. Appendices

### Appendix A: Security Control Matrix

| Control Domain | # Controls | Implemented | Verified | Gaps |
|---|---|---|---|---|
| Network Security | 12 | 0 | 0 | 12 |
| Identity & Access | 15 | 0 | 0 | 15 |
| Data Protection | 10 | 0 | 0 | 10 |
| Application Security | 11 | 0 | 0 | 11 |
| Infrastructure | 8 | 0 | 0 | 8 |
| Monitoring & Logging | 9 | 0 | 0 | 9 |
| Incident Response | 7 | 0 | 0 | 7 |
| Physical Security | 6 | 0 | 0 | 6 |
| **Total** | **78** | **0** | **0** | **78** |

### Appendix B: Compliance Readiness Summary

| Framework | Scope | Assessment Status | Target Date | Auditor |
|---|---|---|---|---|
| SOC 2 Type I | Platform + Operations | Not started | Q4 2026 | TBD |
| SOC 2 Type II | Platform + Operations | Not started | Q1 2027 | TBD |
| ISO 27001 | Information Security | Not started | Q2 2027 | TBD |
| GDPR | EU Data Processing | Not started | Q3 2026 | Internal |
| PCI DSS | Payment Processing | Not started | Q4 2026 | TBD |

### Appendix C: Security Readiness Checklist

| # | Item | Owner | Status | Evidence |
|---|---|---|---|---|
| 1 | Security policy published | CISO | ☐ | Policy document |
| 2 | Network segmentation implemented | Platform Eng | ☐ | Network diagram |
| 3 | WAF configured and tested | Security | ☐ | WAF config |
| 4 | TLS 1.2+ enforced on all endpoints | Platform Eng | ☐ | SSL Labs report |
| 5 | Secrets in Key Vault | Platform Eng | ☐ | Key Vault audit |
| 6 | MFA enforced for all users | IT | ☐ | Azure AD config |
| 7 | RBAC implemented | Platform Eng | ☐ | Access matrix |
| 8 | Audit logging enabled | Platform Eng | ☐ | Log verification |
| 9 | Vulnerability scanning configured | Security | ☐ | Scan config |
| 10 | Penetration test completed | Security | ☐ | Pentest report |
| 11 | Incident response plan documented | Security | ☐ | IR plan |
| 12 | Data retention policy implemented | Platform Eng | ☐ | Policy config |
| 13 | DLP policies configured | Security | ☐ | DLP config |
| 14 | Security training completed | HR | ☐ | Training records |
| 15 | SOC2 audit readiness | Compliance | ☐ | Gap assessment |

### Appendix D: Glossary

| Term | Definition |
|---|---|
| CIA Triad | Confidentiality, Integrity, Availability |
| MFA | Multi-Factor Authentication |
| SSO | Single Sign-On |
| RBAC | Role-Based Access Control |
| ABAC | Attribute-Based Access Control |
| PAM | Privileged Access Management |
| SIEM | Security Information and Event Management |
| DLP | Data Loss Prevention |
| WAF | Web Application Firewall |
| DDoS | Distributed Denial of Service |
| IAM | Identity and Access Management |
| DSAR | Data Subject Access Request |
| DPIA | Data Protection Impact Assessment |
| ROPA | Record of Processing Activities |
| WORM | Write Once Read Many |

---

*End of Document – MAP Security & Compliance Readiness v1.0*
