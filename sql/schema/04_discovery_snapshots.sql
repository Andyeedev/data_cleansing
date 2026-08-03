CREATE TABLE IF NOT EXISTS core.discovery_snapshots (
    snapshot_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id         UUID NOT NULL REFERENCES core.projects(project_id),
    source_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    target_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    snapshot_type      VARCHAR(20) NOT NULL DEFAULT 'FULL',
    source_schema      JSONB NOT NULL,
    target_schema      JSONB NOT NULL,
    matched_tables     JSONB NOT NULL,
    matched_columns    JSONB NOT NULL,
    drift_summary      JSONB,
    snapshot_status    VARCHAR(20) NOT NULL DEFAULT 'COMPLETE',
    triggered_by       VARCHAR(30) NOT NULL,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by         VARCHAR(100)
);

CREATE INDEX idx_discovery_snapshots_project ON core.discovery_snapshots(project_id);
CREATE INDEX idx_discovery_snapshots_systems ON core.discovery_snapshots(source_system_id, target_system_id);
CREATE INDEX idx_discovery_snapshots_created ON core.discovery_snapshots(created_at DESC);