--Step 1 — Create Governance Tables
--These extend your existing engine schema.

--Create file:

--installer/install_governance_tables.sql
--Table 1 — Migration Decisions



CREATE TABLE engine.migration_control_decisions (

    decision_id SERIAL PRIMARY KEY,

    tenant_id VARCHAR(100),

    batch_id VARCHAR(100),

    control_id VARCHAR(50),

    entity_name VARCHAR(255),

    decision VARCHAR(20),

    decision_reason TEXT,

    decided_by VARCHAR(100),

    decision_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Table 2 — Risk Scores
CREATE TABLE engine.migration_risk_scores (

    risk_id SERIAL PRIMARY KEY,

    tenant_id VARCHAR(100),

    batch_id VARCHAR(100),

    risk_score INTEGER,

    risk_level VARCHAR(20),

    calculated_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Table 3 — Tenants (multi-client support)
CREATE TABLE engine.tenants (

    tenant_id VARCHAR(100) PRIMARY KEY,

    tenant_name VARCHAR(255),

    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Example:

bank_a
bank_b
insurance_client