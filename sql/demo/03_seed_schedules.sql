-- =====================================================
-- SEED DATA: Calendar Events + Migration Schedules
-- =====================================================

-- Get project IDs for seeding
DO $$
DECLARE
    proj_alpha UUID;
    proj_beta UUID;
    proj_gamma UUID;
    proj_delta UUID;
    tenant_default UUID;
    tenant_client1 UUID;
    cal_event_1 UUID;
    cal_event_2 UUID;
    cal_event_3 UUID;
    cal_event_4 UUID;
BEGIN
    -- Look up project IDs
    SELECT project_id INTO proj_alpha FROM core.projects WHERE project_name = 'Data Migration Alpha' LIMIT 1;
    SELECT project_id INTO proj_beta FROM core.projects WHERE project_name = 'Data Migration Beta' LIMIT 1;
    SELECT project_id INTO proj_gamma FROM core.projects WHERE project_name = 'Data Migration Gamma' LIMIT 1;
    SELECT project_id INTO proj_delta FROM core.projects WHERE project_name = 'Data Migration Delta' LIMIT 1;
    SELECT tenant_id INTO tenant_default FROM core.tenants WHERE tenant_name = 'Default Tenant' LIMIT 1;
    SELECT tenant_id INTO tenant_client1 FROM core.tenants WHERE tenant_name = 'Client One' LIMIT 1;

    -- =====================================================
    -- CALENDAR EVENTS (linked to schedules)
    -- =====================================================

    INSERT INTO platform.calendar_events (id, title, description, type, status, start_time, recurrence, project_id, tenant_id, timezone)
    VALUES (gen_random_uuid(), 'Daily Alpha Validation', 'Automated daily validation run for Data Migration Alpha', 'task', 'scheduled',
            NOW() + INTERVAL '1 day', '{"frequency": "daily", "interval": 1, "time": "02:00"}'::jsonb,
            proj_alpha, tenant_default, 'UTC')
    RETURNING id INTO cal_event_1;

    INSERT INTO platform.calendar_events (id, title, description, type, status, start_time, recurrence, project_id, tenant_id, timezone)
    VALUES (gen_random_uuid(), 'Weekly Beta Full Check', 'Weekly comprehensive validation for Data Migration Beta', 'milestone', 'scheduled',
            NOW() + INTERVAL '3 days', '{"frequency": "weekly", "interval": 1, "day": "monday", "time": "06:00"}'::jsonb,
            proj_beta, tenant_default, 'UTC')
    RETURNING id INTO cal_event_2;

    INSERT INTO platform.calendar_events (id, title, description, type, status, start_time, recurrence, project_id, tenant_id, timezone)
    VALUES (gen_random_uuid(), 'Gamma Scheduled Run', 'Twice-weekly validation for Data Migration Gamma', 'task', 'scheduled',
            NOW() + INTERVAL '2 days', '{"frequency": "weekly", "interval": 2, "day": "wednesday", "time": "03:00"}'::jsonb,
            proj_gamma, tenant_default, 'UTC')
    RETURNING id INTO cal_event_3;

    INSERT INTO platform.calendar_events (id, title, description, type, status, start_time, recurrence, project_id, tenant_id, timezone)
    VALUES (gen_random_uuid(), 'Client One Delta Validation', 'Daily validation for Client One Delta project', 'task', 'scheduled',
            NOW() + INTERVAL '1 day', '{"frequency": "daily", "interval": 1, "time": "04:00"}'::jsonb,
            proj_delta, tenant_client1, 'UTC')
    RETURNING id INTO cal_event_4;

    -- =====================================================
    -- MIGRATION SCHEDULES
    -- =====================================================

    -- Schedule 1: Daily Alpha (linked to calendar event)
    INSERT INTO engine.migration_schedules (schedule_id, calendar_event_id, project_id, tenant_id, name, description, cron_expression, enabled, status, next_run, execution_count)
    VALUES (gen_random_uuid(), cal_event_1, proj_alpha, tenant_default, 'Daily Alpha Validation',
            'Runs every day at 02:00 UTC', '0 2 * * *', TRUE, 'pending',
            NOW() + INTERVAL '1 day', 12);

    -- Schedule 2: Weekly Beta (linked to calendar event)
    INSERT INTO engine.migration_schedules (schedule_id, calendar_event_id, project_id, tenant_id, name, description, cron_expression, enabled, status, next_run, execution_count)
    VALUES (gen_random_uuid(), cal_event_2, proj_beta, tenant_default, 'Weekly Beta Full Check',
            'Runs every Monday at 06:00 UTC', '0 6 * * 1', TRUE, 'completed',
            NOW() + INTERVAL '3 days', 8);

    -- Schedule 3: Gamma Twice Weekly (linked to calendar event)
    INSERT INTO engine.migration_schedules (schedule_id, calendar_event_id, project_id, tenant_id, name, description, cron_expression, enabled, status, next_run, execution_count)
    VALUES (gen_random_uuid(), cal_event_3, proj_gamma, tenant_default, 'Gamma Scheduled Run',
            'Runs Wednesdays at 03:00 UTC', '0 3 * * 3', TRUE, 'running',
            NOW() + INTERVAL '2 days', 5);

    -- Schedule 4: Client One Delta (linked to calendar event)
    INSERT INTO engine.migration_schedules (schedule_id, calendar_event_id, project_id, tenant_id, name, description, cron_expression, enabled, status, next_run, execution_count)
    VALUES (gen_random_uuid(), cal_event_4, proj_delta, tenant_client1, 'Client One Delta Validation',
            'Daily validation for Client One', '0 4 * * *', TRUE, 'pending',
            NOW() + INTERVAL '1 day', 3);

END $$;

-- =====================================================
-- SEED EXECUTION LOGS (sample historical runs)
-- =====================================================

INSERT INTO engine.schedule_execution_log (schedule_id, batch_id, status, started_at, completed_at, duration_seconds, terminal_output, error_message, exit_code, triggered_by)
SELECT
    ms.schedule_id,
    gen_random_uuid(),
    CASE WHEN random() > 0.2 THEN 'completed' ELSE 'failed' END,
    NOW() - (random() * INTERVAL '14 days'),
    NOW() - (random() * INTERVAL '14 days') + (random() * INTERVAL '30 minutes'),
    FLOOR(random() * 1800)::int,
    '═══════════════════════════════════════════════════════════════
  MAP CLI — Migration Validation Engine v1.4
═══════════════════════════════════════════════════════════════

[Step 1/5] Initializing execution context...
  ✓ Database connection established
  ✓ Source schema validated
  ✓ Target schema validated

[Step 2/5] Loading validation rules...
  ✓ 3 controls loaded (C01-C03)
  ✓ 3 rules loaded
  ✓ 3 entity parameters loaded

[Step 3/5] Executing validations...
  → C01: Row Count Match.......... PASS (source=15000, target=15000)
  → C02: Financial Reconciliation. PASS (variance=0.00)
  → C03: Referential Integrity.... PASS (orphan_count=0)

[Step 4/5] Generating summary...
  ✓ Control summary written
  ✓ Batch summary written

[Step 5/5] Exporting results...
  ✓ Export complete

═══════════════════════════════════════════════════════════════
  RESULT: ALL PASSED | Score: 100.00% | Duration: 12.4s
═══════════════════════════════════════════════════════════════',
    NULL,
    0,
    CASE WHEN random() > 0.7 THEN 'manual' ELSE 'scheduled' END
FROM engine.migration_schedules ms
CROSS JOIN generate_series(1, 3) AS gs;
