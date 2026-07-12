-- MAP Nexus Enterprise Platform
-- Seed Data Script
-- Target: migration_engine database

-- =====================================================
-- DEFAULT ROLES
-- =====================================================

INSERT INTO platform.roles (id, name, description, type, is_system, is_default) VALUES
('a0000000-0000-0000-0000-000000000001', 'Super Admin', 'Full system access', 'system', TRUE, FALSE),
('a0000000-0000-0000-0000-000000000002', 'Tenant Admin', 'Full tenant access', 'system', TRUE, FALSE),
('a0000000-0000-0000-0000-000000000003', 'Migration Lead', 'Lead migration projects', 'system', TRUE, FALSE),
('a0000000-0000-0000-0000-000000000004', 'Data Analyst', 'Analyze and report on data', 'system', TRUE, FALSE),
('a0000000-0000-0000-0000-000000000005', 'Team Member', 'Basic team member access', 'system', TRUE, TRUE),
('a0000000-0000-0000-0000-000000000006', 'Viewer', 'Read-only access', 'system', TRUE, FALSE);

-- =====================================================
-- PERMISSIONS
-- =====================================================

-- User Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('users.create', 'users', 'create', TRUE),
('users.read', 'users', 'read', TRUE),
('users.update', 'users', 'update', TRUE),
('users.delete', 'users', 'delete', TRUE),
('users.list', 'users', 'list', TRUE);

-- Role Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('roles.create', 'roles', 'create', TRUE),
('roles.read', 'roles', 'read', TRUE),
('roles.update', 'roles', 'update', TRUE),
('roles.delete', 'roles', 'delete', TRUE),
('roles.list', 'roles', 'list', TRUE);

-- Workflow Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('workflows.create', 'workflows', 'create', TRUE),
('workflows.read', 'workflows', 'read', TRUE),
('workflows.update', 'workflows', 'update', TRUE),
('workflows.delete', 'workflows', 'delete', TRUE),
('workflows.execute', 'workflows', 'execute', TRUE);

-- Task Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('tasks.create', 'tasks', 'create', TRUE),
('tasks.read', 'tasks', 'read', TRUE),
('tasks.update', 'tasks', 'update', TRUE),
('tasks.delete', 'tasks', 'delete', TRUE),
('tasks.assign', 'tasks', 'assign', TRUE);

-- Calendar Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('calendar.create', 'calendar', 'create', TRUE),
('calendar.read', 'calendar', 'read', TRUE),
('calendar.update', 'calendar', 'update', TRUE),
('calendar.delete', 'calendar', 'delete', TRUE);

-- Approval Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('approvals.create', 'approvals', 'create', TRUE),
('approvals.read', 'approvals', 'read', TRUE),
('approvals.approve', 'approvals', 'approve', TRUE),
('approvals.reject', 'approvals', 'reject', TRUE);

-- Settings Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('settings.read', 'settings', 'read', TRUE),
('settings.update', 'settings', 'update', TRUE);

-- Migration Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('migrations.create', 'migrations', 'create', TRUE),
('migrations.read', 'migrations', 'read', TRUE),
('migrations.update', 'migrations', 'update', TRUE),
('migrations.execute', 'migrations', 'execute', TRUE),
('migrations.delete', 'migrations', 'delete', TRUE);

-- System Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('systems.create', 'systems', 'create', TRUE),
('systems.read', 'systems', 'read', TRUE),
('systems.update', 'systems', 'update', TRUE),
('systems.delete', 'systems', 'delete', TRUE);

-- Report Management
INSERT INTO platform.permissions (name, resource, action, is_system) VALUES
('reports.create', 'reports', 'create', TRUE),
('reports.read', 'reports', 'read', TRUE),
('reports.update', 'reports', 'update', TRUE),
('reports.delete', 'reports', 'delete', TRUE),
('reports.export', 'reports', 'export', TRUE);

-- =====================================================
-- ROLE PERMISSIONS (Super Admin gets all)
-- =====================================================

INSERT INTO platform.role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id FROM platform.permissions;

-- =====================================================
-- DEFAULT SYSTEM SETTINGS
-- =====================================================

INSERT INTO platform.system_settings (category, key, value, description, data_type, tenant_scoped) VALUES
('general', 'platform_name', '"MAP Nexus"', 'Platform display name', 'string', FALSE),
('general', 'platform_version', '"2.0.0"', 'Platform version', 'string', FALSE),
('general', 'support_email', '"support@mapnexus.com"', 'Support contact email', 'string', FALSE),
('general', 'max_upload_size_mb', '50', 'Maximum file upload size in MB', 'number', FALSE),
('authentication', 'max_login_attempts', '5', 'Maximum failed login attempts before lockout', 'number', FALSE),
('authentication', 'lockout_duration_minutes', '30', 'Account lockout duration in minutes', 'number', FALSE),
('authentication', 'session_timeout_minutes', '60', 'Session timeout in minutes', 'number', FALSE),
('authentication', 'password_min_length', '8', 'Minimum password length', 'number', FALSE),
('authentication', 'require_email_verification', 'true', 'Require email verification for new users', 'boolean', FALSE),
('authentication', 'mfa_enabled', 'false', 'Enable multi-factor authentication', 'boolean', FALSE),
('notifications', 'email_enabled', 'true', 'Enable email notifications', 'boolean', FALSE),
('notifications', 'in_app_enabled', 'true', 'Enable in-app notifications', 'boolean', FALSE),
('notifications', 'digest_enabled', 'false', 'Enable notification digest', 'boolean', FALSE),
('integrations', 'slack_enabled', 'false', 'Enable Slack integration', 'boolean', FALSE),
('integrations', 'teams_enabled', 'false', 'Enable Microsoft Teams integration', 'boolean', FALSE);

-- =====================================================
-- DEFAULT FEATURE FLAGS
-- =====================================================

INSERT INTO platform.feature_flags (name, description, key, enabled, rollout_percentage) VALUES
('Workflow Engine', 'Enable workflow automation features', 'workflow_engine', TRUE, 100),
('Task Management', 'Enable task management features', 'task_management', TRUE, 100),
('Calendar', 'Enable calendar features', 'calendar', TRUE, 100),
('AI Copilot', 'Enable AI assistant features', 'ai_copilot', FALSE, 0),
('Advanced Reporting', 'Enable advanced reporting features', 'advanced_reporting', FALSE, 0),
('Multi-tenant', 'Enable multi-tenant features', 'multi_tenant', FALSE, 0);

-- =====================================================
-- UPDATE TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION platform.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to platform tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'platform'
        AND table_name IN ('users', 'roles', 'workflow_definitions', 'workflow_instances', 'tasks', 'calendar_events', 'system_settings', 'feature_flags')
    LOOP
        EXECUTE format(
            'CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON platform.%I FOR EACH ROW EXECUTE FUNCTION platform.update_updated_at_column()',
            t, t
        );
    END LOOP;
END $$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA platform TO postgres;
GRANT USAGE ON SCHEMA audit TO postgres;

-- Grant all on platform tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA platform TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA platform TO postgres;

-- Grant all on audit tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA audit TO postgres;
