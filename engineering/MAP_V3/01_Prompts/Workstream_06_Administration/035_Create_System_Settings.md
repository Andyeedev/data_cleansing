MAP Nexus™ Enterprise Platform
Prompt 035
Create System Settings

Version: 5.0

Prompt ID: 035

Workstream: 06 — Administration

Status: Draft — Pending Review

---

Prerequisites

Complete

Workstream 01 — Platform Foundation
Prompt 000 — Prepare Development Environment
Prompt 001 — Create React Enterprise Solution
Prompt 002 — Create Enterprise Theme System
Prompt 003 — Create Enterprise Navigation System
Prompt 004 — Create Authentication Module
Prompt 005 — Create Enterprise Application Shell
Prompt 006 — Create Analytics & Dashboard Framework
Prompt 007 — Create Widget Framework

Workstream 02 — Portal Development
Prompt 008 — Create Portal Framework
Prompt 009 — Create Executive Portal
Prompt 010 — Create Operations Portal
Prompt 011 — Create Migration Portal
Prompt 012 — Create Governance Portal
Prompt 013 — Create Reporting Portal
Prompt 014 — Create Security Portal
Prompt 015 — Create Administration Portal

Workstream 03 — Presentation Engine
Prompt 016 — Create HTML Reporting Framework
Prompt 017 — Create Report Centre
Prompt 018 — Create Report Viewer
Prompt 019 — Create Report Scheduler
Prompt 020 — Create Report Distribution

Workstream 04 — AI Platform
Prompt 021 — Create AI Framework
Prompt 022 — Create AI Assistant
Prompt 023 — Create AI Insights
Prompt 024 — Create AI Recommendations
Prompt 025 — Create AI Report Generator

---

Purpose

Enhance the System Settings portal within the Administration Portal for MAP Nexus™.

System Settings provides comprehensive platform configuration including global settings, feature flags, environment management, and system health monitoring.

This prompt enhances the placeholder UI created in Prompt 015 with full system settings functionality.

---

Objective

Develop a complete System Settings module capable of:

Global Configuration — Platform-wide settings and defaults
Feature Flags — Feature toggles and rollout management
Environment Management — Dev, staging, production environments
System Health — Platform health monitoring and alerts
Performance Settings — Caching, rate limiting, optimization
Security Settings — Global security configuration
Notification Settings — Platform notification configuration
Maintenance Mode — System maintenance and downtime management

---

Design Principles

System Settings shall be

Global — Platform-wide configuration
Hierarchical — Settings inheritance and overrides
Auditable — Complete change audit trail
Secure — Critical setting protection
Resilient — Fallback and rollback capabilities
Extensible — Custom settings and categories
Metadata Driven — Configuration over code
API Ready — RESTful API integration points

---

Architecture

System Settings communicates through

Administration Portal
↓
System Settings UI
↓
System Settings Hook (useSystemSettings)
↓
System Settings Service
↓
System Settings API (Future)

---

Folder Structure

Enhance

src/
portal/
administration/
SystemSettings.tsx (Enhance existing)
hooks/
useSystemSettings.ts
services/
systemSettings.service.ts
types/
systemSettings.types.ts
components/
GlobalConfiguration.tsx
FeatureFlagManager.tsx
EnvironmentManager.tsx
SystemHealth.tsx
PerformanceSettings.tsx
SecuritySettings.tsx
NotificationSettings.tsx
MaintenanceMode.tsx
SettingsAuditLog.tsx
SettingsBackup.tsx
SettingsImportExport.tsx
SettingsSearch.tsx
SettingsCategories.tsx
SettingsDocumentation.tsx

---

System Settings Types

SystemSetting

id: string
key: string
value: unknown
category: SettingCategory
description: string
dataType: SettingDataType
isRequired: boolean
isReadOnly: boolean
defaultValue: unknown
validation?: SettingValidation
dependencies?: string[]
tenantScoped: boolean
environmentScoped: boolean
createdAt: Date
updatedAt: Date
updatedBy: string
metadata?: Record<string, unknown>

SettingCategory

enum SettingCategory {
General = 'general',
Security = 'security',
Performance = 'performance',
Notifications = 'notifications',
Integrations = 'integrations',
Compliance = 'compliance',
FeatureFlags = 'feature_flags',
Environment = 'environment',
Maintenance = 'maintenance'
}

SettingDataType

enum SettingDataType {
String = 'string',
Number = 'number',
Boolean = 'boolean',
Json = 'json',
Array = 'array',
Date = 'date',
Enum = 'enum'
}

SettingValidation

min?: number
max?: number
pattern?: string
enum?: unknown[]
required?: boolean
custom?: string

FeatureFlag

id: string
name: string
description: string
key: string
enabled: boolean
rolloutPercentage: number
rolloutStrategy: RolloutStrategy
targeting?: TargetingRule[]
variants?: FeatureVariant[]
enrichments?: FeatureEnrichment[]
holdoutGroups?: string[]
createdAt: Date
updatedAt: Date
createdBy: string
metadata?: Record<string, unknown>

RolloutStrategy

enum RolloutStrategy {
Percentage = 'percentage',
UserSegment = 'user_segment',
TenantSegment = 'tenant_segment',
Gradual = 'gradual',
Instant = 'instant'
}

TargetingRule

attribute: string
operator: string
values: unknown[]
variant?: string

FeatureVariant

id: string
name: string
weight: number
payload?: Record<string, unknown>

FeatureEnrichment

attribute: string
value: unknown

Environment

id: string
name: string
type: EnvironmentType
status: EnvironmentStatus
config: EnvironmentConfig
variables: EnvironmentVariable[]
services: EnvironmentService[]
health: EnvironmentHealth
createdAt: Date
updatedAt: Date
metadata?: Record<string, unknown>

EnvironmentType

enum EnvironmentType {
Development = 'development',
Staging = 'staging',
Production = 'production',
Test = 'test',
Disaster = 'disaster_recovery'
}

EnvironmentStatus

enum EnvironmentStatus {
Active = 'active',
Inactive = 'inactive',
Provisioning = 'provisioning',
Deprovisioning = 'deprovisioning',
Maintenance = 'maintenance'
}

EnvironmentConfig

region: string
replicas: number
resources: ResourceConfig
networking: NetworkConfig
storage: StorageConfig
logging: LoggingConfig
monitoring: MonitoringConfig

ResourceConfig

cpu: string
memory: string
gpu?: string
disk?: string

NetworkConfig

vpcId?: string
subnetIds?: string[]
securityGroupIds?: string[]
loadBalancer?: string

StorageConfig

type: string
size: string
encryption: boolean
backup: boolean

LoggingConfig

level: string
retention: number
destination: string

MonitoringConfig

enabled: boolean
interval: number
alerts: AlertConfig[]

AlertConfig

metric: string
threshold: number
comparison: string
notificationChannels: string[]

EnvironmentVariable

key: string
value: string
secret: boolean
environment: string

EnvironmentService

name: string
version: string
status: string
replicas: number
health: string

EnvironmentHealth

status: string
lastCheck: Date
uptime: number
responseTime: number
errorRate: number

SystemHealth

id: string
timestamp: Date
overall: HealthStatus
services: ServiceHealth[]
metrics: SystemMetrics
alerts: SystemAlert[]
incidents: Incident[]

HealthStatus

enum HealthStatus {
Healthy = 'healthy',
Degraded = 'degraded',
Unhealthy = 'unhealthy',
Unknown = 'unknown'
}

ServiceHealth

name: string
status: HealthStatus
responseTime: number
errorRate: number
uptime: number
lastCheck: Date
dependencies: string[]

SystemMetrics

cpuUsage: number
memoryUsage: number
diskUsage: number
networkIn: number
networkOut: number
activeConnections: number
requestsPerSecond: number
averageResponseTime: number
errorRate: number

SystemAlert

id: string
type: AlertType
severity: AlertSeverity
message: string
source: string
timestamp: Date
acknowledged: boolean
resolved: boolean
resolvedAt?: Date
resolvedBy?: string

AlertType

enum AlertType {
Performance = 'performance',
Security = 'security',
Availability = 'availability',
Capacity = 'capacity',
Configuration = 'configuration'
}

AlertSeverity

enum AlertSeverity {
Critical = 'critical',
High = 'high',
Medium = 'medium',
Low = 'low',
Info = 'info'
}

Incident

id: string
title: string
description: string
status: IncidentStatus
severity: AlertSeverity
affectedServices: string[]
startedAt: Date
resolvedAt?: Date
duration?: number
rootCause?: string
resolution?: string
postMortem?: string

IncidentStatus

enum IncidentStatus {
Investigating = 'investigating',
Identified = 'identified',
Monitoring = 'monitoring',
Resolved = 'resolved'
}

MaintenanceWindow

id: string
title: string
description: string
type: MaintenanceType
status: MaintenanceStatus
scheduledStart: Date
scheduledEnd: Date
actualStart?: Date
actualEnd?: Date
affectedServices: string[]
notificationSent: boolean
approvedBy?: string
createdAt: Date
metadata?: Record<string, unknown>

MaintenanceType

enum MaintenanceType {
Planned = 'planned',
Emergency = 'emergency',
Upgrade = 'upgrade',
Migration = 'migration'
}

MaintenanceStatus

enum MaintenanceStatus {
Scheduled = 'scheduled',
InProgress = 'in_progress',
Completed = 'completed',
Cancelled = 'cancelled',
Postponed = 'postponed'
}

---

Hook: useSystemSettings

const useSystemSettings = (config?: SystemSettingsConfig) => {
return {
// Settings CRUD
settings: SystemSetting[],
selectedSetting: SystemSetting | null,
loading: boolean,
error: string | null,

// Actions
fetchSettings: (filters?: SettingFilters) => Promise<void>,
getSettingByKey: (key: string) => Promise<SystemSetting>,
updateSetting: (key: string, value: unknown) => Promise<SystemSetting>,
resetSetting: (key: string) => Promise<SystemSetting>,
bulkUpdateSettings: (settings: Array<{key: string, value: unknown}>) => Promise<void>,

// Feature Flags
featureFlags: FeatureFlag[],
fetchFeatureFlags: () => Promise<void>,
getFeatureFlag: (key: string) => Promise<FeatureFlag>,
createFeatureFlag: (data: CreateFeatureFlagData) => Promise<FeatureFlag>,
updateFeatureFlag: (key: string, data: UpdateFeatureFlagData) => Promise<FeatureFlag>,
deleteFeatureFlag: (key: string) => Promise<void>,
toggleFeatureFlag: (key: string, enabled: boolean) => Promise<FeatureFlag>,
updateRollout: (key: string, percentage: number) => Promise<FeatureFlag>,

// Environments
environments: Environment[],
fetchEnvironments: () => Promise<void>,
getEnvironment: (id: string) => Promise<Environment>,
createEnvironment: (data: CreateEnvironmentData) => Promise<Environment>,
updateEnvironment: (id: string, data: UpdateEnvironmentData) => Promise<Environment>,
deleteEnvironment: (id: string) => Promise<void>,
cloneEnvironment: (id: string, name: string) => Promise<Environment>,

// Health
getSystemHealth: () => Promise<SystemHealth>,
getServiceHealth: (serviceName: string) => Promise<ServiceHealth>,
getMetrics: (timeRange: TimeRange) => Promise<SystemMetrics>,
getAlerts: (filters?: AlertFilters) => Promise<SystemAlert[]>,
acknowledgeAlert: (alertId: string) => Promise<SystemAlert>,
resolveAlert: (alertId: string) => Promise<SystemAlert>,

// Incidents
getIncidents: (filters?: IncidentFilters) => Promise<Incident[]>,
getIncident: (id: string) => Promise<Incident>,
createIncident: (data: CreateIncidentData) => Promise<Incident>,
updateIncident: (id: string, data: UpdateIncidentData) => Promise<Incident>,
resolveIncident: (id: string, data: ResolveIncidentData) => Promise<Incident>,

// Maintenance
getMaintenanceWindows: () => Promise<MaintenanceWindow[]>,
createMaintenanceWindow: (data: CreateMaintenanceData) => Promise<MaintenanceWindow>,
updateMaintenanceWindow: (id: string, data: UpdateMaintenanceData) => Promise<MaintenanceWindow>,
cancelMaintenanceWindow: (id: string) => Promise<MaintenanceWindow>,

// Audit
getSettingsAuditLog: (filters?: AuditFilters) => Promise<SettingsAuditEntry[]>,

// Backup
backupSettings: () => Promise<SettingsBackup>,
restoreSettings: (backupId: string) => Promise<void>,
exportSettings: () => Promise<Blob>,
importSettings: (file: File) => Promise<void>,

// Search
searchSettings: (query: string) => Promise<SystemSetting[]>,
filterSettings: (filters: SettingFilters) => Promise<SystemSetting[]>,
};
};

---

Components

GlobalConfiguration

Platform-wide settings management.

Features:
- General settings (name, URL, contact)
- Locale and timezone settings
- Default behavior configuration
- Platform branding
- Legal and compliance settings
- API configuration

FeatureFlagManager

Feature toggle and rollout management.

Features:
- Feature flag creation and editing
- Rollout percentage control
- Targeting rules
- A/B testing support
- Kill switch functionality
- Usage analytics

EnvironmentManager

Multi-environment management.

Features:
- Environment creation and configuration
- Variable management
- Service deployment tracking
- Environment comparison
- Promotion workflows
- Clone and sync

SystemHealth

Real-time system health monitoring.

Features:
- Service health dashboard
- Uptime tracking
- Response time monitoring
- Error rate tracking
- Dependency mapping
- Health history

PerformanceSettings

Platform performance configuration.

Features:
- Caching configuration
- Rate limiting settings
- Query optimization
- Resource allocation
- Connection pooling
- CDN settings

SecuritySettings

Global security configuration.

Features:
- Authentication settings
- Password policies
- Session management
- IP restrictions
- Encryption settings
- Compliance configurations

NotificationSettings

Platform notification configuration.

Features:
- Email templates
- Notification channels
- Alert thresholds
- Escalation rules
- Digest settings
- Subscription management

MaintenanceMode

System maintenance management.

Features:
- Maintenance window scheduling
- Maintenance notifications
- Service status updates
- Maintenance history
- Emergency maintenance
- Rollback procedures

SettingsAuditLog

Complete audit trail for settings changes.

Features:
- Change history timeline
- Before/after comparison
- User attribution
- Reason tracking
- Export capabilities
- Compliance reporting

---

Widget Configuration

SystemSettings widgets:

{ id: 'sys-1', type: 'status', title: 'Platform Health', size: 'lg' }
{ id: 'sys-2', type: 'status', title: 'Active Features', size: 'lg' }
{ id: 'sys-3', type: 'status', title: 'System Alerts', size: 'lg' }
{ id: 'sys-4', type: 'status', title: 'Maintenance Status', size: 'lg' }
{ id: 'sys-5', type: 'status', title: 'Environment Status', size: 'lg' }

---

API Integration Points (Future)

GET /api/v1/settings — List settings
GET /api/v1/settings/:key — Get setting
PUT /api/v1/settings/:key — Update setting
POST /api/v1/settings/bulk — Bulk update settings
GET /api/v1/feature-flags — List feature flags
GET /api/v1/feature-flags/:key — Get feature flag
POST /api/v1/feature-flags — Create feature flag
PUT /api/v1/feature-flags/:key — Update feature flag
DELETE /api/v1/feature-flags/:key — Delete feature flag
GET /api/v1/environments — List environments
GET /api/v1/environments/:id — Get environment
POST /api/v1/environments — Create environment
PUT /api/v1/environments/:id — Update environment
DELETE /api/v1/environments/:id — Delete environment
GET /api/v1/health — Get system health
GET /api/v1/health/:service — Get service health
GET /api/v1/metrics — Get system metrics
GET /api/v1/alerts — List alerts
PUT /api/v1/alerts/:id/acknowledge — Acknowledge alert
PUT /api/v1/alerts/:id/resolve — Resolve alert
GET /api/v1/incidents — List incidents
POST /api/v1/incidents — Create incident
PUT /api/v1/incidents/:id — Update incident
GET /api/v1/maintenance — List maintenance windows
POST /api/v1/maintenance — Create maintenance window

---

Security Considerations

Critical Settings
Multi-factor authentication for changes
Approval workflow for critical changes
Rollback capabilities
Change notifications

Access Controls
Role-based setting access
Setting category permissions
Environment-specific access
Audit requirements

Data Protection
Secret management
Encryption for sensitive settings
Secure storage
Access logging

Compliance
Change audit trail
Regulatory compliance
Data retention
Reporting requirements

---

Acceptance Criteria

1. Global configuration settings update correctly
2. Feature flags toggle and rollout properly
3. Environment management handles multiple environments
4. System health monitoring displays accurate status
5. Performance settings optimize platform behavior
6. Security settings enforce policies correctly
7. Notification settings configure alerts properly
8. Maintenance mode handles downtime correctly
9. Audit trail captures all settings changes
10. API integration points are defined

---

Dependencies

Widget Framework (Prompt 007)
Portal Framework (Prompt 008)
Administration Portal (Prompt 015)
Theme System (Prompt 002)
Navigation System (Prompt 003)

---

Future Enhancements

Configuration as code
Settings versioning
Settings templates
Settings rollbacks
Settings analytics
Settings automation

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
