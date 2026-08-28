-- Snowflake Certification — Reset to Baseline
-- Truncates and reseeds both SOURCE and TARGET to exact match
-- Run with ACCOUNTADMIN or MAP_CERT_ROLE

-- For each DB, run 01_create_tables.sql (CREATE OR REPLACE) then 02_seed_data.sql
-- Or use TRUNCATE + re-insert:

USE WAREHOUSE MAP_CERT_WH;

-- SOURCE
USE DATABASE MAP_CERTIFICATION_SOURCE;
USE SCHEMA CERT_SCHEMA;
TRUNCATE TABLE customer_risk;
TRUNCATE TABLE account_snapshots;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE transactions;
TRUNCATE TABLE accounts;
TRUNCATE TABLE branches;
TRUNCATE TABLE employee_records;
TRUNCATE TABLE products;
TRUNCATE TABLE customers;
-- Re-run 02_seed_data.sql here

-- TARGET
USE DATABASE MAP_CERTIFICATION_TARGET;
USE SCHEMA CERT_SCHEMA;
TRUNCATE TABLE customer_risk;
TRUNCATE TABLE account_snapshots;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE transactions;
TRUNCATE TABLE accounts;
TRUNCATE TABLE branches;
TRUNCATE TABLE employee_records;
TRUNCATE TABLE products;
TRUNCATE TABLE customers;
-- Re-run 02_seed_data.sql here
