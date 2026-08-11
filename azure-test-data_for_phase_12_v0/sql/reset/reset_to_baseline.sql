-- Phase 12: Azure Test Data — Reset to Baseline
-- Drops all tables and recreates baseline data

DROP TABLE IF EXISTS customer_risk CASCADE;
DROP TABLE IF EXISTS account_snapshots CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS employee_records CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Then run:
-- 01_create_tables.sql
-- 02_insert_data.sql
