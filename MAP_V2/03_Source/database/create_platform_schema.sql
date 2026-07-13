-- MAP Nexus Enterprise Platform
-- Platform Schema Creation Script
-- Target: migration_engine database

-- Create platform schema
CREATE SCHEMA IF NOT EXISTS platform;

-- =====================================================
-- USER MANAGEMENT
-- =====================================================

CREATE TABLE platform.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    avatar_url TEXT,
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('active', 'inactive', 'suspended', 'pending', 'locked')),
    tenant_id UUID,
    department VARCHAR(100),
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_users_email ON platform.users (email);
CREATE INDEX idx_platform_users_status ON platform.users (status);
CREATE INDEX idx_platform_users_tenant_id ON platform.users (tenant_id);

CREATE TABLE platform.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_refresh_tokens_user_id ON platform.refresh_tokens (user_id);

CREATE TABLE platform.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_user_sessions_user_id ON platform.user_sessions (user_id);

-- =====================================================
-- ROLE MANAGEMENT
-- =====================================================

CREATE TABLE platform.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'custom'
        CHECK (type IN ('system', 'custom', 'template')),
    parent_id UUID REFERENCES platform.roles(id),
    level INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'deprecated')),
    tenant_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_roles_tenant_id ON platform.roles (tenant_id);
CREATE INDEX idx_platform_roles_type ON platform.roles (type);
CREATE INDEX idx_platform_roles_status ON platform.roles (status);

CREATE TABLE platform.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_permissions_resource ON platform.permissions (resource);
CREATE INDEX idx_platform_permissions_action ON platform.permissions (action);

CREATE TABLE platform.role_permissions (
    role_id UUID NOT NULL REFERENCES platform.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES platform.permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT TRUE,
    conditions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE platform.user_roles (
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES platform.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES platform.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_temporary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_platform_user_roles_user_id ON platform.user_roles (user_id);
CREATE INDEX idx_platform_user_roles_role_id ON platform.user_roles (role_id);

-- =====================================================
-- WORKFLOW MANAGEMENT
-- =====================================================

CREATE TABLE platform.workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('approval', 'notification', 'task', 'migration', 'governance', 'custom')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
    version INTEGER DEFAULT 1,
    steps JSONB NOT NULL DEFAULT '[]',
    triggers JSONB DEFAULT '[]',
    variables JSONB DEFAULT '{}',
    tenant_id UUID,
    is_system BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_workflow_definitions_tenant_id ON platform.workflow_definitions (tenant_id);
CREATE INDEX idx_platform_workflow_definitions_type ON platform.workflow_definitions (type);
CREATE INDEX idx_platform_workflow_definitions_status ON platform.workflow_definitions (status);

CREATE TABLE platform.workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES platform.workflow_definitions(id),
    name VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium',
    context JSONB DEFAULT '{}',
    variables JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    tenant_id UUID,
    initiated_by UUID NOT NULL,
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_workflow_instances_status ON platform.workflow_instances (status);
CREATE INDEX idx_platform_workflow_instances_tenant_id ON platform.workflow_instances (tenant_id);

CREATE TABLE platform.workflow_step_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES platform.workflow_instances(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    input JSONB DEFAULT '{}',
    output JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID,
    approved_by UUID,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_workflow_step_instances_instance_id ON platform.workflow_step_instances (workflow_instance_id);

CREATE TABLE platform.workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES platform.workflow_instances(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    step_name VARCHAR(200),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    details JSONB DEFAULT '{}',
    performed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_workflow_history_instance_id ON platform.workflow_history (workflow_instance_id);

-- =====================================================
-- APPROVAL MANAGEMENT
-- =====================================================

CREATE TABLE platform.approval_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    steps JSONB NOT NULL DEFAULT '[]',
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE platform.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES platform.approval_templates(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium',
    data JSONB DEFAULT '{}',
    requester_id UUID NOT NULL,
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER DEFAULT 1,
    due_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_approval_requests_status ON platform.approval_requests (status);
CREATE INDEX idx_platform_approval_requests_requester_id ON platform.approval_requests (requester_id);

CREATE TABLE platform.approval_step_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES platform.approval_requests(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    approver_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    comments TEXT,
    decided_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_approval_step_instances_request_id ON platform.approval_step_instances (request_id);

-- =====================================================
-- TASK MANAGEMENT
-- =====================================================

CREATE TABLE platform.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo'
        CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'blocked', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    type VARCHAR(50) NOT NULL DEFAULT 'task',
    assigned_to UUID REFERENCES platform.users(id),
    assigned_by UUID REFERENCES platform.users(id),
    project_id UUID,
    parent_task_id UUID REFERENCES platform.tasks(id),
    due_date DATE,
    estimated_hours NUMERIC(6,2),
    actual_hours NUMERIC(6,2),
    completion_percentage INTEGER DEFAULT 0
        CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    tags JSONB DEFAULT '[]',
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_tasks_assigned_to ON platform.tasks (assigned_to);
CREATE INDEX idx_platform_tasks_status ON platform.tasks (status);
CREATE INDEX idx_platform_tasks_priority ON platform.tasks (priority);
CREATE INDEX idx_platform_tasks_tenant_id ON platform.tasks (tenant_id);

CREATE TABLE platform.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_task_comments_task_id ON platform.task_comments (task_id);

CREATE TABLE platform.task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    depends_on_id UUID NOT NULL REFERENCES platform.tasks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(20) DEFAULT 'finish_to_start',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, depends_on_id)
);

-- =====================================================
-- NOTIFICATION MANAGEMENT
-- =====================================================

CREATE TABLE platform.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info'
        CHECK (severity IN ('info', 'success', 'warning', 'error')),
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_notifications_user_id ON platform.notifications (user_id);
CREATE INDEX idx_platform_notifications_is_read ON platform.notifications (is_read);
CREATE INDEX idx_platform_notifications_created_at ON platform.notifications (created_at DESC);

CREATE TABLE platform.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL
        CHECK (channel IN ('email', 'in_app', 'push')),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, type, channel)
);

-- =====================================================
-- CALENDAR MANAGEMENT
-- =====================================================

CREATE TABLE platform.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('meeting', 'deadline', 'milestone', 'task', 'reminder', 'governance', 'custom')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    all_day BOOLEAN DEFAULT FALSE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    recurrence JSONB,
    attendees JSONB DEFAULT '[]',
    organizer_id UUID REFERENCES platform.users(id),
    project_id UUID,
    location VARCHAR(500),
    meeting_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    tenant_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_calendar_events_start_time ON platform.calendar_events (start_time);
CREATE INDEX idx_platform_calendar_events_organizer_id ON platform.calendar_events (organizer_id);
CREATE INDEX idx_platform_calendar_events_type ON platform.calendar_events (type);
CREATE INDEX idx_platform_calendar_events_tenant_id ON platform.calendar_events (tenant_id);

CREATE TABLE platform.calendar_event_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES platform.calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform.users(id),
    reminder_type VARCHAR(50) NOT NULL DEFAULT 'email',
    minutes_before INTEGER NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_platform_calendar_reminders_event_id ON platform.calendar_event_reminders (event_id);

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

CREATE TABLE platform.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(200) NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    data_type VARCHAR(50) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_readonly BOOLEAN DEFAULT FALSE,
    default_value JSONB,
    tenant_scoped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID,
    UNIQUE(category, key)
);

CREATE INDEX idx_platform_system_settings_category ON platform.system_settings (category);

CREATE TABLE platform.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    key VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage NUMERIC(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_platform_feature_flags_key ON platform.feature_flags (key);

-- =====================================================
-- CROSS-SCHEMA FOREIGN KEYS (platform → core)
-- =====================================================

-- Tenant references
ALTER TABLE platform.users ADD CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.roles ADD CONSTRAINT fk_roles_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.tasks ADD CONSTRAINT fk_tasks_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.workflow_definitions ADD CONSTRAINT fk_workflow_definitions_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.workflow_instances ADD CONSTRAINT fk_workflow_instances_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.approval_requests ADD CONSTRAINT fk_approval_requests_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.approval_templates ADD CONSTRAINT fk_approval_templates_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);
ALTER TABLE platform.calendar_events ADD CONSTRAINT fk_calendar_events_tenant FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id);

-- Project references
ALTER TABLE platform.tasks ADD CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES core.projects(project_id);
ALTER TABLE platform.calendar_events ADD CONSTRAINT fk_calendar_events_project FOREIGN KEY (project_id) REFERENCES core.projects(project_id);
