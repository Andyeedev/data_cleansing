# 18 — Observability Architecture

**Document:** MAP MVP Observability Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. Three Pillars

| Pillar | Tool | Purpose |
|--------|------|---------|
| Logs | Application Insights | Structured logging |
| Metrics | Azure Monitor / Prometheus | Numeric measurements |
| Traces | Application Insights | Distributed tracing |

---

## 2. Logging Strategy

| Level | Usage |
|-------|-------|
| Critical | System failures requiring immediate attention |
| Error | Application errors |
| Warning | Potential issues |
| Information | Key business events |
| Debug | Development troubleshooting |

### Structured Logging
```json
{
  "timestamp": "2026-06-01T12:00:00Z",
  "level": "Information",
  "service": "MAP.API",
  "message": "Validation completed",
  "properties": {
    "tenantId": "xxx",
    "migrationId": "xxx",
    "duration": "2.5s",
    "checksExecuted": 150,
    "findingsCount": 5
  }
}
```

---

## 3. Metrics

| Category | Metrics |
|----------|---------|
| Availability | Uptime, response time |
| Performance | CPU, memory, disk I/O |
| Business | Migrations, validations, findings |
| AI | Token usage, latency |

---

## 4. Alerting

| Severity | Response | Channel |
|----------|----------|---------|
| P1 Critical | Immediate | PagerDuty + Phone |
| P2 High | < 1 hour | PagerDuty |
| P3 Medium | < 4 hours | Email |
| P4 Low | Next business day | Dashboard |

---

## 5. Dashboard

| Dashboard | Audience |
|-----------|----------|
| Operations | Infrastructure health |
| Application | API performance, errors |
| Business | Migrations, validations |
| Security | Threats, anomalies |

---

## 6. Health Checks

| Check | Endpoint | Frequency |
|-------|----------|-----------|
| API | `/health` | Every 30s |
| Database | `/health/db` | Every 30s |
| AI Service | `/health/ai` | Every 60s |
| Storage | `/health/storage` | Every 60s |

---

*End of Observability Architecture*
