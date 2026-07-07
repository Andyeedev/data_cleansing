# Security Testing Framework

## MAP (Migration Assurance Platform)

---

**Document Control**

| Field | Value |
|-------|-------|
| **Document Title** | Security Testing Framework |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Confidential |
| **Owner** | Security Engineering Team |
| **Department** | Information Security |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | June 2026 | Security Team | Initial draft |
| 0.2 | June 2026 | QA Lead | Testing methodology review |
| 0.3 | June 2026 | Compliance Officer | Regulatory alignment |
| 1.0 | July 2026 | CISO Office | Final approval |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Chief Information Security Officer | _____________ | _____________ | _____________ |
| Head of Quality Assurance | _____________ | _____________ | _____________ |
| Engineering Director | _____________ | _____________ | _____________ |
| Compliance Manager | _____________ | _____________ | _____________ |

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [OWASP Testing Framework](#2-owasp-testing-framework)
3. [Dependency Scanning](#3-dependency-scanning)
4. [Penetration Testing](#4-penetration-testing)
5. [Authentication Testing](#5-authentication-testing)
6. [Authorisation Testing](#6-authorisation-testing)
7. [Secrets Validation](#7-secrets-validation)
8. [Vulnerability Assessment](#8-vulnerability-assessment)
9. [Security Regression Testing](#9-security-regression-testing)
10. [Security Tools Configuration](#10-security-tools-configuration)
11. [Security Metrics](#11-security-metrics)
12. [Compliance Alignment](#12-compliance-alignment)
13. [Appendices](#13-appendices)

---

# 1. Purpose and Scope

## 1.1 Purpose

This document establishes the comprehensive security testing framework for the Migration Assurance Platform (MAP). It defines the methodologies, tools, processes, and standards required to identify, assess, and remediate security vulnerabilities throughout the software development lifecycle.

## 1.2 Scope

This framework applies to:

- All MAP microservices and APIs
- Frontend web applications and mobile interfaces
- Database systems and data storage layers
- Third-party integrations and dependencies
- Infrastructure components and cloud services
- CI/CD pipelines and deployment mechanisms

## 1.3 Objectives

| Objective | Description | Success Criteria |
|-----------|-------------|------------------|
| Vulnerability Detection | Identify security weaknesses before production | 95% detection rate |
| Risk Reduction | Minimize attack surface | Zero critical vulnerabilities in production |
| Compliance | Meet regulatory requirements | Full compliance with GDPR, SOC2, ISO 27001 |
| Incident Prevention | Prevent security incidents | Zero security breaches |
| Continuous Improvement | Enhance security posture over time | Quarterly security metrics improvement |

## 1.4 References

| Document | Reference | Description |
|----------|-----------|-------------|
| Batch 08 | Security Architecture | MAP Security Architecture Document |
| Batch 11 | Security Standards | Enterprise Security Standards |
| OWASP ASVS | v4.0 | Application Security Verification Standard |
| NIST CSF | v1.1 | Cybersecurity Framework |
| CIS Controls | v8 | Center for Internet Security Controls |

---

# 2. OWASP Testing Framework

## 2.1 OWASP Top 10 Testing Requirements

The MAP platform must be tested against all OWASP Top 10 (2021) categories:

### 2.1.1 A01:2021 – Broken Access Control

**Testing Requirements:**

```yaml
access_control_testing:
  idor_testing:
    - Test all endpoints for IDOR vulnerabilities
    - Verify object-level access controls
    - Test parameter manipulation
  
  force_browsing:
    - Test unauthorized URL access
    - Verify directory traversal protection
    - Test forced authentication bypass
  
  cors_misconfiguration:
    - Verify CORS policies
    - Test cross-origin requests
    - Validate Origin header handling
```

**Test Cases:**

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| AC-001 | Access resource with different user ID | Access denied for unauthorized users | Critical |
| AC-002 | Modify URL parameters to access other resources | 403 Forbidden response | Critical |
| AC-003 | Test forced browsing to admin pages | Redirect to login page | High |
| AC-004 | Verify CORS allows only trusted origins | Origin validation enforced | Medium |

### 2.1.2 A02:2021 – Cryptographic Failures

**Testing Requirements:**

```python
# Cryptographic Validation Test Template
import pytest
import ssl
from cryptography import x509

class TestCryptographicCompliance:
    """Test suite for cryptographic standards compliance."""
    
    def test_tls_version(self, endpoint):
        """Verify TLS 1.2+ is enforced."""
        context = ssl.create_default_context()
        assert context.minimum_version >= ssl.TLSVersion.TLSv1_2
    
    def test_certificate_validity(self, endpoint):
        """Verify certificate is valid and not expired."""
        cert = get_server_certificate(endpoint)
        parsed_cert = x509.load_pem_x509_certificate(cert)
        assert parsed_cert.not_valid_after > datetime.now()
    
    def test_strong_cipher_suites(self, endpoint):
        """Verify only strong cipher suites are enabled."""
        weak_ciphers = ['RC4', 'DES', '3DES', 'NULL']
        active_ciphers = get_active_ciphers(endpoint)
        for cipher in active_ciphers:
            assert cipher not in weak_ciphers
    
    def test_secret_key_strength(self, config):
        """Verify encryption keys meet minimum length requirements."""
        assert len(config['encryption_key']) >= 256
```

**Cipher Suite Requirements:**

| Protocol | Minimum Version | Required | Status |
|----------|-----------------|----------|--------|
| TLS | 1.2 | Yes | Active |
| TLS | 1.3 | Preferred | Active |
| SSL | 3.0 | No | Disabled |
| SSL | 2.0 | No | Disabled |

### 2.1.3 A03:2021 – Injection

**Testing Matrix:**

| Injection Type | Test Method | Detection Tool | Auto-Remediation |
|----------------|-------------|----------------|------------------|
| SQL Injection | Parameterized queries | SQLMap, SonarQube | Input validation |
| NoSQL Injection | Query sanitization | Custom scanners | Schema validation |
| LDAP Injection | Input encoding | OWASP ZAP | Query whitelisting |
| OS Command Injection | Input validation | Semgrep | Command isolation |
| XSS (Reflected) | Output encoding | OWASP ZAP | CSP headers |
| XSS (Stored) | Input sanitization | Burp Suite | Content filtering |

**SQL Injection Test Example:**

```sql
-- Test Payloads for SQL Injection Detection
-- Category 1: Basic Injection
' OR '1'='1
' OR '1'='1'--
' OR '1'='1'/*
admin'--
1' ORDER BY 1--
1' ORDER BY 100--

-- Category 2: Union-Based
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--
' UNION SELECT username,password FROM users--

-- Category 3: Time-Based Blind
'; WAITFOR DELAY '0:0:5'--
' OR SLEEP(5)--
' OR pg_sleep(5)--

-- Category 4: Boolean-Based Blind
' AND 1=1--
' AND 1=2--
' AND (SELECT LENGTH(username) FROM users WHERE username='admin')>5--
```

### 2.1.4 A04:2021 – Insecure Design

**Design Review Checklist:**

| Checkpoint | Description | Verified |
|------------|-------------|----------|
| Threat Modeling | Complete threat model for all features | ☐ |
| Security Patterns | Apply established security patterns | ☐ |
| Defense in Depth | Multiple security layers implemented | ☐ |
| Fail-Safe Defaults | Secure defaults for all configurations | ☐ |
| Separation of Duties | No single point of failure | ☐ |

### 2.1.5 A05:2021 – Security Misconfiguration

**Configuration Hardening Tests:**

```yaml
security_configuration_checks:
  server_headers:
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY
    - X-XSS-Protection: "1; mode=block"
    - Strict-Transport-Security: max-age=31536000; includeSubDomains
    - Content-Security-Policy: default-src 'self'
  
  error_handling:
    - Custom error pages enabled
    - Stack traces disabled in production
    - Detailed errors logged server-side only
  
  default_credentials:
    - All default passwords changed
    - Default accounts disabled or removed
    - Sample applications removed
  
  unnecessary_features:
    - Directory listing disabled
    - Debug mode disabled
    - Unnecessary HTTP methods disabled
```

### 2.1.6 A06:2021 – Vulnerable and Outdated Components

See [Section 3: Dependency Scanning](#3-dependency-scanning)

### 2.1.7 A07:2021 – Identification and Authentication Failures

See [Section 5: Authentication Testing](#5-authentication-testing)

### 2.1.8 A08:2021 – Software and Data Integrity Failures

**Testing Requirements:**

| Test | Description | Tool |
|------|-------------|------|
| CI/CD Pipeline Security | Verify build pipeline integrity | Snyk, Trivy |
| Dependency Integrity | Verify package signatures | npm audit, pip check |
| Update Mechanism | Verify secure update channels | Custom scripts |
| Deserialization | Test for unsafe deserialization | SonarQube |

### 2.1.9 A09:2021 – Security Logging and Monitoring Failures

**Log Validation Tests:**

```python
class TestSecurityLogging:
    """Verify security events are properly logged."""
    
    def test_failed_login_logging(self, client):
        """Verify failed login attempts are logged."""
        response = client.post('/api/login', 
            json={'username': 'test', 'password': 'wrong'})
        
        logs = get_security_logs()
        assert any('LOGIN_FAILURE' in log for log in logs)
    
    def test_privilege_escalation_logging(self, client, auth_token):
        """Verify privilege escalation attempts are logged."""
        response = client.get('/api/admin/users',
            headers={'Authorization': f'Bearer {auth_token}'})
        
        logs = get_security_logs()
        assert any('PRIVILEGE_ESCALATION' in log for log in logs)
    
    def test_data_access_logging(self, client, auth_token):
        """Verify sensitive data access is logged."""
        response = client.get('/api/customers/123/sensitive-data',
            headers={'Authorization': f'Bearer {auth_token}'})
        
        logs = get_audit_logs()
        assert any('SENSITIVE_DATA_ACCESS' in log for log in logs)
```

### 2.1.10 A10:2021 – Server-Side Request Forgery (SSRF)

**SSRF Test Cases:**

| Test ID | Input | Expected Result |
|---------|-------|-----------------|
| SSRF-001 | http://169.254.169.254/latest/meta-data/ | Request blocked |
| SSRF-002 | http://localhost:8080/admin | Request blocked |
| SSRF-003 | http://internal-service:8080/data | Request blocked |
| SSRF-004 | file:///etc/passwd | Request blocked |
| SSRF-005 | http://attacker-controlled.com | Request blocked or validated |

## 2.2 Testing Methodology

### 2.2.1 Security Testing Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Testing Lifecycle                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │  Plan &  │───▶│  Execute │───▶│ Analyze  │───▶│ Remediate│ │
│  │  Define  │    │  Tests   │    │ Results  │    │ & Verify │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│       │                                              │         │
│       │         ┌──────────┐    ┌──────────┐        │         │
│       └────────▶│  Report  │◀───│   Track  │◀───────┘         │
│                 │  Results │    │  Metrics │                   │
│                 └──────────┘    └──────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2.2 Testing Phases

| Phase | Activities | Deliverables | Timeline |
|-------|------------|--------------|----------|
| **Phase 1: Reconnaissance** | Asset discovery, scope definition | Asset inventory, scope document | Week 1 |
| **Phase 2: Scanning** | Automated scans, dependency analysis | Scan reports, vulnerability list | Week 2 |
| **Phase 3: Assessment** | Manual testing, code review | Assessment findings | Week 3-4 |
| **Phase 4: Exploitation** | Penetration testing, proof of concept | Exploitation report | Week 5 |
| **Phase 5: Analysis** | Risk assessment, prioritization | Risk matrix, remediation plan | Week 6 |
| **Phase 6: Remediation** | Fix implementation, verification | Fix verification reports | Week 7-8 |
| **Phase 7: Reporting** | Final report, lessons learned | Executive summary, detailed report | Week 9 |

---

# 3. Dependency Scanning

## 3.1 Vulnerable Dependency Detection

### 3.1.1 Scanning Configuration

```yaml
# .snyk configuration
version: v1.25.0
severity-threshold: medium
exclude:
  - "**/test/**"
  - "**/tests/**"
  - "**/examples/**"
  - "**/node_modules/**"
license-policy:
  allowed:
    - MIT
    - Apache-2.0
    - BSD-2-Clause
    - BSD-3-Clause
    - ISC
  restricted:
    - GPL-2.0
    - GPL-3.0
  prohibited:
    - AGPL-3.0
    - SSPL-1.0
```

### 3.1.2 Dependency Scanning Matrix

| Package Manager | Tool | Frequency | Auto-Remediation | PR Gate |
|-----------------|------|-----------|------------------|---------|
| npm | Snyk, npm audit | Every commit | Yes | Yes |
| Maven/Gradle | Snyk, OWASP Dependency-Check | Every commit | Yes | Yes |
| pip | Safety, Snyk | Every commit | Yes | Yes |
| Docker | Trivy, Snyk Container | Every build | No | Yes |
| Terraform | tfsec, Checkov | Every commit | No | Yes |

### 3.1.3 Vulnerability Severity Classification

| Severity | CVSS Score | Response Time | Auto-Fix | Escalation |
|----------|------------|---------------|----------|------------|
| Critical | 9.0-10.0 | 24 hours | No | Immediate |
| High | 7.0-8.9 | 72 hours | Yes | Daily review |
| Medium | 4.0-6.9 | 7 days | Yes | Weekly review |
| Low | 0.1-3.9 | 30 days | No | Monthly review |
| Info | 0.0 | Best effort | No | None |

### 3.1.4 Vulnerable Dependency Remediation Process

```
┌──────────────────────────────────────────────────────────────┐
│              Vulnerable Dependency Remediation               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. DETECT                                                  │
│     ├── Automated scan identifies vulnerability              │
│     ├── CVE details captured                                 │
│     └── Severity assigned based on CVSS                     │
│                                                              │
│  2. ASSESS                                                  │
│     ├── Determine if vulnerability is exploitable           │
│     ├── Check for available patches                         │
│     └── Assess business impact                              │
│                                                              │
│  3. REMEDIATE                                               │
│     ├── Update to patched version                           │
│     ├── Apply workaround if no patch available              │
│     └── Replace dependency if necessary                     │
│                                                              │
│  4. VERIFY                                                  │
│     ├── Re-scan to confirm remediation                      │
│     ├── Run regression tests                                │
│     └── Update vulnerability tracker                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 3.2 License Compliance

### 3.2.1 License Policy

| Category | Licenses | Action |
|----------|----------|--------|
| **Permissive** | MIT, Apache-2.0, BSD, ISC | Auto-approve |
| **Weak Copyleft** | MPL-2.0, LGPL | Review required |
| **Copyleft** | GPL-2.0, GPL-3.0 | Legal review required |
| **Strong Copyleft** | AGPL-3.0, SSPL | Prohibited |
| **Unknown** | Other/Custom | Legal review required |

### 3.2.2 License Scanning Configuration

```json
{
  "license_scanning": {
    "enabled": true,
    "tools": ["license-checker", "fossology"],
    "rules": {
      "block_on": ["AGPL-3.0", "SSPL-1.0", "EUPL-1.1"],
      "warn_on": ["GPL-2.0", "GPL-3.0", "LGPL-2.1"],
      "ignore": ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause"]
    },
    "exclusions": {
      "test_dependencies": true,
      "dev_dependencies": false
    }
  }
}
```

---

# 4. Penetration Testing

## 4.1 Scope Definition

### 4.1.1 In-Scope Assets

| Asset Type | Components | Environment |
|------------|------------|-------------|
| Web Applications | MAP Portal, Admin Console | Staging, Production |
| APIs | REST API, GraphQL API | Staging, Production |
| Mobile Apps | iOS, Android | Staging |
| Infrastructure | AWS/Azure resources | Production |
| Third-party | Payment gateways, Auth providers | Staging |

### 4.1.2 Out-of-Scope Assets

| Asset Type | Reason | Alternative |
|------------|--------|-------------|
| Third-party SaaS | Contractual restrictions | Vendor assessment |
| Partner systems | No authorization | Partner review |
| Physical security | Not applicable | Physical security audit |

### 4.1.3 Testing Rules of Engagement

```yaml
rules_of_engagement:
  authorization:
    - Written authorization from CISO required
    - Emergency contact information documented
    - Incident response team notified
  
  testing_hours:
    primary: "09:00-17:00 UTC (Weekdays)"
    secondary: "20:00-02:00 UTC (Weekends)"
    emergency: "24/7 with approval"
  
  prohibited_actions:
    - Denial of service attacks
    - Data exfiltration
    - Social engineering without approval
    - Physical access attempts
  
  data_handling:
    - No production data access
    - Test data only
    - Secure deletion after engagement
  
  communication:
    - Daily status updates
    - Immediate critical finding notification
    - Weekly stakeholder briefings
```

## 4.2 Methodology

### 4.2.1 PTES (Penetration Testing Execution Standard)

| Phase | Activities | Duration | Deliverable |
|-------|------------|----------|-------------|
| **Pre-engagement** | Scope, rules, authorization | 1-2 weeks | Signed agreement |
| **Intelligence Gathering** | OSINT, network recon | 1 week | Target profile |
| **Threat Modeling** | Identify attack vectors | 1 week | Threat model |
| **Vulnerability Analysis** | Scanning, manual testing | 2 weeks | Vuln report |
| **Exploitation** | Prove vulnerabilities | 1 week | Exploit PoC |
| **Post-Exploitation** | Privilege escalation, persistence | 1 week | Impact assessment |
| **Reporting** | Document findings | 1 week | Final report |

### 4.2.2 Attack Vectors Testing

| Vector | Test Cases | Tools | Expected Output |
|--------|------------|-------|-----------------|
| **Network** | Port scanning, service enumeration | Nmap, Masscan | Service inventory |
| **Application** | OWASP Top 10, business logic | Burp Suite, OWASP ZAP | Vuln findings |
| **Authentication** | Brute force, credential stuffing | Hydra, Custom scripts | Auth bypass attempts |
| **Authorization** | IDOR, privilege escalation | Custom tools | Access control vulns |
| **API** | Injection, mass assignment | Postman, Custom scripts | API vulnerabilities |
| **Cloud** | Misconfiguration, IAM | ScoutSuite, Prowler | Cloud security gaps |

## 4.3 Reporting

### 4.3.1 Report Structure

```
┌──────────────────────────────────────────────────────────────┐
│                  Penetration Test Report                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. EXECUTIVE SUMMARY                                        │
│     ├── Engagement overview                                  │
│     ├── Risk summary (Critical/High/Medium/Low)             │
│     ├── Business impact assessment                          │
│     └── Recommendations summary                             │
│                                                              │
│  2. TECHNICAL FINDINGS                                       │
│     ├── Detailed vulnerability descriptions                 │
│     ├── Proof of concept code                               │
│     ├── Affected components                                 │
│     └── CVSS scoring                                        │
│                                                              │
│  3. METHODOLOGY                                              │
│     ├── Testing approach                                    │
│     ├── Tools used                                          │
│     ├── Scope limitations                                   │
│     └── Timeline                                            │
│                                                              │
│  4. REMEDIATION GUIDANCE                                     │
│     ├── Fix recommendations                                 │
│     ├── Priority ordering                                   │
│     ├── Validation steps                                    │
│     └── Prevention measures                                 │
│                                                              │
│  5. APPENDICES                                               │
│     ├── Raw scan results                                    │
│     ├── Test cases executed                                 │
│     └── Glossary                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.3.2 Finding Template

```markdown
## [SEVERITY] Finding Title

**Finding ID:** PT-YYYY-NNN
**CVSS Score:** X.X (Severity)
**CWE:** CWE-XXX
**OWASP:** AXX:YYYY

### Description
[Detailed description of the vulnerability]

### Affected Component
- **Application:** [Application name]
- **Endpoint/Function:** [Specific location]
- **Environment:** [Testing environment]

### Proof of Concept
[Step-by-step reproduction instructions with code/screenshots]

### Impact
[Business impact assessment]

### Remediation
[Specific fix recommendations]

### References
- [CVE links]
- [OWASP references]
- [Internal documentation]

### Verification
[Steps to verify the fix]
```

---

# 5. Authentication Testing

## 5.1 Login Mechanism Testing

### 5.1.1 Authentication Test Matrix

| Test Category | Test Case | Expected Result | Priority |
|--------------|-----------|-----------------|----------|
| **Basic Auth** | Valid credentials | Successful login | Critical |
| | Invalid credentials | Authentication failure | Critical |
| | Empty credentials | Validation error | High |
| | SQL injection in login | Blocked/filtered | Critical |
| **Password Policy** | Weak password rejected | Policy enforced | High |
| | Password complexity requirements | Validation applied | Medium |
| | Password history check | Reuse prevented | Medium |
| **Account Lockout** | After 5 failed attempts | Account locked (15 min) | High |
| | Lockout notification | Email/alert sent | Medium |
| | Lockout bypass attempt | Blocked | High |
| **Rate Limiting** | Brute force attempts | Rate limit enforced | Critical |
| | Distributed brute force | Global rate limit | High |

### 5.1.2 Authentication Flow Test Script

```python
import requests
import time
from typing import Dict, List

class AuthenticationTester:
    """Comprehensive authentication testing suite."""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.results = []
    
    def test_valid_login(self, username: str, password: str) -> Dict:
        """Test login with valid credentials."""
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"username": username, "password": password}
        )
        
        result = {
            "test": "valid_login",
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "has_token": "access_token" in response.json(),
            "token_expiry": response.json().get("expires_in")
        }
        self.results.append(result)
        return result
    
    def test_invalid_login(self, username: str, password: str) -> Dict:
        """Test login with invalid credentials."""
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"username": username, "password": password}
        )
        
        result = {
            "test": "invalid_login",
            "status_code": response.status_code,
            "correct_rejection": response.status_code in [401, 403],
            "no_token_leaked": "access_token" not in response.text
        }
        self.results.append(result)
        return result
    
    def test_brute_force_protection(self, username: str) -> Dict:
        """Test account lockout after multiple failed attempts."""
        attempts = []
        for i in range(10):
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"username": username, "password": f"wrong_{i}"}
            )
            attempts.append({
                "attempt": i + 1,
                "status_code": response.status_code,
                "locked": response.status_code == 423
            })
            if response.status_code == 423:
                break
        
        result = {
            "test": "brute_force_protection",
            "lockout_triggered": any(a["locked"] for a in attempts),
            "lockout_after": next(
                (a["attempt"] for a in attempts if a["locked"]), None
            )
        }
        self.results.append(result)
        return result
    
    def test_rate_limiting(self, username: str, password: str) -> Dict:
        """Test API rate limiting."""
        responses = []
        start_time = time.time()
        
        for i in range(100):
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"username": username, "password": password}
            )
            responses.append(response.status_code)
            if response.status_code == 429:
                break
        
        elapsed = time.time() - start_time
        result = {
            "test": "rate_limiting",
            "rate_limited": 429 in responses,
            "requests_before_limit": responses.index(429) if 429 in responses else len(responses),
            "time_elapsed": elapsed
        }
        self.results.append(result)
        return result
    
    def test_session_fixation(self, username: str, password: str) -> Dict:
        """Test for session fixation vulnerabilities."""
        # Get pre-login session
        pre_login_session = self.session.cookies.get("session_id")
        
        # Perform login
        self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"username": username, "password": password}
        )
        
        # Get post-login session
        post_login_session = self.session.cookies.get("session_id")
        
        result = {
            "test": "session_fixation",
            "session_regenerated": pre_login_session != post_login_session,
            "pre_login_session": pre_login_session,
            "post_login_session": post_login_session
        }
        self.results.append(result)
        return result
```

## 5.2 Session Management Testing

### 5.2.1 Session Security Checklist

| Check | Description | Requirement | Status |
|-------|-------------|-------------|--------|
| Session ID Entropy | Minimum 128 bits of randomness | Cryptographically secure | ☐ |
| Session Expiry | Maximum 30 minutes inactivity | Configurable | ☐ |
| Absolute Timeout | Maximum 24 hours | Hard limit | ☐ |
| Regeneration | After authentication | Mandatory | ☐ |
| Invalidation | On logout | Complete | ☐ |
| Secure Flag | HTTPS only | Required | ☐ |
| HttpOnly Flag | No JavaScript access | Required | ☐ |
| SameSite Flag | Lax or Strict | Required | ☐ |

### 5.2.2 Session Test Cases

```python
class SessionManagementTester:
    """Test session management security controls."""
    
    def test_session_token_entropy(self, session_token: str) -> Dict:
        """Verify session token has sufficient entropy."""
        import math
        from collections import Counter
        
        # Calculate Shannon entropy
        token_length = len(session_token)
        freq = Counter(session_token)
        entropy = -sum(
            (count/token_length) * math.log2(count/token_length)
            for count in freq.values()
        )
        
        # Minimum 4 bits of entropy per character
        min_entropy_bits = token_length * 4
        
        return {
            "test": "session_entropy",
            "token_length": token_length,
            "entropy_per_char": round(entropy, 2),
            "total_entropy": round(entropy * token_length, 2),
            "passes": entropy >= 4.0
        }
    
    def test_session_timeout(self, session_cookie: str) -> Dict:
        """Verify session timeout is enforced."""
        # Create session
        session = self.create_session()
        
        # Wait for timeout period
        time.sleep(1800)  # 30 minutes
        
        # Attempt to use session
        response = self.make_request(session)
        
        return {
            "test": "session_timeout",
            "expired": response.status_code == 401,
            "timeout_enforced": True
        }
    
    def test_concurrent_sessions(self, username: str) -> Dict:
        """Test concurrent session handling."""
        sessions = []
        
        # Create multiple sessions
        for i in range(5):
            session = self.login(username)
            sessions.append(session)
        
        # Verify session policy
        response = self.check_active_sessions(username)
        
        return {
            "test": "concurrent_sessions",
            "sessions_created": len(sessions),
            "policy_enforced": response.json().get("active_sessions", 0) <= 3
        }
```

## 5.3 Multi-Factor Authentication (MFA) Testing

### 5.3.1 MFA Implementation Requirements

| MFA Method | Requirement | Status |
|------------|-------------|--------|
| TOTP (RFC 6238) | Google Authenticator compatible | ☐ |
| SMS OTP | 6-digit, 5-minute expiry | ☐ |
| Email OTP | 6-digit, 10-minute expiry | ☐ |
| Hardware Token | FIDO2/WebAuthn support | ☐ |
| Backup Codes | 10 single-use codes | ☐ |

### 5.3.2 MFA Test Cases

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| MFA-001 | Enroll new device | Successful enrollment with verification |
| MFA-002 | Login with MFA | Token required and validated |
| MFA-003 | Invalid MFA token | Access denied |
| MFA-004 | Expired MFA token | Token rejected |
| MFA-005 | MFA bypass attempt | Blocked |
| MFA-006 | MFA device recovery | Secure recovery process |
| MFA-007 | Multiple device enrollment | Policy enforced |

---

# 6. Authorisation Testing

## 6.1 Role-Based Access Control (RBAC)

### 6.1.1 Role Definitions

| Role | Permissions | Restrictions |
|------|-------------|--------------|
| **Super Admin** | Full system access | Audit logging required |
| **Admin** | User management, configuration | Cannot modify super admin |
| **Manager** | View reports, approve workflows | Cannot manage users |
| **Operator** | Execute migrations, view data | Read-only for configs |
| **Viewer** | View-only access | No modifications |
| **Auditor** | Read-only, audit logs | No data modification |

### 6.1.2 RBAC Test Matrix

```python
class RBACTester:
    """Test role-based access control implementation."""
    
    ROLES_ENDPOINTS = {
        "super_admin": [
            ("GET", "/api/users", 200),
            ("POST", "/api/users", 201),
            ("DELETE", "/api/users/123", 204),
            ("PUT", "/api/config", 200),
        ],
        "admin": [
            ("GET", "/api/users", 200),
            ("POST", "/api/users", 201),
            ("DELETE", "/api/users/123", 403),
            ("PUT", "/api/config", 403),
        ],
        "operator": [
            ("GET", "/api/migrations", 200),
            ("POST", "/api/migrations", 201),
            ("GET", "/api/users", 403),
            ("DELETE", "/api/users/123", 403),
        ],
        "viewer": [
            ("GET", "/api/migrations", 200),
            ("POST", "/api/migrations", 403),
            ("GET", "/api/users", 403),
            ("DELETE", "/api/users/123", 403),
        ]
    }
    
    def test_role_access(self, role: str) -> List[Dict]:
        """Test access control for a specific role."""
        token = self.login_as_role(role)
        results = []
        
        for method, endpoint, expected_status in self.ROLES_ENDPOINTS[role]:
            response = self.make_request(method, endpoint, token)
            results.append({
                "role": role,
                "method": method,
                "endpoint": endpoint,
                "expected": expected_status,
                "actual": response.status_code,
                "pass": response.status_code == expected_status
            })
        
        return results
    
    def test_horizontal_privilege_escalation(self) -> Dict:
        """Test accessing resources of other users at same level."""
        user_a_token = self.login("user_a")
        user_b_token = self.login("user_b")
        
        # User A creates resource
        resource = self.create_resource(user_a_token)
        
        # User B attempts to access User A's resource
        response = self.access_resource(user_b_token, resource["id"])
        
        return {
            "test": "horizontal_privilege_escalation",
            "prevented": response.status_code == 403,
            "resource_id": resource["id"]
        }
    
    def test_vertical_privilege_escalation(self) -> Dict:
        """Test accessing admin functions as regular user."""
        operator_token = self.login_as_role("operator")
        
        admin_endpoints = [
            ("POST", "/api/admin/users"),
            ("DELETE", "/api/admin/users/123"),
            ("PUT", "/api/admin/config")
        ]
        
        escalation_attempts = []
        for method, endpoint in admin_endpoints:
            response = self.make_request(method, endpoint, operator_token)
            escalation_attempts.append({
                "endpoint": endpoint,
                "blocked": response.status_code in [401, 403]
            })
        
        return {
            "test": "vertical_privilege_escalation",
            "all_blocked": all(a["blocked"] for a in escalation_attempts),
            "details": escalation_attempts
        }
```

## 6.2 Insecure Direct Object References (IDOR)

### 6.2.1 IDOR Test Cases

| Test ID | Scenario | Method | Expected |
|---------|----------|--------|----------|
| IDOR-001 | Access other user's profile | GET | 403 Forbidden |
| IDOR-002 | Modify other user's data | PUT | 403 Forbidden |
| IDOR-003 | Delete other user's resource | DELETE | 403 Forbidden |
| IDOR-004 | Access admin resource as user | GET | 403 Forbidden |
| IDOR-005 | Sequential ID enumeration | GET | 403 Forbidden |
| IDOR-006 | UUID prediction | GET | 403 Forbidden |

### 6.2.2 IDOR Detection Script

```python
import requests
from typing import List, Dict

class IDORDetector:
    """Detect Insecure Direct Object Reference vulnerabilities."""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
    
    def test_sequential_ids(self, endpoint: str, 
                           valid_id: str, 
                           other_user_token: str) -> Dict:
        """Test access to resources using sequential IDs."""
        results = []
        
        # Try accessing resource with sequential IDs
        for i in range(1, 100):
            response = requests.get(
                f"{self.base_url}{endpoint}/{i}",
                headers={"Authorization": f"Bearer {other_user_token}"}
            )
            results.append({
                "id": i,
                "status": response.status_code,
                "accessible": response.status_code == 200
            })
        
        vulnerable = any(r["accessible"] for r in results)
        
        return {
            "test": "sequential_id_idor",
            "endpoint": endpoint,
            "vulnerable": vulnerable,
            "accessible_count": sum(1 for r in results if r["accessible"])
        }
    
    def test_id_enumeration(self, endpoint: str,
                           user_a_token: str,
                           user_b_token: str) -> Dict:
        """Test IDOR through ID enumeration."""
        # User A gets their resources
        response_a = requests.get(
            f"{self.base_url}{endpoint}",
            headers={"Authorization": f"Bearer {user_a_token}"}
        )
        resources_a = response_a.json()
        
        # User B tries to access User A's resources
        idor_results = []
        for resource in resources_a:
            response_b = requests.get(
                f"{self.base_url}{endpoint}/{resource['id']}",
                headers={"Authorization": f"Bearer {user_b_token}"}
            )
            idor_results.append({
                "resource_id": resource["id"],
                "accessed_by_b": response_b.status_code == 200
            })
        
        return {
            "test": "id_enumeration_idor",
            "vulnerable": any(r["accessed_by_b"] for r in idor_results),
            "resources_tested": len(resources_a),
            "resources_accessed": sum(1 for r in idor_results if r["accessed_by_b"])
        }
```

---

# 7. Secrets Validation

## 7.1 Hardcoded Secrets Detection

### 7.1.1 Secret Pattern Definitions

```yaml
secret_patterns:
  api_keys:
    - pattern: "api[_-]?key[_-]?[=:][\"']?[A-Za-z0-9]{32,}"
      severity: critical
      description: "API key detected"
    
    - pattern: "aws[_-]?access[_-]?key[_-]?id[_-]?[=:][\"']?AKIA[A-Z0-9]{16}"
      severity: critical
      description: "AWS access key detected"
    
    - pattern: "github[_-]?token[_-]?[=:][\"']?ghp_[A-Za-z0-9]{36}"
      severity: critical
      description: "GitHub token detected"
  
  passwords:
    - pattern: "password[_-]?[=:][\"']?[^\s\"']{8,}"
      severity: high
      description: "Hardcoded password detected"
    
    - pattern: "passwd[_-]?[=:][\"']?[^\s\"']{8,}"
      severity: high
      description: "Hardcoded password detected"
  
  connection_strings:
    - pattern: "mongodb(\+srv)?://[^\s\"']{10,}"
      severity: critical
      description: "MongoDB connection string detected"
    
    - pattern: "postgres(ql)?://[^\s\"']{10,}"
      severity: critical
      description: "PostgreSQL connection string detected"
    
    - pattern: "mysql://[^\s\"']{10,}"
      severity: critical
      description: "MySQL connection string detected"
  
  private_keys:
    - pattern: "-----BEGIN (RSA |EC )?PRIVATE KEY-----"
      severity: critical
      description: "Private key detected"
  
  tokens:
    - pattern: "bearer[_-]?[=:][\"']?eyJ[A-Za-z0-9_-]{10,}"
      severity: high
      description: "Bearer token detected"
    
    - pattern: "jwt[_-]?[=:][\"']?eyJ[A-Za-z0-9_-]{10,}"
      severity: high
      description: "JWT token detected"
```

### 7.1.2 Pre-Commit Hook Configuration

```python
#!/usr/bin/env python3
"""pre-commit hook for secrets detection."""

import re
import sys
import subprocess
from pathlib import Path

class SecretsDetector:
    """Detect hardcoded secrets in staged files."""
    
    SECRET_PATTERNS = {
        "API_KEY": r"(?i)api[_-]?key[_-]?[=:]\s*['\"]?[\w]{32,}",
        "PASSWORD": r"(?i)password[_-]?[=:]\s*['\"]?[^\s'\"]{8,}",
        "AWS_KEY": r"(?i)aws[_-]?access[_-]?key[_-]?id[_-]?[=:]\s*['\"]?AKIA[\w]{16}",
        "PRIVATE_KEY": r"-----BEGIN (RSA |EC )?PRIVATE KEY-----",
        "CONNECTION_STRING": r"(?i)(mongodb|postgres|mysql)://[^\s'\"]{10,}",
        "TOKEN": r"(?i)(bearer|jwt|token)[_:=]\s*['\"]?[\w.-]{20,}",
    }
    
    def __init__(self):
        self.findings = []
    
    def scan_file(self, filepath: Path) -> list:
        """Scan a file for secrets."""
        findings = []
        try:
            content = filepath.read_text(encoding='utf-8', errors='ignore')
            for line_num, line in enumerate(content.splitlines(), 1):
                for secret_type, pattern in self.SECRET_PATTERNS.items():
                    if re.search(pattern, line):
                        findings.append({
                            "file": str(filepath),
                            "line": line_num,
                            "type": secret_type,
                            "content": line.strip()[:100] + "..."
                        })
        except Exception as e:
            print(f"Error scanning {filepath}: {e}")
        return findings
    
    def run(self) -> int:
        """Run secrets detection on staged files."""
        staged_files = self.get_staged_files()
        
        for filepath in staged_files:
            findings = self.scan_file(Path(filepath))
            self.findings.extend(findings)
        
        if self.findings:
            self.report_findings()
            return 1  # Block commit
        
        return 0  # Allow commit
    
    def report_findings(self):
        """Report detected secrets."""
        print("\n" + "="*60)
        print("SECRETS DETECTED - COMMIT BLOCKED")
        print("="*60)
        
        for finding in self.findings:
            print(f"\nFile: {finding['file']}")
            print(f"Line: {finding['line']}")
            print(f"Type: {finding['type']}")
            print(f"Content: {finding['content']}")
        
        print("\n" + "="*60)
        print("Remove secrets and use environment variables or vault")
        print("="*60)

if __name__ == "__main__":
    detector = SecretsDetector()
    sys.exit(detector.run())
```

## 7.2 API Keys and Tokens

### 7.2.1 API Key Security Requirements

| Requirement | Implementation | Verification |
|-------------|----------------|--------------|
| Key Rotation | 90-day rotation | Automated check |
| Key Scoping | Minimum permissions | Audit review |
| Key Storage | Vault/secret manager | Configuration audit |
| Key Logging | Never logged | Code review |
| Key Transmission | HTTPS only | Network monitoring |

### 7.2.2 Environment Variable Validation

```python
import os
from typing import Dict, List, Optional

class EnvironmentValidator:
    """Validate environment variables for security."""
    
    REQUIRED_SECRETS = [
        "DATABASE_URL",
        "REDIS_URL",
        "JWT_SECRET",
        "API_SECRET_KEY",
        "ENCRYPTION_KEY",
    ]
    
    SENSITIVE_PATTERNS = {
        "hardcoded_url": r"(?i)(mongodb|postgres|mysql)://[^/\s]+:[^/\s]+@",
        "hardcoded_key": r"(?i)(key|secret|password)\s*=\s*['\"][^'\"]{8,}",
        "ip_address": r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b",
    }
    
    def validate_required_secrets(self) -> Dict[str, bool]:
        """Check all required secrets are set."""
        results = {}
        for secret in self.REQUIRED_SECRETS:
            value = os.environ.get(secret)
            results[secret] = {
                "set": value is not None,
                "not_empty": bool(value and value.strip()),
                "not_hardcoded": not self._is_hardcoded(value or "")
            }
        return results
    
    def _is_hardcoded(self, value: str) -> bool:
        """Check if value appears to be hardcoded."""
        import re
        for pattern_name, pattern in self.SENSITIVE_PATTERNS.items():
            if re.search(pattern, value):
                return True
        return False
    
    def validate_no_secrets_in_code(self, filepath: str) -> List[Dict]:
        """Scan code file for hardcoded secrets."""
        import re
        findings = []
        
        with open(filepath, 'r') as f:
            for line_num, line in enumerate(f, 1):
                for pattern_name, pattern in self.SENSITIVE_PATTERNS.items():
                    if re.search(pattern, line):
                        findings.append({
                            "file": filepath,
                            "line": line_num,
                            "pattern": pattern_name,
                            "content": line.strip()[:100]
                        })
        
        return findings
```

## 7.3 Connection Strings

### 7.3.1 Connection String Security Matrix

| Component | Secure Pattern | Insecure Pattern | Validation |
|-----------|----------------|------------------|------------|
| Database | `postgresql://${VAULT_DB_USER}:${VAULT_DB_PASS}@${DB_HOST}` | `postgresql://admin:password@localhost` | Regex check |
| Redis | `redis://:${VAULT_REDIS_PASS}@${REDIS_HOST}` | `redis://localhost:6379` | Format validation |
| MongoDB | `mongodb+srv://${VAULT_MONGO_USER}:${VAULT_MONGO_PASS}@cluster.mongodb.net` | `mongodb://admin:password@localhost` | URI parsing |
| Message Queue | `amqp://${VAULT_AMQP_USER}:${VAULT_AMQP_PASS}@${MQ_HOST}` | `amqp://guest:guest@localhost` | Schema validation |

### 7.3.2 Connection String Validation Script

```python
import re
from urllib.parse import urlparse
from typing import Dict, List

class ConnectionStringValidator:
    """Validate connection strings are not hardcoded."""
    
    INSECURE_PATTERNS = [
        r"(?i)password\s*[=:]\s*['\"]?[^\s'\"@]{3,}",
        r"(?i)pwd\s*[=:]\s*['\"]?[^\s'\"@]{3,}",
    ]
    
    def validate_connection_string(self, conn_string: str, 
                                   component: str) -> Dict:
        """Validate a connection string for security."""
        result = {
            "component": component,
            "valid_format": False,
            "uses_vault": False,
            "no_hardcoded_creds": True,
            "https_enforced": False,
            "findings": []
        }
        
        try:
            parsed = urlparse(conn_string)
            result["valid_format"] = True
            
            # Check for hardcoded credentials
            if parsed.password:
                result["no_hardcoded_creds"] = False
                result["findings"].append(
                    f"Hardcoded password detected in {component}"
                )
            
            # Check for vault references
            if "${" in conn_string or "%" in conn_string:
                result["uses_vault"] = True
            
            # Check for HTTPS
            if parsed.scheme in ["https", "mongodb+ssl", "postgresql+ssl"]:
                result["https_enforced"] = True
                
        except Exception as e:
            result["findings"].append(f"Invalid connection string format: {e}")
        
        return result
    
    def scan_codebase(self, directory: str) -> List[Dict]:
        """Scan codebase for connection string issues."""
        findings = []
        
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith(('.py', '.js', '.java', '.config', '.yml')):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        for line_num, line in enumerate(f, 1):
                            if any(re.search(p, line) for p in self.INSECURE_PATTERNS):
                                findings.append({
                                    "file": filepath,
                                    "line": line_num,
                                    "issue": "Potential hardcoded credentials"
                                })
        
        return findings
```

---

# 8. Vulnerability Assessment

## 8.1 Scanning Methodology

### 8.1.1 Vulnerability Scanning Schedule

| Scan Type | Frequency | Tools | Scope | Owner |
|-----------|-----------|-------|-------|-------|
| SAST (Static) | Every commit | SonarQube, Semgrep | Source code | Dev Team |
| DAST (Dynamic) | Daily | OWASP ZAP | Running application | Security Team |
| IAST (Interactive) | During QA | Contrast Security | QA environment | QA Team |
| Container | Every build | Trivy, Snyk | Docker images | DevOps |
| Infrastructure | Weekly | ScoutSuite, Prowler | Cloud resources | Cloud Team |
| Dependency | Every commit | Snyk, npm audit | Dependencies | Dev Team |

### 8.1.2 Vulnerability Severity Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                   Vulnerability Severity Matrix                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│           │  Impact                                              │
│           │  Low      Medium     High      Critical             │
│  ─────────┼────────────────────────────────────────────────────  │
│  Likeli-  │                                                      │
│  hood     │                                                      │
│           │                                                      │
│  High     │  Medium    High     Critical   Critical             │
│           │                                                      │
│  Medium   │  Low      Medium     High      Critical             │
│           │                                                      │
│  Low      │  Info      Low      Medium      High                │
│           │                                                      │
│  None     │  Info      Info      Low       Medium               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 8.2 Prioritization Framework

### 8.2.1 CVSS Scoring

```python
from enum import Enum
from typing import Dict

class Severity(Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"
    INFO = "Info"

class CVSSCalculator:
    """Calculate CVSS v3.1 scores for vulnerabilities."""
    
    def calculate_base_score(self, metrics: Dict) -> float:
        """Calculate CVSS base score."""
        # Attack Vector
        av_weights = {
            "network": 0.85,
            "adjacent": 0.62,
            "local": 0.55,
            "physical": 0.20
        }
        
        # Attack Complexity
        ac_weights = {
            "low": 0.77,
            "high": 0.44
        }
        
        # Privileges Required
        pr_weights = {
            "none": 0.85,
            "low": 0.62,
            "high": 0.27
        }
        
        # Impact scores
        impact_weights = {
            "high": 0.56,
            "low": 0.22,
            "none": 0.0
        }
        
        # Calculate exploitability
        exploitability = (
            8.22 * 
            av_weights[metrics["attack_vector"]] *
            ac_weights[metrics["attack_complexity"]] *
            pr_weights[metrics["privileges_required"]] *
            (1 if metrics["user_interaction"] == "none" else 0.85)
        )
        
        # Calculate impact
        impact = 7.52 * (
            impact_weights[metrics["confidentiality"]] +
            impact_weights[metrics["integrity"]] +
            impact_weights[metrics["availability"]]
        )
        
        # Calculate base score
        if impact <= 0:
            return 0.0
        
        base_score = min(
            exploitability + impact,
            10.0
        )
        
        return round(base_score, 1)
    
    def get_severity(self, score: float) -> Severity:
        """Map CVSS score to severity level."""
        if score >= 9.0:
            return Severity.CRITICAL
        elif score >= 7.0:
            return Severity.HIGH
        elif score >= 4.0:
            return Severity.MEDIUM
        elif score >= 0.1:
            return Severity.LOW
        else:
            return Severity.INFO
```

### 8.2.2 Remediation SLA

| Severity | Detection to Fix | Escalation | Approval |
|----------|------------------|------------|----------|
| Critical | 24 hours | Immediate | CISO |
| High | 72 hours | Daily | Security Lead |
| Medium | 7 days | Weekly | Team Lead |
| Low | 30 days | Monthly | None |
| Info | Best effort | Quarterly | None |

## 8.3 Remediation Tracking

### 8.3.1 Vulnerability Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Vulnerability Remediation Workflow              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │ Detected │───▶│ Triaged  │───▶│ Assigned │───▶│ In       │ │
│  │          │    │          │    │          │    │ Progress │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│       │                                              │         │
│       │         ┌──────────┐    ┌──────────┐        │         │
│       └────────▶│ Closed   │◀───│ Verified │◀───────┘         │
│                 │          │    │          │                   │
│                 └──────────┘    └──────────┘                   │
│                                                                  │
│  Status Transitions:                                             │
│  - Detected → Triaged (within 24 hours)                        │
│  - Triaged → Assigned (within 48 hours)                        │
│  - Assigned → In Progress (within SLA)                          │
│  - In Progress → Verified (after fix deployed)                  │
│  - Verified → Closed (after confirmation)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 9. Security Regression Testing

## 9.1 Regression Test Strategy

### 9.1.1 Security Regression Test Suite

| Category | Test Type | Frequency | Automation |
|----------|-----------|-----------|------------|
| Authentication | Login, MFA, Session | Every build | 100% |
| Authorization | RBAC, IDOR, Privilege | Every build | 95% |
| Input Validation | Injection, XSS | Every build | 100% |
| Configuration | Headers, CORS, TLS | Every build | 100% |
| Business Logic | Workflow security | Weekly | 80% |
| API Security | Rate limiting, Validation | Every build | 100% |

### 9.1.2 Regression Test Implementation

```python
import pytest
from security_tester import SecurityTester

class TestSecurityRegression:
    """Security regression test suite."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.tester = SecurityTester()
        self.tester.setup_test_environment()
        yield
        self.tester.cleanup()
    
    def test_sql_injection_prevention(self):
        """Regression: SQL injection must be prevented."""
        payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM users --"
        ]
        
        for payload in payloads:
            response = self.tester.send_request(
                endpoint="/api/users",
                params={"search": payload}
            )
            assert response.status_code == 400, \
                f"SQL injection not blocked: {payload}"
    
    def test_xss_prevention(self):
        """Regression: XSS must be prevented."""
        payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')"
        ]
        
        for payload in payloads:
            response = self.tester.send_request(
                endpoint="/api/comments",
                data={"content": payload}
            )
            assert payload not in response.text, \
                f"XSS not prevented: {payload}"
    
    def test_idor_prevention(self):
        """Regression: IDOR must be prevented."""
        user_a_token = self.tester.login("user_a")
        user_b_token = self.tester.login("user_b")
        
        resource = self.tester.create_resource(user_a_token)
        
        response = self.tester.access_resource(
            user_b_token, resource["id"]
        )
        assert response.status_code == 403, \
            "IDOR vulnerability detected"
    
    def test_session_fixation_prevention(self):
        """Regression: Session fixation must be prevented."""
        pre_session = self.tester.get_session_id()
        
        self.tester.login("test_user")
        
        post_session = self.tester.get_session_id()
        
        assert pre_session != post_session, \
            "Session not regenerated after login"
    
    def test_rate_limiting_enforced(self):
        """Regression: Rate limiting must be enforced."""
        responses = []
        for i in range(100):
            response = self.tester.send_request(endpoint="/api/login")
            responses.append(response.status_code)
        
        assert 429 in responses, \
            "Rate limiting not enforced"
```

## 9.2 Continuous Security Testing

### 9.2.1 CI/CD Security Gates

```yaml
# .github/workflows/security.yml
name: Security Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-testing:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Run SAST (SonarQube)
        uses: sonarqube-scanner-action@v2
        with:
          args: >
            -Dsonar.projectKey=map
            -Dsonar.sources=.
            -Dsonar.host.url=${{ secrets.SONAR_HOST }}
      
      - name: Run Dependency Scan (Snyk)
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Run Secret Scanning (Gitleaks)
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Run Container Scan (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: map:${{ github.sha }}
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
      
      - name: Run DAST (OWASP ZAP)
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: ${{ secrets.STAGING_URL }}
      
      - name: Security Gate
        if: failure()
        run: |
          echo "Security tests failed! Blocking merge."
          exit 1
```

---

# 10. Security Tools Configuration

## 10.1 OWASP ZAP Configuration

### 10.1.1 ZAP Scan Profiles

```yaml
# zap-config.yml
env:
  contexts:
    - name: "MAP Application"
      urls:
        - "https://staging.map.internal"
      includePaths:
        - "https://staging.map.internal/api/*"
      excludePaths:
        - "https://staging.map.internal/api/health"
        - "https://staging.map.internal/api/metrics"
  
  parameters:
    failOnError: true
    progressToStdout: true

  policies:
    - name: "MAP Security Policy"
      rules:
        # SQL Injection
        - id: 40018
          strength: "HIGH"
          threshold: "LOW"
        
        # XSS
        - id: 40012
          strength: "HIGH"
          threshold: "LOW"
        
        # Path Traversal
        - id: 6
          strength: "HIGH"
          threshold: "LOW"
        
        # Remote File Inclusion
        - id: 7
          strength: "HIGH"
          threshold: "LOW"

  scanner:
    maxScanDurationInMins: 60
    maxRuleDurationInMins: 5
    threadPerHost: 5

  reports:
    - name: "HTML Report"
      template: "traditional-html"
      outputDir: "./reports/zap"
    
    - name: "JSON Report"
      template: "json"
      outputDir: "./reports/zap"
```

### 10.1.2 ZAP Automation Script

```python
from zapv2 import ZAPv2
import time
import json

class ZAPScanner:
    """Automated OWASP ZAP scanning for MAP."""
    
    def __init__(self, api_key: str, target: str):
        self.zap = ZAPv2(
            apikey=api_key,
            proxies={'http': 'http://127.0.0.1:8080'}
        )
        self.target = target
        self.scan_id = None
    
    def passive_scan(self) -> dict:
        """Run passive scan on target."""
        self.zap.urlopen(self.target)
        time.sleep(2)
        
        while int(self.zap.pscan.records_to_scan) > 0:
            time.sleep(2)
        
        return {
            "alerts": self.zap.pscan.alerts(),
            "summary": self.zap.pscan.alerts_summary()
        }
    
    def active_scan(self) -> dict:
        """Run active scan on target."""
        self.scan_id = self.zap.ascan.scan(self.target)
        
        while int(self.zap.ascan.status(self.scan_id)) < 100:
            time.sleep(5)
            progress = self.zap.ascan.status(self.scan_id)
            print(f"Scan progress: {progress}%")
        
        return {
            "alerts": self.zap.ascan.alerts(self.scan_id),
            "results": self.zap.ascan.results(self.scan_id)
        }
    
    def spider_scan(self) -> dict:
        """Run spider to discover URLs."""
        scan_id = self.zap.spider.scan(self.target)
        
        while int(self.zap.spider.status(scan_id)) < 100:
            time.sleep(2)
        
        return {
            "urls_found": self.zap.spider.results(scan_id),
            "total_urls": len(self.zap.spider.results(scan_id))
        }
    
    def generate_report(self) -> str:
        """Generate HTML report."""
        report = self.zap.core.htmlreport()
        
        with open("zap_report.html", "w") as f:
            f.write(report)
        
        return "zap_report.html"
    
    def run_full_scan(self) -> dict:
        """Execute complete ZAP scan workflow."""
        print("Starting spider scan...")
        spider_results = self.spider_scan()
        
        print("Running passive scan...")
        passive_results = self.passive_scan()
        
        print("Running active scan...")
        active_results = self.active_scan()
        
        print("Generating report...")
        report_path = self.generate_report()
        
        return {
            "spider": spider_results,
            "passive": passive_results,
            "active": active_results,
            "report": report_path
        }
```

## 10.2 Snyk Configuration

### 10.2.1 Snyk Project Configuration

```json
{
  "name": "map-security-testing",
  "version": "1.0.0",
  "snyk": true,
  "snykPolicy": {
    "ignore": {
      "SNYK-JS-LODASH-567746": [
        {
          "reason": "Not exploitable in our context",
          "expires": "2026-12-31",
          "created": "2026-07-01"
        }
      ]
    },
    "patch": {},
    "upgrade": {},
    "license": {
      "allow": ["MIT", "Apache-2.0", "BSD-2-Clause"],
      "rules": {
        "AGPL-3.0": "deny",
        "GPL-3.0": "deny"
      }
    }
  }
}
```

### 10.2.2 Snyk CLI Integration

```bash
#!/bin/bash
# snyk-scan.sh - Comprehensive Snyk scanning script

set -e

echo "=== MAP Security Scan ==="
echo "Date: $(date)"
echo "Version: $(git describe --tags --always)"
echo ""

# Test for vulnerabilities
echo "1. Testing for vulnerabilities..."
snyk test --all-projects --severity-threshold=high \
  --json-file-output=snyk-vuln.json

# Monitor for new vulnerabilities
echo "2. Monitoring for new vulnerabilities..."
snyk monitor --all-projects --file=package.json

# Test container image
echo "3. Scanning container image..."
snyk container test map:${VERSION} \
  --file=Dockerfile \
  --severity-threshold=high

# Test infrastructure as code
echo "4. Scanning infrastructure code..."
snyk iac test \
  --severity-threshold=high \
  terraform/

echo ""
echo "=== Scan Complete ==="
```

## 10.3 SonarQube Configuration

### 10.3.1 SonarQube Project Properties

```properties
# sonar-project.properties
sonar.projectKey=map
sonar.projectName=Migration Assurance Platform
sonar.projectVersion=1.0

# Source code
sonar.sources=src
sonar.tests=tests
sonar.exclusions=**/node_modules/**,**/vendor/**

# Languages
sonar.sources.js=src/**/*.js
sonar.sources.ts=src/**/*.ts
sonar.sources.python=src/**/*.py
sonar.sources.java=src/**/*.java

# Encoding
sonar.sourceEncoding=UTF-8

# Quality Gate
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300

# Security rules
sonar.securityscan=true
sonar.securityscan.rules=SOLID,OWASP_TOP_10,CWE_TOP_25
```

### 10.3.2 SonarQube Quality Gate Configuration

```json
{
  "name": "MAP Security Gate",
  "conditions": [
    {
      "metric": "new_security_rating",
      "operator": "GT",
      "error_threshold": "1"
    },
    {
      "metric": "new_reliability_rating",
      "operator": "GT",
      "error_threshold": "1"
    },
    {
      "metric": "new_maintainability_rating",
      "operator": "GT",
      "error_threshold": "1"
    },
    {
      "metric": "new_coverage",
      "operator": "LT",
      "error_threshold": "80"
    },
    {
      "metric": "new_duplicated_lines_density",
      "operator": "GT",
      "error_threshold": "3"
    }
  ]
}
```

## 10.4 GitHub Advanced Security

### 10.4.1 Code Scanning Configuration

```yaml
# .github/workflows/codeql-analysis.yml
name: "CodeQL Analysis"

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday 6am

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    
    strategy:
      fail-fast: false
      matrix:
        language: ['javascript', 'python']
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
          queries: security-extended
      
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          category: "/language:${{ matrix.language }}"
```

### 10.4.2 Secret Scanning Configuration

```yaml
# .github/secret-scanning.yml
custom_patterns:
  MAP_API_KEY:
    pattern: 'map[_-]?api[_-]?key[_-]?[=:][\"'\'']?\w{32,}'
    confidence: high
  
  MAP_JWT_SECRET:
    pattern: 'map[_-]?jwt[_-]?secret[_-]?[=:][\"'\'']?\w{32,}'
    confidence: high
  
  DATABASE_URL:
    pattern: 'postgresql://[^/\s]+:[^/\s]+@[^/\s]+/[^\s]+'
    confidence: medium

allow_list:
  - pattern: 'example[_-]?api[_-]?key[_-]?[=:]test'
    reason: 'Test fixture'
  
  - pattern: 'password[_-]?[=:]test'
    reason: 'Test fixture'
```

### 10.4.3 Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    labels:
      - "security"
      - "dependencies"
    allow:
      - dependency-type: "production"
    ignore:
      - dependency-name: "lodash"
        update-types:
          - "version-update:semver-patch"
  
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
  
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

# 11. Security Metrics

## 11.1 Key Performance Indicators (KPIs)

### 11.1.1 Vulnerability Metrics

| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **Vulnerability Density** | Vulns per 1000 LOC | < 2 | Monthly |
| **Critical Vulns Open** | Open critical vulnerabilities | 0 | Daily |
| **High Vulns Open** | Open high vulnerabilities | < 5 | Weekly |
| **Mean Time to Detect** | Time from introduction to detection | < 24 hours | Monthly |
| **Mean Time to Remediate** | Time from detection to fix | < 72 hours (Critical) | Monthly |
| **Reopen Rate** | % of fixes that fail verification | < 5% | Monthly |
| **False Positive Rate** | % of reported vulns that are false | < 10% | Monthly |

### 11.1.2 Security Testing Coverage

| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **SAST Coverage** | % of code scanned by SAST | 100% | Weekly |
| **DAST Coverage** | % of endpoints tested | 100% | Weekly |
| **Dependency Coverage** | % of deps scanned | 100% | Weekly |
| **Container Coverage** | % of images scanned | 100% | Weekly |
| **Security Test Coverage** | % of security tests passing | > 95% | Daily |

### 11.1.3 Security Metrics Dashboard

```python
from datetime import datetime, timedelta
from typing import Dict, List
import json

class SecurityMetricsCollector:
    """Collect and calculate security metrics."""
    
    def __init__(self, db_connection):
        self.db = db_connection
    
    def get_vulnerability_metrics(self, period_days: int = 30) -> Dict:
        """Calculate vulnerability metrics for the period."""
        start_date = datetime.now() - timedelta(days=period_days)
        
        vulnerabilities = self.db.query("""
            SELECT 
                severity,
                status,
                created_at,
                resolved_at,
                reopened_at
            FROM vulnerabilities
            WHERE created_at >= %s
        """, (start_date,))
        
        total_vulns = len(vulnerabilities)
        critical_vulns = sum(1 for v in vulnerabilities if v['severity'] == 'critical')
        high_vulns = sum(1 for v in vulnerabilities if v['severity'] == 'high')
        
        # Calculate mean time to remediate
        remediation_times = []
        for v in vulnerabilities:
            if v['resolved_at']:
                created = v['created_at']
                resolved = v['resolved_at']
                remediation_times.append((resolved - created).total_seconds() / 3600)
        
        mttr = sum(remediation_times) / len(remediation_times) if remediation_times else 0
        
        return {
            "period": f"Last {period_days} days",
            "total_vulnerabilities": total_vulns,
            "critical_open": critical_vulns,
            "high_open": high_vulns,
            "mean_time_to_remediate_hours": round(mttr, 2),
            "remediation_rate": self._calculate_remediation_rate(vulnerabilities),
            "reopen_rate": self._calculate_reopen_rate(vulnerabilities)
        }
    
    def get_testing_coverage(self) -> Dict:
        """Calculate security testing coverage metrics."""
        total_code_lines = self._get_total_loc()
        scanned_lines = self._get_scanned_loc()
        
        total_endpoints = self._get_total_endpoints()
        tested_endpoints = self._get_tested_endpoints()
        
        total_dependencies = self._get_total_dependencies()
        scanned_dependencies = self._get_scanned_dependencies()
        
        return {
            "sast_coverage": round(scanned_lines / total_code_lines * 100, 2),
            "dast_coverage": round(tested_endpoints / total_endpoints * 100, 2),
            "dependency_coverage": round(scanned_dependencies / total_dependencies * 100, 2),
            "security_tests_passing": self._get_security_test_pass_rate(),
            "code_coverage": self._get_code_coverage()
        }
    
    def generate_executive_report(self) -> Dict:
        """Generate executive security report."""
        vuln_metrics = self.get_vulnerability_metrics()
        testing_metrics = self.get_testing_coverage()
        
        return {
            "report_date": datetime.now().isoformat(),
            "vulnerability_summary": vuln_metrics,
            "testing_coverage": testing_metrics,
            "risk_score": self._calculate_risk_score(vuln_metrics, testing_metrics),
            "recommendations": self._generate_recommendations(vuln_metrics, testing_metrics)
        }
    
    def _calculate_remediation_rate(self, vulnerabilities: List) -> float:
        """Calculate percentage of vulnerabilities remediated."""
        if not vulnerabilities:
            return 0.0
        
        remediated = sum(1 for v in vulnerabilities if v['status'] == 'resolved')
        return round(remediated / len(vulnerabilities) * 100, 2)
    
    def _calculate_reopen_rate(self, vulnerabilities: List) -> float:
        """Calculate percentage of fixes that were reopened."""
        if not vulnerabilities:
            return 0.0
        
        reopened = sum(1 for v in vulnerabilities if v['reopened_at'])
        resolved = sum(1 for v in vulnerabilities if v['resolved_at'])
        
        if resolved == 0:
            return 0.0
        
        return round(reopened / resolved * 100, 2)
    
    def _calculate_risk_score(self, vuln_metrics: Dict, 
                              testing_metrics: Dict) -> str:
        """Calculate overall risk score."""
        critical_weight = 10
        high_weight = 5
        medium_weight = 2
        low_weight = 1
        
        score = (
            vuln_metrics.get('critical_open', 0) * critical_weight +
            vuln_metrics.get('high_open', 0) * high_weight
        )
        
        # Adjust based on testing coverage
        coverage_factor = (
            testing_metrics.get('sast_coverage', 0) +
            testing_metrics.get('dast_coverage', 0) +
            testing_metrics.get('dependency_coverage', 0)
        ) / 300
        
        adjusted_score = score * (1 - coverage_factor)
        
        if adjusted_score == 0:
            return "LOW"
        elif adjusted_score < 10:
            return "MEDIUM"
        elif adjusted_score < 50:
            return "HIGH"
        else:
            return "CRITICAL"
```

## 11.2 Reporting Cadence

| Report | Audience | Frequency | Content |
|--------|----------|-----------|---------|
| Daily Security Brief | Security Team | Daily | Open critical/high vulns, active scans |
| Weekly Security Report | Engineering Leads | Weekly | Vuln trends, test coverage, SLA compliance |
| Monthly Security Dashboard | CISO, Management | Monthly | KPIs, risk score, compliance status |
| Quarterly Security Review | Board, Auditors | Quarterly | Executive summary, improvements, roadmap |
| Annual Security Assessment | External Auditors | Annual | Comprehensive security posture |

---

# 12. Compliance Alignment

## 12.1 GDPR Compliance

### 12.1.1 GDPR Security Testing Requirements

| Article | Requirement | Testing Approach | Evidence |
|---------|-------------|------------------|----------|
| Art. 25 | Data Protection by Design | Code review for data minimization | Review logs |
| Art. 32 | Security of Processing | Penetration testing, vulnerability scans | Scan reports |
| Art. 33 | Breach Notification | Incident response testing | DR test logs |
| Art. 35 | DPIA | Threat modeling | Threat model docs |
| Art. 5(1)(f) | Integrity & Confidentiality | Access control testing | RBAC test results |

### 12.1.2 GDPR Data Protection Test Cases

```python
class GDPRComplianceTester:
    """Test GDPR compliance requirements."""
    
    def test_data_encryption(self, database_connection) -> Dict:
        """Verify personal data is encrypted at rest."""
        tables_with_pii = self.get_pii_tables(database_connection)
        
        encryption_results = []
        for table in tables_with_pii:
            is_encrypted = self.check_encryption(table)
            encryption_results.append({
                "table": table,
                "encrypted": is_encrypted
            })
        
        return {
            "test": "data_encryption_at_rest",
            "tables_checked": len(encryption_results),
            "all_encrypted": all(r["encrypted"] for r in encryption_results),
            "details": encryption_results
        }
    
    def test_data_minimization(self, api_endpoints) -> Dict:
        """Verify API responses only return necessary data."""
        minimization_results = []
        
        for endpoint in api_endpoints:
            response = self.make_request(endpoint)
            returned_fields = set(response.json().keys())
            expected_fields = self.get_expected_fields(endpoint)
            
            extra_fields = returned_fields - expected_fields
            minimization_results.append({
                "endpoint": endpoint,
                "extra_fields": list(extra_fields),
                "compliant": len(extra_fields) == 0
            })
        
        return {
            "test": "data_minimization",
            "all_compliant": all(r["compliant"] for r in minimization_results),
            "details": minimization_results
        }
    
    def test_right_to_erasure(self, user_id: str) -> Dict:
        """Test right to erasure (forget) functionality."""
        # Request deletion
        response = self.request_erasure(user_id)
        
        # Verify data is deleted
        remaining_data = self.check_user_data(user_id)
        
        return {
            "test": "right_to_erasure",
            "deletion_requested": response.status_code == 202,
            "data_deleted": len(remaining_data) == 0,
            "remaining_data": remaining_data
        }
```

## 12.2 SOC 2 Compliance

### 12.2.1 SOC 2 Trust Service Criteria Mapping

| Criteria | Description | Security Testing Activities | Evidence |
|----------|-------------|----------------------------|----------|
| CC6.1 | Logical Access Controls | RBAC testing, access reviews | Access control test results |
| CC6.2 | Authentication | MFA testing, credential policies | Authentication test results |
| CC6.3 | Authorization | Privilege escalation testing | Authorization test results |
| CC6.6 | Security Events | Logging, monitoring verification | Log validation tests |
| CC7.1 | Vulnerability Management | Vulnerability scanning | Scan reports, remediation logs |
| CC7.2 | Incident Response | IR testing, tabletop exercises | IR test reports |

### 12.2.2 SOC 2 Security Control Testing

```python
class SOC2ControlTester:
    """Test SOC 2 security controls."""
    
    def test_logical_access_controls(self) -> Dict:
        """CC6.1: Test logical access controls."""
        controls = {
            "access_provisioning": self.test_access_provisioning(),
            "access_review": self.test_periodic_access_review(),
            "access_removal": self.test_access_removal(),
            "least_privilege": self.test_least_privilege()
        }
        
        return {
            "control": "CC6.1",
            "description": "Logical Access Controls",
            "tested": True,
            "results": controls,
            "passed": all(c["passed"] for c in controls.values())
        }
    
    def test_vulnerability_management(self) -> Dict:
        """CC7.1: Test vulnerability management."""
        controls = {
            "vulnerability_scanning": self.test_vulnerability_scanning(),
            "remediation_process": self.test_remediation_process(),
            "patch_management": self.test_patch_management(),
            "security_monitoring": self.test_security_monitoring()
        }
        
        return {
            "control": "CC7.1",
            "description": "System Vulnerabilities",
            "tested": True,
            "results": controls,
            "passed": all(c["passed"] for c in controls.values())
        }
    
    def test_incident_response(self) -> Dict:
        """CC7.2: Test incident response capabilities."""
        controls = {
            "detection_capabilities": self.test_detection(),
            "response_procedures": self.test_response_procedures(),
            "communication_plan": self.test_communication_plan(),
            "recovery_procedures": self.test_recovery_procedures()
        }
        
        return {
            "control": "CC7.2",
            "description": "Incident Response",
            "tested": True,
            "results": controls,
            "passed": all(c["passed"] for c in controls.values())
        }
```

## 12.3 ISO 27001 Alignment

### 12.3.1 ISO 27001 Control Mapping

| Control | Objective | Testing Activities | Evidence |
|---------|-----------|-------------------|----------|
| A.12.2.1 | Controls Against Malware | Malware scanning, endpoint protection | Scan reports |
| A.12.4.1 | Event Logging | Log configuration review, log integrity | Log audit results |
| A.12.6.1 | Technical Vulnerability Management | Vulnerability scanning, penetration testing | Scan and pen test reports |
| A.12.6.2 | Restrictions on Software Installation | Software inventory, installation controls | Software audit |
| A.13.1.1 | Network Controls | Network segmentation testing, firewall rules | Network test results |
| A.14.2.1 | Secure Development Policy | SDLC review, security training records | Policy documents |
| A.14.2.5 | Secure System Architecture | Architecture review, threat modeling | Architecture documents |

### 12.3.2 ISO 27001 Security Testing Checklist

```yaml
iso_27001_testing:
  section_a_12:
    - control: "A.12.2.1"
      name: "Controls Against Malware"
      tests:
        - malware_detection_enabled
        - antivirus_up_to_date
        - real_time_protection
        - scan_schedules_configured
    
    - control: "A.12.4.1"
      name: "Event Logging"
      tests:
        - logging_enabled
        - log_retention_configured
        - log_integrity_protected
        - critical_events_captured
    
    - control: "A.12.6.1"
      name: "Technical Vulnerability Management"
      tests:
        - vulnerability_scanning_scheduled
        - vulnerability_assessment_performed
        - remediation_timely
        - patch_management_process
  
  section_a_13:
    - control: "A.13.1.1"
      name: "Network Controls"
      tests:
        - network_segmentation
        - firewall_rules_reviewed
        - vpn_configured
        - network_monitoring
  
  section_a_14:
    - control: "A.14.2.1"
      name: "Secure Development Policy"
      tests:
        - sdlc_defined
        - security_training_completed
        - code_review_process
        - security_testing_integrated
```

---

# 13. Appendices

## Appendix A: Security Testing Tools Reference

| Tool | Purpose | Integration | License |
|------|---------|-------------|---------|
| OWASP ZAP | DAST, API Testing | CI/CD, Manual | Open Source |
| Snyk | Dependency Scanning | CI/CD, IDE | Free Tier + Paid |
| SonarQube | SAST, Code Quality | CI/CD | Community + Enterprise |
| GitHub Advanced Security | Code Scanning, Secret Detection | GitHub | Included with GHES |
| Burp Suite | Penetration Testing | Manual | Commercial |
| Trivy | Container Scanning | CI/CD | Open Source |
| Semgrep | SAST, Custom Rules | CI/CD | Open Source |
| tfsec | Infrastructure Scanning | CI/CD | Open Source |
| Checkov | IaC Scanning | CI/CD | Open Source |
| Nuclei | Vulnerability Scanning | Manual | Open Source |

## Appendix B: Security Test Case Templates

```markdown
## Test Case Template

**Test ID:** ST-XXXX
**Title:** [Test Title]
**Category:** [Authentication/Authorization/Input Validation/etc.]
**Priority:** [Critical/High/Medium/Low]

### Objective
[What this test validates]

### Preconditions
- [List prerequisites]

### Test Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Result
[What should happen]

### Actual Result
[What actually happened]

### Status
[Pass/Fail/Blocked]

### Evidence
[Screenshots, logs, responses]

### Tester
[Name]

### Date
[Date tested]
```

## Appendix C: Incident Response Testing Scenarios

| Scenario | Objective | Participants | Frequency |
|----------|-----------|--------------|-----------|
| Data Breach | Test detection and response | SOC, Legal, Execs | Quarterly |
| Ransomware | Test recovery procedures | IT, Security, Management | Semi-annually |
| DDoS | Test mitigation capabilities | Network, Security | Quarterly |
| Insider Threat | Test detection and containment | HR, Security, Legal | Annually |
| Supply Chain | Test vendor compromise response | Security, Procurement | Annually |

## Appendix D: Glossary

| Term | Definition |
|------|------------|
| ASVS | Application Security Verification Standard |
| CVSS | Common Vulnerability Scoring System |
| DAST | Dynamic Application Security Testing |
| IDOR | Insecure Direct Object Reference |
| MFA | Multi-Factor Authentication |
| RBAC | Role-Based Access Control |
| SAST | Static Application Security Testing |
| SBOM | Software Bill of Materials |
| SSRF | Server-Side Request Forgery |
| TOCTOU | Time-of-Check to Time-of-Use |
| XSS | Cross-Site Scripting |

---

**Document End**

*For questions about this document, contact the Security Engineering Team at security-engineering@map.internal*