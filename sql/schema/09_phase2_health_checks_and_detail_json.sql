-- ============================================================
-- Phase 2 Migration: Health Checks + detail_json
-- Run order: 09
-- Date: 2026-08-16
-- ============================================================

-- 1. Add detail_json to migration_control_execution
-- Stores rich rule result data: failing columns, mismatched types, drift details
ALTER TABLE engine.migration_control_execution
ADD COLUMN IF NOT EXISTS detail_json JSONB;

COMMENT ON COLUMN engine.migration_control_execution.detail_json
IS 'Rich rule result data: failing columns, mismatched types, drift details, etc.';

-- 2. Connection health check audit table
-- Stores results of both automated and manual health checks
CREATE TABLE IF NOT EXISTS engine.connection_health_checks (
    check_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID NOT NULL,
    check_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL,
    initiated_by VARCHAR(20) NOT NULL,
    error_message TEXT,
    latency_ms INT,
    checked_by_user VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_health_checks_system_id
ON engine.connection_health_checks(system_id);

CREATE INDEX IF NOT EXISTS idx_health_checks_check_time
ON engine.connection_health_checks(check_time);

COMMENT ON TABLE engine.connection_health_checks
IS 'Audit trail for connection health checks';

COMMENT ON COLUMN engine.connection_health_checks.initiated_by
IS 'SYSTEM (auto at batch start) or ADMIN (manual trigger)';

COMMENT ON COLUMN engine.connection_health_checks.checked_by_user
IS 'User ID for manual, ENGINE for automated';
