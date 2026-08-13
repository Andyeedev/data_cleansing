# Phase 14 — Technical Design (DDL + Procedure SQL)

**Phase:** 14 — Discovery and Mapping Clear Recovery
**Status:** Draft — pending approval
**Related:** `14_0_Scope_Document.md`, `14_3_Implementation_Plan.md`
**Authoritative DDL file:** `sql/schema/08_discovery_clear_archive.sql`

---

## 1. Archive & Audit Tables (DDL)

All new tables in `core` (same schema as live `dataset_mappings`). Children cascade-delete from
`dataset_mappings`, so they are archived **before** the delete.

```sql
-- 1) Operation header: one row per "Clear All" action (the audit event)
CREATE TABLE IF NOT EXISTS core.discovery_clear_operations (
    operation_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID,
    tenant_name         VARCHAR(255),                       -- snapshotted client name
    deleted_by_user_id VARCHAR(255),                       -- from auth context
    deleted_by_name     VARCHAR(255),                       -- snapshotted person name
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

-- 2) Archived dataset mappings (one row per deleted mapping)
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

-- 3) Archived dataset columns (children of mappings)
CREATE TABLE IF NOT EXISTS core.dataset_columns_archive (
    archive_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id        UUID NOT NULL REFERENCES core.discovery_clear_operations (operation_id),
    original_column_id  UUID,
    original_mapping_id UUID,
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

-- 4) Archived rule bindings (rule_dataset_mapping)
CREATE TABLE IF NOT EXISTS core.rule_dataset_mapping_archive (
    archive_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id        UUID NOT NULL REFERENCES core.discovery_clear_operations (operation_id),
    original_id         UUID,
    rule_id             VARCHAR(50),
    original_mapping_id UUID,
    is_active           BOOLEAN,
    archived_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rule_dataset_mapping_archive_op
    ON core.rule_dataset_mapping_archive (operation_id);
CREATE INDEX IF NOT EXISTS idx_rule_dataset_mapping_archive_mapping
    ON core.rule_dataset_mapping_archive (original_mapping_id);
```

---

## 2. Clear All — archive-then-delete (single transaction)

```sql
-- a) audit header (capture tenant_name + acting user at clear time)
INSERT INTO core.discovery_clear_operations
    (operation_id, tenant_id, tenant_name, deleted_by_user_id, deleted_by_name, row_count)
VALUES (:operation_id, :tenant_id, :tenant_name, :user_id, :user_name, 0)
RETURNING operation_id;

-- b) archive columns (children) for the tenant's mappings
INSERT INTO core.dataset_columns_archive
    (operation_id, original_column_id, original_mapping_id, column_name,
     column_position, data_type, column_side, is_nullable, is_primary_key, inferred_role)
SELECT :operation_id, dc.column_id, dm.mapping_id, dc.column_name,
       dc.column_position, dc.data_type, dc.column_side, dc.is_nullable,
       dc.is_primary_key, dc.inferred_role
FROM core.dataset_columns dc
JOIN core.dataset_mappings dm ON dm.mapping_id = dc.mapping_id
JOIN core.projects p ON p.project_id = dm.project_id
WHERE p.tenant_id = :tenant_id;

-- c) archive rule bindings for the tenant's mappings
INSERT INTO core.rule_dataset_mapping_archive
    (operation_id, original_id, rule_id, original_mapping_id, is_active)
SELECT :operation_id, rdm.id, rdm.rule_id, dm.mapping_id, rdm.is_active
FROM core.rule_dataset_mapping rdm
JOIN core.dataset_mappings dm ON dm.mapping_id = rdm.mapping_id
JOIN core.projects p ON p.project_id = dm.project_id
WHERE p.tenant_id = :tenant_id;

-- d) archive mappings themselves
INSERT INTO core.dataset_mappings_archive
    (operation_id, original_mapping_id, project_id, source_system_id, target_system_id,
     source_schema, source_table, source_columns, target_schema, target_table,
     target_columns, is_active, created_at)
SELECT :operation_id, dm.mapping_id, dm.project_id, dm.source_system_id, dm.target_system_id,
       dm.source_schema, dm.source_table, dm.source_columns, dm.target_schema,
       dm.target_table, dm.target_columns, dm.is_active, dm.created_at
FROM core.dataset_mappings dm
JOIN core.projects p ON p.project_id = dm.project_id
WHERE p.tenant_id = :tenant_id;

-- e) update row_count on the header
UPDATE core.discovery_clear_operations
SET row_count = (SELECT count(*) FROM core.dataset_mappings_archive WHERE operation_id = :operation_id)
WHERE operation_id = :operation_id;

-- f) HARD DELETE live mappings; cascade removes dataset_columns/column_mappings/rule_dataset_mapping
DELETE FROM core.dataset_mappings dm
USING core.projects p
WHERE dm.project_id = p.project_id AND p.tenant_id = :tenant_id;
```

> The Mapping `clear-all` uses the same pattern, archiving `column_mappings` in addition to
> `dataset_mappings` for the tenant.

---

## 3. Restore — re-insert archive, skip conflicts

```sql
-- mappings
INSERT INTO core.dataset_mappings
    (mapping_id, project_id, source_system_id, target_system_id, source_schema,
     source_table, source_columns, target_schema, target_table, target_columns, is_active, created_at)
SELECT a.original_mapping_id, a.project_id, a.source_system_id, a.target_system_id,
       a.source_schema, a.source_table, a.source_columns, a.target_schema,
       a.target_table, a.target_columns, true, a.created_at
FROM core.dataset_mappings_archive a
WHERE a.operation_id = :operation_id
ON CONFLICT (mapping_id) DO NOTHING;

-- columns
INSERT INTO core.dataset_columns
    (column_id, mapping_id, column_name, column_position, data_type,
     column_side, is_nullable, is_primary_key, inferred_role)
SELECT a.original_column_id, a.original_mapping_id, a.column_name, a.column_position,
       a.data_type, a.column_side, a.is_nullable, a.is_primary_key, a.inferred_role
FROM core.dataset_columns_archive a
WHERE a.operation_id = :operation_id
ON CONFLICT (column_id) DO NOTHING;

-- rule bindings
INSERT INTO core.rule_dataset_mapping
    (id, rule_id, mapping_id, is_active)
SELECT a.original_id, a.rule_id, a.original_mapping_id, a.is_active
FROM core.rule_dataset_mapping_archive a
WHERE a.operation_id = :operation_id
ON CONFLICT (id) DO NOTHING;

-- mark header recovered
UPDATE core.discovery_clear_operations
SET status = 'RESTORED', restored_at = NOW(), restored_by = :user_name
WHERE operation_id = :operation_id;
```

> Edge case: if the user re-ran auto-discovery after a clear, new live rows exist with the same
> natural key. `ON CONFLICT DO NOTHING` leaves those untouched; restore reports skipped count.

---

## 4. Clear History — list operations

```sql
SELECT operation_id, tenant_id, tenant_name, deleted_by_user_id, deleted_by_name,
       deleted_at, row_count, status, restored_at, restored_by
FROM core.discovery_clear_operations
WHERE (:tenant_id IS NULL OR tenant_id = :tenant_id)
ORDER BY deleted_at DESC;
```

---

## 5. Design Decisions

- `tenant_name` and `deleted_by_name` are **snapshotted** at clear time (not looked up live) so
  history stays accurate if a client is renamed or a user leaves.
- Hard delete is intentional: it removes the soft-delete row that blocked auto-discovery's
  `ON CONFLICT DO NOTHING`, fixing the unrecoverable defect. The archive is the safety net.
- `is_active` is restored as `true` (a restored mapping is active again).
- All SQL executes inside one transaction for clear-all; restore is idempotent via `ON CONFLICT`.
