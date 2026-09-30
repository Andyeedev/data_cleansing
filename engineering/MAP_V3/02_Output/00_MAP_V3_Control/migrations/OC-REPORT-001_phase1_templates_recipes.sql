-- ============================================================================
-- OC-REPORT-001 — Phase 1 — template and assistant recipe seed
-- ============================================================================
--
-- Seeds the five curated V1 templates and their assistant recipes.
--
-- Both are STATIC, SYSTEM-OWNED, TENANT-LESS metadata: adding a template or a
-- recipe is a data change, not a code change and not a release. That is the
-- whole maintainability point, and it is why there is no template-admin UI in
-- V1.
--
-- Report Assistant is NOT an AI system. The recipes below are curated rows with
-- weighted keywords and constrained questions. There is no model, no inference,
-- no external call and no API cost. See app/services/report_assistant_service.py.
--
-- TEMPLATE SEMANTICS ENCODED HERE
--
--   * Each template holds a COMPLETE report definition. Instantiating copies
--     it; the template is never mutated and is never rendered live.
--   * required_entitlements is what the template is FILTERED BY server-side. A
--     tenant not entitled to a template is not shown it at all.
--   * Every template's data source must exist in the allowlist, and its
--     definition must validate. Both are asserted below, because a template
--     that cannot resolve is a template that cannot ship.
--
-- IDEMPOTENCY: safe to re-run.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Template table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.report_templates (
    template_key     TEXT NOT NULL,
    version          INT  NOT NULL,
    display_name     TEXT NOT NULL,
    description      TEXT,
    category         TEXT NOT NULL,
    definition       JSONB NOT NULL,
    required_data_sources  TEXT[] NOT NULL DEFAULT '{}',
    required_entitlements  TEXT[] NOT NULL DEFAULT '{}',
    thumbnail_spec   JSONB NOT NULL DEFAULT '{}',
    sort_order       INT NOT NULL DEFAULT 100,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    changelog        TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (template_key, version)
);

-- ---------------------------------------------------------------------------
-- 2. Recipe table (deterministic, vendor-neutral)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.report_assistant_recipes (
    recipe_key        TEXT PRIMARY KEY,
    display_name      TEXT NOT NULL,
    description       TEXT,
    keywords          TEXT[] NOT NULL DEFAULT '{}',
    -- each question: {id, prompt, type:'choice', options[], default,
    --                 filter_field, filter_op}
    questions         JSONB NOT NULL DEFAULT '[]',
    resulting_template_key TEXT,
    required_data_sources  TEXT[] NOT NULL DEFAULT '{}',
    required_entitlements  TEXT[] NOT NULL DEFAULT '{}',
    priority          INT NOT NULL DEFAULT 100,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. The five curated V1 templates
--    Cap is deliberate: each is a permanent curation liability. A template that
--    produces a wrong number is worse than no template, because it is the
--    DEFAULT route in V1.
-- ============================================================================

INSERT INTO platform.report_templates
 (template_key, version, display_name, description, category, definition,
  required_data_sources, required_entitlements, thumbnail_spec, sort_order, changelog)
VALUES

-- 1 -------------------------------------------------------------------------
('migration_health_weekly', 3, 'Migration Health — Weekly',
 'Validation, exceptions and trend for a weekly operations review',
 'operational',
 '{
  "schema_version": 1,
  "data_source_key": "migration.control_summary",
  "sections": [
    {"id":"kpis","type":"kpi","title":"Key metrics",
     "bindings":{"measure":"total_rules","aggregation":"sum"},
     "config":{"layout":"row"}},
    {"id":"pass_rate","type":"kpi","title":"Pass rate",
     "bindings":{"measure":"passed_rules","aggregation":"sum"}},
    {"id":"failed","type":"kpi","title":"Failed rules",
     "bindings":{"measure":"failed_rules","aggregation":"sum"}},
    {"id":"by_control","type":"bar","title":"Failed rules by control",
     "bindings":{"measure":"failed_rules","aggregation":"sum",
                 "dimensions":["control_id"]},
     "sort":{"field":"control_id","dir":"desc"}},
    {"id":"register","type":"table","title":"Control outcomes",
     "bindings":{"dimensions":["control_id","overall_status"],
                 "measure":"failed_rules"},
     "sort":{"field":"failed_rules","dir":"desc"},
     "config":{"max_rows":200}}
  ],
  "filters": []
}'::jsonb,
 ARRAY['migration.control_summary'],
 ARRAY['report_studio'],
 '{"layout":"kpi_row_then_bar_then_table"}', 10,
 'v3: added control outcomes table and cap of 200 rows'),

-- 2 -------------------------------------------------------------------------
('control_failure_deep_dive', 2, 'Control Failure Deep Dive',
 'Rules, owners and root causes behind control failures',
 'operational',
 '{
  "schema_version": 1,
  "data_source_key": "migration.exceptions",
  "sections": [
    {"id":"count","type":"kpi","title":"Exceptions",
     "bindings":{"aggregation":"count"}},
    {"id":"by_scope","type":"bar","title":"Exceptions by scope",
     "bindings":{"aggregation":"count","dimensions":["failure_scope"]},
     "sort":{"field":"failure_scope","dir":"asc"}},
    {"id":"by_control","type":"bar","title":"Exceptions by control",
     "bindings":{"aggregation":"count","dimensions":["control_id"]},
     "sort":{"field":"failure_scope","dir":"asc"}},
    {"id":"detail","type":"table","title":"Exception detail",
     "bindings":{"dimensions":["entity_name","control_id","rule_id","cause"],
                 "measure":"delta_value"},
     "config":{"max_rows":200}}
  ],
  "filters": []
}'::jsonb,
 ARRAY['migration.exceptions'],
 ARRAY['report_studio'],
 '{"layout":"kpi_then_two_bars_then_table"}', 20,
 'v2: renamed the detail section and pinned max_rows'),

-- 3 -------------------------------------------------------------------------
('reconciliation', 2, 'Reconciliation',
 'Source-to-target differences by dataset and rule',
 'operational',
 '{
  "schema_version": 1,
  "data_source_key": "migration.exceptions",
  "sections": [
    {"id":"total_delta","type":"kpi","title":"Total absolute delta",
     "bindings":{"measure":"delta_value","aggregation":"sum"}},
    {"id":"by_rule","type":"bar","title":"Delta by rule",
     "bindings":{"measure":"delta_value","aggregation":"sum",
                 "dimensions":["rule_id"]},
     "sort":{"field":"rule_id","dir":"desc"}},
    {"id":"detail","type":"table","title":"Differences",
     "bindings":{"dimensions":["entity_name","control_id","rule_id",
                               "source_value","target_value","cause"],
                 "measure":"delta_value"},
     "sort":{"field":"delta_value","dir":"desc"},
     "config":{"max_rows":200}}
  ],
  "filters": []
}'::jsonb,
 ARRAY['migration.exceptions'],
 ARRAY['report_studio'],
 '{"layout":"kpi_then_bar_then_table"}', 30,
 'v2: switched the bar measure to sum(delta_value)'),

-- 4 -------------------------------------------------------------------------
('executive_status', 4, 'Executive Status',
 'Board-level summary, risk and governance posture',
 'executive',
 '{
  "schema_version": 1,
  "data_source_key": "migration.risk_index",
  "sections": [
    {"id":"risk","type":"kpi","title":"Average risk index",
     "bindings":{"measure":"risk_index","aggregation":"avg"}},
    {"id":"pass","type":"kpi","title":"Average pass rate",
     "bindings":{"measure":"pass_rate_percent","aggregation":"avg"}},
    {"id":"batches","type":"kpi","title":"Batches",
     "bindings":{"aggregation":"count"}},
    {"id":"by_level","type":"bar","title":"Batches by risk level",
     "bindings":{"aggregation":"count","dimensions":["risk_level"]},
     "sort":{"field":"risk_level","dir":"asc"}},
    {"id":"detail","type":"table","title":"Batch risk",
     "bindings":{"dimensions":["batch_id","risk_level"],
                 "measure":"risk_index"},
     "sort":{"field":"risk_index","dir":"desc"},
     "config":{"max_rows":200}}
  ],
  "filters": []
}'::jsonb,
 ARRAY['migration.risk_index'],
 ARRAY['report_studio','advanced_reporting'],
 '{"layout":"kpi_then_bar_then_table"}', 40,
 'v4: switched to the risk index view for a truer risk figure'),

-- 5 -------------------------------------------------------------------------
('governance_posture', 2, 'Governance Posture',
 'Controls, blocking gates and open governance decisions',
 'governance',
 '{
  "schema_version": 1,
  "data_source_key": "migration.governance_status",
  "sections": [
    {"id":"blocking","type":"kpi","title":"Blocking controls",
     "bindings":{"measure":"blocking_controls","aggregation":"sum"}},
    {"id":"failed","type":"kpi","title":"Failed rules",
     "bindings":{"measure":"total_failed_rules","aggregation":"sum"}},
    {"id":"by_status","type":"bar","title":"Batches by decision",
     "bindings":{"aggregation":"count","dimensions":["migration_status"]},
     "sort":{"field":"migration_status","dir":"asc"}},
    {"id":"detail","type":"table","title":"Decisions",
     "bindings":{"dimensions":["batch_id","migration_status"],
                 "measure":"blocking_controls"},
     "sort":{"field":"blocking_controls","dir":"desc"},
     "config":{"max_rows":200}}
  ],
  "filters": []
}'::jsonb,
 ARRAY['migration.governance_status'],
 ARRAY['report_studio','governance'],
 '{"layout":"kpi_then_bar_then_table"}', 50,
 'v2: added the decision detail table')

ON CONFLICT (template_key, version) DO UPDATE SET
    display_name    = EXCLUDED.display_name,
    description     = EXCLUDED.description,
    category        = EXCLUDED.category,
    definition      = EXCLUDED.definition,
    required_data_sources  = EXCLUDED.required_data_sources,
    required_entitlements  = EXCLUDED.required_entitlements,
    thumbnail_spec  = EXCLUDED.thumbnail_spec,
    sort_order      = EXCLUDED.sort_order,
    changelog       = EXCLUDED.changelog,
    updated_at      = now();

-- ============================================================================
-- 4. Assistant recipes.
--    Questions carry filter_field/filter_op so an answer REFINES a filter the
--    recipe declared. An answer can never introduce a new field, operator or
--    data source — that is the boundary that keeps this out of arbitrary-SQL
--    territory.
-- ============================================================================

-- NOTE on the 'group_by' question below: it deliberately has NO filter_field.
-- "Group by" is a component BINDING, not a filter, and declaring a filter_field
-- would make the answer inject a nonexistent field into the definition and fail
-- validation. Only questions that refine a real saved filter carry one.
--
-- IMPORTANT: never place SQL comments inside a '...'::jsonb literal. They become
-- part of the JSON text and the seed fails to parse.
INSERT INTO platform.report_assistant_recipes
 (recipe_key, display_name, description, keywords, questions,
  resulting_template_key, required_data_sources, required_entitlements, priority)
VALUES

('migration_health_weekly', 'Migration health',
 'Failed controls, validation health and weekly trend',
 ARRAY['failed','failing','controls','control','weekly','health','validation','migration','trend'],
 '[
   {"id":"severity","prompt":"Which severities?","type":"choice",
    "options":["CRITICAL","CRITICAL,HIGH","ALL"],"default":"CRITICAL,HIGH",
    "filter_field":"overall_status","filter_op":"eq"},
   {"id":"group_by","prompt":"Group by?","type":"choice",
    "options":["control_id","overall_status"],"default":"control_id"}
 ]'::jsonb,
 'migration_health_weekly',
 ARRAY['migration.control_summary'],
 ARRAY['report_studio'], 10),

('control_failure_deep_dive', 'Control failure detail',
 'Rule-level detail behind control failures and their causes',
 ARRAY['failure','cause','root','rule','rules','entity','detail','deep','dive','owner'],
 '[
   {"id":"scope","prompt":"Failure scope?","type":"choice",
    "options":["entity","batch","rule"],"default":"entity",
    "filter_field":"failure_scope","filter_op":"eq"}
 ]'::jsonb,
 'control_failure_deep_dive',
 ARRAY['migration.exceptions'],
 ARRAY['report_studio'], 20),

('reconciliation', 'Reconciliation',
 'Differences between source and target',
 ARRAY['reconciliation','reconcile','difference','differences','deltas','delta',
       'source','target','compare','comparison','mismatch','mismatches'],
 '[
   {"id":"rule","prompt":"Focus on which rule?","type":"choice",
    "options":["C01","C02","C04","ALL"],"default":"ALL",
    "filter_field":"rule_id","filter_op":"eq"}
 ]'::jsonb,
 'reconciliation',
 ARRAY['migration.exceptions'],
 ARRAY['report_studio'], 30),

('executive_status', 'Executive status',
 'Board-level risk and migration status',
 ARRAY['executive','board','summary','status','risk','management','leadership','exec'],
 '[
   {"id":"level","prompt":"Risk level?","type":"choice",
    "options":["LOW","MEDIUM","HIGH","ALL"],"default":"ALL",
    "filter_field":"risk_level","filter_op":"eq"}
 ]'::jsonb,
 'executive_status',
 ARRAY['migration.risk_index'],
 ARRAY['report_studio','advanced_reporting'], 40),

('governance_posture', 'Governance posture',
 'Controls, blocking gates and open decisions',
 ARRAY['governance','posture','control','controls','approval','approvals',
       'blocking','gate','audit'],
 '[
   {"id":"decision","prompt":"Decision?","type":"choice",
    "options":["GO","NO-GO","ALL"],"default":"ALL",
    "filter_field":"migration_status","filter_op":"eq"}
 ]'::jsonb,
 'governance_posture',
 ARRAY['migration.governance_status'],
 ARRAY['report_studio','governance'], 50)

ON CONFLICT (recipe_key) DO UPDATE SET
    display_name  = EXCLUDED.display_name,
    description   = EXCLUDED.description,
    keywords      = EXCLUDED.keywords,
    questions     = EXCLUDED.questions,
    resulting_template_key = EXCLUDED.resulting_template_key,
    required_data_sources  = EXCLUDED.required_data_sources,
    required_entitlements  = EXCLUDED.required_entitlements,
    priority      = EXCLUDED.priority,
    updated_at    = now();

-- ============================================================================
-- 5. Post-conditions.
--    A template that cannot resolve, or a recipe pointing at a template that
--    does not exist, is a release blocker rather than a runtime surprise.
-- ============================================================================
DO $$
DECLARE
    -- Loop variables are deliberately named *_rec: a PL/pgSQL record variable
    -- shares a namespace with table aliases in the query below, so a short name
    -- like `t` or `r` becomes ambiguous the moment the alias matches.
    tpl_rec RECORD;
    rec_row RECORD;
    bad TEXT;
BEGIN
    -- exactly five curated templates
    IF (SELECT count(DISTINCT template_key) FROM platform.report_templates
        WHERE is_active IS TRUE) <> 5 THEN
        RAISE EXCEPTION 'V1 must seed exactly 5 curated templates';
    END IF;

    -- every template data source must exist in the allowlist
    FOR tpl_rec IN SELECT template_key, required_data_sources
                    FROM platform.report_templates WHERE is_active IS TRUE
    LOOP
        SELECT string_agg(k, ', ') INTO bad
        FROM unnest(tpl_rec.required_data_sources) AS k
        WHERE NOT EXISTS (SELECT 1 FROM platform.report_data_sources d
                          WHERE d.data_source_key = k AND d.is_active IS TRUE);
        IF bad IS NOT NULL THEN
            RAISE EXCEPTION 'template % references unregistered data sources: %',
                tpl_rec.template_key, bad;
        END IF;
    END LOOP;

    -- every template definition must name a registered source
    FOR tpl_rec IN SELECT template_key, definition
                    FROM platform.report_templates WHERE is_active IS TRUE
    LOOP
        IF NOT EXISTS (SELECT 1 FROM platform.report_data_sources d
                       WHERE d.data_source_key =
                             tpl_rec.definition->>'data_source_key'
                         AND d.is_active IS TRUE) THEN
            RAISE EXCEPTION 'template % definition names an unregistered source %',
                tpl_rec.template_key, tpl_rec.definition->>'data_source_key';
        END IF;
        IF (tpl_rec.definition->>'schema_version')::int <> 1 THEN
            RAISE EXCEPTION 'template % has an unsupported schema_version',
                tpl_rec.template_key;
        END IF;
    END LOOP;

    -- every recipe must resolve to a real template
    FOR rec_row IN SELECT recipe_key, resulting_template_key
                    FROM platform.report_assistant_recipes WHERE is_active IS TRUE
    LOOP
        IF rec_row.resulting_template_key IS NULL THEN
            RAISE EXCEPTION 'recipe % has no resulting template', rec_row.recipe_key;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM platform.report_templates t
                       WHERE t.template_key = rec_row.resulting_template_key
                         AND t.is_active IS TRUE) THEN
            RAISE EXCEPTION 'recipe % points at missing template %',
                rec_row.recipe_key, rec_row.resulting_template_key;
        END IF;
    END LOOP;

    -- recipes must never reference an unregistered source
    FOR rec_row IN SELECT recipe_key, required_data_sources
                    FROM platform.report_assistant_recipes WHERE is_active IS TRUE
    LOOP
        SELECT string_agg(k, ', ') INTO bad
        FROM unnest(rec_row.required_data_sources) AS k
        WHERE NOT EXISTS (SELECT 1 FROM platform.report_data_sources d
                          WHERE d.data_source_key = k AND d.is_active IS TRUE);
        IF bad IS NOT NULL THEN
            RAISE EXCEPTION 'recipe % references unregistered data sources: %',
                rec_row.recipe_key, bad;
        END IF;
    END LOOP;

    -- no assistant recipe may require an entitlement no plan grants
    IF EXISTS (
        SELECT 1 FROM platform.report_assistant_recipes rec, unnest(rec.required_entitlements) AS e
        WHERE rec.is_active IS TRUE
          AND NOT EXISTS (
            SELECT 1 FROM platform.plans p WHERE p.entitlements ? e
          )
    ) THEN
        RAISE EXCEPTION 'a recipe requires an entitlement no plan grants';
    END IF;

    RAISE NOTICE 'templates and assistant recipes seeded and validated';
END
$$;

COMMIT;
