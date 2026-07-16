-- MAP Nexus Enterprise Platform
-- Workstream 05 Compliance Fixes Migration
-- Target: migration_engine database

-- =====================================================
-- FIX 5: Add workflow_history audit trail table
-- =====================================================

CREATE TABLE IF NOT EXISTS platform.workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES platform.workflow_definitions(id) ON DELETE CASCADE,
    workflow_instance_id UUID REFERENCES platform.workflow_instances(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    performed_by UUID REFERENCES platform.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_history_definition_id ON platform.workflow_history (workflow_definition_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_instance_id ON platform.workflow_history (workflow_instance_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_performed_by ON platform.workflow_history (performed_by);
CREATE INDEX IF NOT EXISTS idx_workflow_history_action ON platform.workflow_history (action);
CREATE INDEX IF NOT EXISTS idx_workflow_history_created_at ON platform.workflow_history (created_at);

-- =====================================================
-- FIX 7: Add FK constraints on tenant_id and created_by
-- =====================================================

-- Add FK constraint on platform.users.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_users_tenant_id'
    ) THEN
        ALTER TABLE platform.users
        ADD CONSTRAINT fk_users_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.users.created_by -> platform.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_users_created_by'
    ) THEN
        ALTER TABLE platform.users
        ADD CONSTRAINT fk_users_created_by
        FOREIGN KEY (created_by) REFERENCES platform.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.roles.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_roles_tenant_id'
    ) THEN
        ALTER TABLE platform.roles
        ADD CONSTRAINT fk_roles_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.roles.created_by -> platform.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_roles_created_by'
    ) THEN
        ALTER TABLE platform.roles
        ADD CONSTRAINT fk_roles_created_by
        FOREIGN KEY (created_by) REFERENCES platform.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.workflow_definitions.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_workflow_definitions_tenant_id'
    ) THEN
        ALTER TABLE platform.workflow_definitions
        ADD CONSTRAINT fk_workflow_definitions_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.workflow_definitions.created_by -> platform.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_workflow_definitions_created_by'
    ) THEN
        ALTER TABLE platform.workflow_definitions
        ADD CONSTRAINT fk_workflow_definitions_created_by
        FOREIGN KEY (created_by) REFERENCES platform.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.tasks.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_tasks_tenant_id'
    ) THEN
        ALTER TABLE platform.tasks
        ADD CONSTRAINT fk_tasks_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.calendar_events.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_calendar_events_tenant_id'
    ) THEN
        ALTER TABLE platform.calendar_events
        ADD CONSTRAINT fk_calendar_events_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.notifications.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_notifications_tenant_id'
    ) THEN
        ALTER TABLE platform.notifications
        ADD CONSTRAINT fk_notifications_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.approval_requests.tenant_id -> core.tenants
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_approval_requests_tenant_id'
    ) THEN
        ALTER TABLE platform.approval_requests
        ADD CONSTRAINT fk_approval_requests_tenant_id
        FOREIGN KEY (tenant_id) REFERENCES core.tenants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.approval_requests.requested_by -> platform.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_approval_requests_requested_by'
    ) THEN
        ALTER TABLE platform.approval_requests
        ADD CONSTRAINT fk_approval_requests_requested_by
        FOREIGN KEY (requested_by) REFERENCES platform.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.approval_requests.assigned_to -> platform.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_approval_requests_assigned_to'
    ) THEN
        ALTER TABLE platform.approval_requests
        ADD CONSTRAINT fk_approval_requests_assigned_to
        FOREIGN KEY (assigned_to) REFERENCES platform.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint on platform.approval_requests.decision_by -> platform.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_approval_requests_decision_by'
    ) THEN
        ALTER TABLE platform.approval_requests
        ADD CONSTRAINT fk_approval_requests_decision_by
        FOREIGN KEY (decision_by) REFERENCES platform.users(id) ON DELETE SET NULL;
    END IF;
END $$;
