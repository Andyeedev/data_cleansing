-- =====================================================
-- MIGRATION SCHEDULES
-- Links to platform.calendar_events for event-driven triggers
-- =====================================================

CREATE TABLE IF NOT EXISTS engine.migration_schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_event_id UUID REFERENCES platform.calendar_events(id) ON DELETE SET NULL,
    project_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cron_expression VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    enabled BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'running', 'completed', 'failed', 'disabled', 'paused')),
    next_run TIMESTAMP WITH TIME ZONE,
    last_run TIMESTAMP WITH TIME ZONE,
    last_status VARCHAR(50),
    execution_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migration_schedules_project ON engine.migration_schedules(project_id);
CREATE INDEX IF NOT EXISTS idx_migration_schedules_tenant ON engine.migration_schedules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_migration_schedules_next_run ON engine.migration_schedules(next_run);
CREATE INDEX IF NOT EXISTS idx_migration_schedules_enabled ON engine.migration_schedules(enabled);


-- =====================================================
-- SCHEDULE EXECUTION LOG
-- Stores terminal output from each MAP CLI run
-- =====================================================

CREATE TABLE IF NOT EXISTS engine.schedule_execution_log (
    execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES engine.migration_schedules(schedule_id) ON DELETE CASCADE,
    batch_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'running'
        CHECK (status IN ('running', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    terminal_output TEXT,
    error_message TEXT,
    exit_code INTEGER,
    triggered_by VARCHAR(50) DEFAULT 'scheduled'
        CHECK (triggered_by IN ('scheduled', 'manual', 'calendar_event')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedule_execution_log_schedule ON engine.schedule_execution_log(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_execution_log_status ON engine.schedule_execution_log(status);
CREATE INDEX IF NOT EXISTS idx_schedule_execution_log_started ON engine.schedule_execution_log(started_at DESC);
