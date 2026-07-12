# 03 — Non-Functional Requirements

**Document:** MAP MVP Non-Functional Requirements
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Availability

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Platform uptime | 99.9% | Monthly SLA |
| Scheduled maintenance | < 4 hours/month | Maintenance window |
| Unplanned downtime | < 43 minutes/month | Incident tracking |
| Recovery time objective (RTO) | < 1 hour | DR testing |
| Recovery point objective (RPO) | < 15 minutes | Backup validation |

---

## 2. Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API response time (p50) | < 200ms | Application Insights |
| API response time (p95) | < 500ms | Application Insights |
| API response time (p99) | < 1000ms | Application Insights |
| Dashboard load time | < 2 seconds | Performance testing |
| Report generation | < 10 seconds | Load testing |
| Concurrent users | 100+ | Stress testing |
| Data processing | < 5 minutes per 1000 resources | Batch testing |

---

## 3. Reliability

| Requirement | Target | Strategy |
|-------------|--------|----------|
| Mean time between failures (MTBF) | > 720 hours | Redundancy |
| Mean time to recovery (MTTR) | < 1 hour | Automated recovery |
| Data durability | 99.999999999% | Geo-redundant storage |
| Transaction consistency | ACID compliance | Database transactions |
| Error rate | < 0.1% | Monitoring |

---

## 4. Scalability

| Dimension | MVP Target | Growth Target |
|-----------|------------|---------------|
| Tenants | 10 | 100+ |
| Users per tenant | 50 | 500+ |
| Azure subscriptions | 10 per tenant | 100+ per tenant |
| Resources per subscription | 1000 | 10,000+ |
| Data retention | 90 days | 1 year+ |
| API calls per minute | 1000 | 10,000+ |

---

## 5. Security

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Authentication | OAuth 2.0 / OIDC | Entra ID |
| Authorization | RBAC | Role-based access control |
| Encryption at rest | AES-256 | Azure encryption |
| Encryption in transit | TLS 1.2+ | Certificate management |
| Secrets management | Azure Key Vault | Centralized secrets |
| Vulnerability scanning | OWASP Top 10 | Automated scanning |
| Penetration testing | Annual | Third-party testing |

---

## 6. Accessibility

| Requirement | Standard |
|-------------|----------|
| WCAG compliance | WCAG 2.1 AA |
| Keyboard navigation | Full support |
| Screen reader compatibility | ARIA labels |
| Color contrast | 4.5:1 minimum |
| Focus indicators | Visible focus states |

---

## 7. Compliance

| Standard | Requirement | Status |
|----------|-------------|--------|
| GDPR | Data protection | Required |
| SOC 2 | Security controls | Target Phase 2 |
| ISO 27001 | Information security | Target Phase 2 |
| Azure Well-Architected | Framework compliance | Required |
| Microsoft Secure Future | Security initiative | Required |

---

## 8. Maintainability

| Requirement | Target |
|-------------|--------|
| Code coverage | > 80% |
| Documentation coverage | 100% APIs |
| Technical debt ratio | < 5% |
| Deployment frequency | Daily |
| Lead time for changes | < 1 day |

---

## 9. Disaster Recovery

| Scenario | Strategy | RTO | RPO |
|----------|----------|-----|-----|
| Database failure | Geo-redundant failover | < 1 hour | < 15 minutes |
| Region outage | Cross-region restore | < 4 hours | < 1 hour |
| Data corruption | Point-in-time restore | < 2 hours | < 5 minutes |
| Security breach | Incident response plan | < 24 hours | N/A |

---

## 10. Business Continuity

| Component | Strategy |
|-----------|----------|
| Critical functions | Validation, Reporting |
| Backup systems | Read replicas |
| Communication | Status page, email alerts |
| Recovery priority | P1: Auth, Validation, Reporting |

---

## 11. Supportability

| Requirement | Target |
|-------------|--------|
| Monitoring coverage | 100% critical paths |
| Alert response time | < 15 minutes (P1) |
| Log retention | 30 days minimum |
| Debug capabilities | Structured logging |
| Health checks | All services |

---

*End of Non-Functional Requirements*
