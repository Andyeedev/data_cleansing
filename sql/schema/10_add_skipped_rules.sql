-- Add skipped_rules column to migration_control_summary
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'migration_control_summary'
        AND column_name = 'skipped_rules'
    ) THEN
        ALTER TABLE engine.migration_control_summary ADD COLUMN skipped_rules INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Add unique constraint for UPSERT support
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'uq_control_summary_batch_control'
    ) THEN
        ALTER TABLE engine.migration_control_summary
        ADD CONSTRAINT uq_control_summary_batch_control UNIQUE (batch_id, control_id);
    END IF;
END
$$;
