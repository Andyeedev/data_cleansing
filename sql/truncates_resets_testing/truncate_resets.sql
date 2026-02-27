🔥 CLEAN RESET SCRIPT
-- =====================================
-- FULL EXECUTION RESET (SAFE)
-- =====================================

TRUNCATE TABLE engine.migration_control_execution RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_validation_batch CASCADE;
TRUNCATE TABLE engine.migration_batch_intelligence CASCADE;
TRUNCATE TABLE engine.migration_release_decision CASCADE;

-- Optional (if exists)
-- TRUNCATE TABLE engine.migration_anomaly_audit CASCADE;

-- Do NOT truncate:
-- engine.governance_config
-- reporting.dim_*