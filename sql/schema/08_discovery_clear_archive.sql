-- =============================================================================
-- Discovery "Clear All" archive & audit tables
-- -----------------------------------------------------------------------------
-- Purpose: support a HARD DELETE of discovery dataset mappings (so auto-discovery
-- can re-insert cleanly) while preserving a recoverable, auditable copy of every
-- deleted record, including who/when/which client.
--
-- Children of core.dataset_mappings (dataset_columns, column_mappings,
-- rule_dataset_mapping) are removed by ON DELETE CASCADE, so they must be
-- archived BEFORE the delete. These archive tables hold those copies.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Operation header: one row per "Clear All" action (the audit event)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.discovery_clear_operations (
    operation_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID,
    tenant_name         VARCHAR(255),                       -- snapshotted client name
    deleted_by_user_id VARCHAR(255),                       -- from auth context
    deleted_by_name     VARCHAR(255),                      -- snapshotted person name
    deleted_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    row_count           INTEGER NOT NULL DEFAULT 0,        -- # mappings cleared
    status              VARCHAR(20) NOT NULL DEFAULT 'CLEARED', -- CLEARED | RESTORED
    restored_at         TIMESTAMP,
    restored_by         VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_discovery_clear_ops_tenant
    ON core.discovery_clear_operations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_discovery_clear_ops_deleted_at
    ON core.discovery_clear_operations (deleted_at DESC);

-- -----------------------------------------------------------------------------
-- 2) Archived dataset mappings (one row per deleted mapping)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.dataset_mappings_archive (
    archive_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id        UUID NOT NULL REFERENCES core.discovery_clear_operations (operation_id),
    original_mapping_id UUID,
    project_id          UUID,
    source_system_id    UUID,
    target_system_id    UUID,
    source_schema       VARCHAR(150),
    source_table        VARCHAR(150),
    source_columns      TEXT[],
    target_schema       VARCHAR(150),
    target_table        VARCHAR(150),
    target_columns      TEXT[],
    is_active           BOOLEAN,
    created_at          TIMESTAMP,
    archived_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dataset_mappings_archive_op
    ON core.dataset_mappings_archive (operation_id);

-- -----------------------------------------------------------------------------
-- 3) Archived dataset columns (children of mappings)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.dataset_columns_archive (
    archive_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id        UUID NOT NULL REFERENCES core.discovery_clear_operations (operation_id),
    original_column_id  UUID,
    original_mapping_id UUID,                              -- links back to (2)
    column_name         VARCHAR(150),
    column_position     INTEGER,
    data_type           VARCHAR(100),
    column_side         VARCHAR(10),
    is_nullable         BOOLEAN,
    is_primary_key      BOOLEAN,
    inferred_role       VARCHAR(50),
    archived_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dataset_columns_archive_op
    ON core.dataset_columns_archive (operation_id);
CREATE INDEX IF NOT EXISTS idx_dataset_columns_archive_mapping
    ON core.dataset_columns_archive (original_mapping_id);

-- -----------------------------------------------------------------------------
-- 4) Archived rule bindings (rule_dataset_mapping)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.rule_dataset_mapping_archive (
    archive_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id        UUID NOT NULL REFERENCES core.discovery_clear_operations (operation_id),
    original_id         UUID,
    rule_id             VARCHAR(50),
    original_mapping_id UUID,                              -- links back to (2)
    is_active           BOOLEAN,
    archived_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rule_dataset_mapping_archive_op
    ON core.rule_dataset_mapping_archive (operation_id);
CREATE INDEX IF NOT EXISTS idx_rule_dataset_mapping_archive_mapping
    ON core.rule_dataset_mapping_archive (original_mapping_id);
