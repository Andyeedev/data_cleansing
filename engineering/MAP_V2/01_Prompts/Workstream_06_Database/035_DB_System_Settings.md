MAP Nexus™ Enterprise Platform
Prompt 035
Database Schema — System Settings

Version: 1.0

Prompt ID: 035

Workstream: 06 — Database

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the database schema for System Settings in the MAP Nexus™ platform.

This prompt creates the PostgreSQL tables, columns, constraints, and indexes required to support global configuration, feature flags, environment management, and system health monitoring.

---

Objective

Create a system settings schema capable of:

Global Configuration — Platform-wide settings
Feature Flags — Feature toggles and rollout management
Environment Management — Dev, staging, production configs
System Health — Health monitoring and alerts
Audit Trail — Log settings changes

---

Database

Database: map_nexus
Schema: platform

---

SQL Scripts

### Table: platform.system_settings

```sql
CREATE TABLE platform.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(200) NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    data_type VARCHAR(50) NOT NULL
        CHECK (data_type IN ('string', 'number', 'boolean', 'json', 'array', 'date', 'enum')),
    is_required BOOLEAN DEFAULT FALSE,
    is_readonly BOOLEAN DEFAULT FALSE,
    default_value JSONB,
    validation_rules JSONB,
    tenant_scoped BOOLEAN DEFAULT FALSE,
    environment_scoped BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    UNIQUE(category, key)
);

-- Indexes
CREATE INDEX idx_system_settings_category ON platform.system_settings (category);
CREATE INDEX idx_system_settings_key ON platform.system_settings (key);
CREATE INDEX idx_system_settings_tenant_scoped ON platform.system_settings (tenant_scoped);

-- Comments
COMMENT ON TABLE platform.system_settings IS 'Global platform configuration';
COMMENT ON COLUMN platform.system_settings.tenant_scoped IS 'Setting can be overridden per tenant';
COMMENT ON COLUMN platform.system_settings.environment_scoped IS 'Setting varies by environment';
```

---

### Table: platform.feature_flags

```sql
CREATE TABLE platform.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    key VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage NUMERIC(5,2) DEFAULT 0
        CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    rollout_strategy VARCHAR(50) DEFAULT 'percentage'
        CHECK (rollout_strategy IN ('percentage', 'user_segment', 'tenant_segment', 'gradual', 'instant')),
    targeting_rules JSONB DEFAULT '[]',
    variants JSONB DEFAULT '[]',
    holdout_groups JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_feature_flags_key ON platform.feature_flags (key);
CREATE INDEX idx_feature_flags_enabled ON platform.feature_flags (enabled);
CREATE INDEX idx_feature_flags_status ON platform.feature_flags (status);

-- Comments
COMMENT ON TABLE platform.feature_flags IS 'Feature toggle management';
```

---

### Table: platform.environments

```sql
CREATE TABLE platform.environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('development', 'staging', 'production', 'test', 'disaster_recovery')),
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'provisioning', 'maintenance')),
    region VARCHAR(100),
    config JSONB DEFAULT '{}',
    variables JSONB DEFAULT '{}',
    health_status VARCHAR(50) DEFAULT 'unknown'
        CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
    health_last_check TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Indexes
CREATE INDEX idx_environments_type ON platform.environments (type);
CREATE INDEX idx_environments_status ON platform.environments (status);
CREATE INDEX idx_environments_health_status ON platform.environments (health_status);

-- Comments
COMMENT ON TABLE platform.environments IS 'Environment configurations';
```

---

### Table: platform.system_alerts

```sql
CREATE TABLE platform.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('performance', 'security', 'availability', 'capacity', 'configuration')),
    severity VARCHAR(50) NOT NULL
        CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    message TEXT NOT NULL,
    source VARCHAR(200),
    details JSONB DEFAULT '{}',
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_system_alerts_type ON platform.system_alerts (type);
CREATE INDEX idx_system_alerts_severity ON platform.system_alerts (severity);
CREATE INDEX idx_system_alerts_acknowledged ON platform.system_alerts (acknowledged);
CREATE INDEX idx_system_alerts_resolved ON platform.system_alerts (resolved);
CREATE INDEX idx_system_alerts_created_at ON platform.system_alerts (created_at);

-- Comments
COMMENT ON TABLE platform.system_alerts IS 'System alerts and notifications';
```

---

### Table: platform.system_incidents

```sql
CREATE TABLE platform.system_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'investigating'
        CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
    severity VARCHAR(50) NOT NULL
        CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    affected_services JSONB DEFAULT '[]',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    root_cause TEXT,
    resolution TEXT,
    post_mortem TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Indexes
CREATE INDEX idx_system_incidents_status ON platform.system_incidents (status);
CREATE INDEX idx_system_incidents_severity ON platform.system_incidents (severity);
CREATE INDEX idx_system_incidents_started_at ON platform.system_incidents (started_at);

-- Comments
COMMENT ON TABLE platform.system_incidents IS 'System incidents and outages';
```

---

### Table: platform.maintenance_windows

```sql
CREATE TABLE platform.maintenance_windows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('planned', 'emergency', 'upgrade', 'migration')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    affected_services JSONB DEFAULT '[]',
    notification_sent BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_maintenance_windows_status ON platform.maintenance_windows (status);
CREATE INDEX idx_maintenance_windows_scheduled_start ON platform.maintenance_windows (scheduled_start);
CREATE INDEX idx_maintenance_windows_type ON platform.maintenance_windows (type);

-- Comments
COMMENT ON TABLE platform.maintenance_windows IS 'Scheduled maintenance windows';
```

---

### Table: platform.settings_audit_log

```sql
CREATE TABLE platform.settings_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_type VARCHAR(50) NOT NULL
        CHECK (setting_type IN ('system_setting', 'feature_flag', 'environment', 'maintenance')),
    setting_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    performed_by UUID NOT NULL REFERENCES platform.users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_settings_audit_log_setting_type ON platform.settings_audit_log (setting_type);
CREATE INDEX idx_settings_audit_log_setting_id ON platform.settings_audit_log (setting_id);
CREATE INDEX idx_settings_audit_log_performed_by ON platform.settings_audit_log (performed_by);
CREATE INDEX idx_settings_audit_log_created_at ON platform.settings_audit_log (created_at);

-- Comments
COMMENT ON TABLE platform.settings_audit_log IS 'Audit trail for settings changes';
```

---

### Seed Data

```sql
-- General settings
INSERT INTO platform.system_settings (category, key, value, description, data_type, is_required, default_value) VALUES
('general', 'platform_name', '"MAP Nexus"', 'Platform display name', 'string', TRUE, '"MAP Nexus"'),
('general', 'platform_url', '"https://mapnexus.com"', 'Platform base URL', 'string', TRUE, '"https://mapnexus.com"'),
('general', 'support_email', '"support@mapnexus.com"', 'Support contact email', 'string', TRUE, '"support@mapnexus.com"'),
('general', 'default_language', '"en"', 'Default language code', 'string', TRUE, '"en"'),
('general', 'default_timezone', '"UTC"', 'Default timezone', 'string', TRUE, '"UTC"');

-- Security settings
INSERT INTO platform.system_settings (category, key, value, description, data_type, is_required, default_value) VALUES
('security', 'password_min_length', '12', 'Minimum password length', 'number', TRUE, '12'),
('security', 'password_require_uppercase', 'true', 'Require uppercase letters', 'boolean', TRUE, 'true'),
('security', 'password_require_numbers', 'true', 'Require numbers', 'boolean', TRUE, 'true'),
('security', 'password_require_special', 'true', 'Require special characters', 'boolean', TRUE, 'true'),
('security', 'session_timeout_minutes', '30', 'Session timeout in minutes', 'number', TRUE, '30'),
('security', 'max_login_attempts', '5', 'Max failed login attempts before lockout', 'number', TRUE, '5'),
('security', 'lockout_duration_minutes', '15', 'Account lockout duration', 'number', TRUE, '15');

-- Notification settings
INSERT INTO platform.system_settings (category, key, value, description, data_type, is_required, default_value) VALUES
('notifications', 'email_enabled', 'true', 'Enable email notifications', 'boolean', TRUE, 'true'),
('notifications', 'smtp_host', '""', 'SMTP server host', 'string', FALSE, '""'),
('notifications', 'smtp_port', '587', 'SMTP server port', 'number', FALSE, '587'),
('notifications', 'smtp_username', '""', 'SMTP username', 'string', FALSE, '""'),
('notifications', 'smtp_password', '""', 'SMTP password', 'string', FALSE, '""');

-- Feature flags
INSERT INTO platform.feature_flags (name, description, key, enabled, rollout_percentage, rollout_strategy) VALUES
('AI Assistant', 'Enable AI Assistant feature', 'ai_assistant', TRUE, 100, 'percentage'),
('AI Insights', 'Enable AI Insights feature', 'ai_insights', TRUE, 100, 'percentage'),
('AI Recommendations', 'Enable AI Recommendations feature', 'ai_recommendations', FALSE, 0, 'percentage'),
('Advanced Reporting', 'Enable advanced reporting features', 'advanced_reporting', TRUE, 50, 'percentage'),
('Beta Features', 'Enable beta features for testing', 'beta_features', FALSE, 0, 'percentage');

-- Default environment
INSERT INTO platform.environments (name, description, type, status, region, health_status) VALUES
('Development', 'Development environment', 'development', 'active', 'us-east-1', 'healthy'),
('Staging', 'Staging environment', 'staging', 'active', 'us-east-1', 'healthy'),
('Production', 'Production environment', 'production', 'active', 'us-east-1', 'healthy');
```

---

### Trigger: update_updated_at

```sql
CREATE TRIGGER trigger_system_settings_updated_at
    BEFORE UPDATE ON platform.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();

CREATE TRIGGER trigger_feature_flags_updated_at
    BEFORE UPDATE ON platform.feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();

CREATE TRIGGER trigger_environments_updated_at
    BEFORE UPDATE ON platform.environments
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();

CREATE TRIGGER trigger_system_incidents_updated_at
    BEFORE UPDATE ON platform.system_incidents
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();

CREATE TRIGGER trigger_maintenance_windows_updated_at
    BEFORE UPDATE ON platform.maintenance_windows
    FOR EACH ROW
    EXECUTE FUNCTION platform.update_updated_at();
```

---

### Grant Permissions

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.system_settings TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.feature_flags TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.environments TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.system_alerts TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.system_incidents TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.maintenance_windows TO map_nexus_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON platform.settings_audit_log TO map_nexus_app;
```

---

Acceptance Criteria

1. platform.system_settings table created with categories
2. platform.feature_flags table created with rollout support
3. platform.environments table created
4. platform.system_alerts table created
5. platform.system_incidents table created
6. platform.maintenance_windows table created
7. platform.settings_audit_log table created
8. General settings seeded (platform name, URL, etc.)
9. Security settings seeded (password policy, session timeout)
10. Feature flags seeded (AI features, advanced reporting)
11. Default environments seeded (Development, Staging, Production)
12. All indexes created for query performance

---

Dependencies

031_DB_User_Management (platform.users table)

---

Next Steps

After this prompt, implement:

040_System_Settings_API — FastAPI endpoints for system settings
045_System_Settings_UI — React frontend for system settings

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
