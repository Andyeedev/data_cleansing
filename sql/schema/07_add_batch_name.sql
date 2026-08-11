-- Add batch_name to migration_batch_registry
ALTER TABLE engine.migration_batch_registry 
ADD COLUMN IF NOT EXISTS batch_name VARCHAR(255) NULL;

-- Index for faster lookups by name
CREATE INDEX IF NOT EXISTS idx_batch_registry_batch_name 
ON engine.migration_batch_registry(batch_name);

-- Backfill existing records with auto-generated names
UPDATE engine.migration_batch_registry 
SET batch_name = CONCAT('Batch - ', TO_CHAR(batch_start_time, 'YYYY-MM-DD HH24:MI'))
WHERE batch_name IS NULL;
