CREATE SCHEMA IF NOT EXISTS engine;

CREATE TABLE  IF NOT EXISTS engine.migration_validation_batch (
    batch_id UUID PRIMARY KEY,
    execution_start TIMESTAMP,
    execution_end TIMESTAMP,
    overall_status VARCHAR(20),
    overall_score NUMERIC(5,2)
);

CREATE TABLE  IF NOT EXISTS engine.migration_control_execution (
    execution_id UUID DEFAULT gen_random_uuid(),
    batch_id UUID,
    control_id VARCHAR(10),
    rule_id VARCHAR(20),
    entity_name VARCHAR(100),
    status VARCHAR(10),
    execution_timestamp TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (execution_id)
);

CREATE TABLE  IF NOT EXISTS engine.migration_exception_register (
    exception_id UUID DEFAULT gen_random_uuid(),
    batch_id UUID,
    control_id VARCHAR(10),
    rule_id VARCHAR(20),
    entity_name VARCHAR(100),
    primary_key_value TEXT,
    source_value TEXT,
    target_value TEXT,
    variance_value NUMERIC,
    created_timestamp TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (exception_id)
);

CREATE TABLE  IF NOT EXISTS engine.control_registry (
    control_id VARCHAR(10) PRIMARY KEY,
    control_name TEXT,
    enabled_flag BOOLEAN DEFAULT TRUE
);

CREATE TABLE  IF NOT EXISTS engine.rule_parameter_metadata (
    rule_id VARCHAR(20),
    entity_name VARCHAR(100),
    source_schema TEXT,
    source_table TEXT,
    target_schema TEXT,
    target_table TEXT,
    primary_key_column TEXT,
    filter_condition TEXT,
    tolerance_value NUMERIC DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);
