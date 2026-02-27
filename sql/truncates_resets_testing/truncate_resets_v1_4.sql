🧹 1️⃣ TRUNCATE (RESET) SCRIPT

Run this before each fresh test cycle.

⚠ Order matters because of FKs.

-- =========================================
-- ENGINE OUTPUT TABLES (safe to truncate)
-- =========================================

TRUNCATE TABLE engine.migration_control_exceptions RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_control_execution RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_control_summary RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_batch_summary RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_batch_intelligence RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_release_decision RESTART IDENTITY CASCADE;
TRUNCATE TABLE engine.migration_validation_batch RESTART IDENTITY CASCADE;

-- =========================================
-- OPTIONAL (ONLY if reconfiguring test data)
-- =========================================

-- TRUNCATE TABLE engine.rule_parameter_metadata CASCADE;
-- TRUNCATE TABLE engine.rule_registry CASCADE;
-- TRUNCATE TABLE engine.control_registry CASCADE;

-- TRUNCATE TABLE core.projects CASCADE;
-- TRUNCATE TABLE core.tenants CASCADE;

--You normally only truncate the output tables.

--🏗 2️⃣ MINIMAL CORE SETUP
--Step 1 — Insert Tenant

INSERT INTO core.tenants (tenant_name)
VALUES ('Test Tenant')
RETURNING tenant_id;

--Copy the returned UUID.

--Step 2 — Insert Project
INSERT INTO core.projects (tenant_id, project_name, project_type)
VALUES (
    'PASTE_TENANT_UUID',
    'Migration Project A',
    'MIGRATION'
)
RETURNING project_id;

--Copy the returned project_id.

--This is the value you put into:

--project_id: "YOUR_PROJECT_UUID"

--in config.yaml.

--🎛 3️⃣ Attach Controls to Project

--If your engine.control_registry does NOT yet have project_id, verify:

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'control_registry'
AND table_schema = 'engine';

--If missing, add:

ALTER TABLE engine.control_registry
ADD COLUMN project_id UUID REFERENCES core.projects(project_id);

--Insert Controls for This Project

INSERT INTO engine.control_registry (control_id, enabled_flag, project_id)
VALUES
('C01', TRUE, 'PASTE_PROJECT_UUID'),
('C02', TRUE, 'PASTE_PROJECT_UUID'),
('C03', TRUE, 'PASTE_PROJECT_UUID');
📜 4️⃣ Rules (Only if Empty)

--Check:

SELECT * FROM engine.rule_registry;

--If empty, insert:

INSERT INTO engine.rule_registry
(rule_id, control_id, rule_type, severity_level, enabled_flag)
VALUES
('R1', 'C01', 'ROW_COUNT', 'HIGH', TRUE),
('R2', 'C02', 'SUM_COMPARE', 'CRITICAL', TRUE),
('R3', 'C03', 'REFERENTIAL_CHECK', 'CRITICAL', TRUE);

--⚙ 5️⃣ Rule Parameter Metadata

--You already have legacy metadata.

--Ensure at least one active entry per rule:

SELECT rule_id, entity_name
FROM engine.rule_parameter_metadata
WHERE active = TRUE;

--If empty, we’ll insert test metadata next.

--▶ 6️⃣ Run Engine
python -m app.main run --config config.yaml


--🔎 Validation Checklist After Run
SELECT overall_status, overall_score
FROM engine.migration_validation_batch
ORDER BY execution_start DESC
LIMIT 1;

SELECT *
FROM engine.migration_control_summary
ORDER BY created_at DESC;

--🧠 Expected Behavior

--If:

Source = Target → PASS

Row mismatch → FAIL

Critical failure → BLOCKED

Score < threshold → REJECTED release

🏁 Result

--You now have:

--Project-scoped execution

SaaS ownership separation

Clean reset capability

Repeatable test loop