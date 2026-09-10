-- OC-COM-001d: Phase 1 P0 — Project-ownership convergence (DEV-001) + dataset integrity (DEV-002A)
-- Date: 2026-09-08
-- Conventions: raw SQL, guarded, idempotent. No Alembic/ORM.
-- Depends: core.tenants, core.projects, core.system_registry, core.discovered_datasets
-- Live-DB evidence (dev 2026-09-08): 7 systems, 0 NULL project_id, 0 orphans, 0 tenant divergence;
--   8 discovered_datasets, 0 NULL project, 0 orphans. Backfill below is a no-op there by design.

-- =========================
-- DEV-001.1: backfill homeless systems to a valid project (deterministic)
-- =========================
-- Systems with NULL or orphan project_id get the tenant's oldest project;
-- tenants with no project at all get one 'Default Project'. Fails loudly if anything remains homeless.
DO $$
BEGIN
    -- Default project only for tenants that have homeless systems and no projects at all
    INSERT INTO core.projects (project_id, tenant_id, project_name, project_type, status)
    SELECT gen_random_uuid(), t.tenant_id, 'Default Project', 'MIGRATION', 'ACTIVE'
    FROM core.tenants t
    WHERE EXISTS (
        SELECT 1 FROM core.system_registry sr
        WHERE (sr.project_id IS NULL
               OR NOT EXISTS (SELECT 1 FROM core.projects p WHERE p.project_id = sr.project_id))
          AND sr.tenant_id = t.tenant_id
    )
    AND NOT EXISTS (SELECT 1 FROM core.projects p WHERE p.tenant_id = t.tenant_id)
    ON CONFLICT DO NOTHING;

    -- Assign homeless systems (tenant known) to oldest project of same tenant
    UPDATE core.system_registry sr
    SET project_id = (
        SELECT p.project_id FROM core.projects p
        WHERE p.tenant_id = sr.tenant_id
        ORDER BY p.created_at ASC
        LIMIT 1
    )
    WHERE (sr.project_id IS NULL
           OR NOT EXISTS (SELECT 1 FROM core.projects p WHERE p.project_id = sr.project_id))
      AND sr.tenant_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM core.projects p WHERE p.tenant_id = sr.tenant_id);

    -- Loud failure if any system is still homeless (no tenant to derive from)
    IF EXISTS (
        SELECT 1 FROM core.system_registry sr
        WHERE sr.project_id IS NULL
           OR NOT EXISTS (SELECT 1 FROM core.projects p WHERE p.project_id = sr.project_id)
    ) THEN
        RAISE EXCEPTION 'OC-COM-001d DEV-001: homeless systems remain (NULL/orphan project_id with no tenant project). Resolve manually before enforcing NOT NULL.';
    END IF;
END $$;

-- =========================
-- DEV-001.2: enforce project authority (guarded)
-- =========================
ALTER TABLE core.system_registry ALTER COLUMN project_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_system_registry_project') THEN
        ALTER TABLE core.system_registry
            ADD CONSTRAINT fk_system_registry_project
            FOREIGN KEY (project_id) REFERENCES core.projects(project_id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_system_registry_project_name') THEN
        ALTER TABLE core.system_registry
            ADD CONSTRAINT uq_system_registry_project_name UNIQUE (project_id, system_name);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_system_registry_project_id ON core.system_registry(project_id);

-- NOTE (DEV-001): legacy core.system_registry.tenant_id is RETAINED transiently for rollback only.
-- It MUST NOT be used as an ownership authority by any query. Removal is a follow-up once verified.

-- =========================
-- DEV-002A: discovered_datasets project integrity (guarded)
-- =========================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM core.discovered_datasets WHERE project_id IS NULL
    ) THEN
        RAISE EXCEPTION 'OC-COM-001d DEV-002A: discovered_datasets with NULL project_id exist. Resolve manually before enforcing NOT NULL.';
    END IF;
END $$;

ALTER TABLE core.discovered_datasets ALTER COLUMN project_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_discovered_datasets_project') THEN
        ALTER TABLE core.discovered_datasets
            ADD CONSTRAINT fk_discovered_datasets_project
            FOREIGN KEY (project_id) REFERENCES core.projects(project_id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_discovered_datasets_project_id ON core.discovered_datasets(project_id);

-- =========================
-- VERIFICATION (run after apply; all counts must be 0 except seeded plans)
-- =========================
-- SELECT count(*) FROM core.system_registry WHERE project_id IS NULL;                                        -- expect 0
-- SELECT count(*) FROM core.system_registry sr LEFT JOIN core.projects p ON sr.project_id=p.project_id WHERE p.project_id IS NULL; -- expect 0
-- SELECT count(*) FROM core.discovered_datasets WHERE project_id IS NULL;                                   -- expect 0
-- SELECT conname FROM pg_constraint WHERE conname IN ('fk_system_registry_project','uq_system_registry_project_name','fk_discovered_datasets_project'); -- expect 3 rows
