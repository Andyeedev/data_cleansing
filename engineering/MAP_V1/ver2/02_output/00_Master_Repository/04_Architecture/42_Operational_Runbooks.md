# MAP Operational Runbooks

---

**Document Title:** MAP (Migration Assurance Platform) Operational Runbooks
**Document ID:** MAP-ORB-015
**Version:** 1.0
**Date:** July 2026
**Status:** Official
**Classification:** Internal / Confidential
**Owner:** Platform Engineering & DevOps
**Prepared by:** MAP Pilot Deployment Team
**Approved by:** VP of Engineering

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Definitions and Acronyms](#3-definitions-and-acronyms)
4. [Deployment Runbook](#4-deployment-runbook)
5. [Rollback Runbook](#5-rollback-runbook)
6. [Recovery Runbook](#6-recovery-runbook)
7. [Incident Response Runbook](#7-incident-response-runbook)
8. [Monitoring Runbook](#8-monitoring-runbook)
9. [Escalation Runbook](#9-escalation-runbook)
10. [Health Checks Runbook](#10-health-checks-runbook)
11. [Maintenance Runbook](#11-maintenance-runbook)
12. [Best Practices](#12-best-practices)
13. [Dependencies](#13-dependencies)
14. [References](#14-references)
15. [Revision History](#15-revision-history)
16. [Approval](#16-approval)

---

## 1. Purpose

### 1.1 Document Purpose

This document provides comprehensive operational runbooks for the Migration Assurance Platform (MAP) Pilot Deployment. Each runbook defines step-by-step procedures for critical operational tasks, ensuring consistency, repeatability, and reliability across all pilot operations.

### 1.2 Runbook Objectives

- **Standardisation:** Ensure all operational procedures follow consistent, documented steps
- **Reliability:** Reduce human error through checklists, validations, and automated safeguards
- **Efficiency:** Minimise mean time to recovery (MTTR) through pre-defined procedures
- **Compliance:** Maintain audit trails for all operational activities
- **Knowledge Transfer:** Enable any trained operator to execute procedures independently
- **Continuous Improvement:** Provide a framework for updating procedures based on lessons learned

### 1.3 Runbook Inventory

| Runbook | ID | Owner | Review Cycle |
|---|---|---|---|
| Deployment | RB-DEPLOY | DevOps Lead | Monthly |
| Rollback | RB-ROLLBACK | DevOps Lead | Monthly |
| Recovery | RB-RECOVERY | Platform Engineer | Monthly |
| Incident Response | RB-INCIDENT | SRE Lead | Bi-weekly |
| Monitoring | RB-MONITOR | SRE Lead | Monthly |
| Escalation | RB-ESCALATE | Operations Manager | Quarterly |
| Health Checks | RB-HEALTH | Platform Engineer | Monthly |
| Maintenance | RB-MAINTAIN | DevOps Lead | Monthly |

---

## 2. Scope

### 2.1 Operational Context

These runbooks apply to the MAP Pilot Deployment environment, including:

| Environment | Purpose | Infrastructure | Users |
|---|---|---|---|
| Development | Feature development | Local / Dev cluster | Engineering team |
| Staging | Pre-production testing | Mirrored production | QA, DevOps, PM |
| Pilot | Customer pilot deployment | Cloud (AWS/Azure) | Pilot customers |
| Production | Full production (future) | Cloud (AWS/Azure) | All customers |

### 2.2 Infrastructure Components

| Component | Technology | Purpose | Criticality |
|---|---|---|---|
| Application Server | Kubernetes (EKS/AKS) | Core MAP application | Critical |
| Database | PostgreSQL 15 | Primary data store | Critical |
| Cache Layer | Redis 7 | Session and query caching | High |
| Message Queue | RabbitMQ 3.12 | Async task processing | High |
| Search Engine | Elasticsearch 8 | Full-text search | Medium |
| Object Storage | AWS S3 / Azure Blob | File storage, backups | High |
| Load Balancer | AWS ALB / Azure LB | Traffic distribution | Critical |
| CDN | CloudFront / Azure CDN | Static asset delivery | Medium |
| Monitoring | Prometheus + Grafana | Metrics and dashboards | High |
| Logging | ELK Stack | Centralised logging | High |
| CI/CD | GitHub Actions | Build and deployment | High |

---

## 3. Definitions and Acronyms

| Term | Definition |
|---|---|
| MTTR | Mean Time To Recovery |
| MTTF | Mean Time To Failure |
| MTBF | Mean Time Between Failures |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| SLA | Service Level Agreement |
| SLO | Service Level Objective |
| SLI | Service Level Indicator |
| EKS | Elastic Kubernetes Service (AWS) |
| AKS | Azure Kubernetes Service |
| PVC | Persistent Volume Claim |
| HPA | Horizontal Pod Autoscaler |
| PDB | Pod Disruption Budget |
| RBAC | Role-Based Access Control |
| OPA | Open Policy Agent |
| TLS | Transport Layer Security |
| CORS | Cross-Origin Resource Sharing |
| WAF | Web Application Firewall |
| DDoS | Distributed Denial of Service |

---

## 4. Deployment Runbook

### 4.1 Pre-Deployment Checklist

#### 4.1.1 Environment Readiness

| Check | Command | Expected Result | Status |
|---|---|---|---|
| Cluster health | `kubectl get nodes` | All nodes Ready | ☐ |
| Namespace available | `kubectl get ns map-pilot` | Namespace exists | ☐ |
| Resource quotas | `kubectl describe resourcequota -n map-pilot` | Sufficient quota | ☐ |
| Database connectivity | `pg_isready -h $DB_HOST -p 5432` | Accepting connections | ☐ |
| Redis connectivity | `redis-cli -h $REDIS_HOST ping` | PONG | ☐ |
| RabbitMQ status | `rabbitmqctl status` | Running | ☐ |
| S3 bucket access | `aws s3 ls s3://map-pilot-assets/` | Listing bucket contents | ☐ |
| TLS certificates | `openssl s_client -connect $DOMAIN:443` | Valid certificate | ☐ |
| DNS resolution | `nslookup $DOMAIN` | Correct IP resolution | ☐ |
| CDN status | `curl -I https://$CDN_DOMAIN` | 200 OK | ☐ |

#### 4.1.2 Application Readiness

| Check | Command | Expected Result | Status |
|---|---|---|---|
| Image available | `docker pull $REGISTRY/map:$VERSION` | Image pulled | ☐ |
| Image integrity | `docker inspect $REGISTRY/map:$VERSION` | Metadata valid | ☐ |
| Configuration validated | `kubectl get configmap map-config -n map-pilot` | Config exists | ☐ |
| Secrets available | `kubectl get secret map-secrets -n map-pilot` | Secrets exist | ☐ |
| HPA configured | `kubectl get hpa -n map-pilot` | HPA active | ☐ |
| PDB configured | `kubectl get pdb -n map-pilot` | PDB exists | ☐ |
| Ingress configured | `kubectl get ingress -n map-pilot` | Ingress exists | ☐ |
| Network policies | `kubectl get networkpolicy -n map-pilot` | Policies applied | ☐ |

#### 4.1.3 Pre-Deployment Approval

| Approval | Approver | Date | Time |
|---|---|---|---|
| Technical review complete | Engineering Lead | ____/____/2026 | ____:____ |
| QA sign-off received | QA Lead | ____/____/2026 | ____:____ |
| Security review passed | Security Lead | ____/____/2026 | ____:____ |
| Change request approved | Change Manager | ____/____/2026 | ____:____ |
| Customer notification sent | Customer Success Lead | ____/____/2026 | ____:____ |

### 4.2 Deployment Steps

#### 4.2.1 Step 1: Create Backup

```bash
# Step 1.1: Database backup
pg_dump -h $DB_HOST -U $DB_USER -d map_pilot -F c -f /backups/map_pilot_pre_deploy_$(date +%Y%m%d_%H%M%S).dump

# Step 1.2: Verify backup
pg_restore -l /backups/map_pilot_pre_deploy_*.dump | head -20

# Step 1.3: Upload backup to S3
aws s3 cp /backups/map_pilot_pre_deploy_*.dump s3://map-pilot-backups/

# Step 1.4: Verify S3 upload
aws s3 ls s3://map-pilot-backups/map_pilot_pre_deploy_*.dump
```

#### 4.2.2 Step 2: Update Configuration

```bash
# Step 2.1: Update ConfigMap with new version
kubectl apply -f k8s/configmap.yaml -n map-pilot

# Step 2.2: Validate ConfigMap
kubectl get configmap map-config -n map-pilot -o yaml

# Step 2.3: Update Secrets if needed
kubectl apply -f k8s/secrets.yaml -n map-pilot

# Step 2.4: Verify Secrets
kubectl get secret map-secrets -n map-pilot -o jsonpath='{.data}' | jq .
```

#### 4.2.3 Step 3: Deploy Application

```bash
# Step 3.1: Apply deployment manifest
kubectl apply -f k8s/deployment.yaml -n map-pilot

# Step 3.2: Watch rollout status
kubectl rollout status deployment/map-app -n map-pilot --timeout=300s

# Step 3.3: Verify pod status
kubectl get pods -n map-pilot -l app=map-app

# Step 3.4: Check pod logs
kubectl logs -n map-pilot -l app=map-app --tail=100

# Step 3.5: Verify resource usage
kubectl top pods -n map-pilot -l app=map-app
```

#### 4.2.4 Step 4: Update Services

```bash
# Step 4.1: Apply service manifest
kubectl apply -f k8s/service.yaml -n map-pilot

# Step 4.2: Apply ingress manifest
kubectl apply -f k8s/ingress.yaml -n map-pilot

# Step 4.3: Verify service endpoints
kubectl get endpoints -n map-pilot

# Step 4.4: Test service connectivity
curl -k https://$DOMAIN/health
```

#### 4.2.5 Step 5: Run Smoke Tests

```bash
# Step 5.1: Health endpoint
curl -s https://$DOMAIN/health | jq '.status'
# Expected: "healthy"

# Step 5.2: API endpoint test
curl -s -X GET https://$DOMAIN/api/v1/status \
  -H "Authorization: Bearer $SMOKE_TEST_TOKEN" | jq '.version'
# Expected: "$VERSION"

# Step 5.3: Database connectivity test
curl -s https://$DOMAIN/health/db | jq '.status'
# Expected: "connected"

# Step 5.4: Cache connectivity test
curl -s https://$DOMAIN/health/cache | jq '.status'
# Expected: "connected"

# Step 5.5: Queue connectivity test
curl -s https://$DOMAIN/health/queue | jq '.status'
# Expected: "connected"

# Step 5.6: Run automated smoke test suite
./scripts/smoke_tests.sh --env=pilot --version=$VERSION
```

#### 4.2.6 Step 6: Enable Traffic

```bash
# Step 6.1: Verify ingress rules
kubectl get ingress -n map-pilot -o yaml

# Step 6.2: Test external access
curl -I https://$DOMAIN

# Step 6.3: Verify SSL certificate
echo | openssl s_client -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates

# Step 6.4: Monitor error rates for 15 minutes
watch -n 5 'curl -s https://$DOMAIN/health | jq ".status"'
```

### 4.3 Post-Deployment Verification

#### 4.3.1 Verification Checklist

| Check | Command / Method | Expected Result | Status |
|---|---|---|---|
| All pods running | `kubectl get pods -n map-pilot` | All pods Running | ☐ |
| No restart loops | `kubectl get pods -n map-pilot` | 0 restarts | ☐ |
| Health checks passing | `curl https://$DOMAIN/health` | healthy | ☐ |
| API responding | `curl https://$DOMAIN/api/v1/status` | 200 OK | ☐ |
| Login working | Browser test | Successful login | ☐ |
| Core features working | Manual test | Functioning | ☐ |
| Error rate normal | Grafana dashboard | < 1% error rate | ☐ |
| Response time normal | Grafana dashboard | < 500ms p95 | ☐ |
| No new alerts | Alertmanager | No new alerts | ☐ |
| Logs clean | Kibana / CloudWatch | No critical errors | ☐ |

#### 4.3.2 Monitoring Period

| Phase | Duration | Focus | Actions |
|---|---|---|---|
| Immediate | 0–30 min | Critical errors, crashes | Immediate rollback if issues |
| Short-term | 30 min – 2 hours | Performance, stability | Monitor dashboards |
| Medium-term | 2–24 hours | Subtle issues, memory leaks | Review metrics |
| Extended | 1–7 days | Long-term stability | Daily review |

### 4.4 Deployment Rollback Trigger

| Trigger | Condition | Action |
|---|---|---|
| Pod Crash Loop | > 3 restarts in 5 min | Automatic rollback |
| Health Check Failing | Health endpoint unhealthy > 5 min | Manual rollback |
| High Error Rate | > 5% error rate for 5 min | Manual rollback |
| Performance Degradation | p95 latency > 2s for 10 min | Investigate then rollback |
| Data Corruption | Any data integrity issue | Immediate rollback |

---

## 5. Rollback Runbook

### 5.1 Rollback Triggers

#### 5.1.1 Trigger Conditions

| Trigger | Detection Method | Severity | Response Time |
|---|---|---|---|
| Application Crash | Pod status monitoring | Critical | Immediate |
| Health Check Failure | Health endpoint monitoring | Critical | < 5 minutes |
| High Error Rate | Prometheus/Grafana alerts | High | < 10 minutes |
| Performance Degradation | Latency monitoring | High | < 15 minutes |
| Data Integrity Issue | Database monitoring | Critical | Immediate |
| Security Vulnerability | Security scanning | Critical | Immediate |
| Customer Impact | Customer reports | High | < 30 minutes |

#### 5.1.2 Rollback Decision Matrix

| Situation | Rollback? | Justification |
|---|---|---|
| Any critical trigger activated | Yes | Immediate risk to production |
| Multiple high triggers | Yes | Compounded risk |
| Single high trigger | Investigate first | May be transient |
| Medium trigger only | Investigate, plan rollback | Low immediate risk |
| No triggers, but customer complaints | Investigate | May not be deployment-related |

### 5.2 Rollback Steps

#### 5.2.1 Step 1: Halt New Deployments

```bash
# Step 1.1: Pause any in-progress deployments
kubectl rollout pause deployment/map-app -n map-pilot

# Step 1.2: Notify team of rollback
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d '{"text":"🚨 ROLLBACK INITIATED: MAP deployment '$VERSION' is being rolled back. All hands on deck."}'

# Step 1.3: Create incident ticket
echo "Creating incident ticket for rollback..."
# (Automated via incident management system)
```

#### 5.2.2 Step 2: Execute Rollback

```bash
# Step 2.1: Rollback to previous version
kubectl rollout undo deployment/map-app -n map-pilot

# Step 2.2: Monitor rollback progress
kubectl rollout status deployment/map-app -n map-pilot --timeout=180s

# Step 2.3: Verify rollback
kubectl get pods -n map-pilot -l app=map-app
kubectl logs -n map-pilot -l app=map-app --tail=50
```

#### 5.2.3 Step 3: Database Rollback (if required)

```bash
# Step 3.1: Stop application traffic
kubectl scale deployment/map-app -n map-pilot --replicas=0

# Step 3.2: Restore database from backup
pg_restore -h $DB_HOST -U $DB_USER -d map_pilot -c /backups/map_pilot_pre_deploy_*.dump

# Step 3.3: Verify database integrity
psql -h $DB_HOST -U $DB_USER -d map_pilot -c "SELECT COUNT(*) FROM critical_table;"

# Step 3.4: Restart application
kubectl scale deployment/map-app -n map-pilot --replicas=3
```

#### 5.2.4 Step 4: Validate Rollback

```bash
# Step 4.1: Health check
curl -s https://$DOMAIN/health | jq '.status'

# Step 4.2: API check
curl -s https://$DOMAIN/api/v1/status | jq '.version'

# Step 4.3: Smoke tests
./scripts/smoke_tests.sh --env=pilot

# Step 4.4: Monitor for 15 minutes
watch -n 10 'kubectl get pods -n map-pilot -l app=map-app'
```

#### 5.2.5 Step 5: Communicate Rollback

```bash
# Step 5.1: Internal notification
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d '{"text":"✅ ROLLBACK COMPLETE: MAP successfully rolled back to previous version. Monitoring for stability."}'

# Step 5.2: Customer notification
# (Via Customer Success team email template)

# Step 5.3: Update incident ticket
# (Via incident management system)
```

### 5.3 Post-Rollback Validation

| Check | Command | Expected Result | Status |
|---|---|---|---|
| Application stable | `kubectl get pods -n map-pilot` | All pods Running | ☐ |
| Health checks passing | `curl https://$DOMAIN/health` | healthy | ☐ |
| Error rate normal | Grafana dashboard | < 0.5% error rate | ☐ |
| Response time normal | Grafana dashboard | < 500ms p95 | ☐ |
| Customer access restored | Browser test | Successful login | ☐ |
| No new alerts | Alertmanager | Clear | ☐ |
| Database consistent | Data queries | No discrepancies | ☐ |

---

## 6. Recovery Runbook

### 6.1 Backup Restoration

#### 6.1.1 Backup Inventory

| Backup Type | Frequency | Retention | Location | RTO |
|---|---|---|---|---|
| Database Full | Daily 2:00 AM UTC | 30 days | S3 + Cross-region | 2 hours |
| Database Incremental | Hourly | 7 days | S3 | 1 hour |
| Application Config | On change | 90 days | Git + S3 | 15 minutes |
| Secrets | On change | 90 days | AWS Secrets Manager | 10 minutes |
| Object Storage | Daily | 30 days | S3 + Cross-region | 4 hours |
| Full System Snapshot | Weekly | 4 weeks | EBS snapshots | 4 hours |

#### 6.1.2 Database Restoration Steps

```bash
# Step 1: Identify the correct backup
aws s3 ls s3://map-pilot-backups/ --recursive | grep "map_pilot" | sort -k2

# Step 2: Download the backup file
aws s3 cp s3://map-pilot-backups/map_pilot_YYYYMMDD_HHMMSS.dump /restore/

# Step 3: Stop application traffic
kubectl scale deployment/map-app -n map-pilot --replicas=0

# Step 4: Verify database is idle
psql -h $DB_HOST -U $DB_USER -d postgres -c "SELECT pid, state FROM pg_stat_activity WHERE datname='map_pilot';"

# Step 5: Terminate active connections
psql -h $DB_HOST -U $DB_USER -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='map_pilot';"

# Step 6: Drop and recreate database
psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS map_pilot;"
psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE map_pilot OWNER map_user;"

# Step 7: Restore from backup
pg_restore -h $DB_HOST -U $DB_USER -d map_pilot -v /restore/map_pilot_*.dump

# Step 8: Verify restoration
psql -h $DB_HOST -U $DB_USER -d map_pilot -c "\dt"
psql -h $DB_HOST -U $DB_USER -d map_pilot -c "SELECT COUNT(*) FROM users;"

# Step 9: Restart application
kubectl scale deployment/map-app -n map-pilot --replicas=3

# Step 10: Validate application
curl -s https://$DOMAIN/health | jq '.status'
```

### 6.2 Data Recovery

#### 6.2.1 Recovery Scenarios

| Scenario | Severity | Recovery Method | RTO | RPO |
|---|---|---|---|---|
| Accidental data deletion | High | Point-in-time recovery | 2 hours | 5 minutes |
| Data corruption | Critical | Full restore from backup | 4 hours | 1 hour |
| Logical error in migration | Critical | Full restore + manual fixes | 6 hours | 1 hour |
| Hardware failure | Critical | Failover to standby | 30 minutes | 0 (sync replication) |
| Region outage | Critical | Cross-region restore | 8 hours | 1 hour |

#### 6.2.2 Point-in-Time Recovery

```bash
# Step 1: Stop writes to database
# (Application already stopped)

# Step 2: Enable WAL archiving (if not already)
psql -h $DB_HOST -U $DB_USER -c "ALTER SYSTEM SET archive_mode = on;"
psql -h $DB_HOST -U $DB_USER -c "ALTER SYSTEM SET archive_command = 'aws s3 cp %p s3://map-pilot-wal/%f';"
psql -h $DB_HOST -U $DB_USER -c "SELECT pg_reload_conf();"

# Step 3: Restore to specific point in time
pg_restore -h $DB_HOST -U $DB_USER -d map_pilot \
  --target-time="2026-07-22 14:30:00" \
  /restore/map_pilot_full.dump

# Step 4: Verify data consistency
psql -h $DB_HOST -U $DB_USER -d map_pilot -c "SELECT MAX(created_at) FROM audit_log;"
```

### 6.3 Service Recovery

#### 6.3.1 Service Recovery Matrix

| Service | Failure Mode | Recovery Action | Verification |
|---|---|---|---|
| Application Server | Crash | Restart pod / reschedule | Health check |
| Application Server | OOM | Increase memory limit | Resource monitoring |
| Database | Connection pool exhausted | Restart pool, increase limits | Connection count |
| Database | Disk full | Expand volume, clean logs | Disk usage |
| Redis | Memory full | Evict keys, increase memory | Hit rate |
| RabbitMQ | Queue backlog | Scale consumers, drain queue | Queue depth |
| Elasticsearch | Cluster yellow/red | Reallocate shards, add nodes | Cluster status |
| S3 / Blob Storage | Access denied | Verify IAM policies | Access test |

#### 6.3.2 Full Service Recovery Procedure

```bash
# Step 1: Assess damage
kubectl get pods -n map-pilot -o wide
kubectl get events -n map-pilot --sort-by='.lastTimestamp' | tail -20

# Step 2: Restart failed components
kubectl rollout restart deployment/map-app -n map-pilot
kubectl rollout restart deployment/map-worker -n map-pilot

# Step 3: Verify each component
curl -s https://$DOMAIN/health | jq '.components'

# Step 4: Clear any stuck processes
kubectl exec -it $(kubectl get pod -n map-pilot -l app=rabbitmq -o jsonpath='{.items[0].metadata.name}') -n map-pilot -- rabbitmqctl purge_queue map_tasks

# Step 5: Monitor recovery
watch -n 5 'kubectl get pods -n map-pilot && echo "---" && curl -s https://$DOMAIN/health | jq ".status"'
```

---

## 7. Incident Response Runbook

### 7.1 Detection

#### 7.1.1 Detection Sources

| Source | Method | Alert Type | Response Time |
|---|---|---|---|
| Automated Monitoring | Prometheus/Grafana | Alertmanager webhook | Immediate |
| Customer Reports | Support tickets | Escalation | < 1 hour |
| Internal Detection | Manual observation | Slack notification | < 30 minutes |
| External Monitoring | Third-party (Pingdom) | Email + SMS | Immediate |
| Security Scanning | WAF / IDS | Security alert | Immediate |

#### 7.1.2 Incident Severity Levels

| Level | Definition | Response Time | Escalation | Communication |
|---|---|---|---|---|
| SEV-1 | Complete outage, data loss, security breach | Immediate | VP Engineering | Every 30 min |
| SEV-2 | Major feature unavailable, significant impact | < 15 min | Engineering Lead | Every hour |
| SEV-3 | Partial degradation, workaround available | < 30 min | Team Lead | Every 4 hours |
| SEV-4 | Minor issue, low impact | < 2 hours | On-call engineer | Daily |

### 7.2 Triage

#### 7.2.1 Triage Process

```
Incident Detected
  → Acknowledge alert (within SLA)
  → Determine severity level
  → Open incident channel (#incident-YYYYMMDD-NNN)
  → Page required responders
  → Begin investigation
  → Update incident status
  → Determine customer impact
  → Escalate if needed
```

#### 7.2.2 Triage Checklist

| Step | Action | Owner | Time Limit |
|---|---|---|---|
| 1 | Acknowledge alert | On-call | 5 minutes |
| 2 | Create incident channel | On-call | 5 minutes |
| 3 | Assess impact | On-call | 10 minutes |
| 4 | Assign severity | On-call | 10 minutes |
| 5 | Page responders | On-call | 15 minutes |
| 6 | Initial status update | Incident Commander | 15 minutes |
| 7 | Customer impact assessment | Support Lead | 30 minutes |

### 7.3 Resolution

#### 7.3.1 Resolution Steps

```bash
# Step 1: Investigate root cause
# Check application logs
kubectl logs -n map-pilot -l app=map-app --tail=200

# Check system metrics
# (Via Grafana dashboards)

# Check recent changes
# (Via deployment history, change log)

# Step 2: Implement fix
# Option A: Code fix (if time permits)
# Option B: Configuration change
# Option C: Rollback
# Option D: Scale up
# Option E: Manual intervention

# Step 3: Verify fix
curl -s https://$DOMAIN/health | jq '.status'
# Run smoke tests
# Monitor error rates

# Step 4: Monitor stability
# Watch for 30 minutes
# Confirm no recurrence
```

#### 7.3.2 Resolution Decision Tree

```
Is the issue a deployment regression?
  → YES: Execute rollback (Runbook 5)
  → NO: Continue investigation

Is the issue infrastructure-related?
  → YES: Check component health, restart if needed
  → NO: Continue investigation

Is the issue database-related?
  → YES: Check connection pools, queries, locks
  → NO: Continue investigation

Is the issue network-related?
  → YES: Check DNS, firewall, load balancer
  → NO: Continue investigation

Is the issue external dependency?
  → YES: Check third-party status, activate fallback
  → NO: Continue investigation

Cannot determine root cause?
  → Escalate to Engineering Lead
  → Engage vendor support if applicable
```

### 7.4 Post-Mortem

#### 7.4.1 Post-Mortem Template

```markdown
## Incident Post-Mortem - {INCIDENT-ID}

**Date:** {DD/MM/YYYY}
**Duration:** {HH:MM} – {HH:MM} ({Duration})
**Severity:** {SEV-1/2/3/4}
**Incident Commander:** {Name}

### Summary
{One paragraph summary of the incident}

### Timeline
| Time (UTC) | Event |
|---|---|
| {Time} | {Event description} |
| {Time} | {Event description} |
| {Time} | {Event description} |

### Impact
- **Users Affected:** {Number/Percentage}
- **Duration:** {Total duration}
- **Data Impact:** {None/Partial/Full}
- **Revenue Impact:** ${Amount}

### Root Cause
{Detailed root cause analysis}

### Resolution
{How the incident was resolved}

### Detection
{How the incident was detected}

### Lessons Learned
| What Went Well | What Needs Improvement |
|---|---|
| {Item 1} | {Item 1} |
| {Item 2} | {Item 2} |

### Action Items
| Action | Owner | Due Date | Status |
|---|---|---|---|
| {Action 1} | {Name} | {Date} | Open |
| {Action 2} | {Name} | {Date} | Open |

### Attachments
- Dashboard screenshots
- Log excerpts
- Communication logs
```

---

## 8. Monitoring Runbook

### 8.1 Alert Response

#### 8.1.1 Alert Inventory

| Alert Name | Severity | Condition | Response |
|---|---|---|---|
| MapAppCrashLooping | Critical | Pod restarts > 3 in 5 min | Investigate immediately |
| MapHealthCheckFailing | Critical | Health unhealthy > 5 min | Investigate immediately |
| MapHighErrorRate | High | Error rate > 5% for 5 min | Investigate, consider rollback |
| MapHighLatency | High | p95 latency > 2s for 10 min | Investigate, check resources |
| MapDiskSpaceLow | Medium | Disk usage > 80% | Plan cleanup or expansion |
| MapMemoryHigh | Medium | Memory usage > 85% | Check for leaks, scale |
| MapCPUHigh | Medium | CPU usage > 80% for 10 min | Check for runaway processes |
| MapDatabaseConnectionsHigh | High | Connections > 80% pool | Check for connection leaks |
| MapQueueBacklog | Medium | Queue depth > 1000 | Scale consumers |
| MapSSLCertExpiring | Medium | Cert expires < 30 days | Renew certificate |

#### 8.1.2 Alert Response Procedure

```
Alert Received
  → Acknowledge in Alertmanager (within SLA)
  → Open investigation channel
  → Run initial diagnostics
    → kubectl get pods -n map-pilot
    → kubectl top pods -n map-pilot
    → kubectl logs -n map-pilot -l app=map-app --tail=100
  → Determine if incident or false positive
  → If incident: Follow Incident Response Runbook
  → If false positive: Tune alert, document
  → Update on-call log
```

### 8.2 Escalation

#### 8.2.1 Escalation Matrix

| Level | Trigger | Contact | Method | SLA |
|---|---|---|---|---|
| L1 | Alert acknowledgment | On-call Engineer | PagerDuty | 5 minutes |
| L2 | Cannot resolve in 15 min | Engineering Lead | Phone + Slack | 15 minutes |
| L3 | Cannot resolve in 30 min | VP Engineering | Phone | 30 minutes |
| L4 | Customer data at risk | CTO | Phone | 30 minutes |
| L5 | Security breach | CISO + Legal | Phone | Immediate |

#### 8.2.2 Escalation Communication Template

```markdown
## Escalation Notification

**Incident ID:** {INCIDENT-ID}
**Current Severity:** {SEV-1/2/3}
**Escalation Level:** {L1/L2/L3/L4/L5}
**Escalated To:** {Name, Role}
**Escalated By:** {Name, Role}
**Time:** {UTC Time}

### Current Status
{Brief status update}

### Impact
{Current impact description}

### Actions Taken
{List of actions already taken}

### Next Steps
{Planned next steps}

### Support Needed
{Specific help needed from escalation target}
```

### 8.3 Investigation

#### 8.3.1 Investigation Playbook

| Symptom | Check First | Commands |
|---|---|---|
| Pod CrashLoop | Logs, OOM, resource limits | `kubectl logs`, `kubectl describe pod` |
| High Latency | Database queries, cache, network | Dashboard queries, `explain analyze` |
| High Error Rate | Logs, API gateway, load balancer | Log search, error aggregation |
| Memory Leak | Heap dumps, GC logs | `jcmd`, heap analysis |
| Disk Full | Large files, log rotation, temp files | `du -sh`, find large files |
| Connection Refused | Network, DNS, firewall | `telnet`, `nslookup`, `traceroute` |

#### 8.3.2 Investigation Checklist

- [ ] Collect relevant logs (application, system, audit)
- [ ] Check recent deployments or configuration changes
- [ ] Review monitoring dashboards for anomalies
- [ ] Verify infrastructure components (nodes, pods, services)
- [ ] Check external dependencies (APIs, databases, caches)
- [ ] Review network connectivity and DNS resolution
- [ ] Check resource usage (CPU, memory, disk, network)
- [ ] Identify any security-related events

---

## 9. Escalation Runbook

### 9.1 Escalation Criteria

| Condition | Severity | Escalation Level | Target |
|---|---|---|---|
| Complete service outage | SEV-1 | L3+ | VP Engineering |
| Data breach suspected | SEV-1 | L4+ | CISO + Legal |
| Multiple customer impact | SEV-2 | L2+ | Engineering Lead |
| Single customer critical issue | SEV-2 | L1+ | Team Lead |
| Repeated incidents (3+ in 24h) | SEV-2 | L2+ | Engineering Lead |
| SLA breach imminent | SEV-3 | L2+ | Operations Manager |
| Regulatory compliance issue | SEV-1 | L4+ | CISO + Legal |
| Vendor dependency failure | SEV-2 | L2+ | Engineering Lead |

### 9.2 Escalation Contacts

| Level | Role | Name | Phone | Email | Availability |
|---|---|---|---|---|---|
| L1 | On-call Engineer | {Rotating} | {PagerDuty} | {Email} | 24/7 |
| L2 | Engineering Lead | {Name} | {Phone} | {Email} | Business hours + on-call |
| L3 | VP Engineering | {Name} | {Phone} | {Email} | Business hours + on-call |
| L4 | CTO | {Name} | {Phone} | {Email} | Business hours + on-call |
| L4 | CISO | {Name} | {Phone} | {Email} | Business hours + on-call |
| L5 | Legal Counsel | {Name} | {Phone} | {Email} | Business hours |

### 9.3 Communication Templates

#### 9.3.1 Customer Communication (SEV-1/2)

```markdown
## Service Disruption Notice

**To:** {Customer Distribution List}
**From:** MAP Support Team
**Subject:** MAP Service Disruption - {INCIDENT-ID}

Dear {Customer Name},

We are currently experiencing a service disruption affecting {specific services}.
Our engineering team has been engaged and is working to resolve the issue.

**Impact:** {Description of impact}
**Start Time:** {UTC Time}
**Estimated Resolution:** {UTC Time or "Under Investigation"}

We will provide updates every {30 minutes/1 hour} until the issue is resolved.

We sincerely apologise for the inconvenience.

The MAP Support Team
```

#### 9.3.2 Internal Communication (SEV-1/2)

```markdown
## Incident Update - {INCIDENT-ID}

**Severity:** {SEV-1/2}
**Status:** {Investigating / Identified / Monitoring / Resolved}
**Incident Commander:** {Name}
**Duration:** {Elapsed time}

### Current Status
{Status update}

### Actions Taken
- {Action 1}
- {Action 2}

### Next Steps
- {Next step 1}
- {Next step 2}

### Customer Impact
{Impact description}

### ETA to Resolution
{Estimate or "Under Investigation"}

Next update in {30 minutes}.
```

---

## 10. Health Checks Runbook

### 10.1 Service Health Checks

#### 10.1.1 Application Health Endpoint

```bash
# Basic health check
curl -s https://$DOMAIN/health | jq '.'

# Expected response:
# {
#   "status": "healthy",
#   "version": "1.4.0",
#   "uptime": "72h 15m 30s",
#   "components": {
#     "database": {"status": "healthy", "latency_ms": 2},
#     "cache": {"status": "healthy", "latency_ms": 1},
#     "queue": {"status": "healthy", "latency_ms": 3},
#     "storage": {"status": "healthy", "latency_ms": 15}
#   }
# }

# Detailed health check
curl -s https://$DOMAIN/health/detail | jq '.'

# Readiness check
curl -s https://$DOMAIN/ready | jq '.status'
# Expected: "ready"

# Liveness check
curl -s https://$DOMAIN/live | jq '.status'
# Expected: "alive"
```

#### 10.1.2 Component Health Checks

| Component | Check Command | Expected | Failure Action |
|---|---|---|---|
| PostgreSQL | `pg_isready -h $DB_HOST` | accepting connections | Restart DB, check connections |
| Redis | `redis-cli -h $REDIS_HOST ping` | PONG | Restart Redis, check memory |
| RabbitMQ | `rabbitmqctl status` | running | Restart RabbitMQ, check queues |
| Elasticsearch | `curl localhost:9200/_cluster/health` | green/yellow | Reallocate shards, add nodes |
| S3 / Blob | `aws s3 ls s3://bucket/` | listing contents | Check IAM, network |
| DNS | `nslookup $DOMAIN` | resolves | Check DNS config, TTL |
| TLS | `openssl s_client -connect $DOMAIN:443` | valid cert | Renew certificate |

### 10.2 Dependency Health Checks

#### 10.2.1 External API Health

| API | Endpoint | Check | SLA |
|---|---|---|---|
| Payment Gateway | `/api/v1/health` | Status 200 | 99.9% uptime |
| Identity Provider | `/oauth2/health` | Status 200 | 99.9% uptime |
| Email Service | `/api/v1/ping` | Status 200 | 99.5% uptime |
| Analytics Service | `/health` | Status 200 | 99.0% uptime |

#### 10.2.2 Dependency Check Script

```bash
#!/bin/bash
# dependency_health_check.sh

echo "=== MAP Dependency Health Check ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Database
echo "1. PostgreSQL Database"
pg_isready -h $DB_HOST -p 5432 -U $DB_USER
if [ $? -eq 0 ]; then echo "   ✓ Database healthy"; else echo "   ✗ Database unhealthy"; fi

# Redis
echo "2. Redis Cache"
redis-cli -h $REDIS_HOST ping | grep -q PONG
if [ $? -eq 0 ]; then echo "   ✓ Redis healthy"; else echo "   ✗ Redis unhealthy"; fi

# RabbitMQ
echo "3. RabbitMQ Queue"
rabbitmqctl status | grep -q "running"
if [ $? -eq 0 ]; then echo "   ✓ RabbitMQ healthy"; else echo "   ✗ RabbitMQ unhealthy"; fi

# Elasticsearch
echo "4. Elasticsearch"
curl -s localhost:9200/_cluster/health | jq -r '.status' | grep -qE "green|yellow"
if [ $? -eq 0 ]; then echo "   ✓ Elasticsearch healthy"; else echo "   ✗ Elasticsearch unhealthy"; fi

# Application
echo "5. MAP Application"
curl -s https://$DOMAIN/health | jq -r '.status' | grep -q "healthy"
if [ $? -eq 0 ]; then echo "   ✓ Application healthy"; else echo "   ✗ Application unhealthy"; fi

echo ""
echo "=== Health Check Complete ==="
```

### 10.3 Validation

#### 10.3.1 Validation Checklist

| Check | Frequency | Method | Success Criteria |
|---|---|---|---|
| Application health | Every 30 seconds | Health endpoint | Status: healthy |
| Database connectivity | Every 60 seconds | pg_isready | Accepting connections |
| Cache connectivity | Every 60 seconds | Redis ping | PONG response |
| Queue connectivity | Every 60 seconds | RabbitMQ status | Running |
| API response time | Every 5 minutes | Synthetic monitoring | p95 < 500ms |
| Error rate | Every 5 minutes | Log analysis | < 1% |
| Certificate expiry | Daily | OpenSSL check | > 30 days remaining |
| Backup completion | Daily | S3 listing | Backup exists for today |

---

## 11. Maintenance Runbook

### 11.1 Scheduled Maintenance

#### 11.1.1 Maintenance Windows

| Type | Schedule | Duration | Notification | Approval |
|---|---|---|---|---|
| Weekly Patch | Saturday 02:00–04:00 UTC | 2 hours | 72 hours | Engineering Lead |
| Monthly Update | First Saturday 02:00–06:00 UTC | 4 hours | 1 week | Change Manager |
| Quarterly Upgrade | Third Saturday 02:00–08:00 UTC | 6 hours | 2 weeks | VP Engineering |
| Emergency Patch | As needed | Variable | Immediate | On-call Lead |

#### 11.1.2 Pre-Maintenance Checklist

| Step | Action | Owner | Status |
|---|---|---|---|
| 1 | Create database backup | DevOps | ☐ |
| 2 | Verify backup integrity | DevOps | ☐ |
| 3 | Notify customers of maintenance | Support | ☐ |
| 4 | Notify internal stakeholders | Operations | ☐ |
| 5 | Prepare rollback plan | DevOps | ☐ |
| 6 | Test changes in staging | QA | ☐ |
| 7 | Confirm team availability | Operations | ☐ |
| 8 | Set up monitoring for maintenance | SRE | ☐ |

### 11.2 Patching

#### 11.2.1 Patch Types

| Patch Type | Frequency | Testing | Approval | Rollback Plan |
|---|---|---|---|---|
| Security patches | As needed | Minimal | Security Lead | Standard rollback |
| Bug fixes | Weekly | Full regression | Engineering Lead | Standard rollback |
| Dependency updates | Monthly | Integration tests | Engineering Lead | Standard rollback |
| OS patches | Monthly | Smoke tests | DevOps Lead | Node replacement |
| Database patches | Quarterly | Full regression | DBA | Full backup/restore |

#### 11.2.2 Patching Procedure

```bash
# Step 1: Pull latest patch
git pull origin main
git log --oneline -5

# Step 2: Build and test
docker build -t map:$PATCH_VERSION .
docker run --rm map:$PATCH_VERSION npm test

# Step 3: Deploy to staging
kubectl apply -f k8s/deployment.yaml -n map-staging
# Run full test suite against staging

# Step 4: Deploy to pilot (if staging passes)
kubectl set image deployment/map-app \
  map-app=$REGISTRY/map:$PATCH_VERSION \
  -n map-pilot

# Step 5: Verify deployment
kubectl rollout status deployment/map-app -n map-pilot
curl -s https://$DOMAIN/health | jq '.status'

# Step 6: Monitor for 30 minutes
# Check error rates, latency, resource usage
```

### 11.3 Updates

#### 11.3.1 Update Categories

| Category | Scope | Frequency | Impact |
|---|---|---|---|
| Configuration update | ConfigMap, Environment vars | As needed | Low |
| Certificate renewal | TLS certificates | Quarterly | Low |
| Secret rotation | API keys, passwords | Quarterly | Medium |
| Database migration | Schema changes | Monthly | High |
| Infrastructure update | K8s version, node AMI | Quarterly | Medium |
| Full platform upgrade | Major version release | Semi-annually | High |

#### 11.3.2 Update Communication Template

```markdown
## Scheduled Maintenance Notice

**Service:** Migration Assurance Platform (MAP)
**Maintenance Window:** {Start Time} – {End Time} UTC
**Duration:** {Expected Duration}
**Impact:** {Expected Impact Description}

### What Will Happen During Maintenance
{Description of changes being made}

### Expected Impact
- {Impact 1}
- {Impact 2}

### What You Need To Do
- {Action 1 if any}
- {Action 2 if any}

### Support
If you experience issues after maintenance, please contact:
- Email: support@map-platform.com
- Phone: {Support Phone}

We apologise for any inconvenience.
The MAP Team
```

---

## 12. Best Practices

### 12.1 Keep Current

| Practice | Implementation | Frequency |
|---|---|---|
| Review runbooks | Compare against current state | Monthly |
| Update commands | Verify all commands work | Quarterly |
| Refresh contacts | Update escalation contacts | Quarterly |
| Incorporate lessons | Add learnings from incidents | After each incident |
| Align with changes | Update for infrastructure changes | As needed |
| Review tooling | Evaluate new tools and scripts | Semi-annually |

### 12.2 Test Regularly

| Test Type | Frequency | Scope | Success Criteria |
|---|---|---|---|
| Runbook walkthrough | Monthly | All runbooks | Steps complete without error |
| Rollback drill | Quarterly | Production-like env | Rollback < 15 min |
| Disaster recovery | Semi-annually | Full system | RTO met, RPO met |
| Incident simulation | Monthly | SEV-1 scenario | Response within SLA |
| Backup restoration | Monthly | Database | Data integrity verified |
| Failover test | Quarterly | High availability | Zero data loss |

### 12.3 Version Control

| Practice | Tool | Process |
|---|---|---|
| Runbook versioning | Git | Semantic versioning (Major.Minor) |
| Change tracking | Git commits | Descriptive commit messages |
| Review process | Pull requests | Peer review before merge |
| Release notes | CHANGELOG.md | Document all changes |
| Tagging | Git tags | Tag major versions |
| Archive | Git branches | Maintain release branches |

### 12.4 Additional Operational Best Practices

| Practice | Description | Benefit |
|---|---|---|
| Automate where possible | Script repetitive tasks | Reduce human error |
| Document exceptions | Record workarounds and gotchas | Faster resolution |
| Maintain runbook index | Keep central registry of all runbooks | Easy discovery |
| Cross-train operators | Ensure multiple people know each runbook | No single point of failure |
| Measure execution time | Track how long each runbook takes | Identify optimisation opportunities |
| Collect feedback | Ask operators for improvement suggestions | Continuous improvement |

---

## 13. Dependencies

| Dependency | Type | Impact | Mitigation |
|---|---|---|---|
| Kubernetes Cluster | Infrastructure | All deployments | Multi-AZ, auto-scaling |
| Database (PostgreSQL) | Service | Data operations | Read replicas, backups |
| Cache (Redis) | Service | Performance | Cluster mode, persistence |
| Queue (RabbitMQ) | Service | Async processing | Clustered, mirrored queues |
| Object Storage (S3) | Service | File storage | Versioning, cross-region |
| Monitoring (Prometheus) | Tool | Observability | Redundant collectors |
| Logging (ELK) | Tool | Debugging | Shipped logs, retention |
| CI/CD (GitHub Actions) | Tool | Deployment | Self-hosted runners |
| PagerDuty | Tool | Alerting | Multi-channel alerts |
| Slack | Tool | Communication | Webhook redundancy |

---

## 14. References

| Reference | Description | Location |
|---|---|---|
| MAP Architecture Document | System architecture and design | Confluence: /architecture |
| Pilot Deployment Plan | Deployment schedule and milestones | Document 13 |
| SLA Definitions | Service level agreements | Document 16: Service Management |
| Incident Management Policy | Organisational incident policy | IT Policy Repository |
| Change Management Policy | Change control procedures | IT Policy Repository |
| Security Policy | Security standards and requirements | Security Documentation |
| Vendor Support Contacts | Third-party support information | Vendor Management Database |

---

## 15. Revision History

| Version | Date | Author | Changes | Approver |
|---|---|---|---|---|
| 0.1 | 01 Jul 2026 | MAP Platform Team | Initial draft | — |
| 0.2 | 10 Jul 2026 | MAP Platform Team | Added deployment and rollback runbooks | — |
| 0.3 | 17 Jul 2026 | MAP Platform Team | Added incident response and monitoring runbooks | — |
| 0.4 | 24 Jul 2026 | MAP Platform Team | Added maintenance and health check runbooks | — |
| 1.0 | 01 Aug 2026 | MAP Platform Team | Final version, approved | VP of Engineering |

---

## 16. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Document Owner | VP of Engineering | _________________ | ____/____/2026 |
| DevOps Lead | DevOps Lead | _________________ | ____/____/2026 |
| SRE Lead | SRE Lead | _________________ | ____/____/2026 |
| Security Lead | Security Lead | _________________ | ____/____/2026 |
| Programme Sponsor | Chief Technology Officer | _________________ | ____/____/2026 |

---

**END OF DOCUMENT**

**Document ID:** MAP-ORB-015
**Version:** 1.0
**Classification:** Internal / Confidential
