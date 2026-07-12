# 12 — Security Architecture

**Document:** MAP MVP Security Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Identity

| Component | Implementation |
|-----------|----------------|
| Identity Provider | Microsoft Entra ID (Azure AD) |
| Authentication | OAuth 2.0 / OpenID Connect |
| MFA | Entra ID conditional access |
| B2B | Entra ID external identities |

---

## 2. Authentication

| Flow | Implementation |
|------|----------------|
| User Login | Authorization Code flow with PKCE |
| Service-to-Service | Client Credentials flow |
| Token Type | JWT (Access + Refresh tokens) |
| Token Lifetime | Access: 1 hour, Refresh: 8 hours |

---

## 3. RBAC

| Role | Permissions |
|------|-------------|
| Global Admin | Full system access |
| Tenant Admin | Tenant management, user management |
| Migration Lead | Create/manage migrations, run validations |
| Technical Architect | View architecture, validate patterns |
| Viewer | Read-only access to dashboards |
| Auditor | View audit logs, generate compliance reports |

---

## 4. Least Privilege

| Principle | Implementation |
|-----------|----------------|
| Service accounts | Minimum required permissions |
| User permissions | Role-based, no blanket admin |
| API permissions | Scoped to specific endpoints |
| Database access | Read/write separation |

---

## 5. Secrets Management

| Secret Type | Storage | Rotation |
|-------------|---------|----------|
| API keys | Azure Key Vault | 90 days |
| Connection strings | Azure Key Vault | 90 days |
| Certificates | Azure Key Vault | 365 days |
| Entra ID secrets | Azure Key Vault | 90 days |

---

## 6. Encryption

| Layer | Method |
|-------|--------|
| At rest | AES-256 (Azure SQL TDE, Blob encryption) |
| In transit | TLS 1.2+ (all communications) |
| Database | Always Encrypted (sensitive columns) |
| Backups | Encrypted (Azure service encryption) |

---

## 7. Data Protection

| Data Type | Classification | Protection |
|-----------|----------------|------------|
| PII | Confidential | Encryption, access control |
| Credentials | Highly Confidential | Key Vault, no logging |
| Audit logs | Internal | Retention, access control |
| Configuration | Internal | Access control |

---

## 8. Secure Coding

| Practice | Implementation |
|----------|----------------|
| Input validation | Server-side validation, parameterized queries |
| Output encoding | HTML encoding, JSON serialization |
| Authentication | Validate all tokens, check expiry |
| Authorization | Check permissions on every request |
| Error handling | Never expose internals, log securely |
| Dependencies | Automated vulnerability scanning |

---

## 9. Threat Modelling

| Threat | Mitigation |
|--------|------------|
| Unauthorized access | Entra ID + MFA + RBAC |
| Data breach | Encryption + Key Vault + access logging |
| Injection attacks | Input validation + parameterized queries |
| DDoS | Azure DDoS Protection + API Management throttling |
| Privilege escalation | Least privilege + regular access reviews |
| Man-in-the-middle | TLS 1.2+ + certificate pinning |

---

## 10. Security Monitoring

| Tool | Purpose |
|------|---------|
| Microsoft Defender for Cloud | Cloud security posture |
| Azure Monitor | Security alerts |
| Application Insights | Anomaly detection |
| Entra ID sign-in logs | Authentication monitoring |
| Audit logs | Activity monitoring |

---

## 11. Compliance

| Standard | Status |
|----------|--------|
| Azure Well-Architected | Required |
| Microsoft Secure Future | Required |
| GDPR | Data protection |
| SOC 2 | Target Phase 2 |
| ISO 27001 | Target Phase 2 |

---

*End of Security Architecture*
