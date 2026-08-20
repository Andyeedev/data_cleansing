-- ============================================================
-- Migration: Operations End-to-End Execution Tracking
-- Run order: 11
-- Date: 2026-08-17
-- Purpose: Track end-to-end validation runs for Operations page
-- ============================================================

-- 1. End-to-end run history table
CREATE TABLE IF NOT EXISTS engine.e2e_run_history (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    project_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    started_by TEXT NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INT,
    step_results JSONB DEFAULT '[]'::jsonb,
    controls JSONB,
    summary JSONB,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_e2e_runs_tenant_id
ON engine.e2e_run_history(tenant_id);

CREATE INDEX IF NOT EXISTS idx_e2e_runs_started_at
ON engine.e2e_run_history(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_e2e_runs_status
ON engine.e2e_run_history(status);

COMMENT ON TABLE engine.e2e_run_history
IS 'Tracks end-to-end validation runs orchestrated from Operations → Execution page';

COMMENT ON COLUMN engine.e2e_run_history.status
IS 'PENDING, RUNNING, COMPLETED, FAILED, CANCELLED';

COMMENT ON COLUMN engine.e2e_run_history.step_results
IS 'JSON array of step results: health check, discovery, mapping, execution, governance each with status, details, duration';

COMMENT ON COLUMN engine.e2e_run_history.controls
IS 'JSON summary of controls affected (control_ids, total_rules, pass/fail/skip counts)';

-- 2. Run logs table (optional, for granular step logs)
CREATE TABLE IF NOT EXISTS engine.e2e_run_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES engine.e2e_run_history(run_id),
    step VARCHAR(30) NOT NULL,
    log_level VARCHAR(10) NOT NULL DEFAULT 'INFO',
    message TEXT NOT NULL,
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_e2e_logs_run_id
ON engine.e2e_run_logs(run_id);

CREATE INDEX IF NOT EXISTS idx_e2e_logs_step
ON engine.e2e_run_logs(step);

COMMENT ON TABLE engine.e2e_run_logs
IS 'Detailed logs for each step of end-to-end runs';
