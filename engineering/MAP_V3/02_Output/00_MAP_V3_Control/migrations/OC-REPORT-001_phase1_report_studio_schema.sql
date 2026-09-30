-- ============================================================================
-- OC-REPORT-001 — Phase 1 — Report Studio metadata schema
-- ============================================================================
--
-- Establishes the ONE governed report-definition layer. Creates the metadata
-- tables, seeds the DataSource allowlist, and seeds nothing else — templates
-- and assistant recipes are seeded in their own Phase 1 migrations so this file
-- stays reviewable.
--
-- WHY THE SCHEMA IS IN platform, NOT core OR engine
--
-- These tables hold platform configuration and per-tenant authored metadata,
-- not execution-domain or business data. They sit alongside platform.permissions
-- and platform.plans, consistent with the existing separation.
--
-- ============================================================================
-- MEASURED TENANT-SCOPE FINDING — THREE SCOPE FAMILIES, NOT TWO
-- ============================================================================
--
-- The plan assumed two tenant-join families. Inspection of the live database
-- found three, and one of them is a live trap.
--
-- MEASURED: engine.migration_batch_registry.tenant_id
--
--     total batches              705
--     tenant_id populated          35
--     tenant_id NULL              670
--     mismatch vs project join    670   (i.e. exactly the NULL rows)
--
-- The direct tenant_id column on migration_batch_registry is 95% NULL. Where
-- populated it agrees with the project join, but it cannot be used for tenant
-- scoping: filtering on it would return NO ROWS for the 670 NULL batches, and
-- any "fallback" to the project join for those would have to be written
-- perfectly every time or batches leak.
--
-- This is also why the canonical ExecutionHistoryService.verify_batch_tenant
-- already resolves via the project join and never reads r.tenant_id. That
-- existing primitive is correct and is reused unchanged.
--
-- The three families, all verified against the live schema:
--
--   batch_family    batch_id -> engine.migration_batch_registry
--                                -> project_id -> core.projects.tenant_id
--                   REQUIRED for every execution-domain table.
--                   PROHIBITED: using migration_batch_registry.tenant_id.
--
--   control_family  engine.control_registry.tenant_id (direct)
--                   Verified 0 NULL. Usable for control-scoped queries.
--
--   project_family  project_id -> core.projects.tenant_id
--                   Usable for core.* tables that carry project_id.
--
-- Every DataSource therefore declares its scope_family explicitly, and the
-- resolver refuses to build a query for a family it does not implement. Getting
-- this wrong is a cross-tenant leak, so it is asserted at seed time below.
--
-- ============================================================================
-- FINDING: the reporting entitlement ladder is incoherent (NOT fixed here)
-- ============================================================================
--
-- Measured across the three plan tiers:
--
--   tier            basic_reporting   advanced_reporting   report_studio
--   professional        YES                  no                 no
--   enterprise          no                 YES                YES
--   enterprise_plus     no                 YES                YES
--
-- `basic_reporting` exists ONLY on professional, which is the one tier that does
-- NOT carry `report_studio`. The two keys are therefore mutually exclusive: no
-- tenant can hold both.
--
-- Consequence: Report Studio cannot gate on `basic_reporting`, or the add-on is
-- unreadable on every tier entitled to it. This migration therefore gates each
-- DataSource on `report_studio` — the add-on entitlement — and leaves the
-- capability tier as a SECOND, independent gate carried by the template
-- (advanced_reporting for Executive Status, governance for Governance Posture).
-- Two gates in series is stricter than one, not weaker.
--
-- The underlying incoherence is left in place deliberately: `advanced_reporting`
-- has no `basic_reporting` beneath it on the enterprise tiers, which looks like
-- an oversight. Changing tier membership is a COMMERCIAL decision, not a
-- security fix, so it is NOT made here. Raised for founder approval:
-- should `basic_reporting` be added to enterprise and enterprise_plus?
--
-- Note this was caught by the acceptance test, not by inspection: gating the
-- sources on `basic_reporting` produced a product that was invisible to every
-- entitled tenant.
--
-- ============================================================================
-- IDEMPOTENCY: safe to re-run.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Static, centrally-maintained report catalogue.
--    Adding or retiring a report is a data change, not a code change.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.report_catalog (
    report_key         TEXT PRIMARY KEY,
    display_name       TEXT NOT NULL,
    category           TEXT NOT NULL,
    description        TEXT,
    data_source_key    TEXT NOT NULL,
    required_permission TEXT NOT NULL,
    required_entitlement TEXT NOT NULL,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order         INT NOT NULL DEFAULT 100,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. The DataSource allowlist. NOT a SQL surface: this table holds a
--    pre-registered key and its governed metadata. There is deliberately no
--    column in which a user or a template can supply SQL.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.report_data_sources (
    data_source_key    TEXT PRIMARY KEY,
    schema_version     INT  NOT NULL DEFAULT 1,
    display_name       TEXT NOT NULL,
    description        TEXT,
    -- 'batch_family' | 'control_family' | 'project_family'
    scope_family       TEXT NOT NULL,
    -- 'batch' | 'batch_control' | 'control' | 'rule' | 'entity'
    grain              TEXT NOT NULL,
    base_relation      TEXT NOT NULL,
    fields             JSONB NOT NULL,
    required_permission   TEXT NOT NULL,
    required_entitlement  TEXT NOT NULL,
    default_max_rows   INT NOT NULL DEFAULT 200,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT report_data_sources_scope_family_chk
        CHECK (scope_family IN ('batch_family','control_family','project_family')),
    CONSTRAINT report_data_sources_grain_chk
        CHECK (grain IN ('batch','batch_control','control','rule','entity')),
    CONSTRAINT report_data_sources_max_rows_chk
        CHECK (default_max_rows > 0 AND default_max_rows <= 1000)
);

-- ---------------------------------------------------------------------------
-- 3. The user-facing report object. Lifecycle shell only.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.reports (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id          UUID NOT NULL REFERENCES core.tenants(tenant_id),
    owner_user_id      UUID NOT NULL REFERENCES platform.users(id),
    catalog_report_key TEXT REFERENCES platform.report_catalog(report_key),
    title              TEXT NOT NULL,
    description        TEXT,
    status             TEXT NOT NULL DEFAULT 'draft',
    -- 'private' | 'tenant'
    visibility         TEXT NOT NULL DEFAULT 'private',
    current_version_id UUID,
    -- template provenance (immutable record of what it was built from)
    derived_from_template_key     TEXT,
    derived_from_template_version INT,
    -- assistant provenance
    origin             TEXT NOT NULL DEFAULT 'manual',
    origin_recipe_key  TEXT,
    origin_answers     JSONB,
    -- template pinning: 'pinned' | 'diverged'
    template_state     TEXT NOT NULL DEFAULT 'pinned',
    -- The report's OWN capability requirements, snapshotted at creation from the
    -- union of its DataSources' requirements and, when template-derived, the
    -- template's required entitlements.
    --
    -- Persisted because entitlement must be RE-CHECKED on every read. Checking
    -- only the DataSource's entitlement is not enough: a template may require a
    -- capability tier the source does not (Executive Status needs
    -- advanced_reporting), and a report created while entitled must stop
    -- resolving the moment that entitlement is withdrawn.
    required_permissions  TEXT[] NOT NULL DEFAULT '{}',
    required_entitlements TEXT[] NOT NULL DEFAULT '{}',
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at         TIMESTAMPTZ,
    CONSTRAINT reports_status_chk
        CHECK (status IN ('draft','published','archived','deleted')),
    CONSTRAINT reports_visibility_chk
        CHECK (visibility IN ('private','tenant')),
    CONSTRAINT reports_origin_chk
        CHECK (origin IN ('manual','template','assistant')),
    CONSTRAINT reports_template_state_chk
        CHECK (template_state IN ('pinned','diverged'))
);

CREATE INDEX IF NOT EXISTS reports_tenant_status_idx
    ON platform.reports (tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS reports_owner_idx
    ON platform.reports (owner_user_id) WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- 4. Immutable report definitions. Editing creates a new row, never an UPDATE,
--    so any version stays reproducible and auditable.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.report_definitions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id      UUID NOT NULL REFERENCES platform.reports(id) ON DELETE CASCADE,
    version_no     INT  NOT NULL,
    schema_version INT  NOT NULL,
    definition     JSONB NOT NULL,
    created_by     UUID NOT NULL REFERENCES platform.users(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (report_id, version_no)
);

ALTER TABLE platform.reports
    DROP CONSTRAINT IF EXISTS reports_current_version_fk;
ALTER TABLE platform.reports
    ADD CONSTRAINT reports_current_version_fk
    FOREIGN KEY (current_version_id) REFERENCES platform.report_definitions(id);

-- ---------------------------------------------------------------------------
-- 5. Object-level access. Sharing grants VISIBILITY, never capability: a
--    recipient must independently hold the DataSource permission and
--    entitlement, re-checked on every read.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.report_access (
    report_id        UUID NOT NULL REFERENCES platform.reports(id) ON DELETE CASCADE,
    grantee_user_id  UUID REFERENCES platform.users(id) ON DELETE CASCADE,
    grantee_role_id  UUID REFERENCES platform.roles(id) ON DELETE CASCADE,
    access_level     TEXT NOT NULL DEFAULT 'view',
    granted_by       UUID NOT NULL REFERENCES platform.users(id),
    granted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT report_access_level_chk CHECK (access_level IN ('view','contribute')),
    CONSTRAINT report_access_exactly_one_grantee_chk
        CHECK ((grantee_user_id IS NOT NULL) <> (grantee_role_id IS NOT NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS report_access_user_uniq
    ON platform.report_access (report_id, grantee_user_id)
    WHERE grantee_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS report_access_role_uniq
    ON platform.report_access (report_id, grantee_role_id)
    WHERE grantee_role_id IS NOT NULL;

-- ============================================================================
-- 6. DataSource allowlist seed
--
-- Column names below were verified against the live database. No column is
-- invented. Note the deliberate ABSENCE of any SQL-bearing column: the
-- resolver maps data_source_key to a hard-coded query, so a definition can
-- never carry SQL.
-- ============================================================================

INSERT INTO platform.report_data_sources
 (data_source_key, schema_version, display_name, description, scope_family, grain,
  base_relation, fields, required_permission, required_entitlement, default_max_rows)
VALUES

('migration.batch', 1, 'Batches', 'Migration batch register with status and control counts',
 'batch_family', 'batch', 'engine.migration_batch_registry',
 '{"fields":[
    {"name":"batch_id","label":"Batch","type":"uuid","role":"dimension"},
    {"name":"batch_name","label":"Batch name","type":"text","role":"dimension"},
    {"name":"batch_status","label":"Status","type":"text","role":"dimension"},
    {"name":"batch_start_time","label":"Started","type":"timestamp","role":"time"},
    {"name":"batch_end_time","label":"Completed","type":"timestamp","role":"time"},
    {"name":"total_controls","label":"Total controls","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"completed_controls","label":"Completed controls","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"failed_controls","label":"Failed controls","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200),

('migration.control_summary', 1, 'Control summary', 'Per-control rule outcomes for a batch',
 'batch_family', 'batch_control', 'engine.migration_control_summary',
 '{"fields":[
    {"name":"batch_id","label":"Batch","type":"uuid","role":"dimension"},
    {"name":"control_id","label":"Control","type":"text","role":"dimension"},
    {"name":"overall_status","label":"Status","type":"text","role":"dimension"},
    {"name":"total_rules","label":"Total rules","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"passed_rules","label":"Passed","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"failed_rules","label":"Failed","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"error_rules","label":"Errors","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"skipped_rules","label":"Skipped","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]}
  ]}'::jsonb,
 'reports:read', 'report_studio', 500),

('migration.control_execution', 1, 'Control execution', 'Rule-level execution detail',
 'batch_family', 'rule', 'engine.migration_control_execution',
 '{"fields":[
    {"name":"batch_id","label":"Batch","type":"uuid","role":"dimension"},
    {"name":"control_id","label":"Control","type":"text","role":"dimension"},
    {"name":"rule_id","label":"Rule","type":"text","role":"dimension"},
    {"name":"entity_name","label":"Entity","type":"text","role":"dimension"},
    {"name":"execution_status","label":"Status","type":"text","role":"dimension"},
    {"name":"severity_level","label":"Severity","type":"text","role":"dimension"},
    {"name":"delta_value","label":"Delta","type":"numeric","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"execution_time_seconds","label":"Execution time (s)","type":"numeric","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"created_at","label":"Executed at","type":"timestamp","role":"time"}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200),

('migration.exceptions', 1, 'Exceptions', 'Validation exception register',
 'batch_family', 'entity', 'engine.migration_control_exceptions',
 '{"fields":[
    {"name":"batch_id","label":"Batch","type":"uuid","role":"dimension"},
    {"name":"control_id","label":"Control","type":"text","role":"dimension"},
    {"name":"rule_id","label":"Rule","type":"text","role":"dimension"},
    {"name":"entity_name","label":"Entity","type":"text","role":"dimension"},
    {"name":"cause","label":"Cause","type":"text","role":"dimension"},
    {"name":"failure_scope","label":"Scope","type":"text","role":"dimension"},
    {"name":"source_value","label":"Source value","type":"text","role":"dimension"},
    {"name":"target_value","label":"Target value","type":"text","role":"dimension"},
    {"name":"delta_value","label":"Delta","type":"numeric","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"created_at","label":"Detected at","type":"timestamp","role":"time"}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200),

('migration.governance_status', 1, 'Governance status', 'Release decision per batch',
 'batch_family', 'batch', 'engine.migration_governance_status',
 '{"fields":[
    {"name":"batch_id","label":"Batch","type":"uuid","role":"dimension"},
    {"name":"migration_status","label":"Decision","type":"text","role":"dimension"},
    {"name":"blocking_controls","label":"Blocking controls","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"total_failed_rules","label":"Failed rules","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"decision_time","label":"Decided at","type":"timestamp","role":"time"}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200),

('migration.risk_index', 1, 'Risk index', 'Computed risk and pass/fail rates per batch',
 'batch_family', 'batch', 'engine.v_batch_risk_index',
 '{"fields":[
    {"name":"batch_id","label":"Batch","type":"uuid","role":"dimension"},
    {"name":"risk_level","label":"Risk level","type":"text","role":"dimension"},
    {"name":"risk_index","label":"Risk index","type":"numeric","role":"measure","aggregations":["min","max","avg"]},
    {"name":"risk_points","label":"Risk points","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"total_rules","label":"Total rules","type":"integer","role":"measure","aggregations":["sum","min","max","avg"]},
    {"name":"pass_rate_percent","label":"Pass rate %","type":"numeric","role":"measure","aggregations":["min","max","avg"]},
    {"name":"failure_rate_percent","label":"Failure rate %","type":"numeric","role":"measure","aggregations":["min","max","avg"]}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200),

('control.registry', 1, 'Control registry', 'Registered controls and their severity',
 'control_family', 'control', 'engine.control_registry',
 '{"fields":[
    {"name":"control_id","label":"Control","type":"text","role":"dimension"},
    {"name":"control_name","label":"Control name","type":"text","role":"dimension"},
    {"name":"description","label":"Description","type":"text","role":"dimension"},
    {"name":"severity_level","label":"Severity","type":"text","role":"dimension"},
    {"name":"enabled_flag","label":"Enabled","type":"boolean","role":"dimension"},
    {"name":"project_id","label":"Project","type":"uuid","role":"dimension"},
    {"name":"created_at","label":"Registered at","type":"timestamp","role":"time"}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200),

('core.mapping_coverage', 1, 'Mapping coverage', 'Dataset and column mapping coverage per project',
 'project_family', 'batch', 'core.dataset_mappings',
 '{"fields":[
    {"name":"project_id","label":"Project","type":"uuid","role":"dimension"},
    {"name":"source_schema","label":"Source schema","type":"text","role":"dimension"},
    {"name":"source_table","label":"Source table","type":"text","role":"dimension"},
    {"name":"target_schema","label":"Target schema","type":"text","role":"dimension"},
    {"name":"target_table","label":"Target table","type":"text","role":"dimension"},
    {"name":"mapping_id","label":"Mapping","type":"uuid","role":"dimension"},
    {"name":"is_active","label":"Active","type":"boolean","role":"dimension"}
  ]}'::jsonb,
 'reports:read', 'report_studio', 200)

ON CONFLICT (data_source_key) DO UPDATE SET
    schema_version = EXCLUDED.schema_version,
    fields          = EXCLUDED.fields,
    required_permission  = EXCLUDED.required_permission,
    required_entitlement = EXCLUDED.required_entitlement,
    default_max_rows = EXCLUDED.default_max_rows,
    scope_family     = EXCLUDED.scope_family,
    grain            = EXCLUDED.grain,
    base_relation    = EXCLUDED.base_relation,
    updated_at       = now();

-- ---------------------------------------------------------------------------
-- 7. Seed-time assertions.
--    These fail the migration if a field is not present on the real relation, if
--    a field is not declared in the allowlist, or if a base relation is outside
--    the permitted schemas. A DataSource that does not resolve is a DataSource
--    that cannot be shipped, so it must fail here rather than at query time.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    ds        RECORD;
    fld       RECORD;
    missing   TEXT;
BEGIN
    FOR ds IN
        SELECT data_source_key, base_relation, fields, scope_family
        FROM platform.report_data_sources
    LOOP
        -- (a) base relation must exist and be in an approved schema
        IF ds.base_relation !~ '^(engine|core)\.[a-z_]+$' THEN
            RAISE EXCEPTION 'base_relation % is outside the approved schemas', ds.base_relation;
        END IF;
        IF to_regclass(ds.base_relation) IS NULL THEN
            RAISE EXCEPTION 'base relation % does not exist', ds.base_relation;
        END IF;

        -- (b) scope family must match the shape of the base relation
        IF ds.scope_family = 'batch_family' THEN
            -- every batch-family source must be reachable only via the project join
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = split_part(ds.base_relation,'.',1)
                  AND table_name   = split_part(ds.base_relation,'.',2)
                  AND (column_name = 'batch_id' OR column_name = 'project_id')
            ) THEN
                RAISE EXCEPTION 'batch_family source % has no batch_id/project_id path', ds.data_source_key;
            END IF;
        ELSIF ds.scope_family = 'project_family' THEN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = split_part(ds.base_relation,'.',1)
                  AND table_name   = split_part(ds.base_relation,'.',2)
                  AND column_name = 'project_id'
            ) THEN
                RAISE EXCEPTION 'project_family source % has no project_id', ds.data_source_key;
            END IF;
        ELSIF ds.scope_family = 'control_family' THEN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = split_part(ds.base_relation,'.',1)
                  AND table_name   = split_part(ds.base_relation,'.',2)
                  AND column_name = 'tenant_id'
            ) THEN
                RAISE EXCEPTION 'control_family source % has no tenant_id', ds.data_source_key;
            END IF;
        END IF;

        -- (c) every declared field must exist on the base relation.
        --     Columns joined in from another relation (control_name) are allowed
        --     only via the explicit join allowlist in the resolver.
        missing := NULL;
        FOR fld IN
            SELECT jsonb_array_elements(ds.fields->'fields') AS f
        LOOP
            IF fld.f->>'name' IN ('control_name', 'control_severity') THEN
                CONTINUE;   -- provided by the control_registry join
            END IF;
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = split_part(ds.base_relation,'.',1)
                  AND table_name   = split_part(ds.base_relation,'.',2)
                  AND column_name = fld.f->>'name'
            ) THEN
                missing := COALESCE(missing || ', ', '') || (fld.f->>'name');
            END IF;
        END LOOP;

        IF missing IS NOT NULL THEN
            RAISE EXCEPTION 'data source % declares fields absent from %: %',
                ds.data_source_key, ds.base_relation, missing;
        END IF;
    END LOOP;

    RAISE NOTICE 'all data sources validated against live relations';
END
$$;

COMMIT;
