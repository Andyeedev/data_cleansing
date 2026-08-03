CREATE TABLE IF NOT EXISTS core.dataset_mappings (
    mapping_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id         UUID NOT NULL REFERENCES core.projects(project_id),
    source_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    target_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    source_table       VARCHAR(255) NOT NULL,
    target_table       VARCHAR(255) NOT NULL,
    source_schema      VARCHAR(255),
    target_schema      VARCHAR(255),
    confidence         FLOAT NOT NULL DEFAULT 1.0,
    match_type         VARCHAR(20) NOT NULL DEFAULT 'exact',
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dataset_mappings_project ON core.dataset_mappings(project_id);
CREATE INDEX idx_dataset_mappings_source ON core.dataset_mappings(source_system_id);
CREATE INDEX idx_dataset_mappings_target ON core.dataset_mappings(target_system_id);

CREATE TABLE IF NOT EXISTS core.column_mappings (
    column_mapping_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mapping_id         UUID NOT NULL REFERENCES core.dataset_mappings(mapping_id),
    source_column      VARCHAR(255) NOT NULL,
    target_column      VARCHAR(255) NOT NULL,
    source_data_type   VARCHAR(100),
    target_data_type   VARCHAR(100),
    confidence         FLOAT NOT NULL DEFAULT 1.0,
    match_type         VARCHAR(20) NOT NULL DEFAULT 'exact',
    transformation     TEXT,
    ordinal_position   INT NOT NULL DEFAULT 0,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_column_mappings_mapping ON core.column_mappings(mapping_id);