-- Snowflake Certification — Baseline Schema
-- Reuses Phase 12 10-table design, adapted for Snowflake dialect
-- Databases: MAP_CERTIFICATION_SOURCE / MAP_CERTIFICATION_TARGET (same DDL)
-- Schema: CERT_SCHEMA   Warehouse: MAP_CERT_WH
-- Run with: USE WAREHOUSE MAP_CERT_WH; USE DATABASE <DB>; USE SCHEMA CERT_SCHEMA;

-- Ensure warehouse is running
-- ALTER WAREHOUSE MAP_CERT_WH RESUME IF SUSPENDED;

-- Table 1: customers (PK, text, row-count)
CREATE OR REPLACE TABLE customers (
    customer_id NUMBER AUTOINCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Table 2: accounts (FK, numeric balances)
CREATE OR REPLACE TABLE accounts (
    account_id NUMBER AUTOINCREMENT PRIMARY KEY,
    customer_id NUMBER REFERENCES customers(customer_id),
    account_type VARCHAR(50),
    balance NUMBER(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD'
);

-- Table 3: transactions (Numeric aggregation)
CREATE OR REPLACE TABLE transactions (
    transaction_id NUMBER AUTOINCREMENT PRIMARY KEY,
    account_id NUMBER REFERENCES accounts(account_id),
    transaction_date DATE,
    transaction_type VARCHAR(50),
    amount NUMBER(15,2)
);

-- Table 4: products (Reference data)
CREATE OR REPLACE TABLE products (
    product_id NUMBER AUTOINCREMENT PRIMARY KEY,
    product_code VARCHAR(20) UNIQUE,
    product_name VARCHAR(100),
    category VARCHAR(50),
    unit_price NUMBER(10,2)
);

-- Table 5: orders (Parent/child, totals)
CREATE OR REPLACE TABLE orders (
    order_id NUMBER AUTOINCREMENT PRIMARY KEY,
    customer_id NUMBER REFERENCES customers(customer_id),
    order_date DATE,
    order_status VARCHAR(20),
    order_total NUMBER(15,2)
);

-- Table 6: order_items (FK, calculations)
CREATE OR REPLACE TABLE order_items (
    order_item_id NUMBER AUTOINCREMENT PRIMARY KEY,
    order_id NUMBER REFERENCES orders(order_id),
    product_id NUMBER REFERENCES products(product_id),
    quantity NUMBER,
    line_total NUMBER(15,2)
);

-- Table 7: employee_records (Dates, nullable)
CREATE OR REPLACE TABLE employee_records (
    employee_id NUMBER AUTOINCREMENT PRIMARY KEY,
    employee_name VARCHAR(100),
    department VARCHAR(50),
    salary NUMBER(12,2),
    employment_status VARCHAR(20)
);

-- Table 8: branches (Geographic/reference)
CREATE OR REPLACE TABLE branches (
    branch_id NUMBER AUTOINCREMENT PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE,
    branch_name VARCHAR(100),
    region VARCHAR(50),
    active_flag BOOLEAN DEFAULT TRUE
);

-- Table 9: account_snapshots (Data drift)
CREATE OR REPLACE TABLE account_snapshots (
    snapshot_id NUMBER AUTOINCREMENT PRIMARY KEY,
    account_id NUMBER REFERENCES accounts(account_id),
    snapshot_date DATE,
    opening_balance NUMBER(15,2),
    closing_balance NUMBER(15,2)
);

-- Table 10: customer_risk (Boolean, nullable)
CREATE OR REPLACE TABLE customer_risk (
    risk_id NUMBER AUTOINCREMENT PRIMARY KEY,
    customer_id NUMBER REFERENCES customers(customer_id),
    risk_score NUMBER,
    risk_category VARCHAR(20),
    review_required BOOLEAN DEFAULT FALSE
);
