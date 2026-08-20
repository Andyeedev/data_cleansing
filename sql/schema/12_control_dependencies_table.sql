-- ============================================================
-- Migration: Control Dependencies Table
-- Purpose: Move control dependencies from config.yaml to DB
-- ============================================================

CREATE TABLE IF NOT EXISTS engine.control_dependencies (
    control_id VARCHAR(50) NOT NULL,
    depends_on_control_id VARCHAR(50) NOT NULL,
    project_id UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (control_id, depends_on_control_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_control_deps_control_id
ON engine.control_dependencies(control_id);

CREATE INDEX IF NOT EXISTS idx_control_deps_project
ON engine.control_dependencies(project_id);

COMMENT ON TABLE engine.control_dependencies
IS 'Control dependency graph: control_id depends on depends_on_control_id. When project_id is NULL, applies to all projects.';
