# Security Implementation Checklist

**Document:** MAP MVP Security Implementation Checklist
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

This document provides a comprehensive security implementation checklist for MAP, organized by security domain. Each item includes implementation steps, verification method, owner, and status tracking.

---

## 1. Authentication

### 1.1 Entra ID Configuration

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Register MAP application in Entra ID | Navigate to Azure Portal > Entra ID > App registrations > New registration. Configure redirect URIs for SPA and web. | Verify app appears in app list with correct configuration | DevOps | Pending |
| Configure OAuth 2.0 permissions | Add API permissions for Microsoft Graph (User.Read, Directory.Read.All). Grant admin consent. | Verify permissions granted in API permissions blade | DevOps | Pending |
| Set up application credentials | Create client secret or certificate for confidential client flow. Store in Key Vault. | Verify secret/certificate created and accessible from Key Vault | DevOps | Pending |
| Configure token lifetime policies | Set access token lifetime to 1 hour, refresh token to 24 hours. Configure inactive session timeout. | Verify token expiration in test authentication | DevOps | Pending |
| Enable conditional access policies | Configure MFA requirements, device compliance policies, and location-based restrictions. | Test MFA prompt on login from new device | Security | Pending |

### 1.2 OAuth 2.0 / OIDC Setup

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement Authorization Code flow with PKCE | Configure MSAL.js for SPA with PKCE. Use code_verifier and code_challenge. | Verify PKCE flow in browser developer tools | Backend | Pending |
| Configure OIDC metadata endpoint | Set up /.well-known/openid-configuration for token validation. | Verify OIDC metadata accessible at correct URL | Backend | Pending |
| Implement token refresh logic | Create silent token renewal using refresh tokens. Handle token expiration gracefully. | Test token refresh without user interaction | Backend | Pending |
| Configure CORS for auth endpoints | Whitelist frontend origins for CORS. Configure allowed headers and methods. | Verify CORS headers in auth response | DevOps | Pending |

### 1.3 Token Configuration

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement JWT validation middleware | Validate issuer, audience, expiration, and signature on every request. | Verify invalid tokens rejected with 401 | Backend | Pending |
| Configure token storage | Store access tokens in memory only. Store refresh tokens in httpOnly cookies. | Verify tokens not accessible via JavaScript | Frontend | Pending |
| Implement token revocation | Support logout by clearing tokens and revoking refresh tokens with Entra ID. | Verify token invalidation after logout | Backend | Pending |

### 1.4 MFA Enforcement

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Enable MFA for all users | Configure Entra ID conditional access to require MFA for all MAP users. | Verify MFA prompt on first login | Security | Pending |
| Configure MFA methods | Allow Microsoft Authenticator, SMS, and voice call as MFA methods. | Verify each MFA method works correctly | Security | Pending |
| Implement MFA registration flow | Guide users through MFA setup on first login. Provide fallback options. | Test complete MFA registration flow | Frontend | Pending |

### 1.5 Session Management

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement session timeout | Configure 30-minute inactive session timeout. Show warning before timeout. | Verify session expires after inactivity | Backend | Pending |
| Configure session storage | Use server-side session store (Redis or database). Do not store session in localStorage. | Verify session data not in browser storage | Backend | Pending |
| Implement concurrent session control | Limit to 3 concurrent sessions per user. Invalidate oldest session when limit exceeded. | Test concurrent session limits | Backend | Pending |

---

## 2. Authorization

### 2.1 RBAC Implementation

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Define role hierarchy | Create Admin > Migrator > Viewer role hierarchy. Admin has all permissions. | Verify role hierarchy in authorization service | Backend | Pending |
| Implement role-based middleware | Create [Authorize(Roles = "Admin")] attributes on controllers. | Verify non-admin users cannot access admin endpoints | Backend | Pending |
| Configure role assignment | Allow Admin users to assign roles. Limit role changes to Admin role only. | Verify only Admin can modify user roles | Backend | Pending |

### 2.2 Role Definitions

| Role | Permissions | Implementation |
|------|-------------|----------------|
| Admin | Full access: manage users, settings, policies, view audit logs | [Authorize(Roles = "Admin")] |
| Migrator | Create/edit migrations, run validations, generate reports | [Authorize(Roles = "Admin,Migrator")] |
| Viewer | Read-only access to all resources, migrations, findings | [Authorize(Roles = "Admin,Migrator,Viewer")] |

### 2.3 Permission Matrix

| Resource | Admin | Migrator | Viewer |
|----------|-------|----------|--------|
| Tenants | CRUD | Read | Read |
| Users | CRUD | Read | Read |
| Subscriptions | CRUD | Read, Connect | Read |
| Resources | CRUD, Delete | Read, Scan | Read |
| Migrations | CRUD, Delete | CRUD | Read |
| Validations | CRUD | CRUD | Read |
| Findings | CRUD, Dismiss | Read, Update Status | Read |
| Reports | CRUD, Delete | CRUD | Read, Download |
| Policies | CRUD | Read | Read |
| Settings | CRUD | Read | Read |
| Audit Logs | Read, Export | Read | None |
| AI Insights | Query, Configure | Query | Query |

### 2.4 Policy-Based Authorization

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement resource-based authorization | Check user can access specific resource within their tenant. | Verify tenant isolation in all queries | Backend | Pending |
| Configure claim-based authorization | Map Entra ID claims to application roles. Handle role changes at login. | Verify claims correctly populated in JWT | Backend | Pending |
| Implement custom authorization policies | Create HasPermission policy for fine-grained access control. | Test custom policies block unauthorized access | Backend | Pending |

---

## 3. Secrets Management

### 3.1 Azure Key Vault Setup

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Create Key Vault resource | Provision Azure Key Vault with standard tier. Enable soft delete and purge protection. | Verify Key Vault accessible in Azure Portal | DevOps | Pending |
| Configure access policies | Grant Managed Identity access to Key Vault. Limit user access to read-only. | Verify managed identity can retrieve secrets | DevOps | Pending |
| Store application secrets | Store database connection strings, API keys, and certificates in Key Vault. | Verify secrets retrievable via Azure SDK | DevOps | Pending |
| Enable Key Vault logging | Configure diagnostic settings to send audit logs to Log Analytics. | Verify audit logs appear in Log Analytics | DevOps | Pending |

### 3.2 Secret Rotation Schedule

| Secret Type | Rotation Frequency | Implementation |
|-------------|-------------------|----------------|
| Database connection string | 90 days | Automated rotation with Key Vault + SQL MI |
| Client secrets | 60 days | Automated rotation with Entra ID + Key Vault |
| API keys | 90 days | Manual rotation with deployment pipeline |
| Certificates | 365 days | Auto-renewal with Key Vault certificates |

### 3.3 Access Policies

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement Key Vault references | Use Key Vault references in App Service configuration instead of secrets. | Verify secrets not in deployment scripts | DevOps | Pending |
| Configure secret expiration | Set expiration dates on all secrets. Configure monitoring for expiring secrets. | Verify alerts for secrets expiring in 30 days | DevOps | Pending |
| Implement secret caching | Cache secrets in application with 5-minute TTL. Reduce Key Vault API calls. | Verify cached secrets used within TTL | Backend | Pending |

---

## 4. Encryption

### 4.1 At Rest Encryption

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Enable TDE on Azure SQL MI | Configure Transparent Data Encryption with service-managed key. | Verify TDE enabled in SQL MI settings | DevOps | Pending |
| Enable blob encryption | Configure Azure Storage encryption with service-managed keys. | Verify encryption status on storage account | DevOps | Pending |
| Implement Always Encrypted | Configure Always Encrypted for sensitive columns (credentials, tokens). | Verify encrypted columns cannot be read in plain text | Backend | Pending |
| Enable disk encryption | Verify Azure VM disks encrypted with Azure Disk Encryption. | Check encryption status in VM settings | DevOps | Pending |

### 4.2 In Transit Encryption

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Enforce TLS 1.2+ | Configure minimum TLS version 1.2 on all services. Disable TLS 1.0/1.1. | Use SSL Labs test to verify TLS configuration | DevOps | Pending |
| Configure HTTPS redirects | Redirect all HTTP requests to HTTPS. Use HSTS headers. | Verify HTTP redirects to HTTPS | DevOps | Pending |
| Implement certificate pinning | Pin Azure CDN and API certificates in mobile clients (if applicable). | Verify certificate validation on mobile | Frontend | Pending |

### 4.3 Always Encrypted Configuration

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Identify sensitive columns | Document columns requiring encryption (EntraUserId, tokens, credentials). | Review schema for sensitive data | Backend | Pending |
| Configure column master key | Create column master key in Key Vault. | Verify key accessible from SQL MI | DevOps | Pending |
| Configure column encryption key | Create column encryption key encrypted with master key. | Verify encryption key usable for column encryption | DevOps | Pending |
| Implement Always Encrypted provider | Configure Entity Framework to use Always Encrypted provider. | Verify queries work with encrypted columns | Backend | Pending |

---

## 5. Audit

### 5.1 Audit Log Schema

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Define audit log schema | Include: UserId, Action, EntityType, EntityId, OldValue, NewValue, IpAddress, Timestamp. | Verify schema covers all required fields | Backend | Pending |
| Implement audit logging middleware | Create middleware that logs all controller actions with before/after state. | Verify audit entries created for all operations | Backend | Pending |
| Configure audit log retention | Set 90-day retention for active logs. Archive older logs to Blob Storage. | Verify logs archived after 90 days | DevOps | Pending |

### 5.2 Logging Strategy

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement structured logging | Use Serilog with JSON format. Include correlation ID for request tracing. | Verify logs structured in Application Insights | Backend | Pending |
| Configure log levels | Set Error for production, Warning for staging, Information for development. | Verify appropriate log levels in each environment | DevOps | Pending |
| Implement PII masking | Mask email, IP addresses, and tokens in logs. Use redaction for sensitive fields. | Verify PII not appearing in logs | Backend | Pending |
| Configure Application Insights | Enable adaptive sampling, dependency tracking, and live metrics. | Verify telemetry flowing to Application Insights | DevOps | Pending |

### 5.3 Retention Policy

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Configure audit log retention | Set 90-day retention for active audit logs. Archive to cold storage. | Verify retention policy applied in Log Analytics | DevOps | Pending |
| Implement log archival | Create Azure Function to archive logs older than 90 days to Blob Storage. | Verify archived logs accessible for compliance | DevOps | Pending |
| Configure log deletion | Implement automated deletion of archived logs after 7 years. | Verify deletion job runs correctly | DevOps | Pending |

---

## 6. Input Validation

### 6.1 Server-Side Validation

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement Fluent Validation | Create validators for all request models. Validate on every API request. | Verify invalid requests rejected with 400 | Backend | Pending |
| Configure model validation | Enable ModelState validation in controllers. Return structured error responses. | Verify ModelState errors returned correctly | Backend | Pending |
| Implement business rule validation | Validate business rules (e.g., user cannot delete active migration). | Verify business rules enforced in service layer | Backend | Pending |
| Sanitize HTML input | Strip HTML tags from user input to prevent XSS. Use HtmlSanitizer library. | Verify HTML tags removed from saved data | Backend | Pending |

### 6.2 Parameterized Queries

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Use Entity Framework parameterized queries | Ensure all database queries use parameterized statements. | Verify no string concatenation in SQL queries | Backend | Pending |
| Avoid dynamic SQL | Use stored procedures or EF Core LINQ. Avoid raw SQL with string interpolation. | Scan codebase for dynamic SQL patterns | Backend | Pending |
| Implement query timeouts | Set 30-second query timeout to prevent long-running queries. | Verify timeout error returned for slow queries | Backend | Pending |

### 6.3 Output Encoding

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement Content-Security-Policy | Configure CSP headers to prevent XSS. Allow only trusted sources. | Verify CSP header in browser developer tools | DevOps | Pending |
| Set X-Content-Type-Options | Configure nosniff header to prevent MIME type sniffing. | Verify header present in responses | DevOps | Pending |
| Implement output encoding | Encode all output in React using JSX (default behavior). Verify no dangerouslySetInnerHTML. | Scan frontend code for dangerouslySetInnerHTML | Frontend | Pending |

---

## 7. OWASP Controls

### A01: Broken Access Control

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement tenant isolation | Filter all queries by TenantId. Verify no cross-tenant data access. | Test cross-tenant access attempts | Backend | Pending |
| Enforce principle of least privilege | Users only access resources they are authorized for. | Test unauthorized access returns 403 | Backend | Pending |
| Implement resource-based authorization | Check user can access specific resource within tenant. | Verify resource ownership validated | Backend | Pending |
| Disable directory listing | Ensure web server does not expose directory structure. | Verify directory browsing disabled | DevOps | Pending |

### A02: Cryptographic Failures

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Use strong encryption algorithms | AES-256 for data at rest, RSA-2048+ for key exchange. | Verify no weak algorithms in codebase | Security | Pending |
| Secure key management | Store all keys in Key Vault. Never hardcode keys in code. | Scan codebase for hardcoded secrets | Security | Pending |
| Implement proper certificate management | Use trusted CA certificates. Implement certificate rotation. | Verify certificates not self-signed in production | DevOps | Pending |

### A03: Injection

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Prevent SQL injection | Use parameterized queries via Entity Framework. | Run SQL injection security scan | Security | Pending |
| Prevent NoSQL injection | Use typed queries. Validate input before query construction. | Test with malicious input payloads | Security | Pending |
| Prevent LDAP injection | Sanitize input used in LDAP queries. Use parameterized LDAP queries. | Test LDAP query input validation | Security | Pending |
| Prevent OS command injection | Avoid shell command execution. Use process APIs with argument arrays. | Scan codebase for shell command patterns | Security | Pending |

### A04: Insecure Design

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement threat modeling | Document threats for each major feature. Create mitigation plans. | Review threat model with security team | Security | Pending |
| Apply security design principles | Implement defense in depth, fail securely, and separation of duties. | Review architecture for security principles | Security | Pending |
| Implement rate limiting | Configure rate limits on all API endpoints. Prevent brute force attacks. | Test rate limiting with automated requests | Backend | Pending |

### A05: Security Misconfiguration

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Disable debug mode in production | Ensure debug features disabled in production configuration. | Verify debug endpoints not accessible | DevOps | Pending |
| Remove default accounts | Remove or disable default admin accounts. | Verify no default accounts in production | DevOps | Pending |
| Configure error handling | Return generic error messages. Do not expose stack traces. | Verify stack traces not in error responses | Backend | Pending |
| Implement security headers | Configure HSTS, X-Frame-Options, X-Content-Type-Options, CSP. | Verify all security headers present | DevOps | Pending |

### A06: Vulnerable Components

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement dependency scanning | Configure Dependabot or Snyk for NuGet and npm packages. | Verify dependency scanning enabled | DevOps | Pending |
| Update vulnerable dependencies | Review and update dependencies weekly. Patch critical vulnerabilities within 24 hours. | Verify no known critical vulnerabilities | DevOps | Pending |
| Implement Software Composition Analysis | Run SCA tool in CI pipeline. Block builds with critical vulnerabilities. | Verify SCA gate in pipeline | DevOps | Pending |

### A07: Authentication Failures

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement account lockout | Lock account after 5 failed attempts. Unlock after 15 minutes or admin action. | Test account lockout after failed attempts | Backend | Pending |
| Prevent credential stuffing | Implement CAPTCHA after 3 failed attempts. Use breached password detection. | Test CAPTCHA trigger on repeated failures | Backend | Pending |
| Implement secure password policy | Enforce minimum 12 characters, complexity requirements. | Verify password policy enforced | Security | Pending |
| Log authentication failures | Log all failed authentication attempts with IP and timestamp. | Verify failed attempts logged in audit trail | Backend | Pending |

### A08: Data Integrity Failures

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement input validation | Validate all input against schema. Reject invalid input. | Test with malformed input payloads | Backend | Pending |
| Verify data integrity | Use checksums for critical data. Implement data validation on read. | Verify checksums validated on data access | Backend | Pending |
| Implement secure deserialization | Use typed deserialization. Avoid BinaryFormatter. Validate before deserialization. | Scan codebase for insecure deserialization | Backend | Pending |

### A09: Logging Failures

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Log security events | Log authentication, authorization, and input validation failures. | Verify security events captured in logs | Backend | Pending |
| Protect log integrity | Store logs in append-only storage. Implement log signing. | Verify logs cannot be modified | DevOps | Pending |
| Implement log monitoring | Configure alerts for suspicious patterns (brute force, privilege escalation). | Verify alerts trigger on test attacks | Security | Pending |

### A10: SSRF

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Validate URLs | Validate all user-supplied URLs against allowlist. | Test with internal IP addresses and localhost | Backend | Pending |
| Block internal network access | Prevent requests to internal services (169.254.x.x, 10.x.x.x). | Verify internal network blocked from application | DevOps | Pending |
| Implement URL allowlist | Only allow requests to approved external URLs. | Verify blocked URLs rejected | Backend | Pending |

---

## 8. Microsoft Recommendations

### 8.1 Azure Well-Architected Security

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement defense in depth | Multiple security layers: network, compute, application, data. | Review architecture for layered security | Security | Pending |
| Apply zero trust principles | Verify explicitly, use least privilege, assume breach. | Review access controls for zero trust alignment | Security | Pending |
| Implement security monitoring | Centralize security logs, implement SIEM, create incident response plan. | Verify security monitoring operational | DevOps | Pending |
| Conduct regular security reviews | Monthly security reviews, quarterly penetration testing. | Schedule and execute security reviews | Security | Pending |

### 8.2 Microsoft Secure Future Initiative

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement secure by design | Security requirements in design phase, threat modeling for all features. | Verify threat models for all features | Security | Pending |
| Implement secure by default | Secure configurations enabled by default, security features not optional. | Verify default configurations are secure | DevOps | Pending |
| Implement secure operations | Automated security testing in CI/CD, security gates in deployment. | Verify security gates in pipeline | DevOps | Pending |

### 8.3 Cloud Adoption Framework Security

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement Cloud Adoption Framework | Follow CAF security best practices for Azure deployments. | Review deployment against CAF checklist | DevOps | Pending |
| Configure Azure Policy | Implement Azure Policy for security guardrails. Enforce compliance. | Verify Azure Policy assignments | DevOps | Pending |
| Implement Azure Sentinel | Deploy Azure Sentinel for SIEM/SOAR. Create security playbooks. | Verify Sentinel operational and alerts configured | Security | Pending |

---

## 9. Security Testing

### 9.1 Static Application Security Testing (SAST)

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Configure SAST tool | Set up SonarQube or similar SAST tool in CI pipeline. | Verify SAST scans run on every build | DevOps | Pending |
| Define quality gates | Set zero critical/high vulnerabilities as quality gate. | Verify builds fail on critical findings | DevOps | Pending |
| Review and remediate findings | Address all critical/high findings before deployment. | Verify findings tracked and resolved | Backend | Pending |

### 9.2 Dynamic Application Security Testing (DAST)

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Configure DAST tool | Set up OWASP ZAP or similar DAST tool for automated scanning. | Verify DAST scans run weekly | Security | Pending |
| Create baseline scan | Run initial scan to establish baseline. Document known issues. | Verify baseline scan completed | Security | Pending |
| Integrate DAST in pipeline | Run DAST against staging environment before production deployment. | Verify DAST gate in deployment pipeline | DevOps | Pending |

### 9.3 Penetration Testing

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Schedule penetration test | Engage external security firm for annual penetration test. | Verify penetration test scheduled | Security | Pending |
| Remediate findings | Address all critical/high findings within 30 days. | Verify remediation tracked in security backlog | Backend | Pending |
| Conduct retest | Verify remediation effectiveness with retest. | Obtain sign-off from testing firm | Security | Pending |

---

## 10. Incident Response

### 10.1 Incident Response Plan

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Create incident response plan | Document procedures for security incidents. Define roles and communication. | Verify plan documented and approved | Security | Pending |
| Establish security team | Define security response team with clear responsibilities. | Verify team members identified and trained | Security | Pending |
| Create communication templates | Prepare templates for security incident notifications. | Verify templates ready for use | Security | Pending |

### 10.2 Security Monitoring

| Item | Implementation Steps | Verification | Owner | Status |
|------|---------------------|--------------|-------|--------|
| Implement security alerting | Configure alerts for suspicious activities in Azure Monitor. | Verify alerts trigger correctly | DevOps | Pending |
| Create security dashboard | Build dashboard for security metrics and alerts. | Verify dashboard displays security data | DevOps | Pending |
| Conduct regular reviews | Review security logs weekly, conduct monthly security reviews. | Verify reviews scheduled and executed | Security | Pending |

---

## Security Checklist Summary

| Domain | Items | Completed | In Progress | Pending |
|--------|-------|-----------|-------------|---------|
| Authentication | 15 | 0 | 0 | 15 |
| Authorization | 8 | 0 | 0 | 8 |
| Secrets Management | 8 | 0 | 0 | 8 |
| Encryption | 10 | 0 | 0 | 10 |
| Audit | 9 | 0 | 0 | 9 |
| Input Validation | 7 | 0 | 0 | 7 |
| OWASP Controls | 20 | 0 | 0 | 20 |
| Microsoft Recommendations | 10 | 0 | 0 | 10 |
| Security Testing | 6 | 0 | 0 | 6 |
| Incident Response | 6 | 0 | 0 | 6 |
| **Total** | **99** | **0** | **0** | **99** |

---

## Security Review Schedule

| Review Type | Frequency | Owner |
|-------------|-----------|-------|
| Code review (security focus) | Every PR | Backend Lead |
| Dependency vulnerability scan | Weekly | DevOps |
| Security log review | Weekly | Security |
| Penetration test | Annually | External Vendor |
| Security architecture review | Quarterly | Security |
| Compliance audit | Annually | Compliance |
| Disaster recovery test | Semi-annually | DevOps |
