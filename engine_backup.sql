--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: core; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA core;


ALTER SCHEMA core OWNER TO postgres;

--
-- Name: engine; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA engine;


ALTER SCHEMA engine OWNER TO postgres;

--
-- Name: engine_v14; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA engine_v14;


ALTER SCHEMA engine_v14 OWNER TO postgres;

--
-- Name: reporting; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA reporting;


ALTER SCHEMA reporting OWNER TO postgres;

--
-- Name: run_governance_intelligence(uuid); Type: FUNCTION; Schema: engine; Owner: postgres
--

CREATE FUNCTION engine.run_governance_intelligence(p_batch_id uuid) RETURNS TABLE(out_batch_id uuid, anomaly_score numeric, anomaly_flag boolean, auto_blocked boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_window integer;
    v_threshold numeric;
    v_repeat_threshold integer;
    v_vol_multiplier numeric;

    v_avg_score numeric;
    v_std_score numeric;
    v_current_score numeric;
    v_zscore numeric := 0;

    v_risk numeric := 0;
    v_repeat numeric := 0;
    v_stability numeric := 0;
    v_exec_z numeric := 0;
    v_anomaly numeric := 0;

    v_flag boolean := false;
    v_block boolean := false;
BEGIN

    ------------------------------------------------------------
    -- 1. Load Configuration (latest active row)
    ------------------------------------------------------------

    SELECT 
        gc.rolling_window_size,
        gc.anomaly_block_threshold,
        gc.repeat_failure_threshold,
        gc.volatility_multiplier
    INTO 
        v_window,
        v_threshold,
        v_repeat_threshold,
        v_vol_multiplier
    FROM engine.governance_config gc
    ORDER BY gc.created_at DESC
    LIMIT 1;

    ------------------------------------------------------------
    -- 2. Current Batch Score
    ------------------------------------------------------------

    SELECT mvb.overall_score
    INTO v_current_score
    FROM engine.migration_validation_batch mvb
    WHERE mvb.batch_id = p_batch_id;

    ------------------------------------------------------------
    -- 3. Rolling Statistics
    ------------------------------------------------------------

    SELECT avg(t.overall_score), stddev(t.overall_score)
    INTO v_avg_score, v_std_score
    FROM (
        SELECT mvb2.overall_score
        FROM engine.migration_validation_batch mvb2
        WHERE mvb2.overall_score IS NOT NULL
        ORDER BY mvb2.execution_start DESC
        LIMIT v_window
    ) t;

    IF v_std_score IS NOT NULL AND v_std_score > 0 THEN
        v_zscore := (v_current_score - v_avg_score) / v_std_score;
    END IF;

    v_stability := GREATEST(0, 100 - abs(v_zscore * 20));

    ------------------------------------------------------------
    -- 4. Risk Heat (severity-weighted failures)
    ------------------------------------------------------------

    SELECT COALESCE(SUM(
        CASE mce.severity_level
            WHEN 'CRITICAL' THEN 5
            WHEN 'HIGH' THEN 3
            WHEN 'MEDIUM' THEN 2
            WHEN 'LOW' THEN 1
            ELSE 1
        END
    ),0)
    INTO v_risk
    FROM engine.migration_control_execution mce
    WHERE mce.batch_id = p_batch_id
      AND mce.execution_status <> 'PASS';

    ------------------------------------------------------------
    -- 5. Repeat Failure Index
    ------------------------------------------------------------

    SELECT COUNT(*)
    INTO v_repeat
    FROM engine.migration_control_execution c
    WHERE c.batch_id = p_batch_id
      AND c.execution_status = 'FAIL'
      AND EXISTS (
          SELECT 1
          FROM engine.migration_control_execution p
          WHERE p.control_id = c.control_id
            AND p.execution_status = 'FAIL'
            AND p.created_at < c.created_at
      );

    ------------------------------------------------------------
    -- 6. Execution Duration Z-Score
    ------------------------------------------------------------

    WITH hist AS (
        SELECT avg(m.execution_time_seconds) avg_time,
               stddev(m.execution_time_seconds) std_time
        FROM engine.migration_control_execution m
        WHERE m.execution_time_seconds IS NOT NULL
    ),
    curr AS (
        SELECT avg(m2.execution_time_seconds) curr_time
        FROM engine.migration_control_execution m2
        WHERE m2.batch_id = p_batch_id
    )
    SELECT 
        CASE 
            WHEN hist.std_time > 0
            THEN (curr.curr_time - hist.avg_time) / hist.std_time
            ELSE 0
        END
    INTO v_exec_z
    FROM hist, curr;

    ------------------------------------------------------------
    -- 7. Combined Anomaly Score
    ------------------------------------------------------------

    v_anomaly :=
          (abs(v_zscore) * 25)
        + (v_risk * 2)
        + (v_repeat * 5)
        + (abs(v_exec_z) * 10);

    IF v_repeat >= v_repeat_threshold THEN
        v_anomaly := v_anomaly + 15;
    END IF;

    IF v_anomaly > v_threshold THEN
        v_flag := true;
        v_block := true;
    END IF;

    ------------------------------------------------------------
    -- 8. Persist Intelligence
    ------------------------------------------------------------

    INSERT INTO engine.migration_batch_intelligence (
        batch_id,
        rolling_window_size,
        avg_score_last_n,
        stability_score,
        risk_heat_index,
        repeat_failure_index,
        execution_time_zscore,
        anomaly_score,
        anomaly_flag,
        auto_blocked,
        created_at
    )
    VALUES (
        p_batch_id,
        v_window,
        v_avg_score,
        v_stability,
        v_risk,
        v_repeat,
        v_exec_z,
        v_anomaly,
        v_flag,
        v_block,
        now()
    )
    ON CONFLICT (batch_id) DO UPDATE
    SET rolling_window_size = EXCLUDED.rolling_window_size,
        avg_score_last_n = EXCLUDED.avg_score_last_n,
        stability_score = EXCLUDED.stability_score,
        risk_heat_index = EXCLUDED.risk_heat_index,
        repeat_failure_index = EXCLUDED.repeat_failure_index,
        execution_time_zscore = EXCLUDED.execution_time_zscore,
        anomaly_score = EXCLUDED.anomaly_score,
        anomaly_flag = EXCLUDED.anomaly_flag,
        auto_blocked = EXCLUDED.auto_blocked,
        created_at = now();

    ------------------------------------------------------------
    -- 9. Return Output
    ------------------------------------------------------------

    RETURN QUERY
    SELECT 
        p_batch_id,
        v_anomaly,
        v_flag,
        v_block;

END;
$$;


ALTER FUNCTION engine.run_governance_intelligence(p_batch_id uuid) OWNER TO postgres;

--
-- Name: run_governance_intelligence_OLD(uuid); Type: FUNCTION; Schema: engine; Owner: postgres
--

CREATE FUNCTION engine."run_governance_intelligence_OLD"(p_batch_id uuid) RETURNS TABLE(batch_id uuid, anomaly_score numeric, anomaly_flag boolean, auto_blocked boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_window integer;
    v_threshold numeric;
    v_avg_score numeric;
    v_std_score numeric;
    v_current_score numeric;
    v_zscore numeric := 0;
    v_risk numeric := 0;
    v_repeat numeric := 0;
    v_stability numeric := 0;
    v_exec_z numeric := 0;
    v_anomaly numeric := 0;
    v_flag boolean := false;
    v_block boolean := false;
BEGIN

    -- Load Config
    SELECT config_value::int INTO v_window
    FROM engine.governance_config
    WHERE config_key = 'rolling_window';

    SELECT config_value::numeric INTO v_threshold
    FROM engine.governance_config
    WHERE config_key = 'anomaly_threshold';

    -- Current Score
    SELECT overall_score
    INTO v_current_score
    FROM engine.migration_validation_batch
    WHERE batch_id = p_batch_id;

    -- Rolling Stats
    SELECT avg(overall_score), stddev(overall_score)
    INTO v_avg_score, v_std_score
    FROM (
        SELECT overall_score
        FROM engine.migration_validation_batch
        ORDER BY execution_start DESC
        LIMIT v_window
    ) t;

    IF v_std_score IS NOT NULL AND v_std_score > 0 THEN
        v_zscore := (v_current_score - v_avg_score) / v_std_score;
    END IF;

    v_stability := 100 - abs(v_zscore * 20);

    -- Risk Heat (severity weighted failures)
    SELECT COALESCE(SUM(
        CASE severity_level
            WHEN 'CRITICAL' THEN 5
            WHEN 'HIGH' THEN 3
            WHEN 'MEDIUM' THEN 2
            WHEN 'LOW' THEN 1
            ELSE 1
        END
    ),0)
    INTO v_risk
    FROM engine.migration_control_execution
    WHERE batch_id = p_batch_id
    AND execution_status <> 'PASS';

    -- Repeat Failure Index
    SELECT COUNT(*)
    INTO v_repeat
    FROM engine.migration_control_execution c
    WHERE c.batch_id = p_batch_id
    AND c.execution_status = 'FAIL'
    AND EXISTS (
        SELECT 1
        FROM engine.migration_control_execution p
        WHERE p.control_id = c.control_id
        AND p.execution_status = 'FAIL'
        AND p.created_at < c.created_at
    );

    -- Execution Duration Anomaly (zscore)
    WITH hist AS (
        SELECT avg(execution_time_seconds) avg_time,
               stddev(execution_time_seconds) std_time
        FROM engine.migration_control_execution
    ),
    curr AS (
        SELECT avg(execution_time_seconds) curr_time
        FROM engine.migration_control_execution
        WHERE batch_id = p_batch_id
    )
    SELECT 
        CASE WHEN hist.std_time > 0
             THEN (curr.curr_time - hist.avg_time) / hist.std_time
             ELSE 0 END
    INTO v_exec_z
    FROM hist, curr;

    -- Combine Anomaly Score
    v_anomaly :=
        (abs(v_zscore) * 25) +
        (v_risk * 2) +
        (v_repeat * 5) +
        (abs(v_exec_z) * 10);

    IF v_anomaly > v_threshold THEN
        v_flag := true;
        v_block := true;
    END IF;

    -- Persist
    INSERT INTO engine.migration_batch_intelligence
    VALUES (
        p_batch_id,
        v_window,
        v_avg_score,
        v_stability,
        v_risk,
        v_repeat,
        v_exec_z,
        v_anomaly,
        v_flag,
        v_block,
        now()
    )
    ON CONFLICT (batch_id) DO UPDATE
    SET anomaly_score = EXCLUDED.anomaly_score,
        anomaly_flag = EXCLUDED.anomaly_flag,
        auto_blocked = EXCLUDED.auto_blocked,
        created_at = now();

    RETURN QUERY SELECT p_batch_id, v_anomaly, v_flag, v_block;

END;
$$;


ALTER FUNCTION engine."run_governance_intelligence_OLD"(p_batch_id uuid) OWNER TO postgres;

--
-- Name: run_governance_intelligence_OLD_2(uuid); Type: FUNCTION; Schema: engine; Owner: postgres
--

CREATE FUNCTION engine."run_governance_intelligence_OLD_2"(p_batch_id uuid) RETURNS TABLE(batch_id uuid, anomaly_score numeric, anomaly_flag boolean, auto_blocked boolean)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_window integer;
    v_threshold numeric;
    v_repeat_threshold integer;
    v_vol_multiplier numeric;

    v_avg_score numeric;
    v_std_score numeric;
    v_current_score numeric;
    v_zscore numeric := 0;

    v_risk numeric := 0;
    v_repeat numeric := 0;
    v_stability numeric := 0;
    v_exec_z numeric := 0;
    v_anomaly numeric := 0;

    v_flag boolean := false;
    v_block boolean := false;
BEGIN

    -- ==========================
    -- Load Configuration
    -- ==========================

    SELECT rolling_window_size,
           anomaly_block_threshold,
           repeat_failure_threshold,
           volatility_multiplier
    INTO v_window,
         v_threshold,
         v_repeat_threshold,
         v_vol_multiplier
    FROM engine.governance_config
    ORDER BY created_at DESC
    LIMIT 1;

    -- ==========================
    -- Current Score
    -- ==========================

    SELECT overall_score
    INTO v_current_score
    FROM engine.migration_validation_batch
    WHERE batch_id = p_batch_id;

    -- ==========================
    -- Rolling Statistics
    -- ==========================

    SELECT avg(overall_score), stddev(overall_score)
    INTO v_avg_score, v_std_score
    FROM (
        SELECT overall_score
        FROM engine.migration_validation_batch
        WHERE overall_score IS NOT NULL
        ORDER BY execution_start DESC
        LIMIT v_window
    ) t;

    IF v_std_score IS NOT NULL AND v_std_score > 0 THEN
        v_zscore := (v_current_score - v_avg_score) / v_std_score;
    END IF;

    v_stability := GREATEST(0, 100 - abs(v_zscore * 20));

    -- ==========================
    -- Risk Heat (Severity Weighted Failures)
    -- ==========================

    SELECT COALESCE(SUM(
        CASE severity_level
            WHEN 'CRITICAL' THEN 5
            WHEN 'HIGH' THEN 3
            WHEN 'MEDIUM' THEN 2
            WHEN 'LOW' THEN 1
            ELSE 1
        END
    ),0)
    INTO v_risk
    FROM engine.migration_control_execution
    WHERE batch_id = p_batch_id
    AND execution_status <> 'PASS';

    -- ==========================
    -- Repeat Failure Index
    -- ==========================

    SELECT COUNT(*)
    INTO v_repeat
    FROM engine.migration_control_execution c
    WHERE c.batch_id = p_batch_id
      AND c.execution_status = 'FAIL'
      AND EXISTS (
          SELECT 1
          FROM engine.migration_control_execution p
          WHERE p.control_id = c.control_id
            AND p.execution_status = 'FAIL'
            AND p.created_at < c.created_at
      );

    -- ==========================
    -- Execution Duration Z-Score
    -- ==========================

    WITH hist AS (
        SELECT avg(execution_time_seconds) avg_time,
               stddev(execution_time_seconds) std_time
        FROM engine.migration_control_execution
        WHERE execution_time_seconds IS NOT NULL
    ),
    curr AS (
        SELECT avg(execution_time_seconds) curr_time
        FROM engine.migration_control_execution
        WHERE batch_id = p_batch_id
    )
    SELECT CASE
             WHEN hist.std_time > 0
             THEN (curr.curr_time - hist.avg_time) / hist.std_time
             ELSE 0
           END
    INTO v_exec_z
    FROM hist, curr;

    -- ==========================
    -- Combined Anomaly Score
    -- ==========================

    v_anomaly :=
          (abs(v_zscore) * 25)
        + (v_risk * 2)
        + (v_repeat * 5)
        + (abs(v_exec_z) * 10);

    IF v_repeat >= v_repeat_threshold THEN
        v_anomaly := v_anomaly + 15;
    END IF;

    IF v_anomaly > v_threshold THEN
        v_flag := true;
        v_block := true;
    END IF;

    -- ==========================
    -- Persist Intelligence
    -- ==========================

    INSERT INTO engine.migration_batch_intelligence (
        batch_id,
        rolling_window_size,
        avg_score_last_n,
        stability_score,
        risk_heat_index,
        repeat_failure_index,
        execution_time_zscore,
        anomaly_score,
        anomaly_flag,
        auto_blocked,
        created_at
    )
    VALUES (
        p_batch_id,
        v_window,
        v_avg_score,
        v_stability,
        v_risk,
        v_repeat,
        v_exec_z,
        v_anomaly,
        v_flag,
        v_block,
        now()
    )
    ON CONFLICT (batch_id) DO UPDATE
    SET rolling_window_size = EXCLUDED.rolling_window_size,
        avg_score_last_n = EXCLUDED.avg_score_last_n,
        stability_score = EXCLUDED.stability_score,
        risk_heat_index = EXCLUDED.risk_heat_index,
        repeat_failure_index = EXCLUDED.repeat_failure_index,
        execution_time_zscore = EXCLUDED.execution_time_zscore,
        anomaly_score = EXCLUDED.anomaly_score,
        anomaly_flag = EXCLUDED.anomaly_flag,
        auto_blocked = EXCLUDED.auto_blocked,
        created_at = now();

    RETURN QUERY
    SELECT p_batch_id, v_anomaly, v_flag, v_block;

END;
$$;


ALTER FUNCTION engine."run_governance_intelligence_OLD_2"(p_batch_id uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: column_mappings; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.column_mappings (
    column_mapping_id uuid DEFAULT gen_random_uuid() NOT NULL,
    mapping_id uuid NOT NULL,
    source_column_id uuid NOT NULL,
    target_column_id uuid,
    column_role character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE core.column_mappings OWNER TO postgres;

--
-- Name: dataset_columns; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.dataset_columns (
    column_id uuid DEFAULT gen_random_uuid() NOT NULL,
    mapping_id uuid NOT NULL,
    column_name character varying(150) NOT NULL,
    column_position integer,
    data_type character varying(100),
    column_side character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_nullable boolean,
    is_primary_key boolean DEFAULT false,
    inferred_role character varying(50),
    CONSTRAINT dataset_columns_column_side_check CHECK (((column_side)::text = ANY ((ARRAY['SOURCE'::character varying, 'TARGET'::character varying])::text[])))
);


ALTER TABLE core.dataset_columns OWNER TO postgres;

--
-- Name: dataset_mappings; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.dataset_mappings (
    mapping_id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    source_system_id uuid NOT NULL,
    target_system_id uuid,
    source_schema character varying(150),
    source_table character varying(150),
    source_columns text[],
    target_schema character varying(150),
    target_table character varying(150),
    target_columns text[],
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE core.dataset_mappings OWNER TO postgres;

--
-- Name: datasets; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.datasets (
    dataset_id uuid DEFAULT gen_random_uuid() NOT NULL,
    system_id uuid NOT NULL,
    schema_name character varying(150),
    table_name character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE core.datasets OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.projects (
    project_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    project_name character varying(200) NOT NULL,
    project_type character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT projects_project_type_check CHECK (((project_type)::text = ANY ((ARRAY['MIGRATION'::character varying, 'DATA_QUALITY'::character varying])::text[])))
);


ALTER TABLE core.projects OWNER TO postgres;

--
-- Name: rule_dataset_mapping; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.rule_dataset_mapping (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rule_id character varying(50) NOT NULL,
    mapping_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE core.rule_dataset_mapping OWNER TO postgres;

--
-- Name: system_registry; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.system_registry (
    system_id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    system_name character varying(200) NOT NULL,
    system_role character varying(50) NOT NULL,
    database_type character varying(50) NOT NULL,
    connection_config jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text,
    CONSTRAINT system_registry_database_type_check CHECK (((database_type)::text = ANY ((ARRAY['POSTGRES'::character varying, 'ORACLE'::character varying, 'SQLSERVER'::character varying, 'MYSQL'::character varying, 'SNOWFLAKE'::character varying, 'DATABRICKS'::character varying])::text[]))),
    CONSTRAINT system_registry_system_role_check CHECK (((system_role)::text = ANY ((ARRAY['SOURCE'::character varying, 'TARGET'::character varying, 'ANALYTICS'::character varying])::text[])))
);


ALTER TABLE core.system_registry OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: core; Owner: postgres
--

CREATE TABLE core.tenants (
    tenant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_name character varying(200) NOT NULL,
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE core.tenants OWNER TO postgres;

--
-- Name: batch_anomaly_analysis; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.batch_anomaly_analysis (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    deterministic_score numeric(6,2),
    statistical_score numeric(6,2),
    anomaly_score numeric(6,2),
    anomaly_classification character varying(20),
    auto_block boolean,
    created_at timestamp without time zone DEFAULT now(),
    explanation text
);


ALTER TABLE engine.batch_anomaly_analysis OWNER TO postgres;

--
-- Name: batch_anomaly_analysis_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.batch_anomaly_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.batch_anomaly_analysis_id_seq OWNER TO postgres;

--
-- Name: batch_anomaly_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.batch_anomaly_analysis_id_seq OWNED BY engine.batch_anomaly_analysis.id;


--
-- Name: batch_intelligence; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.batch_intelligence (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    stability_score numeric(6,2),
    confidence_index numeric(6,2),
    risk_heat_index numeric(10,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.batch_intelligence OWNER TO postgres;

--
-- Name: batch_intelligence_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.batch_intelligence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.batch_intelligence_id_seq OWNER TO postgres;

--
-- Name: batch_intelligence_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.batch_intelligence_id_seq OWNED BY engine.batch_intelligence.id;


--
-- Name: batch_rule_scores; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.batch_rule_scores (
    batch_id uuid,
    rule_id character varying(50),
    score numeric(5,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.batch_rule_scores OWNER TO postgres;

--
-- Name: control_persistence_analysis; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.control_persistence_analysis (
    id integer NOT NULL,
    control_id character varying(50),
    repeat_count integer,
    repeat_flag boolean,
    analysis_window integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.control_persistence_analysis OWNER TO postgres;

--
-- Name: control_persistence_analysis_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.control_persistence_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.control_persistence_analysis_id_seq OWNER TO postgres;

--
-- Name: control_persistence_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.control_persistence_analysis_id_seq OWNED BY engine.control_persistence_analysis.id;


--
-- Name: control_registry; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.control_registry (
    control_id character varying(10) NOT NULL,
    control_name text NOT NULL,
    description text,
    severity_level character varying(20),
    enabled_flag boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    project_id uuid NOT NULL
);


ALTER TABLE engine.control_registry OWNER TO postgres;

--
-- Name: dataset_mappings_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."dataset_mappings_OLD" (
    mapping_id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    source_system_id uuid NOT NULL,
    target_system_id uuid,
    source_schema text,
    source_table text,
    target_schema text,
    target_table text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine."dataset_mappings_OLD" OWNER TO postgres;

--
-- Name: governance_config; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.governance_config (
    id integer NOT NULL,
    client_name character varying(100) DEFAULT 'GLOBAL'::character varying,
    environment character varying(20) DEFAULT 'ALL'::character varying,
    rolling_window_size integer DEFAULT 5,
    anomaly_std_threshold numeric(5,2) DEFAULT 2.0,
    repeat_failure_threshold integer DEFAULT 3,
    anomaly_block_threshold numeric(5,2) DEFAULT 70,
    volatility_multiplier numeric(5,2) DEFAULT 1.5,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.governance_config OWNER TO postgres;

--
-- Name: governance_config_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."governance_config_OLD" (
    id integer NOT NULL,
    rolling_window_size integer DEFAULT 5,
    anomaly_std_threshold numeric(5,2) DEFAULT 2.0,
    repeat_failure_threshold integer DEFAULT 3,
    anomaly_block_threshold numeric(5,2) DEFAULT 70,
    volatility_multiplier numeric(5,2) DEFAULT 1.5,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine."governance_config_OLD" OWNER TO postgres;

--
-- Name: governance_config_OLD_1; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."governance_config_OLD_1" (
    id integer NOT NULL,
    rolling_window_size integer DEFAULT 5,
    anomaly_std_threshold numeric(5,2) DEFAULT 2.0,
    repeat_failure_threshold integer DEFAULT 3,
    anomaly_block_threshold numeric(5,2) DEFAULT 70,
    volatility_multiplier numeric(5,2) DEFAULT 1.5,
    config_value text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine."governance_config_OLD_1" OWNER TO postgres;

--
-- Name: governance_config_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.governance_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.governance_config_id_seq OWNER TO postgres;

--
-- Name: governance_config_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.governance_config_id_seq OWNED BY engine."governance_config_OLD".id;


--
-- Name: governance_config_id_seq1; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.governance_config_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.governance_config_id_seq1 OWNER TO postgres;

--
-- Name: governance_config_id_seq1; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.governance_config_id_seq1 OWNED BY engine."governance_config_OLD_1".id;


--
-- Name: governance_config_id_seq2; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.governance_config_id_seq2
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.governance_config_id_seq2 OWNER TO postgres;

--
-- Name: governance_config_id_seq2; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.governance_config_id_seq2 OWNED BY engine.governance_config.id;


--
-- Name: migration_batch_intelligence; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_batch_intelligence (
    batch_id uuid NOT NULL,
    rolling_window_size integer,
    avg_score_last_n numeric,
    stability_score numeric,
    risk_heat_index numeric,
    repeat_failure_index numeric,
    execution_time_zscore numeric,
    anomaly_score numeric,
    anomaly_flag boolean,
    auto_blocked boolean,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.migration_batch_intelligence OWNER TO postgres;

--
-- Name: migration_batch_intelligence_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."migration_batch_intelligence_OLD" (
    batch_id uuid NOT NULL,
    rolling_window_size integer,
    avg_score_last_n numeric(5,2),
    stability_score numeric(5,2),
    risk_heat_index numeric(5,2),
    repeat_failure_index numeric(5,2),
    execution_time_zscore numeric(10,4),
    anomaly_score numeric(5,2),
    anomaly_flag boolean,
    auto_blocked boolean,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine."migration_batch_intelligence_OLD" OWNER TO postgres;

--
-- Name: migration_batch_summary; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_batch_summary (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    overall_status character varying(20),
    total_controls integer,
    passed_controls integer,
    failed_controls integer,
    error_controls integer,
    blocked_controls integer,
    created_at timestamp without time zone DEFAULT now(),
    project_id uuid
);


ALTER TABLE engine.migration_batch_summary OWNER TO postgres;

--
-- Name: migration_batch_summary_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.migration_batch_summary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.migration_batch_summary_id_seq OWNER TO postgres;

--
-- Name: migration_batch_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.migration_batch_summary_id_seq OWNED BY engine.migration_batch_summary.id;


--
-- Name: migration_control_exceptions; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_control_exceptions (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    control_id character varying(20),
    rule_id character varying(50),
    entity_name character varying(100),
    source_value text,
    target_value text,
    delta_value numeric,
    created_at timestamp without time zone DEFAULT now(),
    cause text,
    failure_scope character varying(20)
);


ALTER TABLE engine.migration_control_exceptions OWNER TO postgres;

--
-- Name: migration_control_exceptions_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.migration_control_exceptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.migration_control_exceptions_id_seq OWNER TO postgres;

--
-- Name: migration_control_exceptions_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.migration_control_exceptions_id_seq OWNED BY engine.migration_control_exceptions.id;


--
-- Name: migration_control_execution; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_control_execution (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    control_id character varying(20),
    rule_id character varying(50),
    entity_name character varying(100),
    execution_status character varying(20),
    delta_value numeric,
    execution_time_seconds numeric,
    created_at timestamp without time zone DEFAULT now(),
    severity_level character varying(20),
    mapping_id uuid
);


ALTER TABLE engine.migration_control_execution OWNER TO postgres;

--
-- Name: migration_control_execution_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."migration_control_execution_OLD" (
    execution_id uuid DEFAULT gen_random_uuid() NOT NULL,
    batch_id uuid,
    control_id character varying(10),
    rule_id character varying(20),
    entity_name character varying(100),
    status character varying(10),
    execution_timestamp timestamp without time zone DEFAULT now()
);


ALTER TABLE engine."migration_control_execution_OLD" OWNER TO postgres;

--
-- Name: migration_control_execution_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.migration_control_execution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.migration_control_execution_id_seq OWNER TO postgres;

--
-- Name: migration_control_execution_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.migration_control_execution_id_seq OWNED BY engine.migration_control_execution.id;


--
-- Name: migration_control_summary; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_control_summary (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    control_id character varying(20),
    overall_status character varying(20),
    total_rules integer,
    passed_rules integer,
    failed_rules integer,
    error_rules integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.migration_control_summary OWNER TO postgres;

--
-- Name: migration_control_summary_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.migration_control_summary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.migration_control_summary_id_seq OWNER TO postgres;

--
-- Name: migration_control_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.migration_control_summary_id_seq OWNED BY engine.migration_control_summary.id;


--
-- Name: migration_exception_register; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_exception_register (
    exception_id uuid DEFAULT gen_random_uuid() NOT NULL,
    batch_id uuid,
    control_id character varying(10),
    rule_id character varying(20),
    entity_name character varying(100),
    primary_key_value text,
    source_value text,
    target_value text,
    variance_value numeric,
    created_timestamp timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.migration_exception_register OWNER TO postgres;

--
-- Name: migration_release_decision; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_release_decision (
    id integer NOT NULL,
    batch_id uuid NOT NULL,
    environment character varying(20),
    client_name character varying(100),
    overall_status character varying(20),
    overall_score numeric(5,2),
    gate_result character varying(20),
    decision_reason text,
    approved_by character varying(100) DEFAULT 'SYSTEM'::character varying,
    approval_timestamp timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine.migration_release_decision OWNER TO postgres;

--
-- Name: migration_release_decision_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.migration_release_decision_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.migration_release_decision_id_seq OWNER TO postgres;

--
-- Name: migration_release_decision_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.migration_release_decision_id_seq OWNED BY engine.migration_release_decision.id;


--
-- Name: migration_validation_batch; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.migration_validation_batch (
    batch_id uuid NOT NULL,
    execution_start timestamp without time zone,
    execution_end timestamp without time zone,
    overall_status character varying(20),
    overall_score numeric(5,2),
    project_id uuid
);


ALTER TABLE engine.migration_validation_batch OWNER TO postgres;

--
-- Name: projects_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."projects_OLD" (
    project_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    project_name text NOT NULL,
    project_type text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT projects_project_type_check CHECK ((project_type = ANY (ARRAY['MIGRATION'::text, 'DATA_QUALITY'::text])))
);


ALTER TABLE engine."projects_OLD" OWNER TO postgres;

--
-- Name: rule_anomaly_history; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.rule_anomaly_history (
    id integer NOT NULL,
    dataset_name character varying(255),
    rule_code character varying(20),
    anomaly_score numeric,
    anomaly_type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE engine.rule_anomaly_history OWNER TO postgres;

--
-- Name: rule_anomaly_history_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.rule_anomaly_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.rule_anomaly_history_id_seq OWNER TO postgres;

--
-- Name: rule_anomaly_history_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.rule_anomaly_history_id_seq OWNED BY engine.rule_anomaly_history.id;


--
-- Name: rule_execution_statistics; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.rule_execution_statistics (
    id integer NOT NULL,
    batch_id uuid,
    rule_code character varying(20),
    dataset_name character varying(255),
    execution_time_ms integer,
    rows_checked bigint,
    rows_failed bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE engine.rule_execution_statistics OWNER TO postgres;

--
-- Name: rule_execution_statistics_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.rule_execution_statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.rule_execution_statistics_id_seq OWNER TO postgres;

--
-- Name: rule_execution_statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.rule_execution_statistics_id_seq OWNED BY engine.rule_execution_statistics.id;


--
-- Name: rule_parameter_metadata_legacy; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.rule_parameter_metadata_legacy (
    id integer NOT NULL,
    rule_id character varying(50),
    entity_name character varying(100),
    source_schema character varying(100),
    source_table character varying(100),
    target_schema character varying(100),
    target_table character varying(100),
    primary_key_column character varying(100),
    filter_condition text,
    tolerance_value numeric DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    numeric_column character varying(100)
);


ALTER TABLE engine.rule_parameter_metadata_legacy OWNER TO postgres;

--
-- Name: rule_parameter_metadata_id_seq; Type: SEQUENCE; Schema: engine; Owner: postgres
--

CREATE SEQUENCE engine.rule_parameter_metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine.rule_parameter_metadata_id_seq OWNER TO postgres;

--
-- Name: rule_parameter_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: engine; Owner: postgres
--

ALTER SEQUENCE engine.rule_parameter_metadata_id_seq OWNED BY engine.rule_parameter_metadata_legacy.id;


--
-- Name: rule_registry; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.rule_registry (
    rule_id character varying(50) NOT NULL,
    control_id character varying(10),
    rule_name text NOT NULL,
    sql_template_file text NOT NULL,
    severity_level character varying(20),
    enabled_flag boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    rule_type character varying(50),
    rule_scope character varying(20) DEFAULT 'TABLE'::character varying
);


ALTER TABLE engine.rule_registry OWNER TO postgres;

--
-- Name: rule_weight_config; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.rule_weight_config (
    rule_id character varying(50) NOT NULL,
    weight_score numeric(5,2),
    severity_level character varying(20)
);


ALTER TABLE engine.rule_weight_config OWNER TO postgres;

--
-- Name: rule_weights; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine.rule_weights (
    rule_id character varying(50) NOT NULL,
    weight integer NOT NULL
);


ALTER TABLE engine.rule_weights OWNER TO postgres;

--
-- Name: system_registry_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."system_registry_OLD" (
    system_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    system_name text NOT NULL,
    system_type text,
    connection_config jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT system_registry_system_type_check CHECK ((system_type = ANY (ARRAY['POSTGRES'::text, 'ORACLE'::text, 'SNOWFLAKE'::text, 'SQLSERVER'::text, 'MYSQL'::text, 'DATABRICKS'::text])))
);


ALTER TABLE engine."system_registry_OLD" OWNER TO postgres;

--
-- Name: tenants_OLD; Type: TABLE; Schema: engine; Owner: postgres
--

CREATE TABLE engine."tenants_OLD" (
    tenant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine."tenants_OLD" OWNER TO postgres;

--
-- Name: v_migration_score_trend; Type: VIEW; Schema: engine; Owner: postgres
--

CREATE VIEW engine.v_migration_score_trend AS
 SELECT batch_id,
    execution_start,
    overall_status,
    overall_score,
    avg(overall_score) OVER (ORDER BY execution_start ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS rolling_5_batch_avg
   FROM engine.migration_validation_batch
  WHERE (overall_score IS NOT NULL)
  ORDER BY execution_start DESC;


ALTER VIEW engine.v_migration_score_trend OWNER TO postgres;

--
-- Name: batch_intelligence; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.batch_intelligence (
    batch_id uuid NOT NULL,
    rolling_window_size integer,
    avg_score_last_n numeric,
    stability_score numeric,
    risk_heat_index numeric,
    repeat_failure_index numeric,
    execution_time_zscore numeric,
    anomaly_score numeric,
    anomaly_flag boolean,
    auto_blocked boolean,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.batch_intelligence OWNER TO postgres;

--
-- Name: batch_runs; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.batch_runs (
    batch_id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    execution_start timestamp without time zone DEFAULT now(),
    execution_end timestamp without time zone,
    overall_status text,
    overall_score numeric,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.batch_runs OWNER TO postgres;

--
-- Name: column_mappings; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.column_mappings (
    column_mapping_id uuid DEFAULT gen_random_uuid() NOT NULL,
    mapping_id uuid NOT NULL,
    source_column_id uuid NOT NULL,
    target_column_id uuid,
    transformation_rule text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.column_mappings OWNER TO postgres;

--
-- Name: control_executions; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.control_executions (
    execution_id bigint NOT NULL,
    batch_id uuid NOT NULL,
    mapping_id uuid NOT NULL,
    control_id text NOT NULL,
    execution_status text,
    delta_value numeric,
    execution_time_seconds numeric,
    severity_level text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.control_executions OWNER TO postgres;

--
-- Name: control_executions_execution_id_seq; Type: SEQUENCE; Schema: engine_v14; Owner: postgres
--

CREATE SEQUENCE engine_v14.control_executions_execution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE engine_v14.control_executions_execution_id_seq OWNER TO postgres;

--
-- Name: control_executions_execution_id_seq; Type: SEQUENCE OWNED BY; Schema: engine_v14; Owner: postgres
--

ALTER SEQUENCE engine_v14.control_executions_execution_id_seq OWNED BY engine_v14.control_executions.execution_id;


--
-- Name: dataset_columns; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.dataset_columns (
    column_id uuid DEFAULT gen_random_uuid() NOT NULL,
    dataset_id uuid NOT NULL,
    column_name text NOT NULL,
    data_type text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.dataset_columns OWNER TO postgres;

--
-- Name: dataset_mappings; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.dataset_mappings (
    mapping_id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    source_dataset_id uuid NOT NULL,
    target_dataset_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.dataset_mappings OWNER TO postgres;

--
-- Name: datasets; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.datasets (
    dataset_id uuid DEFAULT gen_random_uuid() NOT NULL,
    system_id uuid NOT NULL,
    schema_name text,
    dataset_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.datasets OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.projects (
    project_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    project_name text NOT NULL,
    project_type text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT projects_project_type_check CHECK ((project_type = ANY (ARRAY['MIGRATION'::text, 'DATA_QUALITY'::text])))
);


ALTER TABLE engine_v14.projects OWNER TO postgres;

--
-- Name: systems; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.systems (
    system_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    system_name text NOT NULL,
    system_type text,
    connection_config jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT systems_system_type_check CHECK ((system_type = ANY (ARRAY['POSTGRES'::text, 'ORACLE'::text, 'SNOWFLAKE'::text, 'SQLSERVER'::text, 'MYSQL'::text, 'DATABRICKS'::text])))
);


ALTER TABLE engine_v14.systems OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: engine_v14; Owner: postgres
--

CREATE TABLE engine_v14.tenants (
    tenant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE engine_v14.tenants OWNER TO postgres;

--
-- Name: dim_date; Type: TABLE; Schema: reporting; Owner: postgres
--

CREATE TABLE reporting.dim_date (
    date_value date,
    year numeric,
    month numeric,
    day numeric,
    year_month text,
    quarter numeric
);


ALTER TABLE reporting.dim_date OWNER TO postgres;

--
-- Name: dim_severity; Type: TABLE; Schema: reporting; Owner: postgres
--

CREATE TABLE reporting.dim_severity (
    severity_key integer NOT NULL,
    severity_code character varying(20),
    severity_weight integer,
    severity_rank integer
);


ALTER TABLE reporting.dim_severity OWNER TO postgres;

--
-- Name: dim_severity_severity_key_seq; Type: SEQUENCE; Schema: reporting; Owner: postgres
--

CREATE SEQUENCE reporting.dim_severity_severity_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE reporting.dim_severity_severity_key_seq OWNER TO postgres;

--
-- Name: dim_severity_severity_key_seq; Type: SEQUENCE OWNED BY; Schema: reporting; Owner: postgres
--

ALTER SEQUENCE reporting.dim_severity_severity_key_seq OWNED BY reporting.dim_severity.severity_key;


--
-- Name: dim_status; Type: TABLE; Schema: reporting; Owner: postgres
--

CREATE TABLE reporting.dim_status (
    status_key integer NOT NULL,
    status_code character varying(20),
    status_category character varying(20)
);


ALTER TABLE reporting.dim_status OWNER TO postgres;

--
-- Name: dim_status_status_key_seq; Type: SEQUENCE; Schema: reporting; Owner: postgres
--

CREATE SEQUENCE reporting.dim_status_status_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE reporting.dim_status_status_key_seq OWNER TO postgres;

--
-- Name: dim_status_status_key_seq; Type: SEQUENCE OWNED BY; Schema: reporting; Owner: postgres
--

ALTER SEQUENCE reporting.dim_status_status_key_seq OWNED BY reporting.dim_status.status_key;


--
-- Name: v_batch_governance_intelligence; Type: VIEW; Schema: reporting; Owner: postgres
--

CREATE VIEW reporting.v_batch_governance_intelligence AS
 SELECT b.batch_id,
    b.execution_start,
    b.overall_status,
    b.overall_score,
    i.rolling_window_size,
    i.avg_score_last_n,
    i.stability_score,
    i.risk_heat_index,
    i.repeat_failure_index,
    i.execution_time_zscore,
    i.anomaly_score,
    i.anomaly_flag,
    i.auto_blocked,
        CASE
            WHEN i.auto_blocked THEN 'AUTO-BLOCKED'::text
            WHEN i.anomaly_flag THEN 'ANOMALY DETECTED'::text
            WHEN ((b.overall_status)::text = 'PASS'::text) THEN 'CERTIFIED'::text
            WHEN ((b.overall_status)::text = 'FAIL'::text) THEN 'FAILED'::text
            ELSE 'BLOCKED'::text
        END AS governance_decision,
        CASE
            WHEN i.anomaly_flag THEN 'HIGH RISK'::text
            WHEN (i.stability_score < (60)::numeric) THEN 'UNSTABLE'::text
            WHEN (b.overall_score >= (95)::numeric) THEN 'GOLD'::text
            WHEN (b.overall_score >= (85)::numeric) THEN 'SILVER'::text
            WHEN (b.overall_score >= (70)::numeric) THEN 'BRONZE'::text
            ELSE 'NON-COMPLIANT'::text
        END AS certification_tier
   FROM (engine.migration_validation_batch b
     LEFT JOIN engine."migration_batch_intelligence_OLD" i ON ((b.batch_id = i.batch_id)));


ALTER VIEW reporting.v_batch_governance_intelligence OWNER TO postgres;

--
-- Name: v_batch_governance_intelligence_OLD; Type: VIEW; Schema: reporting; Owner: postgres
--

CREATE VIEW reporting."v_batch_governance_intelligence_OLD" AS
 SELECT batch_id,
    execution_start,
    overall_status,
    overall_score,
    rolling_window_size,
    avg_score_last_n,
    stability_score,
    risk_heat_index,
    repeat_failure_index,
    execution_time_zscore,
    anomaly_score,
    anomaly_flag,
    auto_blocked,
    governance_decision,
        CASE
            WHEN anomaly_flag THEN 'HIGH RISK'::text
            WHEN (stability_score < (60)::numeric) THEN 'UNSTABLE'::text
            WHEN (overall_score >= (95)::numeric) THEN 'GOLD'::text
            WHEN (overall_score >= (85)::numeric) THEN 'SILVER'::text
            WHEN (overall_score >= (70)::numeric) THEN 'BRONZE'::text
            ELSE 'NON-COMPLIANT'::text
        END AS certification_tier
   FROM reporting."v_batch_governance_intelligence_OLD";


ALTER VIEW reporting."v_batch_governance_intelligence_OLD" OWNER TO postgres;

--
-- Name: v_fact_batch; Type: VIEW; Schema: reporting; Owner: postgres
--

CREATE VIEW reporting.v_fact_batch AS
 SELECT b.batch_id,
    b.execution_start,
    b.execution_end,
    b.overall_status,
    b.overall_score,
    r.environment,
    r.client_name,
    r.gate_result,
    r.decision_reason,
    r.approved_by,
    r.approval_timestamp
   FROM (engine.migration_validation_batch b
     LEFT JOIN engine.migration_release_decision r ON ((b.batch_id = r.batch_id)));


ALTER VIEW reporting.v_fact_batch OWNER TO postgres;

--
-- Name: v_fact_control; Type: VIEW; Schema: reporting; Owner: postgres
--

CREATE VIEW reporting.v_fact_control AS
 SELECT batch_id,
    control_id,
    overall_status AS control_status,
    total_rules,
    passed_rules,
    failed_rules,
    error_rules,
    created_at AS execution_time_seconds
   FROM engine.migration_control_summary c;


ALTER VIEW reporting.v_fact_control OWNER TO postgres;

--
-- Name: batch_anomaly_analysis id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.batch_anomaly_analysis ALTER COLUMN id SET DEFAULT nextval('engine.batch_anomaly_analysis_id_seq'::regclass);


--
-- Name: batch_intelligence id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.batch_intelligence ALTER COLUMN id SET DEFAULT nextval('engine.batch_intelligence_id_seq'::regclass);


--
-- Name: control_persistence_analysis id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.control_persistence_analysis ALTER COLUMN id SET DEFAULT nextval('engine.control_persistence_analysis_id_seq'::regclass);


--
-- Name: governance_config id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.governance_config ALTER COLUMN id SET DEFAULT nextval('engine.governance_config_id_seq2'::regclass);


--
-- Name: governance_config_OLD id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."governance_config_OLD" ALTER COLUMN id SET DEFAULT nextval('engine.governance_config_id_seq'::regclass);


--
-- Name: governance_config_OLD_1 id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."governance_config_OLD_1" ALTER COLUMN id SET DEFAULT nextval('engine.governance_config_id_seq1'::regclass);


--
-- Name: migration_batch_summary id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_batch_summary ALTER COLUMN id SET DEFAULT nextval('engine.migration_batch_summary_id_seq'::regclass);


--
-- Name: migration_control_exceptions id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_exceptions ALTER COLUMN id SET DEFAULT nextval('engine.migration_control_exceptions_id_seq'::regclass);


--
-- Name: migration_control_execution id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_execution ALTER COLUMN id SET DEFAULT nextval('engine.migration_control_execution_id_seq'::regclass);


--
-- Name: migration_control_summary id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_summary ALTER COLUMN id SET DEFAULT nextval('engine.migration_control_summary_id_seq'::regclass);


--
-- Name: migration_release_decision id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_release_decision ALTER COLUMN id SET DEFAULT nextval('engine.migration_release_decision_id_seq'::regclass);


--
-- Name: rule_anomaly_history id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_anomaly_history ALTER COLUMN id SET DEFAULT nextval('engine.rule_anomaly_history_id_seq'::regclass);


--
-- Name: rule_execution_statistics id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_execution_statistics ALTER COLUMN id SET DEFAULT nextval('engine.rule_execution_statistics_id_seq'::regclass);


--
-- Name: rule_parameter_metadata_legacy id; Type: DEFAULT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_parameter_metadata_legacy ALTER COLUMN id SET DEFAULT nextval('engine.rule_parameter_metadata_id_seq'::regclass);


--
-- Name: control_executions execution_id; Type: DEFAULT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.control_executions ALTER COLUMN execution_id SET DEFAULT nextval('engine_v14.control_executions_execution_id_seq'::regclass);


--
-- Name: dim_severity severity_key; Type: DEFAULT; Schema: reporting; Owner: postgres
--

ALTER TABLE ONLY reporting.dim_severity ALTER COLUMN severity_key SET DEFAULT nextval('reporting.dim_severity_severity_key_seq'::regclass);


--
-- Name: dim_status status_key; Type: DEFAULT; Schema: reporting; Owner: postgres
--

ALTER TABLE ONLY reporting.dim_status ALTER COLUMN status_key SET DEFAULT nextval('reporting.dim_status_status_key_seq'::regclass);


--
-- Data for Name: column_mappings; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.column_mappings (column_mapping_id, mapping_id, source_column_id, target_column_id, column_role, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: dataset_columns; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.dataset_columns (column_id, mapping_id, column_name, column_position, data_type, column_side, created_at, is_nullable, is_primary_key, inferred_role) FROM stdin;
a4c355f9-9fa4-48b0-a6bb-9976f0bf0883	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	account_id	1	varchar	SOURCE	2026-03-06 14:40:32.229215	t	t	PRIMARY_KEY
ce21ad8f-c725-447e-a779-df4eb20a6c39	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	account_name	1	varchar	SOURCE	2026-03-06 14:40:32.229215	t	f	\N
57916197-2a9b-48dd-bf15-5c0e9f2f00ec	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	account_id	1	varchar	TARGET	2026-03-06 14:40:32.229215	t	t	PRIMARY_KEY
475b5cb6-b20e-49fe-86e9-a4ac233a5839	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	account_name	1	varchar	TARGET	2026-03-06 14:40:32.229215	t	f	\N
19cf4e0d-6e95-4965-a514-13393114b7b9	7ebdc8d6-4637-47bb-84e4-63828009d50c	account_id	1	varchar	SOURCE	2026-03-06 14:40:32.229215	t	t	PRIMARY_KEY
edafa45a-4f72-47e6-9219-94453518c2ca	7ebdc8d6-4637-47bb-84e4-63828009d50c	balance	1	varchar	SOURCE	2026-03-06 14:40:32.229215	t	f	NUMERIC_METRIC
58295842-909a-4eae-9fcf-6f3c233403ab	7ebdc8d6-4637-47bb-84e4-63828009d50c	account_id	1	varchar	TARGET	2026-03-06 14:40:32.229215	t	t	PRIMARY_KEY
78e56e64-9fb6-4984-b535-e99f687d9eb9	7ebdc8d6-4637-47bb-84e4-63828009d50c	balance	1	varchar	TARGET	2026-03-06 14:40:32.229215	t	f	NUMERIC_METRIC
2bbf93de-8b29-4504-86a8-f5cc34e31214	bfa33f37-27dc-442f-8977-01bb6663b6f4	account_id	1	varchar	SOURCE	2026-03-06 14:40:32.229215	t	t	PRIMARY_KEY
8c7f92e0-e1ef-443c-ad14-5f6dbd330ba8	bfa33f37-27dc-442f-8977-01bb6663b6f4	customer_id	1	varchar	SOURCE	2026-03-06 14:40:32.229215	t	f	\N
dd251a37-4c47-4358-9ec8-52bc468d0bb3	bfa33f37-27dc-442f-8977-01bb6663b6f4	account_id	1	varchar	TARGET	2026-03-06 14:40:32.229215	t	t	PRIMARY_KEY
f585775c-6595-40c6-9878-cacc5dea163e	bfa33f37-27dc-442f-8977-01bb6663b6f4	customer_id	1	varchar	TARGET	2026-03-06 14:40:32.229215	t	f	\N
\.


--
-- Data for Name: dataset_mappings; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.dataset_mappings (mapping_id, project_id, source_system_id, target_system_id, source_schema, source_table, source_columns, target_schema, target_table, target_columns, is_active, created_at) FROM stdin;
8ef6caa9-d570-49d4-8a0b-b5210e8feee3	ae40b96c-20da-4972-bb29-bff3c2451ae0	99987703-20bf-4c48-a3c0-04e3f5be2d7d	80f1c83c-56d7-47fc-9487-debfc30b9360	public	accounts_source	{account_id,account_name}	public	accounts_target	{account_id,account_name}	t	2026-03-06 11:06:01.024303
7ebdc8d6-4637-47bb-84e4-63828009d50c	ae40b96c-20da-4972-bb29-bff3c2451ae0	99987703-20bf-4c48-a3c0-04e3f5be2d7d	80f1c83c-56d7-47fc-9487-debfc30b9360	public	balances_source	{account_id,balance}	public	balances_target	{account_id,balance}	t	2026-03-06 11:06:01.274887
bfa33f37-27dc-442f-8977-01bb6663b6f4	ae40b96c-20da-4972-bb29-bff3c2451ae0	99987703-20bf-4c48-a3c0-04e3f5be2d7d	80f1c83c-56d7-47fc-9487-debfc30b9360	public	customer_accounts_source	{account_id,customer_id}	public	customer_accounts_target	{account_id,customer_id}	t	2026-03-06 11:06:01.593006
\.


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.datasets (dataset_id, system_id, schema_name, table_name, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.projects (project_id, tenant_id, project_name, project_type, status, created_at) FROM stdin;
ae40b96c-20da-4972-bb29-bff3c2451ae0	aaf73536-2fd0-461e-87be-aa980cc1a8f1	Legacy Migration Program	MIGRATION	ACTIVE	2026-02-22 19:21:47.262252
\.


--
-- Data for Name: rule_dataset_mapping; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.rule_dataset_mapping (id, rule_id, mapping_id, is_active, created_at) FROM stdin;
fe261a81-edbf-4f72-b4d2-1765a483b2d2	C01_ROWCOUNT	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-07 23:19:39.04938
99a0a5ee-aa3b-4bde-837a-cd63e0f20529	C03_REFERENTIAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-07 23:19:39.05709
86433c27-1138-4cdb-b073-6320766c8aba	C04_COLUMN_COUNT	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-07 23:19:39.057967
c25f509e-a880-4738-b0c7-d1c055b42b8e	C05_NULL_CHECK	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-07 23:19:39.058656
b969cfe9-10f3-4108-a484-9a168e3a6e6d	C06_DATA_TYPE_MATCH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-07 23:19:39.059212
edc07dc9-3f8f-4d7b-b0ba-c7a55d0d6936	C01_ROWCOUNT	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-07 23:19:39.266491
fcc01ce7-79d0-4f5c-9e7e-cef344d877cd	C03_REFERENTIAL	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-07 23:19:39.268274
cc6a98b6-ab37-4138-bdba-ab41cc9a997d	C04_COLUMN_COUNT	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-07 23:19:39.268915
b4622376-7caa-49dd-bf5b-65effc95b8a3	C05_NULL_CHECK	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-07 23:19:39.269339
0f6b5d09-ece9-4e7c-8ea7-c07585bdda66	C06_DATA_TYPE_MATCH	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-07 23:19:39.269673
d04ee004-4c01-42a9-a19e-07072b2b55f7	C01_ROWCOUNT	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-07 23:19:39.467857
ae29b67e-eeb2-4422-b765-1c16c4940412	C03_REFERENTIAL	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-07 23:19:39.469696
00d4bd91-5f67-41bb-9ab6-18d2aea7f472	C04_COLUMN_COUNT	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-07 23:19:39.470408
c97091b6-5397-4e24-9f3d-16d604a210ae	C05_NULL_CHECK	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-07 23:19:39.471075
52f1a61b-fdfa-4d77-b2a0-71bcf553a9db	C06_DATA_TYPE_MATCH	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-07 23:19:39.471642
b3b1c7c5-a24e-4f92-a0f8-87d0d8a4bb2b	C07_DUPLICATE_DETECTION	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-08 03:18:27.299942
68903070-666a-41b8-80c9-13a41d22b539	C07_DUPLICATE_DETECTION	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-08 03:18:27.308676
35e966e2-7d5a-4caa-8265-f27dc1d3cd47	C02_BALANCE_RECON	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-08 03:18:27.311411
aedb855e-800a-4bc4-b3d1-42fe824f4e68	C07_DUPLICATE_DETECTION	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-08 03:18:27.320673
e0974eb1-3512-4120-b8c7-69ef6ebc0fdd	C02_BALANCE_RECON	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-08 04:52:40.515984
c0cacff1-4edf-4471-8407-b3837a25d1c3	C02_BALANCE_RECON	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-08 04:52:40.664358
cfcaddee-ea2d-4db4-9054-143c91113130	C08_DATA_DRIFT	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-08 09:14:13.678569
6feaea37-4a33-492e-8b98-4be5f014593a	C08_DATA_DRIFT	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-08 09:14:13.862865
287487a2-93b0-40b1-a20a-f16ba70cd332	C08_DATA_DRIFT	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-08 09:14:14.031328
c9a8cca8-0d15-4618-be20-5a05e0d066dc	C09_REFERENTIAL_COVERAGE	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-08 12:32:25.711988
a74013fe-5444-4bef-8544-0856e3fb93d1	C010_SCHEMA_DRIFT	7ebdc8d6-4637-47bb-84e4-63828009d50c	t	2026-03-08 12:32:25.721775
c2b47717-ecbf-44d0-846b-0dc6436b0637	C09_REFERENTIAL_COVERAGE	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-08 12:32:25.913211
64d2e155-796b-4c76-92b4-c91e6cfa0cdf	C010_SCHEMA_DRIFT	bfa33f37-27dc-442f-8977-01bb6663b6f4	t	2026-03-08 12:32:25.913796
e1ef42ff-4ec2-4e56-be5c-3554c7da5898	C09_REFERENTIAL_COVERAGE	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-08 12:32:26.153587
f93193e6-0097-4b6e-9d38-7909112c73ff	C010_SCHEMA_DRIFT	8ef6caa9-d570-49d4-8a0b-b5210e8feee3	t	2026-03-08 12:32:26.154534
\.


--
-- Data for Name: system_registry; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.system_registry (system_id, project_id, system_name, system_role, database_type, connection_config, created_at, password) FROM stdin;
99987703-20bf-4c48-a3c0-04e3f5be2d7d	ae40b96c-20da-4972-bb29-bff3c2451ae0	SourceDB	SOURCE	POSTGRES	{"host": "localhost", "port": 5432, "user": "postgres", "database": "migration_source", "password": "dev123456"}	2026-02-22 19:22:49.046842	\N
80f1c83c-56d7-47fc-9487-debfc30b9360	ae40b96c-20da-4972-bb29-bff3c2451ae0	TargetDB	TARGET	POSTGRES	{"host": "localhost", "port": 5432, "user": "postgres", "database": "migration_target", "password": "dev123456"}	2026-02-22 19:26:08.91895	\N
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: core; Owner: postgres
--

COPY core.tenants (tenant_id, tenant_name, status, created_at) FROM stdin;
aaf73536-2fd0-461e-87be-aa980cc1a8f1	Default Tenant	ACTIVE	2026-02-22 19:19:19.701441
\.


--
-- Data for Name: batch_anomaly_analysis; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.batch_anomaly_analysis (id, batch_id, deterministic_score, statistical_score, anomaly_score, anomaly_classification, auto_block, created_at, explanation) FROM stdin;
\.


--
-- Data for Name: batch_intelligence; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.batch_intelligence (id, batch_id, stability_score, confidence_index, risk_heat_index, created_at) FROM stdin;
\.


--
-- Data for Name: batch_rule_scores; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.batch_rule_scores (batch_id, rule_id, score, created_at) FROM stdin;
\.


--
-- Data for Name: control_persistence_analysis; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.control_persistence_analysis (id, control_id, repeat_count, repeat_flag, analysis_window, created_at) FROM stdin;
\.


--
-- Data for Name: control_registry; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.control_registry (control_id, control_name, description, severity_level, enabled_flag, created_at, project_id) FROM stdin;
C01	Source-to-Target Record Completeness	Validates row count equality between source and target	HIGH	t	2026-02-16 20:08:26.497118	ae40b96c-20da-4972-bb29-bff3c2451ae0
C02	Financial Value Integrity & Reconciliation	Validates financial aggregates between systems	CRITICAL	t	2026-02-16 20:08:26.497118	ae40b96c-20da-4972-bb29-bff3c2451ae0
C03	Referential Integrity & Relationship Preservation	Validates foreign key and relationship continuity	HIGH	t	2026-02-16 20:08:26.497118	ae40b96c-20da-4972-bb29-bff3c2451ae0
C04	Column Count Validation	Validate number of columns match	HIGH	t	2026-03-02 10:25:08.335307	ae40b96c-20da-4972-bb29-bff3c2451ae0
C05	Null Drift Detection	Detect unexpected null increases	HIGH	t	2026-03-02 10:25:08.335307	ae40b96c-20da-4972-bb29-bff3c2451ae0
C06	Duplicate Key Detection	Detect duplicate primary keys	CRITICAL	t	2026-03-02 10:25:08.335307	ae40b96c-20da-4972-bb29-bff3c2451ae0
C07	Data Type Validation	Ensure source/target column types align	HIGH	t	2026-03-02 10:25:08.335307	ae40b96c-20da-4972-bb29-bff3c2451ae0
C08	Numeric Data Drift Detection	Detects statistical drift between source and target numeric columns	CRITICAL	t	2026-03-08 09:12:28.151454	ae40b96c-20da-4972-bb29-bff3c2451ae0
C09	Referential Coverage Validation	Detects missing parent-child relationships when FK constraints do not exist	HIGH	t	2026-03-08 09:39:47.731934	ae40b96c-20da-4972-bb29-bff3c2451ae0
C010	Schema Drift Detection	Detects column additions, removals or unexpected schema changes	CRITICAL	t	2026-03-08 10:36:52.175917	ae40b96c-20da-4972-bb29-bff3c2451ae0
\.


--
-- Data for Name: dataset_mappings_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."dataset_mappings_OLD" (mapping_id, project_id, source_system_id, target_system_id, source_schema, source_table, target_schema, target_table, created_at) FROM stdin;
\.


--
-- Data for Name: governance_config; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.governance_config (id, client_name, environment, rolling_window_size, anomaly_std_threshold, repeat_failure_threshold, anomaly_block_threshold, volatility_multiplier, created_at) FROM stdin;
1	GLOBAL	ALL	5	2.00	3	70.00	1.50	2026-02-20 09:23:57.983027
\.


--
-- Data for Name: governance_config_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."governance_config_OLD" (id, rolling_window_size, anomaly_std_threshold, repeat_failure_threshold, anomaly_block_threshold, volatility_multiplier, created_at) FROM stdin;
1	5	2.00	3	70.00	1.50	2026-02-19 15:09:44.071179
\.


--
-- Data for Name: governance_config_OLD_1; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."governance_config_OLD_1" (id, rolling_window_size, anomaly_std_threshold, repeat_failure_threshold, anomaly_block_threshold, volatility_multiplier, config_value, created_at) FROM stdin;
1	5	2.00	3	70.00	1.50	\N	2026-02-20 00:39:03.743009
\.


--
-- Data for Name: migration_batch_intelligence; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_batch_intelligence (batch_id, rolling_window_size, avg_score_last_n, stability_score, risk_heat_index, repeat_failure_index, execution_time_zscore, anomaly_score, anomaly_flag, auto_blocked, created_at) FROM stdin;
8780c73b-1267-4424-aa46-478a1f3c0f9e	5	67.0500000000000000	100	29	2	0.000000000000000000000000	68.000000000000000000000000	f	f	2026-03-08 17:22:28.506287
331f6fb0-77dd-4e33-95dc-e0319c8a7f90	5	67.0500000000000000	100	29	3	0.07545871525478630693	88.75458715254786306930	t	t	2026-03-08 20:54:45.259701
84ff530c-e881-4531-95b0-4003101ade99	5	72.7300000000000000	76.9059892324149700	14	0	-0.03772228054575910224	57.24473626493887852240	f	f	2026-03-08 20:58:38.966384
2ce7aad7-dd4f-4f37-8f33-7691d291f143	5	76.9900000000000000	78.1717937467300320	9	0	0.002537709518081836899964	45.310634911768278368999640	f	f	2026-03-08 21:20:50.048987
e51bb782-3879-4b04-9601-a0d6f5f3474f	5	79.5460000000000000	82.43379868692640282700	9	0	-0.096736163282780338718412	40.925113274169799853434120	f	f	2026-03-08 21:35:59.979908
323037fc-4fdf-4b96-a46e-2559ae6cdee0	5	84.0900000000000000	88.45299461620748467780	9	0	0.033357739421816129194170	32.767334123958805444691700	f	f	2026-03-08 23:55:37.14176
8ff1d576-661d-4285-b76c-2822bfa3d610	5	88.5120000000000000	94.78690058727001278080	9	0	-0.038816839263346731931269	24.904542658545951343312690	f	f	2026-03-09 01:16:08.802035
451345f3-072d-4272-851f-d1e983eb371f	5	89.5260000000000000	78.09109769979335546180	9	0	-0.101144957207815188428677	46.397577447336457557036770	f	f	2026-03-09 01:24:48.647978
de0157b1-54ae-4d80-8c61-906e150fbd3e	5	89.4040000000000000	85.39406513319557030780	9	0	-0.100071549953477469442165	37.258134083040311809671650	f	f	2026-03-09 01:33:35.27657
3935376f-d17f-4cbb-90b8-4bc22e5156e2	5	89.2820000000000000	91.05572809000084121440	9	0	-0.103931924777730391155258	30.219659135276252393552580	f	f	2026-03-09 01:34:19.382203
\.


--
-- Data for Name: migration_batch_intelligence_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."migration_batch_intelligence_OLD" (batch_id, rolling_window_size, avg_score_last_n, stability_score, risk_heat_index, repeat_failure_index, execution_time_zscore, anomaly_score, anomaly_flag, auto_blocked, created_at) FROM stdin;
\.


--
-- Data for Name: migration_batch_summary; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_batch_summary (id, batch_id, overall_status, total_controls, passed_controls, failed_controls, error_controls, blocked_controls, created_at, project_id) FROM stdin;
1	8780c73b-1267-4424-aa46-478a1f3c0f9e	BLOCKED	10	7	0	2	1	2026-03-08 17:22:28.497979	ae40b96c-20da-4972-bb29-bff3c2451ae0
2	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	BLOCKED	10	7	0	2	1	2026-03-08 20:54:45.250279	ae40b96c-20da-4972-bb29-bff3c2451ae0
3	84ff530c-e881-4531-95b0-4003101ade99	ERROR	10	8	0	2	0	2026-03-08 20:58:38.95621	ae40b96c-20da-4972-bb29-bff3c2451ae0
4	2ce7aad7-dd4f-4f37-8f33-7691d291f143	ERROR	10	9	0	1	0	2026-03-08 21:20:50.037104	ae40b96c-20da-4972-bb29-bff3c2451ae0
5	e51bb782-3879-4b04-9601-a0d6f5f3474f	ERROR	10	9	0	1	0	2026-03-08 21:35:59.974463	ae40b96c-20da-4972-bb29-bff3c2451ae0
6	323037fc-4fdf-4b96-a46e-2559ae6cdee0	ERROR	10	9	0	1	0	2026-03-08 23:55:37.105987	ae40b96c-20da-4972-bb29-bff3c2451ae0
7	8ff1d576-661d-4285-b76c-2822bfa3d610	ERROR	10	9	0	1	0	2026-03-09 01:16:08.792889	ae40b96c-20da-4972-bb29-bff3c2451ae0
8	451345f3-072d-4272-851f-d1e983eb371f	ERROR	10	9	0	1	0	2026-03-09 01:24:48.640381	ae40b96c-20da-4972-bb29-bff3c2451ae0
9	de0157b1-54ae-4d80-8c61-906e150fbd3e	ERROR	10	9	0	1	0	2026-03-09 01:33:35.268849	ae40b96c-20da-4972-bb29-bff3c2451ae0
10	3935376f-d17f-4cbb-90b8-4bc22e5156e2	ERROR	10	9	0	1	0	2026-03-09 01:34:19.375409	ae40b96c-20da-4972-bb29-bff3c2451ae0
\.


--
-- Data for Name: migration_control_exceptions; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_control_exceptions (id, batch_id, control_id, rule_id, entity_name, source_value, target_value, delta_value, created_at, cause, failure_scope) FROM stdin;
1	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	C010_SCHEMA_DRIFT	public.accounts_source	N/A	{'status': 'FAIL', 'delta': 2, 'missing_columns': ['account_id', 'account_name'], 'extra_columns': []}	0	2026-03-08 17:22:28.372353	\N	\N
2	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	C010_SCHEMA_DRIFT	public.balances_source	N/A	{'status': 'FAIL', 'delta': 2, 'missing_columns': ['balance', 'account_id'], 'extra_columns': []}	0	2026-03-08 17:22:28.381522	\N	\N
3	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	N/A	{'status': 'FAIL', 'delta': 2, 'missing_columns': ['account_id', 'customer_id'], 'extra_columns': []}	0	2026-03-08 17:22:28.390647	\N	\N
4	8780c73b-1267-4424-aa46-478a1f3c0f9e	C08	C08_DATA_DRIFT	public.balances_source	N/A	relation "public.balances_source" does not exist\nLINE 7:         FROM public.balances_source\n                     ^\n	0	2026-03-08 17:22:28.48466	\N	\N
5	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-08 17:22:28.49097	\N	\N
6	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-08 17:22:28.493079	\N	\N
7	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-08 17:22:28.495216	\N	\N
8	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	C010_SCHEMA_DRIFT	public.accounts_source	N/A	{'status': 'FAIL', 'delta': 2, 'missing_columns': ['account_name', 'account_id'], 'extra_columns': []}	0	2026-03-08 20:54:45.135381	\N	\N
9	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	C010_SCHEMA_DRIFT	public.balances_source	N/A	{'status': 'FAIL', 'delta': 2, 'missing_columns': ['balance', 'account_id'], 'extra_columns': []}	0	2026-03-08 20:54:45.142883	\N	\N
10	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	N/A	{'status': 'FAIL', 'delta': 2, 'missing_columns': ['account_id', 'customer_id'], 'extra_columns': []}	0	2026-03-08 20:54:45.15165	\N	\N
11	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C08	C08_DATA_DRIFT	public.balances_source	N/A	relation "public.balances_source" does not exist\nLINE 7:         FROM public.balances_source\n                     ^\n	0	2026-03-08 20:54:45.234499	\N	\N
12	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-08 20:54:45.241172	\N	\N
13	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-08 20:54:45.244015	\N	\N
14	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-08 20:54:45.24743	\N	\N
15	84ff530c-e881-4531-95b0-4003101ade99	C08	C08_DATA_DRIFT	public.balances_source	N/A	relation "public.balances_source" does not exist\nLINE 7:         FROM public.balances_source\n                     ^\n	0	2026-03-08 20:58:38.932267	\N	\N
16	84ff530c-e881-4531-95b0-4003101ade99	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-08 20:58:38.941536	\N	\N
17	84ff530c-e881-4531-95b0-4003101ade99	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-08 20:58:38.945308	\N	\N
18	84ff530c-e881-4531-95b0-4003101ade99	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-08 20:58:38.948736	\N	\N
19	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-08 21:20:50.025613	\N	\N
20	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-08 21:20:50.029653	\N	\N
21	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-08 21:20:50.033372	\N	\N
22	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-08 21:35:59.965916	\N	\N
23	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-08 21:35:59.968918	\N	\N
24	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-08 21:35:59.970902	\N	\N
25	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-08 23:55:37.083063	\N	\N
26	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-08 23:55:37.09215	\N	\N
27	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-08 23:55:37.0957	\N	\N
28	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-09 01:16:08.78327	\N	\N
29	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-09 01:16:08.788367	\N	\N
30	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-09 01:16:08.790173	\N	\N
31	451345f3-072d-4272-851f-d1e983eb371f	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-09 01:24:48.630968	\N	\N
32	451345f3-072d-4272-851f-d1e983eb371f	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-09 01:24:48.634152	\N	\N
33	451345f3-072d-4272-851f-d1e983eb371f	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-09 01:24:48.637071	\N	\N
34	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-09 01:33:35.255599	\N	\N
35	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-09 01:33:35.259915	\N	\N
36	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-09 01:33:35.264098	\N	\N
37	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	N/A	'child_table'	0	2026-03-09 01:34:19.365576	\N	\N
38	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	N/A	'child_table'	0	2026-03-09 01:34:19.369599	\N	\N
39	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	N/A	'child_table'	0	2026-03-09 01:34:19.371519	\N	\N
\.


--
-- Data for Name: migration_control_execution; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_control_execution (id, batch_id, control_id, rule_id, entity_name, execution_status, delta_value, execution_time_seconds, created_at, severity_level, mapping_id) FROM stdin;
1	8780c73b-1267-4424-aa46-478a1f3c0f9e	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0074	2026-03-08 17:22:28.314709	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
2	8780c73b-1267-4424-aa46-478a1f3c0f9e	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0052	2026-03-08 17:22:28.327068	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
3	8780c73b-1267-4424-aa46-478a1f3c0f9e	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0044	2026-03-08 17:22:28.334306	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
4	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	C010_SCHEMA_DRIFT	public.accounts_source	FAIL	2	0.031	2026-03-08 17:22:28.371479	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
5	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	C010_SCHEMA_DRIFT	public.balances_source	FAIL	2	0.005	2026-03-08 17:22:28.380497	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
6	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	FAIL	2	0.0058	2026-03-08 17:22:28.389603	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
7	8780c73b-1267-4424-aa46-478a1f3c0f9e	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0035	2026-03-08 17:22:28.398855	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
8	8780c73b-1267-4424-aa46-478a1f3c0f9e	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0015	2026-03-08 17:22:28.404981	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
9	8780c73b-1267-4424-aa46-478a1f3c0f9e	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.001	2026-03-08 17:22:28.408456	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
10	8780c73b-1267-4424-aa46-478a1f3c0f9e	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-08 17:22:28.412009	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
11	8780c73b-1267-4424-aa46-478a1f3c0f9e	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.006	2026-03-08 17:22:28.421074	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
12	8780c73b-1267-4424-aa46-478a1f3c0f9e	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0073	2026-03-08 17:22:28.430261	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
13	8780c73b-1267-4424-aa46-478a1f3c0f9e	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0055	2026-03-08 17:22:28.437884	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
14	8780c73b-1267-4424-aa46-478a1f3c0f9e	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.003	2026-03-08 17:22:28.444146	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
15	8780c73b-1267-4424-aa46-478a1f3c0f9e	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0	2026-03-08 17:22:28.447396	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
16	8780c73b-1267-4424-aa46-478a1f3c0f9e	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-08 17:22:28.450427	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
17	8780c73b-1267-4424-aa46-478a1f3c0f9e	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0013	2026-03-08 17:22:28.45546	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
18	8780c73b-1267-4424-aa46-478a1f3c0f9e	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0011	2026-03-08 17:22:28.45881	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
19	8780c73b-1267-4424-aa46-478a1f3c0f9e	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.001	2026-03-08 17:22:28.461383	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
20	8780c73b-1267-4424-aa46-478a1f3c0f9e	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0024	2026-03-08 17:22:28.467242	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
21	8780c73b-1267-4424-aa46-478a1f3c0f9e	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0018	2026-03-08 17:22:28.47138	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
22	8780c73b-1267-4424-aa46-478a1f3c0f9e	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0011	2026-03-08 17:22:28.475413	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
23	8780c73b-1267-4424-aa46-478a1f3c0f9e	C08	C08_DATA_DRIFT	public.balances_source	ERROR	0	0.0045	2026-03-08 17:22:28.485247	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
24	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.001	2026-03-08 17:22:28.491503	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
25	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.0	2026-03-08 17:22:28.493563	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
26	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.001	2026-03-08 17:22:28.496086	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
27	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0065	2026-03-08 20:54:45.016713	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
28	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.003	2026-03-08 20:54:45.026864	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
29	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0045	2026-03-08 20:54:45.034151	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
30	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	C010_SCHEMA_DRIFT	public.accounts_source	FAIL	2	0.0955	2026-03-08 20:54:45.134393	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
31	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	C010_SCHEMA_DRIFT	public.balances_source	FAIL	2	0.0035	2026-03-08 20:54:45.142219	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
32	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	FAIL	2	0.0067	2026-03-08 20:54:45.150919	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
33	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.002	2026-03-08 20:54:45.159467	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
34	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.001	2026-03-08 20:54:45.165989	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
35	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0	2026-03-08 20:54:45.168535	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
36	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.001	2026-03-08 20:54:45.170836	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
37	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0043	2026-03-08 20:54:45.177858	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
38	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0041	2026-03-08 20:54:45.185041	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
39	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.005	2026-03-08 20:54:45.191442	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
40	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.0035	2026-03-08 20:54:45.19986	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
41	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0005	2026-03-08 20:54:45.20223	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
42	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-08 20:54:45.204951	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
43	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.001	2026-03-08 20:54:45.208649	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
44	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0	2026-03-08 20:54:45.211046	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
45	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.001	2026-03-08 20:54:45.214661	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
46	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.001	2026-03-08 20:54:45.218725	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
47	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.001	2026-03-08 20:54:45.221476	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
48	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.001	2026-03-08 20:54:45.224295	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
49	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C08	C08_DATA_DRIFT	public.balances_source	ERROR	0	0.0065	2026-03-08 20:54:45.235212	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
50	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0015	2026-03-08 20:54:45.241817	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
51	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.001	2026-03-08 20:54:45.245108	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
52	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0	2026-03-08 20:54:45.248012	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
53	84ff530c-e881-4531-95b0-4003101ade99	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.006	2026-03-08 20:58:38.739465	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
54	84ff530c-e881-4531-95b0-4003101ade99	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0032	2026-03-08 20:58:38.750234	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
55	84ff530c-e881-4531-95b0-4003101ade99	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0034	2026-03-08 20:58:38.756682	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
56	84ff530c-e881-4531-95b0-4003101ade99	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0331	2026-03-08 20:58:38.794984	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
57	84ff530c-e881-4531-95b0-4003101ade99	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0066	2026-03-08 20:58:38.809688	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
58	84ff530c-e881-4531-95b0-4003101ade99	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0088	2026-03-08 20:58:38.822971	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
59	84ff530c-e881-4531-95b0-4003101ade99	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0035	2026-03-08 20:58:38.832283	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
60	84ff530c-e881-4531-95b0-4003101ade99	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0015	2026-03-08 20:58:38.840669	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
61	84ff530c-e881-4531-95b0-4003101ade99	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.001	2026-03-08 20:58:38.843925	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
62	84ff530c-e881-4531-95b0-4003101ade99	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-08 20:58:38.847048	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
63	84ff530c-e881-4531-95b0-4003101ade99	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0063	2026-03-08 20:58:38.857842	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
64	84ff530c-e881-4531-95b0-4003101ade99	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0068	2026-03-08 20:58:38.865908	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
65	84ff530c-e881-4531-95b0-4003101ade99	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0055	2026-03-08 20:58:38.875126	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
66	84ff530c-e881-4531-95b0-4003101ade99	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.0022	2026-03-08 20:58:38.8826	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
67	84ff530c-e881-4531-95b0-4003101ade99	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.001	2026-03-08 20:58:38.886827	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
68	84ff530c-e881-4531-95b0-4003101ade99	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-08 20:58:38.890273	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
69	84ff530c-e881-4531-95b0-4003101ade99	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0	2026-03-08 20:58:38.895384	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
70	84ff530c-e881-4531-95b0-4003101ade99	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.001	2026-03-08 20:58:38.899163	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
71	84ff530c-e881-4531-95b0-4003101ade99	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.001	2026-03-08 20:58:38.903601	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
72	84ff530c-e881-4531-95b0-4003101ade99	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0016	2026-03-08 20:58:38.90924	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
73	84ff530c-e881-4531-95b0-4003101ade99	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0016	2026-03-08 20:58:38.913593	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
74	84ff530c-e881-4531-95b0-4003101ade99	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0023	2026-03-08 20:58:38.918783	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
75	84ff530c-e881-4531-95b0-4003101ade99	C08	C08_DATA_DRIFT	public.balances_source	ERROR	0	0.0093	2026-03-08 20:58:38.934535	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
76	84ff530c-e881-4531-95b0-4003101ade99	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0028	2026-03-08 20:58:38.942631	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
77	84ff530c-e881-4531-95b0-4003101ade99	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.0013	2026-03-08 20:58:38.946209	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
78	84ff530c-e881-4531-95b0-4003101ade99	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0015	2026-03-08 20:58:38.950498	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
79	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0095	2026-03-08 21:20:49.826223	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
80	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0	2026-03-08 21:20:49.858392	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
81	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0131	2026-03-08 21:20:49.864923	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
82	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0452	2026-03-08 21:20:49.916056	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
83	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.004	2026-03-08 21:20:49.922902	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
84	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0055	2026-03-08 21:20:49.930638	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
85	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.003	2026-03-08 21:20:49.937793	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
86	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.001	2026-03-08 21:20:49.942775	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
87	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.001	2026-03-08 21:20:49.946276	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
88	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-08 21:20:49.948458	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
89	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.005	2026-03-08 21:20:49.957346	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
90	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0051	2026-03-08 21:20:49.964768	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
91	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.005	2026-03-08 21:20:49.971498	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
92	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.003	2026-03-08 21:20:49.978487	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
93	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.001	2026-03-08 21:20:49.980644	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
94	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-08 21:20:49.983641	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
95	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.001	2026-03-08 21:20:49.98738	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
96	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.001	2026-03-08 21:20:49.989808	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
97	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.001	2026-03-08 21:20:49.992115	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
98	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0019	2026-03-08 21:20:49.997556	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
99	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.001	2026-03-08 21:20:50.000819	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
100	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.002	2026-03-08 21:20:50.004643	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
101	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C08	C08_DATA_DRIFT	public.balances_source	PASS	0	0.0096	2026-03-08 21:20:50.020054	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
102	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0024	2026-03-08 21:20:50.027648	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
103	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.001	2026-03-08 21:20:50.030381	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
104	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0014	2026-03-08 21:20:50.034369	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
105	e51bb782-3879-4b04-9601-a0d6f5f3474f	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0107	2026-03-08 21:35:59.833307	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
106	e51bb782-3879-4b04-9601-a0d6f5f3474f	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0	2026-03-08 21:35:59.843221	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
107	e51bb782-3879-4b04-9601-a0d6f5f3474f	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0098	2026-03-08 21:35:59.84845	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
108	e51bb782-3879-4b04-9601-a0d6f5f3474f	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0276	2026-03-08 21:35:59.879295	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
109	e51bb782-3879-4b04-9601-a0d6f5f3474f	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0056	2026-03-08 21:35:59.884802	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
110	e51bb782-3879-4b04-9601-a0d6f5f3474f	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0036	2026-03-08 21:35:59.891434	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
111	e51bb782-3879-4b04-9601-a0d6f5f3474f	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0091	2026-03-08 21:35:59.897637	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
112	e51bb782-3879-4b04-9601-a0d6f5f3474f	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0006	2026-03-08 21:35:59.902934	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
113	e51bb782-3879-4b04-9601-a0d6f5f3474f	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0	2026-03-08 21:35:59.906287	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
114	e51bb782-3879-4b04-9601-a0d6f5f3474f	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-08 21:35:59.90917	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
115	e51bb782-3879-4b04-9601-a0d6f5f3474f	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0039	2026-03-08 21:35:59.916087	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
116	e51bb782-3879-4b04-9601-a0d6f5f3474f	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0062	2026-03-08 21:35:59.922517	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
117	e51bb782-3879-4b04-9601-a0d6f5f3474f	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0	2026-03-08 21:35:59.92922	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
118	e51bb782-3879-4b04-9601-a0d6f5f3474f	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.002	2026-03-08 21:35:59.934149	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
119	e51bb782-3879-4b04-9601-a0d6f5f3474f	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0	2026-03-08 21:35:59.936355	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
120	e51bb782-3879-4b04-9601-a0d6f5f3474f	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-08 21:35:59.939128	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
121	e51bb782-3879-4b04-9601-a0d6f5f3474f	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0007	2026-03-08 21:35:59.94351	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
122	e51bb782-3879-4b04-9601-a0d6f5f3474f	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0	2026-03-08 21:35:59.945873	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
123	e51bb782-3879-4b04-9601-a0d6f5f3474f	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0005	2026-03-08 21:35:59.947552	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
124	e51bb782-3879-4b04-9601-a0d6f5f3474f	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0024	2026-03-08 21:35:59.951719	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
125	e51bb782-3879-4b04-9601-a0d6f5f3474f	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0	2026-03-08 21:35:59.953362	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
126	e51bb782-3879-4b04-9601-a0d6f5f3474f	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0022	2026-03-08 21:35:59.957322	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
127	e51bb782-3879-4b04-9601-a0d6f5f3474f	C08	C08_DATA_DRIFT	public.balances_source	PASS	0	0.005	2026-03-08 21:35:59.962991	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
128	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0006	2026-03-08 21:35:59.967509	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
129	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.0	2026-03-08 21:35:59.969353	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
130	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0005	2026-03-08 21:35:59.971652	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
131	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0242	2026-03-08 23:55:36.848236	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
132	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.008	2026-03-08 23:55:36.890117	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
133	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0072	2026-03-08 23:55:36.899733	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
134	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0354	2026-03-08 23:55:36.961919	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
135	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0	2026-03-08 23:55:36.967728	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
136	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0083	2026-03-08 23:55:36.977473	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
137	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0046	2026-03-08 23:55:36.987606	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
138	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0	2026-03-08 23:55:36.992606	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
139	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0	2026-03-08 23:55:36.994665	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
140	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-08 23:55:36.997493	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
141	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.004	2026-03-08 23:55:37.004834	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
142	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.004	2026-03-08 23:55:37.011252	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
143	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0026	2026-03-08 23:55:37.018166	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
144	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.005	2026-03-08 23:55:37.029099	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
145	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0	2026-03-08 23:55:37.032635	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
146	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-08 23:55:37.034626	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
147	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.001	2026-03-08 23:55:37.040729	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
148	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0013	2026-03-08 23:55:37.044737	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
149	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0007	2026-03-08 23:55:37.047566	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
150	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.003	2026-03-08 23:55:37.056438	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
151	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0015	2026-03-08 23:55:37.061023	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
152	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0017	2026-03-08 23:55:37.065898	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
153	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C08	C08_DATA_DRIFT	public.balances_source	PASS	0	0.0055	2026-03-08 23:55:37.077431	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
154	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0078	2026-03-08 23:55:37.090136	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
155	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.001	2026-03-08 23:55:37.093052	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
156	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0	2026-03-08 23:55:37.096178	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
157	8ff1d576-661d-4285-b76c-2822bfa3d610	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0054	2026-03-09 01:16:08.64032	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
158	8ff1d576-661d-4285-b76c-2822bfa3d610	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0071	2026-03-09 01:16:08.650522	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
159	8ff1d576-661d-4285-b76c-2822bfa3d610	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.006	2026-03-09 01:16:08.655187	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
160	8ff1d576-661d-4285-b76c-2822bfa3d610	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0381	2026-03-09 01:16:08.69691	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
161	8ff1d576-661d-4285-b76c-2822bfa3d610	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0	2026-03-09 01:16:08.702496	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
162	8ff1d576-661d-4285-b76c-2822bfa3d610	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.011	2026-03-09 01:16:08.707978	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
163	8ff1d576-661d-4285-b76c-2822bfa3d610	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0042	2026-03-09 01:16:08.714611	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
164	8ff1d576-661d-4285-b76c-2822bfa3d610	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0022	2026-03-09 01:16:08.719521	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
165	8ff1d576-661d-4285-b76c-2822bfa3d610	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.001	2026-03-09 01:16:08.721262	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
166	8ff1d576-661d-4285-b76c-2822bfa3d610	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:16:08.722942	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
167	8ff1d576-661d-4285-b76c-2822bfa3d610	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0063	2026-03-09 01:16:08.730863	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
168	8ff1d576-661d-4285-b76c-2822bfa3d610	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0023	2026-03-09 01:16:08.73742	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
169	8ff1d576-661d-4285-b76c-2822bfa3d610	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0071	2026-03-09 01:16:08.742897	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
170	8ff1d576-661d-4285-b76c-2822bfa3d610	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.0037	2026-03-09 01:16:08.749773	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
171	8ff1d576-661d-4285-b76c-2822bfa3d610	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0013	2026-03-09 01:16:08.752757	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
172	8ff1d576-661d-4285-b76c-2822bfa3d610	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:16:08.755364	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
173	8ff1d576-661d-4285-b76c-2822bfa3d610	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.001	2026-03-09 01:16:08.757919	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
174	8ff1d576-661d-4285-b76c-2822bfa3d610	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0	2026-03-09 01:16:08.760151	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
175	8ff1d576-661d-4285-b76c-2822bfa3d610	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0007	2026-03-09 01:16:08.763501	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
176	8ff1d576-661d-4285-b76c-2822bfa3d610	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0013	2026-03-09 01:16:08.768772	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
177	8ff1d576-661d-4285-b76c-2822bfa3d610	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0008	2026-03-09 01:16:08.772062	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
178	8ff1d576-661d-4285-b76c-2822bfa3d610	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:16:08.774291	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
179	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0025	2026-03-09 01:16:08.785826	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
180	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.001	2026-03-09 01:16:08.788915	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
181	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0	2026-03-09 01:16:08.790645	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
182	451345f3-072d-4272-851f-d1e983eb371f	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0068	2026-03-09 01:24:48.473791	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
183	451345f3-072d-4272-851f-d1e983eb371f	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0038	2026-03-09 01:24:48.494734	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
184	451345f3-072d-4272-851f-d1e983eb371f	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.001	2026-03-09 01:24:48.499914	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
185	451345f3-072d-4272-851f-d1e983eb371f	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0295	2026-03-09 01:24:48.533168	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
186	451345f3-072d-4272-851f-d1e983eb371f	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0053	2026-03-09 01:24:48.540154	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
187	451345f3-072d-4272-851f-d1e983eb371f	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0048	2026-03-09 01:24:48.54777	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
188	451345f3-072d-4272-851f-d1e983eb371f	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.002	2026-03-09 01:24:48.555059	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
189	451345f3-072d-4272-851f-d1e983eb371f	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.001	2026-03-09 01:24:48.560173	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
190	451345f3-072d-4272-851f-d1e983eb371f	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0	2026-03-09 01:24:48.563167	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
191	451345f3-072d-4272-851f-d1e983eb371f	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0007	2026-03-09 01:24:48.565417	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
192	451345f3-072d-4272-851f-d1e983eb371f	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0054	2026-03-09 01:24:48.573173	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
193	451345f3-072d-4272-851f-d1e983eb371f	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0054	2026-03-09 01:24:48.580459	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
194	451345f3-072d-4272-851f-d1e983eb371f	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.005	2026-03-09 01:24:48.587041	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
195	451345f3-072d-4272-851f-d1e983eb371f	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.003	2026-03-09 01:24:48.594157	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
196	451345f3-072d-4272-851f-d1e983eb371f	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.001	2026-03-09 01:24:48.597419	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
197	451345f3-072d-4272-851f-d1e983eb371f	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:24:48.599766	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
198	451345f3-072d-4272-851f-d1e983eb371f	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.002	2026-03-09 01:24:48.603248	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
199	451345f3-072d-4272-851f-d1e983eb371f	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.001	2026-03-09 01:24:48.606226	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
200	451345f3-072d-4272-851f-d1e983eb371f	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.001	2026-03-09 01:24:48.608877	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
201	451345f3-072d-4272-851f-d1e983eb371f	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0017	2026-03-09 01:24:48.614344	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
202	451345f3-072d-4272-851f-d1e983eb371f	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0	2026-03-09 01:24:48.617526	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
203	451345f3-072d-4272-851f-d1e983eb371f	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0015	2026-03-09 01:24:48.620881	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
204	451345f3-072d-4272-851f-d1e983eb371f	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.002	2026-03-09 01:24:48.632504	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
205	451345f3-072d-4272-851f-d1e983eb371f	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.001	2026-03-09 01:24:48.634898	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
206	451345f3-072d-4272-851f-d1e983eb371f	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.001	2026-03-09 01:24:48.637859	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
207	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0061	2026-03-09 01:28:06.147654	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
208	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0038	2026-03-09 01:28:06.157312	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
209	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0033	2026-03-09 01:28:06.164896	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
210	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0359	2026-03-09 01:28:06.208828	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
211	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0	2026-03-09 01:28:06.217585	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
212	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0138	2026-03-09 01:28:06.225045	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
213	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0012	2026-03-09 01:28:06.232501	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
214	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0008	2026-03-09 01:28:06.238641	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
215	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0	2026-03-09 01:28:06.241783	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
216	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.001	2026-03-09 01:28:06.246506	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
217	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0048	2026-03-09 01:28:06.255397	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
218	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0089	2026-03-09 01:28:06.268988	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
219	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0053	2026-03-09 01:28:06.276887	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
220	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.0035	2026-03-09 01:28:06.284611	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
221	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0005	2026-03-09 01:28:06.288129	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
222	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0011	2026-03-09 01:28:06.291901	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
223	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0026	2026-03-09 01:28:06.299529	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
224	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0008	2026-03-09 01:28:06.303393	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
225	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:28:06.306464	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
226	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0014	2026-03-09 01:28:06.314888	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
227	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.001	2026-03-09 01:28:06.318981	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
228	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0011	2026-03-09 01:28:06.323745	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
229	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0062	2026-03-09 01:33:18.571462	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
230	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.0048	2026-03-09 01:33:18.590617	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
231	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0053	2026-03-09 01:33:18.598351	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
232	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0259	2026-03-09 01:33:18.629701	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
233	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0066	2026-03-09 01:33:18.649361	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
234	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0045	2026-03-09 01:33:18.656467	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
235	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.002	2026-03-09 01:33:18.684466	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
236	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0	2026-03-09 01:33:18.690085	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
237	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0021	2026-03-09 01:33:18.693454	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
238	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0006	2026-03-09 01:33:18.699876	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
239	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0067	2026-03-09 01:33:18.710027	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
240	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0048	2026-03-09 01:33:18.720263	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
241	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0056	2026-03-09 01:33:18.731702	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
242	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.0019	2026-03-09 01:33:18.73924	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
243	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0009	2026-03-09 01:33:18.742779	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
244	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:33:18.747555	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
245	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0	2026-03-09 01:33:18.753382	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
246	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0006	2026-03-09 01:33:18.757034	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
247	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0014	2026-03-09 01:33:18.761358	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
248	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0024	2026-03-09 01:33:18.768306	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
249	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0	2026-03-09 01:33:18.771922	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
250	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.001	2026-03-09 01:33:18.776054	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
251	de0157b1-54ae-4d80-8c61-906e150fbd3e	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0038	2026-03-09 01:33:35.087393	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
252	de0157b1-54ae-4d80-8c61-906e150fbd3e	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.002	2026-03-09 01:33:35.092488	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
253	de0157b1-54ae-4d80-8c61-906e150fbd3e	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.004	2026-03-09 01:33:35.099048	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
254	de0157b1-54ae-4d80-8c61-906e150fbd3e	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0264	2026-03-09 01:33:35.139259	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
255	de0157b1-54ae-4d80-8c61-906e150fbd3e	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0072	2026-03-09 01:33:35.147142	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
256	de0157b1-54ae-4d80-8c61-906e150fbd3e	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0048	2026-03-09 01:33:35.154727	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
257	de0157b1-54ae-4d80-8c61-906e150fbd3e	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0019	2026-03-09 01:33:35.160392	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
258	de0157b1-54ae-4d80-8c61-906e150fbd3e	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.0007	2026-03-09 01:33:35.168992	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
259	de0157b1-54ae-4d80-8c61-906e150fbd3e	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0008	2026-03-09 01:33:35.171944	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
260	de0157b1-54ae-4d80-8c61-906e150fbd3e	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:33:35.175094	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
261	de0157b1-54ae-4d80-8c61-906e150fbd3e	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.0046	2026-03-09 01:33:35.18573	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
262	de0157b1-54ae-4d80-8c61-906e150fbd3e	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0069	2026-03-09 01:33:35.19242	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
263	de0157b1-54ae-4d80-8c61-906e150fbd3e	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0062	2026-03-09 01:33:35.200755	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
264	de0157b1-54ae-4d80-8c61-906e150fbd3e	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.002	2026-03-09 01:33:35.207923	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
265	de0157b1-54ae-4d80-8c61-906e150fbd3e	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0022	2026-03-09 01:33:35.212095	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
266	de0157b1-54ae-4d80-8c61-906e150fbd3e	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0011	2026-03-09 01:33:35.215499	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
267	de0157b1-54ae-4d80-8c61-906e150fbd3e	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0	2026-03-09 01:33:35.220275	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
268	de0157b1-54ae-4d80-8c61-906e150fbd3e	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.001	2026-03-09 01:33:35.222979	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
269	de0157b1-54ae-4d80-8c61-906e150fbd3e	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:33:35.22567	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
270	de0157b1-54ae-4d80-8c61-906e150fbd3e	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0023	2026-03-09 01:33:35.232771	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
271	de0157b1-54ae-4d80-8c61-906e150fbd3e	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0012	2026-03-09 01:33:35.237383	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
272	de0157b1-54ae-4d80-8c61-906e150fbd3e	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.0009	2026-03-09 01:33:35.241861	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
273	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0016	2026-03-09 01:33:35.25719	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
274	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.0019	2026-03-09 01:33:35.261345	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
275	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.001	2026-03-09 01:33:35.265427	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
276	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C01	C01_ROWCOUNT	public.accounts_source	PASS	0	0.0044	2026-03-09 01:34:19.215912	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
277	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C01	C01_ROWCOUNT	public.balances_source	PASS	0	0.002	2026-03-09 01:34:19.22272	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
278	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C01	C01_ROWCOUNT	public.customer_accounts_source	PASS	0	0.0052	2026-03-09 01:34:19.230051	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
279	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C010	C010_SCHEMA_DRIFT	public.accounts_source	PASS	0	0.0298	2026-03-09 01:34:19.266533	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
280	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C010	C010_SCHEMA_DRIFT	public.balances_source	PASS	0	0.0072	2026-03-09 01:34:19.273914	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
281	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C010	C010_SCHEMA_DRIFT	public.customer_accounts_source	PASS	0	0.0052	2026-03-09 01:34:19.281752	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
282	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C02	C02_BALANCE_RECON	public.balances_source	PASS	0.0	0.0012	2026-03-09 01:34:19.286579	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
283	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C03	C03_REFERENTIAL	public.accounts_source	PASS	0	0.001	2026-03-09 01:34:19.290772	LOW	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
284	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C03	C03_REFERENTIAL	public.balances_source	PASS	0	0.0	2026-03-09 01:34:19.294747	LOW	7ebdc8d6-4637-47bb-84e4-63828009d50c
285	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C03	C03_REFERENTIAL	public.customer_accounts_source	PASS	0	0.001	2026-03-09 01:34:19.297863	LOW	bfa33f37-27dc-442f-8977-01bb6663b6f4
286	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C04	C04_COLUMN_COUNT	public.accounts_source	PASS	0	0.004	2026-03-09 01:34:19.306071	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
287	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C04	C04_COLUMN_COUNT	public.balances_source	PASS	0	0.0049	2026-03-09 01:34:19.314111	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
288	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C04	C04_COLUMN_COUNT	public.customer_accounts_source	PASS	0	0.0044	2026-03-09 01:34:19.321134	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
289	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C05	C05_NULL_CHECK	public.accounts_source	PASS	0	0.0052	2026-03-09 01:34:19.327173	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
290	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C05	C05_NULL_CHECK	public.balances_source	PASS	0	0.0	2026-03-09 01:34:19.330342	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
291	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C05	C05_NULL_CHECK	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:34:19.333548	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
292	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C06	C06_DATA_TYPE_MATCH	public.accounts_source	PASS	0	0.0	2026-03-09 01:34:19.33713	CRITICAL	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
293	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C06	C06_DATA_TYPE_MATCH	public.balances_source	PASS	0	0.0	2026-03-09 01:34:19.339147	CRITICAL	7ebdc8d6-4637-47bb-84e4-63828009d50c
294	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C06	C06_DATA_TYPE_MATCH	public.customer_accounts_source	PASS	0	0.0	2026-03-09 01:34:19.341498	CRITICAL	bfa33f37-27dc-442f-8977-01bb6663b6f4
295	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C07	C07_DUPLICATE_DETECTION	public.accounts_source	PASS	0	0.0011	2026-03-09 01:34:19.34873	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
296	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C07	C07_DUPLICATE_DETECTION	public.balances_source	PASS	0	0.0017	2026-03-09 01:34:19.352666	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
297	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C07	C07_DUPLICATE_DETECTION	public.customer_accounts_source	PASS	0	0.001	2026-03-09 01:34:19.355623	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
298	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	C09_REFERENTIAL_COVERAGE	public.accounts_source	ERROR	0	0.0029	2026-03-09 01:34:19.367438	HIGH	8ef6caa9-d570-49d4-8a0b-b5210e8feee3
299	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	C09_REFERENTIAL_COVERAGE	public.balances_source	ERROR	0	0.0	2026-03-09 01:34:19.370232	HIGH	7ebdc8d6-4637-47bb-84e4-63828009d50c
300	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	C09_REFERENTIAL_COVERAGE	public.customer_accounts_source	ERROR	0	0.0	2026-03-09 01:34:19.372223	HIGH	bfa33f37-27dc-442f-8977-01bb6663b6f4
\.


--
-- Data for Name: migration_control_execution_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."migration_control_execution_OLD" (execution_id, batch_id, control_id, rule_id, entity_name, status, execution_timestamp) FROM stdin;
\.


--
-- Data for Name: migration_control_summary; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_control_summary (id, batch_id, control_id, overall_status, total_rules, passed_rules, failed_rules, error_rules, created_at) FROM stdin;
1	8780c73b-1267-4424-aa46-478a1f3c0f9e	C01	PASS	3	3	0	0	2026-03-08 17:22:28.335173
2	8780c73b-1267-4424-aa46-478a1f3c0f9e	C010	BLOCKED	3	0	3	0	2026-03-08 17:22:28.391409
3	8780c73b-1267-4424-aa46-478a1f3c0f9e	C02	PASS	3	1	0	0	2026-03-08 17:22:28.400737
4	8780c73b-1267-4424-aa46-478a1f3c0f9e	C03	PASS	3	3	0	0	2026-03-08 17:22:28.412922
5	8780c73b-1267-4424-aa46-478a1f3c0f9e	C04	PASS	3	3	0	0	2026-03-08 17:22:28.438749
6	8780c73b-1267-4424-aa46-478a1f3c0f9e	C05	PASS	3	3	0	0	2026-03-08 17:22:28.45117
7	8780c73b-1267-4424-aa46-478a1f3c0f9e	C06	PASS	3	3	0	0	2026-03-08 17:22:28.462015
8	8780c73b-1267-4424-aa46-478a1f3c0f9e	C07	PASS	3	3	0	0	2026-03-08 17:22:28.476304
9	8780c73b-1267-4424-aa46-478a1f3c0f9e	C08	ERROR	3	0	0	1	2026-03-08 17:22:28.488194
10	8780c73b-1267-4424-aa46-478a1f3c0f9e	C09	ERROR	3	0	0	3	2026-03-08 17:22:28.496893
11	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C01	PASS	3	3	0	0	2026-03-08 20:54:45.034857
12	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C010	BLOCKED	3	0	3	0	2026-03-08 20:54:45.152412
13	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C02	PASS	3	1	0	0	2026-03-08 20:54:45.162013
14	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C03	PASS	3	3	0	0	2026-03-08 20:54:45.171319
15	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C04	PASS	3	3	0	0	2026-03-08 20:54:45.192497
16	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C05	PASS	3	3	0	0	2026-03-08 20:54:45.205876
17	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C06	PASS	3	3	0	0	2026-03-08 20:54:45.215374
18	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C07	PASS	3	3	0	0	2026-03-08 20:54:45.225018
19	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C08	ERROR	3	0	0	1	2026-03-08 20:54:45.237309
20	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	C09	ERROR	3	0	0	3	2026-03-08 20:54:45.248539
21	84ff530c-e881-4531-95b0-4003101ade99	C01	PASS	3	3	0	0	2026-03-08 20:58:38.757484
22	84ff530c-e881-4531-95b0-4003101ade99	C010	PASS	3	3	0	0	2026-03-08 20:58:38.824033
23	84ff530c-e881-4531-95b0-4003101ade99	C02	PASS	3	1	0	0	2026-03-08 20:58:38.835988
24	84ff530c-e881-4531-95b0-4003101ade99	C03	PASS	3	3	0	0	2026-03-08 20:58:38.847938
25	84ff530c-e881-4531-95b0-4003101ade99	C04	PASS	3	3	0	0	2026-03-08 20:58:38.876295
26	84ff530c-e881-4531-95b0-4003101ade99	C05	PASS	3	3	0	0	2026-03-08 20:58:38.891146
27	84ff530c-e881-4531-95b0-4003101ade99	C06	PASS	3	3	0	0	2026-03-08 20:58:38.904402
28	84ff530c-e881-4531-95b0-4003101ade99	C07	PASS	3	3	0	0	2026-03-08 20:58:38.919813
29	84ff530c-e881-4531-95b0-4003101ade99	C08	ERROR	3	0	0	1	2026-03-08 20:58:38.937662
30	84ff530c-e881-4531-95b0-4003101ade99	C09	ERROR	3	0	0	3	2026-03-08 20:58:38.953048
31	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C01	PASS	3	3	0	0	2026-03-08 21:20:49.865799
32	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C010	PASS	3	3	0	0	2026-03-08 21:20:49.931387
33	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C02	PASS	3	1	0	0	2026-03-08 21:20:49.939667
34	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C03	PASS	3	3	0	0	2026-03-08 21:20:49.94936
35	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C04	PASS	3	3	0	0	2026-03-08 21:20:49.972218
36	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C05	PASS	3	3	0	0	2026-03-08 21:20:49.984262
37	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C06	PASS	3	3	0	0	2026-03-08 21:20:49.992799
38	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C07	PASS	3	3	0	0	2026-03-08 21:20:50.005582
39	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C08	PASS	3	1	0	0	2026-03-08 21:20:50.022358
40	2ce7aad7-dd4f-4f37-8f33-7691d291f143	C09	ERROR	3	0	0	3	2026-03-08 21:20:50.035064
41	e51bb782-3879-4b04-9601-a0d6f5f3474f	C01	PASS	3	3	0	0	2026-03-08 21:35:59.849077
42	e51bb782-3879-4b04-9601-a0d6f5f3474f	C010	PASS	3	3	0	0	2026-03-08 21:35:59.892219
43	e51bb782-3879-4b04-9601-a0d6f5f3474f	C02	PASS	3	1	0	0	2026-03-08 21:35:59.899688
44	e51bb782-3879-4b04-9601-a0d6f5f3474f	C03	PASS	3	3	0	0	2026-03-08 21:35:59.910049
45	e51bb782-3879-4b04-9601-a0d6f5f3474f	C04	PASS	3	3	0	0	2026-03-08 21:35:59.930065
46	e51bb782-3879-4b04-9601-a0d6f5f3474f	C05	PASS	3	3	0	0	2026-03-08 21:35:59.939965
47	e51bb782-3879-4b04-9601-a0d6f5f3474f	C06	PASS	3	3	0	0	2026-03-08 21:35:59.947915
48	e51bb782-3879-4b04-9601-a0d6f5f3474f	C07	PASS	3	3	0	0	2026-03-08 21:35:59.958124
49	e51bb782-3879-4b04-9601-a0d6f5f3474f	C08	PASS	3	1	0	0	2026-03-08 21:35:59.96422
50	e51bb782-3879-4b04-9601-a0d6f5f3474f	C09	ERROR	3	0	0	3	2026-03-08 21:35:59.972512
51	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C01	PASS	3	3	0	0	2026-03-08 23:55:36.900464
52	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C010	PASS	3	3	0	0	2026-03-08 23:55:36.978438
53	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C02	PASS	3	1	0	0	2026-03-08 23:55:36.990371
54	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C03	PASS	3	3	0	0	2026-03-08 23:55:36.998276
55	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C04	PASS	3	3	0	0	2026-03-08 23:55:37.019252
56	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C05	PASS	3	3	0	0	2026-03-08 23:55:37.03541
57	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C06	PASS	3	3	0	0	2026-03-08 23:55:37.048822
58	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C07	PASS	3	3	0	0	2026-03-08 23:55:37.066844
59	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C08	PASS	3	1	0	0	2026-03-08 23:55:37.080614
60	323037fc-4fdf-4b96-a46e-2559ae6cdee0	C09	ERROR	3	0	0	3	2026-03-08 23:55:37.09653
61	8ff1d576-661d-4285-b76c-2822bfa3d610	C01	PASS	3	3	0	0	2026-03-09 01:16:08.655673
62	8ff1d576-661d-4285-b76c-2822bfa3d610	C010	PASS	3	3	0	0	2026-03-09 01:16:08.708499
63	8ff1d576-661d-4285-b76c-2822bfa3d610	C02	PASS	3	1	0	0	2026-03-09 01:16:08.716849
64	8ff1d576-661d-4285-b76c-2822bfa3d610	C03	PASS	3	3	0	0	2026-03-09 01:16:08.723819
65	8ff1d576-661d-4285-b76c-2822bfa3d610	C04	PASS	3	3	0	0	2026-03-09 01:16:08.743628
66	8ff1d576-661d-4285-b76c-2822bfa3d610	C05	PASS	3	3	0	0	2026-03-09 01:16:08.755858
67	8ff1d576-661d-4285-b76c-2822bfa3d610	C06	PASS	3	3	0	0	2026-03-09 01:16:08.764274
68	8ff1d576-661d-4285-b76c-2822bfa3d610	C07	PASS	3	3	0	0	2026-03-09 01:16:08.774694
69	8ff1d576-661d-4285-b76c-2822bfa3d610	C08	PASS	3	0	0	0	2026-03-09 01:16:08.780123
70	8ff1d576-661d-4285-b76c-2822bfa3d610	C09	ERROR	3	0	0	3	2026-03-09 01:16:08.791107
71	451345f3-072d-4272-851f-d1e983eb371f	C01	PASS	3	3	0	0	2026-03-09 01:24:48.500571
72	451345f3-072d-4272-851f-d1e983eb371f	C010	PASS	3	3	0	0	2026-03-09 01:24:48.548467
73	451345f3-072d-4272-851f-d1e983eb371f	C02	PASS	3	1	0	0	2026-03-09 01:24:48.556919
74	451345f3-072d-4272-851f-d1e983eb371f	C03	PASS	3	3	0	0	2026-03-09 01:24:48.566022
75	451345f3-072d-4272-851f-d1e983eb371f	C04	PASS	3	3	0	0	2026-03-09 01:24:48.587778
76	451345f3-072d-4272-851f-d1e983eb371f	C05	PASS	3	3	0	0	2026-03-09 01:24:48.600296
77	451345f3-072d-4272-851f-d1e983eb371f	C06	PASS	3	3	0	0	2026-03-09 01:24:48.609513
78	451345f3-072d-4272-851f-d1e983eb371f	C07	PASS	3	3	0	0	2026-03-09 01:24:48.621489
79	451345f3-072d-4272-851f-d1e983eb371f	C08	PASS	3	0	0	0	2026-03-09 01:24:48.62676
80	451345f3-072d-4272-851f-d1e983eb371f	C09	ERROR	3	0	0	3	2026-03-09 01:24:48.638392
81	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C01	PASS	3	3	0	0	2026-03-09 01:28:06.165828
82	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C010	PASS	3	3	0	0	2026-03-09 01:28:06.226129
83	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C02	PASS	3	1	0	0	2026-03-09 01:28:06.234665
84	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C03	PASS	3	3	0	0	2026-03-09 01:28:06.247519
85	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C04	PASS	3	3	0	0	2026-03-09 01:28:06.278273
86	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C05	PASS	3	3	0	0	2026-03-09 01:28:06.293001
87	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C06	PASS	3	3	0	0	2026-03-09 01:28:06.307457
88	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C07	PASS	3	3	0	0	2026-03-09 01:28:06.3247
89	a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	C08	PASS	3	0	0	0	2026-03-09 01:28:06.332953
90	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C01	PASS	3	3	0	0	2026-03-09 01:33:18.599149
91	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C010	PASS	3	3	0	0	2026-03-09 01:33:18.657382
92	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C02	PASS	3	1	0	0	2026-03-09 01:33:18.686813
93	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C03	PASS	3	3	0	0	2026-03-09 01:33:18.700704
94	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C04	PASS	3	3	0	0	2026-03-09 01:33:18.732794
95	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C05	PASS	3	3	0	0	2026-03-09 01:33:18.748638
96	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C06	PASS	3	3	0	0	2026-03-09 01:33:18.762458
97	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C07	PASS	3	3	0	0	2026-03-09 01:33:18.776829
98	a534fdbe-328f-44ba-bbfc-74c961f21d5a	C08	PASS	3	0	0	0	2026-03-09 01:33:18.785037
99	de0157b1-54ae-4d80-8c61-906e150fbd3e	C01	PASS	3	3	0	0	2026-03-09 01:33:35.099889
100	de0157b1-54ae-4d80-8c61-906e150fbd3e	C010	PASS	3	3	0	0	2026-03-09 01:33:35.155776
101	de0157b1-54ae-4d80-8c61-906e150fbd3e	C02	PASS	3	1	0	0	2026-03-09 01:33:35.163872
102	de0157b1-54ae-4d80-8c61-906e150fbd3e	C03	PASS	3	3	0	0	2026-03-09 01:33:35.175952
103	de0157b1-54ae-4d80-8c61-906e150fbd3e	C04	PASS	3	3	0	0	2026-03-09 01:33:35.201824
104	de0157b1-54ae-4d80-8c61-906e150fbd3e	C05	PASS	3	3	0	0	2026-03-09 01:33:35.21644
105	de0157b1-54ae-4d80-8c61-906e150fbd3e	C06	PASS	3	3	0	0	2026-03-09 01:33:35.226502
106	de0157b1-54ae-4d80-8c61-906e150fbd3e	C07	PASS	3	3	0	0	2026-03-09 01:33:35.242592
107	de0157b1-54ae-4d80-8c61-906e150fbd3e	C08	PASS	3	0	0	0	2026-03-09 01:33:35.250935
108	de0157b1-54ae-4d80-8c61-906e150fbd3e	C09	ERROR	3	0	0	3	2026-03-09 01:33:35.266493
109	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C01	PASS	3	3	0	0	2026-03-09 01:34:19.231414
110	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C010	PASS	3	3	0	0	2026-03-09 01:34:19.282405
111	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C02	PASS	3	1	0	0	2026-03-09 01:34:19.287957
112	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C03	PASS	3	3	0	0	2026-03-09 01:34:19.298612
113	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C04	PASS	3	3	0	0	2026-03-09 01:34:19.321793
114	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C05	PASS	3	3	0	0	2026-03-09 01:34:19.334467
115	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C06	PASS	3	3	0	0	2026-03-09 01:34:19.342697
116	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C07	PASS	3	3	0	0	2026-03-09 01:34:19.356109
117	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C08	PASS	3	0	0	0	2026-03-09 01:34:19.362295
118	3935376f-d17f-4cbb-90b8-4bc22e5156e2	C09	ERROR	3	0	0	3	2026-03-09 01:34:19.373039
\.


--
-- Data for Name: migration_exception_register; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_exception_register (exception_id, batch_id, control_id, rule_id, entity_name, primary_key_value, source_value, target_value, variance_value, created_timestamp) FROM stdin;
\.


--
-- Data for Name: migration_release_decision; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_release_decision (id, batch_id, environment, client_name, overall_status, overall_score, gate_result, decision_reason, approved_by, approval_timestamp, created_at) FROM stdin;
1	8780c73b-1267-4424-aa46-478a1f3c0f9e	UNKNOWN	UNSPECIFIED	BLOCKED	67.05	REJECTED	Score 67.05 below threshold 80	SYSTEM	2026-03-08 17:22:28.524176	2026-03-08 17:22:28.524176
2	331f6fb0-77dd-4e33-95dc-e0319c8a7f90	UNKNOWN	UNSPECIFIED	BLOCKED	67.05	REJECTED	Score 67.05 below threshold 80	SYSTEM	2026-03-08 20:54:45.279814	2026-03-08 20:54:45.279814
3	84ff530c-e881-4531-95b0-4003101ade99	UNKNOWN	UNSPECIFIED	ERROR	84.09	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-08 20:58:38.989032	2026-03-08 20:58:38.989032
4	2ce7aad7-dd4f-4f37-8f33-7691d291f143	UNKNOWN	UNSPECIFIED	ERROR	89.77	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-08 21:20:50.068291	2026-03-08 21:20:50.068291
5	e51bb782-3879-4b04-9601-a0d6f5f3474f	UNKNOWN	UNSPECIFIED	ERROR	89.77	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-08 21:35:59.995108	2026-03-08 21:35:59.995108
6	323037fc-4fdf-4b96-a46e-2559ae6cdee0	UNKNOWN	UNSPECIFIED	ERROR	89.77	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-08 23:55:37.172305	2026-03-08 23:55:37.172305
7	8ff1d576-661d-4285-b76c-2822bfa3d610	UNKNOWN	UNSPECIFIED	ERROR	89.16	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-09 01:16:08.814818	2026-03-09 01:16:08.814818
8	451345f3-072d-4272-851f-d1e983eb371f	UNKNOWN	UNSPECIFIED	ERROR	89.16	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-09 01:24:48.658607	2026-03-09 01:24:48.658607
9	de0157b1-54ae-4d80-8c61-906e150fbd3e	UNKNOWN	UNSPECIFIED	ERROR	89.16	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-09 01:33:35.285218	2026-03-09 01:33:35.285218
10	3935376f-d17f-4cbb-90b8-4bc22e5156e2	UNKNOWN	UNSPECIFIED	ERROR	89.16	REJECTED	Blocked due to batch status: ERROR	SYSTEM	2026-03-09 01:34:19.389199	2026-03-09 01:34:19.389199
\.


--
-- Data for Name: migration_validation_batch; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.migration_validation_batch (batch_id, execution_start, execution_end, overall_status, overall_score, project_id) FROM stdin;
8780c73b-1267-4424-aa46-478a1f3c0f9e	2026-03-08 17:22:28.25117	2026-03-08 17:22:28.504916	BLOCKED	67.05	ae40b96c-20da-4972-bb29-bff3c2451ae0
331f6fb0-77dd-4e33-95dc-e0319c8a7f90	2026-03-08 20:54:44.894524	2026-03-08 20:54:45.257567	BLOCKED	67.05	ae40b96c-20da-4972-bb29-bff3c2451ae0
84ff530c-e881-4531-95b0-4003101ade99	2026-03-08 20:58:38.613547	2026-03-08 20:58:38.963551	ERROR	84.09	ae40b96c-20da-4972-bb29-bff3c2451ae0
2ce7aad7-dd4f-4f37-8f33-7691d291f143	2026-03-08 21:20:49.72929	2026-03-08 21:20:50.045689	ERROR	89.77	ae40b96c-20da-4972-bb29-bff3c2451ae0
e51bb782-3879-4b04-9601-a0d6f5f3474f	2026-03-08 21:35:59.775607	2026-03-08 21:35:59.978386	ERROR	89.77	ae40b96c-20da-4972-bb29-bff3c2451ae0
3cd4358d-6db0-467e-91e8-c0d8cf37add8	2026-03-08 23:23:30.74106	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
c3935d81-358b-4e3c-974b-08a8e4b7efdc	2026-03-08 23:23:44.848388	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
2e2f7e8c-4ad5-4ba4-9028-2610279cb994	2026-03-08 23:24:04.797459	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
017e9f28-f707-42d9-a6a5-7a949e6c5302	2026-03-08 23:25:15.559847	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
4c4a97f3-1492-4094-b2b4-01485c10226f	2026-03-08 23:27:57.353451	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
323037fc-4fdf-4b96-a46e-2559ae6cdee0	2026-03-08 23:55:36.683426	2026-03-08 23:55:37.13404	ERROR	89.77	ae40b96c-20da-4972-bb29-bff3c2451ae0
8ff1d576-661d-4285-b76c-2822bfa3d610	2026-03-09 01:16:08.580089	2026-03-09 01:16:08.799885	ERROR	89.16	ae40b96c-20da-4972-bb29-bff3c2451ae0
451345f3-072d-4272-851f-d1e983eb371f	2026-03-09 01:24:48.41472	2026-03-09 01:24:48.646042	ERROR	89.16	ae40b96c-20da-4972-bb29-bff3c2451ae0
a89b2066-ce5f-400b-8f34-ad6b6d4fa9f9	2026-03-09 01:28:06.084522	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
a534fdbe-328f-44ba-bbfc-74c961f21d5a	2026-03-09 01:33:18.515107	\N	RUNNING	\N	ae40b96c-20da-4972-bb29-bff3c2451ae0
de0157b1-54ae-4d80-8c61-906e150fbd3e	2026-03-09 01:33:35.039485	2026-03-09 01:33:35.27483	ERROR	89.16	ae40b96c-20da-4972-bb29-bff3c2451ae0
3935376f-d17f-4cbb-90b8-4bc22e5156e2	2026-03-09 01:34:19.169557	2026-03-09 01:34:19.380984	ERROR	89.16	ae40b96c-20da-4972-bb29-bff3c2451ae0
\.


--
-- Data for Name: projects_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."projects_OLD" (project_id, tenant_id, project_name, project_type, created_at) FROM stdin;
\.


--
-- Data for Name: rule_anomaly_history; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.rule_anomaly_history (id, dataset_name, rule_code, anomaly_score, anomaly_type, created_at) FROM stdin;
\.


--
-- Data for Name: rule_execution_statistics; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.rule_execution_statistics (id, batch_id, rule_code, dataset_name, execution_time_ms, rows_checked, rows_failed, created_at) FROM stdin;
\.


--
-- Data for Name: rule_parameter_metadata_legacy; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.rule_parameter_metadata_legacy (id, rule_id, entity_name, source_schema, source_table, target_schema, target_table, primary_key_column, filter_condition, tolerance_value, active, created_at, numeric_column) FROM stdin;
1	C01_ROWCOUNT	accounts	public	accounts_source	public	accounts_target	account_id	\N	0	t	2026-02-16 20:14:21.607877	\N
3	C03_REFERENTIAL	customer_accounts	public	customer_accounts_source	public	customer_accounts_target	account_id	\N	0	t	2026-02-16 20:14:42.375442	\N
2	C02_BALANCE_RECON	balances	public	balances_source	public	balances_target	account_id	\N	0	t	2026-02-16 20:14:32.878207	balance
\.


--
-- Data for Name: rule_registry; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.rule_registry (rule_id, control_id, rule_name, sql_template_file, severity_level, enabled_flag, created_at, rule_type, rule_scope) FROM stdin;
C01_ROWCOUNT	C01	Row Count Match Validation	C01_row_count.sql	HIGH	t	2026-02-16 20:08:52.359834	ROW_COUNT	TABLE
C03_REFERENTIAL	C03	Foreign Key Relationship Preservation	C03_referential_integrity.sql	LOW	t	2026-02-16 20:08:52.359834	REFERENTIAL_CHECK	TABLE
C04_COLUMN_COUNT	C04	Column Count Match	C04_column_count.sql	HIGH	t	2026-03-02 10:25:16.877224	STRUCTURE	TABLE
C05_NULL_CHECK	C05	Null Value Drift	C05_null_check.sql	HIGH	t	2026-03-02 10:25:16.877224	QUALITY	COLUMN
C06_DATA_TYPE_MATCH	C06	Duplicate Primary Key Check	C06_duplicate_check.sql	CRITICAL	t	2026-03-02 10:25:16.877224	QUALITY	COLUMN
C02_BALANCE_RECON	C02	Financial Aggregate Reconciliation	C02_financial_reconciliation.sql	CRITICAL	t	2026-02-16 20:08:52.359834	SUM_COMPARE	TABLE
C07_DATA_TYPE_MATCH_OLD_OLD	C07	Data Type Consistency	C07_data_type_check.sql	HIGH	f	2026-03-02 10:25:16.877224	STRUCTURE	COLUMN
C07_DUPLICATE_DETECTION	C07	Duplicate Detection Validation	C07_duplicate_detection_rule.py	HIGH	t	2026-03-08 03:18:14.737087	DATA_QUALITY	TABLE
C08_DATA_DRIFT	C08	Numeric Data Drift Detection	C08_data_drift_detection_rule.py	CRITICAL	t	2026-03-08 09:12:36.774168	DATA_QUALITY	TABLE
C09_REFERENTIAL_COVERAGE	C09	Referential Coverage Validation	C09_referential_coverage_rule.py	HIGH	t	2026-03-08 09:40:00.037794	DATA_QUALITY	TABLE
C010_SCHEMA_DRIFT	C010	Schema Drift Detection	C010_schema_drift_rule.py	CRITICAL	t	2026-03-08 10:37:09.588228	SCHEMA_VALIDATION	TABLE
\.


--
-- Data for Name: rule_weight_config; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.rule_weight_config (rule_id, weight_score, severity_level) FROM stdin;
\.


--
-- Data for Name: rule_weights; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine.rule_weights (rule_id, weight) FROM stdin;
C01_ROWCOUNT	20
C02_BALANCE_RECON	30
C03_REFERENTIAL	25
C04_COLUMN_COUNT	10
C05_NULL_CHECK	10
C06_DATA_TYPE_MATCH	5
\.


--
-- Data for Name: system_registry_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."system_registry_OLD" (system_id, tenant_id, system_name, system_type, connection_config, created_at) FROM stdin;
\.


--
-- Data for Name: tenants_OLD; Type: TABLE DATA; Schema: engine; Owner: postgres
--

COPY engine."tenants_OLD" (tenant_id, tenant_name, created_at) FROM stdin;
\.


--
-- Data for Name: batch_intelligence; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.batch_intelligence (batch_id, rolling_window_size, avg_score_last_n, stability_score, risk_heat_index, repeat_failure_index, execution_time_zscore, anomaly_score, anomaly_flag, auto_blocked, created_at) FROM stdin;
\.


--
-- Data for Name: batch_runs; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.batch_runs (batch_id, project_id, execution_start, execution_end, overall_status, overall_score, created_at) FROM stdin;
\.


--
-- Data for Name: column_mappings; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.column_mappings (column_mapping_id, mapping_id, source_column_id, target_column_id, transformation_rule, created_at) FROM stdin;
\.


--
-- Data for Name: control_executions; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.control_executions (execution_id, batch_id, mapping_id, control_id, execution_status, delta_value, execution_time_seconds, severity_level, created_at) FROM stdin;
\.


--
-- Data for Name: dataset_columns; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.dataset_columns (column_id, dataset_id, column_name, data_type, created_at) FROM stdin;
\.


--
-- Data for Name: dataset_mappings; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.dataset_mappings (mapping_id, project_id, source_dataset_id, target_dataset_id, created_at) FROM stdin;
\.


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.datasets (dataset_id, system_id, schema_name, dataset_name, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.projects (project_id, tenant_id, project_name, project_type, created_at) FROM stdin;
\.


--
-- Data for Name: systems; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.systems (system_id, tenant_id, system_name, system_type, connection_config, created_at) FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: engine_v14; Owner: postgres
--

COPY engine_v14.tenants (tenant_id, tenant_name, created_at) FROM stdin;
\.


--
-- Data for Name: dim_date; Type: TABLE DATA; Schema: reporting; Owner: postgres
--

COPY reporting.dim_date (date_value, year, month, day, year_month, quarter) FROM stdin;
2025-01-01	2025	1	1	2025-01	1
2025-01-02	2025	1	2	2025-01	1
2025-01-03	2025	1	3	2025-01	1
2025-01-04	2025	1	4	2025-01	1
2025-01-05	2025	1	5	2025-01	1
2025-01-06	2025	1	6	2025-01	1
2025-01-07	2025	1	7	2025-01	1
2025-01-08	2025	1	8	2025-01	1
2025-01-09	2025	1	9	2025-01	1
2025-01-10	2025	1	10	2025-01	1
2025-01-11	2025	1	11	2025-01	1
2025-01-12	2025	1	12	2025-01	1
2025-01-13	2025	1	13	2025-01	1
2025-01-14	2025	1	14	2025-01	1
2025-01-15	2025	1	15	2025-01	1
2025-01-16	2025	1	16	2025-01	1
2025-01-17	2025	1	17	2025-01	1
2025-01-18	2025	1	18	2025-01	1
2025-01-19	2025	1	19	2025-01	1
2025-01-20	2025	1	20	2025-01	1
2025-01-21	2025	1	21	2025-01	1
2025-01-22	2025	1	22	2025-01	1
2025-01-23	2025	1	23	2025-01	1
2025-01-24	2025	1	24	2025-01	1
2025-01-25	2025	1	25	2025-01	1
2025-01-26	2025	1	26	2025-01	1
2025-01-27	2025	1	27	2025-01	1
2025-01-28	2025	1	28	2025-01	1
2025-01-29	2025	1	29	2025-01	1
2025-01-30	2025	1	30	2025-01	1
2025-01-31	2025	1	31	2025-01	1
2025-02-01	2025	2	1	2025-02	1
2025-02-02	2025	2	2	2025-02	1
2025-02-03	2025	2	3	2025-02	1
2025-02-04	2025	2	4	2025-02	1
2025-02-05	2025	2	5	2025-02	1
2025-02-06	2025	2	6	2025-02	1
2025-02-07	2025	2	7	2025-02	1
2025-02-08	2025	2	8	2025-02	1
2025-02-09	2025	2	9	2025-02	1
2025-02-10	2025	2	10	2025-02	1
2025-02-11	2025	2	11	2025-02	1
2025-02-12	2025	2	12	2025-02	1
2025-02-13	2025	2	13	2025-02	1
2025-02-14	2025	2	14	2025-02	1
2025-02-15	2025	2	15	2025-02	1
2025-02-16	2025	2	16	2025-02	1
2025-02-17	2025	2	17	2025-02	1
2025-02-18	2025	2	18	2025-02	1
2025-02-19	2025	2	19	2025-02	1
2025-02-20	2025	2	20	2025-02	1
2025-02-21	2025	2	21	2025-02	1
2025-02-22	2025	2	22	2025-02	1
2025-02-23	2025	2	23	2025-02	1
2025-02-24	2025	2	24	2025-02	1
2025-02-25	2025	2	25	2025-02	1
2025-02-26	2025	2	26	2025-02	1
2025-02-27	2025	2	27	2025-02	1
2025-02-28	2025	2	28	2025-02	1
2025-03-01	2025	3	1	2025-03	1
2025-03-02	2025	3	2	2025-03	1
2025-03-03	2025	3	3	2025-03	1
2025-03-04	2025	3	4	2025-03	1
2025-03-05	2025	3	5	2025-03	1
2025-03-06	2025	3	6	2025-03	1
2025-03-07	2025	3	7	2025-03	1
2025-03-08	2025	3	8	2025-03	1
2025-03-09	2025	3	9	2025-03	1
2025-03-10	2025	3	10	2025-03	1
2025-03-11	2025	3	11	2025-03	1
2025-03-12	2025	3	12	2025-03	1
2025-03-13	2025	3	13	2025-03	1
2025-03-14	2025	3	14	2025-03	1
2025-03-15	2025	3	15	2025-03	1
2025-03-16	2025	3	16	2025-03	1
2025-03-17	2025	3	17	2025-03	1
2025-03-18	2025	3	18	2025-03	1
2025-03-19	2025	3	19	2025-03	1
2025-03-20	2025	3	20	2025-03	1
2025-03-21	2025	3	21	2025-03	1
2025-03-22	2025	3	22	2025-03	1
2025-03-23	2025	3	23	2025-03	1
2025-03-24	2025	3	24	2025-03	1
2025-03-25	2025	3	25	2025-03	1
2025-03-26	2025	3	26	2025-03	1
2025-03-27	2025	3	27	2025-03	1
2025-03-28	2025	3	28	2025-03	1
2025-03-29	2025	3	29	2025-03	1
2025-03-30	2025	3	30	2025-03	1
2025-03-31	2025	3	31	2025-03	1
2025-04-01	2025	4	1	2025-04	2
2025-04-02	2025	4	2	2025-04	2
2025-04-03	2025	4	3	2025-04	2
2025-04-04	2025	4	4	2025-04	2
2025-04-05	2025	4	5	2025-04	2
2025-04-06	2025	4	6	2025-04	2
2025-04-07	2025	4	7	2025-04	2
2025-04-08	2025	4	8	2025-04	2
2025-04-09	2025	4	9	2025-04	2
2025-04-10	2025	4	10	2025-04	2
2025-04-11	2025	4	11	2025-04	2
2025-04-12	2025	4	12	2025-04	2
2025-04-13	2025	4	13	2025-04	2
2025-04-14	2025	4	14	2025-04	2
2025-04-15	2025	4	15	2025-04	2
2025-04-16	2025	4	16	2025-04	2
2025-04-17	2025	4	17	2025-04	2
2025-04-18	2025	4	18	2025-04	2
2025-04-19	2025	4	19	2025-04	2
2025-04-20	2025	4	20	2025-04	2
2025-04-21	2025	4	21	2025-04	2
2025-04-22	2025	4	22	2025-04	2
2025-04-23	2025	4	23	2025-04	2
2025-04-24	2025	4	24	2025-04	2
2025-04-25	2025	4	25	2025-04	2
2025-04-26	2025	4	26	2025-04	2
2025-04-27	2025	4	27	2025-04	2
2025-04-28	2025	4	28	2025-04	2
2025-04-29	2025	4	29	2025-04	2
2025-04-30	2025	4	30	2025-04	2
2025-05-01	2025	5	1	2025-05	2
2025-05-02	2025	5	2	2025-05	2
2025-05-03	2025	5	3	2025-05	2
2025-05-04	2025	5	4	2025-05	2
2025-05-05	2025	5	5	2025-05	2
2025-05-06	2025	5	6	2025-05	2
2025-05-07	2025	5	7	2025-05	2
2025-05-08	2025	5	8	2025-05	2
2025-05-09	2025	5	9	2025-05	2
2025-05-10	2025	5	10	2025-05	2
2025-05-11	2025	5	11	2025-05	2
2025-05-12	2025	5	12	2025-05	2
2025-05-13	2025	5	13	2025-05	2
2025-05-14	2025	5	14	2025-05	2
2025-05-15	2025	5	15	2025-05	2
2025-05-16	2025	5	16	2025-05	2
2025-05-17	2025	5	17	2025-05	2
2025-05-18	2025	5	18	2025-05	2
2025-05-19	2025	5	19	2025-05	2
2025-05-20	2025	5	20	2025-05	2
2025-05-21	2025	5	21	2025-05	2
2025-05-22	2025	5	22	2025-05	2
2025-05-23	2025	5	23	2025-05	2
2025-05-24	2025	5	24	2025-05	2
2025-05-25	2025	5	25	2025-05	2
2025-05-26	2025	5	26	2025-05	2
2025-05-27	2025	5	27	2025-05	2
2025-05-28	2025	5	28	2025-05	2
2025-05-29	2025	5	29	2025-05	2
2025-05-30	2025	5	30	2025-05	2
2025-05-31	2025	5	31	2025-05	2
2025-06-01	2025	6	1	2025-06	2
2025-06-02	2025	6	2	2025-06	2
2025-06-03	2025	6	3	2025-06	2
2025-06-04	2025	6	4	2025-06	2
2025-06-05	2025	6	5	2025-06	2
2025-06-06	2025	6	6	2025-06	2
2025-06-07	2025	6	7	2025-06	2
2025-06-08	2025	6	8	2025-06	2
2025-06-09	2025	6	9	2025-06	2
2025-06-10	2025	6	10	2025-06	2
2025-06-11	2025	6	11	2025-06	2
2025-06-12	2025	6	12	2025-06	2
2025-06-13	2025	6	13	2025-06	2
2025-06-14	2025	6	14	2025-06	2
2025-06-15	2025	6	15	2025-06	2
2025-06-16	2025	6	16	2025-06	2
2025-06-17	2025	6	17	2025-06	2
2025-06-18	2025	6	18	2025-06	2
2025-06-19	2025	6	19	2025-06	2
2025-06-20	2025	6	20	2025-06	2
2025-06-21	2025	6	21	2025-06	2
2025-06-22	2025	6	22	2025-06	2
2025-06-23	2025	6	23	2025-06	2
2025-06-24	2025	6	24	2025-06	2
2025-06-25	2025	6	25	2025-06	2
2025-06-26	2025	6	26	2025-06	2
2025-06-27	2025	6	27	2025-06	2
2025-06-28	2025	6	28	2025-06	2
2025-06-29	2025	6	29	2025-06	2
2025-06-30	2025	6	30	2025-06	2
2025-07-01	2025	7	1	2025-07	3
2025-07-02	2025	7	2	2025-07	3
2025-07-03	2025	7	3	2025-07	3
2025-07-04	2025	7	4	2025-07	3
2025-07-05	2025	7	5	2025-07	3
2025-07-06	2025	7	6	2025-07	3
2025-07-07	2025	7	7	2025-07	3
2025-07-08	2025	7	8	2025-07	3
2025-07-09	2025	7	9	2025-07	3
2025-07-10	2025	7	10	2025-07	3
2025-07-11	2025	7	11	2025-07	3
2025-07-12	2025	7	12	2025-07	3
2025-07-13	2025	7	13	2025-07	3
2025-07-14	2025	7	14	2025-07	3
2025-07-15	2025	7	15	2025-07	3
2025-07-16	2025	7	16	2025-07	3
2025-07-17	2025	7	17	2025-07	3
2025-07-18	2025	7	18	2025-07	3
2025-07-19	2025	7	19	2025-07	3
2025-07-20	2025	7	20	2025-07	3
2025-07-21	2025	7	21	2025-07	3
2025-07-22	2025	7	22	2025-07	3
2025-07-23	2025	7	23	2025-07	3
2025-07-24	2025	7	24	2025-07	3
2025-07-25	2025	7	25	2025-07	3
2025-07-26	2025	7	26	2025-07	3
2025-07-27	2025	7	27	2025-07	3
2025-07-28	2025	7	28	2025-07	3
2025-07-29	2025	7	29	2025-07	3
2025-07-30	2025	7	30	2025-07	3
2025-07-31	2025	7	31	2025-07	3
2025-08-01	2025	8	1	2025-08	3
2025-08-02	2025	8	2	2025-08	3
2025-08-03	2025	8	3	2025-08	3
2025-08-04	2025	8	4	2025-08	3
2025-08-05	2025	8	5	2025-08	3
2025-08-06	2025	8	6	2025-08	3
2025-08-07	2025	8	7	2025-08	3
2025-08-08	2025	8	8	2025-08	3
2025-08-09	2025	8	9	2025-08	3
2025-08-10	2025	8	10	2025-08	3
2025-08-11	2025	8	11	2025-08	3
2025-08-12	2025	8	12	2025-08	3
2025-08-13	2025	8	13	2025-08	3
2025-08-14	2025	8	14	2025-08	3
2025-08-15	2025	8	15	2025-08	3
2025-08-16	2025	8	16	2025-08	3
2025-08-17	2025	8	17	2025-08	3
2025-08-18	2025	8	18	2025-08	3
2025-08-19	2025	8	19	2025-08	3
2025-08-20	2025	8	20	2025-08	3
2025-08-21	2025	8	21	2025-08	3
2025-08-22	2025	8	22	2025-08	3
2025-08-23	2025	8	23	2025-08	3
2025-08-24	2025	8	24	2025-08	3
2025-08-25	2025	8	25	2025-08	3
2025-08-26	2025	8	26	2025-08	3
2025-08-27	2025	8	27	2025-08	3
2025-08-28	2025	8	28	2025-08	3
2025-08-29	2025	8	29	2025-08	3
2025-08-30	2025	8	30	2025-08	3
2025-08-31	2025	8	31	2025-08	3
2025-09-01	2025	9	1	2025-09	3
2025-09-02	2025	9	2	2025-09	3
2025-09-03	2025	9	3	2025-09	3
2025-09-04	2025	9	4	2025-09	3
2025-09-05	2025	9	5	2025-09	3
2025-09-06	2025	9	6	2025-09	3
2025-09-07	2025	9	7	2025-09	3
2025-09-08	2025	9	8	2025-09	3
2025-09-09	2025	9	9	2025-09	3
2025-09-10	2025	9	10	2025-09	3
2025-09-11	2025	9	11	2025-09	3
2025-09-12	2025	9	12	2025-09	3
2025-09-13	2025	9	13	2025-09	3
2025-09-14	2025	9	14	2025-09	3
2025-09-15	2025	9	15	2025-09	3
2025-09-16	2025	9	16	2025-09	3
2025-09-17	2025	9	17	2025-09	3
2025-09-18	2025	9	18	2025-09	3
2025-09-19	2025	9	19	2025-09	3
2025-09-20	2025	9	20	2025-09	3
2025-09-21	2025	9	21	2025-09	3
2025-09-22	2025	9	22	2025-09	3
2025-09-23	2025	9	23	2025-09	3
2025-09-24	2025	9	24	2025-09	3
2025-09-25	2025	9	25	2025-09	3
2025-09-26	2025	9	26	2025-09	3
2025-09-27	2025	9	27	2025-09	3
2025-09-28	2025	9	28	2025-09	3
2025-09-29	2025	9	29	2025-09	3
2025-09-30	2025	9	30	2025-09	3
2025-10-01	2025	10	1	2025-10	4
2025-10-02	2025	10	2	2025-10	4
2025-10-03	2025	10	3	2025-10	4
2025-10-04	2025	10	4	2025-10	4
2025-10-05	2025	10	5	2025-10	4
2025-10-06	2025	10	6	2025-10	4
2025-10-07	2025	10	7	2025-10	4
2025-10-08	2025	10	8	2025-10	4
2025-10-09	2025	10	9	2025-10	4
2025-10-10	2025	10	10	2025-10	4
2025-10-11	2025	10	11	2025-10	4
2025-10-12	2025	10	12	2025-10	4
2025-10-13	2025	10	13	2025-10	4
2025-10-14	2025	10	14	2025-10	4
2025-10-15	2025	10	15	2025-10	4
2025-10-16	2025	10	16	2025-10	4
2025-10-17	2025	10	17	2025-10	4
2025-10-18	2025	10	18	2025-10	4
2025-10-19	2025	10	19	2025-10	4
2025-10-20	2025	10	20	2025-10	4
2025-10-21	2025	10	21	2025-10	4
2025-10-22	2025	10	22	2025-10	4
2025-10-23	2025	10	23	2025-10	4
2025-10-24	2025	10	24	2025-10	4
2025-10-25	2025	10	25	2025-10	4
2025-10-26	2025	10	26	2025-10	4
2025-10-27	2025	10	27	2025-10	4
2025-10-28	2025	10	28	2025-10	4
2025-10-29	2025	10	29	2025-10	4
2025-10-30	2025	10	30	2025-10	4
2025-10-31	2025	10	31	2025-10	4
2025-11-01	2025	11	1	2025-11	4
2025-11-02	2025	11	2	2025-11	4
2025-11-03	2025	11	3	2025-11	4
2025-11-04	2025	11	4	2025-11	4
2025-11-05	2025	11	5	2025-11	4
2025-11-06	2025	11	6	2025-11	4
2025-11-07	2025	11	7	2025-11	4
2025-11-08	2025	11	8	2025-11	4
2025-11-09	2025	11	9	2025-11	4
2025-11-10	2025	11	10	2025-11	4
2025-11-11	2025	11	11	2025-11	4
2025-11-12	2025	11	12	2025-11	4
2025-11-13	2025	11	13	2025-11	4
2025-11-14	2025	11	14	2025-11	4
2025-11-15	2025	11	15	2025-11	4
2025-11-16	2025	11	16	2025-11	4
2025-11-17	2025	11	17	2025-11	4
2025-11-18	2025	11	18	2025-11	4
2025-11-19	2025	11	19	2025-11	4
2025-11-20	2025	11	20	2025-11	4
2025-11-21	2025	11	21	2025-11	4
2025-11-22	2025	11	22	2025-11	4
2025-11-23	2025	11	23	2025-11	4
2025-11-24	2025	11	24	2025-11	4
2025-11-25	2025	11	25	2025-11	4
2025-11-26	2025	11	26	2025-11	4
2025-11-27	2025	11	27	2025-11	4
2025-11-28	2025	11	28	2025-11	4
2025-11-29	2025	11	29	2025-11	4
2025-11-30	2025	11	30	2025-11	4
2025-12-01	2025	12	1	2025-12	4
2025-12-02	2025	12	2	2025-12	4
2025-12-03	2025	12	3	2025-12	4
2025-12-04	2025	12	4	2025-12	4
2025-12-05	2025	12	5	2025-12	4
2025-12-06	2025	12	6	2025-12	4
2025-12-07	2025	12	7	2025-12	4
2025-12-08	2025	12	8	2025-12	4
2025-12-09	2025	12	9	2025-12	4
2025-12-10	2025	12	10	2025-12	4
2025-12-11	2025	12	11	2025-12	4
2025-12-12	2025	12	12	2025-12	4
2025-12-13	2025	12	13	2025-12	4
2025-12-14	2025	12	14	2025-12	4
2025-12-15	2025	12	15	2025-12	4
2025-12-16	2025	12	16	2025-12	4
2025-12-17	2025	12	17	2025-12	4
2025-12-18	2025	12	18	2025-12	4
2025-12-19	2025	12	19	2025-12	4
2025-12-20	2025	12	20	2025-12	4
2025-12-21	2025	12	21	2025-12	4
2025-12-22	2025	12	22	2025-12	4
2025-12-23	2025	12	23	2025-12	4
2025-12-24	2025	12	24	2025-12	4
2025-12-25	2025	12	25	2025-12	4
2025-12-26	2025	12	26	2025-12	4
2025-12-27	2025	12	27	2025-12	4
2025-12-28	2025	12	28	2025-12	4
2025-12-29	2025	12	29	2025-12	4
2025-12-30	2025	12	30	2025-12	4
2025-12-31	2025	12	31	2025-12	4
2026-01-01	2026	1	1	2026-01	1
2026-01-02	2026	1	2	2026-01	1
2026-01-03	2026	1	3	2026-01	1
2026-01-04	2026	1	4	2026-01	1
2026-01-05	2026	1	5	2026-01	1
2026-01-06	2026	1	6	2026-01	1
2026-01-07	2026	1	7	2026-01	1
2026-01-08	2026	1	8	2026-01	1
2026-01-09	2026	1	9	2026-01	1
2026-01-10	2026	1	10	2026-01	1
2026-01-11	2026	1	11	2026-01	1
2026-01-12	2026	1	12	2026-01	1
2026-01-13	2026	1	13	2026-01	1
2026-01-14	2026	1	14	2026-01	1
2026-01-15	2026	1	15	2026-01	1
2026-01-16	2026	1	16	2026-01	1
2026-01-17	2026	1	17	2026-01	1
2026-01-18	2026	1	18	2026-01	1
2026-01-19	2026	1	19	2026-01	1
2026-01-20	2026	1	20	2026-01	1
2026-01-21	2026	1	21	2026-01	1
2026-01-22	2026	1	22	2026-01	1
2026-01-23	2026	1	23	2026-01	1
2026-01-24	2026	1	24	2026-01	1
2026-01-25	2026	1	25	2026-01	1
2026-01-26	2026	1	26	2026-01	1
2026-01-27	2026	1	27	2026-01	1
2026-01-28	2026	1	28	2026-01	1
2026-01-29	2026	1	29	2026-01	1
2026-01-30	2026	1	30	2026-01	1
2026-01-31	2026	1	31	2026-01	1
2026-02-01	2026	2	1	2026-02	1
2026-02-02	2026	2	2	2026-02	1
2026-02-03	2026	2	3	2026-02	1
2026-02-04	2026	2	4	2026-02	1
2026-02-05	2026	2	5	2026-02	1
2026-02-06	2026	2	6	2026-02	1
2026-02-07	2026	2	7	2026-02	1
2026-02-08	2026	2	8	2026-02	1
2026-02-09	2026	2	9	2026-02	1
2026-02-10	2026	2	10	2026-02	1
2026-02-11	2026	2	11	2026-02	1
2026-02-12	2026	2	12	2026-02	1
2026-02-13	2026	2	13	2026-02	1
2026-02-14	2026	2	14	2026-02	1
2026-02-15	2026	2	15	2026-02	1
2026-02-16	2026	2	16	2026-02	1
2026-02-17	2026	2	17	2026-02	1
2026-02-18	2026	2	18	2026-02	1
2026-02-19	2026	2	19	2026-02	1
2026-02-20	2026	2	20	2026-02	1
2026-02-21	2026	2	21	2026-02	1
2026-02-22	2026	2	22	2026-02	1
2026-02-23	2026	2	23	2026-02	1
2026-02-24	2026	2	24	2026-02	1
2026-02-25	2026	2	25	2026-02	1
2026-02-26	2026	2	26	2026-02	1
2026-02-27	2026	2	27	2026-02	1
2026-02-28	2026	2	28	2026-02	1
2026-03-01	2026	3	1	2026-03	1
2026-03-02	2026	3	2	2026-03	1
2026-03-03	2026	3	3	2026-03	1
2026-03-04	2026	3	4	2026-03	1
2026-03-05	2026	3	5	2026-03	1
2026-03-06	2026	3	6	2026-03	1
2026-03-07	2026	3	7	2026-03	1
2026-03-08	2026	3	8	2026-03	1
2026-03-09	2026	3	9	2026-03	1
2026-03-10	2026	3	10	2026-03	1
2026-03-11	2026	3	11	2026-03	1
2026-03-12	2026	3	12	2026-03	1
2026-03-13	2026	3	13	2026-03	1
2026-03-14	2026	3	14	2026-03	1
2026-03-15	2026	3	15	2026-03	1
2026-03-16	2026	3	16	2026-03	1
2026-03-17	2026	3	17	2026-03	1
2026-03-18	2026	3	18	2026-03	1
2026-03-19	2026	3	19	2026-03	1
2026-03-20	2026	3	20	2026-03	1
2026-03-21	2026	3	21	2026-03	1
2026-03-22	2026	3	22	2026-03	1
2026-03-23	2026	3	23	2026-03	1
2026-03-24	2026	3	24	2026-03	1
2026-03-25	2026	3	25	2026-03	1
2026-03-26	2026	3	26	2026-03	1
2026-03-27	2026	3	27	2026-03	1
2026-03-28	2026	3	28	2026-03	1
2026-03-29	2026	3	29	2026-03	1
2026-03-30	2026	3	30	2026-03	1
2026-03-31	2026	3	31	2026-03	1
2026-04-01	2026	4	1	2026-04	2
2026-04-02	2026	4	2	2026-04	2
2026-04-03	2026	4	3	2026-04	2
2026-04-04	2026	4	4	2026-04	2
2026-04-05	2026	4	5	2026-04	2
2026-04-06	2026	4	6	2026-04	2
2026-04-07	2026	4	7	2026-04	2
2026-04-08	2026	4	8	2026-04	2
2026-04-09	2026	4	9	2026-04	2
2026-04-10	2026	4	10	2026-04	2
2026-04-11	2026	4	11	2026-04	2
2026-04-12	2026	4	12	2026-04	2
2026-04-13	2026	4	13	2026-04	2
2026-04-14	2026	4	14	2026-04	2
2026-04-15	2026	4	15	2026-04	2
2026-04-16	2026	4	16	2026-04	2
2026-04-17	2026	4	17	2026-04	2
2026-04-18	2026	4	18	2026-04	2
2026-04-19	2026	4	19	2026-04	2
2026-04-20	2026	4	20	2026-04	2
2026-04-21	2026	4	21	2026-04	2
2026-04-22	2026	4	22	2026-04	2
2026-04-23	2026	4	23	2026-04	2
2026-04-24	2026	4	24	2026-04	2
2026-04-25	2026	4	25	2026-04	2
2026-04-26	2026	4	26	2026-04	2
2026-04-27	2026	4	27	2026-04	2
2026-04-28	2026	4	28	2026-04	2
2026-04-29	2026	4	29	2026-04	2
2026-04-30	2026	4	30	2026-04	2
2026-05-01	2026	5	1	2026-05	2
2026-05-02	2026	5	2	2026-05	2
2026-05-03	2026	5	3	2026-05	2
2026-05-04	2026	5	4	2026-05	2
2026-05-05	2026	5	5	2026-05	2
2026-05-06	2026	5	6	2026-05	2
2026-05-07	2026	5	7	2026-05	2
2026-05-08	2026	5	8	2026-05	2
2026-05-09	2026	5	9	2026-05	2
2026-05-10	2026	5	10	2026-05	2
2026-05-11	2026	5	11	2026-05	2
2026-05-12	2026	5	12	2026-05	2
2026-05-13	2026	5	13	2026-05	2
2026-05-14	2026	5	14	2026-05	2
2026-05-15	2026	5	15	2026-05	2
2026-05-16	2026	5	16	2026-05	2
2026-05-17	2026	5	17	2026-05	2
2026-05-18	2026	5	18	2026-05	2
2026-05-19	2026	5	19	2026-05	2
2026-05-20	2026	5	20	2026-05	2
2026-05-21	2026	5	21	2026-05	2
2026-05-22	2026	5	22	2026-05	2
2026-05-23	2026	5	23	2026-05	2
2026-05-24	2026	5	24	2026-05	2
2026-05-25	2026	5	25	2026-05	2
2026-05-26	2026	5	26	2026-05	2
2026-05-27	2026	5	27	2026-05	2
2026-05-28	2026	5	28	2026-05	2
2026-05-29	2026	5	29	2026-05	2
2026-05-30	2026	5	30	2026-05	2
2026-05-31	2026	5	31	2026-05	2
2026-06-01	2026	6	1	2026-06	2
2026-06-02	2026	6	2	2026-06	2
2026-06-03	2026	6	3	2026-06	2
2026-06-04	2026	6	4	2026-06	2
2026-06-05	2026	6	5	2026-06	2
2026-06-06	2026	6	6	2026-06	2
2026-06-07	2026	6	7	2026-06	2
2026-06-08	2026	6	8	2026-06	2
2026-06-09	2026	6	9	2026-06	2
2026-06-10	2026	6	10	2026-06	2
2026-06-11	2026	6	11	2026-06	2
2026-06-12	2026	6	12	2026-06	2
2026-06-13	2026	6	13	2026-06	2
2026-06-14	2026	6	14	2026-06	2
2026-06-15	2026	6	15	2026-06	2
2026-06-16	2026	6	16	2026-06	2
2026-06-17	2026	6	17	2026-06	2
2026-06-18	2026	6	18	2026-06	2
2026-06-19	2026	6	19	2026-06	2
2026-06-20	2026	6	20	2026-06	2
2026-06-21	2026	6	21	2026-06	2
2026-06-22	2026	6	22	2026-06	2
2026-06-23	2026	6	23	2026-06	2
2026-06-24	2026	6	24	2026-06	2
2026-06-25	2026	6	25	2026-06	2
2026-06-26	2026	6	26	2026-06	2
2026-06-27	2026	6	27	2026-06	2
2026-06-28	2026	6	28	2026-06	2
2026-06-29	2026	6	29	2026-06	2
2026-06-30	2026	6	30	2026-06	2
2026-07-01	2026	7	1	2026-07	3
2026-07-02	2026	7	2	2026-07	3
2026-07-03	2026	7	3	2026-07	3
2026-07-04	2026	7	4	2026-07	3
2026-07-05	2026	7	5	2026-07	3
2026-07-06	2026	7	6	2026-07	3
2026-07-07	2026	7	7	2026-07	3
2026-07-08	2026	7	8	2026-07	3
2026-07-09	2026	7	9	2026-07	3
2026-07-10	2026	7	10	2026-07	3
2026-07-11	2026	7	11	2026-07	3
2026-07-12	2026	7	12	2026-07	3
2026-07-13	2026	7	13	2026-07	3
2026-07-14	2026	7	14	2026-07	3
2026-07-15	2026	7	15	2026-07	3
2026-07-16	2026	7	16	2026-07	3
2026-07-17	2026	7	17	2026-07	3
2026-07-18	2026	7	18	2026-07	3
2026-07-19	2026	7	19	2026-07	3
2026-07-20	2026	7	20	2026-07	3
2026-07-21	2026	7	21	2026-07	3
2026-07-22	2026	7	22	2026-07	3
2026-07-23	2026	7	23	2026-07	3
2026-07-24	2026	7	24	2026-07	3
2026-07-25	2026	7	25	2026-07	3
2026-07-26	2026	7	26	2026-07	3
2026-07-27	2026	7	27	2026-07	3
2026-07-28	2026	7	28	2026-07	3
2026-07-29	2026	7	29	2026-07	3
2026-07-30	2026	7	30	2026-07	3
2026-07-31	2026	7	31	2026-07	3
2026-08-01	2026	8	1	2026-08	3
2026-08-02	2026	8	2	2026-08	3
2026-08-03	2026	8	3	2026-08	3
2026-08-04	2026	8	4	2026-08	3
2026-08-05	2026	8	5	2026-08	3
2026-08-06	2026	8	6	2026-08	3
2026-08-07	2026	8	7	2026-08	3
2026-08-08	2026	8	8	2026-08	3
2026-08-09	2026	8	9	2026-08	3
2026-08-10	2026	8	10	2026-08	3
2026-08-11	2026	8	11	2026-08	3
2026-08-12	2026	8	12	2026-08	3
2026-08-13	2026	8	13	2026-08	3
2026-08-14	2026	8	14	2026-08	3
2026-08-15	2026	8	15	2026-08	3
2026-08-16	2026	8	16	2026-08	3
2026-08-17	2026	8	17	2026-08	3
2026-08-18	2026	8	18	2026-08	3
2026-08-19	2026	8	19	2026-08	3
2026-08-20	2026	8	20	2026-08	3
2026-08-21	2026	8	21	2026-08	3
2026-08-22	2026	8	22	2026-08	3
2026-08-23	2026	8	23	2026-08	3
2026-08-24	2026	8	24	2026-08	3
2026-08-25	2026	8	25	2026-08	3
2026-08-26	2026	8	26	2026-08	3
2026-08-27	2026	8	27	2026-08	3
2026-08-28	2026	8	28	2026-08	3
2026-08-29	2026	8	29	2026-08	3
2026-08-30	2026	8	30	2026-08	3
2026-08-31	2026	8	31	2026-08	3
2026-09-01	2026	9	1	2026-09	3
2026-09-02	2026	9	2	2026-09	3
2026-09-03	2026	9	3	2026-09	3
2026-09-04	2026	9	4	2026-09	3
2026-09-05	2026	9	5	2026-09	3
2026-09-06	2026	9	6	2026-09	3
2026-09-07	2026	9	7	2026-09	3
2026-09-08	2026	9	8	2026-09	3
2026-09-09	2026	9	9	2026-09	3
2026-09-10	2026	9	10	2026-09	3
2026-09-11	2026	9	11	2026-09	3
2026-09-12	2026	9	12	2026-09	3
2026-09-13	2026	9	13	2026-09	3
2026-09-14	2026	9	14	2026-09	3
2026-09-15	2026	9	15	2026-09	3
2026-09-16	2026	9	16	2026-09	3
2026-09-17	2026	9	17	2026-09	3
2026-09-18	2026	9	18	2026-09	3
2026-09-19	2026	9	19	2026-09	3
2026-09-20	2026	9	20	2026-09	3
2026-09-21	2026	9	21	2026-09	3
2026-09-22	2026	9	22	2026-09	3
2026-09-23	2026	9	23	2026-09	3
2026-09-24	2026	9	24	2026-09	3
2026-09-25	2026	9	25	2026-09	3
2026-09-26	2026	9	26	2026-09	3
2026-09-27	2026	9	27	2026-09	3
2026-09-28	2026	9	28	2026-09	3
2026-09-29	2026	9	29	2026-09	3
2026-09-30	2026	9	30	2026-09	3
2026-10-01	2026	10	1	2026-10	4
2026-10-02	2026	10	2	2026-10	4
2026-10-03	2026	10	3	2026-10	4
2026-10-04	2026	10	4	2026-10	4
2026-10-05	2026	10	5	2026-10	4
2026-10-06	2026	10	6	2026-10	4
2026-10-07	2026	10	7	2026-10	4
2026-10-08	2026	10	8	2026-10	4
2026-10-09	2026	10	9	2026-10	4
2026-10-10	2026	10	10	2026-10	4
2026-10-11	2026	10	11	2026-10	4
2026-10-12	2026	10	12	2026-10	4
2026-10-13	2026	10	13	2026-10	4
2026-10-14	2026	10	14	2026-10	4
2026-10-15	2026	10	15	2026-10	4
2026-10-16	2026	10	16	2026-10	4
2026-10-17	2026	10	17	2026-10	4
2026-10-18	2026	10	18	2026-10	4
2026-10-19	2026	10	19	2026-10	4
2026-10-20	2026	10	20	2026-10	4
2026-10-21	2026	10	21	2026-10	4
2026-10-22	2026	10	22	2026-10	4
2026-10-23	2026	10	23	2026-10	4
2026-10-24	2026	10	24	2026-10	4
2026-10-25	2026	10	25	2026-10	4
2026-10-26	2026	10	26	2026-10	4
2026-10-27	2026	10	27	2026-10	4
2026-10-28	2026	10	28	2026-10	4
2026-10-29	2026	10	29	2026-10	4
2026-10-30	2026	10	30	2026-10	4
2026-10-31	2026	10	31	2026-10	4
2026-11-01	2026	11	1	2026-11	4
2026-11-02	2026	11	2	2026-11	4
2026-11-03	2026	11	3	2026-11	4
2026-11-04	2026	11	4	2026-11	4
2026-11-05	2026	11	5	2026-11	4
2026-11-06	2026	11	6	2026-11	4
2026-11-07	2026	11	7	2026-11	4
2026-11-08	2026	11	8	2026-11	4
2026-11-09	2026	11	9	2026-11	4
2026-11-10	2026	11	10	2026-11	4
2026-11-11	2026	11	11	2026-11	4
2026-11-12	2026	11	12	2026-11	4
2026-11-13	2026	11	13	2026-11	4
2026-11-14	2026	11	14	2026-11	4
2026-11-15	2026	11	15	2026-11	4
2026-11-16	2026	11	16	2026-11	4
2026-11-17	2026	11	17	2026-11	4
2026-11-18	2026	11	18	2026-11	4
2026-11-19	2026	11	19	2026-11	4
2026-11-20	2026	11	20	2026-11	4
2026-11-21	2026	11	21	2026-11	4
2026-11-22	2026	11	22	2026-11	4
2026-11-23	2026	11	23	2026-11	4
2026-11-24	2026	11	24	2026-11	4
2026-11-25	2026	11	25	2026-11	4
2026-11-26	2026	11	26	2026-11	4
2026-11-27	2026	11	27	2026-11	4
2026-11-28	2026	11	28	2026-11	4
2026-11-29	2026	11	29	2026-11	4
2026-11-30	2026	11	30	2026-11	4
2026-12-01	2026	12	1	2026-12	4
2026-12-02	2026	12	2	2026-12	4
2026-12-03	2026	12	3	2026-12	4
2026-12-04	2026	12	4	2026-12	4
2026-12-05	2026	12	5	2026-12	4
2026-12-06	2026	12	6	2026-12	4
2026-12-07	2026	12	7	2026-12	4
2026-12-08	2026	12	8	2026-12	4
2026-12-09	2026	12	9	2026-12	4
2026-12-10	2026	12	10	2026-12	4
2026-12-11	2026	12	11	2026-12	4
2026-12-12	2026	12	12	2026-12	4
2026-12-13	2026	12	13	2026-12	4
2026-12-14	2026	12	14	2026-12	4
2026-12-15	2026	12	15	2026-12	4
2026-12-16	2026	12	16	2026-12	4
2026-12-17	2026	12	17	2026-12	4
2026-12-18	2026	12	18	2026-12	4
2026-12-19	2026	12	19	2026-12	4
2026-12-20	2026	12	20	2026-12	4
2026-12-21	2026	12	21	2026-12	4
2026-12-22	2026	12	22	2026-12	4
2026-12-23	2026	12	23	2026-12	4
2026-12-24	2026	12	24	2026-12	4
2026-12-25	2026	12	25	2026-12	4
2026-12-26	2026	12	26	2026-12	4
2026-12-27	2026	12	27	2026-12	4
2026-12-28	2026	12	28	2026-12	4
2026-12-29	2026	12	29	2026-12	4
2026-12-30	2026	12	30	2026-12	4
2026-12-31	2026	12	31	2026-12	4
2027-01-01	2027	1	1	2027-01	1
2027-01-02	2027	1	2	2027-01	1
2027-01-03	2027	1	3	2027-01	1
2027-01-04	2027	1	4	2027-01	1
2027-01-05	2027	1	5	2027-01	1
2027-01-06	2027	1	6	2027-01	1
2027-01-07	2027	1	7	2027-01	1
2027-01-08	2027	1	8	2027-01	1
2027-01-09	2027	1	9	2027-01	1
2027-01-10	2027	1	10	2027-01	1
2027-01-11	2027	1	11	2027-01	1
2027-01-12	2027	1	12	2027-01	1
2027-01-13	2027	1	13	2027-01	1
2027-01-14	2027	1	14	2027-01	1
2027-01-15	2027	1	15	2027-01	1
2027-01-16	2027	1	16	2027-01	1
2027-01-17	2027	1	17	2027-01	1
2027-01-18	2027	1	18	2027-01	1
2027-01-19	2027	1	19	2027-01	1
2027-01-20	2027	1	20	2027-01	1
2027-01-21	2027	1	21	2027-01	1
2027-01-22	2027	1	22	2027-01	1
2027-01-23	2027	1	23	2027-01	1
2027-01-24	2027	1	24	2027-01	1
2027-01-25	2027	1	25	2027-01	1
2027-01-26	2027	1	26	2027-01	1
2027-01-27	2027	1	27	2027-01	1
2027-01-28	2027	1	28	2027-01	1
2027-01-29	2027	1	29	2027-01	1
2027-01-30	2027	1	30	2027-01	1
2027-01-31	2027	1	31	2027-01	1
2027-02-01	2027	2	1	2027-02	1
2027-02-02	2027	2	2	2027-02	1
2027-02-03	2027	2	3	2027-02	1
2027-02-04	2027	2	4	2027-02	1
2027-02-05	2027	2	5	2027-02	1
2027-02-06	2027	2	6	2027-02	1
2027-02-07	2027	2	7	2027-02	1
2027-02-08	2027	2	8	2027-02	1
2027-02-09	2027	2	9	2027-02	1
2027-02-10	2027	2	10	2027-02	1
2027-02-11	2027	2	11	2027-02	1
2027-02-12	2027	2	12	2027-02	1
2027-02-13	2027	2	13	2027-02	1
2027-02-14	2027	2	14	2027-02	1
2027-02-15	2027	2	15	2027-02	1
2027-02-16	2027	2	16	2027-02	1
2027-02-17	2027	2	17	2027-02	1
2027-02-18	2027	2	18	2027-02	1
2027-02-19	2027	2	19	2027-02	1
2027-02-20	2027	2	20	2027-02	1
2027-02-21	2027	2	21	2027-02	1
2027-02-22	2027	2	22	2027-02	1
2027-02-23	2027	2	23	2027-02	1
2027-02-24	2027	2	24	2027-02	1
2027-02-25	2027	2	25	2027-02	1
2027-02-26	2027	2	26	2027-02	1
2027-02-27	2027	2	27	2027-02	1
2027-02-28	2027	2	28	2027-02	1
2027-03-01	2027	3	1	2027-03	1
2027-03-02	2027	3	2	2027-03	1
2027-03-03	2027	3	3	2027-03	1
2027-03-04	2027	3	4	2027-03	1
2027-03-05	2027	3	5	2027-03	1
2027-03-06	2027	3	6	2027-03	1
2027-03-07	2027	3	7	2027-03	1
2027-03-08	2027	3	8	2027-03	1
2027-03-09	2027	3	9	2027-03	1
2027-03-10	2027	3	10	2027-03	1
2027-03-11	2027	3	11	2027-03	1
2027-03-12	2027	3	12	2027-03	1
2027-03-13	2027	3	13	2027-03	1
2027-03-14	2027	3	14	2027-03	1
2027-03-15	2027	3	15	2027-03	1
2027-03-16	2027	3	16	2027-03	1
2027-03-17	2027	3	17	2027-03	1
2027-03-18	2027	3	18	2027-03	1
2027-03-19	2027	3	19	2027-03	1
2027-03-20	2027	3	20	2027-03	1
2027-03-21	2027	3	21	2027-03	1
2027-03-22	2027	3	22	2027-03	1
2027-03-23	2027	3	23	2027-03	1
2027-03-24	2027	3	24	2027-03	1
2027-03-25	2027	3	25	2027-03	1
2027-03-26	2027	3	26	2027-03	1
2027-03-27	2027	3	27	2027-03	1
2027-03-28	2027	3	28	2027-03	1
2027-03-29	2027	3	29	2027-03	1
2027-03-30	2027	3	30	2027-03	1
2027-03-31	2027	3	31	2027-03	1
2027-04-01	2027	4	1	2027-04	2
2027-04-02	2027	4	2	2027-04	2
2027-04-03	2027	4	3	2027-04	2
2027-04-04	2027	4	4	2027-04	2
2027-04-05	2027	4	5	2027-04	2
2027-04-06	2027	4	6	2027-04	2
2027-04-07	2027	4	7	2027-04	2
2027-04-08	2027	4	8	2027-04	2
2027-04-09	2027	4	9	2027-04	2
2027-04-10	2027	4	10	2027-04	2
2027-04-11	2027	4	11	2027-04	2
2027-04-12	2027	4	12	2027-04	2
2027-04-13	2027	4	13	2027-04	2
2027-04-14	2027	4	14	2027-04	2
2027-04-15	2027	4	15	2027-04	2
2027-04-16	2027	4	16	2027-04	2
2027-04-17	2027	4	17	2027-04	2
2027-04-18	2027	4	18	2027-04	2
2027-04-19	2027	4	19	2027-04	2
2027-04-20	2027	4	20	2027-04	2
2027-04-21	2027	4	21	2027-04	2
2027-04-22	2027	4	22	2027-04	2
2027-04-23	2027	4	23	2027-04	2
2027-04-24	2027	4	24	2027-04	2
2027-04-25	2027	4	25	2027-04	2
2027-04-26	2027	4	26	2027-04	2
2027-04-27	2027	4	27	2027-04	2
2027-04-28	2027	4	28	2027-04	2
2027-04-29	2027	4	29	2027-04	2
2027-04-30	2027	4	30	2027-04	2
2027-05-01	2027	5	1	2027-05	2
2027-05-02	2027	5	2	2027-05	2
2027-05-03	2027	5	3	2027-05	2
2027-05-04	2027	5	4	2027-05	2
2027-05-05	2027	5	5	2027-05	2
2027-05-06	2027	5	6	2027-05	2
2027-05-07	2027	5	7	2027-05	2
2027-05-08	2027	5	8	2027-05	2
2027-05-09	2027	5	9	2027-05	2
2027-05-10	2027	5	10	2027-05	2
2027-05-11	2027	5	11	2027-05	2
2027-05-12	2027	5	12	2027-05	2
2027-05-13	2027	5	13	2027-05	2
2027-05-14	2027	5	14	2027-05	2
2027-05-15	2027	5	15	2027-05	2
2027-05-16	2027	5	16	2027-05	2
2027-05-17	2027	5	17	2027-05	2
2027-05-18	2027	5	18	2027-05	2
2027-05-19	2027	5	19	2027-05	2
2027-05-20	2027	5	20	2027-05	2
2027-05-21	2027	5	21	2027-05	2
2027-05-22	2027	5	22	2027-05	2
2027-05-23	2027	5	23	2027-05	2
2027-05-24	2027	5	24	2027-05	2
2027-05-25	2027	5	25	2027-05	2
2027-05-26	2027	5	26	2027-05	2
2027-05-27	2027	5	27	2027-05	2
2027-05-28	2027	5	28	2027-05	2
2027-05-29	2027	5	29	2027-05	2
2027-05-30	2027	5	30	2027-05	2
2027-05-31	2027	5	31	2027-05	2
2027-06-01	2027	6	1	2027-06	2
2027-06-02	2027	6	2	2027-06	2
2027-06-03	2027	6	3	2027-06	2
2027-06-04	2027	6	4	2027-06	2
2027-06-05	2027	6	5	2027-06	2
2027-06-06	2027	6	6	2027-06	2
2027-06-07	2027	6	7	2027-06	2
2027-06-08	2027	6	8	2027-06	2
2027-06-09	2027	6	9	2027-06	2
2027-06-10	2027	6	10	2027-06	2
2027-06-11	2027	6	11	2027-06	2
2027-06-12	2027	6	12	2027-06	2
2027-06-13	2027	6	13	2027-06	2
2027-06-14	2027	6	14	2027-06	2
2027-06-15	2027	6	15	2027-06	2
2027-06-16	2027	6	16	2027-06	2
2027-06-17	2027	6	17	2027-06	2
2027-06-18	2027	6	18	2027-06	2
2027-06-19	2027	6	19	2027-06	2
2027-06-20	2027	6	20	2027-06	2
2027-06-21	2027	6	21	2027-06	2
2027-06-22	2027	6	22	2027-06	2
2027-06-23	2027	6	23	2027-06	2
2027-06-24	2027	6	24	2027-06	2
2027-06-25	2027	6	25	2027-06	2
2027-06-26	2027	6	26	2027-06	2
2027-06-27	2027	6	27	2027-06	2
2027-06-28	2027	6	28	2027-06	2
2027-06-29	2027	6	29	2027-06	2
2027-06-30	2027	6	30	2027-06	2
2027-07-01	2027	7	1	2027-07	3
2027-07-02	2027	7	2	2027-07	3
2027-07-03	2027	7	3	2027-07	3
2027-07-04	2027	7	4	2027-07	3
2027-07-05	2027	7	5	2027-07	3
2027-07-06	2027	7	6	2027-07	3
2027-07-07	2027	7	7	2027-07	3
2027-07-08	2027	7	8	2027-07	3
2027-07-09	2027	7	9	2027-07	3
2027-07-10	2027	7	10	2027-07	3
2027-07-11	2027	7	11	2027-07	3
2027-07-12	2027	7	12	2027-07	3
2027-07-13	2027	7	13	2027-07	3
2027-07-14	2027	7	14	2027-07	3
2027-07-15	2027	7	15	2027-07	3
2027-07-16	2027	7	16	2027-07	3
2027-07-17	2027	7	17	2027-07	3
2027-07-18	2027	7	18	2027-07	3
2027-07-19	2027	7	19	2027-07	3
2027-07-20	2027	7	20	2027-07	3
2027-07-21	2027	7	21	2027-07	3
2027-07-22	2027	7	22	2027-07	3
2027-07-23	2027	7	23	2027-07	3
2027-07-24	2027	7	24	2027-07	3
2027-07-25	2027	7	25	2027-07	3
2027-07-26	2027	7	26	2027-07	3
2027-07-27	2027	7	27	2027-07	3
2027-07-28	2027	7	28	2027-07	3
2027-07-29	2027	7	29	2027-07	3
2027-07-30	2027	7	30	2027-07	3
2027-07-31	2027	7	31	2027-07	3
2027-08-01	2027	8	1	2027-08	3
2027-08-02	2027	8	2	2027-08	3
2027-08-03	2027	8	3	2027-08	3
2027-08-04	2027	8	4	2027-08	3
2027-08-05	2027	8	5	2027-08	3
2027-08-06	2027	8	6	2027-08	3
2027-08-07	2027	8	7	2027-08	3
2027-08-08	2027	8	8	2027-08	3
2027-08-09	2027	8	9	2027-08	3
2027-08-10	2027	8	10	2027-08	3
2027-08-11	2027	8	11	2027-08	3
2027-08-12	2027	8	12	2027-08	3
2027-08-13	2027	8	13	2027-08	3
2027-08-14	2027	8	14	2027-08	3
2027-08-15	2027	8	15	2027-08	3
2027-08-16	2027	8	16	2027-08	3
2027-08-17	2027	8	17	2027-08	3
2027-08-18	2027	8	18	2027-08	3
2027-08-19	2027	8	19	2027-08	3
2027-08-20	2027	8	20	2027-08	3
2027-08-21	2027	8	21	2027-08	3
2027-08-22	2027	8	22	2027-08	3
2027-08-23	2027	8	23	2027-08	3
2027-08-24	2027	8	24	2027-08	3
2027-08-25	2027	8	25	2027-08	3
2027-08-26	2027	8	26	2027-08	3
2027-08-27	2027	8	27	2027-08	3
2027-08-28	2027	8	28	2027-08	3
2027-08-29	2027	8	29	2027-08	3
2027-08-30	2027	8	30	2027-08	3
2027-08-31	2027	8	31	2027-08	3
2027-09-01	2027	9	1	2027-09	3
2027-09-02	2027	9	2	2027-09	3
2027-09-03	2027	9	3	2027-09	3
2027-09-04	2027	9	4	2027-09	3
2027-09-05	2027	9	5	2027-09	3
2027-09-06	2027	9	6	2027-09	3
2027-09-07	2027	9	7	2027-09	3
2027-09-08	2027	9	8	2027-09	3
2027-09-09	2027	9	9	2027-09	3
2027-09-10	2027	9	10	2027-09	3
2027-09-11	2027	9	11	2027-09	3
2027-09-12	2027	9	12	2027-09	3
2027-09-13	2027	9	13	2027-09	3
2027-09-14	2027	9	14	2027-09	3
2027-09-15	2027	9	15	2027-09	3
2027-09-16	2027	9	16	2027-09	3
2027-09-17	2027	9	17	2027-09	3
2027-09-18	2027	9	18	2027-09	3
2027-09-19	2027	9	19	2027-09	3
2027-09-20	2027	9	20	2027-09	3
2027-09-21	2027	9	21	2027-09	3
2027-09-22	2027	9	22	2027-09	3
2027-09-23	2027	9	23	2027-09	3
2027-09-24	2027	9	24	2027-09	3
2027-09-25	2027	9	25	2027-09	3
2027-09-26	2027	9	26	2027-09	3
2027-09-27	2027	9	27	2027-09	3
2027-09-28	2027	9	28	2027-09	3
2027-09-29	2027	9	29	2027-09	3
2027-09-30	2027	9	30	2027-09	3
2027-10-01	2027	10	1	2027-10	4
2027-10-02	2027	10	2	2027-10	4
2027-10-03	2027	10	3	2027-10	4
2027-10-04	2027	10	4	2027-10	4
2027-10-05	2027	10	5	2027-10	4
2027-10-06	2027	10	6	2027-10	4
2027-10-07	2027	10	7	2027-10	4
2027-10-08	2027	10	8	2027-10	4
2027-10-09	2027	10	9	2027-10	4
2027-10-10	2027	10	10	2027-10	4
2027-10-11	2027	10	11	2027-10	4
2027-10-12	2027	10	12	2027-10	4
2027-10-13	2027	10	13	2027-10	4
2027-10-14	2027	10	14	2027-10	4
2027-10-15	2027	10	15	2027-10	4
2027-10-16	2027	10	16	2027-10	4
2027-10-17	2027	10	17	2027-10	4
2027-10-18	2027	10	18	2027-10	4
2027-10-19	2027	10	19	2027-10	4
2027-10-20	2027	10	20	2027-10	4
2027-10-21	2027	10	21	2027-10	4
2027-10-22	2027	10	22	2027-10	4
2027-10-23	2027	10	23	2027-10	4
2027-10-24	2027	10	24	2027-10	4
2027-10-25	2027	10	25	2027-10	4
2027-10-26	2027	10	26	2027-10	4
2027-10-27	2027	10	27	2027-10	4
2027-10-28	2027	10	28	2027-10	4
2027-10-29	2027	10	29	2027-10	4
2027-10-30	2027	10	30	2027-10	4
2027-10-31	2027	10	31	2027-10	4
2027-11-01	2027	11	1	2027-11	4
2027-11-02	2027	11	2	2027-11	4
2027-11-03	2027	11	3	2027-11	4
2027-11-04	2027	11	4	2027-11	4
2027-11-05	2027	11	5	2027-11	4
2027-11-06	2027	11	6	2027-11	4
2027-11-07	2027	11	7	2027-11	4
2027-11-08	2027	11	8	2027-11	4
2027-11-09	2027	11	9	2027-11	4
2027-11-10	2027	11	10	2027-11	4
2027-11-11	2027	11	11	2027-11	4
2027-11-12	2027	11	12	2027-11	4
2027-11-13	2027	11	13	2027-11	4
2027-11-14	2027	11	14	2027-11	4
2027-11-15	2027	11	15	2027-11	4
2027-11-16	2027	11	16	2027-11	4
2027-11-17	2027	11	17	2027-11	4
2027-11-18	2027	11	18	2027-11	4
2027-11-19	2027	11	19	2027-11	4
2027-11-20	2027	11	20	2027-11	4
2027-11-21	2027	11	21	2027-11	4
2027-11-22	2027	11	22	2027-11	4
2027-11-23	2027	11	23	2027-11	4
2027-11-24	2027	11	24	2027-11	4
2027-11-25	2027	11	25	2027-11	4
2027-11-26	2027	11	26	2027-11	4
2027-11-27	2027	11	27	2027-11	4
2027-11-28	2027	11	28	2027-11	4
2027-11-29	2027	11	29	2027-11	4
2027-11-30	2027	11	30	2027-11	4
2027-12-01	2027	12	1	2027-12	4
2027-12-02	2027	12	2	2027-12	4
2027-12-03	2027	12	3	2027-12	4
2027-12-04	2027	12	4	2027-12	4
2027-12-05	2027	12	5	2027-12	4
2027-12-06	2027	12	6	2027-12	4
2027-12-07	2027	12	7	2027-12	4
2027-12-08	2027	12	8	2027-12	4
2027-12-09	2027	12	9	2027-12	4
2027-12-10	2027	12	10	2027-12	4
2027-12-11	2027	12	11	2027-12	4
2027-12-12	2027	12	12	2027-12	4
2027-12-13	2027	12	13	2027-12	4
2027-12-14	2027	12	14	2027-12	4
2027-12-15	2027	12	15	2027-12	4
2027-12-16	2027	12	16	2027-12	4
2027-12-17	2027	12	17	2027-12	4
2027-12-18	2027	12	18	2027-12	4
2027-12-19	2027	12	19	2027-12	4
2027-12-20	2027	12	20	2027-12	4
2027-12-21	2027	12	21	2027-12	4
2027-12-22	2027	12	22	2027-12	4
2027-12-23	2027	12	23	2027-12	4
2027-12-24	2027	12	24	2027-12	4
2027-12-25	2027	12	25	2027-12	4
2027-12-26	2027	12	26	2027-12	4
2027-12-27	2027	12	27	2027-12	4
2027-12-28	2027	12	28	2027-12	4
2027-12-29	2027	12	29	2027-12	4
2027-12-30	2027	12	30	2027-12	4
2027-12-31	2027	12	31	2027-12	4
2028-01-01	2028	1	1	2028-01	1
2028-01-02	2028	1	2	2028-01	1
2028-01-03	2028	1	3	2028-01	1
2028-01-04	2028	1	4	2028-01	1
2028-01-05	2028	1	5	2028-01	1
2028-01-06	2028	1	6	2028-01	1
2028-01-07	2028	1	7	2028-01	1
2028-01-08	2028	1	8	2028-01	1
2028-01-09	2028	1	9	2028-01	1
2028-01-10	2028	1	10	2028-01	1
2028-01-11	2028	1	11	2028-01	1
2028-01-12	2028	1	12	2028-01	1
2028-01-13	2028	1	13	2028-01	1
2028-01-14	2028	1	14	2028-01	1
2028-01-15	2028	1	15	2028-01	1
2028-01-16	2028	1	16	2028-01	1
2028-01-17	2028	1	17	2028-01	1
2028-01-18	2028	1	18	2028-01	1
2028-01-19	2028	1	19	2028-01	1
2028-01-20	2028	1	20	2028-01	1
2028-01-21	2028	1	21	2028-01	1
2028-01-22	2028	1	22	2028-01	1
2028-01-23	2028	1	23	2028-01	1
2028-01-24	2028	1	24	2028-01	1
2028-01-25	2028	1	25	2028-01	1
2028-01-26	2028	1	26	2028-01	1
2028-01-27	2028	1	27	2028-01	1
2028-01-28	2028	1	28	2028-01	1
2028-01-29	2028	1	29	2028-01	1
2028-01-30	2028	1	30	2028-01	1
2028-01-31	2028	1	31	2028-01	1
2028-02-01	2028	2	1	2028-02	1
2028-02-02	2028	2	2	2028-02	1
2028-02-03	2028	2	3	2028-02	1
2028-02-04	2028	2	4	2028-02	1
2028-02-05	2028	2	5	2028-02	1
2028-02-06	2028	2	6	2028-02	1
2028-02-07	2028	2	7	2028-02	1
2028-02-08	2028	2	8	2028-02	1
2028-02-09	2028	2	9	2028-02	1
2028-02-10	2028	2	10	2028-02	1
2028-02-11	2028	2	11	2028-02	1
2028-02-12	2028	2	12	2028-02	1
2028-02-13	2028	2	13	2028-02	1
2028-02-14	2028	2	14	2028-02	1
2028-02-15	2028	2	15	2028-02	1
2028-02-16	2028	2	16	2028-02	1
2028-02-17	2028	2	17	2028-02	1
2028-02-18	2028	2	18	2028-02	1
2028-02-19	2028	2	19	2028-02	1
2028-02-20	2028	2	20	2028-02	1
2028-02-21	2028	2	21	2028-02	1
2028-02-22	2028	2	22	2028-02	1
2028-02-23	2028	2	23	2028-02	1
2028-02-24	2028	2	24	2028-02	1
2028-02-25	2028	2	25	2028-02	1
2028-02-26	2028	2	26	2028-02	1
2028-02-27	2028	2	27	2028-02	1
2028-02-28	2028	2	28	2028-02	1
2028-02-29	2028	2	29	2028-02	1
2028-03-01	2028	3	1	2028-03	1
2028-03-02	2028	3	2	2028-03	1
2028-03-03	2028	3	3	2028-03	1
2028-03-04	2028	3	4	2028-03	1
2028-03-05	2028	3	5	2028-03	1
2028-03-06	2028	3	6	2028-03	1
2028-03-07	2028	3	7	2028-03	1
2028-03-08	2028	3	8	2028-03	1
2028-03-09	2028	3	9	2028-03	1
2028-03-10	2028	3	10	2028-03	1
2028-03-11	2028	3	11	2028-03	1
2028-03-12	2028	3	12	2028-03	1
2028-03-13	2028	3	13	2028-03	1
2028-03-14	2028	3	14	2028-03	1
2028-03-15	2028	3	15	2028-03	1
2028-03-16	2028	3	16	2028-03	1
2028-03-17	2028	3	17	2028-03	1
2028-03-18	2028	3	18	2028-03	1
2028-03-19	2028	3	19	2028-03	1
2028-03-20	2028	3	20	2028-03	1
2028-03-21	2028	3	21	2028-03	1
2028-03-22	2028	3	22	2028-03	1
2028-03-23	2028	3	23	2028-03	1
2028-03-24	2028	3	24	2028-03	1
2028-03-25	2028	3	25	2028-03	1
2028-03-26	2028	3	26	2028-03	1
2028-03-27	2028	3	27	2028-03	1
2028-03-28	2028	3	28	2028-03	1
2028-03-29	2028	3	29	2028-03	1
2028-03-30	2028	3	30	2028-03	1
2028-03-31	2028	3	31	2028-03	1
2028-04-01	2028	4	1	2028-04	2
2028-04-02	2028	4	2	2028-04	2
2028-04-03	2028	4	3	2028-04	2
2028-04-04	2028	4	4	2028-04	2
2028-04-05	2028	4	5	2028-04	2
2028-04-06	2028	4	6	2028-04	2
2028-04-07	2028	4	7	2028-04	2
2028-04-08	2028	4	8	2028-04	2
2028-04-09	2028	4	9	2028-04	2
2028-04-10	2028	4	10	2028-04	2
2028-04-11	2028	4	11	2028-04	2
2028-04-12	2028	4	12	2028-04	2
2028-04-13	2028	4	13	2028-04	2
2028-04-14	2028	4	14	2028-04	2
2028-04-15	2028	4	15	2028-04	2
2028-04-16	2028	4	16	2028-04	2
2028-04-17	2028	4	17	2028-04	2
2028-04-18	2028	4	18	2028-04	2
2028-04-19	2028	4	19	2028-04	2
2028-04-20	2028	4	20	2028-04	2
2028-04-21	2028	4	21	2028-04	2
2028-04-22	2028	4	22	2028-04	2
2028-04-23	2028	4	23	2028-04	2
2028-04-24	2028	4	24	2028-04	2
2028-04-25	2028	4	25	2028-04	2
2028-04-26	2028	4	26	2028-04	2
2028-04-27	2028	4	27	2028-04	2
2028-04-28	2028	4	28	2028-04	2
2028-04-29	2028	4	29	2028-04	2
2028-04-30	2028	4	30	2028-04	2
2028-05-01	2028	5	1	2028-05	2
2028-05-02	2028	5	2	2028-05	2
2028-05-03	2028	5	3	2028-05	2
2028-05-04	2028	5	4	2028-05	2
2028-05-05	2028	5	5	2028-05	2
2028-05-06	2028	5	6	2028-05	2
2028-05-07	2028	5	7	2028-05	2
2028-05-08	2028	5	8	2028-05	2
2028-05-09	2028	5	9	2028-05	2
2028-05-10	2028	5	10	2028-05	2
2028-05-11	2028	5	11	2028-05	2
2028-05-12	2028	5	12	2028-05	2
2028-05-13	2028	5	13	2028-05	2
2028-05-14	2028	5	14	2028-05	2
2028-05-15	2028	5	15	2028-05	2
2028-05-16	2028	5	16	2028-05	2
2028-05-17	2028	5	17	2028-05	2
2028-05-18	2028	5	18	2028-05	2
2028-05-19	2028	5	19	2028-05	2
2028-05-20	2028	5	20	2028-05	2
2028-05-21	2028	5	21	2028-05	2
2028-05-22	2028	5	22	2028-05	2
2028-05-23	2028	5	23	2028-05	2
2028-05-24	2028	5	24	2028-05	2
2028-05-25	2028	5	25	2028-05	2
2028-05-26	2028	5	26	2028-05	2
2028-05-27	2028	5	27	2028-05	2
2028-05-28	2028	5	28	2028-05	2
2028-05-29	2028	5	29	2028-05	2
2028-05-30	2028	5	30	2028-05	2
2028-05-31	2028	5	31	2028-05	2
2028-06-01	2028	6	1	2028-06	2
2028-06-02	2028	6	2	2028-06	2
2028-06-03	2028	6	3	2028-06	2
2028-06-04	2028	6	4	2028-06	2
2028-06-05	2028	6	5	2028-06	2
2028-06-06	2028	6	6	2028-06	2
2028-06-07	2028	6	7	2028-06	2
2028-06-08	2028	6	8	2028-06	2
2028-06-09	2028	6	9	2028-06	2
2028-06-10	2028	6	10	2028-06	2
2028-06-11	2028	6	11	2028-06	2
2028-06-12	2028	6	12	2028-06	2
2028-06-13	2028	6	13	2028-06	2
2028-06-14	2028	6	14	2028-06	2
2028-06-15	2028	6	15	2028-06	2
2028-06-16	2028	6	16	2028-06	2
2028-06-17	2028	6	17	2028-06	2
2028-06-18	2028	6	18	2028-06	2
2028-06-19	2028	6	19	2028-06	2
2028-06-20	2028	6	20	2028-06	2
2028-06-21	2028	6	21	2028-06	2
2028-06-22	2028	6	22	2028-06	2
2028-06-23	2028	6	23	2028-06	2
2028-06-24	2028	6	24	2028-06	2
2028-06-25	2028	6	25	2028-06	2
2028-06-26	2028	6	26	2028-06	2
2028-06-27	2028	6	27	2028-06	2
2028-06-28	2028	6	28	2028-06	2
2028-06-29	2028	6	29	2028-06	2
2028-06-30	2028	6	30	2028-06	2
2028-07-01	2028	7	1	2028-07	3
2028-07-02	2028	7	2	2028-07	3
2028-07-03	2028	7	3	2028-07	3
2028-07-04	2028	7	4	2028-07	3
2028-07-05	2028	7	5	2028-07	3
2028-07-06	2028	7	6	2028-07	3
2028-07-07	2028	7	7	2028-07	3
2028-07-08	2028	7	8	2028-07	3
2028-07-09	2028	7	9	2028-07	3
2028-07-10	2028	7	10	2028-07	3
2028-07-11	2028	7	11	2028-07	3
2028-07-12	2028	7	12	2028-07	3
2028-07-13	2028	7	13	2028-07	3
2028-07-14	2028	7	14	2028-07	3
2028-07-15	2028	7	15	2028-07	3
2028-07-16	2028	7	16	2028-07	3
2028-07-17	2028	7	17	2028-07	3
2028-07-18	2028	7	18	2028-07	3
2028-07-19	2028	7	19	2028-07	3
2028-07-20	2028	7	20	2028-07	3
2028-07-21	2028	7	21	2028-07	3
2028-07-22	2028	7	22	2028-07	3
2028-07-23	2028	7	23	2028-07	3
2028-07-24	2028	7	24	2028-07	3
2028-07-25	2028	7	25	2028-07	3
2028-07-26	2028	7	26	2028-07	3
2028-07-27	2028	7	27	2028-07	3
2028-07-28	2028	7	28	2028-07	3
2028-07-29	2028	7	29	2028-07	3
2028-07-30	2028	7	30	2028-07	3
2028-07-31	2028	7	31	2028-07	3
2028-08-01	2028	8	1	2028-08	3
2028-08-02	2028	8	2	2028-08	3
2028-08-03	2028	8	3	2028-08	3
2028-08-04	2028	8	4	2028-08	3
2028-08-05	2028	8	5	2028-08	3
2028-08-06	2028	8	6	2028-08	3
2028-08-07	2028	8	7	2028-08	3
2028-08-08	2028	8	8	2028-08	3
2028-08-09	2028	8	9	2028-08	3
2028-08-10	2028	8	10	2028-08	3
2028-08-11	2028	8	11	2028-08	3
2028-08-12	2028	8	12	2028-08	3
2028-08-13	2028	8	13	2028-08	3
2028-08-14	2028	8	14	2028-08	3
2028-08-15	2028	8	15	2028-08	3
2028-08-16	2028	8	16	2028-08	3
2028-08-17	2028	8	17	2028-08	3
2028-08-18	2028	8	18	2028-08	3
2028-08-19	2028	8	19	2028-08	3
2028-08-20	2028	8	20	2028-08	3
2028-08-21	2028	8	21	2028-08	3
2028-08-22	2028	8	22	2028-08	3
2028-08-23	2028	8	23	2028-08	3
2028-08-24	2028	8	24	2028-08	3
2028-08-25	2028	8	25	2028-08	3
2028-08-26	2028	8	26	2028-08	3
2028-08-27	2028	8	27	2028-08	3
2028-08-28	2028	8	28	2028-08	3
2028-08-29	2028	8	29	2028-08	3
2028-08-30	2028	8	30	2028-08	3
2028-08-31	2028	8	31	2028-08	3
2028-09-01	2028	9	1	2028-09	3
2028-09-02	2028	9	2	2028-09	3
2028-09-03	2028	9	3	2028-09	3
2028-09-04	2028	9	4	2028-09	3
2028-09-05	2028	9	5	2028-09	3
2028-09-06	2028	9	6	2028-09	3
2028-09-07	2028	9	7	2028-09	3
2028-09-08	2028	9	8	2028-09	3
2028-09-09	2028	9	9	2028-09	3
2028-09-10	2028	9	10	2028-09	3
2028-09-11	2028	9	11	2028-09	3
2028-09-12	2028	9	12	2028-09	3
2028-09-13	2028	9	13	2028-09	3
2028-09-14	2028	9	14	2028-09	3
2028-09-15	2028	9	15	2028-09	3
2028-09-16	2028	9	16	2028-09	3
2028-09-17	2028	9	17	2028-09	3
2028-09-18	2028	9	18	2028-09	3
2028-09-19	2028	9	19	2028-09	3
2028-09-20	2028	9	20	2028-09	3
2028-09-21	2028	9	21	2028-09	3
2028-09-22	2028	9	22	2028-09	3
2028-09-23	2028	9	23	2028-09	3
2028-09-24	2028	9	24	2028-09	3
2028-09-25	2028	9	25	2028-09	3
2028-09-26	2028	9	26	2028-09	3
2028-09-27	2028	9	27	2028-09	3
2028-09-28	2028	9	28	2028-09	3
2028-09-29	2028	9	29	2028-09	3
2028-09-30	2028	9	30	2028-09	3
2028-10-01	2028	10	1	2028-10	4
2028-10-02	2028	10	2	2028-10	4
2028-10-03	2028	10	3	2028-10	4
2028-10-04	2028	10	4	2028-10	4
2028-10-05	2028	10	5	2028-10	4
2028-10-06	2028	10	6	2028-10	4
2028-10-07	2028	10	7	2028-10	4
2028-10-08	2028	10	8	2028-10	4
2028-10-09	2028	10	9	2028-10	4
2028-10-10	2028	10	10	2028-10	4
2028-10-11	2028	10	11	2028-10	4
2028-10-12	2028	10	12	2028-10	4
2028-10-13	2028	10	13	2028-10	4
2028-10-14	2028	10	14	2028-10	4
2028-10-15	2028	10	15	2028-10	4
2028-10-16	2028	10	16	2028-10	4
2028-10-17	2028	10	17	2028-10	4
2028-10-18	2028	10	18	2028-10	4
2028-10-19	2028	10	19	2028-10	4
2028-10-20	2028	10	20	2028-10	4
2028-10-21	2028	10	21	2028-10	4
2028-10-22	2028	10	22	2028-10	4
2028-10-23	2028	10	23	2028-10	4
2028-10-24	2028	10	24	2028-10	4
2028-10-25	2028	10	25	2028-10	4
2028-10-26	2028	10	26	2028-10	4
2028-10-27	2028	10	27	2028-10	4
2028-10-28	2028	10	28	2028-10	4
2028-10-29	2028	10	29	2028-10	4
2028-10-30	2028	10	30	2028-10	4
2028-10-31	2028	10	31	2028-10	4
2028-11-01	2028	11	1	2028-11	4
2028-11-02	2028	11	2	2028-11	4
2028-11-03	2028	11	3	2028-11	4
2028-11-04	2028	11	4	2028-11	4
2028-11-05	2028	11	5	2028-11	4
2028-11-06	2028	11	6	2028-11	4
2028-11-07	2028	11	7	2028-11	4
2028-11-08	2028	11	8	2028-11	4
2028-11-09	2028	11	9	2028-11	4
2028-11-10	2028	11	10	2028-11	4
2028-11-11	2028	11	11	2028-11	4
2028-11-12	2028	11	12	2028-11	4
2028-11-13	2028	11	13	2028-11	4
2028-11-14	2028	11	14	2028-11	4
2028-11-15	2028	11	15	2028-11	4
2028-11-16	2028	11	16	2028-11	4
2028-11-17	2028	11	17	2028-11	4
2028-11-18	2028	11	18	2028-11	4
2028-11-19	2028	11	19	2028-11	4
2028-11-20	2028	11	20	2028-11	4
2028-11-21	2028	11	21	2028-11	4
2028-11-22	2028	11	22	2028-11	4
2028-11-23	2028	11	23	2028-11	4
2028-11-24	2028	11	24	2028-11	4
2028-11-25	2028	11	25	2028-11	4
2028-11-26	2028	11	26	2028-11	4
2028-11-27	2028	11	27	2028-11	4
2028-11-28	2028	11	28	2028-11	4
2028-11-29	2028	11	29	2028-11	4
2028-11-30	2028	11	30	2028-11	4
2028-12-01	2028	12	1	2028-12	4
2028-12-02	2028	12	2	2028-12	4
2028-12-03	2028	12	3	2028-12	4
2028-12-04	2028	12	4	2028-12	4
2028-12-05	2028	12	5	2028-12	4
2028-12-06	2028	12	6	2028-12	4
2028-12-07	2028	12	7	2028-12	4
2028-12-08	2028	12	8	2028-12	4
2028-12-09	2028	12	9	2028-12	4
2028-12-10	2028	12	10	2028-12	4
2028-12-11	2028	12	11	2028-12	4
2028-12-12	2028	12	12	2028-12	4
2028-12-13	2028	12	13	2028-12	4
2028-12-14	2028	12	14	2028-12	4
2028-12-15	2028	12	15	2028-12	4
2028-12-16	2028	12	16	2028-12	4
2028-12-17	2028	12	17	2028-12	4
2028-12-18	2028	12	18	2028-12	4
2028-12-19	2028	12	19	2028-12	4
2028-12-20	2028	12	20	2028-12	4
2028-12-21	2028	12	21	2028-12	4
2028-12-22	2028	12	22	2028-12	4
2028-12-23	2028	12	23	2028-12	4
2028-12-24	2028	12	24	2028-12	4
2028-12-25	2028	12	25	2028-12	4
2028-12-26	2028	12	26	2028-12	4
2028-12-27	2028	12	27	2028-12	4
2028-12-28	2028	12	28	2028-12	4
2028-12-29	2028	12	29	2028-12	4
2028-12-30	2028	12	30	2028-12	4
2028-12-31	2028	12	31	2028-12	4
2029-01-01	2029	1	1	2029-01	1
2029-01-02	2029	1	2	2029-01	1
2029-01-03	2029	1	3	2029-01	1
2029-01-04	2029	1	4	2029-01	1
2029-01-05	2029	1	5	2029-01	1
2029-01-06	2029	1	6	2029-01	1
2029-01-07	2029	1	7	2029-01	1
2029-01-08	2029	1	8	2029-01	1
2029-01-09	2029	1	9	2029-01	1
2029-01-10	2029	1	10	2029-01	1
2029-01-11	2029	1	11	2029-01	1
2029-01-12	2029	1	12	2029-01	1
2029-01-13	2029	1	13	2029-01	1
2029-01-14	2029	1	14	2029-01	1
2029-01-15	2029	1	15	2029-01	1
2029-01-16	2029	1	16	2029-01	1
2029-01-17	2029	1	17	2029-01	1
2029-01-18	2029	1	18	2029-01	1
2029-01-19	2029	1	19	2029-01	1
2029-01-20	2029	1	20	2029-01	1
2029-01-21	2029	1	21	2029-01	1
2029-01-22	2029	1	22	2029-01	1
2029-01-23	2029	1	23	2029-01	1
2029-01-24	2029	1	24	2029-01	1
2029-01-25	2029	1	25	2029-01	1
2029-01-26	2029	1	26	2029-01	1
2029-01-27	2029	1	27	2029-01	1
2029-01-28	2029	1	28	2029-01	1
2029-01-29	2029	1	29	2029-01	1
2029-01-30	2029	1	30	2029-01	1
2029-01-31	2029	1	31	2029-01	1
2029-02-01	2029	2	1	2029-02	1
2029-02-02	2029	2	2	2029-02	1
2029-02-03	2029	2	3	2029-02	1
2029-02-04	2029	2	4	2029-02	1
2029-02-05	2029	2	5	2029-02	1
2029-02-06	2029	2	6	2029-02	1
2029-02-07	2029	2	7	2029-02	1
2029-02-08	2029	2	8	2029-02	1
2029-02-09	2029	2	9	2029-02	1
2029-02-10	2029	2	10	2029-02	1
2029-02-11	2029	2	11	2029-02	1
2029-02-12	2029	2	12	2029-02	1
2029-02-13	2029	2	13	2029-02	1
2029-02-14	2029	2	14	2029-02	1
2029-02-15	2029	2	15	2029-02	1
2029-02-16	2029	2	16	2029-02	1
2029-02-17	2029	2	17	2029-02	1
2029-02-18	2029	2	18	2029-02	1
2029-02-19	2029	2	19	2029-02	1
2029-02-20	2029	2	20	2029-02	1
2029-02-21	2029	2	21	2029-02	1
2029-02-22	2029	2	22	2029-02	1
2029-02-23	2029	2	23	2029-02	1
2029-02-24	2029	2	24	2029-02	1
2029-02-25	2029	2	25	2029-02	1
2029-02-26	2029	2	26	2029-02	1
2029-02-27	2029	2	27	2029-02	1
2029-02-28	2029	2	28	2029-02	1
2029-03-01	2029	3	1	2029-03	1
2029-03-02	2029	3	2	2029-03	1
2029-03-03	2029	3	3	2029-03	1
2029-03-04	2029	3	4	2029-03	1
2029-03-05	2029	3	5	2029-03	1
2029-03-06	2029	3	6	2029-03	1
2029-03-07	2029	3	7	2029-03	1
2029-03-08	2029	3	8	2029-03	1
2029-03-09	2029	3	9	2029-03	1
2029-03-10	2029	3	10	2029-03	1
2029-03-11	2029	3	11	2029-03	1
2029-03-12	2029	3	12	2029-03	1
2029-03-13	2029	3	13	2029-03	1
2029-03-14	2029	3	14	2029-03	1
2029-03-15	2029	3	15	2029-03	1
2029-03-16	2029	3	16	2029-03	1
2029-03-17	2029	3	17	2029-03	1
2029-03-18	2029	3	18	2029-03	1
2029-03-19	2029	3	19	2029-03	1
2029-03-20	2029	3	20	2029-03	1
2029-03-21	2029	3	21	2029-03	1
2029-03-22	2029	3	22	2029-03	1
2029-03-23	2029	3	23	2029-03	1
2029-03-24	2029	3	24	2029-03	1
2029-03-25	2029	3	25	2029-03	1
2029-03-26	2029	3	26	2029-03	1
2029-03-27	2029	3	27	2029-03	1
2029-03-28	2029	3	28	2029-03	1
2029-03-29	2029	3	29	2029-03	1
2029-03-30	2029	3	30	2029-03	1
2029-03-31	2029	3	31	2029-03	1
2029-04-01	2029	4	1	2029-04	2
2029-04-02	2029	4	2	2029-04	2
2029-04-03	2029	4	3	2029-04	2
2029-04-04	2029	4	4	2029-04	2
2029-04-05	2029	4	5	2029-04	2
2029-04-06	2029	4	6	2029-04	2
2029-04-07	2029	4	7	2029-04	2
2029-04-08	2029	4	8	2029-04	2
2029-04-09	2029	4	9	2029-04	2
2029-04-10	2029	4	10	2029-04	2
2029-04-11	2029	4	11	2029-04	2
2029-04-12	2029	4	12	2029-04	2
2029-04-13	2029	4	13	2029-04	2
2029-04-14	2029	4	14	2029-04	2
2029-04-15	2029	4	15	2029-04	2
2029-04-16	2029	4	16	2029-04	2
2029-04-17	2029	4	17	2029-04	2
2029-04-18	2029	4	18	2029-04	2
2029-04-19	2029	4	19	2029-04	2
2029-04-20	2029	4	20	2029-04	2
2029-04-21	2029	4	21	2029-04	2
2029-04-22	2029	4	22	2029-04	2
2029-04-23	2029	4	23	2029-04	2
2029-04-24	2029	4	24	2029-04	2
2029-04-25	2029	4	25	2029-04	2
2029-04-26	2029	4	26	2029-04	2
2029-04-27	2029	4	27	2029-04	2
2029-04-28	2029	4	28	2029-04	2
2029-04-29	2029	4	29	2029-04	2
2029-04-30	2029	4	30	2029-04	2
2029-05-01	2029	5	1	2029-05	2
2029-05-02	2029	5	2	2029-05	2
2029-05-03	2029	5	3	2029-05	2
2029-05-04	2029	5	4	2029-05	2
2029-05-05	2029	5	5	2029-05	2
2029-05-06	2029	5	6	2029-05	2
2029-05-07	2029	5	7	2029-05	2
2029-05-08	2029	5	8	2029-05	2
2029-05-09	2029	5	9	2029-05	2
2029-05-10	2029	5	10	2029-05	2
2029-05-11	2029	5	11	2029-05	2
2029-05-12	2029	5	12	2029-05	2
2029-05-13	2029	5	13	2029-05	2
2029-05-14	2029	5	14	2029-05	2
2029-05-15	2029	5	15	2029-05	2
2029-05-16	2029	5	16	2029-05	2
2029-05-17	2029	5	17	2029-05	2
2029-05-18	2029	5	18	2029-05	2
2029-05-19	2029	5	19	2029-05	2
2029-05-20	2029	5	20	2029-05	2
2029-05-21	2029	5	21	2029-05	2
2029-05-22	2029	5	22	2029-05	2
2029-05-23	2029	5	23	2029-05	2
2029-05-24	2029	5	24	2029-05	2
2029-05-25	2029	5	25	2029-05	2
2029-05-26	2029	5	26	2029-05	2
2029-05-27	2029	5	27	2029-05	2
2029-05-28	2029	5	28	2029-05	2
2029-05-29	2029	5	29	2029-05	2
2029-05-30	2029	5	30	2029-05	2
2029-05-31	2029	5	31	2029-05	2
2029-06-01	2029	6	1	2029-06	2
2029-06-02	2029	6	2	2029-06	2
2029-06-03	2029	6	3	2029-06	2
2029-06-04	2029	6	4	2029-06	2
2029-06-05	2029	6	5	2029-06	2
2029-06-06	2029	6	6	2029-06	2
2029-06-07	2029	6	7	2029-06	2
2029-06-08	2029	6	8	2029-06	2
2029-06-09	2029	6	9	2029-06	2
2029-06-10	2029	6	10	2029-06	2
2029-06-11	2029	6	11	2029-06	2
2029-06-12	2029	6	12	2029-06	2
2029-06-13	2029	6	13	2029-06	2
2029-06-14	2029	6	14	2029-06	2
2029-06-15	2029	6	15	2029-06	2
2029-06-16	2029	6	16	2029-06	2
2029-06-17	2029	6	17	2029-06	2
2029-06-18	2029	6	18	2029-06	2
2029-06-19	2029	6	19	2029-06	2
2029-06-20	2029	6	20	2029-06	2
2029-06-21	2029	6	21	2029-06	2
2029-06-22	2029	6	22	2029-06	2
2029-06-23	2029	6	23	2029-06	2
2029-06-24	2029	6	24	2029-06	2
2029-06-25	2029	6	25	2029-06	2
2029-06-26	2029	6	26	2029-06	2
2029-06-27	2029	6	27	2029-06	2
2029-06-28	2029	6	28	2029-06	2
2029-06-29	2029	6	29	2029-06	2
2029-06-30	2029	6	30	2029-06	2
2029-07-01	2029	7	1	2029-07	3
2029-07-02	2029	7	2	2029-07	3
2029-07-03	2029	7	3	2029-07	3
2029-07-04	2029	7	4	2029-07	3
2029-07-05	2029	7	5	2029-07	3
2029-07-06	2029	7	6	2029-07	3
2029-07-07	2029	7	7	2029-07	3
2029-07-08	2029	7	8	2029-07	3
2029-07-09	2029	7	9	2029-07	3
2029-07-10	2029	7	10	2029-07	3
2029-07-11	2029	7	11	2029-07	3
2029-07-12	2029	7	12	2029-07	3
2029-07-13	2029	7	13	2029-07	3
2029-07-14	2029	7	14	2029-07	3
2029-07-15	2029	7	15	2029-07	3
2029-07-16	2029	7	16	2029-07	3
2029-07-17	2029	7	17	2029-07	3
2029-07-18	2029	7	18	2029-07	3
2029-07-19	2029	7	19	2029-07	3
2029-07-20	2029	7	20	2029-07	3
2029-07-21	2029	7	21	2029-07	3
2029-07-22	2029	7	22	2029-07	3
2029-07-23	2029	7	23	2029-07	3
2029-07-24	2029	7	24	2029-07	3
2029-07-25	2029	7	25	2029-07	3
2029-07-26	2029	7	26	2029-07	3
2029-07-27	2029	7	27	2029-07	3
2029-07-28	2029	7	28	2029-07	3
2029-07-29	2029	7	29	2029-07	3
2029-07-30	2029	7	30	2029-07	3
2029-07-31	2029	7	31	2029-07	3
2029-08-01	2029	8	1	2029-08	3
2029-08-02	2029	8	2	2029-08	3
2029-08-03	2029	8	3	2029-08	3
2029-08-04	2029	8	4	2029-08	3
2029-08-05	2029	8	5	2029-08	3
2029-08-06	2029	8	6	2029-08	3
2029-08-07	2029	8	7	2029-08	3
2029-08-08	2029	8	8	2029-08	3
2029-08-09	2029	8	9	2029-08	3
2029-08-10	2029	8	10	2029-08	3
2029-08-11	2029	8	11	2029-08	3
2029-08-12	2029	8	12	2029-08	3
2029-08-13	2029	8	13	2029-08	3
2029-08-14	2029	8	14	2029-08	3
2029-08-15	2029	8	15	2029-08	3
2029-08-16	2029	8	16	2029-08	3
2029-08-17	2029	8	17	2029-08	3
2029-08-18	2029	8	18	2029-08	3
2029-08-19	2029	8	19	2029-08	3
2029-08-20	2029	8	20	2029-08	3
2029-08-21	2029	8	21	2029-08	3
2029-08-22	2029	8	22	2029-08	3
2029-08-23	2029	8	23	2029-08	3
2029-08-24	2029	8	24	2029-08	3
2029-08-25	2029	8	25	2029-08	3
2029-08-26	2029	8	26	2029-08	3
2029-08-27	2029	8	27	2029-08	3
2029-08-28	2029	8	28	2029-08	3
2029-08-29	2029	8	29	2029-08	3
2029-08-30	2029	8	30	2029-08	3
2029-08-31	2029	8	31	2029-08	3
2029-09-01	2029	9	1	2029-09	3
2029-09-02	2029	9	2	2029-09	3
2029-09-03	2029	9	3	2029-09	3
2029-09-04	2029	9	4	2029-09	3
2029-09-05	2029	9	5	2029-09	3
2029-09-06	2029	9	6	2029-09	3
2029-09-07	2029	9	7	2029-09	3
2029-09-08	2029	9	8	2029-09	3
2029-09-09	2029	9	9	2029-09	3
2029-09-10	2029	9	10	2029-09	3
2029-09-11	2029	9	11	2029-09	3
2029-09-12	2029	9	12	2029-09	3
2029-09-13	2029	9	13	2029-09	3
2029-09-14	2029	9	14	2029-09	3
2029-09-15	2029	9	15	2029-09	3
2029-09-16	2029	9	16	2029-09	3
2029-09-17	2029	9	17	2029-09	3
2029-09-18	2029	9	18	2029-09	3
2029-09-19	2029	9	19	2029-09	3
2029-09-20	2029	9	20	2029-09	3
2029-09-21	2029	9	21	2029-09	3
2029-09-22	2029	9	22	2029-09	3
2029-09-23	2029	9	23	2029-09	3
2029-09-24	2029	9	24	2029-09	3
2029-09-25	2029	9	25	2029-09	3
2029-09-26	2029	9	26	2029-09	3
2029-09-27	2029	9	27	2029-09	3
2029-09-28	2029	9	28	2029-09	3
2029-09-29	2029	9	29	2029-09	3
2029-09-30	2029	9	30	2029-09	3
2029-10-01	2029	10	1	2029-10	4
2029-10-02	2029	10	2	2029-10	4
2029-10-03	2029	10	3	2029-10	4
2029-10-04	2029	10	4	2029-10	4
2029-10-05	2029	10	5	2029-10	4
2029-10-06	2029	10	6	2029-10	4
2029-10-07	2029	10	7	2029-10	4
2029-10-08	2029	10	8	2029-10	4
2029-10-09	2029	10	9	2029-10	4
2029-10-10	2029	10	10	2029-10	4
2029-10-11	2029	10	11	2029-10	4
2029-10-12	2029	10	12	2029-10	4
2029-10-13	2029	10	13	2029-10	4
2029-10-14	2029	10	14	2029-10	4
2029-10-15	2029	10	15	2029-10	4
2029-10-16	2029	10	16	2029-10	4
2029-10-17	2029	10	17	2029-10	4
2029-10-18	2029	10	18	2029-10	4
2029-10-19	2029	10	19	2029-10	4
2029-10-20	2029	10	20	2029-10	4
2029-10-21	2029	10	21	2029-10	4
2029-10-22	2029	10	22	2029-10	4
2029-10-23	2029	10	23	2029-10	4
2029-10-24	2029	10	24	2029-10	4
2029-10-25	2029	10	25	2029-10	4
2029-10-26	2029	10	26	2029-10	4
2029-10-27	2029	10	27	2029-10	4
2029-10-28	2029	10	28	2029-10	4
2029-10-29	2029	10	29	2029-10	4
2029-10-30	2029	10	30	2029-10	4
2029-10-31	2029	10	31	2029-10	4
2029-11-01	2029	11	1	2029-11	4
2029-11-02	2029	11	2	2029-11	4
2029-11-03	2029	11	3	2029-11	4
2029-11-04	2029	11	4	2029-11	4
2029-11-05	2029	11	5	2029-11	4
2029-11-06	2029	11	6	2029-11	4
2029-11-07	2029	11	7	2029-11	4
2029-11-08	2029	11	8	2029-11	4
2029-11-09	2029	11	9	2029-11	4
2029-11-10	2029	11	10	2029-11	4
2029-11-11	2029	11	11	2029-11	4
2029-11-12	2029	11	12	2029-11	4
2029-11-13	2029	11	13	2029-11	4
2029-11-14	2029	11	14	2029-11	4
2029-11-15	2029	11	15	2029-11	4
2029-11-16	2029	11	16	2029-11	4
2029-11-17	2029	11	17	2029-11	4
2029-11-18	2029	11	18	2029-11	4
2029-11-19	2029	11	19	2029-11	4
2029-11-20	2029	11	20	2029-11	4
2029-11-21	2029	11	21	2029-11	4
2029-11-22	2029	11	22	2029-11	4
2029-11-23	2029	11	23	2029-11	4
2029-11-24	2029	11	24	2029-11	4
2029-11-25	2029	11	25	2029-11	4
2029-11-26	2029	11	26	2029-11	4
2029-11-27	2029	11	27	2029-11	4
2029-11-28	2029	11	28	2029-11	4
2029-11-29	2029	11	29	2029-11	4
2029-11-30	2029	11	30	2029-11	4
2029-12-01	2029	12	1	2029-12	4
2029-12-02	2029	12	2	2029-12	4
2029-12-03	2029	12	3	2029-12	4
2029-12-04	2029	12	4	2029-12	4
2029-12-05	2029	12	5	2029-12	4
2029-12-06	2029	12	6	2029-12	4
2029-12-07	2029	12	7	2029-12	4
2029-12-08	2029	12	8	2029-12	4
2029-12-09	2029	12	9	2029-12	4
2029-12-10	2029	12	10	2029-12	4
2029-12-11	2029	12	11	2029-12	4
2029-12-12	2029	12	12	2029-12	4
2029-12-13	2029	12	13	2029-12	4
2029-12-14	2029	12	14	2029-12	4
2029-12-15	2029	12	15	2029-12	4
2029-12-16	2029	12	16	2029-12	4
2029-12-17	2029	12	17	2029-12	4
2029-12-18	2029	12	18	2029-12	4
2029-12-19	2029	12	19	2029-12	4
2029-12-20	2029	12	20	2029-12	4
2029-12-21	2029	12	21	2029-12	4
2029-12-22	2029	12	22	2029-12	4
2029-12-23	2029	12	23	2029-12	4
2029-12-24	2029	12	24	2029-12	4
2029-12-25	2029	12	25	2029-12	4
2029-12-26	2029	12	26	2029-12	4
2029-12-27	2029	12	27	2029-12	4
2029-12-28	2029	12	28	2029-12	4
2029-12-29	2029	12	29	2029-12	4
2029-12-30	2029	12	30	2029-12	4
2029-12-31	2029	12	31	2029-12	4
2030-01-01	2030	1	1	2030-01	1
2030-01-02	2030	1	2	2030-01	1
2030-01-03	2030	1	3	2030-01	1
2030-01-04	2030	1	4	2030-01	1
2030-01-05	2030	1	5	2030-01	1
2030-01-06	2030	1	6	2030-01	1
2030-01-07	2030	1	7	2030-01	1
2030-01-08	2030	1	8	2030-01	1
2030-01-09	2030	1	9	2030-01	1
2030-01-10	2030	1	10	2030-01	1
2030-01-11	2030	1	11	2030-01	1
2030-01-12	2030	1	12	2030-01	1
2030-01-13	2030	1	13	2030-01	1
2030-01-14	2030	1	14	2030-01	1
2030-01-15	2030	1	15	2030-01	1
2030-01-16	2030	1	16	2030-01	1
2030-01-17	2030	1	17	2030-01	1
2030-01-18	2030	1	18	2030-01	1
2030-01-19	2030	1	19	2030-01	1
2030-01-20	2030	1	20	2030-01	1
2030-01-21	2030	1	21	2030-01	1
2030-01-22	2030	1	22	2030-01	1
2030-01-23	2030	1	23	2030-01	1
2030-01-24	2030	1	24	2030-01	1
2030-01-25	2030	1	25	2030-01	1
2030-01-26	2030	1	26	2030-01	1
2030-01-27	2030	1	27	2030-01	1
2030-01-28	2030	1	28	2030-01	1
2030-01-29	2030	1	29	2030-01	1
2030-01-30	2030	1	30	2030-01	1
2030-01-31	2030	1	31	2030-01	1
2030-02-01	2030	2	1	2030-02	1
2030-02-02	2030	2	2	2030-02	1
2030-02-03	2030	2	3	2030-02	1
2030-02-04	2030	2	4	2030-02	1
2030-02-05	2030	2	5	2030-02	1
2030-02-06	2030	2	6	2030-02	1
2030-02-07	2030	2	7	2030-02	1
2030-02-08	2030	2	8	2030-02	1
2030-02-09	2030	2	9	2030-02	1
2030-02-10	2030	2	10	2030-02	1
2030-02-11	2030	2	11	2030-02	1
2030-02-12	2030	2	12	2030-02	1
2030-02-13	2030	2	13	2030-02	1
2030-02-14	2030	2	14	2030-02	1
2030-02-15	2030	2	15	2030-02	1
2030-02-16	2030	2	16	2030-02	1
2030-02-17	2030	2	17	2030-02	1
2030-02-18	2030	2	18	2030-02	1
2030-02-19	2030	2	19	2030-02	1
2030-02-20	2030	2	20	2030-02	1
2030-02-21	2030	2	21	2030-02	1
2030-02-22	2030	2	22	2030-02	1
2030-02-23	2030	2	23	2030-02	1
2030-02-24	2030	2	24	2030-02	1
2030-02-25	2030	2	25	2030-02	1
2030-02-26	2030	2	26	2030-02	1
2030-02-27	2030	2	27	2030-02	1
2030-02-28	2030	2	28	2030-02	1
2030-03-01	2030	3	1	2030-03	1
2030-03-02	2030	3	2	2030-03	1
2030-03-03	2030	3	3	2030-03	1
2030-03-04	2030	3	4	2030-03	1
2030-03-05	2030	3	5	2030-03	1
2030-03-06	2030	3	6	2030-03	1
2030-03-07	2030	3	7	2030-03	1
2030-03-08	2030	3	8	2030-03	1
2030-03-09	2030	3	9	2030-03	1
2030-03-10	2030	3	10	2030-03	1
2030-03-11	2030	3	11	2030-03	1
2030-03-12	2030	3	12	2030-03	1
2030-03-13	2030	3	13	2030-03	1
2030-03-14	2030	3	14	2030-03	1
2030-03-15	2030	3	15	2030-03	1
2030-03-16	2030	3	16	2030-03	1
2030-03-17	2030	3	17	2030-03	1
2030-03-18	2030	3	18	2030-03	1
2030-03-19	2030	3	19	2030-03	1
2030-03-20	2030	3	20	2030-03	1
2030-03-21	2030	3	21	2030-03	1
2030-03-22	2030	3	22	2030-03	1
2030-03-23	2030	3	23	2030-03	1
2030-03-24	2030	3	24	2030-03	1
2030-03-25	2030	3	25	2030-03	1
2030-03-26	2030	3	26	2030-03	1
2030-03-27	2030	3	27	2030-03	1
2030-03-28	2030	3	28	2030-03	1
2030-03-29	2030	3	29	2030-03	1
2030-03-30	2030	3	30	2030-03	1
2030-03-31	2030	3	31	2030-03	1
2030-04-01	2030	4	1	2030-04	2
2030-04-02	2030	4	2	2030-04	2
2030-04-03	2030	4	3	2030-04	2
2030-04-04	2030	4	4	2030-04	2
2030-04-05	2030	4	5	2030-04	2
2030-04-06	2030	4	6	2030-04	2
2030-04-07	2030	4	7	2030-04	2
2030-04-08	2030	4	8	2030-04	2
2030-04-09	2030	4	9	2030-04	2
2030-04-10	2030	4	10	2030-04	2
2030-04-11	2030	4	11	2030-04	2
2030-04-12	2030	4	12	2030-04	2
2030-04-13	2030	4	13	2030-04	2
2030-04-14	2030	4	14	2030-04	2
2030-04-15	2030	4	15	2030-04	2
2030-04-16	2030	4	16	2030-04	2
2030-04-17	2030	4	17	2030-04	2
2030-04-18	2030	4	18	2030-04	2
2030-04-19	2030	4	19	2030-04	2
2030-04-20	2030	4	20	2030-04	2
2030-04-21	2030	4	21	2030-04	2
2030-04-22	2030	4	22	2030-04	2
2030-04-23	2030	4	23	2030-04	2
2030-04-24	2030	4	24	2030-04	2
2030-04-25	2030	4	25	2030-04	2
2030-04-26	2030	4	26	2030-04	2
2030-04-27	2030	4	27	2030-04	2
2030-04-28	2030	4	28	2030-04	2
2030-04-29	2030	4	29	2030-04	2
2030-04-30	2030	4	30	2030-04	2
2030-05-01	2030	5	1	2030-05	2
2030-05-02	2030	5	2	2030-05	2
2030-05-03	2030	5	3	2030-05	2
2030-05-04	2030	5	4	2030-05	2
2030-05-05	2030	5	5	2030-05	2
2030-05-06	2030	5	6	2030-05	2
2030-05-07	2030	5	7	2030-05	2
2030-05-08	2030	5	8	2030-05	2
2030-05-09	2030	5	9	2030-05	2
2030-05-10	2030	5	10	2030-05	2
2030-05-11	2030	5	11	2030-05	2
2030-05-12	2030	5	12	2030-05	2
2030-05-13	2030	5	13	2030-05	2
2030-05-14	2030	5	14	2030-05	2
2030-05-15	2030	5	15	2030-05	2
2030-05-16	2030	5	16	2030-05	2
2030-05-17	2030	5	17	2030-05	2
2030-05-18	2030	5	18	2030-05	2
2030-05-19	2030	5	19	2030-05	2
2030-05-20	2030	5	20	2030-05	2
2030-05-21	2030	5	21	2030-05	2
2030-05-22	2030	5	22	2030-05	2
2030-05-23	2030	5	23	2030-05	2
2030-05-24	2030	5	24	2030-05	2
2030-05-25	2030	5	25	2030-05	2
2030-05-26	2030	5	26	2030-05	2
2030-05-27	2030	5	27	2030-05	2
2030-05-28	2030	5	28	2030-05	2
2030-05-29	2030	5	29	2030-05	2
2030-05-30	2030	5	30	2030-05	2
2030-05-31	2030	5	31	2030-05	2
2030-06-01	2030	6	1	2030-06	2
2030-06-02	2030	6	2	2030-06	2
2030-06-03	2030	6	3	2030-06	2
2030-06-04	2030	6	4	2030-06	2
2030-06-05	2030	6	5	2030-06	2
2030-06-06	2030	6	6	2030-06	2
2030-06-07	2030	6	7	2030-06	2
2030-06-08	2030	6	8	2030-06	2
2030-06-09	2030	6	9	2030-06	2
2030-06-10	2030	6	10	2030-06	2
2030-06-11	2030	6	11	2030-06	2
2030-06-12	2030	6	12	2030-06	2
2030-06-13	2030	6	13	2030-06	2
2030-06-14	2030	6	14	2030-06	2
2030-06-15	2030	6	15	2030-06	2
2030-06-16	2030	6	16	2030-06	2
2030-06-17	2030	6	17	2030-06	2
2030-06-18	2030	6	18	2030-06	2
2030-06-19	2030	6	19	2030-06	2
2030-06-20	2030	6	20	2030-06	2
2030-06-21	2030	6	21	2030-06	2
2030-06-22	2030	6	22	2030-06	2
2030-06-23	2030	6	23	2030-06	2
2030-06-24	2030	6	24	2030-06	2
2030-06-25	2030	6	25	2030-06	2
2030-06-26	2030	6	26	2030-06	2
2030-06-27	2030	6	27	2030-06	2
2030-06-28	2030	6	28	2030-06	2
2030-06-29	2030	6	29	2030-06	2
2030-06-30	2030	6	30	2030-06	2
2030-07-01	2030	7	1	2030-07	3
2030-07-02	2030	7	2	2030-07	3
2030-07-03	2030	7	3	2030-07	3
2030-07-04	2030	7	4	2030-07	3
2030-07-05	2030	7	5	2030-07	3
2030-07-06	2030	7	6	2030-07	3
2030-07-07	2030	7	7	2030-07	3
2030-07-08	2030	7	8	2030-07	3
2030-07-09	2030	7	9	2030-07	3
2030-07-10	2030	7	10	2030-07	3
2030-07-11	2030	7	11	2030-07	3
2030-07-12	2030	7	12	2030-07	3
2030-07-13	2030	7	13	2030-07	3
2030-07-14	2030	7	14	2030-07	3
2030-07-15	2030	7	15	2030-07	3
2030-07-16	2030	7	16	2030-07	3
2030-07-17	2030	7	17	2030-07	3
2030-07-18	2030	7	18	2030-07	3
2030-07-19	2030	7	19	2030-07	3
2030-07-20	2030	7	20	2030-07	3
2030-07-21	2030	7	21	2030-07	3
2030-07-22	2030	7	22	2030-07	3
2030-07-23	2030	7	23	2030-07	3
2030-07-24	2030	7	24	2030-07	3
2030-07-25	2030	7	25	2030-07	3
2030-07-26	2030	7	26	2030-07	3
2030-07-27	2030	7	27	2030-07	3
2030-07-28	2030	7	28	2030-07	3
2030-07-29	2030	7	29	2030-07	3
2030-07-30	2030	7	30	2030-07	3
2030-07-31	2030	7	31	2030-07	3
2030-08-01	2030	8	1	2030-08	3
2030-08-02	2030	8	2	2030-08	3
2030-08-03	2030	8	3	2030-08	3
2030-08-04	2030	8	4	2030-08	3
2030-08-05	2030	8	5	2030-08	3
2030-08-06	2030	8	6	2030-08	3
2030-08-07	2030	8	7	2030-08	3
2030-08-08	2030	8	8	2030-08	3
2030-08-09	2030	8	9	2030-08	3
2030-08-10	2030	8	10	2030-08	3
2030-08-11	2030	8	11	2030-08	3
2030-08-12	2030	8	12	2030-08	3
2030-08-13	2030	8	13	2030-08	3
2030-08-14	2030	8	14	2030-08	3
2030-08-15	2030	8	15	2030-08	3
2030-08-16	2030	8	16	2030-08	3
2030-08-17	2030	8	17	2030-08	3
2030-08-18	2030	8	18	2030-08	3
2030-08-19	2030	8	19	2030-08	3
2030-08-20	2030	8	20	2030-08	3
2030-08-21	2030	8	21	2030-08	3
2030-08-22	2030	8	22	2030-08	3
2030-08-23	2030	8	23	2030-08	3
2030-08-24	2030	8	24	2030-08	3
2030-08-25	2030	8	25	2030-08	3
2030-08-26	2030	8	26	2030-08	3
2030-08-27	2030	8	27	2030-08	3
2030-08-28	2030	8	28	2030-08	3
2030-08-29	2030	8	29	2030-08	3
2030-08-30	2030	8	30	2030-08	3
2030-08-31	2030	8	31	2030-08	3
2030-09-01	2030	9	1	2030-09	3
2030-09-02	2030	9	2	2030-09	3
2030-09-03	2030	9	3	2030-09	3
2030-09-04	2030	9	4	2030-09	3
2030-09-05	2030	9	5	2030-09	3
2030-09-06	2030	9	6	2030-09	3
2030-09-07	2030	9	7	2030-09	3
2030-09-08	2030	9	8	2030-09	3
2030-09-09	2030	9	9	2030-09	3
2030-09-10	2030	9	10	2030-09	3
2030-09-11	2030	9	11	2030-09	3
2030-09-12	2030	9	12	2030-09	3
2030-09-13	2030	9	13	2030-09	3
2030-09-14	2030	9	14	2030-09	3
2030-09-15	2030	9	15	2030-09	3
2030-09-16	2030	9	16	2030-09	3
2030-09-17	2030	9	17	2030-09	3
2030-09-18	2030	9	18	2030-09	3
2030-09-19	2030	9	19	2030-09	3
2030-09-20	2030	9	20	2030-09	3
2030-09-21	2030	9	21	2030-09	3
2030-09-22	2030	9	22	2030-09	3
2030-09-23	2030	9	23	2030-09	3
2030-09-24	2030	9	24	2030-09	3
2030-09-25	2030	9	25	2030-09	3
2030-09-26	2030	9	26	2030-09	3
2030-09-27	2030	9	27	2030-09	3
2030-09-28	2030	9	28	2030-09	3
2030-09-29	2030	9	29	2030-09	3
2030-09-30	2030	9	30	2030-09	3
2030-10-01	2030	10	1	2030-10	4
2030-10-02	2030	10	2	2030-10	4
2030-10-03	2030	10	3	2030-10	4
2030-10-04	2030	10	4	2030-10	4
2030-10-05	2030	10	5	2030-10	4
2030-10-06	2030	10	6	2030-10	4
2030-10-07	2030	10	7	2030-10	4
2030-10-08	2030	10	8	2030-10	4
2030-10-09	2030	10	9	2030-10	4
2030-10-10	2030	10	10	2030-10	4
2030-10-11	2030	10	11	2030-10	4
2030-10-12	2030	10	12	2030-10	4
2030-10-13	2030	10	13	2030-10	4
2030-10-14	2030	10	14	2030-10	4
2030-10-15	2030	10	15	2030-10	4
2030-10-16	2030	10	16	2030-10	4
2030-10-17	2030	10	17	2030-10	4
2030-10-18	2030	10	18	2030-10	4
2030-10-19	2030	10	19	2030-10	4
2030-10-20	2030	10	20	2030-10	4
2030-10-21	2030	10	21	2030-10	4
2030-10-22	2030	10	22	2030-10	4
2030-10-23	2030	10	23	2030-10	4
2030-10-24	2030	10	24	2030-10	4
2030-10-25	2030	10	25	2030-10	4
2030-10-26	2030	10	26	2030-10	4
2030-10-27	2030	10	27	2030-10	4
2030-10-28	2030	10	28	2030-10	4
2030-10-29	2030	10	29	2030-10	4
2030-10-30	2030	10	30	2030-10	4
2030-10-31	2030	10	31	2030-10	4
2030-11-01	2030	11	1	2030-11	4
2030-11-02	2030	11	2	2030-11	4
2030-11-03	2030	11	3	2030-11	4
2030-11-04	2030	11	4	2030-11	4
2030-11-05	2030	11	5	2030-11	4
2030-11-06	2030	11	6	2030-11	4
2030-11-07	2030	11	7	2030-11	4
2030-11-08	2030	11	8	2030-11	4
2030-11-09	2030	11	9	2030-11	4
2030-11-10	2030	11	10	2030-11	4
2030-11-11	2030	11	11	2030-11	4
2030-11-12	2030	11	12	2030-11	4
2030-11-13	2030	11	13	2030-11	4
2030-11-14	2030	11	14	2030-11	4
2030-11-15	2030	11	15	2030-11	4
2030-11-16	2030	11	16	2030-11	4
2030-11-17	2030	11	17	2030-11	4
2030-11-18	2030	11	18	2030-11	4
2030-11-19	2030	11	19	2030-11	4
2030-11-20	2030	11	20	2030-11	4
2030-11-21	2030	11	21	2030-11	4
2030-11-22	2030	11	22	2030-11	4
2030-11-23	2030	11	23	2030-11	4
2030-11-24	2030	11	24	2030-11	4
2030-11-25	2030	11	25	2030-11	4
2030-11-26	2030	11	26	2030-11	4
2030-11-27	2030	11	27	2030-11	4
2030-11-28	2030	11	28	2030-11	4
2030-11-29	2030	11	29	2030-11	4
2030-11-30	2030	11	30	2030-11	4
2030-12-01	2030	12	1	2030-12	4
2030-12-02	2030	12	2	2030-12	4
2030-12-03	2030	12	3	2030-12	4
2030-12-04	2030	12	4	2030-12	4
2030-12-05	2030	12	5	2030-12	4
2030-12-06	2030	12	6	2030-12	4
2030-12-07	2030	12	7	2030-12	4
2030-12-08	2030	12	8	2030-12	4
2030-12-09	2030	12	9	2030-12	4
2030-12-10	2030	12	10	2030-12	4
2030-12-11	2030	12	11	2030-12	4
2030-12-12	2030	12	12	2030-12	4
2030-12-13	2030	12	13	2030-12	4
2030-12-14	2030	12	14	2030-12	4
2030-12-15	2030	12	15	2030-12	4
2030-12-16	2030	12	16	2030-12	4
2030-12-17	2030	12	17	2030-12	4
2030-12-18	2030	12	18	2030-12	4
2030-12-19	2030	12	19	2030-12	4
2030-12-20	2030	12	20	2030-12	4
2030-12-21	2030	12	21	2030-12	4
2030-12-22	2030	12	22	2030-12	4
2030-12-23	2030	12	23	2030-12	4
2030-12-24	2030	12	24	2030-12	4
2030-12-25	2030	12	25	2030-12	4
2030-12-26	2030	12	26	2030-12	4
2030-12-27	2030	12	27	2030-12	4
2030-12-28	2030	12	28	2030-12	4
2030-12-29	2030	12	29	2030-12	4
2030-12-30	2030	12	30	2030-12	4
2030-12-31	2030	12	31	2030-12	4
\.


--
-- Data for Name: dim_severity; Type: TABLE DATA; Schema: reporting; Owner: postgres
--

COPY reporting.dim_severity (severity_key, severity_code, severity_weight, severity_rank) FROM stdin;
1	LOW	1	1
2	MEDIUM	2	2
3	HIGH	3	3
4	CRITICAL	5	4
\.


--
-- Data for Name: dim_status; Type: TABLE DATA; Schema: reporting; Owner: postgres
--

COPY reporting.dim_status (status_key, status_code, status_category) FROM stdin;
1	PASS	SUCCESS
2	FAIL	FAILURE
3	ERROR	FAILURE
4	BLOCKED	CRITICAL
\.


--
-- Name: batch_anomaly_analysis_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.batch_anomaly_analysis_id_seq', 1, false);


--
-- Name: batch_intelligence_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.batch_intelligence_id_seq', 1, false);


--
-- Name: control_persistence_analysis_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.control_persistence_analysis_id_seq', 1, false);


--
-- Name: governance_config_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.governance_config_id_seq', 1, true);


--
-- Name: governance_config_id_seq1; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.governance_config_id_seq1', 1, true);


--
-- Name: governance_config_id_seq2; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.governance_config_id_seq2', 1, true);


--
-- Name: migration_batch_summary_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.migration_batch_summary_id_seq', 10, true);


--
-- Name: migration_control_exceptions_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.migration_control_exceptions_id_seq', 39, true);


--
-- Name: migration_control_execution_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.migration_control_execution_id_seq', 300, true);


--
-- Name: migration_control_summary_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.migration_control_summary_id_seq', 118, true);


--
-- Name: migration_release_decision_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.migration_release_decision_id_seq', 10, true);


--
-- Name: rule_anomaly_history_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.rule_anomaly_history_id_seq', 1, false);


--
-- Name: rule_execution_statistics_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.rule_execution_statistics_id_seq', 1, false);


--
-- Name: rule_parameter_metadata_id_seq; Type: SEQUENCE SET; Schema: engine; Owner: postgres
--

SELECT pg_catalog.setval('engine.rule_parameter_metadata_id_seq', 3, true);


--
-- Name: control_executions_execution_id_seq; Type: SEQUENCE SET; Schema: engine_v14; Owner: postgres
--

SELECT pg_catalog.setval('engine_v14.control_executions_execution_id_seq', 1, false);


--
-- Name: dim_severity_severity_key_seq; Type: SEQUENCE SET; Schema: reporting; Owner: postgres
--

SELECT pg_catalog.setval('reporting.dim_severity_severity_key_seq', 4, true);


--
-- Name: dim_status_status_key_seq; Type: SEQUENCE SET; Schema: reporting; Owner: postgres
--

SELECT pg_catalog.setval('reporting.dim_status_status_key_seq', 4, true);


--
-- Name: column_mappings column_mappings_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.column_mappings
    ADD CONSTRAINT column_mappings_pkey PRIMARY KEY (column_mapping_id);


--
-- Name: dataset_columns dataset_columns_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_columns
    ADD CONSTRAINT dataset_columns_pkey PRIMARY KEY (column_id);


--
-- Name: dataset_mappings dataset_mappings_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_mappings
    ADD CONSTRAINT dataset_mappings_pkey PRIMARY KEY (mapping_id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (dataset_id);


--
-- Name: datasets datasets_system_id_schema_name_table_name_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.datasets
    ADD CONSTRAINT datasets_system_id_schema_name_table_name_key UNIQUE (system_id, schema_name, table_name);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: projects projects_tenant_id_project_name_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.projects
    ADD CONSTRAINT projects_tenant_id_project_name_key UNIQUE (tenant_id, project_name);


--
-- Name: rule_dataset_mapping rule_dataset_mapping_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.rule_dataset_mapping
    ADD CONSTRAINT rule_dataset_mapping_pkey PRIMARY KEY (id);


--
-- Name: system_registry system_registry_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.system_registry
    ADD CONSTRAINT system_registry_pkey PRIMARY KEY (system_id);


--
-- Name: system_registry system_registry_project_id_system_name_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.system_registry
    ADD CONSTRAINT system_registry_project_id_system_name_key UNIQUE (project_id, system_name);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);


--
-- Name: tenants tenants_tenant_name_key; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.tenants
    ADD CONSTRAINT tenants_tenant_name_key UNIQUE (tenant_name);


--
-- Name: column_mappings uq_column_pair; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.column_mappings
    ADD CONSTRAINT uq_column_pair UNIQUE (mapping_id, source_column_id, target_column_id);


--
-- Name: dataset_columns uq_mapping_column; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_columns
    ADD CONSTRAINT uq_mapping_column UNIQUE (mapping_id, column_name, column_side);


--
-- Name: dataset_mappings uq_project_source_target; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_mappings
    ADD CONSTRAINT uq_project_source_target UNIQUE (project_id, source_schema, source_table, target_schema, target_table);


--
-- Name: rule_dataset_mapping uq_rule_mapping; Type: CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.rule_dataset_mapping
    ADD CONSTRAINT uq_rule_mapping UNIQUE (rule_id, mapping_id);


--
-- Name: batch_anomaly_analysis batch_anomaly_analysis_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.batch_anomaly_analysis
    ADD CONSTRAINT batch_anomaly_analysis_pkey PRIMARY KEY (id);


--
-- Name: batch_intelligence batch_intelligence_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.batch_intelligence
    ADD CONSTRAINT batch_intelligence_pkey PRIMARY KEY (id);


--
-- Name: control_persistence_analysis control_persistence_analysis_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.control_persistence_analysis
    ADD CONSTRAINT control_persistence_analysis_pkey PRIMARY KEY (id);


--
-- Name: control_registry control_registry_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.control_registry
    ADD CONSTRAINT control_registry_pkey PRIMARY KEY (control_id);


--
-- Name: dataset_mappings_OLD dataset_mappings_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."dataset_mappings_OLD"
    ADD CONSTRAINT dataset_mappings_pkey PRIMARY KEY (mapping_id);


--
-- Name: governance_config_OLD governance_config_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."governance_config_OLD"
    ADD CONSTRAINT governance_config_pkey PRIMARY KEY (id);


--
-- Name: governance_config_OLD_1 governance_config_pkey1; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."governance_config_OLD_1"
    ADD CONSTRAINT governance_config_pkey1 PRIMARY KEY (id);


--
-- Name: governance_config governance_config_pkey2; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.governance_config
    ADD CONSTRAINT governance_config_pkey2 PRIMARY KEY (id);


--
-- Name: migration_batch_intelligence_OLD migration_batch_intelligence_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."migration_batch_intelligence_OLD"
    ADD CONSTRAINT migration_batch_intelligence_pkey PRIMARY KEY (batch_id);


--
-- Name: migration_batch_intelligence migration_batch_intelligence_pkey1; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_batch_intelligence
    ADD CONSTRAINT migration_batch_intelligence_pkey1 PRIMARY KEY (batch_id);


--
-- Name: migration_batch_summary migration_batch_summary_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_batch_summary
    ADD CONSTRAINT migration_batch_summary_pkey PRIMARY KEY (id);


--
-- Name: migration_control_exceptions migration_control_exceptions_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_exceptions
    ADD CONSTRAINT migration_control_exceptions_pkey PRIMARY KEY (id);


--
-- Name: migration_control_execution_OLD migration_control_execution_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."migration_control_execution_OLD"
    ADD CONSTRAINT migration_control_execution_pkey PRIMARY KEY (execution_id);


--
-- Name: migration_control_execution migration_control_execution_pkey1; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_execution
    ADD CONSTRAINT migration_control_execution_pkey1 PRIMARY KEY (id);


--
-- Name: migration_control_summary migration_control_summary_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_summary
    ADD CONSTRAINT migration_control_summary_pkey PRIMARY KEY (id);


--
-- Name: migration_exception_register migration_exception_register_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_exception_register
    ADD CONSTRAINT migration_exception_register_pkey PRIMARY KEY (exception_id);


--
-- Name: migration_release_decision migration_release_decision_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_release_decision
    ADD CONSTRAINT migration_release_decision_pkey PRIMARY KEY (id);


--
-- Name: migration_validation_batch migration_validation_batch_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_validation_batch
    ADD CONSTRAINT migration_validation_batch_pkey PRIMARY KEY (batch_id);


--
-- Name: projects_OLD projects_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."projects_OLD"
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: rule_anomaly_history rule_anomaly_history_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_anomaly_history
    ADD CONSTRAINT rule_anomaly_history_pkey PRIMARY KEY (id);


--
-- Name: rule_execution_statistics rule_execution_statistics_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_execution_statistics
    ADD CONSTRAINT rule_execution_statistics_pkey PRIMARY KEY (id);


--
-- Name: rule_parameter_metadata_legacy rule_parameter_metadata_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_parameter_metadata_legacy
    ADD CONSTRAINT rule_parameter_metadata_pkey PRIMARY KEY (id);


--
-- Name: rule_registry rule_registry_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_registry
    ADD CONSTRAINT rule_registry_pkey PRIMARY KEY (rule_id);


--
-- Name: rule_weight_config rule_weight_config_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_weight_config
    ADD CONSTRAINT rule_weight_config_pkey PRIMARY KEY (rule_id);


--
-- Name: rule_weights rule_weights_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_weights
    ADD CONSTRAINT rule_weights_pkey PRIMARY KEY (rule_id);


--
-- Name: system_registry_OLD system_registry_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."system_registry_OLD"
    ADD CONSTRAINT system_registry_pkey PRIMARY KEY (system_id);


--
-- Name: tenants_OLD tenants_pkey; Type: CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."tenants_OLD"
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);


--
-- Name: batch_intelligence batch_intelligence_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.batch_intelligence
    ADD CONSTRAINT batch_intelligence_pkey PRIMARY KEY (batch_id);


--
-- Name: batch_runs batch_runs_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.batch_runs
    ADD CONSTRAINT batch_runs_pkey PRIMARY KEY (batch_id);


--
-- Name: column_mappings column_mappings_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.column_mappings
    ADD CONSTRAINT column_mappings_pkey PRIMARY KEY (column_mapping_id);


--
-- Name: control_executions control_executions_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.control_executions
    ADD CONSTRAINT control_executions_pkey PRIMARY KEY (execution_id);


--
-- Name: dataset_columns dataset_columns_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.dataset_columns
    ADD CONSTRAINT dataset_columns_pkey PRIMARY KEY (column_id);


--
-- Name: dataset_mappings dataset_mappings_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.dataset_mappings
    ADD CONSTRAINT dataset_mappings_pkey PRIMARY KEY (mapping_id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (dataset_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: systems systems_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.systems
    ADD CONSTRAINT systems_pkey PRIMARY KEY (system_id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id);


--
-- Name: dim_severity dim_severity_pkey; Type: CONSTRAINT; Schema: reporting; Owner: postgres
--

ALTER TABLE ONLY reporting.dim_severity
    ADD CONSTRAINT dim_severity_pkey PRIMARY KEY (severity_key);


--
-- Name: dim_severity dim_severity_severity_code_key; Type: CONSTRAINT; Schema: reporting; Owner: postgres
--

ALTER TABLE ONLY reporting.dim_severity
    ADD CONSTRAINT dim_severity_severity_code_key UNIQUE (severity_code);


--
-- Name: dim_status dim_status_pkey; Type: CONSTRAINT; Schema: reporting; Owner: postgres
--

ALTER TABLE ONLY reporting.dim_status
    ADD CONSTRAINT dim_status_pkey PRIMARY KEY (status_key);


--
-- Name: dim_status dim_status_status_code_key; Type: CONSTRAINT; Schema: reporting; Owner: postgres
--

ALTER TABLE ONLY reporting.dim_status
    ADD CONSTRAINT dim_status_status_code_key UNIQUE (status_code);


--
-- Name: dataset_columns dataset_columns_mapping_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_columns
    ADD CONSTRAINT dataset_columns_mapping_id_fkey FOREIGN KEY (mapping_id) REFERENCES core.dataset_mappings(mapping_id) ON DELETE CASCADE;


--
-- Name: dataset_mappings dataset_mappings_project_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_mappings
    ADD CONSTRAINT dataset_mappings_project_id_fkey FOREIGN KEY (project_id) REFERENCES core.projects(project_id) ON DELETE CASCADE;


--
-- Name: dataset_mappings dataset_mappings_source_system_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_mappings
    ADD CONSTRAINT dataset_mappings_source_system_id_fkey FOREIGN KEY (source_system_id) REFERENCES core.system_registry(system_id);


--
-- Name: dataset_mappings dataset_mappings_target_system_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.dataset_mappings
    ADD CONSTRAINT dataset_mappings_target_system_id_fkey FOREIGN KEY (target_system_id) REFERENCES core.system_registry(system_id);


--
-- Name: datasets datasets_system_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.datasets
    ADD CONSTRAINT datasets_system_id_fkey FOREIGN KEY (system_id) REFERENCES core.system_registry(system_id) ON DELETE CASCADE;


--
-- Name: column_mappings fk_column_mapping_mapping; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.column_mappings
    ADD CONSTRAINT fk_column_mapping_mapping FOREIGN KEY (mapping_id) REFERENCES core.dataset_mappings(mapping_id) ON DELETE CASCADE;


--
-- Name: rule_dataset_mapping fk_rule_dataset_mapping; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.rule_dataset_mapping
    ADD CONSTRAINT fk_rule_dataset_mapping FOREIGN KEY (mapping_id) REFERENCES core.dataset_mappings(mapping_id) ON DELETE CASCADE;


--
-- Name: column_mappings fk_source_column; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.column_mappings
    ADD CONSTRAINT fk_source_column FOREIGN KEY (source_column_id) REFERENCES core.dataset_columns(column_id) ON DELETE CASCADE;


--
-- Name: column_mappings fk_target_column; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.column_mappings
    ADD CONSTRAINT fk_target_column FOREIGN KEY (target_column_id) REFERENCES core.dataset_columns(column_id) ON DELETE CASCADE;


--
-- Name: projects projects_tenant_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.projects
    ADD CONSTRAINT projects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES core.tenants(tenant_id) ON DELETE CASCADE;


--
-- Name: system_registry system_registry_project_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: postgres
--

ALTER TABLE ONLY core.system_registry
    ADD CONSTRAINT system_registry_project_id_fkey FOREIGN KEY (project_id) REFERENCES core.projects(project_id) ON DELETE CASCADE;


--
-- Name: control_registry control_registry_project_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.control_registry
    ADD CONSTRAINT control_registry_project_id_fkey FOREIGN KEY (project_id) REFERENCES core.projects(project_id);


--
-- Name: dataset_mappings_OLD dataset_mappings_project_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."dataset_mappings_OLD"
    ADD CONSTRAINT dataset_mappings_project_id_fkey FOREIGN KEY (project_id) REFERENCES engine."projects_OLD"(project_id);


--
-- Name: dataset_mappings_OLD dataset_mappings_source_system_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."dataset_mappings_OLD"
    ADD CONSTRAINT dataset_mappings_source_system_id_fkey FOREIGN KEY (source_system_id) REFERENCES engine."system_registry_OLD"(system_id);


--
-- Name: dataset_mappings_OLD dataset_mappings_target_system_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."dataset_mappings_OLD"
    ADD CONSTRAINT dataset_mappings_target_system_id_fkey FOREIGN KEY (target_system_id) REFERENCES engine."system_registry_OLD"(system_id);


--
-- Name: migration_batch_summary fk_batch_summary_project; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_batch_summary
    ADD CONSTRAINT fk_batch_summary_project FOREIGN KEY (project_id) REFERENCES core.projects(project_id) ON DELETE CASCADE;


--
-- Name: migration_control_execution fk_mapping; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.migration_control_execution
    ADD CONSTRAINT fk_mapping FOREIGN KEY (mapping_id) REFERENCES core.dataset_mappings(mapping_id) ON DELETE SET NULL;


--
-- Name: projects_OLD projects_tenant_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."projects_OLD"
    ADD CONSTRAINT projects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES engine."tenants_OLD"(tenant_id);


--
-- Name: rule_parameter_metadata_legacy rule_parameter_metadata_rule_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_parameter_metadata_legacy
    ADD CONSTRAINT rule_parameter_metadata_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES engine.rule_registry(rule_id);


--
-- Name: rule_registry rule_registry_control_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine.rule_registry
    ADD CONSTRAINT rule_registry_control_id_fkey FOREIGN KEY (control_id) REFERENCES engine.control_registry(control_id);


--
-- Name: system_registry_OLD system_registry_tenant_id_fkey; Type: FK CONSTRAINT; Schema: engine; Owner: postgres
--

ALTER TABLE ONLY engine."system_registry_OLD"
    ADD CONSTRAINT system_registry_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES engine."tenants_OLD"(tenant_id);


--
-- Name: batch_intelligence batch_intelligence_batch_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.batch_intelligence
    ADD CONSTRAINT batch_intelligence_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES engine_v14.batch_runs(batch_id);


--
-- Name: batch_runs batch_runs_project_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.batch_runs
    ADD CONSTRAINT batch_runs_project_id_fkey FOREIGN KEY (project_id) REFERENCES engine_v14.projects(project_id);


--
-- Name: column_mappings column_mappings_mapping_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.column_mappings
    ADD CONSTRAINT column_mappings_mapping_id_fkey FOREIGN KEY (mapping_id) REFERENCES engine_v14.dataset_mappings(mapping_id);


--
-- Name: column_mappings column_mappings_source_column_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.column_mappings
    ADD CONSTRAINT column_mappings_source_column_id_fkey FOREIGN KEY (source_column_id) REFERENCES engine_v14.dataset_columns(column_id);


--
-- Name: column_mappings column_mappings_target_column_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.column_mappings
    ADD CONSTRAINT column_mappings_target_column_id_fkey FOREIGN KEY (target_column_id) REFERENCES engine_v14.dataset_columns(column_id);


--
-- Name: control_executions control_executions_batch_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.control_executions
    ADD CONSTRAINT control_executions_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES engine_v14.batch_runs(batch_id);


--
-- Name: control_executions control_executions_mapping_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.control_executions
    ADD CONSTRAINT control_executions_mapping_id_fkey FOREIGN KEY (mapping_id) REFERENCES engine_v14.dataset_mappings(mapping_id);


--
-- Name: dataset_columns dataset_columns_dataset_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.dataset_columns
    ADD CONSTRAINT dataset_columns_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES engine_v14.datasets(dataset_id);


--
-- Name: dataset_mappings dataset_mappings_project_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.dataset_mappings
    ADD CONSTRAINT dataset_mappings_project_id_fkey FOREIGN KEY (project_id) REFERENCES engine_v14.projects(project_id);


--
-- Name: dataset_mappings dataset_mappings_source_dataset_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.dataset_mappings
    ADD CONSTRAINT dataset_mappings_source_dataset_id_fkey FOREIGN KEY (source_dataset_id) REFERENCES engine_v14.datasets(dataset_id);


--
-- Name: dataset_mappings dataset_mappings_target_dataset_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.dataset_mappings
    ADD CONSTRAINT dataset_mappings_target_dataset_id_fkey FOREIGN KEY (target_dataset_id) REFERENCES engine_v14.datasets(dataset_id);


--
-- Name: datasets datasets_system_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.datasets
    ADD CONSTRAINT datasets_system_id_fkey FOREIGN KEY (system_id) REFERENCES engine_v14.systems(system_id);


--
-- Name: projects projects_tenant_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.projects
    ADD CONSTRAINT projects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES engine_v14.tenants(tenant_id);


--
-- Name: systems systems_tenant_id_fkey; Type: FK CONSTRAINT; Schema: engine_v14; Owner: postgres
--

ALTER TABLE ONLY engine_v14.systems
    ADD CONSTRAINT systems_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES engine_v14.tenants(tenant_id);


--
-- Name: projects; Type: ROW SECURITY; Schema: core; Owner: postgres
--

ALTER TABLE core.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: projects tenant_isolation_projects; Type: POLICY; Schema: core; Owner: postgres
--

CREATE POLICY tenant_isolation_projects ON core.projects USING ((tenant_id = (current_setting('app.tenant_id'::text))::uuid));


--
-- Name: projects_OLD; Type: ROW SECURITY; Schema: engine; Owner: postgres
--

ALTER TABLE engine."projects_OLD" ENABLE ROW LEVEL SECURITY;

--
-- Name: projects_OLD tenant_isolation; Type: POLICY; Schema: engine; Owner: postgres
--

CREATE POLICY tenant_isolation ON engine."projects_OLD" USING ((tenant_id = (current_setting('app.tenant_id'::text))::uuid));


--
-- Name: projects; Type: ROW SECURITY; Schema: engine_v14; Owner: postgres
--

ALTER TABLE engine_v14.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: projects tenant_isolation; Type: POLICY; Schema: engine_v14; Owner: postgres
--

CREATE POLICY tenant_isolation ON engine_v14.projects USING ((tenant_id = (current_setting('app.tenant_id'::text))::uuid));


--
-- PostgreSQL database dump complete
--

