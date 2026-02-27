--🏗 STEP 1 — FINAL METADATA TABLE DESIGNS



--1️⃣ CONTROL REGISTRY
CREATE TABLE IF NOT EXISTS engine.control_registry (
    control_id VARCHAR(10) PRIMARY KEY,
    control_name TEXT NOT NULL,
    description TEXT,
    severity_level VARCHAR(20),
    enabled_flag BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

--2️⃣ RULE REGISTRY



CREATE TABLE IF NOT EXISTS engine.rule_registry (
    rule_id VARCHAR(50) PRIMARY KEY,
    control_id VARCHAR(10) REFERENCES engine.control_registry(control_id),
    rule_name TEXT NOT NULL,
    sql_template_file TEXT NOT NULL,
    severity_level VARCHAR(20),
    enabled_flag BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);


--This table links:

--Control → Rules → SQL template file

--3️⃣ RULE PARAMETER METADATA

--This is entity mapping.

CREATE TABLE IF NOT EXISTS engine.rule_parameter_metadata (
    id SERIAL PRIMARY KEY,
    rule_id VARCHAR(50) REFERENCES engine.rule_registry(rule_id),
    entity_name VARCHAR(100),
    source_schema VARCHAR(100),
    source_table VARCHAR(100),
    target_schema VARCHAR(100),
    target_table VARCHAR(100),
    primary_key_column VARCHAR(100),
    filter_condition TEXT,
    tolerance_value NUMERIC DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

--🧱 STEP 2 — INSERT CORE CONTROLS (C01–C03)
INSERT INTO engine.control_registry
(control_id, control_name, description, severity_level)
VALUES
('C01', 'Source-to-Target Record Completeness',
 'Validates row count equality between source and target',
 'HIGH'),

('C02', 'Financial Value Integrity & Reconciliation',
 'Validates financial aggregates between systems',
 'CRITICAL'),

('C03', 'Referential Integrity & Relationship Preservation',
 'Validates foreign key and relationship continuity',
 'HIGH');

--🧠 STEP 3 — INSERT RULES
--C01 Rule
INSERT INTO engine.rule_registry
(rule_id, control_id, rule_name, sql_template_file, severity_level)
VALUES
('C01_ROWCOUNT', 'C01',
 'Row Count Match Validation',
 'C01_row_count.sql',
 'HIGH');

--C02 Rule
INSERT INTO engine.rule_registry
(rule_id, control_id, rule_name, sql_template_file, severity_level)
VALUES
('C02_BALANCE_RECON', 'C02',
 'Financial Aggregate Reconciliation',
 'C02_financial_reconciliation.sql',
 'CRITICAL');

--C03 Rule
INSERT INTO engine.rule_registry
(rule_id, control_id, rule_name, sql_template_file, severity_level)
VALUES
('C03_REFERENTIAL', 'C03',
 'Foreign Key Relationship Preservation',
 'C03_referential_integrity.sql',
 'HIGH');

--🧩 STEP 4 — INSERT ENTITY PARAMETERS

--Now we bind rules to actual tables.

--Example for demo:

--C01 → accounts table
INSERT INTO engine.rule_parameter_metadata
(rule_id, entity_name,
 source_schema, source_table,
 target_schema, target_table,
 primary_key_column)
VALUES
('C01_ROWCOUNT',
 'accounts',
 'public', 'accounts_source',
 'public', 'accounts_target',
 'account_id');

--C02 → balances table
INSERT INTO engine.rule_parameter_metadata
(rule_id, entity_name,
 source_schema, source_table,
 target_schema, target_table,
 primary_key_column,
 tolerance_value)
VALUES
('C02_BALANCE_RECON',
 'balances',
 'public', 'balances_source',
 'public', 'balances_target',
 'account_id',
 0);

--C03 → customer-account relationship
INSERT INTO engine.rule_parameter_metadata
(rule_id, entity_name,
 source_schema, source_table,
 target_schema, target_table,
 primary_key_column)
VALUES
('C03_REFERENTIAL',
 'customer_accounts',
 'public', 'customer_accounts_source',
 'public', 'customer_accounts_target',
 'account_id');

 --v1.1 — Added filter_condition for C02 to exclude zero balances
 CREATE TABLE IF NOT EXISTS engine.migration_control_summary (
    id SERIAL PRIMARY KEY,
    batch_id UUID NOT NULL,
    control_id VARCHAR(20),
    overall_status VARCHAR(20),
    total_rules INTEGER,
    passed_rules INTEGER,
    failed_rules INTEGER,
    error_rules INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);